import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import * as XLSX from 'xlsx';

const AdminRegistrations = () => {
    const { language, t } = useLanguage();
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const perPage = 10;
    const [selectedRegistration, setSelectedRegistration] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);

    // Debounce search term
    useEffect(() => {
        setIsSearching(true);
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            setIsSearching(false);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        fetchRegistrations();
    }, [debouncedSearchTerm, filterType, currentPage]);

    const fetchRegistrations = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                type: filterType,
                search: debouncedSearchTerm,
                page: currentPage,
                per_page: perPage
            });

            const response = await fetch(`/api/admin/registrations?${params}`);
            const data = await response.json();
            
            if (data.success) {
                setRegistrations(data.data.registrations);
                setTotal(data.data.total);
                setTotalPages(data.data.last_page);
            } else {
                setError(data.message || 'Failed to fetch registrations');
            }
        } catch (err) {
            setError('Network error occurred');
            console.error('Error fetching registrations:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleFilterChange = (e) => {
        setFilterType(e.target.value);
        setCurrentPage(1);
        setSearchTerm(''); // Clear search when changing filter
        setDebouncedSearchTerm(''); // Clear debounced search too
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleExportExcel = () => {
        if (registrations.length === 0) {
            alert(language === 'ar' ? 'لا توجد بيانات للتصدير' : 'No data to export');
            return;
        }

        // تحضير البيانات للتصدير
        const exportData = registrations.map(registration => ({
            [language === 'ar' ? 'الاسم' : 'Name']: registration.name,
            [language === 'ar' ? 'البريد الإلكتروني' : 'Email']: registration.email,
            [language === 'ar' ? 'الهاتف' : 'Phone']: registration.phone,
            [language === 'ar' ? 'النوع' : 'Type']: registration.type,
            [language === 'ar' ? 'المهارات' : 'Skills']: registration.skills ? registration.skills.join(', ') : (language === 'ar' ? 'لا توجد مهارات' : 'No skills'),
            [language === 'ar' ? 'التاريخ' : 'Date']: new Date(registration.date).toLocaleDateString('en-US')
        }));

        // إنشاء ملف Excel
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, language === 'ar' ? 'التسجيلات' : 'Registrations');

        // تصدير الملف
        const fileName = `registrations_${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(workbook, fileName);
    };

    if (loading && registrations.length === 0) {
        return (
            <div className="admin-table-container">
                <div className="table-loading">
                    <div className="table-loading-spinner"></div>
                    <p className="mt-4 text-gray-600">
                        {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-table-container">
                <div className="table-empty">
                    <div className="text-red-500 text-lg mb-4">{error}</div>
                    <button 
                        onClick={fetchRegistrations}
                        className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
                    >
                        {language === 'ar' ? 'إعادة المحاولة' : 'Retry'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 h-full overflow-y-auto">
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            {language === 'ar' ? 'إدارة التسجيلات' : 'Manage Registrations'}
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {language === 'ar' ? 'عرض وإدارة جميع التسجيلات' : 'View and manage all registrations'}
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0">
                        <button
                            onClick={handleExportExcel}
                            className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition-all duration-300 flex items-center space-x-2 rtl:space-x-reverse"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span>{language === 'ar' ? 'تصدير Excel' : 'Export Excel'}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200/50 p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            {isSearching ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-500"></div>
                            ) : (
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            )}
                        </div>
                        <input
                            type="text"
                            placeholder={language === 'ar' ? 'البحث...' : 'Search...'}
                            value={searchTerm}
                            onChange={handleSearch}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    {/* Filter by Type */}
                    <div className="relative">
                        <select
                            value={filterType}
                            onChange={handleFilterChange}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
                        >
                            <option value="all">{language === 'ar' ? 'جميع الأنواع' : 'All Types'}</option>
                            <option value="hackathon">{language === 'ar' ? 'الهاكثون' : 'Hackathon'}</option>
                            <option value="workshop">{language === 'ar' ? 'الورشة' : 'Workshop'}</option>
                            <option value="conference">{language === 'ar' ? 'المؤتمر' : 'Conference'}</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="flex items-center text-sm text-gray-600">
                        <span className="mr-2 rtl:mr-0 rtl:ml-2">
                            {language === 'ar' ? 'إجمالي النتائج:' : 'Total Results:'} {total}
                        </span>
                        {filterType !== 'all' && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                {language === 'ar' ? 
                                    (filterType === 'hackathon' ? 'الهاكثون' : 
                                     filterType === 'workshop' ? 'الورشة' : 'المؤتمر') :
                                    (filterType === 'hackathon' ? 'Hackathon' : 
                                     filterType === 'workshop' ? 'Workshop' : 'Conference')
                                }
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Registrations Table */}
            <div className="admin-table-container" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                {registrations.length === 0 && !loading ? (
                    <div className="table-empty">
                        <svg className="table-empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="text-sm font-medium text-gray-900">
                            {language === 'ar' ? 'لا توجد نتائج' : 'No results found'}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {language === 'ar' ? 'جرب تغيير معايير البحث أو الفلتر' : 'Try adjusting your search or filter criteria'}
                        </p>
                    </div>
                ) : (
                    <>
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
                                            {language === 'ar' ? 'النوع' : 'Type'}
                                        </th>
                                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {language === 'ar' ? 'المهارات' : 'Skills'}
                                        </th>
                                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {language === 'ar' ? 'التاريخ' : 'Date'}
                                        </th>
                                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {language === 'ar' ? 'الإجراءات' : 'Actions'}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {registrations.map((registration) => (
                                        <tr key={registration.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {registration.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {registration.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {registration.phone}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    registration.type === 'Hackathon' ? 'bg-indigo-100 text-indigo-800' :
                                                    registration.type === 'Workshop' ? 'bg-green-100 text-green-800' :
                                                    'bg-orange-100 text-orange-800'
                                                }`}>
                                                    {registration.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {registration.skills ? (
                                                    <div className={`flex flex-wrap gap-1 ${language === 'ar' ? 'justify-end' : 'justify-start'}`}>
                                                        {registration.skills.map((skill, index) => (
                                                            <span key={`${registration.id}-skill-${index}`} className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                                                {skill}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400 text-xs">
                                                        {language === 'ar' ? 'لا توجد مهارات' : 'No skills'}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(registration.date).toLocaleDateString('en-US')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="admin-btn-container">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
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
                                    {language === 'ar' ? 'عرض' : 'Showing'} <span className="font-medium">{(currentPage - 1) * perPage + 1}</span> {language === 'ar' ? 'إلى' : 'to'} <span className="font-medium">{Math.min(currentPage * perPage, total)}</span> {language === 'ar' ? 'من' : 'of'} <span className="font-medium">{total}</span> {language === 'ar' ? 'نتيجة' : 'results'}
                                </div>
                                <div className="table-pagination-controls">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="table-pagination-button"
                                    >
                                        {language === 'ar' ? 'السابق' : 'Previous'}
                                    </button>
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="table-pagination-button"
                                    >
                                        {language === 'ar' ? 'التالي' : 'Next'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

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
                                            {language === 'ar' ? 'تفاصيل التسجيل' : 'Registration Details'}
                                        </h3>
                                        <p className="text-sm text-gray-600">{language === 'ar' ? 'معلومات شاملة عن المتسجل' : 'Complete registration information'}</p>
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
                                    <label className="block text-sm font-medium text-gray-700">
                                        {language === 'ar' ? 'الاسم' : 'Name'}
                                    </label>
                                    <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                                        {selectedRegistration.name}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                                    </label>
                                    <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                                        {selectedRegistration.email}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        {language === 'ar' ? 'الهاتف' : 'Phone'}
                                    </label>
                                    <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                                        {selectedRegistration.phone}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        {language === 'ar' ? 'النوع' : 'Type'}
                                    </label>
                                    <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                                        <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                                            selectedRegistration.type === 'Hackathon' ? 'bg-gradient-to-r from-pink-100 to-orange-100 text-pink-800 border border-pink-300' :
                                            selectedRegistration.type === 'Workshop' ? 'bg-gradient-to-r from-teal-100 to-navy-100 text-teal-800 border border-teal-300' :
                                            'bg-gradient-to-r from-orange-100 to-pink-100 text-orange-800 border border-orange-300'
                                        }`}>
                                            {selectedRegistration.type}
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        {language === 'ar' ? 'المهارات' : 'Skills'}
                                    </label>
                                    <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                                        {selectedRegistration.skills && selectedRegistration.skills.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {selectedRegistration.skills.map((skill, index) => (
                                                    <span key={index} className="px-2 py-1 bg-gradient-to-r from-teal-100 to-navy-100 text-teal-800 text-xs font-medium rounded-full border border-teal-300">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-gray-400">
                                                {language === 'ar' ? 'لا توجد مهارات' : 'No skills'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        {language === 'ar' ? 'تاريخ التسجيل' : 'Registration Date'}
                                    </label>
                                    <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                                        {new Date(selectedRegistration.date).toLocaleDateString('en-US')}
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

export default AdminRegistrations;