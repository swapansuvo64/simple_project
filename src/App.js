// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Log from './components/Log';
import Sign from './components/Sign';
import Home from './components/Home';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css'; // Optional CSS

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Log />} />
                <Route path="/signup" element={<Sign />} />
                <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                <Route path="/" element={<Log />} /> {/* Redirect to login by default */}
            </Routes>
        </Router>
    );
};

export default App;
