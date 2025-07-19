import { React, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import paperwork from "../assets/images/paperwork.jpg";
import "../assets/style/common/aboutPages.css";
import AnimatedContent from "../components/AnimatedContent";
import axios from "../axiosInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

export default function Emails() {
  const [emails, setEmails] = useState([]);
  const [notes, setNotes] = useState({}); // key = email ID, value = note text

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

  const handleNoteChange = (id, value) => {
    setNotes((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmitNote = async (id) => {
    try {
      const note = notes[id];
   

      await axios.post(`/email/note/${id}`, { note });
      toast.success("تم حفظ الملاحظة بنجاح");
    } catch (error) {
      toast.error("فشل في حفظ الملاحظة");
      console.error(error);
    }
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
  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد أنك تريد حذف هذا الطلب؟")) return;

    try {
      await axios.delete(`/email/delete/${id}`);
      toast.success("تم الحذف بنجاح");
      setEmails((prev) => prev.filter((email) => email._id !== id));
    } catch (error) {
      toast.error("فشل في الحذف");
      console.error(error);
    }
  };
 const [menuTxt, setmenuTxt] = useState({});
 const [paperwork, setpaperwork] = useState({});

 useEffect(() => {
   try {
     const savedMenu = localStorage.getItem("menuTxt");
     const savepaperwork = localStorage.getItem("paperwork");
     if (savedMenu && savedMenu !== "undefined") {
       setmenuTxt(JSON.parse(savedMenu));
     }
     if (savepaperwork && savepaperwork !== "undefined") {
       setpaperwork(JSON.parse(savepaperwork));
     }
   } catch (err) {
     console.warn("Failed to parse saved menuTxt from localStorage:", err);
     setmenuTxt({});
   }
 }, []);
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
          <h1>{menuTxt.contact}</h1>
        </AnimatedContent>
        <img src={paperwork.paperworkImage} alt="" />
      </div>

      <div className="cards">
        <table
          border="1"
          cellPadding="8"
          style={{
            borderCollapse: "collapse",
            fontFamily: "var(--arabic-fm-b)",
            fontSize: "var(--font-small)",
            width: "100%",
          }}
        >
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Note</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {emails.map(({ _id, name, email, phone, note }, index) => (
              <tr key={_id}>
                <td>{index + 1}</td>
                <td>{name}</td>
                <td>{email}</td>
                <td>{phone}+</td>
                <td>
                  <textarea
                    rows="2"
                    style={{ width: "100%", fontFamily: "inherit" }}
                    value={notes[_id] !== undefined ? notes[_id] : note || ""}
                    placeholder={"أدخل ملاحظة..."}
                    onChange={(e) => handleNoteChange(_id, e.target.value)}
                  />
                </td>
                <td>
                  <button onClick={() => handleSubmitNote(_id)}> حفظ</button>
                  <button
                    onClick={() => handleDelete(_id)}
                    style={{
                      marginTop: "0.5rem",
                      background: "#b91c1c",
                      color: "white",
                    }}
                  >
                    حذف
                  </button>
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
        rtl
        pauseOnHover
        theme="colored"
        style={{ zIndex: 10000 }}
      />
    </motion.div>
  );
}
