import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Analyzing() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate progress animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // After analysis is complete, redirect to results page
          setTimeout(() => {
            navigate("/results");
          }, 1000);
          return 100;
        }
        return prev + 5;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <Header />

      <main className="flex-grow flex items-center justify-center px-4 py-8 sm:py-12 lg:py-16">
        <div className="w-full max-w-6xl mx-auto">
          {/* Main heading */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black text-center mb-8 sm:mb-12 lg:mb-16 font-satoshi max-w-4xl mx-auto leading-tight">
            We are analyzing your profile to create a personalized muscle gain plan
          </h1>

          {/* Loading indicator */}
          <div className="flex justify-center mb-12 sm:mb-16 lg:mb-20">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
              {/* Circular progress */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                {/* Background circle */}
                <circle
                  cx="100"
                  cy="100"
                  r="85"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="8"
                  strokeDasharray="4 4"
                />
                
                {/* Progress circle */}
                <circle
                  cx="100"
                  cy="100"
                  r="85"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="12"
                  strokeDasharray={`${(progress / 100) * 534} 534`}
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />
                
                {/* Gradient definition */}
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2596BE" />
                    <stop offset="100%" stopColor="#6F3AFA" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Percentage text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#2596BE] font-satoshi">
                  {progress}%
                </span>
              </div>
            </div>
          </div>

          {/* Information card */}
          <div className="max-w-3xl mx-auto bg-white rounded-[33px] shadow-[0_27px_47px_9px_rgba(68,97,242,0.15)] p-8 sm:p-10 lg:p-12">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-black mb-6 sm:mb-8 font-satoshi">
              You are among the top candidates for body transformation
            </h2>

            <ul className="space-y-6 sm:space-y-8">
              <li className="flex items-start gap-3 sm:gap-4">
                <span className="text-2xl sm:text-3xl text-[#2596BE] flex-shrink-0">•</span>
                <p className="text-lg sm:text-xl lg:text-2xl text-black font-satoshi leading-relaxed">
                  Based on your answers, you can gain about 1 kg of lean mass in the first two weeks
                </p>
              </li>

              <li className="flex items-start gap-3 sm:gap-4">
                <span className="text-2xl sm:text-3xl text-[#2596BE] flex-shrink-0">•</span>
                <p className="text-lg sm:text-xl lg:text-2xl text-black font-satoshi leading-relaxed">
                  87% of similar users achieved their fitness goals within planned periods
                </p>
              </li>

              <li className="flex items-start gap-3 sm:gap-4">
                <span className="text-2xl sm:text-3xl text-[#2596BE] flex-shrink-0">•</span>
                <p className="text-lg sm:text-xl lg:text-2xl text-black font-satoshi leading-relaxed">
                  Your profile is perfect for a high-protein muscle building diet
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
