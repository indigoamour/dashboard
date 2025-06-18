import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email }: { email: string } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const existingEmail = await prismadb.newsletter.findUnique({
      where: { email },
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: "Email is already subscribed" },
        { status: 400 }
      );
    }

    const newSubscription = await prismadb.newsletter.create({
      data: { email },
    });

    return NextResponse.json(
      {
        msg: "Successfully subscribed to the newsletter",
        subscription: newSubscription,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[NEWSLETTER_POST] Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
