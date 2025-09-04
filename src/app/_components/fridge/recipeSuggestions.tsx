'use client';
import { useState } from 'react';
import { api } from '~/trpc/react';
import { useRouter } from 'next/navigation';
import type { Ingredient } from '~/server/services/recipeService';

type RecipeSuggestion = {
  title: string;
  ingredients: Ingredient[];
  instructions: string[];
  usesExpiringItems: string[];
  description: string;
};

export const RecipeSuggestions = () => {
  const router = useRouter();
  const [selectedRecipe, setSelectedRecipe] = useState<number | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [savedRecipeIndices, setSavedRecipeIndices] = useState<Set<number>>(new Set());
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const { data, isLoading, error, refetch } = api.recipes.getSuggestions.useQuery(undefined, {
    refetchOnWindowFocus: false,
    enabled: showSuggestions,
  });

  const saveRecipeMutation = api.recipes.saveRecipe.useMutation({
    onSuccess: (result, variables) => {
      // Find the recipe that was just saved in our current recipes list
      if (data?.recipes) {
        const savedIndex = data.recipes.findIndex((r) => r.title === variables.title);
        if (savedIndex >= 0) {
          setSavedRecipeIndices((prev) => {
            const newSet = new Set(prev);
            newSet.add(savedIndex);
            return newSet;
          });
        }
      }

      // Show success message
      setSavedMessage(`"${variables.title}" has been saved to your recipes!`);

      // Clear message after a few seconds
      setTimeout(() => {
        setSavedMessage(null);
      }, 3000);
    },
    onError: (error) => {
      console.error('Error saving recipe:', error);
      setSavedMessage(`Error: ${error.message}`);
      setTimeout(() => setSavedMessage(null), 3000);
    },
  });

  const handleSaveRecipe = (recipe: RecipeSuggestion, index: number) => {
    if (savedRecipeIndices.has(index)) {
      // Already saved, navigate to saved recipes
      router.push('/saved-recipes');
      return;
    }

    saveRecipeMutation.mutate({
      title: recipe.title,
      description: recipe.description,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      usesExpiringItems: recipe.usesExpiringItems,
    });
  };

  // Initial state when user hasn't requested suggestions yet
  if (!showSuggestions) {
    return (
      <div className="mt-6 w-full max-w-2xl dark:bg-slate-800 p-6 rounded-md shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-100">Don&apos;t know what to eat?</h2>
        <p className="mb-6 text-gray-200">
          Get AI powered recipe suggestions based on your fridge, let&apos;s see if we can use up
          some of that food before it goes off!
        </p>
        <button
          onClick={() => setShowSuggestions(true)}
          className="px-6 py-3 bg-linear-65 from-purple-500 to-pink-500 text-white rounded-md cursor-pointer font-medium border-solid border-gray-100 border-1 hover:border-transparent"
        >
          Think for me
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mt-6 w-full max-w-2xl bg-white p-6 rounded-md shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Loading recipe suggestions...</h2>
        <div className="animate-pulse h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="animate-pulse h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="animate-pulse h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 w-full max-w-2xl bg-white p-6 rounded-md shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-red-600">Error loading recipes</h2>
        <p className="text-gray-900">
          There was an error loading recipe suggestions. Please try again later.
        </p>
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => void refetch()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
          <button
            onClick={() => setShowSuggestions(false)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  if (!data?.recipes || data.recipes.length === 0) {
    return (
      <div className="mt-6 w-full max-w-2xl bg-white p-6 rounded-md shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">No Recipe Suggestions</h2>
        <p className="text-gray-900">
          {data?.message ?? 'Could not generate any recipes from your fridge contents.'}
        </p>
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => void refetch()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Refresh
          </button>
          <button
            onClick={() => setShowSuggestions(false)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 w-full max-w-2xl bg-white p-6 rounded-md shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Recipe Suggestions</h2>
        <div className="flex gap-2">
          <button
            onClick={() => void refetch()}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            Refresh
          </button>
          <button
            onClick={() => setShowSuggestions(false)}
            className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-sm"
          >
            Hide
          </button>
        </div>
      </div>

      <p className="mb-4 text-gray-700">
        These recipes prioritize ingredients that will expire soon to help reduce food waste.
      </p>

      <div className="mb-6">
        {data.recipes.map((recipe: RecipeSuggestion, index: number) => (
          <div key={index} className="mb-4 border-b pb-4 last:border-b-0">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setSelectedRecipe(selectedRecipe === index ? null : index)}
            >
              <h3 className="text-xl font-semibold text-gray-900">{recipe.title}</h3>
              <span className="text-blue-600">
                {selectedRecipe === index ? '▲ Hide' : '▼ Show'}
              </span>
            </div>

            {recipe.usesExpiringItems.length > 0 && (
              <div className="mt-2 text-sm">
                <span className="font-semibold text-green-600">Uses expiring items: </span>
                <span className="text-gray-700">{recipe.usesExpiringItems.join(', ')}</span>
              </div>
            )}

            {recipe.ingredients.some((ing) => !ing.owned) && (
              <div className="mt-2 text-sm">
                <span className="font-semibold text-amber-500">Ingredients to buy: </span>
                <span className="text-gray-700">
                  {recipe.ingredients
                    .filter((ing) => !ing.owned)
                    .map((ing) => ing.item)
                    .join(', ')}
                </span>
              </div>
            )}

            <p className="mt-2 text-gray-700">{recipe.description}</p>

            {selectedRecipe === index && (
              <div className="mt-4">
                <h4 className="font-semibold mt-2 mb-1 text-gray-800">Ingredients:</h4>
                <ul className="list-disc pl-5 mb-4">
                  {recipe.ingredients.map((ingredient, idx) => (
                    <li key={idx} className="text-gray-700">
                      <span className="font-medium">{ingredient.item}</span>
                      {ingredient.owned ? '' : ' (not owned)'}: {ingredient.quantity}
                    </li>
                  ))}
                </ul>

                <h4 className="font-semibold mt-2 mb-1 text-gray-800">Instructions:</h4>
                <ol className="list-decimal pl-5">
                  {recipe.instructions.map((step, idx) => (
                    <li key={idx} className="text-gray-700 mb-2">
                      {step}
                    </li>
                  ))}
                </ol>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSaveRecipe(recipe, index);
                    }}
                    className={`px-4 py-2 text-white rounded ${
                      savedRecipeIndices.has(index)
                        ? 'bg-blue-500 hover:bg-blue-600'
                        : 'bg-green-500 hover:bg-green-600'
                    }`}
                  >
                    {savedRecipeIndices.has(index) ? 'View Saved Recipes' : 'Save Recipe'}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {savedMessage && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-md z-50">
          <p>{savedMessage}</p>
        </div>
      )}
    </div>
  );
};
