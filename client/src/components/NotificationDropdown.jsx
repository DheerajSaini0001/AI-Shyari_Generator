
import { useState, useEffect, useRef } from "react";
import { Bell, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function NotificationDropdown() {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Fetch notifications
    const fetchNotifications = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notifications`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setNotifications(data);
                setUnreadCount(data.filter(n => !n.isRead).length);
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Poll for notifications every 30 seconds
    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const markAsRead = async (id) => {
        const token = localStorage.getItem("token");
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/${id}/read`, {
                method: "PUT",
                headers: { "Authorization": `Bearer ${token}` }
            });
            // Update local state
            setNotifications(notifications.map(n =>
                n._id === id ? { ...n, isRead: true } : n
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error(error);
        }
    };

    const markAllAsRead = async () => {
        const token = localStorage.getItem("token");
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/read-all`, {
                method: "PUT",
                headers: { "Authorization": `Bearer ${token}` }
            });
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error(error);
        }
    };

    const toggleDropdown = () => {
        const newState = !isOpen;
        setIsOpen(newState);

        if (newState && unreadCount > 0) {
            markAllAsRead();
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors relative"
                title="Notifications"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white border-2 border-black">
                        {unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-80 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50 ring-1 ring-black/5"
                    >
                        <div className="p-3 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50 backdrop-blur-sm">
                            <h3 className="font-semibold text-sm text-zinc-200">Notifications</h3>
                            <button onClick={fetchNotifications} className="text-xs text-blue-400 hover:text-blue-300">Refresh</button>
                        </div>

                        <div className="max-h-[300px] overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-zinc-500 text-sm">
                                    No notifications yet.
                                </div>
                            ) : (
                                notifications.map(notif => (
                                    <div
                                        key={notif._id}
                                        className={`p-4 border-b border-zinc-800/50 hover:bg-zinc-800/50 transition-colors flex gap-3 ${!notif.isRead ? 'bg-zinc-800/30' : ''}`}
                                    >
                                        <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${notif.type === 'success' ? 'bg-green-500' :
                                            notif.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                                            }`} />

                                        <div className="flex-1">
                                            <p className="text-sm text-zinc-300 mb-1">{notif.message}</p>
                                            <span className="text-xs text-zinc-600">
                                                {new Date(notif.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>

                                        {!notif.isRead && (
                                            <button
                                                onClick={() => markAsRead(notif._id)}
                                                className="text-zinc-500 hover:text-white"
                                                title="Mark as read"
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
