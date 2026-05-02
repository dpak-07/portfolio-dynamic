import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    collection,
    addDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import { uploadImage } from "../../utils/supabaseStorage";
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
    Upload,
    ImagePlus,
    ClipboardPaste,
} from "lucide-react";

const EMPTY_FORM = {
    title: "",
    author: "Deepak",
    excerpt: "",
    content: "",
    cover: "",
    tags: [],
    published: false,
};

const SAMPLE_PASTE = `[
  {
    title: "My Blog Title",
    slug: "my-blog-title",
    author: "Deepak S",
    date: "2026-05-02",
    readTime: "5 min",
    tags: ["Journey", "Portfolio"],
    cover: "https://example.com/cover.jpg",
    excerpt: "Short summary for the blog card.",
    content: \`<h2>Heading</h2><p>Your story goes here.</p>\`,
    published: true,
  },
]`;

export default function BlogEditor() {
    const { posts, loading, refetch } = useBlogData(false); // Get all posts including drafts
    const [isEditing, setIsEditing] = useState(false);
    const [showPasteImport, setShowPasteImport] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [tagInput, setTagInput] = useState("");
    const [errors, setErrors] = useState([]);
    const [saving, setSaving] = useState(false);
    const [importing, setImporting] = useState(false);
    const [importStatus, setImportStatus] = useState("");
    const [pasteValue, setPasteValue] = useState("");
    const [imageUploading, setImageUploading] = useState("");
    const [imageTarget, setImageTarget] = useState(null);
    const fileInputRef = useRef(null);
    const imageInputRef = useRef(null);

    const resetForm = () => {
        setFormData(EMPTY_FORM);
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

    const parsePastedPosts = (text) => {
        const trimmed = text.trim();
        if (!trimmed) {
            throw new Error("Paste your blog array before importing.");
        }

        try {
            return JSON.parse(trimmed);
        } catch {
            try {
                // Admin-only convenience parser for seed.js style pasted arrays.
                // Supports unquoted keys, backtick HTML content, and trailing commas.
                return Function(`"use strict"; return (${trimmed});`)();
            } catch (error) {
                throw new Error(`Could not read pasted data. Use an array like seed.js. ${error.message}`);
            }
        }
    };

    const normalizeImportedPosts = (payload) => {
        if (Array.isArray(payload)) return payload;
        if (Array.isArray(payload?.posts)) return payload.posts;
        if (Array.isArray(payload?.blogPosts)) return payload.blogPosts;
        if (Array.isArray(payload?.blogPostsData)) return payload.blogPostsData;
        throw new Error("Import data must be an array of posts or an object with a posts/blogPosts array.");
    };

    const importPosts = async (payload, sourceLabel = "pasted data") => {
        const importedPosts = normalizeImportedPosts(payload);

        if (importedPosts.length === 0) {
            throw new Error("The import does not contain any blog posts.");
        }

        const validationErrors = [];
        const preparedPosts = importedPosts.map((post, index) => {
            const content = String(post.content || "");
            const title = String(post.title || "").trim();
            const prepared = {
                title,
                slug: post.slug || generateSlug(title),
                author: post.author || "Deepak",
                excerpt: post.excerpt || "",
                content,
                cover: post.cover || "",
                tags: Array.isArray(post.tags)
                    ? post.tags
                    : String(post.tags || "")
                        .split(",")
                        .map((tag) => tag.trim())
                        .filter(Boolean),
                published: Boolean(post.published),
                date: post.date || new Date().toISOString().split("T")[0],
                readTime: post.readTime || calculateReadTime(content),
                likes: Number(post.likes || 0),
                views: Number(post.views || 0),
            };

            const validation = validateBlogPost(prepared);
            if (!prepared.slug) {
                validation.errors.push("Slug could not be generated from the title");
            }

            if (!validation.valid || validation.errors.length > 0) {
                validationErrors.push(`Post ${index + 1}: ${validation.errors.join(", ")}`);
            }

            return prepared;
        });

        if (validationErrors.length > 0) {
            throw new Error(validationErrors.join("\n"));
        }

        for (const post of preparedPosts) {
            await setDoc(doc(db, "blog", post.slug), {
                ...post,
                importedAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
        }

        setImportStatus(`Updated ${preparedPosts.length} blog post${preparedPosts.length === 1 ? "" : "s"} from ${sourceLabel}.`);
        await refetch();
        return preparedPosts.length;
    };

    const handleJsonUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setImporting(true);
        setImportStatus("");
        setErrors([]);

        try {
            const text = await file.text();
            const payload = JSON.parse(text);
            await importPosts(payload, file.name);
        } catch (error) {
            console.error("Error importing blog JSON:", error);
            setErrors(String(error.message || error).split("\n"));
        } finally {
            setImporting(false);
            event.target.value = "";
        }
    };

    const handlePasteImport = async () => {
        setImporting(true);
        setImportStatus("");
        setErrors([]);

        try {
            const payload = parsePastedPosts(pasteValue);
            await importPosts(payload, "pasted seed-style data");
            setPasteValue("");
            setShowPasteImport(false);
        } catch (error) {
            console.error("Error importing pasted blog data:", error);
            setErrors(String(error.message || error).split("\n"));
        } finally {
            setImporting(false);
        }
    };

    const openImagePicker = (target) => {
        setImageTarget(target);
        imageInputRef.current?.click();
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file || !imageTarget) return;

        const targetKey = imageTarget.type === "form" ? "form" : imageTarget.post?.id;
        setImageUploading(targetKey);
        setErrors([]);

        try {
            const imageUrl = await uploadImage(file, "blog");

            if (imageTarget.type === "form") {
                setFormData((current) => ({ ...current, cover: imageUrl }));
                setImportStatus("Cover image uploaded. Save the post to keep it.");
            } else if (imageTarget.post?.id) {
                await updateDoc(doc(db, "blog", imageTarget.post.id), {
                    cover: imageUrl,
                    updatedAt: serverTimestamp(),
                });
                setImportStatus(`Cover image updated for "${imageTarget.post.title}".`);
                await refetch();
            }
        } catch (error) {
            console.error("Image upload error:", error);
            setErrors([error.message || "Image upload failed"]);
        } finally {
            setImageUploading("");
            setImageTarget(null);
            event.target.value = "";
        }
    };

    return (
        <div className="admin-mobile-shell min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 p-2 sm:p-4 md:p-6 text-white overflow-y-auto">
            <div className="w-full max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                            Blog Editor
                        </h1>
                        <p className="text-gray-400 mt-1">
                            Manage your blog posts - {posts.length} total
                        </p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="application/json,.json"
                            onChange={handleJsonUpload}
                            className="hidden"
                        />
                        <input
                            ref={imageInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={importing}
                            className="flex items-center justify-center gap-2 rounded-lg bg-white/10 px-4 py-2 transition-colors hover:bg-white/20 disabled:opacity-50"
                        >
                            <Upload className="w-4 h-4" />
                            {importing ? "Importing..." : "Upload JSON"}
                        </button>
                        <button
                            onClick={() => setShowPasteImport((open) => !open)}
                            disabled={importing}
                            className="flex items-center justify-center gap-2 rounded-lg bg-white/10 px-4 py-2 transition-colors hover:bg-white/20 disabled:opacity-50"
                        >
                            <ClipboardPaste className="w-4 h-4" />
                            Paste Data
                        </button>
                        <button
                            onClick={refetch}
                            disabled={loading}
                            className="flex items-center justify-center gap-2 rounded-lg bg-white/10 px-4 py-2 transition-colors hover:bg-white/20"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                            Refresh
                        </button>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 font-semibold transition-all hover:shadow-lg"
                        >
                            <Plus className="w-4 h-4" />
                            New Post
                        </button>
                    </div>
                </div>

                <AnimatePresence>
                    {showPasteImport && (
                        <motion.section
                            initial={{ opacity: 0, y: -12, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: "auto" }}
                            exit={{ opacity: 0, y: -12, height: 0 }}
                            className="mb-6 overflow-hidden rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 shadow-2xl shadow-cyan-950/20 sm:p-5"
                        >
                            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <h2 className="text-lg font-bold text-cyan-100">Paste seed.js blog data</h2>
                                    <p className="mt-1 text-sm leading-6 text-cyan-100/70">
                                        Paste an array exactly like your selected seed data. Existing slugs are updated, new slugs are created.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setPasteValue(SAMPLE_PASTE)}
                                    className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white/80 transition hover:bg-white/10"
                                >
                                    Add sample
                                </button>
                            </div>

                            <textarea
                                value={pasteValue}
                                onChange={(event) => setPasteValue(event.target.value)}
                                rows={10}
                                spellCheck={false}
                                placeholder={SAMPLE_PASTE}
                                className="min-h-[18rem] w-full rounded-xl border border-white/10 bg-slate-950/80 p-4 font-mono text-sm leading-6 text-cyan-50 outline-none transition placeholder:text-white/25 focus:border-cyan-400"
                            />

                            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                                <button
                                    onClick={handlePasteImport}
                                    disabled={importing || !pasteValue.trim()}
                                    className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-5 py-3 font-semibold transition-all hover:shadow-lg disabled:opacity-50"
                                >
                                    <Save className="w-4 h-4" />
                                    {importing ? "Updating..." : "Update Blog Posts"}
                                </button>
                                <button
                                    onClick={() => setShowPasteImport(false)}
                                    className="rounded-lg bg-white/10 px-5 py-3 transition-colors hover:bg-white/20"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.section>
                    )}
                </AnimatePresence>

                {importStatus && (
                    <div className="mb-5 rounded-lg border border-green-500/40 bg-green-500/15 px-4 py-3 text-sm text-green-300">
                        {importStatus}
                    </div>
                )}

                {!isEditing && errors.length > 0 && (
                    <div className="mb-5 rounded-lg border border-red-500/50 bg-red-500/20 p-4">
                        <ul className="list-disc list-inside text-red-400 text-sm">
                            {errors.map((error, i) => (
                                <li key={i}>{error}</li>
                            ))}
                        </ul>
                    </div>
                )}

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
                                    whileHover={{ y: -3 }}
                                    className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm transition-all hover:border-cyan-400/40 hover:bg-white/10 sm:p-5"
                                >
                                    <div className="flex flex-col gap-4 md:flex-row md:items-start">
                                        <div className="relative h-44 overflow-hidden rounded-xl border border-white/10 bg-slate-900 md:h-32 md:w-52 md:shrink-0">
                                            {post.cover ? (
                                                <img
                                                    src={post.cover}
                                                    alt={post.title}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-sm text-white/35">
                                                    No cover
                                                </div>
                                            )}
                                            <button
                                                onClick={() => openImagePicker({ type: "post", post })}
                                                disabled={imageUploading === post.id}
                                                className="absolute bottom-2 left-2 right-2 flex items-center justify-center gap-2 rounded-lg bg-black/70 px-3 py-2 text-xs font-semibold text-white backdrop-blur transition hover:bg-black/85 disabled:opacity-60"
                                            >
                                                <ImagePlus className="h-4 w-4" />
                                                {imageUploading === post.id ? "Uploading..." : "Upload cover"}
                                            </button>
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="mb-2 flex flex-wrap items-center gap-3">
                                                <h3 className="break-words text-xl font-bold leading-snug">{post.title}</h3>
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs ${post.published
                                                            ? "bg-green-500/20 text-green-400"
                                                            : "bg-yellow-500/20 text-yellow-400"
                                                        }`}
                                                >
                                                    {post.published ? "Published" : "Draft"}
                                                </span>
                                            </div>
                                            <p className="mb-3 text-sm leading-6 text-gray-400">{post.excerpt}</p>
                                            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                                                <span>{post.date}</span>
                                                <span>{post.readTime}</span>
                                                <span>{post.author}</span>
                                                <span>{Number(post.views || 0)} views</span>
                                                <span>{Number(post.likes || 0)} likes</span>
                                                <span>{post.tags?.join(", ")}</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 md:justify-end">
                                            <button
                                                onClick={() => handleTogglePublish(post)}
                                                className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm transition-colors hover:bg-white/10"
                                                title={post.published ? "Unpublish" : "Publish"}
                                            >
                                                {post.published ? (
                                                    <EyeOff className="w-4 h-4" />
                                                ) : (
                                                    <Eye className="w-4 h-4" />
                                                )}
                                                <span className="sm:hidden">{post.published ? "Draft" : "Publish"}</span>
                                            </button>
                                            <button
                                                onClick={() => handleEdit(post)}
                                                className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm transition-colors hover:bg-white/10"
                                                title="Edit"
                                            >
                                                <Edit className="w-4 h-4" />
                                                <span className="sm:hidden">Edit</span>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(post.id)}
                                                className="flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/20"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                <span className="sm:hidden">Delete</span>
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
                            className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm sm:p-6"
                        >
                            <div className="mb-6 flex items-start justify-between gap-3">
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
                                    <div className="grid gap-3 lg:grid-cols-[16rem_1fr]">
                                        <div className="relative h-40 overflow-hidden rounded-xl border border-white/10 bg-slate-900">
                                            {formData.cover ? (
                                                <img
                                                    src={formData.cover}
                                                    alt="Blog cover preview"
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-sm text-white/35">
                                                    Cover preview
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-3">
                                            <input
                                                type="text"
                                                value={formData.cover}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, cover: e.target.value })
                                                }
                                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-cyan-500"
                                                placeholder="https://example.com/image.jpg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => openImagePicker({ type: "form" })}
                                                disabled={imageUploading === "form"}
                                                className="flex w-full items-center justify-center gap-2 rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-4 py-3 font-semibold text-cyan-100 transition hover:bg-cyan-400/20 disabled:opacity-50 sm:w-auto"
                                            >
                                                <ImagePlus className="h-4 w-4" />
                                                {imageUploading === "form" ? "Uploading..." : "Upload Cover Image"}
                                            </button>
                                        </div>
                                    </div>
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
                                    <div className="mb-2 flex flex-col gap-2 sm:flex-row">
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
                                            className="rounded-lg bg-cyan-500 px-4 py-2 transition-colors hover:bg-cyan-600"
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
                                <div className="flex items-start gap-3 sm:items-center">
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
                                <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 font-semibold transition-all hover:shadow-lg disabled:opacity-50"
                                    >
                                        <Save className="w-4 h-4" />
                                        {saving ? "Saving..." : editingPost ? "Update Post" : "Create Post"}
                                    </button>
                                    <button
                                        onClick={resetForm}
                                        className="rounded-lg bg-white/10 px-6 py-3 transition-colors hover:bg-white/20"
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
