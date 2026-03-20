import { NextResponse } from "next/server";

import { BRAND } from "@/lib/brand";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const subscribers = await prisma.subscriber.findMany({
      where: {
        brand: BRAND,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ subscribers });
  } catch (error) {
    console.error("ADMIN SUBSCRIBERS ERROR:", error);
    return NextResponse.json({ error: "Unable to load subscribers" }, { status: 503 });
  }
}
