// 天弘盈安（FOF）销量数据，由 平安深分架构_盈安销量整合总表.xlsx 自动生成
// 达成率 = 实际累计销量 ÷ FOF目标（不叠加双算、不做A类翻倍）
//
// ⚠️ 数据维护：业务数据已抽离到仓库根目录 data/sales.json，日常修改请直接编辑该 JSON
// （可在 GitHub 网页上直接改，保存后自动重新部署），本文件只保留类型定义。

import salesData from "../../data/sales.json";

export interface ProductSale {
  product: string;
  period: string;
  task: number | null;
  sales: number | null;
  rank: number | null;
  completion: number | null;
}

export interface BranchSales {
  totalTask: number;
  totalSales: number;
  /** 盈安FOF完成率（%）；null = 有数据但无法计算（如无目标） */
  completion: number | null;
  products: ProductSale[];
}

export const SALES = salesData as Record<string, BranchSales>;
