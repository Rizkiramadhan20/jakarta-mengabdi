export interface JMerch {
  id: number;
  name: string;
  thumbnail?: string[]; // array of image URLs
  created_at: string;
}

export interface OnlineStore {
  id: number;
  name: string;
  url: string;
  created_at: string;
}
