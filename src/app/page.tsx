import Link from 'next/link';

import { LatestPost } from '~/app/_components/post';
import { auth } from '~/server/auth';
import { api, HydrateClient } from '~/trpc/server';

export default async function Home() {
  const hello = await api.post.hello({ text: 'from Neil, log in to check your fridge' });
  const session = await auth();

  if (session?.user) {
    void api.post.getLatest.prefetch();
  }

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#20028b] to-[#000000] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            <span className="text-[hsl(220,86%,72%)]">Fridge</span> Stack
          </h1>

          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl text-white">
              {hello ? hello.greeting : 'Loading tRPC query...'}
            </p>

            <div className="flex flex-col items-center justify-center gap-4">
              <p className="text-center text-2xl text-white">
                {session && (
                  <span>
                    Logged in as{' '}
                    <Link className="text-white font-bold" href={`/${session.user?.name}`}>
                      {session.user?.name}
                    </Link>
                  </span>
                )}
              </p>
              <Link
                href={session ? '/api/auth/signout' : '/api/auth/signin'}
                className="rounded-md bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
              >
                {session ? 'Sign out' : 'Sign in'}
              </Link>
            </div>
          </div>

          {session?.user && <LatestPost />}
        </div>
      </main>
    </HydrateClient>
  );
}
