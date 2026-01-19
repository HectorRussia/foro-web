const Register = () => {
    return (
        <div className="min-h-screen w-full bg-[#030e17] flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#051626] to-[#000000] z-0" />

            <div className="container max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-12 relative z-10">

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

                    <form className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">ชื่อ</label>
                                <input
                                    type="text"
                                    id="firstname"
                                    defaultValue="สมชาย"
                                    className="w-full px-4 py-2.5 rounded-lg bg-[#333333] border-transparent focus:border-gray-500 focus:bg-[#333333] focus:ring-0 text-white placeholder-gray-400 transition duration-200 outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">นามสกุล</label>
                                <input
                                    type="text"
                                    id="lastname"
                                    defaultValue="ใจดี"
                                    className="w-full px-4 py-2.5 rounded-lg bg-[#333333] border-transparent focus:border-gray-500 focus:bg-[#333333] focus:ring-0 text-white placeholder-gray-400 transition duration-200 outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">อีเมล</label>
                            <input
                                type="email"
                                id="email"
                                defaultValue="somchai.jai@example.com"
                                className="w-full px-4 py-2.5 rounded-lg bg-[#333333] border-transparent focus:border-gray-500 focus:bg-[#333333] focus:ring-0 text-white placeholder-gray-400 transition duration-200 outline-none"
                            />
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">เบอร์โทรศัพท์</label>
                            <input
                                type="tel"
                                id="phone"
                                defaultValue="081-234-5678"
                                className="w-full px-4 py-2.5 rounded-lg bg-[#333333] border-transparent focus:border-gray-500 focus:bg-[#333333] focus:ring-0 text-white placeholder-gray-400 transition duration-200 outline-none"
                            />
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">รหัสผ่าน</label>
                            <input
                                type="password"
                                id="password"
                                placeholder="••••••••"
                                className="w-full px-4 py-2.5 rounded-lg bg-[#333333] border-transparent focus:border-gray-500 focus:bg-[#333333] focus:ring-0 text-white placeholder-gray-400 transition duration-200 outline-none"
                            />
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">ยืนยันรหัสผ่าน</label>
                            <input
                                type="confirm-password"
                                id="confirm-password"
                                placeholder="••••••••"
                                className="w-full px-4 py-2.5 rounded-lg bg-[#333333] border-transparent focus:border-gray-500 focus:bg-[#333333] focus:ring-0 text-white placeholder-gray-400 transition duration-200 outline-none"
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                className="w-full bg-[#001f3f] hover:bg-[#003366] text-white font-medium py-3 rounded-lg transition duration-200 shadow-md"
                            >
                                ยืนยันการสมัคร
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