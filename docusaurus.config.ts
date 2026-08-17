import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import ragPlugin from './src/rag/api/plugin';
import tutorPlugin from './src/tutor/api/plugin';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Hanif AI Freelancing Academy',
  tagline: 'Learn. Build. Freelance with AI.',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://hanif-ai-freelancing-academy.vercel.app',
  // Set the /<baseUrl>/ pathname under which your site is served
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'Hanif8193', // Usually your GitHub org/user name.
  projectName: 'hanif-ai-freelancing-academy', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/Hanif8193/hanif-ai-freelancing-academy/tree/main/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/Hanif8193/hanif-ai-freelancing-academy/tree/main/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [ragPlugin, tutorPlugin],

  themeConfig: {
    // Open Graph / social sharing card (1200x630). Branded SVG; replace with a
    // PNG export before launch for maximum social-platform support.
    image: 'img/hanif-ai-social-card.svg',
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Hanif AI Freelancing Academy',
      logo: {
        alt: 'Hanif AI Freelancing Academy Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Getting Started',
        },
        {
          to: '/docs/freelancing',
          label: 'Freelancing',
          position: 'left',
        },
        {
          to: '/docs/ai-development',
          label: 'AI Development',
          position: 'left',
        },
        {
          to: '/docs/spec-driven-development',
          label: 'Spec-Driven Dev',
          position: 'left',
        },
        {
          to: '/docs/projects',
          label: 'Projects',
          position: 'left',
        },
        {
          to: '/docs/resources',
          label: 'Resources',
          position: 'left',
        },
        {
          to: '/docs/about',
          label: 'About',
          position: 'left',
        },
        {
          to: '/ask-the-book',
          label: 'Ask the Book',
          position: 'left',
        },
        {
          to: '/tutor',
          label: 'AI Tutor',
          position: 'left',
        },
        {
          href: 'https://github.com/Hanif8193/hanif-ai-freelancing-academy',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Learning Paths',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/getting-started',
            },
            {
              label: 'Freelancing Fundamentals',
              to: '/docs/freelancing',
            },
            {
              label: 'AI-Powered Development',
              to: '/docs/ai-development',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/Hanif8193/hanif-ai-freelancing-academy',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'About',
              to: '/docs/about',
            },
            {
              label: 'Resources',
              to: '/docs/resources',
            },
            {
              label: 'Blog',
              to: '/blog',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Hanif AI Freelancing Academy. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'typescript', 'javascript'],
    },
    // NOTE (M8): Algolia DocSearch is intentionally DISABLED — the previous
    // placeholder credentials (YOUR_APP_ID / YOUR_ALGOLIA_API_KEY) would make
    // the search UI fail at runtime. Re-enable search only with real
    // DocSearch/Algolia credentials (see README -> Search).
  } satisfies Preset.ThemeConfig,
};

export default config;