import { React, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
//improt images
import paperwork from "../assets/images/paperwork.jpg";
import img1 from "../assets/images/past_work.webp";
import about_2 from "../assets/images/about2.webp";
import about_3 from "../assets/images/about3.webp";
import about_4 from "../assets/images/about4.jpg";
import about_5 from "../assets/images/about5.webp";
import about_6 from "../assets/images/about6.webp";
import about_7 from "../assets/images/about7.webp";
import about_8 from "../assets/images/about8.webp";
import "../assets/style/common/aboutPages.css";
import AnimatedContent from "../components/AnimatedContent";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

export default function WhyUs() {
  const path = window.location.pathname; // e.g. "/e-commerce-projects"
  const lastSegment =
    path.split("/").filter(Boolean).pop()?.toLowerCase() || "";

  // State for single aboutData editing (in dialog)
  const [aboutData, setAboutData] = useState({});

  // State for multiple about cards list
  const [aboutCards, setAboutCards] = useState([]);

  const [showDialog, setShowDialog] = useState(false);

  // SVG icons (reuse your add/addImage from before)
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

  // Handler for image file input change inside aboutCards
  const handleAboutImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAboutCards((prev) =>
          prev.map((item, i) =>
            i === index ? { ...item, img: reader.result, imgFile: file } : item
          )
        );
      };
      reader.readAsDataURL(file);
    }
  };

  // Handler for text changes inside aboutCards contentEditable fields
  const handleAboutTextChange = (index, key, value) => {
    setAboutCards((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [key]: value } : item))
    );
  };

  // Add new aboutData card (optimistic UI, then send to backend)
  const addCustomAbout = async () => {
    const { topTitle, topSubtitle, sectionTitle, description, img, imgFile } =
      aboutData;

    if (
      !img ||
      // !topTitle.trim() ||
      // !sectionTitle.trim() ||
      !description.trim()
    ) {
      toast.warn("يرجى تعبئة جميع الحقول المطلوبة!");
      return;
    }

    const tempId = Date.now().toString();
    const tempAbout = {
      _id: tempId,
      topTitle,
      topSubtitle,
      sectionTitle,
      description,
      img,
      imgFile,
    };

    // Add to list (optimistic)
    setAboutCards((prev) => [...prev, tempAbout]);
    setShowDialog(false);
    setAboutData({
      _id: null,
      topTitle: "",
      topSubtitle: "",
      sectionTitle: "",
      img: "",
      imgFile: null,
      description: "",
    });

    try {
      // Upload to server
      const saved = await sendAboutToServer(tempAbout);

      // Replace temp with saved from server (keep preview img)
      setAboutCards((prev) =>
        prev.map((item) =>
          item._id === tempId
            ? { ...saved, img: tempAbout.img, imgFile: null }
            : item
        )
      );
      toast.success("تم حفظ البيانات بنجاح!");
    } catch (error) {
      // Remove temp on failure
      setAboutCards((prev) => prev.filter((item) => item._id !== tempId));
      toast.error("فشل حفظ البيانات في الخادم.");
      console.error("Upload error:", error);
    }
  };

  // Send about card to server (POST if no _id, else PUT)
  const sendAboutToServer = async (about) => {
    const formData = new FormData();
    formData.append("topTitle", about.topTitle);
    formData.append("topSubtitle", about.topSubtitle);
    formData.append("sectionTitle", about.sectionTitle);
    formData.append("description", about.description);
    formData.append("category", lastSegment);
    if (about.imgFile) {
      formData.append("img", about.imgFile);
    }

    let response;
    if (about._id && about._id.toString().length !== 13) {
      // existing (assumption: tempId is timestamp 13 chars)
      response = await axios.put(
        `https://jadwa-study-backend.netlify.app/.netlify/functions/app/${lastSegment}/${about._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
    } else {
      response = await axios.post(
        `https://jadwa-study-backend.netlify.app/.netlify/functions/app/${lastSegment}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
    }

    return response.data;
  };

  // Delete about card by index
  const deleteAbout = async (index) => {
    const id = aboutCards[index]._id;
    if (!id) {
      // just remove local if no id (probably temp)
      setAboutCards((prev) => prev.filter((_, i) => i !== index));
      return;
    }
    try {
      await axios.delete(
        `https://jadwa-study-backend.netlify.app/.netlify/functions/app/${lastSegment}/${id}`
      );
      setAboutCards((prev) => prev.filter((_, i) => i !== index));
      toast.success("تم حذف البيانات بنجاح!");
    } catch (err) {
      toast.error("فشل حذف البيانات.");
      console.error("Delete about error:", err);
    }
  };

  // Modify about card by index: send PUT to backend
  const modifyAbout = async (index) => {
    const about = aboutCards[index];
    try {
      const updated = await sendAboutToServer(about);
      // Update local card with server data, keep preview img
      setAboutCards((prev) =>
        prev.map((item, i) =>
          i === index ? { ...updated, img: about.img, imgFile: null } : item
        )
      );
      toast.success("تم تعديل البيانات بنجاح!");
    } catch (err) {
      toast.error("فشل تعديل البيانات.");
      console.error("Modify about error:", err);
    }
  };

  // Fetch about cards by category
  const fetchAboutByCategory = async (category) => {
    try {
      const response = await axios.get(
        `https://jadwa-study-backend.netlify.app/.netlify/functions/app/category/${category}`
      );
      return response.data; // expecting array of about cards
    } catch (err) {
      console.error("Failed to fetch about data:", err);
      return [];
    }
  };

  useEffect(() => {
    fetchAboutByCategory(lastSegment).then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        // Normalize to keep imgUrl as img and no imgFile
        const normalized = data.map((item) => ({
          ...item,
          img: item.imgUrl || "",
          imgFile: null,
        }));
        setAboutCards(normalized);
      }
    });
  }, [lastSegment]);
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.8,
        ease: "easeOut",
      },
    }),
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
          <h1>لماذا شارِك للإستشارات؟</h1>
        </AnimatedContent>
        <img src={paperwork} alt="" />
      </div>
      <button
        onClick={() => setShowDialog((prev) => !prev)}
        className="addSlide"
      >
        {add}
      </button>

      {showDialog && (
        <div className="Dialog-about">
          <div className="top">
            <input
              type="text"
              value={aboutData.topTitle}
              onChange={(e) =>
                setAboutData((prev) => ({ ...prev, topTitle: e.target.value }))
              }
              placeholder="نص"
            />
            <input
              type="text"
              value={aboutData.topSubtitle}
              onChange={(e) =>
                setAboutData((prev) => ({
                  ...prev,
                  topSubtitle: e.target.value,
                }))
              }
              placeholder="نص"
            />
          </div>

          <div className="title">
            <input
              type="text"
              value={aboutData.sectionTitle}
              onChange={(e) =>
                setAboutData((prev) => ({
                  ...prev,
                  sectionTitle: e.target.value,
                }))
              }
              placeholder="عنوان"
            />
          </div>

          <div className="img">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setAboutData((prev) => ({
                    ...prev,
                    img: URL.createObjectURL(file),
                    imgFile: file,
                  }));
                }
              }}
            />
            <span className="icon">{addImage}</span>
            {aboutData.img && <img src={aboutData.img} alt="preview" />}
          </div>

          <div className="text">
            <textarea
              value={aboutData.description}
              onChange={(e) =>
                setAboutData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="وصف النص"
              style={{ whiteSpace: "pre-wrap" }}
            />
          </div>

          <div className="btns">
            <button onClick={addCustomAbout}>حفظ</button>
            <button onClick={() => setShowDialog(false)}>إغلاق</button>
          </div>
        </div>
      )}

      <div className="cards">
        <h2>خبرتنا تمتد لـ اكثر من 13 عام في السوق الخليجي</h2>
        {aboutCards.map((about, index) => (
          <motion.div
            key={index}
            className="card"
            custom={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={cardVariants}
          >
            <div className="top">
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) =>
                  handleAboutTextChange(index, "topTitle", e.target.innerText)
                }
              >
                {about.topTitle}
              </span>
              <p
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) =>
                  handleAboutTextChange(
                    index,
                    "topSubtitle",
                    e.target.innerText
                  )
                }
              >
                {about.topSubtitle}
              </p>
            </div>

            <div className="title">
              <h2
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) =>
                  handleAboutTextChange(
                    index,
                    "sectionTitle",
                    e.target.innerText
                  )
                }
              >
                {about.sectionTitle}
              </h2>
            </div>

            <div className="img" style={{ position: "relative" }}>
              <input
                type="file"
                accept="image/*"
                style={{
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  opacity: 0,
                  top: 0,
                  left: 0,
                  cursor: "pointer",
                }}
                onChange={(e) => handleAboutImageChange(e, index)}
              />
              {about.img && <img src={about.img} alt={about.sectionTitle} />}
            </div>

            <div className="text">
              <p
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) =>
                  handleAboutTextChange(
                    index,
                    "description",
                    e.target.innerText
                  )
                }
                style={{ whiteSpace: "pre-wrap" }}
              >
                {about.description}
              </p>
            </div>
            <div className="actions">
              <button onClick={() => deleteAbout(index)} className="delete">
                حذف
              </button>
              <button onClick={() => modifyAbout(index)} className="modify">
                تعديل
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
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
