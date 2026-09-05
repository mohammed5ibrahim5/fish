import { useLanguage } from '@/contexts/LanguageContext';
import { Users } from 'lucide-react';

export default function AdminUsers() {
  const { lang } = useLanguage();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-slate-900">{lang === 'ar' ? 'إدارة المستخدمين' : 'Users'}</h1>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
        <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p className="text-xs text-slate-400">
          {lang === 'ar' ? 'إدارة المستخدمين متاحة من لوحة تحكم Supabase مباشرة' : 'User management is available directly from the Supabase dashboard'}
        </p>
      </div>
    </div>
  );
}
