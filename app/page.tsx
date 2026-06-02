import ScrollReveal from "./scroll-reveal";

const projects = [
  {
    id: "kCg8ZFXfDkE",
    title: "Edit #1",
  },
  {
    id: "fQ7S6kTW-WQ",
    title: "Edit #2",
  },
  {
    id: "W7hyllNaac8",
    title: "Edit #3",
  },
];

export default function Home() {
  return (
    <div className="w-full">
      {/* ── Hero Section ── */}
      <section className="relative min-h-screen w-full overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/image01.jpg"
            alt="Background"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-16">
          <div className="animate-fade-in-up animate-glow-pulse w-full max-w-xl rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl sm:p-10">
            <h1 className="animate-fade-in delay-200 mb-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              nem
            </h1>

            <p className="animate-fade-in delay-400 mb-6 text-lg font-medium text-white/60">
              Freelance Short Video Editor
            </p>

            <p className="animate-fade-in delay-600 mb-8 leading-relaxed text-white/80">
              I&apos;m a self-taught video editor with short length video editing experience.
              I focus on clean transitions, effects which suit the edit, engaging subtitles,
              sound effects, and high quality upscaled edits to maximize audience retention.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <a
                href="https://www.youtube.com/@nowherenem"
                target="_blank"
                rel="noopener noreferrer"
                className="animate-slide-in-left delay-800 group flex h-12 items-center justify-center gap-3 rounded-full bg-red-600 px-6 font-medium text-white transition-all duration-300 hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/25 hover:scale-105 active:scale-95"
              >
                <svg
                  className="h-5 w-5 transition-transform duration-300 group-hover:scale-110"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                YouTube
              </a>
              <a
                href="https://www.instagram.com/nowherenem"
                target="_blank"
                rel="noopener noreferrer"
                className="animate-slide-in-right delay-800 group flex h-12 items-center justify-center gap-3 rounded-full border border-white/20 px-6 font-medium text-white transition-all duration-300 hover:border-pink-500/50 hover:bg-pink-500/10 hover:shadow-lg hover:shadow-pink-500/20 hover:scale-105 active:scale-95"
              >
                <svg
                  className="h-5 w-5 transition-transform duration-300 group-hover:scale-110"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                </svg>
                Instagram
              </a>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce">
          <svg className="h-6 w-6 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ── Projects Section ── */}
      <section className="relative w-full overflow-hidden px-4 py-24 section-gradient-projects">
        {/* Subtle gradient accents */}
        <div className="pointer-events-none absolute top-0 left-1/4 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-white/[0.02] blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-1/4 h-[400px] w-[400px] translate-x-1/2 rounded-full bg-white/[0.015] blur-3xl" />

        <div className="relative mx-auto max-w-5xl">
          <ScrollReveal>
            <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Projects
            </h2>
            <p className="mx-auto mb-16 max-w-md text-center text-white/50">
              Some of my recent edits — clean cuts, on-beat transitions, cinematic feel.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, i) => (
              <ScrollReveal key={project.id} delay={i * 150}>
                <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-all duration-300 hover:border-white/20 hover:shadow-2xl hover:shadow-white/5">
                  <div className="relative aspect-[9/16] w-full overflow-hidden">
                    <iframe
                      src={`https://www.youtube.com/embed/${project.id}?rel=0&modestbranding=1`}
                      title={project.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 h-full w-full border-0"
                    />
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact Section ── */}
      <section className="relative w-full overflow-hidden border-t border-white/10 px-4 py-24 section-gradient-contact">
        {/* Subtle gradient accent */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.02] blur-3xl" />

        <div className="relative mx-auto max-w-xl text-center">
          <ScrollReveal>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Get in Touch
            </h2>
            <p className="mb-12 text-white/50">
              Reach out to me through any of these.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              {/* Email */}
              <a
                href="mailto:nem.nothing07@gmail.com"
                className="group flex h-12 items-center justify-center gap-3 rounded-full border border-white/10 bg-white/5 px-6 font-medium text-white backdrop-blur-sm transition-all duration-300 hover:border-white/25 hover:bg-white/10 hover:scale-105 active:scale-95"
              >
                <svg className="h-5 w-5 text-white/60 transition-colors group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
                <span className="text-sm">nem.nothing07@gmail.com</span>
              </a>

              {/* Discord */}
              <div className="group flex h-12 items-center justify-center gap-3 rounded-full border border-white/10 bg-white/5 px-6 font-medium text-white backdrop-blur-sm transition-all duration-300 hover:border-indigo-500/30 hover:bg-indigo-500/10">
                <svg className="h-5 w-5 text-white/60 transition-colors group-hover:text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                <span className="text-sm">r3vryn</span>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Footer */}
        <ScrollReveal delay={400}>
          <div className="mt-20 text-center text-sm text-white/25">
            &copy; 2026 nem. All rights reserved.
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
