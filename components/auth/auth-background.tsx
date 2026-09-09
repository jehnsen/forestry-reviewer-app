/**
 * Decorative backdrop for the auth screens: a forest canopy silhouette under a
 * constellation of "neural" nodes, meant to read as forestry + AI at a glance.
 *
 * Purely presentational — aria-hidden, pointer-events-none, and every motion is
 * wrapped in a `motion-safe` guard so reduced-motion users get a static scene.
 */
export default function AuthBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Deep canopy gradient: night sky above, forest floor below. */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_0%,#0b3b2e_0%,#072a22_45%,#04191a_100%)]" />

      {/* Aurora wash — slow-moving green/teal light behind everything. */}
      <div className="absolute -top-1/3 left-1/2 h-[80vh] w-[120vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(52,211,153,0.34),transparent)] blur-3xl motion-safe:animate-[aurora_18s_ease-in-out_infinite]" />
      <div className="absolute -bottom-1/4 -left-1/4 h-[60vh] w-[70vw] rounded-full bg-[radial-gradient(closest-side,rgba(34,211,238,0.20),transparent)] blur-3xl motion-safe:animate-[aurora_24s_ease-in-out_infinite_reverse]" />

      {/* Neural constellation: nodes + synapses drawn over the sky. */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="synapse" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6ee7b7" stopOpacity="0.05" />
            <stop offset="50%" stopColor="#34d399" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.05" />
          </linearGradient>
          <radialGradient id="node">
            <stop offset="0%" stopColor="#a7f3d0" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Synapses. The dash animation makes signal appear to travel the edges. */}
        <g
          stroke="url(#synapse)"
          strokeWidth="1"
          fill="none"
          className="motion-safe:[stroke-dasharray:6_10] motion-safe:animate-[signal_5s_linear_infinite]"
        >
          <path d="M120 180 L310 96 L520 214 L742 128 L960 236 L1180 140 L1360 250" />
          <path d="M96 420 L286 336 L520 214 L742 402 L960 236 L1210 380" />
          <path d="M310 96 L286 336 L470 520 L742 402 L1024 512 L1180 140" />
          <path d="M120 180 L286 336" />
          <path d="M470 520 L520 214" />
          <path d="M1024 512 L960 236" />
          <path d="M1210 380 L1360 250" />
        </g>

        {/* Nodes, each with a soft halo that pulses on its own offset. */}
        {[
          [120, 180],
          [310, 96],
          [286, 336],
          [520, 214],
          [470, 520],
          [742, 128],
          [742, 402],
          [960, 236],
          [1024, 512],
          [1180, 140],
          [1210, 380],
          [1360, 250],
        ].map(([cx, cy], i) => (
          <g
            key={`${cx}-${cy}`}
            className="motion-safe:animate-[pulse-node_4s_ease-in-out_infinite]"
            style={{ animationDelay: `${(i % 6) * 0.55}s` }}
          >
            <circle cx={cx} cy={cy} r="22" fill="url(#node)" opacity="0.5" />
            <circle cx={cx} cy={cy} r="3" fill="#d1fae5" />
          </g>
        ))}
      </svg>

      {/* Drifting spores/fireflies rising through the frame. */}
      {[
        [8, 12, 0],
        [22, 7, 2.4],
        [37, 15, 5.1],
        [51, 9, 1.2],
        [66, 13, 3.7],
        [79, 6, 6.3],
        [91, 11, 4.4],
        [16, 9, 7.5],
        [59, 8, 8.8],
        [86, 14, 2.1],
      ].map(([left, size, delay]) => (
        <span
          key={left}
          className="absolute bottom-0 rounded-full bg-emerald-200/70 blur-[1px] motion-safe:animate-[drift_16s_linear_infinite]"
          style={{
            left: `${left}%`,
            width: `${size / 3}px`,
            height: `${size / 3}px`,
            animationDelay: `${delay}s`,
          }}
        />
      ))}

      {/* Layered canopy silhouettes: far ridge, then near treeline. */}
      <svg
        className="absolute inset-x-0 bottom-0 h-[38vh] w-full"
        viewBox="0 0 1440 340"
        preserveAspectRatio="none"
        fill="none"
      >
        {/* Far ridge — hazier and lower-contrast to sit back in the scene. */}
        <g fill="#05261f" opacity="0.9">
          <path d="M0 340V210l40 26 34-58 30 44 44-70 40 62 36-40 46 66 40-52 44 58 38-74 42 82 36-46 48 60 40-66 46 74 38-40 44 52 40-70 44 78 36-44 46 58 40-64 44 70 38-38 42 50 40-62 44 72 36-40 46 54 40 30V340z" />
        </g>
        {/* Near treeline — solid, dark, anchors the bottom edge. */}
        <g fill="#010d0c">
          <path d="M0 340V262l30 20 26-52 26 40 34-64 32 58 28-36 36 60 30-48 34 54 28-68 34 76 28-42 38 56 30-60 36 68 28-36 34 48 30-64 34 72 28-40 36 54 30-58 34 64 28-34 32 46 30-58 34 66 28-36 36 50 30 26 26-40 30 44 28-52 34 60 30 22V340z" />
        </g>
      </svg>

      {/* Vignette to keep the card edge crisp against a busy backdrop. */}
      <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_45%,transparent,rgba(2,17,15,0.55))]" />
    </div>
  );
}
