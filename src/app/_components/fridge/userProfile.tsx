'use client';
import Image from 'next/image';
import { MakeMeAdminButton } from '../adminControls/adminControls';

type UserProfileProps = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  isAdmin?: boolean | null;
};

export const UserProfile = ({ name, email, image, isAdmin }: UserProfileProps) => {
  return (
    <div className="mx-auto flex max-w-sm items-center gap-x-4 rounded-md bg-white p-6 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
      {image && (
        <Image alt="" src={image} width={100} height={100} className="size-12 shrink-0" />
      )}
      <div>
        <h2 className="text-xl font-medium text-black dark:text-white">User Details</h2>
        <p className="text-gray-500 dark:text-gray-400">Email: {email}</p>
        <p className="text-gray-500 dark:text-gray-400">Is Admin: {String(isAdmin)}</p>
        {email && <MakeMeAdminButton email={email} />}
      </div>
    </div>
  );
};