import prismadb from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

// Create a new billboard
export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const { label, images } = await req.json();

    if (!session || !session.user) {
      return NextResponse.json("Unauthenticated", { status: 401 });
    }
    if (!label || images.length === 0 || !params.storeId) {
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

    const billboard = await prismadb.billboard.create({
      data: {
        label,
        images: {
          create: images.map((url: any) => ({
            url,
          })),
        },
        storeId: params.storeId,
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json(billboard, { status: 200 });
  } catch (error) {
    console.log("[BILLBOARDS_POST] ", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}

// Get billboards for a store
export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return NextResponse.json("Store Id is missing", { status: 400 });
    }

    const billboards = await prismadb.billboard.findMany({
      where: {
        storeId: params.storeId,
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json(billboards, { status: 200 });
  } catch (error) {
    console.log("[BILLBOARDS_GET] ", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
