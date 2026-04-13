import { describe, expect, it } from "vitest";
import { buildAnalyticsSummary } from "../utils/analyticsSummary";

describe("buildAnalyticsSummary", () => {
  it("derives distinct visitor and session insights from visitor history", () => {
    const summary = buildAnalyticsSummary({
      now: new Date("2026-04-13T10:00:00.000Z"),
      totals: {
        totalViews: 120,
        totalClicks: 30,
        totalDownloads: 12,
        totalResumeOpens: 6,
      },
      daily: {
        "2026-04-04": { views: 10, uniqueUsers: 1, sessions: 1 },
        "2026-04-08": { views: 18, uniqueUsers: 1, returningUsers: 1, sessions: 1 },
        "2026-04-10": { views: 24, uniqueUsers: 1, newUsers: 1, sessions: 1 },
        "2026-04-12": { views: 31, uniqueUsers: 1, returningUsers: 1, sessions: 1 },
        "2026-04-13": { views: 37, uniqueUsers: 2, newUsers: 1, returningUsers: 1, sessions: 2 },
      },
      visitors: [
        {
          id: "visitor-new",
          firstSeenDate: "2026-04-13",
          visitCount: 1,
          visitDays: { "2026-04-13": true },
        },
        {
          id: "visitor-repeat",
          firstSeenDate: "2026-04-10",
          visitCount: 2,
          visitDays: { "2026-04-10": true, "2026-04-13": true },
        },
        {
          id: "visitor-returning",
          firstSeenDate: "2026-04-04",
          visitCount: 3,
          visitDays: { "2026-04-04": true, "2026-04-08": true, "2026-04-12": true },
        },
      ],
    });

    expect(summary.usersData.uniqueToday).toBe(2);
    expect(summary.usersData.uniqueThisWeek).toBe(3);
    expect(summary.usersData.uniqueLastWeek).toBe(1);
    expect(summary.usersData.newToday).toBe(1);
    expect(summary.usersData.returningThisWeek).toBe(1);
    expect(summary.usersData.sessionsToday).toBe(2);
    expect(summary.summaryData.bestDay?.date).toBe("2026-04-13");
    expect(summary.summaryData.repeatVisitorRate).toBeCloseTo(66.7, 1);
    expect(summary.summaryData.avgViewsPerSession).toBeCloseTo(20, 1);
  });
});
