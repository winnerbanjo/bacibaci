import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { siteSettingKeys } from "@/lib/site-settings";

export async function GET() {
  try {
    const settings = await prisma.setting.findMany({
      where: {
        key: {
          in: [
            siteSettingKeys.suit,
            siteSettingKeys.evening,
            siteSettingKeys.giftEnabled,
            siteSettingKeys.giftDenominations,
          ],
        },
      },
    });

    return NextResponse.json({
      settings: {
        suitPricing: settings.find((entry) => entry.key === siteSettingKeys.suit)?.value ?? "",
        eveningPricing:
          settings.find((entry) => entry.key === siteSettingKeys.evening)?.value ?? "",
        giftCardEnabled:
          (settings.find((entry) => entry.key === siteSettingKeys.giftEnabled)?.value ?? "true") ===
          "true",
        giftCardDenominations:
          settings.find((entry) => entry.key === siteSettingKeys.giftDenominations)?.value ??
          "50000,100000,200000,300000,500000,1000000",
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
    const giftCardEnabled = String(Boolean(body.giftCardEnabled));
    const giftCardDenominations = String(body.giftCardDenominations ?? "").trim();

    await prisma.$transaction([
      prisma.setting.upsert({
        where: { key: siteSettingKeys.suit },
        update: {
          value: suitPricing,
          updatedAt: new Date(),
        },
        create: {
          key: siteSettingKeys.suit,
          value: suitPricing,
          updatedAt: new Date(),
        },
      }),
      prisma.setting.upsert({
        where: { key: siteSettingKeys.evening },
        update: {
          value: eveningPricing,
          updatedAt: new Date(),
        },
        create: {
          key: siteSettingKeys.evening,
          value: eveningPricing,
          updatedAt: new Date(),
        },
      }),
      prisma.setting.upsert({
        where: { key: siteSettingKeys.giftEnabled },
        update: {
          value: giftCardEnabled,
          updatedAt: new Date(),
        },
        create: {
          key: siteSettingKeys.giftEnabled,
          value: giftCardEnabled,
          updatedAt: new Date(),
        },
      }),
      prisma.setting.upsert({
        where: { key: siteSettingKeys.giftDenominations },
        update: {
          value: giftCardDenominations,
          updatedAt: new Date(),
        },
        create: {
          key: siteSettingKeys.giftDenominations,
          value: giftCardDenominations,
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
