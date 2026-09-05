import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  ChevronRight,
  Fish,
  MessageSquarePlus,
  Compass
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useToast } from '@/components/Toast';
import { DataService } from '@/lib/dataService';
import type { Product, Review } from '@/lib/types';
import ProductCard from '@/components/ProductCard';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { lang } = useLanguage();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { success } = useToast();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'description' | 'reviews'>('specs');

  // New review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerRating, setReviewerRating] = useState(5);
  const [reviewerComment, setReviewerComment] = useState('');

  useEffect(() => {
    if (!id) return;
    DataService.getProductById(id).then((p) => {
      setProduct(p);
      if (p) {
        DataService.getProducts().then((all) => {
          setRelatedProducts(
            all.filter((item) => item.category_slug === p.category_slug && item.id !== p.id).slice(0, 4)
          );
        });
      }
    });
  }, [id]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-ocean-50 text-ocean-500 flex items-center justify-center mx-auto mb-4 animate-spin">
          <Compass className="w-8 h-8" />
        </div>
        <p className="text-slate-500 font-bold">{lang === 'ar' ? 'جاري تحميل تفاصيل المنتج...' : 'Loading gear...'}</p>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName || !reviewerComment) return;

    const newRev: Review = {
      id: 'rev-' + Date.now(),
      user_name: reviewerName,
      rating: reviewerRating,
      comment: reviewerComment,
      date: new Date().toISOString().split('T')[0],
      verified: true,
    };

    const updatedProduct = {
      ...product,
      review_count: product.review_count + 1,
      reviews: [newRev, ...(product.reviews || [])],
    };

    setProduct(updatedProduct);
    DataService.saveProduct(updatedProduct);
    setShowReviewForm(false);
    setReviewerName('');
    setReviewerComment('');
    success(lang === 'ar' ? 'شكراً لتقييمك! تمت إضافة مراجعتك بنجاح.' : 'Thank you! Review added.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-ocean-600">{lang === 'ar' ? 'الرئيسية' : 'Home'}</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/shop" className="hover:text-ocean-600">{lang === 'ar' ? 'المتجر' : 'Shop'}</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to={`/shop?category=${product.category_slug}`} className="hover:text-ocean-600">
          {product.category_slug}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 font-bold truncate max-w-xs">
          {lang === 'ar' ? product.title_ar : product.title_en}
        </span>
      </nav>

      {/* Main Product Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left / Gallery Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-square rounded-3xl overflow-hidden bg-slate-50 border border-slate-200 shadow-inner relative group">
            <img
              src={product.images[selectedImage] || product.images[0]}
              alt={lang === 'ar' ? product.title_ar : product.title_en}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {product.discount_percent && (
              <span className="absolute top-4 right-4 badge bg-rose-600 text-white font-black text-xs shadow-md">
                -{product.discount_percent}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                    selectedImage === i
                      ? 'border-ocean-600 ring-2 ring-ocean-500/20 scale-95'
                      : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right / Details & Purchasing */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="bg-ocean-50 text-ocean-700 text-xs font-extrabold px-3 py-1 rounded-xl border border-ocean-200/80">
                {product.brand}
              </span>
              <div className="flex items-center gap-1.5 text-amber-500 text-xs font-bold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
                <span className="text-slate-400 font-medium">({product.review_count} {lang === 'ar' ? 'تقييم' : 'reviews'})</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
              {lang === 'ar' ? product.title_ar : product.title_en}
            </h1>

            {/* Price section */}
            <div className="flex items-baseline gap-4 pt-2">
              <span className="text-3xl font-black text-ocean-700">
                {product.price.toLocaleString()}{' '}
                <span className="text-base font-semibold text-slate-500">{lang === 'ar' ? 'ج.م' : 'EGP'}</span>
              </span>
              {product.original_price && (
                <span className="text-lg line-through text-slate-400">
                  {product.original_price.toLocaleString()} EGP
                </span>
              )}
              {product.discount_percent && (
                <span className="badge bg-rose-50 text-rose-600 font-bold border border-rose-200">
                  {lang === 'ar' ? `وفر ${product.original_price! - product.price} ج.م` : `Save ${product.original_price! - product.price} EGP`}
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
              {lang === 'ar' ? product.description_ar : product.description_en}
            </p>
          </div>

          {/* Quick Specs Overview Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
            {product.specs.length && (
              <div>
                <span className="text-slate-400 block text-[11px]">{lang === 'ar' ? 'الطول' : 'Length'}</span>
                <span className="font-bold text-slate-800">{product.specs.length}</span>
              </div>
            )}
            {product.specs.drag_power && (
              <div>
                <span className="text-slate-400 block text-[11px]">{lang === 'ar' ? 'قوة السحب' : 'Drag Power'}</span>
                <span className="font-bold text-ocean-700">{product.specs.drag_power}</span>
              </div>
            )}
            {product.specs.gear_ratio && (
              <div>
                <span className="text-slate-400 block text-[11px]">{lang === 'ar' ? 'التروس' : 'Ratio'}</span>
                <span className="font-bold text-slate-800">{product.specs.gear_ratio}</span>
              </div>
            )}
            {product.specs.weight && (
              <div>
                <span className="text-slate-400 block text-[11px]">{lang === 'ar' ? 'الوزن' : 'Weight'}</span>
                <span className="font-bold text-slate-800">{product.specs.weight}</span>
              </div>
            )}
          </div>

          {/* Target Fish Tags */}
          {product.specs.target_fish && product.specs.target_fish.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <Fish className="w-3.5 h-3.5 text-ocean-600" />
                <span>{lang === 'ar' ? 'الأسماك المستهدفة بهذا العتاد:' : 'Target Species:'}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {product.specs.target_fish.map((fish, i) => (
                  <span
                    key={i}
                    className="badge bg-slate-100 text-slate-700 font-medium text-xs px-2.5 py-1"
                  >
                    {fish}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Purchasing Controls */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-slate-300 rounded-2xl bg-white shadow-sm overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-11 h-12 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-100"
                >
                  -
                </button>
                <span className="w-12 text-center font-extrabold text-sm text-slate-900">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-11 h-12 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-100"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => addToCart(product, quantity)}
                className="btn-primary flex-1 py-3.5 text-sm flex items-center justify-center gap-2 shadow-ocean-600/30"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{lang === 'ar' ? 'إضافة إلى سلة المشتريات' : 'Add to Shopping Cart'}</span>
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3.5 rounded-2xl border transition-all ${
                  inWishlist
                    ? 'bg-rose-50 border-rose-200 text-rose-500'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-400'
                }`}
                title="المفضلة"
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-rose-500' : ''}`} />
              </button>
            </div>

            <button
              onClick={handleBuyNow}
              className="btn-secondary w-full py-3 text-sm font-extrabold text-ocean-700 bg-ocean-50/50 hover:bg-ocean-100 border-ocean-300"
            >
              {lang === 'ar' ? 'شراء فوري مباشر (Buy Now)' : 'Instant Buy Now'}
            </button>
          </div>

          {/* Guarantees Box */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <Truck className="w-5 h-5 text-ocean-600 mx-auto mb-1" />
              <span className="font-bold block text-slate-800">{lang === 'ar' ? 'شحن فوري' : 'Fast Delivery'}</span>
              <span className="text-[11px] text-slate-400">{lang === 'ar' ? 'خلال 24-48 ساعة' : '24-48 hours'}</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <ShieldCheck className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <span className="font-bold block text-slate-800">{lang === 'ar' ? 'ضمان الوكيل' : 'Warranty'}</span>
              <span className="text-[11px] text-slate-400">{lang === 'ar' ? 'سنتين على العيوب' : '2-Year Official'}</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <RotateCcw className="w-5 h-5 text-amber-600 mx-auto mb-1" />
              <span className="font-bold block text-slate-800">{lang === 'ar' ? 'إرجاع مجاني' : 'Free Returns'}</span>
              <span className="text-[11px] text-slate-400">{lang === 'ar' ? 'خلال 14 يوم' : '14 Days'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex border-b border-slate-200 gap-6 mb-6">
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 text-sm font-bold transition-all relative ${
              activeTab === 'specs'
                ? 'text-ocean-600 border-b-2 border-ocean-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {lang === 'ar' ? 'المواصفات الفنية الكاملة' : 'Technical Specifications'}
          </button>
          <button
            onClick={() => setActiveTab('description')}
            className={`pb-3 text-sm font-bold transition-all relative ${
              activeTab === 'description'
                ? 'text-ocean-600 border-b-2 border-ocean-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {lang === 'ar' ? 'دليل الاستخدام والتقنيات' : 'Overview & Technologies'}
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 text-sm font-bold transition-all relative ${
              activeTab === 'reviews'
                ? 'text-ocean-600 border-b-2 border-ocean-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {lang === 'ar' ? `مراجعات الصيادين (${product.reviews?.length || 0})` : `Reviews (${product.reviews?.length || 0})`}
          </button>
        </div>

        {/* Tab 1: Specs Table */}
        {activeTab === 'specs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {Object.entries(product.specs).map(([key, val]) => {
              if (!val) return null;
              const displayVal = Array.isArray(val) ? val.join('، ') : String(val);
              return (
                <div
                  key={key}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100"
                >
                  <span className="font-semibold text-slate-500 capitalize">{key.replace('_', ' ')}</span>
                  <span className="font-bold text-slate-900 text-right">{displayVal}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Full Description */}
        {activeTab === 'description' && (
          <div className="prose prose-sm text-slate-700 max-w-none space-y-4">
            <p className="leading-relaxed">
              {lang === 'ar' ? product.description_ar : product.description_en}
            </p>
            <div className="bg-ocean-50/50 p-4 rounded-2xl border border-ocean-100">
              <h4 className="font-bold text-ocean-900 mb-2">
                {lang === 'ar' ? 'نصائح الخبراء في استخدام وصيانة هذه العدة:' : 'Pro Angler Care & Usage Tips:'}
              </h4>
              <ul className="list-disc list-inside space-y-1 text-xs text-ocean-800">
                <li>
                  {lang === 'ar'
                    ? 'غسل القصبة والبكرة بالماء العذب الفاتر بعد كل رحلة صيد بحرية لإزالة بلورات الملح.'
                    : 'Rinse with fresh lukewarm water after every saltwater outing to remove salt crystals.'}
                </li>
                <li>
                  {lang === 'ar'
                    ? 'تجنب وضع السنارة على الرمال أو الصخور الحادة لحماية حلقات التيتانيوم والكربون.'
                    : 'Never place carbon rods directly on abrasive sand or rocks to preserve guide rings.'}
                </li>
                <li>
                  {lang === 'ar'
                    ? 'تخفيف ذراع السحب (Drag) عند تخزين البكرة للحفاظ على كفاءة حلقات الكربون لفترات طويلة.'
                    : 'Loosen the drag knob during storage to relieve pressure on carbon drag washers.'}
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 3: Reviews */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  {lang === 'ar' ? 'تقييمات وتجارب المشترين' : 'Customer Reviews'}
                </h3>
                <p className="text-xs text-slate-500">
                  {lang === 'ar' ? 'تقييمات حقيقية موثقة من صيادين جربوا العدة' : 'Verified reviews from real anglers'}
                </p>
              </div>
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="btn-secondary py-2 px-4 text-xs flex items-center gap-1.5"
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span>{lang === 'ar' ? 'أضف تجربتك وتقييمك' : 'Write a Review'}</span>
              </button>
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <form onSubmit={handleAddReview} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 animate-slide-up">
                <h4 className="font-bold text-slate-900 text-sm">
                  {lang === 'ar' ? 'شارك رأيك في هذا المنتج' : 'Share Your Experience'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      {lang === 'ar' ? 'اسمك' : 'Your Name'}
                    </label>
                    <input
                      type="text"
                      required
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      placeholder="الكابتن ..."
                      className="input-field py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      {lang === 'ar' ? 'التقييم' : 'Rating'}
                    </label>
                    <select
                      value={reviewerRating}
                      onChange={(e) => setReviewerRating(Number(e.target.value))}
                      className="input-field py-2 text-xs"
                    >
                      <option value="5">⭐⭐⭐⭐⭐ (5/5) ممتاز جداً</option>
                      <option value="4">⭐⭐⭐⭐ (4/5) جيد جداً</option>
                      <option value="3">⭐⭐⭐ (3/5) متوسط</option>
                      <option value="2">⭐⭐ (2/5) مقبول</option>
                      <option value="1">⭐ (1/5) ضعيف</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {lang === 'ar' ? 'تعليقك وتجربتك الميدانية' : 'Your Review'}
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={reviewerComment}
                    onChange={(e) => setReviewerComment(e.target.value)}
                    placeholder={lang === 'ar' ? 'اكتب رأيك بصراحة عن جودة الرمي، السحب، المتانة...' : 'Write your honest feedback...'}
                    className="input-field py-2 text-xs"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="btn-ghost text-xs py-2 px-4"
                  >
                    {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button type="submit" className="btn-primary text-xs py-2 px-6">
                    {lang === 'ar' ? 'نشر التقييم' : 'Submit Review'}
                  </button>
                </div>
              </form>
            )}

            {/* Reviews List */}
            <div className="space-y-3">
              {(!product.reviews || product.reviews.length === 0) ? (
                <p className="text-xs text-slate-400 text-center py-6">
                  {lang === 'ar' ? 'كن أول من يكتب تقييماً لهذا المنتج الرائع!' : 'Be the first to review this gear!'}
                </p>
              ) : (
                product.reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-ocean-100 text-ocean-800 font-bold text-xs flex items-center justify-center">
                          {rev.user_name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-xs text-slate-900">{rev.user_name}</div>
                          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            {lang === 'ar' ? 'مشتري موثوق' : 'Verified Buyer'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                    <span className="text-[10px] text-slate-400 block text-left" dir="ltr">{rev.date}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-6">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {lang === 'ar' ? 'معدات صيد مشابهة قد تعجبك' : 'Related Fishing Tackle'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
