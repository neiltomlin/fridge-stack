import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { generateRecipeSuggestions } from '~/server/services/recipeService';
import { savedRecipes } from '~/server/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import type { RecipeSuggestion } from '~/server/services/recipeService';

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

  // Get all saved recipes for the current user
  getSavedRecipes: protectedProcedure.query(async ({ ctx }) => {
    try {
      // First, check if the savedRecipes table is prepared for queries
      if (!ctx.db.query.savedRecipes) {
        console.error('savedRecipes table not properly registered with Drizzle');
        return {
          recipes: [],
          message: 'Unable to access saved recipes. Database configuration issue.',
        };
      }

      const userSavedRecipes = await ctx.db
        .select()
        .from(savedRecipes)
        .where(eq(savedRecipes.savedById, ctx.session.user.id))
        .orderBy(savedRecipes.savedAt);

      return {
        recipes: userSavedRecipes,
        message:
          userSavedRecipes.length > 0
            ? `Found ${userSavedRecipes.length} saved recipes.`
            : 'No saved recipes found.',
      };
    } catch (error) {
      console.error('Failed to get saved recipes:', error);
      throw new Error('Failed to retrieve saved recipes');
    }
  }),

  // Save a recipe to the database
  saveRecipe: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        ingredients: z.array(
          z.object({
            item: z.string(),
            quantity: z.string(),
            owned: z.boolean(),
          })
        ),
        instructions: z.array(z.string()),
        usesExpiringItems: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const insertedRecipe = await ctx.db
          .insert(savedRecipes)
          .values({
            title: input.title,
            description: input.description,
            ingredients: input.ingredients,
            instructions: input.instructions,
            usesExpiringItems: input.usesExpiringItems || [],
            savedById: ctx.session.user.id,
          })
          .returning();

        return {
          success: true,
          message: 'Recipe saved successfully!',
          recipe: insertedRecipe[0],
        };
      } catch (error) {
        console.error('Failed to save recipe:', error);
        throw new Error('Failed to save recipe');
      }
    }),

  // Delete a saved recipe
  deleteSavedRecipe: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      try {
        // First, verify the recipe belongs to the current user
        const recipe = await ctx.db
          .select()
          .from(savedRecipes)
          .where(eq(savedRecipes.id, input.id))
          .where(eq(savedRecipes.savedById, ctx.session.user.id))
          .limit(1);

        if (!recipe || recipe.length === 0) {
          throw new Error('Recipe not found or you do not have permission to delete it');
        }

        // Delete the recipe
        await ctx.db
          .delete(savedRecipes)
          .where(eq(savedRecipes.id, input.id))
          .where(eq(savedRecipes.savedById, ctx.session.user.id));

        return {
          success: true,
          message: 'Recipe deleted successfully!',
        };
      } catch (error) {
        console.error('Failed to delete recipe:', error);
        throw new Error(error instanceof Error ? error.message : 'Failed to delete recipe');
      }
    }),
});
