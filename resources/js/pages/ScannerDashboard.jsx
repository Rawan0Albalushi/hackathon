import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Scanner } from '@yudiel/react-qr-scanner';

const ScannerDashboard = () => {
    const { language, toggleLanguage } = useLanguage();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [qrCode, setQrCode] = useState('');
    const [scanResult, setScanResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [cameraMode, setCameraMode] = useState(false);
    const [cameraError, setCameraError] = useState(null);
    const [scanCount, setScanCount] = useState(0);
    const [lastScanTime, setLastScanTime] = useState(null);
    const [cameraFacing, setCameraFacing] = useState('user'); // default to front camera on laptops
    const [cameraPermission, setCameraPermission] = useState(null);
    const [cameraStream, setCameraStream] = useState(null);
    const [cameraBooting, setCameraBooting] = useState(false);
    const videoRef = useRef(null);
    const [videoInputs, setVideoInputs] = useState([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState(null);

    // Check camera permissions and availability
    useEffect(() => {
        const checkCameraPermission = async () => {
            try {
                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    setCameraPermission('granted');
                    setCameraStream(stream);
                    // Stop the stream immediately as we just wanted to check permissions
                    stream.getTracks().forEach(track => track.stop());

                    // Enumerate cameras
                    const devices = await navigator.mediaDevices.enumerateDevices();
                    const cams = devices.filter(d => d.kind === 'videoinput');
                    setVideoInputs(cams);
                    const preferred = cams.find(d => /back|rear|environment/i.test(d.label)) || cams[0];
                    setSelectedDeviceId(preferred ? preferred.deviceId : null);
                } else {
                    setCameraPermission('denied');
                    setCameraError(language === 'ar' ? 'الكاميرا غير مدعومة في هذا المتصفح' : 'Camera not supported in this browser');
                }
            } catch (error) {
                console.error('Camera permission error:', error);
                setCameraPermission('denied');
                if (error.name === 'NotAllowedError') {
                    setCameraError(language === 'ar' ? 'تم رفض إذن الكاميرا. يرجى السماح بالوصول للكاميرا' : 'Camera permission denied. Please allow camera access');
                } else if (error.name === 'NotFoundError') {
                    setCameraError(language === 'ar' ? 'لم يتم العثور على كاميرا' : 'No camera found');
                } else {
                    setCameraError(language === 'ar' ? 'خطأ في الوصول للكاميرا' : 'Camera access error');
                }
            }
        };

        checkCameraPermission();
    }, [cameraFacing, language]);

    // Cleanup camera stream on unmount
    useEffect(() => {
        return () => {
            if (cameraStream) {
                cameraStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [cameraStream]);

    const handleQRCodeChange = (e) => {
        setQrCode(e.target.value);
        setError(null);
        setSuccess(false);
        setScanResult(null);
    };

    const handleCameraScan = useCallback((result) => {
        console.log('Camera scan result:', result);
        
        let qrData = null;
        
        if (result && typeof result === 'string') {
            qrData = result;
        } else if (result && typeof result === 'object') {
            if (Array.isArray(result) && result.length > 0) {
                qrData = result[0].rawValue || result[0].text;
            } else if (result.rawValue) {
                qrData = result.rawValue;
            } else if (result.text) {
                qrData = result.text;
            }
        }
        
        if (!qrData) {
            return;
        }
        
        console.log('Detected QR Code:', qrData);
        
        const now = Date.now();
        if (lastScanTime && (now - lastScanTime) < 2000) {
            return;
        }
        setLastScanTime(now);
        
        setQrCode(qrData);
        setScanCount(prev => prev + 1);
        
        setTimeout(() => {
            scanQRCode(qrData);
        }, 500);
    }, [lastScanTime]);

    const handleCameraError = useCallback((error) => {
        console.error('Camera error:', error);
        let errorMessage = 'Camera access failed';
        
        if (error?.name === 'NotAllowedError') {
            errorMessage = language === 'ar' ? 'تم رفض إذن الكاميرا. يرجى السماح بالوصول للكاميرا' : 'Camera permission denied. Please allow camera access';
        } else if (error?.name === 'NotFoundError') {
            errorMessage = language === 'ar' ? 'لم يتم العثور على كاميرا' : 'No camera found';
        } else if (error?.name === 'NotReadableError') {
            errorMessage = language === 'ar' ? 'الكاميرا مستخدمة من قبل تطبيق آخر' : 'Camera is being used by another application';
        } else if (error?.name === 'OverconstrainedError') {
            errorMessage = language === 'ar' ? 'إعدادات الكاميرا غير مدعومة' : 'Camera settings not supported';
        } else if (error?.message) {
            errorMessage = error.message;
        } else if (typeof error === 'string') {
            errorMessage = error;
        }
        
        setCameraError(errorMessage);
        setCameraPermission('denied');
    }, [language]);

    const toggleCameraMode = async () => {
        if (!cameraMode) {
            // Starting camera (let Scanner component manage the stream)
            if (cameraPermission === 'denied') {
                setCameraError(language === 'ar' ? 'يرجى السماح بالوصول للكاميرا أولاً' : 'Please allow camera access first');
                return;
            }
            setCameraBooting(true);
            setTimeout(() => setCameraBooting(false), 1500);
            setCameraMode(true);
            setCameraError(null);
            setQrCode('');
            setError(null);
            setSuccess(false);
            setScanResult(null);
        } else {
            // Stopping camera
            if (cameraStream) {
                cameraStream.getTracks().forEach(track => track.stop());
                setCameraStream(null);
            }
            setCameraMode(false);
            setCameraBooting(false);
            setCameraError(null);
        }
    };

    const toggleCameraFacing = async () => {
        if (videoInputs.length > 1) {
            const currentIndex = videoInputs.findIndex(d => d.deviceId === selectedDeviceId);
            const next = videoInputs[(currentIndex + 1) % videoInputs.length];
            setSelectedDeviceId(next?.deviceId || null);
        } else {
            const newFacing = cameraFacing === 'environment' ? 'user' : 'environment';
            setCameraFacing(newFacing);
        }

        if (cameraMode && cameraStream) {
            try {
                cameraStream.getTracks().forEach(track => track.stop());
                const opts = selectedDeviceId ? { video: { deviceId: { exact: selectedDeviceId } } } : { video: { facingMode: cameraFacing } };
                const stream = await navigator.mediaDevices.getUserMedia(opts);
                setCameraStream(stream);
                setCameraError(null);
            } catch (error) {
                console.error('Camera switch error:', error);
                setCameraError(language === 'ar' ? 'فشل في تبديل الكاميرا' : 'Failed to switch camera');
            }
        }
    };

    const scanQRCode = async (qrData = null) => {
        const codeToScan = qrData || qrCode;
        if (!codeToScan || !codeToScan.trim()) {
            setError(language === 'ar' ? 'يرجى إدخال QR Code' : 'Please enter QR Code');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch('/api/scanner/qr/scan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                credentials: 'include',
                body: JSON.stringify({ qr_code: codeToScan })
            });

            const data = await response.json();

            if (data.success) {
                setScanResult(data.data);
                setSuccess(true);
                setQrCode('');
                
                // Play success sound
                try {
                    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBS13yO/eizEIHWq+8+OWT');
                    audio.play().catch(() => {});
                } catch (e) {}
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
            const response = await fetch('/api/scanner/qr/info', {
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

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen relative">
            {/* Unified Background Gradient - matching site theme */}
            <div className="absolute inset-0" style={{background: 'linear-gradient(to bottom, #FFF5EB 0%, #FFE5F0 25%, #E8F4F8 50%, #F0E8F5 75%, #FFF5EB 100%)'}}></div>
            
            {/* Animated Star Background Elements - Responsive */}
            <div className="absolute inset-0">
                <div className="star-floating absolute top-10 sm:top-20 left-4 sm:left-10 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 opacity-15 sm:opacity-20 animate-pulse"></div>
                <div className="star-floating absolute bottom-10 sm:bottom-20 right-4 sm:right-10 w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 opacity-15 sm:opacity-20 animate-pulse delay-1000"></div>
                <div className="star-floating absolute top-1/2 left-1/6 sm:left-1/4 w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 opacity-15 sm:opacity-20 animate-pulse delay-500"></div>
                <div className="star-floating absolute top-1/3 right-1/4 sm:right-1/3 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 opacity-15 sm:opacity-20 animate-pulse delay-700"></div>
                <div className="star-floating absolute bottom-1/3 left-1/4 sm:left-1/3 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 opacity-15 sm:opacity-20 animate-pulse delay-300"></div>
            </div>
            
            {/* Hero Section - matching site theme */}
            <div className="relative text-white overflow-hidden animate-gradient rounded-2xl sm:rounded-3xl mx-2 sm:mx-4 mt-2 sm:mt-4" style={{background: 'linear-gradient(135deg, #003C72 0%, #096289 50%, #D85584 100%)'}}>
                <div className="absolute inset-0 bg-black opacity-20"></div>
                <div className="relative max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                        <div className="flex items-center space-x-4 sm:space-x-6 rtl:space-x-reverse">
                            <div className="relative">
                                <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg">
                                    <span className="text-white text-2xl sm:text-3xl">📱</span>
                                </div>
                                <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                            </div>
                            <div className="space-y-2">
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                                    {language === 'ar' ? 'مسح QR Code' : 'QR Code Scanner'}
                                </h1>
                                <p className="text-white/80 text-sm sm:text-base">
                                    {language === 'ar' ? 'نظام مسح متقدم للمشاركين' : 'Advanced participant scanning system'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3 sm:space-x-4 rtl:space-x-reverse">
                            <button
                                onClick={toggleLanguage}
                                className="px-4 py-2 sm:px-5 sm:py-3 text-sm sm:text-base font-medium text-white bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg sm:rounded-xl hover:bg-white/30 hover:shadow-md transition-all duration-200"
                            >
                                {language === 'ar' ? 'English' : 'العربية'}
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 sm:px-5 sm:py-3 text-sm sm:text-base font-medium text-white bg-red-500/80 backdrop-blur-sm rounded-lg sm:rounded-xl hover:bg-red-600/80 shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                                {language === 'ar' ? 'تسجيل خروج' : 'Logout'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <main className="relative max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
                <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                        <div className="group bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-white/20 p-5 sm:p-7 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 sm:gap-5">
                                    <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        <span className="text-white text-xl sm:text-3xl">📱</span>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm sm:text-base font-medium text-gray-600">
                                            {language === 'ar' ? 'إجمالي المسح' : 'Total Scans'}
                                        </p>
                                        <p className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">{scanCount}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setScanCount(0)}
                                    className="px-3 py-2 sm:px-4 sm:py-2.5 text-sm font-medium bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 hover:shadow-md transition-all duration-200"
                                >
                                    {language === 'ar' ? 'إعادة تعيين' : 'Reset'}
                                </button>
                            </div>
                        </div>
                        
                        <div className="group bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-white/20 p-5 sm:p-7 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                            <div className="flex items-center gap-4 sm:gap-5">
                                <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-green-500 to-green-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <span className="text-white text-xl sm:text-3xl">✅</span>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm sm:text-base font-medium text-gray-600">
                                        {language === 'ar' ? 'حالة الكاميرا' : 'Camera Status'}
                                    </p>
                                    <p className="text-base sm:text-xl font-bold text-gray-900">
                                        {cameraMode ? (
                                            <span className="text-green-600 flex items-center space-x-2 rtl:space-x-reverse">
                                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                                <span>{language === 'ar' ? 'نشطة' : 'Active'}</span>
                                            </span>
                                        ) : cameraPermission === 'denied' ? (
                                            <span className="text-red-500 flex items-center space-x-2 rtl:space-x-reverse">
                                                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                                <span>{language === 'ar' ? 'مرفوضة' : 'Denied'}</span>
                                            </span>
                                        ) : cameraPermission === 'granted' ? (
                                            <span className="text-blue-500 flex items-center space-x-2 rtl:space-x-reverse">
                                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                                <span>{language === 'ar' ? 'جاهزة' : 'Ready'}</span>
                                            </span>
                                        ) : (
                                            <span className="text-yellow-500 flex items-center space-x-2 rtl:space-x-reverse">
                                                <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                                                <span>{language === 'ar' ? 'جاري التحقق...' : 'Checking...'}</span>
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="group bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-white/20 p-5 sm:p-7 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 sm:col-span-2 lg:col-span-1">
                            <div className="flex items-center gap-4 sm:gap-5">
                                <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <span className="text-white text-xl sm:text-3xl">👤</span>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm sm:text-base font-medium text-gray-600">
                                        {language === 'ar' ? 'المساح' : 'Scanner'}
                                    </p>
                                    <p className="text-base sm:text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">{user?.name}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Scanner Controls */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-white/20 p-5 sm:p-7 lg:p-9">
                        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-10">
                            {/* Camera Scanner */}
                            <div className="flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
                                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                        <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg">
                                            <span className="text-white text-xl sm:text-2xl">📷</span>
                                        </div>
                                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                                            {language === 'ar' ? 'مسح بالكاميرا' : 'Camera Scanner'}
                                        </h3>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                        <button
                                            onClick={toggleCameraFacing}
                                            className="px-4 py-2 sm:px-5 sm:py-3 text-sm sm:text-base font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-200"
                                        >
                                            {cameraFacing === 'environment' 
                                                ? (language === 'ar' ? '🔄 الكاميرا الخلفية' : '🔄 Back Camera')
                                                : (language === 'ar' ? '🔄 الكاميرا الأمامية' : '🔄 Front Camera')
                                            }
                                        </button>
                                        <button
                                            onClick={toggleCameraMode}
                                            className={`px-5 py-3 sm:px-7 sm:py-4 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-base sm:text-lg ${
                                                cameraMode 
                                                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700' 
                                                    : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
                                            }`}
                                        >
                                            {cameraMode 
                                                ? (language === 'ar' ? '⏹️ إيقاف' : '⏹️ Stop')
                                                : (language === 'ar' ? '▶️ تشغيل' : '▶️ Start')
                                            }
                                        </button>
                                    </div>
                                </div>
                                
                                {cameraMode ? (
                                    <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black">
                                        {/* Camera Loading State */}
                                        {cameraBooting && (
                                            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center z-10">
                                                <div className="text-center text-white">
                                                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mx-auto mb-4"></div>
                                                    <p className="text-lg font-semibold">
                                                        {language === 'ar' ? 'جاري تشغيل الكاميرا...' : 'Starting camera...'}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        
                                        <Scanner
                                            onScan={handleCameraScan}
                                            onError={handleCameraError}
                                            constraints={{
                                                ...(selectedDeviceId ? { deviceId: { exact: selectedDeviceId } } : { facingMode: cameraFacing }),
                                                width: { ideal: 1280, min: 640 },
                                                height: { ideal: 720, min: 480 },
                                                frameRate: { ideal: 30, max: 60 }
                                            }}
                                            styles={{
                                                container: {
                                                    width: '100%',
                                                    height: '400px',
                                                    borderRadius: '16px',
                                                    overflow: 'hidden',
                                                    backgroundColor: '#000',
                                                    position: 'relative'
                                                },
                                                video: {
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    backgroundColor: '#000',
                                                    transform: 'scaleX(-1)' // Mirror the video for better UX
                                                }
                                            }}
                                            components={{
                                                audio: false,
                                                finder: false,
                                                torch: false
                                            }}
                                        />
                                        
                                        {/* Enhanced Scanning Overlay */}
                                        <div className="absolute inset-0 pointer-events-none">
                                            {/* Corner markers */}
                                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64">
                                                {/* Top-left corner */}
                                                <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-green-400 rounded-tl-lg corner-pulse"></div>
                                                {/* Top-right corner */}
                                                <div className="absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 border-green-400 rounded-tr-lg corner-pulse" style={{animationDelay: '0.2s'}}></div>
                                                {/* Bottom-left corner */}
                                                <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 border-green-400 rounded-bl-lg corner-pulse" style={{animationDelay: '0.4s'}}></div>
                                                {/* Bottom-right corner */}
                                                <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-green-400 rounded-br-lg corner-pulse" style={{animationDelay: '0.6s'}}></div>
                                                
                                                {/* Scanning line animation */}
                                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent scan-line"></div>
                                                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent scan-line" style={{animationDelay: '1s'}}></div>
                                            </div>
                                            
                                            {/* Center dot */}
                                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-green-400 rounded-full shadow-lg center-dot"></div>
                                            
                                            {/* Scanning grid */}
                                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 opacity-20">
                                                <div className="grid grid-cols-3 grid-rows-3 h-full w-full">
                                                    {Array.from({length: 9}).map((_, i) => (
                                                        <div key={i} className="border border-green-400"></div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Instructions */}
                                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                                <span>{language === 'ar' ? 'وجه الكاميرا نحو QR Code' : 'Point camera at QR Code'}</span>
                                            </div>
                                        </div>
                                        
                                        {/* Camera info */}
                                        <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs">
                                            {selectedDeviceId
                                                ? (videoInputs.find(d => d.deviceId === selectedDeviceId)?.label || (language === 'ar' ? 'كاميرا متاحة' : 'Available Camera'))
                                                : (cameraFacing === 'environment' 
                                                    ? (language === 'ar' ? 'كاميرا خلفية' : 'Back Camera')
                                                    : (language === 'ar' ? 'كاميرا أمامية' : 'Front Camera'))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-64 sm:h-80 lg:h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-inner relative overflow-hidden">
                                        {/* Background pattern */}
                                        <div className="absolute inset-0 opacity-5">
                                            <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
                                                {Array.from({length: 48}).map((_, i) => (
                                                    <div key={i} className="border border-gray-300"></div>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        <div className="text-center px-4 relative z-10">
                                            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-gray-300 to-gray-400 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg camera-loading">
                                                <span className="text-3xl sm:text-5xl">📷</span>
                                            </div>
                                            <h4 className="text-lg sm:text-xl font-bold text-gray-700 mb-3">
                                                {language === 'ar' ? 'الكاميرا معطلة' : 'Camera Inactive'}
                                            </h4>
                                            <p className="text-gray-500 text-sm sm:text-base max-w-sm mb-4">
                                                {language === 'ar' ? 'اضغط على "تشغيل" لبدء مسح QR Code تلقائياً' : 'Click "Start" to begin automatic QR Code scanning'}
                                            </p>
                                            
                                            {/* Camera status indicator */}
                                            <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                                                <div className={`w-3 h-3 rounded-full ${cameraPermission === 'granted' ? 'bg-green-400' : cameraPermission === 'denied' ? 'bg-red-400' : 'bg-yellow-400'}`}></div>
                                                <span className="text-xs text-gray-600">
                                                    {cameraPermission === 'granted' 
                                                        ? (language === 'ar' ? 'الكاميرا جاهزة' : 'Camera Ready')
                                                        : cameraPermission === 'denied' 
                                                        ? (language === 'ar' ? 'مشكلة في الكاميرا' : 'Camera Issue')
                                                        : (language === 'ar' ? 'جاري التحقق...' : 'Checking...')
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                {cameraError && (
                                    <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl sm:rounded-2xl shadow-lg">
                                        <div className="flex items-start space-x-3 rtl:space-x-reverse">
                                            <div className="p-2 bg-red-500 rounded-full flex-shrink-0">
                                                <span className="text-white text-lg">⚠️</span>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-red-800 font-bold text-sm sm:text-base mb-2">
                                                    {language === 'ar' ? 'خطأ في الكاميرا' : 'Camera Error'}
                                                </h4>
                                                <p className="text-red-700 font-medium text-sm sm:text-base mb-3">{cameraError}</p>
                                                
                                                {/* Retry button for permission errors */}
                                                {cameraError.includes('permission') || cameraError.includes('إذن') ? (
                                                    <button
                                                        onClick={async () => {
                                                            setCameraError(null);
                                                            setCameraPermission(null);
                                                            try {
                                                                const stream = await navigator.mediaDevices.getUserMedia({ 
                                                                    video: { 
                                                                        facingMode: cameraFacing,
                                                                        width: { ideal: 1280 },
                                                                        height: { ideal: 720 }
                                                                    } 
                                                                });
                                                                setCameraPermission('granted');
                                                                stream.getTracks().forEach(track => track.stop());
                                                            } catch (error) {
                                                                setCameraPermission('denied');
                                                                setCameraError(language === 'ar' ? 'لا يزال هناك مشكلة في الوصول للكاميرا' : 'Still having camera access issues');
                                                            }
                                                        }}
                                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
                                                    >
                                                        {language === 'ar' ? '🔄 إعادة المحاولة' : '🔄 Retry'}
                                                    </button>
                                                ) : (
                                                    <div className="text-xs text-red-600">
                                                        {language === 'ar' ? 'تأكد من أن الكاميرا متصلة وليست مستخدمة من قبل تطبيق آخر' : 'Make sure camera is connected and not used by another application'}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Manual Input */}
                            <div className="flex-1">
                                <div className="flex items-center space-x-4 rtl:space-x-reverse mb-6 sm:mb-8">
                                    <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
                                        <span className="text-white text-xl sm:text-2xl">⌨️</span>
                                    </div>
                                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                                        {language === 'ar' ? 'إدخال يدوي' : 'Manual Input'}
                                    </h3>
                                </div>
                                
                                <div className="space-y-6 sm:space-y-8">
                                    <div>
                                        <label className="block text-base font-semibold text-gray-700 mb-3 sm:mb-4">
                                            {language === 'ar' ? 'QR Code' : 'QR Code'}
                                        </label>
                                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-5 rtl:space-x-reverse">
                                            <input
                                                type="text"
                                                value={qrCode}
                                                onChange={handleQRCodeChange}
                                                placeholder={language === 'ar' ? 'أدخل QR Code هنا...' : 'Enter QR Code here...'}
                                                className="flex-1 px-5 py-4 sm:px-7 sm:py-5 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-lg sm:text-xl shadow-lg hover:shadow-xl"
                                                disabled={loading}
                                            />
                                            <button
                                                onClick={() => scanQRCode()}
                                                disabled={loading || !qrCode.trim()}
                                                className="px-7 py-4 sm:px-9 sm:py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl sm:rounded-2xl font-semibold hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-base sm:text-lg"
                                            >
                                                {loading ? (
                                                    <div className="flex items-center justify-center space-x-3 rtl:space-x-reverse">
                                                        <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-2 border-white border-t-transparent"></div>
                                                        <span>{language === 'ar' ? 'جاري المسح...' : 'Scanning...'}</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-center space-x-3 rtl:space-x-reverse">
                                                        <span>🔍</span>
                                                        <span>{language === 'ar' ? 'مسح' : 'Scan'}</span>
                                                    </div>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex justify-center">
                                        <button
                                            onClick={getQRCodeInfo}
                                            disabled={loading || !qrCode.trim()}
                                            className="px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg sm:rounded-xl font-semibold hover:from-gray-700 hover:to-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-base sm:text-lg"
                                        >
                                            <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                                <span>ℹ️</span>
                                                <span>{language === 'ar' ? 'معلومات فقط' : 'Info Only'}</span>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


            {/* Error Message */}
            {error && (
                <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                        <div className="p-3 bg-red-500 rounded-full shadow-lg">
                            <span className="text-white text-2xl">❌</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-red-800">
                                {language === 'ar' ? 'خطأ في المسح' : 'Scan Error'}
                            </h3>
                            <p className="text-red-700 font-medium">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Message */}
            {success && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-100 border border-green-200 rounded-2xl p-6 shadow-xl animate-pulse">
                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                        <div className="p-3 bg-green-500 rounded-full shadow-lg animate-bounce">
                            <span className="text-white text-2xl">✅</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-green-800">
                                {language === 'ar' ? 'تم بنجاح!' : 'Success!'}
                            </h3>
                            <p className="text-green-700 font-medium">
                                {language === 'ar' ? 'تم تسجيل الحضور بنجاح' : 'Check-in successful'}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Scan Result */}
            {scanResult && (
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg mb-4">
                            <span className="text-white text-2xl">📋</span>
                        </div>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                            {language === 'ar' ? 'نتيجة المسح' : 'Scan Result'}
                        </h3>
                        <p className="text-gray-600">
                            {language === 'ar' ? 'تفاصيل تسجيل المشارك' : 'Participant registration details'}
                        </p>
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
                                        {scanResult.is_checked_in ? (
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
                                        ) : (
                                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                                <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse mb-2">
                                                    <span className="text-yellow-600 text-lg">⏳</span>
                                                    <span className="text-yellow-800 font-semibold">
                                                        {language === 'ar' ? 'في انتظار تسجيل الحضور' : 'Awaiting Check-in'}
                                                    </span>
                                                </div>
                                                <p className="text-yellow-700 text-sm">
                                                    {language === 'ar' ? 'لم يتم مسح الكود بعد' : 'QR Code not scanned yet'}
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
            </main>
        </div>
    );
};

export default ScannerDashboard;
