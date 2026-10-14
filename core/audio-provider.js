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

export function createLocalReadingAudioProvider({
  AudioCtor = globalThis.Audio,
  basePath = "./assets/audio/readings",
} = {}) {
  let current = null;
  let playbackId = 0;
  const available = Boolean(AudioCtor);
  const stop = () => {
    playbackId += 1;
    if (current) {
      try { current.pause(); } catch { /* no-op */ }
      current = null;
    }
  };
  const playOne = (line, index, token, onLineStart, onLineEnd) => new Promise((resolve, reject) => {
    const poemId = line.poemId || String(line.id || "").replace(/-line-\d+$/u, "");
    const src = `${basePath}/${encodeURIComponent(poemId)}/line-${index + 1}.mp3`;
    const audio = new AudioCtor(src);
    current = audio;
    audio.preload = "auto";
    audio.onplay = () => { if (token === playbackId) onLineStart?.(index); };
    audio.onended = () => { if (token === playbackId) { onLineEnd?.(index); resolve({ ended: true }); } else resolve({ cancelled: true }); };
    audio.onerror = () => reject(new Error("local-reading-audio-missing"));
    audio.play().catch(reject);
  });
  return {
    id: "local-reading-audio",
    isAvailable: () => available,
    stop,
    canPause: () => Boolean(current),
    isPaused: () => Boolean(current?.paused),
    pause: () => { if (!current) return false; current.pause(); return true; },
    resume: () => { if (!current) return false; current.play().catch(() => {}); return true; },
    async playLines(lines, { onLineStart, onLineEnd, pauseBetweenMs = 160 } = {}) {
      const token = ++playbackId;
      for (const [index, line] of lines.entries()) {
        if (token !== playbackId) return { cancelled: true };
        await playOne(line, index, token, onLineStart, onLineEnd);
        if (pauseBetweenMs && index < lines.length - 1) await new Promise((resolve) => setTimeout(resolve, pauseBetweenMs));
      }
      return { completed: true };
    },
    playLine(line, options = {}) { return this.playLines([line], options); },
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
    async playLines(lines, options) {
      try { return await activeProvider().playLines(lines, options); }
      catch (error) {
        if (activeProvider() === primary && fallback.isAvailable?.()) return fallback.playLines(lines, options);
        throw error;
      }
    },
    async playLine(line, options) {
      try { return await activeProvider().playLine(line, options); }
      catch (error) {
        if (activeProvider() === primary && fallback.isAvailable?.()) return fallback.playLine(line, options);
        throw error;
      }
    },
  };
}

export default createAudioEngine;
