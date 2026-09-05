import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { CartItem, Product } from '@/lib/types';
import { useToast } from '@/components/Toast';

export interface AppliedCoupon {
  code: string;
  discountPercent?: number;
  fixedDiscount?: number;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  freeShippingThreshold: number;
  freeShippingProgress: number;
  isDrawerOpen: boolean;
  appliedCoupon: AppliedCoupon | null;
  addToCart: (product: Product, quantity?: number, selectedOption?: string) => void;
  removeFromCart: (productId: string, selectedOption?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedOption?: string) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD = 1500;
const BASE_SHIPPING_COST = 50;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('seapro_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(() => {
    try {
      const saved = localStorage.getItem('seapro_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const { success } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem('seapro_cart', JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  }, [items]);

  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem('seapro_coupon', JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem('seapro_coupon');
      }
    } catch (e) {
      console.error(e);
    }
  }, [appliedCoupon]);

  const addToCart = useCallback(
    (product: Product, quantity = 1, selectedOption?: string) => {
      setItems((prev) => {
        const existingIndex = prev.findIndex(
          (item) => item.product.id === product.id && item.selectedOption === selectedOption
        );
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + quantity,
          };
          return updated;
        }
        return [...prev, { product, quantity, selectedOption }];
      });
      success(`تمت إضافة "${product.title_ar}" إلى سلة المشتريات!`, 'تمت الإضافة');
      setIsDrawerOpen(true);
    },
    [success]
  );

  const removeFromCart = useCallback((productId: string, selectedOption?: string) => {
    setItems((prev) =>
      prev.filter((item) => !(item.product.id === productId && item.selectedOption === selectedOption))
    );
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number, selectedOption?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedOption);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.selectedOption === selectedOption
          ? { ...item, quantity }
          : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
    setAppliedCoupon(null);
  }, []);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);
  const toggleDrawer = useCallback(() => setIsDrawerOpen((p) => !p), []);

  const applyCoupon = useCallback((code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'SEAPRO10' || clean === 'DISCOUNT10') {
      const coupon = { code: clean, discountPercent: 10 };
      setAppliedCoupon(coupon);
      return { success: true, message: 'تم تطبيق خصم 10% بنجاح!' };
    }
    if (clean === 'FISHERMAN' || clean === 'VIP') {
      const coupon = { code: clean, fixedDiscount: 100 };
      setAppliedCoupon(coupon);
      return { success: true, message: 'تم خصم 100 ج.م / ر.س بنجاح!' };
    }
    return { success: false, message: 'كوبون الخصم غير صالح أو منتهي الصلاحية' };
  }, []);

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
  }, []);

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : BASE_SHIPPING_COST;

  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      discount = (subtotal * appliedCoupon.discountPercent) / 100;
    } else if (appliedCoupon.fixedDiscount) {
      discount = Math.min(subtotal, appliedCoupon.fixedDiscount);
    }
  }

  const total = Math.max(0, subtotal - discount + shippingCost);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        shippingCost,
        discount,
        total,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        freeShippingProgress,
        isDrawerOpen,
        appliedCoupon,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        openDrawer,
        closeDrawer,
        toggleDrawer,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
