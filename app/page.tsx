"use client";

import { useState, useRef, useCallback, useEffect, memo } from "react";
import dynamic from "next/dynamic";
import ScrollReveal from "./scroll-reveal";

const CustomCursor = dynamic(() => import("./custom-cursor"), { ssr: false });

// ── Magnetic Button ──
function MagneticButton({
  children,
  className,
  href,
  onClick,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
} & Record<string, unknown>) {
  const ref = useRef<HTMLElement>(null);
  const [transform, setTransform] = useState("");

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTransform(`translate(${x * 0.3}px, ${y * 0.3}px)`);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTransform("translate(0px, 0px)");
  }, []);

  const style = {
    transform,
    transition: "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
  };

  if (href) {
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        className={className}
        style={style}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type="button"
      className={className}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}

// ── Loading Screen ──
function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), 100);
    const t2 = setTimeout(() => setPhase("exit"), 1800);
    const t3 = setTimeout(onComplete, 2500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[10000] flex items-center justify-center bg-[#0a0a0a] transition-opacity duration-700 ${
        phase === "exit" ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="relative flex items-center gap-[2px]">
        {"nem".split("").map((letter, i) => (
          <span
            key={i}
            className="loader-letter text-6xl font-bold tracking-[-0.06em] text-white sm:text-8xl"
            style={{
              fontFamily: "var(--font-display), sans-serif",
              animationDelay: `${200 + i * 150}ms`,
            }}
          >
            {letter}
          </span>
        ))}
        <div
          className="loader-line absolute -bottom-3 left-0 h-[2px] bg-white/80"
          style={{ animationDelay: "700ms" }}
        />
      </div>
    </div>
  );
}

// ── Staggered Hero Title ──
function StaggeredTitle({ visible }: { visible: boolean }) {
  const letters = "nem".split("");
  return (
    <h1
      className="mb-2 text-7xl font-bold tracking-[-0.06em] text-white sm:text-8xl"
      style={{ fontFamily: "var(--font-display), sans-serif" }}
    >
      {letters.map((letter, i) => (
        <span
          key={i}
          className="stagger-letter inline-block"
          style={{
            animationDelay: visible ? `${600 + i * 120}ms` : "0ms",
            animationPlayState: visible ? "running" : "paused",
          }}
        >
          {letter}
        </span>
      ))}
    </h1>
  );
}

// ── Video Card with 3D Tilt ──
const projects = [
  { id: "kCg8ZFXfDkE", title: "Edit #1" },
  { id: "fQ7S6kTW-WQ", title: "Edit #2" },
  { id: "W7hyllNaac8", title: "Edit #3" },
];

const VideoCard = memo(function VideoCard({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  const [state, setState] = useState<"idle" | "preview" | "playing">("idle");
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const tiltRaf = useRef(0);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    cancelAnimationFrame(tiltRaf.current);
    tiltRaf.current = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotateX = (0.5 - y) * 12;
      const rotateY = (x - 0.5) * 12;
      el.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`;
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    cancelAnimationFrame(tiltRaf.current);
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = "perspective(600px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    if (state === "preview") setState("idle");
  }, [state]);

  const handleMouseEnter = useCallback(() => {
    if (state === "playing") return;
    hoverTimeout.current = setTimeout(() => setState("preview"), 400);
  }, [state]);

  const handleClick = useCallback(() => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setState("playing");
  }, []);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(tiltRaf.current);
      if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg shadow-black/20"
      style={{
        transition: "transform 0.2s ease-out, border-color 0.5s, box-shadow 0.5s",
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      {/* Inner content with slight Z-offset for depth */}
      <div style={{ transform: "translateZ(20px)", transformStyle: "preserve-3d" }}>
        <div className="relative aspect-[9/16] w-full overflow-hidden">
          {state === "playing" ? (
            <iframe
              src={`https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&autoplay=1`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="absolute inset-0 h-full w-full border-0"
            />
          ) : state === "preview" ? (
            <>
              <iframe
                src={`https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&autoplay=1&mute=1&controls=0&showinfo=0`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                loading="lazy"
                className="absolute inset-0 h-full w-full border-0"
              />
              <button
                type="button"
                onClick={handleClick}
                className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center bg-transparent"
                aria-label={`Play ${title} with sound`}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-transform duration-300 hover:scale-110">
                  <svg
                    className="h-7 w-7 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </button>
            </>
          ) : (
            <button
              type="button"
              className="absolute inset-0 h-full w-full cursor-pointer border-0 bg-black"
              onClick={handleClick}
              aria-label={`Play ${title}`}
            >
              <img
                src={`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`}
                alt=""
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-all duration-300 group-hover:bg-black/10">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                  <svg
                    className="h-7 w-7 text-white/90"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </button>
          )}
        </div>
        <p className="px-4 py-3 text-center text-sm font-medium text-white/70">
          {title}
        </p>
      </div>
    </div>
  );
});

// ── Discord Button ──
function DiscordButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("r3vryn");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <MagneticButton
      onClick={handleCopy}
      className="group flex h-12 items-center justify-center gap-3 rounded-full border border-white/10 bg-white/5 px-6 font-medium text-white backdrop-blur-sm transition-colors duration-300 hover:border-indigo-500/30 hover:bg-indigo-500/10 cursor-pointer"
    >
      <svg
        className="h-5 w-5 text-white/60 transition-colors group-hover:text-indigo-400"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
      <span className="text-sm">{copied ? "Copied!" : "r3vryn"}</span>
    </MagneticButton>
  );
}

// ── Main Page ──
export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [siteVisible, setSiteVisible] = useState(false);
  const handleLoadComplete = useCallback(() => {
    setLoaded(true);
    setTimeout(() => setSiteVisible(true), 100);
  }, []);

  return (
    <>
      {!loaded && <LoadingScreen onComplete={handleLoadComplete} />}
      <CustomCursor />

      <div
        className={`w-full transition-opacity duration-700 ${
          siteVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* ── Hero Section ── */}
        <section className="section-snap relative min-h-[100svh] w-full overflow-hidden">
          {/* Background video */}
          <div className="absolute inset-0 z-0">
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className="h-full w-full object-cover blur-sm"
            >
              <source src="/video.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/70" />
          </div>

          {/* Content */}
          <div className="relative z-10 flex min-h-[100svh] items-center justify-center px-4 py-16">
            <div
              className={`w-full max-w-xl rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl sm:p-10 transition-all duration-1000 ${
                siteVisible
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 translate-y-8 scale-[0.97]"
              }`}
              style={{
                boxShadow: "0 0 30px rgba(255,255,255,0.05)",
              }}
            >
              <StaggeredTitle visible={siteVisible} />

              <p
                className={`mb-6 text-lg font-medium text-white/75 transition-all duration-700 ${
                  siteVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: "1000ms" }}
              >
                Freelance Short Video Editor
              </p>

              <p
                className={`mb-8 leading-relaxed text-white/90 transition-all duration-700 ${
                  siteVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: "1200ms" }}
              >
                I&apos;m a self-taught video editor with short length video
                editing experience. I focus on clean transitions, effects which
                suit the edit, engaging subtitles, sound effects, and high
                quality upscaled edits to maximize audience retention.
              </p>

              <div
                className={`flex flex-col gap-4 sm:flex-row transition-all duration-700 ${
                  siteVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: "1400ms" }}
              >
                <MagneticButton
                  href="https://www.youtube.com/@nowherenem"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-12 items-center justify-center gap-3 rounded-full bg-red-600 px-6 font-medium text-white transition-colors duration-300 hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/25"
                >
                  <svg
                    className="h-5 w-5 transition-transform duration-300 group-hover:scale-110"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                  YouTube
                </MagneticButton>
                <MagneticButton
                  href="https://www.instagram.com/nowherenem"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-12 items-center justify-center gap-3 rounded-full border border-white/20 px-6 font-medium text-white transition-colors duration-300 hover:border-pink-500/50 hover:bg-pink-500/10 hover:shadow-lg hover:shadow-pink-500/20"
                >
                  <svg
                    className="h-5 w-5 transition-transform duration-300 group-hover:scale-110"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                  </svg>
                  Instagram
                </MagneticButton>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <a
            href="#projects"
            aria-label="Scroll to projects"
            className={`absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce transition-opacity duration-700 ${
              siteVisible ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDelay: "1800ms" }}
          >
            <svg
              className="h-6 w-6 text-white/40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </a>
        </section>

        {/* ── Projects Section ── */}
        <section
          id="projects"
          className="section-snap relative w-full overflow-hidden py-24 section-gradient-projects"
          style={{ contentVisibility: "auto", containIntrinsicSize: "0 800px" }}
        >
          {/* Subtle gradient accents */}
          <div className="pointer-events-none absolute top-0 left-1/4 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-white/[0.02] blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-1/4 h-[400px] w-[400px] translate-x-1/2 rounded-full bg-white/[0.015] blur-3xl" />

          <div className="relative">
            <ScrollReveal>
              <h2
                className="mb-4 text-center text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl"
                style={{ fontFamily: "var(--font-display), sans-serif" }}
              >
                Projects
              </h2>
              <p className="mx-auto mb-12 max-w-md text-center text-white/70">
                Some of my recent edits — clean cuts, on-beat transitions,
                cinematic feel.
              </p>
            </ScrollReveal>

            <div className="mx-auto max-w-5xl grid grid-cols-1 gap-8 px-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, i) => (
                <ScrollReveal key={project.id} delay={i * 150}>
                  <VideoCard id={project.id} title={project.title} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Contact Section ── */}
        <section
          className="section-snap relative w-full overflow-hidden border-t border-white/10 px-4 py-24 section-gradient-contact"
          style={{ contentVisibility: "auto", containIntrinsicSize: "0 500px" }}
        >
          {/* Subtle gradient accent */}
          <div className="pointer-events-none absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.02] blur-3xl" />

          <div className="relative mx-auto max-w-xl text-center">
            <ScrollReveal>
              <h2
                className="mb-4 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl"
                style={{ fontFamily: "var(--font-display), sans-serif" }}
              >
                Get in Touch
              </h2>
              <p className="mb-12 text-white/70">
                Reach out to me through any of these.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <MagneticButton
                  href="mailto:nem.nothing07@gmail.com"
                  className="group flex h-12 items-center justify-center gap-3 rounded-full border border-white/10 bg-white/5 px-6 font-medium text-white backdrop-blur-sm transition-colors duration-300 hover:border-white/25 hover:bg-white/10"
                >
                  <svg
                    className="h-5 w-5 text-white/60 transition-colors group-hover:text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                    />
                  </svg>
                  <span className="text-sm">nem.nothing07@gmail.com</span>
                </MagneticButton>

                <DiscordButton />
              </div>
            </ScrollReveal>
          </div>

          {/* Footer */}
          <ScrollReveal delay={400}>
            <div className="mt-20 text-center text-sm text-white/50">
              &copy; {new Date().getFullYear()} nem. All rights reserved.
            </div>
          </ScrollReveal>
        </section>
      </div>
    </>
  );
}
