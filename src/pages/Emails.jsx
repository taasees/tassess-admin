import { React, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
//improt images
import paperwork from "../assets/images/paperwork.jpg";

import "../assets/style/common/aboutPages.css";
import AnimatedContent from "../components/AnimatedContent";
import axios from "../axiosInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

export default function Emails() {
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    axios
      .get("/email/get")
      .then((response) => {
        setEmails(response.data);
      })
      .catch((error) => {
        console.error("Error fetching emails:", error);
      });
  }, []);
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
          <h1>طلبات التواصل</h1>
        </AnimatedContent>
        <img src={paperwork} alt="" />
      </div>

      <div className="cards">
        <table
          border="1"
          cellPadding="8"
          style={{
            borderCollapse: "collapse",
            fontFamily: "var(--arabic-fm-b)",
            fontSize: "var(--font-small)",
          }}
        >
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {emails.map(({ _id, name, email, phone }, index) => (
              <tr key={_id}>
                <td style={{ padding: "0.5rem", paddingInline: "1.5rem" }}>
                  {index + 1}
                </td>
                <td style={{ padding: "0.5rem", paddingInline: "1.5rem" }}>
                  {name}
                </td>
                <td style={{ padding: "0.5rem", paddingInline: "1.5rem" }}>
                  {email}
                </td>
                <td style={{ padding: "0.5rem", paddingInline: "1.5rem" }}>
                  {phone}+
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
