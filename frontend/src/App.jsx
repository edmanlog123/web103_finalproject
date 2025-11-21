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
  
  // Simple check for token
  const token = localStorage.getItem('token');

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

  // Hide navbar on login/register screens for a clean look
  if (['/login', '/register'].includes(location.pathname)) {
    return <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">{element}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo area */}
            <div className="flex items-center gap-2">
              <Link to="/" className="flex items-center gap-2">
                <span className="text-2xl">🏋️</span>
                <span className="font-bold text-xl tracking-tight text-blue-600">Rella</span>
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center gap-4">
              {token ? (
                <>
                   <Link to="/">
                      <button className="text-gray-600 hover:text-blue-600 font-medium px-3 py-2 transition">
                        Dashboard
                      </button>
                   </Link>
                   <Link to="/new">
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition shadow-sm">
                        + Log Workout
                      </button>
                   </Link>
                   <button 
                      onClick={handleLogout} 
                      className="text-red-500 hover:bg-red-50 px-4 py-2 rounded-md font-medium transition border border-transparent hover:border-red-100"
                   >
                      Logout
                   </button>
                </>
              ) : (
                <Link to="/login">
                  <button className="text-blue-600 font-medium hover:underline">Login</button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {element}
      </main>
    </div>
  );
}

export default App;