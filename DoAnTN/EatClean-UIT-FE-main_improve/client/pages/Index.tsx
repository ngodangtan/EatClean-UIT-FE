import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import PopularMeals from "@/components/PopularMeals";
import Footer from "@/components/Footer";

export default function Index() {
  return (
    <div className="min-h-screen bg-[#F3F3FD]">
      <Header />
      <main>
        <Hero />
        <Features />
        <PopularMeals />
      </main>
      <Footer />
    </div>
  );
}
