import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        const initAuth = async () => {
            // Check if user was logged out (no token in localStorage)
            const storedToken = localStorage.getItem('token');
            if (!storedToken) {
                setUser(null);
                setToken(null);
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('/api/auth/me', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'Accept': 'application/json',
                    },
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser(data.data.user);
                    setToken('session');
                } else {
                    setUser(null);
                    setToken(null);
                    localStorage.removeItem('token');
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
                setUser(null);
                setToken(null);
                localStorage.removeItem('token');
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const register = async (name, email, password, password_confirmation) => {
        try {
            const requestData = {
                name,
                email,
                password,
                password_confirmation,
            };
            
            // Get CSRF token
            const csrfResponse = await fetch('/api/csrf-token', {
                credentials: 'include',
            });
            const csrfData = await csrfResponse.json();
            
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfData.csrf_token,
                },
                credentials: 'include',
                body: JSON.stringify(requestData),
            });
            
            const data = await response.json();

            if (!response.ok) {
                // Create error object with response data for validation errors
                const error = new Error(data.message || 'Registration failed');
                error.response = { data };
                throw error;
            }

            // Auto login after registration
            setToken('session');
            setUser(data.data.user);
            
            return data;
        } catch (error) {
            throw error;
        }
    };

    const login = async (email, password) => {
        try {
            // Get CSRF token
            const csrfResponse = await fetch('/api/csrf-token', {
                credentials: 'include',
            });
            const csrfData = await csrfResponse.json();
            
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfData.csrf_token,
                },
                credentials: 'include',
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            setToken('session');
            setUser(data.data.user);
            
            return data;
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                },
                credentials: 'include',
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear all auth state immediately
            setToken(null);
            setUser(null);
            localStorage.removeItem('token');
            
            // Clear any other stored data
            localStorage.removeItem('user');
            sessionStorage.clear();
        }
    };

    const isAdmin = () => {
        return user && user.role === 'admin';
    };

    const isScanner = () => {
        return user && user.role === 'scanner';
    };

    const isAuthenticated = () => {
        return !!user && (!!token || token === 'session');
    };

    const value = {
        user,
        token,
        loading,
        register,
        login,
        logout,
        isAdmin,
        isScanner,
        isAuthenticated,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
