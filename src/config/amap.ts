// 高德开放平台 Web服务 Key（个人申请，免费额度）
// 用于：地址搜索联想（输入提示）、网点地址批量转坐标（地理编码）
//
// ⚠️ 公开仓库中请勿提交真实 Key。本文件只读环境变量 VITE_AMAP_KEY：
// - 本地开发：在仓库根目录 .env.local 中填写 VITE_AMAP_KEY=xxx（该文件已被 git 忽略，不会上传）
// - 部署网站：如需地址搜索，到 https://lbs.amap.com/ 免费申请「Web服务」Key 并设置域名白名单后，
//   自行在代码中填入或配置构建环境变量；Key 为空时仅顶部搜索框无联想，其余功能不受影响。
export const AMAP_KEY: string = import.meta.env.VITE_AMAP_KEY ?? "";
export const AMAP_CITY = "深圳";
