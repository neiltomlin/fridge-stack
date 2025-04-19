"use client";

import { makeMeAdmin } from "../actions";

export const MakeMeAdminButton = ({ email }: { email: string }) => {
  if (email === "neilfoxholes@hotmail.com") {
    return (
      <button onClick={() => makeMeAdmin({ email })}>Make me admin</button>
    );
  }
  return null;
};
