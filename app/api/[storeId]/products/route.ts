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
    const {
      name,
      price,
      categoryId,
      description,
      cuttedPrice,
      discount,
      collectionTitle,
      availableQuantity,
      colorId,
      sizeId,
      images,
      shippingAvailable,
      isFeatured,
      isArchived,
    } = body;

    if (
      !name ||
      !availableQuantity ||
      !price ||
      !description ||
      !images?.length
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!params.storeId) {
      return NextResponse.json(
        { error: "Store ID is required" },
        { status: 400 }
      );
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

    const product = await prismadb.product.create({
      data: {
        name,
        price,
        isArchived,
        description,
        availableQuantity,
        collectionTitle,
        cuttedPrice,
        discount,
        isFeatured,
        shippingAvailable,
        categoryId,
        colorId,
        sizeId,
        storeId: params.storeId,
        images: {
          createMany: {
            data: images.map((image: { url: string }) => ({
              url: image.url,
            })),
          },
        },
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCT_POST]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const isFeatured = searchParams.get("isFeatured");
    const productName = searchParams.get("name") || undefined;
    const collectionTitle = searchParams.get("collectionTitle") || undefined;

    const lowerPrice = parseInt(searchParams.get("lowerPrice") || "0", 10);
    const upperPrice = parseInt(searchParams.get("upperPrice") || "1000", 10);

    console.log("Lower Price:", lowerPrice);
    console.log("Upper Price:", upperPrice);

    if (!params.storeId) {
      return NextResponse.json("Store Id is missing", { status: 400 });
    }

    const whereClause: any = {
      storeId: params.storeId,
      categoryId,
      colorId,
      sizeId,
      isFeatured: isFeatured ? true : undefined,
      isArchived: false,
      collectionTitle,
    };

    if (productName) {
      whereClause.name = {
        contains: productName,
        mode: "insensitive",
      };
    }

    if (lowerPrice && upperPrice) {
      whereClause.price = {
        gte: lowerPrice,
        lte: upperPrice,
      };
    }

    const products = await prismadb.product.findMany({
      where: whereClause,
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
      },
    });

    return NextResponse.json(
      { products, msg: "Products Fetched Successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[PRODUCTS_GET] ", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}