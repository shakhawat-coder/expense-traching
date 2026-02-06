"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const email = searchParams.get("email");

    const [otp, setOtp] = useState("");
    const [emailState, setEmailState] = useState(email || "");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (email) {
            setEmailState(email);
        }
    }, [email]);

    const handleVerify = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (otp.length !== 6) {
            setMessage("Please enter a valid 6-digit OTP");
            setStatus("error");
            return;
        }

        setLoading(true);
        setStatus("idle");
        setMessage("");

        try {
            const res = await fetch(`http://localhost:5000/api/auth/verify-email`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: emailState, otp }),
            });
            const data = await res.json();

            if (!res.ok) {
                setStatus("error");
                setMessage(data.message || "Verification failed.");
            } else {
                setStatus("success");
                setMessage(data.message || "Email verified successfully!");
            }
        } catch (err) {
            setStatus("error");
            setMessage("An error occurred during verification.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
                    <CardDescription>
                        {status === "success"
                            ? "Your account is now active"
                            : `Enter the 6-digit code sent to your email`}
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    {status === "success" ? (
                        <div className="flex flex-col items-center">
                            <div className="h-16 w-16 rounded-full bg-green-100 mb-4 flex items-center justify-center">
                                <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="text-lg font-medium text-foreground mb-6">{message}</p>
                            <Button onClick={() => router.push("/signin")} className="w-full h-11">
                                Go to Sign In
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleVerify} className="space-y-4">
                            <div className="flex justify-center flex-col gap-4">
                                {!email && (
                                    <div className="text-left">
                                        <label className="text-sm font-medium mb-1 block">Email Address</label>
                                        <Input
                                            type="email"
                                            placeholder="your@email.com"
                                            value={emailState}
                                            onChange={(e) => setEmailState(e.target.value)}
                                            required
                                            className="h-11"
                                        />
                                    </div>
                                )}
                                <div className="text-left">
                                    <label className="text-sm font-medium mb-1 block">Verification Code</label>
                                    <Input
                                        type="text"
                                        placeholder="000000"
                                        maxLength={6}
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                        className="text-center text-2xl tracking-widest font-mono h-14"
                                    />
                                </div>
                                {message && (
                                    <p className={`text-sm ${status === "error" ? "text-red-500" : "text-muted-foreground"}`}>
                                        {message}
                                    </p>
                                )}
                                <Button type="submit" className="w-full h-11" disabled={loading || otp.length !== 6}>
                                    {loading ? "Verifying..." : "Verify OTP"}
                                </Button>
                            </div>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
            <VerifyEmailContent />
        </Suspense>
    );
}

