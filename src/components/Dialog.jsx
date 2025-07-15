import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "../axiosInstance";
import { isValidPhoneNumber } from "libphonenumber-js";

export default function Dialog() {
  const [isOpen, setIsOpen] = useState(true);
  function handleClose() {
    const dialog = document.querySelector(".dialog");
    if (dialog) {
      dialog.classList.remove("open"); // start opacity fade-out
      setTimeout(() => {
        dialog.style.display = "none"; // hide after fade
      }, 300); // match the transition duration
    }
  }
  const handleOutsideClick = () => {
    handleClose(); // close dialog
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    request: "طالب تواصل من ",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    const { name, email, phone } = formData;

    if (!name.trim()) {
      toast.error("الاسم مطلوب");
      return false;
    }

    if (!email.trim()) {
      toast.error("البريد الإلكتروني مطلوب");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("صيغة البريد الإلكتروني غير صحيحة");
      return false;
    }

    if (!isValidPhoneNumber("+" + phone)) {
      toast.error("رقم الهاتف غير صالح");
      return false;
    }

    return true;
  };

  const sendData = async () => {
    if (!validateForm()) return;

    try {
      const response = await axios.post(
        "/email/send",
        formData
      );
      toast.success("تم إرسال البيانات بنجاح");
      console.log("Server response:", response.data);

      // ✅ Reset form fields
      setFormData({
        name: "",
        email: "",
        phone: "",
        request: "طالب تواصل من ",
      });
    } catch (error) {
      toast.error("فشل في إرسال البيانات");
      console.error("Error sending data:", error);
    }
  };

  const close = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="#000000"
    >
      <path d="m480-424 116 116q11 11 28 11t28-11q11-11 11-28t-11-28L536-480l116-116q11-11 11-28t-11-28q-11-11-28-11t-28 11L480-536 364-652q-11-11-28-11t-28 11q-11 11-11 28t11 28l116 116-116 116q-11 11-11 28t11 28q11 11 28 11t28-11l116-116Zm0 344q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
    </svg>
  );

  return (
    <div
      className={`dialog`}
      role="dialog"
      dir="rtl"
      onClick={handleOutsideClick}
    >
      <div className="contact" onClick={(e) => e.stopPropagation()}>
        <div className="top">
          <button onClick={handleClose}>{close}</button>

          <p>طلب تواصل</p>
        </div>

        <label htmlFor="name">
          <p>
            الإسم بالكامل <span>*</span>
          </p>
          <input
            type="text"
            name="name"
            value={formData.name}
            placeholder="أدخل إسمك الكامل"
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </label>

        <label htmlFor="email">
          <p>
            البريد الإلكتروني <span>*</span>
          </p>
          <input
            type="text"
            name="email"
            value={formData.email}
            placeholder="أدخل بريدك الإلكتروني"
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </label>

        <label htmlFor="phone">
          <p>
            رقم الجوال للتواصل <span>*</span>
          </p>
          <PhoneInput
            country={"qa"}
            value={formData.phone}
            onChange={(value) => handleChange("phone", value)}
            inputStyle={{
              width: "100%",
              paddingLeft: "48px",
              textAlign: "left",
              direction: "ltr",
            }}
            placeholder="أدخل رقم الجوال للتواصل"
            containerStyle={{
              direction: "ltr",
            }}
            buttonStyle={{
              left: "0px",
              right: "unset",
            }}
          />
        </label>

        <div className="message">
          <p>نحن نضمن لك سرية البيانات وعدم إرسال إعلانات من قبلنا</p>
        </div>

        <button onClick={sendData} className="send">
          إرسال
        </button>
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
    </div>
  );
}
