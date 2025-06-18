import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

import prismadb from "@/lib/prismadb";
import MainNav from "@/components/main-nav";
import StoreSwitcher from "@/components/store-switcher";

const Navbar = async () => {
  // Fetch the session using NextAuth
  const session = await getServerSession(authOptions);

  // Redirect to sign-in if the user is not authenticated
  if (!session || !session.user) {
    redirect("/auth/signin");
  }

  // Fetch the stores associated with the authenticated user
  const stores = await prismadb.store.findMany({
    where: {
      userId: session.user.id, // Use session.user.id from NextAuth
    },
  });

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        {/* <StoreSwitcher items={stores} /> */}
        <MainNav />
        <div className="ml-auto flex items-center space-x-4">
          {/* Replace UserButton with your NextAuth-based UI if needed */}
          <div className="font-medium">{session.user.email}</div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
