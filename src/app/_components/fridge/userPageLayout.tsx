'use client';
import { NavigationButtons } from './navigationButtons';
import { UserProfile } from './userProfile';
import { RecipeSuggestions } from './recipeSuggestions';
import { AddToFridge } from './addToFridge';
import { FridgeContentsList } from './fridgeContentsList';
import type { FridgeCategory } from '../../constants';

type FridgeItem = {
  id: number;
  name: string;
  category: FridgeCategory | null;
  quantity: number | null;
  expiryDate: Date | null;
};

type UserPageLayoutProps = {
  userName?: string | null;
  userEmail?: string | null;
  userImage?: string | null;
  isAdmin?: boolean | null;
  fridgeContents: FridgeItem[];
  isLoading: boolean;
};

export const UserPageLayout = ({
  userName,
  userEmail,
  userImage,
  isAdmin,
  fridgeContents,
  isLoading,
}: UserPageLayoutProps) => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center dark:bg-gray-950 text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1>{userName}&apos;s Fridge</h1>

        <NavigationButtons />

        <RecipeSuggestions />
        <AddToFridge />
        <FridgeContentsList contents={fridgeContents} isLoading={isLoading} />

        <div className="w-full">
          <h2 className="text-2xl font-bold mb-4 text-center">Smart Recipe Suggestions</h2>
          <p className="text-center mb-6 text-gray-300">
            Our AI suggests recipes that prioritize ingredients expiring soon to help reduce food
            waste.
          </p>
        </div>
      </div>

      <UserProfile name={userName} email={userEmail} image={userImage} isAdmin={isAdmin} />
    </main>
  );
};
