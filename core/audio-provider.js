function lineText(line) {
  return line?.text || (line?.tokens || []).map((token) => token.char).join("");
}

export function createSpeechSynthesisProvider({ synth = globalThis.speechSynthesis, Utterance = globalThis.SpeechSynthesisUtterance } = {}) {
  let playbackId = 0;
  return {
    id: "browser-speech-synthesis",
    isAvailable: () => Boolean(synth && Utterance),
    stop() {
      playbackId += 1;
      try { synth?.cancel(); } catch { /* no-op */ }
    },
    async playLines(lines, { onLineStart, onLineEnd, rate = 0.72 } = {}) {
      if (!synth || !Utterance) throw new Error("speech-unavailable");
      const currentPlaybackId = ++playbackId;
      synth.cancel();
      for (const [index, line] of lines.entries()) {
        if (currentPlaybackId !== playbackId) break;
        onLineStart?.(index);
        await new Promise((resolve, reject) => {
          const utterance = new Utterance(lineText(line));
          utterance.lang = "zh-CN";
          utterance.rate = rate;
          utterance.pitch = 1;
          utterance.onend = resolve;
          utterance.onerror = () => reject(new Error("speech-failed"));
          synth.speak(utterance);
        });
        if (currentPlaybackId !== playbackId) break;
        onLineEnd?.(index);
      }
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
    async playLines(_lines, { onUnavailable } = {}) {
      onUnavailable?.("这台设备暂时不能朗读。诗句仍可以完整阅读，你也可以逐句点读。 ");
      return { unavailable: true };
    },
    async playLine(_line, { onUnavailable } = {}) {
      onUnavailable?.("朗读暂不可用，先用眼睛跟着拼音慢慢读。 ");
      return { unavailable: true };
    },
  };
}

export function createAudioEngine({ primary = createSpeechSynthesisProvider(), fallback = createSilentAudioProvider() } = {}) {
  return {
    get providerId() { return primary.isAvailable() ? primary.id : fallback.id; },
    isAvailable: () => primary.isAvailable(),
    stop() { primary.stop(); fallback.stop(); },
    playLines(lines, options) {
      return (primary.isAvailable() ? primary : fallback).playLines(lines, options);
    },
    playLine(line, options) {
      return (primary.isAvailable() ? primary : fallback).playLine(line, options);
    },
  };
}

export default createAudioEngine;
