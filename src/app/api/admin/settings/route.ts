import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

const SUIT_KEY = "bacibaci_suit_pricing";
const EVENING_KEY = "bacibaci_evening_pricing";

export async function GET() {
  try {
    const settings = await prisma.setting.findMany({
      where: {
        key: {
          in: [SUIT_KEY, EVENING_KEY],
        },
      },
    });

    return NextResponse.json({
      settings: {
        suitPricing: settings.find((entry) => entry.key === SUIT_KEY)?.value ?? "",
        eveningPricing: settings.find((entry) => entry.key === EVENING_KEY)?.value ?? "",
      },
    });
  } catch (error) {
    console.error("ADMIN SETTINGS ERROR:", error);
    return NextResponse.json({ error: "Unable to load settings" }, { status: 503 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const suitPricing = String(body.suitPricing ?? "").trim();
    const eveningPricing = String(body.eveningPricing ?? "").trim();

    await prisma.$transaction([
      prisma.setting.upsert({
        where: { key: SUIT_KEY },
        update: {
          value: suitPricing,
          updatedAt: new Date(),
        },
        create: {
          key: SUIT_KEY,
          value: suitPricing,
          updatedAt: new Date(),
        },
      }),
      prisma.setting.upsert({
        where: { key: EVENING_KEY },
        update: {
          value: eveningPricing,
          updatedAt: new Date(),
        },
        create: {
          key: EVENING_KEY,
          value: eveningPricing,
          updatedAt: new Date(),
        },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ADMIN SETTINGS UPDATE ERROR:", error);
    return NextResponse.json({ error: "Unable to save settings" }, { status: 503 });
  }
}
