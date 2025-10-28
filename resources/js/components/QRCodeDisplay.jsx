import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const QRCodeDisplay = ({ qrCode, qrCodeData, qrCodeImage, type, registrationId, isCheckedIn, checkedInAt }) => {
    const { language } = useLanguage();
    const [qrCodeUrl, setQrCodeUrl] = useState('');

    useEffect(() => {
        // Use qrCodeImage if available, otherwise generate from qrCode or qrCodeData
        if (qrCodeImage) {
            setQrCodeUrl(qrCodeImage);
        } else if (qrCode || qrCodeData) {
            // Generate QR code using a simple QR code generator
            const data = qrCode || qrCodeData;
            const qrCodeDataUrl = `https://api.qrserver.com/v1/create-qr-code/?size=512x512&data=${encodeURIComponent(data)}`;
            setQrCodeUrl(qrCodeDataUrl);
        }
    }, [qrCode, qrCodeData, qrCodeImage]);

    const handleDownload = () => {
        if (!qrCodeUrl) return;
        const link = document.createElement('a');
        link.href = qrCodeUrl;
        link.download = `${type || 'qr'}-${registrationId || 'code'}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleOpen = () => {
        if (!qrCodeUrl) return;
        window.open(qrCodeUrl, '_blank');
    };

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: 'QR Code',
                    text: (qrCode || qrCodeData) ? String(qrCode || qrCodeData) : 'QR Code',
                    url: qrCodeUrl
                });
            } else {
                await navigator.clipboard.writeText(qrCodeUrl);
                alert(language === 'ar' ? 'تم نسخ رابط الصورة' : 'Image link copied');
            }
        } catch (_) {
            // no-op
        }
    };

    const getTypeInfo = (type) => {
        switch(type) {
            case 'hackathon':
                return {
                    icon: '🚀',
                    title: language === 'ar' ? 'هاكثون' : 'Hackathon',
                    color: 'linear-gradient(135deg, #F4A321 0%, #D85584 100%)',
                    prefix: 'H1'
                };
            case 'workshop':
                return {
                    icon: '🛠️',
                    title: language === 'ar' ? 'ورشة' : 'Workshop',
                    color: 'linear-gradient(135deg, #D85584 0%, #F4A321 100%)',
                    prefix: 'W2'
                };
            case 'conference':
                return {
                    icon: '🎯',
                    title: language === 'ar' ? 'مؤتمر' : 'Conference',
                    color: 'linear-gradient(135deg, #096289 0%, #003C72 100%)',
                    prefix: 'C3'
                };
            default:
                return {
                    icon: '📱',
                    title: language === 'ar' ? 'تسجيل' : 'Registration',
                    color: 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)',
                    prefix: 'X0'
                };
        }
    };

    const typeInfo = getTypeInfo(type);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!qrCode && !qrCodeData && !qrCodeImage) {
        return (
            <div className="text-center py-8">
                <div className="text-gray-500 text-lg">
                    {language === 'ar' ? 'QR Code غير متوفر' : 'QR Code not available'}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl p-2 sm:p-3 shadow-lg border border-gray-200 w-full max-w-[18rem] sm:max-w-sm mx-auto select-none">
            {/* Header */}
            <div className="text-center mb-2 sm:mb-3">
                <div className="flex justify-center mb-1.5 sm:mb-2">
                    <div className="p-1.5 sm:p-2 rounded-lg" style={{background: typeInfo.color}}>
                        <span className="text-white text-base sm:text-lg">{typeInfo.icon}</span>
                    </div>
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-0.5 sm:mb-1">
                    {language === 'ar' ? `QR Code - ${typeInfo.title}` : `QR Code - ${typeInfo.title}`}
                </h3>
                <p className="text-[11px] sm:text-xs text-gray-600">
                    {language === 'ar' 
                        ? 'قم بمسح هذا الكود عند الوصول للحدث'
                        : 'Scan this code when you arrive at the event'
                    }
                </p>
            </div>

            {/* QR Code */}
            <div className="flex justify-center mb-2.5 sm:mb-3">
                <div className="bg-white p-1.5 sm:p-2 rounded-lg shadow-md border-2 border-gray-100 w-full max-w-[14rem] sm:max-w-[16rem]">
                    {qrCodeUrl ? (
                        <img
                            src={qrCodeUrl}
                            alt="QR Code"
                            className="w-full h-auto aspect-square mx-auto select-none"
                            draggable="false"
                        />
                    ) : (
                        <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                            <div className="text-gray-400 text-[11px] sm:text-xs">
                                {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick actions for mobile */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mb-2.5 sm:mb-3">
                <button type="button" onClick={handleDownload} className="px-2 py-1.5 sm:py-1.5 rounded-lg text-white text-[11px] sm:text-xs font-semibold" style={{background: 'linear-gradient(135deg, #0ea5e9 0%, #22d3ee 100%)'}}>
                    {language === 'ar' ? 'تنزيل' : 'Download'}
                </button>
                <button type="button" onClick={handleOpen} className="px-2 py-1.5 sm:py-1.5 rounded-lg text-white text-[11px] sm:text-xs font-semibold" style={{background: 'linear-gradient(135deg, #10b981 0%, #22c55e 100%)'}}>
                    {language === 'ar' ? 'فتح' : 'Open'}
                </button>
                <button type="button" onClick={handleShare} className="px-2 py-1.5 sm:py-1.5 rounded-lg text-white text-[11px] sm:text-xs font-semibold" style={{background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)'}}>
                    {language === 'ar' ? 'مشاركة' : 'Share'}
                </button>
            </div>

            {/* Registration Info */}
            <div className="bg-gray-50 rounded-lg p-1.5 sm:p-2 mb-2">
                <div className="text-center">
                    <p className="text-[11px] sm:text-xs text-gray-600 mb-0.5 sm:mb-1">
                        {language === 'ar' ? 'رقم التسجيل' : 'Registration ID'}
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-gray-900">#{registrationId}</p>
                </div>
            </div>

            {/* QR Code Text (copyable) */}
            {(qrCode || qrCodeData) && (
                <div className="mb-2">
                    <label className="block text-[11px] sm:text-xs text-gray-600 mb-0.5 sm:mb-1">
                        {language === 'ar' ? 'نص الكود' : 'QR Code Text'}
                    </label>
                    <div className="flex items-center gap-1">
                        <input
                            type="text"
                            readOnly
                            value={qrCode || qrCodeData}
                            className="flex-1 border border-gray-200 rounded-lg px-2 py-1 text-gray-900 bg-gray-50 focus:outline-none text-[11px] sm:text-xs"
                        />
                        <button
                            type="button"
                            onClick={() => navigator.clipboard.writeText(qrCode || qrCodeData)}
                            className="px-2 py-1 rounded-lg text-white font-semibold text-[11px] sm:text-xs"
                            style={{background: 'linear-gradient(135deg, #F4A321 0%, #D85584 100%)'}}
                        >
                            {language === 'ar' ? 'نسخ' : 'Copy'}
                        </button>
                    </div>
                </div>
            )}

            {/* Check-in Status - Only show if checked in */}
            {isCheckedIn && (
                <div className="text-center">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                        <div className="flex items-center justify-center space-x-1 rtl:space-x-reverse mb-1">
                            <span className="text-green-600 text-sm">✅</span>
                            <span className="text-green-800 font-semibold text-xs">
                                {language === 'ar' ? 'تم تسجيل الحضور' : 'Checked In'}
                            </span>
                        </div>
                        <p className="text-xs text-green-700">
                            {formatDate(checkedInAt)}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QRCodeDisplay;
