import React, { useEffect, useState, useRef } from "react";
import { MatchesAPI } from "../service/api";

/**
 * Simplified Live Stream Component (Minimal)
 * -----------------------------------------
 * Shows ONLY:
 * - Live badge
 * - Match title (optional)
 * - Player area (iframe / custom node / placeholder)
 * - Controls: Play/Pause (placeholder), Quality select, Volume, Fullscreen trigger
 * - Connection indicator + Viewer count
 *
 * Removed:
 * - Scoreboard
 * - Scorecard
 * - Commentary
 * - Stats
 * - Playing XI
 * - Side panels
 * - Tabs
 *
 * Props:
 * - title?: string
 * - embedUrl?: string          // iframe stream source
 * - embedHTML?: string         // raw HTML for player
 * - streamNode?: ReactNode     // supply your own player component
 * - qualities?: string[]       // e.g. ["1080p","720p","480p"]
 * - defaultQuality?: string
 * - onChangeQuality?: (q) => void
 * - onToggleFullScreen?: () => void
 * - viewers?: number
 * - connection?: "excellent"|"good"|"fair"|"poor"
 * - live?: boolean             // live state toggle
 *
 * Usage:
 * <Live title="Kathmandu Kings vs Pokhara Warriors" embedUrl="https://example.com/embed" />
 */

export default function Live({
  title: titleProp,
  embedUrl: embedUrlProp,
  embedHTML,
  streamNode,
  qualities = ["1080p", "720p", "480p"],
  defaultQuality,
  onChangeQuality,
  onToggleFullScreen,
  viewers = 0,
  connection = "excellent",
  live: liveProp,
}) {
  const [quality, setQuality] = useState(defaultQuality || qualities[0]);
  const [paused, setPaused] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const playerRef = useRef(null);
  const [liveMatch, setLiveMatch] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const list = await MatchesAPI.list();
        const current = list.find((m) => m.status === 'live');
        setLiveMatch(current || null);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  // Example fullscreen logic if not provided
  const handleFullscreen = () => {
    if (onToggleFullScreen) {
      onToggleFullScreen();
      return;
    }
    const el = playerRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      el.requestFullscreen?.();
    }
  };

  const handleQualityChange = (q) => {
    setQuality(q);
    onChangeQuality && onChangeQuality(q);
    // Hook into your player API if needed
  };

  // Placeholder play/pause toggle (for custom player integration)
  const togglePlay = () => {
    setPaused((p) => !p);
    // Integrate with video element if you pass streamNode (e.g. HTMLVideoElement)
  };

  const title = titleProp || (liveMatch ? `${liveMatch?.teams?.[0]?.name || 'Team A'} vs ${liveMatch?.teams?.[1]?.name || 'Team B'}` : 'Nepal Premier League Live');
  const embedUrl = embedUrlProp || liveMatch?.streamUrl;
  const isLive = liveProp ?? Boolean(liveMatch);

  return (
    <section
      id="live"
      className="relative isolate bg-white text-gray-900 py-10"
      aria-label="Live Stream"
    >
      <BackgroundDecor />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <LiveBadge live={isLive} />
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
            <p className="text-sm text-gray-600">
              Watch the action unfold in real time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <ConnectionIndicator connection={connection} />
            <ViewerCount viewers={viewers} />
            <QualitySelector
              qualities={qualities}
              value={quality}
              onChange={handleQualityChange}
            />
          </div>
        </header>

        {/* Player */}
        <div
          ref={playerRef}
          className="relative aspect-video w-full overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl ring-1 ring-white/10"
        >
          {/* Content */}
          {streamNode ? (
            streamNode
          ) : embedHTML ? (
            <div
              className="h-full w-full"
              dangerouslySetInnerHTML={{ __html: embedHTML }}
            />
          ) : embedUrl ? (
            <iframe
              src={embedUrl}
              title="Live Stream"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-4 text-white/70">
              <PlayIcon className="h-12 w-12 text-white/40" />
              <p className="text-sm">
                Live stream placeholder (Quality:{" "}
                <span className="text-amber-300">{quality}</span>)
              </p>
            </div>
          )}

          {/* Bottom gradient overlay */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/70 via-black/10 to-transparent" />

          {/* Controls */}
          <div className="absolute left-0 right-0 bottom-0 p-4">
            <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-black/50 px-4 py-3 backdrop-blur-md ring-1 ring-white/10">
              <ControlButton
                onClick={togglePlay}
                label={paused ? "Play" : "Pause"}
                icon={
                  paused ? (
                    <PlayIcon className="h-4 w-4" />
                  ) : (
                    <PauseIcon className="h-4 w-4" />
                  )
                }
              />
              <VolumeSlider
                value={volume}
                onChange={setVolume}
                className="w-40"
              />
              <div className="ml-auto flex items-center gap-2">
                <ControlButton
                  onClick={handleFullscreen}
                  label="Fullscreen"
                  icon={<FullscreenIcon className="h-4 w-4" />}
                />
              </div>
            </div>
          </div>

          {/* Floating live pulse (top-left) */}
          {isLive && (
            <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-red-600/90 px-3 py-1 text-xs font-semibold shadow">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
              </span>
              LIVE
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Background ---------------- */
function BackgroundDecor() {
  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10">
      <div className="absolute -top-24 left-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-rose-200/40 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-96 w-96 translate-x-1/3 translate-y-1/3 rounded-full bg-cyan-200/40 blur-3xl" />
      <div className="absolute inset-0 opacity-[0.05]">
        <svg
          className="h-full w-full text-gray-800/10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="gridLiveSimpleLight" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M40 0H0v40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#gridLiveSimpleLight)" />
        </svg>
      </div>
    </div>
  );
}

/* ---------------- Badges & Indicators ---------------- */
function LiveBadge({ live }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-1 text-sm text-gray-900 shadow-sm">
      <span className="relative flex h-2.5 w-2.5">
        <span
          className={`absolute inline-flex h-full w-full rounded-full ${
            live ? "animate-ping bg-red-400/80" : "bg-gray-400/40"
          } opacity-75`}
        />
        <span
          className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
            live ? "bg-red-600" : "bg-gray-400"
          }`}
        />
      </span>
      {live ? "Live Stream" : "Standby"}
    </div>
  );
}

function ConnectionIndicator({ connection }) {
  const map = {
    excellent: { label: "Excellent", bars: 4 },
    good: { label: "Good", bars: 3 },
    fair: { label: "Fair", bars: 2 },
    poor: { label: "Poor", bars: 1 },
  };
  const data = map[connection] || map.good;
  return (
    <div
      className="flex items-center gap-1 rounded-full border border-gray-300 bg-white px-3 py-1 text-xs text-gray-700 shadow-sm"
      title="Connection quality"
    >
      <span className="flex gap-0.5">
        {[1, 2, 3, 4].map((n) => (
          <span
            key={n}
            className={`h-3 w-1.5 rounded-sm ${
              n <= data.bars ? "bg-emerald-400" : "bg-gray-600"
            }`}
          />
        ))}
      </span>
      {data.label}
    </div>
  );
}

function ViewerCount({ viewers }) {
  return (
    <div
      className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-1 text-xs text-gray-700 shadow-sm"
      title="Current viewers"
    >
      <EyeIcon className="h-4 w-4" />
      {Intl.NumberFormat().format(viewers)}
    </div>
  );
}

function QualitySelector({ qualities, value, onChange }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none rounded-full border border-gray-300 bg-white px-3 py-1 pr-7 text-xs text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/50"
        title="Select quality"
      >
        {qualities.map((q) => (
          <option key={q} value={q} className="bg-[#0C0F14]">
            {q}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-[10px]">
        ▼
      </span>
    </div>
  );
}

/* ---------------- Controls ---------------- */
function ControlButton({ onClick, label, icon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/50"
      title={label}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function VolumeSlider({ value, onChange, className = "" }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <VolumeIcon className="h-4 w-4 text-white/70" />
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded bg-white/10 accent-rose-500"
        title="Volume"
      />
    </div>
  );
}

/* ---------------- Icons ---------------- */
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
function PauseIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M6 4h3v12H6V4zm5 0h3v12h-3V4z" />
    </svg>
  );
}
function VolumeIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.7"
      fill="none"
    >
      <path
        d="M4 14v-4h4l5-5v18l-5-5H4Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 9.5c.9.9.9 4.1 0 5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.5 7c2.2 2.2 2.2 8.8 0 11"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function FullscreenIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.7"
      fill="none"
    >
      <path
        d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function EyeIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.7"
      fill="none"
    >
      <path
        d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}