import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Moon, Sun, Search, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { tools } from "@/lib/tools-registry";

export const Header = () => {
  const [dark, setDark] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

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
    if (match) navigate(`/tools/${match.slug}`);
    else navigate(`/?q=${encodeURIComponent(q)}`);
    setQ("");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center gap-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg shrink-0">
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
          <NavLink to="/" className={({isActive}) => `px-3 py-2 rounded-md hover:text-primary transition-base ${isActive ? "text-primary" : "text-muted-foreground"}`} end>Home</NavLink>
          <NavLink to="/about" className={({isActive}) => `px-3 py-2 rounded-md hover:text-primary transition-base ${isActive ? "text-primary" : "text-muted-foreground"}`}>About</NavLink>
          <NavLink to="/contact" className={({isActive}) => `px-3 py-2 rounded-md hover:text-primary transition-base ${isActive ? "text-primary" : "text-muted-foreground"}`}>Contact</NavLink>
        </nav>

        <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>
    </header>
  );
};
