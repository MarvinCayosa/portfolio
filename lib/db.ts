/**
 * Firebase Admin singleton — safe for Next.js hot reload in development.
 */

import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { resolveStorageBucketName } from "@/lib/firebase-bucket";

type FirebaseServices = {
  app: App;
  firestore: ReturnType<typeof getFirestore>;
  bucket: ReturnType<typeof getStorage>["bucket"] extends (...args: never[]) => infer T
    ? T
    : never;
};

const globalForFirebase = globalThis as unknown as {
  firebaseServices: FirebaseServices | undefined;
};

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value || !value.trim()) {
    throw new Error(`Missing required Firebase environment variable: ${name}`);
  }
  return value;
}

export function getFirebaseServices(): FirebaseServices {
  if (globalForFirebase.firebaseServices) {
    return globalForFirebase.firebaseServices;
  }

  const projectId = getRequiredEnv("FIREBASE_PROJECT_ID");
  const clientEmail = getRequiredEnv("FIREBASE_CLIENT_EMAIL");
  const privateKey = getRequiredEnv("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n");
  const storageBucket = resolveStorageBucketName(projectId);

  const app =
    getApps()[0] ??
    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      storageBucket,
    });

  const firebaseServices: FirebaseServices = {
    app,
    firestore: getFirestore(app),
    bucket: getStorage(app).bucket(storageBucket),
  };

  if (process.env.NODE_ENV !== "production") {
    globalForFirebase.firebaseServices = firebaseServices;
  }

  return firebaseServices;
}
