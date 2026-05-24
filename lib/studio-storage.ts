/**
 * Studio image uploads — Vercel Blob (production) or Firebase Storage (when configured).
 */

import { randomUUID } from "crypto";
import { getFirebaseServices } from "@/lib/db";
import { resolveStorageBucketName, storagePublicUrl } from "@/lib/firebase-bucket";

function formatUploadError(err: unknown): string {
  const message = err instanceof Error ? err.message : String(err);
  if (message.includes("bucket does not exist")) {
    return "Storage bucket not found. Enable Firebase Storage in the Firebase console, or add a Vercel Blob store (BLOB_READ_WRITE_TOKEN).";
  }
  if (message.includes("billing account") || message.includes("accountDisabled")) {
    return "Google Cloud billing is not enabled for this Firebase project. Add a Vercel Blob store in the Vercel dashboard, or enable billing and Firebase Storage.";
  }
  return message;
}

async function uploadToVercelBlob(
  buffer: Buffer,
  filename: string,
  contentType: string,
): Promise<{ url: string; bucket: string; path: string }> {
  const { put } = await import("@vercel/blob");
  const path = `studio/uploads/${filename}`;
  const blob = await put(path, buffer, {
    access: "public",
    contentType: contentType || "application/octet-stream",
    addRandomSuffix: false,
  });
  return { url: blob.url, bucket: "vercel-blob", path };
}

async function uploadToFirebase(
  buffer: Buffer,
  filename: string,
  contentType: string,
): Promise<{ url: string; bucket: string; path: string }> {
  const { bucket } = getFirebaseServices();
  const bucketName = bucket.name;
  const destination = `uploads/${filename}`;
  const fileRef = bucket.file(destination);
  const downloadToken = randomUUID();

  await fileRef.save(buffer, {
    metadata: {
      contentType: contentType || "application/octet-stream",
      metadata: {
        firebaseStorageDownloadTokens: downloadToken,
      },
    },
    resumable: false,
    validation: false,
  });

  try {
    await fileRef.makePublic();
  } catch {
    // Uniform bucket access — use token URL below
  }

  const url = `${storagePublicUrl(bucketName, destination)}&token=${downloadToken}`;
  return { url, bucket: bucketName, path: destination };
}

/** Upload a studio image; prefers Vercel Blob when BLOB_READ_WRITE_TOKEN is set. */
export async function uploadStudioImage(
  buffer: Buffer,
  filename: string,
  contentType: string,
): Promise<{ url: string; bucket: string; path: string }> {
  try {
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      return await uploadToVercelBlob(buffer, filename, contentType);
    }
    return await uploadToFirebase(buffer, filename, contentType);
  } catch (err) {
    throw new Error(formatUploadError(err));
  }
}

/** Verify Firebase bucket exists before attempting Firebase-only upload. */
export async function probeFirebaseStorage(projectId: string): Promise<boolean> {
  try {
    const bucketName = resolveStorageBucketName(projectId);
    const { bucket } = getFirebaseServices();
    const [exists] = await bucket.exists();
    return exists && bucket.name === bucketName;
  } catch {
    return false;
  }
}
