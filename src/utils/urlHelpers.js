const LEGACY_SUPABASE_HOSTS = [
  "yisnoymsunpomeuoxlem.supabase.co",
];

function getCurrentSupabaseHost() {
  try {
    const envUrl = import.meta?.env?.VITE_SUPABASE_URL;
    if (!envUrl) return null;
    return new URL(envUrl).host;
  } catch {
    return null;
  }
}

export function normalizeSupabasePublicUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== "string") return "";

  const url = rawUrl.trim();
  if (!url) return "";

  const currentHost = getCurrentSupabaseHost();
  if (!currentHost) return url;

  for (const legacyHost of LEGACY_SUPABASE_HOSTS) {
    const legacyPrefix = `https://${legacyHost}`;
    if (url.startsWith(legacyPrefix)) {
      return url.replace(legacyPrefix, `https://${currentHost}`);
    }
  }

  return url;
}

export function getResumeLinks(rawUrl) {
  const normalizedUrl = normalizeSupabasePublicUrl(rawUrl);
  if (!normalizedUrl) return { preview: "", download: "" };

  const driveFileMatch = normalizedUrl.match(/\/d\/([a-zA-Z0-9_-]+)(?:\/|$)/);
  if (driveFileMatch) {
    const fileId = driveFileMatch[1];
    return {
      preview: `https://drive.google.com/file/d/${fileId}/preview`,
      download: `https://drive.google.com/uc?export=download&id=${fileId}`,
    };
  }

  return { preview: normalizedUrl, download: normalizedUrl };
}
