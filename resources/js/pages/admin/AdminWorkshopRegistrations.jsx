import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const AdminWorkshopRegistrations = () => {
    const { language } = useLanguage();
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
            setError(language === 'ar' ? 'فشل في تحميل بيانات التسجيل' : 'Failed to load registrations');
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
            console.error('Failed to load workshops');
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
            setError(language === 'ar' ? 'فشل في تحديث حالة التسجيل' : 'Failed to update registration status');
        }
    };

    const getStatusBadge = (status) => {
        const statusClasses = {
            'pending': 'bg-yellow-100 text-yellow-800',
            'approved': 'bg-green-100 text-green-800',
            'rejected': 'bg-red-100 text-red-800'
        };

        const statusText = language === 'ar'
            ? { 'pending': 'قيد المراجعة', 'approved': 'مقبول', 'rejected': 'مرفوض' }
            : { 'pending': 'Pending', 'approved': 'Approved', 'rejected': 'Rejected' };

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
                    <p className="mt-4 text-gray-600">{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">{language === 'ar' ? 'إدارة تسجيلات الورش' : 'Manage Workshop Registrations'}</h2>
                </div>
                
                <div className="p-6">
                    {/* Filters */}
                    <div className="mb-6 flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder={language === 'ar' ? 'البحث بالاسم أو البريد الإلكتروني...' : 'Search by name or email...'}
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
                                <option value="">{language === 'ar' ? 'جميع الحالات' : 'All Status'}</option>
                                <option value="pending">{language === 'ar' ? 'قيد المراجعة' : 'Pending'}</option>
                                <option value="approved">{language === 'ar' ? 'مقبول' : 'Approved'}</option>
                                <option value="rejected">{language === 'ar' ? 'مرفوض' : 'Rejected'}</option>
                            </select>
                        </div>
                        <div>
                            <select
                                value={workshopFilter}
                                onChange={(e) => setWorkshopFilter(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">{language === 'ar' ? 'جميع الورش' : 'All Workshops'}</option>
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
                    <div className="admin-table-container" data-table="workshop" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                        <div className="table-wrapper">
                            <table className="table-fade-in">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{language === 'ar' ? 'الاسم' : 'Name'}</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{language === 'ar' ? 'الهاتف' : 'Phone'}</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{language === 'ar' ? 'الورشة' : 'Workshop'}</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{language === 'ar' ? 'الحالة' : 'Status'}</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{language === 'ar' ? 'الحضور' : 'Attendance'}</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{language === 'ar' ? 'تاريخ التسجيل' : 'Registered At'}</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{language === 'ar' ? 'الإجراءات' : 'Actions'}</th>
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
                                                    {language === 'ar' ? 'عرض' : 'View'}
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
                                                    {language === 'ar' ? 'تحديث' : 'Update'}
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
                                    {language === 'ar' ? 'صفحة' : 'Page'} {currentPage} {language === 'ar' ? 'من' : 'of'} {totalPages}
                                </div>
                                <div className="table-pagination-controls">
                                    <button
                                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        className="table-pagination-button"
                                    >
                                        {language === 'ar' ? 'السابق' : 'Prev'}
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
                                        {language === 'ar' ? 'التالي' : 'Next'}
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
                                            {language === 'ar' ? 'تحديث حالة التسجيل' : 'Update Registration Status'}
                                        </h3>
                                        <p className="text-sm text-gray-600">{language === 'ar' ? 'تحديث حالة تسجيل الورشة' : 'Update workshop registration status'}</p>
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
                                <label className="block text-sm font-medium text-gray-700">{language === 'ar' ? 'الحالة الجديدة' : 'New Status'}</label>
                                <select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                                >
                                    <option value="pending">{language === 'ar' ? 'قيد المراجعة' : 'Pending'}</option>
                                    <option value="approved">{language === 'ar' ? 'مقبول' : 'Approved'}</option>
                                    <option value="rejected">{language === 'ar' ? 'مرفوض' : 'Rejected'}</option>
                                </select>
                            </div>
                            {newStatus === 'rejected' && (
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">{language === 'ar' ? 'سبب الرفض (اختياري)' : 'Rejection reason (optional)'}</label>
                                    <textarea
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 resize-none transition-colors duration-200"
                                        placeholder={language === 'ar' ? 'أدخل سبب الرفض...' : 'Enter rejection reason...'}
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
                                    {language === 'ar' ? 'إلغاء' : 'Cancel'}
                                </button>
                                <button
                                    onClick={handleStatusUpdate}
                                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-md hover:from-orange-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                    {language === 'ar' ? 'تحديث' : 'Update'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* View Modal */}
            {showViewModal && selectedRegistration && (
                <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
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
                                            {language === 'ar' ? 'تفاصيل تسجيل الورشة' : 'Workshop Registration Details'}
                                        </h3>
                                        <p className="text-sm text-gray-600">{language === 'ar' ? 'معلومات شاملة عن المتسجل' : 'Complete registrant information'}</p>
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
                                    <label className="block text-sm font-medium text-gray-700">{language === 'ar' ? 'الاسم' : 'Name'}</label>
                                    <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                                        {selectedRegistration.full_name}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</label>
                                    <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                                        {selectedRegistration.email}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">{language === 'ar' ? 'الهاتف' : 'Phone'}</label>
                                    <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                                        {selectedRegistration.phone}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">{language === 'ar' ? 'الورشة' : 'Workshop'}</label>
                                    <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                                        {selectedRegistration.workshop?.title || (language === 'ar' ? 'غير محدد' : 'N/A')}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">{language === 'ar' ? 'المدرب' : 'Instructor'}</label>
                                    <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                                        {selectedRegistration.workshop?.instructor || (language === 'ar' ? 'غير محدد' : 'N/A')}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">{language === 'ar' ? 'الحالة' : 'Status'}</label>
                                    <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                                            selectedRegistration.status === 'pending' ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border border-yellow-300' :
                                            selectedRegistration.status === 'approved' ? 'bg-gradient-to-r from-green-100 to-teal-100 text-green-800 border border-green-300' :
                                            'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-300'
                                        }`}>
                                            {selectedRegistration.status === 'pending' ? (language === 'ar' ? 'قيد المراجعة' : 'Pending') :
                                             selectedRegistration.status === 'approved' ? (language === 'ar' ? 'مقبول' : 'Approved') : (language === 'ar' ? 'مرفوض' : 'Rejected')}
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">{language === 'ar' ? 'تاريخ التسجيل' : 'Registered At'}</label>
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
                                    {language === 'ar' ? 'إغلاق' : 'Close'}
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
