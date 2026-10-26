// 平安银行深圳市网点数据，由高德 POI 抓取（scripts/fetch-outlets.mjs，关键词「平安银行」，已排除 ATM/自助）
// 按距离最近原则归入各支行/团队；拿到平安内部网点归属清单后，按真实归属校准本文件即可
// 私行中心各团队（sx-）无独立网点，统一给空数组
import type { Outlet } from "./branches";

export const OUTLETS: Record<string, Outlet[]> = {
  "zx-pinganyinhangdasha": [
    { "id": "zx-pinganyinhangdasha-01", "name": "平安银行(深圳平安银行大厦支行)", "lng": 114.10763, "lat": 22.540521, "address": "深南东路5047号平安银行大厦首层" },
  ],
  "zx-longhua": [
    { "id": "zx-longhua-01", "name": "平安银行(深圳龙华支行)", "lng": 114.032457, "lat": 22.659791, "address": "龙华街道办事处东环二路东和花园综合楼东侧1-2层" },
    { "id": "zx-longhua-02", "name": "平安银行(深圳富士康支行)(内部专用)", "lng": 114.050674, "lat": 22.652795, "address": "龙华街道富士康工业园内油松路C区第1栋首层" },
  ],
  "zx-nantou": [
    { "id": "zx-nantou-01", "name": "平安银行(深圳前海分行营业部)", "lng": 113.90017, "lat": 22.534374, "address": "梦海大道5209号层107-109" },
    { "id": "zx-nantou-02", "name": "平安银行(深圳南头支行)(暂停营业)", "lng": 113.920087, "lat": 22.532112, "address": "桃园路161号平安银行南山大厦1层" },
  ],
  "zx-shidaijinrong": [
    { "id": "zx-shidaijinrong-01", "name": "平安银行(深圳时代金融支行)", "lng": 114.055364, "lat": 22.538056, "address": "深南大道4001号时代金融中心东侧裙楼首层" },
  ],
  "zx-xili": [
    { "id": "zx-xili-01", "name": "平安银行(深圳西丽湖社区支行)(内部专用)", "lng": 113.952425, "lat": 22.587121, "address": "沙河西路深圳职业技术大学西丽湖校区行政厚德楼1层(不对外)" },
    { "id": "zx-xili-02", "name": "平安银行(深圳西丽支行)", "lng": 113.955959, "lat": 22.580082, "address": "留仙大道5015号众冠大厦首层" },
  ],
  "zx-baocheng": [
    { "id": "zx-baocheng-01", "name": "平安银行(深圳宝城支行)", "lng": 113.890044, "lat": 22.553424, "address": "新安街道海旺社区85区新湖路102号宏发领域花园6栋102" },
  ],
  "zx-jinsha": [
    { "id": "zx-jinsha-01", "name": "平安银行(深圳金沙支行)", "lng": 114.029829, "lat": 22.523989, "address": "沙头街道上沙中心路18号中洲滨海华府一期18-18号二楼15-18号商铺" },
  ],
  "zx-longgang": [
    { "id": "zx-longgang-01", "name": "平安银行(深圳龙岗支行)", "lng": 114.238027, "lat": 22.713715, "address": "中心城吉祥路41号新亚洲花园1A" },
  ],
  "zx-nanhai": [
    { "id": "zx-nanhai-01", "name": "平安银行(深圳南海支行)", "lng": 113.921338, "lat": 22.500051, "address": "深圳市南山区南海大道与工业八路交汇处悠然居大厦一层1081-2" },
  ],
  "zx-shisha": [
    { "id": "zx-shisha-01", "name": "平安银行(深圳石厦支行)", "lng": 114.051008, "lat": 22.522627, "address": "福民路133号众孚新村3栋福民路167号、169号、171号、173号" },
  ],
  "zx-xufei": [
    { "id": "zx-xufei-01", "name": "平安银行(深圳旭飞支行)", "lng": 114.103195, "lat": 22.558647, "address": "八卦二路旭飞花园C座首层(园岭地铁站A口步行370米)" },
  ],
  "zx-huangbeiling": [
    { "id": "zx-huangbeiling-01", "name": "平安银行(深圳黄贝岭支行)", "lng": 114.139201, "lat": 22.547164, "address": "深南东路1038号经泽大厦首层" },
  ],
  "zx-zhongxincheng": [
    { "id": "zx-zhongxincheng-01", "name": "平安银行中心城支行", "lng": 114.216453, "lat": 22.721955, "address": "天安数码创新园三号厂房B101" },
  ],
  "zx-dongmen": [
    { "id": "zx-dongmen-01", "name": "平安银行(深圳东门支行)", "lng": 114.119703, "lat": 22.543681, "address": "深南东路3020号百货广场大厦东座一层" },
  ],
  "zx-fuyong": [
    { "id": "zx-fuyong-01", "name": "平安银行(深圳福永支行)", "lng": 113.819101, "lat": 22.668627, "address": "福永街道福永大道128号怀德智汇广场105" },
  ],
  "zx-luohu": [
    { "id": "zx-luohu-01", "name": "平安银行(深圳罗湖支行)", "lng": 114.131894, "lat": 22.545965, "address": "深南东路深港花园一楼(黄贝岭地铁站F1口步行280米)" },
  ],
  "zx-pingshanxinqu": [
    { "id": "zx-pingshanxinqu-01", "name": "平安银行(深圳大鹏支行)", "lng": 114.426653, "lat": 22.639645, "address": "生命科学产业园A10栋1层" },
    { "id": "zx-pingshanxinqu-02", "name": "平安银行(深圳坪山新区支行)", "lng": 114.346817, "lat": 22.695943, "address": "深汕路246号友谊书城一楼" },
  ],
  "zx-dongle": [
    { "id": "zx-dongle-01", "name": "平安银行(深圳东乐支行)", "lng": 114.138739, "lat": 22.569423, "address": "太宁路38号百仕达花园四期西区裙楼103" },
  ],
  "zx-fuxing": [
    { "id": "zx-fuxing-01", "name": "平安银行(深圳福星支行)", "lng": 114.081659, "lat": 22.532739, "address": "福星路27号福民楼F座首层" },
  ],
  "zx-gongming": [
    { "id": "zx-gongming-01", "name": "平安银行(深圳公明支行)", "lng": 113.888601, "lat": 22.777759, "address": "马田街道金安路和松白路交汇处中粮云景广场一栋首层" },
  ],
  "zx-hongbao": [
    { "id": "zx-hongbao-01", "name": "平安银行(深圳红宝支行)", "lng": 114.104969, "lat": 22.545582, "address": "红岭中路1010号国际信托大厦首层" },
  ],
  "zx-meilin": [
    { "id": "zx-meilin-01", "name": "平安银行(梅林支行)", "lng": 114.053167, "lat": 22.564416, "address": "梅华路163号美林综合楼首层" },
  ],
  "zx-yantian": [
    { "id": "zx-yantian-01", "name": "平安银行(深圳盐田支行)", "lng": 114.257487, "lat": 22.59146, "address": "盐田街道明珠社区盐田路89号金水湾御园C01裙楼一楼C01、二楼C01-1" },
  ],
  "zx-guangming": [
  ],
  "zx-meisha": [
    { "id": "zx-meisha-01", "name": "平安银行(深圳梅沙支行)", "lng": 114.313683, "lat": 22.599189, "address": "梅沙街道滨海社区盐梅路78号78-1" },
  ],
  "zx-qiaoxiang": [
    { "id": "zx-qiaoxiang-01", "name": "平安银行(侨香支行)(暂停营业)", "lng": 114.010663, "lat": 22.546344, "address": "侨香三道1号园博绿苑首层1A" },
  ],
  "zx-shatoujiao": [
    { "id": "zx-shatoujiao-01", "name": "平安银行(深圳沙头角支行)", "lng": 114.231099, "lat": 22.551229, "address": "沙盐路3036号" },
  ],
  "cy-chegongmiao": [
    { "id": "cy-chegongmiao-01", "name": "平安银行(深圳车公庙支行)", "lng": 114.024942, "lat": 22.53516, "address": "沙头街道天安社区深南大道6019号金润大厦103" },
  ],
  "cy-jiangsudasha": [
    { "id": "cy-jiangsudasha-01", "name": "平安银行(深圳江苏大厦支行)", "lng": 114.05575, "lat": 22.546305, "address": "益田路6013号江苏大厦F1层" },
  ],
  "cy-chuangyelu": [
    { "id": "cy-chuangyelu-01", "name": "平安银行(深圳创业路支行)", "lng": 113.912449, "lat": 22.575681, "address": "23区创业二路268号东联工业区一栋一楼" },
  ],
  "cy-futian": [
    { "id": "cy-futian-01", "name": "平安银行(深圳福田支行)", "lng": 114.069042, "lat": 22.529564, "address": "滨河路5022号联合广场首层" },
  ],
  "cy-guiyuan": [
    { "id": "cy-guiyuan-01", "name": "平安银行(深圳桂园支行)", "lng": 114.109411, "lat": 22.553343, "address": "宝安南路3042号天地大厦1、2层" },
  ],
  "cy-huafu": [
    { "id": "cy-huafu-01", "name": "平安银行(深圳华富支行)", "lng": 114.083602, "lat": 22.544531, "address": "振华路118号华丽装饰大厦1、4楼" },
  ],
  "cy-longsheng": [
    { "id": "cy-longsheng-01", "name": "平安银行(深圳龙胜支行)", "lng": 114.013323, "lat": 22.641067, "address": "大浪街道龙平社区鸿荣源尚峻二期5栋110-114铺" },
  ],
  "cy-shijiezhichuang": [
    { "id": "cy-shijiezhichuang-01", "name": "平安银行(深圳世界之窗支行)", "lng": 113.972897, "lat": 22.538216, "address": "深南大道9030号沙河世纪假日广场B座8、9、10、11号" },
  ],
  "cy-shuibeizhubao": [
  ],
  "cy-wuzhou": [
    { "id": "cy-wuzhou-01", "name": "平安银行(深圳五洲支行)", "lng": 114.050978, "lat": 22.536925, "address": "福华一路国际商会大厦A座一层" },
  ],
  "cy-xiangmihu": [
  ],
  "cy-xincheng": [
    { "id": "cy-xincheng-01", "name": "平安银行(深圳新城支行)", "lng": 113.891863, "lat": 22.579349, "address": "新安四路198号宝立方珠宝文化创意园创意研发大厦A座L1-01、L4-07" },
  ],
  "cy-zhuoyuecheng": [
    { "id": "cy-zhuoyuecheng-01", "name": "平安银行(深圳卓越城支行)", "lng": 114.05984, "lat": 22.571735, "address": "梅林中康路卓越城一期4栋一楼" },
  ],
  "cy-bantian": [
    { "id": "cy-bantian-01", "name": "平安银行(深圳坂田支行)", "lng": 114.070297, "lat": 22.659395, "address": "坂田街道天安云谷产业园一期二栋108-111铺" },
  ],
  "cy-buji": [
    { "id": "cy-buji-01", "name": "平安银行(深圳布吉支行)", "lng": 114.113138, "lat": 22.607911, "address": "布吉街道西环路一号(长龙地铁站A口步行50米)" },
  ],
  "cy-pinghu": [
    { "id": "cy-pinghu-01", "name": "平安银行(深圳平湖支行)", "lng": 114.129101, "lat": 22.696629, "address": "平湖街道双拥街平湖会堂首层" },
  ],
  "cy-baoan": [
    { "id": "cy-baoan-01", "name": "平安银行(深圳宝安支行)", "lng": 113.911318, "lat": 22.560667, "address": "四区前进路御景台2栋102号" },
  ],
  "cy-changcheng": [
    { "id": "cy-changcheng-01", "name": "平安银行(深圳长城支行)", "lng": 114.088418, "lat": 22.551438, "address": "百花四路51号长城综合楼1楼2号" },
  ],
  "cy-dachong": [
    { "id": "cy-dachong-01", "name": "平安银行(深圳大冲支行)", "lng": 113.95356, "lat": 22.542473, "address": "铜鼓路39号大冲国际中心5号楼1楼A单元、2楼A单元" },
  ],
  "cy-henggang": [
    { "id": "cy-henggang-01", "name": "平安银行(深圳北理莫斯科大学支行)", "lng": 114.206171, "lat": 22.679136, "address": "大运新城国际大学园路1号深圳北理莫斯科大学2号宿舍楼A栋1楼" },
    { "id": "cy-henggang-02", "name": "平安银行(深圳横岗支行)", "lng": 114.197272, "lat": 22.642201, "address": "横岗街道新亚洲广场首层" },
  ],
  "cy-huaqiaocheng": [
    { "id": "cy-huaqiaocheng-01", "name": "平安银行(深圳华侨城支行)", "lng": 113.987554, "lat": 22.535333, "address": "华侨城光侨街海景花园裙楼首层" },
  ],
  "cy-kejiyuan": [
  ],
  "cy-luhu": [
    { "id": "cy-luhu-01", "name": "平安银行(深圳鹭湖支行)", "lng": 114.063633, "lat": 22.690269, "address": "观澜街道环观南路招商观园24栋101、201" },
  ],
  "hk-changxing": [
    { "id": "hk-changxing-01", "name": "平安银行常兴支行", "lng": 113.919742, "lat": 22.52783, "address": "学府路仓前锦福苑首层东侧" },
  ],
  "hk-guomao": [
    { "id": "hk-guomao-01", "name": "平安银行(深圳国贸支行)", "lng": 114.120903, "lat": 22.541216, "address": "南湖路深华商业大厦裙楼1001A号房" },
  ],
  "hk-shajing": [
    { "id": "hk-shajing-01", "name": "平安银行(深圳沙井支行)", "lng": 113.822675, "lat": 22.729021, "address": "沙井新沙路306号壆岗大厦首层" },
  ],
  "hk-zhongdian": [
  ],
  "hk-bagualing": [
    { "id": "hk-bagualing-01", "name": "平安银行(深圳八卦岭支行)", "lng": 114.106271, "lat": 22.562747, "address": "梅园路与梨园路交汇处西北角招商盛世广场C座一层" },
  ],
  "hk-luogang": [
    { "id": "hk-luogang-01", "name": "平安银行深圳罗岗支行", "lng": 114.131012, "lat": 22.590798, "address": "布吉街道罗岗路信义荔山御园D区5栋102至105号铺" },
  ],
  "hk-songgang": [
    { "id": "hk-songgang-01", "name": "平安银行(深圳松岗支行)", "lng": 113.853265, "lat": 22.765739, "address": "松岗街道楼岗大道80-1号集信大厦三楼" },
  ],
  "hk-banyin": [
    { "id": "hk-banyin-01", "name": "平安银行(深圳坂银支行)", "lng": 114.070065, "lat": 22.620434, "address": "坂田街道大族云峰花园4号楼138-143号" },
  ],
  "hk-hongwan": [
    { "id": "hk-hongwan-01", "name": "平安银行(深圳虹湾支行)", "lng": 114.037775, "lat": 22.562775, "address": "下梅林梅林路尚书苑裙楼(梅景地铁站C口步行60米)" },
  ],
  "hk-houhai": [
    { "id": "hk-houhai-01", "name": "平安银行(深圳后海支行)", "lng": 113.934406, "lat": 22.518776, "address": "后海大道海德三路天利中央商务广场首层东侧" },
  ],
  "hk-huanggang": [
    { "id": "hk-huanggang-01", "name": "平安银行(深圳皇岗支行)", "lng": 114.059715, "lat": 22.52505, "address": "皇岗村吉祥楼一楼" },
  ],
  "hk-liantang": [
    { "id": "hk-liantang-01", "name": "平安银行(深圳莲塘支行)", "lng": 114.173803, "lat": 22.561136, "address": "莲塘路82号平安银行大厦" },
  ],
  "hk-nanxinlu": [
    { "id": "hk-nanxinlu-01", "name": "平安银行(深圳南新路支行)", "lng": 113.918328, "lat": 22.518023, "address": "南新路1062号德源花园首层" },
  ],
  "hk-qingqingshijie": [
    { "id": "hk-qingqingshijie-01", "name": "平安银行青青世界支行", "lng": 113.896327, "lat": 22.50109, "address": "月亮湾港湾大道南恒立心海湾花园3栋142" },
  ],
  "hk-shiyan": [
    { "id": "hk-shiyan-01", "name": "平安银行(深圳石岩支行)", "lng": 113.94831, "lat": 22.680155, "address": "宝石东路285号星城购物中心1F层L113A(东门附近)" },
  ],
  "jy-fenhangyingyebu": [
    { "id": "jy-fenhangyingyebu-01", "name": "平安银行(深圳分行营业部)", "lng": 114.096988, "lat": 22.539988, "address": "深南中路1099号平安银行大厦1、2楼" },
  ],
  "jy-lvhaiwan": [
    { "id": "jy-lvhaiwan-01", "name": "平安银行(深圳绿海湾支行)", "lng": 113.93916, "lat": 22.492947, "address": "后海滨路1188号绿海湾花园4号商铺" },
  ],
  "jy-meilong": [
    { "id": "jy-meilong-01", "name": "平安银行(梅龙支行)", "lng": 114.027499, "lat": 22.65006, "address": "人民路4022号壹方天地A区L1层(1号门附近)" },
  ],
  "jy-shenda": [
    { "id": "jy-shenda-01", "name": "平安银行(深大支行)", "lng": 113.929807, "lat": 22.527176, "address": "学生公寓二期商业用房一楼北侧" },
  ],
  "jy-shuiwei": [
    { "id": "jy-shuiwei-01", "name": "平安银行(深圳水围支行)", "lng": 114.064831, "lat": 22.521241, "address": "金田路银庄大厦一楼(福民地铁站D口步行130米)" },
  ],
  "jy-fujing": [
    { "id": "jy-fujing-01", "name": "平安银行(深圳福景支行)", "lng": 114.045189, "lat": 22.543916, "address": "莲花街道紫荆社区景田路2号瑞达苑1B" },
  ],
  "jy-guanlan": [
    { "id": "jy-guanlan-01", "name": "平安银行(深圳观澜支行)", "lng": 114.05602, "lat": 22.714339, "address": "观澜地铁站A2口步行250米" },
  ],
  "jy-minzhi": [
    { "id": "jy-minzhi-01", "name": "平安银行(深圳民治支行)", "lng": 114.037277, "lat": 22.634163, "address": "深圳市龙华区民治大道牛栏前商业大厦综合楼一、二楼" },
  ],
  "jy-nanshan": [
    { "id": "jy-nanshan-01", "name": "平安银行(深圳南山支行)", "lng": 113.941091, "lat": 22.508005, "address": "中心路3033号喜之郎大厦一楼10、11、15号" },
  ],
  "jy-shuanglong": [
    { "id": "jy-shuanglong-01", "name": "平安银行(深圳双龙支行)", "lng": 114.271427, "lat": 22.721176, "address": "国税局对面汇通大厦一层" },
  ],
  "jy-bihaiwan": [
  ],
  "jy-daxuecheng": [
    { "id": "jy-daxuecheng-01", "name": "平安银行(深圳大学城支行)", "lng": 113.97402, "lat": 22.588568, "address": "大学城图书馆一楼" },
  ],
  "jy-gaoxinbei": [
    { "id": "jy-gaoxinbei-01", "name": "平安银行(深圳高新北支行)", "lng": 113.942915, "lat": 22.547184, "address": "南山区科技园中区科苑路科兴科学园D1栋1-3号铺" },
  ],
  "jy-gaoxinjishuqu": [
    { "id": "jy-gaoxinjishuqu-01", "name": "平安银行(深圳高新技术区支行)", "lng": 113.946231, "lat": 22.52788, "address": "深圳湾创新科技中心1栋A座01层9号" },
  ],
  "jy-hongshuwan": [
    { "id": "jy-hongshuwan-01", "name": "平安银行(深圳红树湾支行)", "lng": 113.968818, "lat": 22.530665, "address": "圳湾二路与白石洲交汇处御景东方花园裙楼123L1-06、L3-27房" },
  ],
  "jy-shekou": [
  ],
  "jy-shuixiechuntian": [
    { "id": "jy-shuixiechuntian-01", "name": "平安银行深圳水榭春天支行", "lng": 114.027982, "lat": 22.62465, "address": "民塘路莱蒙春天花园(A818-0445)1-5栋商业10、11、12、13、15、16" },
  ],
  "jy-xixiang": [
    { "id": "jy-xixiang-01", "name": "平安银行(深圳桃源居支行)", "lng": 113.861247, "lat": 22.61503, "address": "西乡桃源居桃源盛世园1号-6号楼108房" },
    { "id": "jy-xixiang-02", "name": "平安银行(深圳西乡支行)", "lng": 113.881328, "lat": 22.58072, "address": "西乡街道宝民二路107号新城广场首层" },
  ],
  "sx-yizhongxinyibu": [
  ],
  "sx-yizhongxinsanbu": [
  ],
  "sx-yizhongxinsibu": [
  ],
  "sx-yizhongxinwubu": [
  ],
  "sx-yizhongxinqibu": [
  ],
  "sx-erzhongxinyibu": [
  ],
  "sx-erzhongxinerbu": [
  ],
  "sx-erzhongxinsanbu": [
  ],
  "sx-erzhongxinwubu": [
  ],
  "sx-erzhongxinliubu": [
  ],
  "sx-erzhongxinbabu": [
  ],
  "sx-sanzhongxinyibu": [
  ],
  "sx-sanzhongxinerbu": [
  ],
  "sx-sanzhongxinsanbu": [
  ],
  "sx-sanzhongxinsibu": [
  ],
  "sx-sanzhongxinwubu": [
  ],
  "sx-sanzhongxinqibu": [
  ],
  "sx-sizhongxinyibu": [
  ],
  "sx-sizhongxinerbu": [
  ],
  "sx-sizhongxinsanbu": [
  ],
  "sx-sizhongxinsibu": [
  ],
  "sx-sizhongxinliubu": [
  ],
  "sx-wuzhongxinyibu": [
  ],
  "sx-wuzhongxinerbu": [
  ],
  "sx-wuzhongxinsanbu": [
  ],
  "sx-wuzhongxinsibu": [
  ],
  "sx-wuzhongxinliubu": [
  ],
  "sx-liuzhongxinyibu": [
  ],
  "sx-liuzhongxinerbu": [
  ],
  "sx-liuzhongxin-lijingjing": [
  ],
  "sx-liuzhongxinsanbu": [
  ],
  "sx-liuzhongxinwubu": [
  ],
  "sx-liuzhongxin": [
  ],
  "sx-qizhongxinyibu": [
  ],
  "sx-qizhongxinerbu": [
  ],
  "sx-qizhongxinsanbu": [
  ],
};
