import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/api/auth.api";

const schema = z.object({ email: z.string().email("Enter a valid email") });

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async ({ email }) => {
    setLoading(true);
    try { await authApi.forgotPassword(email); setSent(true); } finally { setLoading(false); }
  };

  if (sent) return (
    <div className="space-y-4 text-center animate-fade-in">
      <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
      <h2 className="font-display text-2xl font-bold">Check your email</h2>
      <p className="text-muted-foreground text-sm">We've sent a reset link to your email address.</p>
      <Link to="/login" className="text-primary text-sm font-medium hover:underline">Back to sign in</Link>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-1">
        <h1 className="font-display text-3xl font-bold">Forgot password?</h1>
        <p className="text-muted-foreground text-sm">Enter your email and we'll send a reset link.</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@lawschool.edu" {...register("email")} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Sending…</> : "Send reset link"}
        </Button>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        <Link to="/login" className="text-primary font-medium hover:underline">Back to sign in</Link>
      </p>
    </div>
  );
}