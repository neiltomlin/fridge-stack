'use client';
import { useState } from 'react';
import { api } from '~/trpc/react';

type RecipeSuggestion = {
  title: string;
  ingredients: string[];
  instructions: string[];
  usesExpiringItems: string[];
  description: string;
};

export const RecipeSuggestions = () => {
  const [selectedRecipe, setSelectedRecipe] = useState<number | null>(null);
  const { data, isLoading, error, refetch } = api.recipes.getSuggestions.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="mt-6 w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Loading recipe suggestions...</h2>
        <div className="animate-pulse h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="animate-pulse h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="animate-pulse h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-red-600">Error loading recipes</h2>
        <p className="text-gray-900">
          There was an error loading recipe suggestions. Please try again later.
        </p>
        <button
          onClick={() => void refetch()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!data?.recipes || data.recipes.length === 0) {
    return (
      <div className="mt-6 w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">No Recipe Suggestions</h2>
        <p className="text-gray-900">
          {data?.message ?? 'Could not generate any recipes from your fridge contents.'}
        </p>
        <button
          onClick={() => void refetch()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6 w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Recipe Suggestions</h2>
        <button
          onClick={() => void refetch()}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
        >
          Refresh
        </button>
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
                <span className="font-semibold text-amber-600">Uses expiring items: </span>
                <span className="text-gray-700">{recipe.usesExpiringItems.join(', ')}</span>
              </div>
            )}

            <p className="mt-2 text-gray-700">{recipe.description}</p>

            {selectedRecipe === index && (
              <div className="mt-4">
                <h4 className="font-semibold mt-2 mb-1 text-gray-800">Ingredients:</h4>
                <ul className="list-disc pl-5 mb-4">
                  {recipe.ingredients.map((ingredient, idx) => (
                    <li key={idx} className="text-gray-700">
                      {ingredient}
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
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
