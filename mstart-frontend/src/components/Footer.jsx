import React from "react";
import { useTranslation } from "react-i18next";

function Footer() {
  const { t } = useTranslation();

  return (
    <footer
      className="text-white text-center py-3 mt-auto shadow-sm"
      style={{ background: "linear-gradient(90deg, #1e3c72 0%, #2a5298 50%, #1e3c72 100%)" }}
    >
      <div className="container">
        <p className="mb-0">
          &copy; {new Date().getFullYear()} {t("footer.brandName")}. {t("footer.rightsReserved")}
        </p>
      </div>
    </footer>
  );
}

export default Footer;
