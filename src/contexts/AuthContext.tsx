import React, { createContext, useContext, useState } from 'react';


interface AuthContextType {
    accessToken: string | null;
    user: any | null; // พี่สามารถเปลี่ยนเป็น Interface User ที่เราทำไว้ได้
    login: (token: string, userData: any) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [user, setUser] = useState<any | null>(null);

    const login = (token: string, userData: any) => {
        setAccessToken(token);
        setUser(userData);
    };

    const logout = () => {
        setAccessToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            accessToken,
            user,
            login,
            logout,
            isAuthenticated: !!accessToken
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};