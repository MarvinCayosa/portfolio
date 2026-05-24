import { NextResponse } from "next/server";
import { uploadStudioImage } from "@/lib/studio-storage";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const adminPassword = String(form.get("adminPassword") ?? "");
    if (!ADMIN_PASSWORD || adminPassword !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const file = form.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "Missing file" }, { status: 400 });

    const MAX_SIZE = 4 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File size exceeds 4MB limit" }, { status: 400 });
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const filename = `${Date.now()}-${safeName}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { url } = await uploadStudioImage(buffer, filename, file.type || "image/jpeg");

    return NextResponse.json({ ok: true, url });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[studio/upload]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
