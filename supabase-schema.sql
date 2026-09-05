-- =============================================
-- SeaPro Fishing Store - Supabase Schema
-- انسخ ده كله وشغّله في Supabase SQL Editor
-- (Dashboard > SQL Editor > New Query > Run)
-- =============================================

-- 1. حذف الجداول القديمة لو موجودة
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- 2. جدول المستخدمين (Profiles)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  phone TEXT,
  address TEXT,
  city TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. جدول الأقسام (Categories)
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  image_url TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT 'Folder',
  description_ar TEXT NOT NULL DEFAULT '',
  description_en TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  product_count INTEGER DEFAULT 0
);

-- 4. جدول المنتجات (Products)
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  title_ar TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_ar TEXT NOT NULL DEFAULT '',
  description_en TEXT NOT NULL DEFAULT '',
  price NUMERIC NOT NULL DEFAULT 0,
  original_price NUMERIC,
  discount_percent INTEGER,
  rating NUMERIC DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  stock INTEGER DEFAULT 0,
  category_id TEXT REFERENCES categories(id),
  category_slug TEXT NOT NULL DEFAULT '',
  brand TEXT NOT NULL DEFAULT '',
  images JSONB NOT NULL DEFAULT '[]',
  is_featured BOOLEAN DEFAULT false,
  is_best_seller BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  is_flash_deal BOOLEAN DEFAULT false,
  specs JSONB NOT NULL DEFAULT '{}',
  tags JSONB DEFAULT '[]',
  reviews JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. جدول الطلبات (Orders)
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  order_number TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL DEFAULT '',
  shipping_address TEXT NOT NULL DEFAULT '',
  city TEXT NOT NULL DEFAULT '',
  postal_code TEXT,
  notes TEXT,
  payment_method TEXT NOT NULL DEFAULT 'cod' CHECK (payment_method IN ('cod', 'card', 'wallet', 'mada')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  items JSONB NOT NULL DEFAULT '[]',
  subtotal NUMERIC NOT NULL DEFAULT 0,
  shipping_cost NUMERIC NOT NULL DEFAULT 0,
  discount NUMERIC NOT NULL DEFAULT 0,
  total NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. تفعيل Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 7. سياسات الأمان - الكل يقدر يقرأ، المسؤل يكتب
-- profiles
CREATE POLICY "Anyone can read profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- categories
CREATE POLICY "Anyone can read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Admin can manage categories" ON categories FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- products
CREATE POLICY "Anyone can read products" ON products FOR SELECT USING (true);
CREATE POLICY "Admin can manage products" ON products FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- orders
CREATE POLICY "Anyone can read orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Anyone can create orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can manage orders" ON orders FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- 8. إدراج بيانات تجريبية - الأقسام
INSERT INTO categories (id, name_ar, name_en, slug, image_url, icon, description_ar, description_en, sort_order, product_count) VALUES
('cat-rods', 'قصبات وصنانير الصيد', 'Fishing Rods', 'rods', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80', 'Fish', 'قصبات كاستينج، شاطئية، جيجينج، وترولينج من أفضل الماركات العالمية', 'Casting, surf, jigging, and trolling rods from top brands', 1, 14),
('cat-reels', 'مكينات وبكرات السحب', 'Fishing Reels', 'reels', 'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=800&q=80', 'Disc', 'بكرات سبينينج، بيت كاستينج، وبكرات أعماق ثقيلة', 'Spinning, baitcasting, and heavy offshore reels', 2, 12),
('cat-lures', 'الطعوم الصناعية والميرور', 'Lures & Baits', 'lures', 'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?auto=format&fit=crop&w=800&q=80', 'Sparkles', 'ميرور، جيجات معدنية، بوبر، طعوم سيليكون حركية', 'Metal jigs, poppers, minnows, and soft plastics', 3, 24),
('cat-lines', 'خيوط الصيد والليدر', 'Fishing Lines', 'lines', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80', 'Activity', 'خيوط حرير مضفورة، فلوروكربون، ونايلون', 'Braided lines, fluorocarbon, and monofilament', 4, 10),
('cat-spearfishing', 'معدات الغوص والصيد بالرمح', 'Spearfishing & Diving', 'spearfishing', 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?auto=format&fit=crop&w=800&q=80', 'Compass', 'مسدسات صيد بالرمح، نظارات غوص، زعانف', 'Spearguns, freediving masks, long blades', 5, 8),
('cat-electronics', 'أجهزة السونار والملاحة', 'Marine Electronics', 'electronics', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80', 'Radio', 'أجهزة كاشف الأسماك، بوصلات بحرية، خرائط GPS', 'Fish finders, marine GPS, depth transducers', 6, 6),
('cat-accessories', 'حقائب وصناديق وإكسسوارات', 'Tackle Boxes & Gear', 'accessories', 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=800&q=80', 'Shield', 'صناديق حفظ المعدات، كماشات، شباك، موازين', 'Tackle storage, pliers, lip grippers, scales', 7, 18);
