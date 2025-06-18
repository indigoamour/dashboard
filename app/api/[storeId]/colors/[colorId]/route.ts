import prismadb from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { colorId: string; storeId: string } }
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
    if (!params.colorId) {
      return NextResponse.json("Color Id is missing", { status: 400 });
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

    const color = await prismadb.color.updateMany({
      where: {
        id: params.colorId,
      },
      data: { name, value },
    });

    return NextResponse.json(
      { ...color, msg: "Color Updated Successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("[COLOR_PATCH] ", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { colorId: string; storeId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json("Unauthorised Access", { status: 401 });
    }
    if (!params.colorId) {
      return NextResponse.json("Color Id is missing", { status: 400 });
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

    const deletedColor = await prismadb.color.deleteMany({
      where: {
        id: params.colorId,
      },
    });

    return NextResponse.json(
      { ...deletedColor, msg: "Color Deleted Successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("[COLOR_DELETE] ", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { colorId: string } }
) {
  try {
    if (!params.colorId) {
      return NextResponse.json("Color Id is missing", { status: 400 });
    }

    const color = await prismadb.color.findUnique({
      where: {
        id: params.colorId,
      },
    });

    return NextResponse.json(
      { ...color, msg: "Color Fetched Successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("[COLOR_GET] ", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
