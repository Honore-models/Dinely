import { v2 as cloudinary } from "cloudinary";

// Bypass TLS certificate verification (needed for some proxy/firewall setups)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

cloudinary.config({
  cloud_name: "cwh3nqgb",
  api_key: "999889533746727",
  api_secret: "hPQdEqZPdYoFWAPxqtukxkoW1lA",
});

const filePath = process.argv[2];
if (!filePath) {
  console.error("Usage: npx tsx scripts/upload-video.ts <path-to-video>");
  process.exit(1);
}

async function main() {
  console.log(`Uploading ${filePath} to Cloudinary...`);
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "video",
      folder: "dinely/videos",
      public_id: "dinely-intro",
      overwrite: true,
    });
    console.log(`\n✅ Upload successful!`);
    console.log(`URL: ${result.secure_url}`);
    console.log(`Public ID: ${result.public_id}`);
    console.log(`Duration: ${result.duration}s`);
  } catch (err) {
    console.error("Upload failed:", err);
    process.exit(1);
  }
}

main();
