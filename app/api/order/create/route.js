import connectDB from "@/config/db";
import Product from "@/models/Product";
import User from "@/models/User";
import Order from "@/models/Order";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const { address, items } = await request.json();

    if (!address || items.length === 0) {
      return NextResponse.json({ success: false, message: "Invalid data" });
    }

    await connectDB();

    // calculate amount
    let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return NextResponse.json({ success: false, message: `Product not found: ${item.product}` });
      }
      if (!product.offerPrice) {
        return NextResponse.json({ success: false, message: `Offer price not found for product: ${item.product}` });
      }
      amount += product.offerPrice * item.quantity;
    }

    const totalAmount = amount + Math.floor(amount * 0.02);

    const order = await Order.create({
      userId,
      address,
      items,
      amount: totalAmount,
      date: Date.now()
    });

    // clear user cart
    const user = await User.findById(userId);
    user.cartItems = {};
    await user.save();

    return NextResponse.json({ success: true, message: "Order placed", order });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, message: error.message });
  }
}
