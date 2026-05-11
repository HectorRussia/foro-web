import type { IconType } from 'react-icons';
import {
    LuBookOpen,
    LuBookmark,
    LuHouse,
    LuList,
    LuSquarePen,
    LuUsersRound,
} from 'react-icons/lu';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export interface NavItem {
    id: number;
    Icon: IconType;
    label: string;
    path: string;
    requiredRole?: string | string[];
    mobileOnly?: boolean;
    fillActive?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
    {
        id: 9,
        Icon: LuHouse,
        label: '\u0e2a\u0e23\u0e38\u0e1b\u0e02\u0e48\u0e32\u0e27\u0e27\u0e31\u0e19\u0e19\u0e35\u0e49',
        path: '/today-news',
        requiredRole: ['king', 'queen', 'user'],
        fillActive: true,
    },
    {
        id: 11,
        Icon: LuSquarePen,
        label: '\u0e04\u0e2d\u0e19\u0e40\u0e17\u0e19\u0e15\u0e4c',
        path: '/contents',
    },
    {
        id: 10,
        Icon: LuList,
        label: 'PostList',
        path: '/post-list',
        mobileOnly: true,
    },
    {
        id: 1,
        Icon: LuBookOpen,
        label: '\u0e2d\u0e48\u0e32\u0e19\u0e02\u0e48\u0e32\u0e27',
        path: '/dashboard',
    },
    {
        id: 2,
        Icon: LuUsersRound,
        label: '\u0e01\u0e32\u0e23\u0e15\u0e34\u0e14\u0e15\u0e32\u0e21',
        path: '/user-target',
    },
    {
        id: 4,
        Icon: LuBookmark,
        label: 'Bookmarks',
        path: '/bookmark',
    },
];

interface NavbarProp extends NavItem {
    active?: boolean;
}

const NavbarStruct = ({ id, Icon, label, active = false, path, mobileOnly, fillActive = false }: NavbarProp) => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const pathNave = async (targetPath: string) => {
        if (id === 5) {
            logout();
        }
        navigate(targetPath);
    };

    return (
        <button
            type="button"
            onClick={() => pathNave(path)}
            className={`root-nav-item ${active ? 'active' : ''} ${mobileOnly ? 'root-nav-mobile-only' : ''}`.trim()}
        >
            <span className="root-nav-icon-shell" aria-hidden="true">
                <Icon
                    size={20}
                    strokeWidth={active ? 2.15 : 1.95}
                    fill={active && fillActive ? 'currentColor' : 'none'}
                />
            </span>
            <span className="root-nav-text">{label}</span>
        </button>
    );
};

const Navbar = () => {
    const location = useLocation();
    const { hasRole } = useAuth();
    const filteredNavItems = NAV_ITEMS.filter((item) => {
        if (!item.requiredRole) {
            return true;
        }

        if (item.requiredRole && !hasRole(item.requiredRole)) {
            return false;
        }

        return true;
    });

    return (
        <nav className="root-sidebar-nav">
            {filteredNavItems.map((item) => (
                <NavbarStruct
                    id={item.id}
                    key={item.id}
                    Icon={item.Icon}
                    label={item.label}
                    active={location.pathname === item.path}
                    path={item.path}
                    requiredRole={item.requiredRole}
                    mobileOnly={item.mobileOnly}
                    fillActive={item.fillActive}
                />
            ))}
        </nav>
    );
};

export default Navbar;
