import { useEffect, useRef } from 'react';
import { FaTimes } from 'react-icons/fa';
import { getUnauthenticatedAuthUrl } from '../../config/auth';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const GoogleIcon = () => (
    <svg viewBox="0 0 18 18" aria-hidden="true" className="h-5 w-5 shrink-0">
        <path fill="#4285F4" d="M17.64 9.205c0-.638-.057-1.252-.164-1.841H9v3.482h4.844a4.14 4.14 0 0 1-1.797 2.716v2.258h2.908c1.703-1.567 2.685-3.874 2.685-6.615Z" />
        <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.955-2.18l-2.908-2.258c-.805.54-1.836.859-3.047.859-2.344 0-4.328-1.584-5.037-3.711H.957v2.332A8.998 8.998 0 0 0 9 18Z" />
        <path fill="#FBBC04" d="M3.963 10.71A5.39 5.39 0 0 1 3.68 9c0-.594.103-1.171.283-1.711V4.958H.957A8.945 8.945 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.006-2.332Z" />
        <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.581-2.58C13.463.892 11.426 0 9 0A8.998 8.998 0 0 0 .957 4.958l3.006 2.331C4.672 5.164 6.656 3.58 9 3.58Z" />
    </svg>
);

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!isOpen) return;

        closeButtonRef.current?.focus();

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6"
            role="presentation"
        >
            <button
                type="button"
                aria-label="ปิดหน้าต่างเข้าสู่ระบบ"
                className="absolute inset-0 cursor-default bg-[#020914]/80 backdrop-blur-md"
                onClick={onClose}
            />

            <section
                aria-modal="true"
                aria-labelledby="login-modal-title"
                className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-white/10 bg-[#081724] p-6 shadow-[0_32px_100px_rgba(0,0,0,0.6)] sm:p-8"
                role="dialog"
            >
                <div className="pointer-events-none absolute -top-28 left-1/2 h-52 w-52 -translate-x-1/2 rounded-full bg-blue-500/25 blur-[80px]" />
                <div className="pointer-events-none absolute -bottom-32 -right-24 h-52 w-52 rounded-full bg-purple-500/15 blur-[80px]" />

                <button
                    ref={closeButtonRef}
                    type="button"
                    onClick={onClose}
                    aria-label="ปิดหน้าต่างเข้าสู่ระบบ"
                    className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 sm:right-5 sm:top-5"
                >
                    <FaTimes aria-hidden="true" />
                </button>

                <div className="relative text-center">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-[#030e17] p-3 shadow-lg shadow-blue-950/30">
                        <img
                            src="/images/LOGO-FORO/logo_last.png"
                            alt="FORO"
                            className="h-full w-full object-contain"
                        />
                    </div>

                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-blue-300">Welcome to FORO</p>
                    <h2 id="login-modal-title" className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                        เข้าสู่ระบบเพื่อเริ่มใช้งาน
                    </h2>
                    <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-slate-400">
                        ติดตามข่าวและสรุปประเด็นที่คุณสนใจได้ในที่เดียว
                    </p>

                    <div className="my-7 flex items-center gap-3" aria-hidden="true">
                        <span className="h-px flex-1 bg-white/10" />
                        <span className="text-xs font-semibold text-slate-500">เลือกวิธีเข้าสู่ระบบ</span>
                        <span className="h-px flex-1 bg-white/10" />
                    </div>

                    <a
                        href={getUnauthenticatedAuthUrl()}
                        className="group flex w-full items-center justify-center gap-3 rounded-xl border border-white/15 bg-white px-5 py-3.5 font-bold text-slate-900 shadow-lg shadow-black/20 transition-all hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-[#081724] active:translate-y-0"
                    >
                        <GoogleIcon />
                        <span>ดำเนินการต่อด้วย Google</span>
                    </a>

                    <p className="mt-6 text-xs leading-relaxed text-slate-500">
                        การดำเนินการต่อถือว่าคุณยอมรับข้อกำหนดและนโยบายความเป็นส่วนตัวของ FORO
                    </p>
                </div>
            </section>
        </div>
    );
};

export default LoginModal;
