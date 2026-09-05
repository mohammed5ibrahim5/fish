import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Waves, Lock, Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/Toast';

export default function LoginPage() {
  const { signIn } = useAuth();
  const { lang, dir } = useLanguage();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/account';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await signIn(email, password);
    setLoading(false);

    if (res.error) {
      error(res.error, lang === 'ar' ? 'فشل تسجيل الدخول' : 'Sign in failed');
    } else {
      success(lang === 'ar' ? 'أهلاً بك مجدداً في صيد برو!' : 'Welcome back!', lang === 'ar' ? 'تم الدخول' : 'Success');
      navigate(from, { replace: true });
    }
  };

  // Demo quick login removed - admin access is via secret /admin route only

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6 animate-slide-up">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-ocean-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-ocean-600/30">
            <Waves className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">
            {lang === 'ar' ? 'تسجيل الدخول إلى حسابك' : 'Sign In to SeaPro'}
          </h1>
          <p className="text-xs text-slate-500">
            {lang === 'ar' ? 'تابع طلباتك ومعداتك المفضلة وسجل رحلات الصيد' : 'Track your orders, wishlist and angler profile'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              {lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="angler@example.com"
                className="input-field py-2.5 pr-9 pl-3 text-xs rounded-xl"
                dir="ltr"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-700">
                {lang === 'ar' ? 'كلمة المرور' : 'Password'}
              </label>
              <a href="#" className="text-[11px] text-ocean-600 hover:underline">
                {lang === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot?'}
              </a>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field py-2.5 pr-9 pl-3 text-xs rounded-xl"
                dir="ltr"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 text-xs font-bold shadow-ocean-600/30 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>{lang === 'ar' ? 'جاري التحقق...' : 'Signing In...'}</span>
            ) : (
              <>
                <span>{lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}</span>
                {dir === 'rtl' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-3 border-t border-slate-100 text-xs text-slate-500">
          <span>{lang === 'ar' ? 'ليس لديك حساب بعد؟ ' : "Don't have an account? "}</span>
          <Link to="/signup" className="text-ocean-600 font-bold hover:underline">
            {lang === 'ar' ? 'إنشاء حساب صياد جديد' : 'Create Free Account'}
          </Link>
        </div>
      </div>
    </div>
  );
}
