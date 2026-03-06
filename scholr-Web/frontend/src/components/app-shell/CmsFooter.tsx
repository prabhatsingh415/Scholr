import { cn } from "@/lib/utils";
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import { Link } from "react-router-dom";
type CmsFooterProps = {
    className?: string;
    variant?: "panel" | "login";
};
const footerTone: Record<NonNullable<CmsFooterProps["variant"]>, string> = {
    panel: "border-[#D8DEE8] bg-[#EEF3FA]/82 text-slate-600",
    login: "border-[#BFC7D5]/55 bg-[#E6EBF2]/65 text-slate-700",
};
const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Youtube, href: "#", label: "YouTube" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
];
const footerLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
    { to: "#", label: "Privacy Policy" },
];
const CmsFooter = ({ className, variant = "panel" }: CmsFooterProps) => {
    const year = new Date().getFullYear();
    return (<footer className={cn("border-t backdrop-blur-md", footerTone[variant], className)}>
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3">
        <p className="text-center text-xs font-semibold tracking-[0.01em]">
          Copyright {year} Priyansh | Aditya | Engineering College Baran
        </p>

        <div className="flex items-center gap-2">
          {socialLinks.map(({ icon: Icon, href, label }) => (<a key={label} href={href} aria-label={label} className={cn("inline-flex h-7 w-7 items-center justify-center rounded-md border transition-colors", variant === "panel"
                ? "border-[#C7D1E0] bg-white/45 text-slate-600 hover:bg-white/70"
                : "border-[#B9C2D1] bg-white/35 text-slate-700 hover:bg-white/60")}>
              <Icon className="h-3.5 w-3.5"/>
            </a>))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-medium">
          {footerLinks.map((item, index) => (<div key={item.label} className="flex items-center gap-2">
              {item.to.startsWith("/") ? (<Link to={item.to} className={cn("transition-colors", variant === "panel" ? "text-slate-600 hover:text-slate-800" : "text-slate-700 hover:text-slate-900")}>
                  {item.label}
                </Link>) : (<a href={item.to} className={cn("transition-colors", variant === "panel" ? "text-slate-600 hover:text-slate-800" : "text-slate-700 hover:text-slate-900")}>
                  {item.label}
                </a>)}
              {index < footerLinks.length - 1 && <span className="text-slate-400">|</span>}
            </div>))}
        </div>
        <p className={cn("text-[11px] font-medium", variant === "panel" ? "text-slate-500" : "text-slate-600")}>
          College Management Portal
        </p>
      </div>
    </footer>);
};
export default CmsFooter;
