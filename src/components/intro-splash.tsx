"use client";

import { useEffect, useRef, useState } from "react";

const INTRO_SESSION_KEY = "rystar_intro_seen_v1";

export function IntroSplash() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [showIntro, setShowIntro] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  function closeIntro() {
    setIsLeaving(true);
    window.sessionStorage.setItem(INTRO_SESSION_KEY, "true");

    window.setTimeout(() => {
      setShowIntro(false);
      document.body.style.overflow = "";
    }, 700);
  }

  useEffect(() => {
    const alreadySeen = window.sessionStorage.getItem(INTRO_SESSION_KEY);

    if (alreadySeen) {
      return;
    }

    setShowIntro(true);
    document.body.style.overflow = "hidden";

    const fallbackTimer = window.setTimeout(() => {
      closeIntro();
    }, 6500);

    return () => {
      window.clearTimeout(fallbackTimer);
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (!showIntro) return;

    const video = videoRef.current;

    if (!video) return;

    video.play().catch(() => {
      window.setTimeout(() => {
        closeIntro();
      }, 1200);
    });
  }, [showIntro]);

  if (!showIntro) return null;

  return (
    <div
      className={[
        "fixed inset-0 z-[9999] flex items-center justify-center bg-black transition-opacity duration-700",
        isLeaving ? "pointer-events-none opacity-0" : "opacity-100",
      ].join(" ")}
    >
      <video
        ref={videoRef}
        src="/intro/rystar-intro.MP4"
        muted
        playsInline
        autoPlay
        preload="auto"
        onEnded={closeIntro}
        className="h-full w-full object-cover"
      />

      <button
        type="button"
        onClick={closeIntro}
        className="absolute bottom-6 right-6 border border-white/20 bg-black/60 px-5 py-3 text-xs font-black uppercase tracking-[0.25em] text-white backdrop-blur transition hover:bg-white hover:text-black"
      >
        Skip
      </button>
    </div>
  );
}