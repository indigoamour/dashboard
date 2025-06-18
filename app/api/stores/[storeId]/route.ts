import prismadb from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { name } = body;

    if (!session || !session.user) {
      return NextResponse.json("Unauthenticated", { status: 401 });
    }
    if (!name) {
      return NextResponse.json("Store Name is missing", { status: 400 });
    }
    if (!params.storeId) {
      return NextResponse.json("Store Id is missing", { status: 400 });
    }

    const updatedStore = await prismadb.store.updateMany({
      where: {
        id: params.storeId,
        userId: session.user.id,
      },
      data: { name },
    });

    return NextResponse.json(
      { ...updatedStore, msg: "Store Updated Successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("[STORE_PATCH] ", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json("Unauthenticated", { status: 401 });
    }
    if (!params.storeId) {
      return NextResponse.json("Store Id is missing", { status: 400 });
    }

    const deletedStore = await prismadb.store.deleteMany({
      where: {
        id: params.storeId,
        userId: session.user.id,
      },
    });

    return NextResponse.json(
      { ...deletedStore, msg: "Store Deleted Successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("[STORE_DELETE] ", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
