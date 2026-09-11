export type McpServer = {
  id: string;
  name: string;
  org: string;
  description: string;
  category: string;
  tags: string[];
  tools: string[];
  install: string;
  runtime: "npx" | "uvx" | "pip" | "docker";
  verified: boolean;
  stars: number;
  icon: string;
};

export const MCP_CATEGORIES = [
  "All",
  "Developer Tools",
  "Productivity",
  "Database",
  "Monitoring",
  "Browser & Automation",
  "Design",
  "Data & Analytics",
  "Communication",
] as const;

export const MCP_SERVERS: McpServer[] = [
  {
    id: "github-mcp",
    name: "GitHub",
    org: "GitHub Official",
    description:
      "Create and manage repositories, issues, pull requests, code search, and more directly from your AI assistant.",
    category: "Developer Tools",
    tags: ["git", "repos", "issues", "pr"],
    tools: ["create_repository", "search_code", "create_issue", "list_pull_requests", "get_file_contents"],
    install: "npx -y @modelcontextprotocol/server-github",
    runtime: "npx",
    verified: true,
    stars: 39500,
    icon: "🐙",
  },
  {
    id: "slack-mcp",
    name: "Slack",
    org: "Slack",
    description:
      "Send and read messages, manage channels, react to threads, and search workspace history.",
    category: "Communication",
    tags: ["chat", "channels", "threads"],
    tools: ["post_message", "list_channels", "fetch_history", "react_to_message"],
    install: "docker: slack-mcp",
    runtime: "docker",
    verified: true,
    stars: 21000,
    icon: "💬",
  },
  {
    id: "postgres-mcp",
    name: "PostgreSQL",
    org: "modelcontextprotocol",
    description:
      "Query, inspect, and manage PostgreSQL databases with all popular clients, schema-aware auto-completion.",
    category: "Database",
    tags: ["sql", "schema", "queries"],
    tools: ["execute_query", "list_tables", "describe_table", "run_transaction"],
    install: "npx -y @modelcontextprotocol/server-postgres",
    runtime: "npx",
    verified: true,
    stars: 14200,
    icon: "🐘",
  },
  {
    id: "playwright-mcp",
    name: "Playwright",
    org: "Microsoft",
    description:
      "Browser automation and testing — navigate, click, fill forms, take screenshots, and inspect page state.",
    category: "Browser & Automation",
    tags: ["browser", "automation", "testing"],
    tools: ["browser_navigate", "browser_click", "browser_type", "browser_screenshot"],
    install: "npx -y @playwright/mcp@latest",
    runtime: "npx",
    verified: true,
    stars: 12800,
    icon: "🎭",
  },
  {
    id: "notion-mcp",
    name: "Notion",
    org: "Notion Official",
    description:
      "Read and write pages, databases, and blocks across your Notion workspace from any AI chat.",
    category: "Productivity",
    tags: ["pages", "databases", "notes"],
    tools: ["search", "create_page", "append_block", "query_database"],
    install: "npx -y @notionhq/mcp-server",
    runtime: "npx",
    verified: true,
    stars: 9800,
    icon: "📒",
  },
  {
    id: "figma-mcp",
    name: "Figma",
    org: "Figma Community",
    description:
      "Fetch file structure, components, and code from Figma designs to hand off to your AI.",
    category: "Design",
    tags: ["design", "frames", "components"],
    tools: ["get_file", "get_file_components", "extract_code", "search_nodes"],
    install: "npx -y @figma/figma-mcp-server",
    runtime: "npx",
    verified: false,
    stars: 7600,
    icon: "🎨",
  },
  {
    id: "stripe-mcp",
    name: "Stripe",
    org: "Stripe",
    description:
      "Inspect customers, payments, products, and disputes. Run refunds and look up subscription state.",
    category: "Developer Tools",
    tags: ["payments", "billing", "customers"],
    tools: ["lookup_payment", "list_customers", "create_refund", "get_subscription"],
    install: "pip install stripe-mcp-server",
    runtime: "pip",
    verified: true,
    stars: 6800,
    icon: "💳",
  },
  {
    id: "google-drive-mcp",
    name: "Google Drive",
    org: "Google",
    description:
      "Search, read, and organize files in Drive — the official server from Google Wildcard.",
    category: "Productivity",
    tags: ["files", "docs", "sheets"],
    tools: ["search_files", "get_file", "get_metadata", "export"],
    install: "npx -y @google-ai-studio/google-drive-mcp",
    runtime: "npx",
    verified: true,
    stars: 6400,
    icon: "📁",
  },
  {
    id: "sequential-mcp",
    name: "Sequential Thinking",
    org: "modelcontextprotocol",
    description:
      "Tool for breaking down complex problems into structured, revisable steps for deep analysis.",
    category: "Developer Tools",
    tags: ["reasoning", "planning"],
    tools: ["sequentialthinking"],
    install: "npx -y @modelcontextprotocol/server-sequential-thinking",
    runtime: "npx",
    verified: true,
    stars: 5800,
    icon: "🧠",
  },
  {
    id: "supabase-mcp",
    name: "Supabase",
    org: "Supabase Official",
    description:
      "Query, generate, and manage postgres, storage buckets, and edge functions for Supabase projects.",
    category: "Database",
    tags: ["postgres", "storage", "realtime"],
    tools: ["query_database", "manage_buckets", "list_functions", "execute_sql"],
    install: "npx -y @supabase/mcp",
    runtime: "npx",
    verified: true,
    stars: 5400,
    icon: "⚡",
  },
  {
    id: "chroma-mcp",
    name: "Chroma DB",
    org: "chroma-core",
    description:
      "Vector store with embeddings — add documents, search semantic similarity, and manage collections.",
    category: "Data & Analytics",
    tags: ["vector", "embeddings", "rag"],
    tools: ["add_documents", "query_collection", "list_collections", "embed_documents"],
    install: "uvx chroma-mcp@latest",
    runtime: "uvx",
    verified: true,
    stars: 5000,
    icon: "🧬",
  },
  {
    id: "canvas-mcp",
    name: "Canvas",
    org: "Canvas LMS",
    description:
      "Create and manage assignments, courses, submissions, and announcements in Canvas LMS.",
    category: "Productivity",
    tags: ["lms", "courses", "assignments"],
    tools: ["create_assignment", "list_courses", "get_submissions", "manage_announcements"],
    install: "pip install canvas-mcp",
    runtime: "pip",
    verified: false,
    stars: 4400,
    icon: "🎓",
  },
  {
    id: "firecrawl-mcp",
    name: "Firecrawl",
    org: "Firecrawl",
    description:
      "Crawl and search the web, scrape pages to markdown, and extract structured data with one API.",
    category: "Data & Analytics",
    tags: ["scrape", "crawl", "web"],
    tools: ["scrape_url", "crawl_website", "search_web", "map_website"],
    install: "npx -y firecrawl-mcp",
    runtime: "npx",
    verified: true,
    stars: 4200,
    icon: "🔥",
  },
  {
    id: "pdf-mcp",
    name: "PDF Tools",
    org: "modelcontextprotocol",
    description:
      "Create and manipulate PDF files — merge, split, extract text, and add annotations.",
    category: "Productivity",
    tags: ["documents", "pdf"],
    tools: ["create_pdf", "merge_pdfs", "extract_text", "add_annotation"],
    install: "npx -y @modelcontextprotocol/server-pdf",
    runtime: "npx",
    verified: true,
    stars: 3900,
    icon: "📄",
  },
  {
    id: "sentry-mcp",
    name: "Sentry",
    org: "Sentry",
    description:
      "Pull issues, events, performance traces, and error details straight from your Sentry org.",
    category: "Monitoring",
    tags: ["errors", "traces", "issues"],
    tools: ["get_issue", "list_events", "get_trace", "query_errors"],
    install: "npx -y @sentry/mcp-server",
    runtime: "npx",
    verified: true,
    stars: 3600,
    icon: "🚨",
  },
  {
    id: "linear-mcp",
    name: "Linear",
    org: "Linear",
    description:
      "Create and update issues, comment, and query your Linear workspace for roadmap planning.",
    category: "Developer Tools",
    tags: ["issues", "roadmap", "projects"],
    tools: ["create_issue", "list_issues", "update_issue", "get_project"],
    install: "npx -y @linear/mcp-server",
    runtime: "npx",
    verified: true,
    stars: 3200,
    icon: "📐",
  },
  {
    id: "weather-mcp",
    name: "Weather",
    org: "modelcontextprotocol",
    description:
      "Fetch the current weather for any US city — the canonical reference MCP server.",
    category: "Data & Analytics",
    tags: ["weather", "api"],
    tools: ["get_alerts", "get_forecast"],
    install: "npx -y @modelcontextprotocol/server-weather",
    runtime: "npx",
    verified: true,
    stars: 2900,
    icon: "🌤️",
  },
  {
    id: "jira-mcp",
    name: "Jira",
    org: "Atlassian",
    description:
      "Search, create, and update Jira issues and projects straight from your assistant.",
    category: "Developer Tools",
    tags: ["issues", "sprints", "projects"],
    tools: ["create_issue", "search_issues", "transition_issue", "get_board"],
    install: "uvx jira-mcp --url --user --token",
    runtime: "uvx",
    verified: false,
    stars: 2600,
    icon: "📊",
  },
  {
    id: "redis-mcp",
    name: "Redis",
    org: "Redis",
    description:
      "Read and write keys, manage streams, and inspect cache state in Redis databases.",
    category: "Database",
    tags: ["cache", "keys", "streams"],
    tools: ["get_key", "set_key", "publish_message", "list_keys"],
    install: "npx -y @modelcontextprotocol/server-redis",
    runtime: "npx",
    verified: true,
    stars: 2400,
    icon: "🧰",
  },
  {
    id: "browserbase-mcp",
    name: "Browserbase",
    org: "Browserbase",
    description:
      "Headless browser sessions in the cloud — navigate, scrape, and screenshot at scale.",
    category: "Browser & Automation",
    tags: ["browser", "cloud", "scrape"],
    tools: ["navigate", "get_content", "perform_action", "take_screenshot"],
    install: "npx -y @browserbasehq/mcp-server browserbase@latest",
    runtime: "npx",
    verified: true,
    stars: 2100,
    icon: "🌐",
  },
  {
    id: "sqlite-mcp",
    name: "SQLite",
    org: "modelcontextprotocol",
    description:
      "Simple, schema-aware access to SQLite databases in the local filesystem.",
    category: "Database",
    tags: ["sql", "embedded", "local"],
    tools: ["execute_sql", "list_tables", "explain_query"],
    install: "npx -y @modelcontextprotocol/server-sqlite",
    runtime: "npx",
    verified: true,
    stars: 1900,
    icon: "🗄️",
  },
  {
    id: "ga4-mcp",
    name: "Google Analytics 4",
    org: "Google Sheets / BigQuery",
    description:
      "Query GA4 events and sessions, run funnel analysis, and export reports.",
    category: "Data & Analytics",
    tags: ["analytics", "reports", "ga4"],
    tools: ["run_report", "query_events", "get_metrics", "export_csv"],
    install: "npx -y google-sheets-mcp-server",
    runtime: "npx",
    verified: false,
    stars: 1500,
    icon: "📈",
  },
  {
    id: "image-gen-mcp",
    name: "Image Generation",
    org: "flux-ai",
    description:
      "Generate and edit images directly from a prompt — an ideal companion for a prompt library.",
    category: "Design",
    tags: ["images", "generation", "flux"],
    tools: ["generate_image", "edit_image", "list_variants", "save_output"],
    install: "npx -y @flux/mcp-server",
    runtime: "npx",
    verified: false,
    stars: 1200,
    icon: "🖼️",
  },
];

export const MCP_CATEGORY_COUNTS = MCP_CATEGORIES.filter((c) => c !== "All").map(
  (c) => ({
    category: c,
    count: MCP_SERVERS.filter((s) => s.category === c).length,
  })
);

export type McpMetrics = {
  upvotes: number;
  comments: number;
  rating: number;
  reviews: number;
  postedDays: number;
  priceTier: "Free" | "Freemium" | "Paid";
  author: string;
  community: string;
};

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

const AUTHORS = [
  "@octocat",
  "@swyx",
  "@karpathy",
  "@vorell",
  "@mharrigan",
  "@t3dotgg",
  "@0xburg",
  "@natfriedman",
  "@simonw",
  "@kpdecker",
];

const COMMUNITIES = [
  "r/servers",
  "r/aiagents",
  "r/MCP",
  "r/ClaudeAI",
  "r/selfhosted",
  "r/webdev",
];

export function metricsOf(server: McpServer): McpMetrics {
  const h = hash(server.id);
  const tierRoll = h % 10;
  return {
    upvotes: 300 + (h % 12000),
    comments: 18 + (h % 480),
    rating: 4 + ((h % 10) / 10),
    reviews: 80 + (h % 920),
    postedDays: h % 90,
    priceTier: tierRoll < 2 ? "Paid" : tierRoll < 7 ? "Freemium" : "Free",
    author: AUTHORS[h % AUTHORS.length],
    community: COMMUNITIES[h % COMMUNITIES.length],
  };
}

export type SortKey = "hot" | "new" | "top";

export function sortServers(servers: McpServer[], sort: SortKey): McpServer[] {
  const sorted = [...servers];
  switch (sort) {
    case "new":
      return sorted.sort(
        (a, b) => metricsOf(a).postedDays - metricsOf(b).postedDays
      );
    case "top":
      return sorted.sort((a, b) => metricsOf(b).upvotes - metricsOf(a).upvotes);
    case "hot":
    default:
      return sorted.sort((a, b) => {
        const score = (s: McpServer) =>
          metricsOf(s).upvotes / (metricsOf(s).postedDays + 2);
        return score(b) - score(a);
      });
  }
}