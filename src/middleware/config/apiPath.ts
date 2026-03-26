
export const API_PATH = (() => {
  const path = (import.meta.env.VITE_API_PATH as string).trim();
  return path.endsWith('/') ? path.substring(0, path.length - 1) : path;
})();