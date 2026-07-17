import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaRotateRight } from 'react-icons/fa6';
import { useAuth } from '../contexts/AuthContext';
import { getUnauthenticatedAuthUrl } from '../config/auth';

const BASE_URL = import.meta.env.VITE_API_URL;

interface CallbackUser {
    id: string;
    name: string;
    email: string;
    role: string;
    phone: string | null;
    permissions?: string[];
}

interface RefreshResponse {
    access_token: string;
    token_type: string;
    user: CallbackUser;
}

const CALLBACK_ERRORS: Record<string, string> = {
    access_denied: 'คุณยกเลิกการเข้าสู่ระบบด้วย Google',
    oauth_failed: 'Google ไม่สามารถยืนยันตัวตนให้ FORO ได้ในขณะนี้',
    email_unverified: 'บัญชี Google นี้ยังไม่ได้ยืนยันอีเมล',
    account_disabled: 'บัญชี FORO นี้ถูกระงับการใช้งาน',
};

const getProviderErrorMessage = (errorCode: string | null) => {
    if (!errorCode) return null;
    return CALLBACK_ERRORS[errorCode] || 'การเข้าสู่ระบบด้วย Google ไม่สำเร็จ';
};

const AuthCallback = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { login } = useAuth();
    const [sessionError, setSessionError] = useState<string | null>(null);

    const errorCode = new URLSearchParams(location.search).get('error');
    const errorMessage = getProviderErrorMessage(errorCode) || sessionError;

    useEffect(() => {
        if (errorCode) return;

        const controller = new AbortController();

        const completeLogin = async () => {
            try {
                const response = await axios.post<RefreshResponse>(
                    `${BASE_URL}/auth/refresh`,
                    {},
                    {
                        withCredentials: true,
                        signal: controller.signal,
                    }
                );

                if (!response.data.access_token || !response.data.user) {
                    throw new Error('Invalid refresh response');
                }

                login(response.data.access_token, response.data.user);
                navigate('/today-news', { replace: true });
            } catch (error) {
                if (axios.isCancel(error)) return;
                setSessionError('สร้างเซสชัน FORO ไม่สำเร็จ กรุณาลองเข้าสู่ระบบอีกครั้ง');
            }
        };

        completeLogin();

        return () => controller.abort();
    }, [errorCode, login, navigate]);

    const retryLogin = () => {
        window.location.assign(getUnauthenticatedAuthUrl());
    };

    return (
        <main className="min-h-screen bg-[#030e17] text-white flex items-center justify-center px-6 py-12">
            <div className="absolute inset-0 bg-linear-to-br from-[#051626] via-[#030e17] to-black" />

            <section className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-[#0f172a]/80 p-8 text-center shadow-2xl backdrop-blur-xl">
                <img
                    src="/images/LOGO-FORO/logo_last.png"
                    alt="FORO"
                    className="mx-auto mb-8 h-12 w-auto object-contain"
                />

                {errorMessage ? (
                    <div aria-live="polite">
                        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-rose-500/10 text-2xl text-rose-400">
                            !
                        </div>
                        <h1 className="mb-3 text-2xl font-black">เข้าสู่ระบบไม่สำเร็จ</h1>
                        <p className="mb-8 text-sm leading-relaxed text-gray-400">{errorMessage}</p>

                        <div className="flex flex-col gap-3">
                            <button
                                type="button"
                                onClick={retryLogin}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-bold transition-colors hover:bg-blue-500"
                            >
                                <FaRotateRight className="text-sm" />
                                ลองเข้าสู่ระบบอีกครั้ง
                            </button>
                            <Link
                                to="/"
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-3 font-bold text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
                            >
                                <FaArrowLeft className="text-sm" />
                                กลับหน้าแรก
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div aria-live="polite" aria-busy="true">
                        <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-blue-500/20 border-t-blue-500" />
                        <h1 className="mb-3 text-2xl font-black">กำลังเข้าสู่ระบบ</h1>
                        <p className="text-sm leading-relaxed text-gray-400">
                            Google ยืนยันตัวตนสำเร็จแล้ว กำลังเปิด FORO ให้คุณ
                        </p>
                    </div>
                )}
            </section>
        </main>
    );
};

export default AuthCallback;

