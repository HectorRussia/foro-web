import { FaHome } from 'react-icons/fa';
import { HiMiniUsers } from 'react-icons/hi2';
import { LuLogOut } from "react-icons/lu";
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { RiUserFollowFill } from 'react-icons/ri';
import { BiCategory } from "react-icons/bi";

const iconsNav = [
    { id: 1, icon: <FaHome />, label: "หน้าแรก", path: "/dashboard" },
    { id: 2, icon: <HiMiniUsers />, label: "กลุ่มเป้าหมาย", path: "/user-target" },
    { id: 3, icon: <RiUserFollowFill />, label: "คนที่คุณติดตาม", path: "/user-following" },
    { id: 4, icon: <BiCategory />, label: "จัดการหมวดหมู่", path: "/category-management" },
    { id: 5, icon: <LuLogOut />, label: "ออกจากระบบ", path: "/" },
]

interface NavbarProp {
    id: number,
    icon: React.ReactNode,
    label: string,
    active?: boolean,
    path: string
}

const NavbarStruct = ({ id, icon, label, active = false, path }: NavbarProp) => {
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
                }`
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

    return (
        <nav className="flex-1 space-y-2 w-full">
            {iconsNav.map((item, index) => (
                <NavbarStruct
                    id={item.id}
                    key={index}
                    icon={item.icon}
                    label={item.label}
                    active={location.pathname === item.path}
                    path={item.path}
                />
            ))}
        </nav>
    )
}

export default Navbar

