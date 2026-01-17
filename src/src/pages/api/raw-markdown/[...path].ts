// Static generation of raw markdown API endpoints
// This file serves raw markdown content directly
// Accessible at /api/raw-markdown/[path].md

import type { GetStaticPaths, APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';

interface MarkdownFile {
  slug: string;
  filePath: string;
}

// Gather all markdown files at build time
function getAllMarkdownFiles(): MarkdownFile[] {
  const basePath = path.join(process.cwd(), 'src', 'content', 'docs');
  const files: MarkdownFile[] = [];
  
  function scanDirectory(dir: string, relativePath: string = '') {
    if (!fs.existsSync(dir)) return;
    
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath, path.join(relativePath, item));
      } else if (item.endsWith('.md') || item.endsWith('.mdx')) {
        const slug = path.join(relativePath, item.replace(/\.(md|mdx)$/, '')).replace(/\\/g, '/');
        files.push({
          slug,
          filePath: fullPath
        });
      }
    }
  }
  
  scanDirectory(basePath);
  return files;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const files = getAllMarkdownFiles();
  
  // Add manifest path
  const paths = [
    { params: { path: 'manifest' } },
    ...files.map(file => ({ params: { path: file.slug } }))
  ];
  
  return paths;
};

export const GET: APIRoute = async ({ params }) => {
  const slug = params.path || '';
  
  // Handle manifest request
  if (slug === 'manifest') {
    return generateManifest();
  }
  
  const basePath = path.join(process.cwd(), 'src', 'content', 'docs');
  
  // Try different extensions
  const extensions = ['.md', '.mdx'];
  let filePath: string | null = null;
  
  for (const ext of extensions) {
    const fullPath = path.join(basePath, slug + ext);
    if (fs.existsSync(fullPath)) {
      filePath = fullPath;
      break;
    }
    
    // Try with index file
    const indexPath = path.join(basePath, slug, 'index' + ext);
    if (fs.existsSync(indexPath)) {
      filePath = indexPath;
      break;
    }
  }
  
  if (!filePath) {
    return new Response(
      `# 404 - Not Found

Markdown file not found for path: \`${slug}\`

## Available paths:
- \`/api/raw-markdown/manifest\` - View all available documents
- \`/api/raw-markdown/{path}\` - Get raw markdown content

Please check the manifest for available document paths.
`,
      { 
        status: 404,
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8'
        }
      }
    );
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    return new Response(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    return new Response(
      `# 500 - Internal Server Error

An error occurred while processing the request for path: \`${slug}\`

Error: ${String(error)}

Please try again later or contact support if the problem persists.
`,
      { 
        status: 500,
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8'
        }
      }
    );
  }
};

function generateManifest() {
  const basePath = path.join(process.cwd(), 'src', 'content', 'docs');
  const files: Array<{
    path: string;
    title: string;
    description?: string;
    type: 'md' | 'mdx';
    apiUrl: string;
  }> = [];
  
  function scanDirectory(dir: string, relativePath: string = '') {
    if (!fs.existsSync(dir)) return;
    
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath, path.join(relativePath, item));
      } else if (item.endsWith('.md') || item.endsWith('.mdx')) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        const metadata = extractMetadata(content);
        const slug = path.join(relativePath, item.replace(/\.(md|mdx)$/, '')).replace(/\\/g, '/');
        
        files.push({
          path: slug,
          title: metadata.title || slug,
          description: metadata.description,
          type: item.endsWith('.mdx') ? 'mdx' : 'md',
          apiUrl: `/api/raw-markdown/${slug}`
        });
      }
    }
  }
  
  scanDirectory(basePath);
  
  // Generate markdown format manifest
  const markdownContent = `# MiCake Documentation Manifest

Generated at: ${new Date().toISOString()}

## Usage

Access individual documents directly:
- Get raw markdown: \`GET /api/raw-markdown/{path}\`
- Example: \`GET /api/raw-markdown/getting-started/introduction\`

All responses are raw markdown content with \`Content-Type: text/markdown\`.

## Available Documents

${files.map(file => `### ${file.title}
- **Path**: \`${file.path}\`
- **Type**: ${file.type}
- **API URL**: ${file.apiUrl}
${file.description ? `- **Description**: ${file.description}` : ''}

**Raw Content**: [${file.apiUrl}.md](${file.apiUrl}.md)
`).join('\n')}`;
  
  return new Response(markdownContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}

function extractMetadata(content: string): { title?: string; description?: string } {
  const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
  
  if (!frontmatterMatch) {
    return {};
  }
  
  const frontmatter = frontmatterMatch[1];
  const titleMatch = frontmatter.match(/^title:\s*['"]?(.+?)['"]?\s*$/m);
  const descriptionMatch = frontmatter.match(/^description:\s*['"]?(.+?)['"]?\s*$/m);
  
  return {
    title: titleMatch?.[1],
    description: descriptionMatch?.[1]
  };
}
