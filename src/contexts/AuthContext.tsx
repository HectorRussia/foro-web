import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
interface User {
    email: string,
    username: string,
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();
    const login = (token: string, userData: User) => {
        setAccessToken(token);
        setUser(userData);
    };

    const logout = async () => {
        try {
            // บอก Backend ให้เตะเราออก (ลบ Refresh Token ใน DB)
            // ต้องใส่ { withCredentials: true } เพื่อให้มันส่ง Cookie ไปด้วย
            await axios.post("http://localhost:8080/api/v1/auth/logout", {}, {
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