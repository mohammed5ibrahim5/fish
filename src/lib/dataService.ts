import { supabase } from './supabase';
import type { Category, Product, Order, FishingSpot, WeatherTideInfo, FishSpecies, BoatTrip, CommunityCatch } from './types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_SPOTS,
  MOCK_WEATHER_DATA,
  INITIAL_ORDERS,
  INITIAL_FISH_SPECIES,
  INITIAL_BOAT_TRIPS,
  INITIAL_COMMUNITY_CATCHES,
} from './mockData';

const STORAGE_KEYS = {
  PRODUCTS: 'seapro_products_v1',
  CATEGORIES: 'seapro_categories_v1',
  ORDERS: 'seapro_orders_v1',
  SPOTS: 'seapro_spots_v1',
  FISH: 'seapro_fish_v1',
  TRIPS: 'seapro_trips_v1',
  COMMUNITY: 'seapro_community_v1',
};

// Safe LocalStorage helpers
function getLocal<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }
}

export const DataService = {
  // Categories
  async getCategories(): Promise<Category[]> {
    try {
      const { data, error } = await supabase.from('categories').select('*').order('sort_order');
      if (!error && data && data.length > 0) {
        setLocal(STORAGE_KEYS.CATEGORIES, data);
        return data as Category[];
      }
    } catch {
      // ignore
    }
    return getLocal(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  },

  async saveCategory(category: Category): Promise<Category> {
    try {
      const { data, error } = await supabase.from('categories').upsert(category).select().single();
      if (!error && data) {
        return data as Category;
      }
    } catch {
      // ignore
    }
    const categories = getLocal(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    const index = categories.findIndex((c) => c.id === category.id);
    if (index >= 0) {
      categories[index] = category;
    } else {
      categories.push(category);
    }
    setLocal(STORAGE_KEYS.CATEGORIES, categories);
    return category;
  },

  async deleteCategory(id: string): Promise<boolean> {
    try {
      await supabase.from('categories').delete().eq('id', id);
    } catch {
      // ignore
    }
    const categories = getLocal(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES).filter((c) => c.id !== id);
    setLocal(STORAGE_KEYS.CATEGORIES, categories);
    return true;
  },

  // Products
  normalizeProducts(products: any[]): Product[] {
    return products.map((p) => ({
      ...p,
      images: Array.isArray(p.images) ? p.images : [],
      specs: typeof p.specs === 'string' ? JSON.parse(p.specs) : (p.specs || {}),
      tags: Array.isArray(p.tags) ? p.tags : [],
      reviews: Array.isArray(p.reviews) ? p.reviews : [],
    }));
  },

  async getProducts(): Promise<Product[]> {
    let result: Product[] = [];
    try {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        result = this.normalizeProducts(data);
      }
    } catch {
      // fallback
    }
    if (result.length === 0) {
      const local = getLocal(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS) as any[];
      const hasGoodImages = local.length > 0 && local.every((p) => Array.isArray(p.images) && p.images.length > 0);
      if (hasGoodImages) {
        result = this.normalizeProducts(local);
      } else {
        result = this.normalizeProducts(INITIAL_PRODUCTS);
        localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
      }
    }
    result = result.length > 0
      ? result
      : this.normalizeProducts(INITIAL_PRODUCTS);
    setLocal(STORAGE_KEYS.PRODUCTS, result);
    return result;
  },

  async getProductById(id: string): Promise<Product | null> {
    const products = await this.getProducts();
    return products.find((p) => p.id === id) || null;
  },

  async saveProduct(product: Product): Promise<Product> {
    try {
      const { data, error } = await supabase.from('products').upsert(product).select().single();
      if (!error && data) {
        return data as Product;
      }
    } catch {
      // ignore
    }
    const products = getLocal(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const index = products.findIndex((p) => p.id === product.id);
    if (index >= 0) {
      products[index] = product;
    } else {
      products.unshift(product);
    }
    setLocal(STORAGE_KEYS.PRODUCTS, products);
    return product;
  },

  async deleteProduct(id: string): Promise<boolean> {
    try {
      await supabase.from('products').delete().eq('id', id);
    } catch {
      // ignore
    }
    const products = getLocal(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS).filter((p) => p.id !== id);
    setLocal(STORAGE_KEYS.PRODUCTS, products);
    return true;
  },

  // Orders
  async getOrders(): Promise<Order[]> {
    try {
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        setLocal(STORAGE_KEYS.ORDERS, data);
        return data as Order[];
      }
    } catch {
      // fallback
    }
    return getLocal(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  },

  async createOrder(orderData: Omit<Order, 'id' | 'order_number' | 'created_at'>): Promise<Order> {
    const newOrder: Order = {
      ...orderData,
      id: 'ord-' + Math.random().toString(36).substring(2, 9),
      order_number: 'SP-' + Math.floor(10000 + Math.random() * 90000),
      created_at: new Date().toISOString(),
    };

    try {
      const { data, error } = await supabase.from('orders').insert(newOrder).select().single();
      if (!error && data) {
        return data as Order;
      }
    } catch {
      // ignore
    }

    const orders = getLocal(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    orders.unshift(newOrder);
    setLocal(STORAGE_KEYS.ORDERS, orders);
    return newOrder;
  },

  async updateOrderStatus(id: string, status: Order['status']): Promise<boolean> {
    try {
      await supabase.from('orders').update({ status }).eq('id', id);
    } catch {
      // ignore
    }
    const orders = getLocal(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    const order = orders.find((o) => o.id === id);
    if (order) {
      order.status = status;
      setLocal(STORAGE_KEYS.ORDERS, orders);
      return true;
    }
    return false;
  },

  // Spots
  async getFishingSpots(): Promise<FishingSpot[]> {
    return getLocal(STORAGE_KEYS.SPOTS, INITIAL_SPOTS);
  },

  // Weather & Tide
  getWeatherAndTides(): WeatherTideInfo {
    return MOCK_WEATHER_DATA;
  },

  // Fish Species
  async getFishSpecies(): Promise<FishSpecies[]> {
    return getLocal(STORAGE_KEYS.FISH, INITIAL_FISH_SPECIES);
  },

  // Boat Trips
  async getBoatTrips(): Promise<BoatTrip[]> {
    return getLocal(STORAGE_KEYS.TRIPS, INITIAL_BOAT_TRIPS);
  },

  // Community Catches
  async getCommunityCatches(): Promise<CommunityCatch[]> {
    return getLocal(STORAGE_KEYS.COMMUNITY, INITIAL_COMMUNITY_CATCHES);
  },

  async addCommunityCatch(newCatch: Omit<CommunityCatch, 'id' | 'likes_count'>): Promise<CommunityCatch> {
    const item: CommunityCatch = {
      ...newCatch,
      id: 'catch-' + Date.now(),
      likes_count: 1,
    };
    const list = getLocal(STORAGE_KEYS.COMMUNITY, INITIAL_COMMUNITY_CATCHES);
    list.unshift(item);
    setLocal(STORAGE_KEYS.COMMUNITY, list);
    return item;
  },

  async toggleLikeCatch(catchId: string): Promise<number> {
    const list = getLocal(STORAGE_KEYS.COMMUNITY, INITIAL_COMMUNITY_CATCHES);
    const item = list.find((c) => c.id === catchId);
    if (item) {
      item.likes_count += 1;
      setLocal(STORAGE_KEYS.COMMUNITY, list);
      return item.likes_count;
    }
    return 0;
  },
};
