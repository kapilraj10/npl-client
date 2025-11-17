import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

/**
 * Footer.jsx (Light Theme, No Dark Strip Below)
 *
 * Changes:
 * - Corrected gradient classes (bg-gradient-to-r, no bg-linear-to-r).
 * - Added a white extended backdrop: a ::after style via Tailwind (relative + extra div) to cover any dark body background below.
 * - Optional prop `forceLightBackground` (default true) sets document.body background to white (defensive).
 * - Bottom separator refined; removed unintended layout artifacts.
 * - All internal navigation uses <Link>.
 */

export default function Footer({
  logoSrc = "/vite.svg",
  onSubscribe,
  onLogin,
  showLogin = true,
  forceLightBackground = true,
  navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/upcoming", label: "Upcoming" },
    { href: "/live", label: "Live" },
    { href: "/contact", label: "Contact" },
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

  useEffect(() => {
    if (forceLightBackground) {
      // Ensure the overall page background is white so no dark block shows below footer.
      document.documentElement.style.backgroundColor = "#ffffff";
      document.body.style.backgroundColor = "#ffffff";
    }
  }, [forceLightBackground]);

  const statusId = "footer-subscription-status";
  const errorId = "footer-email-error";

  const isValidEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((value || "").trim());

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");
    if (!isValidEmail(email)) {
      setErrorMsg("Please enter a valid email.");
      return;
    }
    setStatus("loading");
    try {
      if (onSubscribe) {
        await onSubscribe(email.trim());
      } else {
        // Simulated success
        await new Promise((res) => setTimeout(res, 500));
      }
      setStatus("success");
      setEmail("");
      setTimeout(() => setStatus("idle"), 3800);
    } catch (err) {
      console.error(err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3800);
    }
  }

  return (
    <footer
      className="relative isolate mt-0 border-t border-gray-200 bg-white text-gray-700"
      aria-label="Site footer"
    >
      {/* White extension below footer to cover any dark background:
          absolutely positioned layer expands 200px beyond footer height. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -bottom-48 h-48 bg-white"
      />

      <LightDecor />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr_1fr]">
          {/* Brand + Social */}
          <div>
            <Link
              to="/"
              className="flex items-center gap-3 group"
              aria-label="Go to Home"
            >
              <img
                src={'https://i.postimg.cc/5ytF4JZp/Nepal-Premier-League-official-logo.png'}
                alt="NPL logo"
                className="h-12 w-12 select-none transition-transform group-hover:scale-[1.05]"
                draggable="false"
                onError={(e) => {
                  e.currentTarget.alt = "Logo";
                }}
              />
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-wide bg-gradient-to-r from-rose-600 to-red-600 bg-clip-text text-transparent">
                  NPL
                </span>
                <span className="text-xs text-gray-500">
                  Nepal Premier League
                </span>
              </div>
            </Link>

            <p className="mt-5 max-w-sm text-sm text-gray-600 leading-relaxed">
             This is a platform where you can watch the Nepal Premier League for free using trusted third-party sources. Our goal is to make NPL matches easily accessible to everyone, providing live coverage, updates, and match highlights without any subscription fees.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {(social || []).map((s) => (
                <SocialIconButton
                  key={s.href + s.label}
                  href={s.href}
                  label={s.label}
                  icon={s.icon}
                />
              ))}
            </div>
          </div>

          {/* Navigation + Login */}
          <nav aria-label="Footer navigation">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600">
              Navigate
            </h3>
            <ul className="mt-4 space-y-2">
              {(navLinks || []).map((l) => (
                <li key={l.href + l.label}>
                  <Link
                    to={l.href}
                    className="group inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm text-gray-700 transition hover:bg-gray-50 hover:text-rose-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/40"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500 opacity-0 transition group-hover:opacity-100" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            {showLogin && (
              <div className="mt-6">
                <LoginButton onLogin={onLogin} />
              </div>
            )}

            <div className="mt-10">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-600">
                Meta
              </h4>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <Link
                    to="/terms"
                    className="rounded text-gray-500 transition hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/40"
                  >
                    Terms &amp; Conditions
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="rounded text-gray-500 transition hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/40"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/help"
                    className="rounded text-gray-500 transition hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/40"
                  >
                    Help / Support
                  </Link>
                </li>
              </ul>
            </div>
          </nav>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600">
              Stay Updated
            </h3>
            <p className="mt-4 text-sm text-gray-600">
              Subscribe for match reminders & highlight drops. Unsubscribe
              anytime.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-3 max-w-xs"
              noValidate
            >
              <div className="space-y-2">
                <label
                  htmlFor="footer-email"
                  className="text-xs font-medium text-gray-600"
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
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/50"
                    aria-invalid={Boolean(errorMsg)}
                    aria-describedby={
                      errorMsg ? `${statusId} ${errorId}` : statusId
                    }
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    ✉
                  </span>
                </div>
                {errorMsg && (
                  <p
                    id={errorId}
                    className="text-xs text-rose-600"
                    role="alert"
                  >
                    {errorMsg}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-rose-600 to-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:from-red-600 hover:to-rose-600 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/50"
              >
                {status === "loading" && <Spinner className="h-4 w-4" />}
                {status === "success" ? "Subscribed!" : "Subscribe"}
              </button>

              <div
                id={statusId}
                className="min-h-[18px] text-xs"
                aria-live="polite"
              >
                {status === "success" && (
                  <span className="text-emerald-600">
                    Thank you — check your inbox soon.
                  </span>
                )}
                {status === "error" && (
                  <span className="text-rose-600">
                    Something went wrong. Please retry.
                  </span>
                )}
              </div>
            </form>

            <div className="mt-8 flex flex-wrap gap-3 text-[10px] text-gray-600">
              <Badge label="Secure" />
              <Badge label="No Spam" />
              <Badge label="Opt-Out Anytime" />
            </div>
          </div>
        </div>

        <div className="mt-10 h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between text-xs text-gray-600">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
            <span className="hidden sm:inline text-gray-300" aria-hidden="true">
              |
            </span>
            <span>
              Developed by{" "}
              <a
                href="https://kapilrajkc.com.np"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-rose-600 hover:text-red-600 underline-offset-2 hover:underline"
              >
                kapilrajkc.com.np
              </a>
            </span>
          </div>
          <p className="flex items-center gap-2">
            Built with <span className="text-rose-600" aria-hidden="true">♥</span> Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ---------- Sub Components ---------- */

function LoginButton({ onLogin }) {
  const base =
    "inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-sky-500 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:from-indigo-600 hover:to-sky-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50";
  if (onLogin) {
    return (
      <button type="button" onClick={onLogin} className={base}>
        <LoginIcon className="h-4 w-4" />
        Login
      </button>
    );
  }
  return (
    <Link to="/login" className={base}>
      <LoginIcon className="h-4 w-4" />
      Login
    </Link>
  );
}

function SocialIconButton({ href, label, icon }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:text-rose-600 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/40"
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
    <span className="rounded-full border border-gray-300 bg-white px-2 py-1 text-gray-600">
      {label}
    </span>
  );
}

function LoginIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 17l5-5-5-5M15 12H3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LightDecor() {
  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10">
      {/* Soft radial fades */}
      <div className="absolute -top-24 left-1/4 h-72 w-72 -translate-x-1/2 rounded-full bg-rose-200/40 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-96 w-96 translate-x-1/3 translate-y-1/3 rounded-full bg-amber-200/40 blur-3xl" />
      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.05]">
        <svg
          className="h-full w-full text-gray-800/10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="footerGridLight"
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
          <rect width="100%" height="100%" fill="url(#footerGridLight)" />
        </svg>
      </div>
    </div>
  );
}