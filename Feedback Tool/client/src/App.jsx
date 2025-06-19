import React from 'react';
import { Routes, Route } from 'react-router-dom';
import FeedbackForm from './pages/FeedbackForm';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin'; // ✅ Required import

const App = () => (
  <Routes>
    <Route path="/" element={<FeedbackForm />} />
    <Route path="/admin" element={<AdminDashboard />} />
    <Route path="/login" element={<AdminLogin />} />
  </Routes>
);

export default App;
