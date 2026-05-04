import Header from "../components/Header";
import Footer from "../components/Footer";

interface Meal {
  name: string;
  description: string;
  benefits: string;
  image: string;
}

interface DayPlan {
  day: number;
  theme: string;
  protein: string;
  carbs: string;
  fat: string;
  description: string;
  meals: {
    breakfast: Meal;
    lunch: Meal;
    dinner: Meal;
  };
  calories: string;
}

export default function Results() {
  const mealPlan: DayPlan[] = [
    {
      day: 1,
      theme: "Olive oil & colorful greens",
      protein: "P 110g",
      carbs: "C 220g",
      fat: "F 70g",
      description:
        "Classic start: extra‑virgin olive oil, vegetables, seafood or poultry, and whole grains.\nUse extra‑virgin olive oil as the main fat\nBuild plates around vegetables, legumes and whole grains\nFish or seafood 2–3× weekly",
      meals: {
        breakfast: {
          name: "Breakfast — tomato toast & feta",
          description:
            "Whole‑grain toast rubbed with tomato + olive oil; crumble of feta; fruit.",
          benefits:
            "Benefits: Olive oil polyphenols and lycopene; dairy calcium; fiber. Vitamins: A, E, K, C, calcium.",
          image:
            "https://api.builder.io/api/v1/image/assets/TEMP/46e92b799fb5ad3b19df51abdb9d9e139651dac3?width=386",
        },
        lunch: {
          name: "Lunch — Greek chickpea salad",
          description:
            "Chickpeas, tomato, cucumber, olives, red onion, feta; olive oil & lemon.",
          benefits:
            "Benefits: Plant protein and fiber; heart‑healthy fats; antioxidants. Vitamins: Folate, K, C, E.",
          image:
            "https://api.builder.io/api/v1/image/assets/TEMP/75f7665a79e8e874dd19c1341ef172c09bafa0bd?width=386",
        },
        dinner: {
          name: "Dinner — baked salmon & bulgur",
          description:
            "Oven salmon with herbs; bulgur; arugula salad with olive oil & lemon.",
          benefits:
            "Benefits: Omega‑3s; whole‑grain carbs; leafy greens for micronutrients. Vitamins: D, B12.",
          image:
            "https://api.builder.io/api/v1/image/assets/TEMP/886ba8306b11283548115d746ec36b7534bbc0f5?width=386",
        },
      },
      calories: "~2000kcal",
    },
    {
      day: 2,
      theme: "Olive oil & colorful greens",
      protein: "P 110g",
      carbs: "C 220g",
      fat: "F 70g",
      description:
        "Classic start: extra‑virgin olive oil, vegetables, seafood or poultry, and whole grains.\nUse extra‑virgin olive oil as the main fat\nBuild plates around vegetables, legumes and whole grains\nFish or seafood 2–3× weekly",
      meals: {
        breakfast: {
          name: "Breakfast — tomato toast & feta",
          description:
            "Whole‑grain toast rubbed with tomato + olive oil; crumble of feta; fruit.",
          benefits:
            "Benefits: Olive oil polyphenols and lycopene; dairy calcium; fiber. Vitamins: A, E, K, C, calcium.",
          image:
            "https://api.builder.io/api/v1/image/assets/TEMP/46e92b799fb5ad3b19df51abdb9d9e139651dac3?width=386",
        },
        lunch: {
          name: "Lunch — Greek chickpea salad",
          description:
            "Chickpeas, tomato, cucumber, olives, red onion, feta; olive oil & lemon.",
          benefits:
            "Benefits: Plant protein and fiber; heart‑healthy fats; antioxidants. Vitamins: Folate, K, C, E.",
          image:
            "https://api.builder.io/api/v1/image/assets/TEMP/75f7665a79e8e874dd19c1341ef172c09bafa0bd?width=386",
        },
        dinner: {
          name: "Dinner — baked salmon & bulgur",
          description:
            "Oven salmon with herbs; bulgur; arugula salad with olive oil & lemon.",
          benefits:
            "Benefits: Omega‑3s; whole‑grain carbs; leafy greens for micronutrients. Vitamins: D, B12.",
          image:
            "https://api.builder.io/api/v1/image/assets/TEMP/886ba8306b11283548115d746ec36b7534bbc0f5?width=386",
        },
      },
      calories: "~2000kcal",
    },
    {
      day: 3,
      theme: "Olive oil & colorful greens",
      protein: "P 110g",
      carbs: "C 220g",
      fat: "F 70g",
      description:
        "Classic start: extra‑virgin olive oil, vegetables, seafood or poultry, and whole grains.\nUse extra‑virgin olive oil as the main fat\nBuild plates around vegetables, legumes and whole grains\nFish or seafood 2–3× weekly",
      meals: {
        breakfast: {
          name: "Breakfast — tomato toast & feta",
          description:
            "Whole‑grain toast rubbed with tomato + olive oil; crumble of feta; fruit.",
          benefits:
            "Benefits: Olive oil polyphenols and lycopene; dairy calcium; fiber. Vitamins: A, E, K, C, calcium.",
          image:
            "https://api.builder.io/api/v1/image/assets/TEMP/46e92b799fb5ad3b19df51abdb9d9e139651dac3?width=386",
        },
        lunch: {
          name: "Lunch — Greek chickpea salad",
          description:
            "Chickpeas, tomato, cucumber, olives, red onion, feta; olive oil & lemon.",
          benefits:
            "Benefits: Plant protein and fiber; heart‑healthy fats; antioxidants. Vitamins: Folate, K, C, E.",
          image:
            "https://api.builder.io/api/v1/image/assets/TEMP/75f7665a79e8e874dd19c1341ef172c09bafa0bd?width=386",
        },
        dinner: {
          name: "Dinner — baked salmon & bulgur",
          description:
            "Oven salmon with herbs; bulgur; arugula salad with olive oil & lemon.",
          benefits:
            "Benefits: Omega‑3s; whole‑grain carbs; leafy greens for micronutrients. Vitamins: D, B12.",
          image:
            "https://api.builder.io/api/v1/image/assets/TEMP/886ba8306b11283548115d746ec36b7534bbc0f5?width=386",
        },
      },
      calories: "~2000kcal",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <Header />

      <main className="flex-grow px-4 sm:px-8 lg:px-16 xl:px-32 py-8 sm:py-12 lg:py-16 mt-40 sm:mt-48 lg:mt-56">
        <div className="max-w-[1728px] mx-auto">
          <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-black bg-gradient-to-r from-[#2596BE] to-[#6F3AFA] bg-clip-text text-transparent font-satoshi mb-4 sm:mb-6">
            Meal plan for you
          </h1>

          <p className="text-lg sm:text-xl lg:text-[28px] font-bold text-black leading-relaxed lg:leading-[76px] font-satoshi mb-8 sm:mb-12 lg:mb-16">
            Vegetable‑forward meals, extra‑virgin olive oil, fish and legumes —
            practical, tasty and heart‑friendly.
          </p>

          <div className="space-y-8 sm:space-y-12 lg:space-y-16">
            {mealPlan.map((day) => (
              <div
                key={day.day}
                className="bg-white rounded-[33px] shadow-[0_27px_47px_9px_rgba(68,97,242,0.15)] p-6 sm:p-8 lg:p-12 relative"
              >
                <div className="inline-block bg-gradient-to-r from-[#2596BE] to-[#6F3AFA] rounded-[18px] px-6 sm:px-8 py-2 sm:py-3 mb-6 sm:mb-8">
                  <span className="text-2xl sm:text-3xl lg:text-[36px] font-black text-white font-satoshi">
                    Day {day.day}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl lg:text-[32px] font-black bg-gradient-to-r from-[#2596BE] to-[#6F3AFA] bg-clip-text text-transparent font-satoshi mb-6 sm:mb-8">
                  {day.theme}
                </h2>

                <div className="flex flex-wrap gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
                  <div className="flex-1 min-w-[200px] bg-white rounded-[33px] shadow-[0_27px_47px_9px_rgba(68,97,242,0.15)] px-6 py-4 text-center">
                    <span className="text-xl sm:text-2xl lg:text-[27px] font-bold text-black font-satoshi">
                      {day.protein}
                    </span>
                  </div>
                  <div className="flex-1 min-w-[200px] bg-white rounded-[33px] shadow-[0_27px_47px_9px_rgba(68,97,242,0.15)] px-6 py-4 text-center">
                    <span className="text-xl sm:text-2xl lg:text-[27px] font-bold text-black font-satoshi">
                      {day.carbs}
                    </span>
                  </div>
                  <div className="flex-1 min-w-[200px] bg-white rounded-[33px] shadow-[0_27px_47px_9px_rgba(68,97,242,0.15)] px-6 py-4 text-center">
                    <span className="text-xl sm:text-2xl lg:text-[27px] font-bold text-black font-satoshi">
                      {day.fat}
                    </span>
                  </div>
                </div>

                <p className="text-base sm:text-lg lg:text-[27px] text-black leading-relaxed lg:leading-[64px] font-satoshi mb-8 sm:mb-10 lg:mb-12 whitespace-pre-line">
                  {day.description}
                </p>

                <div className="space-y-6 sm:space-y-8">
                  {Object.values(day.meals).map((meal, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-[33px] shadow-[0_27px_47px_9px_rgba(68,97,242,0.15)] p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6"
                    >
                      <img
                        src={meal.image}
                        alt={meal.name}
                        className="w-full sm:w-32 md:w-40 lg:w-48 h-32 sm:h-32 md:h-40 lg:h-48 object-cover rounded-[30px] flex-shrink-0"
                      />
                      <div className="flex-1">
                        <p className="text-base sm:text-lg lg:text-[27px] leading-relaxed lg:leading-[64px] font-satoshi">
                          <span className="font-bold text-black">
                            {meal.name}
                          </span>
                          <br />
                          <span className="text-black">{meal.description}</span>
                          <br />
                          <span className="text-black">{meal.benefits}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="absolute bottom-6 sm:bottom-8 lg:bottom-12 right-6 sm:right-8 lg:right-12">
                  <div className="bg-gradient-to-r from-[#2596BE] to-[#6F3AFA] rounded-[18px] px-4 sm:px-6 py-2 sm:py-3">
                    <span className="text-xl sm:text-2xl lg:text-[36px] font-black text-white font-satoshi">
                      {day.calories}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
