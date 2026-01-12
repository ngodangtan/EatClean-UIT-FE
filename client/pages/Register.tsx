import Header from "@/components/Header";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { API_BASE } from "@shared/api";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rePassword: "",
    username: "",
    phone: "",
    fullName: "",
    gender: "",
    birthday: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.email || !formData.password || !formData.fullName) {
      setError("Email, password, and full name are required");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (formData.password !== formData.rePassword) {
      setError("Passwords do not match");
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
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          username: formData.username || undefined,
          phone: formData.phone || undefined,
          fullName: formData.fullName,
          gender: formData.gender || undefined,
          birthday: formData.birthday || undefined,
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error(
          "Invalid response from server. Please try again later.",
        );
      }

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Store token if provided
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      setSuccess(true);
      // Redirect to login or home after 1.5 seconds
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-[#F3F3FD] relative overflow-hidden">
      <Header />

      <svg
        className="absolute top-48 left-8 lg:left-16 w-64 h-96 lg:w-[425px] lg:h-[486px] opacity-50 pointer-events-none"
        viewBox="0 0 804 1095"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_f)">
          <circle cx="378.581" cy="669.936" r="111.598" fill="#4461F2" />
        </g>
        <g opacity="0.45" filter="url(#filter1_f)">
          <circle cx="177.112" cy="407.236" r="111.598" fill="#4475F2" />
        </g>
        <defs>
          <filter
            id="filter0_f"
            x="-46.0855"
            y="245.27"
            width="849.333"
            height="849.333"
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
              stdDeviation="156.534"
              result="effect1_foregroundBlur"
            />
          </filter>
          <filter
            id="filter1_f"
            x="-247.555"
            y="-17.4311"
            width="849.333"
            height="849.333"
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
              stdDeviation="156.534"
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
                Sign Up to
                <br />
                get your nutrients
              </h1>

              <p className="text-xl sm:text-2xl lg:text-[27px] font-medium text-black font-satoshi">
                if you already have an account
                <br />
                you can{" "}
                <Link
                  to="/login"
                  className="font-bold text-[#4461F2] hover:underline"
                >
                  Login here!
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
                Welcome User
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
                    Registration successful! Redirecting to login...
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
                            x="3.45693"
                            y="3.45657"
                            width="17.2829"
                            height="17.2829"
                            rx="8.64147"
                            stroke="#667085"
                            strokeWidth="0.987597"
                          />
                          <path
                            d="M14.6112 9.87805L9.87866 14.6106"
                            stroke="#667085"
                            strokeWidth="0.987597"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M14.6132 14.6135L9.87671 9.87598"
                            stroke="#667085"
                            strokeWidth="0.987597"
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
                    Username (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full px-5 py-4 lg:py-5 rounded-[10px] bg-[#EAF0F7] text-black font-satoshi text-base focus:outline-none focus:ring-2 focus:ring-[#2596BE]"
                    />
                    {formData.username && (
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, username: "" })
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2"
                      >
                        <svg
                          className="w-6 h-6"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            x="3.45693"
                            y="3.45657"
                            width="17.2829"
                            height="17.2829"
                            rx="8.64147"
                            stroke="#667085"
                            strokeWidth="0.987597"
                          />
                          <path
                            d="M14.6112 9.87805L9.87866 14.6106"
                            stroke="#667085"
                            strokeWidth="0.987597"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M14.6132 14.6135L9.87671 9.87598"
                            stroke="#667085"
                            strokeWidth="0.987597"
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
                    Phone Number (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-5 py-4 lg:py-5 rounded-[10px] bg-[#EAF0F7] text-black font-satoshi text-base focus:outline-none focus:ring-2 focus:ring-[#2596BE]"
                    />
                    {formData.phone && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, phone: "" })}
                        className="absolute right-4 top-1/2 -translate-y-1/2"
                      >
                        <svg
                          className="w-6 h-6"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            x="3.45693"
                            y="3.45657"
                            width="17.2829"
                            height="17.2829"
                            rx="8.64147"
                            stroke="#667085"
                            strokeWidth="0.987597"
                          />
                          <path
                            d="M14.6112 9.87805L9.87866 14.6106"
                            stroke="#667085"
                            strokeWidth="0.987597"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M14.6132 14.6135L9.87671 9.87598"
                            stroke="#667085"
                            strokeWidth="0.987597"
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
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-5 py-4 lg:py-5 rounded-[10px] bg-[#EAF0F7] text-black font-satoshi text-base focus:outline-none focus:ring-2 focus:ring-[#2596BE]"
                      required
                    />
                    <button
                      type="button"
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
                          d="M12.3562 13.8918C10.8484 13.8918 9.62539 12.6695 9.62539 11.161C9.62539 10.3967 9.93828 9.70766 10.4443 9.21127C10.6321 9.02698 10.635 8.72528 10.4507 8.53742C10.2664 8.34955 9.96473 8.34666 9.77686 8.53096C9.0959 9.199 8.67236 10.1301 8.67236 11.161C8.67236 13.196 10.3223 14.8448 12.3562 14.8448C13.3861 14.8448 14.3182 14.4214 14.9863 13.7403C15.1706 13.5525 15.1677 13.2508 14.9798 13.0665C14.7919 12.8822 14.4902 12.8851 14.3059 13.0729C13.8096 13.5789 13.1197 13.8918 12.3562 13.8918Z"
                          fill="#677185"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M20.4185 19.1223C20.5997 18.941 20.5997 18.6472 20.4185 18.466L5.05124 3.09875C4.87001 2.91752 4.57618 2.91752 4.39495 3.09875C4.21373 3.27997 4.21373 3.5738 4.39495 3.75503L19.7622 19.1223C19.9434 19.3035 20.2372 19.3035 20.4185 19.1223Z"
                          fill="#677185"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm sm:text-base lg:text-[18px] font-medium text-[#4F555A] mb-2 tracking-wide font-satoshi">
                    Enter Re-Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      name="rePassword"
                      value={formData.rePassword}
                      onChange={handleChange}
                      className="w-full px-5 py-4 lg:py-5 rounded-[10px] bg-[#EAF0F7] text-black font-satoshi text-base focus:outline-none focus:ring-2 focus:ring-[#2596BE]"
                      required
                    />
                    {formData.rePassword && (
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, rePassword: "" })
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2"
                      >
                        <svg
                          className="w-6 h-6"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            x="3.45693"
                            y="3.45657"
                            width="17.2829"
                            height="17.2829"
                            rx="8.64147"
                            stroke="#667085"
                            strokeWidth="0.987597"
                          />
                          <path
                            d="M14.6112 9.87805L9.87866 14.6106"
                            stroke="#667085"
                            strokeWidth="0.987597"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M14.6132 14.6135L9.87671 9.87598"
                            stroke="#667085"
                            strokeWidth="0.987597"
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
                    Enter FullName
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full px-5 py-4 lg:py-5 rounded-[10px] bg-[#EAF0F7] text-black font-satoshi text-base focus:outline-none focus:ring-2 focus:ring-[#2596BE]"
                      required
                    />
                    {formData.fullName && (
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, fullName: "" })
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2"
                      >
                        <svg
                          className="w-6 h-6"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            x="3.45693"
                            y="3.45657"
                            width="17.2829"
                            height="17.2829"
                            rx="8.64147"
                            stroke="#667085"
                            strokeWidth="0.987597"
                          />
                          <path
                            d="M14.6112 9.87805L9.87866 14.6106"
                            stroke="#667085"
                            strokeWidth="0.987597"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M14.6132 14.6135L9.87671 9.87598"
                            stroke="#667085"
                            strokeWidth="0.987597"
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
                    Select Gender
                  </label>
                  <div className="relative">
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-5 py-4 lg:py-5 rounded-[10px] bg-[#EAF0F7] text-black font-satoshi text-base focus:outline-none focus:ring-2 focus:ring-[#2596BE] appearance-none cursor-pointer"
                      required
                    >
                      <option value="">Select...</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    <svg
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 pointer-events-none"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 15L7 10H17L12 15Z" fill="#1D1B20" />
                    </svg>
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm sm:text-base lg:text-[18px] font-medium text-[#4F555A] mb-2 tracking-wide font-satoshi">
                    Enter Birthday
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="birthday"
                      value={formData.birthday}
                      onChange={handleChange}
                      className="w-full px-5 py-4 lg:py-5 rounded-[10px] bg-[#EAF0F7] text-black font-satoshi text-base focus:outline-none focus:ring-2 focus:ring-[#2596BE]"
                      required
                    />
                    <svg
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 pointer-events-none"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16 2V6M8 2V6M3 10H21M5 4H19C20.1046 4 21 4.89543 21 6V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4Z"
                        stroke="#1E1E1E"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="flex-1 h-px bg-[#DFDFDF]" />
                  <span className="px-4 text-xs sm:text-sm lg:text-[14px] font-medium text-[#C7C7C7] tracking-wide font-satoshi">
                    Having Problem ?
                  </span>
                  <div className="flex-1 h-px bg-[#DFDFDF]" />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || success}
                  className="w-full py-4 lg:py-5 rounded-[10px] bg-[#2596BE] text-white text-base sm:text-lg lg:text-[19px] font-bold tracking-wide font-satoshi hover:bg-[#1e7a9e] transition-colors shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
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
                      Registering...
                    </span>
                  ) : (
                    "Register"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
