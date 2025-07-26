// src/App.jsx
import { useEffect, useState } from "react";
import "./styles.css";

import Header from "./components/Header";
import About from "./components/About";
import TechStack from "./components/TechStack";
import Projects from "./components/Projects";
import Resume from "./components/Resume";
import Footer from "./components/Footer";
import LoadingScreen from "./components/LoadingScreen";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a delay for loading screen
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading ? (
        <LoadingScreen />
      ) : (
        <>
          <Header />
          <About />
          <TechStack />
          <Projects />
          <Resume />
          <Footer />
        </>
      )}
    </>
  );
}

export default App;
