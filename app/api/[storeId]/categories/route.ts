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

    const { name, billboardId } = body;

    if (!session || !session.user) {
      return NextResponse.json("Unauthenticated", { status: 401 });
    }
    if (!name) {
      return NextResponse.json("Name is missing", { status: 400 });
    }
    if (!billboardId) {
      return NextResponse.json("Billboard ID is missing", {
        status: 400,
      });
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

    const category = await prismadb.category.create({
      data: { name, billboardId, storeId: params.storeId },
    });

    return NextResponse.json(
      { ...category, msg: "Category Successfully Created" },
      { status: 200 }
    );
  } catch (error) {
    console.log("[CATEGORIES_POST] ", error);
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

    const categories = await prismadb.category.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(
      { categories, msg: "Categories Retrieved Successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("[CATEGORIES_GET] ", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
