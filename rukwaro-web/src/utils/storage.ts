/* ------------------------------------------------------------------ */
/* Safe localStorage helpers (SSR/private-mode safe)                   */
/* ------------------------------------------------------------------ */

export function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveJSON(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota / private mode — fail silently, app still works in-memory
  }
}

export function removeFromStorage(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* noop */
  }
}

/* Storage keys used across the app */
export const STORAGE_KEYS = {
  CART: 'rukwaro.cart.v1',
  GARAGE: 'rukwaro.garage.v1',
  ACTIVE_VEHICLE: 'rukwaro.activeVehicle.v1',
  RECENTLY_VIEWED: 'rukwaro.recentlyViewed.v1',
  BRANCH: 'rukwaro.branch.v1',
} as const;
