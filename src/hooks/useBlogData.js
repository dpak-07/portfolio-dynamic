import { useState, useEffect } from "react";
import { fetchFirestoreEntry, readFirestoreCache } from "../utils/firestoreCache";

function normalizeBlogPosts(posts = [], publishedOnly = true) {
    const list = Array.isArray(posts) ? posts.map((post) => ({ ...post })) : [];

    const filtered = publishedOnly
        ? list.filter((post) => post.published === true)
        : list;

    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    return filtered;
}

/**
 * Custom hook to fetch blog posts from Firestore
 * @param {boolean} publishedOnly - If true, only fetch published posts
 * @returns {Object} { posts, loading, error, refetch }
 */
export function useBlogData(publishedOnly = true) {
    const cachedPosts = readFirestoreCache("blog");
    const [posts, setPosts] = useState(() => normalizeBlogPosts(cachedPosts, publishedOnly));
    const [loading, setLoading] = useState(() => cachedPosts === undefined);
    const [error, setError] = useState(null);

    const fetchPosts = async (force = false) => {
        try {
            setError(null);
            const cached = !force ? readFirestoreCache("blog") : undefined;

            if (cached !== undefined) {
                setPosts(normalizeBlogPosts(cached, publishedOnly));
                setLoading(false);
                return;
            }

            setLoading(true);
            const postsData = await fetchFirestoreEntry("blog", undefined, { force });
            setPosts(normalizeBlogPosts(postsData, publishedOnly));
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

    return { posts, loading, error, refetch: () => fetchPosts(true) };
}

/**
 * Custom hook to fetch LinkedIn posts from Firestore
 * @returns {Object} { linkedInData, loading, error, refetch }
 */
export function useLinkedInData() {
    const cachedLinkedIn = readFirestoreCache("linkedin");
    const [linkedInData, setLinkedInData] = useState(() =>
        Array.isArray(cachedLinkedIn) && cachedLinkedIn.length > 0 ? cachedLinkedIn[0] : null
    );
    const [loading, setLoading] = useState(() => cachedLinkedIn === undefined);
    const [error, setError] = useState(null);

    const fetchLinkedInData = async (force = false) => {
        try {
            setError(null);
            const cached = !force ? readFirestoreCache("linkedin") : undefined;

            if (cached !== undefined) {
                setLinkedInData(Array.isArray(cached) && cached.length > 0 ? cached[0] : null);
                setLoading(false);
                return;
            }

            setLoading(true);
            const data = await fetchFirestoreEntry("linkedin", undefined, { force });
            setLinkedInData(Array.isArray(data) && data.length > 0 ? data[0] : null);
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

    return { linkedInData, loading, error, refetch: () => fetchLinkedInData(true) };
}
