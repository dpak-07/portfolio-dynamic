export default function GlobalBackgroundEffects() {
    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <style>{`
                @keyframes bgFloatA {
                    0%, 100% { transform: translate3d(0, 0, 0) scale(1); opacity: 0.12; }
                    50% { transform: translate3d(40px, -30px, 0) scale(1.06); opacity: 0.18; }
                }

                @keyframes bgFloatB {
                    0%, 100% { transform: translate3d(0, 0, 0) scale(1); opacity: 0.10; }
                    50% { transform: translate3d(-35px, 25px, 0) scale(1.08); opacity: 0.16; }
                }

                @keyframes bgFloatC {
                    0%, 100% { transform: translate3d(0, 0, 0) scale(1); opacity: 0.08; }
                    50% { transform: translate3d(25px, 35px, 0) scale(1.04); opacity: 0.13; }
                }
            `}</style>

            <div className="absolute inset-0 overflow-hidden">
                <div
                    className="absolute top-0 left-0 h-[600px] w-[600px] rounded-full bg-cyan-500 blur-[120px]"
                    style={{ animation: "bgFloatA 24s ease-in-out infinite" }}
                />
                <div
                    className="absolute bottom-0 right-0 h-[700px] w-[700px] rounded-full bg-purple-500 blur-[130px]"
                    style={{ animation: "bgFloatB 28s ease-in-out infinite" }}
                />
                <div
                    className="absolute top-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-indigo-500 blur-[90px]"
                    style={{ animation: "bgFloatC 26s ease-in-out infinite" }}
                />
                <div
                    className="absolute bottom-1/3 left-1/3 h-[500px] w-[500px] rounded-full bg-blue-500 blur-[100px]"
                    style={{ animation: "bgFloatA 30s ease-in-out infinite" }}
                />
                <div
                    className="absolute top-1/2 left-1/2 h-[450px] w-[450px] rounded-full bg-pink-500 blur-[110px]"
                    style={{ animation: "bgFloatB 32s ease-in-out infinite" }}
                />
            </div>

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

            <div
                className="absolute inset-0"
                style={{
                    background:
                        "radial-gradient(circle at 20% 50%, rgba(6, 182, 212, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(139, 92, 246, 0.04) 0%, transparent 50%), radial-gradient(circle at 50% 80%, rgba(236, 72, 153, 0.04) 0%, transparent 50%)",
                }}
            />
        </div>
    );
}
