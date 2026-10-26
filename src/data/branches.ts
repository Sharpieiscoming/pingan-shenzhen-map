// 平安银行深圳分行 119 个支行/团队基础数据
// 数据来源：平安深分架构_盈安销量整合总表.xlsx（sheet2）+ 高德 POI 地理编码（scripts/geocode-pingan.mjs）
// 私行各团队坐标为「平安银行私人银行」锚点的近似环绕布点（私行团队无独立网点），仅用于列表展示，不在地图落点
//
// ⚠️ 数据维护：业务数据已抽离到仓库根目录 data/branches.json，日常修改请直接编辑该 JSON
// （可在 GitHub 网页上直接改，保存后自动重新部署），本文件只保留类型定义与配色等代码。

import branchesData from "../../data/branches.json";

export interface Outlet {
  id: string;
  name: string;
  lng: number;
  lat: number;
  address: string | null;
}

export interface Branch {
  id: string;
  /** 支行/团队名称 */
  name: string;
  /** 机构类型：中心支行/产业科技支行/获客型零售支行/经营型零售支行/私行中心 */
  inst: string;
  district: string;
  /** 支行长/团队长 */
  manager: string;
  managerTitle: string;
  /** 分管 IC（渠道督导） */
  channelManager: string;
  /** 任务占比（%）：总表 sheet2「任务占比」列（支行战区÷4亿、私行战区÷1.6亿，各战区合计100%） */
  share: number;
  /** 天弘渠道经理（基金侧）；null = 未分配（私行/新设网点） */
  fundManager: string | null;
  lng: number;
  lat: number;
}

export const BRANCHES = branchesData as Branch[];

/** 机构类型（筛选用，顺序即展示顺序） */
export const INST_TYPES = ["中心支行", "产业科技支行", "获客型零售支行", "经营型零售支行", "私行中心"];

/** 机构类型配色 */
export const INST_COLORS: Record<string, string> = {
  中心支行: "#2563eb",
  产业科技支行: "#10b981",
  获客型零售支行: "#f59e0b",
  经营型零售支行: "#8b5cf6",
  私行中心: "#ec4899",
};

/** 天弘渠道经理（筛选用） */
export const FUND_MANAGERS = ["赵创", "鲁学智", "俞舒涵"];

/** 渠道经理配色 */
export const FUND_MANAGER_COLORS: Record<string, string> = {
  赵创: "#f59e0b",
  鲁学智: "#2563eb",
  俞舒涵: "#10b981",
};

export const CHANNEL_MANAGERS = Array.from(new Set(BRANCHES.map((b) => b.channelManager)));
