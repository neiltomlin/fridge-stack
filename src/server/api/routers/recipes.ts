import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { generateRecipeSuggestions } from '~/server/services/recipeService';

export const recipesRouter = createTRPCRouter({
  getSuggestions: protectedProcedure.query(async ({ ctx }) => {
    try {
      // Get all the contents in the user's fridge
      const fridgeContents = await ctx.db.query.contents.findMany();

      if (!fridgeContents || fridgeContents.length === 0) {
        return {
          recipes: [],
          message: 'No items in your fridge to generate recipes from.',
        };
      }

      // Generate recipe suggestions based on the fridge contents
      const suggestions = await generateRecipeSuggestions(fridgeContents);

      return {
        recipes: suggestions,
        message:
          suggestions.length > 0
            ? `Generated ${suggestions.length} recipe suggestions.`
            : 'Could not generate any recipes from your fridge contents.',
      };
    } catch (error) {
      console.error('Failed to get recipe suggestions:', error);
      throw new Error('Failed to generate recipe suggestions');
    }
  }),
});
