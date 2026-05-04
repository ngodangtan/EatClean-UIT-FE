import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type Purpose = "daily_health_based" | "weight_management" | "disease_based";
type WeightGoal = "lose-weight" | "gain-weight" | "muscle-gain";
type DurationWeeks = 1 | 2 | 4;

const PURPOSES = [
  {
    id: "daily_health_based" as Purpose,
    title: "Daily Health Plan",
    subtitle: "Generate a personalised 1-day meal plan based on your health profile",
    icon: (
      <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2.5" />
        <path d="M20 11v9l5 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "weight_management" as Purpose,
    title: "Weight Management",
    subtitle: "Lose weight, gain muscle or bulk up — choose a goal and duration",
    icon: (
      <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none">
        <path d="M8 32L20 10l12 22H8z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 24h12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "disease_based" as Purpose,
    title: "Disease Management",
    subtitle: "A multi-week plan tailored to manage your recorded health conditions",
    icon: (
      <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none">
        <path d="M20 6C12.268 6 6 12.268 6 20s6.268 14 14 14 14-6.268 14-14S27.732 6 20 6z" stroke="currentColor" strokeWidth="2.5" />
        <path d="M20 14v6M20 26v.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

const WEIGHT_GOALS = [
  { id: "lose-weight" as WeightGoal, label: "Lose Weight", desc: "Burn fat with a calorie deficit" },
  { id: "gain-weight" as WeightGoal, label: "Gain Weight", desc: "Bulk up with a calorie surplus" },
  { id: "muscle-gain" as WeightGoal, label: "Muscle Gain", desc: "Build muscle with high-protein meals" },
];

const DURATION_OPTIONS: { weeks: DurationWeeks; label: string }[] = [
  { weeks: 1, label: "1 Week" },
  { weeks: 2, label: "2 Weeks" },
  { weeks: 4, label: "4 Weeks" },
];

export default function CreatePlan() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [purpose, setPurpose] = useState<Purpose | null>(null);

  // weight_management fields
  const [weightGoal, setWeightGoal] = useState<WeightGoal | null>(null);
  const [desiredWeight, setDesiredWeight] = useState("");
  const [durationWeeks, setDurationWeeks] = useState<DurationWeeks | null>(null);

  // disease_based fields
  const [diseaseDuration, setDiseaseDuration] = useState<DurationWeeks | null>(null);

  function handlePurposeSelect(p: Purpose) {
    setPurpose(p);
  }

  function handleStep1Next() {
    if (!purpose) return;
    if (purpose === "daily_health_based") {
      submitPlan();
    } else {
      setStep(2);
    }
  }

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

  const step2Valid =
    purpose === "weight_management"
      ? weightGoal && desiredWeight && parseFloat(desiredWeight) > 0 && durationWeeks
      : purpose === "disease_based"
        ? diseaseDuration !== null
        : false;

  return (
    <div className="min-h-screen bg-[#F3F3FD] relative overflow-hidden">
      <Header />

      {/* Decorative blur circles */}
      <svg
        className="absolute top-48 left-8 lg:left-16 w-64 h-96 lg:w-[423px] lg:h-[484px] opacity-40 pointer-events-none"
        viewBox="0 0 801 1091"
        fill="none"
      >
        <g filter="url(#f0)">
          <circle cx="377" cy="667" r="111" fill="#4461F2" />
        </g>
        <g opacity="0.45" filter="url(#f1)">
          <circle cx="176" cy="406" r="111" fill="#4475F2" />
        </g>
        <defs>
          <filter id="f0" x="-46" y="244" width="846" height="846" filterUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation="155" />
          </filter>
          <filter id="f1" x="-247" y="-17" width="846" height="846" filterUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation="155" />
          </filter>
        </defs>
      </svg>

      <svg
        className="absolute top-24 right-8 lg:right-16 w-48 h-80 lg:w-[320px] lg:h-[400px] opacity-30 pointer-events-none"
        viewBox="0 0 640 800"
        fill="none"
      >
        <g filter="url(#fr)">
          <circle cx="400" cy="400" r="140" fill="#6F3AFA" />
        </g>
        <defs>
          <filter id="fr" x="0" y="0" width="800" height="800" filterUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation="130" />
          </filter>
        </defs>
      </svg>

      <main className="pt-36 sm:pt-44 lg:pt-52 pb-16 relative z-10">
        <div className="max-w-[1728px] mx-auto px-4 sm:px-8 lg:px-16 xl:px-32">

          {/* Step indicator */}
          {purpose && purpose !== "daily_health_based" && (
            <div className="flex items-center justify-center gap-3 mb-10">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-bold font-satoshi transition-all ${step >= 1 ? "bg-gradient-to-r from-[#2596BE] to-[#6F3AFA] text-white" : "bg-gray-200 text-gray-400"}`}>1</div>
              <div className={`h-1 w-16 sm:w-24 rounded-full transition-all ${step >= 2 ? "bg-gradient-to-r from-[#2596BE] to-[#6F3AFA]" : "bg-gray-200"}`} />
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-bold font-satoshi transition-all ${step >= 2 ? "bg-gradient-to-r from-[#2596BE] to-[#6F3AFA] text-white" : "bg-gray-200 text-gray-400"}`}>2</div>
            </div>
          )}

          {/* ── STEP 1: Choose purpose ── */}
          {step === 1 && (
            <>
              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-black text-center mb-3 font-satoshi">
                Create your meal plan
              </h1>
              <p className="text-lg sm:text-xl text-gray-500 text-center mb-10 sm:mb-14 font-inter">
                Choose how you'd like us to plan your meals
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto mb-12">
                {PURPOSES.map((p) => {
                  const selected = purpose === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => handlePurposeSelect(p.id)}
                      className={`flex flex-col items-start gap-5 p-8 rounded-[28px] text-left transition-all duration-200 hover:shadow-2xl hover:scale-[1.03] ${
                        selected
                          ? "bg-gradient-to-br from-[#2596BE] to-[#6F3AFA] text-white shadow-2xl scale-[1.03] ring-4 ring-[#2596BE]/30"
                          : "bg-white text-[#0D141C] shadow-lg hover:bg-gray-50"
                      }`}
                    >
                      <span className={selected ? "text-white" : "text-[#2596BE]"}>
                        {p.icon}
                      </span>
                      <div>
                        <h3 className={`text-xl sm:text-2xl font-bold font-satoshi mb-2 ${selected ? "text-white" : "text-[#0D141C]"}`}>
                          {p.title}
                        </h3>
                        <p className={`text-sm sm:text-base font-inter leading-relaxed ${selected ? "text-white/80" : "text-gray-500"}`}>
                          {p.subtitle}
                        </p>
                      </div>
                      {selected && (
                        <div className="self-end">
                          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none">
                            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {purpose === "daily_health_based" && (
                <div className="max-w-2xl mx-auto mb-8 px-6 py-5 bg-blue-50 border border-blue-200 rounded-2xl">
                  <p className="text-blue-700 font-inter text-sm sm:text-base text-center">
                    A single-day plan will be generated using your saved health profile (activity level, sleep, diet preferences, and conditions).
                  </p>
                </div>
              )}

              <div className="flex justify-center">
                <button
                  onClick={handleStep1Next}
                  disabled={!purpose}
                  className={`px-10 py-5 rounded-[22px] text-xl sm:text-2xl font-black font-satoshi transition-all ${
                    purpose
                      ? "bg-gradient-to-r from-[#2596BE] to-[#6F3AFA] text-white hover:shadow-2xl hover:scale-105"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {purpose === "daily_health_based" ? "Generate Plan" : "Continue"}
                </button>
              </div>
            </>
          )}

          {/* ── STEP 2: Configure options ── */}
          {step === 2 && purpose === "weight_management" && (
            <>
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-2 mb-8 text-gray-500 hover:text-gray-800 transition-colors font-inter text-base sm:text-lg"
              >
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
                  <path d="M15 10H5M5 10l5-5M5 10l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Back
              </button>

              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-black text-center mb-3 font-satoshi">
                Weight Management
              </h1>
              <p className="text-lg sm:text-xl text-gray-500 text-center mb-10 sm:mb-14 font-inter">
                Set your goal, target weight, and plan duration
              </p>

              <div className="max-w-2xl mx-auto space-y-10 sm:space-y-12">
                {/* Weight Goal */}
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#0D141C] mb-5 font-satoshi">
                    What is your goal?
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {WEIGHT_GOALS.map((g) => {
                      const selected = weightGoal === g.id;
                      return (
                        <button
                          key={g.id}
                          onClick={() => setWeightGoal(g.id)}
                          className={`flex flex-col gap-2 px-5 py-5 rounded-[22px] text-left transition-all duration-200 hover:shadow-xl hover:scale-[1.03] ${
                            selected
                              ? "bg-gradient-to-br from-[#2596BE] to-[#6F3AFA] text-white shadow-xl scale-[1.03]"
                              : "bg-white text-[#0D141C] shadow-md hover:bg-gray-50"
                          }`}
                        >
                          <span className={`text-base sm:text-lg font-bold font-satoshi ${selected ? "text-white" : "text-[#0D141C]"}`}>
                            {g.label}
                          </span>
                          <span className={`text-xs sm:text-sm font-inter ${selected ? "text-white/80" : "text-gray-500"}`}>
                            {g.desc}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Desired Weight */}
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#0D141C] mb-5 font-satoshi">
                    Target weight
                  </h2>
                  <div className="relative max-w-xs">
                    <input
                      type="number"
                      min={20}
                      max={500}
                      value={desiredWeight}
                      onChange={(e) => setDesiredWeight(e.target.value)}
                      placeholder="e.g. 65"
                      className="w-full h-[72px] bg-white rounded-[22px] border-2 border-gray-200 focus:border-[#2596BE] focus:ring-4 focus:ring-[#2596BE]/20 outline-none px-6 pr-16 text-2xl font-bold font-satoshi text-[#0D141C] shadow-md transition-all"
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl font-bold font-satoshi text-gray-400 pointer-events-none">
                      kg
                    </span>
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#0D141C] mb-5 font-satoshi">
                    Plan duration
                  </h2>
                  <div className="flex gap-4">
                    {DURATION_OPTIONS.map((d) => {
                      const selected = durationWeeks === d.weeks;
                      return (
                        <button
                          key={d.weeks}
                          onClick={() => setDurationWeeks(d.weeks)}
                          className={`flex-1 py-5 rounded-[22px] text-center text-xl font-bold font-satoshi transition-all hover:shadow-xl hover:scale-[1.03] ${
                            selected
                              ? "bg-gradient-to-r from-[#2596BE] to-[#6F3AFA] text-white shadow-xl scale-[1.03]"
                              : "bg-white text-[#0D141C] shadow-md hover:bg-gray-50"
                          }`}
                        >
                          {d.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-center pt-4 pb-8">
                  <button
                    onClick={submitPlan}
                    disabled={!step2Valid}
                    className={`px-10 py-5 rounded-[22px] text-xl sm:text-2xl font-black font-satoshi transition-all ${
                      step2Valid
                        ? "bg-gradient-to-r from-[#2596BE] to-[#6F3AFA] text-white hover:shadow-2xl hover:scale-105"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Generate Plan
                  </button>
                </div>
              </div>
            </>
          )}

          {step === 2 && purpose === "disease_based" && (
            <>
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-2 mb-8 text-gray-500 hover:text-gray-800 transition-colors font-inter text-base sm:text-lg"
              >
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
                  <path d="M15 10H5M5 10l5-5M5 10l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Back
              </button>

              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-black text-center mb-3 font-satoshi">
                Disease Management
              </h1>
              <p className="text-lg sm:text-xl text-gray-500 text-center mb-10 sm:mb-14 font-inter">
                Choose how long you'd like your condition-focused plan to run
              </p>

              <div className="max-w-2xl mx-auto space-y-10">
                <div className="px-6 py-5 bg-amber-50 border border-amber-200 rounded-2xl">
                  <p className="text-amber-700 font-inter text-sm sm:text-base">
                    This plan requires at least one health condition saved on your{" "}
                    <a href="/health-profile" className="underline font-semibold hover:text-amber-900">
                      Health Profile
                    </a>
                    . The plan will be tailored to manage your recorded conditions.
                  </p>
                </div>

                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#0D141C] mb-5 font-satoshi">
                    Plan duration
                  </h2>
                  <div className="flex gap-4">
                    {DURATION_OPTIONS.map((d) => {
                      const selected = diseaseDuration === d.weeks;
                      return (
                        <button
                          key={d.weeks}
                          onClick={() => setDiseaseDuration(d.weeks)}
                          className={`flex-1 py-6 rounded-[22px] text-center text-xl font-bold font-satoshi transition-all hover:shadow-xl hover:scale-[1.03] ${
                            selected
                              ? "bg-gradient-to-r from-[#2596BE] to-[#6F3AFA] text-white shadow-xl scale-[1.03]"
                              : "bg-white text-[#0D141C] shadow-md hover:bg-gray-50"
                          }`}
                        >
                          {d.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-center pt-4 pb-8">
                  <button
                    onClick={submitPlan}
                    disabled={!step2Valid}
                    className={`px-10 py-5 rounded-[22px] text-xl sm:text-2xl font-black font-satoshi transition-all ${
                      step2Valid
                        ? "bg-gradient-to-r from-[#2596BE] to-[#6F3AFA] text-white hover:shadow-2xl hover:scale-105"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Generate Plan
                  </button>
                </div>
              </div>
            </>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
