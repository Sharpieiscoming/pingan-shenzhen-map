# 平安银行（深圳）网点分布系统

天弘基金深圳分公司 · 平安银行深圳分行网点/团队分布与盈安销量可视化（React + Vite + Leaflet）。

## 网站地址

推送代码到 `main` 分支后约 1～2 分钟自动部署，地址为：
`https://<你的GitHub用户名>.github.io/<仓库名>/`

## 如何更新数据（不用懂代码）

所有业务数据都在仓库根目录的 **`data/` 文件夹下的三个 JSON 文件**里，日常更新只需要改它们：

| 文件 | 内容 | 更新频率 |
|---|---|---|
| `data/branches.json` | 119 个支行/团队的基础信息：名称、机构类型、行政区、支行长、分管 IC、任务占比、渠道经理、经纬度 | 架构/人员调整时 |
| `data/sales.json` | 各支行盈安 FOF 目标与累计销量（单位：万）、完成率 | **每月更新销量时改这里** |
| `data/persons.json` | 各支行 50 万以上人员的姓名、岗位、销量、占本支行比 | 人员销量更新时 |

### 在 GitHub 网页上直接修改（推荐）

1. 打开仓库，点击进入 `data/` 文件夹，再点要修改的 JSON 文件；
2. 点文件右上角的 ✏️ **编辑（Edit this file）** 按钮；
3. 直接改数字（注意保持英文标点和原有格式，例如 `"sales": 702` 只改数字）；
4. 点右上角 **Commit changes**（提交说明随便写，如“更新10月销量”），确认提交；
5. 等待 1～2 分钟，网站自动刷新为最新数据（Actions 页面可查看部署进度，绿色 √ 即成功）。

### 字段说明（sales.json 为例）

```json
"zx-pinganyinhangdasha": {      // 支行 ID（不要改，与 branches.json 对应）
  "totalTask": 1501,            // 盈安FOF目标（万）
  "totalSales": 702,            // 实际累计销量（万）
  "completion": 46.8            // 完成率（%），= totalSales ÷ totalTask × 100，改数后记得同步改它
}
```

> 提示：JSON 里不能写注释，所有标点必须用**英文半角**（`"` `:` `,` `{` `}`）。改完后如果网页没变化，先到 Actions 页面看部署是不是失败了（通常是格式写错了，比如多了个逗号）。

## 本地运行（开发人员）

```bash
npm install
npm run dev      # 本地预览 http://localhost:3000
npm run build    # 构建产物在 dist/
```

## 交接说明

- 仓库所有者可在 Settings → Collaborators 中添加同事为协作者（Write 权限），对方即可通过网页编辑数据；
- 高德地图 Key 通过环境变量 `VITE_AMAP_KEY` 注入（本地写在 `.env.local`，不会被提交）：如需在部署网站上使用地址搜索，到[高德开放平台](https://lbs.amap.com/)免费申请「Web服务」Key 并设置域名白名单后填入。
