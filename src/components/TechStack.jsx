import { motion } from "framer-motion"
import {
  FaHtml5, FaCss3Alt, FaJs, FaReact, FaNodeJs, FaPython, FaJava,
  FaDatabase, FaAws, FaGitAlt, FaGithub, FaLinux, FaFigma, FaCuttlefish,
  FaUnity, FaDocker, FaServer, FaCloud,
} from "react-icons/fa"
import {
  SiMongodb, SiMysql, SiFlask, SiExpress, SiTailwindcss, SiNextdotjs,
  SiFirebase, SiTensorflow, SiPytorch, SiOpencv, SiDart, SiFastapi,
  SiNginx, SiVercel, SiRender, SiGithubactions, SiKeras,
} from "react-icons/si"

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const fadeInUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }
const iconVariant = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

export default function TechStack() {
  
 const categories = [
    {
      title: "Languages",
      tech: [
        { name: "C", icon: <FaCuttlefish className="text-gray-400" /> },
        { name: "Python", icon: <FaPython className="text-yellow-400" /> },
        { name: "Java", icon: <FaJava className="text-blue-500" /> },
        { name: "JavaScript", icon: <FaJs className="text-yellow-400" /> },
        { name: "Dart", icon: <SiDart className="text-blue-400" /> },
        { name: "HTML", icon: <FaHtml5 className="text-orange-500" /> },
        { name: "CSS", icon: <FaCss3Alt className="text-blue-500" /> },
      ],
    },
    {
      title: "Frontend",
      tech: [
        { name: "React", icon: <FaReact className="text-cyan-400" /> },
        { name: "Next.js", icon: <SiNextdotjs className="text-white" /> },
        { name: "Tailwind", icon: <SiTailwindcss className="text-sky-400" /> },
        { name: "Flutter", icon: <SiDart className="text-blue-400" /> },
        { name: "Bootstrap", icon: <FaCss3Alt className="text-purple-400" /> },
        { name: "Vite", icon: <FaServer className="text-purple-500" /> },
      ],
    },
    {
      title: "Backend",
      tech: [
        { name: "Node.js", icon: <FaNodeJs className="text-green-500" /> },
        { name: "Express", icon: <SiExpress className="text-gray-200" /> },
        { name: "Flask", icon: <SiFlask className="text-gray-300" /> },
        { name: "FastAPI", icon: <SiFastapi className="text-green-400" /> },
        { name: "Nginx", icon: <SiNginx className="text-green-300" /> },
      ],
    },
    {
      title: "Databases",
      tech: [
        { name: "MongoDB", icon: <SiMongodb className="text-green-400" /> },
        { name: "MySQL", icon: <SiMysql className="text-blue-400" /> },
        { name: "SQLite", icon: <FaDatabase className="text-gray-400" /> },
        { name: "MariaDB", icon: <FaDatabase className="text-blue-600" /> },
      ],
    },
    {
      title: "Cloud / DevOps",
      tech: [
        { name: "AWS", icon: <FaAws className="text-orange-400" /> },
        { name: "GCP", icon: <FaCloud className="text-blue-400" /> },
        { name: "Firebase", icon: <SiFirebase className="text-yellow-500" /> },
        { name: "Vercel", icon: <SiVercel className="text-white" /> },
        { name: "Render", icon: <SiRender className="text-purple-400" /> },
        { name: "GitHub Actions", icon: <SiGithubactions className="text-blue-400" /> },
      ],
    },
    {
      title: "Tools",
      tech: [
        { name: "Git", icon: <FaGitAlt className="text-orange-500" /> },
        { name: "GitHub", icon: <FaGithub className="text-white" /> },
        { name: "VSCode", icon: <FaFigma className="text-blue-500" /> },
        { name: "Postman", icon: <FaDocker className="text-orange-500" /> },
        { name: "Linux", icon: <FaLinux className="text-gray-200" /> },
        { name: "Figma", icon: <FaFigma className="text-pink-500" /> },
        { name: "Anaconda", icon: <SiKeras className="text-green-600" /> },
      ],
    },
    {
      title: "Data Science / ML",
      tech: [
        { name: "TensorFlow", icon: <SiTensorflow className="text-orange-500" /> },
        { name: "PyTorch", icon: <SiPytorch className="text-red-500" /> },
        { name: "OpenCV", icon: <SiOpencv className="text-indigo-400" /> },
        { name: "Keras", icon: <SiKeras className="text-red-600" /> },
        { name: "NumPy", icon: <FaPython className="text-yellow-400" /> },
        { name: "Pandas", icon: <FaPython className="text-green-400" /> },
        { name: "Matplotlib", icon: <FaPython className="text-blue-500" /> },
        { name: "SciPy", icon: <FaPython className="text-purple-400" /> },
        { name: "CUDA", icon: <FaAws className="text-red-500" /> },
      ],
    },
    {
      title: "Design & Creative",
      tech: [
        { name: "Photoshop", icon: <FaFigma className="text-blue-500" /> },
        { name: "Illustrator", icon: <FaFigma className="text-orange-400" /> },
        { name: "After Effects", icon: <FaFigma className="text-purple-400" /> },
        { name: "Premiere Pro", icon: <FaFigma className="text-purple-500" /> },
        { name: "Lightroom", icon: <FaFigma className="text-blue-600" /> },
      ],
    },
    {
      title: "Gaming & Graphics",
      tech: [
        { name: "Unity", icon: <FaUnity className="text-black" /> },
        { name: "OpenGL", icon: <FaUnity className="text-blue-400" /> },
        { name: "Steam", icon: <FaUnity className="text-gray-700" /> },
        { name: "Epic Games", icon: <FaUnity className="text-black" /> },
        { name: "EA", icon: <FaUnity className="text-red-500" /> },
        { name: "Ubisoft", icon: <FaUnity className="text-blue-200" /> },
        { name: "Riot Games", icon: <FaUnity className="text-red-700" /> },
      ],
    },
  ]


  return (
    <section id="tech-stack" className="section-large px-4 py-12">
      <motion.div
        className="site-container backdrop-blur-lg bg-white/5 rounded-2xl p-6 md:p-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-cyansoft mb-12 text-center"
          variants={fadeInUp}
        >
          ⚡ My Tech Stack
        </motion.h2>

        <div className="grid gap-6 sm:gap-8 md:gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.title}
              className="bg-white/20 backdrop-blur-md rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-2xl hover:bg-white/30 transition"
              variants={fadeInUp}
              transition={{ delay: idx * 0.2, duration: 0.8, type: "spring" }}
            >
              <motion.h3
                className="text-lg md:text-xl font-semibold text-white mb-4 md:mb-6 text-center sm:text-left"
                variants={fadeInUp}
              >
                {cat.title}
              </motion.h3>

              <motion.div
                className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 gap-4 sm:gap-6"
                variants={containerVariants}
              >
                {cat.tech.map((t, i) => (
                  <motion.div
                    key={t.name}
                    className="flex flex-col items-center gap-2 text-center cursor-pointer"
                    variants={iconVariant}
                    transition={{ delay: i * 0.1 + idx * 0.2, duration: 0.5 }}
                    whileHover={{
                      scale: 1.25,
                      rotate: 5,
                      filter: "drop-shadow(0 0 8px rgba(255,255,255,0.6))",
                    }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <div className="text-3xl sm:text-4xl">{t.icon}</div>
                    <span className="text-xs sm:text-sm md:text-sm text-gray-200">{t.name}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
