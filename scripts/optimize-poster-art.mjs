import { readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

// Delivery-only resizing/encoding. Never reads or changes the homepage hero.
const root = path.resolve("public/images/poster-cards");
let count = 0;
for (const category of ["features", "programs", "athletes"]) {
  const directory = path.join(root, category);
  for (const file of await readdir(directory)) {
    if (!file.endsWith(".png")) continue;
    const source = path.join(directory, file);
    const destination = path.join(directory, file.replace(/\.png$/, ".webp"));
    const result = await sharp(source)
      .resize(512, 512, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 90, effort: 6 })
      .toFile(destination);
    console.log(`${category}/${path.basename(destination)}: ${result.width}×${result.height}, ${Math.round(result.size / 1024)} KB`);
    count += 1;
  }
}
console.log(`Optimized ${count} poster illustrations; original generated images retained.`);
