import { useRoutes, Link, useNavigate, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AddWorkout from './pages/AddWorkout';
import EditWorkout from './pages/EditWorkout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import './index.css';

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  let element = useRoutes([
    { path: "/", element: <Dashboard /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/register", element: <RegisterPage /> },
    { path: "/new", element: <AddWorkout /> },
    { path: "/edit/:id", element: <EditWorkout /> },
  ]);

  // Hide navbar on auth pages
  if (['/login', '/register'].includes(location.pathname)) {
    return <div className="min-h-screen bg-gray-50">{element}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <nav className="bg-blue-600 shadow-lg text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-2xl font-bold tracking-tight">
                🏋️ Rella
              </Link>
              {token && (
                 <span className="text-blue-100 text-sm hidden sm:block">Welcome, {user.name || 'Athlete'}</span>
              )}
            </div>
            <div className="flex gap-4">
              {token ? (
                <>
                  <Link to="/" className="hover:bg-blue-700 px-3 py-2 rounded transition">Dashboard</Link>
                  <Link to="/new" className="hover:bg-blue-700 px-3 py-2 rounded transition">Log Workout</Link>
                  <button 
                    onClick={handleLogout} 
                    className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded font-semibold transition shadow-sm"
                  >
                    Logout
                  </button>
                </>
              ) : (
                 <Link to="/login" className="bg-white text-blue-600 px-4 py-2 rounded font-bold hover:bg-gray-100 transition">Login</Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-grow max-w-6xl mx-auto w-full p-6">
        {element}
      </div>
    </div>
  );
}

export default App;