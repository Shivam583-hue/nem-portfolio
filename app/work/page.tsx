"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import dynamic from "next/dynamic";

const CustomCursor = dynamic(() => import("../custom-cursor"), { ssr: false });

const displayFont = { fontFamily: "var(--font-display), sans-serif" };

const videos = [
  "kCg8ZFXfDkE",
  "fQ7S6kTW-WQ",
  "W7hyllNaac8",
  "2ewXEt6vCZM",
  "aCmsyWt9mkY",
  "KKXb8cjhZH4",
  "9FsrYBzPpxw",
  "pYc4iNnQtus",
];

// ── Lattice geometry ──
const CARD_W = 280;
const CARD_H = Math.round((CARD_W * 16) / 9);
const CELL_W = CARD_W + 130;
const CELL_H = CARD_H + 180;
const COLS = 4;
const ROWS = 2;
const TILE_W = CELL_W * COLS;
const TILE_H = CELL_H * ROWS;
const MAX_TILT = 30; // deg at viewport edges
const DEPTH = 460; // px pushed back at edges
const CENTER_SNAP = 70; // px — "already centered" radius

// Base position of each video within one repeating tile,
// alternate rows offset by half a cell (football-stitch stagger)
const basePositions = videos.map((_, i) => {
  const col = i % COLS;
  const row = Math.floor(i / COLS);
  return {
    x: col * CELL_W + (row % 2 ? CELL_W / 2 : 0),
    y: row * CELL_H,
  };
});

type Instance = {
  key: string;
  video: string;
  index: number;
  wx: number; // world x
  wy: number; // world y
};

export default function WorkPage() {
  const [viewport, setViewport] = useState({ w: 0, h: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [playing, setPlaying] = useState<string | null>(null);

  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, x: 0, y: 0, moved: 0 });
  const driftStopped = useRef(false);

  // ── Camera lerp loop ──
  const tick = useCallback(() => {
    const t = targetRef.current;
    const c = currentRef.current;
    c.x += (t.x - c.x) * 0.09;
    c.y += (t.y - c.y) * 0.09;
    if (Math.abs(t.x - c.x) < 0.1 && Math.abs(t.y - c.y) < 0.1) {
      c.x = t.x;
      c.y = t.y;
      setOffset({ x: c.x, y: c.y });
      rafRef.current = 0;
      return;
    }
    setOffset({ x: c.x, y: c.y });
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const kick = useCallback(() => {
    if (!rafRef.current) rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  // ── Viewport + initial centering on first card ──
  useEffect(() => {
    const measure = () => setViewport({ w: window.innerWidth, h: window.innerHeight });
    measure();
    const ox = basePositions[0].x + CARD_W / 2 - window.innerWidth / 2;
    const oy = basePositions[0].y + CARD_H / 2 - window.innerHeight / 2;
    targetRef.current = { x: ox, y: oy };
    currentRef.current = { x: ox, y: oy };
    setOffset({ x: ox, y: oy });
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // ── Idle drift — gentle float until first interaction ──
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const start = performance.now();
    const baseX = targetRef.current.x;
    const baseY = targetRef.current.y;
    const loop = (now: number) => {
      if (driftStopped.current) return;
      const t = (now - start) / 1000;
      const ramp = Math.min(t / 3, 1); // ease in over 3s
      targetRef.current.x = baseX + Math.sin(t * 0.3) * 70 * ramp;
      targetRef.current.y = baseY + Math.sin(t * 0.19 + 1.4) * 50 * ramp;
      kick();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [kick]);

  // ── Wheel pans the camera ──
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      driftStopped.current = true;
      targetRef.current.x += e.deltaX;
      targetRef.current.y += e.deltaY;
      setPlaying(null);
      kick();
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [kick]);

  // ── Drag / touch pan ──
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    driftStopped.current = true;
    drag.current = { active: true, x: e.clientX, y: e.clientY, moved: 0 };
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!drag.current.active) return;
      const dx = e.clientX - drag.current.x;
      const dy = e.clientY - drag.current.y;
      drag.current.x = e.clientX;
      drag.current.y = e.clientY;
      drag.current.moved += Math.abs(dx) + Math.abs(dy);
      if (drag.current.moved > 6) setPlaying(null);
      targetRef.current.x -= dx;
      targetRef.current.y -= dy;
      kick();
    },
    [kick]
  );

  const onPointerUp = useCallback(() => {
    drag.current.active = false;
  }, []);

  // ── Center the camera on a card ──
  const centerOn = useCallback(
    (el: HTMLElement) => {
      const rect = el.getBoundingClientRect();
      const dx = rect.left + rect.width / 2 - viewport.w / 2;
      const dy = rect.top + rect.height / 2 - viewport.h / 2;
      if (Math.abs(dx) < CENTER_SNAP && Math.abs(dy) < CENTER_SNAP) return false;
      targetRef.current.x = currentRef.current.x + dx;
      targetRef.current.y = currentRef.current.y + dy;
      kick();
      return true;
    },
    [viewport, kick]
  );

  const onCardClick = useCallback(
    (e: React.MouseEvent, key: string) => {
      if (drag.current.moved > 6) return; // was a drag, not a click
      centerOn(e.currentTarget as HTMLElement);
      setPlaying(key);
    },
    [centerOn]
  );

  // ── Visible instances (infinite tiling) ──
  const instances: Instance[] = [];
  if (viewport.w > 0) {
    const pad = CELL_W / 2;
    for (let i = 0; i < videos.length; i++) {
      const { x: bx, y: by } = basePositions[i];
      const nxMin = Math.ceil((offset.x - CARD_W - pad - bx) / TILE_W);
      const nxMax = Math.floor((offset.x + viewport.w + pad - bx) / TILE_W);
      const nyMin = Math.ceil((offset.y - CARD_H - pad - by) / TILE_H);
      const nyMax = Math.floor((offset.y + viewport.h + pad - by) / TILE_H);
      for (let nx = nxMin; nx <= nxMax; nx++) {
        for (let ny = nyMin; ny <= nyMax; ny++) {
          instances.push({
            key: `${i}:${nx}:${ny}`,
            video: videos[i],
            index: i,
            wx: bx + nx * TILE_W,
            wy: by + ny * TILE_H,
          });
        }
      }
    }
  }

  return (
    <>
      <CustomCursor />

      <div
        ref={containerRef}
        className="section-gradient-projects fixed inset-0 overflow-hidden touch-none select-none"
        style={{ perspective: "1100px", perspectiveOrigin: "50% 50%" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {/* Subtle gradient accents, same as the home work section */}
        <div className="pointer-events-none absolute top-0 left-1/4 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-white/[0.02] blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-1/4 h-[400px] w-[400px] translate-x-1/2 rounded-full bg-white/[0.015] blur-3xl" />

        {/* Vignette — darkens the edges to sell the sphere depth */}
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.55) 100%)",
          }}
        />

        {instances.map((inst) => {
          const sx = inst.wx - offset.x;
          const sy = inst.wy - offset.y;
          // normalized distance of the card centre from screen centre
          const ndx = (sx + CARD_W / 2 - viewport.w / 2) / (viewport.w / 2 + CARD_W);
          const ndy = (sy + CARD_H / 2 - viewport.h / 2) / (viewport.h / 2 + CARD_H);
          const rotY = -ndx * MAX_TILT;
          const rotX = ndy * MAX_TILT;
          const d2 = Math.min(ndx * ndx + ndy * ndy, 1);
          // Concave: centre card sits deepest, edges curve toward the viewer
          const tz = -DEPTH * (1 - d2);
          // Counteract perspective shrink so the centre card reads biggest
          const scale = 1 + (1 - d2) * 0.25;
          const isPlaying = playing === inst.key;

          return (
            <div
              key={inst.key}
              className="absolute top-0 left-0 will-change-transform"
              style={{
                width: CARD_W,
                height: CARD_H,
                transform: `translate3d(${sx}px, ${sy}px, ${tz}px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${scale})`,
                opacity: 1 - d2 * 0.4,
              }}
              onClick={(e) => onCardClick(e, inst.key)}
            >
              <div className="group relative h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-xl shadow-black/40 transition-colors duration-300 hover:border-white/30">
                {isPlaying ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${inst.video}?rel=0&modestbranding=1&autoplay=1&playsinline=1`}
                    title={`Edit #${inst.index + 1}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full border-0"
                  />
                ) : (
                  <>
                    <img
                      src={`https://i.ytimg.com/vi/${inst.video}/oar2.jpg`}
                      alt={`Edit #${inst.index + 1}`}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                      draggable={false}
                      onError={(e) => {
                        const img = e.currentTarget;
                        if (!img.src.includes("hqdefault")) {
                          img.src = `https://i.ytimg.com/vi/${inst.video}/hqdefault.jpg`;
                        }
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/25 transition-colors duration-500 group-hover:bg-black/5">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                        <svg
                          className="h-6 w-6 text-white/90"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    <div className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-2">
                      <span className="font-mono text-[10px] text-accent">
                        {String(inst.index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-xs font-medium text-white/80">
                        Edit #{inst.index + 1}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Overlay header ── */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 sm:px-10">
        <a
          href="/"
          className="pointer-events-auto flex h-10 items-center gap-2 rounded-full border border-white/10 bg-black/40 px-5 backdrop-blur-md transition-colors duration-300 hover:border-white/25 hover:bg-black/60"
        >
          <svg
            className="h-4 w-4 text-white/60"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M19 12H5M11 18l-6-6 6-6" />
          </svg>
          <span className="text-xs font-medium uppercase tracking-[0.25em] text-white/70">
            Back
          </span>
        </a>
        <h1
          className="text-lg font-bold tracking-[-0.04em] text-white"
          style={displayFont}
        >
          all work<span className="text-accent">.</span>
        </h1>
      </header>

      {/* ── Hint ── */}
      <p className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-white/5 bg-black/40 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.3em] text-white/40 backdrop-blur-md">
        Scroll or drag to explore
      </p>
    </>
  );
}
