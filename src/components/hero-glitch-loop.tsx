"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const slides = ["drop", "logo", "rystar"] as const;

type Slide = (typeof slides)[number];

export function HeroGlitchLoop() {
  const [currentSlide, setCurrentSlide] = useState<Slide>("drop");
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setIsGlitching(true);

      window.setTimeout(() => {
        setCurrentSlide((current) => {
          const currentIndex = slides.indexOf(current);
          const nextIndex = (currentIndex + 1) % slides.length;

          return slides[nextIndex];
        });
      }, 220);

      window.setTimeout(() => {
        setIsGlitching(false);
      }, 520);
    }, 2600);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  return (
    <div className="mt-12 border border-white/20 p-4 md:p-6">
      <div className="rystar-tv relative flex min-h-[280px] items-center justify-center overflow-hidden border border-white/20 bg-black md:min-h-[360px]">
        <div className="rystar-tv-noise" />
        <div className="rystar-tv-lines" />

        <div
          className={[
            "relative z-10 flex min-h-[240px] w-full items-center justify-center text-center md:min-h-[320px]",
            isGlitching ? "rystar-glitch-hit" : "",
          ].join(" ")}
        >
          {currentSlide === "drop" && (
            <div className="rystar-slide-in">
              <p className="rystar-glitch-text text-5xl font-black uppercase tracking-[0.08em] text-white md:text-7xl">
                DROP001
              </p>

              <p className="rystar-glitch-text mt-1 text-5xl font-black uppercase tracking-[0.08em] text-neutral-500 md:text-7xl">
                SS26
              </p>
            </div>
          )}

          {currentSlide === "logo" && (
            <div className="rystar-slide-in flex items-center justify-center">
              <Image
                src="/logo/rystar-logo.gif"
                alt="Rystar Studios"
                width={180}
                height={180}
                priority
                unoptimized
                className="h-36 w-36 object-contain md:h-48 md:w-48"
              />
            </div>
          )}

          {currentSlide === "rystar" && (
            <div className="rystar-slide-in">
              <p className="rystar-glitch-text text-6xl font-black uppercase leading-none tracking-tight text-white md:text-8xl">
                Rystar
              </p>

              <p className="mt-3 text-xs font-black uppercase tracking-[0.45em] text-neutral-600 md:text-sm">
                Studios
              </p>
            </div>
          )}
        </div>

        <div className="pointer-events-none absolute inset-0 border border-white/10" />
      </div>
    </div>
  );
}