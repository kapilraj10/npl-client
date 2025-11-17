import React, { useEffect, useState } from "react";
import { Link, NavLink, useInRouterContext, useLocation } from "react-router-dom";

/**
 * Enhanced NPL Navbar
 * - Glassy translucent bar with gradient accent and scroll shadow
 * - Active route highlighting via NavLink
 * - Better "Watch Live" gradient CTA (correct Tailwind: bg-gradient-to-r)
 * - Smooth mobile panel animation (max-height transition)
 * - Auto-close mobile menu on route change
 * - Safer logo sizing (prevents distortion)
 *
 * Props:
 * - onWatchLive?: () => void
 * - logoSrc?: string
 * - links?: { href: string; label: string; live?: boolean }[]
 */
export default function Navbar({
  onWatchLive,
  logoSrc = "https://i.postimg.cc/5ytF4JZp/Nepal-Premier-League-official-logo.png",
  links = [
    { href: "/", label: "Home" },
    { href: "/upcoming", label: "Upcoming" },
    { href: "/live", label: "Live", live: true },
  ],
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const inRouter = useInRouterContext();

  // Close mobile menu on route change (only when in Router context)
  // Render a tiny inner component to safely use Router hooks
  const CloseOnRoute = () => {
    const loc = useLocation();
    useEffect(() => {
      setOpen(false);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loc.pathname]);
    return null;
  };

  // Apply shadow and stronger background after scrolling
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      <nav
        className={[
          "transition-colors",
          "bg-white",
          "border-b border-gray-200",
          scrolled ? "shadow-md" : "shadow-sm",
        ].join(" ")}
        aria-label="Primary Navigation"
      >
        {/* Top accent line removed for clean white background */}
        <div className="h-0 w-full" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between">
            {inRouter && <CloseOnRoute />}
            {/* Brand */}
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src={logoSrc}
                alt="NPL logo"
                className="h-10 w-auto select-none transition-transform duration-200 group-hover:scale-[1.03]"
                draggable="false"
              />
              <div className="hidden sm:flex flex-col leading-tight">
                <span className="font-extrabold tracking-wide text-gray-900 group-hover:text-[#0B4F6C] transition-colors">
                  NPL
                </span>
                <span className="text-[11px] text-gray-600">
                  Nepal Premier League
                </span>
              </div>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-1">
              {links.map((l) => (
                <NavItem key={l.href} {...l} />
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex">
              <WatchLiveButton onClick={onWatchLive} />
            </div>

            {/* Mobile button */}
            <div className="md:hidden">
              <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-[#0B4F6C] focus:outline-none focus:ring-2 focus:ring-[#0B4F6C]/30"
                aria-controls="mobile-menu"
                aria-expanded={open}
              >
                <span className="sr-only">Toggle navigation</span>
                {/* Icon swap */}
                <svg
                  className={`h-6 w-6 ${open ? "hidden" : "block"}`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                <svg
                  className={`h-6 w-6 ${open ? "block" : "hidden"}`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile panel (animated) */}
        <div
          id="mobile-menu"
          className="md:hidden overflow-hidden border-t border-gray-200 bg-white transition-[max-height] duration-300"
          style={{ maxHeight: open ? 480 : 0 }}
        >
          <div className="px-4 py-3 space-y-1">
            {links.map((l) => (
              <MobileNavItem key={l.href} {...l} onClick={() => setOpen(false)} />
            ))}

            <WatchLiveButton
              full
              className="mt-2"
              onClick={() => {
                onWatchLive && onWatchLive();
              }}
            />
          </div>
        </div>
      </nav>
    </header>
  );
}

/* Desktop Nav item with active state */
function NavItem({ href, label, live }) {
  const base =
    "px-3 py-2 rounded-md text-sm font-medium transition select-none";
  return (
    <NavLink
      to={href}
      className={({ isActive }) =>
        [
          base,
          isActive
            ? "text-gray-900 bg-gray-100"
            : "text-gray-700 hover:text-[#0B4F6C] hover:bg-gray-100",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B4F6C]/30",
          live ? "font-semibold text-red-600 hover:text-red-700" : "",
        ].join(" ")
      }
      end={href === "/"}
    >
      <span className="inline-flex items-center gap-2">
        {live && <LiveDot />}
        {label}
      </span>
    </NavLink>
  );
}

/* Mobile link variant */
function MobileNavItem({ href, label, live, onClick }) {
  const base =
    "block rounded-md px-3 py-2 text-base font-medium transition select-none";
  return (
    <NavLink
      to={href}
      onClick={onClick}
      className={({ isActive }) =>
        [
          base,
          isActive
            ? "text-gray-900 bg-gray-100"
            : "text-gray-700 hover:text-[#0B4F6C] hover:bg-gray-100",
          live ? "font-semibold text-red-600" : "",
        ].join(" ")
      }
      end={href === "/"}
    >
      <span className="inline-flex items-center gap-2">
        {live && <LiveDot />}
        {label}
      </span>
    </NavLink>
  );
}

/* Live pulsing dot */
function LiveDot() {
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
    </span>
  );
}

/* Watch Live CTA (uses Link by default; button if onClick provided) */
function WatchLiveButton({ onClick, className = "", full = false }) {
  const common =
    `${className} ${full ? "inline-flex w-full justify-center" : "inline-flex"} ` +
    "items-center gap-2 rounded-md bg-linear-to-r from-rose-600 to-red-600 px-4 py-2 " +
    "text-sm font-semibold text-white shadow hover:from-red-600 hover:to-rose-600 transition " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/50";

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={common}>
        <PlayIcon className="h-4 w-4" />
        Watch Live
      </button>
    );
  }
  return (
    <Link to="/live" className={common}>
      <PlayIcon className="h-4 w-4" />
      Watch Live
    </Link>
  );
}

function PlayIcon({ className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M4 4.5v11l11-5.5-11-5.5z" />
    </svg>
  );
}