import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { API_BASE } from "@shared/api";

interface MealMacros {
  protein: number;
  carbs: number;
  fat: number;
}

interface Meal {
  mealType: string;
  name: string;
  description: string;
  benefits: string[];
  calories: number;
  macros: MealMacros;
}

interface MealPlanDay {
  day: number;
  title: string;
  theme: string;
  macros: MealMacros;
  totalCalories: number;
  meals: Meal[];
  tips: string[];
}

interface MealPlan {
  _id: string;
  userId: string;
  title: string;
  days: MealPlanDay[];
  createdAt: string;
  updatedAt: string;
}

const placeholderImages = {
  breakfast:
    "https://api.builder.io/api/v1/image/assets/TEMP/46e92b799fb5ad3b19df51abdb9d9e139651dac3?width=386",
  lunch:
    "https://api.builder.io/api/v1/image/assets/TEMP/75f7665a79e8e874dd19c1341ef172c09bafa0bd?width=386",
  dinner:
    "https://api.builder.io/api/v1/image/assets/TEMP/886ba8306b11283548115d746ec36b7534bbc0f5?width=386",
};

export default function Recipes() {
  const navigate = useNavigate();
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);

  useEffect(() => {
    const fetchMealPlan = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(`${API_BASE}/api/meal-plans/latest`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("token");
            navigate("/login");
            return;
          }
          if (response.status === 404) {
            setError("No meal plan found. Please create one first.");
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setMealPlan(data);
      } catch (err) {
        console.error("Error fetching meal plan:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch meal plan",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMealPlan();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
        <Header />
        <main className="flex-grow flex items-center justify-center pt-[120px] sm:pt-[160px] lg:pt-[220px]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg font-satoshi text-gray-600">
              Đang tải thực đơn của bạn...
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !mealPlan) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
        <Header />
        <main className="flex-grow flex items-center justify-center pt-[120px] sm:pt-[160px] lg:pt-[220px] px-4">
          <div className="text-center max-w-md">
            <p className="text-lg font-satoshi text-gray-800 mb-6">
              {error || "Chưa có thực đơn nào"}
            </p>
            <button
              onClick={() => navigate("/create-plan")}
              className="px-8 py-3 rounded-[25px] bg-gradient-to-r from-[#2596BE] to-[#6F3AFA] text-white font-black font-satoshi hover:shadow-lg transition-all"
            >
              Xây dựng thực đơn
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const currentDay = mealPlan.days[currentDayIndex];
  const mealsByType = currentDay.meals.reduce(
    (acc, meal) => {
      acc[meal.mealType] = meal;
      return acc;
    },
    {} as Record<string, Meal>,
  );

  const getPlaceholderImage = (mealType: string) => {
    const type = mealType.toLowerCase();
    return (
      placeholderImages[type as keyof typeof placeholderImages] ||
      placeholderImages.breakfast
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <Header />

      <main className="flex-grow px-4 sm:px-8 lg:px-16 xl:px-32 pb-8 sm:pb-12 lg:pb-16 pt-[120px] sm:pt-[160px] lg:pt-[220px]">
        <div className="max-w-[1728px] mx-auto">
          <div className="flex items-center justify-between mb-8 gap-4">
            <button
              onClick={() =>
                setCurrentDayIndex((prev) =>
                  prev > 0 ? prev - 1 : mealPlan.days.length - 1,
                )
              }
              className="px-6 py-2 rounded-[14px] bg-gradient-to-r from-[#2596BE] to-[#6F3AFA] text-white font-bold font-satoshi hover:shadow-lg transition-all"
            >
              ← Trước đó
            </button>
            <p className="text-lg lg:text-[25px] font-black text-gray-600 font-satoshi">
              {currentDay.title}
            </p>
            <button
              onClick={() =>
                setCurrentDayIndex((prev) =>
                  prev < mealPlan.days.length - 1 ? prev + 1 : 0,
                )
              }
              className="px-6 py-2 rounded-[18px] bg-gradient-to-r from-[#2596BE] to-[#6F3AFA] text-white font-bold font-satoshi hover:shadow-lg transition-all"
            >
              Tiếp theo →
            </button>
          </div>

          <div className="bg-white rounded-[25px] shadow-[0_27px_47px_9px_rgba(68,97,242,0.15)] p-6 sm:p-8 lg:p-12 relative">
            <h2 className="text-xl sm:text-2xl lg:text-[32px] font-black bg-gradient-to-r from-[#2596BE] to-[#6F3AFA] bg-clip-text text-transparent font-satoshi mb-6 sm:mb-8 py-2">
              {currentDay.theme}
            </h2>

            <div className="flex flex-wrap gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
              <div className="flex-1 min-w-[200px] bg-white rounded-[25px] shadow-[0_27px_47px_9px_rgba(68,97,242,0.15)] px-6 py-4 text-center">
                <span className="text-xl sm:text-2xl lg:text-[20px] font-bold text-black font-satoshi">
                  P {currentDay.macros.protein}g
                </span>
              </div>
              <div className="flex-1 min-w-[200px] bg-white rounded-[25px] shadow-[0_27px_47px_9px_rgba(68,97,242,0.15)] px-6 py-4 text-center">
                <span className="text-xl sm:text-2xl lg:text-[20px] font-bold text-black font-satoshi">
                  C {currentDay.macros.carbs}g
                </span>
              </div>
              <div className="flex-1 min-w-[200px] bg-white rounded-[25px] shadow-[0_27px_47px_9px_rgba(68,97,242,0.15)] px-6 py-4 text-center">
                <span className="text-xl sm:text-2xl lg:text-[20px] font-bold text-black font-satoshi">
                  F {currentDay.macros.fat}g
                </span>
              </div>
            </div>

            <div className="space-y-6 sm:space-y-8">
              {["breakfast", "lunch", "dinner"].map((mealType) => {
                const meal = mealsByType[mealType];
                if (!meal) return null;

                return (
                  <div
                    key={mealType}
                    className="bg-white rounded-[25px] shadow-[0_27px_47px_9px_rgba(68,97,242,0.15)] p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6"
                  >
                    <img
                      src={getPlaceholderImage(mealType)}
                      alt={meal.name}
                      className="w-full sm:w-32 md:w-40 lg:w-48 h-32 sm:h-32 md:h-40 lg:h-48 object-cover rounded-[25px] flex-shrink-0"
                    />
                    <div className="flex-1">
                      <p className="text-base sm:text-lg lg:text-[20px] leading-relaxed lg:leading-[50px] font-satoshi">
                        <span className="font-bold text-black">
                          {meal.name}
                        </span>
                        <br />
                        <span className="text-black">{meal.description}</span>
                        <br />
                        <span className="text-black">
                          Lợi ích: {meal.benefits.join("; ")}.
                        </span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {currentDay.tips && currentDay.tips.length > 0 && (
              <div className="mt-8 sm:mt-10 lg:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
                <p className="text-base sm:text-lg lg:text-[25px] font-bold text-black font-satoshi mb-4">
                  Mẹo hữu ích:
                </p>
                <ul className="space-y-2 text-base sm:text-lg lg:text-[20px] text-black font-satoshi">
                  {currentDay.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="absolute bottom-6 sm:bottom-8 lg:bottom-12 right-6 sm:right-8 lg:right-12">
              <div className="bg-gradient-to-r from-[#2596BE] to-[#6F3AFA] rounded-[18px] px-4 sm:px-6 py-2 sm:py-3">
                <span className="text-xl sm:text-2xl lg:text-[20px] font-black text-white font-satoshi">
                  ~{currentDay.totalCalories}kcal
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
