# -*- coding: utf-8 -*-
# 把 v4 总表 sheet2 新增的「任务占比」列同步进 src/data/geocoded.json 的 units
# v4 与现有数据除该列外无任何差异（已逐行核对 team+head 级目标/销量）
import openpyxl, json, os

os.chdir(os.path.join(os.path.dirname(__file__), '..'))
wb = openpyxl.load_workbook(os.path.join('..', '平安深分架构_盈安销量整合总表_v4.xlsx'), read_only=True, data_only=True)
ws = wb['2-支行团队销量整合']

share = {}
for row in ws.iter_rows(min_row=3, values_only=True):
    if not row[1]:
        continue
    key = (str(row[1]).strip(), str(row[6]).strip() if row[6] else '')
    if row[8] is not None:
        share[key] = round(float(row[8]) * 100, 4)

geo = json.load(open('src/data/geocoded.json', encoding='utf-8'))
n = 0
for u in geo['units']:
    key = (u['team'], (u['head'] or ''))
    if key in share:
        u['share'] = share[key]
        n += 1
json.dump(geo, open('src/data/geocoded.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(f'同步 {n}/119 家任务占比（支行÷4亿、私行÷1.6亿，4位小数）')
