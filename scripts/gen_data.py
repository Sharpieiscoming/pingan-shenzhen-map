# -*- coding: utf-8 -*-
# 从 geocoded.json + 总表生成 src/data/branches.ts 与 src/data/sales.ts
import json, warnings
from pypinyin import lazy_pinyin, Style
import os

os.chdir(os.path.join(os.path.dirname(__file__), '..'))
warnings.filterwarnings('ignore')
ROOT = os.getcwd()

geo = json.load(open('src/data/geocoded.json', encoding='utf-8'))
units = geo['units']

# 渠道经理归属 + 平安统一下发占比（scripts/gen_managers.py 生成；私行无）
mgr_map = json.load(open('scripts/_managers.json', encoding='utf-8'))

TOTAL_TARGET = 56000  # 全行总目标 4亿(支行战区) + 1.6亿(私行战区)
WAR_TOTAL = {'战区': 40000, '私行': 16000}  # 任务占比口径：支行战区÷4亿、私行战区÷1.6亿（领导确认）

def slug(s):
    return ''.join(lazy_pinyin(s, style=Style.NORMAL))

def grade_of(target, actual):
    if not target or actual is None:
        return None
    r = actual / target
    return 'A' if r >= 0.5 else ('B' if r >= 0.35 else 'C')

inst_prefix = {'中心支行': 'zx', '产业科技支行': 'cy', '获客型零售支行': 'hk', '经营型零售支行': 'jy', '私行中心': 'sx'}

branches, sales = [], {}
ranks = {}
with_actual = sorted((u for u in units if u.get('actual')), key=lambda u: -u['actual'])
for i, u in enumerate(with_actual, 1):
    ranks[id(u)] = i  # 临时用对象id

for u in units:
    inst, team = u['inst'], u['team']
    is_priv = inst == '私行中心'
    uid = f"{inst_prefix[inst]}-{slug(team)}"
    name = team if (is_priv or team.endswith('支行') or team.endswith('营业部')) else f"{team}支行"
    if is_priv:
        name = f"私行{team}" if not team.startswith('私行') else team
    manager = u['org_head'] if u['org_head'] not in ('', '一', '-') else u['head']
    if manager in ('一', '-'):
        manager = ''
    title = '私行团队长' if is_priv else '支行长'
    ic = u['ic'] or '未归口'
    target, actual = u.get('target'), u.get('actual')
    # 任务占比：以总表 sheet2「任务占比」列为准（支行战区÷4亿、私行战区÷1.6亿，各自合计100%）
    # 由 scripts/sync_v4.py 同步；无该列时回退到按战区目标计算
    if u.get('share') is not None:
        share = u['share']
    else:
        base = WAR_TOTAL['私行'] if is_priv else WAR_TOTAL['战区']
        share = round(target / base * 100, 4) if target else 0.0
    g = grade_of(target, actual)
    # id/名称去重：同一团队名出现多行时（如六中心：李晶晶团队 + 武璇本部），
    # 「原表团队名误作」的行（归属调整后与原有团队重名）加负责人后缀
    if '误作' in (u.get('note') or '') or uid in sales or any(b['id'] == uid for b in branches):
        suffix = slug(manager) if manager else '2'
        uid = f"{uid}-{suffix}"
        name = f"{name}（{manager}团队）" if manager else f"{name}（2）"
    m = mgr_map.get(team) or {}
    branches.append({
        'id': uid, 'name': name, 'inst': inst, 'district': u.get('district') or '待补充',
        'manager': manager or '待补充', 'managerTitle': title,
        'channelManager': ic, 'share': share,
        'fundManager': m.get('mgr'),
        'lng': u['lng'], 'lat': u['lat'],
    })
    if target or actual:
        comp = round(actual / target * 100, 1) if target and actual is not None else None
        sales[uid] = {
            'totalTask': target, 'totalSales': actual, 'completion': comp,
            'products': [{
                'product': '天弘盈安FOF（首发）', 'period': '首发至2026年4月上旬',
                'task': target, 'sales': actual,
                'rank': ranks.get(id(u)), 'completion': comp,
            }],
        }

# 输出 branches.ts
lines = [
    '// 平安银行深圳分行 119 个支行/团队基础数据',
    '// 数据来源：平安深分架构_盈安销量整合总表.xlsx（sheet2）+ 高德 POI 地理编码（scripts/geocode-pingan.mjs）',
    '// 私行各团队坐标为「平安银行私人银行」锚点的近似环绕布点（私行团队无独立网点），仅用于列表展示，不在地图落点',
    '',
    'export interface Outlet {',
    '  id: string;',
    '  name: string;',
    '  lng: number;',
    '  lat: number;',
    '  address: string | null;',
    '}',
    '',
    'export interface Branch {',
    '  id: string;',
    '  /** 支行/团队名称 */',
    '  name: string;',
    '  /** 机构类型：中心支行/产业科技支行/获客型零售支行/经营型零售支行/私行中心 */',
    '  inst: string;',
    '  district: string;',
    '  /** 支行长/团队长 */',
    '  manager: string;',
    '  managerTitle: string;',
    '  /** 分管 IC（渠道督导） */',
    '  channelManager: string;',
    '  /** 任务占比（%）：总表 sheet2「任务占比」列（支行战区÷4亿、私行战区÷1.6亿，各战区合计100%） */',
    '  share: number;',
    '  /** 天弘渠道经理（基金侧）；null = 未分配（私行/新设网点） */',
    '  fundManager: string | null;',
    '  lng: number;',
    '  lat: number;',
    '}',
    '',
    'export const BRANCHES: Branch[] = [',
]
for b in branches:
    lines.append(
        '  {{ id: "{id}", name: "{name}", inst: "{inst}", district: "{district}", manager: "{manager}", '
        'managerTitle: "{managerTitle}", channelManager: "{channelManager}", share: {share}, '
        'fundManager: {fm}, '
        'lng: {lng}, lat: {lat} }},'.format(
            id=b['id'], name=b['name'], inst=b['inst'], district=b['district'], manager=b['manager'],
            managerTitle=b['managerTitle'], channelManager=b['channelManager'],
            share=b['share'],
            fm=('null' if b['fundManager'] is None else f'"{b["fundManager"]}"'),
            lng=b['lng'], lat=b['lat']))
lines += [
    '];',
    '',
    '/** 机构类型（筛选用，顺序即展示顺序） */',
    'export const INST_TYPES = ["中心支行", "产业科技支行", "获客型零售支行", "经营型零售支行", "私行中心"];',
    '',
    '/** 机构类型配色 */',
    'export const INST_COLORS: Record<string, string> = {',
    '  中心支行: "#2563eb",',
    '  产业科技支行: "#10b981",',
    '  获客型零售支行: "#f59e0b",',
    '  经营型零售支行: "#8b5cf6",',
    '  私行中心: "#ec4899",',
    '};',
    '',
    '/** 天弘渠道经理（筛选用） */',
    'export const FUND_MANAGERS = ["赵创", "鲁学智", "俞舒涵"];',
    '',
    '/** 渠道经理配色 */',
    'export const FUND_MANAGER_COLORS: Record<string, string> = {',
    '  赵创: "#f59e0b",',
    '  鲁学智: "#2563eb",',
    '  俞舒涵: "#10b981",',
    '};',
    '',
    'export const CHANNEL_MANAGERS = Array.from(new Set(BRANCHES.map((b) => b.channelManager)));',
]
open('src/data/branches.ts', 'w', encoding='utf-8').write('\n'.join(lines))

# 输出 sales.ts
sl = [
    '// 天弘盈安（FOF）销量数据，由 平安深分架构_盈安销量整合总表.xlsx 自动生成',
    '// 达成率 = 实际累计销量 ÷ FOF目标（不叠加双算、不做A类翻倍）',
    '',
    'export interface ProductSale {',
    '  product: string;',
    '  period: string;',
    '  task: number | null;',
    '  sales: number | null;',
    '  rank: number | null;',
    '  completion: number | null;',
    '}',
    '',
    'export interface BranchSales {',
    '  totalTask: number;',
    '  totalSales: number;',
    '  /** 盈安FOF完成率（%）；null = 有数据但无法计算（如无目标） */',
    '  completion: number | null;',
    '  products: ProductSale[];',
    '}',
    '',
    'export const SALES: Record<string, BranchSales> = ' + json.dumps(sales, ensure_ascii=False, indent=2) + ';',
    '',
]
open('src/data/sales.ts', 'w', encoding='utf-8').write('\n'.join(sl))

print('branches:', len(branches), '| sales:', len(sales))
print('inst分布:', {t: sum(1 for b in branches if b['inst'] == t) for t in ['中心支行', '产业科技支行', '获客型零售支行', '经营型零售支行', '私行中心']})
print('sample id:', branches[0]['id'], branches[0]['name'])
