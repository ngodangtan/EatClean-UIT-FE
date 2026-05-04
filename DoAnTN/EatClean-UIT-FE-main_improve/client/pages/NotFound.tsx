import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F3F3FD]">
      <Header />
      <main className="pt-32 sm:pt-40 lg:pt-48 pb-12 sm:pb-16 lg:pb-20">
        <div className="max-w-[1728px] mx-auto px-4 sm:px-8 lg:px-16 xl:px-32">
          <div className="text-center space-y-8">
            <h1 className="text-6xl sm:text-7xl lg:text-9xl font-bold bg-gradient-to-r from-[#2596BE] to-[#6F3AFA] bg-clip-text text-transparent font-satoshi">
              404
            </h1>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black font-satoshi">
              Page Not Found
            </h2>
            <p className="text-xl sm:text-2xl lg:text-3xl text-gray-text font-satoshi max-w-2xl mx-auto">
              The page you're looking for doesn't exist or is under
              construction.
            </p>
            <Link
              to="/"
              className="inline-block px-8 py-4 rounded-xl bg-gradient-to-r from-[#2596BE] to-[#6F3AFA] text-white text-xl font-bold hover:shadow-lg transition-all hover:scale-105"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
