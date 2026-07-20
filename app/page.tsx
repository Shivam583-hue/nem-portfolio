"use client";

import { useState, useRef, useCallback, useEffect, memo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import ScrollReveal from "./scroll-reveal";

const CustomCursor = dynamic(() => import("./custom-cursor"), { ssr: false });

const displayFont = { fontFamily: "var(--font-display), sans-serif" };

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
      className={`fixed inset-0 z-[10000] flex items-center justify-center bg-[#0a0a0a] transition-opacity duration-700 ${phase === "exit" ? "opacity-0" : "opacity-100"
        }`}
    >
      <div className="relative flex items-center gap-[2px]">
        {"nem".split("").map((letter, i) => (
          <span
            key={i}
            className="loader-letter text-6xl font-bold tracking-[-0.06em] text-white sm:text-8xl"
            style={{
              ...displayFont,
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

function Nav() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[100] border-b border-white/5 bg-[#0a0a0a]/70 backdrop-blur-md transition-all duration-500 ${shown
        ? "translate-y-0 opacity-100"
        : "pointer-events-none -translate-y-full opacity-0"
        }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-10">
        <a
          href="#top"
          className="text-lg font-bold tracking-[-0.04em] text-white"
          style={displayFont}
        >
          nem<span className="text-accent">.</span>
        </a>
        <div className="flex items-center gap-8">
          <a
            href="#work"
            className="link-underline text-xs font-medium uppercase tracking-[0.25em] text-white/60 transition-colors duration-300 hover:text-white"
          >
            Work
          </a>
          <a
            href="#contact"
            className="link-underline text-xs font-medium uppercase tracking-[0.25em] text-white/60 transition-colors duration-300 hover:text-white"
          >
            Contact
          </a>
        </div>
      </nav>
    </header>
  );
}

function StaggeredTitle({ visible }: { visible: boolean }) {
  const letters = "nem".split("");
  return (
    <h1
      className="text-[clamp(4rem,12vw,7rem)] font-bold leading-[0.85] tracking-[-0.06em] text-white"
      style={displayFont}
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
      <span
        className="stagger-letter inline-block text-accent"
        style={{
          animationDelay: visible ? `${600 + letters.length * 120}ms` : "0ms",
          animationPlayState: visible ? "running" : "paused",
        }}
      >
        .
      </span>
    </h1>
  );
}


const projects = [
  { id: "pYc4iNnQtus", title: "Mo-graph Edit" },
  { id: "2ewXEt6vCZM", title: "Mo-graph + Transition Edit" },
  { id: "aCmsyWt9mkY", title: "Transition Edit" },
];

const VideoCard = memo(function VideoCard({
  id,
  title,
  index,
}: {
  id: string;
  title: string;
  index: number;
}) {
  const [playing, setPlaying] = useState(false);
  const [preview, setPreview] = useState(false);
  const [previewReady, setPreviewReady] = useState(false);
  const [thumbFallback, setThumbFallback] = useState(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startPreview = useCallback(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    hoverTimer.current = setTimeout(() => setPreview(true), 250);
  }, []);

  const stopPreview = useCallback(() => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setPreview(false);
    setPreviewReady(false);
  }, []);

  const handleClick = useCallback(() => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setPreview(false);
    setPreviewReady(false);
    setPlaying(true);
  }, []);

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg shadow-black/20 transition-colors duration-300 hover:border-white/25">
      <div
        className="relative aspect-[9/16] w-full overflow-hidden"
        onMouseEnter={playing ? undefined : startPreview}
        onMouseLeave={playing ? undefined : stopPreview}
      >
        {playing ? (
          <iframe
            src={`https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&autoplay=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <>
            <button
              type="button"
              className="absolute inset-0 h-full w-full cursor-pointer border-0 bg-black"
              onClick={handleClick}
              aria-label={`Play ${title}`}
            >
              <img
                src={`https://i.ytimg.com/vi/${id}/${thumbFallback ? "hqdefault" : "maxresdefault"
                  }.jpg`}
                alt=""
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                onError={() => setThumbFallback(true)}
              />
              <div
                className={`absolute inset-0 flex items-center justify-center bg-black/30 transition-all duration-500 group-hover:bg-black/10 ${previewReady ? "opacity-0" : "opacity-100"
                  }`}
              >
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
            {preview && (
              <iframe
                src={`https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${id}&rel=0&modestbranding=1&playsinline=1`}
                title=""
                aria-hidden="true"
                tabIndex={-1}
                onLoad={() => setPreviewReady(true)}
                className={`pointer-events-none absolute inset-0 h-full w-full border-0 transition-opacity duration-500 ${previewReady ? "opacity-100" : "opacity-0"
                  }`}
              />
            )}
            <div
              className={`pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white/80 backdrop-blur-sm transition-opacity duration-500 ${previewReady ? "opacity-100" : "opacity-0"
                }`}
            >
              Click for sound
            </div>
          </>
        )}
      </div>
      <div className="flex items-center gap-3 px-5 py-4">
        <span className="font-mono text-xs text-accent">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="text-sm font-medium text-white/80">{title}</span>
      </div>
    </div>
  );
});

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

function LocalTime() {
  const [time, setTime] = useState("--:--");

  useEffect(() => {
    const update = () =>
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: "Asia/Kolkata",
        }).format(new Date())
      );
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, []);

  return <span className="font-mono text-sm text-white/40">IST — {time}</span>;
}

function Eyebrow({ number, label }: { number: string; label: string }) {
  return (
    <p className="mb-5 font-mono text-xs uppercase tracking-[0.35em] text-white/40">
      <span className="text-accent">{number}</span> — {label}
    </p>
  );
}

export default function Home() {
  const [intro, setIntro] = useState<"pending" | "loader" | "done">("pending");
  const [siteVisible, setSiteVisible] = useState(false);
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (sessionStorage.getItem("nem-intro-seen")) {
        setIntro("done");
        setTimeout(() => setSiteVisible(true), 50);
      } else {
        sessionStorage.setItem("nem-intro-seen", "1");
        setIntro("loader");
      }
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const handleLoadComplete = useCallback(() => {
    setIntro("done");
    setTimeout(() => setSiteVisible(true), 100);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = Math.min(window.scrollY, window.innerHeight) * 0.25;
        if (parallaxRef.current) {
          parallaxRef.current.style.transform = `translate3d(0, ${y}px, 0)`;
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {intro === "loader" && <LoadingScreen onComplete={handleLoadComplete} />}
      <CustomCursor />
      <Nav />

      <div
        id="top"
        className={`w-full transition-opacity duration-700 ${siteVisible ? "opacity-100" : "opacity-0"
          }`}
      >
        <section className="relative min-h-[100svh] w-full overflow-hidden">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div ref={parallaxRef} className="absolute inset-0 will-change-transform">
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                poster="/hero-poster.jpg"
                className="h-full w-full scale-[1.15] object-cover blur-md"
              >
                <source src="/video.mp4" type="video/mp4" />
              </video>
            </div>
            <div className="absolute inset-0 bg-black/60" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
          </div>

          <div className="relative z-10 flex min-h-[100svh] items-center justify-center px-6 py-24 sm:px-10">
            <div
              className={`w-full max-w-xl rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-black/40 backdrop-blur-xl transition-all duration-700 sm:p-12 ${siteVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
                }`}
              style={{ transitionDelay: "400ms" }}
            >
              <StaggeredTitle visible={siteVisible} />

              <p
                className={`mt-5 text-sm font-medium uppercase tracking-[0.3em] text-white/60 transition-all duration-700 ${siteVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
                  }`}
                style={{ transitionDelay: "1000ms" }}
              >
                Freelance short video editor
              </p>

              <p
                className={`mt-6 leading-relaxed text-white/80 transition-all duration-700 ${siteVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
                  }`}
                style={{ transitionDelay: "1300ms" }}
              >
                I&apos;m a self-taught video editor with short length video
                editing experience. I focus on clean transitions, effects
                which suit the edit, engaging subtitles, sound effects, and
                high quality upscaled edits to maximize audience retention.
              </p>

              <div
                className={`mt-8 flex flex-col gap-4 sm:flex-row transition-all duration-700 ${siteVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
                  }`}
                style={{ transitionDelay: "1500ms" }}
              >
                <MagneticButton
                  href="https://www.youtube.com/@nowherenem"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-12 items-center justify-center gap-3 rounded-full bg-red-600 px-6 font-medium text-white transition-colors duration-300 hover:bg-red-500"
                >
                  <svg
                    className="h-5 w-5 text-white"
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
                  className="group flex h-12 items-center justify-center gap-3 rounded-full border border-white/15 bg-white/5 px-6 font-medium text-white backdrop-blur-sm transition-colors duration-300 hover:border-pink-500/40 hover:bg-pink-500/10"
                >
                  <svg
                    className="h-5 w-5 text-white/70 transition-colors duration-300 group-hover:text-pink-400"
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

          <a
            href="#work"
            aria-label="Scroll to work"
            className={`absolute bottom-10 right-6 z-10 hidden flex-col items-center gap-3 sm:flex transition-opacity duration-700 ${siteVisible ? "opacity-100" : "opacity-0"
              }`}
            style={{ transitionDelay: "1800ms" }}
          >
            <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-white/40">
              Scroll
            </span>
            <span className="block h-14 w-px overflow-hidden bg-white/10">
              <span className="scroll-line-inner block h-full w-full bg-gradient-to-b from-transparent via-accent to-transparent" />
            </span>
          </a>
        </section>

        <section
          id="work"
          className="relative w-full overflow-hidden py-28 section-gradient-projects"
          style={{ contentVisibility: "auto", containIntrinsicSize: "0 900px" }}
        >
          <div className="pointer-events-none absolute top-0 left-1/4 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-white/[0.02] blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-1/4 h-[400px] w-[400px] translate-x-1/2 rounded-full bg-white/[0.015] blur-3xl" />

          <div className="relative mx-auto max-w-6xl px-6 sm:px-10">
            <ScrollReveal>
              <Eyebrow number="" label="Work" />
            </ScrollReveal>
            <ScrollReveal variant="clip">
              <h2
                className="text-5xl font-bold tracking-[-0.04em] text-white sm:text-7xl"
                style={displayFont}
              >
                Selected Work
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <p className="mt-5 max-w-md text-white/60">
                Some of my recent edits — clean cuts, on-beat transitions,
                cinematic feel. Hover to preview, click for sound.
              </p>
            </ScrollReveal>

            <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, i) => (
                <ScrollReveal key={project.id} delay={i * 150}>
                  <VideoCard id={project.id} title={project.title} index={i} />
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal delay={200}>
              <div className="mt-14 flex justify-center">
                <Link
                  href="/work"
                  className="group relative flex h-14 items-center gap-3 overflow-hidden rounded-full border border-accent/30 bg-white/[0.06] px-9 shadow-[0_0_35px_rgba(255,79,46,0.12)] backdrop-blur-sm transition-all duration-300 hover:border-accent/60 hover:bg-white/10 hover:shadow-[0_0_50px_rgba(255,79,46,0.25)]"
                >
                  <span
                    aria-hidden="true"
                    className="cta-sheen pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
                  />
                  <span className="text-sm font-medium uppercase tracking-[0.25em] text-white/90 transition-colors duration-300 group-hover:text-white">
                    View all work
                  </span>
                  <svg
                    className="h-4 w-4 text-accent transition-transform duration-300 group-hover:translate-x-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section
          id="contact"
          className="relative w-full overflow-hidden border-t border-white/10 py-28 section-gradient-contact"
          style={{ contentVisibility: "auto", containIntrinsicSize: "0 600px" }}
        >
          <div className="pointer-events-none absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.02] blur-3xl" />

          <div className="relative mx-auto max-w-6xl px-6 sm:px-10">
            <ScrollReveal>
              <Eyebrow number="" label="Contact" />
            </ScrollReveal>
            <ScrollReveal variant="clip">
              <h2
                className="text-5xl font-bold tracking-[-0.04em] text-white sm:text-7xl"
                style={displayFont}
              >
                Get in touch for a project
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <p className="mt-5 max-w-md text-white/60">
                Tell me about your edit — I usually reply within a day.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <a
                href="mailto:nem.nothing07@gmail.com"
                className="link-underline mt-12 inline-block break-all text-2xl font-bold tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl"
                style={displayFont}
              >
                nem.nothing07@gmail.com
              </a>
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <div className="mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <span className="text-sm text-white/40">or on Discord —</span>
                <DiscordButton />
              </div>
            </ScrollReveal>
          </div>
        </section>

        <footer className="border-t border-white/10">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-6 py-10 sm:flex-row sm:px-10">
            <p className="text-sm text-white/40">
              &copy; {new Date().getFullYear()} nem. All rights reserved.
            </p>
            <LocalTime />
            <div className="flex items-center gap-6">
              <a
                href="https://www.youtube.com/@nowherenem"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium uppercase tracking-[0.2em] text-white/50 transition-colors duration-300 hover:text-white"
              >
                YouTube
              </a>
              <a
                href="https://www.instagram.com/nowherenem"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium uppercase tracking-[0.2em] text-white/50 transition-colors duration-300 hover:text-white"
              >
                Instagram
              </a>
              <a
                href="#top"
                className="text-xs font-medium uppercase tracking-[0.2em] text-white/50 transition-colors duration-300 hover:text-white"
              >
                Top ↑
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
