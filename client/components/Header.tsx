import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const isRegisterPage = location.pathname === "/register";
  const isLoginPage = location.pathname === "/login";
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.ok) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        navigate("/login");
      } else {
        console.error("Logout failed:", data);
        // Still clear local data on error
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Clear local data even if API call fails
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      navigate("/login");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#F3F3FD]/80 backdrop-blur-sm">
      <div className="max-w-[1728px] mx-auto px-4 sm:px-8 lg:px-16 xl:px-32 py-4 sm:py-6 lg:py-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 sm:gap-4">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/8511015090e6338ffab46757871278a3e2b52935?width=268"
              alt="EatClean Logo"
              className="w-16 h-16 sm:w-20 sm:h-20 lg:w-[134px] lg:h-[134px]"
            />
            <h1 className="text-2xl sm:text-3xl lg:text-3xl font-black bg-gradient-to-r from-[#2596BE] to-[#6F3AFA] bg-clip-text text-transparent font-satoshi">
              EatClean
            </h1>
          </Link>

          <nav className="hidden md:flex items-center gap-6 lg:gap-12">
            <Link
              to="/"
              className="text-base lg:text-lg font-bold text-[#404040] hover:text-[#2596BE] transition-colors relative group"
            >
              Home
            </Link>
            <Link
              to="/create-plan"
              className="text-base lg:text-lg font-normal text-black hover:text-[#2596BE] transition-colors font-inter"
            >
              Create plan
            </Link>
            <Link
              to="/recipes"
              className="text-base lg:text-lg font-normal text-black hover:text-[#2596BE] transition-colors font-inter"
            >
              Recipes
            </Link>
          </nav>

          <div className="flex items-center gap-4 lg:gap-6">
            {isLoggedIn && !isRegisterPage && !isLoginPage ? (
              <div className="relative group">
                <Link
                  to="/profile"
                  className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-[#DB4444] rounded-full hover:shadow-lg transition-all hover:scale-105"
                  aria-label="Profile"
                >
                  <svg
                    className="w-12 h-12 sm:w-14 sm:h-14"
                    viewBox="0 0 50 50"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="50" height="50" rx="25" fill="#DB4444" />
                    <path
                      d="M32.8125 35.9375V33.3333C32.8125 31.952 32.3296 30.6272 31.4701 29.6505C30.6105 28.6737 29.4447 28.125 28.2292 28.125H20.2083C18.9928 28.125 17.827 28.6737 16.9674 29.6505C16.1079 30.6272 15.625 31.952 15.625 33.3333V35.9375"
                      stroke="white"
                      strokeWidth="2.34375"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M25 23.4375C27.5888 23.4375 29.6875 21.3388 29.6875 18.75C29.6875 16.1612 27.5888 14.0625 25 14.0625C22.4112 14.0625 20.3125 16.1612 20.3125 18.75C20.3125 21.3388 22.4112 23.4375 25 23.4375Z"
                      stroke="white"
                      strokeWidth="2.34375"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="py-2">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {(isRegisterPage || isLoginPage) && (
                  <>

                    <Link
                      to="/login"
                      className={`text-base lg:text-[25px] font-bold font-satoshi transition-colors relative ${
                        isLoginPage ? "text-[#4461F2]" : "text-black"
                      }`}
                    >
                      Log in
                      {isLoginPage && (
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-[#4461F2]" />
                      )}
                    </Link>
                  </>
                )}

                {!isLoggedIn && (
                  <Link
                    to={isLoginPage ? "/register" : "/login"}
                    className="px-6 py-2 sm:px-8 sm:py-3 lg:px-10 lg:py-4 rounded-xl sm:rounded-[14.5px] bg-gradient-to-r from-[#2596BE] to-[#6F3AFA] text-white text-base sm:text-xl lg:text-xl font-black font-satoshi hover:shadow-lg transition-all hover:scale-105"
                  >
                    {isLoginPage ? "Register" : "Log In"}
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
