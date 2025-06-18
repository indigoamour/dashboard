import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

import prismadb from "@/lib/prismadb";

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch the session using NextAuth
  const session = await getServerSession(authOptions);

  // If the user is not authenticated, redirect to sign-in
  if (!session || !session.user) {
    redirect("/sign-in");
  }

  // Check if the user already has a store
  const store = await prismadb.store.findFirst({
    where: {
      userId: session.user.id, // Use session.user.id from NextAuth
    },
  });

  // If a store is found, redirect to the store's page
  if (store) {
    redirect(`/${store.id}`);
  }

  return <>{children}</>;
}
