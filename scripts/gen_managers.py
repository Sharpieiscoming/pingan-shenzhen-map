# -*- coding: utf-8 -*-
# 从 v3 总表「任务占比」sheet 提取渠道经理归属 + 平安统一下发占比
# 输出 scripts/_managers.json: { team: { mgr, share(4亿基数小数) } }
# 注意：「桂圆」按「桂园」匹配（已与用户确认是笔误）
import openpyxl
import json
import os

os.chdir(os.path.join(os.path.dirname(__file__), '..'))
wb = openpyxl.load_workbook(os.path.join('..', '平安深分架构_盈安销量整合总表_v3.xlsx'), read_only=True)
ws = wb['任务占比']

out = {}
for i, row in enumerate(ws.iter_rows(values_only=True)):
    if i == 0 or not row[0]:
        continue
    team = str(row[0]).strip()
    if team == '桂圆':
        team = '桂园'
    mgr = str(row[2]).strip() if row[2] else None
    share = float(row[3]) if row[3] is not None else None
    out[team] = {'mgr': mgr, 'share': share}

json.dump(out, open('scripts/_managers.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
mgrs = {}
for v in out.values():
    mgrs[v['mgr']] = mgrs.get(v['mgr'], 0) + 1
print(f'提取 {len(out)} 家：{mgrs}')
