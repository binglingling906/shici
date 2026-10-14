import assert from "node:assert/strict";
import { createRemoteTutor, createTutorEngine } from "../core/tutor-engine.js";

const lesson = { id: "demo-poem", tutor: { evidenceWords: ["月光"] } };
let request;
const remote = createRemoteTutor({
  endpoint: "https://proxy.example.test/tutor",
  fetchImpl: async (url, options) => {
    request = { url, options };
    return { ok: true, async json() { return { kind: "grounded", message: "<b>回到月光这个词看看。</b>", revealAnswer: true }; } };
  },
});
const result = await createTutorEngine({ primary: remote }).respond({ input: "月光让我想家", lesson, ageMode: "7-8", turn: 1 });
assert.equal(result.provider, "remote-grounded-tutor");
assert.equal(result.revealAnswer, false);
assert.equal(result.message, "回到月光这个词看看。");
assert.equal(JSON.parse(request.options.body).input, "月光让我想家");
assert.equal(Object.prototype.hasOwnProperty.call(JSON.parse(request.options.body), "apiKey"), false);

const failing = createTutorEngine({
  primary: createRemoteTutor({ endpoint: "https://proxy.example.test/tutor", fetchImpl: async () => ({ ok: false, status: 503 }) }),
});
const fallback = await failing.respond({ input: "不知道", lesson, ageMode: "7-8", turn: 1 });
assert.equal(fallback.provider, "grounded-local-tutor");
assert.equal(fallback.degraded, true);
console.log("Tutor provider check passed: constrained remote contract, no browser secret, local fallback.");
