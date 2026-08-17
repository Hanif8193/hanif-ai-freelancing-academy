// M4 — Ingestion Pipeline
// Orchestrates document loading, parsing, chunking, and embedding

import type { Chunk, EmbeddingProvider, VectorStore, IngestionResult } from '../types';
import type { RAGConfig } from '../config';
import { DocumentLoader } from './document-loader';
import { MarkdownParser } from './markdown-parser';
import { Chunker } from './chunker';

export class IngestionPipeline {
  private loader: DocumentLoader;
  private parser: MarkdownParser;
  private chunker: Chunker;
  private embeddingProvider: EmbeddingProvider;
  private vectorStore: VectorStore;
  private config: RAGConfig;

  constructor(
    embeddingProvider: EmbeddingProvider,
    vectorStore: VectorStore,
    config: RAGConfig,
    docsDir: string = 'docs'
  ) {
    this.loader = new DocumentLoader(docsDir);
    this.parser = new MarkdownParser();
    this.chunker = new Chunker({
      chunkSize: config.chunkSize,
      chunkOverlap: config.chunkOverlap,
    });
    this.embeddingProvider = embeddingProvider;
    this.vectorStore = vectorStore;
    this.config = config;
  }

  async ingest(): Promise<IngestionResult> {
    const result: IngestionResult = {
      documentsProcessed: 0,
      chunksCreated: 0,
      chunksUpdated: 0,
      errors: [],
    };

    try {
      // Load all documents
      console.log('Loading documents...');
      const documents = await this.loader.loadAll();
      console.log(`Loaded ${documents.length} documents`);

      // Process each document
      for (const doc of documents) {
        try {
          await this.processDocument(doc, result);
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : String(error);
          result.errors.push(`Error processing ${doc.relativePath}: ${errorMsg}`);
          console.error(`Error processing ${doc.relativePath}:`, error);
        }
      }

      console.log(`Ingestion complete: ${result.documentsProcessed} documents, ` +
                  `${result.chunksCreated + result.chunksUpdated} chunks`);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      result.errors.push(`Fatal error during ingestion: ${errorMsg}`);
      console.error('Fatal error during ingestion:', error);
    }

    return result;
  }

  private async processDocument(
    doc: { filePath: string; relativePath: string; content: string; frontmatter: Record<string, unknown> },
    result: IngestionResult
  ): Promise<void> {
    // Parse frontmatter for metadata
    const frontmatter = doc.frontmatter as {
      title?: string;
      sidebar_position?: number;
    };

    // Extract module, chapter, and title from path/frontmatter.
    // Title is computed first so chapter extraction can fall back to
    // the document title (e.g. "Chapter 02: How Freelancers Make Money").
    const module = this.parser.extractModule(doc.relativePath);
    const title = frontmatter?.title || this.parser.extractTitle(doc.content);
    const chapter = this.parser.extractChapter(doc.relativePath, title);
    const url = (doc.frontmatter.url as string) || `/docs/${module}/${chapter}`.replace(/\\/g, '/');

    // Parse markdown into sections
    const parsed = this.parser.parse(doc.content, {
      title,
      module,
      chapter,
      sourcePath: doc.relativePath.replace(/\\/g, '/'),
      url,
    });

    // Chunk the document
    const chunks = this.chunker.chunkDocument(parsed);
    
    if (chunks.length === 0) {
      console.log(`No chunks generated for ${doc.relativePath}`);
      return;
    }

    // Filter out empty chunks before embedding
    const validChunks = chunks.filter(chunk => chunk.content.trim().length > 0);
    if (validChunks.length === 0) {
      console.log(`No valid chunks for ${doc.relativePath}`);
      return;
    }

    // Idempotent check: skip if chunks already exist for this source
    const normalizedSource = doc.relativePath.replace(/\\/g, '/');
    const existingChunks = await this.vectorStore.get({ sourcePath: normalizedSource });
    if (existingChunks.length === validChunks.length) {
      console.log(`Skipping ${doc.relativePath} (${existingChunks.length} chunks already indexed)`);
      result.documentsProcessed++;
      return;
    }

    // Generate embeddings for all chunks
    console.log(`Generating embeddings for ${validChunks.length} chunks from ${doc.relativePath}...`);
    const texts = validChunks.map(chunk => chunk.content);
    const embeddings = await this.embeddingProvider.embedBatch(texts);

    // Assign embeddings to chunks
    for (let i = 0; i < validChunks.length; i++) {
      validChunks[i].embedding = embeddings[i];
    }

    // Upsert into vector store
    await this.vectorStore.upsert(validChunks);
    
    result.documentsProcessed++;
    result.chunksCreated += validChunks.length;
  }
}
