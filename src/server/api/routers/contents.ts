import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { contents } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export const contentsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const contents = await ctx.db.query.contents.findMany();

    return contents ?? null;
  }),

  getByCategory: protectedProcedure
    .input(z.object({ category: z.string() }))
    .query(async ({ ctx, input }) => {
      const contents = await ctx.db.query.contents.findMany({
        where: (contents, { eq }) => eq(contents.category, input.category),
      });

      return contents ?? null;
    }),

  add: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        category: z.string(),
        expiryDate: z.date().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(contents).values({
        name: input.name,
        category: input.category,
        addedById: ctx.session.user.id,
        expiryDate: input.expiryDate,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(contents).where(eq(contents.id, input.id));
    }),
});
