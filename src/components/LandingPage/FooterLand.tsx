import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FooterLand = () => {
    const [showTerms, setShowTerms] = useState(false);
    const [modalMode, setModalMode] = useState<'terms' | 'privacy'>('terms');
    const [lang, setLang] = useState<'th' | 'en'>('th');

    // Lock body scroll when modal is open
    useEffect(() => {
        if (showTerms) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showTerms]);

    const t = {
        th: {
            lastUpdated: "อัปเดตล่าสุด: 2/15/2026",
            understand: "รับทราบและเข้าใจ"
        },
        en: {
            lastUpdated: "Last Updated: 2/15/2026",
            understand: "I Understand"
        }
    };

    return (
        <>
            <footer className="py-12 px-6 border-t border-white/5 bg-[#030e17]/80 backdrop-blur-md relative z-10">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8">
                    <div className="flex items-center gap-3">
                        {/* <img src="/images/LOGO-FORO/FORO_TP_W.png" alt="logo" className="w-10 h-10" /> */}
                        {/*  <span className="text-xl font-black tracking-tighter text-white">FORO</span> */}
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                        <span>© 2026 FORO. All rights reserved.</span>
                        <button
                            onClick={() => { setModalMode('privacy'); setShowTerms(true); }}
                            className="hover:text-blue-400 transition-colors uppercase outline-none cursor-pointer"
                        >
                            Privacy Policy
                        </button>
                        <button
                            onClick={() => { setModalMode('terms'); setShowTerms(true); }}
                            className="hover:text-blue-400 transition-colors uppercase outline-none cursor-pointer"
                        >
                            Terms of Service
                        </button>
                        <a href="mailto:foroforwork@gmail.com" className="hover:text-blue-400 transition-colors uppercase">Contact</a>
                    </div>
                </div>
            </footer>

            {/* Terms and Policy Modal (Fixed Positioning) */}
            <AnimatePresence>
                {showTerms && (
                    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 md:p-6 overflow-hidden">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowTerms(false)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                        />

                        {/* Modal Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                            className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative z-10"
                        >
                            {/* Modal Header */}
                            <div className="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                                <div className="flex-1">
                                    <h3 className="text-xl md:text-2xl font-black text-gray-900 leading-tight">
                                        {modalMode === 'terms'
                                            ? (lang === 'th' ? 'ข้อกำหนดและเงื่อนไขการใช้งาน' : 'Terms of Service')
                                            : (lang === 'th' ? 'นโยบายความเป็นส่วนตัว' : 'Privacy Policy')
                                        }
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-wider">
                                            {t[lang].lastUpdated}
                                        </p>
                                        <span className="text-gray-300">|</span>
                                        <div className="flex bg-gray-200 rounded-lg p-0.5">
                                            <button
                                                onClick={() => setLang('th')}
                                                className={`px-2 py-0.5 text-[10px] font-black rounded-md transition-all ${lang === 'th' ? 'bg-white text-[#001f3f] shadow-sm' : 'text-gray-500'}`}
                                            >
                                                TH
                                            </button>
                                            <button
                                                onClick={() => setLang('en')}
                                                className={`px-2 py-0.5 text-[10px] font-black rounded-md transition-all ${lang === 'en' ? 'bg-white text-[#001f3f] shadow-sm' : 'text-gray-500'}`}
                                            >
                                                EN
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowTerms(false)}
                                    className="p-2 ml-4 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600 outline-none"
                                >
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6 md:p-10 overflow-y-auto flex-1 text-sm md:text-base custom-scrollbar">
                                {modalMode === 'terms' ? (
                                    lang === 'th' ? (
                                        <div className="space-y-6 text-gray-700 leading-relaxed font-medium">
                                            <section>
                                                <h4 className="text-lg font-bold text-gray-900 mb-2">1. บทนำ</h4>
                                                <p>ยินดีต้อนรับสู่ FORO ("FORO", "เรา", "แพลตฟอร์ม")</p>
                                                <p>FORO เป็นแพลตฟอร์มรวบรวม จัดหมวดหมู่ และสรุปข้อมูลที่เปิดเผยต่อสาธารณะจากโซเชียลมีเดีย รวมถึงแต่ไม่จำกัดเพียง X (เดิมชื่อ Twitter) โดยนำเสนอเนื้อหาในรูปแบบที่อ่านเข้าใจง่าย และเชื่อมโยงไปยังแหล่งข้อมูลต้นทาง</p>
                                                <p>การเข้าใช้งานเว็บไซต์ foro.world ถือว่าท่านได้อ่าน เข้าใจ และยอมรับข้อกำหนดและเงื่อนไขฉบับนี้โดยสมบูรณ์ หากท่านไม่เห็นด้วย โปรดงดใช้งานแพลตฟอร์ม</p>
                                            </section>

                                            <section>
                                                <h4 className="text-lg font-bold text-gray-900 mb-2">2. ลักษณะของบริการ</h4>
                                                <p>FORO ให้บริการดังต่อไปนี้:</p>
                                                <ul className="list-disc pl-5 space-y-1">
                                                    <li>รวบรวมและสรุปโพสต์ที่เปิดเผยต่อสาธารณะ</li>
                                                    <li>จัดหมวดหมู่ตามบัญชีหรือหัวข้อที่ผู้ใช้เลือก</li>
                                                    <li>แสดงฟีดข่าวหรือแดชบอร์ดรายวัน</li>
                                                    <li>เชื่อมโยงไปยังแหล่งข้อมูลต้นทาง</li>
                                                </ul>
                                                <p>FORO ไม่ได้เป็นเจ้าของเนื้อหาต้นฉบับ และไม่อ้างสิทธิ์เหนือเนื้อหาของบุคคลที่สาม เนื้อหาต้นฉบับทั้งหมดเป็นทรัพย์สินของเจ้าของสิทธิ์ตามกฎหมาย</p>
                                            </section>

                                            <section>
                                                <h4 className="text-lg font-bold text-gray-900 mb-2">3. วัตถุประสงค์ของข้อมูล</h4>
                                                <p>เนื้อหาที่ปรากฏบน FORO:</p>
                                                <ul className="list-disc pl-5 space-y-1">
                                                    <li>จัดทำขึ้นโดยระบบอัตโนมัติ และ/หรือเครื่องมือ AI</li>
                                                    <li>มีวัตถุประสงค์เพื่อให้ข้อมูลเท่านั้น</li>
                                                    <li>อาจไม่สะท้อนบริบทหรือรายละเอียดทั้งหมดของแหล่งต้นทาง</li>
                                                </ul>
                                                <p>ผู้ใช้ควรตรวจสอบข้อมูลจากแหล่งต้นทางก่อนตัดสินใจใดๆ</p>
                                            </section>

                                            <section>
                                                <h4 className="text-lg font-bold text-gray-900 mb-2">4. ไม่ใช่คำแนะนำทางการเงินและการลงทุน</h4>
                                                <p>เนื้อหาบางส่วนอาจเกี่ยวข้องกับสินทรัพย์ดิจิทัล คริปโทเคอร์เรนซี ตลาดทุน หรือการลงทุน ข้อมูลทั้งหมดจัดทำขึ้นเพื่อวัตถุประสงค์ในการให้ข้อมูลเท่านั้น และไม่ถือเป็นคำแนะนำด้านการลงทุน กฎหมาย หรือการเงิน</p>
                                                <p>ผู้ใช้ต้องใช้ดุลยพินิจของตนเอง และรับผิดชอบต่อการตัดสินใจทุกประการ</p>
                                            </section>

                                            <section>
                                                <h4 className="text-lg font-bold text-gray-900 mb-2">5. ทรัพย์สินทางปัญญา</h4>
                                                <p>เครื่องหมายการค้า โลโก้ และเนื้อหาของบุคคลที่สามเป็นทรัพย์สินของเจ้าของสิทธิ์นั้นๆ</p>
                                                <p>FORO แสดงข้อมูลที่เปิดเผยต่อสาธารณะ ให้เครดิตและลิงก์ต้นทางเมื่อมี และไม่อ้างสิทธิ์ความเป็นเจ้าของในเนื้อหาบุคคลที่สาม</p>
                                                <p>หากท่านเป็นเจ้าของเนื้อหาและเห็นว่ามีการใช้งานที่ไม่เหมาะสม โปรดติดต่อ อีเมล: foroforwork@gmail.com</p>
                                            </section>

                                            <section>
                                                <h4 className="text-lg font-bold text-gray-900 mb-2">6. การใช้งานที่เหมาะสม</h4>
                                                <p>ผู้ใช้ตกลงว่าจะไม่:</p>
                                                <ul className="list-disc pl-5 space-y-1">
                                                    <li>ใช้งานแพลตฟอร์มในทางที่ผิดกฎหมาย</li>
                                                    <li>พยายามเข้าถึงระบบโดยไม่ได้ขออนุญาต</li>
                                                    <li>ดึงข้อมูลระบบ (scrape) หรือใช้ระบบอัตโนมัติที่ก่อให้เกิดภาระต่อระบบ</li>
                                                    <li>กระทำการใดๆ ที่อาจทำให้แพลตฟอร์มเสียหาย</li>
                                                </ul>
                                                <p>FORO ขอสงวนสิทธิ์ในการระงับหรือยุติการเข้าถึงของผู้ใช้ที่ฝ่าฝืนเงื่อนไข</p>
                                            </section>

                                            <section>
                                                <h4 className="text-lg font-bold text-gray-900 mb-2">7. ความพร้อมให้บริการ</h4>
                                                <p>แม้เราจะพยายามให้บริการอย่างต่อเนื่อง แต่เราไม่รับประกันว่าบริการจะปราศจากการหยุดชะงัก ฟีเจอร์อาจมีการปรับปรุง เปลี่ยนแปลง หรือยกเลิกได้โดยไม่ต้องแจ้งล่วงหน้า และการให้บริการอาจได้รับผลกระทบจากแพลตฟอร์มภายนอกหรือ API</p>
                                            </section>

                                            <section>
                                                <h4 className="text-lg font-bold text-gray-900 mb-2">8. การจำกัดความรับผิด</h4>
                                                <p>ภายใต้ขอบเขตที่กฎหมายอนุญาต FORO จะไม่รับผิดชอบต่อความเสียหายทางอ้อม การสูญเสียข้อมูล ความเสียหายทางการเงินหรือธุรกิจ หรือข้อผิดพลาดและความคลาดเคลื่อนของข้อมูลสรุป การใช้งานแพลตฟอร์มถือเป็นความเสี่ยงของผู้ใช้เอง</p>
                                            </section>

                                            <section>
                                                <h4 className="text-lg font-bold text-gray-900 mb-2">9. การแก้ไขข้อกำหนด</h4>
                                                <p>FORO อาจปรับปรุงข้อกำหนดและเงื่อนไขนี้ได้ทุกเมื่อ การใช้งานแพลตฟอร์มต่อหลังการแก้ไข ถือว่าท่านยอมรับข้อกำหนดฉบับใหม่</p>
                                            </section>

                                            <section>
                                                <h4 className="text-lg font-bold text-gray-900 mb-2">10. กฎหมายที่ใช้บังคับ</h4>
                                                <p>ข้อกำหนดฉบับนี้อยู่ภายใต้กฎหมายของประเทศไทย</p>
                                            </section>

                                            <section>
                                                <h4 className="text-lg font-bold text-gray-900 mb-2">11. ติดต่อเรา</h4>
                                                <p>เว็บไซต์: <a href="https://foro.world" target="_blank" className="text-blue-600 hover:underline">https://foro.world</a></p>
                                                <p>อีเมล: foroforwork@gmail.com</p>
                                            </section>
                                        </div>
                                    ) : (
                                        <div className="space-y-6 text-gray-700 leading-relaxed font-medium">
                                            <section>
                                                <h4 className="text-lg font-bold text-gray-900 mb-2">1. Introduction</h4>
                                                <p>Welcome to FORO ("FORO", "we", "our", or "the Platform").</p>
                                                <p>FORO is a content aggregation and summarization platform that collects and presents publicly available information from social media platforms, including but not limited to X (formerly Twitter). Content is organized, categorized, and summarized for easier consumption.</p>
                                                <p>By accessing or using foro.world, you agree to be legally bound by these Terms of Service. If you do not agree, please discontinue use of the Platform.</p>
                                            </section>

                                            <section>
                                                <h4 className="text-lg font-bold text-gray-900 mb-2">2. Description of Service</h4>
                                                <p>FORO provides:</p>
                                                <ul className="list-disc pl-5 space-y-1">
                                                    <li>Aggregated summaries of publicly available social media posts</li>
                                                    <li>Categorized dashboards based on selected accounts</li>
                                                    <li>Curated daily feed updates</li>
                                                    <li>Links directing users to original sources</li>
                                                </ul>
                                                <p>FORO does not claim ownership of third-party content or represent itself as the original source. All original content remains the property of its respective creators.</p>
                                            </section>

                                            <section>
                                                <h4 className="text-lg font-bold text-gray-900 mb-2">3. Informational Purpose Only</h4>
                                                <p>Content displayed on FORO:</p>
                                                <ul className="list-disc pl-5 space-y-1">
                                                    <li>Is generated through automated systems and/or AI tools</li>
                                                    <li>Is provided for informational purposes only</li>
                                                    <li>May not reflect the full context of the original source</li>
                                                </ul>
                                                <p>Users are strongly encouraged to verify information through the original source before making decisions.</p>
                                            </section>

                                            <section>
                                                <h4 className="text-lg font-bold text-gray-900 mb-2">4. No Financial or Investment Advice</h4>
                                                <p>FORO may display content related to cryptocurrency, digital assets, financial markets, or investment-related topics. All such information is for informational purposes only and does not constitute financial, legal, or investment advice.</p>
                                                <p>Users assume full responsibility for any decisions made based on content accessed through the Platform.</p>
                                            </section>

                                            <section>
                                                <h4 className="text-lg font-bold text-gray-900 mb-2">5. Intellectual Property</h4>
                                                <p>All trademarks, logos, and third-party content remain the property of their respective owners. FORO displays publicly available content with attribution where applicable and does not claim ownership over third-party materials.</p>
                                                <p>If you believe your content has been used improperly, please contact: foroforwork@gmail.com</p>
                                            </section>

                                            <section>
                                                <h4 className="text-lg font-bold text-gray-900 mb-2">6. Acceptable Use</h4>
                                                <p>Users agree not to:</p>
                                                <ul className="list-disc pl-5 space-y-1">
                                                    <li>Use the platform for any illegal purposes</li>
                                                    <li>Attempt to access the system without authorization</li>
                                                    <li>Scrape data or use automated systems that impose a burden on the system</li>
                                                    <li>Perform any actions that may damage the platform</li>
                                                </ul>
                                                <p>FORO reserves the right to suspend or terminate access for users who violate these terms.</p>
                                            </section>

                                            <section>
                                                <h4 className="text-lg font-bold text-gray-900 mb-2">7. Service Availability</h4>
                                                <p>While we strive to provide continuous service, we do not guarantee that the service will be uninterrupted. Features may be updated, changed, or discontinued without prior notice.</p>
                                            </section>

                                            <section>
                                                <h4 className="text-lg font-bold text-gray-900 mb-2">8. Limitation of Liability</h4>
                                                <p>To the extent permitted by law, FORO shall not be liable for any indirect damages, loss of data, financial loss, or errors in summarized content. Use of the platform is at the user's own risk.</p>
                                            </section>

                                            <section>
                                                <h4 className="text-lg font-bold text-gray-900 mb-2">9. Amendments</h4>
                                                <p>FORO may update these Terms of Service at any time. Continued use of the platform after changes constitutes acceptance of the new terms.</p>
                                            </section>

                                            <section>
                                                <h4 className="text-lg font-bold text-gray-900 mb-2">10. Governing Law</h4>
                                                <p>These terms are governed by the laws of Thailand.</p>
                                            </section>

                                            <section>
                                                <h4 className="text-lg font-bold text-gray-900 mb-2">11. Contact Us</h4>
                                                <p>Website: <a href="https://foro.world" target="_blank" className="text-blue-600 hover:underline">https://foro.world</a></p>
                                                <p>Email: foroforwork@gmail.com</p>
                                            </section>
                                        </div>
                                    )
                                ) : (
                                    lang === 'th' ? (
                                        <div className="space-y-6 text-gray-700 leading-relaxed font-medium">
                                            <section>
                                                <h4 className="text-lg font-bold text-gray-900 mb-2">1. บทนำ</h4>
                                                <p>FORO ให้ความสำคัญกับความเป็นส่วนตัวของผู้ใช้งาน และมุ่งมั่นในการปกป้องข้อมูลส่วนบุคคลของท่าน นโยบายฉบับนี้อธิบายวิธีการเก็บ ใช้ เปิดเผย และปกป้องข้อมูลของผู้ใช้</p>
                                            </section>

                                            <section>
                                                <h4 className="text-lg font-bold text-gray-900 mb-2">2. ข้อมูลที่เราเก็บรวบรวม</h4>
                                                <p>เราอาจเก็บข้อมูลดังต่อไปนี้:</p>
                                                <ul className="list-disc pl-5 space-y-1">
                                                    <li>อีเมล (กรณีสมัครสมาชิก)</li>
                                                    <li>ข้อมูลบัญชีผู้ใช้</li>
                                                    <li>IP Address</li>
                                                    <li>ข้อมูลอุปกรณ์และเบราว์เซอร์</li>
                                                    <li>บันทึกการใช้งานระบบ (Log Data)</li>
                                                    <li>ข้อมูลจาก Cookies และเครื่องมือวิเคราะห์</li>
                                                </ul>
                                                <p>เราไม่เก็บรหัสผ่านในรูปแบบข้อความปกติ (plain text)</p>
                                            </section>

                                            <section>
                                                <h4 className="text-lg font-bold text-gray-900 mb-2">3. วัตถุประสงค์ในการใช้ข้อมูล</h4>
                                                <p>ข้อมูลที่เก็บรวบรวมอาจถูกใช้เพื่อ:</p>
                                                <ul className="list-disc pl-5 space-y-1">
                                                    <li>ให้บริการและดูแลแพลตฟอร์ม</li>
                                                    <li>ปรับปรุงประสบการณ์การใช้งาน</li>
                                                    <li>วิเคราะห์แนวโน้มการใช้งาน</li>
                                                    <li>ป้องกันการทุจริตหรือการใช้งานที่ผิดกฎหมาย</li>
                                                    <li>ปฏิบัติตามข้อกำหนดทางกฎหมาย</li>
                                                </ul>
                                            </section>

                                            <section>
                                                <h4 className="text-lg font-bold text-gray-900 mb-2">4. Cookies และเทคโนโลยีติดตาม</h4>
                                                <p>เว็บไซต์อาจใช้ Cookies เพื่อจดจำการเข้าสู่ระบบ บันทึกการตั้งค่าผู้ใช้ และวิเคราะห์ประสิทธิภาพของเว็บไซต์ ผู้ใช้สามารถตั้งค่าเบราว์เซอร์เพื่อปฏิเสธ Cookies ได้ แต่อาจส่งผลต่อการใช้งานบางฟีเจอร์</p>
                                            </section>

                                            <section>
                                                <h4 className="text-lg font-bold text-gray-900 mb-2">5. การเปิดเผยข้อมูล</h4>
                                                <p>FORO จะไม่ขายข้อมูลส่วนบุคคลของผู้ใช้ เราอาจเปิดเผยข้อมูลเมื่อกฎหมายกำหนด จำเป็นเพื่อปกป้องสิทธิ์หรือความปลอดภัยของแพลตฟอร์ม หรือทำงานร่วมกับผู้ให้บริการภายนอกภายใต้ข้อตกลงรักษาความลับ</p>
                                            </section>

                                            <section>
                                                <h4 className="text-lg font-bold text-gray-900 mb-2">6. ระยะเวลาการเก็บรักษาข้อมูล</h4>
                                                <p>เราจะเก็บข้อมูลส่วนบุคคลเท่าที่จำเป็นต่อวัตถุประสงค์ในการให้บริการ หรือเท่าที่กฎหมายกำหนด ผู้ใช้สามารถร้องขอให้ลบข้อมูลได้ตามสิทธิที่กฎหมายกำหนด</p>
                                            </section>

                                            <section>
                                                <h4 className="text-lg font-bold text-gray-900 mb-2">7. สิทธิของเจ้าของข้อมูล</h4>
                                                <p>ภายใต้กฎหมายที่เกี่ยวข้อง เช่น PDPA ผู้ใช้มีสิทธิในการเข้าถึง แก้ไข ลบข้อมูล หรือถอนความยินยอม สามารถติดต่อได้ที่ อีเมล: foroforwork@gmail.com</p>
                                            </section>

                                            <section>
                                                <h4 className="text-lg font-bold text-gray-900 mb-2">8. ความปลอดภัยของข้อมูล</h4>
                                                <p>เราใช้มาตรการทางเทคนิคและการจัดการที่เหมาะสมเพื่อปกป้องข้อมูล อย่างไรก็ตาม ไม่มีระบบใดที่ปลอดภัยอย่างสมบูรณ์</p>
                                            </section>

                                            <section>
                                                <h4 className="text-lg font-bold text-gray-900 mb-2">9. การปรับปรุงนโยบาย</h4>
                                                <p>FORO อาจปรับปรุงนโยบายความเป็นส่วนตัวนี้เป็นครั้งคราว การใช้งานต่อหลังการปรับปรุง ถือว่าท่านยอมรับนโยบายฉบับใหม่</p>
                                            </section>

                                            <section>
                                                <h4 className="text-lg font-bold text-gray-900 mb-2">10. ติดต่อเรา</h4>
                                                <p>เว็บไซต์: <a href="https://foro.world" target="_blank" className="text-blue-600 hover:underline">https://foro.world</a></p>
                                                <p>อีเมล: foroforwork@gmail.com</p>
                                            </section>
                                        </div>
                                    ) : (
                                        <div className="space-y-6 text-gray-700 leading-relaxed font-medium">
                                            <section>
                                                <h4 className="text-lg font-bold text-gray-900 mb-2">1. Introduction</h4>
                                                <p>FORO respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use foro.world.</p>
                                            </section>

                                            <section>
                                                <h4 className="text-lg font-bold text-gray-900 mb-2">2. Information We Collect</h4>
                                                <p>Depending on usage, we may collect:</p>
                                                <ul className="list-disc pl-5 space-y-1">
                                                    <li>Email address (if you register)</li>
                                                    <li>Account-related information</li>
                                                    <li>IP address</li>
                                                    <li>Device and browser information</li>
                                                    <li>Usage logs</li>
                                                    <li>Cookies and analytics data</li>
                                                </ul>
                                                <p>We do not store passwords in plain text.</p>
                                            </section>

                                            <section>
                                                <h4 className="text-lg font-bold text-gray-900 mb-2">3. How We Use Information</h4>
                                                <p>We use collected data to:</p>
                                                <ul className="list-disc pl-5 space-y-1">
                                                    <li>Provide and maintain the Platform</li>
                                                    <li>Improve user experience</li>
                                                    <li>Analyze usage trends</li>
                                                    <li>Prevent fraud or misuse</li>
                                                    <li>Comply with legal obligations</li>
                                                </ul>
                                            </section>

                                            <section>
                                                <h4 className="text-lg font-bold text-gray-900 mb-2">4. Cookies and Tracking Technologies</h4>
                                                <p>FORO may use cookies and similar technologies to maintain login sessions, store user preferences, and analyze website performance. Users may disable cookies through browser settings; however, some features may not function properly.</p>
                                            </section>

                                            <section>
                                                <h4 className="text-lg font-bold text-gray-900 mb-2">5. Data Sharing</h4>
                                                <p>We do not sell personal data. We may share information only when: Required by law, necessary to protect legal rights, or working with service providers (e.g., hosting, analytics) under confidentiality obligations.</p>
                                            </section>

                                            <section>
                                                <h4 className="text-lg font-bold text-gray-900 mb-2">6. Data Retention</h4>
                                                <p>We retain personal data only as long as necessary for operational or legal purposes. Users may request account deletion where applicable.</p>
                                            </section>

                                            <section>
                                                <h4 className="text-lg font-bold text-gray-900 mb-2">7. User Rights</h4>
                                                <p>Subject to applicable laws (e.g., PDPA, GDPR), users may have the right to access their personal data, request correction, request deletion, or withdraw consent. To exercise these rights, contact: foroforwork@gmail.com</p>
                                            </section>

                                            <section>
                                                <h4 className="text-lg font-bold text-gray-900 mb-2">8. Data Security</h4>
                                                <p>We implement reasonable technical and organizational measures to protect personal data. However, no system can guarantee absolute security.</p>
                                            </section>

                                            <section>
                                                <h4 className="text-lg font-bold text-gray-900 mb-2">9. Changes to This Policy</h4>
                                                <p>We may update this Privacy Policy from time to time. Continued use of the Platform after updates constitutes acceptance of the revised policy.</p>
                                            </section>

                                            <section>
                                                <h4 className="text-lg font-bold text-gray-900 mb-2">10. Contact</h4>
                                                <p>Website: <a href="https://foro.world" target="_blank" className="text-blue-600 hover:underline">https://foro.world</a></p>
                                                <p>Email: foroforwork@gmail.com</p>
                                            </section>
                                        </div>
                                    )
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="p-6 md:p-8 border-t border-gray-100 bg-gray-50/50 flex justify-end">
                                <button
                                    onClick={() => setShowTerms(false)}
                                    className="px-12 py-4 bg-[#030e17] text-white rounded-2xl font-black hover:bg-black transition-all shadow-xl active:scale-95 text-sm md:text-base"
                                >
                                    {t[lang].understand}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default FooterLand;
