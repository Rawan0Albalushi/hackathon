# منصة تسجيل الفعاليات التقنية | Tech Event Registration Platform

منصة حديثة ومتجاوبة لتسجيل الفعاليات التقنية مع دعم اللغتين العربية والإنجليزية.

A modern, responsive platform for tech event registration with Arabic and English language support.

## المميزات | Features

- ✅ **تصميم متجاوب** - يعمل على جميع الأجهزة والشاشات
- ✅ **دعم اللغتين** - العربية والإنجليزية مع تبديل سهل
- ✅ **واجهة حديثة** - تصميم عصري باستخدام Tailwind CSS
- ✅ **نموذج قابل لإعادة الاستخدام** - مكونات React قابلة لإعادة الاستخدام
- ✅ **API آمن** - Laravel API مع التحقق من البيانات
- ✅ **قاعدة بيانات MySQL** - تخزين آمن للبيانات

## التقنيات المستخدمة | Technologies Used

### Backend
- **Laravel 12** - إطار عمل PHP
- **MySQL** - قاعدة البيانات
- **REST API** - واجهة برمجة التطبيقات

### Frontend
- **React 19** - مكتبة JavaScript
- **Vite** - أداة البناء
- **Tailwind CSS** - إطار عمل CSS
- **React Router** - التنقل بين الصفحات

## التثبيت | Installation

### المتطلبات | Requirements
- PHP 8.2+
- Composer
- Node.js 18+
- MySQL 8.0+

### خطوات التثبيت | Installation Steps

1. **استنساخ المشروع | Clone the repository**
```bash
git clone <repository-url>
cd hackathon
```

2. **تثبيت التبعيات | Install dependencies**
```bash
composer install
npm install
```

3. **إعداد البيئة | Environment setup**
```bash
cp .env.example .env
php artisan key:generate
```

4. **إعداد قاعدة البيانات | Database setup**
```bash
# في ملف .env، قم بتحديث إعدادات قاعدة البيانات
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=hackathon_db
DB_USERNAME=root
DB_PASSWORD=your_password
```

5. **تشغيل الـ Migrations | Run migrations**
```bash
php artisan migrate
```

6. **بناء الأصول | Build assets**
```bash
npm run build
```

7. **تشغيل الخادم | Start the server**
```bash
php artisan serve
```

## الصفحات المتاحة | Available Pages

### 1. الصفحة الرئيسية | Home Page
- `/` - صفحة ترحيبية مع معلومات عن الفعاليات
- أزرار انتقال لصفحات التسجيل المختلفة

### 2. تسجيل الهاكثون | Hackathon Registration
- `/hackathon` - نموذج تسجيل شامل للهاكثون
- الحقول: الاسم، البريد، الهاتف، العمر، المدينة، الخلفية، المهارات، فكرة المشروع

### 3. تسجيل الورشة | Workshop Registration
- `/workshop` - نموذج تسجيل للورشة التدريبية
- الحقول: الاسم، البريد، الهاتف، الخلفية، سبب الحضور

### 4. تسجيل المؤتمر | Conference Registration
- `/conference` - نموذج تسجيل للمؤتمر
- الحقول: الاسم، البريد، الهاتف، الجهة، اختيار الجلسة

### 5. صفحة النجاح | Success Page
- `/success` - تأكيد التسجيل مع معلومات إضافية

## API Endpoints

### Hackathon Registration
```
POST /api/register/hackathon
```

### Workshop Registration
```
POST /api/register/workshop
```

### Conference Registration
```
POST /api/register/conference
```

## هيكل المشروع | Project Structure

```
hackathon/
├── app/
│   ├── Http/Controllers/Api/
│   │   ├── HackathonRegistrationController.php
│   │   ├── WorkshopRegistrationController.php
│   │   └── ConferenceRegistrationController.php
│   └── Models/
│       ├── HackathonRegistration.php
│       ├── WorkshopRegistration.php
│       └── ConferenceRegistration.php
├── database/migrations/
│   ├── create_hackathon_registrations_table.php
│   ├── create_workshop_registrations_table.php
│   └── create_conference_registrations_table.php
├── resources/
│   ├── js/
│   │   ├── components/
│   │   │   ├── Layout.js
│   │   │   └── Form.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── HackathonRegistration.js
│   │   │   ├── WorkshopRegistration.js
│   │   │   ├── ConferenceRegistration.js
│   │   │   └── Success.js
│   │   ├── contexts/
│   │   │   └── LanguageContext.js
│   │   └── utils/
│   │       └── api.js
│   └── views/
│       └── app.blade.php
└── routes/
    ├── api.php
    └── web.php
```

## التطوير | Development

### تشغيل وضع التطوير | Development Mode
```bash
# تشغيل Laravel
php artisan serve

# تشغيل Vite (في terminal منفصل)
npm run dev
```

### بناء للإنتاج | Production Build
```bash
npm run build
```

## المساهمة | Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## الترخيص | License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## الدعم | Support

للحصول على الدعم أو الإبلاغ عن مشاكل، يرجى فتح issue في المستودع.

For support or to report issues, please open an issue in the repository.

---

**تم التطوير بـ ❤️ باستخدام Laravel و React**

**Developed with ❤️ using Laravel and React**