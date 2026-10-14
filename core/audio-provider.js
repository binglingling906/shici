function lineText(line) {
  return line?.text || (line?.tokens || []).map((token) => token.char).join("");
}

export function createSpeechSynthesisProvider({ synth = globalThis.speechSynthesis, Utterance = globalThis.SpeechSynthesisUtterance } = {}) {
  let playbackId = 0;
  let paused = false;
  let pending = null;

  const supportsPause = () => Boolean(synth && typeof synth.pause === "function" && typeof synth.resume === "function");

  function resolvePending(result = { cancelled: true }) {
    const current = pending;
    pending = null;
    current?.resolve(result);
  }

  function cancelSpeech() {
    try { synth?.cancel(); } catch { /* no-op */ }
  }

  return {
    id: "browser-speech-synthesis",
    isAvailable: () => Boolean(synth && Utterance),
    stop() {
      playbackId += 1;
      paused = false;
      resolvePending();
      cancelSpeech();
    },
    canPause() {
      return supportsPause();
    },
    isPaused() {
      return paused;
    },
    pause() {
      if (!supportsPause()) return false;
      try {
        synth.pause();
        paused = true;
        return true;
      } catch {
        return false;
      }
    },
    resume() {
      if (!supportsPause() || !paused) return false;
      try {
        synth.resume();
        paused = false;
        return true;
      } catch {
        return false;
      }
    },
    async playLines(lines, { onLineStart, onLineEnd, rate = 0.72, pauseBetweenMs = 260 } = {}) {
      if (!synth || !Utterance) throw new Error("speech-unavailable");
      const currentPlaybackId = ++playbackId;
      paused = false;
      resolvePending();
      cancelSpeech();
      for (const [index, line] of lines.entries()) {
        if (currentPlaybackId !== playbackId) return { cancelled: true };
        const result = await new Promise((resolve, reject) => {
          const utterance = new Utterance(lineText(line));
          utterance.lang = "zh-CN";
          utterance.rate = rate;
          utterance.pitch = 1;
          let settled = false;
          const settle = (value, error = false) => {
            if (settled) return;
            settled = true;
            if (pending?.playbackId === currentPlaybackId) pending = null;
            if (error) reject(value);
            else resolve(value);
          };
          pending = { playbackId: currentPlaybackId, resolve: (value) => settle(value) };
          utterance.onstart = () => {
            if (currentPlaybackId === playbackId) onLineStart?.(index);
          };
          utterance.onend = () => settle({ ended: true });
          utterance.onerror = () => settle(new Error("speech-failed"), true);
          try {
            synth.speak(utterance);
          } catch (error) {
            settle(error instanceof Error ? error : new Error("speech-failed"), true);
          }
        });
        if (currentPlaybackId !== playbackId || result?.cancelled) return { cancelled: true };
        onLineEnd?.(index);
        if (index < lines.length - 1 && pauseBetweenMs > 0) {
          await new Promise((resolve) => setTimeout(resolve, pauseBetweenMs));
          if (currentPlaybackId !== playbackId) return { cancelled: true };
        }
      }
      return { completed: true };
    },
    async playLine(line, options = {}) {
      return this.playLines([line], options);
    },
  };
}

export function createSilentAudioProvider() {
  return {
    id: "silent-readable-fallback",
    isAvailable: () => false,
    stop() {},
    canPause: () => false,
    isPaused: () => false,
    pause: () => false,
    resume: () => false,
    async playLines(_lines, { onUnavailable } = {}) {
      onUnavailable?.("这台设备暂时不能朗读。诗句仍可以完整阅读，也可以和家人一起逐句读。 ");
      return { unavailable: true };
    },
    async playLine(_line, { onUnavailable } = {}) {
      onUnavailable?.("朗读暂不可用，先用眼睛跟着拼音慢慢读。 ");
      return { unavailable: true };
    },
  };
}

export function createAudioEngine({ primary = createSpeechSynthesisProvider(), fallback = createSilentAudioProvider() } = {}) {
  const activeProvider = () => (primary.isAvailable() ? primary : fallback);
  return {
    get providerId() { return primary.isAvailable() ? primary.id : fallback.id; },
    isAvailable: () => primary.isAvailable(),
    stop() { primary.stop(); fallback.stop(); },
    canPause: () => activeProvider().canPause?.() === true,
    isPaused: () => activeProvider().isPaused?.() === true,
    pause: () => activeProvider().pause?.() === true,
    resume: () => activeProvider().resume?.() === true,
    playLines(lines, options) {
      return activeProvider().playLines(lines, options);
    },
    playLine(line, options) {
      return activeProvider().playLine(line, options);
    },
  };
}

export default createAudioEngine;
