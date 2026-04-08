import './App.css';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import UserTarget from './pages/UserTarget';
import { UserFollow } from './pages/UserFollow';
import Category from './pages/Category';
import CategoryNews from './pages/CategoryNews';
import AdvanceSearch from './pages/AdvanceSearch';
import RealtimeSearch from './pages/RealtimeSearch';
import TodayNews from './pages/TodayNews';
import LandingPage from './pages/LandingPage';
import PublicRoute from './components/auth/PublicRoute';
import { Analytics } from "@vercel/analytics/react"
import PostListPage from './pages/PostListPage';
import Contents from './pages/Contents';


function App() {
  return (
    <>
      <Routes>
        {/* Public Routes - Accessible by everyone */}
        <Route path="/" element={<LandingPage />} />

        {/* Guest-only Routes - Redirect to dashboard if already logged in */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Protected Routes*/}
        <Route element={<ProtectedRoute />}>
          <Route path="/contents" element={<Contents />} />
          <Route path="/today-news" element={<TodayNews />} />

          <Route path="/post-list" element={<PostListPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/user-target" element={<UserTarget />} />
          <Route path="/user-following" element={<UserFollow />} />
          <Route path="/category-management" element={<Category />} />
          <Route path="/category-news/:id" element={<CategoryNews />} />

          {/*add more route*/}

          {/*For King*/}
          <Route element={<ProtectedRoute requiredRole={"king"} />}>
            <Route path="/advance-search" element={<AdvanceSearch />} />
            <Route path="/realtime-search" element={<RealtimeSearch />} />
            <Route path="/today-news" element={<TodayNews />} />
          </Route>
          {/*For Queen*/}
          <Route element={<ProtectedRoute requiredRole={"queen"} />}>
            <Route path="/realtime-search" element={<RealtimeSearch />} />
            <Route path="/today-news" element={<TodayNews />} />
          </Route>

        </Route>

      </Routes>
      <Analytics />
    </>
  );
}

export default App;
