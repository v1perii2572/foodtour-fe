import { FiMapPin, FiSave } from "react-icons/fi";
import Chat from "../components/Chat";
import config from "../config";

export default function DefaultRoutes({ token }) {
  const routes = [
    {
      name: "Ẩm thực phố cổ Hà Nội",
      description: "Khám phá món ngon đặc trưng quanh Hồ Gươm và phố cổ.",
      places: [
        {
          name: "Phở Bát Đàn",
          address: "49 Bát Đàn, Hoàn Kiếm",
          role: "Ăn sáng",
          note: "Phở bò truyền thống, nổi tiếng lâu năm.",
          timeSlot: "07:00 - 09:00",
          lat: 21.0338,
          lng: 105.8466,
        },
        {
          name: "Bún chả Hương Liên",
          address: "24 Lê Văn Hưu, Hai Bà Trưng",
          role: "Ăn trưa",
          note: "Quán bún chả từng đón Tổng thống Obama.",
          timeSlot: "11:00 - 13:30",
          lat: 21.0177,
          lng: 105.8491,
        },
        {
          name: "Kem Tràng Tiền",
          address: "35 Tràng Tiền, Hoàn Kiếm",
          role: "Tráng miệng",
          note: "Kem que truyền thống, ngon - rẻ - lâu đời.",
          timeSlot: "13:30 - 14:00",
          lat: 21.0246,
          lng: 105.8552,
        },
      ],
    },
    {
      name: "Món ngon đường Nguyễn Hữu Huân",
      description: "Con đường nổi tiếng với nhiều món ăn vặt.",
      places: [
        {
          name: "Cà phê Giảng",
          address: "39 Nguyễn Hữu Huân",
          role: "Cà phê trứng",
          note: "Món cà phê trứng đặc sản độc đáo của Hà Nội.",
          timeSlot: "09:00 - 10:30",
          lat: 21.0342,
          lng: 105.8532,
        },
        {
          name: "Bánh mì P",
          address: "20 Nguyễn Hữu Huân",
          role: "Ăn nhẹ",
          note: "Bánh mì thịt nguội/ốp la nhanh gọn, tiện lợi.",
          timeSlot: "10:30 - 11:30",
          lat: 21.034,
          lng: 105.853,
        },
      ],
    },
    {
      name: "Khám phá ẩm thực buổi tối Hà Nội",
      description: "Lộ trình thưởng thức các món ăn tối đặc trưng.",
      places: [
        {
          name: "Lẩu Thái Phố Huế",
          address: "123 Phố Huế",
          role: "Ăn tối",
          note: "Lẩu chua cay đậm vị, phù hợp đi nhóm.",
          timeSlot: "18:00 - 20:00",
          lat: 21.0135,
          lng: 105.854,
        },
        {
          name: "Trà chanh Nhà Thờ",
          address: "1 Nhà Thờ, Hoàn Kiếm",
          role: "Giải khát",
          note: "Ngồi vỉa hè chill, ngắm phố cổ về đêm.",
          timeSlot: "20:00 - 21:00",
          lat: 21.0297,
          lng: 105.8502,
        },
      ],
    },
    {
      name: "Món ăn đặc sản Hà Nội",
      description: "Trải nghiệm các món ăn đặc sản nổi tiếng nhất.",
      places: [
        {
          name: "Chả cá Lã Vọng",
          address: "14 Chả Cá, Hoàn Kiếm",
          role: "Bữa chính",
          note: "Món chả cá lăng truyền thống ăn kèm bún, rau thơm.",
          timeSlot: "12:00 - 13:00",
          lat: 21.0352,
          lng: 105.8497,
        },
        {
          name: "Xôi Yến",
          address: "35B Nguyễn Hữu Huân",
          role: "Ăn nhẹ",
          note: "Xôi mặn nhiều topping: chả, trứng, thịt kho.",
          timeSlot: "07:00 - 09:00",
          lat: 21.0345,
          lng: 105.8535,
        },
      ],
    },
    {
      name: "Ẩm thực vỉa hè Hà Nội",
      description: "Khám phá những quán vỉa hè ngon và giá rẻ.",
      places: [
        {
          name: "Nem chua rán ngõ Tạm Thương",
          address: "Ngõ Tạm Thương, Hàng Bông",
          role: "Ăn vặt",
          note: "Nem giòn nóng hổi, chấm tương ớt siêu ngon.",
          timeSlot: "16:00 - 17:30",
          lat: 21.03,
          lng: 105.8488,
        },
        {
          name: "Ốc luộc Đinh Liệt",
          address: "1A Đinh Liệt",
          role: "Ăn vặt",
          note: "Ốc luộc nóng, chấm mắm gừng cay nồng.",
          timeSlot: "17:30 - 19:00",
          lat: 21.032,
          lng: 105.8539,
        },
      ],
    },
  ];

  const handleSave = async (route) => {
    try {
      const res = await fetch(`${config.apiUrl}/api/Routes/save-default`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(route),
      });

      if (res.ok) {
        alert("✅ Đã lưu thành công lộ trình!");
      } else {
        alert("❌ Không thể lưu lộ trình.");
      }
    } catch (err) {
      console.error("Lỗi khi lưu lộ trình:", err);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 px-4 max-w-6xl mx-auto">
      <div className="col-span-1 max-h-[500px] overflow-y-auto pr-2">
        <h2 className="text-2xl font-bold text-green-800 mb-4 sticky top-0 bg-white z-10 py-2">
          🧭 Gợi ý lộ trình Hà Nội
        </h2>
        <div className="space-y-4 pb-4">
          {routes.map((route, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-4 border border-green-100 hover:shadow transition"
            >
              <h3 className="text-sm font-semibold text-green-700 flex items-center gap-2 mb-1">
                <FiMapPin className="text-base" /> {route.name}
              </h3>
              <p className="text-xs text-gray-500 mb-2 italic">
                {route.description}
              </p>
              <ul className="list-disc list-inside text-xs text-gray-700 mb-3">
                {route.places.map((p, i) => (
                  <li key={i}>
                    <strong>{p.name}</strong> – {p.address} ({p.role})
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSave(route)}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1"
              >
                <FiSave /> Lưu
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="col-span-1 md:col-span-2">
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold text-green-700 mb-4">
            💬 EatAround AI
          </h2>
          <div className="flex-grow">
            <Chat token={token} />
          </div>
        </div>
      </div>
    </div>
  );
}
