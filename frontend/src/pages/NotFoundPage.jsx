import { Link } from "react-router-dom";
import { Scale, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
        <Scale className="w-8 h-8 text-primary" />
      </div>
      <div className="space-y-2">
        <h1 className="font-display text-8xl font-bold text-primary/20">404</h1>
        <h2 className="font-display text-2xl font-bold">Page not found</h2>
        <p className="text-muted-foreground max-w-sm">The page you're looking for doesn't exist or has been moved.</p>
      </div>
      <Button asChild><Link to="/"><ArrowLeft className="w-4 h-4"/>Back to homepage</Link></Button>
    </div>
  );
}