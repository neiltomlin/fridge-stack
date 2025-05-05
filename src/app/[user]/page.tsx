import { api } from '~/trpc/server';
import { auth } from '~/server/auth';
import { UserPageLayout } from '../_components/fridge/userPageLayout';

const UserPage = async () => {
  const session = await auth();
  const { name, email, image, isAdmin } = session?.user ?? {};

  if (session?.user && api.contents.getAll) {
    void api.contents.getAll.prefetch();
  }
  
  const contents = await api.contents.getAll();

  return (
    <UserPageLayout
      userName={name}
      userEmail={email}
      userImage={image}
      isAdmin={isAdmin}
      fridgeContents={contents || []}
      isLoading={!contents}
    />
  );
};

export default UserPage;
