import { Component } from "react";
import { motion } from "framer-motion";

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Error caught by boundary:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-2xl w-full bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl"
                    >
                        {/* Error Icon */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="w-20 h-20 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center"
                        >
                            <svg
                                className="w-10 h-10 text-red-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                        </motion.div>

                        {/* Error Message */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-center"
                        >
                            <h1 className="text-3xl font-bold text-white mb-4">
                                Oops! Something went wrong
                            </h1>
                            <p className="text-white/70 mb-6">
                                We encountered an unexpected error. Don't worry, we've logged it and will fix it soon.
                            </p>

                            {/* Error Details (Development Only) */}
                            {import.meta.env.DEV && this.state.error && (
                                <details className="text-left mb-6 bg-black/20 rounded-lg p-4 border border-white/5">
                                    <summary className="cursor-pointer text-white/80 font-semibold mb-2">
                                        Error Details (Dev Mode)
                                    </summary>
                                    <pre className="text-xs text-red-300 overflow-auto max-h-40">
                                        {this.state.error.toString()}
                                        {this.state.errorInfo?.componentStack}
                                    </pre>
                                </details>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-4 justify-center">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => window.location.reload()}
                                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-cyan-500/50 transition-all"
                                >
                                    Reload Page
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => (window.location.href = "/")}
                                    className="px-6 py-3 bg-white/10 text-white rounded-lg font-semibold border border-white/20 hover:bg-white/20 transition-all"
                                >
                                    Go Home
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
