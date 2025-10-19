import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaShareAlt, FaClock, FaTags, FaUser } from "react-icons/fa";

// MassiveAnimatedBlogPage.jsx
// - Single-file React component
// - Uses Tailwind CSS + Framer Motion for heavy, pleasant animations
// - Drop-in: place under src/components/ and import into your pages
// - Pass `posts` prop for real data or use included samplePosts

export default function MassiveAnimatedBlogPage({ posts: externalPosts }) {
  const samplePosts = [
    {
      id: "p1",
      title: "From Loot Boxes to Looper Functions: How Gaming Shaped My Coding Mindset",
      date: "2025-10-08",
      author: "Lokesh",
      readTime: "6 min",
      tags: ["Gaming", "Learning", "Mindset"],
      cover: "https://picsum.photos/seed/massive1/1600/900",
      excerpt:
        "A personal look at how tactical decisions, fast iteration and team play in gaming influenced the way I approach software problems.",
      content:
        `<h2>Intro</h2><p>I started playing competitive games at 14 and somehow ended up loving loops and conditions more than I expected...</p><h3>Quick Wins</h3><ul><li>Iterate fast</li><li>Communicate clearly</li></ul><p>...</p>`,
    },
    {
      id: "p2",
      title: "Designing Micro-Interactions: The Tiny Details That Make UX Feel Alive",
      date: "2025-09-12",
      author: "Lokesh",
      readTime: "4 min",
      tags: ["UX", "Frontend", "Design"],
      cover: "https://picsum.photos/seed/massive2/1600/900",
      excerpt: "Micro-interactions are the seasoning of UI — they turn an app from usable to delightful.",
      content: `<p>Micro-interactions help users understand outcomes. Examples: button ripples, animated toggles...</p>`,
    },
  ];

  const posts = externalPosts && externalPosts.length ? externalPosts : samplePosts;

  // UI state
  const [query, setQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState(null);
  const [active, setActive] = useState(null);

  // Derived
  const allTags = useMemo(() => {
    const s = new Set();
    posts.forEach((p) => p.tags.forEach((t) => s.add(t)));
    return Array.from(s).sort();
  }, [posts]);

  const filtered = useMemo(() => {
    let list = posts.slice();
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.tags.join(" ").toLowerCase().includes(q)
      );
    }
    if (selectedTag) list = list.filter((p) => p.tags.includes(selectedTag));
    list.sort((a, b) => new Date(b.date) - new Date(a.date));
    return list;
  }, [posts, query, selectedTag]);

  useEffect(() => {
    // small entrance animation on mount
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  // motion variants
  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };
  const card = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 140, damping: 18 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 py-12">
      {/* Hero animated intro */}
      <header className="max-w-6xl mx-auto px-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="rounded-2xl overflow-hidden relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white p-8 shadow-2xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <motion.h1
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 80 }}
                className="text-4xl md:text-5xl font-extrabold leading-tight"
              >
                Notes, Level-Ups & UX —
                <br /> Short essays from my coding and gaming life
              </motion.h1>

              <motion.p
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="mt-4 text-slate-200 max-w-xl"
              >
                I write about tiny UX details, front-end experiments, and the mental models I learned from competitive gaming.
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-6 flex gap-3"
              >
                <a
                  href="#posts"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur px-4 py-2 rounded-md text-sm font-medium"
                >
                  Explore posts
                </a>
                <a
                  href="#write"
                  className="inline-flex items-center gap-2 border border-white/20 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Write with me
                </a>
              </motion.div>
            </div>

            <div className="relative">
              <motion.div
                initial={{ scale: 0.98, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="rounded-xl overflow-hidden shadow-2xl"
              >
                <img
                  src="https://picsum.photos/seed/hero/1200/800"
                  alt="hero"
                  className="w-full h-56 md:h-72 object-cover"
                />
              </motion.div>

              {/* floating badges */}
              <motion.div
                animate={{ x: [0, -6, 0], y: [0, -4, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -bottom-4 left-4 bg-white/10 border border-white/20 text-white rounded-2xl px-3 py-2 text-xs shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <FaUser /> <span className="font-medium">Lokesh</span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </header>

      <main className="max-w-6xl mx-auto px-6" id="posts">
        {/* Filter bar */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search posts or tags..."
              className="rounded-full border px-4 py-2 text-sm w-72"
            />

            <div className="hidden md:flex gap-2">
              <button
                className={`px-3 py-1 rounded-full text-sm border ${!selectedTag ? "bg-white" : "bg-white/60"}`}
                onClick={() => setSelectedTag(null)}
              >
                All
              </button>
              {allTags.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTag((s) => (s === t ? null : t))}
                  className={`px-3 py-1 rounded-full text-sm border ${selectedTag === t ? "bg-white" : "bg-white/10"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-slate-500">Showing {filtered.length} posts</div>
            <a href="#write" className="text-sm px-3 py-2 border rounded-md">Start a draft</a>
          </div>
        </div>

        {/* Posts grid with big animated cards */}
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.map((p, i) => (
            <motion.article
              key={p.id}
              variants={card}
              whileHover={{ y: -6, scale: 1.02 }}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg border"
            >
              <div className="relative h-48">
                <img src={p.cover} alt={p.title} className="w-full h-full object-cover" />

                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <FaClock /> <span>{p.readTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaTags /> <span>{p.tags.join(", ")}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(window.location.href + `#post=${p.id}`);
                      alert("Link copied!");
                    }}
                    className="text-slate-500 opacity-80 hover:opacity-100"
                    title="Share"
                  >
                    <FaShareAlt />
                  </button>
                </div>

                <h3 className="mt-3 text-lg font-bold text-slate-900">{p.title}</h3>
                <p className="mt-2 text-slate-600 text-sm">{p.excerpt}</p>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-400 to-pink-400 flex items-center justify-center text-white text-xs font-semibold">{p.author?.[0] || "L"}</div>
                    <div className="text-xs text-slate-500">
                      <div>{p.author}</div>
                      <div className="text-[11px]">{new Date(p.date).toDateString()}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActive(p)}
                    className="px-3 py-1 rounded-md border text-sm"
                  >
                    Read
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* CTA and write area */}
        <section id="write" className="mt-12 bg-white rounded-2xl p-6 shadow-md border">
          <motion.h4 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-xl font-bold">
            Want to publish your first post?
          </motion.h4>
          <p className="text-sm text-slate-600 mt-2">Write something short — a lesson, a highlight, or a gaming story connected to code.</p>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <input className="col-span-2 rounded-md border px-3 py-2" placeholder="Title" />
            <select className="rounded-md border px-3 py-2">
              <option>Tag</option>
              {allTags.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <textarea className="mt-4 w-full rounded-md border min-h-[120px] p-3" placeholder="Write your story..." />

          <div className="mt-4 flex gap-3">
            <button className="px-4 py-2 rounded-md bg-indigo-600 text-white">Publish (demo)</button>
            <button className="px-4 py-2 rounded-md border">Save draft</button>
          </div>
        </section>
      </main>

      {/* Active post modal */}
      <AnimatePresence>
        {active && (
          <motion.div
            key="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center p-6"
          >
            <div className="absolute inset-0 bg-black/40" onClick={() => setActive(null)} />

            <motion.article
              initial={{ y: 30, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
              className="relative max-w-3xl w-full bg-white rounded-2xl shadow-2xl overflow-auto max-h-[92vh]"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400">{new Date(active.date).toDateString()} • {active.readTime}</div>
                    <h2 className="text-2xl font-bold mt-2">{active.title}</h2>
                    <div className="mt-3 flex items-center gap-3 text-sm text-slate-600">
                      <div className="flex items-center gap-2"><FaUser /> <span>{active.author}</span></div>
                      <div className="flex items-center gap-2"><FaTags /> <span>{active.tags.join(", ")}</span></div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => { navigator.clipboard?.writeText(window.location.href + `#post=${active.id}`); alert("Link copied"); }} className="px-3 py-1 border rounded-md">Share</button>
                    <button onClick={() => setActive(null)} className="px-3 py-1 border rounded-md">Close</button>
                  </div>
                </div>

                {active.cover && <img src={active.cover} alt="cover" className="w-full h-44 object-cover rounded-md my-6" />}

                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: active.content }} />
              </div>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

