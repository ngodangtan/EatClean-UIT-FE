import Header from "@/components/Header";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { LoginRequest, LoginResponse, ApiError, API_BASE } from "@shared/api";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        } as LoginRequest),
      });

      let data: LoginResponse | ApiError;
      try {
        data = await response.json();
      } catch {
        throw new Error(
          "Invalid response from server. Please try again later.",
        );
      }

      if (!response.ok) {
        const errorData = data as ApiError;
        throw new Error(errorData.message || "Login failed");
      }

      // Store token and user info
      const successData = data as LoginResponse;
      if (successData.accessToken) {
        localStorage.setItem("token", successData.accessToken);
        if (successData.refreshToken) {
          localStorage.setItem("refreshToken", successData.refreshToken);
        }
        if (successData.user) {
          localStorage.setItem("user", JSON.stringify(successData.user));
        }
      }

      setSuccess(true);
      // Redirect to home after 1.5 seconds
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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
            height="846.061"
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
            width="846.06"
            height="846.061"
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

      <main className="pt-40 sm:pt-48 lg:pt-56 pb-12 sm:pb-16">
        <div className="max-w-[1728px] mx-auto px-4 sm:px-8 lg:px-16 xl:px-32">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="space-y-6 sm:space-y-8 relative z-10">
              <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-bold leading-tight lg:leading-[76px] text-black font-satoshi">
                Sign In to
                <br />
                get your nutrients
              </h1>

              <p className="text-xl sm:text-2xl lg:text-[27px] font-medium text-black font-satoshi">
                if you don't have an account
                <br />
                you can{" "}
                <Link
                  to="/register"
                  className="font-bold text-[#4461F2] hover:underline"
                >
                  Register here!
                </Link>
              </p>

              <div className="hidden lg:block">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/da4e317e1d6ccf6023bfa9ce351f048a1c1f576e?width=1864"
                  alt="Healthy vegetables and fruits in heart shape"
                  className="w-full max-w-[600px] h-auto"
                />
              </div>
            </div>

            <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 sm:p-8 lg:p-10 relative z-10">
              <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-bold text-black font-satoshi mb-6 sm:mb-8">
                Welcome Back
              </h2>

              {error && (
                <div className="mb-4 p-4 rounded-[10px] bg-red-50 border border-red-200">
                  <p className="text-red-600 text-sm sm:text-base font-satoshi">
                    {error}
                  </p>
                </div>
              )}

              {success && (
                <div className="mb-4 p-4 rounded-[10px] bg-green-50 border border-green-200">
                  <p className="text-green-600 text-sm sm:text-base font-satoshi">
                    Login successful! Redirecting...
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div className="relative">
                  <label className="block text-sm sm:text-base lg:text-[18px] font-medium text-[#4F555A] mb-2 tracking-wide font-satoshi">
                    Enter Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-5 py-4 lg:py-5 rounded-[10px] bg-[#EAF0F7] text-black font-satoshi text-base focus:outline-none focus:ring-2 focus:ring-[#2596BE]"
                      required
                    />
                    {formData.email && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, email: "" })}
                        className="absolute right-4 top-1/2 -translate-y-1/2"
                      >
                        <svg
                          className="w-6 h-6"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            x="3.44331"
                            y="3.44331"
                            width="17.2163"
                            height="17.2163"
                            rx="8.60817"
                            stroke="#667085"
                            strokeWidth="0.983791"
                          />
                          <path
                            d="M14.5549 9.84009L9.84058 14.5544"
                            stroke="#667085"
                            strokeWidth="0.983791"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M14.5564 14.5571L9.83813 9.83789"
                            stroke="#667085"
                            strokeWidth="0.983791"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm sm:text-base lg:text-[18px] font-medium text-[#4F555A] mb-2 tracking-wide font-satoshi">
                    Enter Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full px-5 py-4 lg:py-5 rounded-[10px] bg-[#EAF0F7] text-[#667085] font-inter text-xl focus:outline-none focus:ring-2 focus:ring-[#2596BE]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                    >
                      <svg
                        className="w-6 h-6"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12.3083 13.8382C10.8064 13.8382 9.58802 12.6206 9.58802 11.1179C9.58802 10.3566 9.89971 9.67021 10.4037 9.17573C10.5909 8.99215 10.5938 8.69161 10.4102 8.50447C10.2266 8.31733 9.92606 8.31445 9.73892 8.49804C9.06058 9.1635 8.63867 10.091 8.63867 11.1179C8.63867 13.1451 10.2822 14.7876 12.3083 14.7876C13.3343 14.7876 14.2627 14.3657 14.9282 13.6874C15.1118 13.5002 15.1089 13.1997 14.9218 13.0161C14.7347 12.8325 14.4341 12.8354 14.2505 13.0225C13.7561 13.5265 13.0689 13.8382 12.3083 13.8382Z"
                          fill="#677185"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M20.3398 19.0487C20.5204 18.8682 20.5204 18.5755 20.3398 18.3949L5.03183 3.08692C4.8513 2.90639 4.5586 2.90639 4.37807 3.08692C4.19754 3.26745 4.19754 3.56015 4.37807 3.74068L19.6861 19.0487C19.8666 19.2292 20.1593 19.2292 20.3398 19.0487Z"
                          fill="#677185"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-end pt-2">
                  <Link
                    to="/forgot-password"
                    className="text-xs sm:text-sm lg:text-[14px] font-medium text-black tracking-wide font-satoshi hover:text-[#4461F2] transition-colors"
                  >
                    Recover Password ?
                  </Link>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoading || success}
                    className="w-full py-4 lg:py-5 rounded-[14.5px] bg-gradient-to-r from-[#2596BE] to-[#6F3AFA] text-white text-base sm:text-lg lg:text-xl font-bold tracking-wide font-satoshi hover:shadow-xl transition-all hover:scale-[1.02] shadow-[0_11.8px_20.66px_3.935px_rgba(68,97,242,0.15)] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="animate-spin h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Signing In...
                      </span>
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
