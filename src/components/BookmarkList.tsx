// src/components/BookmarkList.tsx
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

export function BookmarkList({
  bookId,
  chapter,
  onSeek,
}: {
  bookId: Id<"books">;
  chapter: number;
  onSeek: (seconds: number) => void;
}) {
  const bookmarks = useQuery(api.bookmarks.listByChapter, { bookId, chapter });
  const removeBookmark = useMutation(api.bookmarks.remove);

  if (bookmarks === undefined) return <p>Loading…</p>;

  return (
    <section>
      <h3>BOOKMARKS ({bookmarks.length})</h3>
      <ul>
        {bookmarks.map((b) => (
          <li key={b._id}>
            <button onClick={() => onSeek(b.time)}>▶ {formatTime(b.time)}</button>
            <span>{b.note ? `"${b.note}"` : "(no note)"}</span>
            <button onClick={() => removeBookmark({ id: b._id })}>🗑</button>
          </li>
        ))}
      </ul>
      <small>{bookmarks.length} / 30 used</small>
    </section>
  );
}

const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
