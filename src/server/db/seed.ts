import { eq } from 'drizzle-orm';
import { db } from '.';
import { contents, users } from './schema';
import { getItemsToInsert } from './seedData';

async function seed() {
  // Update a specific user's field
  await db.update(users).set({ isAdmin: true }).where(eq(users.email, 'neilfoxholes@hotmail.com'));

  // Seed contents after making sure admin is set
  await seedContents();
}

// Export the seedContents function so it can be used in server actions
export async function seedContents() {
  // Get all users to assign items to
  const allUsers = await db.select().from(users);
  if (allUsers.length === 0) {
    console.log('No users found to assign items to. Skipping content seeding.');
    return;
  }

  // Get first user as default owner
  const defaultUser = allUsers[0];

  if (!defaultUser) {
    console.log('No default user found. Skipping content seeding.');
    return;
  }

  // Delete existing contents to avoid duplicates on reseeding
  // eslint-disable-next-line drizzle/enforce-delete-with-where
  await db.delete(contents);

  const itemsToInsert = getItemsToInsert(defaultUser.id);

  // Insert all items
  await db.insert(contents).values(itemsToInsert);
  console.log(`Added ${itemsToInsert.length} items to contents table`);

  return itemsToInsert.length;
}

// Helper function to add days to current date
export function addDaysToNow(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

// Only run the seed function if this file is executed directly
if (require.main === module) {
  seed()
    .then(() => {
      console.log('Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error seeding database:', error);
      process.exit(1);
    });
}
