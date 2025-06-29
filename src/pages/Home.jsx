import TopNearbyPlaces from "../components/TopNearbyPlaces";
import {
  FaSearchLocation,
  FaMapMarkedAlt,
  FaHamburger,
  FaStarHalfAlt,
  FaRobot,
  FaHeadset,
  FaMobileAlt,
  FaMap,
  FaHeart,
  FaHandsHelping,
  FaQuestionCircle,
  FaStar,
  FaUtensils,
  FaPlay,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { useState } from "react";

const faqData = [
  {
    question: "Làm thế nào để tìm quán ăn phù hợp?",
    answer:
      "Bạn có thể dùng tính năng tìm kiếm thông minh và bộ lọc của EatAround để nhanh chóng tìm được quán ăn phù hợp với sở thích và nhu cầu.",
  },
  {
    question: "EatAround có hỗ trợ đặt chỗ không?",
    answer:
      "Hiện tại EatAround là nền tảng khám phá quán ăn và gợi ý tuyến food tour, chúng tôi sẽ tích hợp tính năng đặt chỗ trong tương lai.",
  },
  {
    question: "EatAround có app trên điện thoại không?",
    answer:
      "Chúng tôi đang phát triển ứng dụng dành cho iOS và Android, dự kiến ra mắt trong thời gian tới.",
  },
];

function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-green-50 py-20 px-4">
      <div className="container mx-auto max-w-4xl text-center mb-12">
        <h4 className="text-green-700 font-bold mb-2 text-2xl">
          ❓ Câu Hỏi Thường Gặp
        </h4>
        <h2 className="text-3xl font-extrabold mb-4">
          Giải Đáp Những Thắc Mắc Của Bạn
        </h2>
        <p className="text-gray-700 max-w-xl mx-auto text-lg">
          Chúng tôi tổng hợp những câu hỏi phổ biến giúp bạn hiểu rõ hơn về
          EatAround và dịch vụ của chúng tôi.
        </p>
      </div>

      <div className="container mx-auto max-w-4xl space-y-4">
        {faqData.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow transition p-4 border-l-4 border-green-600"
          >
            <button
              onClick={() => toggle(index)}
              className="flex items-center w-full justify-between text-left focus:outline-none"
            >
              <div className="flex items-center gap-3 text-green-700 text-lg font-semibold">
                <FaQuestionCircle className="text-green-500 text-xl" />
                {item.question}
              </div>
              <span className="text-2xl text-green-600">
                {openIndex === index ? "−" : "+"}
              </span>
            </button>
            {openIndex === index && (
              <div className="mt-3 text-gray-700 text-base leading-relaxed">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <section className="relative text-white py-28 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
             backgroundImage: "url('/hero-bg.png')",
          }}
        >
          <div className="absolute inset-0 bg-green-900 opacity-60"></div>{" "}
        </div>

        <div className="relative z-10 container mx-auto max-w-6xl px-4">
          <div className="max-w-3xl ml-auto text-right space-y-6">
            <h4 className="uppercase font-bold tracking-widest text-green-300 text-lg flex justify-end items-center gap-2">
              <FaUtensils className="text-green-300 text-xl" />
              Chào Mừng Đến Với
            </h4>
            <h1 className="text-5xl font-extrabold uppercase leading-tight drop-shadow-md">
              Food Tour - Khám Phá Quán Ăn Ngon
            </h1>
            <p className="text-green-100 text-lg leading-relaxed">
              Hành trình ẩm thực thú vị, khám phá các quán ăn nổi bật gần bạn
              với sự trợ giúp của AI.
            </p>
            <div className="space-x-4">
              <a
                href="#"
                className="inline-flex items-center gap-2 bg-white text-green-700 font-semibold rounded-full py-3 px-6 hover:bg-green-200 transition"
              >
                <FaPlay />
                Xem Video
              </a>
              <a
                href="#"
                className="inline-block bg-green-800 hover:bg-green-700 rounded-full py-3 px-6 font-semibold transition"
              >
                Khám Phá Ngay
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-7xl px-4 py-16">
        <TopNearbyPlaces />
      </div>

      <section className="container mx-auto py-20 px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h4 className="text-green-700 font-bold mb-2 text-2xl">
              🌿 Về EatAround
            </h4>
            <h1 className="text-4xl font-extrabold mb-4 leading-snug">
              Khám Phá Ẩm Thực Dễ Dàng <br />– Trải Nghiệm Đầy Cảm Hứng
            </h1>
            <p className="mb-8 text-gray-700 leading-relaxed text-lg">
              EatAround giúp bạn tìm kiếm và khám phá các quán ăn đặc sắc quanh
              bạn, với bản đồ tương tác và trợ lý AI thông minh. Tận hưởng hành
              trình ẩm thực phong phú mọi lúc, mọi nơi!
            </p>
            <div className="space-y-6">
              <div className="flex items-start gap-4 bg-green-50 rounded-xl p-4 border-l-4 border-green-600 hover:shadow-md transition">
                <div className="bg-green-100 p-3 rounded-full">
                  <FaMapMarkedAlt className="text-green-600 text-2xl" />
                </div>
                <div>
                  <h5 className="text-xl font-semibold text-green-800">
                    Hệ Thống Tiện Lợi
                  </h5>
                  <p className="text-gray-700">
                    Sử dụng dễ dàng trên mọi thiết bị, mọi lúc mọi nơi.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-green-50 rounded-xl p-4 border-l-4 border-green-600 hover:shadow-md transition">
                <div className="bg-green-100 p-3 rounded-full">
                  <FaRobot className="text-green-600 text-2xl" />
                </div>
                <div>
                  <h5 className="text-xl font-semibold text-green-800">
                    Trợ Lý AI Thông Minh
                  </h5>
                  <p className="text-gray-700">
                    Gợi ý món ăn và địa điểm theo khẩu vị riêng bạn.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-green-50 rounded-xl p-4 border-l-4 border-green-600 hover:shadow-md transition">
                <div className="bg-green-100 p-3 rounded-full">
                  <FaHeadset className="text-green-600 text-2xl" />
                </div>
                <div>
                  <h5 className="text-xl font-semibold text-green-800">
                    Hỗ Trợ 24/7
                  </h5>
                  <p className="text-gray-700">
                    Hotline: <strong>0123 456 789</strong> – luôn sẵn sàng giúp
                    bạn.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative rounded-xl overflow-hidden shadow-xl">
            <img
              src="/forest.png"
              alt="About EatAround"
              className="w-full object-cover hover:scale-105 transition duration-500"
              style={{ maxHeight: 600, minHeight: 600 }}
            />
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-green-50 to-white py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center mb-14">
          <h4 className="text-green-700 font-bold text-2xl mb-2">
            ✨ Dịch Vụ Nổi Bật
          </h4>
          <h2 className="text-4xl font-extrabold mb-4 leading-snug">
            Trải Nghiệm Ẩm Thực Đỉnh Cao <br /> Dễ Dàng Tìm Kiếm
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto text-lg">
            EatAround mang đến những tiện ích hàng đầu giúp bạn nhanh chóng tìm
            kiếm, khám phá và tận hưởng ẩm thực.
          </p>
        </div>

        <div className="container mx-auto max-w-6xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-3xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 text-center">
            <div className="bg-green-100 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4">
              <FaSearchLocation className="text-green-600 text-3xl" />
            </div>
            <h5 className="text-xl font-semibold text-green-800 mb-2">
              Tìm Kiếm Nhanh
            </h5>
            <p className="text-gray-600">
              Tìm quán ăn nhanh chóng với bộ lọc thông minh và AI.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 text-center">
            <div className="bg-green-100 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4">
              <FaMapMarkedAlt className="text-green-600 text-3xl" />
            </div>
            <h5 className="text-xl font-semibold text-green-800 mb-2">
              Bản Đồ Trực Quan
            </h5>
            <p className="text-gray-600">
              Xem vị trí chính xác và đường đi tới các quán ăn nổi bật.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 text-center">
            <div className="bg-green-100 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4">
              <FaHamburger className="text-green-600 text-3xl" />
            </div>
            <h5 className="text-xl font-semibold text-green-800 mb-2">
              Ẩm Thực Đa Dạng
            </h5>
            <p className="text-gray-600">
              Khám phá hàng trăm món ăn đến từ nhiều vùng miền.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 text-center">
            <div className="bg-green-100 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4">
              <FaStarHalfAlt className="text-green-600 text-3xl" />
            </div>
            <h5 className="text-xl font-semibold text-green-800 mb-2">
              Đánh Giá Tin Cậy
            </h5>
            <p className="text-gray-600">
              Tham khảo đánh giá thực tế từ cộng đồng người dùng.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-7xl py-20 px-4">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h4 className="text-green-700 font-bold mb-2 text-2xl">
            🌟 Lợi Ích Dành Cho Người Dùng
          </h4>
          <h2 className="text-3xl font-extrabold mb-4">
            Trải Nghiệm Mượt Mà, Tiện Ích Vượt Trội
          </h2>
          <p className="text-gray-700 max-w-xl mx-auto text-lg">
            EatAround mang đến giải pháp hiện đại giúp bạn khám phá và lưu giữ
            những tuyến food tour yêu thích, dễ dàng quản lý lịch trình ẩm thực.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="flex items-start gap-4 p-5 bg-green-50 rounded-2xl border-l-4 border-green-600 hover:shadow-md transition">
            <div className="bg-green-100 p-3 rounded-full">
              <FaMobileAlt className="text-green-600 text-2xl" />
            </div>
            <div>
              <h5 className="text-xl font-semibold text-green-800 mb-1">
                Giao Diện Thân Thiện & Dễ Sử Dụng
              </h5>
              <p className="text-gray-700">
                Giao diện trực quan, dễ sử dụng trên mọi thiết bị, giúp bạn khám
                phá quán ăn thuận tiện mọi lúc mọi nơi.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 bg-green-50 rounded-2xl border-l-4 border-green-600 hover:shadow-md transition">
            <div className="bg-green-100 p-3 rounded-full">
              <FaMap className="text-green-600 text-2xl" />
            </div>
            <div>
              <h5 className="text-xl font-semibold text-green-800 mb-1">
                Tích Hợp Bản Đồ Thông Minh
              </h5>
              <p className="text-gray-700">
                Tích hợp bản đồ tương tác, cung cấp đường đi và thông tin chi
                tiết các địa điểm ăn uống.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 bg-green-50 rounded-2xl border-l-4 border-green-600 hover:shadow-md transition">
            <div className="bg-green-100 p-3 rounded-full">
              <FaHeart className="text-green-600 text-2xl" />
            </div>
            <div>
              <h5 className="text-xl font-semibold text-green-800 mb-1">
                Lưu Lại Lộ Trình Yêu Thích
              </h5>
              <p className="text-gray-700">
                Dễ dàng lưu và chia sẻ các tuyến food tour cho bản thân và bạn
                bè.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 bg-green-50 rounded-2xl border-l-4 border-green-600 hover:shadow-md transition">
            <div className="bg-green-100 p-3 rounded-full">
              <FaHandsHelping className="text-green-600 text-2xl" />
            </div>
            <div>
              <h5 className="text-xl font-semibold text-green-800 mb-1">
                Hỗ Trợ Người Dùng 24/7
              </h5>
              <p className="text-gray-700">
                Đội ngũ hỗ trợ luôn sẵn sàng giúp bạn giải đáp thắc mắc và hỗ
                trợ nhanh chóng.
              </p>
            </div>
          </div>
        </div>
      </section>

      <FAQSection />

      <section className="bg-green-50 py-20 px-4">
        <div className="text-center max-w-4xl mx-auto mb-14">
          <h4 className="text-green-700 font-bold mb-2 text-2xl">
            💬 Đánh Giá
          </h4>
          <h2 className="text-3xl font-extrabold mb-4">
            Khách Hàng Nói Gì Về EatAround?
          </h2>
          <p className="text-gray-700 max-w-xl mx-auto text-lg">
            Những phản hồi thực tế từ người dùng EatAround giúp chúng tôi hoàn
            thiện và phát triển dịch vụ ngày càng tốt hơn.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-2xl transition">
            <div className="mb-4">
              <img
                src="/user_avatar.png"
                alt="Nguyễn Văn A"
                className="rounded-full w-20 h-20 mx-auto"
              />
            </div>
            <div className="flex justify-center text-yellow-400 mb-2">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} />
              ))}
            </div>
            <p className="italic text-gray-700 mb-4 text-center">
              “Dịch vụ EatAround giúp tôi khám phá các quán ăn ngon thật tiện
              lợi và nhanh chóng.”
            </p>
            <p className="font-semibold text-green-700 text-center">
              Nguyễn Văn A
            </p>
            <p className="text-center text-gray-600">Yêu Ẩm Thực</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-2xl transition">
            <div className="mb-4">
              <img
                src="/user_avatar.png"
                alt="Trần Thị B"
                className="rounded-full w-20 h-20 mx-auto"
              />
            </div>
            <div className="flex justify-center text-yellow-400 mb-2">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} />
              ))}
            </div>
            <p className="italic text-gray-700 mb-4 text-center">
              “EatAround thật sự rất dễ sử dụng và giúp tôi có nhiều lựa chọn
              phong phú hơn cho các bữa ăn.”
            </p>
            <p className="font-semibold text-green-700 text-center">
              Trần Thị B
            </p>
            <p className="text-center text-gray-600">Người Yêu Ẩm Thực</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-2xl transition">
            <div className="mb-4">
              <img
                src="/user_avatar.png"
                alt="Lê Văn C"
                className="rounded-full w-20 h-20 mx-auto"
              />
            </div>
            <div className="flex justify-center text-yellow-400 mb-2">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} />
              ))}
            </div>
            <p className="italic text-gray-700 mb-4 text-center">
              “Khám phá EatAround là trải nghiệm tuyệt vời, giúp tôi tìm thấy
              những món ăn yêu thích.”
            </p>
            <p className="font-semibold text-green-700 text-center">Lê Văn C</p>
            <p className="text-center text-gray-600">Đầu Bếp & Foodie</p>
          </div>
        </div>
      </section>
    </>
  );
}
