import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ChevronLeft, Weight, BriefcaseMedical, Sun, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CreatePlan() {
  const navigate = useNavigate();
  const [purpose, setPurpose] = useState<"weight" | "disease" | "oneday">("weight");
  const [goal, setGoal] = useState<"lose" | "gain" | "muscle">("lose");
  const [targetWeight, setTargetWeight] = useState("65");
  const [duration, setDuration] = useState<"1" | "2" | "4">("2");

  const handleCreate = () => {
    const healthProfileData = {
      purpose,
      ...(purpose === "weight" ? { goal, desiredWeight: parseFloat(targetWeight) } : {}),
      duration: parseInt(duration),
    };

    localStorage.setItem("healthProfileData", JSON.stringify(healthProfileData));
    navigate("/analyzing");
  };

  return (
    <div className="min-h-screen bg-[#FDFDFE] relative overflow-hidden flex flex-col font-sans">
      <Header />
      <main className="flex-1 pt-40 sm:pt-48 lg:pt-56 pb-12 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Top Bar matching mobile style */}
          <div className="flex items-center mb-10 relative">
            <button onClick={() => navigate(-1)} className="absolute left-0 p-3 rounded-full bg-white shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors">
              <ChevronLeft className="w-6 h-6 text-black" />
            </button>
            <h1 className="text-2xl font-bold text-center w-full">Tạo thực đơn</h1>
          </div>

          <div className="space-y-8">
            <div className="text-center md:text-left">
              <h2 className="text-[22px] font-bold text-black mb-3">Xây dựng thực đơn</h2>
              <p className="text-gray-500 text-[17px]">
                Chọn mục đích — chúng tôi sẽ dùng hồ sơ sức khỏe đã lưu cho phần còn lại.
              </p>
            </div>

            {/* Purpose Selection (Grid on web) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
              {/* Option 1: Quản lý cân nặng */}
              <button
                onClick={() => setPurpose("weight")}
                className={cn(
                  "w-full flex flex-col items-start p-6 lg:p-8 rounded-[24px] border-2 transition-all text-left group",
                  purpose === "weight"
                    ? "border-[#139B4B] bg-[#F1FAF4]"
                    : "border-transparent bg-[#F7F7F9] hover:bg-gray-50 hover:border-gray-200"
                )}
              >
                <div className="flex w-full justify-between items-start mb-6">
                  <div className={cn("p-3 rounded-2xl transition-colors", purpose === "weight" ? "bg-[#139B4B]/10 text-[#139B4B]" : "bg-white text-gray-400 shadow-sm group-hover:text-gray-600")}>
                    <Weight className="w-8 h-8" strokeWidth={2} />
                  </div>
                  <div className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                    purpose === "weight" ? "border-[#139B4B] bg-[#139B4B]" : "border-gray-300 bg-white"
                  )}>
                    {purpose === "weight" && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-[19px] text-black mb-2">Quản lý cân nặng</h3>
                  <p className="text-gray-500 text-[15px] leading-relaxed">Giảm cân, tăng cân hoặc tăng cơ</p>
                </div>
              </button>

              {/* Option 2: Kiểm soát bệnh lý */}
              <button
                onClick={() => setPurpose("disease")}
                className={cn(
                  "w-full flex flex-col items-start p-6 lg:p-8 rounded-[24px] border-2 transition-all text-left group",
                  purpose === "disease"
                    ? "border-[#139B4B] bg-[#F1FAF4]"
                    : "border-transparent bg-[#F7F7F9] hover:bg-gray-50 hover:border-gray-200"
                )}
              >
                <div className="flex w-full justify-between items-start mb-6">
                  <div className={cn("p-3 rounded-2xl transition-colors", purpose === "disease" ? "bg-[#139B4B]/10 text-[#139B4B]" : "bg-white text-gray-400 shadow-sm group-hover:text-gray-600")}>
                    <BriefcaseMedical className="w-8 h-8" strokeWidth={2} />
                  </div>
                  <div className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                    purpose === "disease" ? "border-[#139B4B] bg-[#139B4B]" : "border-gray-300 bg-white"
                  )}>
                    {purpose === "disease" && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-[19px] text-black mb-2">Kiểm soát bệnh lý</h3>
                  <p className="text-gray-500 text-[15px] leading-relaxed">Tập trung hỗ trợ các bệnh lý đã chẩn đoán</p>
                </div>
              </button>

              {/* Option 3: Thực đơn 1 ngày */}
              <button
                onClick={() => setPurpose("oneday")}
                className={cn(
                  "w-full flex flex-col items-start p-6 lg:p-8 rounded-[24px] border-2 transition-all text-left group",
                  purpose === "oneday"
                    ? "border-[#139B4B] bg-[#F1FAF4]"
                    : "border-transparent bg-[#F7F7F9] hover:bg-gray-50 hover:border-gray-200"
                )}
              >
                <div className="flex w-full justify-between items-start mb-6">
                  <div className={cn("p-3 rounded-2xl transition-colors", purpose === "oneday" ? "bg-[#139B4B]/10 text-[#139B4B]" : "bg-white text-gray-400 shadow-sm group-hover:text-gray-600")}>
                    <Sun className="w-8 h-8" strokeWidth={2} />
                  </div>
                  <div className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                    purpose === "oneday" ? "border-[#139B4B] bg-[#139B4B]" : "border-gray-300 bg-white"
                  )}>
                    {purpose === "oneday" && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-[19px] text-black mb-2">Thực đơn 1 ngày</h3>
                  <p className="text-gray-500 text-[15px] leading-relaxed">Dựa trên hoạt động hôm nay</p>
                </div>
              </button>
            </div>

            {/* Conditional Fields based on Purpose */}
            {purpose === "weight" && (
              <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-6 md:p-8 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Mục tiêu */}
                  <div className="space-y-4">
                    <label className="text-gray-800 font-bold text-[16px]">Mục tiêu</label>
                    <div className="flex gap-3">
                      <button onClick={() => setGoal("lose")} className={cn("flex-1 py-3.5 px-2 rounded-[16px] font-semibold transition-colors text-[16px]", goal === "lose" ? "bg-[#139B4B] text-white shadow-md shadow-[#139B4B]/20" : "bg-[#F7F7F9] text-gray-700 hover:bg-gray-100")}>Giảm cân</button>
                      <button onClick={() => setGoal("gain")} className={cn("flex-1 py-3.5 px-2 rounded-[16px] font-semibold transition-colors text-[16px]", goal === "gain" ? "bg-[#139B4B] text-white shadow-md shadow-[#139B4B]/20" : "bg-[#F7F7F9] text-gray-700 hover:bg-gray-100")}>Tăng cân</button>
                      <button onClick={() => setGoal("muscle")} className={cn("flex-1 py-3.5 px-2 rounded-[16px] font-semibold transition-colors text-[16px]", goal === "muscle" ? "bg-[#139B4B] text-white shadow-md shadow-[#139B4B]/20" : "bg-[#F7F7F9] text-gray-700 hover:bg-gray-100")}>Tăng cơ</button>
                    </div>
                  </div>

                  {/* Cân nặng mục tiêu */}
                  <div className="space-y-4">
                    <label className="text-gray-800 font-bold text-[16px]">Cân nặng mục tiêu</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={targetWeight}
                        onChange={(e) => setTargetWeight(e.target.value)}
                        className="w-full bg-white border-2 border-gray-100 hover:border-gray-200 rounded-[16px] px-5 py-3.5 text-lg font-medium focus:outline-none focus:ring-4 focus:ring-[#139B4B]/10 focus:border-[#139B4B] transition-all"
                      />
                      <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-[17px]">kg</span>
                    </div>
                  </div>

                  {/* Thời lượng */}
                  <div className="space-y-4 md:col-span-2">
                    <label className="text-gray-800 font-bold text-[16px]">Thời lượng</label>
                    <div className="flex gap-3 md:w-1/2">
                      <button onClick={() => setDuration("1")} className={cn("flex-1 py-3.5 px-2 rounded-[16px] font-semibold transition-colors text-[16px]", duration === "1" ? "bg-[#139B4B] text-white shadow-md shadow-[#139B4B]/20" : "bg-[#F7F7F9] text-gray-700 hover:bg-gray-100")}>1 tuần</button>
                      <button onClick={() => setDuration("2")} className={cn("flex-1 py-3.5 px-2 rounded-[16px] font-semibold transition-colors text-[16px]", duration === "2" ? "bg-[#139B4B] text-white shadow-md shadow-[#139B4B]/20" : "bg-[#F7F7F9] text-gray-700 hover:bg-gray-100")}>2 tuần</button>
                      <button onClick={() => setDuration("4")} className={cn("flex-1 py-3.5 px-2 rounded-[16px] font-semibold transition-colors text-[16px]", duration === "4" ? "bg-[#139B4B] text-white shadow-md shadow-[#139B4B]/20" : "bg-[#F7F7F9] text-gray-700 hover:bg-gray-100")}>4 tuần</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {purpose === "disease" && (
              <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-6 md:p-8 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <p className="text-gray-600 text-[16px] mb-6">Chúng tôi sẽ dùng bệnh lý đã lưu trong hồ sơ. Cần ít nhất một bệnh lý.</p>
                {/* Thời lượng */}
                <div className="space-y-4 md:w-1/2">
                  <label className="text-gray-800 font-bold text-[16px]">Thời lượng</label>
                  <div className="flex gap-3">
                    <button onClick={() => setDuration("1")} className={cn("flex-1 py-3.5 px-2 rounded-[16px] font-semibold transition-colors text-[16px]", duration === "1" ? "bg-[#139B4B] text-white shadow-md shadow-[#139B4B]/20" : "bg-[#F7F7F9] text-gray-700 hover:bg-gray-100")}>1 tuần</button>
                    <button onClick={() => setDuration("2")} className={cn("flex-1 py-3.5 px-2 rounded-[16px] font-semibold transition-colors text-[16px]", duration === "2" ? "bg-[#139B4B] text-white shadow-md shadow-[#139B4B]/20" : "bg-[#F7F7F9] text-gray-700 hover:bg-gray-100")}>2 tuần</button>
                    <button onClick={() => setDuration("4")} className={cn("flex-1 py-3.5 px-2 rounded-[16px] font-semibold transition-colors text-[16px]", duration === "4" ? "bg-[#139B4B] text-white shadow-md shadow-[#139B4B]/20" : "bg-[#F7F7F9] text-gray-700 hover:bg-gray-100")}>4 tuần</button>
                  </div>
                </div>
              </div>
            )}

            {purpose === "oneday" && (
              <div className="space-y-6 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              </div>
            )}

            <div className="pt-8 pb-20 flex md:justify-end">
              <button
                onClick={handleCreate}
                className="w-full md:w-[280px] bg-[#139B4B] hover:bg-[#108A42] text-white font-bold text-[17px] py-4 md:py-4.5 rounded-[16px] transition-all shadow-[0_4px_14px_0_rgba(19,155,75,0.39)] hover:shadow-[0_6px_20px_rgba(19,155,75,0.23)] hover:-translate-y-0.5"
              >
                Tạo thực đơn
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
