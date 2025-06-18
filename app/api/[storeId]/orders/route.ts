import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prismadb from "@/lib/prismadb";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { items, phone, address } = body;

    if (!items || !items.length) {
      return new NextResponse("Items are required", { status: 400 });
    }

    if (!phone) {
      return new NextResponse("Phone number is required", { status: 400 });
    }

    if (!address) {
      return new NextResponse("Address is required", { status: 400 });
    }

    // Verify store exists
    const store = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
      },
    });

    if (!store) {
      return new NextResponse("Store not found", { status: 404 });
    }

    // Create order
    const order = await prismadb.order.create({
      data: {
        storeId: params.storeId,
        phone,
        address,
        orderItems: {
          create: items.map((item: { productId: string }) => ({
            productId: item.productId,
          })),
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("[ORDERS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 