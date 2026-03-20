import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const body = await request.json();
    const { id } = await context.params;
    const status = String(body.status ?? "").trim().toLowerCase();

    if (!status) {
      return NextResponse.json({ error: "Missing order status" }, { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ order });
  } catch (error) {
    console.error("ADMIN ORDER UPDATE ERROR:", error);
    return NextResponse.json({ error: "Unable to update order" }, { status: 503 });
  }
}
