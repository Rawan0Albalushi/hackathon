import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminUsers = () => {
    const { language } = useLanguage();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [showBulkActions, setShowBulkActions] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [error, setError] = useState(null);

    const itemsPerPage = 10;

    useEffect(() => {
        fetchUsers();
    }, [currentPage, searchTerm, roleFilter, statusFilter]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const params = new URLSearchParams({
                page: currentPage,
                per_page: itemsPerPage,
                search: searchTerm,
                role: roleFilter,
                status: statusFilter
            });

            const response = await fetch(`/api/admin/users?${params}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Users data:', data); // Debug log
                if (data.success && data.data) {
                    setUsers(data.data.data || []);
                    setTotalPages(data.data.last_page || 1);
                } else {
                    console.error('API returned error:', data);
                    setError(data.message || 'Failed to load users');
                    setUsers([]);
                }
            } else {
                console.error('Failed to fetch users, status:', response.status);
                setError(`HTTP ${response.status}: Failed to load users`);
                setUsers([]);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Network error: Failed to load users');
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleRoleFilter = (e) => {
        setRoleFilter(e.target.value);
        setCurrentPage(1);
    };

    const handleStatusFilter = (e) => {
        setStatusFilter(e.target.value);
        setCurrentPage(1);
    };

    const handleSelectUser = (userId) => {
        setSelectedUsers(prev => 
            prev.includes(userId) 
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const handleSelectAll = () => {
        if (selectedUsers.length === users.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(users.map(user => user.id));
        }
    };

    const handleBulkAction = async (action) => {
        if (selectedUsers.length === 0) return;

        try {
            const response = await fetch('/api/admin/users/bulk-action', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                credentials: 'include',
                body: JSON.stringify({
                    user_ids: selectedUsers,
                    action: action
                })
            });

            if (response.ok) {
                setSelectedUsers([]);
                setShowBulkActions(false);
                fetchUsers();
            }
        } catch (error) {
            console.error('Error performing bulk action:', error);
        }
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        setShowEditModal(true);
    };

    const handleUpdateUser = async (userData) => {
        try {
            const response = await fetch(`/api/admin/users/${editingUser.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                credentials: 'include',
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                setShowEditModal(false);
                setEditingUser(null);
                fetchUsers();
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا المستخدم؟' : 'Are you sure you want to delete this user?')) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                credentials: 'include'
            });

            if (response.ok) {
                fetchUsers();
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'admin':
                return 'bg-red-100 text-red-800';
            case 'user':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'inactive':
                return 'bg-yellow-100 text-yellow-800';
            case 'banned':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    // Debug: Show current state
    console.log('AdminUsers render - users:', users, 'loading:', loading, 'error:', error);

    // Show error message
    if (error) {
        return (
            <div className="space-y-6">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                    <div className="flex items-center">
                        <svg className="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <div>
                            <h3 className="text-lg font-medium text-red-800">
                                {language === 'ar' ? 'خطأ في تحميل البيانات' : 'Error Loading Data'}
                            </h3>
                            <p className="text-red-600 mt-1">{error}</p>
                            <button
                                onClick={fetchUsers}
                                className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                            >
                                {language === 'ar' ? 'إعادة المحاولة' : 'Retry'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                            {language === 'ar' ? 'إدارة المستخدمين' : 'User Management'}
                        </h2>
                        <p className="text-gray-600 mt-1">
                            {language === 'ar' ? 'إدارة المستخدمين والأدوار' : 'Manage users and their roles'}
                        </p>
                    </div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
                            {users.length} {language === 'ar' ? 'مستخدم' : 'Users'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Search */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {language === 'ar' ? 'البحث' : 'Search'}
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={handleSearch}
                                placeholder={language === 'ar' ? 'البحث بالاسم أو البريد الإلكتروني...' : 'Search by name or email...'}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Role Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {language === 'ar' ? 'الدور' : 'Role'}
                        </label>
                        <select
                            value={roleFilter}
                            onChange={handleRoleFilter}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                            <option value="all">{language === 'ar' ? 'جميع الأدوار' : 'All Roles'}</option>
                            <option value="admin">{language === 'ar' ? 'مدير' : 'Admin'}</option>
                            <option value="user">{language === 'ar' ? 'مستخدم' : 'User'}</option>
                        </select>
                    </div>

                    {/* Status Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {language === 'ar' ? 'الحالة' : 'Status'}
                        </label>
                        <select
                            value={statusFilter}
                            onChange={handleStatusFilter}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                            <option value="all">{language === 'ar' ? 'جميع الحالات' : 'All Status'}</option>
                            <option value="active">{language === 'ar' ? 'نشط' : 'Active'}</option>
                            <option value="inactive">{language === 'ar' ? 'غير نشط' : 'Inactive'}</option>
                            <option value="banned">{language === 'ar' ? 'محظور' : 'Banned'}</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Bulk Actions */}
            {selectedUsers.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <span className="text-sm font-medium text-blue-800">
                                {selectedUsers.length} {language === 'ar' ? 'مستخدم محدد' : 'users selected'}
                            </span>
                        </div>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <button
                                onClick={() => handleBulkAction('activate')}
                                className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
                            >
                                {language === 'ar' ? 'تفعيل' : 'Activate'}
                            </button>
                            <button
                                onClick={() => handleBulkAction('deactivate')}
                                className="px-3 py-1 bg-yellow-500 text-white text-sm rounded-lg hover:bg-yellow-600 transition-colors"
                            >
                                {language === 'ar' ? 'إلغاء التفعيل' : 'Deactivate'}
                            </button>
                            <button
                                onClick={() => handleBulkAction('ban')}
                                className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
                            >
                                {language === 'ar' ? 'حظر' : 'Ban'}
                            </button>
                            <button
                                onClick={() => setSelectedUsers([])}
                                className="px-3 py-1 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600 transition-colors"
                            >
                                {language === 'ar' ? 'إلغاء' : 'Cancel'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-full">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                            <tr>
                                <th className="px-4 py-4 text-center w-12">
                                    <input
                                        type="checkbox"
                                        checked={selectedUsers.length === users.length && users.length > 0}
                                        onChange={handleSelectAll}
                                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                    />
                                </th>
                                <th className={`px-6 py-4 text-sm font-semibold text-gray-700 ${language === 'ar' ? 'text-right' : 'text-left'} min-w-[200px]`}>
                                    {language === 'ar' ? 'المستخدم' : 'User'}
                                </th>
                                <th className={`px-6 py-4 text-sm font-semibold text-gray-700 ${language === 'ar' ? 'text-right' : 'text-left'} min-w-[250px]`}>
                                    {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                                </th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 min-w-[120px]">
                                    {language === 'ar' ? 'الدور' : 'Role'}
                                </th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 min-w-[120px]">
                                    {language === 'ar' ? 'الحالة' : 'Status'}
                                </th>
                                <th className={`px-6 py-4 text-sm font-semibold text-gray-700 ${language === 'ar' ? 'text-right' : 'text-left'} min-w-[150px]`}>
                                    {language === 'ar' ? 'تاريخ الإنشاء' : 'Created'}
                                </th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 min-w-[120px]">
                                    {language === 'ar' ? 'الإجراءات' : 'Actions'}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center">
                                            <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                            </svg>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                {language === 'ar' ? 'لا توجد مستخدمين' : 'No users found'}
                                            </h3>
                                            <p className="text-gray-500">
                                                {language === 'ar' ? 'لم يتم العثور على أي مستخدمين' : 'No users were found matching your criteria'}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100">
                                    <td className="px-4 py-4 text-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedUsers.includes(user.id)}
                                            onChange={() => handleSelectUser(user.id)}
                                            className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                        />
                                    </td>
                                    <td className={`px-6 py-4 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                                        <div className={`${language === 'ar' ? 'text-right' : 'text-left'}`}>
                                            <div className={`text-sm font-semibold text-gray-900 ${language === 'ar' ? 'text-right' : 'text-left'}`}>{user.name}</div>
                                            <div className={`text-xs text-gray-500 ${language === 'ar' ? 'text-right' : 'text-left'}`}>ID: {user.id}</div>
                                        </div>
                                    </td>
                                    <td className={`px-6 py-4 text-sm text-gray-900 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                                        <div className={`truncate max-w-[200px] ${language === 'ar' ? 'text-right' : 'text-left'}`} title={user.email} dir="ltr">
                                            {user.email}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                                            {language === 'ar' ? (user.role === 'admin' ? 'مدير' : 'مستخدم') : user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(user.status)}`}>
                                            {language === 'ar' ? 
                                                (user.status === 'active' ? 'نشط' : 
                                                 user.status === 'inactive' ? 'غير نشط' : 'محظور') : 
                                                user.status
                                            }
                                        </span>
                                    </td>
                                    <td className={`px-6 py-4 text-sm text-gray-600 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                                        <div className={`${language === 'ar' ? 'text-right' : 'text-left'}`} dir="ltr">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className={`px-6 py-4 ${language === 'ar' ? 'text-right' : 'text-center'}`}>
                                        <div className={`flex items-center space-x-3 rtl:space-x-reverse ${language === 'ar' ? 'justify-end' : 'justify-center'}`}>
                                            <button
                                                onClick={() => handleEditUser(user)}
                                                className="p-2 text-orange-600 hover:text-orange-900 hover:bg-orange-50 rounded-lg transition-all duration-200"
                                                title={language === 'ar' ? 'تعديل' : 'Edit'}
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-all duration-200"
                                                title={language === 'ar' ? 'حذف' : 'Delete'}
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
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
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {language === 'ar' ? 'السابق' : 'Previous'}
                            </button>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {language === 'ar' ? 'التالي' : 'Next'}
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    {language === 'ar' ? 'عرض' : 'Showing'} <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span> {language === 'ar' ? 'إلى' : 'to'} <span className="font-medium">{Math.min(currentPage * itemsPerPage, users.length)}</span> {language === 'ar' ? 'من' : 'of'} <span className="font-medium">{users.length}</span> {language === 'ar' ? 'نتائج' : 'results'}
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span className="sr-only">{language === 'ar' ? 'السابق' : 'Previous'}</span>
                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                page === currentPage
                                                    ? 'z-10 bg-orange-50 border-orange-500 text-orange-600'
                                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span className="sr-only">{language === 'ar' ? 'التالي' : 'Next'}</span>
                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Edit User Modal */}
            {showEditModal && editingUser && (
                <EditUserModal
                    user={editingUser}
                    onClose={() => {
                        setShowEditModal(false);
                        setEditingUser(null);
                    }}
                    onSave={handleUpdateUser}
                    language={language}
                />
            )}
        </div>
    );
};

// Edit User Modal Component
const EditUserModal = ({ user, onClose, onSave, language }) => {
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                            {language === 'ar' ? 'تعديل المستخدم' : 'Edit User'}
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {language === 'ar' ? 'الاسم' : 'Name'}
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {language === 'ar' ? 'الدور' : 'Role'}
                            </label>
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            >
                                <option value="user">{language === 'ar' ? 'مستخدم' : 'User'}</option>
                                <option value="admin">{language === 'ar' ? 'مدير' : 'Admin'}</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {language === 'ar' ? 'الحالة' : 'Status'}
                            </label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            >
                                <option value="active">{language === 'ar' ? 'نشط' : 'Active'}</option>
                                <option value="inactive">{language === 'ar' ? 'غير نشط' : 'Inactive'}</option>
                                <option value="banned">{language === 'ar' ? 'محظور' : 'Banned'}</option>
                            </select>
                        </div>

                        <div className="flex items-center justify-end space-x-3 rtl:space-x-reverse pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                {language === 'ar' ? 'إلغاء' : 'Cancel'}
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all duration-300"
                            >
                                {language === 'ar' ? 'حفظ' : 'Save'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;
