import { NextResponse } from "next/server";

import { BRAND } from "@/lib/brand";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      where: {
        brand: BRAND,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("ADMIN ORDERS GET ERROR:", error);
    return NextResponse.json({ error: "Unable to load orders" }, { status: 503 });
  }
}
