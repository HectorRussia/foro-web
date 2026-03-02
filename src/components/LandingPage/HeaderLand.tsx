import { Link } from 'react-router-dom';
import { FaSignInAlt } from 'react-icons/fa';
const HeaderLand = () => {
    return (
        <>
            {/* ── Header ── */}
            <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-5 flex justify-between items-center backdrop-blur-md bg-[#030e17]/50 border-b border-white/5">
                <div className="flex items-center gap-2.5">
                    <img src="/images/LOGO-FORO/FORO_TP_W.png" alt="logo" className="w-10 h-10" />
                    <span className="text-2xl font-black tracking-tighter uppercase">Foro</span>
                </div>
                <Link to="/login" className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-500/20 active:scale-95">
                    <FaSignInAlt className="text-xs" />
                    <span>เข้าสู่ระบบ</span>
                </Link>
            </nav>
        </>
    )
}

export default HeaderLand