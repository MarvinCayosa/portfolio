import { NextResponse } from "next/server";
import { getFirebaseServices } from "@/lib/db";

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

    // Enforce 5MB file size limit
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File size exceeds 5MB limit" }, { status: 400 });
    }

    const { bucket } = getFirebaseServices();
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
    const destination = `uploads/${filename}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileRef = bucket.file(destination);
    await fileRef.save(buffer, { metadata: { contentType: file.type } });

    // Make public so URL is accessible — optional but convenient for portfolio images
    try {
      await fileRef.makePublic();
    } catch {
      // ignore permission errors
    }

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${encodeURIComponent(fileRef.name)}`;
    return NextResponse.json({ ok: true, url: publicUrl });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
