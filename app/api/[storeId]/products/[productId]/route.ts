import prismadb from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { productId: string; storeId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    console.log("Received product update data:", body);
    
    const {
      name,
      skuCode,
      price,
      categoryId,
      description,
      cuttedPrice,
      discount,
      availableQuantity,
      collectionTitle,
      colorId,
      sizeId,
      images,
      shippingAvailable,
      isFeatured,
      isArchived,
    } = body;

    if (!session || !session.user) {
      return NextResponse.json("Unauthenticated", { status: 401 });
    }
    if (!name) {
      return NextResponse.json("Name is required", { status: 400 });
    }
    if (!skuCode) {
      return NextResponse.json("SKU Code is required", { status: 400 });
    }
    if (!images || !images.length) {
      return NextResponse.json("At least one image is required", { status: 400 });
    }
    if (!price || price <= 0) {
      return NextResponse.json("Price must be greater than 0", { status: 400 });
    }
    if (!availableQuantity || availableQuantity <= 0) {
      return NextResponse.json("Available Quantity must be greater than 0", { status: 400 });
    }
    if (!description) {
      return NextResponse.json("Description is required", { status: 400 });
    }
    if (!shippingAvailable) {
      return NextResponse.json("Shipping Available Details are required", {
        status: 400,
      });
    }
    if (!collectionTitle || collectionTitle.trim() === "") {
      return NextResponse.json("Collection Title is required", { status: 400 });
    }
    if (!cuttedPrice || cuttedPrice <= 0) {
      return NextResponse.json("Cutted Price must be greater than 0", { status: 400 });
    }
    if (!discount || discount < 0 || discount > 100) {
      return NextResponse.json("Discount must be between 0 and 100", { status: 400 });
    }
    if (!categoryId) {
      return NextResponse.json("Category is required", { status: 400 });
    }
    if (!colorId) {
      return NextResponse.json("Color is required", { status: 400 });
    }
    if (!sizeId) {
      return NextResponse.json("Size is required", { status: 400 });
    }
    if (!params.storeId) {
      return NextResponse.json("Store ID is required", { status: 400 });
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

    await prismadb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        name,
        skuCode,
        price,
        description,
        collectionTitle,
        cuttedPrice,
        discount,
        availableQuantity,
        shippingAvailable,
        categoryId,
        colorId,
        sizeId,
        images: { deleteMany: {} },
        isFeatured,
        isArchived,
      },
    });

    const product = await prismadb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return NextResponse.json(
      { ...product, msg: "Product Updated Successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[PRODUCT_PATCH] ", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { productId: string; storeId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json("Unauthenticated", { status: 401 });
    }
    if (!params.productId) {
      return NextResponse.json("Product ID is missing", { status: 400 });
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

    const deletedProduct = await prismadb.product.deleteMany({
      where: {
        id: params.productId,
      },
    });

    return NextResponse.json(
      { ...deletedProduct, msg: "Product Deleted Successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("[PRODUCT_DELETE] ", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    if (!params.productId) {
      return NextResponse.json("Product ID is missing", { status: 400 });
    }

    const product = await prismadb.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        images: true,
        category: true,
        size: true,
        color: true,
      },
    });

    return NextResponse.json(
      { ...product, msg: "Product Fetched Successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("[PRODUCT_GET] ", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
