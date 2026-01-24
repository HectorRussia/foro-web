import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from '../schemas/auth';

const BASE_URL = import.meta.env.VITE_API_URL;

const Login = () => {

    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema)
    });
    const { login } = useAuth();

    const onSubmit = async (values: LoginFormValues) => {
        try {

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
            // keep Token to Context
            login(res.data.access_token, {
                email: values.email,
                name: res.data.user.name,
                id: res.data.user.id,
                role: res.data.user.role,
                phone: res.data.user.phone
            });
            navigate('/dashboard');
        } catch (err: any) {
            alert(err.response?.data?.detail || "อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#030e17] flex items-center justify-center p-4 relative overflow-hidden font-sans">
            <div className="absolute inset-0 bg-gradient-to-br from-[#051626] to-[#000000] z-0" />

            <div className="container max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
                {/* Left Side */}
                <div className="text-white w-full md:w-1/2 space-y-6 text-center md:text-left">
                    <h1 className="text-5xl md:text-5xl font-bold leading-tight tracking-tight">
                        สรุปโพสต์จาก X <br />
                        <span className="text-white">แบบอ่านง่าย</span>
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl font-light">
                        ติดตามและรับสรุปเนื้อหาจากบัญชี X ที่คุณสนใจ
                    </p>
                </div>

                {/* Right Side - Login Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="w-full md:w-[480px] bg-white rounded-2xl shadow-2xl p-8 md:p-10 space-y-6">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">เข้าสู่ระบบ</h2>
                        <p className="text-gray-500 text-sm">เข้าสู่ระบบเพื่อเริ่มใช้งาน Foro-x-social</p>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">อีเมล</label>
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
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">รหัสผ่าน</label>
                        <input
                            {...register("password")}
                            type="password"
                            id="password"
                            placeholder="••••••••"
                            className={`w-full px-4 py-3 rounded-lg bg-[#333333] border-transparent focus:border-gray-500 focus:bg-[#333333] focus:ring-0 text-white placeholder-gray-400 transition duration-200 outline-none ${errors.password ? "border-red-500 ring-1 ring-red-500" : ""}`}
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#001f3f] cursor-pointer hover:bg-[#003366] text-white font-medium py-3 rounded-lg transition duration-200 shadow-md"
                    >
                        เข้าสู่ระบบ
                    </button>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-400">หรือ</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="w-full bg-black cursor-pointer hover:bg-gray-800 text-white font-medium py-3 rounded-lg transition duration-200 flex items-center justify-center gap-3"
                        onClick={() => navigate('/register')}
                    >
                        <span>ลงทะเบียน</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;