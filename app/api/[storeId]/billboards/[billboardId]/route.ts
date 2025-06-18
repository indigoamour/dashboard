import prismadb from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

// Update a billboard
export async function PATCH(
  req: Request,
  { params }: { params: { billboardId: string; storeId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const { label, images } = await req.json();

    if (!session || !session.user) {
      return NextResponse.json("Unauthenticated", { status: 401 });
    }
    if (
      !label ||
      images.length === 0 ||
      !params.billboardId ||
      !params.storeId
    ) {
      return NextResponse.json("Missing required data", { status: 400 });
    }

    const store = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId: session.user.id,
      },
    });

    if (!store) {
      return NextResponse.json("Unauthorized", { status: 403 });
    }

    const updatedBillboard = await prismadb.billboard.update({
      where: {
        id: params.billboardId,
      },
      data: {
        label,
        images: {
          deleteMany: {},
          create: images.map((url: any) => ({
            url,
          })),
        },
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json(updatedBillboard, { status: 200 });
  } catch (error) {
    console.log("[BILLBOARD_PATCH] ", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}

// Delete a billboard
export async function DELETE(
  req: Request,
  { params }: { params: { billboardId: string; storeId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json("Unauthorised Access", { status: 401 });
    }
    if (!params.billboardId || !params.storeId) {
      return NextResponse.json("Missing required data", { status: 400 });
    }

    const store = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId: session.user.id,
      },
    });

    if (!store) {
      return NextResponse.json("Unauthorized", { status: 403 });
    }

    const deletedBillboard = await prismadb.billboard.delete({
      where: {
        id: params.billboardId,
      },
    });

    return NextResponse.json(deletedBillboard, { status: 200 });
  } catch (error) {
    console.log("[BILLBOARD_DELETE] ", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}

// Get a billboard
export async function GET(
  req: Request,
  { params }: { params: { billboardId: string } }
) {
  try {
    if (!params.billboardId) {
      return NextResponse.json("Billboard Id is missing", { status: 400 });
    }

    const billboard = await prismadb.billboard.findUnique({
      where: {
        id: params.billboardId,
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json(billboard, { status: 200 });
  } catch (error) {
    console.log("[BILLBOARD_GET] ", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
