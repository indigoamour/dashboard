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
      skuCode,
      price,
      categoryId,
      description,
      cuttedPrice,
      discount,
      collectionTitle,
      availableQuantity,
      colorId,
      selectedSizeIds,
      images,
      imageUrls,
      shippingAvailable,
      isFeatured,
      isArchived,
    } = body;

    if (
      !name ||
      !skuCode ||
      !availableQuantity ||
      !price ||
      !description ||
      (!images?.length && !imageUrls?.length) ||
      !collectionTitle ||
      collectionTitle.trim() === "" ||
      !selectedSizeIds?.length
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

    // Get the sizes to create products for
    const sizes = await prismadb.size.findMany({
      where: {
        id: { in: selectedSizeIds },
        storeId: params.storeId,
      },
    });

    if (sizes.length === 0) {
      return NextResponse.json(
        { error: "No valid sizes found" },
        { status: 400 }
      );
    }

    const createdProducts = [];

    // Create a product for each selected size
    for (const size of sizes) {
      const product = await prismadb.product.create({
        data: {
          name: `${name} - ${size.name}`,
          skuCode: `${skuCode}-${size.value}`,
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
                                sizeId: size.id,
           imageUrls: imageUrls || images?.map((img: { url: string }) => img.url) || [],
           storeId: params.storeId,
          images: {
            createMany: {
              data: images?.map((image: { url: string }) => ({
                url: image.url,
              })) || [],
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

      createdProducts.push(product);
    }

    return NextResponse.json({
      products: createdProducts,
      message: `Successfully created ${createdProducts.length} products`,
    });
  } catch (error) {
    console.error("[BULK_PRODUCT_POST]", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
