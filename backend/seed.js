const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding...');

    // Create minimal admin user
    const admin = await prisma.user.upsert({
        where: { email: 'admin@harshitpaints.com' },
        update: {},
        create: {
            email: 'admin@harshitpaints.com',
            name: 'Harshit Admin',
            password_hash: '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGgMleRK', // Password: password123
            role: 'ADMIN',
        },
    });
    console.log(`Created admin user with id: ${admin.id}`);

    // Brands
    const asianPaints = await prisma.brand.create({
        data: {
            brand_name: 'Asian Paints',
            discount_percentage: 10,
        },
    });

    const deltron = await prisma.brand.create({
        data: {
            brand_name: 'Deltron',
            discount_percentage: 5,
        },
    });

    const aspa = await prisma.brand.create({
        data: {
            brand_name: 'ASPA',
            discount_percentage: 15,
        },
    });
    console.log('Created brands.');

    // Products and Quantities
    // Asian Paints Products
    await prisma.product.create({
        data: {
            name: 'Tractor Emulsion',
            brand_id: asianPaints.id,
            description: 'Perfect for interior walls, providing a smooth and rich finish. Best-selling commercial emulsion.',
            gst_percentage: 18.0,
            images: ['https://www.asianpaints.com/content/dam/asian_paints/products/packshots/interior-walls-tractor-emulsion-asian-paints.png'],
            quantities: {
                create: [
                    { quantity: '1L', base_price: 250, stock: 50 },
                    { quantity: '4L', base_price: 950, stock: 40 },
                    { quantity: '10L', base_price: 2200, stock: 20 },
                    { quantity: '20L', base_price: 4000, stock: 15 },
                ]
            }
        }
    });

    await prisma.product.create({
        data: {
            name: 'Apcolite All Protek Shyne',
            brand_id: asianPaints.id,
            description: 'Premium interior paint with advanced stain resistance and beautiful soft shine.',
            gst_percentage: 18.0,
            images: ['https://static.asianpaints.com/content/dam/asian_paints/products/packshots/interior-walls-apcolite-all-protek-shyne-packshot-asian-paints.png'],
            quantities: {
                create: [
                    { quantity: '1L', base_price: 450, stock: 30 },
                    { quantity: '4L', base_price: 1750, stock: 25 },
                    { quantity: '20L', base_price: 8000, stock: 10 },
                ]
            }
        }
    });

    // Deltron Products
    await prisma.product.create({
        data: {
            name: 'Deltron Basecoat Metallic',
            brand_id: deltron.id,
            description: 'Standard high-quality automotive basecoat providing vibrant color and smooth application.',
            gst_percentage: 18.0,
            images: ['https://tiimg.tistatic.com/fp/1/005/907/deltron-paints-607.jpg'],
            quantities: {
                create: [
                    { quantity: '500ml', base_price: 1200, stock: 20 },
                    { quantity: '1L', base_price: 2300, stock: 35 },
                ]
            }
        }
    });

    await prisma.product.create({
        data: {
            name: 'Deltron High Gloss Clearcoat',
            brand_id: deltron.id,
            description: 'Premium clearcoat for exceptional shine and UV resistance on automotive finishes.',
            gst_percentage: 18.0,
            images: ['https://www.storktactica.com.au/cms/uploads/StorkAWD-Product-Ppg-Deltron-Paint-System-Ppg-Auto-Paint-400.jpg'],
            quantities: {
                create: [
                    { quantity: '1L', base_price: 2500, stock: 15 },
                    { quantity: '4L', base_price: 9000, stock: 10 },
                ]
            }
        }
    });

    // ASPA Products
    await prisma.product.create({
        data: {
            name: 'ASPA 2K Solid Auto Color',
            brand_id: aspa.id,
            description: 'Fast drying and cost-effective two-component automotive repair finish.',
            gst_percentage: 18.0,
            images: [],
            quantities: {
                create: [
                    { quantity: '1L', base_price: 850, stock: 45 },
                    { quantity: '4L', base_price: 3200, stock: 20 },
                ]
            }
        }
    });

    console.log('Seeding finished.');
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
