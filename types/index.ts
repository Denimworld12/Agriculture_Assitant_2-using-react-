export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface Farmer {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  image: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  farmer: string;
  image: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: string;
  trackingSteps: TrackingStep[];
  farmers: Farmer[];
}

export interface TrackingStep {
  status: string;
  date: string;
  completed: boolean;
  description: string;
}

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
} 