import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  Search,
  Menu,
  X,
  Compass,
  Waves,
  Zap,
  Fish,
  Anchor,
  Trophy
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import GearFinderModal from './GearFinderModal';

export default function Header() {
  const { lang, toggle } = useLanguage();
  const { user, profile } = useAuth();
  const { totalItems, setIsCartOpen } = useCart();
  const { wishlist: wishlistItems } = useWishlist();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isGearFinderOpen, setIsGearFinderOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { title_ar: 'الرئيسية', title_en: 'Home', path: '/' },
    { title_ar: 'المتجر', title_en: 'Shop', path: '/shop' },
    { title_ar: 'تجميعة الصيد (-15%)', title_en: 'Combo Builder', path: '/combo-builder', highlight: true, icon: <Zap className="w-3.5 h-3.5 text-amber-400" /> },
    { title_ar: 'موسوعة الأسماك', title_en: 'Fish Guide', path: '/fish-guide', icon: <Fish className="w-3.5 h-3.5 text-sky-400" /> },
    { title_ar: 'رحلات اليخوت', title_en: 'Boat Trips', path: '/trips', icon: <Anchor className="w-3.5 h-3.5 text-teal-400" /> },
    { title_ar: 'مجتمع الصيادين', title_en: 'Community', path: '/community', icon: <Trophy className="w-3.5 h-3.5 text-amber-400" /> },
    { title_ar: 'عن صيد برو', title_en: 'About Us', path: '/about' },
    { title_ar: 'اتصل بنا', title_en: 'Contact', path: '/contact' },
  ];

  return (
    <>
      {/* 1. Top Announcement Bar */}
      <div className="bg-ocean-950 text-ocean-100 text-xs py-2 px-4 border-b border-ocean-800/60 font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] sm:text-xs">
            <span className="badge bg-amber-400 text-slate-950 font-black text-[10px] uppercase px-1.5 py-0.5">
              {lang === 'ar' ? 'عرض خاص' : 'SPECIAL'}
            </span>
            <span>
              {lang === 'ar'
                ? 'خصم 15% على تجميعات الصيد وشحن مجاني لجميع الطلبات فوق 1500 ج.م كود: SEAPRO10'
                : '15% Off Tackle Combos & Free Shipping on orders over 1500 EGP with code: SEAPRO10'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => setIsGearFinderOpen(true)}
              className="hidden md:flex items-center gap-1.5 text-amber-300 hover:text-amber-200 transition-colors font-bold"
            >
              <Compass className="w-3.5 h-3.5 animate-spin-slow" />
              <span>{lang === 'ar' ? 'المساعد الذكي لاختيار العدة' : 'Gear Finder Quiz'}</span>
            </button>

            <span className="hidden md:inline text-ocean-700">|</span>

            {/* Language switch */}
            <button
              onClick={toggle}
              className="hover:text-white transition-colors font-bold uppercase tracking-wider text-[11px] flex items-center gap-1"
            >
              <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 shrink-0">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-ocean-700 via-ocean-600 to-sky-500 flex items-center justify-center text-white shadow-lg shadow-ocean-600/30">
                <Waves className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-1">
                  <span>صيد برو</span>
                  <span className="text-ocean-600 text-xs uppercase font-extrabold tracking-widest px-1.5 py-0.5 bg-ocean-50 rounded">
                    SeaPro
                  </span>
                </span>
                <span className="text-[10px] text-slate-400 font-semibold tracking-wider">
                  {lang === 'ar' ? 'المتجر الأول لمعدات الصيد البحرية' : 'Premium Offshore Tackle'}
                </span>
              </div>
            </Link>

            {/* Search Bar (Desktop) */}
            <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-md mx-6 relative">
              <input
                type="text"
                placeholder={lang === 'ar' ? 'ابحث عن قصبات، بكرات، طعوم، ماركات...' : 'Search rods, reels, lures, brands...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field py-2.5 pr-10 pl-4 text-xs rounded-2xl bg-slate-50 focus:bg-white transition-all shadow-inner"
              />
              <button type="submit" className="absolute right-3.5 top-3 text-slate-400 hover:text-ocean-600 transition-colors">
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Actions: Account, Wishlist, Cart Drawer Trigger */}
            <div className="flex items-center gap-3">
              {/* Account / Admin Link */}
              {user ? (
                <Link
                  to={profile?.role === 'admin' ? '/admin' : '/account'}
                  className="flex items-center gap-2 p-2 rounded-2xl hover:bg-slate-50 transition-colors text-slate-700 font-semibold text-xs border border-slate-200"
                >
                  <div className="w-7 h-7 rounded-xl bg-ocean-100 text-ocean-800 flex items-center justify-center text-xs font-bold">
                    {profile?.full_name?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden sm:inline font-bold">
                    {profile?.role === 'admin' ? (lang === 'ar' ? 'لوحة الإدارة' : 'Admin') : profile?.full_name?.split(' ')[0] || 'حسابي'}
                  </span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="btn-secondary text-xs py-2 px-4 rounded-xl font-bold hidden sm:inline-flex"
                >
                  {lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
                </Link>
              )}

              {/* Wishlist */}
              <Link
                to="/account"
                className="relative p-2.5 rounded-2xl text-slate-600 hover:text-ocean-600 hover:bg-ocean-50/60 transition-colors border border-transparent hover:border-ocean-100"
                title={lang === 'ar' ? 'المفضلة' : 'Wishlist'}
              >
                <Heart className="w-5 h-5" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full text-[10px] font-black flex items-center justify-center shadow-md animate-bounce">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              {/* Cart Button (Opens slide-over cart drawer) */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-2 p-2.5 sm:px-4 sm:py-2.5 rounded-2xl bg-ocean-600 hover:bg-ocean-700 text-white shadow-lg shadow-ocean-600/30 transition-all active:scale-95"
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="hidden sm:inline text-xs font-bold">{lang === 'ar' ? 'السلة' : 'Cart'}</span>
                {totalItems > 0 && (
                  <span className="w-5 h-5 rounded-full bg-white text-ocean-700 text-[11px] font-black flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-slate-800" />}
              </button>
            </div>
          </div>

          {/* 3. Navigation Bar (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 py-2.5 border-t border-slate-100 text-xs font-bold">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                    link.highlight
                      ? 'bg-gradient-to-r from-amber-500/10 to-amber-500/20 text-amber-900 border border-amber-300 font-extrabold'
                      : isActive
                      ? 'bg-ocean-50 text-ocean-700 font-extrabold'
                      : 'text-slate-600 hover:text-ocean-600 hover:bg-slate-50'
                  }`}
                >
                  {link.icon}
                  <span>{lang === 'ar' ? link.title_ar : link.title_en}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* 4. Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white p-4 space-y-4 animate-slide-up">
            {/* Search in mobile */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder={lang === 'ar' ? 'ابحث عن معدات الصيد...' : 'Search gear...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field py-2.5 pr-10 text-xs rounded-xl bg-slate-50"
              />
              <button type="submit" className="absolute right-3.5 top-3 text-slate-400">
                <Search className="w-4 h-4" />
              </button>
            </form>

            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`p-3 rounded-xl border flex items-center gap-2 ${
                    location.pathname === link.path
                      ? 'bg-ocean-50 border-ocean-200 text-ocean-700'
                      : 'border-slate-100 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {link.icon}
                  <span>{lang === 'ar' ? link.title_ar : link.title_en}</span>
                </Link>
              ))}
            </div>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsGearFinderOpen(true);
              }}
              className="w-full btn-secondary text-xs py-3 rounded-xl flex items-center justify-center gap-2 text-ocean-700 bg-ocean-50/60 border-ocean-200"
            >
              <Compass className="w-4 h-4 text-ocean-600" />
              <span>{lang === 'ar' ? 'المساعد الذكي لاختيار العدة' : 'Gear Finder Quiz'}</span>
            </button>
          </div>
        )}
      </header>

      {/* Smart Gear Finder Quiz Modal */}
      <GearFinderModal isOpen={isGearFinderOpen} onClose={() => setIsGearFinderOpen(false)} />
    </>
  );
}
