// convex/books.ts
import { paginationOptsValidator } from "convex/server";
import { query, internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: { id: v.id("books") },
  handler: async (ctx, { id }) => {
    const book = await ctx.db.get(id);
    if (!book) return null;

    const coverUrl = book.coverStorageId ? await ctx.storage.getUrl(book.coverStorageId) : null;

    return { ...book, coverUrl };
  },
});

// Seed one book for development. Run: npx convex run books:seed
export const seed = internalMutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.insert("books", {
      title: "The Science of Deduction",
      author: "Arthur Conan Doyle",
      narrator: "Stephen Fry",
      isUnabridged: true,
      durationSeconds: 2100, // 35:00
      chapters: [
        { title: "Chapter 1", startTime: 0 },
        { title: "Chapter 2", startTime: 600 },
        { title: "Chapter 3", startTime: 1500 },
      ],
    });
  },
});

export const listWithProgress = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    // const books = await ctx.db.query("books").collect();
    const paginationRes = await ctx.db.query("books").paginate(args.paginationOpts);
    const books = paginationRes.page;

    const booksProgressList = await Promise.all(
      books.map(async (book) => {
        const progress = identity
          ? await ctx.db
              .query("playbackProgress")
              .withIndex("by_user_book", (q) =>
                q.eq("userId", identity.tokenIdentifier).eq("bookId", book._id),
              )
              .unique()
          : null;

        return { ...book, position: progress?.position ?? 0 };
      }),
    );

    return { ...paginationRes, page: booksProgressList };
  },
});
