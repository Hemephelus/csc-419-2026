// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Table 1: the catalooneg. Shared by all users.
  books: defineTable({
    title: v.string(),
    author: v.string(),
    narrator: v.string(),
    isUnabridged: v.boolean(),
    durationSeconds: v.number(),
    coverStorageId: v.optional(v.id("_storage")), // Convex file storage
    chapters: v.array(v.object({ title: v.string(), startTime: v.number() })),
  }),

  // Table 2:  row per user per book.
  playbackProgress: defineTable({
    userId: v.string(),
    bookId: v.id("books"),
    position: v.number(), // seconds
    speed: v.number(), // 1.0, 1.25, ...
    updatedAt: v.number(),
  }).index("by_user_book", ["userId", "bookId"]),

  // Table 3: many rows per user per book.
  bookmarks: defineTable({
    userId: v.string(),
    bookId: v.id("books"),
    chapter: v.number(),
    time: v.number(), // seconds
    note: v.optional(v.string()),
  }).index("by_user_book_chapter_time", ["userId", "bookId", "chapter", "time"]),
});
