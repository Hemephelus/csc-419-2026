// convex/bookmarks.ts
import { query, mutation } from "./_generated/server";
import { v, ConvexError } from "convex/values";

const MAX_PER_CHAPTER = 30;
const MAX_NOTE_LENGTH = 100;

export const listByChapter = query({
  args: { bookId: v.id("books"), chapter: v.number() },
  handler: async (ctx, { bookId, chapter }) => {
    // const identity = await ctx.auth.getUserIdentity();
    // if (!identity) return [];
    const userId = "userId419";

    return await ctx.db
      .query("bookmarks")
      .withIndex("by_user_book_chapter_time", (q) =>
        q.eq("userId", userId).eq("bookId", bookId).eq("chapter", chapter),
      )
      .collect(); // already sorted by time
  },
});

export const add = mutation({
  args: {
    bookId: v.id("books"),
    chapter: v.number(),
    time: v.number(),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // const identity = await ctx.auth.getUserIdentity();
    // if (!identity) throw new ConvexError("Not signed in");
    const userId = "userId419";

    const book = await ctx.db.get(args.bookId);
    if (!book) throw new ConvexError("Book not found");

    const existing = await ctx.db
      .query("bookmarks")
      .withIndex("by_user_book_chapter_time", (q) =>
        q.eq("userId", userId).eq("bookId", args.bookId).eq("chapter", args.chapter),
      )
      .collect();

    if (existing.length >= MAX_PER_CHAPTER) {
      throw new ConvexError(`Max ${MAX_PER_CHAPTER} bookmarks per chapter`);
    }

    return await ctx.db.insert("bookmarks", {
      userId,
      bookId: args.bookId,
      chapter: args.chapter,
      time: args.time,
      note: args.note?.slice(0, MAX_NOTE_LENGTH),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("bookmarks") },
  handler: async (ctx, { id }) => {
    // const identity = await ctx.auth.getUserIdentity();
    // if (!identity) throw new ConvexError("Not signed in");
    const userId = "userId419";

    const bookmark = await ctx.db.get(id);
    if (!bookmark || bookmark.userId !== userId) {
      throw new ConvexError("Not found");
    }
    await ctx.db.delete(id);
  },
});
