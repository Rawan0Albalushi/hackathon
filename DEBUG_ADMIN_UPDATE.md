# تشخيص مشكلة تحديث حالة الهاكثون في لوحة الإدارة

## المشكلة
لا يمكن تحديث حالة الهاكثون في لوحة الإدارة.

## الخطوات المتبعة للتشخيص

### 1. إضافة سجلات التشخيص
تم إضافة console.log في JavaScript و Log::info في PHP لتتبع المشكلة.

### 2. فحص الملفات المحدثة
- `resources/js/pages/admin/AdminHackathonRegistrations.jsx` - إضافة console.log
- `app/Http/Controllers/AdminController.php` - إضافة Log::info
- `app/Http/Middleware/AdminMiddleware.php` - إضافة Log::info

### 3. اختبار API
تم إنشاء ملفات اختبار:
- `test_admin.html` - اختبار من المتصفح
- `test_api.php` - اختبار من PHP

## خطوات التشخيص

### 1. فتح لوحة الإدارة
1. اذهب إلى لوحة الإدارة
2. افتح Developer Tools (F12)
3. اذهب إلى تبويب Console
4. حاول تحديث حالة تسجيل هاكثون

### 2. فحص سجلات Laravel
```bash
tail -f storage/logs/laravel.log
```

### 3. فحص Network Tab
1. افتح Developer Tools
2. اذهب إلى تبويب Network
3. حاول تحديث حالة التسجيل
4. ابحث عن طلب PUT إلى `/api/admin/registrations/hackathon/{id}/status`

## المشاكل المحتملة

### 1. مشكلة في Authentication
- تأكد من تسجيل الدخول كـ admin
- تحقق من أن المستخدم له role = 'admin'

### 2. مشكلة في CSRF Token
- الـ API routes لا تحتاج CSRF token
- تأكد من أن credentials: 'include' موجود

### 3. مشكلة في الـ Route
- تأكد من أن الـ route مسجل بشكل صحيح
- تحقق من الـ middleware

### 4. مشكلة في الـ Database
- تأكد من وجود جدول hackathon_registrations
- تحقق من وجود الحقول status و rejection_reason

## الحلول المقترحة

### 1. إذا كانت المشكلة في Authentication
```php
// تحقق من أن المستخدم admin
if (!auth()->user()->isAdmin()) {
    return response()->json(['error' => 'Unauthorized'], 403);
}
```

### 2. إذا كانت المشكلة في الـ Route
```php
// تأكد من أن الـ route مسجل
Route::put('/admin/registrations/{type}/{id}/status', [AdminController::class, 'updateRegistrationStatus'])
    ->middleware(['web', 'auth:web', 'admin']);
```

### 3. إذا كانت المشكلة في الـ JavaScript
```javascript
// تأكد من أن الـ request يرسل بشكل صحيح
const response = await fetch(`/api/admin/registrations/hackathon/${id}/status`, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
        status: newStatus,
        rejection_reason: rejectionReason
    })
});
```

## اختبار سريع
1. افتح `test_admin.html` في المتصفح
2. اضغط على "جلب التسجيلات" لاختبار الـ authentication
3. اضغط على "تحديث الحالة" لاختبار الـ update

## معلومات إضافية
- الـ server يعمل على http://localhost:8000
- الـ logs موجودة في storage/logs/laravel.log
- الـ routes مسجلة في routes/api.php
