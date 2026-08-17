// M4 — Ask the Book Page Component
// M4 P0 — Client timeout + user-friendly error messages.

import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import styles from './AskTheBook.module.css';
import { ASK_TIMEOUT_MS, getFriendlyErrorMessage } from '../lib/ask-the-book-errors';

interface Source {
  title: string;
  section: string;
  url: string;
  excerpt?: string;
}

interface AskResponse {
  answer: string;
  sources: Source[];
  insufficientInfo: boolean;
  suggestedTopics?: string[];
}

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  sources?: Source[];
  suggestedTopics?: string[];
  timestamp: Date;
}

export default function AskTheBook(): React.ReactNode {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const question = inputValue.trim();
    if (!question) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: question,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    // Abort the request if the AI service takes too long.
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), ASK_TIMEOUT_MS);

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
        signal: controller.signal,
      });

      let data: AskResponse | null = null;
      let apiCode: string | undefined;
      try {
        const body = await response.json();
        data = body;
        apiCode = body?.code;
      } catch {
        // Non-JSON body — fall through to generic error handling.
      }

      if (!response.ok) {
        // Never show raw server/provider errors.
        setError(getFriendlyErrorMessage(null, response.status, apiCode));
        return;
      }

      if (!data) {
        setError(getFriendlyErrorMessage(null, response.status, apiCode));
        return;
      }

      // Add assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: data.answer,
        sources: data.sources,
        suggestedTopics: data.suggestedTopics,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setError(getFriendlyErrorMessage(err));
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSuggestedTopic = (topic: string) => {
    setInputValue(topic);
    inputRef.current?.focus();
  };

  return (
    <Layout
      title="Ask the Book"
      description="Ask questions about the Hanif AI Freelancing Academy content"
    >
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1>Ask the Book</h1>
            <p>Ask questions about freelancing, AI development tools, and spec-driven development</p>
          </div>

          <div className={styles.chatContainer}>
            <div className={styles.messages}>
              {messages.length === 0 && (
                <div className={styles.welcome}>
                  <div className={styles.welcomeIcon}>📚</div>
                  <h2>Welcome to Ask the Book</h2>
                  <p>Ask any question about the course content and I'll help you find the answer.</p>
                  
                  <div className={styles.suggestedQuestions}>
                    <h3>Try asking:</h3>
                    <ul>
                      <li onClick={() => handleSuggestedTopic('What is freelancing?')}>
                        What is freelancing?
                      </li>
                      <li onClick={() => handleSuggestedTopic('How do AI coding agents work?')}>
                        How do AI coding agents work?
                      </li>
                      <li onClick={() => handleSuggestedTopic('What is spec-driven development?')}>
                        What is spec-driven development?
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={clsx(styles.message, styles[message.type])}
                >
                  <div className={styles.messageContent}>
                    {message.type === 'user' ? (
                      <div className={styles.userMessage}>{message.content}</div>
                    ) : (
                      <>
                        <div className={styles.assistantMessage}>{message.content}</div>
                        
                        {message.sources && message.sources.length > 0 && (
                          <div className={styles.sources}>
                            <h4>Sources:</h4>
                            <ul>
                              {message.sources.map((source, index) => (
                                <li key={index}>
                                  <a href={source.url}>
                                    {source.title} - {source.section}
                                  </a>
                                  {source.excerpt && (
                                    <p className={styles.excerpt}>{source.excerpt}</p>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {message.suggestedTopics && message.suggestedTopics.length > 0 && (
                          <div className={styles.suggestedTopics}>
                            <h4>You might also be interested in:</h4>
                            <ul>
                              {message.suggestedTopics.map((topic, index) => (
                                <li key={index}>
                                  <button onClick={() => handleSuggestedTopic(topic)}>
                                    {topic}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </>
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
                <div className={styles.error}>
                  <p>{error}</p>
                  <button onClick={() => setError(null)}>Dismiss</button>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <form className={styles.inputForm} onSubmit={handleSubmit}>
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question about the course content..."
                rows={2}
                disabled={isLoading}
              />
              <button type="submit" disabled={isLoading || !inputValue.trim()}>
                {isLoading ? 'Thinking...' : 'Ask'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </Layout>
  );
}
