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

function App() {
  return (
    <Routes>
      {/* Public Routes*/}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes*/}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/user-target" element={<UserTarget />} />
        <Route path="/user-following" element={<UserFollow />} />
        <Route path="/category-management" element={<Category />} />
        <Route path="/category-news/:id" element={<CategoryNews />} />
        {/*add more route*/}
      </Route>

    </Routes>
  );
}

export default App;
