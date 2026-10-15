export function getStoredAdminSeason(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem("admin_season_filter");
  } catch {
    return null;
  }
}

export function setStoredAdminSeason(seasonCode: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("admin_season_filter", seasonCode);
  } catch {
    // Ignore localStorage errors
  }
}
