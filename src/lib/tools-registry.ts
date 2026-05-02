import { lazy, type LazyExoticComponent, type ComponentType } from "react";

export type Category =
  | "Finance"
  | "Health"
  | "Math"
  | "SEO"
  | "Text Tools"
  | "Developer Tools"
  | "Daily Utilities";

export interface Tool {
  slug: string;
  title: string;
  description: string;
  category: Category;
  keywords: string[];
  icon: string; // emoji for lightweight visuals
  popular?: boolean;
  Component: LazyExoticComponent<ComponentType>;
}

export const categories: { name: Category; description: string; icon: string }[] = [
  { name: "Finance", description: "Loans, taxes, interest & money math", icon: "💰" },
  { name: "Health", description: "BMI, calories & wellness calculators", icon: "❤️" },
  { name: "Math", description: "Percentage, algebra & number tools", icon: "🧮" },
  { name: "SEO", description: "Meta tags, keywords & site analysis", icon: "📈" },
  { name: "Text Tools", description: "Word count, case & text utilities", icon: "✍️" },
  { name: "Developer Tools", description: "JSON, encoders & dev helpers", icon: "💻" },
  { name: "Daily Utilities", description: "QR codes, colors & everyday tools", icon: "🧰" },
];

export const tools: Tool[] = [
  // Health
  { slug: "bmi-calculator", title: "BMI Calculator", description: "Calculate your Body Mass Index from height and weight.", category: "Health", keywords: ["bmi","body mass index","health"], icon: "⚖️", popular: true, Component: lazy(() => import("@/tools/BmiCalculator")) },
  { slug: "calorie-calculator", title: "Daily Calorie Calculator", description: "Estimate daily calories needed based on age, sex and activity.", category: "Health", keywords: ["calorie","tdee","bmr"], icon: "🔥", Component: lazy(() => import("@/tools/CalorieCalculator")) },
  { slug: "water-intake-calculator", title: "Water Intake Calculator", description: "Find out how much water you should drink daily.", category: "Health", keywords: ["water","hydration"], icon: "💧", Component: lazy(() => import("@/tools/WaterIntakeCalculator")) },
  { slug: "ideal-weight-calculator", title: "Ideal Weight Calculator", description: "Estimate ideal body weight from height and gender.", category: "Health", keywords: ["weight","ideal"], icon: "🏋️", Component: lazy(() => import("@/tools/IdealWeightCalculator")) },

  // Finance
  { slug: "loan-emi-calculator", title: "Loan EMI Calculator", description: "Calculate monthly EMI, total interest and amount payable.", category: "Finance", keywords: ["emi","loan","mortgage"], icon: "🏦", popular: true, Component: lazy(() => import("@/tools/EmiCalculator")) },
  { slug: "gst-calculator", title: "GST Calculator", description: "Add or remove GST/VAT from any amount instantly.", category: "Finance", keywords: ["gst","vat","tax"], icon: "🧾", Component: lazy(() => import("@/tools/GstCalculator")) },
  { slug: "compound-interest-calculator", title: "Compound Interest Calculator", description: "Project investment growth with compound interest.", category: "Finance", keywords: ["compound","interest","investment"], icon: "📊", Component: lazy(() => import("@/tools/CompoundInterestCalculator")) },
  { slug: "simple-interest-calculator", title: "Simple Interest Calculator", description: "Calculate simple interest on principal over time.", category: "Finance", keywords: ["interest","simple"], icon: "💵", Component: lazy(() => import("@/tools/SimpleInterestCalculator")) },
  { slug: "currency-converter", title: "Currency Converter", description: "Convert between major currencies using live rates.", category: "Finance", keywords: ["currency","exchange","forex"], icon: "💱", Component: lazy(() => import("@/tools/CurrencyConverter")) },
  { slug: "tip-calculator", title: "Tip Calculator", description: "Split bills and calculate tip per person.", category: "Finance", keywords: ["tip","bill","split"], icon: "🍽️", Component: lazy(() => import("@/tools/TipCalculator")) },
  { slug: "discount-calculator", title: "Discount Calculator", description: "Find sale price after percentage discount.", category: "Finance", keywords: ["discount","sale"], icon: "🏷️", Component: lazy(() => import("@/tools/DiscountCalculator")) },
  { slug: "salary-to-hourly-converter", title: "Salary to Hourly Converter", description: "Convert annual salary to hourly, weekly and monthly pay.", category: "Finance", keywords: ["salary","hourly","wage"], icon: "💼", Component: lazy(() => import("@/tools/SalaryToHourlyConverter")) },

  // Math
  { slug: "percentage-calculator", title: "Percentage Calculator", description: "Calculate percentages, increases and decreases.", category: "Math", keywords: ["percentage","percent"], icon: "％", popular: true, Component: lazy(() => import("@/tools/PercentageCalculator")) },
  { slug: "age-calculator", title: "Age Calculator", description: "Calculate exact age in years, months and days.", category: "Math", keywords: ["age","birthday"], icon: "🎂", popular: true, Component: lazy(() => import("@/tools/AgeCalculator")) },
  { slug: "random-number-generator", title: "Random Number Generator", description: "Generate random numbers within any range.", category: "Math", keywords: ["random","number"], icon: "🎲", Component: lazy(() => import("@/tools/RandomNumberGenerator")) },
  { slug: "average-calculator", title: "Average Calculator", description: "Compute mean, median and mode of numbers.", category: "Math", keywords: ["average","mean","median"], icon: "📐", Component: lazy(() => import("@/tools/AverageCalculator")) },
  { slug: "fraction-to-decimal", title: "Fraction to Decimal Converter", description: "Convert fractions to decimal form quickly.", category: "Math", keywords: ["fraction","decimal"], icon: "½", Component: lazy(() => import("@/tools/FractionToDecimal")) },
  { slug: "scientific-calculator", title: "Scientific Calculator", description: "Perform advanced math operations and functions.", category: "Math", keywords: ["scientific","calculator"], icon: "🧠", Component: lazy(() => import("@/tools/ScientificCalculator")) },

  // SEO
  { slug: "meta-tag-generator", title: "Meta Tag Generator", description: "Generate SEO meta tags for any web page.", category: "SEO", keywords: ["meta","seo","tags"], icon: "🏷️", Component: lazy(() => import("@/tools/MetaTagGenerator")) },
  { slug: "keyword-density-checker", title: "Keyword Density Checker", description: "Analyze keyword frequency in your content.", category: "SEO", keywords: ["keyword","density","seo"], icon: "🔑", Component: lazy(() => import("@/tools/KeywordDensityChecker")) },
  { slug: "slug-generator", title: "URL Slug Generator", description: "Convert any title into a clean URL slug.", category: "SEO", keywords: ["slug","url","seo"], icon: "🔗", Component: lazy(() => import("@/tools/SlugGenerator")) },
  { slug: "robots-txt-generator", title: "Robots.txt Generator", description: "Build a robots.txt file for your site.", category: "SEO", keywords: ["robots","seo","crawler"], icon: "🤖", Component: lazy(() => import("@/tools/RobotsTxtGenerator")) },
  { slug: "open-graph-generator", title: "Open Graph Generator", description: "Create OG tags for social media sharing.", category: "SEO", keywords: ["open graph","og","social"], icon: "📣", Component: lazy(() => import("@/tools/OpenGraphGenerator")) },

  // Text
  { slug: "word-counter", title: "Word Counter", description: "Count words, characters, sentences and paragraphs.", category: "Text Tools", keywords: ["word","count","character"], icon: "📝", popular: true, Component: lazy(() => import("@/tools/WordCounter")) },
  { slug: "case-converter", title: "Case Converter", description: "Convert text to upper, lower, title or sentence case.", category: "Text Tools", keywords: ["case","upper","lower"], icon: "🔠", Component: lazy(() => import("@/tools/CaseConverter")) },
  { slug: "lorem-ipsum-generator", title: "Lorem Ipsum Generator", description: "Generate placeholder paragraphs of any length.", category: "Text Tools", keywords: ["lorem","placeholder","text"], icon: "📄", Component: lazy(() => import("@/tools/LoremIpsumGenerator")) },
  { slug: "text-reverser", title: "Text Reverser", description: "Reverse the order of characters or words.", category: "Text Tools", keywords: ["reverse","text"], icon: "🔁", Component: lazy(() => import("@/tools/TextReverser")) },
  { slug: "remove-duplicate-lines", title: "Remove Duplicate Lines", description: "Quickly remove duplicate lines from text.", category: "Text Tools", keywords: ["duplicate","lines"], icon: "🧹", Component: lazy(() => import("@/tools/RemoveDuplicateLines")) },
  { slug: "text-to-speech", title: "Text to Speech", description: "Convert text to spoken audio in your browser.", category: "Text Tools", keywords: ["tts","speech","voice"], icon: "🔊", Component: lazy(() => import("@/tools/TextToSpeech")) },
  { slug: "markdown-previewer", title: "Markdown Previewer", description: "Live preview of markdown as HTML.", category: "Text Tools", keywords: ["markdown","preview"], icon: "📑", Component: lazy(() => import("@/tools/MarkdownPreviewer")) },

  // Developer
  { slug: "json-formatter", title: "JSON Formatter", description: "Format, validate and beautify JSON data.", category: "Developer Tools", keywords: ["json","format","validate"], icon: "{}", popular: true, Component: lazy(() => import("@/tools/JsonFormatter")) },
  { slug: "url-encoder-decoder", title: "URL Encoder / Decoder", description: "Encode or decode URL components instantly.", category: "Developer Tools", keywords: ["url","encode","decode"], icon: "🌐", Component: lazy(() => import("@/tools/UrlEncoderDecoder")) },
  { slug: "base64-encoder-decoder", title: "Base64 Encoder / Decoder", description: "Convert text to and from Base64.", category: "Developer Tools", keywords: ["base64","encode"], icon: "🔐", Component: lazy(() => import("@/tools/Base64EncoderDecoder")) },
  { slug: "binary-to-decimal", title: "Binary ↔ Decimal Converter", description: "Convert numbers between binary and decimal.", category: "Developer Tools", keywords: ["binary","decimal","convert"], icon: "01", Component: lazy(() => import("@/tools/BinaryToDecimal")) },
  { slug: "hex-to-rgb", title: "HEX to RGB Converter", description: "Convert HEX color codes to RGB values.", category: "Developer Tools", keywords: ["hex","rgb","color"], icon: "🎨", Component: lazy(() => import("@/tools/HexToRgb")) },
  { slug: "html-encoder-decoder", title: "HTML Encoder / Decoder", description: "Encode or decode HTML entities.", category: "Developer Tools", keywords: ["html","entities"], icon: "</>", Component: lazy(() => import("@/tools/HtmlEncoderDecoder")) },
  { slug: "regex-tester", title: "Regex Tester", description: "Test regular expressions against text in real time.", category: "Developer Tools", keywords: ["regex","regular expression"], icon: "/.*/", Component: lazy(() => import("@/tools/RegexTester")) },
  { slug: "uuid-generator", title: "UUID Generator", description: "Generate v4 UUIDs for your projects.", category: "Developer Tools", keywords: ["uuid","guid"], icon: "🆔", Component: lazy(() => import("@/tools/UuidGenerator")) },
  { slug: "jwt-decoder", title: "JWT Decoder", description: "Decode JSON Web Tokens to inspect payload.", category: "Developer Tools", keywords: ["jwt","token","decode"], icon: "🪙", Component: lazy(() => import("@/tools/JwtDecoder")) },

  // Daily Utilities
  { slug: "password-generator", title: "Password Generator", description: "Generate strong, secure random passwords.", category: "Daily Utilities", keywords: ["password","secure"], icon: "🔑", popular: true, Component: lazy(() => import("@/tools/PasswordGenerator")) },
  { slug: "qr-code-generator", title: "QR Code Generator", description: "Create QR codes for any text, URL or contact info.", category: "Daily Utilities", keywords: ["qr","code"], icon: "▦", popular: true, Component: lazy(() => import("@/tools/QrCodeGenerator")) },
  { slug: "color-picker", title: "Color Picker", description: "Pick colors and get HEX, RGB and HSL values.", category: "Daily Utilities", keywords: ["color","picker"], icon: "🎨", Component: lazy(() => import("@/tools/ColorPicker")) },
  { slug: "unit-converter", title: "Unit Converter", description: "Convert length, weight, temperature and more.", category: "Daily Utilities", keywords: ["unit","convert"], icon: "📏", Component: lazy(() => import("@/tools/UnitConverter")) },
  { slug: "image-compressor", title: "Image Compressor", description: "Compress JPG/PNG images right in your browser.", category: "Daily Utilities", keywords: ["image","compress"], icon: "🖼️", Component: lazy(() => import("@/tools/ImageCompressor")) },
  { slug: "stopwatch-timer", title: "Stopwatch & Timer", description: "Online stopwatch and countdown timer.", category: "Daily Utilities", keywords: ["timer","stopwatch"], icon: "⏱️", Component: lazy(() => import("@/tools/StopwatchTimer")) },
  { slug: "date-difference-calculator", title: "Date Difference Calculator", description: "Calculate days, weeks and months between two dates.", category: "Daily Utilities", keywords: ["date","difference"], icon: "📅", Component: lazy(() => import("@/tools/DateDifferenceCalculator")) },
  { slug: "time-zone-converter", title: "Time Zone Converter", description: "Convert times between any two time zones.", category: "Daily Utilities", keywords: ["timezone","time"], icon: "🌍", Component: lazy(() => import("@/tools/TimeZoneConverter")) },
  { slug: "bmi-chart", title: "BMI Category Chart", description: "Look up the WHO BMI category from a value.", category: "Daily Utilities", keywords: ["bmi","chart"], icon: "📋", Component: lazy(() => import("@/tools/BmiChart")) },
  { slug: "character-counter", title: "Character Counter", description: "Count characters with and without spaces.", category: "Daily Utilities", keywords: ["character","count"], icon: "🔢", Component: lazy(() => import("@/tools/CharacterCounter")) },
];

export const getToolBySlug = (slug: string) => tools.find(t => t.slug === slug);
export const getToolsByCategory = (cat: Category) => tools.filter(t => t.category === cat);
export const getRelatedTools = (tool: Tool, limit = 4) =>
  tools.filter(t => t.category === tool.category && t.slug !== tool.slug).slice(0, limit);
