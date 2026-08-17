// M5 — Hanif AI Tutor Page
// Chat interface with mode/language/level selectors, suggested prompts,
// source cards, and the same error/timeout UX as Ask the Book.

import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Markdown from '@site/src/components/Markdown';
import styles from './AskTheBook.module.css';
import tutorStyles from './Tutor.module.css';
import { ASK_TIMEOUT_MS, getFriendlyErrorMessage } from '../lib/ask-the-book-errors';
import type { Source } from '../rag/types';
import type { TutorMode, TutorResponse } from '../tutor/types';

// ============================================================
// Types & constants
// ============================================================

const MODES: { value: TutorMode; label: string }[] = [
  { value: 'ask', label: 'Ask' },
  { value: 'teach', label: 'Teach' },
  { value: 'explain', label: 'Explain' },
  { value: 'practice', label: 'Practice' },
  { value: 'quiz', label: 'Quiz' },
  { value: 'assessment', label: 'Assessment' },
  { value: 'learning-path', label: 'Learning Path' },
  { value: 'translation', label: 'Translation' },
];

const LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
] as const;

const SUGGESTED_PROMPTS: { label: string; question: string; mode: TutorMode }[] = [
  { label: 'What is freelancing?', question: 'What is freelancing?', mode: 'ask' },
  { label: 'Teach me freelancing from beginner level', question: 'Teach me freelancing from beginner level', mode: 'teach' },
  { label: 'Explain RAG like I am a beginner', question: 'Explain RAG like I am a beginner', mode: 'explain' },
  { label: 'Give me a practice exercise on Git', question: 'Give me a practice exercise on Git', mode: 'practice' },
  { label: 'Quiz me on AI coding agents', question: 'Quiz me on AI coding agents', mode: 'quiz' },
  { label: 'What should I study next?', question: 'What should I study next?', mode: 'learning-path' },
  { label: 'Explain RAG in Urdu for a beginner', question: 'Explain RAG in Urdu for a beginner', mode: 'explain' },
];

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  response?: TutorResponse;
  timestamp: Date;
}

// ============================================================
// Helpers
// ============================================================

function responseToMarkdown(response: TutorResponse): string {
  const parts: string[] = [];

  if (response.directAnswer) parts.push(response.directAnswer);
  if (response.explanation) parts.push(`### Explanation\n\n${response.explanation}`);
  if (response.example) parts.push(`### Example\n\n${response.example}`);

  if (response.exercise) {
    parts.push(
      `### Exercise: ${response.exercise.title}\n\n${response.exercise.instructions}${
        response.exercise.topic ? `\n\n*Topic: ${response.exercise.topic}*` : ''
      }`
    );
  }

  if (response.assessment) {
    const a = response.assessment;
    parts.push(
      `### Assessment\n\n**Verdict:** ${a.verdict}\n\n**What is correct:** ${a.whatIsCorrect}\n\n**What is missing:** ${a.whatIsMissing}\n\n**Feedback:** ${a.feedback}${
        a.suggestedNext ? `\n\n**Suggested next step:** ${a.suggestedNext}` : ''
      }`
    );
  }

  if (response.quiz && response.quiz.length > 0) {
    parts.push('### Quiz');
    response.quiz.forEach((item, i) => {
      parts.push(`**${i + 1}. ${item.question}**`);
      item.options.forEach((option, j) => {
        parts.push(`${j === item.correctIndex ? '✅' : ''} ${j + 1}. ${option}`);
      });
      if (item.explanation) {
        parts.push(`*Answer: ${item.options[item.correctIndex] ?? '—'} — ${item.explanation}*`);
      }
    });
  }

  if (response.recommendedNext) {
    parts.push(
      `### Next up\n\n**${response.recommendedNext.topic}**${
        response.recommendedNext.url ? ` — [Open chapter](${response.recommendedNext.url})` : ''
      }${response.recommendedNext.reason ? `\n\n${response.recommendedNext.reason}` : ''}`
    );
  }

  if (response.insufficientInfo) {
    parts.push('_The Academy content does not contain enough information to fully answer this._');
  }

  return parts.join('\n\n');
}

// ============================================================
// Component
// ============================================================

export default function Tutor(): React.ReactNode {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [learnerAnswer, setLearnerAnswer] = useState('');
  const [mode, setMode] = useState<TutorMode>('ask');
  const [language, setLanguage] = useState<'en' | 'ur'>('en');
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendQuestion = async (question: string, modeOverride?: TutorMode, languageOverride?: 'en' | 'ur', levelOverride?: 'beginner' | 'intermediate' | 'advanced') => {
    const trimmed = question.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = {
      id: `u-${Date.now()}`,
      type: 'user',
      content: trimmed,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setError(null);
    setIsLoading(true);

    const history = messages.slice(-6).map((m) => ({ role: m.type, content: m.content }));

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), ASK_TIMEOUT_MS);

    try {
      const response = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: trimmed,
          mode: modeOverride ?? mode,
          language: languageOverride ?? language,
          level: levelOverride ?? level,
          context: { learnerAnswer: learnerAnswer.trim() || undefined },
          history,
        }),
        signal: controller.signal,
      });

      let data: TutorResponse | null = null;
      let apiCode: string | undefined;
      try {
        const body = await response.json();
        data = body;
        apiCode = body?.code;
      } catch {
        // non-JSON body
      }

      if (!response.ok || !data) {
        setError(getFriendlyErrorMessage(null, response.status, apiCode));
        return;
      }

      const assistantMessage: Message = {
        id: `a-${Date.now()}`,
        type: 'assistant',
        content: responseToMarkdown(data),
        response: data,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(getFriendlyErrorMessage(err));
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendQuestion(inputValue);
  };

  const handleSuggestedPrompt = (prompt: { question: string; mode: TutorMode }) => {
    setMode(prompt.mode);
    sendQuestion(prompt.question, prompt.mode);
  };

  const handleSuggestedTopic = (topic: string) => {
    sendQuestion(topic);
  };

  return (
    <Layout title="AI Tutor" description="Hanif AI Tutor — your AI teaching assistant for the Hanif AI Freelancing Academy">
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1>🎓 Hanif AI Tutor</h1>
            <p>Your AI teaching assistant — ask, learn, practice, and get quizzed on the Academy content.</p>
          </div>

          <div className={tutorStyles.controls} role="group" aria-label="Tutor options">
            <label className={tutorStyles.control}>
              <span>Mode</span>
              <select value={mode} onChange={(e) => setMode(e.target.value as TutorMode)} disabled={isLoading} aria-label="Tutor mode">
                {MODES.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </label>
            <label className={tutorStyles.control}>
              <span>Language</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'ur')}
                disabled={isLoading}
                aria-label="Response language"
              >
                <option value="en">English</option>
                <option value="ur">Urdu (اردو)</option>
              </select>
            </label>
            <label className={tutorStyles.control}>
              <span>Level</span>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as 'beginner' | 'intermediate' | 'advanced')}
                disabled={isLoading}
                aria-label="Learner level"
              >
                {LEVELS.map((l) => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
            </label>
          </div>

          <div className={styles.chatContainer}>
            <div className={styles.messages} aria-live="polite">
              {messages.length === 0 && (
                <div className={styles.welcome}>
                  <div className={styles.welcomeIcon}>🎓</div>
                  <h2>Welcome to Hanif AI Tutor</h2>
                  <p>
                    Pick a mode (or just ask) and the Tutor will answer with Academy-grounded content
                    and sources. Translation mode is coming in Milestone 6.
                  </p>
                  <div className={styles.suggestedQuestions}>
                    <h3>Try asking:</h3>
                    <ul>
                      {SUGGESTED_PROMPTS.map((prompt) => (
                        <li key={prompt.question}>
                          <button
                            className={tutorStyles.suggestedButton}
                            onClick={() => handleSuggestedPrompt(prompt)}
                            disabled={isLoading}
                          >
                            {prompt.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <div key={message.id} className={clsx(styles.message, message.type === 'user' ? styles.user : styles.assistant)}>
                  <div className={styles.messageContent}>
                    {message.type === 'user' ? (
                      <div className={styles.userMessage}>{message.content}</div>
                    ) : (
                      <div className={tutorStyles.assistantBlock}>
                        <div className={styles.assistantMessage}>
                          <Markdown text={message.content} />
                        </div>

                        {message.response && message.response.insufficientInfo && (
                          <div className={tutorStyles.insufficientInfo} role="status">
                            <strong>Not enough Academy content.</strong>
                            {message.response.suggestedTopics && message.response.suggestedTopics.length > 0 && (
                              <div className={styles.suggestedTopics}>
                                <h4>You might be interested in:</h4>
                                <ul>
                                  {message.response.suggestedTopics.map((topic, i) => (
                                    <li key={i}>
                                      <button onClick={() => handleSuggestedTopic(topic)} disabled={isLoading}>
                                        {topic}
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}

                        {message.response && message.response.sources && message.response.sources.length > 0 && (
                          <div className={styles.sources}>
                            <h4>Sources</h4>
                            <ul>
                              {message.response.sources.map((source: Source, i: number) => (
                                <li key={i}>
                                  <a href={source.url}>
                                    📚 {source.title} — {source.section}
                                  </a>
                                  {source.excerpt && <p className={styles.excerpt}>{source.excerpt}</p>}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className={clsx(styles.message, styles.assistant)}>
                  <div className={styles.typingIndicator}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}

              {error && (
                <div className={styles.error} role="alert">
                  <p>{error}</p>
                  <button onClick={() => setError(null)}>Dismiss</button>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <form className={styles.inputForm} onSubmit={handleSubmit}>
              <div className={tutorStyles.inputColumn}>
                {mode === 'assessment' && (
                  <textarea
                    className={tutorStyles.answerInput}
                    value={learnerAnswer}
                    onChange={(e) => setLearnerAnswer(e.target.value)}
                    placeholder="Your answer to be assessed..."
                    rows={2}
                    disabled={isLoading}
                    aria-label="Your answer (for assessment)"
                  />
                )}
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask the Tutor anything about the Academy..."
                  rows={2}
                  disabled={isLoading}
                  aria-label="Question for the Tutor"
                />
              </div>
              <button type="submit" disabled={isLoading || !inputValue.trim()}>
                {isLoading ? 'Thinking...' : 'Ask Tutor'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </Layout>
  );
}
