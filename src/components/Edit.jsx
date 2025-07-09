import { React, useState, useEffect } from "react";
import "../assets/style/app/EditLayout.css";
import axios from "axios"; // make sure axios is installed
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const fontMap = {
  arabic_bold_1: {
    regular: "arabic_Regular_1",
    bold: "arabic_bold_1",
    extraBold: "arabic_ExtraBold_1",
  },
  arabic_bold_2: {
    regular: "arabic_Regular_2",
    bold: "arabic_bold_2",
    extraBold: "arabic_ExtraBold_2",
  },
  arabic_bold_3: {
    regular: "arabic_Regular_3",
    bold: "arabic_bold_3",
    extraBold: "arabic_ExtraBold_3",
  },
  arabic_bold_4: {
    regular: "arabic_Regular_4",
    bold: "arabic_bold_4",
    extraBold: "arabic_ExtraBold_4",
  },
  arabic_bold_5: {
    regular: "arabic_Regular_5",
    bold: "arabic_bold_5",
    extraBold: "arabic_ExtraBold_5",
  },
};
export default function Edit() {
  const [isActive, setIsActive] = useState(false);
  const [isShow, setisShow] = useState(false);
  const [selectedFont, setSelectedFont] = useState("arabic_bold_1");

  const handleFontClick = async (fontKey) => {
    const fontObject = fontMap[fontKey];
    if (fontObject) {
      setSelectedFont(fontKey);
      document.documentElement.style.setProperty(
        "--arabic-fm-r",
        fontObject.regular
      );
      document.documentElement.style.setProperty(
        "--arabic-fm-b",
        fontObject.bold
      );
      document.documentElement.style.setProperty(
        "--arabic-fm-exb",
        fontObject.extraBold
      );

      // Submit to local server
      try {
        await axios.post("https://jadwa-study-backend.netlify.app/.netlify/functions/app/fonts/set", {
          fontFamily: fontKey,
          fontStyles: fontObject,
        });
        toast.success("تم تحديث الخط");
      } catch (err) {
        console.error("Failed to submit font:", err);
      }
    }
  };

  useEffect(() => {
    // Fetch latest saved font from server
    const fetchFont = async () => {
      try {
        const res = await axios.get("https://jadwa-study-backend.netlify.app/.netlify/functions/app/fonts/latest");
        const { fontFamily, fontStyles } = res.data;
        setSelectedFont(fontFamily);
        document.documentElement.style.setProperty(
          "--arabic-fm-r",
          fontStyles.regular
        );
        document.documentElement.style.setProperty(
          "--arabic-fm-b",
          fontStyles.bold
        );
        document.documentElement.style.setProperty(
          "--arabic-fm-exb",
          fontStyles.extraBold
        );
      } catch (err) {
        console.error("Error fetching font:", err.message);
      }
    };

    fetchFont();
  }, []);
    
  const brush = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="#FFFFFF"
    >
      <path d="M240-120q-45 0-89-22t-71-58q26 0 53-20.5t27-59.5q0-50 35-85t85-35q50 0 85 35t35 85q0 66-47 113t-113 47Zm0-80q33 0 56.5-23.5T320-280q0-17-11.5-28.5T280-320q-17 0-28.5 11.5T240-280q0 23-5.5 42T220-202q5 2 10 2h10Zm230-160L360-470l358-358q11-11 27.5-11.5T774-828l54 54q12 12 12 28t-12 28L470-360Zm-190 80Z" />
    </svg>
  );
  const arrowDown = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="#000000"
    >
      <path d="M480-361q-8 0-15-2.5t-13-8.5L268-556q-11-11-11-28t11-28q11-11 28-11t28 11l156 156 156-156q11-11 28-11t28 11q11 11 11 28t-11 28L508-372q-6 6-13 8.5t-15 2.5Z" />
    </svg>
  );
  return (
    <div className="EditLayout">
      <div className={`content ${isActive ? "active" : ""}`} dir="auto">
        <div className="fonts">
          <div className="top" onClick={() => setisShow((prev) => !prev)}>
            <h2>خطوط</h2> <span>{arrowDown}</span>
          </div>
          <div className={`choses ${isShow ? "active" : ""}`}>
            {[1, 2, 3, 4, 5].map((num) => {
              const fontName = `arabic_bold_${num}`;
              return (
                <div
                  className={`font ${
                    selectedFont === fontName ? "active" : ""
                  }`}
                  key={num}
                  onClick={() => handleFontClick(fontName)}
                >
                  <p style={{ fontFamily: fontName }}>أطلق إمكانيات شركتك</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <button
        className={`activeBTN ${isActive ? "active" : ""}`}
        onClick={() => setIsActive((prev) => !prev)}
      >
        {brush}
      </button>
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        style={{ zIndex: 10000 }}
      />
    </div>
  );
}
