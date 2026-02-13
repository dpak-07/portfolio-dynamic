import { useEffect } from "react";

/**
 * SEO Component for dynamic meta tags
 * @param {Object} props
 * @param {string} props.title - Page title
 * @param {string} props.description - Page description
 * @param {string} props.keywords - SEO keywords
 * @param {string} props.image - OG image URL
 * @param {string} props.url - Canonical URL
 * @param {string} props.type - OG type (website, article, etc.)
 */
export default function SEO({
    title = "Deepak's Portfolio | Full Stack Developer",
    description = "Full Stack Developer specializing in React, Node.js, and modern web technologies. Explore my projects, skills, and experience.",
    keywords = "full stack developer, react developer, web developer, portfolio, javascript, typescript, node.js",
    image = "/og-image.jpg",
    url = window.location.href,
    type = "website",
}) {
    useEffect(() => {
        // Update document title
        document.title = title;

        // Helper function to update or create meta tags
        const updateMetaTag = (selector, content) => {
            let element = document.querySelector(selector);
            if (!element) {
                element = document.createElement("meta");
                const attribute = selector.includes("property") ? "property" : "name";
                const value = selector.match(/["']([^"']+)["']/)[1];
                element.setAttribute(attribute, value);
                document.head.appendChild(element);
            }
            element.setAttribute("content", content);
        };

        // Standard meta tags
        updateMetaTag('meta[name="description"]', description);
        updateMetaTag('meta[name="keywords"]', keywords);

        // Open Graph tags
        updateMetaTag('meta[property="og:title"]', title);
        updateMetaTag('meta[property="og:description"]', description);
        updateMetaTag('meta[property="og:image"]', image);
        updateMetaTag('meta[property="og:url"]', url);
        updateMetaTag('meta[property="og:type"]', type);

        // Twitter Card tags
        updateMetaTag('meta[name="twitter:card"]', "summary_large_image");
        updateMetaTag('meta[name="twitter:title"]', title);
        updateMetaTag('meta[name="twitter:description"]', description);
        updateMetaTag('meta[name="twitter:image"]', image);

        // Canonical URL
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement("link");
            canonical.setAttribute("rel", "canonical");
            document.head.appendChild(canonical);
        }
        canonical.setAttribute("href", url);
    }, [title, description, keywords, image, url, type]);

    return null;
}
