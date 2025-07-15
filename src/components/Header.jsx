import { React, useState, useEffect, useRef, useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import "../assets/style/header/header.css";
import logo from "../assets/images/Logo_1.webp";
import { toast } from "react-toastify";
import axios from "../axiosInstance";
export default function Header() {
  const [isSideOpen, setIsSideOpen] = useState(false);
  const [menuTxt, setmenuTxt] = useState({});
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDetail, setOpenDetail] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const editedValues = useRef({});
  const sidebarRef = useRef(null);
  const [logoFile, setLogoFile] = useState(null);
  const [showReview, setShowReview] = useState(false);

  const handleInput = (e, key) => {
    editedValues.current[key] = e.target.innerText;
  };
  const toggleEditing = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      submitEditableText(editedValues.current);
      console.log("Saved Values:", editedValues.current);
    }
  };

  const toggleSidebar = () => setIsSideOpen((prev) => !prev);

  const toggleDetails = (id) => {
    setOpenDetail((prev) => (prev === id ? null : id));
  };
  async function submitEditableText(data) {
    try {
      const formData = new FormData();

      // Append all text fields
      for (const key in data) {
        formData.append(key, data[key]);
      }

      // Append logo if available
      if (logoFile) {
        formData.append("logo", logoFile);
      }

      const response = await axios.post("/menu/save", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("تم الحفظ بنجاح!");
        // Optional: if server returns updated logo URL, update UI
        if (response.data.logoUrl) {
          setLogoUrl(response.data.logoUrl);
        }
      } else {
        throw new Error("Save failed");
      }
    } catch (error) {
      toast.error("فشل في الحفظ!");
      console.log(error);
    }
  }

  useLayoutEffect(() => {
    getMenu();
  }, []);
  async function getMenu() {
    try {
      const response = await axios.get("/menu");

      if (response.status === 200 || response.status === 201) {
        setmenuTxt((prev) => (prev = response.data.menu));
        localStorage.setItem("menuTxt", JSON.stringify(response.data.menu));
      } else {
        throw error;
      }
    } catch (error) {
      toast.error("فشل في الحفظ!");
      console.log(error);
    }
  }

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
  const handleLinkClick = (e) => {
    if (isEditing) {
      e.preventDefault();
    }
  };
  const edit = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="#FFFFFF"
    >
      <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
    </svg>
  );
  const save = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="#FFFFFF"
    >
      <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
    </svg>
  );
  return (
    <header className={`main_header ${isScrolled ? "scrolled" : ""}`}>
      <nav dir="auto">
        <ul>
          <li>
            <Link
              to="/"
              contentEditable={isEditing}
              suppressContentEditableWarning
              onInput={(e) => handleInput(e, "home")}
              onClick={handleLinkClick}
            >
              {menuTxt.home}
            </Link>
          </li>
          <li>
            <p
              contentEditable={isEditing}
              suppressContentEditableWarning
              onInput={(e) => handleInput(e, "aboutLabel")}
            >
              {menuTxt.aboutLabel}
            </p>
            <span>{downArrow}</span>
            <div className="droplist">
              <ul>
                <li>
                  <Link
                    to="/about"
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    onInput={(e) => handleInput(e, "about")}
                    onClick={handleLinkClick}
                  >
                    {menuTxt.about}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/why-us"
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    onInput={(e) => handleInput(e, "whyUs")}
                    onClick={handleLinkClick}
                  >
                    {menuTxt.whyUs}
                  </Link>
                </li>
              </ul>
            </div>
          </li>
          <li>
            <Link
              to="/feasibility-studies"
              contentEditable={isEditing}
              suppressContentEditableWarning
              onInput={(e) => handleInput(e, "studies")}
              onClick={handleLinkClick}
            >
              {menuTxt.studies}
            </Link>
            <span>{downArrow}</span>
            <div className="droplist">
              <ul dir="auto">
                <li>
                  <Link
                    to="/factories"
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    onInput={(e) => handleInput(e, "factories")}
                    onClick={handleLinkClick}
                  >
                    {menuTxt.factories}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/restaurants"
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    onInput={(e) => handleInput(e, "restaurants")}
                    onClick={handleLinkClick}
                  >
                    {menuTxt.restaurants}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/schools"
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    onInput={(e) => handleInput(e, "schools")}
                    onClick={handleLinkClick}
                  >
                    {menuTxt.schools}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/farms"
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    onInput={(e) => handleInput(e, "farms")}
                    onClick={handleLinkClick}
                  >
                    {menuTxt.farms}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/e-commerce-projects"
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    onInput={(e) => handleInput(e, "ecommerce")}
                    onClick={handleLinkClick}
                  >
                    {menuTxt.ecommerce}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/medical-sector"
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    onInput={(e) => handleInput(e, "medical")}
                    onClick={handleLinkClick}
                  >
                    {menuTxt.medical}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/other-projects"
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    onInput={(e) => handleInput(e, "others")}
                    onClick={handleLinkClick}
                  >
                    {menuTxt.others}
                  </Link>
                </li>
              </ul>
            </div>
          </li>
          <li>
            <Link
              to="/Administrational-consultations"
              contentEditable={isEditing}
              suppressContentEditableWarning
              onInput={(e) => handleInput(e, "adminConsult")}
              onClick={handleLinkClick}
            >
              {menuTxt.adminConsult}
            </Link>
          </li>
          <li>
            <Link
              to="/files-management"
              contentEditable={isEditing}
              suppressContentEditableWarning
              onInput={(e) => handleInput(e, "filesMgmt")}
              onClick={handleLinkClick}
            >
              {menuTxt.filesMgmt}
            </Link>
          </li>
          <li>
            <Link
              to="/previous-works"
              contentEditable={isEditing}
              suppressContentEditableWarning
              onInput={(e) => handleInput(e, "prevWork")}
              onClick={handleLinkClick}
            >
              {menuTxt.prevWork}
            </Link>
          </li>
          <li>
            <Link
              to="/contact-request"
              contentEditable={isEditing}
              suppressContentEditableWarning
              onInput={(e) => handleInput(e, "contact")}
              onClick={handleLinkClick}
            >
              {menuTxt.contact}
            </Link>
          </li>
          <li>
            <Link
              to="https://wa.me/97455225488?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D8%8C%20%D8%A3%D8%B1%D9%8A%D8%AF%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D8%AE%D8%AF%D9%85%D8%A7%D8%AA%D9%83%D9%85"
              target="_blank"
              rel="noopener noreferrer"
              contentEditable={isEditing}
              suppressContentEditableWarning
              onInput={(e) => handleInput(e, "whatsapp")}
              onClick={handleLinkClick}
            >
              {menuTxt.whatsapp}
            </Link>
            <span>{downArrow}</span>
          </li>
        </ul>
      </nav>

      <div className="logo">
        {isEditing && (
          <input
            type="file"
            accept="image/*"
            className="logo_input"
            onChange={(e) => setLogoFile(e.target.files[0])}
          />
        )}

        <Link to="/">
          <img
            src={logoFile ? URL.createObjectURL(logoFile) : menuTxt.logoUrl}
            alt="logo"
            id="logoimg"
          />
        </Link>
      </div>

      <button onClick={toggleEditing} className="editbtn">
        {isEditing ? save : edit}
      </button>

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
                      <Link to="/about">{menuTxt.about}</Link>
                    </li>
                    <li>
                      <Link to="/why-us">{menuTxt.whyUs}</Link>
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
                  <p>{menuTxt.studies}</p>
                  <span></span>
                </summary>
                <div>
                  <ul>
                    <li>
                      <Link to="/factories">{menuTxt.factories}</Link>
                    </li>
                    <li>
                      <Link to="/restaurants">{menuTxt.restaurants}</Link>
                    </li>
                    <li>
                      <Link to="/schools">{menuTxt.schools}</Link>
                    </li>
                    <li>
                      <Link to="/farms">{menuTxt.farms}</Link>
                    </li>
                    <li>
                      <Link to="/e-commerce-projects">{menuTxt.ecommerce}</Link>
                    </li>
                    <li>
                      <Link to="/medical-sector">{menuTxt.medical}</Link>
                    </li>
                    <li>
                      <Link to="/other-projects">{menuTxt.others}</Link>
                    </li>
                  </ul>
                </div>
              </div>
              <li>
                <Link to="/Administrational-consultations">
                  {menuTxt.adminConsult}
                </Link>
              </li>
              <li>
                <Link to="/files-management">{menuTxt.filesMgmt}</Link>
              </li>
              <li>
                <Link to="/previous-works">{menuTxt.prevWork}</Link>
              </li>
              <li>
                <Link to="/contact-request">{menuTxt.contact}</Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
