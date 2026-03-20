import { BRAND } from "@/lib/brand";
import { prisma } from "@/lib/prisma";

export async function getBrandBookings() {
  return prisma.booking.findMany({
    where: {
      brand: BRAND,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
