import { prisma } from "@/lib/prisma";

const SUIT_KEY = "bacibaci_suit_pricing";
const EVENING_KEY = "bacibaci_evening_pricing";
const GIFT_CARD_ENABLED_KEY = "bacibaci_gift_card_enabled";
const GIFT_CARD_DENOMINATIONS_KEY = "bacibaci_gift_card_denominations";

export type SiteSettings = {
  suitPricing: string;
  eveningPricing: string;
  giftCardEnabled: boolean;
  giftCardDenominations: number[];
};

const defaultDenominations = [50000, 100000, 200000, 300000, 500000, 1000000];

export async function getSiteSettings(): Promise<SiteSettings> {
  const settings = await prisma.setting.findMany({
    where: {
      key: {
        in: [SUIT_KEY, EVENING_KEY, GIFT_CARD_ENABLED_KEY, GIFT_CARD_DENOMINATIONS_KEY],
      },
    },
  });

  const giftCardValue = settings.find((entry) => entry.key === GIFT_CARD_DENOMINATIONS_KEY)?.value ?? "";
  const parsedDenominations = giftCardValue
    .split(",")
    .map((value) => Number(value.trim()))
    .filter((value) => Number.isFinite(value) && value > 0);

  return {
    suitPricing: settings.find((entry) => entry.key === SUIT_KEY)?.value ?? "",
    eveningPricing: settings.find((entry) => entry.key === EVENING_KEY)?.value ?? "",
    giftCardEnabled:
      (settings.find((entry) => entry.key === GIFT_CARD_ENABLED_KEY)?.value ?? "true") === "true",
    giftCardDenominations: parsedDenominations.length ? parsedDenominations : defaultDenominations,
  };
}

export const siteSettingKeys = {
  suit: SUIT_KEY,
  evening: EVENING_KEY,
  giftEnabled: GIFT_CARD_ENABLED_KEY,
  giftDenominations: GIFT_CARD_DENOMINATIONS_KEY,
};
