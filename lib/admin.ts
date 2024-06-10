import { auth } from "@clerk/nextjs/server";


const adminIds = [
  "user_2hFaWVj6SF9I8Nt03fCNRK2Ippv",
];

export const isAdmin = () => {
  const { userId } = auth();

  if (!userId) {
    return false;
  }

  return adminIds.indexOf(userId) !== -1;
};
