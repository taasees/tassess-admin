import { React, useState, useEffect } from "react";
import "../assets/style/app/EditLayout.css";
import axios from "../axiosInstance"; // make sure axios is installed
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



const editableColors = {
  "--primary-clr": "#ffba00",
  "--primary-clr-light": "#fdbf0d",
  "--body-bg-clr": "#ffffff",
  "--body-bg-clr-gray": "#efefef",
  "--dark-svg-clr": "#808080",
  "--light-svg-clr": "#ffffff",
  "--txt-clr": "#000000",
  "--txt-clr-light": "#ffffff",
  "--txt-clr-lightgray": "#d3d3d3",
  "--txt-clr-navy": "#0a0624",
  "--txt-clr-gray": "#5f6c76",
  "--dark-grey": "#3b3b3b",
  "--dark-grey2": "#276e9f",
};

// Helper to parse gradient string
const parseGradient = (gradientStr) => {
  try {
    const prefix = "linear-gradient(";
    if (!gradientStr.startsWith(prefix)) return null;

    const inner = gradientStr.slice(prefix.length, -1); // remove prefix and trailing ')'
    const parts = inner.split(",");
    const anglePart = parts[0].trim(); // e.g. "45deg"
    const stops = parts.slice(1).map((s) => s.trim().split(" ")[0]); // get colors only

    const angle = parseInt(anglePart.replace("deg", ""), 10);
    if (isNaN(angle)) return null;

    return { angle, stops };
  } catch {
    return null;
  }
};

export default function Edit() {
  const [isActive, setIsActive] = useState(false);
  const [selectedFont, setSelectedFont] = useState("arabic_bold_1");
  const [customColors, setCustomColors] = useState(editableColors);


  const [tempColors, setTempColors] = useState(editableColors);
  const [tempGradientStops, setTempGradientStops] = useState([
    "#e47d1a",
    "#f9a513",
    "#fdbf0d",
  ]);
  const [tempGradientAngle, setTempGradientAngle] = useState("45");

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

      try {
        await axios.post("/fonts/set", {
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
        const res = await axios.get("/fonts/latest");
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

  useEffect(() => {
    const fetchColors = async () => {
      try {
        const res = await axios.get("/colors/");
        if (res.status === 200 && res.data?.colors) {
          const fetchedColors = res.data.colors;
          setCustomColors(fetchedColors);
          Object.entries(fetchedColors).forEach(([key, val]) => {
            document.documentElement.style.setProperty(key, val);
          });

          // Parse gradient string and update temp states
          const gradientString = fetchedColors["--header-gradient"];
          if (gradientString) {
            const parsed = parseGradient(gradientString);
            if (parsed) {
              setTempGradientAngle(parsed.angle.toString());
              setTempGradientStops(parsed.stops);
            }
          }

          setTempColors(fetchedColors);
        }
      } catch (err) {
        console.error("Error fetching colors:", err);
      }
    };

    fetchColors();
  }, []);

  const handleColorChange = async (variable, value) => {
    document.documentElement.style.setProperty(variable, value);

    const updatedColors = {
      ...customColors,
      [variable]: value,
    };

    setCustomColors(updatedColors);

    const gradient = getComputedStyle(document.documentElement)
      .getPropertyValue("--header-gradient")
      .trim();

    try {
      const payload = {
        colors: { ...updatedColors },
        headerGradient: gradient,
      };

      const res = await axios.post("/colors/", payload);

      if (res.status === 200 || res.status === 201) {
        toast.success("تم حفظ اللون");
      } else {
        console.error("Unexpected response status:", res.status);
        toast.error("فشل حفظ اللون");
      }
    } catch (err) {
      console.error("Failed to save color:", err);
      toast.error("حدث خطأ أثناء حفظ اللون");
    }
  };



  const handleTempGradientChange = (angle, stops) => {
    setTempGradientAngle(angle);
    setTempGradientStops(stops);
  };

  const applyChanges = async () => {
    Object.entries(tempColors).forEach(([key, val]) => {
      document.documentElement.style.setProperty(key, val);
    });

    const gradient = `linear-gradient(${tempGradientAngle}deg, ${tempGradientStops.join(
      ", "
    )})`;
    document.documentElement.style.setProperty("--header-gradient", gradient);

    setCustomColors(tempColors);

    try {
      const res = await axios.post("/colors/", {
        colors: {
          ...tempColors,
          "--header-gradient": gradient,
        },
      });
      if (res.status === 200 || res.status === 201) {
        toast.success("تم حفظ اللون");
      } else {
        toast.error("فشل حفظ اللون");
      }
    } catch (error) {
      console.error("Failed to save color:", error);
      toast.error("حدث خطأ أثناء حفظ اللون");
    }
  };

  const [openSection, setOpenSection] = useState(null);

  const resetColors = async () => {
    Object.entries(editableColors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });

    const defaultAngle = "45";
    const defaultStops = ["#e47d1a", "#f9a513", "#fdbf0d"];

    setCustomColors(editableColors);

    const defaultGradient = `linear-gradient(${defaultAngle}deg, ${defaultStops.join(
      ", "
    )})`;
    document.documentElement.style.setProperty(
      "--header-gradient",
      defaultGradient
    );

    try {
      const res = await axios.post("/colors/", {
        colors: {
          ...editableColors,
          "--header-gradient": defaultGradient,
        },
      });
      if (res.status === 200 || res.status === 201) {
        toast.success("تمت إعادة تعيين الألوان");
      } else {
        console.error("Unexpected response status:", res.status);
        toast.error("فشل في إعادة تعيين الألوان");
      }
    } catch (err) {
      console.error("Failed to reset colors:", err);
      toast.error("حدث خطأ أثناء إعادة تعيين الألوان");
    }
  };

  // Icons (brush and arrowDown)
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
        <div className="fonts holder">
          <div
            className="top"
            onClick={() =>
              setOpenSection((prev) => (prev === "fonts" ? null : "fonts"))
            }
          >
            <h2>خطوط</h2> <span>{arrowDown}</span>
          </div>
          <div className={`choses ${openSection === "fonts" ? "active" : ""}`}>
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

        <div className="colors holder">
          <div
            className="top"
            onClick={() =>
              setOpenSection((prev) => (prev === "colors" ? null : "colors"))
            }
          >
            <h2>الألوان</h2> <span>{arrowDown}</span>
          </div>
          <div className={`choses ${openSection === "colors" ? "active" : ""}`}>
            {Object.entries(customColors).map(([variable, color]) => {
              if (variable === "--header-gradient") return null;

              return (
                <div
                  key={variable}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem",
                    gap: "1rem",
                  }}
                >
                  <label
                    htmlFor={variable}
                    style={{ minWidth: "120px", fontSize: "0.9rem" }}
                  >
                    {variable}
                  </label>
                  <input
                    type="color"
                    id={variable}
                    value={color}
                    onChange={(e) =>
                      handleColorChange(variable, e.target.value)
                    }
                  />
                </div>
              );
            })}

            <div className="gradient-section">
              <label style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
                تدرج اللون
              </label>

              <div style={{ marginBottom: "0.5rem" }}>
                <label>زاوية التدرج:</label>
                <input
                  type="number"
                  min="0"
                  max="360"
                  value={tempGradientAngle}
                  onChange={(e) => setTempGradientAngle(e.target.value)}
                  onBlur={applyChanges}
                  style={{ marginInlineStart: "1rem", width: "60px" }}
                />
                <span>°</span>
              </div>

              {tempGradientStops.map((color, idx) => (
                <input
                  key={idx}
                  type="color"
                  value={color}
                  onChange={(e) => {
                    const newStops = [...tempGradientStops];
                    newStops[idx] = e.target.value;
                    handleTempGradientChange(tempGradientAngle, newStops);
                  }}
                  onBlur={applyChanges}
                />
              ))}

              <div
                style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}
              >
                {tempGradientStops.length < 5 && (
                  <button
                    onClick={() => {
                      const newStops = [...tempGradientStops, "#ffffff"];
                      handleTempGradientChange(tempGradientAngle, newStops);
                      applyChanges();
                    }}
                  >
                    + لون
                  </button>
                )}
                {tempGradientStops.length > 2 && (
                  <button
                    onClick={() => {
                      const newStops = tempGradientStops.slice(0, -1);
                      handleTempGradientChange(tempGradientAngle, newStops);
                      applyChanges();
                    }}
                  >
                    - لون
                  </button>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "1rem",
                }}
              >
                <button
                  onClick={resetColors}
                  style={{
                    background: "#dc3545",
                    color: "#fff",
                    border: "none",
                    padding: "0.5rem 1rem",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  إعادة تعيين الألوان
                </button>
              </div>
            </div>
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
