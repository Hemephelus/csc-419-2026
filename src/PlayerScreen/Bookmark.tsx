export function BookmarkNote({ note }: { note?: string }) {
  return note ? <span>"{note}"</span> : <em>(no note)</em>;
}
