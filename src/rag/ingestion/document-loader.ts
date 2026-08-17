// M4 — Document Loader
// Reads MDX files from the docs directory

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface LoadedDocument {
  filePath: string;
  relativePath: string;
  content: string;
  frontmatter: Record<string, unknown>;
}

export class DocumentLoader {
  private docsDir: string;
  private extensions: string[];

  constructor(docsDir: string = 'docs', extensions: string[] = ['.md', '.mdx']) {
    this.docsDir = docsDir;
    this.extensions = extensions;
  }

  async loadAll(): Promise<LoadedDocument[]> {
    const documents: LoadedDocument[] = [];
    
    if (!fs.existsSync(this.docsDir)) {
      console.warn(`Documents directory not found: ${this.docsDir}`);
      return documents;
    }

    const files = await this.walkDir(this.docsDir);
    
    for (const filePath of files) {
      try {
        const doc = this.loadFile(filePath);
        if (doc) {
          documents.push(doc);
        }
      } catch (error) {
        console.error(`Error loading ${filePath}:`, error);
      }
    }

    return documents;
  }

  loadFile(filePath: string): LoadedDocument | null {
    const ext = path.extname(filePath);
    
    if (!this.extensions.includes(ext)) {
      return null;
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const { data: frontmatter, content: body } = matter(content);
    
    const relativePath = path.relative(process.cwd(), filePath);
    const url = this.pathToUrl(relativePath);

    return {
      filePath,
      relativePath,
      content: body,
      frontmatter: {
        ...frontmatter,
        url,
      },
    };
  }

  private async walkDir(dir: string): Promise<string[]> {
    const files: string[] = [];
    
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        const subFiles = await this.walkDir(fullPath);
        files.push(...subFiles);
      } else if (entry.isFile() && this.extensions.includes(path.extname(entry.name))) {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  private pathToUrl(relativePath: string): string {
    // Convert file path to URL
    // docs/freelancing/what-is-freelancing.md -> /docs/freelancing/what-is-freelancing
    // Normalize to forward slashes for cross-platform compatibility
    let url = relativePath
      .replace(/\\/g, '/')
      .replace(/^docs\//, '/docs/')
      .replace(/\.mdx?$/, '')
      .replace(/\/index$/, '');
    
    // Ensure leading slash
    if (!url.startsWith('/')) {
      url = '/' + url;
    }
    
    return url;
  }
}
