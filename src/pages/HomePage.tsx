import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Flame,
  Star,
  MapPin,
  ChevronRight,
  ShoppingBag
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { DataService } from '@/lib/dataService';
import type { Category, Product, FishingSpot } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import WeatherWidget from '@/components/WeatherWidget';
import GearFinderModal from '@/components/GearFinderModal';

export default function HomePage() {
  const { lang, dir } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [spots, setSpots] = useState<FishingSpot[]>([]);
  const [activeTab, setActiveTab] = useState<'featured' | 'bestseller' | 'deals'>('featured');
  const [isGearFinderOpen, setIsGearFinderOpen] = useState(false);

  // Flash deal countdown simulation
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 35, seconds: 42 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    DataService.getCategories().then(setCategories);
    DataService.getProducts().then(setProducts);
    DataService.getFishingSpots().then(setSpots);
  }, []);

  const flashDeals = products.filter((p) => p.is_flash_deal || p.discount_percent);
  const featuredProducts = products.filter((p) => p.is_featured);
  const bestSellers = products.filter((p) => p.is_best_seller);

  const displayedProducts =
    activeTab === 'featured'
      ? featuredProducts
      : activeTab === 'bestseller'
      ? bestSellers
      : flashDeals;

  return (
    <div className="space-y-16 pb-20 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[560px] lg:min-h-[620px] bg-gradient-to-r from-ocean-950 via-slate-900 to-ocean-900 text-white flex items-center overflow-hidden">
        {/* Background decorative elements & image overlay */}
        <div className="absolute inset-0 opacity-25 mix-blend-overlay pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-ocean-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Text & CTA */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-start animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-ocean-500/20 text-ocean-300 border border-ocean-400/30 px-3.5 py-1.5 rounded-full text-xs font-bold backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{lang === 'ar' ? 'تشكيلة موسم الصيد 2026 الحصرية' : 'Official 2026 Fishing Gear Collection'}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-tight">
                {lang === 'ar' ? (
                  <>
                    استعد لأعظم صيد <br />
                    مع أفضل <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-teal-300">معدات الصيد البحرية</span>
                  </>
                ) : (
                  <>
                    Gear Up For The Catch <br />
                    With Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-teal-300">Offshore & Shore</span> Tackle
                  </>
                )}
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                {lang === 'ar'
                  ? 'قصبات كربون فائقة القوة، بكرات دراج يابانية مقاومة للأملاح، طعوم حركية ثلاثية الأبعاد وسونارات أعماق ذكية من شيمانو، دايوا، وبين.'
                  : 'High-modulus carbon rods, corrosion-proof sealed reels, realistic Japanese lures, and Garmin fishfinders engineered for big game battles.'}
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/shop"
                  className="btn-primary py-3.5 px-8 text-sm bg-gradient-to-r from-ocean-500 to-ocean-700 shadow-ocean-600/40 hover:shadow-ocean-500/60"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'تسوق التشكيلة الآن' : 'Shop Collection'}</span>
                  {dir === 'rtl' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </Link>

                <button
                  onClick={() => setIsGearFinderOpen(true)}
                  className="btn-secondary py-3.5 px-6 text-sm text-white border-white/30 hover:bg-white/10 flex items-center gap-2 backdrop-blur-md"
                >
                  <Compass className="w-4 h-4 text-amber-400 animate-spin-slow" />
                  <span>{lang === 'ar' ? 'المساعد الذكي لاختيار العدة' : 'Smart Gear Finder'}</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-white/10 text-center lg:text-start">
                <div>
                  <div className="text-xl sm:text-2xl font-black text-white">+5,000</div>
                  <div className="text-xs text-slate-400">{lang === 'ar' ? 'صياد معتمد' : 'Happy Anglers'}</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-teal-300">100%</div>
                  <div className="text-xs text-slate-400">{lang === 'ar' ? 'ماركات أصلية' : 'Original Brands'}</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-amber-400">4.9 ★</div>
                  <div className="text-xs text-slate-400">{lang === 'ar' ? 'تقييم الزبائن' : 'Customer Rating'}</div>
                </div>
              </div>
            </div>

            {/* Hero Image Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="aspect-[4/3] rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl relative group">
                  <img
                    src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80"
                    alt="Fishing Gear"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  {/* Floating Promo Tag */}
                  <div className="absolute bottom-4 inset-x-4 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-ocean-300">
                        {lang === 'ar' ? 'قصبات شيمانو كولسنايبر XR' : 'Shimano ColtSniper XR'}
                      </div>
                      <div className="font-extrabold text-sm">
                        {lang === 'ar' ? 'خصم خاص 20% لفترة محدودة' : 'Special 20% Off'}
                      </div>
                    </div>
                    <Link
                      to="/shop?category=rods"
                      className="p-2 rounded-xl bg-ocean-500 hover:bg-ocean-600 text-white transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LIVE WEATHER & TIDES WIDGET */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <WeatherWidget />
      </section>

      {/* 3. CATEGORIES SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8">
          <div>
            <div className="text-xs font-bold text-ocean-600 uppercase tracking-wider mb-1">
              {lang === 'ar' ? 'تصفح حسب الفئة' : 'Explore by Category'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {lang === 'ar' ? 'أقسام معدات الصيد الرئيسية' : 'Featured Fishing Categories'}
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold text-ocean-600 hover:text-ocean-800 flex items-center gap-1 mt-2 sm:mt-0"
          >
            <span>{lang === 'ar' ? 'عرض كل الأقسام' : 'View All'}</span>
            {dir === 'rtl' ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.slice(0, 6).map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden border border-slate-200/80 bg-white shadow-sm hover:shadow-xl hover:border-ocean-300 transition-all duration-300 text-center p-3 flex flex-col items-center justify-between"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden mb-3 bg-slate-50 border border-slate-100">
                <img
                  src={cat.image_url}
                  alt={lang === 'ar' ? cat.name_ar : cat.name_en}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div>
                <h3 className="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-ocean-600 transition-colors line-clamp-1">
                  {lang === 'ar' ? cat.name_ar : cat.name_en}
                </h3>
                <span className="text-[11px] text-slate-400 mt-0.5 block">
                  {cat.product_count || 12} {lang === 'ar' ? 'منتج' : 'items'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. FLASH DEALS WITH COUNTDOWN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-rose-950 via-slate-900 to-rose-900 rounded-3xl p-6 sm:p-8 text-white border border-rose-800/40 relative overflow-hidden shadow-xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-rose-800/40 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-400/40 text-rose-400 flex items-center justify-center">
                <Flame className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    {lang === 'ar' ? 'عروض الفلاش والتخفيضات اليومية' : 'Daily Flash Deals'}
                  </h2>
                  <span className="badge bg-rose-500 text-white text-[11px] font-black">
                    {lang === 'ar' ? 'خصم يصل 25%' : 'Up to 25% OFF'}
                  </span>
                </div>
                <p className="text-xs text-rose-200 mt-0.5">
                  {lang === 'ar' ? 'كميات محدودة وأسعار استثنائية تنتهي قريباً' : 'Limited stock at exclusive prices'}
                </p>
              </div>
            </div>

            {/* Countdown Timer */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-rose-200 font-semibold">{lang === 'ar' ? 'ينتهي العرض خلال:' : 'Ends in:'}</span>
              <div className="flex items-center gap-1.5 font-mono font-bold text-sm">
                <span className="bg-white/10 px-2.5 py-1.5 rounded-xl border border-white/10">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span>:</span>
                <span className="bg-white/10 px-2.5 py-1.5 rounded-xl border border-white/10">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span>:</span>
                <span className="bg-white/10 px-2.5 py-1.5 rounded-xl border border-white/10 text-rose-400">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>

          {/* Flash Deals Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {flashDeals.slice(0, 4).map((p) => (
              <div key={p.id} className="text-slate-900">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FEATURED / BEST SELLER TABS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {lang === 'ar' ? 'معدات صيد مميزة ومختارة' : 'Curated Angler Gear'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {lang === 'ar' ? 'اخترنا لك أفضل القصبات والبكرات الحائزة على أعلى تقييمات' : 'Top rated tackle chosen by expert anglers'}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200">
            <button
              onClick={() => setActiveTab('featured')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'featured'
                  ? 'bg-white text-ocean-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lang === 'ar' ? 'المختارة' : 'Featured'}
            </button>
            <button
              onClick={() => setActiveTab('bestseller')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'bestseller'
                  ? 'bg-white text-ocean-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lang === 'ar' ? 'الأكثر مبيعاً' : 'Best Sellers'}
            </button>
            <button
              onClick={() => setActiveTab('deals')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'deals'
                  ? 'bg-white text-ocean-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lang === 'ar' ? 'العروض' : 'Deals'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. FISHING SPOTS & SEASONS GUIDE PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-ocean-400 uppercase tracking-wider mb-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'دليل الصياد الميداني' : 'Angler Field Guide'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {lang === 'ar' ? 'أفضل مناطق ومواسم الصيد الحالية' : 'Top Fishing Spots & Seasons'}
              </h2>
            </div>
            <Link
              to="/about"
              className="btn-secondary py-2.5 px-5 text-xs text-white border-white/20 hover:bg-white/10"
            >
              {lang === 'ar' ? 'استكشف الدليل الكامل' : 'Full Spot Guide'}
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {spots.map((spot) => (
              <div
                key={spot.id}
                className="bg-white/5 rounded-2xl p-5 border border-white/10 hover:border-ocean-500/40 hover:bg-white/10 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-video rounded-xl overflow-hidden mb-4 border border-white/10 relative">
                    <img src={spot.image} alt={spot.title_ar} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-amber-400 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{spot.rating}</span>
                    </div>
                  </div>

                  <h3 className="font-bold text-base text-white mb-1">
                    {lang === 'ar' ? spot.title_ar : spot.title_en}
                  </h3>
                  <div className="text-xs text-ocean-300 flex items-center gap-1 mb-3">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? spot.location_ar : spot.location_en}</span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-300 border-t border-white/10 pt-3">
                    <div>
                      <span className="text-slate-400 font-semibold">{lang === 'ar' ? 'أفضل موسم:' : 'Season:'} </span>
                      <span className="text-amber-300">{lang === 'ar' ? spot.best_season_ar : spot.best_season_en}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold">{lang === 'ar' ? 'السمك المستهدف:' : 'Target:'} </span>
                      <span>{(lang === 'ar' ? spot.target_species_ar : spot.target_species_en).join(' • ')}</span>
                    </div>
                  </div>
                </div>

                <Link
                  to="/shop"
                  className="mt-4 pt-3 border-t border-white/10 text-xs font-bold text-ocean-400 hover:text-ocean-300 flex items-center justify-between"
                >
                  <span>{lang === 'ar' ? 'تسوق العدة المناسبة لهذا المكان' : 'Shop Gear For This Spot'}</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. BRAND PARTNERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
          {lang === 'ar' ? 'وكلاء وموزعون لأقوى الماركات العالمية' : 'Authorized Distributors For Global Brands'}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-70 grayscale hover:grayscale-0 transition-all">
          {['SHIMANO', 'DAIWA', 'PENN', 'RAPALA', 'GARMIN', 'ABU GARCIA', 'CRESSI'].map((b) => (
            <span key={b} className="text-lg sm:text-xl font-black tracking-wider text-slate-700 hover:text-ocean-600 transition-colors">
              {b}
            </span>
          ))}
        </div>
      </section>

      {/* Gear Finder Modal */}
      <GearFinderModal isOpen={isGearFinderOpen} onClose={() => setIsGearFinderOpen(false)} />
    </div>
  );
}
