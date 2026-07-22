import {
  GRAPH_NODES,
  GRAPH_EDGES,
  TRACE_PATH,
  LLM_NODES,
  LLM_EDGES,
  KIND_COLOR,
  type GNode,
  type GNodeKind,
} from "@/lib/content";

const ctxNodeById: Record<string, GNode> = {};
GRAPH_NODES.forEach((n) => {
  ctxNodeById[n.id] = n;
});
const llmNodeById: Record<string, GNode> = {};
LLM_NODES.forEach((n) => {
  llmNodeById[n.id] = n;
});
const traceSet = new Set(TRACE_PATH);
const tracePairs = new Set(
  TRACE_PATH.slice(0, -1).map((id, i) => `${id}->${TRACE_PATH[i + 1]}`)
);
const chipW = (label: string) => Math.max(34, label.length * 6.4 + 22);
export const traceD =
  "M " +
  TRACE_PATH.map((id) => `${ctxNodeById[id].x} ${ctxNodeById[id].y}`).join(" L ");

/**
 * One graph figure. Pure markup, never depends on React state so GSAP owns it.
 * `still` renders everything fully visible (hero); otherwise elements start
 * hidden and the comparison timeline reveals them.
 */
export default function GraphFigure({
  variant,
  still = false,
}: {
  variant: "ctx" | "llm";
  still?: boolean;
}) {
  const isCtx = variant === "ctx";
  const nodes = isCtx ? GRAPH_NODES : LLM_NODES;
  const edges = isCtx ? GRAPH_EDGES : LLM_EDGES;
  const nodeById = isCtx ? ctxNodeById : llmNodeById;
  return (
    <svg viewBox="0 0 460 336" className="w-full" role="img" aria-label="knowledge graph">
      {/* edges */}
      <g>
        {edges.map((e) => {
          const a = nodeById[e.from];
          const b = nodeById[e.to];
          const onTrace = isCtx && tracePairs.has(`${e.from}->${e.to}`);
          const fuzzy = !isCtx && e.fuzzy;
          return (
            <line
              key={`${variant}-${e.from}-${e.to}`}
              className="edge"
              data-fuzzy={fuzzy ? "1" : undefined}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              pathLength={1}
              stroke={fuzzy ? "var(--warn)" : onTrace ? "var(--accent)" : "rgba(160,170,190,0.5)"}
              strokeWidth={onTrace ? 1.8 : 1.1}
              strokeDasharray={fuzzy ? "3 3" : 1}
              strokeDashoffset={fuzzy || still ? undefined : 1}
              style={{ opacity: still ? 0.5 : 0.08 }}
              strokeLinecap="round"
            />
          );
        })}
      </g>

      {/* ctx-only full-stack trace overlay */}
      {isCtx && (
        <path
          className="trace-path"
          d={traceD}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={still ? undefined : 1}
          strokeDashoffset={still ? undefined : 1}
          style={{ opacity: still ? 0.9 : 0 }}
        />
      )}

      {/* nodes */}
      <g>
        {nodes.map((n) => {
          const color = KIND_COLOR[n.kind as GNodeKind];
          const w = chipW(n.label);
          const onTrace = isCtx && traceSet.has(n.id);
          const isGod = !isCtx && n.god;
          return (
            <g key={`${variant}-${n.id}`} transform={`translate(${n.x} ${n.y})`}>
              {isGod && (
                <circle
                  className="god-ring"
                  r={w / 2 + 9}
                  fill="none"
                  stroke="var(--warn)"
                  strokeWidth={1}
                  strokeDasharray="2 3"
                  style={{ opacity: still ? 0.8 : 0 }}
                />
              )}
              <g
                className={`gnode${onTrace ? " trace-node" : ""}`}
                data-id={n.id}
                style={{ opacity: still ? 1 : 0.16 }}
              >
                <rect
                  x={-w / 2}
                  y={-11}
                  width={w}
                  height={22}
                  rx={6}
                  fill="var(--bg-inset)"
                  stroke={color}
                  strokeWidth={onTrace ? 1.5 : 1}
                />
                <circle cx={-w / 2 + 9} cy={0} r={2.4} fill={color} />
                <text
                  x={4}
                  y={3.4}
                  textAnchor="middle"
                  fontSize="9"
                  fontFamily="var(--font-mono)"
                  fill="#dde1ea"
                >
                  {n.label}
                </text>
              </g>
            </g>
          );
        })}
      </g>

      {/* provenance tags (ctx only, trace nodes) OR fuzzy marks (llm) */}
      {isCtx
        ? nodes.filter((n) => traceSet.has(n.id)).map((n) => (
            <text
              key={`prov-${n.id}`}
              className="prov"
              x={n.x}
              y={n.y + 20}
              textAnchor="middle"
              fontSize="6.6"
              fontFamily="var(--font-mono)"
              fill="var(--accent)"
              style={{ opacity: still ? 0.85 : 0 }}
            >
              {n.prov}
            </text>
          ))
        : edges.filter((e) => e.fuzzy).map((e) => {
            const a = nodeById[e.from];
            const b = nodeById[e.to];
            return (
              <text
                key={`fz-${e.from}-${e.to}`}
                className="fuzzy-mark"
                x={(a.x + b.x) / 2}
                y={(a.y + b.y) / 2 - 3}
                textAnchor="middle"
                fontSize="9"
                fontWeight="700"
                fill="var(--warn)"
                style={{ opacity: still ? 1 : 0 }}
              >
                ~?
              </text>
            );
          })}

      {/* the LLM view is split into two islands; label the gap the guesses span */}
      {!isCtx && (
        <>
          <line
            x1="220"
            y1="30"
            x2="220"
            y2="316"
            stroke="rgba(160,170,190,0.14)"
            strokeWidth="1"
            strokeDasharray="2 6"
          />
          <text x="104" y="20" textAnchor="middle" fontSize="8" fontFamily="var(--font-mono)" fill="var(--faint)" style={{ letterSpacing: "1.5px" }}>
            FRONTEND
          </text>
          <text x="356" y="20" textAnchor="middle" fontSize="8" fontFamily="var(--font-mono)" fill="var(--faint)" style={{ letterSpacing: "1.5px" }}>
            BACKEND
          </text>
        </>
      )}
    </svg>
  );
}
