import { useNavigate } from 'react-router-dom';
const Login = () => {
    const navigate = useNavigate()
    return (
        <div className="min-h-screen w-full bg-[#030e17] flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Background decoration (optional subtle gradient) */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#051626] to-[#000000] z-0" />

            <div className="container max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">

                {/* Left Side - Text Content */}
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
                <div className="w-full md:w-[480px] bg-white rounded-2xl shadow-2xl p-8 md:p-10">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">เข้าสู่ระบบ</h2>
                        <p className="text-gray-500 text-sm">เข้าสู่ระบบเพื่อเริ่มใช้งาน Foro-x-social</p>
                    </div>

                    <form className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                อีเมล
                            </label>
                            <input
                                type="email"
                                id="email"
                                placeholder="your@email.com"
                                className="w-full px-4 py-3 rounded-lg bg-[#333333] border-transparent focus:border-gray-500 focus:bg-[#333333] focus:ring-0 text-white placeholder-gray-400 transition duration-200 outline-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                รหัสผ่าน
                            </label>
                            <input
                                type="password"
                                id="password"
                                placeholder="••••••••"
                                className="w-full px-4 py-3 rounded-lg bg-[#333333] border-transparent focus:border-gray-500 focus:bg-[#333333] focus:ring-0 text-white placeholder-gray-400 transition duration-200 outline-none"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#001f3f] hover:bg-[#003366] text-white font-medium py-3 rounded-lg transition duration-200 shadow-md"
                        >
                            เข้าสู่ระบบ
                        </button>
                    </form>

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
                        className="w-full bg-black hover:bg-gray-800 text-white font-medium py-3 rounded-lg transition duration-200 flex items-center justify-center gap-3"
                        onClick={() => navigate('/register')}
                    >

                        <span>ลงทะเบียน</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;