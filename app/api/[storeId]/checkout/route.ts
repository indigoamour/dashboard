import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prismadb from "@/lib/prismadb";
import razorpay from "@/lib/razorpay";
import { NextResponse } from "next/server";
import { getCorsHeaders, handlePreflight } from "@/lib/cors";
import Razorpay from "razorpay";

export async function OPTIONS(req: Request) {
  return handlePreflight(req);
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const headers = getCorsHeaders(req.headers.get("origin") || "*");
  try {
    // const session = await getServerSession(authOptions);
    // const userId = session?.user?.id;

    // if (!userId) {
    //   return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    // }

    const { items, phone, address } = await req.json();

    if (!items || !phone || !address) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const products = await prismadb.product.findMany({
      where: {
        id: {
          in: items.map((item: any) => item.productId),
        },
      },
    });

    let total = 0;
    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (product) {
        total += product.price * item.quantity;
      }
    }

    // Get shippingFee from frontend, default to 0 if not sent
    const { shippingFee = 0 } = await req.json();
    total += shippingFee;

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
    const razorpayOrder = await razorpay.orders.create({
      amount: total * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    const order = await prismadb.order.create({
      data: {
        storeId: params.storeId,
        phone,
        address,
        razorpayOrderId: razorpayOrder.id,
        orderItems: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
    });

    return NextResponse.json(
      {
        orderId: order.id,
        razorpayOrder,
        msg: "Order & Razorpay order created",
      },
      { status: 200, headers }
    );
  } catch (error) {
    console.error("[CHECKOUT_POST]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers }
    );
  }
}
