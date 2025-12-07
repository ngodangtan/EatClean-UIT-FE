import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";

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

const questions = [
  {
    id: 1,
    question:
      "Have you tried to eat healthy before but couldn't keep it consistent?",
    answers: ["Yes", "No"],
  },
  {
    id: 2,
    question: "What time of the day do you usually feel hungry?",
    type: "image-cards",
    answers: [
      {
        id: "morning",
        title: "Morning",
        image:
          "https://api.builder.io/api/v1/image/assets/TEMP/2f2e1af706541255dfc9333ace28d2daff17bed2?width=786",
      },
      {
        id: "afternoon",
        title: "Afternoon",
        image:
          "https://api.builder.io/api/v1/image/assets/TEMP/2e59f96d127461c0dfa6cc35923481f4a8435473?width=788",
      },
      {
        id: "evening",
        title: "Evening",
        image:
          "https://api.builder.io/api/v1/image/assets/TEMP/e5c50936d14dd6057fd858d7477cec3356357abe?width=786",
      },
    ],
  },
  {
    id: 3,
    question: "What is your favorite meal?",
    type: "image-cards",
    answers: [
      {
        id: "breakfast",
        title: "Breakfast",
        image:
          "https://api.builder.io/api/v1/image/assets/TEMP/1307c400d01744e13a8a6cae272b6d4f551d32c3?width=786",
      },
      {
        id: "lunch",
        title: "Lunch",
        image:
          "https://api.builder.io/api/v1/image/assets/TEMP/1918192814c4a48cb8e8dbc3fd60a7508789e7c5?width=788",
      },
      {
        id: "dinner",
        title: "Dinner",
        image:
          "https://api.builder.io/api/v1/image/assets/TEMP/06d6b235c0730c2039ee476a8b946ad41c45a9fe?width=786",
      },
    ],
  },
  {
    id: 4,
    question: "How active are you?",
    type: "image-cards",
    answers: [
      {
        id: "low",
        title: "Low activity",
        image:
          "https://api.builder.io/api/v1/image/assets/TEMP/8e722f44e5e08cc154f1010ccae69ba25e79791b?width=786",
      },
      {
        id: "moderate",
        title: "Moderate",
        image:
          "https://api.builder.io/api/v1/image/assets/TEMP/f57a8d75b7e4971692eb5797a5b92e87ddbf3e42?width=788",
      },
      {
        id: "high",
        title: "High",
        image:
          "https://api.builder.io/api/v1/image/assets/TEMP/1123ffad6277af0767c1aed3f914d9e3e8f31b41?width=786",
      },
    ],
  },
  {
    id: 5,
    question: "Describe your average day",
    type: "image-cards",
    answers: [
      {
        id: "sedentary",
        title: "Predominantly sedentary lifestyle",
        image:
          "https://api.builder.io/api/v1/image/assets/TEMP/a7fc6ad4d37a83234d15ee309b6d5d6d2679f29a?width=786",
      },
      {
        id: "balanced",
        title: "Balanced (sit, short walk and light exercise)",
        image:
          "https://api.builder.io/api/v1/image/assets/TEMP/b7c01cac1a5edf9f81c2ae0db1b33bae760ff655?width=788",
      },
      {
        id: "physical",
        title: "Physical work (hard work)",
        image:
          "https://api.builder.io/api/v1/image/assets/TEMP/c049cfc6f9ff0045c8b01b8ea5c9b5b67310ae62?width=786",
      },
    ],
  },
  {
    id: 6,
    question: "What is your work schedule?",
    type: "multi-select",
    answers: [
      "Regular office hours (9-5)",
      "Flexible hours",
      "Night shifts",
      "Irregular schedule",
    ],
  },
  {
    id: 7,
    question: "Sleep duration",
    answers: ["< 6h", "6 - 8h", "> 8h"],
  },
  {
    id: 8,
    question: "Do you have any of these diseases?",
    type: "multi-select",
    answers: [
      "Diabetes",
      "High blood pressure",
      "Heart disease",
      "None of the above",
    ],
  },
  {
    id: 9,
    question: "Pick your primary diet preference",
    type: "image-cards",
    answers: [
      {
        id: "keto",
        title: "Keto / Low‑carb",
        image:
          "https://api.builder.io/api/v1/image/assets/TEMP/a7b5c5f2c3a9b2f23aa0a8bf263b0ee0726d3e73?width=517",
      },
      {
        id: "balanced",
        title: "Balanced / Mediterranean",
        image:
          "https://api.builder.io/api/v1/image/assets/TEMP/a7b5c5f2c3a9b2f23aa0a8bf263b0ee0726d3e73?width=517",
      },
      {
        id: "protein",
        title: "High‑protein",
        image:
          "https://api.builder.io/api/v1/image/assets/TEMP/a7b5c5f2c3a9b2f23aa0a8bf263b0ee0726d3e73?width=517",
      },
      {
        id: "paleo",
        title: "Paleo",
        image:
          "https://api.builder.io/api/v1/image/assets/TEMP/a7b5c5f2c3a9b2f23aa0a8bf263b0ee0726d3e73?width=517",
      },
      {
        id: "vegan",
        title: "Vegan",
        image:
          "https://api.builder.io/api/v1/image/assets/TEMP/a7b5c5f2c3a9b2f23aa0a8bf263b0ee0726d3e73?width=517",
      },
      {
        id: "vegetarian",
        title: "Vegetarian",
        image:
          "https://api.builder.io/api/v1/image/assets/TEMP/a7b5c5f2c3a9b2f23aa0a8bf263b0ee0726d3e73?width=517",
      },
      {
        id: "none",
        title: "None",
        image:
          "https://api.builder.io/api/v1/image/assets/TEMP/a7b5c5f2c3a9b2f23aa0a8bf263b0ee0726d3e73?width=517",
      },
    ],
  },
];

export default function CreatePlan() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [answers, setAnswers] = useState<{ [key: number]: string | string[] }>(
    {},
  );
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [desiredWeight, setDesiredWeight] = useState("");
  const totalSteps = 15;

  const handleNext = () => {
    if (currentStep === 1 && selectedGoal) {
      setCurrentStep(2);
    } else if (currentStep === 5 && height && weight) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 6 && desiredWeight) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 7) {
      setCurrentStep(currentStep + 1);
    } else if (
      currentStep > 1 &&
      currentStep !== 5 &&
      currentStep !== 6 &&
      currentStep !== 7 &&
      answers[currentStep - 1]
    ) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    const currentQuestion = questions.find((q) => {
      if (currentStep === 2) return q.id === 1;
      if (currentStep === 3) return q.id === 2;
      if (currentStep === 4) return q.id === 3;
      if (currentStep === 8) return q.id === 4;
      if (currentStep === 9) return q.id === 5;
      if (currentStep === 10) return q.id === 6;
      if (currentStep === 11) return q.id === 7;
      if (currentStep === 12) return q.id === 8;
      if (currentStep === 13) return q.id === 9;
      return false;
    });

    if (currentQuestion?.type === "multi-select") {
      const currentAnswers = (answers[currentStep - 1] as string[]) || [];
      if (currentAnswers.includes(answer)) {
        setAnswers({
          ...answers,
          [currentStep - 1]: currentAnswers.filter((a) => a !== answer),
        });
      } else {
        setAnswers({
          ...answers,
          [currentStep - 1]: [...currentAnswers, answer],
        });
      }
    } else {
      setAnswers({ ...answers, [currentStep - 1]: answer });
    }
  };

  const progressPercentage = (currentStep / totalSteps) * 100;
  const canProceed =
    currentStep === 1
      ? selectedGoal
      : currentStep === 5
        ? height && weight
        : currentStep === 6
          ? desiredWeight
          : currentStep === 7
            ? true
            : currentStep === 10 || currentStep === 12
              ? Array.isArray(answers[currentStep - 1]) &&
                (answers[currentStep - 1] as string[]).length > 0
              : answers[currentStep - 1];

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
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                className="p-2 sm:p-3 rounded-lg bg-white hover:bg-gray-50 shadow-md hover:shadow-lg transition-all"
              >
                <svg
                  className="w-8 h-8 sm:w-10 sm:h-10"
                  viewBox="0 0 41 41"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M31.8533 20.0775L8.52104 20.2968M8.52104 20.2968L20.2968 31.8533M8.52104 20.2968L20.0776 8.52098"
                    stroke="#1E1E1E"
                    strokeWidth="3.33333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}

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
              disabled={!canProceed}
              className={`p-2 sm:p-3 rounded-lg transition-all ${
                canProceed
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

          {currentStep === 1 && (
            <>
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
            </>
          )}

          {currentStep === 2 && (
            <>
              <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-bold text-black text-center mb-8 sm:mb-12 lg:mb-16 font-satoshi leading-tight max-w-3xl mx-auto">
                {questions[0].question}
              </h1>

              <div className="flex flex-col items-center gap-6 sm:gap-8 max-w-2xl mx-auto">
                {questions[0].answers.map((answer) => (
                  <button
                    key={answer}
                    onClick={() => handleAnswerSelect(answer)}
                    className={`w-full px-8 py-6 sm:py-8 rounded-[23px] shadow-[0_19px_33px_6px_rgba(68,97,242,0.15)] transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                      answers[currentStep - 1] === answer
                        ? "bg-gradient-to-r from-[#2596BE] to-[#6F3AFA] text-white ring-4 ring-[#2596BE]/30 scale-105"
                        : "bg-white text-black hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-2xl sm:text-3xl lg:text-[30px] font-bold font-satoshi tracking-wide">
                      {answer}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}

          {currentStep === 3 && (
            <>
              <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-bold text-black text-center mb-8 sm:mb-12 lg:mb-16 font-satoshi leading-tight max-w-3xl mx-auto">
                {questions[1].question}
              </h1>

              <div className="flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-8 lg:gap-16 max-w-6xl mx-auto">
                {questions[1].answers.map((option: any) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswerSelect(option.id)}
                    className={`group relative bg-white rounded-[20px] overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 w-full md:w-[394px] ${
                      answers[currentStep - 1] === option.id
                        ? "ring-4 ring-[#2596BE] shadow-2xl scale-105"
                        : "shadow-lg"
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={option.image}
                        alt={option.title}
                        className="w-full aspect-[393/459] object-cover rounded-t-[53px]"
                      />
                      {answers[currentStep - 1] === option.id && (
                        <div className="absolute inset-0 bg-gradient-to-t from-[#2596BE]/20 to-transparent rounded-t-[53px]" />
                      )}
                    </div>
                    <div className="p-4 sm:p-6 bg-[#E8F4F8] rounded-b-[20px]">
                      <h3 className="text-2xl sm:text-3xl lg:text-[42px] font-bold text-black text-left font-satoshi leading-tight">
                        {option.title}
                      </h3>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {currentStep === 4 && (
            <>
              <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-bold text-black text-center mb-8 sm:mb-12 lg:mb-16 font-satoshi leading-tight max-w-3xl mx-auto">
                {questions[2].question}
              </h1>

              <div className="flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-8 lg:gap-16 max-w-6xl mx-auto">
                {questions[2].answers.map((option: any) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswerSelect(option.id)}
                    className={`group relative bg-white rounded-[20px] overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 w-full md:w-[394px] ${
                      answers[currentStep - 1] === option.id
                        ? "ring-4 ring-[#2596BE] shadow-2xl scale-105"
                        : "shadow-lg"
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={option.image}
                        alt={option.title}
                        className="w-full aspect-[393/459] object-cover rounded-t-[53px]"
                      />
                      {answers[currentStep - 1] === option.id && (
                        <div className="absolute inset-0 bg-gradient-to-t from-[#2596BE]/20 to-transparent rounded-t-[53px]" />
                      )}
                    </div>
                    <div className="p-4 sm:p-6 bg-[#E8F4F8] rounded-b-[20px]">
                      <h3 className="text-2xl sm:text-3xl lg:text-[42px] font-bold text-black text-left font-satoshi leading-tight">
                        {option.title}
                      </h3>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {currentStep === 5 && (
            <>
              <div className="max-w-2xl mx-auto space-y-8 sm:space-y-12">
                <div>
                  <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-bold text-black text-center mb-6 sm:mb-8 font-satoshi leading-tight">
                    How tall are you?
                  </h2>
                  <div className="relative max-w-md mx-auto">
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      placeholder=""
                      className="w-full px-6 py-6 sm:py-7 rounded-[33px] shadow-[0_27px_47px_9px_rgba(68,97,242,0.15)] text-center text-2xl sm:text-3xl lg:text-[42px] font-bold font-satoshi bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-[#2596BE]/30 transition-all"
                    />
                    <span className="absolute right-8 top-1/2 -translate-y-1/2 text-2xl sm:text-3xl lg:text-[42px] font-bold font-satoshi text-black pointer-events-none">
                      cm
                    </span>
                  </div>
                </div>

                <div>
                  <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-bold text-black text-center mb-6 sm:mb-8 font-satoshi leading-tight">
                    What is your current weight?
                  </h2>
                  <div className="relative max-w-md mx-auto">
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder=""
                      className="w-full px-6 py-6 sm:py-7 rounded-[33px] shadow-[0_27px_47px_9px_rgba(68,97,242,0.15)] text-center text-2xl sm:text-3xl lg:text-[42px] font-bold font-satoshi bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-[#2596BE]/30 transition-all"
                    />
                    <span className="absolute right-8 top-1/2 -translate-y-1/2 text-2xl sm:text-3xl lg:text-[42px] font-bold font-satoshi text-black pointer-events-none">
                      kg
                    </span>
                  </div>
                </div>

                <div className="flex justify-center mt-8 sm:mt-12">
                  <button
                    onClick={handleNext}
                    disabled={!height || !weight}
                    className={`px-8 py-4 rounded-[18px] text-2xl sm:text-3xl lg:text-[36px] font-black font-satoshi transition-all ${
                      height && weight
                        ? "bg-gradient-to-r from-[#2596BE] to-[#6F3AFA] text-white hover:shadow-2xl hover:scale-105"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </>
          )}

          {currentStep === 6 && (
            <>
              <div className="max-w-2xl mx-auto">
                <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-bold text-black text-center mb-6 sm:mb-8 font-satoshi leading-tight">
                  What is your desired weight?
                </h2>
                <div className="relative max-w-md mx-auto">
                  <input
                    type="number"
                    value={desiredWeight}
                    onChange={(e) => setDesiredWeight(e.target.value)}
                    placeholder=""
                    className="w-full px-6 py-6 sm:py-7 rounded-[33px] shadow-[0_27px_47px_9px_rgba(68,97,242,0.15)] text-center text-2xl sm:text-3xl lg:text-[42px] font-bold font-satoshi bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-[#2596BE]/30 transition-all"
                  />
                  <span className="absolute right-8 top-1/2 -translate-y-1/2 text-2xl sm:text-3xl lg:text-[42px] font-bold font-satoshi text-black pointer-events-none">
                    kg
                  </span>
                </div>

                <div className="flex justify-center mt-8 sm:mt-12">
                  <button
                    onClick={handleNext}
                    disabled={!desiredWeight}
                    className={`px-8 py-4 rounded-[18px] text-2xl sm:text-3xl lg:text-[36px] font-black font-satoshi transition-all ${
                      desiredWeight
                        ? "bg-gradient-to-r from-[#2596BE] to-[#6F3AFA] text-white hover:shadow-2xl hover:scale-105"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </>
          )}

          {currentStep === 7 && (
            <>
              <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-bold text-black text-center mb-8 sm:mb-12 font-satoshi leading-tight">
                  You will reach {desiredWeight} kg on{" "}
                  {(() => {
                    const today = new Date();
                    const currentW = parseFloat(weight) || 0;
                    const desiredW = parseFloat(desiredWeight) || 0;
                    const weightDiff = Math.abs(currentW - desiredW);
                    const weeksNeeded = Math.ceil(weightDiff / 0.5);
                    const targetDate = new Date(today);
                    targetDate.setDate(today.getDate() + weeksNeeded * 7);
                    return targetDate.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                    });
                  })()}
                </h1>

                <div className="relative max-w-2xl mx-auto mb-8 sm:mb-12">
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/252758dc50b1c1b1fbdb8602025aabd0c313ccf9?width=1132"
                    alt="Weight progress chart"
                    className="w-full h-auto"
                  />

                  <div className="absolute left-8 sm:left-12 bottom-8 sm:bottom-12 flex flex-col items-center">
                    <div className="px-6 py-3 rounded-[18px] bg-gradient-to-r from-[#2596BE] to-[#6F3AFA] text-white mb-2">
                      <span className="text-2xl sm:text-3xl lg:text-[36px] font-black font-satoshi">
                        {weight}kg
                      </span>
                    </div>
                    <span className="text-2xl sm:text-3xl lg:text-[42px] font-bold font-satoshi text-black">
                      Today
                    </span>
                  </div>

                  <div className="absolute right-8 sm:right-12 top-8 sm:top-12 flex flex-col items-center">
                    <div className="px-6 py-3 rounded-[18px] bg-gradient-to-r from-[#2596BE] to-[#6F3AFA] text-white mb-2">
                      <span className="text-2xl sm:text-3xl lg:text-[36px] font-black font-satoshi">
                        {desiredWeight}kg
                      </span>
                    </div>
                    <span className="text-2xl sm:text-3xl lg:text-[42px] font-bold font-satoshi text-black">
                      Goal
                    </span>
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={handleNext}
                    className="px-8 py-4 rounded-[18px] text-2xl sm:text-3xl lg:text-[36px] font-black font-satoshi bg-gradient-to-r from-[#2596BE] to-[#6F3AFA] text-white hover:shadow-2xl hover:scale-105 transition-all"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </>
          )}

          {currentStep === 8 && (
            <>
              <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-bold text-black text-center mb-8 sm:mb-12 lg:mb-16 font-satoshi leading-tight max-w-3xl mx-auto">
                {questions[3].question}
              </h1>

              <div className="flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-8 lg:gap-16 max-w-6xl mx-auto">
                {questions[3].answers.map((option: any) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswerSelect(option.id)}
                    className={`group relative bg-white rounded-[20px] overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 w-full md:w-[394px] ${
                      answers[currentStep - 1] === option.id
                        ? "ring-4 ring-[#2596BE] shadow-2xl scale-105"
                        : "shadow-lg"
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={option.image}
                        alt={option.title}
                        className="w-full aspect-[393/459] object-cover rounded-t-[53px]"
                      />
                      {answers[currentStep - 1] === option.id && (
                        <div className="absolute inset-0 bg-gradient-to-t from-[#2596BE]/20 to-transparent rounded-t-[53px]" />
                      )}
                    </div>
                    <div className="p-4 sm:p-6 bg-[#E8F4F8] rounded-b-[20px]">
                      <h3 className="text-2xl sm:text-3xl lg:text-[42px] font-bold text-black text-left font-satoshi leading-tight">
                        {option.title}
                      </h3>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {currentStep === 9 && (
            <>
              <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-bold text-black text-center mb-8 sm:mb-12 lg:mb-16 font-satoshi leading-tight max-w-3xl mx-auto">
                {questions[4].question}
              </h1>

              <div className="flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-8 lg:gap-16 max-w-6xl mx-auto">
                {questions[4].answers.map((option: any) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswerSelect(option.id)}
                    className={`group relative bg-white rounded-[20px] overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 w-full md:w-[394px] ${
                      answers[currentStep - 1] === option.id
                        ? "ring-4 ring-[#2596BE] shadow-2xl scale-105"
                        : "shadow-lg"
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={option.image}
                        alt={option.title}
                        className="w-full aspect-[393/459] object-cover rounded-t-[53px]"
                      />
                      {answers[currentStep - 1] === option.id && (
                        <div className="absolute inset-0 bg-gradient-to-t from-[#2596BE]/20 to-transparent rounded-t-[53px]" />
                      )}
                    </div>
                    <div className="p-4 sm:p-6 bg-[#E8F4F8] rounded-b-[20px] min-h-[100px] flex items-center">
                      <h3 className="text-xl sm:text-2xl lg:text-[32px] font-bold text-black text-left font-satoshi leading-tight">
                        {option.title}
                      </h3>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {currentStep === 10 && (
            <>
              <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-bold text-black text-center mb-8 sm:mb-12 lg:mb-16 font-satoshi leading-tight max-w-3xl mx-auto">
                {questions[5].question}
              </h1>

              <div className="flex flex-col items-center gap-6 sm:gap-8 max-w-2xl mx-auto">
                {questions[5].answers.map((answer) => {
                  const currentAnswers =
                    (answers[currentStep - 1] as string[]) || [];
                  const isSelected = currentAnswers.includes(answer as string);

                  return (
                    <button
                      key={answer as string}
                      onClick={() => handleAnswerSelect(answer as string)}
                      className={`w-full px-8 py-6 sm:py-8 rounded-[33px] shadow-[0_27px_47px_9px_rgba(68,97,242,0.15)] transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                        isSelected
                          ? "bg-gradient-to-r from-[#2596BE] to-[#6F3AFA] text-white ring-4 ring-[#2596BE]/30 scale-105"
                          : "bg-white text-black hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-2xl sm:text-3xl lg:text-[40px] font-bold font-satoshi tracking-wide">
                        {answer}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-center mt-8 sm:mt-12">
                <button
                  onClick={handleNext}
                  disabled={!canProceed}
                  className={`px-8 py-4 rounded-[18px] text-2xl sm:text-3xl lg:text-[36px] font-black font-satoshi transition-all ${
                    canProceed
                      ? "bg-gradient-to-r from-[#2596BE] to-[#6F3AFA] text-white hover:shadow-2xl hover:scale-105"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Continue
                </button>
              </div>
            </>
          )}

          {currentStep === 11 && (
            <>
              <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-bold text-black text-center mb-8 sm:mb-12 lg:mb-16 font-satoshi leading-tight max-w-3xl mx-auto">
                {questions[6].question}
              </h1>

              <div className="flex flex-col items-center gap-6 sm:gap-8 max-w-2xl mx-auto">
                {questions[6].answers.map((answer) => (
                  <button
                    key={answer}
                    onClick={() => handleAnswerSelect(answer)}
                    className={`w-full px-8 py-6 sm:py-8 rounded-[33px] shadow-[0_27px_47px_9px_rgba(68,97,242,0.15)] transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                      answers[currentStep - 1] === answer
                        ? "bg-gradient-to-r from-[#2596BE] to-[#6F3AFA] text-white ring-4 ring-[#2596BE]/30 scale-105"
                        : "bg-white text-black hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-2xl sm:text-3xl lg:text-[40px] font-bold font-satoshi tracking-wide">
                      {answer}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}

          {currentStep === 12 && (
            <>
              <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-bold text-black text-center mb-8 sm:mb-12 lg:mb-16 font-satoshi leading-tight max-w-3xl mx-auto">
                {questions[7].question}
              </h1>

              <div className="flex flex-col items-center gap-6 sm:gap-8 max-w-2xl mx-auto">
                {questions[7].answers.map((answer) => {
                  const currentAnswers = (answers[currentStep - 1] as string[]) || [];
                  const isSelected = currentAnswers.includes(answer as string);

                  return (
                    <button
                      key={answer as string}
                      onClick={() => handleAnswerSelect(answer as string)}
                      className={`w-full px-8 py-6 sm:py-8 rounded-[33px] shadow-[0_27px_47px_9px_rgba(68,97,242,0.15)] transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                        isSelected
                          ? "bg-gradient-to-r from-[#2596BE] to-[#6F3AFA] text-white ring-4 ring-[#2596BE]/30 scale-105"
                          : "bg-white text-black hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-2xl sm:text-3xl lg:text-[40px] font-bold font-satoshi tracking-wide">
                        {answer}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-center mt-8 sm:mt-12">
                <button
                  onClick={handleNext}
                  disabled={!canProceed}
                  className={`px-8 py-4 rounded-[18px] text-2xl sm:text-3xl lg:text-[36px] font-black font-satoshi transition-all ${
                    canProceed
                      ? "bg-gradient-to-r from-[#2596BE] to-[#6F3AFA] text-white hover:shadow-2xl hover:scale-105"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Continue
                </button>
              </div>
            </>
          )}

          {currentStep === 13 && (
            <>
              <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-bold text-black text-center mb-8 sm:mb-12 lg:mb-16 font-satoshi leading-tight max-w-3xl mx-auto">
                {questions[8].question}
              </h1>

              <div className="flex flex-col items-center gap-6 sm:gap-8 max-w-4xl mx-auto">
                {questions[8].answers.map((option: any) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswerSelect(option.id)}
                    className={`w-full flex items-center justify-between px-8 py-6 sm:py-8 rounded-[33px] shadow-[0_27px_47px_9px_rgba(68,97,242,0.15)] transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                      answers[currentStep - 1] === option.id
                        ? "bg-gradient-to-r from-[#2596BE] to-[#6F3AFA] text-white ring-4 ring-[#2596BE]/30 scale-105"
                        : "bg-white text-black hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-2xl sm:text-3xl lg:text-[40px] font-bold font-satoshi tracking-wide flex-1 text-left pl-4 sm:pl-8">
                      {option.title}
                    </span>
                    <img
                      src={option.image}
                      alt={option.title}
                      className="w-32 h-24 sm:w-40 sm:h-32 lg:w-64 lg:h-48 rounded-[30px] object-cover"
                    />
                  </button>
                ))}
              </div>
            </>
          )}

          {currentStep > 13 && (
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-bold text-black mb-8 font-satoshi">
                Step {currentStep}
              </h1>
              <p className="text-xl text-gray-600 font-satoshi">
                Additional questions will be added here...
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
