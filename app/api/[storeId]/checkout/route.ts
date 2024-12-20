// import Stripe from "stripe";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
// import { stripe } from "@/lib/stripe";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // allow requests from any other domain
  "Access-Control-Allow-Methods": "GET,HEAD,PUT,OPTIONS,POST,DELETE",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  try {
    // Parse request body
    const { orders,phone,email,address,name } = await req.json();

    // Validate input
    if (!orders || !Array.isArray(orders) || orders.length === 0) {
      return NextResponse.json({ error: "Orders are required" }, { status: 400 });
    }

    if (!params.storeId) {
      return NextResponse.json({ error: "Store ID is required" }, { status: 400 });
    }

    // Map order items for Prisma
    const orderItemsData = orders.map((order: any) => {
      if (!order.productId || !order.quantity || !order.price) {
        throw new Error("Each order must have a productId, quantity, and price");
      }
      return {
        productId: order.productId,
        quantity: order.quantity,
        price: order.price,
        total: order.quantity * order.price,
        title: order.title,
        image: order.image,
        colors: order.colors || [],
        sizes: order.sizes || [],
        discountPercentage: order.discountPercentage || null,
        status: order.status || "active",
        isCancellable: order.isCancellable || true,
        placedAt: new Date(),
      };
    });

    // Create order in the database
    const order = await prismadb.order.create({
      data: {
        storeId: params.storeId,
        isPaid: true, // Assuming payment is successful for this example
        phone,
        address,
        email,
        name,
        orderItems: {
          create: orderItemsData,
        },
      },
      include: {
        orderItems: true,
      },
    });

    // Optionally integrate with Stripe for payment processing
    // const line_items = orderItemsData.map((item) => ({
    //   quantity: item.quantity,
    //   price_data: {
    //     currency: "USD",
    //     product_data: {
    //       name: item.title,
    //       images: [item.image],
    //     },
    //     unit_amount: item.price * 100, // Stripe requires the amount in cents
    //   },
    // }));

    // const session = await stripe.checkout.sessions.create({
    //   payment_method_types: ["card"],
    //   line_items,
    //   mode: "payment",
    //   success_url: `${process.env.NEXT_PUBLIC_STORE_URL}/success`,
    //   cancel_url: `${process.env.NEXT_PUBLIC_STORE_URL}/cancel`,
    // });

    return NextResponse.json({ order }, { headers: corsHeaders });
  } catch (error: any) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: error.message || "Failed to create order" }, { status: 500 });
  }
}
