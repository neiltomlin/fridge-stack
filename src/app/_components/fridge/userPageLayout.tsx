'use client';
import { NavigationButtons } from './navigationButtons';
import { UserProfile } from './userProfile';
import { RecipeSuggestions } from './recipeSuggestions';
import { AddToFridge } from './addToFridge';
import { FridgeContentsList } from './fridgeContentsList';
import { EmptyFridgeButton } from './emptyFridgeButton';
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
        <EmptyFridgeButton />
      </div>

      <UserProfile name={userName} email={userEmail} image={userImage} isAdmin={isAdmin} />
    </main>
  );
};
