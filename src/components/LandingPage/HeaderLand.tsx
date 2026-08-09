import { Link } from 'react-router-dom';
import { FaSignInAlt, FaArrowRight } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderLandProps {
    onOpenLogin: () => void;
}

const HeaderLand = ({ onOpenLogin }: HeaderLandProps) => {
    const { isAuthenticated } = useAuth();

    return (
        <>
            {/* ── Header ── */}
            <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-5 flex justify-between items-center backdrop-blur-md bg-[#030e17]/50 border-b border-white/5">
                <div className="flex items-center gap-2.5">
                    <img src="/images/LOGO-FORO/logo_last.png" alt="FORO Logo" className="h-10 w-auto object-contain" />
                </div>
                {isAuthenticated ? (
                    <Link to="/dashboard" className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-500/20 active:scale-95">
                        <FaArrowRight className="text-xs" />
                        <span>ไปที่แดชบอร์ด</span>
                    </Link>
                ) : (
                    <button type="button" onClick={onOpenLogin} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-500/20 active:scale-95">
                        <FaSignInAlt className="text-xs" />
                        <span>เข้าสู่ระบบ</span>
                    </button>
                )}
            </nav>
        </>
    )
}

export default HeaderLand
