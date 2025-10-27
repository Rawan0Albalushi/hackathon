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
            const qrCodeDataUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(data)}`;
            setQrCodeUrl(qrCodeDataUrl);
        }
    }, [qrCode, qrCodeData, qrCodeImage]);

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
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 max-w-md mx-auto">
            {/* Header */}
            <div className="text-center mb-6">
                <div className="flex justify-center mb-3">
                    <div className="p-3 rounded-xl" style={{background: typeInfo.color}}>
                        <span className="text-white text-2xl">{typeInfo.icon}</span>
                    </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {language === 'ar' ? `QR Code - ${typeInfo.title}` : `QR Code - ${typeInfo.title}`}
                </h3>
                <p className="text-sm text-gray-600">
                    {language === 'ar' 
                        ? 'قم بمسح هذا الكود عند الوصول للحدث'
                        : 'Scan this code when you arrive at the event'
                    }
                </p>
            </div>

            {/* QR Code */}
            <div className="flex justify-center mb-6">
                <div className="bg-white p-4 rounded-xl shadow-md border-2 border-gray-100">
                    {qrCodeUrl ? (
                        <img 
                            src={qrCodeUrl} 
                            alt="QR Code" 
                            className="w-48 h-48 mx-auto"
                        />
                    ) : (
                        <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                            <div className="text-gray-400 text-sm">
                                {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Registration Info */}
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">
                        {language === 'ar' ? 'رقم التسجيل' : 'Registration ID'}
                    </p>
                    <p className="text-lg font-bold text-gray-900">#{registrationId}</p>
                </div>
            </div>

            {/* Check-in Status - Only show if checked in */}
            {isCheckedIn && (
                <div className="text-center">
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse mb-2">
                            <span className="text-green-600 text-xl">✅</span>
                            <span className="text-green-800 font-semibold">
                                {language === 'ar' ? 'تم تسجيل الحضور' : 'Checked In'}
                            </span>
                        </div>
                        <p className="text-sm text-green-700">
                            {formatDate(checkedInAt)}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QRCodeDisplay;
