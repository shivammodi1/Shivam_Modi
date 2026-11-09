import type { ContributionDay } from "./stats";

const LEVEL_MIX = [0, 35, 55, 78, 100];

/** GitHub-style contribution grid: one column per week, Sunday at the top. */
export function ContribHeatmap({ days, color, empty = "rgba(236,232,225,0.07)", cell = 11 }: { days: ContributionDay[]; color: string; empty?: string; cell?: number }) {
  if (!days.length) return null;
  const lead = new Date(`${days[0].date}T00:00:00`).getDay();
  const cells: (ContributionDay | null)[] = [...Array<null>(lead).fill(null), ...days];
  const gap = Math.max(2, Math.round(cell / 4));

  return (
    <div style={{ overflowX: "auto", paddingBottom: 4 }}>
      <div
        role="img"
        aria-label={`${days.reduce((n, d) => n + d.count, 0)} contributions in the last year`}
        style={{
          display: "grid",
          gridTemplateRows: `repeat(7, ${cell}px)`,
          gridAutoFlow: "column",
          gridAutoColumns: `${cell}px`,
          gap,
          width: "max-content",
        }}
      >
        {cells.map((d, i) =>
          d ? (
            <span
              key={d.date}
              title={`${d.count} contribution${d.count === 1 ? "" : "s"} on ${d.date}`}
              style={{
                width: cell,
                height: cell,
                borderRadius: 2,
                background: d.level ? `color-mix(in srgb, ${color} ${LEVEL_MIX[Math.min(d.level, 4)]}%, transparent)` : empty,
              }}
            />
          ) : (
            <span key={`pad${i}`} />
          ),
        )}
      </div>
    </div>
  );
}
