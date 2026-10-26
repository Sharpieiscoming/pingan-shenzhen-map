// 用高德 POI 搜索抓取深圳市内「平安银行」网点，按距离最近原则归到各支行/团队
// 支行列表直接从 src/data/branches.ts 解析（排除私行中心 sx- 前缀的团队——
// 私行团队坐标是锚点近似布点，不能用来吸附网点；私行单位在 outlets.ts 中给空数组）
// 运行：node scripts/fetch-outlets.mjs
import { writeFileSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const KEY = "d731164b1c4b4af65a97cd644f1dd359";
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// 从 branches.ts 解析支行战区单位（单行对象格式：{ id: "...", name: "...", ..., lng: x, lat: y }）
const branchesSrc = readFileSync(resolve(ROOT, "src/data/branches.ts"), "utf-8");
const BRANCHES = [];
for (const line of branchesSrc.split("\n")) {
  const m = line.match(/\{\s*id:\s*"([^"]+)",\s*name:\s*"([^"]+)",.*?lng:\s*([\d.]+),\s*lat:\s*([\d.]+)\s*\}/);
  if (!m) continue;
  if (m[1].startsWith("sx-")) continue; // 私行团队不参与网点归行
  BRANCHES.push({ id: m[1], name: m[2], lng: Number(m[3]), lat: Number(m[4]) });
}
console.log(`从 branches.ts 解析到 ${BRANCHES.length} 个支行战区单位`);

async function searchPage(page) {
  const url =
    `https://restapi.amap.com/v3/place/text?key=${KEY}&keywords=${encodeURIComponent("平安银行")}` +
    `&city=${encodeURIComponent("深圳")}&citylimit=true&output=json&page_size=25&page=${page}`;
  const res = await fetch(url);
  return res.json();
}

const KM_PER_DEG_LAT = 111;
const KM_PER_DEG_LNG = 102.6; // 深圳纬度 cos(22.5°)*111
function distKm(lng1, lat1, lng2, lat2) {
  const dx = (lng1 - lng2) * KM_PER_DEG_LNG;
  const dy = (lat1 - lat2) * KM_PER_DEG_LAT;
  return Math.sqrt(dx * dx + dy * dy);
}

const seen = new Set();
const pois = [];
// 高德文本搜索的坑：分页到第 4 页左右会静默丢数据（全市「平安银行」报 131 条，提前 break 只能拿到 82 条），
// 且个人 Key 有 QPS 限额（撞限 status=0，需退避重试）。
// 对策：全市搜索 + 按 count 固定翻完所有页（短页/空页不提前退出）+ 撞限退避 + 全局按 id 去重
const sleep = (ms) => new Promise((s) => setTimeout(s, ms));
const first = await searchPage(1);
const total = parseInt(first.count || "0", 10);
const maxPage = Math.min(Math.ceil(total / 25), 40);
console.log(`高德报告共 ${total} 条，将翻 ${maxPage} 页`);
const collect = (data) => {
  for (const p of data.pois || []) {
    if (!p.location || !p.location.includes(",")) continue;
    if (seen.has(p.id)) continue;
    seen.add(p.id);
    const [lng, lat] = p.location.split(",").map(Number);
    // 排除 ATM / 自助设备
    const name = p.name || "";
    if (/ATM|自助|存取款/i.test(name)) continue;
    pois.push({ id: p.id, name, address: p.address || "", lng, lat, type: p.type || "" });
  }
};
if (first.status === "1") collect(first);
for (let page = 2; page <= maxPage; page++) {
  let data = null;
  for (let attempt = 0; attempt < 5; attempt++) {
    data = await searchPage(page);
    if (data.status === "1") break;
    await sleep(1000 * (attempt + 1)); // 1s/2s/3s/4s 退避
  }
  if (data.status === "1") collect(data);
  await sleep(1000);
}

console.log(`共抓取 ${pois.length} 个网点 POI`);

// 按距离最近归到管辖行
const assigned = {};
for (const b of BRANCHES) assigned[b.id] = [];
for (const p of pois) {
  let best = null,
    bestD = Infinity;
  for (const b of BRANCHES) {
    const d = distKm(p.lng, p.lat, b.lng, b.lat);
    if (d < bestD) {
      bestD = d;
      best = b;
    }
  }
  assigned[best.id].push({ ...p, distKm: Math.round(bestD * 100) / 100 });
}

for (const b of BRANCHES) console.log(`${b.name}: ${assigned[b.id].length} 家`);

writeFileSync(resolve(ROOT, "src/data/outlets.poi.json"), JSON.stringify(assigned, null, 2), "utf-8");
console.log("已写入 src/data/outlets.poi.json");
