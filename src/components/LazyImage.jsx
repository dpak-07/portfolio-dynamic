import { useState, useEffect, useRef, memo } from 'react';
import { motion } from 'framer-motion';

/**
 * LazyImage - Optimized image component with lazy loading and blur-up effect
 * 
 * Features:
 * - Intersection Observer for lazy loading
 * - Blur-up placeholder effect
 * - Automatic fade-in animation
 * - Error handling with fallback
 * - Memoized for performance
 */
const LazyImage = memo(({
    src,
    alt = '',
    className = '',
    placeholderClassName = '',
    onLoad,
    onError,
    threshold = 0.1,
    rootMargin = '50px',
    ...props
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const [hasError, setHasError] = useState(false);
    const imgRef = useRef(null);

    useEffect(() => {
        if (!imgRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            {
                threshold,
                rootMargin,
            }
        );

        observer.observe(imgRef.current);

        return () => {
            observer.disconnect();
        };
    }, [threshold, rootMargin]);

    const handleLoad = (e) => {
        setIsLoaded(true);
        onLoad?.(e);
    };

    const handleError = (e) => {
        setHasError(true);
        onError?.(e);
    };

    return (
        <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
            {/* Placeholder */}
            {!isLoaded && !hasError && (
                <div
                    className={`absolute inset-0 bg-gray-800 animate-pulse ${placeholderClassName}`}
                />
            )}

            {/* Actual Image */}
            {isInView && !hasError && (
                <motion.img
                    src={src}
                    alt={alt}
                    onLoad={handleLoad}
                    onError={handleError}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isLoaded ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={className}
                    loading="lazy"
                    {...props}
                />
            )}

            {/* Error Fallback */}
            {hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-gray-500">
                    <svg
                        className="w-12 h-12"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                </div>
            )}
        </div>
    );
});

LazyImage.displayName = 'LazyImage';

export default LazyImage;
