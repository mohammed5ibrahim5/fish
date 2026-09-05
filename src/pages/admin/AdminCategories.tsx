import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { DataService } from '@/lib/dataService';
import type { Category } from '@/lib/types';

export default function AdminCategories() {
  const { lang } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    DataService.getCategories().then((data) => {
      setCategories(data);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm(lang === 'ar' ? 'هل أنت متأكد من حذف القسم؟' : 'Delete this category?')) return;
    await DataService.deleteCategory(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-slate-900">{lang === 'ar' ? 'إدارة الأقسام' : 'Categories'}</h1>
        <button className="btn-primary py-2.5 px-4 text-xs font-bold flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>{lang === 'ar' ? 'إضافة قسم' : 'Add Category'}</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <p className="p-6 text-xs text-slate-400 text-center">{lang === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
        ) : categories.length === 0 ? (
          <p className="p-6 text-xs text-slate-400 text-center">{lang === 'ar' ? 'لا توجد أقسام' : 'No categories'}</p>
        ) : (
          <table className="w-full text-xs">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left p-3 font-bold text-slate-600">{lang === 'ar' ? 'القسم' : 'Category'}</th>
                <th className="text-left p-3 font-bold text-slate-600">Slug</th>
                <th className="text-left p-3 font-bold text-slate-600">{lang === 'ar' ? 'الترتيب' : 'Order'}</th>
                <th className="text-left p-3 font-bold text-slate-600">{lang === 'ar' ? 'إجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-3 flex items-center gap-3">
                    <img src={c.image_url} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    <span className="font-bold text-slate-800">{lang === 'ar' ? c.name_ar : c.name_en}</span>
                  </td>
                  <td className="p-3 text-slate-500">{c.slug}</td>
                  <td className="p-3">{c.sort_order}</td>
                  <td className="p-3 flex items-center gap-2">
                    <button className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200"><Edit className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"><Trash2 className="w-3.5 h-3.5" /></button>
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
