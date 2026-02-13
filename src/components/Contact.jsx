"use client";
import { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { SendHorizonal, Loader2, Mail, MapPin, Clock } from "lucide-react";
import { logSectionView, logLinkClick } from "../utils/analytics";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const sectionRef = useRef(null);
  const sectionInView = useInView(sectionRef, { once: true, amount: 0.3 });

  useEffect(() => {
    if (sectionInView) {
      logSectionView("contact");
    }
  }, [sectionInView]);

  const update = (key) => (e) =>
    setForm((s) => ({ ...s, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          message: form.message,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      setStatus({ type: "success", text: "✓ Message sent successfully!" });
      logLinkClick("contact");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus({ type: "error", text: "✗ Failed to send. Try again!" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative py-16 px-6 overflow-hidden min-h-[85vh] flex items-center"
    >
      {/* Animated Background Elements */}

      <div className="relative max-w-6xl mx-auto w-full">
        {/* Compact Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center md:text-left"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-full mb-4"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Mail className="w-3 h-3 text-cyan-400" />
            </motion.div>
            <span className="text-cyan-400 text-xs font-medium uppercase tracking-wider">
              Get In Touch
            </span>
          </motion.div>
          <h2 className="text-5xl md:text-7xl font-black text-white mb-2 bg-gradient-to-r from-white via-cyan-200 to-cyan-500 bg-clip-text text-transparent">
            Let's Talk
          </h2>
          <p className="text-white/50 text-lg">Drop me a line →</p>
        </motion.div>

        {/* Bento Grid Layout */}
        <div className="grid md:grid-cols-3 gap-4">
          {/* Form - Takes 2 columns */}
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            onSubmit={submit}
            className="md:col-span-2 relative group"
          >
            {/* Glow Effect on Hover */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-3xl blur opacity-0 group-hover:opacity-20 transition duration-1000" />

            <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 space-y-5 hover:border-cyan-500/30 transition-all">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="relative">
                  <motion.input
                    animate={{
                      borderColor:
                        focusedField === "name" ? "#22d3ee" : "rgba(255,255,255,0.1)",
                    }}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                    required
                    type="text"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={update("name")}
                    className="w-full bg-black/40 border px-4 py-3.5 rounded-xl text-white placeholder-white/40 outline-none transition-all focus:bg-black/60"
                  />
                </div>

                <div className="relative">
                  <motion.input
                    animate={{
                      borderColor:
                        focusedField === "email" ? "#22d3ee" : "rgba(255,255,255,0.1)",
                    }}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    required
                    type="email"
                    placeholder="Email Address"
                    value={form.email}
                    onChange={update("email")}
                    className="w-full bg-black/40 border px-4 py-3.5 rounded-xl text-white placeholder-white/40 outline-none transition-all focus:bg-black/60"
                  />
                </div>
              </div>

              <motion.textarea
                animate={{
                  borderColor:
                    focusedField === "message" ? "#22d3ee" : "rgba(255,255,255,0.1)",
                }}
                onFocus={() => setFocusedField("message")}
                onBlur={() => setFocusedField(null)}
                required
                rows="5"
                placeholder="Tell me about your project or just say hi..."
                value={form.message}
                onChange={update("message")}
                className="w-full bg-black/40 border px-4 py-3.5 rounded-xl text-white placeholder-white/40 outline-none resize-none transition-all focus:bg-black/60"
              />

              <div className="flex items-center justify-between pt-2">
                <AnimatePresence>
                  {status && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className={`text-sm font-medium ${status.type === "success" ? "text-green-400" : "text-red-400"
                        }`}
                    >
                      {status.text}
                    </motion.span>
                  )}
                </AnimatePresence>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={loading}
                  type="submit"
                  className="ml-auto bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold px-8 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin w-5 h-5" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <SendHorizonal className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.form>

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative group"
          >
            {/* Glow Effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />

            <div className="relative bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-blue-500/10 backdrop-blur-sm border border-white/10 rounded-3xl p-8 flex flex-col justify-between hover:border-cyan-500/30 transition-all h-full">
              <div>
                <motion.h3
                  className="text-2xl font-bold text-white mb-4 flex items-center gap-2"
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Contact Info
                  <motion.span
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ✨
                  </motion.span>
                </motion.h3>

                {/* Email */}
                <div className="mb-4 p-3 bg-black/30 rounded-lg hover:bg-black/40 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <Mail className="w-4 h-4 text-cyan-400" />
                    <span className="text-cyan-400 text-xs font-semibold uppercase">Email</span>
                  </div>
                  <a
                    href="mailto:deepakofficial0103@gmail.com"
                    className="text-white/80 text-sm hover:text-cyan-400 transition-colors break-all"
                  >
                    deepakofficial0103@gmail.com
                  </a>
                </div>

                {/* Response Time */}
                <div className="mb-4 p-3 bg-black/30 rounded-lg hover:bg-black/40 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-purple-400" />
                    <span className="text-purple-400 text-xs font-semibold uppercase">Response</span>
                  </div>
                  <p className="text-white/80 text-sm">Usually within 24 hours</p>
                </div>
              </div>

              {/* Status Indicators */}
              <div className="mt-6 space-y-3">
                <motion.div
                  className="flex items-center gap-2"
                  whileHover={{ x: 5 }}
                >
                  <motion.div
                    className="w-2 h-2 bg-green-400 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-white/70 text-sm">Available for work</span>
                </motion.div>
                <motion.div
                  className="flex items-center gap-2"
                  whileHover={{ x: 5 }}
                >
                  <motion.div
                    className="w-2 h-2 bg-cyan-400 rounded-full"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <span className="text-white/70 text-sm">Open to collaborations</span>
                </motion.div>
                <motion.div
                  className="flex items-center gap-2"
                  whileHover={{ x: 5 }}
                >
                  <motion.div className="w-2 h-2 bg-purple-400 rounded-full" />
                  <span className="text-white/70 text-sm">Freelance projects</span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}