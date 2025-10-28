import React, { useState, useEffect } from 'react';

const AdminWorkshopRegistrations = () => {
    const [registrations, setRegistrations] = useState([]);
    const [workshops, setWorkshops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [workshopFilter, setWorkshopFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedRegistration, setSelectedRegistration] = useState(null);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');

    useEffect(() => {
        fetchRegistrations();
        fetchWorkshops();
    }, [searchTerm, statusFilter, workshopFilter, currentPage]);

    const fetchRegistrations = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: currentPage,
                per_page: 10,
                ...(searchTerm && { search: searchTerm }),
                ...(statusFilter && { status: statusFilter }),
                ...(workshopFilter && { workshop_id: workshopFilter })
            });

            const response = await fetch(`/api/admin/workshop-registrations?${params}`, {
                credentials: 'include'
            });
            const data = await response.json();
            
            if (data.success) {
                setRegistrations(data.data.data);
                setTotalPages(data.data.last_page);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('فشل في تحميل بيانات التسجيل');
        } finally {
            setLoading(false);
        }
    };

    const fetchWorkshops = async () => {
        try {
            const response = await fetch('/api/admin/workshops', {
                credentials: 'include'
            });
            const data = await response.json();
            
            if (data.success) {
                setWorkshops(data.data.data);
            }
        } catch (err) {
            console.error('فشل في تحميل الورش');
        }
    };

    const handleStatusUpdate = async () => {
        try {
            // Get CSRF token
            const token = document.head.querySelector('meta[name="csrf-token"]');
            const csrfToken = token ? token.content : '';

            const response = await fetch(`/api/admin/registrations/workshop/${selectedRegistration.id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'include',
                body: JSON.stringify({
                    status: newStatus,
                    rejection_reason: newStatus === 'rejected' ? rejectionReason : null
                })
            });

            const data = await response.json();
            console.log('Workshop response data:', data);
            console.log('Data success value:', data.success);
            console.log('Data success type:', typeof data.success);
            
            if (data.success) {
                console.log('Workshop status updated successfully');
                setShowStatusModal(false);
                setSelectedRegistration(null);
                setNewStatus('');
                setRejectionReason('');
                fetchRegistrations();
            } else {
                console.error('Workshop update failed:', data.message);
                console.error('Full data object:', data);
                setError(data.message);
            }
        } catch (err) {
            setError('فشل في تحديث حالة التسجيل');
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
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDateOnly = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getAttendanceBadge = (isCheckedIn, checkedInAt) => {
        const isPresent = Boolean(isCheckedIn);
        const classes = isPresent ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
        const text = isPresent ? 'حاضر' : 'غير حاضر';
        return (
            <span title={isPresent && checkedInAt ? `وقت الدخول: ${formatDate(checkedInAt)}` : ''} className={`px-2 py-1 rounded-full text-xs font-medium ${classes}`}>
                {text}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="admin-table-container">
                <div className="table-loading">
                    <div className="table-loading-spinner"></div>
                    <p className="mt-4 text-gray-600">جاري التحميل...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">إدارة تسجيلات الورش</h2>
                </div>
                
                <div className="p-6">
                    {/* Filters */}
                    <div className="mb-6 flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="البحث بالاسم أو البريد الإلكتروني..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">جميع الحالات</option>
                                <option value="pending">قيد المراجعة</option>
                                <option value="approved">مقبول</option>
                                <option value="rejected">مرفوض</option>
                            </select>
                        </div>
                        <div>
                            <select
                                value={workshopFilter}
                                onChange={(e) => setWorkshopFilter(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">جميع الورش</option>
                                {workshops.map((workshop) => (
                                    <option key={workshop.id} value={workshop.id}>
                                        {workshop.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}

                    {/* Registrations Table */}
                    <div className="admin-table-container" data-table="workshop" dir="rtl">
                        <div className="table-wrapper">
                            <table className="table-fade-in">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        الاسم
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        البريد الإلكتروني
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        الهاتف
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        الورشة
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        الحالة
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        الحضور
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        تاريخ التسجيل
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        الإجراءات
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {registrations.map((registration) => (
                                    <tr key={registration.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {registration.full_name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {registration.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {registration.phone}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {registration.workshop?.title}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(registration.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getAttendanceBadge(registration.is_checked_in, registration.checked_in_at)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDateOnly(registration.created_at)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="admin-btn-container">
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        console.log('View button clicked:', registration);
                                                        setSelectedRegistration(registration);
                                                        setShowViewModal(true);
                                                    }}
                                                    className="admin-btn-view"
                                                >
                                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                    عرض
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        console.log('Edit button clicked:', registration);
                                                        setSelectedRegistration(registration);
                                                        setNewStatus(registration.status);
                                                        setShowStatusModal(true);
                                                    }}
                                                    className="admin-btn-update"
                                                >
                                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                    تحديث
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="table-pagination">
                                <div className="table-pagination-info">
                                    صفحة {currentPage} من {totalPages}
                                </div>
                                <div className="table-pagination-controls">
                                    <button
                                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        className="table-pagination-button"
                                    >
                                        السابق
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`table-pagination-button ${page === currentPage ? 'active' : ''}`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage === totalPages}
                                        className="table-pagination-button"
                                    >
                                        التالي
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Status Update Modal */}
            {showStatusModal && (
                <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto max-h-[80vh] overflow-y-auto">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-pink-50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                                            تحديث حالة التسجيل
                                        </h3>
                                        <p className="text-sm text-gray-600">تحديث حالة تسجيل الورشة</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowStatusModal(false)}
                                    className="p-2 text-gray-400 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition-colors duration-200"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="px-6 py-4 space-y-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">الحالة الجديدة</label>
                                <select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                                >
                                    <option value="pending">قيد المراجعة</option>
                                    <option value="approved">مقبول</option>
                                    <option value="rejected">مرفوض</option>
                                </select>
                            </div>
                            {newStatus === 'rejected' && (
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">سبب الرفض (اختياري)</label>
                                    <textarea
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 resize-none transition-colors duration-200"
                                        placeholder="أدخل سبب الرفض..."
                                    />
                                </div>
                            )}
                        </div>
                        <div className="px-6 py-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-orange-50">
                            <div className="flex justify-end space-x-3 rtl:space-x-reverse">
                                <button
                                    onClick={() => setShowStatusModal(false)}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200"
                                >
                                    إلغاء
                                </button>
                                <button
                                    onClick={handleStatusUpdate}
                                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-md hover:from-orange-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                    تحديث
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* View Modal */}
            {showViewModal && selectedRegistration && (
                <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4" dir="rtl">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-auto max-h-[80vh] overflow-y-auto">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-teal-50 to-navy-50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                    <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-navy-500 rounded-lg flex items-center justify-center shadow-lg">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold bg-gradient-to-r from-teal-600 to-navy-600 bg-clip-text text-transparent">
                                            تفاصيل تسجيل الورشة
                                        </h3>
                                        <p className="text-sm text-gray-600">معلومات شاملة عن المتسجل</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowViewModal(false)}
                                    className="p-2 text-gray-400 hover:text-teal-500 hover:bg-teal-50 rounded-lg transition-colors duration-200"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="px-6 py-4 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">الاسم</label>
                                    <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                                        {selectedRegistration.full_name}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">البريد الإلكتروني</label>
                                    <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                                        {selectedRegistration.email}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">الهاتف</label>
                                    <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                                        {selectedRegistration.phone}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">الورشة</label>
                                    <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                                        {selectedRegistration.workshop?.title || 'غير محدد'}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">المدرب</label>
                                    <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                                        {selectedRegistration.workshop?.instructor || 'غير محدد'}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">الحالة</label>
                                    <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                                            selectedRegistration.status === 'pending' ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border border-yellow-300' :
                                            selectedRegistration.status === 'approved' ? 'bg-gradient-to-r from-green-100 to-teal-100 text-green-800 border border-green-300' :
                                            'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-300'
                                        }`}>
                                            {selectedRegistration.status === 'pending' ? 'قيد المراجعة' :
                                             selectedRegistration.status === 'approved' ? 'مقبول' : 'مرفوض'}
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">تاريخ التسجيل</label>
                                    <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                                        {formatDate(selectedRegistration.created_at)}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-teal-50">
                            <div className="flex justify-end">
                                <button
                                    onClick={() => setShowViewModal(false)}
                                    className="px-4 py-2 bg-gradient-to-r from-teal-500 to-navy-500 text-white rounded-md hover:from-teal-600 hover:to-navy-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                    إغلاق
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminWorkshopRegistrations;
