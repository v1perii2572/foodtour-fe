import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { MdLocationOn, MdEmail, MdPhone, MdLanguage } from "react-icons/md";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-green-100 text-green-800 pt-10 pb-6 border-t border-green-300">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 text-sm">
        <div>
          <h3 className="text-2xl font-bold mb-4 text-green-900">
            🍽 EatAround
          </h3>
          <p className="mb-4">{t("footer.description")}</p>
          <p className="text-green-700">{t("footer.slogan")}</p>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-green-900">
            {t("footer.quickLinks")}
          </h4>
          <ul className="space-y-2">
            <li>
              <a href="/">{t("footer.links.home")}</a>
            </li>
            <li>
              <a href="/dich-vu">{t("footer.links.services")}</a>
            </li>
            <li>
              <a href="/blog">{t("footer.links.blog")}</a>
            </li>
            <li>
              <a href="/lien-he">{t("footer.links.contact")}</a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-green-900">
            {t("footer.support")}
          </h4>
          <ul className="space-y-2">
            <li>
              <a href="/chinh-sach">{t("footer.links.privacy")}</a>
            </li>
            <li>
              <a href="/dieu-khoan">{t("footer.links.terms")}</a>
            </li>
            <li>
              <a href="/cau-hoi">{t("footer.links.faq")}</a>
            </li>
            <li>
              <a href="/tro-giup">{t("footer.links.help")}</a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-green-900">
            {t("footer.contact")}
          </h4>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <MdLocationOn /> {t("footer.location")}
            </li>
            <li className="flex items-center gap-2">
              <MdEmail /> contact@eataround.vn
            </li>
            <li className="flex items-center gap-2">
              <MdPhone /> 0123 456 789
            </li>
            <li className="flex items-center gap-2">
              <MdLanguage /> www.eataround.vn
            </li>
          </ul>

          <div className="flex gap-4 mt-6">
            {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map(
              (Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="p-2 rounded-full bg-green-200 hover:bg-green-300 text-green-800"
                >
                  <Icon />
                </a>
              )
            )}
          </div>
        </div>
      </div>

      <div className="text-center text-green-700 text-sm mt-10 border-t border-green-300 pt-4">
        © {new Date().getFullYear()} EatAround. {t("footer.copyright")}
      </div>
    </footer>
  );
}
