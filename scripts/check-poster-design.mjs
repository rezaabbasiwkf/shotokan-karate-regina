import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import sharp from "sharp";

const heroPath = "public/images/hero-group-straight.jpg";
const heroHash = "a86ae54baff56a4a44aaf55ec6ce4fa5f038a450bd3a54550b76b4b2ae6440f3";
assert.equal(createHash("sha256").update(await readFile(heroPath)).digest("hex"), heroHash, "Hero photograph must remain byte-for-byte unchanged");

const original = execFileSync("git", ["show", "c0dd6e9:src/app/page.tsx"], { encoding: "utf8" });
const current = await readFile("src/app/page.tsx", "utf8");
const firstSection = (source) => source.match(/<section\b[\s\S]*?<\/section>/)?.[0].replace(/\r\n/g, "\n");
assert.equal(firstSection(current), firstSection(original), "Hero JSX, crop, overlays and buttons must remain unchanged");
assert.ok(current.indexOf('className="poster-theme"') > current.indexOf("</section>"), "Theme must begin after the complete hero");

const assets = {
  features: ["professional-shotokan", "olympic-style-karate", "kata", "kumite"],
  programs: ["kids-shotokan", "teen-shotokan", "adult-shotokan", "competition-training"],
  athletes: ["advanced-kata", "advanced-kumite", "competition-strategy", "athletic-conditioning", "performance-analysis", "competition-rules", "mental-preparation", "individual-coaching"],
};
for (const [category, names] of Object.entries(assets)) {
  for (const name of names) {
    const file = `public/images/poster-cards/${category}/${name}.webp`;
    const metadata = await sharp(file).metadata();
    assert.equal(metadata.format, "webp", file);
    assert.equal(metadata.width, 512, file);
    assert.equal(metadata.height, 512, file);
    assert.ok((await stat(file)).size < 150_000, `${file} exceeds thumbnail budget`);
  }
}

const base = process.argv[2];
if (base) {
  const url = new URL(base);
  assert.ok(["localhost", "127.0.0.1", "[::1]"].includes(url.hostname), "Only local read-only preview checks are permitted");
  for (const [category, names] of Object.entries(assets)) {
    for (const name of names) {
      const response = await fetch(new URL(`/images/poster-cards/${category}/${name}.webp`, url));
      assert.equal(response.status, 200, `${category}/${name} must load`);
      assert.match(response.headers.get("content-type") ?? "", /image\/webp/, `${category}/${name} MIME type`);
    }
  }
  for (const [path, framePolicy] of [
    ["/documents/belt-grading/shotokan-karate-yxe-exam-guide-may-2026.pdf", "SAMEORIGIN"],
    ["/register", "DENY"],
  ]) {
    const response = await fetch(new URL(path, url), { method: "HEAD" });
    assert.equal(response.status, 200, `${path} must load for header verification`);
    assert.equal(response.headers.get("x-frame-options"), framePolicy, `${path} frame policy`);
    const csp = response.headers.get("content-security-policy");
    if (csp) {
      assert.match(
        csp,
        framePolicy === "SAMEORIGIN" ? /(?:^|;)\s*frame-ancestors 'self'(?:;|$)/ : /(?:^|;)\s*frame-ancestors 'none'(?:;|$)/,
        `${path} production frame-ancestors policy`,
      );
    }
  }
}
console.log("PASS: unchanged hero file and full hero markup; 16 optimized illustrations; theme isolated below hero.");
