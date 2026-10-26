import { useCallback, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  BRANCHES,
  INST_COLORS,
  INST_TYPES,
  type Branch,
} from "@/data/branches";
import { SALES } from "@/data/sales";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import MapSearchBox from "@/components/MapSearchBox";

interface Props {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  highlightedId: string | null;
  filterInst: string | null;
  filterMgr: string | null;
}

const SZ_CENTER: [number, number] = [22.543, 114.057];
const SZ_ZOOM = 10.5;
const DRILL_ZOOM = 13.4;

/** 银行图标 SVG（白色描边建筑图案） */
const BANK_SVG = `<svg viewBox="0 0 24 24" width="55%" height="55%"><path d="M2 9 L12 3 L22 9 M4 9.5 V18 M9.3 9.5 V18 M14.7 9.5 V18 M20 9.5 V18 M2 21 H22 M2 18.4 H22" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

/** 达成率配色（tooltip 用） */
function compColor(c: number | null): string {
  if (c == null) return "#94a3b8";
  return c >= 50 ? "#059669" : c >= 35 ? "#d97706" : "#dc2626";
}

function markerHtml(b: Branch): string {
  const size = Math.round(30 + b.share * 1.7);
  return `<div class="branch-marker" style="--c:${INST_COLORS[b.inst]};--s:${size}px">
    <div class="bm-pulse"></div>
    <div class="bm-pin">${BANK_SVG}</div>
    <div class="bm-name">${b.name.replace("支行", "").replace("分行营业部", "分行营业部")}</div>
  </div>`;
}

function tooltipHtml(b: Branch): string {
  const color = INST_COLORS[b.inst];
  const s = SALES[b.id];
  const compRow = s
    ? `<div class="tt-row"><span class="tt-label">盈安FOF达成率</span><span class="tt-value" style="color:${compColor(s.completion)}">${s.completion != null ? s.completion + "%" : "待计算"} · 累计 ${Math.round(s.totalSales).toLocaleString()} 万</span></div>`
    : "";
  return `<div class="tt">
    <div class="tt-head">
      <span class="tt-title"><span class="tt-dot" style="background:${color}"></span>${b.name}</span>
      <span class="tt-district">${b.district}</span>
    </div>
    <div class="tt-rows">
      <div class="tt-row"><span class="tt-label">机构类型</span><span class="tt-value">${b.inst}</span></div>
      <div class="tt-row"><span class="tt-label">任务占比</span><span class="tt-value" style="color:${color};font-size:16px">${b.share.toFixed(2)}%</span></div>
      <div class="tt-row"><span class="tt-label">渠道经理（天弘）</span><span class="tt-value">${b.fundManager ?? "未分配"}</span></div>
      <div class="tt-row"><span class="tt-label">分管 IC</span><span class="tt-value">${b.channelManager}</span></div>
      <div class="tt-row"><span class="tt-label">负责人</span><span class="tt-value">${b.manager} · ${b.managerTitle}</span></div>
      ${compRow}
    </div>
    <div class="tt-foot">点击查看盈安销量明细与人员名单</div>
  </div>`;
}

/** 底图图层：高德矢量 / 高德卫星 / OpenStreetMap */
const BASE_LAYERS: Record<string, L.TileLayer> = {};
function getBaseLayers(): Record<string, L.TileLayer> {
  if (Object.keys(BASE_LAYERS).length) return BASE_LAYERS;
  BASE_LAYERS["高德矢量"] = L.tileLayer(
    "https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
    { subdomains: ["1", "2", "3", "4"], maxZoom: 19, attribution: "© 高德地图" }
  );
  const sat = L.tileLayer("https://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}", {
    subdomains: ["1", "2", "3", "4"],
    maxZoom: 19,
    attribution: "© 高德地图",
  });
  const satRoad = L.tileLayer("https://webst0{s}.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}", {
    subdomains: ["1", "2", "3", "4"],
    maxZoom: 19,
  });
  BASE_LAYERS["高德卫星"] = L.layerGroup([sat, satRoad]) as unknown as L.TileLayer;
  BASE_LAYERS["OSM"] = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap",
  });
  return BASE_LAYERS;
}

export default function AmapMap({ selectedId, onSelect, highlightedId, filterInst, filterMgr }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const circleRef = useRef<L.Circle | null>(null);
  const baseNameRef = useRef<string>("高德矢量");
  const searchMarkerRef = useRef<L.Marker | null>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const selectedIdRef = useRef<string | null>(selectedId);
  selectedIdRef.current = selectedId;
  const filterInstRef = useRef<string | null>(filterInst);
  filterInstRef.current = filterInst;
  const filterMgrRef = useRef<string | null>(filterMgr);
  filterMgrRef.current = filterMgr;

  /** 统一同步标记：筛选用「移除/加回地图」（可靠），下钻淡化用 CSS 类 */
  const syncMarkers = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    const sel = selectedIdRef.current;
    const fi = filterInstRef.current;
    const fm = filterMgrRef.current;
    markersRef.current.forEach((m, id) => {
      const b = BRANCHES.find((x) => x.id === id)!;
      const show = (!fi || b.inst === fi) && (!fm || b.fundManager === fm);
      if (show && !map.hasLayer(m)) m.addTo(map);
      if (!show && map.hasLayer(m)) map.removeLayer(m);
      m.getElement()?.classList.toggle("is-dim", !!sel && id !== sel);
    });
  }, []);

  /** 搜索定位：飞到目标位置并打红色标记 */
  const handleLocate = (tip: { name: string; address?: string; district?: string; location?: string }) => {
    const map = mapRef.current;
    if (!map || !tip.location) return;
    const [lng, lat] = tip.location.split(",").map(Number);
    searchMarkerRef.current?.remove();
    const icon = L.divIcon({
      className: "branch-marker-icon",
      html: `<div class="branch-marker" style="--c:#ef4444;--s:32px"><div class="bm-pin">${BANK_SVG}</div></div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });
    const marker = L.marker([lat, lng], { icon });
    marker.bindPopup(
      `<b>${tip.name}</b><br><span style="color:#64748b;font-size:12px">${[tip.district, tip.address]
        .filter(Boolean)
        .join(" · ")}</span>`,
      { offset: [0, -10] }
    );
    marker.addTo(map);
    marker.openPopup();
    searchMarkerRef.current = marker;
    map.flyTo([lat, lng], Math.max(map.getZoom(), 15), { duration: 0.8 });
  };

  /* 初始化地图（仅一次） */
  useEffect(() => {
    const el = containerRef.current;
    if (!el || mapRef.current) return;

    const map = L.map(el, {
      center: SZ_CENTER,
      zoom: SZ_ZOOM,
      zoomControl: true,
      attributionControl: true,
    });
    mapRef.current = map;
    getBaseLayers()["高德矢量"].addTo(map);

    // 支行/团队标记（私行中心无实际位置，不上图）
    for (const b of BRANCHES) {
      if (b.inst === "私行中心") continue;
      const icon = L.divIcon({
        className: "branch-marker-icon",
        html: markerHtml(b),
        iconSize: [60, 74],
        iconAnchor: [30, 34],
      });
      const marker = L.marker([b.lat, b.lng], { icon, riseOnHover: true });
      marker.bindTooltip(tooltipHtml(b), {
        direction: "top",
        offset: [0, -40],
        className: "branch-tooltip",
        opacity: 1,
        sticky: false,
      });
      marker.on("mouseover", () => el.classList.add("is-hovering"));
      marker.on("mouseout", () => el.classList.remove("is-hovering"));
      marker.on("click", () => onSelectRef.current(b.id));
      marker.addTo(map);
      markersRef.current.set(b.id, marker);
    }

    // 底图切换
    const layers = getBaseLayers();
    const ctrl = new L.Control({ position: "topright" });
    ctrl.onAdd = () => {
      const div = L.DomUtil.create("div", "base-switch");
      div.innerHTML = Object.keys(layers)
        .map((n) => `<button class="bs-btn${n === baseNameRef.current ? " active" : ""}" data-name="${n}">${n}</button>`)
        .join("");
      div.querySelectorAll<HTMLButtonElement>(".bs-btn").forEach((btn) => {
        btn.onclick = () => {
          const name = btn.dataset.name!;
          if (name === baseNameRef.current) return;
          Object.values(layers).forEach((l) => map.removeLayer(l));
          layers[name].addTo(map);
          baseNameRef.current = name;
          div.querySelectorAll(".bs-btn").forEach((b) => b.classList.toggle("active", b === btn));
        };
      });
      L.DomEvent.disableClickPropagation(div);
      return div;
    };
    ctrl.addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current.clear();
      circleRef.current = null;
      searchMarkerRef.current = null;
    };
  }, []);

  /* 容器尺寸变化（如左侧栏收起/展开）时重算地图视野，避免留下空白 */
  useEffect(() => {
    const el = containerRef.current;
    const map = mapRef.current;
    if (!el || !map) return;
    const ro = new ResizeObserver(() => map.invalidateSize());
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* 选中下钻：视野飞行 + 覆盖圈（私行中心无位置，不飞行不画圈） */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    circleRef.current?.remove();
    circleRef.current = null;

    const selected = BRANCHES.find((b) => b.id === selectedId);
    if (!selected) {
      map.flyTo(SZ_CENTER, SZ_ZOOM, { duration: 0.7 });
    } else if (selected.inst !== "私行中心") {
      map.flyTo([selected.lat, selected.lng], DRILL_ZOOM, { duration: 0.9 });

      circleRef.current = L.circle([selected.lat, selected.lng], {
        radius: 4000,
        color: INST_COLORS[selected.inst],
        weight: 1.6,
        dashArray: "6 5",
        opacity: 0.75,
        fillOpacity: 0,
      }).addTo(map);
    }

    // 同步标记可见性 / 淡化状态
    syncMarkers();
  }, [selectedId, syncMarkers]);

  /* 机构类型 / 渠道经理筛选：仅显示符合条件的支行 */
  useEffect(() => {
    syncMarkers();
  }, [filterInst, filterMgr, syncMarkers]);

  /* 侧栏悬停高亮 */
  useEffect(() => {
    markersRef.current.forEach((m, id) => {
      m.setZIndexOffset(id === highlightedId ? 1000 : 0);
      m.getElement()?.classList.toggle("is-hl", id === highlightedId);
    });
  }, [highlightedId]);

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full bg-[#eef4fb]" />
      <MapSearchBox onLocate={handleLocate} />
      {selectedId && (
        <Button
          size="sm"
          variant="outline"
          className="absolute left-4 top-4 z-[1000] gap-1.5 bg-white/95 shadow"
          onClick={() => onSelect(null)}
        >
          <ArrowLeft className="h-4 w-4" /> 返回全市视图
        </Button>
      )}
      {/* 图例 */}
      <div className="absolute bottom-6 left-4 z-[1000] rounded-xl border bg-white/95 px-4 py-3 shadow backdrop-blur">
        <div className="mb-2 text-xs font-semibold text-slate-500">机构类型</div>
        <div className="flex flex-col gap-1.5">
          {INST_TYPES.map((name) => (
            <div key={name} className="flex items-center gap-2 text-xs text-slate-600">
              <span className="inline-block h-3 w-3 rounded-full" style={{ background: INST_COLORS[name] }} />
              {name}
            </div>
          ))}
        </div>
        <div className="mt-2 border-t pt-2 text-[11px] leading-5 text-slate-400">
          图标大小 = 任务占比
          <br />
          点击标记查看销量明细与人员名单
        </div>
      </div>
      <div className={cn("pointer-events-none absolute bottom-6 right-2 z-[1000] rounded bg-white/80 px-1.5 py-0.5 text-[10px] text-slate-400")}>
        © 高德地图 / OpenStreetMap
      </div>
    </div>
  );
}
