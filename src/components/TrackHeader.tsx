// src/components/TrackHeader.tsx
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

export function TrackHeader({ bookId }: { bookId: Id<"books"> }) {
  const book = useQuery(api.books.get, { id: bookId });
  //   const progress = useQuery(api.progress.get, { bookId });

  if (book === undefined) return <p>Loading…</p>; // undefined = still loading
  if (book === null) return <p>Book not found</p>; // null = loaded, doesn't exist

  return (
    <header>
      {book.coverUrl && <img src={book.coverUrl} alt={book.title} />}
      {book.isUnabridged && <span>UNABRIDGED</span>}
      <h2>{book.title}</h2>
      <p>
        {book.author} • Read by {book.narrator}
      </p>
      {/* <p>
        Resume at {progress?.position ?? 0} seconds of {book.durationSeconds} seconds
      </p> */}
      <select>
        {book.chapters.map((c, i) => (
          <option key={i} value={i}>
            {c.title}
          </option>
        ))}
      </select>
    </header>
  );
}
