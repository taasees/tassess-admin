import { React, useState, useEffect } from "react";
import { Link } from "react-router-dom";
//improt images
import paperwork from "../assets/images/paperwork.jpg";

import schools from "../assets/videos/schools.mp4";
import restaurants from "../assets/videos/restaurants.mp4";
import farms from "../assets/videos/farms.mp4";
import hospitals from "../assets/videos/hospitals.mp4";
import factories from "../assets/videos/factories.mp4";
import ecommerce from "../assets/videos/ecommerce.mp4";
import feasibility_studies from "../assets/videos/feasibility_studies.mp4";
import "../assets/style/common/feasibility-studies.css";
import AnimatedContent from "../components/AnimatedContent";
import { motion } from "framer-motion";
export default function Feasibility_studies() {
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
          <h1>{menuTxt.studies}</h1>
        </AnimatedContent>
        <img src={paperwork.paperworkImage} alt="" />
      </div>
      <div className="types">
        <Link to={"/factories"} className="type">
          <div className="text">
            <h1>
              {menuTxt.studies} {menuTxt.factories}
            </h1>
          </div>
          <div className="video">
            <video autoPlay={true} loop muted playsInline controls={false}>
              <source src={factories} />
            </video>
          </div>
        </Link>
        <Link to={"/farms"} className="type">
          <div className="text">
            <h1>
              {menuTxt.studies} {menuTxt.farms}
            </h1>
          </div>
          <div className="video">
            <video autoPlay={true} loop muted playsInline controls={false}>
              <source src={farms} />
            </video>
          </div>
        </Link>
        <Link to={"/restaurants"} className="type">
          <div className="text">
            <h1>
              {menuTxt.studies} {menuTxt.restaurants}
            </h1>
          </div>
          <div className="video">
            <video autoPlay={true} loop muted playsInline controls={false}>
              <source src={restaurants} />
            </video>
          </div>
        </Link>
        <Link to={"/E-commerce-projects"} className="type">
          <div className="text">
            <h1>
              {menuTxt.studies} {menuTxt.ecommerce}
            </h1>
          </div>
          <div className="video">
            <video autoPlay={true} loop muted playsInline controls={false}>
              <source src={feasibility_studies} />
            </video>
          </div>
        </Link>
        <Link to={"/schools"} className="type">
          <div className="text">
            <h1>
              {menuTxt.studies} {menuTxt.schools}
            </h1>
          </div>
          <div className="video">
            <video autoPlay={true} loop muted playsInline controls={false}>
              <source src={schools} />
            </video>
          </div>
        </Link>
        <Link to={"/Medical-sector"} className="type">
          <div className="text">
            <h1>
              {menuTxt.studies} {menuTxt.medical}
            </h1>
          </div>
          <div className="video">
            <video autoPlay={true} loop muted playsInline controls={false}>
              <source src={hospitals} />
            </video>
          </div>
        </Link>
        <Link to={"/other-projects"} className="type">
          <div className="text">
            <h1>
              {menuTxt.studies} {menuTxt.others}
            </h1>
          </div>
          <div className="video">
            <video autoPlay={true} loop muted playsInline controls={false}>
              <source src={ecommerce} />
            </video>
          </div>
        </Link>
      </div>
    </motion.div>
  );
}
