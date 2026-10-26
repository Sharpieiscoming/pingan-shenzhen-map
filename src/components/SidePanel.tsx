import { useMemo, useState } from "react";
import {
  BRANCHES,
  FUND_MANAGER_COLORS,
  FUND_MANAGERS,
  INST_COLORS,
  INST_TYPES,
  type Branch,
} from "@/data/branches";
import { SALES } from "@/data/sales";
import { PERSONS } from "@/data/persons";
import { managerColor } from "@/lib/map-projection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Building2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  History,
  Search,
  TrendingUp,
  User,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onHover: (id: string | null) => void;
  filterInst: string | null;
  onFilterInst: (inst: string | null) => void;
  filterMgr: string | null;
  onFilterMgr: (name: string | null) => void;
}

/** "8月3日-8月14日" → "08.03-08.14" */
function fmtPeriod(p: string): string {
  const m = p.match(/(\d+)月(\d+)日-(\d+)月(\d+)日/);
  if (!m) return p;
  return `${m[1].padStart(2, "0")}.${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}.${m[4].padStart(2, "0")}`;
}

/** 全市达成率排名（无法计算的排最后） */
const COMPLETION_RANKS = (() => {
  const sorted = Object.entries(SALES).sort(
    (a, b) => (b[1].completion ?? -1) - (a[1].completion ?? -1)
  );
  const ranks: Record<string, number> = {};
  sorted.forEach(([id], i) => (ranks[id] = i + 1));
  return ranks;
})();

export default function SidePanel({
  selectedId,
  onSelect,
  onHover,
  filterInst,
  onFilterInst,
  filterMgr,
  onFilterMgr,
}: Props) {
  const [query, setQuery] = useState("");
  const selected = useMemo(() => BRANCHES.find((b) => b.id === selectedId) ?? null, [selectedId]);

  const list = useMemo(() => {
    let arr = [...BRANCHES].sort((a, b) => b.share - a.share);
    if (filterInst) arr = arr.filter((b) => b.inst === filterInst);
    if (filterMgr) arr = arr.filter((b) => b.fundManager === filterMgr);
    const q = query.trim();
    if (q) arr = arr.filter((b) => b.name.includes(q) || b.manager.includes(q) || b.district.includes(q));
    return arr;
  }, [query, filterInst, filterMgr]);

  const instCounts = useMemo(() => {
    const c: Record<string, number> = {};
    BRANCHES.forEach((b) => (c[b.inst] = (c[b.inst] ?? 0) + 1));
    return c;
  }, []);

  return (
    <div className="flex h-full min-h-0 w-[340px] shrink-0 flex-col overflow-hidden border-r bg-white">
      {selected ? (
        <BranchDetail branch={selected} onBack={() => onSelect(null)} />
      ) : (
        <>
          <div className="border-b px-4 pb-3 pt-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索支行 / 负责人 / 行政区"
                className="pl-8"
              />
            </div>
            {/* 渠道经理筛选（天弘基金侧）：点击后列表与地图只显示其负责的网点 */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              <FilterChip active={!filterMgr} onClick={() => onFilterMgr(null)}>
                全部经理
              </FilterChip>
              {FUND_MANAGERS.map((m) => (
                <FilterChip
                  key={m}
                  active={filterMgr === m}
                  color={FUND_MANAGER_COLORS[m]}
                  onClick={() => onFilterMgr(filterMgr === m ? null : m)}
                >
                  {m}
                </FilterChip>
              ))}
            </div>
            {/* 机构类型筛选：点击后列表与地图只显示该片区下辖支行（私行中心仅在列表展示） */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              <FilterChip active={!filterInst} onClick={() => onFilterInst(null)}>
                全部
              </FilterChip>
              {INST_TYPES.map((t) => (
                <FilterChip
                  key={t}
                  active={filterInst === t}
                  color={INST_COLORS[t]}
                  onClick={() => onFilterInst(filterInst === t ? null : t)}
                >
                  {t.replace("支行", "").replace("零售", "")}·{instCounts[t] ?? 0}
                </FilterChip>
              ))}
            </div>
            <div className="mt-2.5 rounded-lg bg-slate-50 px-2.5 py-1.5 text-[10px] leading-4 text-slate-400">
              私行中心各团队无独立网点，仅在列表中展示、不在地图落点
            </div>
          </div>

          <div className="flex items-center justify-between px-4 py-2 text-xs text-slate-400">
            <span>共 {list.length} 个支行/团队</span>
            <span>按任务占比排序</span>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-3">
            <div className="flex flex-col gap-2">
              {list.map((b) => (
                <BranchRow
                  key={b.id}
                  branch={b}
                  active={b.id === selectedId}
                  onClick={() => onSelect(b.id)}
                  onHover={(h) => onHover(h ? b.id : null)}
                />
              ))}
              {list.length === 0 && <div className="py-10 text-center text-sm text-slate-400">没有匹配的支行/团队</div>}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function FilterChip({
  children,
  active,
  onClick,
  color,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  color?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors",
        active ? "border-transparent text-white" : "bg-white text-slate-500 hover:border-slate-300"
      )}
      style={active ? { background: color ?? "#0f172a" } : undefined}
    >
      {color && !active && <span className="h-2 w-2 rounded-full" style={{ background: color }} />}
      {children}
    </button>
  );
}

function BranchRow({
  branch,
  active,
  onClick,
  onHover,
}: {
  branch: Branch;
  active: boolean;
  onClick: () => void;
  onHover: (h: boolean) => void;
}) {
  const color = INST_COLORS[branch.inst] ?? managerColor(branch.channelManager);
  const s = SALES[branch.id];
  return (
    <Card
      onClick={onClick}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      className={cn(
        "cursor-pointer border-slate-200 p-3 transition-all hover:-translate-y-0.5 hover:shadow-md",
        active && "ring-2"
      )}
      style={active ? ({ "--tw-ring-color": color } as React.CSSProperties) : undefined}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
          <span className="text-sm font-semibold text-slate-800">{branch.name}</span>
          <span className="text-[11px] text-slate-400">{branch.district}</span>
        </div>
        <ChevronRight className="h-4 w-4 text-slate-300" />
      </div>
      <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <User className="h-3 w-3" /> {branch.manager}
        </span>
        <span className="flex items-center gap-1">
          <Users className="h-3 w-3" /> {branch.fundManager ?? "未分配"}
        </span>
        {s && (
          <span className="flex items-center gap-1 text-slate-400">
            <TrendingUp className="h-3 w-3" />
            达成率 <b className="text-slate-600">{s.completion != null ? s.completion + "%" : "待计算"}</b>
          </span>
        )}
        <span className="ml-auto font-semibold" style={{ color }}>
          {branch.share.toFixed(2)}%
        </span>
      </div>
      <Progress value={branch.share * 10} className="mt-2 h-1.5" style={{ "--primary": color } as React.CSSProperties} />
    </Card>
  );
}

function BranchDetail({
  branch,
  onBack,
}: {
  branch: Branch;
  onBack: () => void;
}) {
  const color = INST_COLORS[branch.inst] ?? managerColor(branch.channelManager);
  const s = SALES[branch.id];
  const persons = PERSONS[branch.id] ?? [];
  const [showSales, setShowSales] = useState(false);
  return (
    <>
      <div className="shrink-0 border-b p-4">
        <Button variant="ghost" size="sm" className="mb-2 -ml-2 gap-1 text-slate-500" onClick={onBack}>
          <X className="h-4 w-4" /> 关闭
        </Button>
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl text-white" style={{ background: color }}>
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-base font-bold text-slate-800">
              {branch.name}
            </div>
            <div className="text-xs text-slate-400">
              {branch.inst} · {branch.district}
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-slate-50 p-2.5">
            <div className="text-[11px] text-slate-400">任务占比（盈安FOF）</div>
            <div className="text-lg font-bold" style={{ color }}>
              {branch.share.toFixed(2)}%
            </div>
          </div>
          <div className="rounded-lg bg-slate-50 p-2.5">
            <div className="text-[11px] text-slate-400">渠道经理（天弘）</div>
            <div className="text-sm font-semibold text-slate-700">
              {branch.fundManager ?? (
                <span className="text-xs font-normal text-slate-400">未分配</span>
              )}
            </div>
          </div>
          <div className="rounded-lg bg-slate-50 p-2.5">
            <div className="text-[11px] text-slate-400">负责人</div>
            <div className="text-sm font-semibold text-slate-700">
              {branch.manager}
              <span className="ml-1 text-xs font-normal text-slate-400">{branch.managerTitle}</span>
            </div>
          </div>
          <div className="rounded-lg bg-slate-50 p-2.5">
            <div className="text-[11px] text-slate-400">分管 IC</div>
            <div className="text-sm font-semibold text-slate-700">{branch.channelManager}</div>
          </div>
        </div>
      </div>

      {/* 盈安销量情况（可收起 / 展开） */}
      {s && (
        <div className="border-t">
          <button
            onClick={() => setShowSales(!showSales)}
            className="flex w-full items-center justify-between gap-2 px-4 py-2.5 transition-colors hover:bg-slate-50"
          >
            <span className="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-xs font-medium text-slate-500">
              <History className="h-3.5 w-3.5" /> 盈安销量（{s.products.length} 只产品）
            </span>
            <span className="flex shrink-0 items-center gap-1 whitespace-nowrap text-[11px] text-slate-400">
              全市第 <b className="text-slate-600">{COMPLETION_RANKS[branch.id]}</b> / {Object.keys(SALES).length}
              {showSales ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </span>
          </button>
          {showSales && (
            <>
              <div className="mx-4 grid grid-cols-3 gap-2 rounded-xl border border-slate-100 bg-slate-50/60 p-2.5 text-center">
                <div>
                  <div className="text-[10px] text-slate-400">FOF目标</div>
                  <div className="text-sm font-bold text-slate-700">{s.totalTask.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">实际销量</div>
                  <div className="text-sm font-bold text-slate-700">{Math.round(s.totalSales).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">达成率</div>
                  <div
                    className="text-sm font-bold"
                    style={{
                      color:
                        s.completion == null
                          ? "#cbd5e1"
                          : s.completion >= 50
                            ? "#059669"
                            : s.completion >= 35
                              ? "#d97706"
                              : "#dc2626",
                    }}
                  >
                    {s.completion != null ? s.completion + "%" : "待计算"}
                  </div>
                </div>
              </div>
              <div className="max-h-64 overflow-y-auto px-4 pb-3 pt-1 text-[11px]">
                <div className="flex items-center pb-1 text-slate-400">
                  <span className="flex-1">产品 / 档期</span>
                  <span className="w-11 text-right">任务</span>
                  <span className="w-12 text-right">销量</span>
                  <span className="w-12 text-right">达成率</span>
                  <span className="w-6 text-right">排名</span>
                </div>
                {s.products.map((p, i) => (
                  <div key={i} className="flex items-center border-t border-slate-50 py-1.5">
                    <div className="flex min-w-0 flex-1 items-center gap-1.5 pr-2">
                      <span className="truncate font-medium text-slate-600">{p.product.replace(/\(\d{4}\)$/, "")}</span>
                      <span className="shrink-0 rounded bg-slate-100 px-1 py-px text-[9px] leading-3 text-slate-400">
                        {fmtPeriod(p.period)}
                      </span>
                    </div>
                    <span className="w-11 text-right text-slate-500">{p.task?.toLocaleString() ?? "-"}</span>
                    <span className="w-12 text-right font-semibold text-slate-700">
                      {p.sales != null ? Math.round(p.sales).toLocaleString() : "-"}
                    </span>
                    <span
                      className="w-12 text-right font-semibold"
                      style={{
                        color:
                          p.completion == null
                            ? "#cbd5e1"
                            : p.completion >= 100
                              ? "#059669"
                              : p.completion >= 50
                                ? "#334155"
                                : "#dc2626",
                      }}
                    >
                      {p.completion != null ? `${p.completion}%` : "-"}
                    </span>
                    <span className="w-6 text-right text-slate-400">{p.rank ?? "-"}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* 人员名单（销量 50W 以上） */}
      <div className="flex min-h-0 flex-1 flex-col border-t">
        <div className="flex items-center justify-between px-4 py-2.5 text-xs text-slate-400">
          <span className="flex items-center gap-1.5 font-medium text-slate-500">
            <Users className="h-3.5 w-3.5" /> 人员名单（{persons.length}）
          </span>
          <Badge variant="outline" className="border-sky-300 bg-sky-50 text-[10px] text-sky-600">
            销量 50 万以上 · 按销量排序
          </Badge>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-3">
          <div className="flex flex-col gap-1.5">
            {persons.map((p, i) => (
              <div key={i} className="flex items-center gap-2.5 rounded-lg border border-slate-100 px-3 py-2">
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                    i < 3 ? "text-white" : "bg-slate-100 text-slate-400"
                  )}
                  style={i < 3 ? { background: ["#f59e0b", "#94a3b8", "#d97706"][i] } : undefined}
                >
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate text-[13px] font-medium text-slate-700">{p.name}</span>
                    {p.role && (
                      <span className="shrink-0 rounded bg-slate-100 px-1 py-px text-[9px] leading-3 text-slate-400">
                        {p.role}
                      </span>
                    )}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-[13px] font-bold text-slate-700">{p.sales.toLocaleString()} 万</div>
                  <div className="text-[10px] text-slate-400">
                    {p.share != null ? `占本支行 ${p.share}%` : "占比待计算"}
                  </div>
                </div>
              </div>
            ))}
            {persons.length === 0 && (
              <div className="py-6 text-center text-[11px] text-slate-300">该支行暂无 50 万以上销量人员记录</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
