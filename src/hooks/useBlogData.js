import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Custom hook to fetch blog posts from Firestore
 * @param {boolean} publishedOnly - If true, only fetch published posts
 * @returns {Object} { posts, loading, error, refetch }
 */
export function useBlogData(publishedOnly = true) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            setError(null);

            const blogRef = collection(db, "blog");

            // Fetch all posts and filter in-memory to avoid composite index
            const snapshot = await getDocs(blogRef);
            let postsData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            // Filter by published status if needed
            if (publishedOnly) {
                postsData = postsData.filter(post => post.published === true);
            }

            // Sort by date (newest first)
            postsData.sort((a, b) => new Date(b.date) - new Date(a.date));

            setPosts(postsData);
        } catch (err) {
            console.error("Error fetching blog posts:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [publishedOnly]);

    return { posts, loading, error, refetch: fetchPosts };
}

/**
 * Custom hook to fetch LinkedIn posts from Firestore
 * @returns {Object} { linkedInData, loading, error, refetch }
 */
export function useLinkedInData() {
    const [linkedInData, setLinkedInData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchLinkedInData = async () => {
        try {
            setLoading(true);
            setError(null);

            const linkedInRef = collection(db, "linkedin");
            const snapshot = await getDocs(linkedInRef);

            if (!snapshot.empty) {
                const data = snapshot.docs[0].data();
                setLinkedInData(data);
            }
        } catch (err) {
            console.error("Error fetching LinkedIn data:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLinkedInData();
    }, []);

    return { linkedInData, loading, error, refetch: fetchLinkedInData };
}
