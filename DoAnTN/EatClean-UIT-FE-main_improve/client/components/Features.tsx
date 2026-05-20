export default function Features() {
  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-[1728px] mx-auto px-4 sm:px-8 lg:px-16 xl:px-32">
        <h3 className="text-2xl sm:text-3xl lg:text-[34px] font-black tracking-[0.23em] bg-gradient-to-r from-[#2596BE] to-[#6F3AFA] bg-clip-text text-transparent font-satoshi mb-8 sm:mb-12 lg:mb-16 py-2">
          TÍNH NĂNG CHÚNG TÔI CUNG CẤP
        </h3>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="space-y-6 sm:space-y-8">
            <h4 className="text-4xl sm:text-5xl lg:text-[45px] font-bold leading-tight lg:leading-[80px] text-black font-satoshi">
              Tính BMI dễ dàng hơn với AI
            </h4>
            <p className="text-xl sm:text-2xl lg:text-[28px] font-bold text-[#8A8585] leading-normal font-satoshi">
              Chúng tôi tính chỉ số BMI từ dữ liệu như tuổi, chiều cao, cân nặng.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 sm:gap-6 lg:gap-10">
            <div className="flex flex-col h-full space-y-4">
              <div className="flex items-center justify-start w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/6923b6a2bf14e9e3170c62058ae136dd9070b56f?width=218"
                  alt="Food recommendation"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <h5 className="text-2xl sm:text-3xl lg:text-2xl font-bold leading-[40px] text-black font-satoshi lg:min-h-[80px]">
                Gợi Ý Thực Phẩm
              </h5>
              <p className="text-xl sm:text-2xl lg:text-base font-medium text-[#8A8585] leading-normal font-satoshi flex-1">
                Chúng tôi gợi ý thực phẩm phù hợp với nhu cầu calo của bạn.
              </p>
            </div>

            <div className="flex flex-col h-full space-y-4">
              <div className="flex items-center justify-start w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/202e3525c022f152d0f4618cd91a046dd1969821?width=256"
                  alt="Nutritional value"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <h5 className="text-2xl sm:text-3xl lg:text-2xl font-bold leading-[40px] text-black font-satoshi lg:min-h-[80px]">
                Giá Trị Dinh Dưỡng
              </h5>
              <p className="text-xl sm:text-2xl lg:text-base font-medium text-[#8A8585] leading-normal font-satoshi flex-1">
                Xem đầy đủ giá trị dinh dưỡng của món ăn yêu thích.
              </p>
            </div>

            <div className="flex flex-col h-full space-y-4">
              <div className="flex items-center justify-start w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/49429acffbddc07753dc4381bcd2cdf24c8ced79?width=258"
                  alt="AI nutrition coach"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <h5 className="text-2xl sm:text-3xl lg:text-2xl font-bold leading-[40px] text-black font-satoshi lg:min-h-[80px]">
                Huấn Luyện Viên Dinh Dưỡng AI
              </h5>
              <p className="text-xl sm:text-2xl lg:text-base font-medium text-[#8A8585] leading-normal font-satoshi flex-1">
                Nhận câu trả lời tức thì và gợi ý bữa ăn cá nhân hóa.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
