import { Seo } from "@/components/Seo";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => (
  <>
    <Seo title="Page Not Found – ToolsHub" description="The page you're looking for doesn't exist." path="/404" />
    <div className="container py-24 text-center">
      <div className="text-7xl font-bold gradient-text mb-4">404</div>
      <h1 className="text-2xl font-semibold mb-3">Page not found</h1>
      <p className="text-muted-foreground mb-6">The tool or page you're looking for doesn't exist.</p>
      <Link to="/"><Button>Back to Home</Button></Link>
    </div>
  </>
);

export default NotFound;
