import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
interface User {
    email: string,
    name: string,
    id: string,
    role: string,
    phone: string
}
interface AuthContextType {
    accessToken: string | null;
    user: User | null;
    login: (token: string, userData: any) => void;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}
const BASE_URL = import.meta.env.VITE_API_URL;
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate();
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // (Rehydration)
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        const savedUser = localStorage.getItem('userData');

        if (token && savedUser) {
            setAccessToken(token);
            setUser(JSON.parse(savedUser));
        }
        setIsLoading(false);
    }, []);

    const login = (token: string, userData: User) => {
        setAccessToken(token);
        setUser(userData);
        localStorage.setItem('accessToken', token);
        localStorage.setItem('userData', JSON.stringify(userData));
    };

    const logout = async () => {
        try {
            // บอก Backend ให้เตะเราออก (ลบ Refresh Token ใน DB)
            // ต้องใส่ { withCredentials: true } เพื่อให้มันส่ง Cookie ไปด้วย
            await axios.post(`${BASE_URL}/auth/logout`, {}, {
                withCredentials: true
            });
        } catch (err) {
            console.error("Logout error on server:", err);
        } finally {
            //ล้างข้อมูลใน Global State ไม่ว่าจะยิง API สำเร็จหรือไม่
            setAccessToken(null);
            setUser(null);
            localStorage.removeItem('accessToken');
            navigate('/');
        }
    };

    return (
        <AuthContext.Provider value={{
            accessToken,
            user,
            login,
            logout,
            isAuthenticated: !!accessToken,
            isLoading
        }}>
            {!isLoading && children}
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
