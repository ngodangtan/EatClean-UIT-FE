import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ChangePassword() {
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password change logic here
    console.log("Password change submitted");
  };

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
              src="https://api.builder.io/api/v1/image/assets/TEMP/c06b2f40c68e21f6f0b5fc6a3ae62af5691da9b0?width=529"
              alt="Profile"
              className="w-32 h-32 sm:w-40 sm:h-40 lg:w-[264px] lg:h-[264px] rounded-full object-cover mb-6 sm:mb-8"
            />
            <h1 className="text-3xl sm:text-4xl lg:text-[45px] font-bold text-[#0D141C] text-center mb-2 sm:mb-3 font-inter">
              Songoku
            </h1>
            <p className="text-xl sm:text-2xl lg:text-[33px] text-[#4A739C] text-center font-inter">
              Mã khách hàng: 12345
            </p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-[40px] font-bold text-[#0D141C] mb-6 sm:mb-8 font-inter text-center">
              Đổi mật khẩu của bạn
            </h2>

            <div className="space-y-6 sm:space-y-8 mb-8 sm:mb-12">
              <div>
                <label
                  htmlFor="old-password"
                  className="block text-lg sm:text-xl lg:text-[38px] font-medium text-[#0D141C] mb-2 sm:mb-3 font-inter"
                >
                  Mật khẩu cũ
                </label>
                <input
                  type="password"
                  id="old-password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full h-16 sm:h-20 lg:h-[77px] bg-[#F3F3FD] rounded-[29px] border border-gray-200 px-6 sm:px-8 text-base sm:text-lg lg:text-xl focus:outline-none focus:ring-2 focus:ring-[#2596BE] focus:border-transparent"
                  placeholder="Nhập mật khẩu cũ"
                />
              </div>

              <div>
                <label
                  htmlFor="new-password"
                  className="block text-lg sm:text-xl lg:text-[38px] font-medium text-[#0D141C] mb-2 sm:mb-3 font-inter"
                >
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  id="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full h-16 sm:h-20 lg:h-[77px] bg-[#F3F3FD] rounded-[29px] border border-gray-200 px-6 sm:px-8 text-base sm:text-lg lg:text-xl focus:outline-none focus:ring-2 focus:ring-[#2596BE] focus:border-transparent"
                  placeholder="Nhập mật khẩu mới"
                />
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="block text-lg sm:text-xl lg:text-[38px] font-medium text-[#0D141C] mb-2 sm:mb-3 font-inter"
                >
                  Nhập lại mật khẩu mới
                </label>
                <input
                  type="password"
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-16 sm:h-20 lg:h-[77px] bg-[#F3F3FD] rounded-[29px] border border-gray-200 px-6 sm:px-8 text-base sm:text-lg lg:text-xl focus:outline-none focus:ring-2 focus:ring-[#2596BE] focus:border-transparent"
                  placeholder="Nhập lại mật khẩu mới của bạn"
                />
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="px-8 sm:px-12 py-3 sm:py-4 lg:px-16 lg:py-5 bg-gradient-to-r from-[#2596BE] to-[#6F3AFA] text-white text-xl sm:text-2xl lg:text-[36px] font-black font-satoshi rounded-[18px] hover:shadow-lg transition-all hover:scale-105"
              >
                Xác nhận
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
