// M4 — Content Ingestion Script
// Run with: npm run ingest

import dotenv from 'dotenv';
import { getConfig, validateConfig } from '../src/rag/config';
import { createEmbeddingProvider } from '../src/rag/providers/factory';
import { InMemoryVectorStore } from '../src/rag/providers/vector-store/memory';
import { IngestionPipeline } from '../src/rag/ingestion/pipeline';

// Load environment variables
dotenv.config();

async function main() {
  console.log('Starting content ingestion...\n');

  try {
    const config = getConfig();
    validateConfig(config);

    console.log('Configuration:');
    console.log(`  - Embedding Provider: ${config.embeddingProvider}`);
    console.log(`  - Embedding Model: ${config.embeddingProvider === 'gemini' ? config.geminiEmbeddingModel : config.openaiEmbeddingModel}`);
    console.log(`  - Chunk Size: ${config.chunkSize}`);
    console.log(`  - Chunk Overlap: ${config.chunkOverlap}`);
    console.log('');

    // Initialize providers via factory
    const embeddingProvider = createEmbeddingProvider(config);

    const vectorStore = new InMemoryVectorStore({
      persistPath: 'data/vector-store.json',
    });

    const pipeline = new IngestionPipeline(
      embeddingProvider,
      vectorStore,
      config,
      'docs'
    );

    const result = await pipeline.ingest();

    console.log('\nIngestion Results:');
    console.log(`  - Documents Processed: ${result.documentsProcessed}`);
    console.log(`  - Chunks Created: ${result.chunksCreated}`);
    console.log(`  - Chunks Updated: ${result.chunksUpdated}`);

    if (result.errors.length > 0) {
      console.log(`\nErrors (${result.errors.length}):`);
      result.errors.forEach(error => console.log(`  - ${error}`));
    }

    console.log('\nIngestion complete!');
  } catch (error) {
    console.error('\nIngestion failed:', error);
    process.exit(1);
  }
}

main();
