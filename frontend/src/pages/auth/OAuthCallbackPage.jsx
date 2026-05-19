import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const TOKEN_STORAGE_KEY = "legal-olympiad.auth.token";

export default function OAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Signing you in...");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setMessage("OAuth sign-in failed. Redirecting to login...");
      window.setTimeout(() => {
        window.location.replace("/login?error=oauth");
      }, 1200);
      return;
    }

    window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
    setMessage("Authentication complete. Redirecting to your dashboard...");
    window.setTimeout(() => {
      window.location.replace("/dashboard");
    }, 600);
  }, [searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 text-center shadow-lg">
        <div className="mx-auto mb-4 h-12 w-12 animate-pulse rounded-full bg-primary/10" />
        <h1 className="text-2xl font-semibold">Completing sign in</h1>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}