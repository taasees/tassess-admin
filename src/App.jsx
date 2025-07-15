import { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "./assets/style/app/app.css";
import CountUp from "./components/CountUp";
import { Link } from "react-router-dom";
import AnimatedContent from "./components/AnimatedContent";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
// Import images
import img1 from "./assets/images/herobanner__front__1.webp";
import img2 from "./assets/images/herobanner__front__2.webp";
import img3 from "./assets/images/herobanner__front__3.webp";
import video_img from "./assets/images/video__3.webp";
import market_growth from "./assets/images/market_growth.webp";
import paperwork from "./assets/images/paperwork.jpg";
// Import videos
import heroVideo from "./assets/videos/herobanner_full.mp4";
import sharek from "./assets/videos/sharek.mp4";

import feasibility_studies from "./assets/videos/feasibility_studies.mp4";
import administrational_consultations from "./assets/videos/administrational_consultations.mp4";
import files_management from "./assets/videos/files_management.mp4";

import { motion } from "framer-motion";
import axios from "./axiosInstance.jsx";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [openIndex, setOpenIndex] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [aboutData, setAboutData] = useState({});
  const [aboutCards, setAboutCards] = useState([]);

  const toggleAnswer = (index) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

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
  const playVideo = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="#EA3323"
    >
      <path d="M320-200v-560l440 280-440 280Zm80-280Zm0 134 210-134-210-134v268Z" />
    </svg>
  );
  const [Hero, setHero] = useState({
    slide1_title: "",
    slide1_desc: "",
    slide2_title: "",
    slide2_desc: "",
    slide3_title: "",
    slide3_desc: "",
    bg_video: "",
  });
  const [isEditing_hero, setIsEditing_hero] = useState(false);
  const [bg_video, setbg_video] = useState(null);
  const [bg_videoupload, setbg_videoupload] = useState(null);
  const toggleEditing_hero = () => {
    if (isEditing_hero) {
      const editedElements = document.querySelectorAll("[data-keyhero]");
      const newValues = { ...Hero };
      let hasEmptyFields = false;

      editedElements.forEach((el) => {
        const key = el.getAttribute("data-keyhero");
        const value = el.textContent.trim();

        // Skip checking non-text fields (like video or thumbnail)
        if (!value && key !== "bg_video") {
          toast.error(`الحقل "${key}" لا يمكن أن يكون فارغًا`);
          hasEmptyFields = true;
        } else {
          newValues[key] = value;
        }
      });

      if (hasEmptyFields) return;

      // setTextValues(newValues);
      console.log("Saved Values:", newValues);

      // Call your saving function here
      const saveTextContent_hero = async (textValues) => {
        try {
          const formData = new FormData();

          for (const key in textValues) {
            formData.append(key, textValues[key]);
          }

          if (bg_videoupload) {
            formData.append("bg_video", bg_videoupload); // same name as multer expects
          }
          // console.log(bg_videoupload);
          const response = await axios.post("/hero", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          if (response.status === 200 || response.status == 201)
            return toast.success("تم حفظ البيانات بنجاح ");
        } catch (error) {
          console.error("Error saving text content:", error);
          toast.error("حدث خطأ أثناء الحفظ");
        }
      };
      saveTextContent_hero(newValues);
    }
    // Toggle editing state
    setIsEditing_hero((prev) => !prev);
  };
  const handleImageUpload_hero = (e) => {
    const file = e.target.files[0];

    if (file && file.type.startsWith("video/")) {
      const videoURL = URL.createObjectURL(file);
      setbg_video(videoURL);
      setbg_videoupload(file);

      // Wait for React to update the DOM
      setTimeout(() => {
        const videoEl = document.getElementById("bg_video");
        if (videoEl) {
          videoEl.load(); // Reload the new source
          videoEl.play().catch((err) => {
            console.error("Auto-play failed:", err);
          });
        }
      }, 100);
    } else {
      alert("Please select a valid video file.");
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
  // Handler for text changes inside aboutCards contentEditable fields
  const handleAboutTextChange = (index, key, value) => {
    setAboutCards((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [key]: value } : item))
    );
  };
  // Add new aboutData card (optimistic UI, then send to backend)
  const addCustomAbout = async () => {
    const { answer, question } = aboutData;

    if (!answer || !question) {
      toast.warn("يرجى تعبئة جميع الحقول المطلوبة!");
      return;
    }

    const tempId = Date.now().toString();
    const tempAbout = {
      _id: tempId,
      answer,
      question,
    };

    // Add to list (optimistic)
    setAboutCards((prev) => [...prev, tempAbout]);
    setShowDialog(false);
    setAboutData({
      _id: null,
      answer: "",
      question: "",
    });

    try {
      // Upload to server
      const saved = await sendAboutToServer(tempAbout);

      // Replace temp with saved from server (keep preview img)
      setAboutCards((prev) =>
        prev.map((item) => (item._id === tempId ? { ...saved } : item))
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
    formData.append("answer", about.answer);
    formData.append("question", about.question);

    let response;
    if (about._id && about._id.toString().length !== 13) {
      // existing (assumption: tempId is timestamp 13 chars)
      response = await axios.put(`/question/${about._id}`, about);
    } else {
      response = await axios.post(`/question`, about);
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
      await axios.delete(`/question/${id}`);
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

  const fetchAboutByCategory = async () => {
    try {
      const response = await axios.get(`/question`);
      return response.data; // expecting array of about cards
    } catch (err) {
      console.error("Failed to fetch about data:", err);
      return [];
    }
  };
  useEffect(() => {
    fetchAboutByCategory().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        // Normalize to keep imgUrl as img and no imgFile
        const normalized = data.map((item) => ({
          ...item,
        }));
        setAboutCards(normalized);
      }
    });
  }, []);
  // useEffect(() => {
  //   const video = document.getElementById("hero-video");
  //   if (video) {
  //     video.play().catch((err) => {
  //       console.warn("Autoplay failed:", err);
  //     });
  //   }
  // }, []);
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const videoRef = useRef(null);

  const handlePlayClick = () => {
    setIsVideoVisible(true);

    // Wait a moment to ensure video is ready
    setTimeout(() => {
      videoRef.current?.play().catch((err) => {
        console.error("Autoplay failed:", err);
      });
    }, 100);
  };

  const closeVideo = () => {
    videoRef.current?.pause();
    setIsVideoVisible(false);
  };

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

  const [isEditing, setIsEditing] = useState(false);
  const [uploaded, setuploaded] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [thumbnail, setthumbnail] = useState(null);
  const [thumbnailupload, setthumbnailupload] = useState(null);

  const [textValues, setTextValues] = useState({
    headerTitle: "",
    headerDesc: "",
    card1Title: "",
    card1Desc: "",
    card2Title: "",
    card2Desc: "",
    card3Title: "",
    card3Desc: "",
    video: uploadedFile,
    thumbnail: thumbnailupload,
  });

  const toggleEditing = () => {
    if (isEditing) {
      const editedElements = document.querySelectorAll("[data-key]");
      const newValues = { ...textValues };
      let hasEmptyFields = false;

      editedElements.forEach((el) => {
        const key = el.getAttribute("data-key");
        const value = el.textContent.trim();

        // Skip checking non-text fields (like video or thumbnail)
        if (!value && key !== "video" && key !== "thumbnail") {
          toast.error(`الحقل "${key}" لا يمكن أن يكون فارغًا`);
          hasEmptyFields = true;
        } else {
          newValues[key] = value;
        }
      });

      if (hasEmptyFields) return;

      setTextValues(newValues);
      console.log("Saved Values:", newValues);

      // Call your saving function here
      saveTextContent(newValues);
    }

    // Toggle editing state
    setIsEditing((prev) => !prev);
  };

  const saveTextContent = async (textValues) => {
    try {
      const formData = new FormData();

      for (const key in textValues) {
        formData.append(key, textValues[key]);
      }

      if (uploadedFile) {
        formData.append("video", uploadedFile); // same name as multer expects
      }
      if (thumbnailupload) {
        formData.append("thumbnail", thumbnailupload);
      }
      const response = await axios.post("/textContent", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200)
        return toast.success("تم حفظ البيانات بنجاح ");
    } catch (error) {
      console.error("Error saving text content:", error);
      toast.error("حدث خطأ أثناء الحفظ");
    }
  };

  const handleLinkClick = (e) => {
    if (isEditing) {
      e.preventDefault();
    }
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setuploaded(URL.createObjectURL(file)); // For preview
      setUploadedFile(file); // For upload
    }
  };
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setthumbnail(URL.createObjectURL(file)); // For preview
      setthumbnailupload(file); // For upload
    }
  };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [content, setContent] = useState({});

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get("/textContent");
        setContent(response.data.data);
        const response2 = await axios.get("/hero");
        setHero(response2.data.data);

        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
        setContent(null);
      } finally {
        setLoading(false);
        setTimeout(() => {
          const videoEl = document.getElementById("bg_video");
          if (videoEl) {
            videoEl.load(); // Reload the new source
            const onLoadedData = () => {
              videoEl.play().catch((err) => {
                console.error("Auto-play failed:", err);
              });
              videoEl.removeEventListener("loadeddata", onLoadedData);
            };
            videoEl.addEventListener("loadeddata", onLoadedData);
          }
        }, 500);
      }
    };

    fetchContent();
  }, []);

  const videoIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="#FFFFFF"
    >
      <path d="M360-320h80v-120h120v-80H440v-120h-80v120H240v80h120v120ZM160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h480q33 0 56.5 23.5T720-720v180l160-160v440L720-420v180q0 33-23.5 56.5T640-160H160Zm0-80h480v-480H160v480Zm0 0v-480 480Z" />
    </svg>
  );
  const imgicon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="#FFFFFF"
    >
      <path d="M480-480ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h320v80H200v560h560v-320h80v320q0 33-23.5 56.5T760-120H200Zm40-160h480L570-480 450-320l-90-120-120 160Zm440-320v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80Z" />
    </svg>
  );

  return (
    <motion.div
      className="container"
      dir="auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.3 }}
    >
      <main className="hero">
        <Swiper
          dir="rtl"
          rewind={true}
          spaceBetween={30}
          centeredSlides={true}
          speed={1500}
          navigation={true}
          modules={[Autoplay, Navigation]}
          className="mySwiper"
        >
          {/* Slide 1 */}
          <SwiperSlide>
            <div className="swipe-image">
              <motion.div
              
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={cardVariants}
                className="text"
              >
                <h2
                  contentEditable={isEditing_hero}
                  suppressContentEditableWarning={true}
                  data-keyhero="slide1_title"
                >
                  {Hero.slide1_title || ""}
                </h2>
                <p
                  contentEditable={isEditing_hero}
                  suppressContentEditableWarning={true}
                  data-keyhero="slide1_desc"
                >
                  {Hero.slide1_desc || ""}
                </p>
                {/* <Link to={""}>اطلب الخدمة</Link> */}
              </motion.div>

              <div className="img">
                <img src={img1} alt="" />
              </div>
            </div>
          </SwiperSlide>

          {/* Slide 2 */}
          <SwiperSlide>
            <div className="swipe-image">
              <div className="text">
                <h2
                  contentEditable={isEditing_hero}
                  suppressContentEditableWarning={true}
                  data-keyhero="slide2_title"
                >
                  {Hero.slide2_title || ""}
                </h2>
                <p
                  contentEditable={isEditing_hero}
                  suppressContentEditableWarning={true}
                  data-keyhero="slide2_desc"
                >
                  {Hero.slide2_desc || ""}
                </p>
                {/* <Link to={""}>اطلب الخدمة</Link> */}
              </div>
              <div className="img">
                <img src={img2} alt="" />
              </div>
            </div>
          </SwiperSlide>

          {/* Slide 3 */}
          <SwiperSlide>
            <div className="swipe-image">
              <div className="text">
                <h2
                  contentEditable={isEditing_hero}
                  suppressContentEditableWarning={true}
                  data-keyhero="slide3_title"
                >
                  {Hero.slide3_title || ""}
                </h2>
                <p
                  contentEditable={isEditing_hero}
                  suppressContentEditableWarning={true}
                  data-keyhero="slide3_desc"
                >
                  {Hero.slide3_desc || ""}
                </p>
                {/* <Link to={""}>اطلب الخدمة</Link> */}
              </div>
              <div className="img">
                <img src={img3} alt="" />
              </div>
            </div>
          </SwiperSlide>
        </Swiper>

        <div className="bg-video">
          <video autoPlay loop muted playsInline controls={false} id="bg_video">
            <source src={bg_video || Hero?.bg_videoUrl} />
          </video>
        </div>
        <div className="actions">
          <button>
            <input
              type="file"
              accept="video/*"
              data-keyhero="be_video"
              onChange={handleImageUpload_hero}
            />
            {videoIcon}
          </button>
          <button onClick={toggleEditing_hero}>
            {isEditing_hero ? "حفظ" : "تفعيل"}
          </button>
        </div>
      </main>
      <section>
        <header className="section-header">
          <h1
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            data-key="headerTitle"
          >
            {content?.headerTitle || textValues.headerTitle || ""}
          </h1>
          <p
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            data-key="headerDesc"
          >
            {content?.headerDesc || textValues.headerDesc || ""}
          </p>
        </header>

        <AnimatedContent delay={0.2} duration={1.2}>
          <Link
            to={"/feasibility-studies"}
            className="card"
            onClick={handleLinkClick}
          >
            <div className="card-video">
              <video autoPlay loop muted playsInline controls={false}>
                <source src={feasibility_studies} />
              </video>
            </div>
            <div className="text">
              <h1
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
                data-key="card1Title"
              >
                {content?.card1Title || ""}
              </h1>
              <p
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
                data-key="card1Desc"
              >
                {content?.card1Desc || ""}
              </p>
            </div>
          </Link>
        </AnimatedContent>

        <AnimatedContent delay={0.2} duration={1.2}>
          <Link
            to={"/Administrational-consultations"}
            className="card"
            onClick={handleLinkClick}
          >
            <div className="card-video">
              <video autoPlay loop muted playsInline controls={false}>
                <source src={administrational_consultations} />
              </video>
            </div>
            <div className="text">
              <h1
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
                data-key="card2Title"
              >
                {content?.card2Title || ""}
              </h1>
              <p
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
                data-key="card2Desc"
              >
                {content?.card2Desc || ""}
              </p>
            </div>
          </Link>
        </AnimatedContent>

        <AnimatedContent delay={0.2} duration={1.2}>
          <Link
            to={"/files-management"}
            className="card"
            onClick={handleLinkClick}
          >
            <div className="card-video">
              <video autoPlay loop muted playsInline controls={false}>
                <source src={files_management} />
              </video>
            </div>
            <div className="text">
              <h1
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
                data-key="card3Title"
              >
                {content?.card3Title || ""}
              </h1>
              <p
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
                data-key="card3Desc"
              >
                {content?.card3Desc || ""}
              </p>
            </div>
          </Link>
        </AnimatedContent>

        <AnimatedContent delay={0.2} duration={1.2}>
          <div className="thumbnail">
            <img src={thumbnail || content?.thumbnailUrl || video_img} alt="" />
            <div className="actions">
              <div className="upload-video">
                {videoIcon}
                <input
                  type="file"
                  accept="video/*"
                  data-key="video"
                  onChange={handleVideoUpload}
                />
              </div>
              <div className="upload-img">
                {imgicon}
                <input
                  type="file"
                  accept="image/*"
                  data-key="thumbnail"
                  onChange={handleImageUpload}
                />
              </div>
            </div>

            <div className="playbutton" onClick={handlePlayClick}>
              <span>{playVideo}</span>
            </div>
          </div>
        </AnimatedContent>

        {isVideoVisible && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100vh",
              backgroundColor: "rgba(0, 0, 0, 0.85)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 99999999,
            }}
            onClick={closeVideo}
          >
            <video
              ref={videoRef}
              controls
              style={{ maxWidth: "90%", maxHeight: "90%" }}
            >
              <source
                src={uploaded || content.videoUrl || sharek}
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>

            <button
              onClick={closeVideo}
              style={{
                position: "absolute",
                top: "1.5rem",
                right: "0rem",
                fontSize: "2rem",
                background: "none",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              &times;
            </button>
          </div>
        )}
        <div className="btn">
          <button onClick={toggleEditing} style={{ marginBottom: "1rem" }}>
            {isEditing ? "حفظ التعديل" : "تفعيل"}
          </button>
        </div>
      </section>

      {/* <div className="count">
        <AnimatedContent threshold={0.5} delay={0.2} duration={1.2}>
          <div className="numbers">
            <span>
              <CountUp from={0} to={1150} duration={2} />+
            </span>
            <p>دراسات الجدوى</p>
          </div>
        </AnimatedContent>
        <AnimatedContent threshold={0.5} delay={0.2} duration={1.2}>
          <div className="market_growth">
            <img src={market_growth} alt="" />
          </div>
        </AnimatedContent>
        <AnimatedContent threshold={0.5} delay={0.2} duration={1.2}>
          <div className="numbers">
            <span>
              <CountUp from={0} to={28} duration={2} />+
            </span>
            <p>استشاري مميز</p>
          </div>
        </AnimatedContent>
        <AnimatedContent threshold={0.5} delay={0.2} duration={1.2}>
          <div className="market_growth">
            <img src={market_growth} alt="" />
          </div>
        </AnimatedContent>
        <AnimatedContent threshold={0.5} delay={0.2} duration={1.2}>
          <div className="numbers">
            <span>
              <CountUp from={0} to={180} duration={2} />+
            </span>
            <p>خدمات استشارية</p>
          </div>
        </AnimatedContent>
        <AnimatedContent threshold={0.5} delay={0.2} duration={1.2}>
          <div className="market_growth">
            <img src={market_growth} alt="" />
          </div>
        </AnimatedContent>
        <AnimatedContent threshold={0.5} delay={0.2} duration={1.2}>
          <div className="numbers">
            <span>
              <CountUp from={0} to={500} duration={2} />+
            </span>
            <p>إستشارات إدارية دورية</p>
          </div>
        </AnimatedContent>
      </div> */}
      <div className="feedback">
        <AnimatedContent threshold={0.7} delay={0.2} duration={1.2}>
          <header className="feedback-header">
            <span>آراء العملاء</span>
            <h3>شبكتنا مليئة بالعملاء ذو التجارب الناجحة</h3>
          </header>
        </AnimatedContent>
        <Swiper
          dir="rtl"
          rewind={true}
          spaceBetween={30}
          centeredSlides={true}
          slidesPerView={1} // 👈 default for mobile
          breakpoints={{
            768: {
              slidesPerView: 3, // 👈 from 768px and up (desktop/tablet)
            },
          }}
          autoplay={{
            delay: 4500,
            disableOnInteraction: false,
          }}
          speed={1500}
          navigation={true}
          pagination={{ clickable: true }}
          modules={[Autoplay, Navigation, Pagination]}
          className="feedbackSwiper"
        >
          <SwiperSlide>
            <AnimatedContent threshold={0.7} delay={0.2} duration={1.2}>
              <div className="feedBack-text">
                <p>
                  “ما نستطيع قوله بشأن ادارة شركة شارِك في اختيار فريق عمل
                  متكامل حقق لي العديد من الخدمات والإستشارات وعدد ٢ دراسة جدوى
                  لمشروعات خاصة بي حقا ما يميز هذه الشركة هو قدرتهم على الادارة
                  المتميزة التي حققت المعادلة بين الأسعار المناسبة والجودة
                  المطلوبة. شكرا لكم”
                </p>
                <span className="person">
                  <p className="name">فاطمة المري</p>
                  <p className="job">صاحب المشروع</p>
                </span>
              </div>
            </AnimatedContent>
          </SwiperSlide>
          <SwiperSlide>
            <AnimatedContent threshold={0.7} delay={0.2} duration={1.2}>
              <div className="feedBack-text">
                <p>
                  “كنت ابحث عن شركة تقوم بإعداد دراسة جدوى لمشروع مصنع هياكل
                  حديدية واخبرني اخوي بان اقوم بعمل دراسة الجدوى من خلال شركة
                  شارِك للإستشارات واستلمت دراسة جدوى للمشروع وحصلت على الموافقة
                  بدون أي تعديلات بفضل الله”
                </p>
                <span className="person">
                  <p className="name">عبد العزيز الكواري</p>
                  <p className="job">رائد اعمال</p>
                </span>
              </div>
            </AnimatedContent>
          </SwiperSlide>
          <SwiperSlide>
            <AnimatedContent threshold={0.7} delay={0.2} duration={1.2}>
              <div className="feedBack-text">
                <p>
                  “كانت شركة شارِك للإستشارات سببا في تغيير مستقبلي حيث قمت من
                  خلالهم بطلب خدمة دراسة جدوى وبالفعل حصلت على دراسة الجدوى
                  للمشروع وبالفعل كانت النتائج الحمد لله مرضية”
                </p>
                <span className="person">
                  <p className="name">احمد المعاضيد</p>
                  <p className="job">رائد اعمال</p>
                </span>
              </div>
            </AnimatedContent>
          </SwiperSlide>
          <SwiperSlide>
            <AnimatedContent threshold={0.7} delay={0.2} duration={1.2}>
              <div className="feedBack-text">
                <p>
                  “ما نستطيع قوله بشأن ادارة شركة شارِك في اختيار فريق عمل
                  متكامل حقق لي العديد من الخدمات والإستشارات وعدد ٢ دراسة جدوى
                  لمشروعات خاصة بي حقا ما يميز هذه الشركة هو قدرتهم على الادارة
                  المتميزة التي حققت المعادلة بين الأسعار المناسبة والجودة
                  المطلوبة. شكرا لكم”
                </p>
                <span className="person">
                  <p className="name">محمد الهاجري</p>
                  <p className="job">رجل أعمال</p>
                </span>
              </div>
            </AnimatedContent>
          </SwiperSlide>
          <SwiperSlide>
            <AnimatedContent threshold={0.7} delay={0.2} duration={1.2}>
              <div className="feedBack-text">
                <p>
                  “ان صدق التعامل في الوقت والدقة للمشروع الذي قمت بإعداد دراسة
                  جدوى لدى شركة شارِك للإستشارات هو ما جعلني استمر معهم في
                  العديد من الإستشارات الاخرى لمشاريعي”
                </p>
                <span className="person">
                  <p className="name">ناصر الدوسري</p>
                  <p className="job">رجل أعمال</p>
                </span>
              </div>
            </AnimatedContent>
          </SwiperSlide>
        </Swiper>
      </div>
      <div className="paperwork">
        <img src={paperwork} alt="" />
        <AnimatedContent threshold={0.3} delay={0.2} duration={1.2}>
          <h2>نعرض عليكم اكثر الاسئلة شيوعاً من عملائنا الكرام</h2>
        </AnimatedContent>
      </div>
      <div className="commonQuestion">
        <div className="top">
          <button
            onClick={() => setShowDialog((prev) => !prev)}
            className="addSlide"
          >
            {add}
          </button>
        </div>
        {showDialog && (
          <div className="Dialog-questions">
            <div className="top">
              <h2>اضافة سؤال</h2>
            </div>
            <div className="title">
              <input
                type="text"
                value={aboutData.question || ""}
                onChange={(e) =>
                  setAboutData((prev) => ({
                    ...prev,
                    question: e.target.value,
                  }))
                }
                placeholder="سؤال"
              />
            </div>
            <div className="text">
              <textarea
                value={aboutData.answer || ""}
                onChange={(e) =>
                  setAboutData((prev) => ({
                    ...prev,
                    answer: e.target.value,
                  }))
                }
                placeholder="اجابة"
                style={{ whiteSpace: "pre-wrap" }}
              />
            </div>
            <div className="btns">
              <button onClick={addCustomAbout}>حفظ</button>
              <button onClick={() => setShowDialog((prev) => !prev)}>
                إغلاق
              </button>
            </div>
          </div>
        )}

        {aboutCards.map((about, index) => (
          <motion.div
            className="text"
            key={index}
            custom={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={cardVariants}
          >
            <div
              className={`question ${openIndex === index ? "open" : ""}`}
              onClick={() => toggleAnswer(index)}
            >
              <h4
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) =>
                  handleAboutTextChange(index, "question", e.target.innerText)
                }
              >
                {about.question}
              </h4>
              <span
                style={{
                  transform:
                    openIndex === index ? "rotate(180deg)" : "rotate(0deg)",
                }}
              >
                {arrowDown}
              </span>
            </div>
            <div className={`answer ${openIndex === index ? "open" : ""}`}>
              <div>
                <p
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    handleAboutTextChange(index, "answer", e.target.innerText)
                  }
                >
                  {about.answer}
                </p>

                <div className="actions">
                  <button onClick={() => deleteAbout(index)} className="delete">
                    حذف
                  </button>
                  <button onClick={() => modifyAbout(index)} className="modify">
                    تعديل
                  </button>
                </div>
              </div>
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

export default App;
