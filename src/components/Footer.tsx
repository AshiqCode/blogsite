import { Link } from "react-router-dom";
import { categories } from "@/lib/tools-registry";

export const Footer = () => {
  return (
    <footer className="border-t border-border/60 mt-24 bg-secondary/30">
      <div className="container py-12 grid gap-8 md:grid-cols-4">
        <div>
          <h3 className="font-bold text-lg mb-3">Tools<span className="gradient-text">Hub</span></h3>
          <p className="text-sm text-muted-foreground">50+ free online tools and calculators to make your day easier — fast, private and ad-supported.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">Categories</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {categories.slice(0, 5).map(c => (
              <li key={c.name}><Link to={`/category/${c.name.toLowerCase().replace(/\s+/g, "-")}`} className="hover:text-primary transition-base">{c.name}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-primary">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
            <li><Link to="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
            <li><Link to="/disclaimer" className="hover:text-primary">Disclaimer</Link></li>
          </ul>
        </div>
        {/* <div>
          <h4 className="font-semibold mb-3 text-sm">Resources</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="/sitemap.xml" className="hover:text-primary">Sitemap</a></li>
            <li><a href="/robots.txt" className="hover:text-primary">robots.txt</a></li>
          </ul>
        </div> */}
      </div>
      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} ToolsHub. All tools run in your browser.
      </div>
    </footer>
  );
};
