export function scrollToSection(id, options = {}) {
  if (typeof window === "undefined" || typeof document === "undefined" || !id) {
    return false;
  }

  const { behavior = "smooth", offset = 80, updateHash = true } = options;

  if (id === "home") {
    window.scrollTo({ top: 0, behavior });
    if (updateHash) {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    }
    return true;
  }

  const element = document.getElementById(id);
  if (!element) return false;

  const targetTop = Math.max(0, element.getBoundingClientRect().top + window.scrollY - offset);
  window.scrollTo({ top: targetTop, behavior });

  if (updateHash) {
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}#${id}`
    );
  }

  return true;
}
