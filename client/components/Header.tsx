import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  const isRegisterPage = location.pathname === "/register";
  const isLoginPage = location.pathname === "/login";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-page-bg/80 backdrop-blur-sm">
      <div className="max-w-[1728px] mx-auto px-4 sm:px-8 lg:px-16 xl:px-32 py-4 sm:py-6 lg:py-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 sm:gap-4">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/8511015090e6338ffab46757871278a3e2b52935?width=268"
              alt="EatClean Logo"
              className="w-16 h-16 sm:w-20 sm:h-20 lg:w-[134px] lg:h-[134px]"
            />
            <h1 className="text-2xl sm:text-3xl lg:text-[43px] font-black bg-gradient-to-r from-[#2596BE] to-[#6F3AFA] bg-clip-text text-transparent font-satoshi">
              EatClean
            </h1>
          </Link>

          <nav className="hidden md:flex items-center gap-6 lg:gap-12">
            <Link
              to="/"
              className="text-base lg:text-[25px] font-bold text-[#404040] hover:text-[#2596BE] transition-colors relative group"
            >
              Home
            </Link>
            <Link
              to="/create-plan"
              className="text-base lg:text-[25px] font-normal text-black hover:text-[#2596BE] transition-colors font-inter"
            >
              Create plan
            </Link>
            <Link
              to="/recipes"
              className="text-base lg:text-[25px] font-normal text-black hover:text-[#2596BE] transition-colors font-inter"
            >
              Recipes
            </Link>
          </nav>

          <div className="flex items-center gap-4 lg:gap-6">
            {(isRegisterPage || isLoginPage) && (
              <>
                <div className="hidden sm:flex items-center gap-2">
                  <span className="text-base lg:text-[25px] font-medium text-black font-satoshi">
                    English
                  </span>
                  <svg
                    className="w-3 h-3 lg:w-4 lg:h-4 fill-[#9CA3AF]"
                    viewBox="0 0 15 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0.425679 0.461782C0.993088 -0.153927 1.91304 -0.153927 2.48045 0.461782L7.26483 5.65343L12.0492 0.461782C12.6166 -0.153927 13.5366 -0.153927 14.104 0.461782C14.6714 1.07749 14.6714 2.07575 14.104 2.69146L8.29222 8.99796C7.72481 9.61366 6.80486 9.61366 6.23745 8.99795L0.425679 2.69146C-0.14173 2.07575 -0.14173 1.07749 0.425679 0.461782Z"
                      fill="#9CA3AF"
                    />
                  </svg>
                </div>

                <Link
                  to="/register"
                  className={`text-base lg:text-[25px] font-bold font-satoshi transition-colors relative ${
                    isRegisterPage ? "text-[#4461F2]" : "text-black"
                  }`}
                >
                  Register
                  {isRegisterPage && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-[#4461F2]" />
                  )}
                </Link>
              </>
            )}

            <Link
              to="/login"
              className="px-6 py-2 sm:px-8 sm:py-3 lg:px-10 lg:py-4 rounded-xl sm:rounded-[14.5px] bg-gradient-to-r from-[#2596BE] to-[#6F3AFA] text-white text-base sm:text-xl lg:text-[29px] font-black font-satoshi hover:shadow-lg transition-all hover:scale-105"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
