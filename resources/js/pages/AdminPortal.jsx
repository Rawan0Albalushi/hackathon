import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdminStats from './admin/AdminStats';
import AdminRegistrations from './admin/AdminRegistrations';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminPortal = () => {
    const { user, logout, isAdmin } = useAuth();
    const [activeTab, setActiveTab] = useState('stats');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setLoading(false);
        }
    }, [user]);

    const handleLogout = async () => {
        await logout();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!isAdmin()) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
                    <p className="text-gray-600">You don't have admin privileges.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">لوحة الإدارة</h1>
                            <p className="text-gray-600">مرحباً، {user?.name}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-500">Admin</span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                تسجيل الخروج
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Navigation */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex space-x-8">
                        <button
                            onClick={() => setActiveTab('stats')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'stats'
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            الإحصائيات
                        </button>
                        <button
                            onClick={() => setActiveTab('registrations')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'registrations'
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            التسجيلات
                        </button>
                    </div>
                </div>
            </nav>

            {/* Content */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {activeTab === 'stats' && <AdminStats />}
                {activeTab === 'registrations' && <AdminRegistrations />}
            </main>
        </div>
    );
};

export default AdminPortal;
