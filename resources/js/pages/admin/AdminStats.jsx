import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const AdminStats = () => {
    const { language, t } = useLanguage();
    const [stats, setStats] = useState({
        totalRegistrations: 0,
        hackathonRegistrations: 0,
        workshopRegistrations: 0,
        conferenceRegistrations: 0,
        todayRegistrations: 0,
        weekRegistrations: 0,
        monthRegistrations: 0,
        totalPending: 0,
        totalApproved: 0,
        totalRejected: 0,
        weekGrowth: 0,
        dailyRegistrations: [],
        monthlyTrends: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeFilter, setTimeFilter] = useState('all');
    const [refreshInterval, setRefreshInterval] = useState(null);
    const [exporting, setExporting] = useState(false);
    const statsRef = useRef(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('/api/admin/stats', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'Accept': 'application/json',
                    },
                    credentials: 'include',
                });
                const data = await response.json();
                
                if (data.success) {
                    setStats(data.data);
                    setError(null);
                } else {
                    setError(data.message || 'Failed to fetch statistics');
                }
            } catch (err) {
                setError('Network error occurred');
                console.error('Error fetching stats:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
        
        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchStats, 30000);
        setRefreshInterval(interval);

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, []);

    // Manual refresh function
    const handleRefresh = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/admin/stats', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                },
                credentials: 'include',
            });
            const data = await response.json();
            
            if (data.success) {
                setStats(data.data);
                setError(null);
            } else {
                setError(data.message || 'Failed to fetch statistics');
            }
        } catch (err) {
            setError('Network error occurred');
            console.error('Error fetching stats:', err);
        } finally {
            setLoading(false);
        }
    };

    // Export functions
    const exportToPDF = async () => {
        setExporting(true);
        try {
            const element = statsRef.current;
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff'
            });
            
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210;
            const pageHeight = 295;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            
            let position = 0;
            
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
            
            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            
            const fileName = `statistics_${new Date().toISOString().split('T')[0]}.pdf`;
            pdf.save(fileName);
        } catch (error) {
            console.error('Error exporting to PDF:', error);
            alert(language === 'ar' ? 'حدث خطأ أثناء تصدير PDF' : 'Error exporting to PDF');
        } finally {
            setExporting(false);
        }
    };

    const exportToExcel = () => {
        try {
            // Prepare data for Excel
            const workbook = XLSX.utils.book_new();
            
            // Statistics summary sheet
            const summaryData = [
                [language === 'ar' ? 'المؤشر' : 'Metric', language === 'ar' ? 'القيمة' : 'Value'],
                [language === 'ar' ? 'إجمالي التسجيلات' : 'Total Registrations', stats.totalRegistrations],
                [language === 'ar' ? 'تسجيلات الهاكثون' : 'Hackathon Registrations', stats.hackathonRegistrations],
                [language === 'ar' ? 'تسجيلات ورش العمل' : 'Workshop Registrations', stats.workshopRegistrations],
                [language === 'ar' ? 'تسجيلات المؤتمر' : 'Conference Registrations', stats.conferenceRegistrations],
                [language === 'ar' ? 'تسجيلات اليوم' : 'Today Registrations', stats.todayRegistrations],
                [language === 'ar' ? 'تسجيلات هذا الأسبوع' : 'This Week Registrations', stats.weekRegistrations],
                [language === 'ar' ? 'تسجيلات هذا الشهر' : 'This Month Registrations', stats.monthRegistrations],
                [language === 'ar' ? 'في الانتظار' : 'Pending', stats.totalPending],
                [language === 'ar' ? 'مُوافق عليه' : 'Approved', stats.totalApproved],
                [language === 'ar' ? 'مرفوض' : 'Rejected', stats.totalRejected],
                [language === 'ar' ? 'نمو الأسبوع (%)' : 'Week Growth (%)', stats.weekGrowth]
            ];
            
            const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
            XLSX.utils.book_append_sheet(workbook, summarySheet, language === 'ar' ? 'ملخص الإحصائيات' : 'Statistics Summary');
            
            // Daily registrations sheet
            const dailyData = [
                [language === 'ar' ? 'التاريخ' : 'Date', language === 'ar' ? 'اليوم' : 'Day', language === 'ar' ? 'عدد التسجيلات' : 'Registrations Count']]
                .concat(stats.dailyRegistrations.map(item => [item.date, item.day, item.count]));
            
            const dailySheet = XLSX.utils.aoa_to_sheet(dailyData);
            XLSX.utils.book_append_sheet(workbook, dailySheet, language === 'ar' ? 'التسجيلات اليومية' : 'Daily Registrations');
            
            // Monthly trends sheet
            const trendsData = [
                [language === 'ar' ? 'التاريخ' : 'Date', language === 'ar' ? 'هاكثون' : 'Hackathon', language === 'ar' ? 'ورشة عمل' : 'Workshop', language === 'ar' ? 'مؤتمر' : 'Conference', language === 'ar' ? 'المجموع' : 'Total']]
                .concat(stats.monthlyTrends.map(item => [item.date, item.hackathon, item.workshop, item.conference, item.total]));
            
            const trendsSheet = XLSX.utils.aoa_to_sheet(trendsData);
            XLSX.utils.book_append_sheet(workbook, trendsSheet, language === 'ar' ? 'الاتجاهات الشهرية' : 'Monthly Trends');
            
            
            const fileName = `statistics_${new Date().toISOString().split('T')[0]}.xlsx`;
            XLSX.writeFile(workbook, fileName);
        } catch (error) {
            console.error('Error exporting to Excel:', error);
            alert(language === 'ar' ? 'حدث خطأ أثناء تصدير Excel' : 'Error exporting to Excel');
        }
    };

    // Chart data preparation
    const dailyChartData = {
        labels: stats.dailyRegistrations.map(item => item.day),
        datasets: [
            {
                label: language === 'ar' ? 'التسجيلات اليومية' : 'Daily Registrations',
                data: stats.dailyRegistrations.map(item => item.count),
                borderColor: 'rgb(99, 102, 241)',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                tension: 0.4,
                fill: true,
            },
        ],
    };

    const monthlyTrendsData = {
        labels: stats.monthlyTrends.slice(-7).map(item => new Date(item.date).toLocaleDateString()),
        datasets: [
            {
                label: language === 'ar' ? 'هاكثون' : 'Hackathon',
                data: stats.monthlyTrends.slice(-7).map(item => item.hackathon),
                borderColor: 'rgb(239, 68, 68)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                tension: 0.4,
            },
            {
                label: language === 'ar' ? 'ورشة عمل' : 'Workshop',
                data: stats.monthlyTrends.slice(-7).map(item => item.workshop),
                borderColor: 'rgb(34, 197, 94)',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                tension: 0.4,
            },
            {
                label: language === 'ar' ? 'مؤتمر' : 'Conference',
                data: stats.monthlyTrends.slice(-7).map(item => item.conference),
                borderColor: 'rgb(245, 158, 11)',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                tension: 0.4,
            },
        ],
    };

    const statusDistributionData = {
        labels: [
            language === 'ar' ? 'مُوافق عليه' : 'Approved',
            language === 'ar' ? 'في الانتظار' : 'Pending',
            language === 'ar' ? 'مرفوض' : 'Rejected'
        ],
        datasets: [
            {
                data: [stats.totalApproved, stats.totalPending, stats.totalRejected],
                backgroundColor: [
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                ],
                borderColor: [
                    'rgb(34, 197, 94)',
                    'rgb(245, 158, 11)',
                    'rgb(239, 68, 68)',
                ],
                borderWidth: 2,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: language === 'ar' ? 'اتجاهات التسجيل' : 'Registration Trends',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                },
            },
        },
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
            },
            title: {
                display: true,
                text: language === 'ar' ? 'توزيع الحالات' : 'Status Distribution',
            },
        },
    };

    if (loading) {
        return (
            <div className="p-6 h-full flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 h-full flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <p className="text-red-600 mb-4">{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        {language === 'ar' ? 'إعادة المحاولة' : 'Retry'}
                    </button>
                </div>
            </div>
        );
    }

    const statCards = [
        {
            title: language === 'ar' ? 'إجمالي التسجيلات' : 'Total Registrations',
            value: stats.totalRegistrations,
            icon: 'users',
            color: 'from-indigo-500 to-purple-500',
            trend: '+12%',
            trendUp: true
        },
        {
            title: language === 'ar' ? 'هاكثون' : 'Hackathon',
            value: stats.hackathonRegistrations,
            icon: 'code',
            color: 'from-red-500 to-pink-500',
            trend: '+8%',
            trendUp: true
        },
        {
            title: language === 'ar' ? 'ورشة عمل' : 'Workshop',
            value: stats.workshopRegistrations,
            icon: 'flask',
            color: 'from-green-500 to-teal-500',
            trend: '+15%',
            trendUp: true
        },
        {
            title: language === 'ar' ? 'مؤتمر' : 'Conference',
            value: stats.conferenceRegistrations,
            icon: 'presentation',
            color: 'from-orange-500 to-red-500',
            trend: '+5%',
            trendUp: true
        },
        {
            title: language === 'ar' ? 'اليوم' : 'Today',
            value: stats.todayRegistrations,
            icon: 'clock',
            color: 'from-yellow-500 to-orange-500',
            trend: '+3',
            trendUp: true
        },
        {
            title: language === 'ar' ? 'هذا الأسبوع' : 'This Week',
            value: stats.weekRegistrations,
            icon: 'calendar',
            color: 'from-blue-500 to-indigo-500',
            trend: stats.weekGrowth > 0 ? `+${stats.weekGrowth}%` : `${stats.weekGrowth}%`,
            trendUp: stats.weekGrowth > 0
        },
        {
            title: language === 'ar' ? 'هذا الشهر' : 'This Month',
            value: stats.monthRegistrations,
            icon: 'chart',
            color: 'from-purple-500 to-pink-500',
            trend: '+18%',
            trendUp: true
        },
        {
            title: language === 'ar' ? 'في الانتظار' : 'Pending',
            value: stats.totalPending,
            icon: 'pending',
            color: 'from-yellow-500 to-orange-500',
            trend: 'مراجعة',
            trendUp: false
        }
    ];

    const getIcon = (iconName) => {
        const icons = {
            users: (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
            code: (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
            ),
            flask: (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
            ),
            presentation: (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            ),
            clock: (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            calendar: (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
            chart: (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            pending: (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        };
        return icons[iconName] || icons.users;
    };

    return (
        <div ref={statsRef} className="p-6 h-full overflow-y-auto" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {/* Header Section */}
            <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                            {language === 'ar' ? 'الإحصائيات المتقدمة' : 'Advanced Statistics'}
                        </h1>
                        <p className="text-gray-600 mt-2 text-lg">
                            {language === 'ar' ? 'نظرة شاملة ومفصلة على جميع البيانات والإحصائيات' : 'Comprehensive and detailed overview of all data and statistics'}
                        </p>
                    </div>
                    
                    {/* Controls */}
                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            onClick={handleRefresh}
                            disabled={loading}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            {language === 'ar' ? 'تحديث' : 'Refresh'}
                        </button>
                        
                        <select
                            value={timeFilter}
                            onChange={(e) => setTimeFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="all">{language === 'ar' ? 'جميع الفترات' : 'All Time'}</option>
                            <option value="today">{language === 'ar' ? 'اليوم' : 'Today'}</option>
                            <option value="week">{language === 'ar' ? 'هذا الأسبوع' : 'This Week'}</option>
                            <option value="month">{language === 'ar' ? 'هذا الشهر' : 'This Month'}</option>
                        </select>

                        {/* Export Buttons */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={exportToPDF}
                                disabled={exporting}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                {language === 'ar' ? 'تصدير PDF' : 'Export PDF'}
                            </button>
                            
                            <button
                                onClick={exportToExcel}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                {language === 'ar' ? 'تصدير Excel' : 'Export Excel'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Statistics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((card, index) => (
                    <div 
                        key={index}
                        className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-gray-200/50 hover:shadow-2xl transition-all duration-500  hover:-translate-y-2 group"
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center shadow-lg group- transition-transform duration-300`}>
                                {getIcon(card.icon)}
                            </div>
                            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                card.trendUp ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                                {card.trendUp ? (
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                )}
                                {card.trend}
                            </div>
                        </div>
                        
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-2">
                                {card.title}
                            </p>
                            <p className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
                                {card.value.toLocaleString()}
                            </p>
                        </div>
                        
                        <div className="mt-4 h-1 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Daily Registrations Chart */}
                <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-gray-200/50">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                        {language === 'ar' ? 'التسجيلات اليومية (آخر 7 أيام)' : 'Daily Registrations (Last 7 Days)'}
                    </h3>
                    <div className="h-64">
                        <Line data={dailyChartData} options={chartOptions} />
                    </div>
                </div>

                {/* Status Distribution Chart */}
                <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-gray-200/50">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                        {language === 'ar' ? 'توزيع الحالات' : 'Status Distribution'}
                    </h3>
                    <div className="h-64">
                        <Doughnut data={statusDistributionData} options={doughnutOptions} />
                    </div>
                </div>
            </div>

            {/* Trends Chart */}
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-gray-200/50 mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    {language === 'ar' ? 'اتجاهات التسجيل حسب النوع (آخر 7 أيام)' : 'Registration Trends by Type (Last 7 Days)'}
                </h3>
                <div className="h-80">
                    <Line data={monthlyTrendsData} options={chartOptions} />
                </div>
            </div>

        </div>
    );
};

export default AdminStats;