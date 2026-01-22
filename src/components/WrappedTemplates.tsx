// CSS-based fallback templates for Daily Sync Wrapped
// 10 unique designs inspired by reference images

interface WrappedStats {
  totalTokens: number;
  promptTokens: number;
  completionTokens: number;
  totalMessages: number;
  cost: number;
  topModels: { model: string; tokens: number }[];
  topProviders: { provider: string; tokens: number }[];
}

interface TemplateProps {
  stats: WrappedStats;
  date: string;
}

// Helper to format numbers
const formatNumber = (n: number): string => {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toLocaleString();
};

// Helper to format cost
const formatCost = (c: number): string => `$${c.toFixed(2)}`;

// Template 0: Minimal Dark (Sole DXB style)
export function Template0({ stats, date }: TemplateProps) {
  return (
    <div className="w-full h-full bg-black text-white font-mono flex flex-col p-8 relative">
      {/* Top corner accent */}
      <div className="absolute top-6 left-6 w-1 h-12 bg-gradient-to-b from-pink-500 to-purple-500" />
      <div className="absolute top-6 right-6 text-xs tracking-widest rotate-90 origin-top-right">
        {new Date().getFullYear()}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col justify-center">
        <h1 className="text-2xl tracking-[0.3em] font-bold mb-2">DAILY</h1>
        <h1 className="text-2xl tracking-[0.3em] font-bold mb-2">SYNC</h1>
        <h1 className="text-2xl tracking-[0.3em] font-bold mb-12">WRAPPED</h1>

        <div className="space-y-1 text-sm tracking-wide">
          <p>{formatNumber(stats.totalTokens)} TOKENS</p>
          <p>{formatNumber(stats.totalMessages)} MESSAGES</p>
          <p>{formatCost(stats.cost)} SPENT</p>
        </div>
      </div>

      {/* Bottom */}
      <div className="flex justify-between items-end text-xs">
        <div>
          <p className="tracking-widest">{date.replace(/-/g, "_")}</p>
        </div>
        <div className="text-right opacity-60">
          <p>OPENSYNC</p>
        </div>
      </div>
    </div>
  );
}

// Template 1: Gradient Noise (Rare Design Tools style)
export function Template1({ stats, date }: TemplateProps) {
  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-600 via-purple-700 to-slate-900" />
      {/* Noise overlay */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center p-8 text-white">
        <h2 className="text-lg font-light mb-2 opacity-80">Daily Sync</h2>
        <h1 className="text-4xl font-bold mb-8">Wrapped</h1>

        <div className="text-center space-y-4">
          <div>
            <p className="text-5xl font-bold">{formatNumber(stats.totalTokens)}</p>
            <p className="text-sm opacity-70 mt-1">Total Tokens</p>
          </div>
          <div className="flex gap-8 text-center">
            <div>
              <p className="text-2xl font-semibold">{formatNumber(stats.totalMessages)}</p>
              <p className="text-xs opacity-70">Messages</p>
            </div>
            <div>
              <p className="text-2xl font-semibold">{formatCost(stats.cost)}</p>
              <p className="text-xs opacity-70">Cost</p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 text-xs opacity-60">
          {date} | OpenSync
        </div>
      </div>
    </div>
  );
}

// Template 2: Geometric Beige (Answers the Why style)
export function Template2({ stats, date }: TemplateProps) {
  return (
    <div className="w-full h-full bg-[#f5f0e8] text-[#2d2d2d] p-6 flex flex-col relative">
      {/* Orange squares pyramid */}
      <div className="absolute left-4 top-1/4 flex flex-col gap-1">
        {[1, 2, 3, 4].map((row) => (
          <div key={row} className="flex gap-1">
            {Array(row)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 bg-orange-500 flex items-center justify-center text-white text-xs font-bold"
                >
                  {row * (row - 1) / 2 + i + 1}
                </div>
              ))}
          </div>
        ))}
      </div>

      {/* Content on right */}
      <div className="flex-1 flex flex-col justify-center ml-auto mr-4 max-w-[60%]">
        <h1 className="font-serif text-2xl italic mb-6">
          Your Daily
          <br />
          Sync Wrapped
        </h1>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between border-b border-[#ccc] pb-1">
            <span>Tokens</span>
            <span className="font-bold">{formatNumber(stats.totalTokens)}</span>
          </div>
          <div className="flex justify-between border-b border-[#ccc] pb-1">
            <span>Messages</span>
            <span className="font-bold">{stats.totalMessages}</span>
          </div>
          <div className="flex justify-between border-b border-[#ccc] pb-1">
            <span>Cost</span>
            <span className="font-bold">{formatCost(stats.cost)}</span>
          </div>
          <div className="flex justify-between">
            <span>Top Model</span>
            <span className="font-bold text-orange-600">
              {stats.topModels[0]?.model || "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="flex justify-between items-end text-xs mt-4">
        <span className="opacity-60">{date}</span>
        <div className="flex gap-1">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-3 h-3 bg-orange-500" />
          ))}
        </div>
      </div>
    </div>
  );
}

// Template 3: Tech Cards (Origin style)
export function Template3({ stats, date }: TemplateProps) {
  return (
    <div className="w-full h-full bg-black p-8 flex flex-col justify-center items-center relative">
      {/* Corner dots */}
      <div className="absolute top-4 left-4 w-1.5 h-1.5 bg-white rounded-full" />
      <div className="absolute top-4 right-4 w-1.5 h-1.5 bg-white rounded-full" />
      <div className="absolute bottom-4 left-4 w-1.5 h-1.5 bg-white rounded-full" />
      <div className="absolute bottom-4 right-4 w-1.5 h-1.5 bg-white rounded-full" />

      {/* Side text */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-[8px] tracking-widest">
        DAILY SYNC
        <br />
        WRAPPED
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-[8px] tracking-widest text-right">
        {date}
      </div>

      {/* Cards */}
      <div className="flex gap-3">
        <div className="w-24 h-24 bg-white rounded-2xl flex flex-col items-center justify-center">
          <div className="text-2xl font-bold text-black">{formatNumber(stats.totalTokens)}</div>
          <div className="text-[8px] text-gray-500 mt-1">TOKENS</div>
        </div>
        <div className="w-24 h-24 bg-white rounded-2xl flex flex-col items-center justify-center">
          <div className="text-2xl font-bold text-black">{stats.totalMessages}</div>
          <div className="text-[8px] text-gray-500 mt-1">MESSAGES</div>
        </div>
        <div className="w-24 h-24 bg-white rounded-2xl flex flex-col items-center justify-center">
          <div className="text-xl font-bold text-black">{formatCost(stats.cost)}</div>
          <div className="text-[8px] text-gray-500 mt-1">COST</div>
        </div>
      </div>

      {/* Bottom brand */}
      <div className="absolute bottom-6 text-white text-xs font-mono tracking-widest">
        OPENSYNC
      </div>
    </div>
  );
}

// Template 4: Bold Typography (Momentum at Scale style)
export function Template4({ stats, date }: TemplateProps) {
  return (
    <div className="w-full h-full bg-[#0a1628] text-white p-8 flex flex-col">
      {/* Logo/accent */}
      <div className="absolute top-6 right-6">
        <div className="w-8 h-8 relative">
          <div className="absolute inset-0 bg-blue-500 rotate-45 transform origin-center" />
          <div className="absolute inset-2 bg-[#0a1628] rotate-45 transform origin-center" />
        </div>
      </div>

      {/* Main headline */}
      <div className="flex-1 flex flex-col justify-start pt-8">
        <h1 className="font-serif text-5xl leading-tight">
          Daily Sync
          <br />
          <span className="text-blue-400">Wrapped</span>
        </h1>
      </div>

      {/* Stats */}
      <div className="space-y-2">
        <div className="flex items-baseline gap-2">
          <span className="text-blue-400 text-3xl font-light">
            {formatNumber(stats.totalTokens)}
          </span>
          <span className="text-gray-400">Tokens</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-blue-400 text-3xl font-light">{stats.totalMessages}</span>
          <span className="text-gray-400">Messages</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-blue-400 text-3xl font-light">{formatCost(stats.cost)}</span>
          <span className="text-gray-400">Cost</span>
        </div>
        {stats.topModels[0] && (
          <div className="flex items-baseline gap-2">
            <span className="text-blue-400 text-xl font-light">
              {stats.topModels[0].model}
            </span>
            <span className="text-gray-400">Top Model</span>
          </div>
        )}
      </div>

      {/* Bottom */}
      <div className="mt-8 text-xs text-gray-500">
        {date} | OpenSync
      </div>
    </div>
  );
}

// Template 5: Vinyl Record (Yeezus style)
export function Template5({ stats, date }: TemplateProps) {
  return (
    <div className="w-full h-full bg-[#1a1a1a] p-6 flex flex-col items-center justify-center relative">
      {/* Top corners */}
      <div className="absolute top-4 left-4 text-[#f5f0e8] text-[10px]">
        <span className="opacity-60">BY</span>
        <br />
        OPENSYNC
      </div>
      <div className="absolute top-4 right-4 text-[#f5f0e8] text-[10px] font-bold tracking-wider">
        WRAPPED
      </div>

      {/* Vinyl circle */}
      <div className="w-64 h-64 rounded-full bg-[#f5f0e8] flex items-center justify-center relative">
        {/* Center hole */}
        <div className="w-12 h-12 rounded-full bg-[#1a1a1a]" />

        {/* Curved text - top */}
        <div className="absolute top-6 text-[8px] tracking-wider text-[#1a1a1a]">
          {date.toUpperCase()}
        </div>

        {/* Stats around the circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-[#1a1a1a] text-center">
            <div className="text-4xl font-black tracking-tighter" style={{ fontFamily: "serif" }}>
              {formatNumber(stats.totalTokens)}
            </div>
            <div className="text-[10px] tracking-wider mt-1">TOKENS</div>
          </div>
        </div>

        {/* Bottom text */}
        <div className="absolute bottom-6 text-[8px] tracking-wider text-[#1a1a1a]">
          {stats.totalMessages} MESSAGES | {formatCost(stats.cost)}
        </div>
      </div>

      {/* Bottom */}
      <div className="absolute bottom-4 left-4 text-[#f5f0e8] text-[8px] opacity-60">
        DAILY SYNC WRAPPED
      </div>
      <div className="absolute bottom-4 right-4">
        <div className="w-8 h-8 rounded-full border border-[#f5f0e8] flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-[#f5f0e8]" />
        </div>
      </div>
    </div>
  );
}

// Template 6: Orange Gradient (Take Control style)
export function Template6({ stats, date }: TemplateProps) {
  return (
    <div className="w-full h-full bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 p-8 flex flex-col relative overflow-hidden">
      {/* Decorative shapes */}
      <div className="absolute -right-20 top-1/3 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute -left-10 bottom-1/4 w-40 h-40 bg-white/10 rounded-full blur-2xl" />

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        <h1 className="text-white text-3xl font-bold leading-tight">
          Your daily
          <br />
          sync wrapped.
        </h1>

        {/* Stats card */}
        <div className="mt-8 bg-white/20 backdrop-blur-sm rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white/80 text-sm">Total Tokens</span>
            <span className="text-white font-bold text-xl">{formatNumber(stats.totalTokens)}</span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-white/80 text-sm">Messages</span>
            <span className="text-white font-bold text-xl">{stats.totalMessages}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/80 text-sm">Cost</span>
            <span className="text-white font-bold text-xl">{formatCost(stats.cost)}</span>
          </div>
        </div>

        {/* Pill button style element */}
        <div className="mt-6 bg-white/90 rounded-full py-3 px-6 flex items-center justify-between">
          <span className="text-gray-800 text-sm font-medium">
            {stats.topModels[0]?.model || "No activity"}
          </span>
          <span className="text-gray-400">+</span>
        </div>
      </div>

      {/* Bottom */}
      <div className="relative z-10 mt-auto pt-6 text-white/70 text-xs">
        {date} | OpenSync
      </div>
    </div>
  );
}

// Template 7: Dark Minimal (Sole DXB date style)
export function Template7({ stats, date }: TemplateProps) {
  return (
    <div className="w-full h-full bg-black text-white font-mono p-8 flex flex-col">
      {/* Sparse top */}
      <div className="text-[10px] tracking-[0.5em] opacity-40">OPENSYNC</div>

      {/* Center content - very minimal */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="text-6xl font-bold tracking-tighter mb-12">
          {formatNumber(stats.totalTokens)}
        </div>
        <div className="text-sm tracking-widest opacity-60 mb-1">TOKENS SYNCED</div>
        <div className="text-sm tracking-widest opacity-40">{date}</div>
      </div>

      {/* Bottom stats - sparse */}
      <div className="flex justify-between text-xs tracking-wider">
        <div>
          <span className="opacity-40">MSG </span>
          <span>{stats.totalMessages}</span>
        </div>
        <div>
          <span className="opacity-40">COST </span>
          <span>{formatCost(stats.cost)}</span>
        </div>
        <div>
          <span className="opacity-40">MODEL </span>
          <span>{stats.topModels[0]?.model?.slice(0, 10) || "N/A"}</span>
        </div>
      </div>
    </div>
  );
}

// Template 8: Blue Landscape (Artistic style)
export function Template8({ stats, date }: TemplateProps) {
  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* Split background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-1/2 h-full bg-[#f5f0e8]" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#1e3a5f]" />
        {/* Artistic wave divider */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path
            d="M50 0 Q60 30, 45 50 Q30 70, 55 100 L100 100 L100 0 Z"
            fill="#1e3a5f"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col p-8">
        <h2 className="text-[#1e3a5f] text-sm font-light tracking-widest">
          DAILY SYNC
        </h2>

        <div className="flex-1 flex items-center">
          <div className="text-white">
            <div className="text-5xl font-bold mb-2">{formatNumber(stats.totalTokens)}</div>
            <div className="text-sm opacity-70">tokens</div>

            <div className="mt-6 space-y-2 text-sm">
              <div>{stats.totalMessages} messages</div>
              <div>{formatCost(stats.cost)} cost</div>
              <div>{stats.topModels[0]?.model || "N/A"}</div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex justify-between text-xs">
          <span className="text-[#1e3a5f]">{date}</span>
          <span className="text-white opacity-60">OpenSync</span>
        </div>
      </div>
    </div>
  );
}

// Template 9: Color Shapes (Khroma style)
export function Template9({ stats, date }: TemplateProps) {
  return (
    <div className="w-full h-full bg-[#0f0f0f] p-8 flex flex-col relative overflow-hidden">
      {/* Colorful shape accents */}
      <div className="absolute top-20 left-8">
        <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[35px] border-b-yellow-300" />
      </div>
      <div className="absolute top-32 right-12 w-8 h-8 bg-pink-400 rounded-sm" />
      <div className="absolute bottom-40 left-16 w-10 h-10 bg-blue-500 rotate-45" />
      <div className="absolute bottom-24 right-8">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-red-400" />
      </div>

      {/* Header */}
      <div className="text-white text-sm font-bold tracking-wider">opensync</div>

      {/* Main content */}
      <div className="flex-1 flex flex-col justify-center">
        <h1 className="text-white text-4xl font-serif mb-1">Daily Sync</h1>
        <h2 className="text-blue-400 text-4xl font-serif italic mb-8">wrapped.</h2>

        <p className="text-gray-400 text-sm max-w-[80%] mb-8">
          Your coding activity for {date}, synced and summarized.
        </p>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4 text-white">
          <div>
            <div className="text-2xl font-bold">{formatNumber(stats.totalTokens)}</div>
            <div className="text-xs text-gray-500">Total Tokens</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{stats.totalMessages}</div>
            <div className="text-xs text-gray-500">Messages</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{formatCost(stats.cost)}</div>
            <div className="text-xs text-gray-500">Cost</div>
          </div>
          <div>
            <div className="text-lg font-bold truncate">
              {stats.topModels[0]?.model || "N/A"}
            </div>
            <div className="text-xs text-gray-500">Top Model</div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="text-gray-600 text-xs">
        {stats.topProviders.map((p) => p.provider).join(" | ")}
      </div>
    </div>
  );
}

// Template selector component
interface WrappedTemplateProps {
  designIndex: number;
  stats: WrappedStats;
  date: string;
}

export function WrappedTemplate({ designIndex, stats, date }: WrappedTemplateProps) {
  const templates = [
    Template0,
    Template1,
    Template2,
    Template3,
    Template4,
    Template5,
    Template6,
    Template7,
    Template8,
    Template9,
  ];

  const Template = templates[designIndex % templates.length];
  return <Template stats={stats} date={date} />;
}

export const TEMPLATE_COUNT = 10;
