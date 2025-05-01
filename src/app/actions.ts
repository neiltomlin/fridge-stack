'use server';
import { auth } from '~/server/auth';
import { contents, users } from '~/server/db/schema';
import { db } from '~/server/db';
import { eq } from 'drizzle-orm';
import { type FridgeCategory } from './constants';

export const makeMeAdmin = async ({ email }: { email: string }) => {
  // Update a specific user's field
  await db.update(users).set({ isAdmin: true }).where(eq(users.email, email));
};

export const addToFridge = async ({
  name,
  category,
  expiryDate,
  quantity,
}: {
  name: string;
  category: FridgeCategory;
  expiryDate: Date;
  quantity: number;
}) => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Not authenticated');
  }

  await db.insert(contents).values({
    name: name,
    category: category,
    addedById: session.user.id,
    expiryDate: expiryDate,
    quantity: quantity,
  });
};

export const deleteFromFridge = async ({ id }: { id: number }) => {
  await db.delete(contents).where(eq(contents.id, id));
};
