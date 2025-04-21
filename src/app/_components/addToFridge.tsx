"use client";
import { useState } from "react";
import { api } from "~/trpc/react";

const AddToFridge = () => {
  const [toAdd, setToAdd] = useState("");
  const utils = api.useUtils();
  const addToFridge = api.contents.add.useMutation({
    onSuccess: async () => {
      await utils.contents.invalidate();
      setToAdd("");
    },
  });

  const addToFridgeHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    addToFridge.mutate({
      name: toAdd,
      category: "mockCategory", // Replace with the actual category
      expiryDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // Set expiry date to one week from now
    });
    setToAdd("");
  };

  return (
    <div>
      <form>
        <input
          type="text"
          value={toAdd}
          onChange={(e) => setToAdd(e.target.value)}
          placeholder="Add item to fridge"
        />
        <button type="submit" onClick={addToFridgeHandler}>
          Add
        </button>
      </form>
    </div>
  );
};

export default AddToFridge;
