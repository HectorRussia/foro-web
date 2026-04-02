import { HiMiniUsers, HiOutlineCalendarDays } from 'react-icons/hi2';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { PiBookmarkSimple } from "react-icons/pi";
import { FaReadme } from "react-icons/fa";
import { IoMdListBox } from "react-icons/io";

const iconsNav = [
    // { id: 7, icon: <RiBaseStationLine />, label: "หน้าแรก", path: "/realtime-search", requiredRole: "king" },
    { id: 9, icon: <HiOutlineCalendarDays />, label: "สรุปข่าววันนี้", path: "/today-news", requiredRole: ["king", "queen", "user"] },
    { id: 11, icon: <IoMdListBox />, label: "คอนเทนต์", path: "/" },
    { id: 10, icon: <IoMdListBox />, label: "PostList", path: "/post-list", mobileOnly: true },
    { id: 1, icon: <FaReadme />, label: "อ่านข่าว", path: "/dashboard" },
    { id: 2, icon: <HiMiniUsers />, label: "กลุ่มเป้าหมาย", path: "/user-target" },
    // { id: 3, icon: <RiUserFollowFill />, label: "คนที่คุณติดตาม", path: "/user-following" },
    { id: 4, icon: <PiBookmarkSimple />, label: "Bookmarks", path: "/category-management" },
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
        <div
            onClick={() => pathNave(path)}
            className=
            {`flex items-center gap-4 px-4 py-4 rounded-xl cursor-pointer transition-all duration-200 group 
                ${active
                    ? 'bg-blue-600/10 text-blue-400'
                    : 'text-gray-400 hover:bg-[#1e293b] hover:text-gray-100'
                } ${mobileOnly ? 'xl:hidden' : ''}`
            }>
            <div className={`${active ? 'text-blue-400' : 'text-gray-400 group-hover:text-gray-200'} text-xl`}>
                {icon}
            </div>
            <span className={`text-base font-medium hidden lg:block`}>{label}</span>
            {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 hidden lg:block shadow-[0_0_8px_rgba(59,130,246,0.8)]" />}
        </div>
    )
}

const Navbar = () => {
    const location = useLocation();
    const { hasRole } = useAuth();
    const filteredNavItems = iconsNav.filter(item => {
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

