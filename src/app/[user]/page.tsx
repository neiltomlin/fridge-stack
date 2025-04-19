import { api, HydrateClient } from "~/trpc/server";
import { auth } from "~/server/auth";
import RecentPostsList from "../_components/recentPostsList";
import Image from "next/image";
import { MakeMeAdminButton } from "../_components/makeMeAdminButton";
const UserPage = async () => {
  const session = await auth();

  const { name, email, image, isAdmin } = session?.user ?? {};

  if (session?.user && api.post.getRecent) {
    void api.post.getRecent.prefetch();
  }

  console.log(isAdmin);
  return (
    <HydrateClient>
      <h1>{name}&apos;s Page</h1>
      {image && <Image alt="" src={image} width={100} height={100} />}
      <p>Email: {email}</p>
      <p>Is Admin: {String(isAdmin)}</p>

      <MakeMeAdminButton email={email! ?? ""} />

      <div>
        <p>Posts:</p>
        <RecentPostsList />
      </div>
    </HydrateClient>
  );
};

export default UserPage;
