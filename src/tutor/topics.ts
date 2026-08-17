// M5 — Academy topics map
// Known chapters/modules with their real documentation URLs. Used by the
// Learning Path mode to resolve a recommended topic to a real link — the
// Tutor never fabricates URLs.

export interface AcademyTopic {
  title: string;
  url: string;
  module: string;
  chapter?: string;
}

export const ACADEMY_TOPICS: AcademyTopic[] = [
  { title: 'What Is Freelancing?', url: '/docs/freelancing/what-is-freelancing', module: 'freelancing', chapter: '01' },
  { title: 'How Freelancers Make Money', url: '/docs/freelancing/how-freelancers-make-money', module: 'freelancing', chapter: '02' },
  { title: 'Choosing Your Freelancing Niche', url: '/docs/freelancing/choosing-your-niche', module: 'freelancing', chapter: '03' },
  { title: 'Building Your Developer Profile', url: '/docs/freelancing/building-your-profile', module: 'freelancing', chapter: '04' },
  { title: 'What Are AI Coding Agents?', url: '/docs/ai-development/what-are-ai-coding-agents', module: 'ai-development', chapter: '05' },
  { title: 'Setting Up VS Code for AI-Powered Development', url: '/docs/ai-development/setting-up-vs-code', module: 'ai-development', chapter: '06' },
  { title: 'Git & GitHub for Freelancers', url: '/docs/ai-development/git-and-github', module: 'ai-development', chapter: '07' },
  { title: 'AI-Assisted vs Agentic Development', url: '/docs/ai-development/ai-assisted-vs-agentic', module: 'ai-development', chapter: '08' },
  { title: 'What Is Spec-Driven Development?', url: '/docs/spec-driven-development/what-is-spec-driven-development', module: 'spec-driven-development', chapter: '09' },
  { title: 'Your First Spec-Kit Project', url: '/docs/spec-driven-development/your-first-spec-kit-project', module: 'spec-driven-development', chapter: '10' },
  { title: 'Getting Started', url: '/docs/getting-started', module: 'getting-started' },
  { title: 'Projects', url: '/docs/projects', module: 'projects' },
  { title: 'Resources', url: '/docs/resources', module: 'resources' },
  { title: 'About', url: '/docs/about', module: 'about' },
];

/** Order of chapters for sequential learning-path recommendations. */
export const CHAPTER_ORDER = ACADEMY_TOPICS.filter((t) => t.chapter).sort(
  (a, b) => parseInt(a.chapter!, 10) - parseInt(b.chapter!, 10)
);

/**
 * Resolve a free-form topic string to a real Academy URL when it clearly
 * matches a known topic; otherwise returns undefined (never fabricates).
 * Distinctive rules are checked first so weak words like "freelancing" do not
 * shadow specific matches like "Git".
 */
export function resolveTopicUrl(topic: string): string | undefined {
  const normalized = topic.toLowerCase();

  // Distinctive specific rules first.
  if (/\bgit\b|github|version control/i.test(normalized)) {
    return '/docs/ai-development/git-and-github';
  }
  if (/vs ?code|visual studio/i.test(normalized)) {
    return '/docs/ai-development/setting-up-vs-code';
  }
  if (/spec[-\.\s]?kit/i.test(normalized)) {
    return '/docs/spec-driven-development/your-first-spec-kit-project';
  }
  if (/spec[-\.\s]?driven|spec-driven development/i.test(normalized)) {
    return '/docs/spec-driven-development/what-is-spec-driven-development';
  }
  if (/\brag\b|retrieval-augmented|vector database/i.test(normalized)) {
    return '/docs/ai-development/what-are-ai-coding-agents';
  }
  if (/agentic/i.test(normalized)) {
    return '/docs/ai-development/ai-assisted-vs-agentic';
  }
  if (/coding agent|ai agent/i.test(normalized)) {
    return '/docs/ai-development/what-are-ai-coding-agents';
  }
  if (/niche/i.test(normalized)) {
    return '/docs/freelancing/choosing-your-niche';
  }
  if (/profile/i.test(normalized)) {
    return '/docs/freelancing/building-your-profile';
  }
  if (/make money|income|revenue|pricing|money/i.test(normalized)) {
    return '/docs/freelancing/how-freelancers-make-money';
  }
  if (/freelanc/i.test(normalized)) {
    return '/docs/freelancing/what-is-freelancing';
  }
  if (/project/i.test(normalized)) {
    return '/docs/projects';
  }
  if (/getting started|start here|intro/i.test(normalized)) {
    return '/docs/getting-started';
  }
  if (/resource|template/i.test(normalized)) {
    return '/docs/resources';
  }
  if (/about the academy|about us/i.test(normalized)) {
    return '/docs/about';
  }

  // Generic fallback: title keywords (still only ever returns real URLs).
  for (const entry of ACADEMY_TOPICS) {
    const title = entry.title.toLowerCase();
    const keywords = title.split(' ').filter((w) => w.length > 4);
    if (keywords.some((kw) => normalized.includes(kw))) {
      return entry.url;
    }
  }

  return undefined;
}
