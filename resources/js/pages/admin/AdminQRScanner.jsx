import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const AdminQRScanner = () => {
    const { language } = useLanguage();
    const [qrCode, setQrCode] = useState('');
    const [scanResult, setScanResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleQRCodeChange = (e) => {
        setQrCode(e.target.value);
        setError(null);
        setSuccess(false);
        setScanResult(null);
    };

    const scanQRCode = async () => {
        if (!qrCode.trim()) {
            setError(language === 'ar' ? 'يرجى إدخال QR Code' : 'Please enter QR Code');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch('/api/qr/scan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                credentials: 'include',
                body: JSON.stringify({ qr_code: qrCode })
            });

            const data = await response.json();

            if (data.success) {
                setScanResult(data.data);
                setSuccess(true);
                setQrCode(''); // Clear input after successful scan
            } else {
                setError(data.message);
                setScanResult(data.data || null);
            }
        } catch (err) {
            setError(language === 'ar' ? 'حدث خطأ في الاتصال' : 'Connection error occurred');
        } finally {
            setLoading(false);
        }
    };

    const getQRCodeInfo = async () => {
        if (!qrCode.trim()) {
            setError(language === 'ar' ? 'يرجى إدخال QR Code' : 'Please enter QR Code');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch('/api/qr/info', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                credentials: 'include',
                body: JSON.stringify({ qr_code: qrCode })
            });

            const data = await response.json();

            if (data.success) {
                setScanResult(data.data);
            } else {
                setError(data.message);
                setScanResult(data.data || null);
            }
        } catch (err) {
            setError(language === 'ar' ? 'حدث خطأ في الاتصال' : 'Connection error occurred');
        } finally {
            setLoading(false);
        }
    };

    const getTypeInfo = (type) => {
        switch(type) {
            case 'hackathon':
                return {
                    icon: '🚀',
                    title: language === 'ar' ? 'هاكثون' : 'Hackathon',
                    color: 'linear-gradient(135deg, #F4A321 0%, #D85584 100%)'
                };
            case 'workshop':
                return {
                    icon: '🛠️',
                    title: language === 'ar' ? 'ورشة' : 'Workshop',
                    color: 'linear-gradient(135deg, #D85584 0%, #F4A321 100%)'
                };
            case 'conference':
                return {
                    icon: '🎯',
                    title: language === 'ar' ? 'مؤتمر' : 'Conference',
                    color: 'linear-gradient(135deg, #096289 0%, #003C72 100%)'
                };
            default:
                return {
                    icon: '📱',
                    title: language === 'ar' ? 'تسجيل' : 'Registration',
                    color: 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)'
                };
        }
    };

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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
                    <div className="p-2 rounded-lg" style={{background: 'linear-gradient(135deg, #F4A321 0%, #D85584 100%)'}}>
                        <span className="text-white text-xl">📱</span>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            {language === 'ar' ? 'مسح QR Code' : 'QR Code Scanner'}
                        </h2>
                        <p className="text-gray-600 text-sm">
                            {language === 'ar' 
                                ? 'مسح QR Code لتسجيل حضور المشاركين'
                                : 'Scan QR Code to check in participants'
                            }
                        </p>
                    </div>
                </div>

                {/* Scanner Form */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {language === 'ar' ? 'QR Code' : 'QR Code'}
                        </label>
                        <div className="flex space-x-3 rtl:space-x-reverse">
                            <input
                                type="text"
                                value={qrCode}
                                onChange={handleQRCodeChange}
                                placeholder={language === 'ar' ? 'أدخل QR Code هنا...' : 'Enter QR Code here...'}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                disabled={loading}
                            />
                            <button
                                onClick={scanQRCode}
                                disabled={loading || !qrCode.trim()}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? (
                                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                        <span>{language === 'ar' ? 'جاري المسح...' : 'Scanning...'}</span>
                                    </div>
                                ) : (
                                    language === 'ar' ? 'مسح' : 'Scan'
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <button
                            onClick={getQRCodeInfo}
                            disabled={loading || !qrCode.trim()}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {language === 'ar' ? 'معلومات فقط' : 'Info Only'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <span className="text-red-600 text-xl">❌</span>
                        <div>
                            <h3 className="text-sm font-semibold text-red-800">
                                {language === 'ar' ? 'خطأ' : 'Error'}
                            </h3>
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Message */}
            {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <span className="text-green-600 text-xl">✅</span>
                        <div>
                            <h3 className="text-sm font-semibold text-green-800">
                                {language === 'ar' ? 'تم بنجاح' : 'Success'}
                            </h3>
                            <p className="text-green-700 text-sm">
                                {language === 'ar' ? 'تم تسجيل الحضور بنجاح' : 'Check-in successful'}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Scan Result */}
            {scanResult && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="text-center mb-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                            {language === 'ar' ? 'نتيجة المسح' : 'Scan Result'}
                        </h3>
                    </div>

                    {scanResult.registration && (
                        <div className="space-y-6">
                            {/* Registration Header */}
                            <div className="text-center">
                                <div className="flex justify-center mb-4">
                                    <div className="p-4 rounded-xl shadow-lg" style={{background: getTypeInfo(scanResult.type).color}}>
                                        <span className="text-white text-2xl">{getTypeInfo(scanResult.type).icon}</span>
                                    </div>
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 mb-2">
                                    {getTypeInfo(scanResult.type).title}
                                </h4>
                                <p className="text-gray-600">
                                    {language === 'ar' ? 'رقم التسجيل:' : 'Registration ID:'} #{scanResult.registration.id}
                                </p>
                            </div>

                            {/* Registration Details */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                        <div className="p-2 rounded-lg" style={{background: getTypeInfo(scanResult.type).color}}>
                                            <span className="text-white text-lg">👤</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{scanResult.registration.full_name}</p>
                                            <p className="text-gray-600 text-sm">{scanResult.registration.email}</p>
                                            <p className="text-xs text-gray-500">
                                                {language === 'ar' ? 'المشارك' : 'Participant'}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                        <div className="p-2 rounded-lg" style={{background: getTypeInfo(scanResult.type).color}}>
                                            <span className="text-white text-lg">📅</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 text-sm">
                                                {language === 'ar' ? 'تاريخ التسجيل' : 'Registration Date'}
                                            </p>
                                            <p className="text-gray-600 text-sm">{formatDate(scanResult.registration.created_at)}</p>
                                            <p className="text-xs text-gray-500">
                                                {language === 'ar' ? 'تم التسجيل' : 'Registered'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Check-in Status */}
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <div className="text-center">
                                        {scanResult.is_checked_in && (
                                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                                <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse mb-2">
                                                    <span className="text-green-600 text-lg">✅</span>
                                                    <span className="text-green-800 font-semibold">
                                                        {language === 'ar' ? 'تم تسجيل الحضور' : 'Already Checked In'}
                                                    </span>
                                                </div>
                                                <p className="text-green-700 text-sm">
                                                    {language === 'ar' ? 'تم مسح الكود مسبقاً' : 'QR Code already scanned'}
                                                </p>
                                                <p className="text-xs text-green-600 mt-1">
                                                    {language === 'ar' ? 'وقت تسجيل الحضور:' : 'Check-in Time:'} {formatDate(scanResult.checked_in_at)}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminQRScanner;
