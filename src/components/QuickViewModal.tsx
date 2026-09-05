import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Star, ShoppingBag, Heart, Check, ExternalLink } from 'lucide-react';
import type { Product } from '@/lib/types';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const { lang } = useLanguage();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Images Gallery */}
          <div className="p-6 bg-slate-50 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-100">
            <div className="aspect-square rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-inner mb-4">
              <img
                src={product.images[selectedImage] || product.images[0]}
                alt={lang === 'ar' ? product.title_ar : product.title_en}
                className="w-full h-full object-cover transition-all duration-300"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === i ? 'border-ocean-600 ring-2 ring-ocean-500/20' : 'border-slate-200 opacity-70'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-ocean-600 bg-ocean-50 px-2.5 py-1 rounded-lg">
                  {product.brand}
                </span>
                <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{product.rating}</span>
                  <span className="text-slate-400 font-normal">({product.review_count})</span>
                </div>
              </div>

              <h2 className="text-xl font-extrabold text-slate-900 leading-snug">
                {lang === 'ar' ? product.title_ar : product.title_en}
              </h2>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-black text-slate-900">
                  {product.price.toLocaleString()}{' '}
                  <span className="text-sm font-semibold text-slate-500">{lang === 'ar' ? 'ج.م' : 'EGP'}</span>
                </span>
                {product.original_price && (
                  <span className="text-sm line-through text-slate-400">
                    {product.original_price.toLocaleString()} EGP
                  </span>
                )}
                {product.discount_percent && (
                  <span className="badge bg-rose-50 text-rose-600 border border-rose-200 font-bold">
                    -{product.discount_percent}%
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                {lang === 'ar' ? product.description_ar : product.description_en}
              </p>

              {/* Specs Quick Highlights */}
              <div className="bg-slate-50 rounded-2xl p-3.5 space-y-1.5 border border-slate-100 text-xs">
                {product.specs.length && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">{lang === 'ar' ? 'الطول:' : 'Length:'}</span>
                    <span className="font-semibold text-slate-800">{product.specs.length}</span>
                  </div>
                )}
                {product.specs.drag_power && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">{lang === 'ar' ? 'قوة السحب:' : 'Drag Power:'}</span>
                    <span className="font-semibold text-slate-800">{product.specs.drag_power}</span>
                  </div>
                )}
                {product.specs.gear_ratio && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">{lang === 'ar' ? 'نسبة التروس:' : 'Gear Ratio:'}</span>
                    <span className="font-semibold text-slate-800">{product.specs.gear_ratio}</span>
                  </div>
                )}
                {product.specs.fishing_type && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">{lang === 'ar' ? 'نوع الصيد:' : 'Style:'}</span>
                    <span className="font-semibold text-ocean-700">{product.specs.fishing_type}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-5 mt-4 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-300 rounded-xl bg-slate-50 overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-9 h-10 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-200"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-bold text-sm text-slate-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-9 h-10 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-200"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="btn-primary flex-1 py-3 text-sm flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'أضف للسلة' : 'Add to Cart'}</span>
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-3 rounded-xl border transition-all ${
                    inWishlist
                      ? 'bg-rose-50 border-rose-200 text-rose-500'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-400'
                  }`}
                  title="المفضلة"
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? 'fill-rose-500' : ''}`} />
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
                <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                  <Check className="w-3.5 h-3.5" />
                  {lang === 'ar' ? 'متوفر وجاهز للشحن الفوري' : 'In Stock & Ready to Ship'}
                </span>
                <Link
                  to={`/product/${product.id}`}
                  onClick={onClose}
                  className="text-ocean-600 hover:underline font-bold flex items-center gap-1"
                >
                  <span>{lang === 'ar' ? 'تفاصيل أكثر' : 'Full Details'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
