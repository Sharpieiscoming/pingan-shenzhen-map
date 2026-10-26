// 人员销量数据（50W以上），由 平安深分架构_盈安销量整合总表.xlsx sheet3 自动生成
// share = 个人实际销量 ÷ 所在支行/团队实际销量；null = 该支行无实际销量数据
//
// ⚠️ 数据维护：业务数据已抽离到仓库根目录 data/persons.json，日常修改请直接编辑该 JSON
// （可在 GitHub 网页上直接改，保存后自动重新部署），本文件只保留类型定义。

import personsData from "../../data/persons.json";

export interface PersonSale {
  name: string;
  /** 岗位（RM/PR 等） */
  role: string;
  /** 实际销量（万） */
  sales: number;
  /** 占本支行实际销量比例（%） */
  share: number | null;
}

export const PERSONS = personsData as Record<string, PersonSale[]>;
