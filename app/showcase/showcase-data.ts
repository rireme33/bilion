export type ShowcaseItem = {
  name: string;
  route: string;
  description: string;
  buyer: string;
  revenueIdea: string;
  buildTime: string;
  signal: string;
  accent: string;
  metrics: string[];
  thumbnail: string;
};

export const showcaseItems: ShowcaseItem[] = [
  {
    name: "Video Pattern Lab",
    route: "/video-pattern-lab",
    description:
      "Upload a short-form video and extract why it works, what to copy, and how to rewrite it for Bilion.",
    buyer: "Creators, AI builders, vibe coders, solo founders",
    revenueIdea: "$19 one-time or $49 creator lab",
    buildTime: "10 minutes",
    signal: "Creators struggle to reverse-engineer viral short videos into repeatable content systems.",
    accent: "from-cyan-300 via-sky-500 to-violet-500",
    metrics: ["Video upload", "Frame extraction", "Rewrite engine"],
    thumbnail: "/showcase/video-pattern-lab.png",
  },
  {
    name: "Short Video Pattern Analyzer",
    route: "/short-video-pattern-analyzer",
    description:
      "Paste messy video notes and turn them into hook, retention, psychology, pattern, and scripts.",
    buyer: "AI creators, product marketers, short-form content builders",
    revenueIdea: "$19 pattern pack or $49/month creator lab",
    buildTime: "10 minutes",
    signal: "Short-form creators need reusable structures, not vague advice.",
    accent: "from-emerald-300 via-teal-500 to-cyan-500",
    metrics: ["Hook map", "Pattern JSON", "Script options"],
    thumbnail: "/showcase/short-video-pattern-analyzer.png",
  },
  {
    name: "Done-for-You Local Review Reply Copilot",
    route: "/done-for-you-local-review-reply-copilot-outputs-setup",
    description:
      "Turn messy customer reviews into reply options, owner-review flags, and a done-for-you service offer.",
    buyer: "Restaurants, clinics, salons, local shops",
    revenueIdea: "$500 setup + $150/month",
    buildTime: "10 minutes",
    signal: "Local businesses are using AI to respond faster to customer reviews.",
    accent: "from-amber-200 via-orange-400 to-rose-500",
    metrics: ["Reply options", "Owner flags", "Service offer"],
    thumbnail: "/showcase/review-reply-copilot.png",
  },
  {
    name: "Jobsite Notes to Daily Reports",
    route: "/jobsite-notes-daily-reports",
    description:
      "Turn messy construction notes, weather, crew counts, and blockers into client-ready daily reports.",
    buyer: "Small contractors and field service teams",
    revenueIdea: "$49/month",
    buildTime: "10 minutes",
    signal: "Construction teams use AI to turn scattered field notes into standard daily reports.",
    accent: "from-lime-200 via-emerald-500 to-slate-500",
    metrics: ["Daily report", "Blocker list", "Next actions"],
    thumbnail: "/showcase/jobsite-notes-daily-reports.png",
  },
  {
    name: "Shift Briefs Prompt System for Independent Restaurants",
    route: "/app/shift-briefs-prompt-system",
    description:
      "Turn messy restaurant manager notes into shift briefs, prep lists, blockers, and handoff summaries.",
    buyer: "Builders, freelancers, operators, and consultants serving independent restaurants",
    revenueIdea: "$19 one-time",
    buildTime: "10 minutes",
    signal: "Independent restaurant shift notes are scattered, and generic AI prompts create inconsistent handoffs.",
    accent: "from-yellow-200 via-amber-500 to-red-500",
    metrics: ["15 prompts", "Before/after", "Copy buttons"],
    thumbnail: "/showcase/shift-briefs-prompt-system.png",
  },
];
