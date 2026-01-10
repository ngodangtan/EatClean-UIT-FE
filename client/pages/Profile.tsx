import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { API_BASE } from "@shared/api";

interface UserProfile {
  id: string;
  email: string;
  username: string;
  fullName: string;
  phone: string;
  birthday: string;
  gender: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch("/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        setProfile(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        const errorMsg =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMsg);
        // Redirect to login after 3 seconds if profile fetch fails
        setTimeout(() => {
          localStorage.removeItem("token");
          navigate("/login");
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <Header />

      <main className="flex-grow px-4 sm:px-8 lg:px-16 xl:px-32 py-8 sm:py-12 lg:py-16 mt-16 sm:mt-20 lg:mt-24">
        <div className="max-w-[1728px] mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="mb-8 sm:mb-12 flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Go back"
          >
            <svg
              className="w-10 h-10"
              viewBox="0 0 41 41"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M31.8531 20.0775L8.52079 20.2968M8.52079 20.2968L20.2966 31.8533M8.52079 20.2968L20.0773 8.52098"
                stroke="#1E1E1E"
                strokeWidth="3.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className="flex flex-col items-center mb-8 sm:mb-12 lg:mb-16">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/69d55d964d3a4c14df345661c3cc9a7a4e5c5141?width=529"
              alt="Profile"
              className="w-32 h-32 sm:w-40 sm:h-40 lg:w-[264px] lg:h-[264px] rounded-full object-cover mb-6 sm:mb-8"
            />
            {loading ? (
              <>
                <div className="w-40 h-10 bg-gray-200 rounded-lg mb-2 animate-pulse" />
                <div className="w-32 h-6 bg-gray-200 rounded-lg animate-pulse" />
              </>
            ) : error ? (
              <p className="text-red-500 text-center">{error}</p>
            ) : profile ? (
              <>
                <h1 className="text-3xl sm:text-4xl lg:text-[45px] font-bold text-[#0D141C] text-center mb-2 sm:mb-3 font-inter">
                  {profile.fullName}
                </h1>
                <p className="text-xl sm:text-2xl lg:text-[33px] text-[#4A739C] text-center font-inter">
                  Customer ID: {profile.id.substring(0, 8)}
                </p>
              </>
            ) : null}
          </div>

          <div className="max-w-3xl mx-auto space-y-8 sm:space-y-10 lg:space-y-12">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-[40px] font-bold text-[#0D141C] mb-6 sm:mb-8 font-inter">
                Contact Information
              </h2>

              <div className="space-y-6 sm:space-y-8">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-lg sm:text-xl lg:text-[38px] font-medium text-[#0D141C] mb-2 sm:mb-3 font-inter"
                  >
                    Email
                  </label>
                  <div className="w-full h-16 sm:h-20 lg:h-[77px] bg-[#F3F3FD] rounded-[29px] border border-gray-200 flex items-center px-6 sm:px-8">
                    {loading ? (
                      <div className="w-full h-6 bg-gray-300 rounded animate-pulse" />
                    ) : (
                      <p className="text-base sm:text-lg lg:text-2xl text-gray-700 font-inter">
                        {profile?.email}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="fullname"
                    className="block text-lg sm:text-xl lg:text-[38px] font-medium text-[#0D141C] mb-2 sm:mb-3 font-inter"
                  >
                    FullName
                  </label>
                  <div className="w-full h-16 sm:h-20 lg:h-[77px] bg-[#F3F3FD] rounded-[29px] border border-gray-200 flex items-center px-6 sm:px-8">
                    {loading ? (
                      <div className="w-full h-6 bg-gray-300 rounded animate-pulse" />
                    ) : (
                      <p className="text-base sm:text-lg lg:text-2xl text-gray-700 font-inter">
                        {profile?.fullName}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="gender"
                    className="block text-lg sm:text-xl lg:text-[38px] font-medium text-[#0D141C] mb-2 sm:mb-3 font-inter"
                  >
                    Gender
                  </label>
                  <div className="w-full h-16 sm:h-20 lg:h-[77px] bg-[#F3F3FD] rounded-[29px] border border-gray-200 flex items-center px-6 sm:px-8">
                    {loading ? (
                      <div className="w-full h-6 bg-gray-300 rounded animate-pulse" />
                    ) : (
                      <p className="text-base sm:text-lg lg:text-2xl text-gray-700 font-inter">
                        {profile?.gender || "Not specified"}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="birthday"
                    className="block text-lg sm:text-xl lg:text-[38px] font-medium text-[#0D141C] mb-2 sm:mb-3 font-inter"
                  >
                    Birthday
                  </label>
                  <div className="w-full h-16 sm:h-20 lg:h-[77px] bg-[#F3F3FD] rounded-[29px] border border-gray-200 flex items-center px-6 sm:px-8">
                    {loading ? (
                      <div className="w-full h-6 bg-gray-300 rounded animate-pulse" />
                    ) : (
                      <p className="text-base sm:text-lg lg:text-2xl text-gray-700 font-inter">
                        {profile?.birthday
                          ? new Date(profile.birthday).toLocaleDateString()
                          : "Not specified"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-[40px] font-bold text-[#0D141C] mb-6 sm:mb-8 font-inter">
                Security
              </h2>

              <button
                onClick={() => navigate("/change-password")}
                className="w-full flex items-center justify-between p-4 sm:p-6 hover:bg-gray-50 rounded-lg transition-colors group"
              >
                <span className="text-lg sm:text-xl lg:text-[38px] font-medium text-[#0D141C] font-inter">
                  Change Password
                </span>
                <svg
                  className="w-8 h-8 sm:w-10 sm:h-10 transition-transform group-hover:translate-x-2"
                  viewBox="0 0 39 39"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.96899 19.1253H30.2821M30.2821 19.1253L19.1256 7.96875M30.2821 19.1253L19.1256 30.2819"
                    stroke="#1E1E1E"
                    strokeWidth="3.18759"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
