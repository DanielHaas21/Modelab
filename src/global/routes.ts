
/**
 * A tuple of all the routes in the application. 
 */
export const ROOT_ROUTES = {
  LandingPage: '/',
  Browser: '/browser',
  About: '/about',
  ModelDetail: '/models/',
  ModelManage: '/manage/',
  AdminRoot: '/admin/',
} as const;

/**
 * A tuple of all the admin routes. 
 */
export const ADMIN_ROUTES = {
  Panel: '/',
  Login: '/login/',
  Users: '/users/',
  Assets: '/assets/',
} as const;