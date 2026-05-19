import { Link } from "react-router-dom";
import { Scale, Globe, Linkedin, Instagram, Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const LINKS = {
  Platform: [
    { to: "/competitions", label: "Competitions" },
    { to: "/rankings",     label: "Rankings" },
    { to: "/webinars",     label: "Webinars" },
    { to: "/courses",      label: "Courses" },
  ],
  Resources: [
    { to: "/blogs",    label: "Blogs & Articles" },
    { to: "/podcasts", label: "Podcasts" },
    { to: "/colleges", label: "Colleges" },
  ],
  Legal: [
    { to: "/privacy",  label: "Privacy Policy" },
    { to: "/terms",    label: "Terms of Service" },
    { to: "/contact",  label: "Contact Us" },
  ],
};

const SOCIALS = [
  { icon: Globe,     href: "https://naveengupta.netlify.app/" },
  { icon: Linkedin,  href: "https://www.linkedin.com/in/naveengupta13/" },
  { icon: Instagram, href: "https://www.instagram.com/im.naveengupta?igsh=NjRoNGx4aGtnb2Ix" },
  { icon: Mail,      href: "mailto:hello@legalolympiad.com" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 mt-20">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                <Scale className="w-4 h-4 text-white" />
              </div>
              <span className="font-display text-2xl font-bold">Legal Olympiad</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              India's premier platform for law students to compete, learn, and grow. Bridge the gap between academics and real-world legal practice.
            </p>
            <div className="flex items-center gap-3">
              {SOCIALS.map(({ icon: Icon, href }, i) => (
                <a key={i} href={href} target="_blank" rel="noreferrer"
                  className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary hover:bg-primary/5 transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              <a href="mailto:naveenkumar54111@gmail.com" className="hover:text-foreground">naveenkumar54111@gmail.com</a>
              <span className="mx-2">|</span>
              <a href="mailto:hello@legalolympiad.com" className="hover:text-foreground">hello@legalolympiad.com</a>
            </div>
            </div>

          {/* Link groups */}
          {Object.entries(LINKS).map(([group, items]) => (
            <div key={group} className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">{group}</h4>
              <ul className="space-y-2.5">
                {items.map(({ to, label }) => (
                  <li key={to}>
                    <Link to={to} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Legal Olympiad. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built for India's next generation of legal professionals.
          </p>
        </div>
      </div>
    </footer>
  );
}