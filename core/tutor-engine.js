const OFF_TOPIC = /^(不知道|不懂|不会|没想法|随便|你好|hello|hi|哈哈|测试)$/iu;

export class TutorUnavailableError extends Error {
  constructor(message = "Tutor provider unavailable") {
    super(message);
    this.name = "TutorUnavailableError";
  }
}

function normalize(text) {
  return String(text || "").trim().replace(/\s+/gu, " ").slice(0, 160);
}

function sanitizeRemoteResult(value) {
  if (!value || typeof value !== "object") throw new TutorUnavailableError("Tutor response is not an object");
  const message = String(value.message || "").replace(/<[^>]*>/gu, "").trim().slice(0, 420);
  if (!message) throw new TutorUnavailableError("Tutor response has no message");
  return {
    kind: ["empty", "unsure", "grounded", "partial", "open"].includes(value.kind) ? value.kind : "grounded",
    message,
    microHint: value.microHint ? String(value.microHint).replace(/<[^>]*>/gu, "").trim().slice(0, 180) : "",
    revealAnswer: false,
  };
}

function includesAny(text, terms = []) {
  return terms.some((term) => term && text.includes(term));
}

export function createDeterministicTutor() {
  return {
    id: "grounded-local-tutor",
    async respond({ input, lesson, ageMode, turn = 1 }) {
      const answer = normalize(input);
      const prompts = lesson?.tutor || {};
      if (!answer) {
        return {
          kind: "empty",
          message: ageMode === "7-8" ? "先不用写完整句。选一个你看见的词，也可以。" : "先从诗里圈一个能支持你想法的词。",
          revealAnswer: false,
        };
      }
      if (OFF_TOPIC.test(answer)) {
        return {
          kind: "unsure",
          message: prompts.unsure || "不知道也没关系。先回到诗里，看一看最有画面的那个词。",
          microHint: prompts.hints?.[Math.min(turn - 1, (prompts.hints?.length || 1) - 1)] || lesson?.cue,
          revealAnswer: false,
        };
      }
      const evidence = prompts.evidenceWords || lesson?.keywords || [];
      const grounded = includesAny(answer, evidence);
      if (grounded) {
        return {
          kind: "grounded",
          message: prompts.grounded || `你抓住了“${evidence.find((term) => answer.includes(term)) || evidence[0]}”。再想想：这个词让诗里的画面怎么变了？是远近、方向、时间，还是景物的样子在变？`,
          revealAnswer: false,
        };
      }
      if (turn >= 2) {
        return {
          kind: "partial",
          message: prompts.partial || "这个想法有自己的眼睛。现在回到诗句里，找一个词来给它作证。",
          microHint: prompts.hints?.[Math.min(turn - 1, (prompts.hints?.length || 1) - 1)] || lesson?.cue,
          revealAnswer: false,
        };
      }
      return {
        kind: "open",
        message: prompts.open || "我先不告诉你答案。诗里哪个词，让你有这个感觉？",
        revealAnswer: false,
      };
    },
  };
}

export function createRemoteTutor({ endpoint = "", fetchImpl = globalThis.fetch } = {}) {
  return {
    id: "remote-grounded-tutor",
    async respond(context) {
      if (!endpoint || typeof fetchImpl !== "function") throw new TutorUnavailableError();
      const response = await fetchImpl(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          poemId: context.lesson?.id,
          ageMode: context.ageMode,
          turn: context.turn,
          input: normalize(context.input),
        }),
      });
      if (!response.ok) throw new TutorUnavailableError(`Tutor HTTP ${response.status}`);
      return sanitizeRemoteResult(await response.json());
    },
  };
}

export function createTutorEngine({ primary, fallback = createDeterministicTutor() } = {}) {
  return {
    async respond(context) {
      if (primary) {
        try {
          const result = await primary.respond(context);
          return { ...result, provider: primary.id, degraded: false };
        } catch {
          // The child gets a complete, honest local learning path even when AI is unavailable.
        }
      }
      const result = await fallback.respond(context);
      return { ...result, provider: fallback.id, degraded: Boolean(primary) };
    },
  };
}

export default createTutorEngine;
