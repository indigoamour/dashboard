const axios = require('axios');

async function testBulkCreation() {
  try {
    console.log('Testing bulk product creation...');
    
    // Test data for bulk creation
    const testData = {
      name: "Test Product",
      skuCode: "TEST-BULK-001",
      price: 100,
      cuttedPrice: 120,
      discount: 20,
      description: "Test product for bulk creation",
      collectionTitle: "Test Collection",
      availableQuantity: 10,
      shippingAvailable: "Free shipping",
      categoryId: "6829770685f0d88d777fa935", // Replace with actual category ID
      colorId: "6829dc5cccd8b1c9b9923dbe", // Replace with actual color ID
      selectedSizeIds: ["6817040e7fe22823c892d1d7"], // Replace with actual size IDs
      images: [
        { url: "https://example.com/test-image-1.jpg" },
        { url: "https://example.com/test-image-2.jpg" }
      ],
      isFeatured: false,
      isArchived: false
    };
    
    console.log('Test data prepared:', testData);
    console.log('✅ Bulk creation test data is ready');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testBulkCreation();
