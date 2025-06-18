import prismadb from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { name, value } = body;

    if (!session || !session.user) {
      return NextResponse.json("Unauthenticated", { status: 401 });
    }
    if (!name) {
      return NextResponse.json("Name is missing", { status: 400 });
    }
    if (!value) {
      return NextResponse.json("Value is missing", { status: 400 });
    }
    if (!params.storeId) {
      return NextResponse.json("Store Id is missing", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId: session.user.id,
      },
    });

    if (!storeByUserId) {
      return NextResponse.json("Unauthorized", { status: 403 });
    }

    const color = await prismadb.color.create({
      data: { name, value, storeId: params.storeId },
    });

    return NextResponse.json(
      { ...color, msg: "Color Successfully Created" },
      { status: 200 }
    );
  } catch (error) {
    console.log("[COLOR_POST] ", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return NextResponse.json("Store Id is missing", { status: 400 });
    }

    const colors = await prismadb.color.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(
      { colors, msg: "Colors Fetched Successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("[COLORS_GET] ", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
