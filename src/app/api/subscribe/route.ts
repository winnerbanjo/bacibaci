import { randomUUID } from "crypto";

import { NextResponse } from "next/server";

import { BRAND } from "@/lib/brand";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email ?? "").trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const existing = await prisma.subscriber.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json({ success: true });
    }

    const subscriber = await prisma.subscriber.create({
      data: {
        id: randomUUID(),
        email,
        brand: BRAND,
      },
    });

    return NextResponse.json({ subscriber });
  } catch (error) {
    console.error("SUBSCRIBE ERROR:", error);
    return NextResponse.json({ error: "Unable to subscribe right now." }, { status: 503 });
  }
}
