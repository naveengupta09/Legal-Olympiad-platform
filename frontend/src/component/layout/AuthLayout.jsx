import { Outlet, Link } from "react-router-dom";
import { Scale } from "lucide-react";

export default function AuthLayout() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:flex flex-col justify-between p-12 text-primary-foreground relative overflow-hidden bg-[linear-gradient(145deg,oklch(0.32_0.08_260)_0%,oklch(0.24_0.06_260)_55%,oklch(0.18_0.05_260)_100%)]">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 50%, white 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-amber-400/15 blur-3xl" />
        <Link to="/" className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-white/15 ring-1 ring-white/20 flex items-center justify-center backdrop-blur-sm">
            <Scale className="w-5 h-5" />
          </div>
          <span className="font-display text-2xl tracking-tight">
            Legal <span className="italic opacity-90">Olympiad</span>
          </span>
        </Link>
        <div className="relative z-10 space-y-6 max-w-md">
          <blockquote className="font-display text-3xl lg:text-4xl leading-snug">
            &ldquo;The law is reason, free from passion.&rdquo;
          </blockquote>
          <p className="text-white/65 text-sm tracking-wide">— Aristotle</p>
        </div>
        <div className="relative z-10 grid grid-cols-3 gap-6">
          {[
            ["12,000+", "Students"],
            ["850+", "Colleges"],
            ["500+", "Competitions"],
          ].map(([n, l]) => (
            <div key={l} className="rounded-xl bg-white/5 ring-1 ring-white/10 px-4 py-3 backdrop-blur-sm">
              <p className="font-display text-2xl">{n}</p>
              <p className="text-white/55 text-xs mt-0.5">{l}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col justify-center items-center p-6 lg:p-12 bg-hero-mesh">
        <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
          <Scale className="w-6 h-6 text-primary" />
          <span className="font-display text-xl">Legal Olympiad</span>
        </Link>
        <div className="w-full max-w-md glass-panel p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
