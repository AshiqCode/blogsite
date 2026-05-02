import { Seo } from "@/components/Seo";

interface StaticProps { title: string; description: string; path: string; children: React.ReactNode; }
const StaticPage = ({ title, description, path, children }: StaticProps) => (
  <>
    <Seo title={`${title} – ToolsHub`} description={description} path={path} />
    <div className="container py-12 max-w-3xl prose prose-sm md:prose-base dark:prose-invert">
      <h1>{title}</h1>
      {children}
    </div>
  </>
);

export const About = () => (
  <StaticPage title="About Us" description="Learn about ToolsHub — 50+ free, private online tools." path="/about">
    <p>ToolsHub is a free collection of 50+ online tools and calculators built to help you solve everyday problems quickly. Every tool runs entirely in your browser — no signup, no tracking of your inputs, no waiting for a server.</p>
    <h2>Our mission</h2>
    <p>Make high-quality utilities universally accessible. Whether you're a student, developer, marketer or just curious, we want the right tool to be one click away.</p>
    <h2>How it stays free</h2>
    <p>We display unobtrusive advertising on tool pages. That's it. We never sell your data because we never collect it.</p>
  </StaticPage>
);

export const Contact = () => (
  <StaticPage title="Contact" description="Get in touch with the ToolsHub team." path="/contact">
    <p>Have a tool request, bug report or partnership idea? We'd love to hear from you.</p>
    <p>Email: <a href="mailto:muhammadashiq.dev@gmail.com">muhammadashiq.dev@gmail.com</a></p>
    <p>Email: <a href="mailto:shahabtech135@gmail.com">shahabtech135@gmail.com</a></p>

  </StaticPage>
);

export const Privacy = () => (
  <StaticPage title="Privacy Policy" description="How ToolsHub handles your privacy." path="/privacy">
    <p>ToolsHub processes your input locally in your browser. We do not store, log or transmit the values you enter into any tool.</p>
    <h2>Cookies & Analytics</h2>
    <p>We use minimal cookies for theme preference. Third-party advertising partners may set cookies subject to their own policies.</p>
    <h2>Advertising</h2>
    <p>We may serve ads through third-party providers (e.g. Google AdSense) that use cookies to personalize ads.</p>
    <h2>Contact</h2>
    <p>Email: muhammadashiq.dev@gmail.com</p>
  </StaticPage>
);

export const Disclaimer = () => (
  <StaticPage title="Disclaimer" description="Important information about ToolsHub calculators." path="/disclaimer">
    <p>The tools and information on ToolsHub are provided "as is" for general informational purposes only. While we strive for accuracy, calculations should not be relied upon for medical, legal, financial or other professional decisions.</p>
    <p>Always consult a qualified professional for advice tailored to your situation.</p>
  </StaticPage>
);
