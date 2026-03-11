import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated] = useState(true);
    const [isLoadingAuth] = useState(false);
    const [isLoadingPublicSettings] = useState(false);
    const [authError] = useState(null);
    const [appPublicSettings] = useState(null);

    const logout = () => {
        setUser(null);
    };

    const navigateToLogin = () => {
        // No external auth; could redirect to a local login page if you add one later
        window.location.href = '/';
    };

    const checkAppState = () => {
        // No-op; app runs without base44
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            isLoadingAuth,
            isLoadingPublicSettings,
            authError,
            appPublicSettings,
            logout,
            navigateToLogin,
            checkAppState
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
