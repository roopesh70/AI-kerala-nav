import admin from "firebase-admin";
import { readFileSync, existsSync } from "fs";

let db;

try {
  if (existsSync("./serviceAccountKey.json")) {
    const serviceAccount = JSON.parse(
      readFileSync("./serviceAccountKey.json", "utf8")
    );
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("✅ Firebase initialized with service account");
  } else {
    // Try default credentials (Cloud Run / GCE)
    admin.initializeApp();
    console.log("✅ Firebase initialized with default credentials");
  }
  db = admin.firestore();
} catch (err) {
  console.warn("⚠️ Firebase initialization failed:", err.message);
  console.warn("Running without Firestore — using local fallback data only");
  db = null;
}

export { db };
