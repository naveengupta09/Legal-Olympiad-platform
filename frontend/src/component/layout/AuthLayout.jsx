import { Outlet, Link } from "react-router-dom";
import { Scale } from "lucide-react";

export default function AuthLayout() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between bg-primary p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{backgroundImage:"radial-gradient(circle at 30% 50%,white 1px,transparent 1px)",backgroundSize:"40px 40px"}} />
        <Link to="/" className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Scale className="w-5 h-5" />
          </div>
          <span className="font-display text-2xl font-bold">Legal Olympiad</span>
        </Link>
        <div className="relative z-10 space-y-6">
          <blockquote className="font-display text-3xl font-medium leading-relaxed">
            "The law is reason, free from passion."
          </blockquote>
          <p className="text-white/70">— Aristotle</p>
        </div>
        <div className="relative z-10 grid grid-cols-3 gap-6">
          {[["12,000+","Students"],["850+","Colleges"],["500+","Competitions"]].map(([n,l])=>(
            <div key={l}>
              <p className="font-display text-3xl font-bold">{n}</p>
              <p className="text-white/60 text-sm">{l}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Right panel */}
      <div className="flex flex-col justify-center items-center p-6 lg:p-12">
        <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
          <Scale className="w-6 h-6 text-primary" />
          <span className="font-display text-xl font-bold">Legal Olympiad</span>
        </Link>
        <div className="w-full max-w-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
}