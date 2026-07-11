/* ============================================================
   Static content + graph data for the Contextifly marketing site.
   Kept out of components so the sections stay declarative.
   ============================================================ */

export const GITHUB_URL = "https://github.com/Sam123336/Contextifly";

export const NAV_LINKS = [
  { label: "Live compare", href: "#compare" },
  { label: "How it works", href: "#pipeline" },
  { label: "Tools", href: "#tools" },
  { label: "vs Others", href: "#versus" },
  { label: "Install", href: "#install" },
];

/* ---------- Live Graph Comparison model ----------
   One small full-stack e-commerce app, two engines building it. */

export type GNodeKind = "frontend" | "state" | "api" | "backend" | "entity";

export interface GNode {
  id: string;
  label: string;
  kind: GNodeKind;
  x: number; // in a 420 x 340 viewBox
  y: number;
  prov?: string; // provenance file:line (Contextifly only)
  god?: boolean; // "god node" the LLM tool over-weights
}

export interface GEdge {
  from: string;
  to: string;
  rel: string;
  /** part of the highlighted full-stack trace */
  trace?: boolean;
  /** the LLM tool renders this as an uncertain / guessed edge */
  fuzzy?: boolean;
}

export const GRAPH_NODES: GNode[] = [
  { id: "app", label: "App", kind: "frontend", x: 70, y: 44, prov: "app/layout.tsx:1" },
  { id: "cart", label: "CartPage", kind: "frontend", x: 66, y: 120, prov: "app/cart/page.tsx:12" },
  { id: "card", label: "ProductCard", kind: "frontend", x: 150, y: 92, prov: "ProductCard.tsx:8" },
  { id: "checkout", label: "CheckoutBtn", kind: "frontend", x: 150, y: 176, prov: "CheckoutButton.tsx:23" },
  { id: "usecart", label: "useCart", kind: "state", x: 66, y: 210, prov: "useCart.ts:5", god: true },
  { id: "getProducts", label: "GET /products", kind: "api", x: 256, y: 70, prov: "api:GET /products" },
  { id: "postOrders", label: "POST /orders", kind: "api", x: 256, y: 182, prov: "api:POST /orders" },
  { id: "prodCtl", label: "ProductCtl", kind: "backend", x: 372, y: 60, prov: "product.controller.ts:19" },
  { id: "prodSvc", label: "ProductSvc", kind: "backend", x: 378, y: 122, prov: "product.service.ts:14" },
  { id: "orderCtl", label: "OrderCtl", kind: "backend", x: 372, y: 192, prov: "order.controller.ts:27" },
  { id: "orderSvc", label: "OrderSvc", kind: "backend", x: 378, y: 258, prov: "order.service.ts:33" },
  { id: "order", label: "Order", kind: "entity", x: 262, y: 290, prov: "order.entity.ts:9" },
];

export const GRAPH_EDGES: GEdge[] = [
  { from: "app", to: "cart", rel: "renders" },
  { from: "app", to: "card", rel: "renders" },
  { from: "cart", to: "checkout", rel: "renders" },
  { from: "cart", to: "usecart", rel: "uses" },
  { from: "card", to: "usecart", rel: "uses" },
  { from: "card", to: "getProducts", rel: "fetch" },
  { from: "checkout", to: "postOrders", rel: "fetch", trace: true },
  { from: "getProducts", to: "prodCtl", rel: "handled by" },
  { from: "postOrders", to: "orderCtl", rel: "handled by", trace: true, fuzzy: true },
  { from: "prodCtl", to: "prodSvc", rel: "injects" },
  { from: "orderCtl", to: "orderSvc", rel: "injects", trace: true },
  { from: "orderSvc", to: "order", rel: "persists", trace: true },
  { from: "prodSvc", to: "order", rel: "reads", fuzzy: true },
];

// the money-shot trace, in order (frontend → api → backend → entity)
export const TRACE_PATH = ["checkout", "postOrders", "orderCtl", "orderSvc", "order"];

export const KIND_COLOR: Record<GNodeKind, string> = {
  frontend: "#4d7cff",
  state: "#9a5bff",
  api: "#29e0d4",
  backend: "#34e39b",
  entity: "#ff5d9e",
};

export const KIND_LABEL: Record<GNodeKind, string> = {
  frontend: "Component",
  state: "State",
  api: "Endpoint",
  backend: "Service",
  entity: "Entity",
};

/* ---------- Tools / features ---------- */

export interface Feature {
  icon: string;
  title: string;
  desc: string;
  tag: string;
}

export const FEATURES: Feature[] = [
  {
    icon: "trace",
    tag: "trace_flow",
    title: "Full-stack traces",
    desc: "A checkout button → POST /orders → OrderController → OrderService → entity, in one path. Frontend fetch and backend handler merge into the same node.",
  },
  {
    icon: "impact",
    tag: "get_impact",
    title: "Blast-radius analysis",
    desc: "“What breaks if I change ProductCard?” — affected components, routes, contexts and APIs, with a Low / Med / High regression score.",
  },
  {
    icon: "twin",
    tag: "what_if",
    title: "Digital-twin simulation",
    desc: "Simulate remove / split / lazy-load before you touch a line of code. See what breaks and what stays safe — then decide.",
  },
  {
    icon: "map",
    tag: "get_project_map",
    title: "Instant project map",
    desc: "Every route with its component tree and API calls, plus a Mermaid navigation diagram — a 40-file crawl becomes one query.",
  },
  {
    icon: "score",
    tag: "analyze_project",
    title: "Architecture score",
    desc: "0–100 health: circular imports, dead code, unused routes, oversized components, and copy-pasted-then-renamed duplicates caught by JSX-shape fingerprint.",
  },
  {
    icon: "eye",
    tag: "analyze_screenshot",
    title: "Screenshot → markdown",
    desc: "UI screenshots become structured developer markdown — screen type, components, layout, issues — at ~95% fewer vision tokens. Measured.",
  },
];

/* ---------- Comparison table ---------- */

export interface CompareRow {
  label: string;
  contextifly: string;
  ctxGood: boolean;
  llmTools: string;
  llmGood: boolean;
}

export const COMPARE_ROWS: CompareRow[] = [
  { label: "How the code graph is built", contextifly: "Compiler (TS / AST parsers)", ctxGood: true, llmTools: "LLM semantic extraction", llmGood: false },
  { label: "Determinism", contextifly: "Byte-identical every run", ctxGood: true, llmTools: "Probabilistic, varies per run", llmGood: false },
  { label: "Your source code", contextifly: "Never leaves your machine", ctxGood: true, llmTools: "Semantic content sent to a model", llmGood: false },
  { label: "Evidence", contextifly: "Every edge cites file:line + confidence", ctxGood: true, llmTools: "No provenance", llmGood: false },
  { label: "Full-stack linking", contextifly: "fetch ↔ @Post() merge into one node", ctxGood: true, llmTools: "Not structural — concept-level only", llmGood: false },
  { label: "Re-index after an edit", contextifly: "~17ms incremental", ctxGood: true, llmTools: "Re-run the model", llmGood: false },
  { label: "Cost per query", contextifly: "A few hundred tokens", ctxGood: true, llmTools: "Thousands of tokens", llmGood: false },
];

/* ---------- Pipeline ---------- */

export const PIPELINE = [
  { step: "Providers", desc: "Compile one slice — a framework, a spec, a config — into IR nodes & edges.", detail: "ts-morph · NestJS decorators · Dart scanner" },
  { step: "Versioned IR", desc: "The stable node/edge schema everything else is written against.", detail: "one contract, cited provenance" },
  { step: "Normalizer", desc: "Assigns framework-agnostic semantic roles on top of syntax.", detail: "entry-point · business-logic · data-model" },
  { step: "Algorithms", desc: "Impact, traces, diffs, scoring, maps — pure graph computation.", detail: "provider-agnostic, deterministic" },
  { step: "AI", desc: "Explains, summarizes, plans — always the last step, never the source of truth.", detail: "queries the graph, never guesses" },
];

/* ---------- Metrics ---------- */

export const METRICS = [
  { value: 95, suffix: "%", label: "fewer vision tokens per screenshot", note: "measured" },
  { value: 90, suffix: "%", label: "less code-exploration per question", note: "estimated" },
  { value: 17, suffix: "ms", label: "no-op incremental re-index", note: "verified byte-identical" },
  { value: 14, suffix: "", label: "MCP tools the moment you install", note: "+ 3 bundled skills" },
];

/* ---------- Trace steps (for the flow showcase) ---------- */

export const TRACE_STEPS = [
  { n: 1, node: "CheckoutButton", kind: "frontend", meta: "components/CheckoutButton.tsx:23", note: "user taps “Place order”" },
  { n: 2, node: "POST /orders", kind: "api", meta: "fetch('/orders', { method: 'POST' })", note: "frontend call" },
  { n: 3, node: "OrderController", kind: "backend", meta: "@Post() order.controller.ts:27", note: "same endpoint node — merged" },
  { n: 4, node: "OrderService", kind: "backend", meta: "injected · order.service.ts:33", note: "business logic" },
  { n: 5, node: "Order", kind: "entity", meta: "order.entity.ts:9", note: "data model" },
];
