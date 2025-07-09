import { React, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
//improt images
import paperwork from "../assets/images/paperwork.jpg";

import "../assets/style/common/feasibility-studies.css";
import AnimatedContent from "../components/AnimatedContent";
import { motion } from "framer-motion";

import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function Administrational_consultations() {
  const path = window.location.pathname; // e.g. "/e-commerce-projects"
  const lastSegment = path.split("/").filter(Boolean).pop().toLowerCase();
  const [customSlides, setCustomSlides] = useState([]);
  const [newSlide, setNewSlide] = useState({
    img: "",
    imgFile: null,
    title: "",
    desc: "",
  });

  const [showDialog, setShowDialog] = useState(false);

  const fileInputStyle = {
    width: "100%",
    height: "100%",
    position: "absolute",
    opacity: 0,
    top: 0,
    left: 0,
    cursor: "pointer",
  };

  const handleCustomImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomSlides((prev) =>
          prev.map((slide, i) =>
            i === index
              ? { ...slide, img: reader.result, imgFile: file }
              : slide
          )
        );
      };
      reader.readAsDataURL(file);
    }
  };

  // Update text (title or desc) for slide by index
  const handleCustomTextChange = (index, key, value) => {
    setCustomSlides((prev) =>
      prev.map((slide, i) => (i === index ? { ...slide, [key]: value } : slide))
    );
  };

  const addCustomSlide = async () => {
    if (!newSlide.img || !newSlide.title.trim() || !newSlide.desc.trim()) {
      toast.warn("Please fill all fields!");
      return;
    }

    // 1. Add preview slide immediately (optimistic update)
    const tempId = Date.now().toString(); // temporary ID for UI
    const tempSlide = {
      _id: tempId,
      title: newSlide.title,
      desc: newSlide.desc,
      img: newSlide.img, // already set with URL.createObjectURL
      imgFile: newSlide.imgFile,
    };

    setCustomSlides((prev) => [...prev, tempSlide]);
    setShowDialog(false);
    setNewSlide({ img: "", imgFile: null, title: "", desc: "" });

    try {
      // 2. Upload to server
      const savedSlide = await sendSlideToServer(newSlide);

      // 3. Replace the temp slide with real one (use same image)
      setCustomSlides((prev) =>
        prev.map((slide) =>
          slide._id === tempId
            ? { ...savedSlide, img: tempSlide.img } // use preview image
            : slide
        )
      );

      toast.success("تم حفظ الشريحة في الخادم بنجاح!");
    } catch (error) {
      // 4. Remove temp slide on failure
      setCustomSlides((prev) => prev.filter((slide) => slide._id !== tempId));
      toast.error("فشل حفظ الشريحة في الخادم.");
      console.error("Upload error:", error);
    }
  };

  const add = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="#000000"
    >
      <path d="M440-440H240q-17 0-28.5-11.5T200-480q0-17 11.5-28.5T240-520h200v-200q0-17 11.5-28.5T480-760q17 0 28.5 11.5T520-720v200h200q17 0 28.5 11.5T760-480q0 17-11.5 28.5T720-440H520v200q0 17-11.5 28.5T480-200q-17 0-28.5-11.5T440-240v-200Z" />
    </svg>
  );
  const addImage = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="#000000"
    >
      <path d="M480-480ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280q17 0 28.5 11.5T520-800q0 17-11.5 28.5T480-760H200v560h560v-280q0-17 11.5-28.5T800-520q17 0 28.5 11.5T840-480v280q0 33-23.5 56.5T760-120H200Zm40-160h480L570-480 450-320l-90-120-120 160Zm440-400h-40q-17 0-28.5-11.5T600-720q0-17 11.5-28.5T640-760h40v-40q0-17 11.5-28.5T720-840q17 0 28.5 11.5T760-800v40h40q17 0 28.5 11.5T840-720q0 17-11.5 28.5T800-680h-40v40q0 17-11.5 28.5T720-600q-17 0-28.5-11.5T680-640v-40Z" />
    </svg>
  );

  const sendSlideToServer = async (slide) => {
    const formData = new FormData();
    formData.append("title", slide.title);
    formData.append("desc", slide.desc);
    formData.append("img", slide.imgFile); // Original file object
    formData.append("category", lastSegment);

    const response = await axios.post(
      "https://jadwa-study-backend.netlify.app/.netlify/functions/app/slides",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    // Return the saved slide from server response, which should include _id
    return response.data;
  };

  const deleteCustomSlide = async (id) => {
    try {
      // Call backend to delete by id
      await axios.delete(`https://jadwa-study-backend.netlify.app/.netlify/functions/app/slides/${id}`);

      // Remove from state
      setCustomSlides((prev) => prev.filter((slide) => slide._id !== id));
      toast.success("تم حذف الشريحة بنجاح!");
    } catch (error) {
      toast.error("فشل حذف الشريحة.");
      console.error("Delete error:", error);
    }
  };
  const fetchSlidesByCategory = async (category) => {
    try {
      const response = await axios.get(
        `https://jadwa-study-backend.netlify.app/.netlify/functions/app/slides/category/${category}`
      );
      return response.data; // slides array
    } catch (err) {
      console.error("Failed to fetch slides:", err);
      return [];
    }
  };

  useEffect(() => {
    fetchSlidesByCategory(lastSegment).then((slides) => {
      const normalized = slides.map((slide) => ({
        ...slide,
        img: slide.imgUrl, // to keep it consistent with local previews
      }));
      setCustomSlides(normalized);
    });
  }, []);
  const modifySlide = async (id, index) => {
    const slide = customSlides[index];

    const formData = new FormData();
    formData.append("title", slide.title);
    formData.append("desc", slide.desc);
    formData.append("category", lastSegment);

    if (slide.imgFile) {
      formData.append("img", slide.imgFile); // if user uploaded a new image
    }

    try {
      const response = await axios.put(
        `https://jadwa-study-backend.netlify.app/.netlify/functions/app/slides/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // Update state with latest server data
      const updated = response.data;
      setCustomSlides((prev) =>
        prev.map(
          (s, i) => (i === index ? { ...updated, img: slide.img } : s) // keep local preview img
        )
      );
      toast.success("تم تعديل الشريحة بنجاح!");
    } catch (err) {
      toast.error("فشل تعديل الشريحة.");
      console.error("Modify error:", err);
    }
  };
  return (
    <motion.div
      className="about-pages"
      dir="auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.3 }}
    >
      <div className="headerimg">
        <AnimatedContent delay={0.2} threshold={0} duration={2}>
          <h1>إستشارات إدارية</h1>
        </AnimatedContent>
        <img src={paperwork} alt="" />
      </div>
      <button onClick={() => setShowDialog(true)} className="addSlide">
        {add}
      </button>
      {showDialog && (
        <div className="Dialog">
          <h1>إضافة شريحة جديدة</h1>
          <div className="img">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setNewSlide((prev) => ({
                    ...prev,
                    img: URL.createObjectURL(file),
                    imgFile: file, // store original file
                  }));
                }
              }}
            />
            <span className="icon">{addImage}</span>

            {newSlide.img && (
              <img src={newSlide.img} alt="preview" className="preview" />
            )}
          </div>

          <div className="text">
            <input
              type="text"
              placeholder="العنوان"
              value={newSlide.title}
              onChange={(e) =>
                setNewSlide({ ...newSlide, title: e.target.value })
              }
            />
            <textarea
              placeholder="الوصف"
              value={newSlide.desc}
              onChange={(e) =>
                setNewSlide({ ...newSlide, desc: e.target.value })
              }
            />
          </div>

          <div className="btns">
            <button onClick={addCustomSlide}>حفظ</button>
            <button onClick={() => setShowDialog(false)}>إغلاق</button>
          </div>
        </div>
      )}

      <div className="slides">
        {customSlides.map((slide, index) => (
          <div className="slide" key={slide._id || `custom_${index}`}>
            <div className="img" style={{ position: "relative" }}>
              <input
                type="file"
                accept="image/*"
                style={fileInputStyle}
                onChange={(e) => handleCustomImageChange(e, index)}
              />
              {slide.img && (
                <img src={slide.img || slide.imgUrl} alt={slide.title} />
              )}
            </div>
            <div className="text">
              <h3
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) =>
                  handleCustomTextChange(index, "title", e.target.innerText)
                }
              >
                {slide.title}
              </h3>
              <p
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) =>
                  handleCustomTextChange(index, "desc", e.target.innerText)
                }
                style={{ whiteSpace: "pre-wrap" }}
              >
                {slide.desc}
              </p>
              <div className="actions">
                <button
                  onClick={() => deleteCustomSlide(slide._id)}
                  className="delete"
                >
                  حذف
                </button>
                <button
                  onClick={() => modifySlide(slide._id, index)}
                  className="modify"
                >
                  تعديل
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
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
    </motion.div>
  );
}
