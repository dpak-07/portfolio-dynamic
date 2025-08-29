import { useEffect, useState } from "react";
import "./index.css";

// Components
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import About from "./components/About";
import TechStack from "./components/TechStack";
import Projects from "./components/Projects";
import Resume from "./components/Resume";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import LoadingScreen from "./components/LoadingScreen";

function App() {
  const [loading, setLoading] = useState(true);

  // ⏳ Show loading screen for 5s
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  // 🖱️ Update CSS variables for mouse glow (used by body::after)
  useEffect(() => {
    const handleMouseMove = (e) => {
      document.body.style.setProperty("--mouse-x", `${e.clientX}px`);
      document.body.style.setProperty("--mouse-y", `${e.clientY}px`);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return loading ? (
    <LoadingScreen />
  ) : (
    <div className="relative overflow-x-hidden text-white">
      {/* 🌌 Global Background Effects are handled by body::before and body::after */}

      {/* 🧱 Main Structure */}
      <Navbar />
      <Header />
      <main>
        <About />
        <TechStack />
        <Projects />
        <Resume />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
