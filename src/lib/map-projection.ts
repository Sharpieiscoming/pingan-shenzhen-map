import { useMemo } from "react";
import type { Branch } from "@/data/branches";

export const VIEW_W = 1000;
export const VIEW_H = 820;

/** 各分管 IC 颜色 */
export const MANAGER_COLORS: Record<string, string> = {
  徐舜平: "#f59e0b",
  赵昊旻: "#2563eb",
  王晶: "#10b981",
  李劲波: "#8b5cf6",
  孙启辰: "#ec4899",
  李佳龙: "#06b6d4",
  王燕: "#84cc16",
  楼雅颖: "#f97316",
  未归口: "#64748b",
};
export const DEFAULT_COLOR = "#64748b";

export function managerColor(name: string): string {
  return MANAGER_COLORS[name] ?? DEFAULT_COLOR;
}

interface RawFeature {
  type: "Feature";
  properties: { name: string; center?: [number, number] };
  geometry:
    | { type: "Polygon"; coordinates: number[][][] }
    | { type: "MultiPolygon"; coordinates: number[][][][] };
}

export interface DistrictShape {
  name: string;
  /** 已经投影到 viewBox 坐标系的子多边形数组 */
  rings: string[];
  labelX: number;
  labelY: number;
}

function ringToPath(ring: number[][], project: (lng: number, lat: number) => [number, number]): string {
  return (
    ring
      .map((coord, i) => {
        const [x, y] = project(coord[0], coord[1]);
        return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ") + " Z"
  );
}

/** 基于 GeoJSON 计算线性投影 + 各区路径 */
export function useMapProjection(geojson: { features: RawFeature[] }) {
  return useMemo(() => {
    let minLng = Infinity,
      maxLng = -Infinity,
      minLat = Infinity,
      maxLat = -Infinity;
    for (const f of geojson.features) {
      const polys = f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates;
      for (const poly of polys) {
        for (const ring of poly) {
          for (const [lng, lat] of ring) {
            if (lng < minLng) minLng = lng;
            if (lng > maxLng) maxLng = lng;
            if (lat < minLat) minLat = lat;
            if (lat > maxLat) maxLat = lat;
          }
        }
      }
    }
    const pad = 36;
    const sx = (VIEW_W - pad * 2) / (maxLng - minLng);
    const sy = (VIEW_H - pad * 2) / (maxLat - minLat);
    const s = Math.min(sx, sy);
    // 水平居中
    const offsetX = pad + (VIEW_W - pad * 2 - (maxLng - minLng) * s) / 2;
    const project = (lng: number, lat: number): [number, number] => [
      offsetX + (lng - minLng) * s,
      VIEW_H - (offsetYOf(lat) as number),
    ];
    function offsetYOf(lat: number): number {
      return pad + (lat - minLat) * s;
    }

    const districts: DistrictShape[] = geojson.features.map((f) => {
      const polys = f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates;
      const rings: string[] = [];
      let cx = 0,
        cy = 0,
        n = 0;
      for (const poly of polys) {
        for (const ring of poly) {
          rings.push(ringToPath(ring, project));
          for (const [lng, lat] of ring) {
            const [x, y] = project(lng, lat);
            cx += x;
            cy += y;
            n++;
          }
        }
      }
      // 用 properties.center 作为标签位置更稳
      let labelX = cx / n,
        labelY = cy / n;
      if (f.properties.center) {
        const [x, y] = project(f.properties.center[0], f.properties.center[1]);
        labelX = x;
        labelY = y;
      }
      return { name: f.properties.name, rings, labelX, labelY };
    });

    const projectBranch = (b: Pick<Branch, "lng" | "lat">) => {
      const [x, y] = project(b.lng, b.lat);
      return { x, y };
    };

    /** 管辖行标记半径：按任务占比分级 */
    const markerRadius = (share: number) => 13 + share * 1.15;

    return {
      project,
      projectBranch,
      markerRadius,
      districts,
      lngSpan: maxLng - minLng,
      /** 1 经度对应的 viewBox 像素，用于把「公里/度」半径换算成屏幕半径 */
      pxPerDeg: s,
    };
  }, [geojson]);
}
