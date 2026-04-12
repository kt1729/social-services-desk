export function isLocalMode(): boolean {
  return import.meta.env.VITE_LOCAL_MODE === 'true';
}
