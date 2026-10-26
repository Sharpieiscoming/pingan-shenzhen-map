import { useState } from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import AmapMap from "@/components/AmapMap";
import SidePanel from "@/components/SidePanel";
import { BRANCHES, INST_TYPES } from "@/data/branches";
import tianhongLogo from "@/assets/tianhong-logo.png";

export default function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [filterInst, setFilterInst] = useState<string | null>(null);
  const [filterMgr, setFilterMgr] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(true);

  /** 切换支行/团队 */
  const handleSelect = (id: string | null) => {
    setSelectedId(id);
  };

  /** 切换机构类型筛选：若当前选中的支行/团队不属于该类型，则退出下钻 */
  const handleFilterInst = (inst: string | null) => {
    setFilterInst(inst);
    if (inst && selectedId) {
      const b = BRANCHES.find((x) => x.id === selectedId);
      if (b && b.inst !== inst) setSelectedId(null);
    }
  };

  /** 切换渠道经理筛选：若当前选中的支行不由该经理负责，则退出下钻 */
  const handleFilterMgr = (name: string | null) => {
    setFilterMgr(name);
    if (name && selectedId) {
      const b = BRANCHES.find((x) => x.id === selectedId);
      if (b && b.fundManager !== name) setSelectedId(null);
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50 text-slate-800">
      {/* 顶部栏 */}
      <header className="flex h-14 shrink-0 items-center gap-3 border-b bg-white px-4">
        <img src={tianhongLogo} alt="天弘基金" className="h-8 w-auto" />
        <div className="h-6 w-px bg-slate-200" />
        <div>
          <h1 className="text-[15px] font-bold leading-tight text-slate-800">平安银行（深圳）网点分布系统</h1>
          <p className="text-[11px] leading-tight text-slate-400">天弘基金深圳分公司 · 平安深分 5 类机构 {BRANCHES.length} 个支行/团队 · 覆盖深圳市 {new Set(BRANCHES.map((b) => b.district)).size} 个行政区</p>
        </div>
        <div className="ml-auto flex items-center gap-5 text-xs text-slate-500">
          <div className="text-right">
            <div className="text-base font-bold text-slate-800">{BRANCHES.length}</div>
            <div className="text-slate-400">支行/团队</div>
          </div>
          <div className="text-right">
            <div className="text-base font-bold text-slate-800">{INST_TYPES.length}</div>
            <div className="text-slate-400">机构类型</div>
          </div>
        </div>
      </header>

      {/* 主区域 */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {panelOpen && (
          <SidePanel
            selectedId={selectedId}
            onSelect={handleSelect}
            onHover={setHoveredId}
            filterInst={filterInst}
            onFilterInst={handleFilterInst}
            filterMgr={filterMgr}
            onFilterMgr={handleFilterMgr}
          />
        )}
        <main className="relative min-w-0 flex-1">
          <AmapMap
            selectedId={selectedId}
            onSelect={handleSelect}
            highlightedId={hoveredId}
            filterInst={filterInst}
            filterMgr={filterMgr}
          />
          {/* 左侧栏收起 / 展开 */}
          <button
            onClick={() => setPanelOpen((v) => !v)}
            title={panelOpen ? "收起列表" : "展开列表"}
            className="absolute left-3 top-[104px] z-[1000] flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white/95 px-2.5 py-1.5 text-xs text-slate-600 shadow-md transition-colors hover:bg-white hover:text-slate-800"
          >
            {panelOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
            {panelOpen ? "收起" : "网点列表"}
          </button>
        </main>
      </div>
    </div>
  );
}
