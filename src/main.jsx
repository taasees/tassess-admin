import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/animation/ScrollToTop.jsx";

//import pages
import About from "./pages/About.jsx";
import WhyUs from "./pages/WhyUs.jsx";
import Factories from "./pages/feasibility-studies/Factories.jsx";
import Restaurants from "./pages/feasibility-studies/restaurants.jsx";
import Schools from "./pages/feasibility-studies/Schools.jsx";
import Farms from "./pages/feasibility-studies/Farms.jsx";
import E_commerce_projects from "./pages/feasibility-studies/E-commerce-projects.jsx";
import Medical_sector from "./pages/feasibility-studies/Medical-sector.jsx";
import Other_projects from "./pages/feasibility-studies/Other-projects.jsx";
import Administrational_consultations from "./pages/Administrational-consultations.jsx";
import Files_management from "./pages/Files_management.jsx";
import Previous_works from "./pages/Previous_works.jsx";
import Feasibility_studies from "./pages/Feasibility-studies.jsx";
import Mobile_nav from "./components/mobile_nav.jsx";
import Dialog from "./components/Dialog.jsx";
import Edit from "./components/Edit.jsx";
import Emails from "./pages/Emails.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Header />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/about" element={<About />} />
        <Route path="/why-us" element={<WhyUs />} />
        <Route path="/factories" element={<Factories />} />
        <Route path="/restaurants" element={<Restaurants />} />
        <Route path="/schools" element={<Schools />} />
        <Route path="/farms" element={<Farms />} />
        <Route path="/E-commerce-projects" element={<E_commerce_projects />} />
        <Route path="/Medical-sector" element={<Medical_sector />} />
        <Route path="/other-projects" element={<Other_projects />} />
        <Route
          path="/Administrational-consultations"
          element={<Administrational_consultations />}
        />
        <Route path="/files-management" element={<Files_management />} />
        <Route path="/previous-works" element={<Previous_works />} />
        <Route path="/feasibility-studies" element={<Feasibility_studies />} />
        <Route path="/contact-request" element={<Emails />} />
      </Routes>
      <Footer />
      <Mobile_nav />
      <Dialog />
      <Edit />
    </BrowserRouter>
  </StrictMode>
);
