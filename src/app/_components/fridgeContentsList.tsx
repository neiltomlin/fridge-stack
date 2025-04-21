import { api } from "~/trpc/server";

const FridgeContentsList = async () => {
  const contentsQuery = await api.contents.getAll();

  return (
    <ul>
      {contentsQuery.map((item) => (
        <li key={item.id}>
          {item.name} {item.category} {String(item.expiryDate)}
        </li>
      ))}
    </ul>
  );
};

export default FridgeContentsList;
