import { afterEach, describe, expect, it } from "vitest";
import {
  ADMIN_SESSION_LIMITS,
  clearAdminSession,
  createAdminSession,
  getAdminSession,
  touchAdminSession,
} from "../utils/adminSession";

describe("adminSession", () => {
  afterEach(() => {
    clearAdminSession();
    window.localStorage.clear();
  });

  it("creates and reads a valid admin session", () => {
    const now = 1_700_000_000_000;

    createAdminSession({ username: "deepak" }, now);
    const session = getAdminSession(now + 1000);

    expect(session?.username).toBe("deepak");
    expect(session?.createdAt).toBe(now);
  });

  it("expires idle sessions and clears storage", () => {
    const now = 1_700_000_000_000;

    createAdminSession({ username: "deepak" }, now);
    const expired = getAdminSession(now + ADMIN_SESSION_LIMITS.idleMs + 1);

    expect(expired).toBeNull();
    expect(window.localStorage.getItem("portfolio.admin.session")).toBeNull();
  });

  it("extends activity without exceeding the max session lifetime", () => {
    const now = 1_700_000_000_000;

    createAdminSession({ username: "deepak" }, now);
    const touched = touchAdminSession(now + 5 * 60 * 1000);

    expect(touched?.expiresAt).toBe(now + 35 * 60 * 1000);
  });
});
