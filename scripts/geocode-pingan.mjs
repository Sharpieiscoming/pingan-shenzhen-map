// 平安深分各支行/团队地理编码（高德 POI 搜索）
// 运行：node scripts/geocode-pingan.mjs
// 输入：scripts/_units.json（python 从总表提取）
// 输出：src/data/geocoded.json  { units: [...含lng/lat/district/source] }
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const KEY = "d731164b1c4b4af65a97cd644f1dd359";
const CITY = "深圳";
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const units = JSON.parse(readFileSync(resolve(ROOT, "scripts/_units.json"), "utf-8"));

async function search(keywords) {
  const url =
    `https://restapi.amap.com/v3/place/text?key=${KEY}&keywords=${encodeURIComponent(keywords)}` +
    `&city=${encodeURIComponent(CITY)}&citylimit=true&output=json&page_size=10`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.status !== "1" || !Array.isArray(data.pois)) return [];
  return data.pois.filter(
    (p) => p.location && p.name && p.name.includes("平安银行") && !/ATM|自助|存取款/i.test(p.name)
  );
}

/** 支行战区：按“平安银行 XX支行”搜 POI，取名称最匹配的第一个 */
async function geocodeBranch(u) {
  const kw = `平安银行 ${u.team}支行`;
  let pois = await search(kw);
  if (!pois.length) pois = await search(`平安银行 ${u.team}`);
  if (!pois.length) return { ...u, lng: null, lat: null, district: "", poiName: "", source: "未找到" };
  // 优先名称含团队名的
  const exact = pois.find((p) => p.name.includes(u.team));
  const p = exact ?? pois[0];
  const [lng, lat] = p.location.split(",").map(Number);
  return { ...u, lng, lat, district: p.adname || "", poiName: p.name, address: p.address || "", source: "POI" };
}

/** 私行中心：先找私行中心锚点，各团队按中心环绕布点（近似） */
let privAnchor = null;
async function findPrivAnchor() {
  let pois = await search("平安银行私人银行中心");
  if (!pois.length) pois = await search("平安银行 私人银行");
  if (!pois.length) pois = await search("平安银行深圳分行");
  if (!pois.length) return null;
  const [lng, lat] = pois[0].location.split(",").map(Number);
  return { lng, lat, district: pois[0].adname || "福田区", poiName: pois[0].name };
}

function placePrivate(u, anchor, idxInCenter) {
  // 每个中心下团队围绕锚点小半径分布（约 250m 环），避免完全重叠
  const angle = (idxInCenter / 8) * Math.PI * 2;
  const r = 0.0022 + (idxInCenter % 3) * 0.0008;
  return {
    ...u,
    lng: +(anchor.lng + Math.cos(angle) * r).toFixed(6),
    lat: +(anchor.lat + Math.sin(angle) * r).toFixed(6),
    district: anchor.district,
    poiName: anchor.poiName,
    source: "私行锚点近似",
  };
}

const out = [];
const fail = [];
const priv = units.filter((u) => u.inst === "私行中心");
const rest = units.filter((u) => u.inst !== "私行中心");

for (let i = 0; i < rest.length; i++) {
  const u = rest[i];
  try {
    const g = await geocodeBranch(u);
    out.push(g);
    if (g.lng == null) fail.push(u.team);
    else console.log(`✔ ${u.inst} ${u.team} → ${g.poiName}（${g.district}）`);
  } catch (e) {
    out.push({ ...u, lng: null, lat: null, district: "", source: "错误:" + e.message });
    fail.push(u.team);
  }
  await new Promise((s) => setTimeout(s, 250));
}

privAnchor = await findPrivAnchor();
console.log("\n私行锚点:", privAnchor);
const centerIdx = {};
for (const u of priv) {
  const m = u.team.match(/^(.)中心/);
  const c = m ? m[1] : "六";
  centerIdx[c] = (centerIdx[c] ?? -1) + 1;
  out.push(placePrivate(u, privAnchor ?? { lng: 114.057, lat: 22.543, district: "福田区", poiName: "" }, centerIdx[c]));
}

writeFileSync(resolve(ROOT, "src/data/geocoded.json"), JSON.stringify({ anchor: privAnchor, units: out }, null, 1), "utf-8");
console.log(`\n完成：${out.length} 个单位，地理编码失败 ${fail.length} 个${fail.length ? "：" + fail.join("、") : ""}`);
