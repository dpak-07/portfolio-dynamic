/**
 * Blog utility functions
 */

/**
 * Generate URL-friendly slug from title
 * @param {string} title - Blog post title
 * @returns {string} URL slug
 */
export function generateSlug(title) {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

/**
 * Calculate estimated reading time
 * @param {string} content - HTML content
 * @returns {string} Reading time (e.g., "5 min")
 */
export function calculateReadTime(content) {
    const wordsPerMinute = 200;
    const text = content.replace(/<[^>]*>/g, ""); // Strip HTML tags
    const wordCount = text.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min`;
}

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date
 */
export function formatDate(date) {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export function truncateText(text, maxLength = 150) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
}

/**
 * Validate blog post data
 * @param {Object} post - Blog post object
 * @returns {Object} { valid: boolean, errors: string[] }
 */
export function validateBlogPost(post) {
    const errors = [];

    if (!post.title || post.title.trim().length === 0) {
        errors.push("Title is required");
    }

    if (!post.content || post.content.trim().length === 0) {
        errors.push("Content is required");
    }

    if (!post.author || post.author.trim().length === 0) {
        errors.push("Author is required");
    }

    if (!post.excerpt || post.excerpt.trim().length === 0) {
        errors.push("Excerpt is required");
    }

    if (!post.tags || post.tags.length === 0) {
        errors.push("At least one tag is required");
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}

/**
 * Extract first image from HTML content
 * @param {string} html - HTML content
 * @returns {string|null} Image URL or null
 */
export function extractFirstImage(html) {
    const imgRegex = /<img[^>]+src="([^">]+)"/;
    const match = html.match(imgRegex);
    return match ? match[1] : null;
}

/**
 * Get unique tags from posts array
 * @param {Array} posts - Array of blog posts
 * @returns {Array} Unique tags sorted alphabetically
 */
export function getUniqueTags(posts) {
    const tagsSet = new Set();
    posts.forEach((post) => {
        if (post.tags && Array.isArray(post.tags)) {
            post.tags.forEach((tag) => tagsSet.add(tag));
        }
    });
    return Array.from(tagsSet).sort();
}
