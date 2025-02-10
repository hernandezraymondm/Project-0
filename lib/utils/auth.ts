import { auth } from "@/auth";

// GET CURRENT USER SESSION
export const currentUser = async () => {
  const session = await auth();
  return session?.user;
};

// GET CURRENT USER ROLE
export const currentRole = async () => {
  const session = await auth();
  return session?.user?.role;
};
