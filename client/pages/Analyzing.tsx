import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

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
    const createHealthProfile = async () => {
      const timeout = 3 * 60 * 1000; // 3 minutes in milliseconds
      let timeoutId: NodeJS.Timeout;

      try {
        // Get the health profile data from localStorage
        const healthDataStr = localStorage.getItem("healthProfileData");
        if (!healthDataStr) {
          setError(
            "No health profile data found. Please complete the questionnaire.",
          );
          setIsLoading(false);
          setTimeout(() => navigate("/create-plan"), 2000);
          return;
        }

        const healthData = JSON.parse(healthDataStr);
        const token = localStorage.getItem("token");

        console.log("Health data from storage:", healthData);
        console.log("Token from storage:", token);

        if (!token) {
          setError("Please log in to continue");
          setIsLoading(false);
          setTimeout(() => navigate("/login"), 2000);
          return;
        }

        // Map and prepare the data for the API
        const apiData = {
          goal: mapGoal(healthData.goal),
          triedHealthyBefore: healthData.triedHealthyBefore,
          hungryTime: healthData.hungryTime,
          favoriteMeal: healthData.favoriteMeal,
          height: healthData.height,
          currentWeight: healthData.currentWeight,
          desiredWeight: healthData.desiredWeight,
          activityLevel: mapActivityLevel(healthData.activityLevel),
          averageDay: healthData.averageDay,
          workSchedule: Array.isArray(healthData.workSchedule)
            ? healthData.workSchedule.join(", ")
            : healthData.workSchedule,
          sleepDuration: mapSleepDuration(healthData.sleepDuration),
          diseases: Array.isArray(healthData.diseases)
            ? healthData.diseases
            : [healthData.diseases],
          dietPreference: healthData.dietPreference,
          mealsPerDay: mapMealsPerDay(healthData.mealsPerDay),
          cuisinePreference: Array.isArray(healthData.cuisinePreference)
            ? healthData.cuisinePreference
            : [healthData.cuisinePreference],
        };

        console.log("=== Sending API request to /api/health-profile ===");
        console.log(
          "Authorization header:",
          `Bearer ${token.substring(0, 50)}...`,
        );
        console.log("Request body - All parameters:");
        console.table({
          goal: apiData.goal,
          triedHealthyBefore: apiData.triedHealthyBefore,
          hungryTime: apiData.hungryTime,
          favoriteMeal: apiData.favoriteMeal,
          height: apiData.height,
          currentWeight: apiData.currentWeight,
          desiredWeight: apiData.desiredWeight,
          activityLevel: apiData.activityLevel,
          averageDay: apiData.averageDay,
          workSchedule: apiData.workSchedule,
          sleepDuration: apiData.sleepDuration,
          diseases: apiData.diseases.join(", "),
          dietPreference: apiData.dietPreference,
          mealsPerDay: apiData.mealsPerDay,
          cuisinePreference: apiData.cuisinePreference.join(", "),
        });

        // Create an abort controller for the fetch request
        const controller = new AbortController();
        timeoutId = setTimeout(() => {
          controller.abort();
        }, timeout);

        // Call the API with timeout
        const response = await fetch("/api/health-profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(apiData),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        console.log("API Response status:", response.status);
        console.log("API Response ok:", response.ok);

        // Check response status first
        if (!response.ok) {
          let responseData;
          try {
            responseData = await response.json();
          } catch {
            throw new Error(
              `Server returned ${response.status}: ${response.statusText}`,
            );
          }
          throw new Error(
            responseData.message || "Failed to create health profile",
          );
        }

        // Parse successful response
        let responseData;
        try {
          responseData = await response.json();
        } catch (err) {
          console.error("Failed to parse response:", err);
          throw new Error("Invalid response format from server");
        }

        console.log("Health profile created successfully:", responseData);

        // Clean up localStorage
        localStorage.removeItem("healthProfileData");

        // Set loading to false and redirect after a short delay
        setIsLoading(false);
        setTimeout(() => {
          navigate("/results");
        }, 1000);
      } catch (err) {
        clearTimeout(timeoutId);
        console.error("Error creating health profile:", err);

        if (err instanceof Error) {
          if (err.name === "AbortError") {
            setError(
              "Request timeout. The analysis took too long. Please try again.",
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

    // Start the API call immediately
    createHealthProfile();

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

          {/* Information card */}
          <div className="max-w-3xl mx-auto bg-white rounded-[33px] shadow-[0_27px_47px_9px_rgba(68,97,242,0.15)] p-8 sm:p-10 lg:p-12">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-black mb-6 sm:mb-8 font-satoshi">
              You are among the top candidates for body transformation
            </h2>

            <ul className="space-y-6 sm:space-y-8">
              <li className="flex items-start gap-3 sm:gap-4">
                <span className="text-2xl sm:text-3xl text-[#2596BE] flex-shrink-0">
                  •
                </span>
                <p className="text-lg sm:text-xl lg:text-2xl text-black font-satoshi leading-relaxed">
                  Based on your answers, you can gain about 1 kg of lean mass in
                  the first two weeks
                </p>
              </li>

              <li className="flex items-start gap-3 sm:gap-4">
                <span className="text-2xl sm:text-3xl text-[#2596BE] flex-shrink-0">
                  •
                </span>
                <p className="text-lg sm:text-xl lg:text-2xl text-black font-satoshi leading-relaxed">
                  87% of similar users achieved their fitness goals within
                  planned periods
                </p>
              </li>

              <li className="flex items-start gap-3 sm:gap-4">
                <span className="text-2xl sm:text-3xl text-[#2596BE] flex-shrink-0">
                  •
                </span>
                <p className="text-lg sm:text-xl lg:text-2xl text-black font-satoshi leading-relaxed">
                  Your profile is perfect for a high-protein muscle building
                  diet
                </p>
              </li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
