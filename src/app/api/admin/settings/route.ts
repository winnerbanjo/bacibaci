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
            siteSettingKeys.bankAccountName,
            siteSettingKeys.bankAccountNumber,
            siteSettingKeys.bankName,
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
        bankAccountName:
          settings.find((entry) => entry.key === siteSettingKeys.bankAccountName)?.value ??
          "Baci Baci",
        bankAccountNumber:
          settings.find((entry) => entry.key === siteSettingKeys.bankAccountNumber)?.value ??
          "Update in admin",
        bankName:
          settings.find((entry) => entry.key === siteSettingKeys.bankName)?.value ??
          "Update in admin",
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
    const bankAccountName = String(body.bankAccountName ?? "").trim();
    const bankAccountNumber = String(body.bankAccountNumber ?? "").trim();
    const bankName = String(body.bankName ?? "").trim();

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
      prisma.setting.upsert({
        where: { key: siteSettingKeys.bankAccountName },
        update: {
          value: bankAccountName,
          updatedAt: new Date(),
        },
        create: {
          key: siteSettingKeys.bankAccountName,
          value: bankAccountName,
          updatedAt: new Date(),
        },
      }),
      prisma.setting.upsert({
        where: { key: siteSettingKeys.bankAccountNumber },
        update: {
          value: bankAccountNumber,
          updatedAt: new Date(),
        },
        create: {
          key: siteSettingKeys.bankAccountNumber,
          value: bankAccountNumber,
          updatedAt: new Date(),
        },
      }),
      prisma.setting.upsert({
        where: { key: siteSettingKeys.bankName },
        update: {
          value: bankName,
          updatedAt: new Date(),
        },
        create: {
          key: siteSettingKeys.bankName,
          value: bankName,
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
