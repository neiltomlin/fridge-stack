import { eq } from "drizzle-orm";
import { db } from ".";
import { users } from "./schema";

async function seed() {
  // Update a specific user's field
  await db
    .update(users)
    .set({ isAdmin: true })
    .where(eq(users.email, "neilfoxholes@hotmail.com"));
}

seed()
  .then(() => {
    console.log("Seeding completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error seeding database:", error);
    process.exit(1);
  });
