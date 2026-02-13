import { useEffect, useRef } from "react";

export default function OptimizedCustomCursor() {
    const cursorDotRef = useRef(null);
    const cursorRingRef = useRef(null);
    const mousePos = useRef({ x: 0, y: 0 });
    const cursorPos = useRef({ x: 0, y: 0 });
    const isHovering = useRef(false);

    useEffect(() => {
        // Check if mobile
        if ("ontouchstart" in window) return;

        const cursorDot = cursorDotRef.current;
        const cursorRing = cursorRingRef.current;
        if (!cursorDot || !cursorRing) return;

        // Update mouse position (no state, just ref)
        const handleMouseMove = (e) => {
            mousePos.current = { x: e.clientX, y: e.clientY };
        };

        // Detect hoverable elements
        const handleMouseOver = (e) => {
            const target = e.target;
            if (
                target.tagName === "A" ||
                target.tagName === "BUTTON" ||
                target.closest("a") ||
                target.closest("button") ||
                target.classList.contains("cursor-pointer")
            ) {
                isHovering.current = true;
            } else {
                isHovering.current = false;
            }
        };

        // Smooth animation loop using RAF
        let rafId;
        const animate = () => {
            // Smooth follow with easing
            const ease = 0.15;
            cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * ease;
            cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * ease;

            // Update cursor dot (instant)
            cursorDot.style.transform = `translate(${mousePos.current.x}px, ${mousePos.current.y}px)`;

            // Update cursor ring (smooth follow)
            cursorRing.style.transform = `translate(${cursorPos.current.x}px, ${cursorPos.current.y}px) scale(${isHovering.current ? 1.5 : 1})`;

            rafId = requestAnimationFrame(animate);
        };

        window.addEventListener("mousemove", handleMouseMove, { passive: true });
        window.addEventListener("mouseover", handleMouseOver, { passive: true });
        animate();

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseover", handleMouseOver);
            cancelAnimationFrame(rafId);
        };
    }, []);

    // Hide on mobile
    if (typeof window !== "undefined" && "ontouchstart" in window) return null;

    return (
        <>
            {/* Cursor Dot - Instant follow */}
            <div
                ref={cursorDotRef}
                className="fixed top-0 left-0 w-2 h-2 bg-cyan-400 rounded-full pointer-events-none z-[10001] -translate-x-1/2 -translate-y-1/2"
                style={{ willChange: "transform" }}
            />

            {/* Cursor Ring - Smooth follow */}
            <div
                ref={cursorRingRef}
                className="fixed top-0 left-0 w-8 h-8 border-2 border-cyan-400/40 rounded-full pointer-events-none z-[10000] -translate-x-1/2 -translate-y-1/2 transition-all duration-200"
                style={{ willChange: "transform" }}
            />
        </>
    );
}
