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

/* The LLM-extracted view of the SAME app: a call-graph that never merges the
   frontend fetch with the backend handler. They sit in two separate clusters,
   bridged only by edges the model *guesses* (fuzzy `~?`). This is what makes
   the two panels visibly different — Contextifly merges endpoints, the LLM
   tool leaves front and back as disconnected islands. */
export const LLM_NODES: GNode[] = [
  // frontend cluster (left)
  { id: "l_app", label: "App", kind: "frontend", x: 66, y: 40 },
  { id: "l_cart", label: "CartPage", kind: "frontend", x: 58, y: 116 },
  { id: "l_card", label: "ProductCard", kind: "frontend", x: 150, y: 84 },
  { id: "l_checkout", label: "CheckoutBtn", kind: "frontend", x: 150, y: 166 },
  { id: "l_usecart", label: "useCart", kind: "state", x: 56, y: 206, god: true },
  { id: "l_getcall", label: "fetch /products", kind: "api", x: 140, y: 250 },
  { id: "l_postcall", label: "fetch /orders", kind: "api", x: 140, y: 300 },
  // backend cluster (right) — separate island
  { id: "l_getep", label: "@Get /products", kind: "api", x: 300, y: 90 },
  { id: "l_prodCtl", label: "ProductCtl", kind: "backend", x: 392, y: 70 },
  { id: "l_prodSvc", label: "ProductSvc", kind: "backend", x: 400, y: 120 },
  { id: "l_postep", label: "@Post /orders", kind: "api", x: 300, y: 210 },
  { id: "l_orderCtl", label: "OrderCtl", kind: "backend", x: 392, y: 235 },
  { id: "l_orderSvc", label: "OrderSvc", kind: "backend", x: 400, y: 285 },
  { id: "l_order", label: "Order", kind: "entity", x: 330, y: 305 },
];

export const LLM_EDGES: GEdge[] = [
  // frontend island
  { from: "l_app", to: "l_cart", rel: "renders" },
  { from: "l_app", to: "l_card", rel: "renders" },
  { from: "l_cart", to: "l_checkout", rel: "renders" },
  { from: "l_cart", to: "l_usecart", rel: "uses" },
  { from: "l_card", to: "l_usecart", rel: "uses" },
  { from: "l_card", to: "l_getcall", rel: "fetch" },
  { from: "l_checkout", to: "l_postcall", rel: "fetch" },
  // backend island
  { from: "l_getep", to: "l_prodCtl", rel: "handled by" },
  { from: "l_prodCtl", to: "l_prodSvc", rel: "injects" },
  { from: "l_postep", to: "l_orderCtl", rel: "handled by" },
  { from: "l_orderCtl", to: "l_orderSvc", rel: "injects" },
  { from: "l_orderSvc", to: "l_order", rel: "persists" },
  // the only links across the gap are LLM guesses
  { from: "l_getcall", to: "l_getep", rel: "guessed", fuzzy: true },
  { from: "l_postcall", to: "l_postep", rel: "guessed", fuzzy: true },
  { from: "l_prodSvc", to: "l_order", rel: "guessed", fuzzy: true },
];

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
  { label: "How the code graph is built", contextifly: "Compiler (TS / AST parsers)", ctxGood: true, llmTools: "Tree-sitter AST + LLM extraction", llmGood: true },
  { label: "Inputs it reads", contextifly: "Source code only — TS/React/Nest/Flutter", ctxGood: false, llmTools: "Code + docs, PDFs, images, diagrams", llmGood: true },
  { label: "What the graph models", contextifly: "App wiring: routes, DI, entities", ctxGood: true, llmTools: "Topic communities + concepts", llmGood: false },
  { label: "Endpoints & routing", contextifly: "Every route a node — fetch ↔ @Post() merge", ctxGood: true, llmTools: "Endpoints barely modeled, no route identity", llmGood: false },
  { label: "Determinism", contextifly: "Byte-identical every run", ctxGood: true, llmTools: "Probabilistic — inferred edges vary", llmGood: false },
  { label: "Your source code", contextifly: "Never leaves your machine", ctxGood: true, llmTools: "Semantic step sends content to a model", llmGood: false },
  { label: "Evidence", contextifly: "Every edge structural, cites file:line", ctxGood: true, llmTools: "Some edges are model-inferred (guessed)", llmGood: false },
  { label: "Re-index after an edit", contextifly: "~17ms incremental", ctxGood: true, llmTools: "Re-runs LLM extraction on changed files", llmGood: false },
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
