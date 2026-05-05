import { HiMiniUsers, HiOutlineCalendarDays } from 'react-icons/hi2';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { PiBookmarkSimple } from "react-icons/pi";
import { FaReadme } from "react-icons/fa";
import { IoMdListBox } from "react-icons/io";

export const NAV_ITEMS = [
    // { id: 7, icon: <RiBaseStationLine />, label: "หน้าแรก", path: "/realtime-search", requiredRole: "king" },
    { id: 9, icon: <HiOutlineCalendarDays />, label: "สรุปข่าววันนี้", path: "/today-news", requiredRole: ["king", "queen", "user"] },
    { id: 11, icon: <IoMdListBox />, label: "คอนเทนต์", path: "/contents" },
    { id: 10, icon: <IoMdListBox />, label: "PostList", path: "/post-list", mobileOnly: true },
    { id: 1, icon: <FaReadme />, label: "อ่านข่าว", path: "/dashboard" },
    { id: 2, icon: <HiMiniUsers />, label: "กลุ่มเป้าหมาย", path: "/user-target" },
    // { id: 3, icon: <RiUserFollowFill />, label: "คนที่คุณติดตาม", path: "/user-following" },
    { id: 4, icon: <PiBookmarkSimple />, label: "Bookmarks", path: "/bookmark" },
    // { id: 6, icon: <TbAlpha />, label: "AdvanceSearch", path: "/advance-search", requiredRole: "king" },
]

interface NavbarProp {
    id: number,
    icon: React.ReactNode,
    label: string,
    active?: boolean,
    path: string,
    requiredRole?: string | string[],
    mobileOnly?: boolean
}

const NavbarStruct = ({ id, icon, label, active = false, path, mobileOnly }: NavbarProp) => {
    const navigate = useNavigate()
    const { logout } = useAuth();
    const pathNave = async (path: string) => {
        if (id === 5) {
            logout();
        }
        navigate(path)
    }

    return (
        <button
            type="button"
            onClick={() => pathNave(path)}
            className=
            {`relative mx-3 my-[3px] flex w-[calc(100%-24px)] items-center gap-3 overflow-hidden rounded-xl px-[18px] py-3 text-left transition-all duration-300 group 
                ${active
                    ? 'bg-[linear-gradient(90deg,rgba(21,44,71,0.78),rgba(16,28,42,0.96))] text-white shadow-[inset_0_0_0_1px_rgba(113,170,234,0.06),0_8px_22px_rgba(0,0,0,0.18)] before:absolute before:left-0 before:top-[16%] before:h-[68%] before:w-0.5 before:rounded-r before:bg-[linear-gradient(180deg,rgba(120,190,255,0.92),rgba(41,151,255,0.98))]'
                    : 'text-slate-300 hover:bg-white/[0.035] hover:text-white'
                } ${mobileOnly ? 'lg:hidden' : ''}`
            }>
            <div className={`${active ? 'text-white translate-x-px' : 'text-slate-200 group-hover:text-white'} z-10 flex h-6 w-6 shrink-0 items-center justify-center text-[20px] transition-all`}>
                {icon}
            </div>
            <span className="z-10 hidden min-w-0 flex-1 truncate text-[15px] font-bold leading-[1.35] lg:block">{label}</span>
        </button>
    )
}

const Navbar = () => {
    const location = useLocation();
    const { hasRole } = useAuth();
    const filteredNavItems = NAV_ITEMS.filter(item => {
        // no role display normal
        if (!item.requiredRole) {
            return true;
        }

        // Check Role
        if (item.requiredRole && !hasRole(item.requiredRole)) {
            return false;
        }

        return true;
    });
    return (
        <nav className="flex-1 space-y-2 w-full">
            {filteredNavItems.map((item, index) => (
                <NavbarStruct
                    id={item.id}
                    key={index}
                    icon={item.icon}
                    label={item.label}
                    active={location.pathname === item.path}
                    path={item.path}
                    requiredRole={item.requiredRole}
                    mobileOnly={(item as any).mobileOnly}
                />
            ))}
        </nav>
    )
}

export default Navbar

