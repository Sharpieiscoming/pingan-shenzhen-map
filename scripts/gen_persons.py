# -*- coding: utf-8 -*-
# 从总表 sheet3（人员销量50W以上）生成 src/data/persons.ts
# 归属支行规则与 gen_data.py 一致：按 _units.json 的 team 匹配 branch id
import json
import openpyxl
import os
from pypinyin import lazy_pinyin, Style

os.chdir(os.path.join(os.path.dirname(__file__), '..'))

units = json.load(open('scripts/_units.json', encoding='utf-8'))
inst_prefix = {'中心支行': 'zx', '产业科技支行': 'cy', '获客型零售支行': 'hk', '经营型零售支行': 'jy', '私行中心': 'sx'}

def slug(s):
    return ''.join(lazy_pinyin(s, style=Style.NORMAL))

# 与 gen_data.py 相同的 id 规则（含六中心重名去重）
team2id = {}
used = set()
for u in units:
    uid = f"{inst_prefix[u['inst']]}-{slug(u['team'])}"
    if '误作' in (u.get('note') or '') or uid in used:
        mgr = u['org_head'] if u['org_head'] not in ('', '一', '-') else u['head']
        uid = f"{uid}-{slug(mgr)}" if mgr else f"{uid}-2"
    used.add(uid)
    team2id[u['team']] = uid
actual_by_id = {team2id[u['team']]: u.get('actual') for u in units if u['team'] in team2id}

wb = openpyxl.load_workbook(os.path.join('..', '平安深分架构_盈安销量整合总表.xlsx'), read_only=True)
ws = wb['3-人员销量50W以上']

persons = {}
unmatched = []
for i, row in enumerate(ws.iter_rows(values_only=True)):
    if i == 0:
        continue
    inst, team, name, role, sales = row
    if not name:
        continue
    bid = team2id.get(str(team).strip())
    if not bid:
        unmatched.append((inst, team, name, sales))
        continue
    persons.setdefault(bid, []).append({'name': str(name).strip(), 'role': str(role or '').strip(), 'sales': sales})

lines = [
    '// 人员销量数据（50W以上），由 平安深分架构_盈安销量整合总表.xlsx sheet3 自动生成',
    '// share = 个人实际销量 ÷ 所在支行/团队实际销量；null = 该支行无实际销量数据',
    '',
    'export interface PersonSale {',
    '  name: string;',
    '  /** 岗位（RM/PR 等） */',
    '  role: string;',
    '  /** 实际销量（万） */',
    '  sales: number;',
    '  /** 占本支行实际销量比例（%） */',
    '  share: number | null;',
    '}',
    '',
]
lines.append('export const PERSONS: Record<string, PersonSale[]> = {')
for bid in sorted(persons.keys()):
    rows = sorted(persons[bid], key=lambda p: -(p['sales'] or 0))
    total = actual_by_id.get(bid)
    lines.append(f'  "{bid}": [')
    for p in rows:
        share = round(p['sales'] / total * 100, 1) if total else 'null'
        lines.append(f'    {{ "name": "{p["name"]}", "role": "{p["role"]}", "sales": {p["sales"]}, "share": {share} }},')
    lines.append('  ],')
lines.append('};')
lines.append('')
open('src/data/persons.ts', 'w', encoding='utf-8').write('\n'.join(lines))

total_p = sum(len(v) for v in persons.values())
print(f'写入 src/data/persons.ts: {len(persons)} 个支行/团队，共 {total_p} 人')
if unmatched:
    print(f'未匹配 {len(unmatched)} 行:')
    for r in unmatched:
        print('  ', r)
