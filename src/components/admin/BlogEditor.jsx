import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useBlogData } from "../../hooks/useBlogData";
import {
    generateSlug,
    calculateReadTime,
    validateBlogPost,
} from "../../utils/blogHelpers";
import {
    Plus,
    Edit,
    Trash2,
    Save,
    X,
    Eye,
    EyeOff,
    RefreshCw,
} from "lucide-react";

export default function BlogEditor() {
    const { posts, loading, refetch } = useBlogData(false); // Get all posts including drafts
    const [isEditing, setIsEditing] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        author: "Deepak",
        excerpt: "",
        content: "",
        cover: "",
        tags: [],
        published: false,
    });
    const [tagInput, setTagInput] = useState("");
    const [errors, setErrors] = useState([]);
    const [saving, setSaving] = useState(false);

    const resetForm = () => {
        setFormData({
            title: "",
            author: "Deepak",
            excerpt: "",
            content: "",
            cover: "",
            tags: [],
            published: false,
        });
        setTagInput("");
        setErrors([]);
        setEditingPost(null);
        setIsEditing(false);
    };

    const handleEdit = (post) => {
        setEditingPost(post);
        setFormData({
            title: post.title || "",
            author: post.author || "Deepak",
            excerpt: post.excerpt || "",
            content: post.content || "",
            cover: post.cover || "",
            tags: post.tags || [],
            published: post.published || false,
        });
        setIsEditing(true);
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData({
                ...formData,
                tags: [...formData.tags, tagInput.trim()],
            });
            setTagInput("");
        }
    };

    const handleRemoveTag = (tag) => {
        setFormData({
            ...formData,
            tags: formData.tags.filter((t) => t !== tag),
        });
    };

    const handleSave = async () => {
        // Validate
        const validation = validateBlogPost(formData);
        if (!validation.valid) {
            setErrors(validation.errors);
            return;
        }

        setSaving(true);
        setErrors([]);

        try {
            const slug = generateSlug(formData.title);
            const readTime = calculateReadTime(formData.content);
            const date = new Date().toISOString().split("T")[0];

            const postData = {
                ...formData,
                slug,
                readTime,
                date,
                likes: formData.likes || 0,
                views: formData.views || 0,
                updatedAt: serverTimestamp(),
            };

            if (editingPost) {
                // Update existing post
                const postRef = doc(db, "blog", editingPost.id);
                await updateDoc(postRef, postData);
            } else {
                // Create new post
                await addDoc(collection(db, "blog"), {
                    ...postData,
                    createdAt: serverTimestamp(),
                });
            }

            await refetch();
            resetForm();
        } catch (error) {
            console.error("Error saving post:", error);
            setErrors([error.message]);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (postId) => {
        if (!confirm("Are you sure you want to delete this post?")) return;

        try {
            await deleteDoc(doc(db, "blog", postId));
            await refetch();
        } catch (error) {
            console.error("Error deleting post:", error);
            alert("Error deleting post: " + error.message);
        }
    };

    const handleTogglePublish = async (post) => {
        try {
            const postRef = doc(db, "blog", post.id);
            await updateDoc(postRef, {
                published: !post.published,
                updatedAt: serverTimestamp(),
            });
            await refetch();
        } catch (error) {
            console.error("Error toggling publish:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                            Blog Editor
                        </h1>
                        <p className="text-gray-400 mt-1">
                            Manage your blog posts - {posts.length} total
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={refetch}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                            Refresh
                        </button>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-semibold hover:shadow-lg transition-all"
                        >
                            <Plus className="w-4 h-4" />
                            New Post
                        </button>
                    </div>
                </div>

                {/* Posts List */}
                {!isEditing && (
                    <div className="grid grid-cols-1 gap-4">
                        {loading ? (
                            <div className="text-center py-12">
                                <div className="animate-spin w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto"></div>
                                <p className="text-gray-400 mt-4">Loading posts...</p>
                            </div>
                        ) : posts.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-400">No posts yet. Create your first one!</p>
                            </div>
                        ) : (
                            posts.map((post) => (
                                <motion.div
                                    key={post.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-xl font-bold">{post.title}</h3>
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs ${post.published
                                                            ? "bg-green-500/20 text-green-400"
                                                            : "bg-yellow-500/20 text-yellow-400"
                                                        }`}
                                                >
                                                    {post.published ? "Published" : "Draft"}
                                                </span>
                                            </div>
                                            <p className="text-gray-400 text-sm mb-3">{post.excerpt}</p>
                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                                <span>{post.date}</span>
                                                <span>{post.readTime}</span>
                                                <span>{post.author}</span>
                                                <span>{post.tags?.join(", ")}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleTogglePublish(post)}
                                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                                title={post.published ? "Unpublish" : "Publish"}
                                            >
                                                {post.published ? (
                                                    <EyeOff className="w-4 h-4" />
                                                ) : (
                                                    <Eye className="w-4 h-4" />
                                                )}
                                            </button>
                                            <button
                                                onClick={() => handleEdit(post)}
                                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(post.id)}
                                                className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                )}

                {/* Editor Form */}
                <AnimatePresence>
                    {isEditing && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">
                                    {editingPost ? "Edit Post" : "New Post"}
                                </h2>
                                <button
                                    onClick={resetForm}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {errors.length > 0 && (
                                <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                                    <ul className="list-disc list-inside text-red-400 text-sm">
                                        {errors.map((error, i) => (
                                            <li key={i}>{error}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="space-y-4">
                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">Title *</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) =>
                                            setFormData({ ...formData, title: e.target.value })
                                        }
                                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-cyan-500"
                                        placeholder="Enter post title"
                                    />
                                </div>

                                {/* Author */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">Author *</label>
                                    <input
                                        type="text"
                                        value={formData.author}
                                        onChange={(e) =>
                                            setFormData({ ...formData, author: e.target.value })
                                        }
                                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-cyan-500"
                                    />
                                </div>

                                {/* Cover Image URL */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">Cover Image URL</label>
                                    <input
                                        type="text"
                                        value={formData.cover}
                                        onChange={(e) =>
                                            setFormData({ ...formData, cover: e.target.value })
                                        }
                                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-cyan-500"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </div>

                                {/* Excerpt */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">Excerpt *</label>
                                    <textarea
                                        value={formData.excerpt}
                                        onChange={(e) =>
                                            setFormData({ ...formData, excerpt: e.target.value })
                                        }
                                        rows={2}
                                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-cyan-500"
                                        placeholder="Short description of the post"
                                    />
                                </div>

                                {/* Content */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">Content * (HTML)</label>
                                    <textarea
                                        value={formData.content}
                                        onChange={(e) =>
                                            setFormData({ ...formData, content: e.target.value })
                                        }
                                        rows={12}
                                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-cyan-500 font-mono text-sm"
                                        placeholder="<p>Your content here...</p>"
                                    />
                                </div>

                                {/* Tags */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">Tags *</label>
                                    <div className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                                            className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-cyan-500"
                                            placeholder="Add a tag"
                                        />
                                        <button
                                            onClick={handleAddTag}
                                            className="px-4 py-2 bg-cyan-500 rounded-lg hover:bg-cyan-600 transition-colors"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-3 py-1 bg-white/10 rounded-full text-sm flex items-center gap-2"
                                            >
                                                {tag}
                                                <button
                                                    onClick={() => handleRemoveTag(tag)}
                                                    className="hover:text-red-400"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Published Toggle */}
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="published"
                                        checked={formData.published}
                                        onChange={(e) =>
                                            setFormData({ ...formData, published: e.target.checked })
                                        }
                                        className="w-5 h-5"
                                    />
                                    <label htmlFor="published" className="text-sm font-medium">
                                        Publish immediately
                                    </label>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                                    >
                                        <Save className="w-4 h-4" />
                                        {saving ? "Saving..." : editingPost ? "Update Post" : "Create Post"}
                                    </button>
                                    <button
                                        onClick={resetForm}
                                        className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
