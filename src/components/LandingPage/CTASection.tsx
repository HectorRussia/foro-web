import { motion } from 'framer-motion';
import { HiArrowRight } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';

const CTASection = () => {
    const navigate = useNavigate();

    return (
        <section className="py-20 px-6 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-600/5 blur-[100px] pointer-events-none" />

            <div className="max-w-3xl mx-auto text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col gap-5"
                >
                    <h2 className="text-4xl md:text-5xl font-black leading-tight tracking-tight">
                        ข้อมูลระดับโลก <br />
                        <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-blue-600">
                            เข้าถึงง่ายสำหรับทุกคน
                        </span>
                    </h2>

                    <p className="text-gray-400 text-base md:text-lg font-medium max-w-xl mx-auto leading-relaxed">
                        เข้าร่วม FORO วันนี้ แล้วให้ AI ช่วยสรุปข่าวจาก X ให้คุณอ่านเข้าใจง่าย <br className="hidden md:block" />
                        ประหยัดเวลา ไม่พลาดเรื่องสำคัญ
                    </p>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="mt-6"
                    >
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-black py-4 px-8 rounded-xl text-lg shadow-xl shadow-blue-500/30 flex items-center gap-2 mx-auto transition-all group"
                        >
                            เริ่มต้นใช้งานฟรี
                            <HiArrowRight className="text-xl group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default CTASection;
