import { NextResponse } from "next/server";

import cloudinary from "@/lib/cloudinary";

const folders: Record<string, string> = {
  suits: "bacibaci/suits",
  evening: "bacibaci/evening",
  essentials: "bacibaci/essentials",
  orders: "bacibaci/orders",
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const file = String(body.file ?? "").trim();
    const category = String(body.category ?? "suits").trim().toLowerCase();

    if (!file) {
      return NextResponse.json({ error: "Missing image payload" }, { status: 400 });
    }

    const result = await cloudinary.uploader.upload(file, {
      folder: folders[category] ?? folders.suits,
      resource_type: "auto",
    });

    return NextResponse.json({ secure_url: result.secure_url });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    return NextResponse.json({ error: "Unable to upload image" }, { status: 500 });
  }
}
