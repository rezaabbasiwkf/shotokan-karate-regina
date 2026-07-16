import fs from "node:fs";
import path from "node:path";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

const projectRoot = process.cwd();
const documentDirectory = path.join(projectRoot, "public", "documents", "refereeing");
const outputFile = path.join(projectRoot, "src", "data", "refereeing-search-index.json");
const index = {};

for (const fileName of fs.readdirSync(documentDirectory).filter((name) => name.endsWith(".pdf"))) {
  const data = new Uint8Array(fs.readFileSync(path.join(documentDirectory, fileName)));
  const pdf = await getDocument({ data, disableWorker: true }).promise;
  const pages = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    pages.push({ page: pageNumber, text: pageText });
  }

  index[fileName] = pages;
  console.log(`Indexed ${fileName}: ${pdf.numPages} pages`);
}

fs.writeFileSync(outputFile, `${JSON.stringify(index)}\n`, "utf8");
