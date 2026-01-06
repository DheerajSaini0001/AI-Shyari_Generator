import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react";

export default function VerifyEmail() {
    const { token } = useParams();
    const [status, setStatus] = useState("verifying");

    useEffect(() => {
        const verify = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify-email`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ token }),
                });

                if (response.ok) {
                    setStatus("success");
                } else {
                    setStatus("error");
                }
            } catch (err) {
                setStatus("error");
            }
        };
        verify();
    }, [token]);

    return (
        <div className="mx-2 min-h-screen flex items-center justify-center bg-black/90 p-4 font-sans text-center">
            <div className="glass-panel p-8 rounded-2xl w-full max-w-sm">
                {status === "verifying" && (
                    <p className="text-yellow-500 text-xl animate-pulse">Verifying your email...</p>
                )}

                {status === "success" && (
                    <div className="space-y-4">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                        <h2 className="text-2xl font-bold text-white">Email Verified!</h2>
                        <p className="text-zinc-400">Your account is now active.</p>
                        <Link to="/" className="inline-block bg-yellow-500 text-black px-6 py-2 rounded-lg font-bold hover:bg-yellow-400">
                            Login Now
                        </Link>
                    </div>
                )}

                {status === "error" && (
                    <div className="space-y-4">
                        <XCircle className="w-16 h-16 text-red-500 mx-auto" />
                        <h2 className="text-2xl font-bold text-white">Verification Failed</h2>
                        <p className="text-zinc-400">Invalid or expired token.</p>
                        <Link to="/" className="inline-block bg-zinc-700 text-white px-6 py-2 rounded-lg font-bold hover:bg-zinc-600">
                            Go to Login
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
