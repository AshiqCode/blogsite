import { Helmet } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toast";

export default function App() {
  return (
    <BrowserRouter>
      <Helmet>
        <title>TrendScope – AI Tools Directory</title>
        <meta
          name="description"
          content="Discover and explore the best AI tools for writing, design, productivity, marketing, coding, and more. Browse categories, compare tools, and find the right AI for your workflow."
        />
        <link rel="canonical" href="https://trendscope.site/" />
        <meta name="robots" content="index, follow" />

        {/* Optional but recommended */}
        <meta property="og:title" content="TrendScope – AI Tools Directory" />
        <meta
          property="og:description"
          content="Find the best AI tools by category. Compare features and pick the perfect tool for your needs."
        />
        <meta property="og:url" content="https://trendscope.site/" />
        <meta property="og:type" content="website" />
      </Helmet>

      <Toaster position="top-right" reverseOrder={false} />

      {/* <Navbar /> */}
      <AppRoutes />
      <ToastContainer />
    </BrowserRouter>
  );
}
