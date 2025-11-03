"use client";
import { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { SendHorizonal, Loader2 } from "lucide-react";
import { logSectionView, logLinkClick } from "../utils/analytics";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Section tracking
  const sectionRef = useRef(null);
  const sectionInView = useInView(sectionRef, { once: true, amount: 0.3 });

  useEffect(() => {
    if (sectionInView) {
      logSectionView("contact");
    }
  }, [sectionInView]);

  // ✅ Handle form updates
  const update = (key) => (e) =>
    setForm((s) => ({ ...s, [key]: e.target.value }));

  // ✅ Handle form submission
  const submit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);

    try {
      const res = await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          message: form.message,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      console.log("✅ EmailJS Response:", res);
      setStatus({ type: "success", text: "Message sent successfully 🚀" });
      logLinkClick("contact"); // ✅ Log success message send

      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("❌ EmailJS Error:", err);
      setStatus({
        type: "error",
        text: "Failed to send. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative py-16 px-6 overflow-hidden"
    >
      {/* ✨ Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/10 to-black" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl animate-pulse" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="relative max-w-2xl mx-auto bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8"
      >
        {/* 🧠 Header */}
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-center mb-3 text-cyansoft"
        >
          Let’s Connect 💬
        </motion.h2>
        <p className="text-white/70 text-center mb-8 text-sm md:text-base">
          Have an idea, collaboration, or project in mind? Drop a quick message
          — I’d love to hear from you.
        </p>

        {/* 📬 Form */}
        <form onSubmit={submit} className="grid grid-cols-1 gap-5">
          <motion.input
            whileFocus={{ scale: 1.03, borderColor: "#22d3ee" }}
            transition={{ type: "spring", stiffness: 200 }}
            required
            type="text"
            placeholder="Your Name"
            value={form.name}
            onChange={update("name")}
            className="bg-transparent border border-white/20 px-4 py-3 rounded-lg text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-cyansoft text-sm"
          />

          <motion.input
            whileFocus={{ scale: 1.03, borderColor: "#22d3ee" }}
            transition={{ type: "spring", stiffness: 200 }}
            required
            type="email"
            placeholder="Your Email"
            value={form.email}
            onChange={update("email")}
            className="bg-transparent border border-white/20 px-4 py-3 rounded-lg text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-cyansoft text-sm"
          />

          <motion.textarea
            whileFocus={{ scale: 1.02, borderColor: "#22d3ee" }}
            transition={{ type: "spring", stiffness: 150 }}
            required
            rows="5"
            placeholder="Your Message..."
            value={form.message}
            onChange={update("message")}
            className="bg-transparent border border-white/20 px-4 py-3 rounded-lg text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-cyansoft text-sm resize-none"
          />

          <div className="flex flex-col items-center md:flex-row md:justify-between gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              disabled={loading}
              type="submit"
              className="inline-flex items-center justify-center gap-2 bg-cyansoft text-black font-semibold px-6 py-2.5 rounded-lg shadow-cyanglow hover:scale-[1.02] transition-transform w-full md:w-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4" /> Sending...
                </>
              ) : (
                <>
                  <SendHorizonal className="w-4 h-4" /> Send Message
                </>
              )}
            </motion.button>

            {/* ✅ Status Message */}
            <AnimatePresence>
              {status && (
                <motion.div
                  key={status.text}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`text-sm font-medium ${
                    status.type === "success"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {status.text}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </form>
      </motion.div>
    </section>
  );
}
