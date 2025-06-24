export interface Product {
  id: number;
  name: string;
  content: string;
  category: string;
  price: number;
  stock: number;
  sold: number;
  image_urls?: string[];
  created_at: string;
  status: string;
  slug: string;
}

export interface Category {
  id: number;
  name: string;
  thumbnail?: string;
  created_at: string;
}
