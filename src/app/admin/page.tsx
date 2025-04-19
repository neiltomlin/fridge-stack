import Image from "next/image";
import Link from "next/link";
import { auth } from "~/server/auth";
import { api } from "~/trpc/server";

const AdminPage = async () => {
  const session = await auth();
  const users = await api.users.getAll();
  const currentUser = session?.user;

  if (currentUser) {
    const admin = currentUser?.isAdmin;

    return (
      <>
        {admin ? (
          <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
            <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
              <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
                Admin Area
              </h1>

              {users?.map((user) => (
                <p key={user.id}>
                  {user.name}, {user.email},{" "}
                  {user.image && (
                    <Image alt="" src={user.image} width={100} height={100} />
                  )}
                </p>
              ))}
            </div>
          </main>
        ) : (
          <p>You are not an admin</p>
        )}
        <Link href={`/${currentUser.name}`}>Go to my user zone</Link>
      </>
    );
  }

  return <p>Loading...</p>;
};

export default AdminPage;
