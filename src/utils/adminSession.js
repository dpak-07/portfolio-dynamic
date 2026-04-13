const STORAGE_KEY = "portfolio.admin.session";
const LEGACY_KEYS = {
  isAdmin: "isAdmin",
  loginTimestamp: "loginTimestamp",
};

export const ADMIN_SESSION_LIMITS = {
  idleMs: 30 * 60 * 1000,
  maxMs: 8 * 60 * 60 * 1000,
  version: 1,
};

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function safeParse(value) {
  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function persistSession(session) {
  if (!canUseStorage()) return;

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  window.localStorage.setItem(LEGACY_KEYS.isAdmin, "1");
  window.localStorage.setItem(LEGACY_KEYS.loginTimestamp, String(session.createdAt));
}

function readLegacySession(now = Date.now()) {
  if (!canUseStorage()) return null;

  const isAdmin = window.localStorage.getItem(LEGACY_KEYS.isAdmin);
  const loginTimestamp = Number(window.localStorage.getItem(LEGACY_KEYS.loginTimestamp));

  if (isAdmin !== "1" || !Number.isFinite(loginTimestamp)) {
    return null;
  }

  const maxExpiresAt = loginTimestamp + ADMIN_SESSION_LIMITS.maxMs;
  if (now >= maxExpiresAt) {
    clearAdminSession();
    return null;
  }

  const session = {
    version: ADMIN_SESSION_LIMITS.version,
    username: "admin",
    createdAt: loginTimestamp,
    lastActivityAt: now,
    expiresAt: Math.min(now + ADMIN_SESSION_LIMITS.idleMs, maxExpiresAt),
    maxExpiresAt,
  };

  persistSession(session);
  return session;
}

function readStoredSession(now = Date.now()) {
  if (!canUseStorage()) return null;

  const stored = safeParse(window.localStorage.getItem(STORAGE_KEY));
  if (!stored) {
    return readLegacySession(now);
  }

  if (
    stored.version !== ADMIN_SESSION_LIMITS.version ||
    !Number.isFinite(stored.createdAt) ||
    !Number.isFinite(stored.lastActivityAt) ||
    !Number.isFinite(stored.expiresAt) ||
    !Number.isFinite(stored.maxExpiresAt)
  ) {
    clearAdminSession();
    return null;
  }

  return stored;
}

export function clearAdminSession() {
  if (!canUseStorage()) return;

  window.localStorage.removeItem(STORAGE_KEY);
  window.localStorage.removeItem(LEGACY_KEYS.isAdmin);
  window.localStorage.removeItem(LEGACY_KEYS.loginTimestamp);
}

export function createAdminSession({ username = "admin" } = {}, now = Date.now()) {
  const maxExpiresAt = now + ADMIN_SESSION_LIMITS.maxMs;
  const session = {
    version: ADMIN_SESSION_LIMITS.version,
    username,
    createdAt: now,
    lastActivityAt: now,
    expiresAt: Math.min(now + ADMIN_SESSION_LIMITS.idleMs, maxExpiresAt),
    maxExpiresAt,
  };

  persistSession(session);
  return session;
}

export function getAdminSession(now = Date.now()) {
  const session = readStoredSession(now);
  if (!session) return null;

  if (now >= session.expiresAt || now >= session.maxExpiresAt) {
    clearAdminSession();
    return null;
  }

  return session;
}

export function touchAdminSession(now = Date.now()) {
  const session = getAdminSession(now);
  if (!session) return null;

  const updated = {
    ...session,
    lastActivityAt: now,
    expiresAt: Math.min(now + ADMIN_SESSION_LIMITS.idleMs, session.maxExpiresAt),
  };

  persistSession(updated);
  return updated;
}

export function isAdminAuthenticated(now = Date.now()) {
  return Boolean(getAdminSession(now));
}
