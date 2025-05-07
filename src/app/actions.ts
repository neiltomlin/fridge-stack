'use server';
import { eq } from 'drizzle-orm';
import { auth } from '~/server/auth';
import { contents, users } from '~/server/db/schema';
import { db } from '~/server/db';
import { seedContents } from '~/server/db/seed';
import { type FridgeCategory } from './constants';
import { OpenAI } from 'openai';
import { env } from '~/env';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

export type OpenAIReceiptResponse = {
  foodItems: {
    item: string;
    receiptName: string;
    quantity: string;
    expiresIn: number;
    category: string;
  }[];
  nonFoodItems: {
    item: string;
  }[];
};

export type ExtractedIngredient = {
  name: string;
  category: FridgeCategory;
  quantity: number;
  expiryDays?: number;
};

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

export const emptyFridge = async () => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Not authenticated');
  }

  // Delete all contents belonging to the current user
  await db.delete(contents).where(eq(contents.addedById, session.user.id));

  return { success: true, message: 'All items have been removed from your fridge.' };
};

export const seedFridge = async () => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Not authenticated');
  }

  // Check if user is admin
  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });

  if (!user?.isAdmin) {
    throw new Error('Only admins can seed the fridge');
  }

  // Use the seedContents function from our seed file
  const itemsAdded = await seedContents();
  return { success: true, message: `Seeded fridge with ${itemsAdded} items` };
};

export const scanReceipt = async (imageBase64: string): Promise<OpenAIReceiptResponse> => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Not authenticated');
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are receiving an image a user has submitted of one or more receipts from a supermarket shop so that you can assist them entering food and drink items into a system that helps them reduce food waste by prioritising consuming or using items that expire fist. You will check the items bought on the receipt and return a JSON array of items in the following typescript valid format:
\`\`\`typescript
type OpenAIReceiptResponse = {
  foodItems: {
      item: string;
     receiptName: string;
      quantity: string;
      expiresIn: number;
      category: string;
    }[];
    nonFoodItems:  {
      item: string;
    }[];
}
\`\`\`

For every item on the receipt, convert the name into a simple, readable string that accurately reflects what the item is, e.g. HNY NUT FLAKES should be "cereal"

Household goods, toiletries, or other non-food items should be  .
          For each food item, determine:
          1. Name (standardized, not brand names)
          2. Receipt name (the original name found on the receipt)
          3. Most appropriate category from this list: 'beverage',
  'bread',
  'cheese',
  'condiments',
  'cooking sauces',
  'dairy',
  'deli',
  'desserts',
  'eggs',
  'fruit',
  'herbs',
  'leftovers',
  'meat',
  'prepared meals',
  'seafood',
  'snacks',
  'vegetable',
  'miscellaneous',
          4. Quantity (as a number)
          5. Expires in: estimate of number of days until the Best before or Expiry date (based on food type, e.g., milk ~7 days, bread ~5 days, fresh vegetables ~7 days, etc.)
`,
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Extract all food items from this receipt:' },
            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageBase64}` } },
          ],
        },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 4000,
    });

    const content = response.choices[0]?.message.content ?? '{"items":[]}';
    const parsedData = JSON.parse(content) as OpenAIReceiptResponse;

    return parsedData || [];
  } catch (error) {
    console.error('Error scanning receipt:', error);
    throw new Error('Failed to scan receipt. Please try again.');
  }
};

export const addExtractedItemsToFridge = async (extractedItems: ExtractedIngredient[]) => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Not authenticated');
  }

  const today = new Date();
  const results = [];

  for (const item of extractedItems) {
    // Calculate expiry date if provided
    let expiryDate = null;
    if (item.expiryDays) {
      expiryDate = new Date(today);
      expiryDate.setDate(today.getDate() + item.expiryDays);
    }

    try {
      await db.insert(contents).values({
        name: item.name,
        category: item.category,
        addedById: session.user.id,
        expiryDate: expiryDate,
        quantity: item.quantity || 1,
      });
      results.push({ success: true, item: item.name });
    } catch (error) {
      results.push({ success: false, item: item.name, error });
    }
  }

  return results;
};
