
export const ROUTE_MAP = {
  root: '/',
  tag: '/tag/',
  category: '/category/',
  asset: '/asset/',
  user: '/user/',
  admin: '/admin/',
  file: '/file/',
} as const;

export type ServiceVariant = keyof typeof ROUTE_MAP;

export const getServiceRoute = (variant: ServiceVariant): string => ROUTE_MAP[variant];