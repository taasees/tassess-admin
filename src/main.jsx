import { StrictMode, useEffect, useState, useLayoutEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useRoutes,
} from "react-router-dom";
import ScrollToTop from "./components/animation/ScrollToTop.jsx";
import axios from "./axiosInstance.jsx";

// Pages
import Loading from "./components/loading.jsx";
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
import Emails from "./pages/Emails.jsx";
import Signin from "./pages/Signin.jsx";
import NotFound from "./pages/NotFound.jsx";

// Components
import Mobile_nav from "./components/mobile_nav.jsx";
import Dialog from "./components/Dialog.jsx";
import Edit from "./components/Edit.jsx";

async function isAuthenticated() {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const response = await axios.get("/api/protected");
    return response.status === 200;
  } catch (error) {
    localStorage.removeItem("token");
    return false;
  }
}

function ProtectedRoute({ element }) {
  const location = useLocation();
  const [isAuth, setIsAuth] = useState(null);

  useLayoutEffect(() => {
    async function checkAuth() {
      const auth = await isAuthenticated();
      setIsAuth(auth);
    }
    checkAuth();
  }, []);

  if (isAuth === null) return null; // Loading state
  return isAuth ? (
    element
  ) : (
    <Navigate to="/user/signin" state={{ from: location }} replace />
  );
}

function LayoutWrapper({ children }) {
  const location = useLocation();
  const hideLayout =
    location.pathname.startsWith("/user/signin") ||
    location.pathname === "/not-found";

  return (
    <>
      {!hideLayout && <Header />}
      {!hideLayout && <ScrollToTop />}
      {children}
      {!hideLayout && <Footer />}
      {!hideLayout && <Mobile_nav />}
      {!hideLayout && <Dialog />}
      {!hideLayout && <Edit />}
    </>
  );
}

function AuthGate({ children }) {
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    requestAnimationFrame(() => setReady(true));
  }, []);

  return ready ? children : null;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Loading />
      <AuthGate>
        <LayoutWrapper>
          <Routes>
            <Route path="/" element={<ProtectedRoute element={<App />} />} />
            <Route
              path="/about"
              element={<ProtectedRoute element={<About />} />}
            />
            <Route
              path="/why-us"
              element={<ProtectedRoute element={<WhyUs />} />}
            />
            <Route
              path="/factories"
              element={<ProtectedRoute element={<Factories />} />}
            />
            <Route
              path="/restaurants"
              element={<ProtectedRoute element={<Restaurants />} />}
            />
            <Route
              path="/schools"
              element={<ProtectedRoute element={<Schools />} />}
            />
            <Route
              path="/farms"
              element={<ProtectedRoute element={<Farms />} />}
            />
            <Route
              path="/E-commerce-projects"
              element={<ProtectedRoute element={<E_commerce_projects />} />}
            />
            <Route
              path="/Medical-sector"
              element={<ProtectedRoute element={<Medical_sector />} />}
            />
            <Route
              path="/other-projects"
              element={<ProtectedRoute element={<Other_projects />} />}
            />
            <Route
              path="/Administrational-consultations"
              element={
                <ProtectedRoute element={<Administrational_consultations />} />
              }
            />
            <Route
              path="/files-management"
              element={<ProtectedRoute element={<Files_management />} />}
            />
            <Route
              path="/previous-works"
              element={<ProtectedRoute element={<Previous_works />} />}
            />
            <Route
              path="/feasibility-studies"
              element={<ProtectedRoute element={<Feasibility_studies />} />}
            />
            <Route
              path="/contact-request"
              element={<ProtectedRoute element={<Emails />} />}
            />

            <Route path="/user/signin" element={<Signin />} />
            <Route path="*" element={<Navigate to="/not-found" replace />} />
            <Route path="/not-found" element={<NotFound />} />
          </Routes>
        </LayoutWrapper>
      </AuthGate>
    </BrowserRouter>
  </StrictMode>
);
