import { Navigate, Route, Routes, useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { AuthProvider } from "./contexts/AuthContext"
import Layout from "./components/Layout"
import AboutPage from "./pages/AboutPage"
import ContactPage from "./pages/ContactPage"
import DiningPage from "./pages/DiningPage"
import GalleryPage from "./pages/GalleryPage"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import ManagementDashboard from "./pages/ManagementDashboard"
import ManagementLoginPage from "./pages/ManagementLoginPage"
import RoomsPage from "./pages/RoomsPage"

function PageTransition({ children }) {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Layout>
        <PageTransition>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/rooms" element={<RoomsPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/dining" element={<DiningPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/management-login" element={<ManagementLoginPage />} />
            <Route path="/dashboard" element={<ManagementDashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PageTransition>
      </Layout>
    </AuthProvider>
  )
}
