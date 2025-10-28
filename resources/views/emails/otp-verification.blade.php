<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تحقق من بريدك الإلكتروني</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #003C72 0%, #096289 50%, #D85584 100%);
            margin: 0;
            padding: 20px;
            min-height: 100vh;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #F4A321 0%, #D85584 100%);
            padding: 40px 30px;
            text-align: center;
            color: white;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
        }
        .content {
            padding: 40px 30px;
            text-align: center;
        }
        .otp-container {
            background: #f8f9fa;
            border: 2px dashed #D85584;
            border-radius: 15px;
            padding: 30px;
            margin: 30px 0;
        }
        .otp-code {
            font-size: 36px;
            font-weight: bold;
            color: #003C72;
            letter-spacing: 8px;
            margin: 20px 0;
            font-family: 'Courier New', monospace;
        }
        .message {
            color: #666;
            line-height: 1.6;
            margin: 20px 0;
            font-size: 16px;
        }
        .warning {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 10px;
            padding: 15px;
            margin: 20px 0;
            color: #856404;
            font-size: 14px;
        }
        .footer {
            background: #f8f9fa;
            padding: 20px 30px;
            text-align: center;
            color: #666;
            font-size: 14px;
        }
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #F4A321 0%, #D85584 100%);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 25px;
            font-weight: bold;
            margin: 20px 0;
        }
        @media (max-width: 600px) {
            .container {
                margin: 10px;
                border-radius: 15px;
            }
            .header, .content {
                padding: 30px 20px;
            }
            .otp-code {
                font-size: 28px;
                letter-spacing: 6px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔐 تحقق من بريدك الإلكتروني</h1>
        </div>
        
        <div class="content">
            @if($userName)
                <p class="message">مرحباً {{ $userName }}،</p>
            @else
                <p class="message">مرحباً،</p>
            @endif
            
            <p class="message">
                شكراً لك على التسجيل في منصتنا! لضمان أمان حسابك، يرجى التحقق من بريدك الإلكتروني باستخدام الكود التالي:
            </p>
            
            <div class="otp-container">
                <p style="margin: 0 0 15px 0; color: #003C72; font-weight: bold;">كود التحقق:</p>
                <div class="otp-code">{{ $otpCode }}</div>
                <p style="margin: 15px 0 0 0; color: #666; font-size: 14px;">هذا الكود صالح لمدة 10 دقائق</p>
            </div>
            
            <div class="warning">
                <strong>تنبيه:</strong> لا تشارك هذا الكود مع أي شخص. فريقنا لن يطلب منك كود التحقق عبر الهاتف أو البريد الإلكتروني.
            </div>
            
            <p class="message">
                إذا لم تطلب هذا التحقق، يرجى تجاهل هذا البريد الإلكتروني.
            </p>
            
            <p class="message">
                شكراً لك على اختيار منصتنا!
            </p>
        </div>
        
        <div class="footer">
            <p>هذا بريد إلكتروني تلقائي، يرجى عدم الرد عليه.</p>
            <p>&copy; {{ date('Y') }} جميع الحقوق محفوظة</p>
        </div>
    </div>
</body>
</html>
