import { Ionicons } from "@expo/vector-icons";
export interface Service {
  id: number;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  jobs: number;
}

export interface Booking {
  id: number;
  professional: string;
  service: string;
  status: "Completed" | "In Progress" | "Scheduled";
  rating: number;
  date: string;
  emoji: string;
}

export interface Professional {
  id: number;
  name: string;
  service: string;
  rating: number;
  jobs: number;
  rate: string;
  emoji: string;
}

export interface WorkPhoto {
  id: number;
  url: string;
  title: string;
  date: string;
  likes: number;
}

export interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
  emoji: string;
  helpful: number;
}

export interface Certificate {
  id: number;
  title: string;
  issuer: string;
  year: string;
  verified: boolean;
}
