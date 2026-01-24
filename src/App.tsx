import './App.css';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import UserTarget from './pages/UserTarget';

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
        {/*add more route*/}
      </Route>

    </Routes>
  );
}

export default App;
