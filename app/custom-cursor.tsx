"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const visible = useRef(false);
  const hovering = useRef(false);
  const raf = useRef(0);
  const [isTouch] = useState(
    () => window.matchMedia("(pointer: coarse)").matches
  );

  useEffect(() => {
    if (isTouch) return;

    const onMouseMove = (e: MouseEvent) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
      if (!visible.current) {
        visible.current = true;
        if (dotRef.current) dotRef.current.style.opacity = "1";
        if (ringRef.current) ringRef.current.style.opacity = "1";
      }
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest("a, button, [data-cursor-hover], iframe, input, textarea, select");
      if (interactive && !hovering.current) {
        hovering.current = true;
        if (ringRef.current) {
          ringRef.current.style.width = "56px";
          ringRef.current.style.height = "56px";
          ringRef.current.style.borderColor = "rgba(255,255,255,0.6)";
        }
        if (dotRef.current) {
          dotRef.current.style.transform = "translate(-50%,-50%) scale(0.5)";
          dotRef.current.style.opacity = "0.5";
        }
      } else if (!interactive && hovering.current) {
        hovering.current = false;
        if (ringRef.current) {
          ringRef.current.style.width = "40px";
          ringRef.current.style.height = "40px";
          ringRef.current.style.borderColor = "rgba(255,255,255,0.3)";
        }
        if (dotRef.current) {
          dotRef.current.style.transform = "translate(-50%,-50%) scale(1)";
          dotRef.current.style.opacity = "1";
        }
      }
    };

    const onMouseLeave = () => {
      visible.current = false;
      if (dotRef.current) dotRef.current.style.opacity = "0";
      if (ringRef.current) ringRef.current.style.opacity = "0";
    };

    const onMouseOut = (e: MouseEvent) => {
      const related = e.relatedTarget as HTMLElement | null;
      if (related?.tagName === "IFRAME") {
        onMouseLeave();
      }
    };

    const animate = () => {
      if (dotRef.current) {
        dotRef.current.style.left = pos.current.x + "px";
        dotRef.current.style.top = pos.current.y + "px";
      }
      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.15;
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.15;
      if (ringRef.current) {
        ringRef.current.style.left = ringPos.current.x + "px";
        ringRef.current.style.top = ringPos.current.y + "px";
      }
      raf.current = requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseover", onMouseOver, { passive: true });
    document.addEventListener("mouseout", onMouseOut, { passive: true });
    document.documentElement.addEventListener("mouseleave", onMouseLeave);
    raf.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(raf.current);
    };
  }, [isTouch]);

  if (isTouch) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed z-[10001] h-2 w-2 rounded-full bg-white mix-blend-difference"
        style={{
          top: 0,
          left: 0,
          opacity: 0,
          transform: "translate(-50%,-50%) scale(1)",
          transition: "transform 0.15s ease, opacity 0.3s ease",
          willChange: "left, top, transform",
        }}
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed z-[10001] rounded-full border border-white/30 mix-blend-difference"
        style={{
          width: 40,
          height: 40,
          top: 0,
          left: 0,
          opacity: 0,
          transform: "translate(-50%,-50%)",
          transition: "width 0.3s ease, height 0.3s ease, border-color 0.3s ease, opacity 0.3s ease",
          willChange: "left, top, width, height",
        }}
      />
    </>
  );
}
