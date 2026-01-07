// app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { OrderStatus } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    console.log('Received order request');
    
    const body = await request.json();
    console.log('Request body:', JSON.stringify(body, null, 2));

    const { customer, items, totalAmount } = body;

    // Validate required fields
    if (!customer?.name || !customer?.email || !customer?.phone || !customer?.address) {
      console.log('Missing customer information');
      return NextResponse.json(
        { error: 'Missing customer information' },
        { status: 400 }
      );
    }

    if (!items || items.length === 0) {
      console.log('No items in order');
      return NextResponse.json(
        { error: 'No items in order' },
        { status: 400 }
      );
    }

    console.log('Creating order in database...');

    // Create order in database - FIX: Convert productId to string
    const order = await prisma.order.create({
      data: {
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        customerAddress: customer.address,
        totalAmount: totalAmount,
        items: {
          create: items.map((item: any) => ({
            productId: item.id.toString(), // Convert to string
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image || null,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    console.log('Order created successfully:', order.id);

    return NextResponse.json({ 
      success: true, 
      orderId: order.id 
    });
    
  } catch (error) {
    console.error('Error creating order:', error);
    
    // More detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: errorMessage,
        stack: process.env.NODE_ENV === 'development' ? errorStack : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    const orders = await prisma.order.findMany({
      where: status ? { status: status as OrderStatus } : {},
      include: {
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}