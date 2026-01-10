import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { API_BASE } from "@shared/api";

interface Macros {
  protein: number;
  carbs: number;
  fat: number;
}

interface Meal {
  mealType: string;
  name: string;
  description: string;
  ingredients: string[];
  benefits: string[];
  calories: number;
  macros: Macros;
}

interface DayPlan {
  day: number;
  title: string;
  theme: string;
  macros: Macros;
  totalCalories: number;
  meals: Meal[];
  tips: string[];
}

interface MealPlan {
  _id: string;
  userId: string;
  healthProfileId: string;
  title: string;
  aiModel: string;
  days: DayPlan[];
  prompt: string;
  rawAiResponse: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function Analyzing() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);

  useEffect(() => {
    const processHealthProfileAndGenerateMealPlan = async () => {
      const timeout = 3 * 60 * 1000; // 3 minutes in milliseconds
      let timeoutId: NodeJS.Timeout;

      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please log in to continue");
          setIsLoading(false);
          setTimeout(() => navigate("/login"), 2000);
          return;
        }

        // Step 1: Get health profile data from localStorage
        const healthProfileDataJson = localStorage.getItem("healthProfileData");
        if (!healthProfileDataJson) {
          throw new Error("Health profile data not found. Please start over.");
        }

        const healthProfileData = JSON.parse(healthProfileDataJson);
        console.log(
          "=== Step 1: Sending health profile to /api/health-profile ===",
        );
        console.log("Health profile data:", healthProfileData);

        // Step 2: Save health profile
        const profileResponse = await fetch(`${API_BASE}/api/health-profile`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(healthProfileData),
        });

        if (!profileResponse.ok) {
          let profileErrorData;
          try {
            profileErrorData = await profileResponse.json();
          } catch {
            throw new Error(
              `Failed to save health profile: ${profileResponse.status}`,
            );
          }
          throw new Error(
            profileErrorData.message || "Failed to save health profile",
          );
        }

        const profileResult = await profileResponse.json();
        console.log("✓ Health profile saved successfully:", profileResult);

        // Step 3: Generate meal plan
        console.log("=== Step 2: Calling /api/meal-plans/generate ===");

        const controller = new AbortController();
        timeoutId = setTimeout(() => {
          controller.abort();
        }, timeout);

        const mealPlanResponse = await fetch("/api/meal-plans/generate", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        console.log("API Response status:", mealPlanResponse.status);
        console.log("API Response ok:", mealPlanResponse.ok);

        // Check response status
        if (!mealPlanResponse.ok) {
          let mealPlanErrorData;
          try {
            mealPlanErrorData = await mealPlanResponse.json();
          } catch {
            throw new Error(
              `Server returned ${mealPlanResponse.status}: ${mealPlanResponse.statusText}`,
            );
          }
          throw new Error(
            mealPlanErrorData.message || "Failed to generate meal plan",
          );
        }

        // Parse successful response
        let mealPlanData;
        try {
          mealPlanData = await mealPlanResponse.json();
        } catch (err) {
          console.error("Failed to parse response:", err);
          throw new Error("Invalid response format from server");
        }

        console.log("✓ Meal plan generated successfully:", mealPlanData);

        // Step 4: Store and display meal plan
        if (mealPlanData.mealPlan) {
          setMealPlan(mealPlanData.mealPlan);
        }

        // Clean up localStorage
        localStorage.removeItem("healthProfileData");

        setIsLoading(false);
      } catch (err) {
        clearTimeout(timeoutId);
        console.error("Error in meal plan process:", err);

        if (err instanceof Error) {
          if (err.name === "AbortError") {
            setError(
              "Request timeout. The meal plan generation took too long. Please try again.",
            );
          } else {
            setError(err.message);
          }
        } else {
          setError("An error occurred");
        }
        setIsLoading(false);
      }
    };

    // Start the process immediately
    processHealthProfileAndGenerateMealPlan();

    return () => {
      // Cleanup if component unmounts
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <Header />

      <main className="flex-grow flex items-center justify-center px-4 py-8 sm:py-12 lg:py-16 mt-32 sm:mt-40 lg:mt-48">
        <div className="w-full max-w-6xl mx-auto">
          {/* Error message */}
          {error && (
            <div className="mb-8 p-6 rounded-[20px] bg-red-50 border-2 border-red-200 max-w-2xl mx-auto">
              <p className="text-red-600 text-lg sm:text-xl font-satoshi text-center">
                {error}
              </p>
            </div>
          )}

          {/* Main heading */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black text-center mb-8 sm:mb-12 lg:mb-16 font-satoshi max-w-4xl mx-auto leading-tight">
            We are analyzing your profile to create a personalized muscle gain
            plan
          </h1>

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-center mb-12 sm:mb-16 lg:mb-20">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
                <style>{`
                  @keyframes spin {
                    from {
                      transform: rotate(0deg);
                    }
                    to {
                      transform: rotate(360deg);
                    }
                  }
                  .animate-spin-slow {
                    animation: spin 3s linear infinite;
                  }
                `}</style>
                {/* Spinning circle loading */}
                <svg
                  className="w-full h-full animate-spin-slow"
                  viewBox="0 0 200 200"
                >
                  {/* Background circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r="85"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="8"
                  />

                  {/* Spinning circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r="85"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="12"
                    strokeDasharray="80 534"
                    strokeLinecap="round"
                  />

                  {/* Gradient definition */}
                  <defs>
                    <linearGradient
                      id="gradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#2596BE" />
                      <stop offset="100%" stopColor="#6F3AFA" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Loading text */}
                <div className="absolute inset-0 flex items-center justify-center flex-col gap-2">
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2596BE] font-satoshi">
                    Analyzing...
                  </span>
                  <span className="text-xs sm:text-sm lg:text-base text-gray-500 font-satoshi">
                    This may take up to 3 minutes
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Meal Plan Display */}
          {!isLoading && mealPlan && (
            <div className="w-full space-y-8 sm:space-y-10">
              {/* Meal Plan Title */}
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-bold text-black mb-4 font-satoshi">
                  {mealPlan.title}
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 font-satoshi">
                  AI-Generated by {mealPlan.aiModel}
                </p>
              </div>

              {/* Days Container */}
              <div className="grid gap-8 sm:gap-10">
                {mealPlan.days.map((day) => (
                  <div
                    key={day.day}
                    className="bg-white rounded-[33px] shadow-[0_27px_47px_9px_rgba(68,97,242,0.15)] overflow-hidden"
                  >
                    {/* Day Header */}
                    <div className="bg-gradient-to-r from-[#2596BE] to-[#6F3AFA] p-6 sm:p-8 lg:p-10">
                      <h3 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-white mb-2 font-satoshi">
                        {day.title}
                      </h3>
                      <p className="text-white/90 text-lg sm:text-xl font-satoshi mb-4">
                        {day.theme}
                      </p>

                      {/* Macros Summary */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white/20 rounded-[15px] p-3 sm:p-4">
                          <p className="text-white/80 text-xs sm:text-sm font-satoshi">
                            Protein
                          </p>
                          <p className="text-white text-lg sm:text-xl lg:text-2xl font-bold font-satoshi">
                            {day.macros.protein}g
                          </p>
                        </div>
                        <div className="bg-white/20 rounded-[15px] p-3 sm:p-4">
                          <p className="text-white/80 text-xs sm:text-sm font-satoshi">
                            Carbs
                          </p>
                          <p className="text-white text-lg sm:text-xl lg:text-2xl font-bold font-satoshi">
                            {day.macros.carbs}g
                          </p>
                        </div>
                        <div className="bg-white/20 rounded-[15px] p-3 sm:p-4">
                          <p className="text-white/80 text-xs sm:text-sm font-satoshi">
                            Fat
                          </p>
                          <p className="text-white text-lg sm:text-xl lg:text-2xl font-bold font-satoshi">
                            {day.macros.fat}g
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 pt-6 border-t border-white/20">
                        <p className="text-white text-lg sm:text-xl lg:text-2xl font-bold font-satoshi">
                          Total Calories: {day.totalCalories} kcal
                        </p>
                      </div>
                    </div>

                    {/* Meals Section */}
                    <div className="p-6 sm:p-8 lg:p-10">
                      <h4 className="text-xl sm:text-2xl lg:text-[28px] font-bold text-black mb-6 font-satoshi">
                        Meals
                      </h4>

                      <div className="space-y-6">
                        {day.meals.map((meal, index) => (
                          <div
                            key={index}
                            className="border-2 border-gray-200 rounded-[20px] p-4 sm:p-6"
                          >
                            {/* Meal Header */}
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <p className="text-xs sm:text-sm font-bold text-[#2596BE] uppercase font-satoshi tracking-wide">
                                  {meal.mealType}
                                </p>
                                <h5 className="text-xl sm:text-2xl lg:text-[28px] font-bold text-black mt-2 font-satoshi">
                                  {meal.name}
                                </h5>
                              </div>
                              <div className="bg-[#2596BE]/10 rounded-[15px] px-4 py-2">
                                <p className="text-sm sm:text-base font-bold text-[#2596BE] font-satoshi">
                                  {meal.calories} kcal
                                </p>
                              </div>
                            </div>

                            {/* Description */}
                            <p className="text-gray-700 text-base sm:text-lg font-satoshi mb-4">
                              {meal.description}
                            </p>

                            {/* Macros */}
                            <div className="grid grid-cols-3 gap-3 mb-4">
                              <div className="bg-blue-50 rounded-[12px] p-2 sm:p-3">
                                <p className="text-xs text-gray-600 font-satoshi">
                                  Protein
                                </p>
                                <p className="text-base sm:text-lg font-bold text-[#2596BE] font-satoshi">
                                  {meal.macros.protein}g
                                </p>
                              </div>
                              <div className="bg-blue-50 rounded-[12px] p-2 sm:p-3">
                                <p className="text-xs text-gray-600 font-satoshi">
                                  Carbs
                                </p>
                                <p className="text-base sm:text-lg font-bold text-[#2596BE] font-satoshi">
                                  {meal.macros.carbs}g
                                </p>
                              </div>
                              <div className="bg-blue-50 rounded-[12px] p-2 sm:p-3">
                                <p className="text-xs text-gray-600 font-satoshi">
                                  Fat
                                </p>
                                <p className="text-base sm:text-lg font-bold text-[#2596BE] font-satoshi">
                                  {meal.macros.fat}g
                                </p>
                              </div>
                            </div>

                            {/* Ingredients */}
                            {meal.ingredients &&
                              meal.ingredients.length > 0 && (
                                <div className="mb-4">
                                  <p className="text-sm font-bold text-black mb-2 font-satoshi">
                                    Ingredients:
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    {meal.ingredients.map((ingredient, idx) => (
                                      <span
                                        key={idx}
                                        className="inline-block bg-gray-100 rounded-[10px] px-3 py-1 text-sm text-gray-700 font-satoshi"
                                      >
                                        {ingredient}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                            {/* Benefits */}
                            {meal.benefits && meal.benefits.length > 0 && (
                              <div>
                                <p className="text-sm font-bold text-black mb-2 font-satoshi">
                                  Benefits:
                                </p>
                                <ul className="space-y-1">
                                  {meal.benefits.map((benefit, idx) => (
                                    <li
                                      key={idx}
                                      className="flex items-start gap-2 text-gray-700 text-sm font-satoshi"
                                    >
                                      <span className="text-[#2596BE] font-bold">
                                        •
                                      </span>
                                      <span>{benefit}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Tips Section */}
                      {day.tips && day.tips.length > 0 && (
                        <div className="mt-8 pt-8 border-t-2 border-gray-200">
                          <h5 className="text-lg sm:text-xl font-bold text-black mb-4 font-satoshi">
                            Tips for {day.title}
                          </h5>
                          <ul className="space-y-2">
                            {day.tips.map((tip, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-3 text-gray-700 text-base font-satoshi"
                              >
                                <span className="text-[#2596BE] font-bold mt-1">
                                  ✓
                                </span>
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <div className="flex justify-center mt-12">
                <button
                  onClick={() => navigate("/")}
                  className="px-8 py-4 rounded-[18px] bg-gradient-to-r from-[#2596BE] to-[#6F3AFA] text-white text-lg sm:text-xl lg:text-[20px] font-bold font-satoshi hover:shadow-2xl hover:scale-105 transition-all"
                >
                  Back to Home
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
