import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  SlidersHorizontal,
  Search,
  Grid3X3,
  LayoutList,
  X,
  RotateCcw,
  ArrowUpDown,
  Layers
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { DataService } from '@/lib/dataService';
import type { Category, Product } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import CompareModal from '@/components/CompareModal';

export default function ShopPage() {
  const { lang } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  // Filters State
  const selectedCategory = searchParams.get('category') || 'all';
  const searchQuery = searchParams.get('q') || '';
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<number>(12000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Product Comparison state
  const [comparedProducts, setComparedProducts] = useState<Product[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  useEffect(() => {
    Promise.all([DataService.getCategories(), DataService.getProducts()]).then(([cats, prods]) => {
      setCategories(cats);
      setProducts(prods);
    });
  }, []);

  const brands = useMemo(() => {
    const set = new Set(products.map((p) => p.brand));
    return Array.from(set);
  }, [products]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matchTitle = (p.title_ar + ' ' + p.title_en).toLowerCase().includes(q);
          const matchDesc = (p.description_ar + ' ' + p.description_en).toLowerCase().includes(q);
          const matchBrand = p.brand.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchBrand) return false;
        }

        // Category
        if (selectedCategory !== 'all') {
          if (p.category_slug !== selectedCategory && p.category_id !== selectedCategory) return false;
        }

        // Brand
        if (selectedBrand !== 'all' && p.brand !== selectedBrand) return false;

        // Price
        if (p.price > priceRange) return false;

        // Stock
        if (inStockOnly && p.stock <= 0) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return (b.is_new ? 1 : 0) - (a.is_new ? 1 : 0);
        return 0;
      });
  }, [products, searchQuery, selectedCategory, selectedBrand, priceRange, inStockOnly, sortBy]);

  const handleCategoryChange = (slug: string) => {
    if (slug === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', slug);
    }
    setSearchParams(searchParams);
  };

  const handleSearchChange = (q: string) => {
    if (q) {
      searchParams.set('q', q);
    } else {
      searchParams.delete('q');
    }
    setSearchParams(searchParams);
  };

  const clearAllFilters = () => {
    setSearchParams({});
    setSelectedBrand('all');
    setPriceRange(12000);
    setInStockOnly(false);
    setSortBy('featured');
  };

  const handleCompareProduct = (product: Product) => {
    if (comparedProducts.some((p) => p.id === product.id)) {
      setComparedProducts((prev) => prev.filter((p) => p.id !== product.id));
    } else {
      if (comparedProducts.length >= 4) {
        alert(lang === 'ar' ? 'يمكنك مقارنة 4 منتجات كحد أقصى في نفس الوقت' : 'Max 4 products to compare');
        return;
      }
      setComparedProducts((prev) => [...prev, product]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title & Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {lang === 'ar' ? 'متجر معدات الصيد البحرية' : 'Fishing Tackle Store'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {lang === 'ar'
              ? `عرض ${filteredProducts.length} من أصل ${products.length} من أفضل المعدات المتاحة`
              : `Showing ${filteredProducts.length} of ${products.length} available products`}
          </p>
        </div>

        {/* Comparison Floating Badge Button */}
        {comparedProducts.length > 0 && (
          <button
            onClick={() => setIsCompareOpen(true)}
            className="btn-primary py-2.5 px-5 text-xs bg-ocean-800 hover:bg-ocean-900 flex items-center gap-2 shadow-lg animate-bounce"
          >
            <Layers className="w-4 h-4 text-ocean-300" />
            <span>
              {lang === 'ar'
                ? `مقارنة (${comparedProducts.length}) منتجات`
                : `Compare (${comparedProducts.length}) Products`}
            </span>
          </button>
        )}
      </div>

      {/* Main Content Layout (Sidebar Filters + Products Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* SIDEBAR FILTERS (DESKTOP) */}
        <aside
          className={`space-y-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-24 ${
            showMobileFilters ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <SlidersHorizontal className="w-4 h-4 text-ocean-600" />
              <span>{lang === 'ar' ? 'تصفية النتائج' : 'Filters'}</span>
            </div>
            <button
              onClick={clearAllFilters}
              className="text-xs text-slate-400 hover:text-rose-600 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{lang === 'ar' ? 'إعادة ضبط' : 'Reset'}</span>
            </button>
          </div>

          {/* Search in sidebar */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">{lang === 'ar' ? 'بحث بالاسم' : 'Search'}</label>
            <div className="relative">
              <input
                type="text"
                placeholder={lang === 'ar' ? 'اكتب اسم المنتج...' : 'Type keyword...'}
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="input-field py-2 pr-8 pl-3 text-xs rounded-xl"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5" />
            </div>
          </div>

          {/* Categories Filter */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-800">{lang === 'ar' ? 'الأقسام' : 'Categories'}</h4>
            <div className="space-y-1 text-xs">
              <button
                onClick={() => handleCategoryChange('all')}
                className={`w-full text-right py-1.5 px-3 rounded-xl transition-all flex items-center justify-between ${
                  selectedCategory === 'all'
                    ? 'bg-ocean-50 text-ocean-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{lang === 'ar' ? 'جميع الأقسام' : 'All Categories'}</span>
                <span className="text-[11px] text-slate-400">{products.length}</span>
              </button>
              {categories.map((cat) => {
                const count = products.filter(
                  (p) => p.category_slug === cat.slug || p.category_id === cat.id
                ).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.slug)}
                    className={`w-full text-right py-1.5 px-3 rounded-xl transition-all flex items-center justify-between ${
                      selectedCategory === cat.slug
                        ? 'bg-ocean-50 text-ocean-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{lang === 'ar' ? cat.name_ar : cat.name_en}</span>
                    <span className="text-[11px] text-slate-400">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Brands Filter */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-800">{lang === 'ar' ? 'العلامة التجارية' : 'Brand'}</h4>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="input-field py-2 text-xs rounded-xl"
            >
              <option value="all">{lang === 'ar' ? 'جميع الماركات' : 'All Brands'}</option>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-800">{lang === 'ar' ? 'أقصى سعر' : 'Max Price'}</span>
              <span className="text-ocean-600 font-black">{priceRange.toLocaleString()} EGP</span>
            </div>
            <input
              type="range"
              min="100"
              max="12000"
              step="100"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-ocean-600"
            />
          </div>

          {/* Stock Availability */}
          <div className="pt-3 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded text-ocean-600 focus:ring-ocean-500"
              />
              <span>{lang === 'ar' ? 'المنتجات المتوفرة فقط بالمخزون' : 'In Stock Only'}</span>
            </label>
          </div>
        </aside>

        {/* PRODUCTS AREA */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Sorting & View Mode Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
            {/* Mobile Filters Toggle Button */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden btn-secondary py-2 px-3 text-xs flex items-center gap-1.5"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'تصفية' : 'Filters'}</span>
            </button>

            {/* Active Chips */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {selectedCategory !== 'all' && (
                <span className="badge bg-ocean-50 text-ocean-700 border border-ocean-200 flex items-center gap-1 py-1">
                  <span>{selectedCategory}</span>
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-rose-500"
                    onClick={() => handleCategoryChange('all')}
                  />
                </span>
              )}
              {selectedBrand !== 'all' && (
                <span className="badge bg-ocean-50 text-ocean-700 border border-ocean-200 flex items-center gap-1 py-1">
                  <span>{selectedBrand}</span>
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-rose-500"
                    onClick={() => setSelectedBrand('all')}
                  />
                </span>
              )}
              {searchQuery && (
                <span className="badge bg-ocean-50 text-ocean-700 border border-ocean-200 flex items-center gap-1 py-1">
                  <span>{searchQuery}</span>
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-rose-500"
                    onClick={() => handleSearchChange('')}
                  />
                </span>
              )}
            </div>

            {/* Sorting Dropdown & View Mode Switch */}
            <div className="flex items-center gap-3 ms-auto">
              <div className="flex items-center gap-1.5">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest')}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700 outline-none"
                >
                  <option value="featured">{lang === 'ar' ? 'المقترحة والمميزة' : 'Featured'}</option>
                  <option value="price-asc">{lang === 'ar' ? 'السعر: من الأقل للأعلى' : 'Price: Low to High'}</option>
                  <option value="price-desc">{lang === 'ar' ? 'السعر: من الأعلى للأقل' : 'Price: High to Low'}</option>
                  <option value="rating">{lang === 'ar' ? 'الأعلى تقييماً' : 'Highest Rated'}</option>
                  <option value="newest">{lang === 'ar' ? 'الأحدث أولاً' : 'Newest'}</option>
                </select>
              </div>

              <div className="hidden sm:flex items-center border border-slate-200 rounded-xl p-1 bg-slate-50">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow text-ocean-600' : 'text-slate-400 hover:text-slate-700'
                  }`}
                  title="شبكة"
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-white shadow text-ocean-600' : 'text-slate-400 hover:text-slate-700'
                  }`}
                  title="قائمة"
                >
                  <LayoutList className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
              <div className="w-16 h-16 rounded-full bg-ocean-50 text-ocean-500 flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-800 text-lg mb-1">
                {lang === 'ar' ? 'لا توجد منتجات مطابقة لخيارات البحث' : 'No products found'}
              </h3>
              <p className="text-xs text-slate-500 mb-6 max-w-sm mx-auto">
                {lang === 'ar'
                  ? 'جرب تقليل فلاتر البحث أو اختيار تصنيف آخر للعثور على ما تبحث عنه'
                  : 'Try relaxing your filter parameters or search keyword.'}
              </p>
              <button onClick={clearAllFilters} className="btn-secondary text-xs py-2 px-4">
                {lang === 'ar' ? 'مسح كافة الفلاتر' : 'Clear All Filters'}
              </button>
            </div>
          ) : (
            <div
              className={`grid gap-6 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                  : 'grid-cols-1'
              }`}
            >
              {filteredProducts.map((p) => (
                <div key={p.id} className="relative">
                  <ProductCard product={p} onCompare={handleCompareProduct} />
                  {/* Compare checkbox shortcut */}
                  <button
                    onClick={() => handleCompareProduct(p)}
                    className={`mt-2 w-full py-1 text-[11px] font-semibold rounded-lg border transition-all flex items-center justify-center gap-1 ${
                      comparedProducts.some((item) => item.id === p.id)
                        ? 'bg-ocean-600 text-white border-ocean-600'
                        : 'bg-slate-50 text-slate-500 hover:bg-ocean-50 hover:text-ocean-700 border-slate-200'
                    }`}
                  >
                    <Layers className="w-3 h-3" />
                    <span>
                      {comparedProducts.some((item) => item.id === p.id)
                        ? lang === 'ar'
                          ? '✓ مضاف للمقارنة'
                          : '✓ Added to Compare'
                        : lang === 'ar'
                        ? '+ إضافة للمقارنة'
                        : '+ Add to Compare'}
                    </span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Compare Modal */}
      {isCompareOpen && (
        <CompareModal
          products={comparedProducts}
          onClose={() => setIsCompareOpen(false)}
          onRemove={(id) => setComparedProducts((prev) => prev.filter((p) => p.id !== id))}
        />
      )}
    </div>
  );
}
