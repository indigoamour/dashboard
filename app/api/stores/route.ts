import prismadb from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Get the session from NextAuth
    const session = await getServerSession(authOptions);

    // Check if the user is authenticated
    if (!session || !session.user) {
      return NextResponse.json("Unauthenticated", { status: 401 });
    }

    const body = await req.json();
    const { name } = body;

    // Validate the `name` field
    if (!name) {
      return NextResponse.json("Store Name is missing", { status: 400 });
    }

    // Create a new store associated with the authenticated user
    const newStore = await prismadb.store.create({
      data: {
        name,
        userId: session.user.id, // Use the user ID from the session
      },
    });

    return NextResponse.json(
      { ...newStore, msg: "Store Created Successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("[STORE_POST] ", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
