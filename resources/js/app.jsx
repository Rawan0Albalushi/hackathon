import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './bootstrap';

// Import pages
import Home from './pages/Home.jsx';
import HackathonRegistration from './pages/HackathonRegistration.jsx';
import WorkshopRegistration from './pages/WorkshopRegistration.jsx';
import ConferenceRegistration from './pages/ConferenceRegistration.jsx';
import Success from './pages/Success.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import AdminDashboardMain from './pages/admin/AdminDashboardMain.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import AdminPortal from './pages/AdminPortal.jsx';

// Import components
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import LanguageProvider from './contexts/LanguageContext.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';

const App = () => {
    return (
        <AuthProvider>
            <LanguageProvider>
                <Router>
                    <Routes>
                        {/* Public routes */}
                        <Route path="/" element={
                            <Layout>
                                <Home />
                            </Layout>
                        } />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        
                        {/* Protected routes with layout */}
                        <Route path="/hackathon" element={
                            <ProtectedRoute>
                                <Layout>
                                    <HackathonRegistration />
                                </Layout>
                            </ProtectedRoute>
                        } />
                        <Route path="/workshop" element={
                            <ProtectedRoute>
                                <Layout>
                                    <WorkshopRegistration />
                                </Layout>
                            </ProtectedRoute>
                        } />
                        <Route path="/conference" element={
                            <ProtectedRoute>
                                <Layout>
                                    <ConferenceRegistration />
                                </Layout>
                            </ProtectedRoute>
                        } />
                        <Route path="/success" element={
                            <ProtectedRoute>
                                <Layout>
                                    <Success />
                                </Layout>
                            </ProtectedRoute>
                        } />
                        <Route path="/dashboard" element={
                            <ProtectedRoute>
                                <Layout>
                                    <UserDashboard />
                                </Layout>
                            </ProtectedRoute>
                        } />
                        
                        {/* Admin routes */}
                        <Route path="/admin" element={
                            <ProtectedRoute requireAdmin={true}>
                                <AdminDashboardMain />
                            </ProtectedRoute>
                        } />
                        <Route path="/admin-portal" element={
                            <ProtectedRoute requireAdmin={true}>
                                <AdminPortal />
                            </ProtectedRoute>
                        } />
                    </Routes>
                </Router>
            </LanguageProvider>
        </AuthProvider>
    );
};

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App />);