export type Volunteer = {
  id: number;
  img_url: string;
  title: string;
  detail: string;
  goals: any; // JSONB, can be typed more strictly if needed
  category: "pilar cerdas" | "pilar sehat" | "pilar lestari" | "pilar peduli";
  quota_available: number;
  time: string; // ISO string for timestamp
  location: string;
  tasks: string;
  criteria: string;
  file_document?: string | null;
  created_at: string;
  updated_at: string;
  price: number;
};
