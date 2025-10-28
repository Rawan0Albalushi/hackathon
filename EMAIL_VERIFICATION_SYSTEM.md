# نظام التحقق من الإيميل باستخدام OTP

## نظرة عامة
تم إضافة نظام التحقق من الإيميل باستخدام OTP (One-Time Password) للتطبيق. يتطلب النظام من المستخدمين التحقق من بريدهم الإلكتروني قبل تسجيل الدخول أو بعد التسجيل.

## الميزات المضافة

### 1. نظام OTP متكامل
- إرسال كود تحقق مكون من 6 أرقام
- انتهاء صلاحية الكود خلال 10 دقائق
- إمكانية إعادة إرسال الكود
- حماية من إساءة الاستخدام

### 2. واجهات مستخدم متقدمة
- مكون إدخال OTP تفاعلي
- تصميم متجاوب مع الهاتف المحمول
- رسائل خطأ ونجاح واضحة
- عداد تنازلي لإعادة الإرسال

### 3. تكامل مع Mailtrap
- إرسال رسائل بريد إلكتروني احترافية
- قوالب HTML جميلة ومتجاوبة
- دعم اللغة العربية

## الملفات المضافة/المحدثة

### Backend (Laravel)

#### Models
- `app/Models/OtpCode.php` - نموذج لإدارة أكواد OTP
- تحديث `app/Models/User.php` - إضافة دعم التحقق من الإيميل

#### Controllers
- تحديث `app/Http/Controllers/Api/AuthController.php` - إضافة endpoints للتحقق من OTP

#### Services
- `app/Services/OtpService.php` - خدمة إدارة OTP

#### Mail
- `app/Mail/OtpVerificationMail.php` - قالب رسالة التحقق
- `resources/views/emails/otp-verification.blade.php` - قالب HTML للرسالة

#### Database
- `database/migrations/2025_10_28_035036_add_email_verification_to_users_table.php`
- `database/migrations/2025_10_28_035049_create_otp_codes_table.php`
- `database/migrations/2025_10_28_035353_add_type_to_otp_codes_table.php`

### Frontend (React)

#### Components
- `resources/js/components/OtpInput.jsx` - مكون إدخال OTP
- `resources/js/components/EmailVerification.jsx` - صفحة التحقق من الإيميل
- تحديث `resources/js/components/LoginForm.jsx` - دعم التحقق من الإيميل
- تحديث `resources/js/components/RegisterForm.jsx` - دعم التحقق من الإيميل

## API Endpoints الجديدة

### POST /api/auth/send-otp
إرسال كود التحقق إلى الإيميل
```json
{
  "email": "user@example.com"
}
```

### POST /api/auth/verify-otp
التحقق من كود OTP
```json
{
  "email": "user@example.com",
  "code": "123456"
}
```

### POST /api/auth/resend-otp
إعادة إرسال كود التحقق
```json
{
  "email": "user@example.com"
}
```

## تدفق العمل

### 1. التسجيل
1. المستخدم يملأ نموذج التسجيل
2. يتم إنشاء الحساب مع `email_verified = false`
3. يتم إرسال OTP تلقائياً
4. يتم توجيه المستخدم لصفحة التحقق من الإيميل
5. بعد التحقق، يتم تسجيل الدخول تلقائياً

### 2. تسجيل الدخول
1. المستخدم يدخل بيانات الدخول
2. إذا كان الإيميل غير محقق، يتم رفض الدخول
3. يتم توجيه المستخدم لصفحة التحقق من الإيميل
4. بعد التحقق، يتم تسجيل الدخول تلقائياً

## إعداد Mailtrap

### 1. إنشاء حساب
- اذهب إلى [mailtrap.io](https://mailtrap.io)
- سجل حساب جديد

### 2. إنشاء Inbox
- اذهب إلى "Email Testing" > "Inboxes"
- اضغط "Add Inbox"
- اختر "Testing" Environment

### 3. الحصول على بيانات SMTP
- اذهب إلى "SMTP Settings"
- اختر "Laravel 7+"
- انسخ البيانات إلى ملف `.env`

### 4. تحديث .env
```env
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@hackathon.com"
MAIL_FROM_NAME="Hackathon App"
```

## الأمان

### 1. حماية OTP
- انتهاء صلاحية خلال 10 دقائق
- استخدام مرة واحدة فقط
- حذف الأكواد القديمة تلقائياً

### 2. حماية API
- CSRF protection
- Rate limiting (يمكن إضافته)
- Validation شامل

### 3. حماية قاعدة البيانات
- تشفير كلمات المرور
- فهرسة على الحقول المهمة
- تنظيف البيانات المنتهية الصلاحية

## الاختبار

### 1. اختبار التسجيل
```bash
# شغل الخادم
php artisan serve

# اذهب إلى http://localhost:8000/register
# سجل حساب جديد
# تحقق من Mailtrap Inbox
```

### 2. اختبار تسجيل الدخول
```bash
# اذهب إلى http://localhost:8000/login
# حاول تسجيل الدخول بحساب غير محقق
# يجب أن يتم توجيهك لصفحة التحقق
```

## استكشاف الأخطاء

### 1. لا تصل رسائل OTP
- تحقق من إعدادات .env
- تأكد من أن Mailtrap Inbox نشط
- تحقق من logs: `tail -f storage/logs/laravel.log`

### 2. خطأ في الاتصال
- تحقق من اتصال الإنترنت
- تأكد من صحة بيانات SMTP
- جرب تغيير MAIL_ENCRYPTION إلى null

### 3. مشاكل في الواجهة
- تحقق من console المتصفح
- تأكد من أن جميع المكونات محملة
- تحقق من network requests

## التطوير المستقبلي

### 1. ميزات إضافية
- إشعارات push للتحقق
- دعم SMS كبديل للإيميل
- تذكيرات دورية للتحقق

### 2. تحسينات الأمان
- Rate limiting للـ OTP
- كشف محاولات الاختراق
- تسجيل مفصل للأنشطة

### 3. تحسينات الأداء
- Queue للرسائل
- Cache للتحقق
- تحسين قاعدة البيانات

## الدعم

للحصول على المساعدة:
1. تحقق من logs Laravel
2. راجع ملف MAILTRAP_SETUP.md
3. تحقق من console المتصفح
4. تأكد من إعدادات .env
