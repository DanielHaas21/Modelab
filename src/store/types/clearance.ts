
export const CLEARANCE = {
  GUEST: 1,
  USER: 2,
  ADMIN: 3,
  OVERLORD: 4,
} as const;

export type Clearance = (typeof CLEARANCE)[keyof typeof CLEARANCE];