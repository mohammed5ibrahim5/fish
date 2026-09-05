import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Product } from '@/lib/types';
import { useToast } from '@/components/Toast';

interface WishlistContextType {
  wishlist: Product[];
  wishlistCount: number;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('seapro_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const { info, success } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem('seapro_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  const isInWishlist = useCallback(
    (productId: string) => wishlist.some((p) => p.id === productId),
    [wishlist]
  );

  const toggleWishlist = useCallback(
    (product: Product) => {
      setWishlist((prev) => {
        const exists = prev.some((p) => p.id === product.id);
        if (exists) {
          info(`تمت إزالة "${product.title_ar}" من المفضلة`);
          return prev.filter((p) => p.id !== product.id);
        } else {
          success(`تمت إضافة "${product.title_ar}" إلى قائمة رغباتك! ❤️`);
          return [...prev, product];
        }
      });
    },
    [info, success]
  );

  const removeFromWishlist = useCallback((productId: string) => {
    setWishlist((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  const clearWishlist = useCallback(() => {
    setWishlist([]);
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
