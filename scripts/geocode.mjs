// 网点地址批量转坐标（高德地理编码）
// 用法：
//   1. 在项目根目录准备 outlets.csv（UTF-8 编码，带表头）：
//        branch,name,address
//        东门支行,XX社区支行,深圳市罗湖区XX路XX号
//   2. 运行：node scripts/geocode.mjs outlets.csv
//   3. 生成 src/data/outlets.geocoded.json，拿给我或直接替换系统里的占位网点数据
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const KEY = "d731164b1c4b4af65a97cd644f1dd359";
const CITY = "深圳";
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const csvPath = process.argv[2];
if (!csvPath) {
  console.error("用法: node scripts/geocode.mjs <outlets.csv>");
  process.exit(1);
}

// 简单 CSV 解析（支持引号包裹的字段）
function parseCsv(text) {
  const rows = [];
  let row = [],
    field = "",
    inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') inQ = false;
      else field += c;
    } else if (c === '"') inQ = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      if (row.some((f) => f.trim() !== "")) rows.push(row);
      row = [];
    } else field += c;
  }
  if (field || row.length) {
    row.push(field);
    if (row.some((f) => f.trim() !== "")) rows.push(row);
  }
  return rows;
}

async function geocode(address) {
  const url = `https://restapi.amap.com/v3/geocode/geo?key=${KEY}&address=${encodeURIComponent(
    address
  )}&city=${encodeURIComponent(CITY)}&output=json`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.status === "1" && data.geocodes?.length) {
    const g = data.geocodes[0];
    const [lng, lat] = g.location.split(",").map(Number);
    return { lng, lat, formatted: g.formatted_address };
  }
  return null;
}

const rows = parseCsv(readFileSync(csvPath, "utf-8"));
const header = rows[0].map((h) => h.trim());
const iBranch = header.indexOf("branch");
const iName = header.indexOf("name");
const iAddr = header.indexOf("address");
if (iAddr === -1) {
  console.error("CSV 需要包含 address 列（可选 branch、name 列）");
  process.exit(1);
}

const results = [];
let ok = 0,
  fail = 0;
for (let i = 1; i < rows.length; i++) {
  const r = rows[i];
  const branch = iBranch >= 0 ? r[iBranch].trim() : "";
  const name = iName >= 0 ? r[iName].trim() : "";
  const address = r[iAddr].trim();
  if (!address) continue;
  try {
    const g = await geocode(address);
    if (g) {
      ok++;
      results.push({ branch, name, address, lng: g.lng, lat: g.lat, formatted: g.formatted });
    } else {
      fail++;
      results.push({ branch, name, address, lng: null, lat: null, error: "未找到坐标" });
      console.warn(`⚠ 未匹配: ${name || branch} ${address}`);
    }
  } catch (e) {
    fail++;
    results.push({ branch, name, address, lng: null, lat: null, error: String(e) });
  }
  await new Promise((s) => setTimeout(s, 250)); // 控制请求频率
}

const out = resolve(ROOT, "src/data/outlets.geocoded.json");
writeFileSync(out, JSON.stringify(results, null, 2), "utf-8");
console.log(`\n完成：成功 ${ok} 条，失败 ${fail} 条`);
console.log(`结果已写入：${out}`);
