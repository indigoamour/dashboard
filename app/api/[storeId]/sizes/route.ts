import prismadb from "@/lib/prismadb";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const body = await req.json();
    const { name, value } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is missing" }, { status: 400 });
    }
    if (!value) {
      return NextResponse.json({ error: "Value is missing" }, { status: 400 });
    }
    if (!params.storeId) {
      return NextResponse.json({ error: "Store ID is missing" }, { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const size = await prismadb.size.create({
      data: { name, value, storeId: params.storeId },
    });

    return NextResponse.json(
      { ...size, msg: "Size Created Successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[SIZE_POST] ", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return NextResponse.json({ error: "Store ID is missing" }, { status: 400 });
    }

    const sizes = await prismadb.size.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(
      { sizes, msg: "Sizes Fetched Successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[SIZES_GET] ", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
