import { React, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../assets/style/header/header.css";
import logo from "../assets/images/Logo_1.webp";

export default function Header() {
  const [isSideOpen, setIsSideOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDetail, setOpenDetail] = useState(null); // track open dropdown

  const sidebarRef = useRef(null);
  function openDialog() {
    const dialog = document.querySelector(".dialog");
    if (dialog) {
      dialog.style.display = "flex"; // make visible first
      setTimeout(() => {
        dialog.classList.add("open"); // trigger opacity animation
      }, 10); // slight delay to allow reflow
    }
  }
  const toggleSidebar = () => setIsSideOpen((prev) => !prev);

  const toggleDetails = (id) => {
    setOpenDetail((prev) => (prev === id ? null : id));
  };

  const menu = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="#FFFFFF"
    >
      <path d="M120-680v-80h720v80H120Zm0 480v-80h720v80H120Zm0-240v-80h720v80H120Z" />
    </svg>
  );

  const closeMenu = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="#FFFFFF"
    >
      <path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56Z" />
    </svg>
  );

  const more = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="#FFFFFF"
    >
      <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
    </svg>
  );

  const downArrow = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="12px"
      viewBox="0 -960 960 960"
      width="12px"
    >
      <path d="M480-97q-8 0-15-2.5t-13-8.5L228-332q-11-11-11-28t11-28q12-12 28.5-11.5T284-388l156 155v-607q0-17 11.5-28.5T480-880q17 0 28.5 11.5T520-840v607l155-155q12-12 28.5-12t28.5 12q11 12 11 28.5T732-332L508-108q-6 6-13 8.5T480-97Z" />
    </svg>
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isSideOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        setIsSideOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isSideOpen]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`main_header ${isScrolled ? "scrolled" : ""}`}>
      <nav dir="auto">
        <ul>
          <li>
            <Link to="/">الرئيسية</Link>
          </li>
          <li>
            <p>عنا</p>
            <span>{downArrow}</span>
            <div className="droplist">
              <ul>
                <li>
                  <Link to="/about">عن شارِك للإستشارات</Link>
                </li>
                <li>
                  <Link to="/why-us">لماذا شارِك للإستشارات؟</Link>
                </li>
              </ul>
            </div>
          </li>
          <li>
            <Link to={"/feasibility-studies"}>دراسات الجدوى</Link>
            <span>{downArrow}</span>
            <div className="droplist">
              <ul dir="auto">
                <li>
                  <Link to="/factories">المصانع</Link>
                </li>
                <li>
                  <Link to="/restaurants">المطاعم</Link>
                </li>
                <li>
                  <Link to="/schools">المدارس</Link>
                </li>
                <li>
                  <Link to="/farms">المزارع</Link>
                </li>
                <li>
                  <Link to="/e-commerce-projects">
                    مشروعات التجارة الالكترونية
                  </Link>
                </li>
                <li>
                  <Link to="/medical-sector">القطاع الطبي</Link>
                </li>
                <li>
                  <Link to="/other-projects">مشروعات اخرى</Link>
                </li>
              </ul>
            </div>
          </li>
          <li>
            <Link to="/Administrational-consultations">إستشارات إدارية</Link>
          </li>
          <li>
            <Link to="/files-management">إدارة الملفات</Link>
          </li>
          <li>
            <Link to="/previous-works">سابقة الأعمال</Link>
          </li>
          <li>
            <Link to="/contact-request">طلب تواصل</Link>
          </li>
          <li>
            <Link
              to="https://wa.me/97455225488?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D8%8C%20%D8%A3%D8%B1%D9%8A%D8%AF%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D8%AE%D8%AF%D9%85%D8%A7%D8%AA%D9%83%D9%85"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </Link>
            <span>{downArrow}</span>
          </li>
        </ul>
      </nav>

      <Link to="/" className="logo">
        <img src={logo} alt="logo" />
      </Link>

      <div
        className="menu open"
        onClick={toggleSidebar}
        style={{
          opacity: isSideOpen ? 0 : 1,
          pointerEvents: isSideOpen ? "none" : "auto",
          transition: "opacity 0.3s ease",
        }}
      >
        {menu}
      </div>

      <div ref={sidebarRef} className={`side ${isSideOpen ? "show" : ""}`}>
        <div className="top">
          <Link to="/" className="logo">
            <img src={logo} alt="logo" />
          </Link>
          <div className="menu close" onClick={toggleSidebar}>
            {closeMenu}
          </div>
        </div>

        <div className="bottom">
          <nav>
            <ul dir="auto">
              <li>
                <Link to="/">الرئيسية</Link>
              </li>

              <div
                className={`details ${openDetail === "about" ? "active" : ""}`}
                onClick={() => toggleDetails("about")}
              >
                <summary>
                  <p>عنا</p>
                  <span></span>
                </summary>
                <div>
                  <ul>
                    <li>
                      <Link to="/about">عن شارِك للإستشارات</Link>
                    </li>
                    <li>
                      <Link to="/why-us">لماذا شارِك للإستشارات؟</Link>
                    </li>
                  </ul>
                </div>
              </div>

              <div
                className={`details ${
                  openDetail === "feasibility" ? "active" : ""
                }`}
                onClick={() => toggleDetails("feasibility")}
              >
                <summary>
                  <p>دراسات الجدوى</p>
                  <span></span>
                </summary>
                <div>
                  <ul>
                    <li>
                      <Link to="/factories">المصانع</Link>
                    </li>
                    <li>
                      <Link to="/restaurants">المطاعم</Link>
                    </li>
                    <li>
                      <Link to="/schools">المدارس</Link>
                    </li>
                    <li>
                      <Link to="/farms">المزارع</Link>
                    </li>
                    <li>
                      <Link to="/e-commerce-projects">
                        مشروعات التجارة الالكترونية
                      </Link>
                    </li>
                    <li>
                      <Link to="/medical-sector">القطاع الطبي</Link>
                    </li>
                    <li>
                      <Link to="/other-projects">مشروعات اخرى</Link>
                    </li>
                  </ul>
                </div>
              </div>

              <li>
                <Link to="/Administrational-consultations">
                  استشارات ادارية
                </Link>
              </li>
              <li>
                <Link to="/files-management">ادارة الملفات</Link>
              </li>
              <li>
                <Link to="/previous-works">سابقة الاعمال</Link>
              </li>
              <li>
                <Link to="/contact-request">سابقة الاعمال</Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
