import { NextResponse } from "next/server";

const fallbackPasscode = "dionbaci123";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const password = String(body.password ?? "").trim();
    const passcode =
      process.env.ADMIN_PASSCODE ??
      process.env.NEXT_PUBLIC_ADMIN_PASSCODE ??
      fallbackPasscode;

    if (!password || password !== passcode) {
      return NextResponse.json({ error: "Wrong passcode" }, { status: 401 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ADMIN AUTH ERROR:", error);
    return NextResponse.json({ error: "Unable to login" }, { status: 500 });
  }
}
