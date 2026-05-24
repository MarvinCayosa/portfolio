import { NextResponse } from "next/server";
import { getFirebaseServices } from "@/lib/db";
import { uploadStudioFile } from "@/lib/studio-storage";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const MAX_SIZE = 8 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const adminPassword = String(form.get("adminPassword") ?? "");
    if (!ADMIN_PASSWORD || adminPassword !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const file = form.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "Missing file" }, { status: 400 });

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File size exceeds 8MB limit" }, { status: 400 });
    }

    const mime = file.type || "application/pdf";
    if (mime !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 });
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-") || "resume.pdf";
    const filename = `resume-${Date.now()}-${safeName}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { url } = await uploadStudioFile(buffer, filename, "application/pdf");

    const { firestore } = getFirebaseServices();
    await firestore.collection("siteConfig").doc("resume").set({
      url,
      filename: safeName,
      updatedAt: Date.now(),
    });

    return NextResponse.json({ ok: true, url });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[studio/resume]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
