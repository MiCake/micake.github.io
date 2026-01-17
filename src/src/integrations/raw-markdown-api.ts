/**
 * Astro Integration for Raw Markdown API
 * 
 * This integration provides access to raw markdown content for AI parsing.
 * It creates an endpoint that serves the original markdown files.
 */

import type { AstroIntegration } from 'astro';
import fs from 'fs';
import path from 'path';

interface RawMarkdownOptions {
  /** Base path for markdown files, relative to src */
  contentPath?: string;
  /** Output directory for raw markdown files */
  outputDir?: string;
}

export default function rawMarkdownApi(options: RawMarkdownOptions = {}): AstroIntegration {
  const {
    contentPath = 'content/docs',
    outputDir = 'raw-markdown'
  } = options;

  return {
    name: 'raw-markdown-api',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const srcContentPath = path.join(process.cwd(), 'src', contentPath);
        const destPath = path.join(dir.pathname.replace('file:///', ''), outputDir);

        // Ensure output directory exists
        if (!fs.existsSync(destPath)) {
          fs.mkdirSync(destPath, { recursive: true });
        }

        // Copy all markdown files
        copyMarkdownFiles(srcContentPath, destPath, '');
        
        // Create an index.json manifest file
        const manifest = generateManifest(srcContentPath, '');
        fs.writeFileSync(
          path.join(destPath, 'index.json'),
          JSON.stringify(manifest, null, 2)
        );

        console.log(`✅ Raw markdown files copied to ${outputDir}/`);
      }
    }
  };
}

function copyMarkdownFiles(srcDir: string, destDir: string, relativePath: string): void {
  if (!fs.existsSync(srcDir)) return;

  const items = fs.readdirSync(srcDir);

  for (const item of items) {
    const srcPath = path.join(srcDir, item);
    const destPath = path.join(destDir, relativePath, item);
    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      // Recursively copy subdirectories
      const subDir = path.join(destDir, relativePath, item);
      if (!fs.existsSync(subDir)) {
        fs.mkdirSync(subDir, { recursive: true });
      }
      copyMarkdownFiles(srcPath, destDir, path.join(relativePath, item));
    } else if (item.endsWith('.md') || item.endsWith('.mdx')) {
      // Copy markdown files
      const destSubDir = path.join(destDir, relativePath);
      if (!fs.existsSync(destSubDir)) {
        fs.mkdirSync(destSubDir, { recursive: true });
      }
      fs.copyFileSync(srcPath, path.join(destSubDir, item));
    }
  }
}

interface ManifestEntry {
  path: string;
  title: string;
  type: 'md' | 'mdx';
  size: number;
}

interface Manifest {
  version: string;
  generatedAt: string;
  baseUrl: string;
  files: ManifestEntry[];
}

function generateManifest(srcDir: string, relativePath: string): Manifest {
  const files: ManifestEntry[] = [];
  
  function scanDirectory(dir: string, relPath: string): void {
    if (!fs.existsSync(dir)) return;

    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        scanDirectory(fullPath, path.join(relPath, item));
      } else if (item.endsWith('.md') || item.endsWith('.mdx')) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        const title = extractTitle(content) || item.replace(/\.(md|mdx)$/, '');
        
        files.push({
          path: path.join(relPath, item).replace(/\\/g, '/'),
          title,
          type: item.endsWith('.mdx') ? 'mdx' : 'md',
          size: stat.size
        });
      }
    }
  }

  scanDirectory(srcDir, '');

  return {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    baseUrl: '/raw-markdown/',
    files
  };
}

function extractTitle(content: string): string | null {
  // Try to extract title from frontmatter
  const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (frontmatterMatch) {
    const titleMatch = frontmatterMatch[1].match(/^title:\s*['"]?(.+?)['"]?\s*$/m);
    if (titleMatch) {
      return titleMatch[1];
    }
  }
  
  // Try to extract from first heading
  const headingMatch = content.match(/^#\s+(.+)$/m);
  if (headingMatch) {
    return headingMatch[1];
  }

  return null;
}
