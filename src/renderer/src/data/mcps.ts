export type MCPCategory = 'productivity' | 'development' | 'data' | 'web' | 'ai' | 'system'

export interface MCPServer {
  id: string
  name: string
  description: string
  longDescription: string
  category: MCPCategory
  author: string
  repoUrl: string
  iconEmoji: string
  tags: string[]
  installCmd: string
  startCmd: string
  requiresPython: boolean
  requiresNode: boolean
  version: string
  stars?: number
}

export const MCP_CATALOG: MCPServer[] = [
  {
    id: 'markitdown',
    name: 'MarkItDown',
    description: 'Convert files and documents to Markdown with ease.',
    longDescription:
      'Microsoft MarkItDown is a powerful utility for converting various file types (PDF, DOCX, PPTX, XLSX, images, HTML and more) to clean Markdown. Ideal for LLM document ingestion pipelines.',
    category: 'productivity',
    author: 'Microsoft',
    repoUrl: 'https://github.com/microsoft/markitdown',
    iconEmoji: '📄',
    tags: ['markdown', 'conversion', 'documents', 'microsoft'],
    installCmd: 'pip install markitdown[all]',
    startCmd: 'python3 -m markitdown',
    requiresPython: true,
    requiresNode: false,
    version: '0.1.1',
    stars: 38000
  },
  {
    id: 'filesystem',
    name: 'Filesystem',
    description: 'Secure file system read/write operations via MCP.',
    longDescription:
      'The official MCP Filesystem server provides tools for reading, writing, creating, moving and searching files and directories. Supports configurable access controls to limit scope.',
    category: 'system',
    author: 'Anthropic',
    repoUrl: 'https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem',
    iconEmoji: '📁',
    tags: ['files', 'filesystem', 'storage'],
    installCmd: 'npm install -g @modelcontextprotocol/server-filesystem',
    startCmd: 'npx @modelcontextprotocol/server-filesystem .',
    requiresPython: false,
    requiresNode: true,
    version: '0.6.2'
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Interact with GitHub repos, issues, PRs and more.',
    longDescription:
      'The GitHub MCP server exposes tools for managing repositories, reading files, creating issues and pull requests, searching code, and performing common Git operations — all via the GitHub REST API.',
    category: 'development',
    author: 'Anthropic',
    repoUrl: 'https://github.com/modelcontextprotocol/servers/tree/main/src/github',
    iconEmoji: '🐙',
    tags: ['git', 'github', 'repository', 'issues', 'pr'],
    installCmd: 'npm install -g @modelcontextprotocol/server-github',
    startCmd: 'npx @modelcontextprotocol/server-github',
    requiresPython: false,
    requiresNode: true,
    version: '0.6.2'
  },
  {
    id: 'brave-search',
    name: 'Brave Search',
    description: 'Web and local search powered by the Brave Search API.',
    longDescription:
      'Perform real-time web searches and local business/location queries using Brave Search. Returns titles, URLs, and summaries from live web results. Requires a Brave Search API key.',
    category: 'web',
    author: 'Anthropic',
    repoUrl: 'https://github.com/modelcontextprotocol/servers/tree/main/src/brave-search',
    iconEmoji: '🦁',
    tags: ['search', 'web', 'brave'],
    installCmd: 'npm install -g @modelcontextprotocol/server-brave-search',
    startCmd: 'npx @modelcontextprotocol/server-brave-search',
    requiresPython: false,
    requiresNode: true,
    version: '0.6.2'
  },
  {
    id: 'postgres',
    name: 'PostgreSQL',
    description: 'Connect to PostgreSQL databases and run read-only queries.',
    longDescription:
      'The PostgreSQL MCP server enables LLMs to connect to a Postgres database and execute read-only SQL queries. Exposes table schemas as resources and supports arbitrary SELECT queries as tools.',
    category: 'data',
    author: 'Anthropic',
    repoUrl: 'https://github.com/modelcontextprotocol/servers/tree/main/src/postgres',
    iconEmoji: '🐘',
    tags: ['database', 'sql', 'postgres'],
    installCmd: 'npm install -g @modelcontextprotocol/server-postgres',
    startCmd: 'npx @modelcontextprotocol/server-postgres',
    requiresPython: false,
    requiresNode: true,
    version: '0.6.2'
  },
  {
    id: 'sqlite',
    name: 'SQLite',
    description: 'Interact with SQLite databases for analysis and insights.',
    longDescription:
      'Query and write to local SQLite databases. The server provides tools for listing tables, reading schemas, executing SQL, and building an in-memory "memo" of business insights. Great for local analytics workflows.',
    category: 'data',
    author: 'Anthropic',
    repoUrl: 'https://github.com/modelcontextprotocol/servers/tree/main/src/sqlite',
    iconEmoji: '🗄️',
    tags: ['database', 'sqlite', 'sql', 'local'],
    installCmd: 'uvx mcp-server-sqlite',
    startCmd: 'uvx mcp-server-sqlite --db-path ~/data.db',
    requiresPython: true,
    requiresNode: false,
    version: '0.6.2'
  },
  {
    id: 'puppeteer',
    name: 'Puppeteer',
    description: 'Browser automation and web scraping via Puppeteer.',
    longDescription:
      'The Puppeteer MCP server controls a headless Chromium browser. It can navigate to URLs, take screenshots, click elements, fill forms, and execute JavaScript — enabling rich web interaction and scraping workflows.',
    category: 'web',
    author: 'Anthropic',
    repoUrl: 'https://github.com/modelcontextprotocol/servers/tree/main/src/puppeteer',
    iconEmoji: '🎭',
    tags: ['browser', 'automation', 'scraping', 'puppeteer'],
    installCmd: 'npm install -g @modelcontextprotocol/server-puppeteer',
    startCmd: 'npx @modelcontextprotocol/server-puppeteer',
    requiresPython: false,
    requiresNode: true,
    version: '0.6.2'
  },
  {
    id: 'fetch',
    name: 'Fetch',
    description: 'Retrieve and transform web content into Markdown.',
    longDescription:
      'The Fetch MCP server lets LLMs retrieve HTML pages, convert them to clean Markdown, and extract specific content. Supports pagination through long documents and raw HTML access when needed.',
    category: 'web',
    author: 'Anthropic',
    repoUrl: 'https://github.com/modelcontextprotocol/servers/tree/main/src/fetch',
    iconEmoji: '🌐',
    tags: ['http', 'web', 'fetch', 'scraping'],
    installCmd: 'uvx mcp-server-fetch',
    startCmd: 'uvx mcp-server-fetch',
    requiresPython: true,
    requiresNode: false,
    version: '0.6.2'
  },
  {
    id: 'memory',
    name: 'Memory',
    description: 'Persistent knowledge graph memory across conversations.',
    longDescription:
      'A knowledge-graph-based persistent memory system for Claude. Entities, relations, and observations are stored to disk, letting LLMs build and query a long-term memory across multiple chat sessions.',
    category: 'ai',
    author: 'Anthropic',
    repoUrl: 'https://github.com/modelcontextprotocol/servers/tree/main/src/memory',
    iconEmoji: '🧠',
    tags: ['memory', 'knowledge-graph', 'persistence', 'ai'],
    installCmd: 'npm install -g @modelcontextprotocol/server-memory',
    startCmd: 'npx @modelcontextprotocol/server-memory',
    requiresPython: false,
    requiresNode: true,
    version: '0.6.2'
  },
  {
    id: 'sequential-thinking',
    name: 'Sequential Thinking',
    description: 'Structured, step-by-step reasoning and problem solving.',
    longDescription:
      'The Sequential Thinking server provides a tool that encourages LLMs to break down complex problems into ordered steps, revise their thinking, branch hypotheses, and verify solutions before finalising answers.',
    category: 'ai',
    author: 'Anthropic',
    repoUrl:
      'https://github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking',
    iconEmoji: '🔢',
    tags: ['reasoning', 'thinking', 'ai', 'chain-of-thought'],
    installCmd: 'npm install -g @modelcontextprotocol/server-sequential-thinking',
    startCmd: 'npx @modelcontextprotocol/server-sequential-thinking',
    requiresPython: false,
    requiresNode: true,
    version: '0.6.2'
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Read channels, post messages and manage Slack workspaces.',
    longDescription:
      'The Slack MCP server connects to a Slack workspace via a bot token and user token. It exposes tools for listing channels, reading messages, posting replies, and managing reactions — great for building AI-powered Slack integrations.',
    category: 'productivity',
    author: 'Anthropic',
    repoUrl: 'https://github.com/modelcontextprotocol/servers/tree/main/src/slack',
    iconEmoji: '💬',
    tags: ['slack', 'messaging', 'collaboration'],
    installCmd: 'npm install -g @modelcontextprotocol/server-slack',
    startCmd: 'npx @modelcontextprotocol/server-slack',
    requiresPython: false,
    requiresNode: true,
    version: '0.6.2'
  },
  {
    id: 'google-maps',
    name: 'Google Maps',
    description: 'Location search, directions and geocoding via Google Maps.',
    longDescription:
      'Integrates Google Maps Platform to provide geocoding, reverse-geocoding, place search, route directions, and distance matrices. Ideal for location-aware AI applications.',
    category: 'web',
    author: 'Anthropic',
    repoUrl: 'https://github.com/modelcontextprotocol/servers/tree/main/src/google-maps',
    iconEmoji: '🗺️',
    tags: ['maps', 'location', 'google', 'geocoding'],
    installCmd: 'npm install -g @modelcontextprotocol/server-google-maps',
    startCmd: 'npx @modelcontextprotocol/server-google-maps',
    requiresPython: false,
    requiresNode: true,
    version: '0.6.2'
  }
]

export const CATEGORIES: { id: MCPCategory | 'all'; label: string; emoji: string }[] = [
  { id: 'all', label: 'All Servers', emoji: '🚀' },
  { id: 'productivity', label: 'Productivity', emoji: '⚡' },
  { id: 'development', label: 'Development', emoji: '🛠️' },
  { id: 'data', label: 'Data & Storage', emoji: '🗃️' },
  { id: 'web', label: 'Web & Browser', emoji: '🌍' },
  { id: 'ai', label: 'AI & Reasoning', emoji: '🤖' },
  { id: 'system', label: 'System', emoji: '⚙️' }
]
