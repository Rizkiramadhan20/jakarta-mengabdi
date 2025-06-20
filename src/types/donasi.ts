export interface Donasi {
  id: number;
  title: string;
  description?: string;
  image_url?: string;
  target_amount: number;
  current_amount: number;
  status: "open" | "closed";
  deadline?: string;
  created_at: string;
  message_template?: string;
}
