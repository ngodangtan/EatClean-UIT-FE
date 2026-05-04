const meals = [
  {
    name: "Salad Gà Nướng\nGiàu\nProtein",
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/813038b72d0f8463dd66d7dc5c130aa0b0c96f6a?width=618",
  },
  {
    name: "Súp Bí Ngòi\nCà Chua & Xúc Xích\nÝ Lành Mạnh",
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/c55f7f7a50a01149fb62f6112d1568bdc62cd70d?width=618",
  },
  {
    name: "Nấm Tỏi\nChảo Súp Lơ",
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/f9b08a5bf7f0fbd002e2b31a409f905966ae4660?width=618",
  },
  {
    name: "Cơm Gà\nChanh & Thảo Mộc",
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/28441f509384f275285f845fe733d8c516dd4c20?width=618",
  },
  {
    name: "Khoai Tây, Cà Rốt\nVà Bí Ngòi Nướng\nTỏi Thảo Mộc",
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/2f7842ebc16370ab8b394453504116cceaa74fc2?width=618",
  },
  {
    name: "Gà Xào\nMật Ong Tỏi",
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/1c97ba0f54ada9a2ef4105336c6fa6bbec4c2b5f?width=618",
  },
  {
    name: "Burger Bò\nBơ Tươi",
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/98f0af9cdb858cc106541560db2e6c18c02c412c?width=618",
  },
  {
    name: "Gà Và\nKhoai Lang",
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/6b9261a3acd70bc62cdda8603f047ccd373c04ea?width=618",
  },
];

export default function PopularMeals() {
  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-[1728px] mx-auto px-4 sm:px-8 lg:px-16 xl:px-32">
        <h3 className="text-3xl sm:text-4xl lg:text-[45px] font-bold tracking-[0.23em] bg-gradient-to-r from-[#2596BE] to-[#6F3AFA] bg-clip-text text-transparent font-satoshi mb-4 sm:mb-6">
          PHỔ BIẾN NHẤT
        </h3>
        <h4 className="text-4xl sm:text-5xl lg:text-[40px] font-bold leading-tight lg:leading-[105px] text-black font-satoshi mb-8 sm:mb-12 lg:mb-16">
          Nâng Cao Lối Sống Của Bạn
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12 mb-8 sm:mb-12 lg:mb-16">
          {meals.slice(0, 4).map((meal, index) => (
            <div
              key={index}
              className="group cursor-pointer hover:scale-105 transition-transform duration-300"
            >
              <div className="relative overflow-hidden rounded-[43px] mb-4 sm:mb-6">
                <img
                  src={meal.image}
                  alt={meal.name}
                  className="w-full aspect-[309/370] object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h5 className="text-2xl sm:text-3xl lg:text-[20px] font-bold leading-[40px] text-black font-satoshi whitespace-pre-line">
                {meal.name}
              </h5>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
          {meals.slice(4, 8).map((meal, index) => (
            <div
              key={index}
              className="group cursor-pointer hover:scale-105 transition-transform duration-300"
            >
              <div className="relative overflow-hidden rounded-[43px] mb-4 sm:mb-6">
                <img
                  src={meal.image}
                  alt={meal.name}
                  className="w-full aspect-[309/370] object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h5 className="text-2xl sm:text-3xl lg:text-[20px] font-bold leading-[40px] text-black font-satoshi whitespace-pre-line">
                {meal.name}
              </h5>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
