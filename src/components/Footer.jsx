import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { MdLocationOn, MdEmail, MdPhone, MdLanguage } from "react-icons/md";

export default function Footer() {
  return (
    <footer className="bg-green-100 text-green-800 pt-10 pb-6 border-t border-green-300">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 text-sm">
        <div>
          <h3 className="text-2xl font-bold mb-4 text-green-900">
            🍽 EatAround
          </h3>
          <p className="mb-4">
            EatAround giúp bạn khám phá các tuyến food tour hấp dẫn tại Việt Nam
            với bản đồ thông minh và gợi ý địa điểm thú vị.
          </p>
          <p className="text-green-700">
            Khám phá và thưởng thức ngay hôm nay!
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-green-900">Liên kết nhanh</h4>
          <ul className="space-y-2">
            <li>
              <a href="/" className="hover:text-green-900 transition-colors">
                Trang chủ
              </a>
            </li>
            <li>
              <a
                href="/dich-vu"
                className="hover:text-green-900 transition-colors"
              >
                Dịch vụ
              </a>
            </li>
            <li>
              <a
                href="/blog"
                className="hover:text-green-900 transition-colors"
              >
                Blog
              </a>
            </li>
            <li>
              <a
                href="/lien-he"
                className="hover:text-green-900 transition-colors"
              >
                Liên hệ
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-green-900">Hỗ trợ</h4>
          <ul className="space-y-2">
            <li>
              <a
                href="/chinh-sach"
                className="hover:text-green-900 transition-colors"
              >
                Chính sách bảo mật
              </a>
            </li>
            <li>
              <a
                href="/dieu-khoan"
                className="hover:text-green-900 transition-colors"
              >
                Điều khoản sử dụng
              </a>
            </li>
            <li>
              <a
                href="/cau-hoi"
                className="hover:text-green-900 transition-colors"
              >
                Câu hỏi thường gặp
              </a>
            </li>
            <li>
              <a
                href="/tro-giup"
                className="hover:text-green-900 transition-colors"
              >
                Trợ giúp
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-green-900">Liên hệ</h4>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <MdLocationOn className="text-lg" />
              Hà Nội, Việt Nam
            </li>
            <li className="flex items-center gap-2">
              <MdEmail className="text-lg" />
              contact@eataround.vn
            </li>
            <li className="flex items-center gap-2">
              <MdPhone className="text-lg" />
              0123 456 789
            </li>
            <li className="flex items-center gap-2">
              <MdLanguage className="text-lg" />
              www.eataround.vn
            </li>
          </ul>

          <div className="flex gap-4 mt-6">
            {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map(
              (Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="p-2 rounded-full bg-green-200 hover:bg-green-300 text-green-800 transition-colors"
                >
                  <Icon />
                </a>
              )
            )}
          </div>
        </div>
      </div>

      <div className="text-center text-green-700 text-sm mt-10 border-t border-green-300 pt-4">
        © {new Date().getFullYear()} EatAround. All rights reserved.
      </div>
    </footer>
  );
}
