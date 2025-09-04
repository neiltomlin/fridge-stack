'use client';

import { useState } from 'react';
import { api } from '~/trpc/react';
import { NavigationButtons } from '~/app/_components/fridge/navigationButtons';
import { useRouter } from 'next/navigation';
import type { Ingredient } from '~/server/db/schema';

interface SavedRecipe {
  id: number;
  title: string;
  description: string;
  ingredients: Array<{
    item: string;
    quantity: string;
    owned: boolean;
  }>;
  instructions: string[];
  usesExpiringItems: string[];
  savedAt: Date;
}

export default function SavedRecipesPage() {
  const router = useRouter();
  const [selectedRecipe, setSelectedRecipe] = useState<number | null>(null);
  const { data, isLoading, error, refetch } = api.recipes.getSavedRecipes.useQuery();
  const deleteRecipeMutation = api.recipes.deleteSavedRecipe.useMutation({
    onSuccess: () => {
      void refetch();
    },
  });

  const handleDeleteRecipe = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      await deleteRecipeMutation.mutateAsync({ id });
    }
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center dark:bg-gray-950 text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1>My Saved Recipes</h1>
          <NavigationButtons />
          <div className="animate-pulse h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="animate-pulse h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center dark:bg-gray-950 text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1>My Saved Recipes</h1>
          <NavigationButtons />
          <div className="bg-red-700 p-4 rounded-md">
            <p>Error loading recipes: {error.message}</p>
          </div>
        </div>
      </main>
    );
  }

  const recipes = (data?.recipes as SavedRecipe[]) || [];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center dark:bg-gray-950 text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1>My Saved Recipes</h1>
        <NavigationButtons />

        <div className="w-full max-w-2xl bg-white p-6 rounded-md shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Saved Recipes</h2>

          {recipes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-900 mb-4">You haven&apos;t saved any recipes yet.</p>
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Go back to recipe suggestions
              </button>
            </div>
          ) : (
            <div className="mb-6">
              {recipes.map((recipe) => (
                <div key={recipe.id} className="mb-4 border-b pb-4 last:border-b-0">
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() =>
                      setSelectedRecipe(selectedRecipe === recipe.id ? null : recipe.id)
                    }
                  >
                    <h3 className="text-xl font-semibold text-gray-900">{recipe.title}</h3>
                    <span className="text-blue-600">
                      {selectedRecipe === recipe.id ? '▲ Hide' : '▼ Show'}
                    </span>
                  </div>

                  {recipe.usesExpiringItems?.length > 0 && (
                    <div className="mt-2 text-sm">
                      <span className="font-semibold text-green-600">Uses expiring items: </span>
                      <span className="text-gray-700">{recipe.usesExpiringItems.join(', ')}</span>
                    </div>
                  )}

                  <p className="mt-2 text-gray-700">{recipe.description}</p>

                  <div className="mt-2 text-xs text-gray-500">
                    Saved on: {new Date(recipe.savedAt).toLocaleDateString()}
                  </div>

                  {selectedRecipe === recipe.id && (
                    <div className="mt-4">
                      <h4 className="font-semibold mt-2 mb-1 text-gray-800">Ingredients:</h4>
                      <ul className="list-disc pl-5 mb-4">
                        {recipe.ingredients.map((ingredient, idx) => (
                          <li key={idx} className="text-gray-700">
                            <span className="font-medium">{ingredient.item}</span>
                            {!ingredient.owned && ' (not owned)'}: {ingredient.quantity}
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
                          onClick={() => handleDeleteRecipe(recipe.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                        >
                          Delete Recipe
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
