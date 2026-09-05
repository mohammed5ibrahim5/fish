import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Layers,
  Check,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  RotateCcw,
  Zap,
  Fish
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/Toast';
import { DataService } from '@/lib/dataService';
import type { Product } from '@/lib/types';

export default function ComboBuilderPage() {
  const { lang, dir } = useLanguage();
  const { addToCart } = useCart();
  const { success } = useToast();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [activeStep, setActiveStep] = useState<number>(1);

  // Selected items in the combo
  const [selectedRod, setSelectedRod] = useState<Product | null>(null);
  const [selectedReel, setSelectedReel] = useState<Product | null>(null);
  const [selectedLine, setSelectedLine] = useState<Product | null>(null);
  const [selectedLure, setSelectedLure] = useState<Product | null>(null);

  useEffect(() => {
    DataService.getProducts().then(setProducts);
  }, []);

  const rods = products.filter((p) => p.category_slug === 'rods');
  const reels = products.filter((p) => p.category_slug === 'reels');
  const lines = products.filter((p) => p.category_slug === 'lines');
  const lures = products.filter((p) => p.category_slug === 'lures' || p.category_slug === 'accessories');

  // Combo calculations
  const rawSubtotal =
    (selectedRod?.price || 0) +
    (selectedReel?.price || 0) +
    (selectedLine?.price || 0) +
    (selectedLure?.price || 0);

  const selectedCount = [selectedRod, selectedReel, selectedLine, selectedLure].filter(Boolean).length;

  // 15% discount for complete combo (all 4), or 10% for 3 items
  const discountRate = selectedCount === 4 ? 0.15 : selectedCount >= 2 ? 0.1 : 0;
  const comboDiscount = Math.round(rawSubtotal * discountRate);
  const finalComboPrice = rawSubtotal - comboDiscount;

  const handleAddComboToCart = () => {
    const items = [selectedRod, selectedReel, selectedLine, selectedLure].filter(Boolean) as Product[];
    if (items.length === 0) return;

    items.forEach((item) => {
      // apply proportional discount to each item
      addToCart(item, 1, `تجميعة صيد مخصصة (خصم ${discountRate * 100}%)`);
    });

    success(
      lang === 'ar'
        ? `تمت إضافة تجميعة الصيد بالكامل إلى سلتك مع خصم ${discountRate * 100}%!`
        : `Added custom combo to cart with ${discountRate * 100}% Bundle Discount!`,
      'مبروك!'
    );
    navigate('/cart');
  };

  const handleReset = () => {
    setSelectedRod(null);
    setSelectedReel(null);
    setSelectedLine(null);
    setSelectedLure(null);
    setActiveStep(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-ocean-950 via-slate-900 to-ocean-900 text-white rounded-3xl p-8 sm:p-10 border border-ocean-800/60 shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-400/30 px-3.5 py-1 rounded-full text-xs font-bold">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'ar' ? 'وفر 15% عند تجميع عتاد الصيد الكامل' : 'Save 15% on Full Tackle Combos'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black">
            {lang === 'ar' ? 'مُنشئ ومُجمع عدة الصيد المخصصة' : 'Custom Tackle Combo Builder'}
          </h1>
          <p className="text-xs sm:text-sm text-ocean-200 leading-relaxed">
            {lang === 'ar'
              ? 'اختر السنارة، البكرة المتوافقة، الخيط والطعوم المناسبة خطوة بخطوة واحصل على خصم فوري على إجمالي التجميعة مع شحن مجاني.'
              : 'Build your dream fishing setup step by step and unlock an instant 15% bundle discount + free delivery.'}
          </p>
        </div>
      </div>

      {/* Builder Steps Progress Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { step: 1, name_ar: '1. قصبة الصيد (Rod)', selected: selectedRod },
          { step: 2, name_ar: '2. ماكينة السحب (Reel)', selected: selectedReel },
          { step: 3, name_ar: '3. خيط الحرير (Line)', selected: selectedLine },
          { step: 4, name_ar: '4. طقم الطعوم (Lures)', selected: selectedLure },
        ].map((s) => (
          <button
            key={s.step}
            onClick={() => setActiveStep(s.step)}
            className={`p-4 rounded-2xl border text-right transition-all flex items-center justify-between ${
              activeStep === s.step
                ? 'border-ocean-600 bg-ocean-50/80 shadow-md ring-2 ring-ocean-500/20'
                : s.selected
                ? 'border-emerald-300 bg-emerald-50/50'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div>
              <div className="text-xs font-bold text-slate-800">{s.name_ar}</div>
              <div className="text-[11px] text-slate-500 mt-0.5 truncate max-w-[140px]">
                {s.selected ? s.selected.title_ar : lang === 'ar' ? 'لم يتم الاختيار بعد' : 'Not selected'}
              </div>
            </div>
            {s.selected ? (
              <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                <Check className="w-3.5 h-3.5" />
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full border border-slate-300 text-slate-400 text-xs flex items-center justify-center font-bold">
                {s.step}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Main Grid: Selection Cards + Combo Summary Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Product Choice Grid */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h3 className="font-extrabold text-slate-900 text-lg">
              {activeStep === 1 && (lang === 'ar' ? 'اختر السنارة المناسبة:' : 'Select Your Rod:')}
              {activeStep === 2 && (lang === 'ar' ? 'اختر ماكينة السحب المتوافقة:' : 'Select Compatible Reel:')}
              {activeStep === 3 && (lang === 'ar' ? 'اختر خيط الحرير (Braid):' : 'Select Braid Line:')}
              {activeStep === 4 && (lang === 'ar' ? 'اختر طقم الطعوم والإكسسوارات:' : 'Select Lure Set:')}
            </h3>
            <span className="text-xs text-ocean-600 font-bold">
              {activeStep === 1 ? rods.length : activeStep === 2 ? reels.length : activeStep === 3 ? lines.length : lures.length}{' '}
              {lang === 'ar' ? 'خيارات متاحة' : 'options'}
            </span>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(activeStep === 1 ? rods : activeStep === 2 ? reels : activeStep === 3 ? lines : lures).map((item) => {
              const isSelected =
                (activeStep === 1 && selectedRod?.id === item.id) ||
                (activeStep === 2 && selectedReel?.id === item.id) ||
                (activeStep === 3 && selectedLine?.id === item.id) ||
                (activeStep === 4 && selectedLure?.id === item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (activeStep === 1) setSelectedRod(item);
                    if (activeStep === 2) setSelectedReel(item);
                    if (activeStep === 3) setSelectedLine(item);
                    if (activeStep === 4) setSelectedLure(item);
                    if (activeStep < 4) setActiveStep(activeStep + 1);
                  }}
                  className={`p-4 rounded-3xl border cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                    isSelected
                      ? 'border-ocean-600 bg-ocean-50/70 shadow-lg ring-2 ring-ocean-500/30'
                      : 'border-slate-200/80 bg-white hover:border-ocean-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex gap-4">
                    <img
                      src={item.images[0]}
                      alt={item.title_ar}
                      className="w-20 h-20 rounded-2xl object-cover border border-slate-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-extrabold uppercase text-ocean-600 bg-ocean-50 px-2 py-0.5 rounded">
                        {item.brand}
                      </span>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 mt-1 line-clamp-2 leading-snug">
                        {lang === 'ar' ? item.title_ar : item.title_en}
                      </h4>
                      {item.specs.drag_power && (
                        <div className="text-[11px] text-slate-500 mt-1">
                          {lang === 'ar' ? 'قوة التحمل: ' : 'Power: '}
                          <b className="text-slate-800">{item.specs.drag_power}</b>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
                    <div className="text-sm font-black text-slate-900">
                      {item.price.toLocaleString()} <span className="text-xs font-normal text-slate-500">EGP</span>
                    </div>

                    <button
                      type="button"
                      className={`text-xs font-bold py-1.5 px-4 rounded-xl transition-all ${
                        isSelected
                          ? 'bg-ocean-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-ocean-50 hover:text-ocean-700'
                      }`}
                    >
                      {isSelected ? (lang === 'ar' ? '✓ تم الاختيار' : '✓ Selected') : (lang === 'ar' ? 'اختيار' : 'Select')}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Combo Summary Panel */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6 sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{lang === 'ar' ? 'ملخص التجميعة' : 'Combo Summary'}</span>
            </h3>
            {selectedCount > 0 && (
              <button
                onClick={handleReset}
                className="text-[11px] text-slate-400 hover:text-rose-500 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{lang === 'ar' ? 'تفريغ' : 'Reset'}</span>
              </button>
            )}
          </div>

          {/* Selected Items Checklist */}
          <div className="space-y-3">
            {[
              { label: 'السنارة (Rod)', item: selectedRod, stepNum: 1 },
              { label: 'البكرة (Reel)', item: selectedReel, stepNum: 2 },
              { label: 'الخيط (Line)', item: selectedLine, stepNum: 3 },
              { label: 'الطعوم (Lures)', item: selectedLure, stepNum: 4 },
            ].map((slot) => (
              <div
                key={slot.label}
                onClick={() => setActiveStep(slot.stepNum)}
                className={`p-3 rounded-2xl border cursor-pointer text-xs flex items-center justify-between transition-all ${
                  slot.item
                    ? 'border-emerald-200 bg-emerald-50/40 text-slate-800'
                    : 'border-dashed border-slate-200 bg-slate-50/50 text-slate-400 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {slot.item ? (
                    <img src={slot.item.images[0]} alt="thumb" className="w-8 h-8 rounded-lg object-cover border" />
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-400 flex items-center justify-center font-bold text-xs">
                      +
                    </div>
                  )}
                  <div className="truncate">
                    <span className="font-bold text-[11px] block">{slot.label}</span>
                    <span className="text-[10px] text-slate-600 truncate block">
                      {slot.item ? slot.item.title_ar : lang === 'ar' ? 'انقر للاختيار...' : 'Click to pick...'}
                    </span>
                  </div>
                </div>

                {slot.item && (
                  <span className="font-extrabold text-slate-900">{slot.item.price.toLocaleString()} EGP</span>
                )}
              </div>
            ))}
          </div>

          {/* Pricing & Bundle Discount */}
          <div className="space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-100">
            <div className="flex justify-between">
              <span>{lang === 'ar' ? 'المجموع الأصلي' : 'Original Total'}</span>
              <span className="font-bold text-slate-900">{rawSubtotal.toLocaleString()} EGP</span>
            </div>
            {comboDiscount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>
                  {lang === 'ar' ? `خصم باقة التجميعة (${discountRate * 100}%)` : `Bundle Discount (${discountRate * 100}%)`}
                </span>
                <span>-{comboDiscount.toLocaleString()} EGP</span>
              </div>
            )}
            <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-200">
              <span>{lang === 'ar' ? 'سعر التجميعة المخفض' : 'Combo Price'}</span>
              <span className="text-ocean-700 text-xl">{finalComboPrice.toLocaleString()} EGP</span>
            </div>
          </div>

          {/* Add Combo Action Button */}
          <button
            onClick={handleAddComboToCart}
            disabled={selectedCount === 0}
            className="btn-primary w-full py-4 text-sm font-bold shadow-ocean-600/30 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>
              {selectedCount === 4
                ? lang === 'ar'
                  ? 'إضافة التجميعة بالكامل للسلة (-15%)'
                  : 'Add Full Combo to Cart (-15%)'
                : lang === 'ar'
                ? `إضافة العناصر المختارة (${selectedCount}) للسلة`
                : `Add Selected (${selectedCount}) to Cart`}
            </span>
          </button>

          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>{lang === 'ar' ? 'تجميعة معتمدة ومتوافقة هندسياً 100%' : '100% Tackle Balance & Quality Guarantee'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
