export interface Product {
  id: number;
  name: string;
  content: string;
  price: number;
  stock: number;
  sold: number;
  image_urls?: string[];
  created_at: string;
  status: string;
  slug: string;
}
