import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useRoute, useProgress } from "./lib/store";
import { TopBar, Footer } from "./components/chrome";
import { HomePage } from "./components/home";
import { CurriculumPage } from "./components/curriculum";
import { LessonPage } from "./components/reader";

export default function App() {
  const route = useRoute();
  const progress = useProgress();

  // scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [route.page, route.param]);

  const key = route.page === "lesson" ? `lesson-${route.param}` : route.page;
  const mQuery = route.query?.split("&").find((kv) => kv.startsWith("m="))?.split("=")[1];

  return (
    <div className="min-h-screen">
      <TopBar progress={progress} />
      <AnimatePresence mode="wait">
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        >
          {route.page === "home" && <HomePage progress={progress} />}
          {route.page === "curriculum" && <CurriculumPage progress={progress} initialModule={mQuery} />}
          {route.page === "lesson" && <LessonPage id={route.param ?? ""} progress={progress} />}
        </motion.div>
      </AnimatePresence>
      <Footer progress={progress} />
    </div>
  );
}
