import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Branches from './pages/Branches';
import Forecast from './pages/Forecast';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
                    <Navbar />
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/inventory"
                            element={
                                <ProtectedRoute>
                                    <Inventory />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/branches"
                            element={
                                <ProtectedRoute>
                                    <Branches />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/forecast"
                            element={
                                <ProtectedRoute>
                                    <Forecast />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
};

export default App;
