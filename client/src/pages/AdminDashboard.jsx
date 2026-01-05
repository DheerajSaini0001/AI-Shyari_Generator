
import { useState, useEffect } from "react";
import { Check, X, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import GlassPanel from "../components/GlassPanel";

export default function AdminDashboard() {
    const [pending, setPending] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPending();
    }, []);

    const fetchPending = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:5011/api/community/pending", {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setPending(data);
            }
        } catch (error) {
            console.error("Error fetching pending shayaris:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, action) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:5011/api/community/${action}/${id}`, {
                method: "PUT",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (response.ok) {
                setPending(pending.filter(item => item._id !== id));
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold mb-2 tracking-tight">
                    Admin <span className="gradient-text">Dashboard</span>
                </h1>
                <p className="text-zinc-400">Review pending community submissions.</p>
            </div>

            {loading ? (
                <div className="text-center py-20 text-zinc-500">Loading pending requests...</div>
            ) : pending.length === 0 ? (
                <div className="text-center py-20 glass-panel rounded-2xl border border-white/5 border-dashed">
                    <Check className="w-12 h-12 mx-auto mb-4 text-green-500" />
                    <p className="text-zinc-400">All caught up! No pending requests.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    <AnimatePresence>
                        {pending.map((item) => (
                            <motion.div
                                key={item._id}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                            >
                                <GlassPanel className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs font-bold bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded-md uppercase tracking-wider">
                                                Pending
                                            </span>
                                            <span className="text-zinc-500 text-sm">
                                                from <b className="text-zinc-300">{item.authorName}</b>
                                            </span>
                                        </div>
                                        <p className="text-lg text-yellow-100/90 font-serif whitespace-pre-line">
                                            {item.text}
                                        </p>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleAction(item._id, "approve")}
                                            className="p-3 bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white rounded-full transition-colors border border-green-500/20"
                                            title="Approve"
                                        >
                                            <Check className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleAction(item._id, "reject")}
                                            className="p-3 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-full transition-colors border border-red-500/20"
                                            title="Reject"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </GlassPanel>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
