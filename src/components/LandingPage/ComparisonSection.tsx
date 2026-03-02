import { motion } from 'framer-motion';
import { FaXTwitter } from 'react-icons/fa6';
import { BsStars } from 'react-icons/bs';
import { newsData } from '../../constants/LandingPage';

const ComparisonSection = () => {

    return (
        <section className="py-24 px-6 relative">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-black mb-4 tracking-tight"
                    >
                        เห็นภาพรวมได้ภายในไม่กี่บรรทัด
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto"
                    >
                        AI ช่วยกรองเนื้อหาให้เหลือเฉพาะประเด็นสำคัญ <br className="hidden md:block" />
                        ไม่ต้องอ่านยาว ไม่ต้องแปลเอง
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">

                    {/* Left side: Original News from X */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-[#0f172a]/40 backdrop-blur-2xl border border-white/5 rounded-[40px] p-8 flex flex-col"
                    >
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-3">
                                <FaXTwitter className="text-xl text-gray-400" />
                                <h3 className="text-lg font-bold text-gray-200">News from X</h3>
                                <span className="bg-blue-500/10 text-blue-400 text-[10px] px-2 py-0.5 rounded font-black border border-blue-500/20">EN</span>
                            </div>
                            <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">3 sources</span>
                        </div>

                        <div className="space-y-8 flex-1">
                            {newsData.map((news) => (
                                <div key={news.id} className="flex gap-4">
                                    <div className={`w-10 h-10 shrink-0 ${news.color} rounded-full flex items-center justify-center text-sm font-black text-white shadow-lg`}>
                                        {news.icon}
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <span className="text-sm font-bold text-gray-200">{news.name}</span>
                                            <span className="text-[10px] text-gray-500 font-bold">{news.handle} · {news.time}</span>
                                        </div>
                                        <p className="text-sm text-gray-400 font-medium leading-relaxed">
                                            {news.engText}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right side: AI Summary TH */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-[#0f172a]/60 backdrop-blur-3xl border border-blue-500/10 rounded-[40px] p-8 flex flex-col relative overflow-hidden"
                    >
                        {/* Glow effect */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/5 blur-[80px]" />

                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">
                                    <BsStars className="text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-white">AI Summary</h3>
                                <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5 rounded font-black border border-emerald-500/20">TH</span>
                            </div>
                            <span className="bg-white/5 text-gray-400 text-[10px] px-3 py-1 rounded-full font-bold border border-white/5">
                                ~30 sec read
                            </span>
                        </div>

                        <div className="space-y-4 flex-1">
                            {newsData.map((news, idx) => (
                                <motion.div
                                    key={news.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 + idx * 0.1 }}
                                    className="bg-[#030e17]/50 border border-white/5 p-5 rounded-2xl flex items-center gap-4 group hover:border-blue-500/20 transition-all"
                                >
                                    <div className={`w-6 h-6 shrink-0 ${news.color} rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-lg`}>
                                        {idx + 1}
                                    </div>
                                    <p className="text-sm md:text-md text-gray-200 font-bold leading-tight group-hover:text-blue-400 transition-colors">
                                        {news.thaiText}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default ComparisonSection;
