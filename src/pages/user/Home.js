import React, { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
/**
 * ✅ Your provided data (same fields: name, category, desc, link, logo)
 * We will render ALL tools + live search (name/category/desc).
 */
const TOOLS = [
  {
    name: "ChatGPT",
    category: "Writing",
    desc: "Conversational AI for writing, coding, and more.",
    link: "https://chat.openai.com/",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
  },
  {
    name: "Midjourney",
    category: "Design",
    desc: "Create stunning AI-generated art from text prompts.",
    link: "https://www.midjourney.com/",
    logo: "https://avatars.githubusercontent.com/u/61396273?s=280&v=4",
  },
  {
    name: "DALL·E",
    category: "Image Generation",
    desc: "Text to image generation AI by OpenAI.",
    link: "https://openai.com/dall-e",
    logo: "https://images.ctfassets.net/kftzwdyauwt9/4xRSuCnoKAT9ZGfMYFcRZ1/de6f1364124ed36428ab136266e33795/plategirl.png?w=3840&q=90&fm=webp",
  },
  {
    name: "Jasper",
    category: "Writing",
    desc: "AI copywriting and content generation.",
    link: "https://www.jasper.ai/",
    logo: "https://sm.pcmag.com/pcmag_me/review/j/jasper/jasper_pknd.jpg",
  },
  {
    name: "Copy.ai",
    category: "Marketing",
    desc: "Automated content writing for marketers.",
    link: "https://www.copy.ai/",
    logo: "https://zorgle.co.uk/wp-content/uploads/2024/11/Copy-ai-logo.png",
  },
  {
    name: "Synthesia",
    category: "Video",
    desc: "AI video generation using avatars and voice.",
    link: "https://www.synthesia.io/",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqs2jBJkID-cO_138T0rCgldqDFoatqBn5AA&s",
  },
  {
    name: "Runway ML",
    category: "Video",
    desc: "AI-powered video editing and content creation.",
    link: "https://runwayml.com/",
    logo: "https://docubase.mit.edu/wp-content/uploads/2020/04/runway-logo-420x420.png",
  },
  {
    name: "Descript",
    category: "Audio/Video",
    desc: "Edit video and audio by editing text.",
    link: "https://www.descript.com/",
    logo: "https://radioink.com/wp-content/uploads/2023/08/Descript-e1692129726820.jpeg",
  },
  {
    name: "Pictory",
    category: "Video",
    desc: "Turn text content into videos with AI.",
    link: "https://pictory.ai/",
    logo: "https://cdn.prod.website-files.com/6469e2294ac68c3d5caea372/6834b296bc93ee52da836f0f_pictory-ai-logo.webp",
  },
  {
    name: "Durable",
    category: "Website Builder",
    desc: "AI website builder for small businesses.",
    link: "https://durable.co/",
    logo: "https://durable.co/favicon.ico",
  },
  {
    name: "Tome",
    category: "Presentation",
    desc: "Create AI-generated presentations instantly.",
    link: "https://tome.app/",
    logo: "https://insightverse.org/wp-content/uploads/2025/05/tome-logo.png",
  },
  {
    name: "Looka",
    category: "Design",
    desc: "AI-powered logo and brand kit generator.",
    link: "https://looka.com/",
    logo: "https://looka.com/favicon.ico",
  },
  {
    name: "Replika",
    category: "Chatbot",
    desc: "AI chatbot for conversation and companionship.",
    link: "https://replika.com/",
    logo: "https://replika.com/favicon.ico",
  },
  {
    name: "Murf.ai",
    category: "Voice",
    desc: "AI voice generation for videos and podcasts.",
    link: "https://murf.ai/",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjxnEnGfYE-dI20zgCOfkeogayCioTBgHj6w&s",
  },
  {
    name: "Soundraw",
    category: "Music",
    desc: "Generate royalty-free music with AI.",
    link: "https://soundraw.io/",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdhDgBJF6xuHMhfHXSDiwr2Pts8NWgynWnRA&s",
  },
  {
    name: "Notion AI",
    category: "Productivity",
    desc: "Write and summarize content in Notion.",
    link: "https://www.notion.so/product/ai",
    logo: "https://www.notion.so/images/favicon.ico",
  },
  {
    name: "Frase",
    category: "SEO",
    desc: "AI content optimization and SEO writing tool.",
    link: "https://www.frase.io/",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQG5rWlDgThyMaG1pq4ukOWzJprP6StKmhOFA&s",
  },
  {
    name: "Grammarly",
    category: "Writing",
    desc: "Grammar checking and style enhancement AI.",
    link: "https://www.grammarly.com/",
    logo: "https://play-lh.googleusercontent.com/6Xe9DWiMC76daosOC80Im9gqe25Q9P55LxJIGPTLbcdFkMXOur4mk8jTVxoqOaiAvAG4",
  },
  {
    name: "AI Dungeon",
    category: "Game",
    desc: "AI-generated text adventure games.",
    link: "https://play.aidungeon.io/",
    logo: "https://play.aidungeon.io/favicon.ico",
  },
  {
    name: "Surfer SEO",
    category: "SEO",
    desc: "AI SEO optimization for content ranking.",
    link: "https://surferseo.com/",
    logo: "https://ninepeaks.io/wp-content/uploads/2025/07/64636be79401364b8261c4f7_Basic-OG-img.webp",
  },
  {
    name: "GitHub Copilot",
    category: "Coding, Programming",
    desc: "AI pair programmer from GitHub and OpenAI.",
    link: "https://github.com/features/copilot",
    logo: "https://github.githubassets.com/favicons/favicon.svg",
  },
  {
    name: "Replit Ghostwriter",
    category: "Coding, Programming",
    desc: "Code completion and suggestions in Replit IDE.",
    link: "https://replit.com/ghostwriter",
    logo: "https://cdn.sanity.io/images/bj34pdbp/migration/89d05e2fde6c4512d94136533088d526b1a25e5e-1280x824.png",
  },
  {
    name: "Tabnine",
    category: "Coding, Autocomplete",
    desc: "AI assistant that helps you code faster.",
    link: "https://www.tabnine.com/",
    logo: "https://www.tabnine.com/favicon.ico",
  },
  {
    name: "Codeium",
    category: "Coding, AI Autocomplete",
    desc: "AI coding assistant and code completion.",
    link: "https://codeium.com/",
    logo: "https://codeium.com/favicon.ico",
  },
  {
    name: "Claude",
    category: "Writing",
    desc: "AI conversational model for writing and coding tasks.",
    link: "https://www.anthropic.com/",
    logo: "https://www.anthropic.com/favicon.ico",
  },
  {
    name: "Perplexity",
    category: "Research",
    desc: "AI-powered search engine with real-time answers.",
    link: "https://www.perplexity.ai/",
    logo: "https://framerusercontent.com/images/vvoaguaD5inxpz96kncmL2JbZbQ.jpg?width=2160&height=2160",
  },
  {
    name: "DeepL",
    category: "Translation",
    desc: "AI translation tool for accurate, natural language translations.",
    link: "https://www.deepl.com/",
    logo: "https://www.deepl.com/favicon.ico",
  },
  {
    name: "Canva Magic Studio",
    category: "Design",
    desc: "AI-powered graphic design and content creation.",
    link: "https://www.canva.com/",
    logo: "https://www.canva.com/favicon.ico",
  },
  {
    name: "Firefly",
    category: "Design",
    desc: "Adobe’s generative AI for creative design.",
    link: "https://www.adobe.com/sensei/generative-ai/firefly.html",
    logo: "https://www.adobe.com/favicon.ico",
  },
  {
    name: "Poe",
    category: "Chatbot",
    desc: "AI chatbot aggregator for custom bot creation.",
    link: "https://poe.com/",
    logo: "https://fahimai.com/wp-content/uploads/2024/06/Untitled-design-11.png",
  },
  {
    name: "Otter.ai",
    category: "Audio/Video",
    desc: "AI-powered transcription for meetings and calls.",
    link: "https://otter.ai/",
    logo: "https://otter.ai/favicon.ico",
  },
  {
    name: "WellSaid Labs",
    category: "Voice",
    desc: "AI voice generation for high-quality voiceovers.",
    link: "https://wellsaidlabs.com/",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRObmEC-piRFvf4sAFbQXNxpNzaxLzEfglUeA&s",
  },
  {
    name: "Fotor",
    category: "Image Editing",
    desc: "AI-powered photo editing and design tool.",
    link: "https://www.fotor.com/",
    logo: "https://www.fotor.com/favicon.ico",
  },
  {
    name: "Pixlr",
    category: "Image Editing",
    desc: "Web-based AI photo editor with advanced features.",
    link: "https://pixlr.com/",
    logo: "https://pixlr.com/favicon.ico",
  },
  {
    name: "Lumen5",
    category: "Video",
    desc: "AI-driven video creation from text content.",
    link: "https://lumen5.com/",
    logo: "https://yt3.googleusercontent.com/Fqc8V5VTKsaM_aT07To9nrw4AlZldNKiwCJ7mj8qPGptW3LlQaGpG7nTty0hs4nYbwtzOUyzi2g=s900-c-k-c0x00ffffff-no-rj",
  },
  {
    name: "HeyGen",
    category: "Video",
    desc: "AI video platform for avatar-based content.",
    link: "https://www.heygen.com/",
    logo: "https://www.heygen.com/favicon.ico",
  },
  {
    name: "Writesonic",
    category: "Writing",
    desc: "AI tool for content creation and marketing copy.",
    link: "https://writesonic.com/",
    logo: "https://upload.wikimedia.org/wikipedia/en/b/bd/Logo_of_the_company_WriteSonic.jpg",
  },
  {
    name: "Rytr",
    category: "Writing",
    desc: "AI writing assistant for quick content generation.",
    link: "https://rytr.me/",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdsGsvOcjzROwt4z9ZGo-wk_qNYcQ9IvVRCw&s",
  },
  {
    name: "Cursor",
    category: "Coding",
    desc: "AI-powered code editor with intelligent suggestions.",
    link: "https://cursor.sh/",
    logo: "https://cursor.sh/favicon.ico",
  },
  {
    name: "Lovable.dev",
    category: "Coding",
    desc: "AI-powered app builder with no-code interface.",
    link: "https://lovable.dev/",
    logo: "https://lovable.dev/favicon.ico",
  },
  {
    name: "V0.dev",
    category: "Coding",
    desc: "AI-driven UI generator for React components.",
    link: "https://v0.dev/",
    logo: "https://pbs.twimg.com/profile_images/1955397769138667520/XoWT5Huy_400x400.jpg",
  },
  {
    name: "Bolt.new",
    category: "Coding",
    desc: "AI-enhanced coding assistant for developers.",
    link: "https://bolt.new/",
    logo: "https://s3.amazonaws.com/beamstart/2025/Sep/13/0f45a619cfcff4773d9ed334131644f2.jpeg",
  },
  {
    name: "Ajelix",
    category: "Productivity",
    desc: "AI Excel add-in for spreadsheet automation.",
    link: "https://ajelix.com/",
    logo: "https://ajelix.com/favicon.ico",
  },
  {
    name: "Mentimeter",
    category: "Presentation",
    desc: "AI-driven interactive presentation tool.",
    link: "https://www.mentimeter.com/",
    logo: "https://www.mentimeter.com/favicon.ico",
  },
  {
    name: "Teal",
    category: "Career",
    desc: "AI tool for resume building and job tracking.",
    link: "https://www.tealhq.com/",
    logo: "https://s3-eu-west-1.amazonaws.com/tpd/logos/5ee39a43303e400001e7b306/0x0.png",
  },
  {
    name: "Kickresume",
    category: "Career",
    desc: "AI resume and cover letter builder.",
    link: "https://www.kickresume.com/",
    logo: "https://www.kickresume.com/favicon.ico",
  },
  {
    name: "Deepgram",
    category: "Voice",
    desc: "AI platform for speech-to-text and voice synthesis.",
    link: "https://deepgram.com/",
    logo: "https://avatars.githubusercontent.com/u/17422641?s=280&v=4",
  },
  {
    name: "Remini",
    category: "Image Editing",
    desc: "AI tool for enhancing and restoring photos.",
    link: "https://remini.ai/",
    logo: "https://remini.ai/favicon.ico",
  },
  {
    name: "Browse AI",
    category: "Data Scraping",
    desc: "AI bot for web data extraction and automation.",
    link: "https://www.browse.ai/",
    logo: "https://images.ctfassets.net/23aumh6u8s0i/5gummyEm3ZwPWCY2g3s2zA/7a58171407e35c184fa8687b5ededeac/browseaiblog.png",
  },
  {
    name: "Undetectable AI",
    category: "Writing",
    desc: "Rewrites AI content to sound human-like.",
    link: "https://undetectable.ai/",
    logo: "https://undetectable.ai/favicon.ico",
  },
  {
    name: "ClickUp Brain",
    category: "Productivity",
    desc: "AI-powered task and knowledge management.",
    link: "https://clickup.com/",
    logo: "https://clickup.com/favicon.ico",
  },
  {
    name: "Microsoft Copilot",
    category: "Productivity",
    desc: "AI assistant for Microsoft 365 suite.",
    link: "https://copilot.microsoft.com/",
    logo: "https://copilot.microsoft.com/favicon.ico",
  },
  {
    name: "Woebot",
    category: "Health",
    desc: "AI chatbot for mental health support.",
    link: "https://woebothealth.com/",
    logo: "https://woebothealth.com/favicon.ico",
  },
  {
    name: "Zapier Chatbots",
    category: "Automation",
    desc: "AI chatbots with no-code automation.",
    link: "https://zapier.com/apps/chatbots",
    logo: "https://images.ctfassets.net/lzny33ho1g45/6kws9TFHefScoCuKYaf8O0/4bfaf5c55a04c3e1365c9a66de8a145f/app_tips__1_.png?fm=jpg&q=31&fit=thumb&w=1520&h=760",
  },
  {
    name: "Mem",
    category: "Productivity",
    desc: "AI-powered note-taking and knowledge management.",
    link: "https://mem.ai/",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_UnsghJquy7momLbW0QxwXurk7KhgvRSsIQ&s",
  },
  {
    name: "DeepSeek R1",
    category: "Research",
    desc: "AI model for advanced research tasks.",
    link: "https://www.deepseek.com/",
    logo: "https://www.deepseek.com/favicon.ico",
  },
  {
    name: "ElevenLabs",
    category: "Voice",
    desc: "AI-powered text-to-speech with realistic voice synthesis.",
    link: "https://elevenlabs.io/",
    logo: "https://elevenlabs.io/favicon.ico",
  },
  {
    name: "QuillBot",
    category: "Writing",
    desc: "AI paraphrasing and writing enhancement tool for better content.",
    link: "https://quillbot.com/",
    logo: "https://quillbot.com/favicon.ico",
  },
  {
    name: "Craiyon",
    category: "Image Generation",
    desc: "Free AI tool for generating images from text prompts.",
    link: "https://www.craiyon.com/",
    logo: "https://www.craiyon.com/favicon.ico",
  },
  {
    name: "Elicit",
    category: "Research",
    desc: "AI research assistant for literature reviews and data analysis.",
    link: "https://elicit.org/",
    logo: "https://fahimai.com/wp-content/uploads/2024/12/CTA-42.png",
  },
  {
    name: "Whisper",
    category: "Speech Recognition",
    desc: "OpenAI speech recognition system for accurate transcription.",
    link: "https://openai.com/research/whisper",
    logo: "https://openai.com/favicon.ico",
  },
  {
    name: "AssemblyAI",
    category: "Speech Recognition",
    desc: "AI APIs for speech recognition and audio intelligence.",
    link: "https://www.assemblyai.com/",
    logo: "https://www.assemblyai.com/favicon.ico",
  },
  {
    name: "Sourcegraph Cody",
    category: "Coding",
    desc: "AI code assistant for searching and understanding codebases.",
    link: "https://about.sourcegraph.com/cody",
    logo: "https://sourcegraph.com/favicon.ico",
  },
  {
    name: "Mistral AI",
    category: "Language Models",
    desc: "Open-source large language models with commercial applications.",
    link: "https://mistral.ai/",
    logo: "https://mistral.ai/favicon.ico",
  },
  {
    name: "LangChain",
    category: "Development",
    desc: "Framework for developing applications with LLMs.",
    link: "https://langchain.com/",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTc-QRqqtRi8EEyMCDcBawEio86I7MpmwMBTw&s",
  },
  {
    name: "Leonardo AI",
    category: "Image Generation",
    desc: "Create production-quality visual assets with AI for games, art, and design.",
    link: "https://leonardo.ai/",
    logo: "https://leonardo.ai/favicon.ico",
  },
  {
    name: "Phind",
    category: "Coding Assistant",
    desc: "AI search engine for developers to get instant coding answers and context.",
    link: "https://phind.com/",
    logo: "https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/phind.png",
  },
  {
    name: "ChatPDF",
    category: "Document Analysis",
    desc: "AI that allows you to chat with PDFs and receive answers from documents.",
    link: "https://www.chatpdf.com/",
    logo: "https://www.chatpdf.com/favicon.ico",
  },
  {
    name: "Gamma",
    category: "Presentation",
    desc: "AI-powered platform for creating engaging presentations and docs.",
    link: "https://gamma.app/",
    logo: "https://gamma.app/favicon.ico",
  },
  {
    name: "Harpa AI",
    category: "Automation",
    desc: "AI Chrome extension for web automation, scraping, and chat with any site.",
    link: "https://harpa.ai/",
    logo: "https://harpa.ai/favicon.ico",
  },
  {
    name: "Deep Nostalgia",
    category: "Image Editing",
    desc: "AI tool to animate old photos and bring portraits to life.",
    link: "https://www.myheritage.com/deep-nostalgia",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjmCp7DdZrMxMPqMcpNQdLzS0rh5RHVdgZyg&s",
  },
];

function normalizeCategory(cat) {
  // Your data sometimes uses comma-separated categories like "Coding, Programming"
  // We'll keep first category for filtering list, and also preserve original.
  const raw = String(cat || "Other").trim();
  const primary = raw.split(",")[0].trim() || "Other";
  return { raw, primary };
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const canonical = useMemo(() => {
    if (typeof window === "undefined") return "https://trendscope.site/";
    return `${window.location.origin}/`;
  }, []);

  const title = "TrendScope – AI Tools Directory";
  const description =
    "Browse an AI tools directory. Search by name, category, or description and discover useful AI apps.";

  // Build categories dynamically from your data
  const categories = useMemo(() => {
    const set = new Set();
    TOOLS.forEach((t) => set.add(normalizeCategory(t.category).primary));
    return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return TOOLS.filter((t) => {
      const c = normalizeCategory(t.category);
      const matchesQuery =
        !q ||
        t.name.toLowerCase().includes(q) ||
        (t.desc || "").toLowerCase().includes(q) ||
        c.raw.toLowerCase().includes(q);

      const matchesCategory = category === "All" || c.primary === category;

      return matchesQuery && matchesCategory;
    });
  }, [query, category]);

  const handleCopy = async (link) => {
    await navigator.clipboard.writeText(link);
    toast.success("Copied successfully!");
  };

  const Seo = () => (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
    </Helmet>
  );

  return (
    <main
      style={{
        width: "100%",
        overflowX: "hidden",
        background: "#f9fafb",
        color: "#111827",
        minHeight: "100vh",
      }}
    >
      <Seo />

      {/* HERO */}
      <section
        style={{
          padding: "64px 20px",
          borderBottom: "1px solid #e5e7eb",
          background:
            "radial-gradient(600px 300px at 50% 20%, rgba(59,130,246,0.15), transparent 60%)",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 18,
              flexWrap: "wrap",
            }}
          >
            <div style={{ maxWidth: 760 }}>
              <h1
                style={{
                  fontSize: "clamp(34px, 5vw, 54px)",
                  fontWeight: 800,
                  marginBottom: 10,
                }}
              >
                Browse {TOOLS.length}+ AI Tools Directory
              </h1>

              <p
                style={{
                  margin: 0,
                  fontSize: 16,
                  color: "#6b7280",
                  lineHeight: 1.7,
                }}
              >
                Discover the best AI tools, AI apps, and AI software platforms
                in one place. Click any tool to visit the official website.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* GRID */}
      <section style={{ padding: "20px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {/* SEO Subheading */}
          <div style={{ marginBottom: 18 }}>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>
              Best AI Tools by Category
            </h2>
            <p
              style={{
                marginTop: 8,
                marginBottom: 0,
                color: "#6b7280",
                fontSize: 14,
                lineHeight: 1.7,
                maxWidth: 950,
              }}
            >
              Explore AI tools for writing, coding, design, image generation,
              video editing, SEO optimization, productivity, research,
              automation, translation, speech recognition, and more.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 22,
            }}
          >
            {filtered.map((tool, idx) => {
              const c = normalizeCategory(tool.category);
              return (
                <article
                  key={`${tool.name}-${idx}`}
                  style={{
                    borderRadius: 16,
                    border: "1px solid #e5e7eb",
                    background: "#ffffff",
                    padding: 18,
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                    boxShadow: "0 6px 18px rgba(0,0,0,0.04)",
                    transition: "transform 0.15s ease, box-shadow 0.15s ease",
                  }}
                >
                  <div
                    style={{ display: "flex", gap: 12, alignItems: "center" }}
                  >
                    <img
                      src={tool.logo}
                      alt={tool.name}
                      width={44}
                      height={44}
                      loading="lazy"
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        objectFit: "contain",
                        background: "#f3f4f6",
                        border: "1px solid #e5e7eb",
                        padding: 6,
                      }}
                    />

                    <div>
                      <h3 style={{ margin: 0, fontSize: 18 }}>{tool.name}</h3>
                      <div
                        style={{ marginTop: 4, fontSize: 12, color: "#6b7280" }}
                      >
                        {c.primary}
                      </div>
                    </div>
                  </div>

                  <p
                    style={{
                      margin: 0,
                      color: "#4b5563",
                      fontSize: 14,
                      lineHeight: 1.6,
                      flexGrow: 1,
                    }}
                  >
                    {tool.desc}
                  </p>

                  <div style={{ display: "flex", gap: 10 }}>
                    <a
                      href={tool.link}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        flex: 1,
                        textAlign: "center",
                        padding: "10px 12px",
                        borderRadius: 10,
                        background: "#111827",
                        color: "#fff",
                        textDecoration: "none",
                        fontWeight: 800,
                      }}
                    >
                      Visit →
                    </a>

                    <button
                      onClick={() => handleCopy(tool.link)}
                      style={{
                        padding: "10px 12px",
                        borderRadius: 10,
                        border: "1px solid #e5e7eb",
                        background: "#f3f4f6",
                        color: "#111827",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      Copy
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
          {/* ✅ SEO-friendly visible keywords (natural, not spam) */}
          <div
            style={{
              marginTop: 16,
              padding: 16,
              borderRadius: 16,
              background: "rgba(255,255,255,0.9)",
              border: "1px solid #e5e7eb",
              boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 14,
                color: "#6b7280",
                lineHeight: 1.85,
              }}
            >
              TrendScope is a comprehensive <strong>AI tools directory</strong>{" "}
              featuring the <strong>best AI tools in 2026</strong>, including{" "}
              <strong>free AI tools</strong>,{" "}
              <strong>generative AI tools</strong>,{" "}
              <strong>ChatGPT alternatives</strong>,{" "}
              <strong>AI writing tools</strong>,{" "}
              <strong>AI image generators</strong>,{" "}
              <strong>AI video editors</strong>,{" "}
              <strong>AI coding assistants</strong>,{" "}
              <strong>AI SEO tools</strong>,{" "}
              <strong>AI voice generators</strong>,{" "}
              <strong>AI productivity apps</strong>, and{" "}
              <strong>AI automation tools</strong>. Whether you're a student,
              developer, marketer, business owner, content creator, or startup
              founder, explore top AI software for research, design,
              programming, marketing, content creation, and business automation.
            </p>
          </div>
          {/* ✅ Footer upgraded with shadow cards */}
          <footer style={{ marginTop: 50 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: 16,
                paddingTop: 20,
                borderTop: "1px solid #e5e7eb",
              }}
            >
              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 16,
                  padding: 16,
                  boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
                }}
              >
                <div style={{ fontWeight: 800, marginBottom: 6 }}>
                  TrendScope
                </div>
                <div
                  style={{ color: "#6b7280", fontSize: 13, lineHeight: 1.6 }}
                >
                  © {new Date().getFullYear()} TrendScope. Discover the best AI
                  tools for writing, coding, design, and productivity.
                </div>
              </div>

              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 16,
                  padding: 16,
                  boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
                }}
              >
                <div style={{ fontWeight: 800, marginBottom: 6 }}>
                  Directory Stats
                </div>
                <div
                  style={{ color: "#6b7280", fontSize: 13, lineHeight: 1.6 }}
                >
                  Tools listed:{" "}
                  <strong style={{ color: "#111827" }}>{TOOLS.length}</strong>
                  <br />
                  Categories:{" "}
                  <strong style={{ color: "#111827" }}>
                    {Math.max(0, categories.length - 1)}
                  </strong>
                </div>
              </div>

              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 16,
                  padding: 16,
                  boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
                }}
              >
                <div style={{ fontWeight: 800, marginBottom: 6 }}>
                  Popular Tags
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    flexWrap: "wrap",
                    marginTop: 8,
                  }}
                >
                  {[
                    "AI Writing",
                    "AI Image",
                    "AI Video",
                    "AI Coding",
                    "AI SEO",
                    "AI Voice",
                    "Productivity",
                    "Automation",
                  ].map((t) => (
                    <span
                      key={t}
                      style={{
                        fontSize: 12,
                        padding: "6px 10px",
                        borderRadius: 999,
                        background: "#f3f4f6",
                        border: "1px solid #e5e7eb",
                        color: "#374151",
                        fontWeight: 700,
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: 14,
                color: "#6b7280",
                fontSize: 12,
                textAlign: "center",
              }}
            >
              Tip: Use the search and category filters to quickly find the best
              AI apps for your needs.
            </div>
          </footer>
        </div>
      </section>
    </main>
  );
}
