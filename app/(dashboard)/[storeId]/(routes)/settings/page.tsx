import prismadb from "@/lib/prismadb";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import React from "react";
import SettingsForm from "./components/settings-form";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface SettingsPageProps {
  params: {
    storeId: string;
  };
}

const SettingsPage: React.FC<SettingsPageProps> = async ({ params }) => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const userId = session.user.id;

  const store = await prismadb.store.findFirst({
    where: {
      userId,
      id: params.storeId,
    },
  });

  if (!store) {
    redirect("/");
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm initialData={store} />
      </div>
    </div>
  );
};

export default SettingsPage;
