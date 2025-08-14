import prismadb from "@/lib/prismadb";

export async function migrateProductData() {
  try {
    console.log("Starting product data migration...");
    
    // Get all products
    const products = await prismadb.product.findMany({
      include: {
        images: true,
        size: true,
      },
    });

    console.log(`Found ${products.length} products to migrate`);

    for (const product of products) {
      const updates: any = {};

      // No need to migrate sizeId since we're keeping the original structure

      // Migrate images to imageUrls array
      if (product.images && product.images.length > 0 && (!product.imageUrls || product.imageUrls.length === 0)) {
        updates.imageUrls = product.images.map(img => img.url);
      }

      // Only update if there are changes
      if (Object.keys(updates).length > 0) {
        await prismadb.product.update({
          where: { id: product.id },
          data: updates,
        });
        console.log(`Migrated product: ${product.name}`);
      }
    }

    console.log("Product data migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrateProductData()
    .then(() => {
      console.log("Migration completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Migration failed:", error);
      process.exit(1);
    });
}
