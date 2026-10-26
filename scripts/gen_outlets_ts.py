# 从 outlets.poi.json 生成 src/data/outlets.ts
# 每个支行/团队（含无网点的）都在 OUTLETS 里有 key；私行团队（sx-）给空数组（坐标为近似锚点，不吸附网点）
import json, re

ROOT = r"C:\Users\jiaju\Documents\kimi\tasks\2026-10-22\10-16-20-11f7ba7b\pingan-outlet-system"

poi = json.load(open(ROOT + r"\src\data\outlets.poi.json", encoding="utf-8"))
src = open(ROOT + r"\src\data\branches.ts", encoding="utf-8").read()

branch_ids = re.findall(r'\{\s*id:\s*"([^"]+)"', src)
assert len(branch_ids) == 119, len(branch_ids)

lines = []
lines.append("// 平安银行深圳市网点数据，由高德 POI 抓取（scripts/fetch-outlets.mjs，关键词「平安银行」，已排除 ATM/自助）")
lines.append("// 按距离最近原则归入各支行/团队；拿到平安内部网点归属清单后，按真实归属校准本文件即可")
lines.append("// 私行中心各团队（sx-）无独立网点，统一给空数组")
lines.append('import type { Outlet } from "./branches";')
lines.append("")
lines.append("export const OUTLETS: Record<string, Outlet[]> = {")
for bid in branch_ids:
    items = poi.get(bid, [])
    lines.append(f'  "{bid}": [')
    for i, p in enumerate(items, 1):
        addr = (p.get("address") or "").replace('"', "'")
        name = p["name"].replace('"', "'")
        lines.append(f'    {{ "id": "{bid}-{i:02d}", "name": "{name}", "lng": {p["lng"]}, "lat": {p["lat"]}, "address": "{addr}" }},')
    lines.append("  ],")
lines.append("};")
lines.append("")

out = ROOT + r"\src\data\outlets.ts"
open(out, "w", encoding="utf-8").write("\n".join(lines))
total = sum(len(v) for v in poi.values())
print(f"写入 {out}: {len(branch_ids)} 个单位（私行 36 个空数组），共 {total} 个网点")
