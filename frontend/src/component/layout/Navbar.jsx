import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Scale, Bell, Moon, Sun, Menu, X, ChevronDown, LogOut, User, LayoutDashboard, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/authStore";
import { useUiStore } from "@/store/uiStore";
import { useNotificationStore } from "@/store/notificationStore";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/competitions", label: "Competitions" },
  { to: "/rankings",     label: "Rankings" },
  { to: "/colleges",     label: "Colleges" },
  { to: "/webinars",     label: "Webinars" },
  { to: "/courses",      label: "Courses" },
  { to: "/podcasts",     label: "Podcasts" },
  { to: "/blogs",        label: "Blogs" },
];

export default function Navbar() {
  const { user, logout, isLoggedIn } = useAuthStore();
  const { theme, toggleTheme } = useUiStore();
  const { unreadCount } = useNotificationStore();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const initials = user?.name?.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/85 backdrop-blur-xl shadow-sm shadow-primary/5 supports-[backdrop-filter]:bg-background/70">
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/25 ring-1 ring-primary/20 transition-transform group-hover:scale-105">
            <Scale className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-display text-xl hidden sm:block tracking-tight">
            Legal <span className="text-gradient-gold italic">Olympiad</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV.map(({ to, label }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) => cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive ? "text-primary bg-primary/10 font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
              )}>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="shrink-0">
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>

          {isLoggedIn() ? (
            <>
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative" onClick={() => navigate("/dashboard")}>
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Button>

              {/* Profile dropdown */}
              <div className="relative">
                <button onClick={() => setProfileOpen(o => !o)}
                  className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-muted transition-colors">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="text-xs bg-primary text-primary-foreground">{initials}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium hidden md:block max-w-[100px] truncate">{user?.name?.split(" ")[0]}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground hidden md:block" />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-border bg-popover shadow-lg overflow-hidden animate-scale-in z-50">
                    <div className="px-4 py-3 border-b border-border">
                      <p className="text-sm font-semibold truncate">{user?.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                    </div>
                    {[
                      { icon: LayoutDashboard, label: "Dashboard", to: "/dashboard" },
                      { icon: User,            label: "Profile",   to: "/profile"   },
                      { icon: Trophy,          label: "My Rank",   to: "/rankings"  },
                    ].map(({ icon: Icon, label, to }) => (
                      <Link key={to} to={to} onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors">
                        <Icon className="w-4 h-4 text-muted-foreground" />{label}
                      </Link>
                    ))}
                    <button onClick={() => { logout(); setProfileOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors border-t border-border">
                      <LogOut className="w-4 h-4" />Log out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild><Link to="/login">Log in</Link></Button>
              <Button size="sm" asChild><Link to="/register">Get started</Link></Button>
            </div>
          )}

          {/* Mobile hamburger */}
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(o => !o)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-background animate-fade-in">
          <nav className="container py-4 space-y-1">
            {NAV.map(({ to, label }) => (
              <NavLink key={to} to={to} onClick={() => setMobileOpen(false)}
                className={({ isActive }) => cn(
                  "block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive ? "text-primary bg-primary/8" : "text-muted-foreground hover:bg-muted"
                )}>
                {label}
              </NavLink>
            ))}
            {!isLoggedIn() && (
              <div className="pt-2 flex flex-col gap-2">
                <Button variant="outline" asChild className="w-full"><Link to="/login" onClick={() => setMobileOpen(false)}>Log in</Link></Button>
                <Button asChild className="w-full"><Link to="/register" onClick={() => setMobileOpen(false)}>Get started</Link></Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}