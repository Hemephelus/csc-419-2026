// src/components/AddBookmarkButton.tsx
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { Button } from "../../components/ui/button";
const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export function AddBookmarkButton({
  bookId,
  chapter,
  time,
}: {
  bookId: Id<"books">;
  chapter: number;
  time: number;
}) {
  const addBookmark = useMutation(api.bookmarks.add);

  const handleClick = async () => {
    try {
      await addBookmark({ bookId, chapter, time });
    } catch (err) {
      if (err instanceof ConvexError)
        alert(err.data); // "Max 10 bookmarks per chapter"
      else throw err;
    }
  };

  return <Button onClick={handleClick}>🔖 {formatTime(time)}</Button>;
}
