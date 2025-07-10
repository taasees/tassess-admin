import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import "../assets/style/signin/signin.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../assets/icons/favicon.ico";

export default function Signin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.password) {
      return toast.error("يرجى ملء جميع الحقول");
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "https://shark-consulting-net.onrender.com/user/signin",
        {
          username: formData.name,
          password: formData.password,
        }
      );
console.log(response);
      if (response.data.success) {
        toast.success("تم تسجيل الدخول بنجاح");
        localStorage.setItem("token", response.data.token);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        toast.error(response.data.message || "فشل تسجيل الدخول");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "حدث خطأ أثناء تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="signin-pages"
      dir="auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.3 }}
    >
      <div className="main">
        <div className="side">
          <div className="img">
            <img src={logo} alt="logo" />
          </div>
          <div className="text">
            <p>تسجيل الدخول</p>
          </div>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <label htmlFor="name">
            <p>اسم المستخدم</p>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
            />
          </label>

          <label htmlFor="password">
            <p>كلمة السر</p>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
          </label>

          <label htmlFor="submit">
            <button type="submit" name="submit" disabled={loading}>
              {loading ? "جاري الإرسال..." : "ارسال"}
            </button>
          </label>
        </form>
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
