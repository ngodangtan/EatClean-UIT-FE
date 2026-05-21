import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { API_BASE } from "@shared/api";

// ── Constants ─────────────────────────────────────────────────────────────────

const ACTIVITY_LEVELS = [
  { value: "sedentary", label: "Ít vận động" },
  { value: "lightly-active", label: "Vận động nhẹ" },
  { value: "moderately-active", label: "Vận động vừa" },
  { value: "very-active", label: "Vận động nhiều" },
  { value: "extremely-active", label: "Rất năng động" },
];

interface CatalogIndicator {
  key: string;
  name: string;
  unit: string;
  normalRange: string;
}

interface CatalogDisease {
  key: string;
  name: string;
  supported: boolean;
  hasStage?: boolean;
  indicators: CatalogIndicator[];
}

const DISEASE_CATALOG: CatalogDisease[] = [
  {
    key: "diabetes",
    name: "Tiểu đường",
    supported: true,
    indicators: [
      { key: "hba1c", name: "HbA1c", unit: "%", normalRange: "< 5.7%" },
      { key: "fasting_glucose", name: "Fasting Glucose", unit: "mg/dL", normalRange: "70–99 mg/dL" },
    ],
  },
  {
    key: "kidney-disease",
    name: "Bệnh thận (CKD)",
    supported: true,
    hasStage: true,
    indicators: [
      { key: "gfr", name: "GFR (eGFR)", unit: "mL/min/1.73m²", normalRange: "≥ 90" },
      { key: "creatinine", name: "Creatinine", unit: "mg/dL", normalRange: "0.6–1.2 mg/dL" },
    ],
  },
  {
    key: "high-uric-acid",
    name: "Axit Uric cao (Gout)",
    supported: true,
    indicators: [
      { key: "uric_acid", name: "Uric Acid", unit: "mg/dL", normalRange: "2.4–6.0 (F) / 3.4–7.0 (M)" },
    ],
  },
  {
    key: "hypertension",
    name: "Huyết áp cao",
    supported: true,
    indicators: [
      { key: "systolic_bp", name: "Systolic Blood Pressure", unit: "mmHg", normalRange: "< 120 mmHg" },
      { key: "diastolic_bp", name: "Diastolic Blood Pressure", unit: "mmHg", normalRange: "< 80 mmHg" },
    ],
  },
  {
    key: "fatty-liver",
    name: "Gan nhiễm mỡ",
    supported: false,
    indicators: [
      { key: "alt", name: "ALT (SGPT)", unit: "U/L", normalRange: "7–56 U/L" },
      { key: "ast", name: "AST (SGOT)", unit: "U/L", normalRange: "10–40 U/L" },
    ],
  },
  {
    key: "high-cholesterol",
    name: "Mỡ máu cao",
    supported: false,
    indicators: [
      { key: "total_cholesterol", name: "Total Cholesterol", unit: "mg/dL", normalRange: "< 200 mg/dL" },
      { key: "ldl", name: "LDL Cholesterol", unit: "mg/dL", normalRange: "< 100 mg/dL" },
      { key: "hdl", name: "HDL Cholesterol", unit: "mg/dL", normalRange: "> 60 mg/dL" },
    ],
  },
  {
    key: "heart-disease",
    name: "Bệnh tim mạch",
    supported: false,
    indicators: [
      { key: "heart_rate", name: "Resting Heart Rate", unit: "bpm", normalRange: "60–100 bpm" },
    ],
  },
  {
    key: "obesity",
    name: "Béo phì",
    supported: false,
    indicators: [
      { key: "bmi", name: "BMI", unit: "kg/m²", normalRange: "18.5–24.9" },
      { key: "waist_circumference", name: "Waist Circumference", unit: "cm", normalRange: "< 88 cm (F) / < 102 cm (M)" },
    ],
  },
  {
    key: "anemia",
    name: "Thiếu máu",
    supported: false,
    indicators: [
      { key: "hemoglobin", name: "Hemoglobin", unit: "g/dL", normalRange: "12–17.5 g/dL" },
      { key: "ferritin", name: "Ferritin", unit: "ng/mL", normalRange: "12–300 ng/mL" },
    ],
  },
  {
    key: "gastritis",
    name: "Đau dạ dày",
    supported: false,
    indicators: [],
  },
  {
    key: "insomnia",
    name: "Mất ngủ",
    supported: false,
    indicators: [
      { key: "sleep_hours", name: "Avg Sleep Hours", unit: "h/night", normalRange: "7–9 hours" },
    ],
  },
];

const CUISINE_OPTIONS = [
  { value: "vietnamese", label: "Việt Nam" },
  { value: "asian", label: "Châu Á" },
  { value: "western", label: "Đồ Âu" },
  { value: "mediterranean", label: "Địa Trung Hải" },
];

const DIET_PREFERENCES = [
  { value: "balanced", label: "Cân bằng" },
  { value: "vegetarian", label: "Ăn chay" },
  { value: "vegan", label: "Thuần chay" },
  { value: "high-protein", label: "Giàu Protein" },
  { value: "low-carb", label: "Ít Carb" },
  { value: "low-fat", label: "Ít Béo" },
];

// ── Types ──────────────────────────────────────────────────────────────────────

interface IndicatorEntry {
  key: string;
  value: string;       // string during editing; converted to number on submit
  unit?: string;
  measuredAt?: string; // ISO date string
  note?: string;
}

interface DiseaseEntry {
  key: string;
  diagnosedAt?: string;
  stage?: number;
  indicators: IndicatorEntry[];
}

interface HealthProfileData {
  activityLevel: string;
  sleepDuration: number;
  diseases: DiseaseEntry[];
  dietPreference: string;
  mealsPerDay: number;
  cuisinePreference: string[];
  currentWeight?: number;
  height?: number;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

const defaultForm: HealthProfileData = {
  activityLevel: "sedentary",
  sleepDuration: 7,
  diseases: [],
  dietPreference: "balanced",
  mealsPerDay: 3,
  cuisinePreference: [],
  currentWeight: undefined,
  height: undefined,
};

function activityLabel(value: string) {
  return ACTIVITY_LEVELS.find((a) => a.value === value)?.label ?? value;
}

function toIsoDate(dateStr: string) {
  if (!dateStr) return undefined;
  return new Date(dateStr).toISOString();
}

function toInputDate(isoStr?: string) {
  if (!isoStr) return "";
  return isoStr.substring(0, 10); // YYYY-MM-DD
}

function buildDiseaseEntry(catalogKey: string, existing?: DiseaseEntry): DiseaseEntry {
  const catalog = DISEASE_CATALOG.find((d) => d.key === catalogKey);
  const indicators: IndicatorEntry[] = (catalog?.indicators ?? []).map((ci) => {
    const existingInd = (existing?.indicators || []).find((i) => i.key === ci.key);
    return {
      key: ci.key,
      value: existingInd ? String(existingInd.value) : "",
      unit: ci.unit,
      measuredAt: existingInd?.measuredAt,
    };
  });
  return {
    key: catalogKey,
    diagnosedAt: existing?.diagnosedAt,
    stage: existing?.stage,
    indicators,
  };
}

function serializeForApi(form: HealthProfileData) {
  return {
    ...form,
    diseases: form.diseases.map((d) => ({
      key: d.key,
      diagnosedAt: d.diagnosedAt,
      stage: d.stage,
      indicators: d.indicators
        .filter((i) => i.value !== "" && !isNaN(Number(i.value)))
        .map((i) => ({
          key: i.key,
          value: Number(i.value),
          unit: i.unit,
          measuredAt: i.measuredAt,
          note: i.note,
        })),
    })),
  };
}

function normalizeFromApi(data: Record<string, unknown>): HealthProfileData {
  const rawDiseases = Array.isArray(data.diseases) ? data.diseases as Record<string, unknown>[] : [];
  return {
    activityLevel: (data.activityLevel as string) ?? "sedentary",
    sleepDuration: (data.sleepDuration as number) ?? 7,
    diseases: rawDiseases.map((d) => {
      const rawInds = Array.isArray(d.indicators) ? d.indicators as Record<string, unknown>[] : [];
      return {
        key: d.key as string,
        diagnosedAt: d.diagnosedAt as string | undefined,
        stage: d.stage as number | undefined,
        indicators: rawInds.map((i) => ({
          key: i.key as string,
          value: String(i.value ?? ""),
          unit: i.unit as string | undefined,
          measuredAt: i.measuredAt as string | undefined,
          note: i.note as string | undefined,
        })),
      };
    }),
    dietPreference: (data.dietPreference as string) ?? "balanced",
    mealsPerDay: (data.mealsPerDay as number) ?? 3,
    cuisinePreference: Array.isArray(data.cuisinePreference) ? data.cuisinePreference as string[] : [],
    height: data.height as number | undefined,
    currentWeight: data.currentWeight as number | undefined,
  };
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function DiseaseDetailCard({
  entry,
  onChange,
}: {
  entry: DiseaseEntry;
  onChange: (updated: DiseaseEntry) => void;
}) {
  const catalog = DISEASE_CATALOG.find((d) => d.key === entry.key);
  // Guard: skip unknown disease keys (e.g. stale data from a previous schema)
  if (!catalog) return null;

  // Upsert an indicator value into entry.indicators
  function updateIndicator(key: string, field: keyof IndicatorEntry, value: string) {
    const exists = entry.indicators.some((i) => i.key === key);
    if (exists) {
      onChange({
        ...entry,
        indicators: entry.indicators.map((i) =>
          i.key === key ? { ...i, [field]: value } : i
        ),
      });
    } else {
      // Create slot on first edit so value is tracked
      const ci = catalog.indicators.find((c) => c.key === key);
      onChange({
        ...entry,
        indicators: [
          ...entry.indicators,
          { key, value: "", unit: ci?.unit, [field]: value },
        ],
      });
    }
  }

  return (
    <div className="bg-white rounded-[22px] border-2 border-[#6F3AFA]/30 p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="w-3 h-3 rounded-full bg-gradient-to-r from-[#2596BE] to-[#6F3AFA] flex-shrink-0" />
        <h3 className="text-lg sm:text-xl font-bold text-[#0D141C] font-inter">
          {catalog.name}
        </h3>
        {catalog.supported && (
          <span className="ml-auto text-xs px-2 py-1 rounded-full bg-green-50 text-green-600 font-inter border border-green-200">
            Hỗ trợ Macro
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Date Diagnosed */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1.5 font-inter">
            Ngày chẩn đoán
          </label>
          <input
            type="date"
            value={toInputDate(entry.diagnosedAt)}
            onChange={(e) =>
              onChange({ ...entry, diagnosedAt: toIsoDate(e.target.value) })
            }
            className="w-full h-12 bg-[#F3F3FD] rounded-xl border border-gray-200 px-4 text-base text-gray-700 font-inter outline-none focus:border-[#2596BE] focus:ring-2 focus:ring-[#2596BE]/20 transition-all"
          />
        </div>

        {/* Stage — kidney-disease only */}
        {catalog.hasStage && (
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5 font-inter">
              Giai đoạn bệnh (1–5)
            </label>
            <select
              value={entry.stage ?? ""}
              onChange={(e) =>
                onChange({
                  ...entry,
                  stage: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              className="w-full h-12 bg-[#F3F3FD] rounded-xl border border-gray-200 px-4 text-base text-gray-700 font-inter outline-none focus:border-[#2596BE] focus:ring-2 focus:ring-[#2596BE]/20 transition-all"
            >
              <option value="">Chưa xác định</option>
              {[1, 2, 3, 4, 5].map((s) => (
                <option key={s} value={s}>
                  Giai đoạn {s}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-amber-600 font-inter">
              Giai đoạn 4+ có thể hạn chế AI tạo thực đơn.
            </p>
          </div>
        )}
      </div>

      {/* Indicators — always iterate catalog so all fields show, even on first edit */}
      {catalog.indicators.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-3 font-inter">
            Chỉ số xét nghiệm <span className="font-normal text-gray-400">(tùy chọn — giúp cá nhân hóa thực đơn)</span>
          </p>
          <div className="space-y-4">
            {catalog.indicators.map((ci) => {
              const ind = entry.indicators.find((i) => i.key === ci.key);
              return (
                <div key={ci.key} className="bg-[#F3F3FD] rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#0D141C] font-inter">
                      {ci.name}
                    </span>
                    <span className="text-xs text-gray-400 font-inter">
                      Bình thường: {ci.normalRange}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1 font-inter">
                        Giá trị ({ci.unit})
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="any"
                          placeholder="VD: 6.8"
                          value={ind?.value ?? ""}
                          onChange={(e) => updateIndicator(ci.key, "value", e.target.value)}
                          className="w-full h-10 bg-white rounded-lg border border-gray-200 px-3 pr-12 text-sm text-gray-700 font-inter outline-none focus:border-[#2596BE] focus:ring-2 focus:ring-[#2596BE]/20 transition-all"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-inter pointer-events-none">
                          {ci.unit}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1 font-inter">
                        Ngày đo
                      </label>
                      <input
                        type="date"
                        value={toInputDate(ind?.measuredAt)}
                        onChange={(e) =>
                          updateIndicator(ci.key, "measuredAt", toIsoDate(e.target.value) ?? "")
                        }
                        className="w-full h-10 bg-white rounded-lg border border-gray-200 px-3 text-sm text-gray-700 font-inter outline-none focus:border-[#2596BE] focus:ring-2 focus:ring-[#2596BE]/20 transition-all"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function HealthProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<HealthProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<HealthProfileData>(defaultForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
    fetchProfile(token);
  }, [navigate]);

  async function fetchProfile(token: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/health-profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 404) {
        setProfile(null);
        setIsEditing(true);
        // Lấy thông tin user để tự động điền height, weight từ lúc đăng ký
        try {
          const authRes = await fetch(`${API_BASE}/api/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (authRes.ok) {
            const authData = await authRes.json();
            setForm((prev) => ({
              ...prev,
              height: authData.height,
              currentWeight: authData.currentWeight,
            }));
          }
        } catch (e) {
          // Bỏ qua lỗi nếu không lấy được
        }
      } else if (res.ok) {
        const data = await res.json();
        const normalized = normalizeFromApi(data);
        setProfile(normalized);
        setForm(normalized);
        setIsEditing(false);
      } else if (res.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setError("Không thể tải hồ sơ sức khỏe.");
      }
    } catch {
      setError("Lỗi kết nối mạng. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }

    try {
      const payload = serializeForApi(form);
      const res = await fetch(`${API_BASE}/api/health-profile`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        const saved = data.profile ?? data;
        const normalized = normalizeFromApi(saved);
        setProfile(normalized);
        setForm(normalized);
        setIsEditing(false);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const data = await res.json().catch(() => ({})) as { message?: string };
        setError(data.message ?? "Không thể lưu hồ sơ sức khỏe.");
      }
    } catch {
      setError("Lỗi kết nối mạng. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  }

  function toggleDisease(key: string) {
    setForm((prev) => {
      const existing = prev.diseases.find((d) => d.key === key);
      if (existing) {
        return { ...prev, diseases: prev.diseases.filter((d) => d.key !== key) };
      }
      return {
        ...prev,
        diseases: [...prev.diseases, buildDiseaseEntry(key)],
      };
    });
  }

  function updateDisease(updated: DiseaseEntry) {
    setForm((prev) => ({
      ...prev,
      diseases: prev.diseases.map((d) => (d.key === updated.key ? updated : d)),
    }));
  }

  function toggleCuisine(value: string) {
    setForm((prev) => {
      const exists = prev.cuisinePreference.includes(value);
      if (exists) return { ...prev, cuisinePreference: prev.cuisinePreference.filter((c) => c !== value) };
      if (prev.cuisinePreference.length >= 10) return prev;
      return { ...prev, cuisinePreference: [...prev.cuisinePreference, value] };
    });
  }

  function handleEditCancel() {
    if (profile) { setForm(profile); setIsEditing(false); }
    setError(null);
  }

  // ── Styles ──
  const inputClass =
    "w-full h-16 sm:h-20 lg:h-[77px] bg-[#F3F3FD] rounded-[29px] border border-gray-200 flex items-center px-6 sm:px-8 text-base sm:text-lg lg:text-2xl text-gray-700 font-inter outline-none focus:border-[#2596BE] focus:ring-2 focus:ring-[#2596BE]/20 transition-all";
  const labelClass =
    "block text-lg sm:text-xl lg:text-[25px] font-medium text-[#0D141C] mb-2 sm:mb-3 font-inter";
  const sectionClass =
    "text-2xl sm:text-3xl lg:text-[35px] font-bold text-[#0D141C] mb-6 sm:mb-8 font-inter";

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <Header />

      <main className="flex-grow px-4 sm:px-8 lg:px-16 xl:px-32 py-8 sm:py-12 lg:py-16 mt-16 sm:mt-20 lg:mt-24">
        <div className="max-w-[1728px] mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="mb-8 sm:mb-12 flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Go back"
          >
            <svg className="w-10 h-10" viewBox="0 0 41 41" fill="none">
              <path d="M31.8531 20.0775L8.52079 20.2968M8.52079 20.2968L20.2966 31.8533M8.52079 20.2968L20.0773 8.52098" stroke="#1E1E1E" strokeWidth="3.33333" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="flex items-center justify-between mb-8 sm:mb-12 lg:mb-16 max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl lg:text-[45px] font-bold text-[#0D141C] font-inter">
              Hồ sơ sức khoẻ
            </h1>
            {profile && !isEditing && (
              <button
                onClick={() => {
                  // Re-hydrate diseases: merge saved values with full catalog indicator list,
                  // and drop any disease keys that no longer exist in the catalog.
                  const rehydrated = profile.diseases
                    .filter((d) => DISEASE_CATALOG.some((c) => c.key === d.key))
                    .map((d) => buildDiseaseEntry(d.key, d));
                  setForm({ ...profile, diseases: rehydrated });
                  setIsEditing(true);
                }}
                className="px-6 py-2 sm:px-8 sm:py-3 rounded-xl bg-gradient-to-r from-[#2596BE] to-[#6F3AFA] text-white text-base sm:text-lg font-bold font-satoshi hover:shadow-lg transition-all hover:scale-105"
              >
                Chỉnh sửa
              </button>
            )}
          </div>

          {success && (
            <div className="max-w-3xl mx-auto mb-6 px-6 py-4 bg-green-50 border border-green-200 rounded-2xl">
              <p className="text-green-700 font-inter text-base sm:text-lg">
                Đã lưu hồ sơ sức khỏe thành công!
              </p>
            </div>
          )}

          {error && (
            <div className="max-w-3xl mx-auto mb-6 px-6 py-4 bg-red-50 border border-red-200 rounded-2xl">
              <p className="text-red-600 font-inter text-base sm:text-lg">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="max-w-3xl mx-auto space-y-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-4">
                  <div className="w-48 h-8 bg-gray-200 rounded-lg animate-pulse" />
                  <div className="w-full h-20 bg-gray-200 rounded-[29px] animate-pulse" />
                </div>
              ))}
            </div>

          ) : isEditing ? (
            /* ══ EDIT FORM ══ */
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-10 sm:space-y-12">

              {/* Activity & Lifestyle */}
              <div>
                <h2 className={sectionClass}>Hoạt động & Lối sống</h2>
                <div className="space-y-6 sm:space-y-8">
                  <div>
                    <label className={labelClass}>Mức độ vận động</label>
                    <select
                      value={form.activityLevel}
                      onChange={(e) => setForm((p) => ({ ...p, activityLevel: e.target.value }))}
                      className={inputClass}
                    >
                      {ACTIVITY_LEVELS.map((a) => (
                        <option key={a.value} value={a.value}>{a.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>Thời gian ngủ (giờ/đêm)</label>
                    <input
                      type="number" min={0} max={24} step={0.5}
                      value={form.sleepDuration}
                      onChange={(e) => setForm((p) => ({ ...p, sleepDuration: Number(e.target.value) }))}
                      className={inputClass}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                    <div>
                      <label className={labelClass}>Chiều cao hiện tại (cm)</label>
                      <input
                        type="number" min={50} max={300}
                        value={form.height ?? ""}
                        onChange={(e) => setForm((p) => ({ ...p, height: e.target.value ? Number(e.target.value) : undefined }))}
                        className={inputClass}
                        placeholder="VD: 170"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Cân nặng hiện tại (kg)</label>
                      <input
                        type="number" min={20} max={500} step="0.1"
                        value={form.currentWeight ?? ""}
                        onChange={(e) => setForm((p) => ({ ...p, currentWeight: e.target.value ? Number(e.target.value) : undefined }))}
                        className={inputClass}
                        placeholder="VD: 65.5"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Diet Preferences */}
              <div>
                <h2 className={sectionClass}>Chế độ ăn & Ẩm thực</h2>
                <div className="space-y-6 sm:space-y-8">
                  <div>
                    <label className={labelClass}>Chế độ ăn ưu tiên</label>
                    <select
                      value={form.dietPreference}
                      onChange={(e) => setForm((p) => ({ ...p, dietPreference: e.target.value }))}
                      className={inputClass}
                    >
                      {DIET_PREFERENCES.map((d) => (
                        <option key={d.value} value={d.value}>{d.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>Số bữa mỗi ngày</label>
                    <input
                      type="number" min={1} max={6}
                      value={form.mealsPerDay}
                      onChange={(e) => setForm((p) => ({ ...p, mealsPerDay: Number(e.target.value) }))}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Ẩm thực ưa thích</label>
                    <div className="flex flex-wrap gap-3 mt-2">
                      {CUISINE_OPTIONS.map((c) => {
                        const selected = form.cuisinePreference.includes(c.value);
                        return (
                          <button
                            key={c.value} type="button" onClick={() => toggleCuisine(c.value)}
                            className={`px-5 py-3 rounded-2xl border-2 text-base sm:text-lg font-inter font-medium transition-all ${selected
                              ? "border-[#2596BE] bg-[#2596BE]/10 text-[#2596BE]"
                              : "border-gray-200 bg-[#F3F3FD] text-gray-600 hover:border-gray-300"
                              }`}
                          >
                            {c.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Health Conditions */}
              <div>
                <h2 className={sectionClass}>Tình trạng sức khỏe</h2>
                <p className="text-gray-500 font-inter text-base mb-6 -mt-4">
                  Chọn các tình trạng bệnh bạn đã được chẩn đoán, sau đó điền các chỉ số xét nghiệm (nếu có).
                </p>

                {/* Disease selector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {DISEASE_CATALOG.map((d) => {
                    const selected = form.diseases.some((e) => e.key === d.key);
                    return (
                      <button
                        key={d.key} type="button" onClick={() => toggleDisease(d.key)}
                        className={`flex items-center gap-3 px-5 py-4 rounded-2xl border-2 text-left text-base sm:text-lg font-inter font-medium transition-all ${selected
                          ? "border-[#6F3AFA] bg-[#6F3AFA]/10 text-[#6F3AFA]"
                          : "border-gray-200 bg-[#F3F3FD] text-gray-600 hover:border-gray-300"
                          }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center ${selected ? "border-[#6F3AFA] bg-[#6F3AFA]" : "border-gray-300"
                            }`}
                        >
                          {selected && (
                            <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                              <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </span>
                        <span className="flex-1">{d.name}</span>
                        {d.supported && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-600 border border-green-200 font-inter flex-shrink-0">
                            Đang chọn
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Detail cards for selected diseases */}
                {form.diseases.length > 0 && (
                  <div className="space-y-4">
                    <p className="text-sm font-semibold text-gray-500 font-inter uppercase tracking-wide">
                      Chi tiết bệnh lý
                    </p>
                    {form.diseases.map((entry) => (
                      <DiseaseDetailCard
                        key={entry.key}
                        entry={entry}
                        onChange={updateDisease}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4 pb-8">
                <button
                  type="submit" disabled={saving}
                  className="flex-1 h-16 sm:h-[77px] rounded-[29px] bg-gradient-to-r from-[#2596BE] to-[#6F3AFA] text-white text-xl sm:text-2xl font-bold font-satoshi hover:shadow-lg transition-all hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {saving ? "Đang lưu..." : "Lưu hồ sơ"}
                </button>
                {profile && (
                  <button
                    type="button" onClick={handleEditCancel}
                    className="px-8 h-16 sm:h-[77px] rounded-[29px] border-2 border-gray-300 text-gray-600 text-xl sm:text-2xl font-bold font-inter hover:bg-gray-50 transition-colors"
                  >
                    Hủy
                  </button>
                )}
              </div>
            </form>

          ) : profile ? (
            /* ══ VIEW MODE ══ */
            <div className="max-w-3xl mx-auto space-y-10 sm:space-y-12">

              {/* Activity & Lifestyle */}
              <div>
                <h2 className={sectionClass}>Hoạt động & Lối sống</h2>
                <div className="space-y-6 sm:space-y-8">
                  <div>
                    <label className={labelClass}>Mức độ vận động</label>
                    <div className="w-full min-h-[77px] bg-[#F3F3FD] rounded-[29px] border border-gray-200 flex items-center px-6 sm:px-8">
                      <p className="text-base sm:text-lg lg:text-2xl text-gray-700 font-inter">
                        {activityLabel(profile.activityLevel)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Thời gian ngủ</label>
                    <div className="w-full h-16 sm:h-20 lg:h-[77px] bg-[#F3F3FD] rounded-[29px] border border-gray-200 flex items-center px-6 sm:px-8">
                      <p className="text-base sm:text-lg lg:text-2xl text-gray-700 font-inter">
                        {profile.sleepDuration} giờ/đêm
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                    <div>
                      <label className={labelClass}>Chiều cao hiện tại</label>
                      <div className="w-full h-16 sm:h-20 lg:h-[77px] bg-[#F3F3FD] rounded-[29px] border border-gray-200 flex items-center px-6 sm:px-8">
                        <p className="text-base sm:text-lg lg:text-2xl text-gray-700 font-inter">
                          {profile.height ? `${profile.height} cm` : "Chưa cập nhật"}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Cân nặng hiện tại</label>
                      <div className="w-full h-16 sm:h-20 lg:h-[77px] bg-[#F3F3FD] rounded-[29px] border border-gray-200 flex items-center px-6 sm:px-8">
                        <p className="text-base sm:text-lg lg:text-2xl text-gray-700 font-inter">
                          {profile.currentWeight ? `${profile.currentWeight} kg` : "Chưa cập nhật"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Diet Preferences */}
              <div>
                <h2 className={sectionClass}>Chế độ ăn & Ẩm thực</h2>
                <div className="space-y-6 sm:space-y-8">
                  <div>
                    <label className={labelClass}>Chế độ ăn ưu tiên</label>
                    <div className="w-full h-16 sm:h-20 lg:h-[77px] bg-[#F3F3FD] rounded-[29px] border border-gray-200 flex items-center px-6 sm:px-8">
                      <p className="text-base sm:text-lg lg:text-2xl text-gray-700 font-inter">
                        {DIET_PREFERENCES.find(d => d.value === profile.dietPreference)?.label || profile.dietPreference}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Số bữa mỗi ngày</label>
                    <div className="w-full h-16 sm:h-20 lg:h-[77px] bg-[#F3F3FD] rounded-[29px] border border-gray-200 flex items-center px-6 sm:px-8">
                      <p className="text-base sm:text-lg lg:text-2xl text-gray-700 font-inter">
                        {profile.mealsPerDay} bữa
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Ẩm thực ưa thích</label>
                    <div className="flex flex-wrap gap-3 mt-2">
                      {profile.cuisinePreference.length === 0 ? (
                        <p className="text-gray-400 font-inter text-base sm:text-lg italic">Chưa chọn ẩm thực nào</p>
                      ) : (
                        profile.cuisinePreference.map((c) => {
                          const opt = CUISINE_OPTIONS.find((o) => o.value === c);
                          return (
                            <span key={c} className="px-5 py-3 rounded-2xl bg-[#2596BE]/10 border-2 border-[#2596BE] text-[#2596BE] text-base sm:text-lg font-inter font-medium">
                              {opt?.label ?? c}
                            </span>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Health Conditions */}
              <div>
                <h2 className={sectionClass}>Tình trạng sức khỏe</h2>
                {profile.diseases.length === 0 ? (
                  <p className="text-gray-400 font-inter text-base sm:text-lg italic">
                    Chưa có dữ liệu bệnh lý
                  </p>
                ) : (
                  <div className="space-y-4">
                    {profile.diseases.map((d) => {
                      const catalog = DISEASE_CATALOG.find((c) => c.key === d.key);
                      return (
                        <div key={d.key} className="bg-white rounded-[22px] border-2 border-[#6F3AFA]/20 p-6 space-y-4">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="w-3 h-3 rounded-full bg-gradient-to-r from-[#2596BE] to-[#6F3AFA]" />
                            <span className="text-lg sm:text-xl font-bold text-[#0D141C] font-inter">
                              {catalog?.name ?? d.key}
                            </span>
                            {catalog?.supported && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-200 font-inter">
                                Hỗ trợ Macro
                              </span>
                            )}
                            {d.diagnosedAt && (
                              <span className="ml-auto text-sm text-gray-400 font-inter">
                                Chẩn đoán: {new Date(d.diagnosedAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>

                          {catalog?.hasStage && d.stage && (
                            <p className="text-sm text-gray-600 font-inter">
                              Giai đoạn bệnh: <span className="font-semibold">{d.stage}</span>
                            </p>
                          )}

                          {d.indicators.filter((i) => i.value !== "").length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {d.indicators
                                .filter((i) => i.value !== "")
                                .map((ind) => {
                                  const ci = catalog?.indicators.find((c) => c.key === ind.key);
                                  return (
                                    <div key={ind.key} className="bg-[#F3F3FD] rounded-xl px-4 py-3">
                                      <p className="text-xs text-gray-400 font-inter mb-1">
                                        {ci?.name ?? ind.key}
                                      </p>
                                      <p className="text-base font-semibold text-[#0D141C] font-inter">
                                        {ind.value} {ind.unit ?? ci?.unit}
                                      </p>
                                      {ind.measuredAt && (
                                        <p className="text-xs text-gray-400 font-inter mt-0.5">
                                          {new Date(ind.measuredAt).toLocaleDateString()}
                                        </p>
                                      )}
                                    </div>
                                  );
                                })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="pb-8" />
            </div>
          ) : null}
        </div>
      </main>

      <Footer />
    </div>
  );
}
