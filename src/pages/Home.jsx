import React from "react";
import { Link } from "react-router-dom";

/**
 * Home (Hero) section for NPL Live — Light Theme
 *
 * Fixes:
 * - Replaced invalid Tailwind classes:
 *   - bg-linear-to-* -> bg-gradient-to-*
 *   - aspect-4/3 -> aspect-[4/3]
 * - Removed fragile mask shorthand; simplified overlays
 * - Polished light theme styles, spacing, and cards
 *
 * Props:
 * - onWatchLive?: () => void
 * - onViewFixtures?: () => void
 * - heroImgSrc?: string
 */
export default function Home({
  onWatchLive,
  onViewFixtures,
  heroImgSrc = "https://i.postimg.cc/pXw4FLqk/G57E2r-Ob-IAA2MZj.jpg",
}) {
  return (
    <section
      id="home"
      className="relative isolate overflow-hidden bg-white text-gray-900"
      aria-label="NPL Live Home"
    >
      {/* Ambient background image (very subtle, washed into white) */}
      <div aria-hidden="true" className="absolute inset-0 -z-20">
        <img
          src={heroImgSrc}
          alt=""
          className="h-full w-full object-cover opacity-15"
          loading="eager"
          decoding="async"
        />
        {/* White wash to keep the overall page light */}
        <div className="absolute inset-0 bg-linear-to-b from-white via-white/80 to-white" />
      </div>

      {/* Decorative soft glows */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-rose-300/30 blur-3xl" />
        <div className="absolute top-1/4 -right-20 h-80 w-80 rounded-full bg-cyan-300/25 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-amber-300/25 blur-2xl" />
        {/* subtle grid overlay */}
        <div className="absolute inset-0 opacity-[0.06]">
          <svg
            className="h-full w-full text-gray-800/10"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <defs>
              <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="mx-auto max-w-7xl grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          {/* Left: Copy */}
          <div>
            <LiveBadge />

            <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] sm:text-5xl md:text-6xl">
              Experience
              <span className="mx-3 inline-block bg-linear-to-r from-amber-600 via-amber-500 to-rose-600 bg-clip-text text-transparent">
                NPL Live
              </span>
              Action
            </h1>

            <p className="mt-5 max-w-xl text-base/7 text-gray-700 sm:text-lg/8">
              Watch Nepal’s top teams battle for glory. Streams, live scores, highlights,
              and fixtures — all in one place.
            </p>

            <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <PrimaryButton onClick={onWatchLive} href="/live">
                <PlayIcon className="h-4 w-4" />
                Watch Live
              </PrimaryButton>

              <SecondaryButton onClick={onViewFixtures} href="/upcoming">
                View Fixtures
              </SecondaryButton>
            </div>

            {/* Quick stats */}
            <ul className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-md">
              <StatItem label="Teams" value="8" />
              <StatItem label="Matches" value="42" />
              <StatItem label="Seasons" value="10+" />
            </ul>
          </div>

          {/* Right: Image + next match card */}
          <div className="relative">
            {/* Soft glows */}
            <div className="pointer-events-none absolute -top-6 -left-6 h-64 w-64 rounded-full bg-rose-300/30 blur-3xl" />
            <div className="pointer-events-none absolute bottom-4 -right-6 h-64 w-64 rounded-full bg-sky-300/25 blur-3xl" />

            <div className="relative mx-auto aspect-4/3 w-full max-w-lg overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl ring-1 ring-gray-900/5">
              <img
                src={heroImgSrc}
                alt="Cricket highlight"
                className="h-full w-full object-cover"
                loading="eager"
                decoding="async"
              />
              {/* Subtle overlay to improve text over card edges if needed */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/10 via-white/0 to-transparent" />
            </div>

            {/* Next Match card */}
            <NextMatchCard className="absolute -bottom-6 left-4 right-auto md:left-8" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* Components */

function LiveBadge() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-sm text-gray-900 shadow-sm">
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-70" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-500" />
      </span>
      Live Now • Nepal Premier League
    </div>
  );
}

function PrimaryButton({ children, onClick, href }) {
  const Tag = onClick ? "button" : Link;
  const props = onClick ? { type: "button", onClick } : { to: href };
  return (
    <Tag
      {...props}
      className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-rose-600 to-red-600 px-6 py-3 text-sm font-semibold text-white shadow-md ring-1 ring-rose-400/20 transition hover:from-red-600 hover:to-rose-600 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/50 active:scale-[0.99]"
    >
      {children}
    </Tag>
  );
}

function SecondaryButton({ children, onClick, href }) {
  const Tag = onClick ? "button" : Link;
  const props = onClick ? { type: "button", onClick } : { to: href };
  return (
    <Tag
      {...props}
      className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
    >
      {children}
    </Tag>
  );
}

function StatItem({ label, value }) {
  return (
    <li className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-center shadow-sm">
      <div className="text-xl font-extrabold text-gray-900">{value}</div>
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
    </li>
  );
}

function NextMatchCard({ className = "" }) {
  return (
   <></>
  );
}

function Team({ name, short, color }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="grid h-9 w-9 place-items-center rounded-lg text-xs font-extrabold text-white shadow-sm ring-1 ring-black/10"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      >
        {short}
      </div>
      <div className="text-[13px]">{name}</div>
    </div>
  );
}

function PlayIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M4 4.5v11l11-5.5-11-5.5z" />
    </svg>
  );
}