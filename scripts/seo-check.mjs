/**
 * Read-only SEO regression checks against a running local Next.js server.
 * Usage: npm run test:seo -- http://localhost:3101
 * Or: SEO_BASE_URL=http://127.0.0.1:3000 npm run test:seo
 * No forms are submitted, accounts created, or external URLs fetched.
 */
const SITE_ORIGIN = "https://www.karateyqr.com";
const PRIVATE_PATH = /^\/(?:account|admin|api|payment|registration-complete|forgot-password|reset-password)(?:\/|$)/;
const PRIVATE_ROUTES = [
  "/account",
  "/account/dashboard",
  "/admin",
  "/payment",
  "/registration-complete",
  "/forgot-password",
  "/reset-password",
];
const USER_AGENT = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";
const failures = [];
let checks = 0;

function check(condition, message) {
  checks += 1;
  if (!condition) failures.push(message);
}

function decode(value) {
  const entities = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
  return value.replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (match, entity) => {
    if (!entity.startsWith("#")) return entities[entity.toLowerCase()] ?? match;
    const number = entity.toLowerCase().startsWith("#x")
      ? parseInt(entity.slice(2), 16)
      : parseInt(entity.slice(1), 10);
    return number > 0 && number <= 0x10ffff ? String.fromCodePoint(number) : match;
  });
}

function attributes(tag) {
  const result = {};
  const pattern = /([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g;
  for (const match of tag.matchAll(pattern)) {
    result[match[1].toLowerCase()] = decode(match[2] ?? match[3] ?? match[4]);
  }
  return result;
}

function visibleText(value) {
  return decode(value.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
}

function canonicalKey(value) {
  const url = new URL(value);
  return `${url.origin}${url.pathname === "/" ? "" : url.pathname}`;
}

function productionUrl(value) {
  try {
    const url = new URL(value);
    return url.origin === SITE_ORIGIN && !url.username && !url.password && !url.search && !url.hash;
  } catch {
    return false;
  }
}

async function request(path, followRedirects = true) {
  let url = new URL(path, base);
  for (let count = 0; count < 6; count += 1) {
    if (url.origin !== base.origin) throw new Error(`Refusing non-local redirect: ${url.origin}`);
    const response = await fetch(url, {
      method: "GET",
      redirect: "manual",
      headers: { "user-agent": USER_AGENT, accept: "text/html,application/xml;q=0.9,*/*;q=0.8" },
      signal: AbortSignal.timeout(30000),
    });
    if (followRedirects && [301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get("location");
      if (!location) throw new Error(`${path}: redirect has no Location header`);
      await response.body?.cancel();
      url = new URL(location, url);
      continue;
    }
    return response;
  }
  throw new Error(`${path}: too many redirects`);
}

function inspectSchema(value, path, types) {
  if (Array.isArray(value)) {
    for (const item of value) inspectSchema(item, path, types);
  } else if (value && typeof value === "object") {
    const declaredTypes = Array.isArray(value["@type"]) ? value["@type"] : [value["@type"]];
    for (const type of declaredTypes) {
      if (typeof type === "string") types.add(type);
      check(type !== "MartialArtsSchool", `${path}: unsupported MartialArtsSchool schema type`);
    }
    for (const child of Object.values(value)) inspectSchema(child, path, types);
  } else if (typeof value === "string") {
    check(!/https?:\/\/[^\s"/]*\.vercel\.app(?:[\s/"?#]|$)/i.test(value), `${path}: JSON-LD contains an old Vercel host`);
  }
}

async function inspectPage(sitemapUrl) {
  const path = new URL(sitemapUrl).pathname;
  try {
    const response = await request(path);
    check(response.status === 200, `${path}: HTTP ${response.status}, expected 200`);
    if (response.status !== 200) { await response.body?.cancel(); return; }
    check(!/\bnoindex\b/i.test(response.headers.get("x-robots-tag") ?? ""), `${path}: sitemap page has a noindex header`);
    const html = await response.text();
    // Googlebot prevents Next's streamed-metadata mode. Still search the full
    // document, not only <head>, so late metadata is covered in other versions.
    const markup = html.replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, "");
    const titles = [...markup.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title\s*>/gi)].map((match) => visibleText(match[1]));
    const metas = [...markup.matchAll(/<meta\b[^>]*>/gi)].map((match) => attributes(match[0]));
    const links = [...markup.matchAll(/<link\b[^>]*>/gi)].map((match) => attributes(match[0]));
    const metaValues = (key) => metas.filter((meta) => meta.name?.toLowerCase() === key || meta.property?.toLowerCase() === key).map((meta) => meta.content ?? "");
    const canonicals = links.filter((link) => link.rel?.toLowerCase().split(/\s+/).includes("canonical")).map((link) => link.href ?? "");
    const descriptions = metaValues("description");
    const ogUrls = metaValues("og:url");
    const twitterTitles = metaValues("twitter:title");
    const ogTitles = metaValues("og:title");

    check(titles.length === 1 && titles[0].length > 0, `${path}: expected one nonempty page title, found ${titles.length}`);
    check(descriptions.length === 1 && descriptions[0].trim().length > 0, `${path}: expected one nonempty meta description`);
    check([...markup.matchAll(/<h1\b[^>]*>/gi)].length === 1, `${path}: expected exactly one H1`);
    check(canonicals.length === 1 && productionUrl(canonicals[0]), `${path}: expected one absolute production canonical`);
    if (canonicals.length === 1 && productionUrl(canonicals[0])) {
      const key = canonicalKey(canonicals[0]);
      check(key === canonicalKey(sitemapUrl), `${path}: canonical is not self-referencing (${canonicals[0]})`);
      check(!seenCanonicals.has(key), `${path}: duplicate canonical (${canonicals[0]})`);
      seenCanonicals.add(key);
      check(ogUrls.length === 1 && productionUrl(ogUrls[0]) && canonicalKey(ogUrls[0]) === key, `${path}: og:url must match canonical`);
    }
    check(twitterTitles.length === 1 && twitterTitles[0] === titles[0], `${path}: twitter:title must match the page title`);
    check(ogTitles.length === 1 && ogTitles[0] === titles[0], `${path}: og:title must match the page title`);
    check(!metaValues("robots").some((value) => /\bnoindex\b/i.test(value)), `${path}: sitemap page has noindex metadata`);

    const schemas = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)]
      .filter((match) => attributes(match[1]).type?.toLowerCase() === "application/ld+json");
    check(schemas.length > 0, `${path}: no JSON-LD found`);
    const types = new Set();
    for (const schema of schemas) {
      try { inspectSchema(JSON.parse(schema[2]), path, types); }
      catch (error) { check(false, `${path}: invalid JSON-LD (${error.message})`); }
    }
    if (path === "/") check(types.has("SportsActivityLocation"), "/: SportsActivityLocation JSON-LD is missing");
    console.log(`Checked ${path}`);
  } catch (error) {
    check(false, `${path}: ${error.message}`);
  }
}

const args = process.argv.slice(2);
if (args.includes("--help") || args.includes("-h")) {
  console.log("Usage: npm run test:seo -- [http://localhost:3101]\nOptional env: SEO_BASE_URL. Only loopback hosts are allowed. Start the website first.");
  process.exit(0);
}
if (args.length > 1) throw new Error("Pass one local base URL, or use --help.");
const base = new URL(args[0] ?? process.env.SEO_BASE_URL ?? "http://localhost:3101");
if (!["http:", "https:"].includes(base.protocol) || !["localhost", "127.0.0.1", "[::1]"].includes(base.hostname)
  || base.username || base.password || base.pathname !== "/" || base.search || base.hash) {
  throw new Error("SEO checks only accept a loopback HTTP(S) origin, for example http://localhost:3101. External hosts are never fetched.");
}
const seenCanonicals = new Set();
console.log(`Read-only SEO checks: ${base.origin}`);

try {
  const response = await request("/sitemap.xml");
  if (response.status !== 200) throw new Error(`/sitemap.xml: HTTP ${response.status}, expected 200`);
  const xml = await response.text();
  const locations = [...xml.matchAll(/<loc(?:\s[^>]*)?>([\s\S]*?)<\/loc\s*>/gi)].map((match) => decode(match[1].trim()));
  check(/<urlset(?:\s|>)/i.test(xml), "Sitemap must be a URL set, not an HTML error or sitemap index");
  check(locations.length > 0, "Sitemap has no URLs");
  const validLocations = [];
  const seenLocations = new Set();
  for (const location of locations) {
    if (!productionUrl(location)) { check(false, `Sitemap URL is not an absolute production URL: ${location}`); continue; }
    const path = new URL(location).pathname;
    const key = canonicalKey(location);
    check(!seenLocations.has(key), `Duplicate sitemap URL: ${location}`);
    check(!PRIVATE_PATH.test(path), `Private/API route is included in sitemap: ${path}`);
    if (!seenLocations.has(key) && !PRIVATE_PATH.test(path)) validLocations.push(location);
    seenLocations.add(key);
  }
  check(seenLocations.has(SITE_ORIGIN), "Sitemap must include the homepage");
  // Three workers keep a development server responsive without flooding it.
  let cursor = 0;
  await Promise.all(Array.from({ length: Math.min(3, validLocations.length) }, async () => {
    while (cursor < validLocations.length) await inspectPage(validLocations[cursor++]);
  }));
  for (const path of PRIVATE_ROUTES) {
    try {
      const privateResponse = await request(path, false);
      check(privateResponse.status < 500, `${path}: HTTP ${privateResponse.status} during private-page check`);
      check(/\bnoindex\b/i.test(privateResponse.headers.get("x-robots-tag") ?? ""), `${path}: missing X-Robots-Tag: noindex (including redirects)`);
      await privateResponse.body?.cancel();
      console.log(`Checked noindex ${path}`);
    } catch (error) { check(false, `${path}: ${error.message}`); }
  }
  if (failures.length) {
    console.error(`\n${failures.length} SEO failure(s) across ${checks} checks:\n${failures.map((failure) => `- ${failure}`).join("\n")}`);
    process.exitCode = 1;
  } else console.log(`\nPASS: ${validLocations.length} public pages and ${PRIVATE_ROUTES.length} private routes (${checks} checks).`);
} catch (error) {
  console.error(`SEO checks could not finish: ${error.message}\nStart a local server, then run npm run test:seo -- ${base.origin}`);
  process.exitCode = 1;
}
