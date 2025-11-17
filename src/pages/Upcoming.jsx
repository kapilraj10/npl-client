import React, { useEffect, useMemo, useState } from "react";
import { MatchesAPI } from "../service/api";

/**
 * Upcoming Matches Grid for NPL
 *
 * Features:
 * - Responsive masonry-style grid for upcoming matches
 * - Date filtering: shows tabs for the next 7 days
 * - Live countdown timer to match start
 * - Status states: Scheduled / Starting Soon / Live / Completed
 * - "Watch" CTA (if streamUrl provided) & "Reminder" button (Notification API)
 * - Accessible: proper roles, focus rings, alt text, semantic buttons
 * - Tailwind CSS required
 *
 * Props:
 * - matches: Array<{
 *     id: string | number
 *     date: string (ISO date "2025-11-20")
 *     startTime: string ("19:30" 24h local time)
 *     teams: Array<{ name: string; short: string; color?: string }>
 *     venue?: string
 *     streamUrl?: string
 *     status?: "scheduled" | "live" | "completed"
 *   }>
 * - onReminder: callback(match) when reminder set (optional)
 * - onWatch: callback(match) when watch clicked without streamUrl anchor (optional)
 *
 * Usage:
 * <Upcoming matches={data} />
 */

export default function Upcoming({
  matches = demoMatches(),
  onReminder,
  onWatch,
}) {
  const [apiMatches, setApiMatches] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const data = await MatchesAPI.list();
        setApiMatches(data);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const effectiveMatches = apiMatches && apiMatches.length ? apiMatches : matches;
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  // Build the next 7 day buckets (including today)
  const days = useMemo(() => {
    const arr = [];
    const now = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
      arr.push(d);
    }
    return arr;
  }, []);

  const filtered = useMemo(() => {
    const target = days[selectedDayIndex];
    const targetY = target.getFullYear();
    const targetM = target.getMonth();
    const targetD = target.getDate();
    return (effectiveMatches || []).filter((m) => {
      const dateParts = m.date.split("-").map((n) => parseInt(n, 10));
      if (dateParts.length !== 3) return false;
      return (
        dateParts[0] === targetY &&
        dateParts[1] - 1 === targetM &&
        dateParts[2] === targetD
      );
    });
  }, [effectiveMatches, days, selectedDayIndex]);

  return (
    <section
      id="upcoming"
      className="relative isolate bg-white py-16 text-gray-900"
      aria-labelledby="upcoming-title"
    >
      {/* Decorative background */}
      <BackdropDecor />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h2
              id="upcoming-title"
              className="text-3xl font-bold tracking-tight sm:text-4xl"
            >
              Upcoming Matches
            </h2>
            <p className="mt-2 max-w-xl text-sm text-gray-600 sm:text-base">
              Stay ahead with schedules, venues, and countdowns. Set reminders
              so you never miss the action.
            </p>
          </div>
          <DateTabs
            days={days}
            selected={selectedDayIndex}
            onSelect={setSelectedDayIndex}
          />
        </header>

        {/* Grid */}
        <div className="mt-10">
          {filtered.length === 0 ? (
            <EmptyState />
          ) : (
            <ul
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              aria-label="Upcoming match list"
            >
              {filtered.map((match) => (
                <li key={match._id || match.id}>
                  <MatchCard
                    match={match}
                    onReminder={onReminder}
                    onWatch={onWatch}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

/* -------------------- Sub Components -------------------- */

function BackdropDecor() {
  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10">
      <div className="absolute -top-32 left-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-rose-200/40 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-96 w-96 translate-x-1/3 translate-y-1/3 rounded-full bg-cyan-200/40 blur-3xl" />
      <div className="absolute inset-0 opacity-[0.05]">
        <svg
          className="h-full w-full text-gray-800/10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="diagLight" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width="20" height="40" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#diagLight)" />
        </svg>
      </div>
    </div>
  );
}

function DateTabs({ days, selected, onSelect }) {
  return (
    <div
      role="tablist"
      aria-label="Select match date"
      className="flex w-full gap-2 overflow-x-auto rounded-xl border border-gray-200 bg-gray-50 p-2"
    >
      {days.map((d, i) => {
        const is = i === selected;
        const label = formatDayLabel(d);
        return (
          <button
            key={d.toISOString()}
            role="tab"
            aria-selected={is}
            onClick={() => onSelect(i)}
            className={`relative flex shrink-0 flex-col items-start rounded-lg px-4 py-2 text-left transition ${
              is
                ? "bg-linear-to-r from-rose-600 to-red-600 text-white shadow ring-1 ring-rose-400/40"
                : "text-gray-600 hover:bg-white"
            }`}
          >
            <span className="text-xs uppercase tracking-wide opacity-80">
              {label.weekday}
            </span>
            <span className="text-sm font-semibold">{label.date}</span>
            {is && (
              <span className="absolute -bottom-1 left-4 h-1 w-8 rounded-full bg-amber-300/80" />
            )}
          </button>
        );
      })}
    </div>
  );
}

function formatDayLabel(d) {
  const weekday = d
    .toLocaleDateString(undefined, { weekday: "short" })
    .toUpperCase();
  const date = d.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
  });
  return { weekday, date };
}

function EmptyState() {
  return (
    <div className="rounded-3xl border border-gray-200 bg-gray-50 p-10 text-center">
      <div className="mx-auto h-16 w-16 rounded-full bg-linear-to-br from-[#D90429]/30 to-[#0B4F6C]/30 p-4">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-full w-full text-gray-600"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            d="M4 6h16M4 10h16M4 14h10M4 18h8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h3 className="mt-6 text-xl font-semibold">No Matches</h3>
      <p className="mt-2 text-sm text-gray-600">
        There are no scheduled matches for this date yet. Check back later or
        explore other days.
      </p>
    </div>
  );
}

function MatchCard({ match, onReminder, onWatch }) {
  const {
    date,
    startTime,
    teams = [],
    venue = "Venue TBA",
    streamUrl,
    status = "scheduled",
  } = match;

  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const startDate = useMemo(() => {
    const [h, m] = startTime.split(":").map((n) => parseInt(n, 10));
    const dParts = date.split("-").map((n) => parseInt(n, 10));
    return new Date(dParts[0], dParts[1] - 1, dParts[2], h, m, 0);
  }, [date, startTime]);

  const { diffMs, countdownLabel, state } = useCountdown(startDate, status, now);

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
      aria-label={`Match: ${teams[0]?.name || "TBD"} vs ${
        teams[1]?.name || "TBD"
      }`}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <span
          className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide ${
            state === "live"
              ? "bg-red-600 text-white"
              : state === "soon"
              ? "bg-amber-500 text-black"
              : state === "completed"
              ? "bg-emerald-600 text-white"
              : "bg-white/10 text-gray-300"
          }`}
        >
          {state === "live" && <PulseDot color="bg-white" />}
          {state === "soon" && <PulseDot color="bg-black" />}
          {state === "completed" && <PulseDot color="bg-white" />}
          {stateLabel(state)}
        </span>

        <time
            dateTime={`${date}T${startTime}:00`}
          className="text-xs font-medium text-gray-600"
        >
          {formatDisplayDate(startDate)} • {startTime}
        </time>
      </div>

      {/* Teams */}
      <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <TeamBlock team={teams[0]} side="left" />
        <span className="text-xs uppercase tracking-wide text-gray-500">
          VS
        </span>
        <TeamBlock team={teams[1]} side="right" />
      </div>

      {/* Venue */}
      <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            d="M12 2c3.866 0 7 3.134 7 7 0 5.25-7 13-7 13S5 14.25 5 9c0-3.866 3.134-7 7-7Z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {venue}
      </div>

      {/* Countdown */}
      <div className="mt-4">
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-medium text-gray-400">
            {state === "live"
              ? "Match in progress"
              : state === "completed"
              ? "Finished"
              : "Starts in"}
          </span>
          <span
            className={`text-sm font-semibold ${
                state === "live"
                  ? "text-red-600"
                  : state === "soon"
                  ? "text-amber-600"
                  : state === "completed"
                  ? "text-emerald-600"
                  : "text-amber-600"
              }`}
          >
            {countdownLabel}
          </span>
        </div>

        {state !== "completed" && (
          <ProgressBar
            totalMs={2 * 60 * 60 * 1000} // represent 2h window before start
            remainingMs={Math.min(diffMs, 2 * 60 * 60 * 1000)}
            state={state}
          />
        )}
      </div>

      {/* Actions */}
      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <WatchButton
          matchId={match._id || match.id}
          streamUrl={streamUrl}
          disabled={state === "completed"}
          onClick={() => !streamUrl && onWatch && onWatch(match)}
          state={state}
        />
        {state !== "live" && state !== "completed" && (
          <ReminderButton
            onSet={() => onReminder && onReminder(match)}
            match={match}
            startDate={startDate}
          />
        )}
      </div>
    </article>
  );
}

function PulseDot({ color = "bg-white" }) {
  return (
    <span className="relative flex h-2 w-2">
      <span className={`absolute h-full w-full animate-ping rounded-full ${color} opacity-75`} />
      <span className={`relative h-2 w-2 rounded-full ${color}`} />
    </span>
  );
}

function stateLabel(state) {
  switch (state) {
    case "live":
      return "LIVE";
    case "soon":
      return "SOON";
    case "completed":
      return "COMPLETED";
    default:
      return "SCHEDULED";
  }
}

function TeamBlock({ team, side }) {
  if (!team)
    return (
      <div className="flex items-center gap-2 opacity-40">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-white/10 text-xs font-bold">
          TBD
        </div>
        <span className="text-xs">TBD</span>
      </div>
    );
  return (
    <div
      className={`flex items-center gap-2 ${
        side === "right" ? "justify-end text-right" : ""
      }`}
    >
      {side === "left" && (
        <Badge short={team.short} color={team.color || "#0B4F6C"} />
      )}
      <div className="text-[13px] font-medium">{team.name}</div>
      {side === "right" && (
        <Badge short={team.short} color={team.color || "#D90429"} />
      )}
    </div>
  );
}

function Badge({ short, color }) {
  return (
    <div
      className="grid h-10 w-10 place-items-center rounded-lg text-xs font-extrabold text-white shadow ring-1 ring-white/20"
      style={{ backgroundColor: color }}
      aria-hidden="true"
    >
      {short || "??"}
    </div>
  );
}

function ProgressBar({ totalMs, remainingMs, state }) {
  const pct =
    state === "live" || state === "completed"
      ? 100
      : 100 - (remainingMs / totalMs) * 100;

  return (
    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
      <div
        className={`h-full transition-all ${
          state === "live"
            ? "bg-red-500"
            : state === "soon"
            ? "bg-amber-400"
            : "bg-linear-to-r from-[#D90429] via-rose-500 to-amber-300"
        }`}
        style={{ width: `${Math.min(Math.max(pct, 3), 100)}%` }}
      />
    </div>
  );
}

import { Link } from "react-router-dom";

function WatchButton({ matchId, streamUrl, disabled, onClick, state }) {
  const Tag = streamUrl ? "a" : "button";
  const baseStyle =
    "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/60";

  const live = state === "live";
  const className = `${baseStyle} ${
    disabled
      ? "cursor-not-allowed bg-gray-100 text-gray-400"
      : live
      ? "bg-linear-to-r from-red-600 to-rose-600 text-white shadow hover:from-rose-600 hover:to-red-600"
      : "bg-linear-to-r from-rose-600 to-red-600 text-white shadow hover:from-red-600 hover:to-rose-600"
  }`;

  if (streamUrl && matchId) {
    return (
      <Link to={`/watch/${matchId}`} className={className}>
        <PlayIcon className="h-4 w-4" />
        {live ? "Watch Live" : "Watch"}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={className}>
      <PlayIcon className="h-4 w-4" />
      {live ? "Watch Live" : "Watch"}
    </button>
  );
}

function ReminderButton({ onSet, match, startDate }) {
  const [granted, setGranted] = useState(
    typeof Notification !== "undefined" &&
      Notification.permission === "granted"
  );
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleReminder = async () => {
    if (done) return;
    setLoading(true);
    try {
      if (typeof Notification !== "undefined") {
        if (Notification.permission === "default") {
          await Notification.requestPermission();
        }
        if (Notification.permission === "granted") {
          setGranted(true);
          // Simple immediate browser notification as demo.
            new Notification("Reminder Set", {
            body: `You will be reminded before ${match.teams[0]?.short} vs ${match.teams[1]?.short} starts.`,
            tag: `match-${match.id}`,
          });
        }
      }
      onSet && onSet(match);
      setDone(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleReminder}
      disabled={done || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
        done
          ? "cursor-not-allowed border-emerald-400/30 bg-emerald-500/20 text-emerald-300"
          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
      }`}
      title="Set reminder before match starts"
    >
      {done ? (
        <>
          <CheckIcon className="h-4 w-4" />
          Reminder Set
        </>
      ) : loading ? (
        <>
          <Spinner className="h-4 w-4" />
          Setting...
        </>
      ) : (
        <>
          <BellIcon className="h-4 w-4" />
          Reminder
        </>
      )}
    </button>
  );
}

/* -------------------- Hooks & Utilities -------------------- */

function useCountdown(startDate, status, now) {
  const diffMs = startDate - now;
  const abs = Math.max(diffMs, 0);

  if (status === "completed") {
    return { diffMs, countdownLabel: "Ended", state: "completed" };
  }
  if (status === "live") {
    return { diffMs, countdownLabel: "In Progress", state: "live" };
  }

  // Determine dynamic state
  let state = "scheduled";
  if (diffMs <= 0) {
    state = "live";
    return { diffMs, countdownLabel: "Starting", state };
  } else if (diffMs <= 10 * 60 * 1000) {
    state = "soon";
  }

  const seconds = Math.floor(abs / 1000) % 60;
  const minutes = Math.floor(abs / (60 * 1000)) % 60;
  const hours = Math.floor(abs / (60 * 60 * 1000));

  const countdownLabel =
    hours > 0
      ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
      : `${pad(minutes)}:${pad(seconds)}`;

  return { diffMs, countdownLabel, state };
}

function pad(n) {
  return n.toString().padStart(2, "0");
}

function formatDisplayDate(d) {
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

/* -------------------- Icons -------------------- */

function PlayIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M4 4.5v11l11-5.5-11-5.5z" />
    </svg>
  );
}

function BellIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden="true"
    >
      <path
        d="M12 22c1.1 0 2-.9 2-2h-4a2 2 0 0 0 2 2ZM18 8a6 6 0 1 0-12 0c0 7-3 8-3 8h18s-3-1-3-8Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden="true"
    >
      <path
        d="M5 13l4 4L19 7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Spinner({ className = "" }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeOpacity="0.2"
        strokeWidth="4"
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

/* -------------------- Demo Data (replace with real API) -------------------- */

function demoMatches() {
  const today = new Date();
  const iso = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;

  const make = (offsetDays, startTime, id, t1, t2, venue, streamUrl) => {
    const d = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + offsetDays
    );
    return {
      id,
      date: iso(d),
      startTime,
      teams: [
        { name: t1.name, short: t1.short, color: t1.color },
        { name: t2.name, short: t2.short, color: t2.color },
      ],
      venue,
      streamUrl,
      status: "scheduled",
    };
  };

  return [
    make(
      0,
      "19:30",
      "m1",
      { name: "Kathmandu Kings", short: "KK", color: "#0B4F6C" },
      { name: "Pokhara Warriors", short: "PW", color: "#D90429" },
      "TU Cricket Ground",
      "#live"
    ),
    make(
      0,
      "15:00",
      "m2",
      { name: "Biratnagar Challengers", short: "BC", color: "#146C94" },
      { name: "Chitwan Rhinos", short: "CR", color: "#B20600" },
      "Mulpani Stadium",
      null
    ),
    make(
      1,
      "14:00",
      "m3",
      { name: "Lalitpur Patriots", short: "LP", color: "#064663" },
      { name: "Butwal Blazers", short: "BB", color: "#B31312" },
      "Pokhara Stadium",
      null
    ),
    make(
      2,
      "13:30",
      "m4",
      { name: "Janakpur Giants", short: "JG", color: "#0B4F6C" },
      { name: "Dhangadhi Stars", short: "DS", color: "#D90429" },
      "TU Cricket Ground",
      "#live"
    ),
    make(
      3,
      "16:00",
      "m5",
      { name: "Bhaktapur Titans", short: "BT", color: "#1D5B79" },
      { name: "Dang Daredevils", short: "DD", color: "#B80000" },
      "Mulpani Stadium",
      null
    ),
    make(
      4,
      "18:00",
      "m6",
      { name: "Lumbini Rangers", short: "LR", color: "#0B4F6C" },
      { name: "Kaski Falcons", short: "KF", color: "#D90429" },
      "Pokhara Stadium",
      "#live"
    ),
  ];
}