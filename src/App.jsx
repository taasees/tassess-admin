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
  const swiperRef = useRef(null);
  const videoRef = useRef(null);

  const [isVideoVisible, setIsVideoVisible] = useState(false);
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

      if (response.status === 200 || response.status === 201)
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
  const [paperwork, setpaperwork] = useState({});

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get("/textContent");
        setContent(response.data.data);
        const response2 = await axios.get("/hero");
        setHero(response2.data.data);
        const response3 = await axios.get("/paperwork");
        setpaperwork(response3.data.data);
        if (localStorage.getItem("paperwork")) {
          localStorage.setItem("paperwork", null);
        }
        localStorage.setItem("paperwork", JSON.stringify(response3.data.data));
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
  const [menuTxt, setmenuTxt] = useState({});

  useEffect(() => {
    try {
      const savedMenu = localStorage.getItem("menuTxt");
      if (savedMenu && savedMenu !== "undefined") {
        setmenuTxt(JSON.parse(savedMenu));
      }
    } catch (err) {
      console.warn("Failed to parse saved menuTxt from localStorage:", err);
      setmenuTxt({});
    }
  }, []);
  const [isEditing_paperwork, setisEditing_paperwork] = useState(false);
  const [editableText, setEditableText] = useState(
    "نعرض عليكم اكثر الاسئلة شيوعاً من عملائنا الكرام"
  );
  const [previewImage, setPreviewImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const toggleEditing_paperwork = async () => {
    if (isEditing_paperwork) {
      await handleSaveChanges_paperwork();
    }
    setisEditing_paperwork((prev) => !prev);
  };
  const handleImageUpload_paperwork = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };
  const handleSaveChanges_paperwork = async () => {
    try {
      const formData = new FormData();
      formData.append("text", editableText);
      if (imageFile) formData.append("image", imageFile);

      const response = await axios.post("/paperwork/save", formData);
      if (response.status === 200) {
        toast.success("تم حفظ التغييرات");
      }
    } catch (err) {
      toast.error("فشل في حفظ التغييرات");
      console.error(err);
    }
  };

  const [isEditing_q, setIsEditing_q] = useState(false);

  const feedbackRef = useRef([]);
  const [showFeedback, setShowFeedback] = useState(null);

  const [feedbacks, setFeedbacks] = useState([...feedbackRef.current]);

  const handleInput = (e) => {
    const index = parseInt(e.target.getAttribute("data-feedback-index"));
    const key = e.target.getAttribute("data-q");
    const value = e.target.innerText;

    const updated = [...feedbacks];
    updated[index][key] = value;
    setFeedbacks(updated);
  };

  const deleteicon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="#1f1f1f"
    >
      <path d="M280-120q-33 0-56.5-23.5T200-200v-520q-17 0-28.5-11.5T160-760q0-17 11.5-28.5T200-800h160q0-17 11.5-28.5T400-840h160q17 0 28.5 11.5T600-800h160q17 0 28.5 11.5T800-760q0 17-11.5 28.5T760-720v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM400-280q17 0 28.5-11.5T440-320v-280q0-17-11.5-28.5T400-640q-17 0-28.5 11.5T360-600v280q0 17 11.5 28.5T400-280Zm160 0q17 0 28.5-11.5T600-320v-280q0-17-11.5-28.5T560-640q-17 0-28.5 11.5T520-600v280q0 17 11.5 28.5T560-280ZM280-720v520-520Z" />
    </svg>
  );

  const new_comment = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="#1f1f1f"
    >
      <path d="m240-280-86 86q-10 10-22 5t-12-19v-552q0-33 23.5-56.5T200-840h480q33 0 56.5 23.5T760-760v161q0 17-11.5 28T720-560q-17 0-28.5-11.5T680-600v-160H200v400h240q17 0 28.5 11.5T480-320q0 17-11.5 28.5T440-280H240Zm80-320h240q17 0 28.5-11.5T600-640q0-17-11.5-28.5T560-680H320q-17 0-28.5 11.5T280-640q0 17 11.5 28.5T320-600Zm0 160h120q17 0 28.5-11.5T480-480q0-17-11.5-28.5T440-520H320q-17 0-28.5 11.5T280-480q0 17 11.5 28.5T320-440Zm360 160h-80q-17 0-28.5-11.5T560-320q0-17 11.5-28.5T600-360h80v-80q0-17 11.5-28.5T720-480q17 0 28.5 11.5T760-440v80h80q17 0 28.5 11.5T880-320q0 17-11.5 28.5T840-280h-80v80q0 17-11.5 28.5T720-160q-17 0-28.5-11.5T680-200v-80Zm-480-80v-400 400Z" />
    </svg>
  );
  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get("/feedbacks");
      setFeedbacks(res.data);
    } catch (err) {
      toast.error("حدث خطأ أثناء تحميل التعليقات");
      console.error(err);
    }
  };

  const handleAddFeedback = () => {
    const newFeedback = {
      text: "نص جديد",
      name: "اسم",
      job: "الوظيفة",
      _id: Date.now().toString(), // Temporary ID for UI tracking
      unsaved: true, // Flag to detect new feedbacks
    };

    setFeedbacks((prev) => [...prev, newFeedback]);

    setTimeout(() => {
      swiperRef.current?.slideTo(feedbacks.length);
    }, 100);
  };

  const handleToggleEdit = async () => {
    if (isEditing_q) {
      const updatedElements = document.querySelectorAll(
        "[data-feedback-index]"
      );
      const updatedFeedbacks = [...feedbacks];

      for (const el of updatedElements) {
        const index = parseInt(el.getAttribute("data-feedback-index"));
        const key = el.getAttribute("data-q");
        const value = el.innerText.trim();

        updatedFeedbacks[index][key] = value;
      }

      const newFeedbackList = [];

      for (const feedback of updatedFeedbacks) {
        try {
          if (feedback.unsaved) {
            // POST new feedback
            const res = await axios.post("/feedbacks", {
              text: feedback.text,
              name: feedback.name,
              job: feedback.job,
            });
            newFeedbackList.push(res.data); // Replace with saved version
          } else {
            // PUT existing feedback
            await axios.put(`/feedbacks/${feedback._id}`, feedback);
            newFeedbackList.push(feedback);
          }
        } catch (err) {
          toast.error("فشل في حفظ التغييرات");
          console.error(err);
        }
      }

      setFeedbacks(newFeedbackList);
      toast.success("تم حفظ التعديلات");
    }

    setIsEditing_q((prev) => !prev);
  };

  const handleDeleteFeedback = async (indexToDelete) => {
    const idToDelete = feedbacks[indexToDelete]._id;

    try {
      await axios.delete(`/feedbacks/${idToDelete}`);
      const updated = feedbacks.filter((_, i) => i !== indexToDelete);
      setFeedbacks(updated);
      toast.success("تم حذف التعليق");

      setTimeout(() => {
        swiperRef.current?.slideTo(Math.max(0, updated.length - 1));
      }, 100);
    } catch (err) {
      toast.error("فشل في حذف التعليق");
      console.error(err);
    }
  };
  const hidden = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="#000000"
    >
      <path d="M607-627q29 29 42.5 66t9.5 76q0 15-11 25.5T622-449q-15 0-25.5-10.5T586-485q5-26-3-50t-25-41q-17-17-41-26t-51-4q-15 0-25.5-11T430-643q0-15 10.5-25.5T466-679q38-4 75 9.5t66 42.5Zm-127-93q-19 0-37 1.5t-36 5.5q-17 3-30.5-5T358-742q-5-16 3.5-31t24.5-18q23-5 46.5-7t47.5-2q137 0 250.5 72T904-534q4 8 6 16.5t2 17.5q0 9-1.5 17.5T905-466q-18 40-44.5 75T802-327q-12 11-28 9t-26-16q-10-14-8.5-30.5T753-392q24-23 44-50t35-58q-50-101-144.5-160.5T480-720Zm0 520q-134 0-245-72.5T60-463q-5-8-7.5-17.5T50-500q0-10 2-19t7-18q20-40 46.5-76.5T166-680l-83-84q-11-12-10.5-28.5T84-820q11-11 28-11t28 11l680 680q11 11 11.5 27.5T820-84q-11 11-28 11t-28-11L624-222q-35 11-71 16.5t-73 5.5ZM222-624q-29 26-53 57t-41 67q50 101 144.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z" />
    </svg>
  );
  const visible = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="#000000"
    >
      <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-134 0-244.5-72T61-462q-5-9-7.5-18.5T51-500q0-10 2.5-19.5T61-538q64-118 174.5-190T480-800q134 0 244.5 72T899-538q5 9 7.5 18.5T909-500q0 10-2.5 19.5T899-462q-64 118-174.5 190T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
    </svg>
  );
  const [uiState, setUiState] = useState({
    showFeedback: true,
  });

  const toggleShowFeedback = async () => {
    const newValue = !uiState.showFeedback;

    try {
      await axios.put("/ui", { showFeedback: newValue });
      setUiState((prevState) => ({
        ...prevState,
        showFeedback: newValue,
      }));
      setShowFeedback(newValue);
      toast.success("تم تحديث عرض التعليقات");
    } catch (err) {
      toast.error("فشل في حفظ الحالة");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUiState();
  }, []);
  const fetchUiState = async () => {
    try {
      const res = await axios.get("/ui");
      const { showFeedback } = res.data;

      setUiState({ showFeedback });
      setShowFeedback(showFeedback);
    } catch (error) {
      console.error("فشل في جلب حالة الواجهة:", error);
      toast.error("فشل في جلب حالة الواجهة");
    }
  };

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
            {isEditing_hero && (
              <input
                type="file"
                accept="video/*"
                data-keyhero="bg_video"
                onChange={handleImageUpload_hero}
              />
            )}
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
              <h1>{menuTxt.studies || ""}</h1>
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
              <h1>{menuTxt.adminConsult || ""}</h1>
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
              <h1>{menuTxt.filesMgmt || ""}</h1>
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
                {isEditing && (
                  <input
                    type="file"
                    accept="video/*"
                    data-key="video"
                    onChange={handleVideoUpload}
                  />
                )}
              </div>
              <div className="upload-img">
                {imgicon}
                {isEditing && (
                  <input
                    type="file"
                    accept="image/*"
                    data-key="thumbnail"
                    onChange={handleImageUpload}
                  />
                )}
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
            <span onClick={toggleShowFeedback}>
              {showFeedback ? hidden : visible}
            </span>
            {showFeedback && <span>آراء العملاء</span>}
            {showFeedback && <h3>شبكتنا مليئة بالعملاء ذو التجارب الناجحة</h3>}
          </header>
        </AnimatedContent>
        {showFeedback && (
          <Swiper
            ref={swiperRef}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            dir="rtl"
            spaceBetween={30}
            centeredSlides={true}
            slidesPerView={1}
            breakpoints={{
              768: {
                slidesPerView: 3,
              },
            }}
            navigation={true}
            pagination={{ clickable: true }}
            modules={[Autoplay, Navigation, Pagination]}
            className="feedbackSwiper"
          >
            {feedbacks.map((item, i) => (
              <SwiperSlide key={i}>
                <motion.div
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={cardVariants}
                  className="feedBack-text"
                >
                  <p
                    contentEditable={isEditing_q}
                    suppressContentEditableWarning
                    data-feedback-index={i}
                    data-q="text"
                    onInput={handleInput}
                  >
                    {item.text}
                  </p>
                  <span className="person">
                    <p
                      className="name"
                      contentEditable={isEditing_q}
                      suppressContentEditableWarning
                      data-feedback-index={i}
                      data-q="name"
                      onInput={handleInput}
                    >
                      {item.name}
                    </p>

                    <p
                      className="job"
                      contentEditable={isEditing_q}
                      suppressContentEditableWarning
                      data-feedback-index={i}
                      data-q="job"
                      onInput={handleInput}
                    >
                      {item.job}
                    </p>
                  </span>

                  {isEditing_q && (
                    <button
                      onClick={() => handleDeleteFeedback(i)}
                      className="delete_feedback_icon"
                    >
                      {deleteicon}
                    </button>
                  )}
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
        {showFeedback && (
          <div className="actions">
            <button onClick={handleToggleEdit}>
              {isEditing_q ? "حفظ" : "تعديل"}
            </button>

            {isEditing_q && (
              <button onClick={handleAddFeedback}>{new_comment}</button>
            )}
          </div>
        )}
      </div>

      <div className="paperwork">
        <img
          src={previewImage || paperwork.paperworkImage}
          alt=""
          style={{ cursor: "pointer" }}
        />

        {/* Editable Heading */}
        <AnimatedContent threshold={0.3} delay={0.2} duration={1.2}>
          <h2
            contentEditable={isEditing_paperwork}
            suppressContentEditableWarning
            onInput={(e) => setEditableText(e.currentTarget.innerText)}
            style={
              isEditing_paperwork ? { borderBottom: "1px dashed gray" } : {}
            }
          >
            {editableText || paperwork.paperworkText}
          </h2>
        </AnimatedContent>

        {/* Actions */}
        <div className="actions">
          <button>
            {isEditing_paperwork && (
              <input
                type="file"
                accept="image/*"
                data-keyhero="paperwork_image"
                onChange={handleImageUpload_paperwork}
              />
            )}
            {imgicon}
          </button>
          <button onClick={toggleEditing_paperwork}>
            {isEditing_paperwork ? "حفظ" : "تفعيل"}
          </button>
        </div>
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
