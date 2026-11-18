import { auth } from "@clerk/nextjs/server";

// Clerk-User-IDs mit Zugriff auf /admin.
// Optional über ADMIN_USER_IDS (kommagetrennt) überschreibbar, z.B. bei einer neuen Clerk-Instanz.
const adminIds = process.env.ADMIN_USER_IDS
  ? process.env.ADMIN_USER_IDS.split(",").map((id) => id.trim()).filter(Boolean)
  : ["user_2hFaWVj6SF9I8Nt03fCNRK2Ippv"];

export const isAdmin = async () => {
  const { userId } = await auth();

  if (!userId) {
    return false;
  }

  return adminIds.includes(userId);
};
