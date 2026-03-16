export interface DataProp {
  id: number;
  name: string;
}

export interface BaseModel {
  id: number;
  name: string;
  author: string | null;
  description: string;
  category: DataProp;
  tags: DataProp[];
  created: Date;
}
