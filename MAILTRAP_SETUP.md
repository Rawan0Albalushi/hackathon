# إعداد Mailtrap للتحقق من الإيميل

## خطوات الإعداد

### 1. إنشاء حساب في Mailtrap
- اذهب إلى [mailtrap.io](https://mailtrap.io)
- سجل حساب جديد أو سجل الدخول
- اذهب إلى "Email Testing" > "Inboxes"

### 2. إنشاء Inbox جديد
- اضغط على "Add Inbox"
- اختر "Testing" كـ Environment
- اكتب اسم للـ Inbox (مثل "Hackathon App")

### 3. الحصول على بيانات SMTP
- بعد إنشاء الـ Inbox، اذهب إلى "SMTP Settings"
- اختر "Laravel 7+" من القائمة المنسدلة
- انسخ البيانات التالية:

```
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_username_here
MAIL_PASSWORD=your_password_here
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@hackathon.com"
MAIL_FROM_NAME="Hackathon App"
```

### 4. تحديث ملف .env
- افتح ملف `.env` في مشروعك
- استبدل إعدادات البريد الإلكتروني بالبيانات من Mailtrap
- تأكد من أن `MAIL_MAILER=smtp`

### 5. اختبار الإعداد
- شغل المشروع: `php artisan serve`
- اذهب إلى صفحة التسجيل
- سجل حساب جديد
- تحقق من Mailtrap Inbox لرؤية رسالة التحقق

## ملاحظات مهمة

- Mailtrap هو خدمة اختبار، الرسائل لن تصل إلى البريد الحقيقي
- للاستخدام في الإنتاج، استخدم خدمة بريد إلكتروني حقيقية مثل SendGrid أو AWS SES
- تأكد من أن البورت 2525 مفتوح في جدار الحماية

## استكشاف الأخطاء

### إذا لم تصل الرسائل:
1. تحقق من إعدادات .env
2. تأكد من أن Mailtrap Inbox نشط
3. تحقق من logs Laravel: `tail -f storage/logs/laravel.log`

### إذا ظهر خطأ في الاتصال:
1. تحقق من اتصال الإنترنت
2. تأكد من صحة بيانات SMTP
3. جرب تغيير MAIL_ENCRYPTION إلى null
