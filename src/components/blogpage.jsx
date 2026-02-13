import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaShareAlt, 
  FaClock, 
  FaTags, 
  FaUser, 
  FaHeart, 
  FaSearch,
  FaArrowLeft,
  FaBookmark,
  FaEye,
  FaComment,
  FaCalendar,
  FaFilter,
  FaTimes
} from "react-icons/fa";
import { useBlogData } from "../hooks/useBlogData";
import { getUniqueTags } from "../utils/blogHelpers";
import {
  logBlogView,
  logBlogLike,
  logBlogReadTime,
  logDeviceInfo,
  logTrafficSource,
  logUniqueUser,
  logPageLoad,
  logPageDuration,
} from "../utils/analytics";
import LinkedInCarousel from "./LinkedInCarousel";

export default function MassiveAnimatedBlogPage() {
  const { posts: firestorePosts, loading: postsLoading, error: postsError } = useBlogData(true);

  // UI state
  const [query, setQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState(null);
  const [active, setActive] = useState(null);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [bookmarkedPosts, setBookmarkedPosts] = useState(new Set());
  const [readStartTime, setReadStartTime] = useState(null);
  const [pageLoadTime] = useState(Date.now());
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [showFilters, setShowFilters] = useState(false);

  const posts = firestorePosts || [];
  const allTags = useMemo(() => getUniqueTags(posts), [posts]);

  const filtered = useMemo(() => {
    let list = posts.slice();
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          (p.tags && p.tags.join(" ").toLowerCase().includes(q))
      );
    }
    if (selectedTag) list = list.filter((p) => p.tags && p.tags.includes(selectedTag));
    list.sort((a, b) => new Date(b.date) - new Date(a.date));
    return list;
  }, [posts, query, selectedTag]);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    const loadTime = Date.now() - pageLoadTime;
    logPageLoad("blog", loadTime);
    logDeviceInfo();
    logTrafficSource();
    logUniqueUser();

    const pageStartTime = Date.now();
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
      const duration = Date.now() - pageStartTime;
      logPageDuration("blog", duration);
    };
  }, [pageLoadTime]);

  const handlePostView = (post) => {
    setActive(post);
    setReadStartTime(Date.now());
    logBlogView(post.slug || post.id, post.title);
  };

  const handleLike = (postSlug) => {
    if (likedPosts.has(postSlug)) return;
    setLikedPosts(new Set([...likedPosts, postSlug]));
    logBlogLike(postSlug);
  };

  const handleBookmark = (postSlug) => {
    const newBookmarks = new Set(bookmarkedPosts);
    if (newBookmarks.has(postSlug)) {
      newBookmarks.delete(postSlug);
    } else {
      newBookmarks.add(postSlug);
    }
    setBookmarkedPosts(newBookmarks);
  };

  const handleClosePost = () => {
    if (readStartTime && active) {
      const readTime = (Date.now() - readStartTime) / 1000;
      logBlogReadTime(active.slug || active.id, readTime);
    }
    setActive(null);
    setReadStartTime(null);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  if (postsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-32 bg-gradient-to-r from-blue-200 to-purple-200 rounded-3xl"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-96 bg-white/60 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (postsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-3xl p-12 shadow-2xl">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaTimes className="text-4xl text-red-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{postsError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Floating Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 border-b border-gray-200/50 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <motion.a
              href="/"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 text-gray-900 font-bold text-xl"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <FaArrowLeft className="text-white" />
              </div>
              <span className="hidden sm:block">Back to Home</span>
            </motion.a>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
                <FaEye className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700">{filtered.length} posts</span>
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors md:hidden"
              >
                <FaFilter className="text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-block mb-6"
            >
              <div className="px-6 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                <span className="text-white/90 text-sm font-semibold tracking-wide">✨ CREATIVE STORIES</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl lg:text-7xl font-black text-white mb-6 leading-tight"
            >
              Thoughts, Ideas & 
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300">
                Creative Stories
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xl text-white/90 max-w-3xl mx-auto mb-10 leading-relaxed"
            >
              Exploring the intersection of code, design, and gaming. 
              Join me on this journey of discovery and innovation.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <a
                href="#posts"
                className="group px-8 py-4 bg-white text-purple-600 rounded-2xl font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <span className="flex items-center justify-center gap-2">
                  Start Reading
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    →
                  </motion.span>
                </span>
              </a>
              <a
                href="#write"
                className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border-2 border-white/30 rounded-2xl font-bold hover:bg-white/20 transition-all duration-300"
              >
                Write a Post
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </header>

      {/* LinkedIn Carousel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 mb-16 relative z-10">
        <LinkedInCarousel />
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20" id="posts">
        {/* Search & Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="bg-white rounded-3xl shadow-xl p-6 lg:p-8 border border-gray-100">
            {/* Search Bar */}
            <div className="relative mb-6">
              <FaSearch className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles, topics, or keywords..."
                className="w-full pl-16 pr-6 py-5 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:bg-white transition-all text-lg"
              />
            </div>

            {/* Tags */}
            <div className={`${showFilters ? 'block' : 'hidden md:block'} space-y-4`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                  <FaTags className="text-purple-500" />
                  Filter by Topic
                </h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                    className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
                  >
                    {viewMode === "grid" ? "📱 Grid View" : "📋 List View"}
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedTag(null)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    !selectedTag
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All Posts
                </motion.button>
                {allTags.map((tag) => (
                  <motion.button
                    key={tag}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                      selectedTag === tag
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {tag}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Posts Grid/List */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className={`grid gap-8 ${
            viewMode === "grid"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
          }`}
        >
          {filtered.map((post, index) => (
            <motion.article
              key={post.id}
              variants={item}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className={`group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 ${
                viewMode === "list" ? "flex flex-col md:flex-row" : ""
              }`}
            >
              {/* Image */}
              <div className={`relative overflow-hidden ${viewMode === "list" ? "md:w-1/3" : "h-56"}`}>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <img
                  src={post.cover}
                  alt={post.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Bookmark Icon */}
                <button
                  onClick={() => handleBookmark(post.id)}
                  className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg"
                >
                  <FaBookmark
                    className={`${
                      bookmarkedPosts.has(post.id) ? "text-purple-500" : "text-gray-400"
                    } transition-colors`}
                  />
                </button>

                {/* Featured Badge */}
                {index === 0 && (
                  <div className="absolute top-4 left-4 z-20 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full">
                    <span className="text-white text-xs font-bold">⭐ FEATURED</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className={`p-6 ${viewMode === "list" ? "md:w-2/3 flex flex-col justify-between" : ""}`}>
                {/* Meta Info */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <FaCalendar className="text-purple-500" />
                      {new Date(post.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaClock className="text-blue-500" />
                      {post.readTime}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(window.location.href + `#post=${post.id}`);
                      alert("Link copied to clipboard!");
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <FaShareAlt className="text-gray-400 hover:text-purple-500 transition-colors" />
                  </button>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-purple-50 text-purple-600 rounded-lg text-xs font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {post.author?.[0] || "A"}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{post.author}</p>
                      <p className="text-xs text-gray-500">Author</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${
                        likedPosts.has(post.id)
                          ? "bg-red-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-red-50"
                      }`}
                    >
                      <FaHeart
                        className={likedPosts.has(post.id) ? "text-white" : "text-red-500"}
                      />
                      <span>{(post.likes || 0) + (likedPosts.has(post.id) ? 1 : 0)}</span>
                    </button>
                    
                    <button
                      onClick={() => handlePostView(post)}
                      className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
                    >
                      Read
                    </button>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaSearch className="text-6xl text-gray-400" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-3">No posts found</h3>
            <p className="text-gray-600 mb-8">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <button
              onClick={() => {
                setQuery("");
                setSelectedTag(null);
              }}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
            >
              Clear Filters
            </button>
          </motion.div>
        )}

        {/* Write Section */}
        <motion.section
          id="write"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 bg-gradient-to-br from-purple-500 via-blue-500 to-purple-600 rounded-3xl p-8 lg:p-12 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-10"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-10">
              <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
                Share Your Story
              </h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Got something to share? Write about your experiences, learnings, or ideas.
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Article Title"
                  className="md:col-span-2 px-6 py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:border-white transition-all"
                />
                <select className="px-6 py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 rounded-2xl text-white focus:outline-none focus:border-white transition-all appearance-none cursor-pointer">
                  <option value="" className="bg-purple-600">Select Tag</option>
                  {allTags.map((tag) => (
                    <option key={tag} value={tag} className="bg-purple-600">
                      {tag}
                    </option>
                  ))}
                </select>
              </div>

              <textarea
                placeholder="Write your story here..."
                rows="6"
                className="w-full px-6 py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:border-white transition-all resize-none"
              />

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex-1 px-8 py-4 bg-white text-purple-600 rounded-2xl font-bold hover:shadow-2xl hover:scale-105 transition-all">
                  Publish Post
                </button>
                <button className="px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white rounded-2xl font-bold hover:bg-white/20 transition-all">
                  Save Draft
                </button>
              </div>
            </div>
          </div>
        </motion.section>
      </main>

      {/* Post Modal */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={handleClosePost}
          >
            <motion.article
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              {/* Header Image */}
              {active.cover && (
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={active.cover}
                    alt={active.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  {/* Close Button */}
                  <button
                    onClick={handleClosePost}
                    className="absolute top-6 right-6 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg z-10"
                  >
                    <FaTimes className="text-gray-900 text-xl" />
                  </button>
                </div>
              )}

              {/* Content */}
              <div className="p-8 lg:p-12">
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {active.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-2 bg-purple-50 text-purple-600 rounded-xl text-sm font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
                  {active.title}
                </h1>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-6 pb-6 mb-8 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                      <span className="text-white font-bold">{active.author?.[0] || "A"}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{active.author}</p>
                      <p className="text-sm text-gray-500">Author</p>
                    </div>
                  </div>

                  <div className="h-8 w-px bg-gray-200"></div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <FaCalendar className="text-purple-500" />
                    <span className="text-sm">{new Date(active.date).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <FaClock className="text-blue-500" />
                    <span className="text-sm">{active.readTime}</span>
                  </div>
                </div>

                {/* Article Content */}
                <div 
                  className="prose prose-lg max-w-none prose-headings:font-black prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-purple-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl prose-img:shadow-xl"
                  dangerouslySetInnerHTML={{ __html: active.content }}
                />

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-4 mt-12 pt-8 border-t border-gray-200">
                  <button
                    onClick={() => handleLike(active.id)}
                    className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold transition-all ${
                      likedPosts.has(active.id)
                        ? "bg-red-500 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-red-50"
                    }`}
                  >
                    <FaHeart className={likedPosts.has(active.id) ? "text-white" : "text-red-500"} />
                    <span>{(active.likes || 0) + (likedPosts.has(active.id) ? 1 : 0)} Likes</span>
                  </button>

                  <button
                    onClick={() => handleBookmark(active.id)}
                    className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold transition-all ${
                      bookmarkedPosts.has(active.id)
                        ? "bg-purple-500 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-purple-50"
                    }`}
                  >
                    <FaBookmark
                      className={bookmarkedPosts.has(active.id) ? "text-white" : "text-purple-500"}
                    />
                    <span>
                      {bookmarkedPosts.has(active.id) ? "Bookmarked" : "Bookmark"}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(window.location.href + `#post=${active.id}`);
                      alert("Link copied to clipboard!");
                    }}
                    className="flex items-center gap-3 px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl font-semibold hover:bg-gray-200 transition-all"
                  >
                    <FaShareAlt />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}