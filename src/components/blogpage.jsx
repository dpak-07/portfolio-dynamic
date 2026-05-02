import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Clock,
  ExternalLink,
  Eye,
  Heart,
  Home,
  Search,
  Share2,
  Tag,
  X,
} from "lucide-react";
import { useBlogData } from "../hooks/useBlogData";
import { formatDate, getUniqueTags } from "../utils/blogHelpers";
import {
  logBlogLike,
  logBlogReadTime,
  logBlogView,
  logDeviceInfo,
  logPageDuration,
  logPageLoad,
  logTrafficSource,
  logUniqueUser,
} from "../utils/analytics";
import { db } from "../firebase";
import { doc, increment, updateDoc } from "firebase/firestore";
import { useLightweightMotion } from "../hooks/useLightweightMotion";

const FALLBACK_COVER =
  "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1600&h=1000&fit=crop";

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0 },
};

const gentleSpring = {
  type: "spring",
  stiffness: 220,
  damping: 24,
};

function stripHtml(html = "") {
  return String(html).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function getPostId(post) {
  return post.id || post.slug || post.title;
}

function getPostSlug(post) {
  return post.slug || post.id || post.title;
}

function getStoredSet(key, storage = "local") {
  if (typeof window === "undefined") return new Set();

  try {
    const store = storage === "session" ? window.sessionStorage : window.localStorage;
    return new Set(JSON.parse(store.getItem(key) || "[]"));
  } catch {
    return new Set();
  }
}

function saveStoredSet(key, value, storage = "local") {
  if (typeof window === "undefined") return;

  try {
    const store = storage === "session" ? window.sessionStorage : window.localStorage;
    store.setItem(key, JSON.stringify([...value]));
  } catch {
    // Storage can be unavailable in private browsing. Firestore updates still run.
  }
}

export default function BlogPage() {
  const { posts: firestorePosts, loading, error } = useBlogData(true);
  const [query, setQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");
  const [activePost, setActivePost] = useState(null);
  const [likedPosts, setLikedPosts] = useState(() => getStoredSet("portfolio.blog.likedPosts"));
  const [viewedPosts, setViewedPosts] = useState(() => getStoredSet("portfolio.blog.viewedPosts", "session"));
  const [countDeltas, setCountDeltas] = useState({});
  const [readStartTime, setReadStartTime] = useState(null);
  const [pageLoadTime] = useState(() => Date.now());
  const [copiedPost, setCopiedPost] = useState("");
  const lightweightMotion = useLightweightMotion();

  const posts = useMemo(() => firestorePosts || [], [firestorePosts]);
  const tags = useMemo(() => ["All", ...getUniqueTags(posts)], [posts]);
  const featured = posts[0];

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return posts.filter((post) => {
      const searchText = [
        post.title,
        post.excerpt,
        stripHtml(post.content),
        post.author,
        ...(post.tags || []),
      ]
        .join(" ")
        .toLowerCase();

      const matchesQuery = !normalizedQuery || searchText.includes(normalizedQuery);
      const matchesTag = selectedTag === "All" || post.tags?.includes(selectedTag);
      return matchesQuery && matchesTag;
    });
  }, [posts, query, selectedTag]);

  useEffect(() => {
    const loadTime = Date.now() - pageLoadTime;
    logPageLoad("blog", loadTime);
    logDeviceInfo();
    logTrafficSource();
    logUniqueUser();

    const pageStart = Date.now();
    return () => logPageDuration("blog", Date.now() - pageStart);
  }, [pageLoadTime]);

  useEffect(() => {
    if (!activePost) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [activePost]);

  const getCount = (post, field) => {
    const id = getPostId(post);
    return Number(post[field] || 0) + Number(countDeltas[id]?.[field] || 0);
  };

  const updatePostCount = async (post, field) => {
    const id = getPostId(post);
    if (!id) return;

    setCountDeltas((current) => ({
      ...current,
      [id]: {
        ...current[id],
        [field]: Number(current[id]?.[field] || 0) + 1,
      },
    }));

    try {
      await updateDoc(doc(db, "blog", id), {
        [field]: increment(1),
      });
    } catch (error) {
      console.error(`Error updating blog ${field}:`, error);
      setCountDeltas((current) => ({
        ...current,
        [id]: {
          ...current[id],
          [field]: Math.max(Number(current[id]?.[field] || 0) - 1, 0),
        },
      }));
    }
  };

  const openPost = (post) => {
    const id = getPostId(post);
    setActivePost(post);
    setReadStartTime(Date.now());
    logBlogView(getPostSlug(post), post.title);

    if (!viewedPosts.has(id)) {
      const nextViewed = new Set([...viewedPosts, id]);
      setViewedPosts(nextViewed);
      saveStoredSet("portfolio.blog.viewedPosts", nextViewed, "session");
      updatePostCount(post, "views");
    }
  };

  const closePost = () => {
    if (activePost && readStartTime) {
      logBlogReadTime(getPostSlug(activePost), (Date.now() - readStartTime) / 1000);
    }

    setActivePost(null);
    setReadStartTime(null);
  };

  const likePost = (post) => {
    const id = getPostId(post);
    if (likedPosts.has(id)) return;

    const nextLiked = new Set([...likedPosts, id]);
    setLikedPosts(nextLiked);
    saveStoredSet("portfolio.blog.likedPosts", nextLiked);
    logBlogLike(getPostSlug(post));
    updatePostCount(post, "likes");
  };

  const sharePost = async (post) => {
    const url = `${window.location.origin}/blog#${getPostSlug(post)}`;
    try {
      await navigator.clipboard?.writeText(url);
      setCopiedPost(getPostId(post));
      setTimeout(() => setCopiedPost(""), 1800);
    } catch {
      window.prompt("Copy this blog link", url);
    }
  };

  const motionProps = lightweightMotion
    ? {
        initial: false,
        animate: "show",
        transition: { duration: 0.12 },
      }
    : {
        initial: "hidden",
        animate: "show",
        transition: { duration: 0.5, ease: "easeOut" },
      };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-6 lg:px-8">
          <div className="h-14 animate-pulse rounded-lg bg-[var(--color-surface-soft)]" />
          <div className="mt-16 h-72 animate-pulse rounded-lg bg-[var(--color-surface-soft)]" />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-80 animate-pulse rounded-lg bg-[var(--color-surface-soft)]" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-5 text-[var(--color-text)]">
        <div className="max-w-lg rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center shadow-[var(--shadow-elevated)]">
          <BookOpen className="mx-auto mb-4 h-10 w-10 text-[var(--color-accent-a)]" />
          <h1 className="text-2xl font-semibold">Blog could not load</h1>
          <p className="mt-3 text-sm text-[var(--color-muted)]">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-lg bg-[var(--color-accent-a)] px-5 py-3 text-sm font-semibold text-black"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_12%,color-mix(in_srgb,var(--color-accent-a)_18%,transparent),transparent_28%),radial-gradient(circle_at_78%_8%,color-mix(in_srgb,var(--color-accent-b)_16%,transparent),transparent_24%),linear-gradient(180deg,var(--color-bg),var(--color-bg-strong))]" />

      <motion.nav
        initial={lightweightMotion ? false : { y: -28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: lightweightMotion ? 0.1 : 0.35, ease: "easeOut" }}
        className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-nav)]/90 backdrop-blur-2xl"
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-6 lg:px-8">
          <motion.a
            href="/blog"
            whileHover={lightweightMotion ? undefined : { scale: 1.02 }}
            whileTap={lightweightMotion ? undefined : { scale: 0.98 }}
            className="flex items-center gap-3 font-semibold tracking-tight"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-soft)] text-[var(--color-accent-a)]">
              <BookOpen size={20} />
            </span>
            <span>Deepak's Blog</span>
          </motion.a>

          <motion.a
            href="/"
            whileHover={lightweightMotion ? undefined : { y: -2 }}
            whileTap={lightweightMotion ? undefined : { scale: 0.98 }}
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-2 text-sm font-semibold text-[var(--color-text)] transition hover:border-[var(--color-accent-a)] hover:text-[var(--color-accent-a)]"
          >
            <Home size={16} />
            <span className="hidden sm:inline">Visit My Portfolio</span>
            <span className="sm:hidden">Portfolio</span>
          </motion.a>
        </div>
      </motion.nav>

      <header className="relative mx-auto max-w-6xl px-5 pb-12 pt-14 sm:px-6 lg:px-8 lg:pb-16 lg:pt-20">
        <motion.div
          variants={fadeUp}
          {...motionProps}
          className="max-w-4xl"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent-a)]">
            <span className="h-2 w-2 rounded-full bg-[var(--color-accent-d)]" />
            Builder Notes
          </div>
          <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-normal sm:text-5xl lg:text-7xl">
            The journey, the lessons, and the path behind the work.
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-[var(--color-muted)] sm:text-lg">
            A focused space for project stories, engineering decisions, career growth, hackathon notes, AI experiments, and the practical learning that shaped my portfolio.
          </p>
        </motion.div>

        <motion.div
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: lightweightMotion ? 0 : 0.08 } },
          }}
          {...motionProps}
          className="mt-10 grid gap-4 sm:grid-cols-3"
        >
          {[
            ["Posts", posts.length],
            ["Topics", Math.max(tags.length - 1, 0)],
            ["Latest", featured?.date ? formatDate(featured.date) : "Coming soon"],
          ].map(([label, value]) => (
            <motion.div
              key={label}
              variants={fadeUp}
              whileHover={lightweightMotion ? undefined : { y: -4 }}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-5 transition-colors hover:border-[var(--color-accent-a)]"
            >
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-faint)]">{label}</div>
              <div className="mt-2 text-2xl font-bold text-[var(--color-text)]">{value}</div>
            </motion.div>
          ))}
        </motion.div>
      </header>

      <main className="mx-auto max-w-6xl px-5 pb-20 sm:px-6 lg:px-8">
        {featured && (
          <motion.section
            variants={fadeUp}
            initial={lightweightMotion ? false : "hidden"}
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: lightweightMotion ? 0.12 : 0.5, ease: "easeOut" }}
            className="mb-10 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-elevated)]"
          >
            <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
              <div className="relative min-h-72">
                <img
                  src={featured.cover || FALLBACK_COVER}
                  alt={featured.title}
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent lg:hidden" />
              </div>
              <div className="p-6 sm:p-8 lg:p-10">
                <div className="mb-4 inline-flex rounded-full bg-[var(--color-accent-a)]/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-accent-a)]">
                  Featured Story
                </div>
                <h2 className="text-3xl font-black leading-tight sm:text-4xl">{featured.title}</h2>
                <p className="mt-4 leading-7 text-[var(--color-muted)]">{featured.excerpt}</p>
                <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-[var(--color-faint)]">
                  <span className="inline-flex items-center gap-2">
                    <Calendar size={16} /> {formatDate(featured.date)}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Clock size={16} /> {featured.readTime}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Eye size={16} /> {getCount(featured, "views")} views
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Heart size={16} /> {getCount(featured, "likes")} likes
                  </span>
                </div>
                <motion.button
                  type="button"
                  onClick={() => openPost(featured)}
                  whileHover={lightweightMotion ? undefined : { y: -2, scale: 1.02 }}
                  whileTap={lightweightMotion ? undefined : { scale: 0.98 }}
                  className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[var(--color-accent-a)] px-5 py-3 text-sm font-bold text-black transition hover:brightness-110"
                >
                  Read the journey <ArrowRight size={16} />
                </motion.button>
              </div>
            </div>
          </motion.section>
        )}

        <motion.section
          variants={fadeUp}
          initial={lightweightMotion ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: lightweightMotion ? 0.12 : 0.45, ease: "easeOut" }}
          className="mb-8 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-4 sm:p-5"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <label className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--color-faint)]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search the path, projects, topics..."
                className="h-12 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] pl-12 pr-4 text-sm text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-faint)] focus:border-[var(--color-accent-a)]"
              />
            </label>
            <div className="flex gap-2 overflow-x-auto pb-1 lg:max-w-xl">
              {tags.map((tag) => (
                <motion.button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(tag)}
                  layout
                  whileHover={lightweightMotion ? undefined : { y: -2 }}
                  whileTap={lightweightMotion ? undefined : { scale: 0.96 }}
                  className={`shrink-0 rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                    selectedTag === tag
                      ? "border-[var(--color-accent-a)] bg-[var(--color-accent-a)] text-black"
                      : "border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-muted)] hover:text-[var(--color-text)]"
                  }`}
                >
                  {tag}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section layout className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((post, index) => {
              const id = getPostId(post);
              const isLiked = likedPosts.has(id);

              return (
                <motion.article
                  layout
                  key={id}
                  variants={fadeUp}
                  initial={lightweightMotion ? false : "hidden"}
                  animate="show"
                  exit={{ opacity: 0, scale: 0.96, y: 12 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: lightweightMotion ? 0.12 : 0.35, delay: Math.min(index * 0.035, 0.2) }}
                  whileHover={lightweightMotion ? undefined : { y: -6 }}
                  className="group flex min-h-[30rem] flex-col overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-soft)] transition-colors hover:border-[var(--color-accent-a)]"
                >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={post.cover || FALLBACK_COVER}
                    alt={post.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/55 to-transparent" />
                  <div className="absolute left-4 top-4 rounded-full bg-black/55 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                    {post.tags?.[0] || "Blog"}
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--color-faint)]">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar size={14} /> {formatDate(post.date)}
                    </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock size={14} /> {post.readTime}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Eye size={14} /> {getCount(post, "views")}
                  </span>
                </div>
                  <h3 className="mt-4 text-xl font-bold leading-snug text-[var(--color-text)]">{post.title}</h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-7 text-[var(--color-muted)]">{post.excerpt}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(post.tags || []).slice(0, 3).map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-1 rounded-full border border-[var(--color-border)] px-2.5 py-1 text-xs text-[var(--color-muted)]">
                        <Tag size={12} /> {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto flex items-center justify-between border-t border-[var(--color-border)] pt-5">
                    <motion.button
                      type="button"
                      onClick={() => likePost(post)}
                      whileTap={lightweightMotion ? undefined : { scale: 0.9 }}
                      className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                        isLiked
                          ? "bg-[var(--color-accent-e)] text-white"
                          : "bg-[var(--color-surface-soft)] text-[var(--color-muted)] hover:text-[var(--color-accent-e)]"
                      }`}
                    >
                      <motion.span
                        animate={isLiked && !lightweightMotion ? { scale: [1, 1.25, 1] } : undefined}
                        transition={{ duration: 0.28 }}
                      >
                        <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
                      </motion.span>
                      {getCount(post, "likes")}
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => openPost(post)}
                      whileHover={lightweightMotion ? undefined : { x: 2 }}
                      whileTap={lightweightMotion ? undefined : { scale: 0.98 }}
                      className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-accent-a)] px-4 py-2 text-sm font-bold text-black transition hover:brightness-110"
                    >
                      Read <ArrowRight size={15} />
                    </motion.button>
                  </div>
                </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.section>

        {filteredPosts.length === 0 && (
          <motion.div
            initial={lightweightMotion ? false : { opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: lightweightMotion ? 0.12 : 0.32 }}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-6 py-16 text-center"
          >
            <Search className="mx-auto mb-4 h-10 w-10 text-[var(--color-faint)]" />
            <h2 className="text-2xl font-bold">No posts matched that search</h2>
            <p className="mt-2 text-[var(--color-muted)]">Try a different topic or clear your filters.</p>
          </motion.div>
        )}
      </main>

      <AnimatePresence>
        {activePost && (
          <motion.div
            initial={lightweightMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: lightweightMotion ? 0.08 : 0.22 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/75 p-3 backdrop-blur-md sm:p-6"
            onClick={closePost}
          >
            <motion.article
              initial={lightweightMotion ? { opacity: 1 } : { opacity: 0, y: 36, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={lightweightMotion ? { opacity: 0 } : { opacity: 0, y: 28, scale: 0.98 }}
              transition={lightweightMotion ? { duration: 0.1 } : gentleSpring}
              onClick={(event) => event.stopPropagation()}
              className="max-h-[92svh] w-full max-w-4xl overflow-y-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] shadow-2xl"
            >
              <div className="relative h-64 overflow-hidden sm:h-80">
                <img
                  src={activePost.cover || FALLBACK_COVER}
                  alt={activePost.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                <motion.button
                  type="button"
                  onClick={closePost}
                  whileHover={lightweightMotion ? undefined : { rotate: 4, scale: 1.05 }}
                  whileTap={lightweightMotion ? undefined : { scale: 0.92 }}
                  className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-lg bg-black/55 text-white backdrop-blur transition hover:bg-black/75"
                  aria-label="Close post"
                >
                  <X size={20} />
                </motion.button>
              </div>

              <motion.div
                initial={lightweightMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: lightweightMotion ? 0 : 0.1, duration: 0.35 }}
                className="p-6 sm:p-8 lg:p-10"
              >
                <motion.div
                  initial={lightweightMotion ? false : "hidden"}
                  animate="show"
                  variants={{ hidden: {}, show: { transition: { staggerChildren: 0.045 } } }}
                  className="flex flex-wrap gap-2"
                >
                  {(activePost.tags || []).map((tag) => (
                    <motion.span
                      key={tag}
                      variants={fadeUp}
                      className="rounded-full bg-[var(--color-accent-a)]/15 px-3 py-1 text-xs font-semibold text-[var(--color-accent-a)]"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </motion.div>
                <h1 className="mt-5 text-3xl font-black leading-tight sm:text-5xl">{activePost.title}</h1>
                <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-[var(--color-muted)]">
                  <span>{activePost.author}</span>
                  <span className="inline-flex items-center gap-2">
                    <Calendar size={16} /> {formatDate(activePost.date)}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Clock size={16} /> {activePost.readTime}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Eye size={16} /> {getCount(activePost, "views")} views
                  </span>
                </div>

                <div
                  className="blog-article-content mt-8 max-w-none text-[var(--color-muted)]"
                  dangerouslySetInnerHTML={{ __html: activePost.content }}
                />

                <div className="sticky bottom-0 -mx-6 mt-10 flex flex-wrap gap-3 border-t border-[var(--color-border)] bg-[var(--color-bg)]/92 px-6 pt-6 backdrop-blur-xl sm:static sm:mx-0 sm:bg-transparent sm:px-0 sm:backdrop-blur-0">
                  <motion.button
                    type="button"
                    onClick={() => likePost(activePost)}
                    whileTap={lightweightMotion ? undefined : { scale: 0.94 }}
                    className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-surface-soft)] px-4 py-2 text-sm font-semibold text-[var(--color-text)]"
                  >
                    <Heart size={16} fill={likedPosts.has(getPostId(activePost)) ? "currentColor" : "none"} />
                    Appreciate ({getCount(activePost, "likes")})
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => sharePost(activePost)}
                    whileTap={lightweightMotion ? undefined : { scale: 0.94 }}
                    className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-surface-soft)] px-4 py-2 text-sm font-semibold text-[var(--color-text)]"
                  >
                    <Share2 size={16} />
                    {copiedPost === getPostId(activePost) ? "Copied" : "Copy link"}
                  </motion.button>
                  <motion.a
                    href="/"
                    whileHover={lightweightMotion ? undefined : { y: -2 }}
                    whileTap={lightweightMotion ? undefined : { scale: 0.98 }}
                    className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-accent-a)] px-4 py-2 text-sm font-bold text-black"
                  >
                    Visit My Portfolio <ExternalLink size={16} />
                  </motion.a>
                </div>
              </motion.div>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {copiedPost && !activePost && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-5 left-1/2 z-[1001] -translate-x-1/2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-semibold text-[var(--color-text)] shadow-[var(--shadow-elevated)]"
          >
            Blog link copied
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .blog-article-content :global(h2),
        .blog-article-content :global(h3) {
          color: var(--color-text);
          font-weight: 800;
          line-height: 1.2;
          margin: 2rem 0 0.85rem;
        }
        .blog-article-content :global(h2) {
          font-size: clamp(1.6rem, 3vw, 2.25rem);
        }
        .blog-article-content :global(h3) {
          font-size: clamp(1.25rem, 2.2vw, 1.65rem);
        }
        .blog-article-content :global(p),
        .blog-article-content :global(li) {
          font-size: 1rem;
          line-height: 1.85;
          margin: 0.9rem 0;
        }
        .blog-article-content :global(ul),
        .blog-article-content :global(ol) {
          margin: 1rem 0;
          padding-left: 1.35rem;
        }
        .blog-article-content :global(a) {
          color: var(--color-accent-a);
          font-weight: 700;
        }
        .blog-article-content :global(img) {
          border-radius: 0.5rem;
          margin: 1.5rem 0;
          max-width: 100%;
        }
      `}</style>
    </div>
  );
}
