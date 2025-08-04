import React, { useState } from "react";

function LanguageDropdown({ currentLang, changeLanguage, t }) {
  const [open, setOpen] = useState(false);

  return (
    <li className="nav-item dropdown" style={{ position: "relative" }}>
      <button
        className="btn btn-light"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        {t("navbar.changeLanguage")}
      </button>

      {open && (
        <ul
          className="dropdown-menu dropdown-menu-end show"
          style={{ position: "absolute", top: "100%", right: 0, display: "block" }}
        >
          <li>
            <button
              className="dropdown-item"
              onClick={() => {
                changeLanguage("ar");
                setOpen(false);
              }}
              disabled={currentLang === "ar"}
            >
              العربية
            </button>
          </li>
          <li>
            <button
              className="dropdown-item"
              onClick={() => {
                changeLanguage("en");
                setOpen(false);
              }}
              disabled={currentLang === "en"}
            >
              English
            </button>
          </li>
        </ul>
      )}
    </li>
  );
}

export default LanguageDropdown;
