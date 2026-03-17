/**
 * A tuple of all the routes in the application. 
 */
export const BrowserRoutes = {
  LandingPage: '/',
  Browser: '/browser',
  About: '/about',
  ModelDetail: '/models/',
  ModelManage: '/manage/',
  AdminRoot: '/admin/',
} as const;

/**
 * A tuple of all the routes in the application. 
 */
export const AdminRoutes = {
  Panel: '/',
  Login: '/login/',
  Users: '/users/',
  Assets: '/assets/',
} as const;