import { Link } from "react-router-dom";

export default function Header() {
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
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#125FBF] opacity-30 group-hover:opacity-100 transition-opacity" />
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

          <Link
            to="/login"
            className="px-6 py-2 sm:px-8 sm:py-3 lg:px-10 lg:py-4 rounded-xl sm:rounded-[14.5px] bg-gradient-to-r from-[#2596BE] to-[#6F3AFA] text-white text-base sm:text-xl lg:text-[29px] font-black font-satoshi hover:shadow-lg transition-all hover:scale-105"
          >
            Log In
          </Link>
        </div>
      </div>
    </header>
  );
}
