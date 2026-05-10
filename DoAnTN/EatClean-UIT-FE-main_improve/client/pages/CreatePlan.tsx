import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Weight, BriefcaseMedical, Sun, CheckCircle2, Circle } from "lucide-react";

type Purpose = "daily_health_based" | "weight_management" | "disease_based";
type WeightGoal = "lose-weight" | "gain-weight" | "muscle-gain";
type DurationWeeks = 1 | 2 | 4;

const PURPOSES = [
  {
    id: "weight_management" as Purpose,
    title: "Quản lý cân nặng",
    subtitle: "Giảm cân, tăng cân hoặc tăng cơ",
    Icon: Weight,
  },
  {
    id: "disease_based" as Purpose,
    title: "Kiểm soát bệnh lý",
    subtitle: "Tập trung hỗ trợ các bệnh lý đã chẩn đoán",
    Icon: BriefcaseMedical,
  },
  {
    id: "daily_health_based" as Purpose,
    title: "Thực đơn 1 ngày",
    subtitle: "Dựa trên hoạt động hôm nay",
    Icon: Sun,
  },
];

const WEIGHT_GOALS = [
  { id: "lose-weight" as WeightGoal, label: "Giảm cân" },
  { id: "gain-weight" as WeightGoal, label: "Tăng cân" },
  { id: "muscle-gain" as WeightGoal, label: "Tăng cơ" },
];

const DURATION_OPTIONS: { weeks: DurationWeeks; label: string }[] = [
  { weeks: 1, label: "1 tuần" },
  { weeks: 2, label: "2 tuần" },
  { weeks: 4, label: "4 tuần" },
];

export default function CreatePlan() {
  const navigate = useNavigate();
  const [purpose, setPurpose] = useState<Purpose | null>("weight_management");

  // weight_management fields
  const [weightGoal, setWeightGoal] = useState<WeightGoal | null>("lose-weight");
  const [desiredWeight, setDesiredWeight] = useState("65");
  const [durationWeeks, setDurationWeeks] = useState<DurationWeeks | null>(2);

  // disease_based fields
  const [diseaseDuration, setDiseaseDuration] = useState<DurationWeeks | null>(null);

  function submitPlan() {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    let requestBody: Record<string, unknown> = { purpose };

    if (purpose === "weight_management") {
      requestBody = {
        purpose,
        weightGoal,
        desiredWeight: parseFloat(desiredWeight),
        durationWeeks,
      };
    } else if (purpose === "disease_based") {
      requestBody = { purpose, durationWeeks: diseaseDuration };
    }

    localStorage.setItem("mealPlanRequest", JSON.stringify(requestBody));
    navigate("/analyzing");
  }

  const isValid =
    purpose === "weight_management"
      ? weightGoal && desiredWeight && parseFloat(desiredWeight) > 0 && durationWeeks
      : purpose === "disease_based"
        ? diseaseDuration !== null
        : purpose === "daily_health_based";

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-[120px] sm:pt-[160px] lg:pt-[220px] pb-16">
        <div className="mb-8">
          <h1 className="text-[32px] font-bold text-gray-900 mb-2">
            Xây dựng thực đơn
          </h1>
          <p className="text-gray-500 text-base">
            Chọn mục đích — chúng tôi sẽ dùng hồ sơ sức khỏe đã lưu cho phần còn lại.
          </p>
        </div>

        {/* Purpose Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {PURPOSES.map((p) => {
            const isSelected = purpose === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setPurpose(p.id)}
                className={`relative flex flex-col items-start p-6 rounded-2xl text-left transition-all duration-200 border-2 ${isSelected
                  ? "bg-white border-[#2596BE]"
                  : "bg-[#F3F4F6] border-transparent hover:bg-gray-200"
                  }`}
              >
                <div className="absolute top-4 right-4">
                  {isSelected ? (
                    <CheckCircle2 className="w-6 h-6 text-[#2596BE] fill-[#2596BE] text-white/90 stroke-white" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-300" />
                  )}
                </div>

                <div
                  className={`p-3 rounded-xl mb-4 ${isSelected ? "bg-blue-50" : "bg-white"
                    }`}
                >
                  <p.Icon
                    className={`w-6 h-6 ${isSelected ? "text-[#2596BE]" : "text-gray-400"
                      }`}
                  />
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {p.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {p.subtitle}
                </p>
              </button>
            );
          })}
        </div>

        {/* Sub-options based on selection */}
        {purpose === "weight_management" && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col md:flex-row gap-10 md:gap-20">
                {/* Mục tiêu */}
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-gray-900 mb-4">Mục tiêu</h4>
                  <div className="flex flex-wrap gap-3">
                    {WEIGHT_GOALS.map((g) => {
                      const isSelected = weightGoal === g.id;
                      return (
                        <button
                          key={g.id}
                          onClick={() => setWeightGoal(g.id)}
                          className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${isSelected
                            ? "bg-[#2596BE] text-white"
                            : "bg-[#F3F4F6] text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                          {g.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Cân nặng mục tiêu */}
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-gray-900 mb-4">Cân nặng mục tiêu</h4>
                  <div className="relative max-w-[240px]">
                    <input
                      type="number"
                      min={20}
                      max={500}
                      value={desiredWeight}
                      onChange={(e) => setDesiredWeight(e.target.value)}
                      className="w-full bg-[#FAFAFA] border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#2596BE] focus:border-transparent transition-all pr-12"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium pointer-events-none">
                      kg
                    </span>
                  </div>
                </div>
              </div>

              {/* Thời lượng */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-4">Thời lượng</h4>
                <div className="flex flex-wrap gap-3">
                  {DURATION_OPTIONS.map((d) => {
                    const isSelected = durationWeeks === d.weeks;
                    return (
                      <button
                        key={d.weeks}
                        onClick={() => setDurationWeeks(d.weeks)}
                        className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-colors w-[100px] ${isSelected
                          ? "bg-[#2596BE] text-white"
                          : "bg-[#F3F4F6] text-gray-600 hover:bg-gray-200"
                          }`}
                      >
                        {d.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {purpose === "disease_based" && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8">
            <h4 className="text-sm font-bold text-gray-900 mb-4">Thời lượng</h4>
            <div className="flex flex-wrap gap-3 mb-6">
              {DURATION_OPTIONS.map((d) => {
                const isSelected = diseaseDuration === d.weeks;
                return (
                  <button
                    key={d.weeks}
                    onClick={() => setDiseaseDuration(d.weeks)}
                    className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${isSelected
                      ? "bg-[#2596BE] text-white"
                      : "bg-[#F3F4F6] text-gray-600 hover:bg-gray-200"
                      }`}
                  >
                    {d.label}
                  </button>
                );
              })}
            </div>
            <p className="text-sm text-gray-500">
              Thực đơn sẽ được tối ưu hóa dựa trên các bệnh lý đã lưu trong hồ sơ sức khỏe của bạn.
            </p>
          </div>
        )}

        {purpose === "daily_health_based" && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8">
            <p className="text-sm text-gray-500">
              Thực đơn 1 ngày sẽ được tính toán dựa trên mức độ hoạt động hôm nay và các chỉ số sức khỏe của bạn.
            </p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            onClick={submitPlan}
            disabled={!isValid}
            className={`px-8 py-3.5 rounded-xl font-bold text-base transition-all ${isValid
              ? "bg-gradient-to-r from-[#2596BE] to-[#6F3AFA] text-white hover:shadow-lg hover:scale-[1.02]"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
          >
            Tạo thực đơn
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
