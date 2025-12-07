import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const goals = [
  {
    id: "lose-weight",
    title: "Lose weight",
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/26290d555037b126d255fc9c92941c163d16504b?width=786",
  },
  {
    id: "muscle-gain",
    title: "Muscle gain",
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/c7335ba142e27a035c622aec69c3f81d227a8083?width=788",
  },
  {
    id: "improve-health",
    title: "Improve health",
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/2791dee370eab777abf354fe000a028685650edc?width=786",
  },
];

export default function CreatePlan() {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [currentStep] = useState(1);
  const totalSteps = 15;
  const navigate = useNavigate();

  const handleNext = () => {
    if (selectedGoal) {
      console.log("Selected goal:", selectedGoal);
      // Navigate to next step (you can create additional question pages)
    }
  };

  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-[#F3F3FD] relative overflow-hidden">
      <Header />

      <svg
        className="absolute top-48 left-8 lg:left-16 w-64 h-96 lg:w-[423px] lg:h-[484px] opacity-50 pointer-events-none"
        viewBox="0 0 801 1091"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_f)">
          <circle cx="377.122" cy="667.355" r="111.168" fill="#4461F2" />
        </g>
        <g opacity="0.45" filter="url(#filter1_f)">
          <circle cx="176.429" cy="405.666" r="111.168" fill="#4475F2" />
        </g>
        <defs>
          <filter
            id="filter0_f"
            x="-45.9077"
            y="244.325"
            width="846.061"
            height="846.06"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="155.931"
              result="effect1_foregroundBlur"
            />
          </filter>
          <filter
            id="filter1_f"
            x="-246.601"
            y="-17.3638"
            width="846.061"
            height="846.06"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="155.931"
              result="effect1_foregroundBlur"
            />
          </filter>
        </defs>
      </svg>

      <main className="pt-24 sm:pt-32 lg:pt-40 pb-12 relative z-10">
        <div className="max-w-[1728px] mx-auto px-4 sm:px-8 lg:px-16 xl:px-32">
          <div className="flex items-center justify-center gap-4 sm:gap-8 mb-6 sm:mb-8">
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#2596BE] to-[#6F3AFA] transition-all duration-300 rounded-full"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>
            <span className="text-2xl sm:text-3xl lg:text-[31px] font-bold text-[#404040] font-satoshi whitespace-nowrap">
              {currentStep}/{totalSteps}
            </span>
            <button
              onClick={handleNext}
              disabled={!selectedGoal}
              className={`p-2 sm:p-3 rounded-lg transition-all ${
                selectedGoal
                  ? "bg-white hover:bg-gray-50 shadow-md hover:shadow-lg"
                  : "bg-gray-200 cursor-not-allowed opacity-50"
              }`}
            >
              <svg
                className="w-8 h-8 sm:w-10 sm:h-10"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.3335 20H31.6668M31.6668 20L20.0002 8.33337M31.6668 20L20.0002 31.6667"
                  stroke="#1E1E1E"
                  strokeWidth="3.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-bold text-black text-center mb-8 sm:mb-12 lg:mb-16 font-satoshi">
            Select your goal ?
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-16 max-w-6xl mx-auto">
            {goals.map((goal) => (
              <button
                key={goal.id}
                onClick={() => setSelectedGoal(goal.id)}
                className={`group relative bg-white rounded-[20px] overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                  selectedGoal === goal.id
                    ? "ring-4 ring-[#2596BE] shadow-2xl scale-105"
                    : "shadow-lg"
                }`}
              >
                <div className="relative">
                  <img
                    src={goal.image}
                    alt={goal.title}
                    className="w-full aspect-[393/459] object-cover rounded-t-[53px]"
                  />
                  {selectedGoal === goal.id && (
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2596BE]/20 to-transparent rounded-t-[53px]" />
                  )}
                </div>
                <div className="p-4 sm:p-6">
                  <h3 className="text-2xl sm:text-3xl lg:text-[42px] font-bold text-black text-left font-satoshi leading-tight">
                    {goal.title}
                  </h3>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
