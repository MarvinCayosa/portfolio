import "dotenv/config";
import { uploadStudioImage } from "../lib/studio-storage";

async function main() {
  const buffer = Buffer.from("upload test");
  try {
    const result = await uploadStudioImage(buffer, `test-${Date.now()}.txt`, "text/plain");
    console.log("ok", result);
  } catch (err) {
    console.error("FAILED:", err);
    process.exit(1);
  }
}

main();
