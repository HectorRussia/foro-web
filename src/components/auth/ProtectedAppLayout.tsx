import { Outlet } from 'react-router-dom';
import { GlobalNewsSyncStatus } from '../TodayNews/GlobalNewsSyncStatus';
import { TodayNewsProvider } from '../../contexts/TodayNewsProvider';

const ProtectedAppLayout = () => (
    <TodayNewsProvider>
        <GlobalNewsSyncStatus />
        <Outlet />
    </TodayNewsProvider>
);

export default ProtectedAppLayout;
