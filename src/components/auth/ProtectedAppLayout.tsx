import { Outlet } from 'react-router-dom';
import { GlobalNewsSyncStatus } from '../TodayNews/GlobalNewsSyncStatus';
import { TodayNewsProvider } from '../../contexts/TodayNewsProvider';
import { useTheme } from '../../hooks/useTheme';
import '../../styles/app-workshop.css';

const ProtectedAppLayout = () => {
    const { theme, resolvedTheme } = useTheme();

    return (
        <div
            className="foro-workshop-app"
            data-theme={theme}
            data-resolved-theme={resolvedTheme}
            style={{ colorScheme: resolvedTheme }}
        >
            <TodayNewsProvider>
                <GlobalNewsSyncStatus />
                <Outlet />
            </TodayNewsProvider>
        </div>
    );
};

export default ProtectedAppLayout;
