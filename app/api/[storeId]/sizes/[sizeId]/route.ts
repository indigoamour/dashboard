import prismadb from "@/lib/prismadb";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PATCH(
  req: Request,
  { params }: { params: { sizeId: string; storeId: string } }
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
    if (!params.sizeId) {
      return NextResponse.json({ error: "Size ID is missing" }, { status: 400 });
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

    const size = await prismadb.size.updateMany({
      where: {
        id: params.sizeId,
      },
      data: { name, value },
    });

    return NextResponse.json(
      { ...size, msg: "Size Updated Successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[SIZE_PATCH] ", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { sizeId: string; storeId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }
    if (!params.sizeId) {
      return NextResponse.json({ error: "Size ID is missing" }, { status: 400 });
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

    const deletedSize = await prismadb.size.deleteMany({
      where: {
        id: params.sizeId,
      },
    });

    return NextResponse.json(
      { ...deletedSize, msg: "Size Deleted Successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[SIZE_DELETE] ", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { sizeId: string } }
) {
  try {
    if (!params.sizeId) {
      return NextResponse.json({ error: "Size ID is missing" }, { status: 400 });
    }

    const size = await prismadb.size.findUnique({
      where: {
        id: params.sizeId,
      },
    });

    return NextResponse.json(
      { ...size, msg: "Size Fetched Successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[SIZE_GET] ", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
