// 開発用スクリプト: data_status が "draft" の品目を一覧表示する。
// 100品目規模への拡張に備え、確認待ち品目を素早く洗い出すために使う。
// 本番UIには一切表示しない（このスクリプトはビルドに含まれない）。
//
// 使い方: npm run list:drafts

import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "..", "src", "data");
const itemsDir = path.join(dataDir, "items");

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, "utf-8"));
}

const municipalities = readJson(path.join(dataDir, "municipalities.json"));
const municipalityNameById = new Map(municipalities.map((m) => [m.id, m.name]));

const itemFiles = readdirSync(itemsDir).filter((file) => file.endsWith(".json"));

const drafts = [];
for (const file of itemFiles) {
  const items = readJson(path.join(itemsDir, file));
  for (const item of items) {
    if (item.data_status === "draft") {
      drafts.push(item);
    }
  }
}

if (drafts.length === 0) {
  console.log("draft品目はありません。");
  process.exit(0);
}

console.log(`draft品目: ${drafts.length}件\n`);

const rows = drafts.map((item) => ({
  自治体: municipalityNameById.get(item.municipality_id) ?? item.municipality_id,
  品目ID: item.id,
  品目名: item.name,
  "不足・未確認理由": item.draft_reason ?? "(理由未記録)",
}));

console.table(rows);
