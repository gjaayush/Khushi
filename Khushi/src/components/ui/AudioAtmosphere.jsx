import { useEffect, useRef } from "react";

export default function AudioAtmosphere({ isMuted }) {
  const audioCtxRef = useRef(null);
  const gainNodeRef = useRef(null);
  const oscRef = useRef([]);

  useEffect(() => {
    // When user un-mutes, initialize subtle atmospheric synthesis
    if (!isMuted) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;

        if (!audioCtxRef.current) {
          const ctx = new AudioContext();
          audioCtxRef.current = ctx;

          const masterGain = ctx.createGain();
          masterGain.gain.setValueAtTime(0, ctx.currentTime);
          masterGain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 3); // Very quiet, soothing background ambient
          masterGain.connect(ctx.destination);
          gainNodeRef.current = masterGain;

          // Gentle warm drone chord (Root, fifth, octave - A major ambient)
          const freqs = [110, 164.81, 220, 329.63];
          const oscs = freqs.map((freq, idx) => {
            const osc = ctx.createOscillator();
            const oscGain = ctx.createGain();

            osc.type = idx % 2 === 0 ? "sine" : "triangle";
            osc.frequency.setValueAtTime(freq, ctx.currentTime);

            // Subtle lowpass filter for warmth
            const filter = ctx.createBiquadFilter();
            filter.type = "lowpass";
            filter.frequency.setValueAtTime(450, ctx.currentTime);

            oscGain.gain.setValueAtTime(0.25, ctx.currentTime);

            osc.connect(filter);
            filter.connect(oscGain);
            oscGain.connect(masterGain);

            osc.start();
            return osc;
          });

          oscRef.current = oscs;
        } else if (audioCtxRef.current.state === "suspended") {
          audioCtxRef.current.resume();
          if (gainNodeRef.current) {
            gainNodeRef.current.gain.linearRampToValueAtTime(0.04, audioCtxRef.current.currentTime + 1.5);
          }
        }
      } catch (err) {
        console.warn("AudioContext note:", err);
      }
    } else {
      if (gainNodeRef.current && audioCtxRef.current) {
        gainNodeRef.current.gain.linearRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + 1);
      }
    }
  }, [isMuted]);

  return null;
}
