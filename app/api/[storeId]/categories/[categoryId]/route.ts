import prismadb from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { categoryId: string; storeId: string } }
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
      return NextResponse.json("Billboard ID URL is missing", {
        status: 400,
      });
    }
    if (!params.categoryId) {
      return NextResponse.json("Category Id is missing", { status: 400 });
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

    const category = await prismadb.category.updateMany({
      where: {
        id: params.categoryId,
      },
      data: { name, billboardId },
    });

    return NextResponse.json(
      { ...category, msg: "Category Updated Successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("[CATEGORY_PATCH] ", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { categoryId: string; storeId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json("Unauthorised Access", { status: 401 });
    }
    if (!params.categoryId) {
      return NextResponse.json("Category Id is missing", { status: 400 });
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

    const deletedCategory = await prismadb.category.deleteMany({
      where: {
        id: params.categoryId,
      },
    });

    return NextResponse.json(
      { ...deletedCategory, msg: "Category Deleted Successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("[CATEGORY_DELETE] ", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    if (!params.categoryId) {
      return NextResponse.json("Category Id is missing", { status: 400 });
    }

    const category = await prismadb.category.findUnique({
      where: {
        id: params.categoryId,
      },
      include: {
        billboard: true,
      },
    });

    return NextResponse.json(
      { ...category, msg: "Category Fetched Successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("[CATEGORY_GET] ", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
