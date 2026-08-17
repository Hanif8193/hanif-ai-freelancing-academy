import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/getting-started">
            Start Learning
          </Link>
        </div>
      </div>
    </header>
  );
}

function WhatYouWillLearn() {
  return (
    <section className={styles.section}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          What You'll Learn
        </Heading>
        <div className={styles.grid}>
          <div className={styles.card}>
            <Heading as="h3">Freelancing Fundamentals</Heading>
            <p>Master the basics of freelancing, from choosing your niche to building your profile and finding clients.</p>
          </div>
          <div className={styles.card}>
            <Heading as="h3">AI-Powered Development</Heading>
            <p>Learn to use AI coding agents, VS Code, and modern development tools to supercharge your workflow.</p>
          </div>
          <div className={styles.card}>
            <Heading as="h3">Spec-Driven Development</Heading>
            <p>Adopt professional development methodologies that power successful software projects.</p>
          </div>
          <div className={styles.card}>
            <Heading as="h3">Real-World Projects</Heading>
            <p>Build portfolio pieces and gain practical experience with hands-on projects.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function LearningJourney() {
  const steps = [
    'Beginner',
    'AI-Assisted Developer',
    'Spec-Driven Developer',
    'AI Agent Developer',
    'Advanced Freelancer',
    'AI-Powered Freelancer',
  ];

  return (
    <section className={clsx(styles.section, styles.sectionAlt)}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          Your Learning Journey
        </Heading>
        <div className={styles.journey}>
          {steps.map((step, index) => (
            <div key={step} className={styles.journeyStep}>
              <div className={styles.journeyNumber}>{index + 1}</div>
              <div className={styles.journeyText}>{step}</div>
              {index < steps.length - 1 && (
                <div className={styles.journeyArrow}>→</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TechnologyStack() {
  const technologies = [
    {name: 'Docusaurus', description: 'Modern documentation framework'},
    {name: 'TypeScript', description: 'Type-safe JavaScript'},
    {name: 'React', description: 'Component-based UI library'},
    {name: 'MDX', description: 'Markdown with JSX components'},
    {name: 'AI Coding Agents', description: 'Intelligent development assistants'},
    {name: 'VS Code', description: 'Professional code editor'},
  ];

  return (
    <section className={styles.section}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          Technology Stack
        </Heading>
        <div className={styles.grid}>
          {technologies.map((tech) => (
            <div key={tech.name} className={styles.card}>
              <Heading as="h3">{tech.name}</Heading>
              <p>{tech.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RealWorldProjects() {
  return (
    <section className={clsx(styles.section, styles.sectionAlt)}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          Real-World Projects
        </Heading>
        <p className={styles.sectionDescription}>
          Apply your skills to real-world freelancing projects. Build portfolio pieces, gain practical experience, and learn how to deliver professional results.
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--primary button--lg"
            to="/docs/projects">
            View Projects
          </Link>
        </div>
      </div>
    </section>
  );
}

function AIPoweredLearning() {
  return (
    <section className={styles.section}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          AI-Powered Learning
        </Heading>
        <p className={styles.sectionDescription}>
          Our platform leverages AI to provide personalized learning experiences. From AI coding agents to intelligent tutoring, we're building the future of education.
        </p>
        <div className={styles.grid}>
          <div className={styles.card}>
            <Heading as="h3">AI Coding Agents</Heading>
            <p>Learn to work with AI-powered development tools that boost your productivity.</p>
          </div>
          <div className={styles.card}>
            <Heading as="h3">Intelligent Assistance</Heading>
            <p>Get personalized help and guidance throughout your learning journey.</p>
          </div>
          <div className={styles.card}>
            <Heading as="h3">Smart Workflows</Heading>
            <p>Discover AI-powered freelancing workflows that save you time and effort.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function EnglishUrduLearning() {
  return (
    <section className={clsx(styles.section, styles.sectionAlt)}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          English + Urdu Learning
        </Heading>
        <p className={styles.sectionDescription}>
          Learn in the language you're most comfortable with. Our platform supports both English and Urdu, with consistent technical terminology across languages.
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--primary button--lg"
            to="/docs/about">
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}

function FutureAcademyFeatures() {
  const features = [
    {name: 'Ask the Book / RAG', description: 'Get answers from our content using AI', status: 'Coming Soon'},
    {name: 'Hanif AI Tutor', description: 'Personalized AI tutoring experience', status: 'Coming Soon'},
    {name: 'English ↔ Urdu Translator', description: 'Learn in your preferred language', status: 'Coming Soon'},
    {name: 'MCP Labs', description: 'Hands-on AI agent development', status: 'Coming Soon'},
    {name: 'AI Freelancing Agents', description: 'Automate your freelancing workflow', status: 'Coming Soon'},
    {name: 'Courses', description: 'Structured learning paths', status: 'Coming Soon'},
    {name: 'Community', description: 'Connect with other freelancers', status: 'Coming Soon'},
    {name: 'Mentorship', description: 'Get guidance from experts', status: 'Coming Soon'},
    {name: 'Certification', description: 'Validate your skills', status: 'Coming Soon'},
  ];

  return (
    <section className={styles.section}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          Future Academy Features
        </Heading>
        <p className={styles.sectionDescription}>
          We're continuously building new features to enhance your learning experience. Here's what's coming:
        </p>
        <div className={styles.grid}>
          {features.map((feature) => (
            <div key={feature.name} className={styles.card}>
              <Heading as="h3">{feature.name}</Heading>
              <p>{feature.description}</p>
              <span className={styles.badge}>{feature.status}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CallToAction() {
  return (
    <section className={clsx(styles.section, styles.sectionAlt)}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          Ready to Start Your Freelancing Journey?
        </Heading>
        <p className={styles.sectionDescription}>
          Join Hanif AI Freelancing Academy and learn how to build a successful freelancing career with the power of AI.
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--primary button--lg"
            to="/docs/getting-started">
            Start Learning Now
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/docs/about">
            Learn More About Us
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="Home"
      description="Hanif AI Freelancing Academy - Learn. Build. Freelance with AI. An interactive, AI-powered freelancing education platform.">
      <HomepageHeader />
      <main>
        <WhatYouWillLearn />
        <LearningJourney />
        <TechnologyStack />
        <RealWorldProjects />
        <AIPoweredLearning />
        <EnglishUrduLearning />
        <FutureAcademyFeatures />
        <CallToAction />
      </main>
    </Layout>
  );
}