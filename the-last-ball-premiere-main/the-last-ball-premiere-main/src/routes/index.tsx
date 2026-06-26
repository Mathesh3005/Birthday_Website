import { createFileRoute } from "@tanstack/react-router";
import LastBallExperience from "@/components/LastBallExperience";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Last Ball — A Cinematic Birthday Tribute" },
      { name: "description", content: "An interactive cricket-themed cinematic birthday experience for a true legend." },
      { property: "og:title", content: "The Last Ball" },
      { property: "og:description", content: "Every legend has a story. Every innings has a moment." },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap" },
    ],
  }),
  component: () => <LastBallExperience />,
});
