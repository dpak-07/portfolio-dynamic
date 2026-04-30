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
    title = "Deepak Saminathan | Full Stack Developer, AI/ML & Cloud Engineer",
    description = "Portfolio of Deepak Saminathan, a Chennai-based Full Stack Developer and AI & Data Science student skilled in React, Next.js, Node.js, Python, AWS, Docker, MongoDB, SQL, Flutter, and AI/ML.",
    keywords = "Deepak Saminathan, Deepak S, Full Stack Developer, React Developer, Next.js Developer, Node.js Developer, Backend Developer Intern, MERN Stack, Python Developer, AI ML Engineer, Machine Learning, AWS Cloud, Docker, MongoDB, MySQL, PostgreSQL, Flutter Developer, React Native, Chennai, Velammal Engineering College",
    image = "https://deepakportfolio-0607.web.app/preview.png",
    url,
    type = "website",
}) {
    const resolvedUrl =
        url || (typeof window !== "undefined" ? window.location.href : "https://deepakportfolio-0607.web.app/");

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
        updateMetaTag('meta[name="author"]', "Deepak Saminathan");
        updateMetaTag('meta[name="robots"]', "index, follow, max-image-preview:large");
        updateMetaTag('meta[name="candidate"]', "Deepak Saminathan");
        updateMetaTag('meta[name="job-title"]', "Full Stack Developer, Backend Developer Intern, AI/ML Developer");
        updateMetaTag('meta[name="skills"]', "React, Next.js, Node.js, Express.js, Python, JavaScript, TypeScript, AWS, Docker, MongoDB, MySQL, PostgreSQL, TensorFlow, PyTorch, OpenCV, Flutter, React Native");
        updateMetaTag('meta[name="location"]', "Chennai, India");
        updateMetaTag('meta[name="education"]', "AI and Data Science, Velammal Engineering College");

        // Open Graph tags
        updateMetaTag('meta[property="og:title"]', title);
        updateMetaTag('meta[property="og:description"]', description);
        updateMetaTag('meta[property="og:image"]', image);
        updateMetaTag('meta[property="og:url"]', resolvedUrl);
        updateMetaTag('meta[property="og:type"]', type);
        updateMetaTag('meta[property="og:site_name"]', "Deepak Saminathan Portfolio");

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
        canonical.setAttribute("href", resolvedUrl);

        let llms = document.querySelector('link[rel="alternate"][type="text/plain"]');
        if (!llms) {
            llms = document.createElement("link");
            llms.setAttribute("rel", "alternate");
            llms.setAttribute("type", "text/plain");
            llms.setAttribute("title", "AI recruiter profile");
            document.head.appendChild(llms);
        }
        llms.setAttribute("href", "/llms.txt");
    }, [title, description, keywords, image, resolvedUrl, type]);

    return null;
}
