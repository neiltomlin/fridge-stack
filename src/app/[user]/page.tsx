import { api, HydrateClient } from '~/trpc/server';
import { auth } from '~/server/auth';
import Image from 'next/image';
import { MakeMeAdminButton } from '../_components/adminControls';
import { AddToFridge } from '../_components/addToFridge';
import { FridgeContentsList } from '../_components/fridgeContentsList';
import { RecipeSuggestions } from '../_components/recipeSuggestions';

const UserPage = async () => {
  const session = await auth();

  const { name, email, image, isAdmin } = session?.user ?? {};

  if (session?.user && api.contents.getAll) {
    void api.contents.getAll.prefetch();
  }
  // const { data: contents, isLoading, refetch } = api.contents.getAll.useQuery();
  const contents = await api.contents.getAll();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#20028b] to-[#000000] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1>{name}&apos;s Fridge</h1>
          <AddToFridge />
          <FridgeContentsList contents={contents} isLoading={!contents} />

          {/* Add the recipe suggestions component */}
          <div className="w-full">
            <h2 className="text-2xl font-bold mb-4 text-center">Smart Recipe Suggestions</h2>
            <p className="text-center mb-6 text-gray-300">
              Our AI suggests recipes that prioritize ingredients expiring soon to help reduce food
              waste.
            </p>
            {/* <RecipeSuggestions /> */}
          </div>
        </div>
        <div className="mx-auto flex max-w-sm items-center gap-x-4 rounded-xl bg-white p-6 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
          {image && (
            <Image alt="" src={image} width={100} height={100} className="size-12 shrink-0" />
          )}
          <div>
            <h2 className="text-xl font-medium text-black dark:text-white">User Details</h2>

            <p className="text-gray-500 dark:text-gray-400">Email: {email}</p>
            <p className="text-gray-500 dark:text-gray-400">Is Admin: {String(isAdmin)}</p>
            <MakeMeAdminButton email={email! ?? ''} />
          </div>
        </div>
      </main>
    </HydrateClient>
  );
};

export default UserPage;
