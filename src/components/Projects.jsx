import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function Projects() {
  const categories = {
    "Cloud / Backend": [
      {
        title: "College Website (Backend & Cloud)",
        desc: "Worked as backend & cloud engineer",
        long: "Contributed as a backend and cloud engineer for my college website. Implemented backend APIs, handled server deployment, and managed cloud infrastructure. The code is private, so no public repository is available.",
        img: "images/image.png",
        tech: ["Flask", "MongoDB", "Nginx", "AWS"],
        url: null, // no repo available
        live: "https://velammal.edu.in/webteam"
      }
    ],
    "Full-Stack": [
      {
        title: "Hotel Management",
        desc: "MongoDB + Flask project",
        long: "Full-stack hotel and restaurant management system with user auth, CRUD operations, and admin dashboard. Backend in Flask and MongoDB, deployed on a cloud VM.",
        img: "images/project3.jpg",
        tech: ["Flask", "MongoDB", "HTML"],
        url: "https://github.com/Deepak-S-github/hotel-management"
      },
      {
        title: "Study Spark Platform",
        desc: "Full-stack learning platform",
        long: "Comprehensive learning platform with frontend and backend architecture, designed to support interactive study modules.",
        img: "images/placeholder.jpg",
        tech: ["JavaScript", "HTML", "CSS"],
        url: "https://github.com/dpak-07/STUDY_SPARK_01"
      },
      {
        title: "Phushit",
        desc: "Multi-platform app + dashboard",
        long: "Feature-rich project including an app, dashboard, API, and browser extension—built with Flutter (Dart), C++, Python.",
        img: "images/placeholder.jpg",
        tech: ["Dart", "Python", "C++", "Flutter"],
        url: "https://github.com/dpak-07/phushit"
      },
      {
        title: "Walmart Project",
        desc: "HTML/CSS/Python web project",
        long: "Web-based project with templated frontend and Python backend components—likely a retail or ecommerce prototype.",
        img: "images/placeholder.jpg",
        tech: ["HTML", "CSS", "Python"],
        url: "https://github.com/dpak-07/walmart-project-final"
      }
    ],
    Frontend: [
      {
        title: "Calculator",
        desc: "Simple calculator built with JS",
        long: "A small web calculator supporting basic arithmetic with a clean responsive interface. Built with vanilla JS and CSS for rapid prototyping.",
        img: "images/project1.jpg",
        tech: ["HTML", "CSS", "JavaScript"],
        url: "https://github.com/Deepak-S-github/CODSOFT-TASK-3-CALCULATOR-PPROJECT"
      },
      {
        title: "Landing Page ",
        desc: "Static responsive landing page",
        long: "Clean and responsive static landing page built using HTML, CSS, and JS.",
        img: "images/project2.jpg",
        tech: ["HTML", "CSS", "JavaScript"],
        url: "https://github.com/dpak-07/CODSOFT-TASK-2-LANDING-PAGE"
      }
    ],
    "Data / ML": [
      {
        title: "PySpark Learning",
        desc: "PySpark exercises in notebooks",
        long: "Interactive PySpark learning workspace with hands-on examples using DataFrame APIs—ideal for beginners in Big Data.",
        img: "images/placeholder.jpg",
        tech: ["Python", "PySpark", "Jupyter"],
        url: "https://github.com/dpak-07/py_spark_learing"
      }
    ],
    
  }

  const [active, setActive] = useState("Cloud / Backend")
  const [open, setOpen] = useState(null)

  const gridCols = categories[active].length > 3 
    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2" 
    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"

  return (
    <section id="projects" className="section-large px-6 relative">
      <div className="site-container text-center">

        {/* Heading */}
        <motion.h2
          className="text-5xl font-extrabold text-white mb-12 relative inline-block"
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent animate-pulse">
            My Projects
          </span>
          <motion.div
            className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
          />
        </motion.h2>

        {/* Tabs */}
        <div className="relative flex justify-center gap-6 mb-12">
          {Object.keys(categories).map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`relative px-6 py-2 rounded-full text-lg transition-all duration-300
              ${active === cat ? "text-black font-bold" : "text-white/70 hover:text-cyansoft"}`}
            >
              {cat}
              {active === cat && (
                <motion.span
                  layoutId="activeTab"
                  className="absolute inset-0 bg-cyansoft rounded-full -z-10"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className={`grid ${gridCols} gap-8`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {categories[active].map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="h-full"
              >
                <article
                  className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-lg hover:shadow-cyanglow transition-all h-full flex flex-col"
                >
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={c.img}
                      alt={c.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  </div>
                  <div className="p-5 text-left flex flex-col flex-grow">
                    <h4 className="text-xl font-semibold text-white">{c.title}</h4>
                    <p className="text-sm text-white/70 mt-2 flex-grow">{c.desc}</p>
                    <div className="mt-4 flex items-center justify-between">
                      {c.url ? (
                        <a href={c.url} target="_blank" rel="noreferrer" className="text-cyansoft font-medium flex items-center gap-2">
                          <i className="fab fa-github"></i> Repo
                        </a>
                      ) : (
                        <span className="text-gray-400 italic">Private</span>
                      )}
                      <button onClick={() => setOpen(c)} className="text-white/60 hover:text-cyansoft text-sm">
                        View More →
                      </button>
                    </div>
                  </div>
                </article>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-lg" onClick={() => setOpen(null)} />
            <motion.div
              initial={{ scale: 0.7, y: 100, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: -50, opacity: 0 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="relative z-10 max-w-3xl w-[90%] bg-gradient-to-br from-[#111] via-[#1a1a1a] to-[#222] border border-white/10 rounded-2xl p-8 shadow-2xl"
            >
              <div className="flex flex-col md:flex-row items-start gap-6">
                <img
                  src={open.img}
                  alt={open.title}
                  className="w-32 h-32 rounded-lg object-cover shadow-md"
                />
                <div>
                  <h3 className="text-3xl font-bold text-white">{open.title}</h3>
                  <p className="text-white/80 mt-3">{open.long}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {open.tech.map((t) => (
                      <span
                        key={t}
                        className="px-3 py-1 text-sm rounded-full bg-white/10 text-white/80 border border-white/20"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="mt-6 flex gap-4">
                    {open.live && (
                      <a href={open.live} target="_blank" rel="noreferrer" className="bg-green-500 text-white px-5 py-2 rounded-md font-semibold shadow hover:shadow-lg transition">
                        View Live Site
                      </a>
                    )}
                    {open.url ? (
                      <a href={open.url} target="_blank" rel="noreferrer" className="bg-cyansoft text-black px-5 py-2 rounded-md font-semibold shadow hover:shadow-lg transition">
                        View Repo
                      </a>
                    ) : (
                      <span className="text-gray-400 italic">No Public Repo</span>
                    )}
                    <button onClick={() => setOpen(null)} className="border border-white/20 text-white px-5 py-2 rounded-md hover:bg-white/10">
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
