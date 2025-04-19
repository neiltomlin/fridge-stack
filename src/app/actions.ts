"use server";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export const makeMeAdmin = async ({ email }: { email: string }) => {
  // Update a specific user's field
  await db.update(users).set({ isAdmin: true }).where(eq(users.email, email));
};
