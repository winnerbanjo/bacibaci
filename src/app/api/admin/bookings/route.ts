import { NextResponse } from "next/server";

import { getBrandBookings } from "@/lib/bookings";

export async function GET() {
  try {
    const bookings = await getBrandBookings();
    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("ADMIN BOOKINGS ERROR:", error);
    return NextResponse.json({ error: "Unable to load bookings" }, { status: 503 });
  }
}
