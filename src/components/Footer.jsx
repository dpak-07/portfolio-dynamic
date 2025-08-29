// src/components/Footer.jsx
import { motion } from "framer-motion";

export default function Footer() {
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("deepakofficail0103@gmail.com");
      const notification = document.getElementById("copy-notification");
      if (notification) {
        notification.style.opacity = "1";
        notification.style.transform = "translateY(0)";
        setTimeout(() => {
          notification.style.opacity = "0";
          notification.style.transform = "translateY(6px)";
        }, 2000);
      }
    } catch (e) {
      console.error("Clipboard error", e);
    }
  };

  // Reusable animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay, duration: 0.6, ease: "easeOut" },
    }),
  };

  return (
    <motion.footer
      className="relative bg-white/10 backdrop-blur-xl border-t border-white/10 text-white py-16 mt-16"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
    >
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
        
        {/* About Me */}
        <motion.div variants={fadeUp} custom={0.2}>
          <h3 className="text-lg font-semibold text-cyansoft mb-3 relative inline-block">
            About Me
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyansoft transition-all duration-500 group-hover:w-full"></span>
          </h3>
          <p className="text-sm text-white/70 leading-relaxed">
            I’m <span className="font-medium">Deepak S</span>, a passionate
            developer crafting modern web experiences with{" "}
            <span className="text-cyansoft">React, Next.js</span>, and creative
            design. 🚀
          </p>
        </motion.div>

        {/* Quick Links */}
        <motion.div variants={fadeUp} custom={0.4}>
          <h3 className="text-lg font-semibold text-cyansoft mb-3 relative inline-block">
            Quick Links
          </h3>
          <ul className="space-y-3 text-sm text-white/70">
            {["About", "Projects", "Skills", "Contact"].map((section, idx) => (
              <motion.li
                key={idx}
                whileHover={{ x: 6, color: "#22d3ee" }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <a href={`#${section.toLowerCase()}`} className="transition">
                  {section}
                </a>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Contact & Socials */}
        <motion.div variants={fadeUp} custom={0.6}>
          <h3 className="text-lg font-semibold text-cyansoft mb-3 relative inline-block">
            Contact
          </h3>
          <p
            className="text-sm underline cursor-pointer hover:text-cyansoft transition"
            onClick={copyEmail}
          >
            deepakofficail0103@gmail.com
          </p>
          <p className="text-sm mt-1 text-white/70">📞 6369021716</p>

          {/* Socials */}
          <div className="flex justify-center md:justify-start gap-4 mt-5">
            {[
              {
                href: "https://github.com/Deepak-S-github",
                icon: "fab fa-github",
              },
              {
                href: "https://www.linkedin.com/in/deepak-saminathan/",
                icon: "fab fa-linkedin",
              },
              {
                href: "https://www.instagram.com/d.pak_07/",
                icon: "fab fa-instagram",
              },
            ].map((link, idx) => (
              <motion.a
                key={idx}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="relative w-10 h-10 flex items-center justify-center rounded-full border border-white/20 text-cyansoft overflow-hidden group"
                whileHover={{ scale: 1.2, rotate: 6 }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="absolute inset-0 bg-cyansoft/20 opacity-0 group-hover:opacity-100 transition"></span>
                <i className={link.icon}></i>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Line */}
      <motion.div
        className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-white/60"
        variants={fadeUp}
        custom={0.8}
      >
        &copy; {new Date().getFullYear()} Deepak S — Built with ❤️ using React
      </motion.div>

      {/* Copy Notification */}
      <div
        id="copy-notification"
        style={{
          opacity: 0,
          transform: "translateY(6px)",
          transition: "all 300ms ease",
        }}
        className="text-sm text-white/90 text-center mt-3"
      >
        Copied!
      </div>
    </motion.footer>
  );
}
