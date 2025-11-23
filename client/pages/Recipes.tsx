import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

export default function Recipes() {
  return (
    <div className="min-h-screen bg-[#F3F3FD]">
      <Header />
      <main className="pt-32 sm:pt-40 lg:pt-48 pb-12 sm:pb-16 lg:pb-20">
        <div className="max-w-[1728px] mx-auto px-4 sm:px-8 lg:px-16 xl:px-32">
          <div className="text-center space-y-8">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-black font-satoshi">
              Recipes
            </h1>
            <p className="text-xl sm:text-2xl lg:text-3xl text-gray-text font-satoshi max-w-2xl mx-auto">
              This page is under construction. Continue prompting to fill in the
              content for this page.
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
