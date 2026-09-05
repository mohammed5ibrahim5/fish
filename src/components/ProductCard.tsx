import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, Star, Check } from 'lucide-react';
import type { Product } from '@/lib/types';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useLanguage } from '@/contexts/LanguageContext';
import QuickViewModal from './QuickViewModal';

interface ProductCardProps {
  product: Product;
  onCompare?: (product: Product) => void;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { lang } = useLanguage();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [showQuickView, setShowQuickView] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const inWishlist = isInWishlist(product.id);

  return (
    <>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative rounded-2xl bg-white border border-slate-200/80 hover:border-ocean-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
      >
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-slate-50">
          <Link to={`/product/${product.id}`} className="block w-full h-full">
            <img
              referrerPolicy="no-referrer"
              src={(product.images && product.images.length > 0) ? (isHovered && product.images[1] ? product.images[1] : product.images[0]) : 'https://via.placeholder.com/400x400?text=No+Image'}
              alt={lang === 'ar' ? product.title_ar : product.title_en}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </Link>

          {/* Badges */}
          <div className="absolute top-2.5 right-2.5 flex flex-col gap-1 z-10">
            {product.discount_percent && (
              <span className="badge bg-rose-600 text-white font-black shadow-sm">
                -{product.discount_percent}%
              </span>
            )}
            {product.is_best_seller && (
              <span className="badge bg-amber-500 text-white font-bold shadow-sm">
                {lang === 'ar' ? 'الأكثر مبيعاً' : 'Best Seller'}
              </span>
            )}
            {product.is_new && (
              <span className="badge bg-emerald-600 text-white font-bold shadow-sm">
                {lang === 'ar' ? 'جديد' : 'New'}
              </span>
            )}
          </div>

          {/* Action Buttons Overlay */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
            <button
              onClick={() => toggleWishlist(product)}
              className={`p-2 rounded-xl backdrop-blur-md transition-all shadow-md ${
                inWishlist
                  ? 'bg-rose-500 text-white'
                  : 'bg-white/80 hover:bg-white text-slate-700 hover:text-rose-500'
              }`}
              title={lang === 'ar' ? 'إضافة للمفضلة' : 'Wishlist'}
            >
              <Heart className={`w-4 h-4 ${inWishlist ? 'fill-white' : ''}`} />
            </button>
            <button
              onClick={() => setShowQuickView(true)}
              className="p-2 rounded-xl bg-white/80 hover:bg-white text-slate-700 hover:text-ocean-600 backdrop-blur-md transition-all shadow-md"
              title={lang === 'ar' ? 'معاينة سريعة' : 'Quick View'}
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Add To Cart bar on mobile or hover */}
          <button
            onClick={() => addToCart(product, 1)}
            className="absolute bottom-2 inset-x-2 bg-ocean-900/90 hover:bg-ocean-950 text-white py-2.5 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 backdrop-blur-sm shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'إضافة سريعة للسلة' : 'Quick Add'}</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1 justify-between gap-3">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold text-ocean-600 uppercase tracking-wide">{product.brand}</span>
              <div className="flex items-center gap-1 text-amber-500 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
                <span className="text-slate-400 font-normal">({product.review_count})</span>
              </div>
            </div>

            <Link
              to={`/product/${product.id}`}
              className="font-bold text-sm text-slate-800 hover:text-ocean-600 line-clamp-2 transition-colors leading-snug"
            >
              {lang === 'ar' ? product.title_ar : product.title_en}
            </Link>

            {product.specs?.fishing_type && (
              <div className="mt-1.5 inline-block text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                {product.specs?.fishing_type}
              </div>
            )}
          </div>

          {/* Price and Stock */}
          <div className="pt-2 border-t border-slate-100 flex items-end justify-between">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-extrabold text-slate-900">
                  {product.price.toLocaleString()}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {lang === 'ar' ? 'ج.م' : 'EGP'}
                </span>
              </div>
              {product.original_price && (
                <div className="text-[11px] line-through text-slate-400">
                  {product.original_price.toLocaleString()} EGP
                </div>
              )}
            </div>

            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
              <Check className="w-3 h-3" />
              <span>{lang === 'ar' ? 'متوفر' : 'In Stock'}</span>
            </div>
          </div>
        </div>
      </div>

      <QuickViewModal product={showQuickView ? product : null} onClose={() => setShowQuickView(false)} />
    </>
  );
}
