import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { DataService } from '@/lib/dataService';
import type { Product } from '@/lib/types';

export default function AdminProducts() {
  const { lang } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    DataService.getProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm(lang === 'ar' ? 'هل أنت متأكد من حذف المنتج؟' : 'Are you sure you want to delete this product?')) return;
    await DataService.deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-slate-900">{lang === 'ar' ? 'إدارة المنتجات' : 'Products'}</h1>
        <button className="btn-primary py-2.5 px-4 text-xs font-bold flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>{lang === 'ar' ? 'إضافة منتج' : 'Add Product'}</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <p className="p-6 text-xs text-slate-400 text-center">{lang === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
        ) : products.length === 0 ? (
          <p className="p-6 text-xs text-slate-400 text-center">{lang === 'ar' ? 'لا توجد منتجات' : 'No products'}</p>
        ) : (
          <table className="w-full text-xs">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left p-3 font-bold text-slate-600">{lang === 'ar' ? 'المنتج' : 'Product'}</th>
                <th className="text-left p-3 font-bold text-slate-600">{lang === 'ar' ? 'السعر' : 'Price'}</th>
                <th className="text-left p-3 font-bold text-slate-600">{lang === 'ar' ? 'المخزون' : 'Stock'}</th>
                <th className="text-left p-3 font-bold text-slate-600">{lang === 'ar' ? 'إجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-3 flex items-center gap-3">
                    <img src={p.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    <span className="font-bold text-slate-800 line-clamp-1">{lang === 'ar' ? p.title_ar : p.title_en}</span>
                  </td>
                  <td className="p-3 font-bold text-slate-900">{p.price.toLocaleString()} EGP</td>
                  <td className="p-3">{p.stock}</td>
                  <td className="p-3 flex items-center gap-2">
                    <button className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200"><Edit className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"><Trash2 className="w-3.5 h-3.5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
