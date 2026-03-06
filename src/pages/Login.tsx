import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getLoginSchema, type LoginFormValues, getForgotPasswordSchema, type ForgotPasswordInput } from '../schemas/auth';
import { toast } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { loginT } from '../constants/Translations';

const BASE_URL = import.meta.env.VITE_API_URL;

const Login = () => {
    const [lang, setLang] = useState<'th' | 'en'>('th');
    const [rememberMe, setRememberMe] = useState(false);
    const [showForgot, setShowForgot] = useState(false);
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, setValue } = useForm<LoginFormValues>({
        resolver: zodResolver(getLoginSchema(lang))
    });

    const {
        register: registerForgot,
        handleSubmit: handleSubmitForgot,
        formState: { errors: errorsForgot, isSubmitting: isSubmittingForgot },
        reset: resetForgot
    } = useForm<ForgotPasswordInput>({
        resolver: zodResolver(getForgotPasswordSchema(lang))
    });

    const { login } = useAuth();

    // Load saved email on component mount
    useEffect(() => {
        const savedEmail = localStorage.getItem('rememberedEmail');
        if (savedEmail) {
            setValue('email', savedEmail);
            setRememberMe(true);
        }
    }, [setValue]);

    const onSubmit = async (values: LoginFormValues) => {
        try {
            // Handle remember me
            if (rememberMe) {
                localStorage.setItem('rememberedEmail', values.email);
            } else {
                localStorage.removeItem('rememberedEmail');
            }

            const formData = new URLSearchParams();
            formData.append('username', values.email); // OAuth2
            formData.append('password', values.password);
            const res = await axios.post(
                `${BASE_URL}/auth/login`,
                formData,
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    }
                }
            );

            localStorage.setItem('accessToken', res.data.access_token);
            // keep Token to Context
            login(res.data.access_token, {
                email: values.email,
                name: res.data.user.name,
                id: res.data.user.id,
                role: res.data.user.role,
                phone: res.data.user.phone
            });
            navigate('/today-news');
        } catch (err: any) {
            toast.error(err.response?.data?.detail || loginT[lang].loginError);
        }
    };

    const onForgotSubmit = async (data: ForgotPasswordInput) => {
        try {
            await axios.post(`${BASE_URL}/auth/forgot-password`, {
                email: data.email,
                phone: data.phone,
                new_password: data.new_password
            });
            toast.success(loginT[lang].resetSuccess);
            setShowForgot(false);
            resetForgot();
        } catch (error: any) {
            toast.error(error.response?.data?.detail || loginT[lang].resetError);
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#030e17] flex items-center justify-center p-4 relative overflow-hidden font-sans">
            <div className="absolute inset-0 bg-linear-to-br from-[#051626] to-[#000000] z-0" />

            {/* Language Switcher */}
            <div className="absolute top-6 right-6 z-50 flex bg-white/10 backdrop-blur-md rounded-xl p-1 border border-white/20 shadow-xl">
                <button
                    onClick={() => setLang('th')}
                    className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all duration-300 ${lang === 'th' ? 'bg-white text-[#001f3f] shadow-lg scale-105' : 'text-gray-400 hover:text-white'}`}
                >
                    TH
                </button>
                <button
                    onClick={() => setLang('en')}
                    className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all duration-300 ${lang === 'en' ? 'bg-white text-[#001f3f] shadow-lg scale-105' : 'text-gray-400 hover:text-white'}`}
                >
                    EN
                </button>
            </div>

            <div className="container max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
                {/* Left Side */}
                <div className="text-white w-full md:w-1/2 space-y-6 text-center md:text-left">
                    <h1 className="text-[64px] md:text-[5rem] font-bold leading-tight tracking-tight text-[#4688d2]">
                        {loginT[lang].title}
                    </h1>
                    <h1 className="text-5xl md:text-5xl font-bold leading-tight tracking-tight">
                        {loginT[lang].subtitle} <br />
                        <span className="text-white">{loginT[lang].subtitle2}</span>
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl font-light">
                        {loginT[lang].desc}
                    </p>
                </div>

                {/* Right Side - Login Form */}
                <div className="w-full md:w-[480px] bg-white rounded-2xl shadow-2xl p-8 md:p-10">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">{loginT[lang].loginHeader}</h2>
                            <p className="text-gray-500 text-sm">{loginT[lang].loginSub}</p>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">{loginT[lang].email}</label>
                            <input
                                {...register("email")}
                                type="email"
                                id="email"
                                placeholder="your@email.com"
                                className={`w-full px-4 py-3 rounded-lg bg-[#333333] border-transparent focus:border-gray-500 focus:bg-[#333333] focus:ring-0 text-white placeholder-gray-400 transition duration-200 outline-none ${errors.email ? "border-red-500 ring-1 ring-red-500" : ""}`}
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">{loginT[lang].password}</label>
                            </div>
                            <input
                                {...register("password")}
                                type="password"
                                id="password"
                                placeholder="••••••••"
                                className={`w-full px-4 py-3 rounded-lg bg-[#333333] border-transparent focus:border-gray-500 focus:bg-[#333333] focus:ring-0 text-white placeholder-gray-400 transition duration-200 outline-none ${errors.password ? "border-red-500 ring-1 ring-red-500" : ""}`}
                            />
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                        </div>

                        {/* Remember Me Checkbox */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="rememberMe"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 text-[#001f3f] bg-gray-100 border-gray-300 rounded focus:ring-[#001f3f] focus:ring-2 cursor-pointer"
                            />
                            <label htmlFor="rememberMe" className="ml-2 text-sm font-medium text-gray-700 cursor-pointer">
                                {loginT[lang].rememberMe}
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#001f3f] cursor-pointer hover:bg-[#003366] text-white font-medium py-3 rounded-lg transition duration-200 shadow-md"
                        >
                            {loginT[lang].loginBtn}
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-400 font-medium">{loginT[lang].or}</span>
                        </div>
                    </div>
                    <div className="flex justify-center items-center mb-5">
                        <button
                            type="button"
                            onClick={() => setShowForgot(true)}
                            className="text-sm font-medium text-[#001f3f] hover:underline cursor-pointer"
                        >
                            {loginT[lang].forgotPwd}
                        </button>
                    </div>
                    <button
                        type="button"
                        className="w-full bg-black cursor-pointer hover:bg-gray-800 text-white font-medium py-3 rounded-lg transition duration-200 flex items-center justify-center gap-3"
                        onClick={() => navigate('/register')}
                    >
                        <span>{loginT[lang].registerBtn}</span>
                    </button>
                </div>
            </div>

            {/* Forgot Password Modal */}
            {showForgot && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-md flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <h3 className="text-2xl font-bold text-gray-900">{loginT[lang].resetPwd}</h3>
                            <button
                                onClick={() => { setShowForgot(false); resetForgot(); }}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600 cursor-pointer"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmitForgot(onForgotSubmit)} className="p-6 space-y-4">
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">{loginT[lang].email}</label>
                                <input
                                    {...registerForgot("email")}
                                    type="email"
                                    placeholder="your@email.com"
                                    className={`w-full px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:border-[#001f3f] focus:ring-1 focus:ring-[#001f3f] transition duration-200 outline-none ${errorsForgot.email ? "border-red-500" : ""}`}
                                />
                                {errorsForgot.email && <p className="text-red-500 text-xs">{errorsForgot.email.message}</p>}
                            </div>

                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">{loginT[lang].phone}</label>
                                <input
                                    {...registerForgot("phone")}
                                    type="tel"
                                    placeholder="08xxxxxxxx"
                                    className={`w-full px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:border-[#001f3f] focus:ring-1 focus:ring-[#001f3f] transition duration-200 outline-none ${errorsForgot.phone ? "border-red-500" : ""}`}
                                />
                                {errorsForgot.phone && <p className="text-red-500 text-xs">{errorsForgot.phone.message}</p>}
                            </div>

                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">{loginT[lang].newPwd}</label>
                                <input
                                    {...registerForgot("new_password")}
                                    type="password"
                                    placeholder="••••••••"
                                    className={`w-full px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:border-[#001f3f] focus:ring-1 focus:ring-[#001f3f] transition duration-200 outline-none ${errorsForgot.new_password ? "border-red-500" : ""}`}
                                />
                                {errorsForgot.new_password && <p className="text-red-500 text-xs">{errorsForgot.new_password.message}</p>}
                            </div>

                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">{loginT[lang].confirmPwd}</label>
                                <input
                                    {...registerForgot("confirm_new_password")}
                                    type="password"
                                    placeholder="••••••••"
                                    className={`w-full px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:border-[#001f3f] focus:ring-1 focus:ring-[#001f3f] transition duration-200 outline-none ${errorsForgot.confirm_new_password ? "border-red-500" : ""}`}
                                />
                                {errorsForgot.confirm_new_password && <p className="text-red-500 text-xs">{errorsForgot.confirm_new_password.message}</p>}
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmittingForgot}
                                    className="w-full bg-[#001f3f] hover:bg-[#003366] text-white font-semibold py-3 rounded-xl transition duration-200 shadow-lg disabled:opacity-50 cursor-pointer"
                                >
                                    {isSubmittingForgot ? loginT[lang].loading : loginT[lang].confirmBtn}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};


export default Login;
