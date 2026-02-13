import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function GlobalBackgroundEffects() {
    const canvasRef = useRef(null);
    const mousePositionRef = useRef({ x: 0, y: 0 });
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    // Mouse tracking for interactive effects
    useEffect(() => {
        const handleMouseMove = (e) => {
            mousePositionRef.current = { x: e.clientX, y: e.clientY };
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    // Enhanced particle system
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const particleCount = Math.min(200, Math.floor((canvas.width * canvas.height) / 8000));

        class Particle {
            constructor() {
                this.reset();
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
            }

            update(mouseX, mouseY) {
                // Mouse interaction - particles move away from cursor
                const dx = this.x - mouseX;
                const dy = this.y - mouseY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    const force = (150 - distance) / 150;
                    this.vx += (dx / distance) * force * 0.5;
                    this.vy += (dy / distance) * force * 0.5;
                }

                // Apply velocity
                this.x += this.vx;
                this.y += this.vy;

                // Damping
                this.vx *= 0.98;
                this.vy *= 0.98;

                // Boundaries
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

                // Keep in bounds
                this.x = Math.max(0, Math.min(canvas.width, this.x));
                this.y = Math.max(0, Math.min(canvas.height, this.y));
            }

            draw() {
                ctx.fillStyle = "rgba(6, 182, 212, 0.6)";
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Initialize particles
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        let animationId;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update and draw particles using ref to avoid re-renders
            particles.forEach((particle) => {
                particle.update(mousePositionRef.current.x, mousePositionRef.current.y);
                particle.draw();
            });

            // Draw connections
            particles.forEach((p1, i) => {
                particles.slice(i + 1).forEach((p2) => {
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 120) {
                        ctx.strokeStyle = `rgba(6, 182, 212, ${0.2 * (1 - distance / 120)})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                });
            });

            animationId = requestAnimationFrame(animate);
        };

        animate();

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener("resize", handleResize);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-0">
            {/* Particle Canvas */}
            <canvas
                ref={canvasRef}
                className="fixed inset-0 pointer-events-none z-0"
                style={{ opacity: 0.5 }}
            />

            {/* Animated Gradient Orbs - Now react to mouse */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Main Orbs */}
                <motion.div
                    animate={{
                        x: [0, 100, 0],
                        y: [0, -100, 0],
                        scale: [1, 1.2, 1],
                        opacity: [0.15, 0.25, 0.15],
                    }}
                    style={{
                        x: mousePosition.x * 0.02,
                        y: mousePosition.y * 0.02,
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-0 left-0 w-[600px] h-[600px] bg-cyan-500 rounded-full blur-[120px]"
                />

                <motion.div
                    animate={{
                        x: [0, -100, 0],
                        y: [0, 100, 0],
                        scale: [1, 1.3, 1],
                        opacity: [0.15, 0.3, 0.15],
                    }}
                    style={{
                        x: -mousePosition.x * 0.02,
                        y: -mousePosition.y * 0.02,
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-purple-500 rounded-full blur-[130px]"
                />

                {/* Accent Orbs */}
                <motion.div
                    animate={{
                        x: [0, -80, 0],
                        y: [0, 80, 0],
                        scale: [1, 1.25, 1],
                        opacity: [0.1, 0.15, 0.1],
                    }}
                    style={{
                        x: mousePosition.x * 0.015,
                        y: -mousePosition.y * 0.015,
                    }}
                    transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-500 rounded-full blur-[90px]"
                />

                <motion.div
                    animate={{
                        x: [0, 60, 0],
                        y: [0, -60, 0],
                        scale: [1, 1.15, 1],
                        opacity: [0.1, 0.2, 0.1],
                    }}
                    style={{
                        x: -mousePosition.x * 0.01,
                        y: mousePosition.y * 0.01,
                    }}
                    transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 3 }}
                    className="absolute bottom-1/3 left-1/3 w-[500px] h-[500px] bg-blue-500 rounded-full blur-[100px]"
                />

                <motion.div
                    animate={{
                        x: [0, -50, 0],
                        y: [0, -50, 0],
                        scale: [1, 1.2, 1],
                        opacity: [0.08, 0.15, 0.08],
                    }}
                    style={{
                        x: mousePosition.x * 0.025,
                        y: mousePosition.y * 0.025,
                    }}
                    transition={{ duration: 24, repeat: Infinity, ease: "easeInOut", delay: 4 }}
                    className="absolute top-1/2 left-1/2 w-[450px] h-[450px] bg-pink-500 rounded-full blur-[110px]"
                />
            </div>

            {/* Mouse Glow Effect */}
            <motion.div
                className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
                style={{
                    left: mousePosition.x,
                    top: mousePosition.y,
                    transform: "translate(-50%, -50%)",
                    background: "radial-gradient(circle, rgba(6, 182, 212, 0.2) 0%, transparent 70%)",
                }}
                animate={{
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Grid Overlay */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(6, 182, 212, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.03) 1px, transparent 1px)
          `,
                    backgroundSize: "50px 50px",
                    opacity: 0.3,
                }}
            />

            {/* Animated Gradient Overlay */}
            <motion.div
                className="absolute inset-0"
                animate={{
                    background: [
                        "radial-gradient(circle at 20% 50%, rgba(6, 182, 212, 0.05) 0%, transparent 50%)",
                        "radial-gradient(circle at 80% 50%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)",
                        "radial-gradient(circle at 50% 80%, rgba(236, 72, 153, 0.05) 0%, transparent 50%)",
                        "radial-gradient(circle at 20% 50%, rgba(6, 182, 212, 0.05) 0%, transparent 50%)",
                    ],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear",
                }}
            />
        </div>
    );
}
