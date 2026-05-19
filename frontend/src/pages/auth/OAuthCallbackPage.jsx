import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    const params = new URLSearchParams(hash);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("accessToken", token);
      hydrate().then(() => navigate("/dashboard", { replace: true }));
    } else {
      navigate("/login?error=oauth", { replace: true });
    }
  }, [hydrate, navigate]);

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Completing sign in…</p>
    </div>
  );
}
