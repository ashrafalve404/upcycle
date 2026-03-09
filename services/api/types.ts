export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  avatar?: string;
  role: 'buyer' | 'seller' | 'designer' | 'admin';
  date_joined: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  condition: 'new' | 'like_new' | 'good' | 'fair' | 'poor';
  seller: User;
  status: 'available' | 'sold' | 'pending';
  created_at: string;
  updated_at: string;
}

export interface DesignRequest {
  id: number;
  title: string;
  description: string;
  item_images: string[];
  budget_min: number;
  budget_max: number;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  client: User;
  designer?: User;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  image?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  next: string | null;
  previous: string | null;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  username: string;
  first_name: string;
  last_name: string;
}
