import { React, useState, useEffect } from "react";
import "../assets/style/footer/footer.css";
import logo from "../assets/images/Logo_1.webp";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
export default function Footer() {
  // const currentYear = new Date().getFullYear();
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
  return (
    <footer dir="auto">
      <div className="desktop">
        <div className="top">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={cardVariants}
            className="right"
          >
            <div className="img">
              <img src={menuTxt.logoUrl || logo} alt="" />
            </div>
            <div className="text"></div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.2 }}
            className="left"
          >
            <div className="links">
              <h4>اهم الروابط :</h4>
              <ul>
                <li>
                  <Link to={"/feasibility-studies"}>
                    {menuTxt.studies || ""}
                  </Link>
                </li>
                <li>
                  <Link to={"/Administrational-consultations"}>
                    {menuTxt.adminConsult || ""}
                  </Link>
                </li>
                <li>
                  <Link to={"/files-management"}>
                    {menuTxt.filesMgmt || ""}
                  </Link>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
        {/* <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={cardVariants}
          className="bottom"
        >
          <div className="copyright">
            <p>
              حقوق الطبع والنشر
              <span> شارِك للإستشارات </span>. جميع الحقوق محفوظة
            </p>
          </div>
          <div className="design">
            <p>
              تم التصميم بواسطة 
              <Link to={"/"}> hussam shannan </Link>
            </p>
          </div>
        </motion.div> */}
      </div>
      {/* <div className="mobile">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={cardVariants}
          className="copyright"
        >
          <p>
            حقوق الطبع والنشر
            <span> شارِك للإستشارات </span>. جميع الحقوق محفوظة
          </p>
        </motion.div>
        <div className="design">
          <p>
            تم التصميم بواسطة
            <Link to={"https://www.linkedin.com/in/hussam-shannan-47071b291/"}>
              hussam shannan
            </Link>
          </p>
        </div> 
      </div>  */}
    </footer>
  );
}
