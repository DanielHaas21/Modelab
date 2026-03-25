/**
 * Contains all basic routes
 * todo: Remove POST and GET, put all under one object
 */
export const ROUTES = {
  POST: {
    Category: '/category/',
    Tag: '/tag/',
    Asset: '/asset/',
    User: '/user/',
    Admin: '/admin/',
  },
  GET: {
    File: '/file/',
  },
} as const;
