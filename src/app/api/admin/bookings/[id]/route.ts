import { NextResponse } from "next/server";

import { BRAND } from "@/lib/brand";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const status = String(body.status ?? "").trim().toLowerCase();

    if (!id || !status) {
      return NextResponse.json({ error: "Missing booking status" }, { status: 400 });
    }

    await prisma.booking.updateMany({
      where: { id, brand: BRAND },
      data: { status },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("BOOKING UPDATE ERROR:", error);
    return NextResponse.json({ error: "Unable to update booking" }, { status: 503 });
  }
}
