// convex/progress.ts
import { query, mutation } from "./_generated/server";
import { v, ConvexError } from "convex/values";

export const get = query({
  args: { bookId: v.id("books") },
  handler: async (ctx, { bookId }) => {
    // const identity = await ctx.auth.getUserIdentity();
    // if (!identity) return [];
    const userId = "userId419";

    return await ctx.db
      .query("playbackProgress")
      .withIndex("by_user_book", (q) => q.eq("userId", userId).eq("bookId", bookId))
      .unique(); // at most one row per user+book
  },
});

// "Upsert": update if a row exists, insert if not.
export const save = mutation({
  args: { bookId: v.id("books"), position: v.number(), speed: v.number() },
  handler: async (ctx, args) => {
    // const identity = await ctx.auth.getUserIdentity();
    // if (!identity) return [];
    const userId = "userId419";

    const book = await ctx.db.get(args.bookId);
    if (!book) throw new ConvexError("Book not found");

    const data = {
      // Never trust the client: clamp to the real duration.
      position: Math.min(Math.max(args.position, 0), book.durationSeconds),
      speed: Math.min(Math.max(args.speed, 0.5), 3),
      updatedAt: Date.now(),
    };

    const existing = await ctx.db
      .query("playbackProgress")
      .withIndex("by_user_book", (q) => q.eq("userId", userId).eq("bookId", args.bookId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, data);
    } else {
      await ctx.db.insert("playbackProgress", { userId, bookId: args.bookId, ...data });
    }
  },
});
