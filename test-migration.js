const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testMigration() {
  try {
    console.log('Testing migration...');
    
    // Test 1: Check if new fields exist
    const products = await prisma.product.findMany({
      take: 1,
      select: {
        id: true,
        name: true,
        sizeIds: true,
        imageUrls: true,
        sizeId: true,
      }
    });
    
    console.log('✅ New fields are accessible:', products[0]);
    
    // Test 2: Check if we can create a product with new fields
    const testProduct = await prisma.product.create({
      data: {
        name: 'Test Product - Migration',
        skuCode: 'TEST-MIG-001',
        price: 99.99,
        cuttedPrice: 79.99,
        discount: 20,
        description: 'Test product for migration',
        collectionTitle: 'Test Collection',
        availableQuantity: 10,
        shippingAvailable: 'Free shipping',
        categoryId: '507f1f77bcf86cd799439011', // You'll need to replace with actual category ID
        colorId: '507f1f77bcf86cd799439012', // You'll need to replace with actual color ID
        sizeIds: ['507f1f77bcf86cd799439013'], // You'll need to replace with actual size ID
        imageUrls: ['https://example.com/test-image.jpg'],
        storeId: '507f1f77bcf86cd799439014', // You'll need to replace with actual store ID
      }
    });
    
    console.log('✅ New product created with new fields:', testProduct);
    
    // Clean up test product
    await prisma.product.delete({
      where: { id: testProduct.id }
    });
    
    console.log('✅ Test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testMigration();
