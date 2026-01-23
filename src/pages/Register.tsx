import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { RegisterSchema, type RegisterInput } from "../schemas/auth";
import { useNavigate } from "react-router-dom";
const Register = () => {

    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterInput>({
        resolver: zodResolver(RegisterSchema),
    });

    const onSubmit = async (data: RegisterInput) => {
        try {
            const response = await axios.post("http://localhost:8080/api/v1/auth/register", {
                name: data.name,
                last_name: data.lastname,
                phone: data.phone,
                email: data.email,
                password: data.password,
            });
            alert("สมัครสมาชิกสำเร็จ!");
            console.log(response.data);
            navigate("/")
        } catch (error: any) {
            alert(error.response?.data?.detail || "เกิดข้อผิดพลาด");
        }
    };
    return (
        <div className="min-h-screen w-full bg-[#030e17] flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#051626] to-[#000000] z-0" />

            <div className="container max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">

                {/* Left Side - Text Content */}
                <div className="text-white w-full md:w-1/2 space-y-6 text-center md:text-left order-2 md:order-1">
                    <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">
                        สร้างบัญชีใหม่ <br />
                        <span className="text-blue-500">Foro-x-social</span>
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl font-light">
                        เข้าร่วมชุมชนแลกเปลี่ยนข้อมูลและติดตามสรุปเนื้อหาที่คุณสนใจ
                    </p>
                </div>

                {/* Right Side - Register Form */}
                <div className="w-full md:w-[520px] bg-white rounded-2xl shadow-2xl p-8 md:p-10 order-1 md:order-2">
                    <div className="text-center mb-6">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">สมัครสมาชิก</h2>
                        <p className="text-gray-500 text-sm">กรอกข้อมูลเพื่อเริ่มต้นใช้งาน</p>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">ชื่อ</label>
                                <input
                                    type="text"
                                    id="name"
                                    {...register("name")}
                                    className={`w-full px-4 py-2.5 rounded-lg bg-[#333333] border-transparent focus:border-gray-500 focus:bg-[#333333] focus:ring-0 text-white placeholder-gray-400 transition duration-200 outline-none ${errors.name ? "border-red-500 ring-1 ring-red-500" : ""}`}
                                    placeholder="John"
                                />
                                {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                            </div>
                            <div className="space-y-1">
                                <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">นามสกุล</label>
                                <input
                                    type="text"
                                    id="lastname"
                                    {...register("lastname")}
                                    className={`w-full px-4 py-2.5 rounded-lg bg-[#333333] border-transparent focus:border-gray-500 focus:bg-[#333333] focus:ring-0 text-white placeholder-gray-400 transition duration-200 outline-none ${errors.lastname ? "border-red-500 ring-1 ring-red-500" : ""}`}
                                    placeholder="Kind"
                                />
                                {errors.lastname && <p className="text-red-500 text-xs">{errors.lastname.message}</p>}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">อีเมล</label>
                            <input
                                type="email"
                                id="email"
                                {...register("email")}
                                className={`w-full px-4 py-2.5 rounded-lg bg-[#333333] border-transparent focus:border-gray-500 focus:bg-[#333333] focus:ring-0 text-white placeholder-gray-400 transition duration-200 outline-none ${errors.email ? "border-red-500 ring-1 ring-red-500" : ""}`}
                                placeholder="john.kind@example.com"
                            />
                            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">เบอร์โทรศัพท์</label>
                            <input
                                type="tel"
                                id="phone"
                                {...register("phone")}
                                className={`w-full px-4 py-2.5 rounded-lg bg-[#333333] border-transparent focus:border-gray-500 focus:bg-[#333333] focus:ring-0 text-white placeholder-gray-400 transition duration-200 outline-none ${errors.phone ? "border-red-500 ring-1 ring-red-500" : ""}`}
                                placeholder="0812345678"
                            />
                            {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">รหัสผ่าน</label>
                            <input
                                type="password"
                                id="password"
                                {...register("password")}
                                placeholder="••••••••"
                                className={`w-full px-4 py-2.5 rounded-lg bg-[#333333] border-transparent focus:border-gray-500 focus:bg-[#333333] focus:ring-0 text-white placeholder-gray-400 transition duration-200 outline-none ${errors.password ? "border-red-500 ring-1 ring-red-500" : ""}`}
                            />
                            {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">ยืนยันรหัสผ่าน</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                {...register("confirmPassword")}
                                placeholder="••••••••"
                                className={`w-full px-4 py-2.5 rounded-lg bg-[#333333] border-transparent focus:border-gray-500 focus:bg-[#333333] focus:ring-0 text-white placeholder-gray-400 transition duration-200 outline-none ${errors.confirmPassword ? "border-red-500 ring-1 ring-red-500" : ""}`}
                            />
                            {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>}
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-[#001f3f] hover:bg-[#003366] disabled:opacity-50 text-white font-medium py-3 rounded-lg transition duration-200 shadow-md"
                            >
                                {isSubmitting ? "กำลังสมัคร..." : "ยืนยันการสมัคร"}
                            </button>
                        </div>

                    </form>

                    <div className="mt-6 text-center text-sm text-gray-500">
                        มีบัญชีอยู่แล้ว?{' '}
                        <a href="/" className="font-medium text-[#001f3f] hover:underline">
                            เข้าสู่ระบบ
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;