import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const UserDashboard = () => {
    const { user } = useAuth();
    const [registrations, setRegistrations] = useState({
        hackathon: null,
        conference: null,
        workshops: []
    });
    const [availableWorkshops, setAvailableWorkshops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUserRegistrations();
        fetchAvailableWorkshops();
    }, []);

    const fetchUserRegistrations = async () => {
        try {
            const response = await fetch('/api/user/registrations', {
                credentials: 'include'
            });
            const data = await response.json();
            
            if (data.success) {
                setRegistrations(data.data);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('فشل في تحميل بيانات التسجيل');
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailableWorkshops = async () => {
        try {
            const response = await fetch('/api/user/workshops', {
                credentials: 'include'
            });
            const data = await response.json();
            
            if (data.success) {
                setAvailableWorkshops(data.data);
            }
        } catch (err) {
            console.error('فشل في تحميل الورش المتاحة');
        }
    };

    const getStatusBadge = (status) => {
        const statusClasses = {
            'pending': 'bg-yellow-100 text-yellow-800',
            'approved': 'bg-green-100 text-green-800',
            'rejected': 'bg-red-100 text-red-800'
        };

        const statusText = {
            'pending': 'قيد المراجعة',
            'approved': 'مقبول',
            'rejected': 'مرفوض'
        };

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
                {statusText[status] || status}
            </span>
        );
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">جاري التحميل...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">لوحة التحكم</h1>
                    <p className="mt-2 text-gray-600">مرحباً {user?.name}، يمكنك هنا متابعة حالة طلبات التسجيل الخاصة بك</p>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
                        <div className="flex">
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">خطأ</h3>
                                <div className="mt-2 text-sm text-red-700">{error}</div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Hackathon Registration */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">تسجيل الهاكثون</h2>
                        {registrations.hackathon ? (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">الحالة:</span>
                                    {getStatusBadge(registrations.hackathon.status)}
                                </div>
                                <div className="text-sm text-gray-600">
                                    <p><strong>الاسم:</strong> {registrations.hackathon.full_name}</p>
                                    <p><strong>البريد الإلكتروني:</strong> {registrations.hackathon.email}</p>
                                    <p><strong>تاريخ التسجيل:</strong> {formatDate(registrations.hackathon.created_at)}</p>
                                </div>
                                {registrations.hackathon.rejection_reason && (
                                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                                        <p className="text-sm text-red-800">
                                            <strong>سبب الرفض:</strong> {registrations.hackathon.rejection_reason}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500 mb-4">لم تسجل في الهاكثون بعد</p>
                                <a href="/hackathon-registration" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                                    سجل الآن
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Conference Registration */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">تسجيل المؤتمر</h2>
                        {registrations.conference ? (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">الحالة:</span>
                                    {getStatusBadge(registrations.conference.status)}
                                </div>
                                <div className="text-sm text-gray-600">
                                    <p><strong>الاسم:</strong> {registrations.conference.full_name}</p>
                                    <p><strong>البريد الإلكتروني:</strong> {registrations.conference.email}</p>
                                    <p><strong>الجلسة المختارة:</strong> {registrations.conference.session_choice}</p>
                                    <p><strong>تاريخ التسجيل:</strong> {formatDate(registrations.conference.created_at)}</p>
                                </div>
                                {registrations.conference.rejection_reason && (
                                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                                        <p className="text-sm text-red-800">
                                            <strong>سبب الرفض:</strong> {registrations.conference.rejection_reason}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500 mb-4">لم تسجل في المؤتمر بعد</p>
                                <a href="/conference-registration" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                                    سجل الآن
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Workshop Registrations */}
                <div className="mt-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">تسجيلات الورش</h2>
                        {registrations.workshops.length > 0 ? (
                            <div className="space-y-4">
                                {registrations.workshops.map((workshop, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-medium text-gray-900">{workshop.workshop?.title}</h3>
                                            {getStatusBadge(workshop.status)}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            <p><strong>المدرب:</strong> {workshop.workshop?.instructor}</p>
                                            <p><strong>تاريخ التسجيل:</strong> {formatDate(workshop.created_at)}</p>
                                        </div>
                                        {workshop.rejection_reason && (
                                            <div className="mt-2 bg-red-50 border border-red-200 rounded-md p-2">
                                                <p className="text-sm text-red-800">
                                                    <strong>سبب الرفض:</strong> {workshop.rejection_reason}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500 mb-4">لم تسجل في أي ورشة بعد</p>
                                <a href="/workshop-registration" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                                    تصفح الورش المتاحة
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Available Workshops */}
                {availableWorkshops.length > 0 && (
                    <div className="mt-8">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">الورش المتاحة</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {availableWorkshops.map((workshop) => (
                                    <div key={workshop.id} className="border border-gray-200 rounded-lg p-4">
                                        <h3 className="font-medium text-gray-900 mb-2">{workshop.title}</h3>
                                        <p className="text-sm text-gray-600 mb-2">{workshop.description}</p>
                                        <div className="text-sm text-gray-500">
                                            <p><strong>المدرب:</strong> {workshop.instructor}</p>
                                            <p><strong>التوقيت:</strong> {formatDate(workshop.start_time)} - {formatDate(workshop.end_time)}</p>
                                            {workshop.max_participants && (
                                                <p><strong>الحد الأقصى للمشاركين:</strong> {workshop.max_participants}</p>
                                            )}
                                        </div>
                                        <div className="mt-3">
                                            <a 
                                                href={`/workshop-registration?workshop_id=${workshop.id}`}
                                                className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700"
                                            >
                                                سجل في هذه الورشة
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;
