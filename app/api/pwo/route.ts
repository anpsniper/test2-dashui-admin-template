// app/api/pwo/route.ts
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const searchQuery = searchParams.get('search') || '';

    const whereClause: any = {};
    if (searchQuery) {
      whereClause.OR = [
        {
          product_name: {
            contains: searchQuery,
          },
        },
        {
          product_brand: {
            contains: searchQuery,
          },
        },
        {
          products_owners: {
            some: {
              owner: {
                owner_name: {
                  contains: searchQuery,
                },
              },
            },
          },
        },
      ];
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      take: limit,
      skip: offset,
      select: {
        id: true,
        product_name: true,
        product_brand: true,
        products_owners: {
          select: {
            owner: {
              select: {
                owner_name: true,
              },
            },
          },
        },
      },
      orderBy: {
        id: 'asc',
      },
    });

    const totalCount = await prisma.product.count({
      where: whereClause,
    });

    const formattedProducts = products.map(product => ({
      id: product.id,
      product_name: product.product_name,
      product_brand: product.product_brand,
      product_owner: product.products_owners
        .map(po => po.owner.owner_name)
        .join(', ') || 'N/A',
    }));

    return NextResponse.json({
      data: formattedProducts,
      totalCount: totalCount,
      limit: limit,
      offset: offset,
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching products with owners:', error);
    const errorMessage = process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred.';
    return NextResponse.json(
      { message: 'Failed to fetch products with owners', error: errorMessage },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
