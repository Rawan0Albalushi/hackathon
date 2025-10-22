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
import AdminDashboardMain from './pages/admin/AdminDashboardMain.jsx';

// Import components
import Layout from './components/Layout.jsx';
import LanguageProvider from './contexts/LanguageContext.jsx';

const App = () => {
    return (
        <LanguageProvider>
            <Router>
                <Layout>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/hackathon" element={<HackathonRegistration />} />
                        <Route path="/workshop" element={<WorkshopRegistration />} />
                        <Route path="/conference" element={<ConferenceRegistration />} />
                        <Route path="/success" element={<Success />} />
                        <Route path="/admin" element={<AdminDashboardMain />} />
                    </Routes>
                </Layout>
            </Router>
        </LanguageProvider>
    );
};

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App />);