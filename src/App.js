import { Helmet } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <BrowserRouter>
      <Helmet>
        <title>TrendScope – Insights, Blogs & Trending Topics</title>
        <meta
          name="description"
          content="Read insights, stories, and expert ideas from the TrendScope team. Discover trending blogs and in-depth articles shaping today—read now!"
        />
        <link rel="canonical" href="https://trendscope.site/" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <Navbar />
      <AppRoutes />
    </BrowserRouter>
  );
}
