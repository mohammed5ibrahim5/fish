import { X, Trash2, ShoppingBag } from 'lucide-react';
import type { Product } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';

interface CompareModalProps {
  products: Product[];
  onClose: () => void;
  onRemove: (productId: string) => void;
}

export default function CompareModal({ products, onClose, onRemove }: CompareModalProps) {
  const { lang } = useLanguage();
  const { addToCart } = useCart();

  if (products.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div>
            <h3 className="text-lg font-bold">
              {lang === 'ar' ? 'مقارنة مواصفات المعدات' : 'Product Comparison'}
            </h3>
            <p className="text-xs text-slate-300">
              {lang === 'ar' ? `مقارنة ${products.length} منتجات جنباً إلى جنب` : `Comparing ${products.length} products side by side`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto p-6">
          <table className="w-full text-xs text-right border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="p-3 font-bold text-slate-400 w-36">
                  {lang === 'ar' ? 'المنتج' : 'Product'}
                </th>
                {products.map((p) => (
                  <th key={p.id} className="p-3 text-center min-w-[200px] align-top">
                    <div className="flex flex-col items-center gap-2">
                      <div className="relative w-28 h-28 rounded-2xl overflow-hidden border border-slate-200">
                        <img src={p.images[0]} alt={p.title_ar} className="w-full h-full object-cover" />
                        <button
                          onClick={() => onRemove(p.id)}
                          className="absolute top-1.5 right-1.5 p-1 rounded-full bg-rose-500 text-white hover:bg-rose-600 shadow"
                          title="حذف من المقارنة"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="font-bold text-slate-900 line-clamp-2">
                        {lang === 'ar' ? p.title_ar : p.title_en}
                      </div>
                      <div className="text-ocean-600 font-extrabold text-sm">
                        {p.price.toLocaleString()} {lang === 'ar' ? 'ج.م' : 'EGP'}
                      </div>
                      <button
                        onClick={() => addToCart(p, 1)}
                        className="btn-primary py-1.5 px-3 text-xs w-full mt-1 flex items-center justify-center gap-1.5"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{lang === 'ar' ? 'أضف للسلة' : 'Add'}</span>
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-3 font-bold text-slate-500 bg-slate-50">{lang === 'ar' ? 'الماركة' : 'Brand'}</td>
                {products.map((p) => (
                  <td key={p.id} className="p-3 text-center font-semibold text-slate-800">{p.brand}</td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-500 bg-slate-50">{lang === 'ar' ? 'نوع الصيد' : 'Fishing Type'}</td>
                {products.map((p) => (
                  <td key={p.id} className="p-3 text-center text-slate-700">{p.specs.fishing_type || '-'}</td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-500 bg-slate-50">{lang === 'ar' ? 'قوة السحب / الرمي' : 'Drag / Casting'}</td>
                {products.map((p) => (
                  <td key={p.id} className="p-3 text-center font-bold text-ocean-700">{p.specs.drag_power || '-'}</td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-500 bg-slate-50">{lang === 'ar' ? 'نسبة التروس' : 'Gear Ratio'}</td>
                {products.map((p) => (
                  <td key={p.id} className="p-3 text-center text-slate-700">{p.specs.gear_ratio || '-'}</td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-500 bg-slate-50">{lang === 'ar' ? 'المادة وخامة التصنيع' : 'Material'}</td>
                {products.map((p) => (
                  <td key={p.id} className="p-3 text-center text-slate-700">{p.specs.material || '-'}</td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-500 bg-slate-50">{lang === 'ar' ? 'الوزن' : 'Weight'}</td>
                {products.map((p) => (
                  <td key={p.id} className="p-3 text-center text-slate-700">{p.specs.weight || '-'}</td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-500 bg-slate-50">{lang === 'ar' ? 'البيئة المائية' : 'Water Type'}</td>
                {products.map((p) => (
                  <td key={p.id} className="p-3 text-center text-slate-700">
                    {p.specs.water_type === 'saltwater' ? 'مياه مالحة (بحر)' : 'مياه عذبة ومالحة'}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
