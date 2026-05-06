import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Hero() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <section className="relative pt-40 sm:pt-48 lg:pt-56 pb-12 sm:pb-16 lg:pb-20 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <svg
          className="absolute top-20 sm:top-32 lg:top-48 left-1/2 -translate-x-1/2 w-full max-w-[1116px] h-auto opacity-50"
          viewBox="0 0 1728 1050"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_f)">
            <circle cx="1349.14" cy="500.14" r="126.14" fill="#4461F2" />
          </g>
          <g opacity="0.45" filter="url(#filter1_f)">
            <circle cx="520" cy="437" r="161" fill="#2A72DD" />
          </g>
          <defs>
            <filter
              id="filter0_f"
              x="869.14"
              y="20.1395"
              width="960"
              height="960"
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
                stdDeviation="176.93"
                result="effect1_foregroundBlur"
              />
            </filter>
            <filter
              id="filter1_f"
              x="-92.6549"
              y="-175.655"
              width="1225.31"
              height="1225.31"
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
                stdDeviation="225.827"
                result="effect1_foregroundBlur"
              />
            </filter>
          </defs>
        </svg>
      </div>

      <div className="max-w-[1728px] mx-auto px-4 sm:px-8 lg:px-16 xl:px-32">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-full border border-[#B4B4B4] bg-white/25 backdrop-blur-sm">
              <span className="text-lg sm:text-2xl lg:text-[32px] font-bold text-[#525252] font-satoshi">
                Lành Mạnh & Sạch
              </span>
              <svg
                className="w-12 h-12 sm:w-16 sm:h-16 lg:w-[71px] lg:h-[46px]"
                viewBox="0 0 72 47"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M59.6463 4.07656C58.3086 2.78417 56.7205 1.75896 54.9724 1.05949C53.2244 0.360018 51.3508 0 49.4587 0C47.5665 0 45.6929 0.360018 43.9449 1.05949C42.1969 1.75896 40.6087 2.78417 39.2711 4.07656L36.495 6.75746L33.719 4.07656C31.017 1.46725 27.3525 0.0013525 23.5314 0.00135252C19.7103 0.00135255 16.0457 1.46725 13.3438 4.07656C10.6419 6.68587 9.12393 10.2248 9.12393 13.915C9.12393 17.6051 10.6419 21.1441 13.3438 23.7534L16.1198 26.4343L36.495 46.1111L56.8702 26.4343L59.6463 23.7534C60.9845 22.4616 62.0461 20.9278 62.7704 19.2397C63.4947 17.5516 63.8675 15.7423 63.8675 13.915C63.8675 12.0877 63.4947 10.2783 62.7704 8.5902C62.0461 6.90209 60.9845 5.36834 59.6463 4.07656Z"
                  fill="url(#paint0_linear)"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear"
                    x1="9.12393"
                    y1="21.5185"
                    x2="62.555"
                    y2="21.8016"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#FF7070" />
                    <stop offset="1" stopColor="#FF7070" stopOpacity="0.65" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-7xl xl:text-[50px] font-bold leading-tight lg:leading-[75px] font-satoshi">
              <span className="bg-gradient-to-r from-[#2596BE] to-[#1678F2] bg-clip-text text-transparent py-2 inline-block">
                Giải Pháp Toàn Diện
              </span>
              <br />
              <span className="text-black">cho mọi nhu cầu dinh dưỡng của bạn.</span>
            </h2>

            <p className="text-xl sm:text-2xl lg:text-[28px] font-bold text-[#8A8585] leading-relaxed lg:leading-[43px] font-satoshi max-w-2xl">
              Dinh dưỡng thông minh bắt đầu từ đây. Chúng tôi dùng chỉ số BMI
              của bạn để đảm bảo mỗi bữa ăn đều phù hợp với bạn.
            </p>

            <Link
              to="/create-plan"
              className="inline-flex items-center gap-4 px-8 sm:px-12 lg:px-14 py-4 sm:py-6 lg:py-7 rounded-[32px] bg-gradient-to-r from-[#2596BE] to-[#6F3AFA] text-white text-2xl sm:text-4xl lg:text-[32px] font-black font-satoshi hover:shadow-2xl transition-all hover:scale-100 relative group"
            >
              Tạo kế hoạch
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/f3bec9aa701a6b227489d7d933c7aeab821ed8ed?width=170"
                alt=""
                className="w-14 h-14 sm:w-18 sm:h-18 lg:w-[60px] lg:h-[60px] absolute -top-2 -right-2 group-hover:rotate-12 transition-transform"
              />
            </Link>

          </div>

          <div className="relative">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/909ef9c7cf0bbf818211ad4ba9f3c749045a4c46?width=1450"
              alt="Healthy food ingredients"
              className="w-full h-auto rounded-[30px] shadow-2xl opacity-90"
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
