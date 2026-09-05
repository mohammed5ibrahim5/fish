export type Lang = 'ar' | 'en';

export interface Category {
  id: string;
  name_ar: string;
  name_en: string;
  slug: string;
  image_url: string;
  icon: string;
  description_ar: string;
  description_en: string;
  sort_order: number;
  product_count?: number;
}

export interface ProductSpecs {
  length?: string;
  weight?: string;
  drag_power?: string;
  gear_ratio?: string;
  line_capacity?: string;
  bearing_count?: string;
  material?: string;
  target_fish?: string[];
  fishing_type?: string;
  water_type?: 'saltwater' | 'freshwater' | 'both';
  action?: string;
  power?: string;
  hook_size?: string;
  diving_depth?: string;
}

export interface Review {
  id: string;
  user_name: string;
  rating: number;
  date: string;
  comment: string;
  avatar?: string;
  verified?: boolean;
}

export interface Product {
  id: string;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  price: number;
  original_price?: number;
  discount_percent?: number;
  rating: number;
  review_count: number;
  stock: number;
  category_id: string;
  category_slug: string;
  brand: string;
  images: string[];
  is_featured?: boolean;
  is_best_seller?: boolean;
  is_new?: boolean;
  is_flash_deal?: boolean;
  specs: ProductSpecs;
  tags?: string[];
  reviews?: Review[];
  created_at?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedOption?: string;
}

export interface OrderItem {
  product_id: string;
  title_ar: string;
  title_en: string;
  price: number;
  quantity: number;
  image: string;
  selectedOption?: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  city: string;
  postal_code?: string;
  notes?: string;
  payment_method: 'cod' | 'card' | 'wallet' | 'mada';
  payment_status: 'pending' | 'paid' | 'failed';
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  subtotal: number;
  shipping_cost: number;
  discount: number;
  total: number;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'user';
  phone?: string;
  address?: string;
  city?: string;
  avatar_url?: string;
  created_at?: string;
}

export interface FishingSpot {
  id: string;
  title_ar: string;
  title_en: string;
  location_ar: string;
  location_en: string;
  image: string;
  rating: number;
  best_season_ar: string;
  best_season_en: string;
  target_species_ar: string[];
  target_species_en: string[];
  recommended_gear_ar: string;
  recommended_gear_en: string;
  depth?: string;
  difficulty?: 'مبتدئ' | 'متوسط' | 'محترف' | 'Beginner' | 'Intermediate' | 'Expert';
}

export interface WeatherTideInfo {
  location: string;
  temperature: number;
  feels_like: number;
  condition: string;
  condition_ar: string;
  wind_speed_knots: number;
  wind_direction: string;
  wave_height_meters: number;
  tide_state: 'مد عالي (High Tide)' | 'جزر منخفض (Low Tide)' | 'مد صاعد (Rising)' | 'جزر هابط (Falling)';
  moon_phase: string;
  moon_phase_ar: string;
  fishing_index: 'ممتاز 🎣🎣🎣' | 'جيد جداً 🎣🎣' | 'متوسط 🎣' | 'ضعيف';
  best_time: string;
}

export interface FishSpecies {
  id: string;
  name_ar: string;
  name_en: string;
  scientific_name: string;
  image: string;
  habitat_ar: string;
  habitat_en: string;
  water_type: 'saltwater' | 'freshwater' | 'both';
  best_season_ar: string;
  best_season_en: string;
  avg_weight_kg: string;
  depth_range: string;
  preferred_lures_ar: string[];
  preferred_lures_en: string[];
  technique_ar: string;
  technique_en: string;
  description_ar: string;
  description_en: string;
  recommended_category: string;
}

export interface BoatTrip {
  id: string;
  title_ar: string;
  title_en: string;
  location_ar: string;
  location_en: string;
  image: string;
  duration: string;
  max_anglers: number;
  price_per_person: number;
  private_boat_price: number;
  includes_gear: boolean;
  includes_food: boolean;
  target_species: string[];
  rating: number;
  reviews_count: number;
  departure_time: string;
  description_ar: string;
  description_en: string;
}

export interface CommunityCatch {
  id: string;
  angler_name: string;
  angler_avatar?: string;
  fish_species: string;
  weight_kg: number;
  location: string;
  image: string;
  tackle_used: string;
  date: string;
  likes_count: number;
}
