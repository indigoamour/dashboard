const { migrateProductData } = require('../lib/migrate-product-data.ts');

async function runMigration() {
  try {
    console.log('Starting migration...');
    await migrateProductData();
    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
