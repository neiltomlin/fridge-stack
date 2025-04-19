import { api } from "~/trpc/server";

const RecentPostsList = async () => {
  const postsQuery = await api.post.getRecent();

  return (
    <ul>
      {postsQuery.map((post) => (
        <li key={post.id}>{post.name}</li>
      ))}
    </ul>
  );
};

export default RecentPostsList;
