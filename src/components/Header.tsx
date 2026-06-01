"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Moon, Sun, Search, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { tools } from "@/lib/tools-registry";

export const Header = () => {
  const [dark, setDark] = useState(false);
  const [q, setQ] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const isDark = saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const match = tools.find(t =>
      t.title.toLowerCase().includes(q.toLowerCase()) ||
      t.keywords.some(k => k.includes(q.toLowerCase()))
    );
    if (match) router.push(`/tools/${match.slug}`);
    else router.push(`/?q=${encodeURIComponent(q)}`);
    setQ("");
  };

  const navClass = (href: string, exact = false) =>
    `px-3 py-2 rounded-md hover:text-primary transition-base ${
      (exact ? pathname === href : pathname.startsWith(href)) ? "text-primary" : "text-muted-foreground"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center gap-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg shrink-0">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary text-primary-foreground shadow-glow">
            <Wrench className="h-5 w-5" />
          </span>
          <span className="hidden sm:inline">Tools<span className="gradient-text">Hub</span></span>
        </Link>

        <form onSubmit={onSearch} className="relative flex-1 max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search 50+ tools..."
            className="pl-9 bg-secondary/50 border-transparent focus-visible:bg-background"
          />
        </form>

        <nav className="hidden md:flex items-center gap-1 text-sm">
          <Link href="/" className={navClass("/", true)}>Home</Link>
          <Link href="/about" className={navClass("/about")}>About</Link>
          <Link href="/contact" className={navClass("/contact")}>Contact</Link>
        </nav>

        <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>
    </header>
  );
};
