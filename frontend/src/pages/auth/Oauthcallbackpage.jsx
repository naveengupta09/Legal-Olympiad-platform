import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import PageLoader from "@/components/shared/PageLoader";
import toast from "react-hot-toast";

export default function OAuthCallbackPage() {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const { hydrate } = useAuthStore();

    useEffect(() => {
        const token = params.get("token");
        const provider = params.get("provider");
        const error = params.get("error");

        if (error) {
            toast.error("Sign-in failed. Please try again.");
            navigate("/login", { replace: true });
            return;
        }

        if (!token) {
            navigate("/login", { replace: true });
            return;
        }

        // Store token and hydrate user
        localStorage.setItem("accessToken", token);
        hydrate().then(() => {
            toast.success(`Signed in with ${provider || "OAuth"} ✅`);
            navigate("/dashboard", { replace: true });
        });
    }, []);

    return <PageLoader />;
}