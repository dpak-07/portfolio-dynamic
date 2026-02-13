import { useState } from "react";
import { motion } from "framer-motion";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { useLinkedInData } from "../../hooks/useBlogData";
import { Plus, Edit, Trash2, Save, X, RefreshCw, Linkedin } from "lucide-react";

export default function LinkedInEditor() {
    const { linkedInData, loading, refetch } = useLinkedInData();
    const [isEditing, setIsEditing] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [profileData, setProfileData] = useState({
        profileName: linkedInData?.profileName || "Deepak S",
        profileUrl: linkedInData?.profileUrl || "https://linkedin.com/in/deepak-saminathan",
        profileImage: linkedInData?.profileImage || "",
    });
    const [postData, setPostData] = useState({
        content: "",
        image: "",
        link: "",
        date: new Date().toISOString().split("T")[0],
        likes: 0,
        comments: 0,
    });
    const [saving, setSaving] = useState(false);

    const posts = linkedInData?.posts || [];

    const handleEditPost = (post, index) => {
        setPostData(post);
        setEditingIndex(index);
        setIsEditing(true);
    };

    const handleSavePost = async () => {
        setSaving(true);
        try {
            const updatedPosts = [...posts];
            if (editingIndex !== null) {
                updatedPosts[editingIndex] = { ...postData, id: postData.id || `post${Date.now()}` };
            } else {
                updatedPosts.push({ ...postData, id: `post${Date.now()}` });
            }

            await setDoc(doc(db, "linkedin", "posts"), {
                ...profileData,
                posts: updatedPosts,
                updatedAt: serverTimestamp(),
            });

            await refetch();
            resetForm();
        } catch (error) {
            console.error("Error saving post:", error);
            alert("Error saving post: " + error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDeletePost = async (index) => {
        if (!confirm("Delete this LinkedIn post?")) return;

        try {
            const updatedPosts = posts.filter((_, i) => i !== index);
            await setDoc(doc(db, "linkedin", "posts"), {
                ...profileData,
                posts: updatedPosts,
                updatedAt: serverTimestamp(),
            });
            await refetch();
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    const handleSaveProfile = async () => {
        setSaving(true);
        try {
            await setDoc(doc(db, "linkedin", "posts"), {
                ...profileData,
                posts,
                updatedAt: serverTimestamp(),
            });
            await refetch();
            alert("Profile updated!");
        } catch (error) {
            console.error("Error saving profile:", error);
            alert("Error saving profile: " + error.message);
        } finally {
            setSaving(false);
        }
    };

    const resetForm = () => {
        setPostData({
            content: "",
            image: "",
            link: "",
            date: new Date().toISOString().split("T")[0],
            likes: 0,
            comments: 0,
        });
        setEditingIndex(null);
        setIsEditing(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white p-6">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                        <Linkedin className="w-8 h-8 text-[#0A66C2]" />
                        <div>
                            <h1 className="text-3xl font-bold">LinkedIn Posts Manager</h1>
                            <p className="text-gray-400 mt-1">{posts.length} posts</p>
                        </div>
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
                            className="flex items-center gap-2 px-4 py-2 bg-[#0A66C2] hover:bg-[#004182] rounded-lg font-semibold transition-all"
                        >
                            <Plus className="w-4 h-4" />
                            New Post
                        </button>
                    </div>
                </div>

                {/* Profile Settings */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-6">
                    <h2 className="text-xl font-bold mb-4">Profile Settings</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Profile Name</label>
                            <input
                                type="text"
                                value={profileData.profileName}
                                onChange={(e) => setProfileData({ ...profileData, profileName: e.target.value })}
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-cyan-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Profile URL</label>
                            <input
                                type="text"
                                value={profileData.profileUrl}
                                onChange={(e) => setProfileData({ ...profileData, profileUrl: e.target.value })}
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-cyan-500"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2">Profile Image URL</label>
                            <input
                                type="text"
                                value={profileData.profileImage}
                                onChange={(e) => setProfileData({ ...profileData, profileImage: e.target.value })}
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-cyan-500"
                            />
                        </div>
                    </div>
                    <button
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className="mt-4 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors disabled:opacity-50"
                    >
                        Save Profile
                    </button>
                </div>

                {/* Posts List or Editor */}
                {!isEditing ? (
                    <div className="space-y-4">
                        {posts.map((post, index) => (
                            <motion.div
                                key={post.id || index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <p className="text-white mb-3">{post.content}</p>
                                        {post.image && (
                                            <img src={post.image} alt="Post" className="w-full h-32 object-cover rounded-lg mb-3" />
                                        )}
                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            <span>{post.date}</span>
                                            <span>{post.likes} likes</span>
                                            <span>{post.comments} comments</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEditPost(post, index)}
                                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeletePost(index)}
                                            className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">{editingIndex !== null ? "Edit Post" : "New Post"}</h2>
                            <button onClick={resetForm} className="p-2 hover:bg-white/10 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Content *</label>
                                <textarea
                                    value={postData.content}
                                    onChange={(e) => setPostData({ ...postData, content: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-cyan-500"
                                    placeholder="What's on your mind?"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Image URL</label>
                                <input
                                    type="text"
                                    value={postData.image}
                                    onChange={(e) => setPostData({ ...postData, image: e.target.value })}
                                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-cyan-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">LinkedIn Post URL</label>
                                <input
                                    type="text"
                                    value={postData.link}
                                    onChange={(e) => setPostData({ ...postData, link: e.target.value })}
                                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-cyan-500"
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Date</label>
                                    <input
                                        type="date"
                                        value={postData.date}
                                        onChange={(e) => setPostData({ ...postData, date: e.target.value })}
                                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-cyan-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Likes</label>
                                    <input
                                        type="number"
                                        value={postData.likes}
                                        onChange={(e) => setPostData({ ...postData, likes: parseInt(e.target.value) || 0 })}
                                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-cyan-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Comments</label>
                                    <input
                                        type="number"
                                        value={postData.comments}
                                        onChange={(e) => setPostData({ ...postData, comments: parseInt(e.target.value) || 0 })}
                                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-cyan-500"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={handleSavePost}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-6 py-3 bg-[#0A66C2] hover:bg-[#004182] rounded-lg font-semibold transition-all disabled:opacity-50"
                                >
                                    <Save className="w-4 h-4" />
                                    {saving ? "Saving..." : editingIndex !== null ? "Update Post" : "Create Post"}
                                </button>
                                <button
                                    onClick={resetForm}
                                    className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
