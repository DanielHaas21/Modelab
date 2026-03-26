
export interface ServerHealthModel {
  serverTime: Date;
  services: {
    database: boolean;
  },
  version: string;
}

export interface ServerHealthRaw extends Omit<ServerHealthModel, 'serverTime'> {
  timestamp: number;
}
