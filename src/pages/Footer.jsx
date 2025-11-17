import React, { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

/**
 * Footer.jsx (Refactored / Error‑safe)
 * Nepal Premier League (NPL) Footer
 *
 * Fixes / Improvements:
 * - Removed unused group-hover that had no parent .group.
 * - Ensured social icons have focus styles and aria-labels.
 * - Hardened email validation & error handling.
 * - Avoided transient race by using async/await clearly.
 * - Accessible form: proper labeling, aria-live region for status.
 * - Simplified layout to reduce chances of style conflicts.
 * - Defensive checks for props.
 *
 * Props:
 * - logoSrc?: string
 * - onSubscribe?: (email: string) => (Promise<any> | any)
 * - navLinks?: { href: string; label: string }[]
 * - social?: { href: string; label: string; icon?: React.ReactNode }[]
 */

export default function Footer({
  logoSrc = "/vite.svg",
  onSubscribe,
  navLinks = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#upcoming", label: "Upcoming" },
    { href: "#live", label: "Live" },
    { href: "#contact", label: "Contact" },
  ],
  social = [
    { href: "https://facebook.com", label: "Facebook" },
    { href: "https://twitter.com", label: "Twitter" },
    { href: "https://youtube.com", label: "YouTube" },
    { href: "https://instagram.com", label: "Instagram" },
  ],
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");
  const { token, user, logout } = (() => {
    try { return useAuth(); } catch { return { token: null, user: null, logout: () => {} }; }
  })();

  const validating = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");
    if (!validating(email)) {
      setErrorMsg("Please enter a valid email.");
      return;
    }
    setStatus("loading");
    try {
      if (onSubscribe) {
        await onSubscribe(email.trim());
      } else {
        // Simulate success when no handler provided
        await new Promise((res) => setTimeout(res, 600));
      }
      setStatus("success");
      setEmail("");
      setTimeout(() => setStatus("idle"), 4000);
    } catch (err) {
      console.error(err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  }

  return (
    <footer
      className="relative isolate mt-16 border-t border-white/10 bg-[#0C0F14] text-white"
      aria-label="Site footer"
    >
      <DecorBackground />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr_1fr]">
          {/* Brand Column */}
            <div>
              <a
                href="#home"
                className="flex items-center gap-3"
                aria-label="Go to Home"
              >
                <img
                  src={logoSrc}
                  alt="NPL logo"
                  className="h-12 w-12 select-none"
                  draggable="false"
                  onError={(e) => {
                    e.currentTarget.alt = "Logo";
                  }}
                />
                <div className="flex flex-col">
                  <span className="text-xl font-extrabold tracking-wide text-[#F2C14E]">
                    NPL
                  </span>
                  <span className="text-xs text-gray-400">
                    Nepal Premier League
                  </span>
                </div>
              </a>
              <p className="mt-5 max-w-sm text-sm text-gray-300 leading-relaxed">
                Official hub for Nepal Premier League live streams, match
                schedules, and highlights. Celebrate Nepalese cricket with us.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {social.map((s) => (
                  <SocialIconButton
                    key={s.href + s.label}
                    href={s.href}
                    label={s.label}
                    icon={s.icon}
                  />
                ))}
              </div>
            </div>

          {/* Navigation Column */}
          <nav aria-label="Footer navigation">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-300">
              Navigate
            </h3>
            <ul className="mt-4 space-y-2">
              {navLinks.map((l) => (
                <li key={l.href + l.label}>
                  <a
                    href={l.href}
                    className="group inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm text-gray-300 transition hover:bg-white/5 hover:text-[#F2C14E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2C14E]/40"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#F2C14E] opacity-0 transition group-hover:opacity-100" />
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-300">
                Meta
              </h4>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <a
                    href="#terms"
                    className="text-gray-400 transition hover:text-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2C14E]/40 rounded"
                  >
                    Terms &amp; Conditions
                  </a>
                </li>
                <li>
                  <a
                    href="#privacy"
                    className="text-gray-400 transition hover:text-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2C14E]/40 rounded"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#help"
                    className="text-gray-400 transition hover:text-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2C14E]/40 rounded"
                  >
                    Help / Support
                  </a>
                </li>
              </ul>
            </div>
          </nav>

          {/* Newsletter Column */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-300">
              Stay Updated
            </h3>
            <p className="mt-4 text-sm text-gray-300">
              Subscribe for match reminders & highlight drops. Unsubscribe
              anytime.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-3 max-w-xs"
              aria-describedby="subscription-feedback"
            >
              <div className="space-y-2">
                <label
                  htmlFor="footer-email"
                  className="text-xs font-medium text-gray-400"
                >
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="footer-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2C14E]/40"
                    aria-invalid={Boolean(errorMsg)}
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    ✉
                  </span>
                </div>
                {errorMsg && (
                  <p
                    className="text-xs text-rose-400"
                    role="alert"
                    id="subscription-feedback"
                  >
                    {errorMsg}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-[#D90429] to-rose-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:from-rose-600 hover:to-[#D90429] disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/50"
              >
                {status === "loading" && <Spinner className="h-4 w-4" />}
                {status === "success" ? "Subscribed!" : "Subscribe"}
              </button>

              <div
                className="min-h-[18px] text-xs"
                aria-live="polite"
                id="subscription-feedback"
              >
                {status === "success" && (
                  <span className="text-emerald-300">
                    Thank you — check your inbox soon.
                  </span>
                )}
                {status === "error" && (
                  <span className="text-rose-300">
                    Something went wrong. Please retry.
                  </span>
                )}
              </div>
            </form>

            <div className="mt-8 flex flex-wrap gap-3 text-[10px] text-gray-500">
              <Badge label="Secure" />
              <Badge label="No Spam" />
              <Badge label="Opt-Out Anytime" />
            </div>
          </div>
        </div>

        <div className="mt-12 h-px w-full bg-linear-to-r from-transparent via-white/10 to-transparent" />

        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between text-xs text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Nepal Premier League. All rights
            reserved.
          </p>
          <div className="flex items-center gap-3">
            <p className="hidden sm:flex items-center gap-2">
              Built with
              <span className="text-rose-400" aria-hidden="true">♥</span>
              Tailwind CSS
            </p>
            {!token ? (
              <Link
                to="/login"
                className="inline-flex items-center rounded-md bg-linear-to-r from-[#D90429] to-rose-600 px-3 py-1.5 font-semibold text-white hover:from-rose-600 hover:to-[#D90429]"
              >
                Login
              </Link>
            ) : (
              <>
                {user?.role === 'admin' ? (
                  <Link
                    to="/admin"
                    className="inline-flex items-center rounded-md border border-white/15 bg-white/5 px-3 py-1.5 font-medium text-white hover:bg-white/10"
                  >
                    Admin Panel
                  </Link>
                ) : (
                  <Link
                    to="/live"
                    className="inline-flex items-center rounded-md border border-white/15 bg-white/5 px-3 py-1.5 font-medium text-white hover:bg-white/10"
                  >
                    Live
                  </Link>
                )}
                <button
                  type="button"
                  onClick={logout}
                  className="inline-flex items-center rounded-md border border-white/15 bg-white/5 px-3 py-1.5 font-medium text-white hover:bg-white/10"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ---------- Sub Components ---------- */

function SocialIconButton({ href, label, icon }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-300 transition hover:text-[#F2C14E] hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2C14E]/40"
    >
      {icon || <DefaultSocialIcon />}
    </a>
  );
}

function DefaultSocialIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.6"
      fill="none"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        d="M8 12h8M12 8v8M4 12c0-4.418 3.582-8 8-8 2.038 0 3.895.763 5.293 2.02M20 12c0 4.418-3.582 8-8 8-2.038 0-3.895-.763-5.293-2.02"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Spinner({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`animate-spin ${className}`}
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        strokeOpacity="0.25"
      />
      <path
        d="M22 12a10 10 0 0 0-10-10"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Badge({ label }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">
      {label}
    </span>
  );
}

/* ---------- Decorative Background ---------- */

function DecorBackground() {
  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10">
      <div className="absolute -top-24 left-1/4 h-72 w-72 -translate-x-1/2 rounded-full bg-[#D90429]/30 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-96 w-96 translate-x-1/3 translate-y-1/3 rounded-full bg-[#0B4F6C]/40 blur-3xl" />
      <div className="absolute inset-0 opacity-[0.04] mask-[linear-gradient(to_bottom,black,transparent_85%)]">
        <svg
          className="h-full w-full text-white/10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="footerGrid"
              width="36"
              height="36"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M36 0H0v36"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#footerGrid)" />
        </svg>
      </div>
    </div>
  );
}