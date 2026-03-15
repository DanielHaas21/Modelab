export interface ModelTagProp {
  id: number;
  name: string;
}

export interface ModelCategoryProp {
  id: number;
  name: string;
}

export interface BaseModel {
  id: number;
  name: string;
  description: string;
  category: ModelTagProp;
  tags: ModelCategoryProp[];
}
