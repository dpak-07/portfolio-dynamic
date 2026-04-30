"use client";
import { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { SendHorizonal, Loader2, Mail, MapPin, Clock } from "lucide-react";
import { logSectionView, logLinkClick } from "../utils/analytics";

const EMAILJS_SERVICE_ID =
  process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || process.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID =
  process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || process.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || process.env.VITE_EMAILJS_PUBLIC_KEY;

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
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          message: form.message,
        },
        EMAILJS_PUBLIC_KEY
      );

      setStatus({ type: "success", text: "Message sent successfully." });
      logLinkClick("contact");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus({ type: "error", text: "Failed to send. Try again." });
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
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center md:text-left"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1.5"
            style={{ background: "var(--color-accent-soft)", borderColor: "var(--color-border-strong)" }}
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
          <h2 className="portfolio-gradient-text mb-2 text-5xl font-black md:text-6xl">
            Let's Talk
          </h2>
          <p className="text-lg text-[var(--color-muted)]">Drop me a line</p>
        </motion.div>

        {/* Bento Grid Layout */}
        <div className="grid md:grid-cols-3 gap-4">
          {/* Form - Takes 2 columns */}
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            onSubmit={submit}
            className="md:col-span-2 relative group"
          >
            {/* Glow Effect on Hover */}
            <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-teal-400 to-amber-300 opacity-0 blur transition duration-1000 group-hover:opacity-20" />

            <div className="portfolio-panel relative space-y-5 rounded-lg p-5 transition-all hover:border-cyan-500/30 sm:p-8">
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
                    className="portfolio-input w-full rounded-lg px-4 py-3.5 outline-none transition-all"
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
                    className="portfolio-input w-full rounded-lg px-4 py-3.5 outline-none transition-all"
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
                className="portfolio-input w-full resize-none rounded-lg px-4 py-3.5 outline-none transition-all"
              />

              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
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
                  className="portfolio-primary-button flex w-full items-center justify-center gap-2 rounded-lg px-8 py-3 font-bold transition-all disabled:cursor-not-allowed disabled:opacity-50 sm:ml-auto sm:w-auto"
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
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative group"
          >
            {/* Glow Effect */}
            <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-br from-teal-400 to-amber-300 opacity-20 blur transition duration-1000 group-hover:opacity-35" />

            <div className="portfolio-panel relative flex h-full flex-col justify-between rounded-lg p-6 transition-all hover:border-cyan-500/30 sm:p-8">
              <div>
                <motion.h3
                  className="mb-4 flex items-center gap-2 text-2xl font-bold text-[var(--color-text)]"
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Contact Info
                </motion.h3>

                {/* Email */}
                <div className="portfolio-panel-muted mb-4 rounded-lg p-3 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <Mail className="w-4 h-4 text-cyan-400" />
                    <span className="text-cyan-400 text-xs font-semibold uppercase">Email</span>
                  </div>
                  <a
                    href="mailto:deepakofficial0103@gmail.com"
                    className="break-all text-sm text-[var(--color-muted)] transition-colors hover:text-cyan-400"
                  >
                    deepakofficial0103@gmail.com
                  </a>
                </div>

                {/* Response Time */}
                <div className="portfolio-panel-muted mb-4 rounded-lg p-3 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-purple-400" />
                    <span className="text-purple-400 text-xs font-semibold uppercase">Response</span>
                  </div>
                  <p className="text-sm text-[var(--color-muted)]">Usually within 24 hours</p>
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
                  <span className="text-sm text-[var(--color-muted)]">Available for work</span>
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
                  <span className="text-sm text-[var(--color-muted)]">Open to collaborations</span>
                </motion.div>
                <motion.div
                  className="flex items-center gap-2"
                  whileHover={{ x: 5 }}
                >
                  <motion.div className="w-2 h-2 bg-purple-400 rounded-full" />
                  <span className="text-sm text-[var(--color-muted)]">Freelance projects</span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
