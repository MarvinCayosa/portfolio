/**
 * /api/studio/collection/[name] — CRUD endpoint for any Firestore collection.
 *
 * GET  /api/studio/collection/projects          → list all docs
 * GET  /api/studio/collection/siteConfig?doc=visibility → single doc
 * POST /api/studio/collection/projects          → create or update (requires adminPassword)
 * DELETE /api/studio/collection/projects        → delete by id (requires adminPassword)
 *
 * All Firestore Timestamps are serialised to ISO strings so Next.js can
 * safely pass them through JSON without "non-serialisable value" errors.
 */

import { NextResponse } from "next/server";
import { getFirebaseServices } from "@/lib/db";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

type RouteContext = { params: Promise<{ name: string }> };

// ─── Timestamp serialiser ─────────────────────────────────────────────────────
// Firestore Timestamps are objects with a toDate() method. We convert them to
// ISO strings so they survive JSON serialisation.
function serialiseDoc(data: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(data)) {
    if (v && typeof v === "object" && typeof (v as { toDate?: unknown }).toDate === "function") {
      // Firestore Timestamp → ISO string
      out[k] = (v as { toDate: () => Date }).toDate().toISOString();
    } else if (Array.isArray(v)) {
      out[k] = v.map((item) =>
        item && typeof item === "object" && typeof (item as { toDate?: unknown }).toDate === "function"
          ? (item as { toDate: () => Date }).toDate().toISOString()
          : item,
      );
    } else {
      out[k] = v;
    }
  }
  return out;
}

// ─── GET — list collection or fetch single doc ────────────────────────────────
export async function GET(request: Request, context: RouteContext) {
  try {
    const { name } = await context.params;
    const { searchParams } = new URL(request.url);
    const docId = searchParams.get("doc");
    const { firestore } = getFirebaseServices();

    if (docId) {
      // Single document fetch (used for siteConfig/visibility)
      const snap = await firestore.collection(name).doc(docId).get();
      if (!snap.exists) return NextResponse.json(null);
      return NextResponse.json({ id: snap.id, ...serialiseDoc(snap.data() as Record<string, unknown>) });
    }

    // List all documents — no orderBy so it works on any collection
    const snap = await firestore.collection(name).get();
    const items = snap.docs.map((d) => ({
      id: d.id,
      ...serialiseDoc(d.data() as Record<string, unknown>),
    }));
    return NextResponse.json(items);
  } catch (err) {
    console.error(`[studio GET /${(await context.params).name}]`, err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// ─── POST — create or update a document ──────────────────────────────────────
export async function POST(request: Request, context: RouteContext) {
  try {
    const { name } = await context.params;
    const body = await request.json() as {
      adminPassword: string;
      doc: Record<string, unknown>;
      id?: string;
    };

    if (!ADMIN_PASSWORD || body.adminPassword !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { firestore } = getFirebaseServices();

    if (body.id) {
      // Update existing document (merge so unset fields are preserved)
      await firestore.collection(name).doc(String(body.id)).set(body.doc, { merge: true });
      return NextResponse.json({ ok: true, id: String(body.id) });
    } else {
      // Create new document with auto-generated ID
      const ref = await firestore.collection(name).add(body.doc);
      return NextResponse.json({ ok: true, id: ref.id });
    }
  } catch (err) {
    console.error(`[studio POST /${(await context.params).name}]`, err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// ─── DELETE — remove a document by id ────────────────────────────────────────
export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { name } = await context.params;
    const body = await request.json() as { adminPassword: string; id: string };

    if (!ADMIN_PASSWORD || body.adminPassword !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!body.id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const { firestore } = getFirebaseServices();
    await firestore.collection(name).doc(String(body.id)).delete();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(`[studio DELETE /${(await context.params).name}]`, err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
