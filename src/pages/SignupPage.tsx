import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Waves, User, Lock, Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/Toast';

export default function SignupPage() {
  const { signUp } = useAuth();
  const { lang, dir } = useLanguage();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      error(lang === 'ar' ? 'كلمة المرور يجب ألا تقل عن 6 أحرف' : 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const res = await signUp(email, password, fullName);
    setLoading(false);

    if (res.error) {
      if (res.error === 'confirm_email') {
        success(
          lang === 'ar'
            ? 'تم إنشاء الحساب! رجاءً افتح بريدك الإلكتروني واضغط على رابط التأكيد لتفعيل حسابك'
            : 'Account created! Please check your email and click the confirmation link to activate your account.'
        );
        setEmail('');
        setPassword('');
        setFullName('');
      } else {
        error(res.error, lang === 'ar' ? 'فشل إنشاء الحساب' : 'Registration failed');
      }
    } else {
      success(lang === 'ar' ? 'تم إنشاء حسابك بنجاح في صيد برو!' : 'Account created successfully!');
      navigate('/account');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6 animate-slide-up">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-ocean-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-ocean-600/30">
            <Waves className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">
            {lang === 'ar' ? 'إنشاء حساب صياد جديد' : 'Join SeaPro Community'}
          </h1>
          <p className="text-xs text-slate-500">
            {lang === 'ar' ? 'سجل الآن للاستفادة من عروض الأعضاء الحصرية ومتابعة طلباتك' : 'Create an account to track tackle orders and unlock VIP perks'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              {lang === 'ar' ? 'الاسم بالكامل' : 'Full Name'}
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="الكابتن ..."
                className="input-field py-2.5 pr-9 pl-3 text-xs rounded-xl"
              />
              <User className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
            </div>
          </div>

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
            <label className="text-xs font-bold text-slate-700 block mb-1">
              {lang === 'ar' ? 'كلمة المرور (6 أحرف على الأقل)' : 'Password (min 6 chars)'}
            </label>
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
              <span>{lang === 'ar' ? 'جاري التسجيل...' : 'Creating...'}</span>
            ) : (
              <>
                <span>{lang === 'ar' ? 'إنشاء الحساب' : 'Create Account'}</span>
                {dir === 'rtl' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-3 border-t border-slate-100 text-xs text-slate-500">
          <span>{lang === 'ar' ? 'لديك حساب بالفعل؟ ' : 'Already have an account? '}</span>
          <Link to="/login" className="text-ocean-600 font-bold hover:underline">
            {lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
          </Link>
        </div>
      </div>
    </div>
  );
}
