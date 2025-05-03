import { OpenAI } from 'openai';
import { env } from '~/env';
import dayjs from 'dayjs';
import type { FridgeCategory } from '~/app/constants';

// Define ingredient type
export type Ingredient = {
  item: string;
  quantity: string;
  owned: boolean;
};

// Define OpenAI response structure
interface OpenAIRecipeResponse {
  recipes: Array<{
    title: string;
    ingredients: Ingredient[];
    instructions: string[];
    description: string;
  }>;
}

// Initialize OpenAI client with proper type assertion
const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
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
  ingredients: Ingredient[];
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

  const itemsList = sortedContents.map((item) => `${item.name}`);

  const expiringItemNames = expiringItems.map((item) => item.name);

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `Create recipes using the user's fridge ingredients to minimize food waste. Use only these ingredients for the first recipe; for the next, minimize missing items, for the third be open to adding unowned ingredients. Format as a JSON object:

# Output Format

\`\`\`typescript
type OpenAIRecipeResponse = {
  recipes: {
    title: string;
    ingredients: {
      item: string;
      quantity: string;
      owned: boolean;
    }[];
    instructions: string[];
    description: string;
  }[];
}
\`\`\`

Each recipe includes:
- **Title**
- **Ingredients**: Item, quantity (metric) and owned
- **Instructions**
- **Description**`,
        },
        {
          role: 'user',
          content: `${itemsList.join(',')}`,
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
      // Check which expiring items are used in this recipe
      const usedExpiringItems = expiringItemNames.filter((item) => {
        // Check if any ingredient name includes this item
        return recipe.ingredients.some((ingredient) =>
          ingredient.item.toLowerCase().includes(item.toLowerCase())
        );
      });

      return {
        title: recipe.title ?? '',
        ingredients: recipe.ingredients,
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
