import { OpenAI } from 'openai';
import { env } from '~/env';
import dayjs from 'dayjs';
import type { FridgeCategory } from '~/app/constants';

// Define OpenAI response structure
interface OpenAIRecipeResponse {
  recipes: Array<{
    title: string;
    ingredients: string[];
    instructions: string[];
    description: string;
  }>;
}

// Initialize OpenAI client with proper type assertion
const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY as string,
});

// Define the content type expected from the fridge
type FridgeContent = {
  id: number;
  name: string;
  category: FridgeCategory | null;
  quantity: number | null;
  expiryDate: Date | null;
};

export type RecipeSuggestion = {
  title: string;
  ingredients: string[];
  instructions: string[];
  usesExpiringItems: string[];
  description: string;
};

/**
 * Generates recipe suggestions based on fridge contents
 * Prioritizes items that are expiring soon
 */
export async function generateRecipeSuggestions(
  contents: FridgeContent[]
): Promise<RecipeSuggestion[]> {
  if (!contents.length) {
    return [];
  }

  // Sort items by expiry date (soonest first)
  const sortedContents = [...contents].sort((a, b) => {
    if (!a.expiryDate) return 1;
    if (!b.expiryDate) return -1;
    return dayjs(a.expiryDate).diff(dayjs(b.expiryDate));
  });

  // Identify items expiring in the next 3 days
  const today = dayjs();
  const expiringItems = sortedContents.filter(
    (item) => item.expiryDate && dayjs(item.expiryDate).diff(today, 'day') <= 3
  );

  // Prepare the content for OpenAI
  const itemsList = sortedContents.map(
    (item) =>
      `${item.name} (Category: ${item.category}, Quantity: ${item.quantity ?? 1}, ${
        item.expiryDate
          ? `Expires: ${dayjs(item.expiryDate).format('YYYY-MM-DD')}${
              dayjs(item.expiryDate).diff(today, 'day') <= 3 ? ' - EXPIRING SOON' : ''
            }`
          : 'No expiry date'
      })`
  );

  const expiringItemNames = expiringItems.map((item) => item.name);

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a cooking assistant that helps reduce food waste. Your task is to suggest 2 recipes based on the items in a user's fridge, prioritizing ingredients that will expire soon. Format your response as a JSON object.`,
        },
        {
          role: 'user',
          content: `Here are the items in my fridge: ${itemsList.join(
            '\n'
          )}\n\nPlease suggest 2 different recipes that use as many of the ingredients as possible, especially the ones that will expire soon. Provide the title, ingredients with quantities, step-by-step instructions, and a brief description for each recipe. Return your response as a JSON object with a 'recipes' array.`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });
    console.log('OpenAI response:', response);
    // Safely parse JSON with proper type checking
    const content = response.choices[0]?.message.content ?? '{"recipes":[]}';
    const parsedData = JSON.parse(content) as OpenAIRecipeResponse;

    // Format the response to match our expected output type
    return (parsedData.recipes || []).map((recipe) => {
      // Ensure recipe.ingredients is always an array
      const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];

      // Check which expiring items are used in this recipe
      const usedExpiringItems = expiringItemNames.filter((item) => {
        // Check each ingredient for the item name
        for (const ingredient of ingredients) {
          if (
            typeof ingredient === 'string' &&
            ingredient.toLowerCase().includes(item.toLowerCase())
          ) {
            return true;
          }
        }
        return false;
      });

      return {
        title: recipe.title ?? '',
        ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
        instructions: Array.isArray(recipe.instructions) ? recipe.instructions : [],
        description: recipe.description ?? '',
        usesExpiringItems: usedExpiringItems,
      };
    });
  } catch (error) {
    console.error('Error generating recipe suggestions:', error);
    return [];
  }
}
