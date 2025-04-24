/**
 * Contains all basic routes
 */
export const routes = {
  POST: {
    Category: '/category/',
    Tag: '/tag/',
    Asset: '/asset/',
  },
  GET: {
    File: '/file/',
  },
} as const;
