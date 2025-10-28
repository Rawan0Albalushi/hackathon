import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const AdminHackathonRegistrations = () => {
    const { language } = useLanguage();
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedRegistration, setSelectedRegistration] = useState(null);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');

    useEffect(() => {
        fetchRegistrations();
    }, [searchTerm, statusFilter, currentPage]);

    const fetchRegistrations = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: currentPage,
                per_page: 20,
                ...(searchTerm && { search: searchTerm }),
                ...(statusFilter && { status: statusFilter })
            });

            console.log('Fetching registrations with params:', params.toString());
            
            // الحصول على رمز CSRF
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            
            if (!csrfToken) {
                console.error('CSRF token not found');
                setError(language === 'ar' ? 'رمز CSRF غير موجود - يرجى تحديث الصفحة' : 'CSRF token not found - please refresh');
                return;
            }
            
            const response = await fetch(`/api/admin/hackathon-registrations?${params}`, {
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                },
                credentials: 'include'
            });
            
            console.log('Fetch response status:', response.status);
            console.log('Fetch response headers:', response.headers);
            
            const data = await response.json();
            console.log('Fetch response data:', data);
            
            if (data.success) {
                setRegistrations(data.data.data);
                setTotalPages(data.data.last_page);
            } else {
                setError(data.message);
            }
        } catch (err) {
            console.error('Error fetching registrations:', err);
            setError(language === 'ar' ? 'فشل في تحميل بيانات التسجيل' : 'Failed to load registrations');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async () => {
        try {
            // التحقق من صحة البيانات
            if (!selectedRegistration || !selectedRegistration.id) {
                console.error('No registration selected');
                setError(language === 'ar' ? 'لم يتم اختيار تسجيل للتحديث' : 'No registration selected');
                return;
            }
            
            if (!newStatus) {
                console.error('No status selected');
                setError(language === 'ar' ? 'يرجى اختيار حالة جديدة' : 'Please select a new status');
                return;
            }
            
            console.log('Updating status for registration:', selectedRegistration.id);
            console.log('New status:', newStatus);
            console.log('Rejection reason:', rejectionReason);
            
            // إضافة loading state
            setLoading(true);
            setError(null);
            
            const url = `/api/admin/registrations/hackathon/${selectedRegistration.id}/status`;
            console.log('Request URL:', url);
            console.log('Request method: PUT');
            console.log('Request body:', {
                status: newStatus,
                rejection_reason: newStatus === 'rejected' ? rejectionReason : null
            });
            
            // الحصول على رمز CSRF
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            console.log('CSRF Token:', csrfToken);
            
            if (!csrfToken) {
                console.error('CSRF token not found for update request');
                setError(language === 'ar' ? 'رمز CSRF غير موجود - يرجى تحديث الصفحة' : 'CSRF token not found - please refresh');
                setLoading(false);
                return;
            }
            
            // جرب PUT أولاً، ثم POST إذا فشل
            let response;
            try {
                response = await fetch(url, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-TOKEN': csrfToken,
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        status: newStatus,
                        rejection_reason: newStatus === 'rejected' ? rejectionReason : null
                    })
                });
            } catch (putError) {
                console.log('PUT failed, trying POST:', putError);
                response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-TOKEN': csrfToken,
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        status: newStatus,
                        rejection_reason: newStatus === 'rejected' ? rejectionReason : null
                    })
                });
            }

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);
            
            // التحقق من حالة الاستجابة
            if (!response.ok) {
                const errorText = await response.text();
                console.error('HTTP Error Response:', errorText);
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
            }
            
            // التحقق من نوع الاستجابة
            const contentType = response.headers.get('content-type');
            console.log('Content-Type:', contentType);
            
            let data;
            if (contentType && contentType.includes('application/json')) {
                try {
                    data = await response.json();
                    console.log('Successfully parsed JSON response');
                } catch (jsonError) {
                    console.error('Failed to parse JSON:', jsonError);
                    const text = await response.text();
                    console.log('Raw response text:', text);
                    throw new Error(language === 'ar' ? 'فشل في تحليل استجابة الخادم' : 'Failed to parse server response');
                }
            } else {
                // إذا لم تكن JSON، احصل على النص
                const text = await response.text();
                console.log('Non-JSON response:', text);
                console.log('Response status:', response.status);
                console.log('Response headers:', Object.fromEntries(response.headers.entries()));
                throw new Error(language === 'ar' ? 'الخادم لم يعد استجابة JSON صحيحة' : 'Server did not return valid JSON');
            }
            
            console.log('Response data:', data);
            console.log('Data success value:', data.success);
            console.log('Data success type:', typeof data.success);
            
            if (data.success) {
                console.log('Status updated successfully');
                setShowStatusModal(false);
                setSelectedRegistration(null);
                setNewStatus('');
                setRejectionReason('');
                fetchRegistrations();
            } else {
                console.error('Update failed:', data.message);
                console.error('Full data object:', data);
                setError(data.message || (language === 'ar' ? 'فشل في تحديث حالة التسجيل' : 'Failed to update registration status'));
            }
        } catch (err) {
            console.error('Error updating status:', err);
            console.error('Error message:', err.message);
            console.error('Error stack:', err.stack);
            if (err.message.includes('JSON')) {
                setError(language === 'ar' ? 'خطأ في استجابة الخادم - يرجى المحاولة مرة أخرى' : 'Server response error - please try again');
            } else if (err.message.includes('Network')) {
                setError(language === 'ar' ? 'خطأ في الاتصال بالخادم - تحقق من اتصال الإنترنت' : 'Network error - check your connection');
            } else if (err.message.includes('HTTP error')) {
                if (err.message.includes('404')) {
                    setError(language === 'ar' ? 'التسجيل غير موجود - يرجى تحديث الصفحة' : 'Registration not found - please refresh');
                } else if (err.message.includes('403')) {
                    setError(language === 'ar' ? 'ليس لديك صلاحية لتحديث هذا التسجيل' : 'You are not authorized to update this registration');
                } else if (err.message.includes('500')) {
                    setError(language === 'ar' ? 'خطأ في الخادم - يرجى المحاولة مرة أخرى' : 'Server error - please try again');
                } else {
                    setError(language === 'ar' ? 'خطأ في الخادم - يرجى المحاولة مرة أخرى' : 'Server error - please try again');
                }
            } else if (err.message.includes('Unexpected token')) {
                setError(language === 'ar' ? 'خطأ في استجابة الخادم - يرجى المحاولة مرة أخرى' : 'Server response error - please try again');
            } else if (err.message.includes('<!DOCTYPE')) {
                setError(language === 'ar' ? 'خطأ في استجابة الخادم - يرجى المحاولة مرة أخرى' : 'Server response error - please try again');
            } else if (err.message.includes('Method Not Allowed')) {
                setError(language === 'ar' ? 'خطأ في الطريقة - يرجى المحاولة مرة أخرى' : 'Method error - please try again');
            } else if (err.message.includes('CSRF')) {
                setError(language === 'ar' ? 'خطأ في الأمان - يرجى تحديث الصفحة والمحاولة مرة أخرى' : 'Security error - please refresh and try again');
            } else if (err.message.includes('419')) {
                setError(language === 'ar' ? 'انتهت صلاحية الجلسة - يرجى تحديث الصفحة' : 'Session expired - please refresh');
            } else if (err.message.includes('رمز CSRF غير موجود')) {
                setError(language === 'ar' ? 'رمز CSRF غير موجود - يرجى تحديث الصفحة' : 'CSRF token not found - please refresh');
            } else if (err.message.includes('token mismatch')) {
                setError(language === 'ar' ? 'خطأ في رمز الأمان - يرجى تحديث الصفحة' : 'Security token mismatch - please refresh');
            } else {
                setError((language === 'ar' ? 'فشل في تحديث حالة التسجيل: ' : 'Failed to update registration status: ') + err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusClasses = {
            'pending': 'bg-yellow-100 text-yellow-800',
            'approved': 'bg-green-100 text-green-800',
            'rejected': 'bg-red-100 text-red-800'
        };

        const statusText = {
            'pending': language === 'ar' ? 'قيد المراجعة' : 'Pending',
            'approved': language === 'ar' ? 'مقبول' : 'Approved',
            'rejected': language === 'ar' ? 'مرفوض' : 'Rejected'
        };

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
                {statusText[status] || status}
            </span>
        );
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getAttendanceBadge = (isCheckedIn, checkedInAt) => {
        const isPresent = Boolean(isCheckedIn);
        const classes = isPresent ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
        const text = isPresent ? (language === 'ar' ? 'حاضر' : 'Present') : (language === 'ar' ? 'غير حاضر' : 'Absent');
        const title = isPresent && checkedInAt
            ? (language === 'ar' ? `وقت الدخول: ${formatDate(checkedInAt)}` : `Checked in at: ${formatDate(checkedInAt)}`)
            : '';
        return (
            <span title={title} className={`px-2 py-1 rounded-full text-xs font-medium ${classes}`}>
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
        <div className="space-y-6 relative" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <div className="bg-white/90 backdrop-blur-lg shadow-xl rounded-2xl border border-gray-200/50">
                <div className="px-6 py-6 border-b border-gray-200/50">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent">
                            {language === 'ar' ? 'إدارة تسجيلات الهاكثون' : 'Hackathon Registrations Management'}
                        </h2>
                    </div>
                </div>
                
                <div className="p-6">
                    {/* Filters */}
                    <div className="mb-6 flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3 rtl:pl-0 rtl:pr-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder={language === 'ar' ? 'البحث بالاسم أو البريد الإلكتروني...' : 'Search by name or email...'}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 rtl:pl-0 rtl:pr-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                                />
                            </div>
                        </div>
                        <div>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 bg-white"
                            >
                                <option value="">{language === 'ar' ? 'جميع الحالات' : 'All Status'}</option>
                                <option value="pending">{language === 'ar' ? 'قيد المراجعة' : 'Pending'}</option>
                                <option value="approved">{language === 'ar' ? 'مقبول' : 'Approved'}</option>
                                <option value="rejected">{language === 'ar' ? 'مرفوض' : 'Rejected'}</option>
                            </select>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}

                    {/* Registrations Table */}
                    <div className="admin-table-container" data-table="hackathon" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                        <div className="table-wrapper">
                            <table className="table-fade-in">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {language === 'ar' ? 'الاسم' : 'Name'}
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {language === 'ar' ? 'الهاتف' : 'Phone'}
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {language === 'ar' ? 'المهارات' : 'Skills'}
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {language === 'ar' ? 'الحالة' : 'Status'}
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {language === 'ar' ? 'الحضور' : 'Attendance'}
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {language === 'ar' ? 'تاريخ التسجيل' : 'Registered At'}
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {language === 'ar' ? 'الإجراءات' : 'Actions'}
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
                                            {(() => {
                                                const skillsText = registration.skills?.join(', ') || '';
                                                return skillsText.length > 20 
                                                    ? skillsText.substring(0, 20) + '...'
                                                    : skillsText;
                                            })()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(registration.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getAttendanceBadge(registration.is_checked_in, registration.checked_in_at)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(registration.created_at)}
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

            {/* Simple Status Update Modal */}
            {showStatusModal && (
                <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto max-h-[80vh] overflow-y-auto" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                        {/* Modal Header */}
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
                                        <p className="text-sm text-gray-600">{language === 'ar' ? 'تحديث حالة تسجيل الهاكثون' : 'Update hackathon registration status'}</p>
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

                        {/* Modal Body */}
                        <div className="px-6 py-4 space-y-4">
                            {/* Error Display */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-sm text-red-800">{error}</p>
                                    </div>
                                </div>
                            )}
                            
                            {/* Status Selection */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    {language === 'ar' ? 'الحالة الجديدة' : 'New Status'}
                                </label>
                                <select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    disabled={loading}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                >
                                    <option value="">{language === 'ar' ? 'اختر الحالة' : 'Select status'}</option>
                                    <option value="pending">{language === 'ar' ? 'قيد المراجعة' : 'Pending'}</option>
                                    <option value="approved">{language === 'ar' ? 'مقبول' : 'Approved'}</option>
                                    <option value="rejected">{language === 'ar' ? 'مرفوض' : 'Rejected'}</option>
                                </select>
                            </div>

                            {/* Rejection Reason */}
                            {newStatus === 'rejected' && (
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        {language === 'ar' ? 'سبب الرفض (اختياري)' : 'Rejection reason (optional)'}
                                    </label>
                                    <textarea
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        disabled={loading}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 resize-none transition-colors duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        placeholder={language === 'ar' ? 'أدخل سبب الرفض...' : 'Enter rejection reason...'}
                                    />
                                </div>
                            )}

                            {/* Status Preview */}
                            <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-md p-3 border border-orange-200">
                                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                    <span className="text-sm font-medium text-gray-700">{language === 'ar' ? 'معاينة الحالة:' : 'Status preview:'}</span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        newStatus === 'pending' ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border border-yellow-300' :
                                        newStatus === 'approved' ? 'bg-gradient-to-r from-green-100 to-teal-100 text-green-800 border border-green-300' :
                                        'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-300'
                                    }`}>
                                        {newStatus === 'pending' ? (language === 'ar' ? 'قيد المراجعة' : 'Pending') :
                                         newStatus === 'approved' ? (language === 'ar' ? 'مقبول' : 'Approved') : (language === 'ar' ? 'مرفوض' : 'Rejected')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
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
                                    disabled={loading}
                                    className={`px-4 py-2 rounded-md transition-all duration-200 shadow-lg ${
                                        loading 
                                            ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                                            : 'bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 hover:shadow-xl'
                                    }`}
                                >
                                    {loading ? (
                                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>{language === 'ar' ? 'جاري التحديث...' : 'Updating...'}</span>
                                        </div>
                                    ) : (
                                        language === 'ar' ? 'تحديث الحالة' : 'Update Status'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Simple View Modal */}
            {showViewModal && selectedRegistration && (
                <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-auto max-h-[80vh] overflow-y-auto">
                        {/* Modal Header */}
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
                                            {language === 'ar' ? 'تفاصيل تسجيل الهاكثون' : 'Hackathon Registration Details'}
                                        </h3>
                                        <p className="text-sm text-gray-600">{language === 'ar' ? 'معلومات شاملة عن المتسجل' : 'Comprehensive participant information'}</p>
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

                        {/* Modal Body */}
                        <div className="px-6 py-4 space-y-4">
                            {/* Personal Information Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Name */}
                                <div className="space-y-2 modal-field-enter">
                                    <label className="block text-sm font-semibold text-gray-700 flex items-center space-x-2 rtl:space-x-reverse">
                                        <svg className="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <span>{language === 'ar' ? 'الاسم الكامل' : 'Full Name'}</span>
                                    </label>
                                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                        <p className="text-gray-900 font-medium">{selectedRegistration.full_name}</p>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="space-y-2 modal-field-enter">
                                    <label className="block text-sm font-semibold text-gray-700 flex items-center space-x-2 rtl:space-x-reverse">
                                        <svg className="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        <span>{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</span>
                                    </label>
                                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                        <p className="text-gray-900 font-medium">{selectedRegistration.email}</p>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="space-y-2 modal-field-enter">
                                    <label className="block text-sm font-semibold text-gray-700 flex items-center space-x-2 rtl:space-x-reverse">
                                        <svg className="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1.091.091 0 01.091.091v3.858a1.091.091 0 01-.091.091H5a2 2 0 00-2 2v6a2 2 0 002 2h3.28a1.091.091 0 01.091.091v3.858a1.091.091 0 01-.091.091H5a2 2 0 01-2-2v-6z" />
                                        </svg>
                                        <span>{language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}</span>
                                    </label>
                                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                        <p className="text-gray-900 font-medium">{selectedRegistration.phone}</p>
                                    </div>
                                </div>

                                {/* Status */}
                                <div className="space-y-2 modal-field-enter">
                                    <label className="block text-sm font-semibold text-gray-700 flex items-center space-x-2 rtl:space-x-reverse">
                                        <svg className="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>{language === 'ar' ? 'حالة التسجيل' : 'Registration Status'}</span>
                                    </label>
                                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold status-badge-animated ${
                                            selectedRegistration.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            selectedRegistration.status === 'approved' ? 'bg-green-100 text-green-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            <div className={`w-2 h-2 rounded-full mr-2 rtl:mr-0 rtl:ml-2 ${
                                                selectedRegistration.status === 'pending' ? 'bg-yellow-500' :
                                                selectedRegistration.status === 'approved' ? 'bg-green-500' :
                                                'bg-red-500'
                                            }`}></div>
                                            {selectedRegistration.status === 'pending' ? (language === 'ar' ? 'قيد المراجعة' : 'Pending') :
                                             selectedRegistration.status === 'approved' ? (language === 'ar' ? 'مقبول' : 'Approved') : (language === 'ar' ? 'مرفوض' : 'Rejected')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Skills Section */}
                            <div className="space-y-3 modal-field-enter">
                                <label className="block text-sm font-semibold text-gray-700 flex items-center space-x-2 rtl:space-x-reverse">
                                    <svg className="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                    <span>{language === 'ar' ? 'المهارات التقنية' : 'Technical Skills'}</span>
                                </label>
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                    {selectedRegistration.skills && selectedRegistration.skills.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {selectedRegistration.skills.map((skill, index) => (
                                                <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-pink-100 to-orange-100 text-pink-800 border border-pink-200 skill-tag-animated">
                                                    <svg className="w-3 h-3 mr-1 rtl:mr-0 rtl:ml-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex items-center space-x-2 rtl:space-x-reverse text-gray-500">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                            </svg>
                                            <span>{language === 'ar' ? 'لا توجد مهارات مسجلة' : 'No skills provided'}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Registration Date */}
                            <div className="space-y-2 modal-field-enter">
                                <label className="block text-sm font-semibold text-gray-700 flex items-center space-x-2 rtl:space-x-reverse">
                                    <svg className="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>{language === 'ar' ? 'تاريخ التسجيل' : 'Registration Date'}</span>
                                </label>
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-gray-900 font-medium">{formatDate(selectedRegistration.created_at)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
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

export default AdminHackathonRegistrations;