// src/components/TrackHeader.tsx
import { useState } from "react";
import { useQuery } from "convex/react";
import { ChevronDown, Music, Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

function formatTime(totalSeconds: number) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = h > 0 ? String(m).padStart(2, "0") : String(m);
  return `${h > 0 ? `${h}:` : ""}${mm}:${String(sec).padStart(2, "0")}`;
}

const controlBtn =
  "flex h-11 w-11 items-center justify-center rounded-full text-zinc-300 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 disabled:opacity-30 disabled:hover:bg-transparent";

export function TrackHeader({ bookId }: { bookId: Id<"books"> }) {
  const book = useQuery(api.books.get, { id: bookId });
  const progress = useQuery(api.progress.get, { bookId });

  // Local UI state only. Wire these to your <audio> element / mutations.
  const [isPlaying, setIsPlaying] = useState(false);
  const [chapterIndex, setChapterIndex] = useState(0);

  if (book === undefined) {
    return (
      <div className="mx-auto w-full max-w-md animate-pulse rounded-3xl bg-zinc-900 p-6" aria-busy="true">
        <div className="aspect-square w-full rounded-2xl bg-zinc-800" />
        <div className="mt-6 h-6 w-3/4 rounded bg-zinc-800" />
        <div className="mt-3 h-4 w-1/2 rounded bg-zinc-800" />
        <div className="mt-8 h-1.5 w-full rounded-full bg-zinc-800" />
      </div>
    );
  }

  if (book === null) {
    return (
      <div className="mx-auto w-full max-w-md rounded-3xl bg-zinc-900 p-6 text-center text-zinc-400">
        This book no longer exists or you don’t have access to it.
      </div>
    );
  }

  const position = Math.min(progress?.position ?? 0, book.durationSeconds);
  const percent = book.durationSeconds > 0 ? (position / book.durationSeconds) * 100 : 0;
  const lastChapter = book.chapters.length - 1;

  return (
    <header className="mx-auto w-full max-w-md overflow-hidden rounded-3xl bg-zinc-900 text-zinc-100 shadow-2xl ring-1 ring-white/10">
      {/* Artwork */}
      <div className="relative p-6 pb-0">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-zinc-800 shadow-xl ring-1 ring-white/10">
          {book.coverUrl ? (
            <img src={book.coverUrl} alt={`Cover of ${book.title}`} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-zinc-600">
              <Music className="h-16 w-16" aria-hidden />
            </div>
          )}
          {book.isUnabridged && (
            <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
              Unabridged
            </span>
          )}
        </div>
      </div>

      {/* Title block */}
      <div className="px-6 pt-6">
        <h2 className="truncate text-xl font-semibold tracking-tight text-white">{book.title}</h2>
        <p className="mt-1 truncate text-sm text-zinc-400">{book.author}</p>
        <p className="truncate text-xs text-zinc-500">Read by {book.narrator}</p>
      </div>

      {/* Progress */}
      <div className="px-6 pt-6">
        <div
          role="progressbar"
          aria-label="Listening progress"
          aria-valuemin={0}
          aria-valuemax={book.durationSeconds}
          aria-valuenow={position}
          aria-valuetext={`${formatTime(position)} of ${formatTime(book.durationSeconds)}`}
          className="h-1.5 w-full overflow-hidden rounded-full bg-white/10"
        >
          <div className="h-full rounded-full bg-indigo-400" style={{ width: `${percent}%` }} />
        </div>
        <div className="mt-2 flex justify-between text-xs tabular-nums text-zinc-500">
          <span>{formatTime(position)}</span>
          <span>-{formatTime(book.durationSeconds - position)}</span>
        </div>
      </div>

      {/* Transport controls */}
      <div className="flex items-center justify-center gap-4 px-6 pt-3">
        <button
          type="button"
          className={controlBtn}
          aria-label="Previous chapter"
          disabled={chapterIndex <= 0}
          onClick={() => setChapterIndex((i) => Math.max(0, i - 1))}
        >
          <SkipBack className="h-5 w-5" fill="currentColor" aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => setIsPlaying((p) => !p)}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-zinc-950 shadow-lg transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 active:scale-95"
        >
          {isPlaying ? (
            <Pause className="h-6 w-6" fill="currentColor" aria-hidden />
          ) : (
            <Play className="ml-0.5 h-6 w-6" fill="currentColor" aria-hidden />
          )}
        </button>
        <button
          type="button"
          className={controlBtn}
          aria-label="Next chapter"
          disabled={chapterIndex >= lastChapter}
          onClick={() => setChapterIndex((i) => Math.min(lastChapter, i + 1))}
        >
          <SkipForward className="h-5 w-5" fill="currentColor" aria-hidden />
        </button>
      </div>

      {/* Chapter picker */}
      <div className="p-6 pt-5">
        <label htmlFor={`chapter-${bookId}`} className="sr-only">
          Chapter
        </label>
        <div className="relative">
          <select
            id={`chapter-${bookId}`}
            value={chapterIndex}
            onChange={(e) => setChapterIndex(Number(e.target.value))}
            className="w-full appearance-none rounded-xl bg-white/5 py-3 pl-4 pr-10 text-sm text-zinc-200 ring-1 ring-white/10 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
          >
            {book.chapters.map((c, i) => (
              <option key={i} value={i} className="bg-zinc-900">
                {c.title}
              </option>
            ))}
          </select>
          <ChevronDown
            aria-hidden
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
          />
        </div>
      </div>
    </header>
  );
}
