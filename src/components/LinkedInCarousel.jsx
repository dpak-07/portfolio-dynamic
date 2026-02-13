import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink, ThumbsUp, MessageCircle, Linkedin } from "lucide-react";
import { useLinkedInData } from "../hooks/useBlogData";

export default function LinkedInCarousel() {
    const { linkedInData, loading, error } = useLinkedInData();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const posts = linkedInData?.posts || [];
    const profile = {
        name: linkedInData?.profileName || "Deepak S",
        image: linkedInData?.profileImage || "https://via.placeholder.com/100",
        url: linkedInData?.profileUrl || "https://linkedin.com/in/deepak-saminathan",
    };

    // Auto-rotate every 5 seconds
    useEffect(() => {
        if (posts.length === 0 || isPaused) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % posts.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [posts.length, isPaused]);

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % posts.length);
    };

    const goToPrev = () => {
        setCurrentIndex((prev) => (prev - 1 + posts.length) % posts.length);
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    if (loading) {
        return (
            <div className="w-full max-w-4xl mx-auto p-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-white/10 rounded w-48 mb-4"></div>
                    <div className="h-64 bg-white/10 rounded-2xl"></div>
                </div>
            </div>
        );
    }

    if (error || !linkedInData || posts.length === 0) {
        return null; // Don't show if no data
    }

    const currentPost = posts[currentIndex];

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl mx-auto p-6"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Linkedin className="w-8 h-8 text-[#0A66C2]" />
                    <h2 className="text-2xl font-bold text-white">Latest from LinkedIn</h2>
                </div>
                <a
                    href={profile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-[#0A66C2] hover:bg-[#004182] text-white rounded-lg transition-colors"
                >
                    <span className="text-sm font-medium">View Profile</span>
                    <ExternalLink className="w-4 h-4" />
                </a>
            </div>

            {/* Carousel Container */}
            <div
                className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                {/* Profile Info */}
                <div className="flex items-center gap-3 p-4 border-b border-white/10">
                    <img
                        src={profile.image}
                        alt={profile.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-[#0A66C2]"
                    />
                    <div>
                        <h3 className="text-white font-semibold">{profile.name}</h3>
                        <p className="text-gray-400 text-sm">
                            {currentPost?.date ? new Date(currentPost.date).toLocaleDateString() : ""}
                        </p>
                    </div>
                </div>

                {/* Slides */}
                <div className="relative h-[400px] overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0 p-6"
                        >
                            {/* Post Image */}
                            {currentPost?.image && (
                                <div className="mb-4 rounded-xl overflow-hidden">
                                    <img
                                        src={currentPost.image}
                                        alt="Post"
                                        className="w-full h-48 object-cover"
                                    />
                                </div>
                            )}

                            {/* Post Content */}
                            <div className="space-y-4">
                                <p className="text-white text-base leading-relaxed line-clamp-4">
                                    {currentPost?.content}
                                </p>

                                {/* Engagement Stats */}
                                <div className="flex items-center gap-6 text-gray-400 text-sm">
                                    <div className="flex items-center gap-2">
                                        <ThumbsUp className="w-4 h-4" />
                                        <span>{currentPost?.likes || 0} likes</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MessageCircle className="w-4 h-4" />
                                        <span>{currentPost?.comments || 0} comments</span>
                                    </div>
                                </div>

                                {/* View Post Link */}
                                {currentPost?.link && (
                                    <a
                                        href={currentPost.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-[#0A66C2] hover:text-[#004182] font-medium transition-colors"
                                    >
                                        <span>View post on LinkedIn</span>
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Navigation Arrows */}
                {posts.length > 1 && (
                    <>
                        <button
                            onClick={goToPrev}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all hover:scale-110"
                            aria-label="Previous post"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={goToNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all hover:scale-110"
                            aria-label="Next post"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </>
                )}

                {/* Dots Indicator */}
                {posts.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {posts.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                                        ? "bg-[#0A66C2] w-8"
                                        : "bg-white/30 hover:bg-white/50"
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                )}

                {/* Pause indicator */}
                {isPaused && posts.length > 1 && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-xs">
                        Paused
                    </div>
                )}
            </div>
        </motion.section>
    );
}
