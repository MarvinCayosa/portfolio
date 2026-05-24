/** Resolve the GCS bucket used by Firebase Admin Storage. */

function normalizeBucketName(name: string) {
  return name.replace(/^gs:\/\//, "").trim();
}

/**
 * Firebase Console may show `project.firebasestorage.app`, but the GCS bucket
 * name is usually `project.appspot.com`.
 */
export function resolveStorageBucketName(projectId: string): string {
  const configured = process.env.FIREBASE_STORAGE_BUCKET?.trim();
  if (configured) {
    const normalized = normalizeBucketName(configured);
    if (normalized.endsWith(".firebasestorage.app")) {
      return `${projectId}.appspot.com`;
    }
    return normalized;
  }
  return `${projectId}.appspot.com`;
}

export function storagePublicUrl(bucketName: string, objectPath: string) {
  const encoded = encodeURIComponent(objectPath);
  return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encoded}?alt=media`;
}
