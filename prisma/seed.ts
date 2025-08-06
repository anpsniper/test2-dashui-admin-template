import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting data seeding...');

  // Clear existing data (optional, but good for development to ensure a clean slate)
  // Be cautious with this in production environments!
  try {
    await prisma.productsOwners.deleteMany();
    await prisma.product.deleteMany();
    await prisma.owner.deleteMany();
    console.log('Cleared existing data.');
  } catch (error) {
    console.warn('Could not clear some data (might not exist yet):', error);
  }

  // Seed Owners
  console.log('Seeding Owners...');
  const appleInc = await prisma.owner.create({
    data: {
      owner_name: 'Apple Inc.',
    },
  });
  console.log(`Created owner: ${appleInc.owner_name} (ID: ${appleInc.id})`);

  const samsungLtd = await prisma.owner.create({
    data: {
      owner_name: 'Samsung Ltd',
    },
  });
  console.log(`Created owner: ${samsungLtd.owner_name} (ID: ${samsungLtd.id})`);

  // Seed Products
  console.log('Seeding Products...');
  const iphone15Pro = await prisma.product.create({
    data: {
      product_name: 'iPhone 15 Pro',
      product_brand: 'phone', // As per screenshot
      created_date: new Date(),
    },
  });
  console.log(`Created product: ${iphone15Pro.product_name} (ID: ${iphone15Pro.id})`);

  const ipadAir11 = await prisma.product.create({
    data: {
      product_name: 'iPad Air 11',
      product_brand: 'macbook', // As per screenshot (though 'tablet' might be more logical, following source)
      created_date: new Date(),
    },
  });
  console.log(`Created product: ${ipadAir11.product_name} (ID: ${ipadAir11.id})`);

  const macbookPro14 = await prisma.product.create({
    data: {
      product_name: 'MacBook Pro 14',
      product_brand: 'macbook', // As per screenshot
      created_date: new Date(),
    },
  });
  console.log(`Created product: ${macbookPro14.product_name} (ID: ${macbookPro14.id})`);

  const galaxyS25Series = await prisma.product.create({
    data: {
      product_name: 'Galaxy S25 series',
      product_brand: 'phone', // As per screenshot
      created_date: new Date(),
    },
  });
  console.log(`Created product: ${galaxyS25Series.product_name} (ID: ${galaxyS25Series.id})`);

  const galaxyTabS10FE = await prisma.product.create({
    data: {
      product_name: 'Galaxy Tab S10FE',
      product_brand: 'tablet', // As per screenshot
      created_date: new Date(),
    },
  });
  console.log(`Created product: ${galaxyTabS10FE.product_name} (ID: ${galaxyTabS10FE.id})`);

  const evercrossX8 = await prisma.product.create({
    data: {
      product_name: 'Evercross X8',
      product_brand: 'phone', // As per screenshot
      created_date: new Date(),
    },
  });
  console.log(`Created product: ${evercrossX8.product_name} (ID: ${evercrossX8.id})`);

  const advance89 = await prisma.product.create({
    data: {
      product_name: 'Advance 89',
      product_brand: 'phone', // As per screenshot
      created_date: new Date(),
    },
  });
  console.log(`Created product: ${advance89.product_name} (ID: ${advance89.id})`);


  // Seed ProductsOwners (Relationships)
  console.log('Seeding ProductsOwners relationships...');

  // (1,1) -> iPhone 15 Pro (ID 1) with Apple Inc. (ID 1)
  await prisma.productsOwners.create({
    data: {
      products_id: iphone15Pro.id,
      owners_id: appleInc.id,
    },
  });
  console.log(`Linked ${iphone15Pro.product_name} to ${appleInc.owner_name}`);

  // (2,1) -> iPad Air 11 (ID 2) with Apple Inc. (ID 1)
  await prisma.productsOwners.create({
    data: {
      products_id: ipadAir11.id,
      owners_id: appleInc.id,
    },
  });
  console.log(`Linked ${ipadAir11.product_name} to ${appleInc.owner_name}`);

  // (3,1) -> MacBook Pro 14 (ID 3) with Apple Inc. (ID 1)
  await prisma.productsOwners.create({
    data: {
      products_id: macbookPro14.id,
      owners_id: appleInc.id,
    },
  });
  console.log(`Linked ${macbookPro14.product_name} to ${appleInc.owner_name}`);

  // (4,2) -> Galaxy S25 series (ID 4) with Samsung Ltd (ID 2)
  await prisma.productsOwners.create({
    data: {
      products_id: galaxyS25Series.id,
      owners_id: samsungLtd.id,
    },
  });
  console.log(`Linked ${galaxyS25Series.product_name} to ${samsungLtd.owner_name}`);

  // (5,2) -> Galaxy Tab S10FE (ID 5) with Samsung Ltd (ID 2)
  await prisma.productsOwners.create({
    data: {
      products_id: galaxyTabS10FE.id,
      owners_id: samsungLtd.id,
    },
  });
  console.log(`Linked ${galaxyTabS10FE.product_name} to ${samsungLtd.owner_name}`);

  // (6,1) -> Evercross X8 (ID 6) with Apple Inc. (ID 1) - Following screenshot data
  await prisma.productsOwners.create({
    data: {
      products_id: evercrossX8.id,
      owners_id: appleInc.id,
    },
  });
  console.log(`Linked ${evercrossX8.product_name} to ${appleInc.owner_name}`);

  // (7,1) -> Advance 89 (ID 7) with Apple Inc. (ID 1) - Following screenshot data
  await prisma.productsOwners.create({
    data: {
      products_id: advance89.id,
      owners_id: appleInc.id,
    },
  });
  console.log(`Linked ${advance89.product_name} to ${appleInc.owner_name}`);


  console.log('Data seeding complete!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
