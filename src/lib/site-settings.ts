import { prisma } from "@/lib/prisma";

const SUIT_KEY = "bacibaci_suit_pricing";
const EVENING_KEY = "bacibaci_evening_pricing";
const GIFT_CARD_ENABLED_KEY = "bacibaci_gift_card_enabled";
const GIFT_CARD_DENOMINATIONS_KEY = "bacibaci_gift_card_denominations";
const BANK_ACCOUNT_NAME_KEY = "bacibaci_bank_account_name";
const BANK_ACCOUNT_NUMBER_KEY = "bacibaci_bank_account_number";
const BANK_NAME_KEY = "bacibaci_bank_name";

export type SiteSettings = {
  suitPricing: string;
  eveningPricing: string;
  giftCardEnabled: boolean;
  giftCardDenominations: number[];
  bankAccountName: string;
  bankAccountNumber: string;
  bankName: string;
};

const defaultDenominations = [50000, 100000, 200000, 300000, 500000, 1000000];

export async function getSiteSettings(): Promise<SiteSettings> {
  const settings = await prisma.setting.findMany({
    where: {
      key: {
        in: [
          SUIT_KEY,
          EVENING_KEY,
          GIFT_CARD_ENABLED_KEY,
          GIFT_CARD_DENOMINATIONS_KEY,
          BANK_ACCOUNT_NAME_KEY,
          BANK_ACCOUNT_NUMBER_KEY,
          BANK_NAME_KEY,
        ],
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
    bankAccountName:
      settings.find((entry) => entry.key === BANK_ACCOUNT_NAME_KEY)?.value ?? "Baci Baci",
    bankAccountNumber:
      settings.find((entry) => entry.key === BANK_ACCOUNT_NUMBER_KEY)?.value ?? "Update in admin",
    bankName: settings.find((entry) => entry.key === BANK_NAME_KEY)?.value ?? "Update in admin",
  };
}

export const siteSettingKeys = {
  suit: SUIT_KEY,
  evening: EVENING_KEY,
  giftEnabled: GIFT_CARD_ENABLED_KEY,
  giftDenominations: GIFT_CARD_DENOMINATIONS_KEY,
  bankAccountName: BANK_ACCOUNT_NAME_KEY,
  bankAccountNumber: BANK_ACCOUNT_NUMBER_KEY,
  bankName: BANK_NAME_KEY,
};
