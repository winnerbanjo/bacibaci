import { randomUUID } from "crypto";

import { NextResponse } from "next/server";

import { BRAND } from "@/lib/brand";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = {
      name: String(body.name ?? "").trim(),
      email: String(body.email ?? "").trim(),
      phone: String(body.phone ?? "").trim(),
      service: String(body.service ?? "").trim(),
      date: String(body.date ?? "").trim(),
      time: String(body.time ?? "").trim(),
      type: String(body.type ?? "").trim(),
      notes: String(body.notes ?? "").trim(),
    };

    if (
      !payload.name ||
      !payload.email ||
      !payload.phone ||
      !payload.service ||
      !payload.date ||
      !payload.time ||
      !payload.type
    ) {
      return NextResponse.json({ error: "Missing booking details" }, { status: 400 });
    }

    const booking = await prisma.booking.create({
      data: {
        id: randomUUID(),
        brand: BRAND,
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        service: payload.service,
        date: payload.date,
        time: payload.time,
        type: payload.type,
        notes: payload.notes || null,
        paymentProof: null,
      },
    });

    return NextResponse.json({ booking });
  } catch (error) {
    console.error("BOOKING ERROR:", error);
    return NextResponse.json(
      { error: "We could not submit your request right now." },
      { status: 503 }
    );
  }
}
