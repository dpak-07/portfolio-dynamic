// src/components/Header.jsx
import { useEffect, useState, useRef } from "react";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { Typewriter } from "react-simple-typewriter";
import { motion } from "framer-motion";

export default function Header() {
  const [visible, setVisible] = useState(true);
  const sectionRef = useRef(null);
  const terminalRef = useRef(null);
  const [lines, setLines] = useState([]);
  const currentInputRef = useRef(""); // Ref for input to prevent re-render lag
  const [terminalReady, setTerminalReady] = useState(false);
  const [inputRender, setInputRender] = useState(""); // Only for display
  const commandHistory = useRef([]);
  const historyIndex = useRef(-1);

  const asciiPigeon = [
    "   ,     #_",
    "   ~\\_  ####_ Amazon Linux 2023",
    "  ~~  \\_#####\\",
    "  ~~     \\###|",
    "  ~~       \\#/ ____",
    "   ~~       V~' '->",
    "    ~~~         /",
    "      ~~._.   _/",
    "         _/ _/",
    "       _/m/'",
    "Connected to Deepak's EC2 instance",
    "you can type commands here or use the buttons below",
    "$ ",
  ];

  const recommendations = [
    "ls",
    "pwd",
    "whoami",
    "fortune",
    "help",
    "projects",
    "resume",
    "contact",
    "games",
  ];

  const getRandomizedRecommendations = () => {
    return [...recommendations].sort(() => Math.random() - 0.5);
  };

  const scrollToBottom = () => {
    terminalRef.current?.scrollTo({
      top: terminalRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  // Fade-in observer (kept)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  // Initialize terminal
  useEffect(() => {
    setLines(
      asciiPigeon.map((line) => ({
        text: line,
        style: line === "$ " ? "text-cyansoft" : "text-yellow-300",
      }))
    );
    setTerminalReady(true);
    scrollToBottom();
  }, []);

  // Command execution
  const handleCommand = (cmd) => {
    if (!cmd.trim()) return;

    let newLines = [...lines];
    newLines[newLines.length - 1] = { text: `$ ${cmd}`, style: "text-cyansoft" };

    commandHistory.current.unshift(cmd);
    historyIndex.current = -1;

    const responses = {
      clear: () => [{ text: "$ ", style: "text-cyansoft" }],
      ls: () => [
        { text: "projects  resume  contact  games", style: "text-white/80" },
        { text: "$ ", style: "text-cyansoft" },
      ],
      pwd: () => [
        { text: "/home/deepak", style: "text-white/80" },
        { text: "$ ", style: "text-cyansoft" },
      ],
      whoami: () => [
        { text: "deepak", style: "text-white/80" },
        { text: "$ ", style: "text-cyansoft" },
      ],
      fortune: () => [
        {
          text: [
            "You will code something amazing today!",
            "A bug is lurking nearby, beware!",
            "Coffee + Code = Magic",
            "Deploy with confidence!",
          ][Math.floor(Math.random() * 4)],
          style: "text-white/80",
        },
        { text: "$ ", style: "text-cyansoft" },
      ],
      help: () => [
        {
          text: "Available commands: ls, pwd, whoami, projects, resume, contact, clear, fortune, help",
          style: "text-white/80",
        },
        { text: "$ ", style: "text-cyansoft" },
      ],
    };

    const navCommands = ["projects", "resume", "contact", "games"];

    if (navCommands.includes(cmd.trim().toLowerCase())) {
      const el = document.getElementById(cmd.trim().toLowerCase());
      if (el) el.scrollIntoView({ behavior: "smooth" });
      newLines.push({
        text: `Navigated to ${cmd} section`,
        style: "text-white/80",
      });
      newLines.push({ text: "$ ", style: "text-cyansoft" });
    } else if (responses[cmd.trim().toLowerCase()]) {
      newLines.push(...responses[cmd.trim().toLowerCase()]());
    } else {
      newLines.push({
        text: `Command not found: ${cmd}`,
        style: "text-red-500",
      });
      newLines.push({ text: "$ ", style: "text-cyansoft" });
    }

    setLines(newLines);
    currentInputRef.current = "";
    setInputRender("");
    scrollToBottom();
  };

  // Keyboard input
  useEffect(() => {
    const handleKey = (e) => {
      if (!terminalReady) return;

      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)
      ) {
        e.preventDefault();
      }

      if (e.key === "Enter") handleCommand(currentInputRef.current);
      else if (e.key === "Backspace") {
        currentInputRef.current = currentInputRef.current.slice(0, -1);
        setInputRender(currentInputRef.current);
      } else if (e.key === "ArrowUp") {
        if (
          commandHistory.current.length > 0 &&
          historyIndex.current < commandHistory.current.length - 1
        ) {
          historyIndex.current += 1;
          currentInputRef.current =
            commandHistory.current[historyIndex.current];
          setInputRender(currentInputRef.current);
        }
      } else if (e.key === "ArrowDown") {
        if (historyIndex.current > 0) {
          historyIndex.current -= 1;
          currentInputRef.current =
            commandHistory.current[historyIndex.current];
          setInputRender(currentInputRef.current);
        } else {
          historyIndex.current = -1;
          currentInputRef.current = "";
          setInputRender("");
        }
      } else if (e.key.length === 1 && e.key !== " ") {
        currentInputRef.current += e.key;
        setInputRender(currentInputRef.current);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [terminalReady]);

  const runRecommendation = (cmd) => {
    currentInputRef.current = cmd;
    setInputRender(cmd);
    handleCommand(cmd);
  };

  // ✨ Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.3, duration: 0.8, ease: "easeOut" },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <header
      id="home"
      ref={sectionRef}
      className={`relative w-full min-h-screen flex flex-col md:flex-row items-center justify-center text-white overflow-hidden px-6 py-20 md:py-28 transition-opacity duration-700 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="smoke-layer pointer-events-none fixed inset-0 -z-20"></div>

      <motion.div
        className="relative z-10 max-w-7xl w-full flex flex-col md:flex-row items-center justify-between gap-14"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
      >
        {/* Left Intro */}
        <motion.div
          className="text-center md:text-left max-w-2xl space-y-4"
          variants={containerVariants}
        >
          <motion.h1
            className="text-5xl md:text-6xl font-extrabold text-cyansoft drop-shadow-lg"
            variants={itemVariants}
          >
            Hi, I'm Deepak
          </motion.h1>
          <motion.p
            className="text-xl md:text-1xl text-white/80"
            variants={itemVariants}
          >
          Full-Stack Developer • Cloud Engineer • AI Enthusiast
          </motion.p>
          <motion.p
            className="text-md md:text-lg text-white/60 font-mono h-[32px]"
            variants={itemVariants}
          >
            <Typewriter
              words={[
                "Deploying apps on AWS EC2 & S3",
                "Automating tasks with Linux scripts",
                "Building scalable full-stack apps with React & Node",
              ]}
              loop={0}
              cursor
              cursorStyle="|"
              typeSpeed={50}
              deleteSpeed={30}
              delaySpeed={1800}
            />
          </motion.p>

          {/* Buttons */}
          <motion.div
            className="mt-6 flex flex-wrap gap-4 justify-center md:justify-start"
            variants={itemVariants}
          >
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("projects")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-cyansoft text-black px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-cyan-300 hover:scale-105 transition-all"
            >
              View Projects
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="border border-white/20 text-white/90 px-6 py-3 rounded-full font-medium hover:border-cyansoft hover:bg-white/10 transition-all"
            >
              Contact
            </a>
          </motion.div>

          {/* Socials */}
          <motion.div
            className="flex gap-4 mt-6 justify-center md:justify-start"
            variants={itemVariants}
          >
            <a
              href="https://github.com/dpak-07"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-cyansoft transition-all"
            >
              <FaGithub size={24} />
            </a>
            <a
              href="https://www.linkedin.com/in/deepak-saminathan/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-cyansoft transition-all"
            >
              <FaLinkedin size={24} />
            </a>
            <a
              href="mailto:deepakofficial0103@gmail.com"
              className="text-white/80 hover:text-cyansoft transition-all"
            >
              <FaEnvelope size={24} />
            </a>
          </motion.div>
        </motion.div>

        {/* Right Terminal */}
        <motion.div
          className="w-full md:w-[50%] h-[400px] rounded-xl bg-[#101317] border border-white/10 font-mono text-sm md:text-base text-cyansoft shadow-xl flex flex-col overflow-hidden"
          variants={itemVariants}
        >
          <div className="bg-[#0b0d10] px-3 py-1 text-xs text-white/70">
            Linux EC2 Terminal
          </div>
          <div className="flex-1 overflow-y-auto px-3 py-2" ref={terminalRef}>
            {lines.map((lineObj, i) => {
              const text = lineObj?.text || "";
              const style = lineObj?.style || "";
              const isPrompt = text.endsWith("$ ");

              return (
                <div key={i} className={`whitespace-pre-wrap break-words ${style}`}>
                  {isPrompt ? (
                    <>
                      $ {inputRender}
                      <span className="animate-pulse">█</span>
                    </>
                  ) : (
                    text
                  )}
                </div>
              );
            })}

            {/* Randomized Recommendations */}
            <div className="mt-2 flex flex-wrap gap-2">
              {getRandomizedRecommendations().map((cmd, idx) => (
                <button
                  key={idx}
                  onClick={() => runRecommendation(cmd)}
                  className="bg-white/10 text-white/80 hover:bg-cyansoft hover:text-black px-3 py-1 rounded-full text-sm font-mono transition-all"
                >
                  {cmd}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </header>
  );
}
