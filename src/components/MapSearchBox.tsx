import { useEffect, useRef, useState } from "react";
import { Search, MapPin, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AMAP_CITY, AMAP_KEY } from "@/config/amap";

interface Tip {
  id: string;
  name: string;
  address: string;
  /** "lng,lat" */
  location?: string;
  district?: string;
}

interface Props {
  onLocate: (tip: Tip) => void;
}

/** 高德输入提示（关键词联想）搜索框 */
export default function MapSearchBox({ onLocate }: Props) {
  const [query, setQuery] = useState("");
  const [tips, setTips] = useState<Tip[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const seqRef = useRef(0);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setTips([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const seq = ++seqRef.current;
    const timer = setTimeout(async () => {
      try {
        const url = `https://restapi.amap.com/v3/assistant/inputtips?key=${AMAP_KEY}&keywords=${encodeURIComponent(
          q
        )}&city=${encodeURIComponent(AMAP_CITY)}&citylimit=true&output=json`;
        const res = await fetch(url);
        const data = await res.json();
        if (seq !== seqRef.current) return;
        if (data.status === "1" && Array.isArray(data.tips)) {
          setTips(
            data.tips
              .filter((t: Tip) => t.location && String(t.location).includes(","))
              .slice(0, 8)
          );
          setOpen(true);
        } else {
          setTips([]);
        }
      } catch {
        if (seq === seqRef.current) setTips([]);
      } finally {
        if (seq === seqRef.current) setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const pick = (tip: Tip) => {
    onLocate(tip);
    setQuery(tip.name);
    setOpen(false);
  };

  return (
    <div ref={boxRef} className="absolute left-1/2 top-4 z-[1000] w-[340px] -translate-x-1/2">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => tips.length && setOpen(true)}
          placeholder="搜索地址 / 网点 / 商圈（深圳市内）"
          className="h-9 rounded-xl border-slate-200 bg-white/95 pl-9 pr-8 shadow-lg backdrop-blur"
        />
        {loading ? (
          <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-slate-400" />
        ) : (
          query && (
            <X
              className="absolute right-3 top-2.5 h-4 w-4 cursor-pointer text-slate-300 hover:text-slate-500"
              onClick={() => {
                setQuery("");
                setTips([]);
              }}
            />
          )
        )}
      </div>
      {open && tips.length > 0 && (
        <div className="mt-1.5 overflow-hidden rounded-xl border border-slate-200 bg-white/98 shadow-xl backdrop-blur">
          {tips.map((t, i) => (
            <button
              key={`${t.id}-${i}`}
              className="flex w-full items-start gap-2.5 px-3.5 py-2.5 text-left transition-colors hover:bg-slate-50"
              onClick={() => pick(t)}
            >
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-500" />
              <div className="min-w-0">
                <div className="truncate text-[13px] font-medium text-slate-700">{t.name}</div>
                <div className="truncate text-[11px] text-slate-400">
                  {[t.district, t.address].filter(Boolean).join(" · ") || "深圳市"}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
