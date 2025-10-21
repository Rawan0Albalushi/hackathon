# تعليمات التشغيل | Setup Instructions

## المتطلبات | Requirements

- PHP 8.2+
- Composer
- Node.js 18+
- MySQL 8.0+

## خطوات التشغيل | Setup Steps

### 1. إعداد قاعدة البيانات | Database Setup

```bash
# إنشاء قاعدة بيانات جديدة
mysql -u root -p
CREATE DATABASE hackathon_db;
```

### 2. إعداد البيئة | Environment Setup

```bash
# نسخ ملف البيئة
cp .env.example .env

# تحديث إعدادات قاعدة البيانات في ملف .env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=hackathon_db
DB_USERNAME=root
DB_PASSWORD=your_password
```

### 3. تثبيت التبعيات | Install Dependencies

```bash
# تثبيت تبعيات PHP
composer install

# تثبيت تبعيات Node.js
npm install
```

### 4. إعداد المشروع | Project Setup

```bash
# توليد مفتاح التطبيق
php artisan key:generate

# تشغيل الـ migrations
php artisan migrate

# بناء الأصول
npm run build
```

### 5. تشغيل المشروع | Run Project

```bash
# تشغيل خادم Laravel
php artisan serve

# في terminal منفصل لتطوير React
npm run dev
```

## الوصول للمشروع | Access

- **الرئيسية**: http://localhost:8000
- **تسجيل الهاكثون**: http://localhost:8000/hackathon
- **تسجيل الورشة**: http://localhost:8000/workshop
- **تسجيل المؤتمر**: http://localhost:8000/conference

## المميزات | Features

✅ **تصميم متجاوب** - يعمل على جميع الأجهزة  
✅ **دعم اللغتين** - العربية والإنجليزية  
✅ **واجهة حديثة** - Tailwind CSS  
✅ **API آمن** - Laravel REST API  
✅ **قاعدة بيانات** - MySQL  

## هيكل المشروع | Project Structure

```
hackathon/
├── app/Models/                    # الموديلات
├── app/Http/Controllers/Api/      # API Controllers
├── database/migrations/           # Migrations
├── resources/js/
│   ├── components/               # مكونات React
│   ├── pages/                    # صفحات التطبيق
│   ├── contexts/                 # Context API
│   └── utils/                    # أدوات مساعدة
└── routes/                       # Routes
```

## استكشاف الأخطاء | Troubleshooting

### مشكلة في البناء | Build Issues
```bash
# حذف node_modules وإعادة التثبيت
rm -rf node_modules
npm install
npm run build
```

### مشكلة في قاعدة البيانات | Database Issues
```bash
# إعادة تشغيل الـ migrations
php artisan migrate:fresh
```

### مشكلة في الـ API | API Issues
```bash
# مسح الكاش
php artisan config:clear
php artisan cache:clear
```

## الدعم | Support

للحصول على المساعدة، يرجى فتح issue في المستودع.

---

**تم التطوير بـ ❤️ باستخدام Laravel و React**
