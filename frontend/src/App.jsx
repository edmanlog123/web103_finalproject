import { useRoutes, Link, useNavigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AddWorkout from './pages/AddWorkout';
import EditWorkout from './pages/EditWorkout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; // We will create this next
import './index.css';

const App = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // Check if logged in

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

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            🏋️‍♂️ Workout Tracker
          </h1>
          <nav className="flex gap-4">
            {token ? (
              <>
                <Link to="/" className="hover:text-blue-200 font-medium">Dashboard</Link>
                <Link to="/new" className="hover:text-blue-200 font-medium">Log Workout</Link>
                <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm">
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-4">
                 <Link to="/login" className="hover:text-blue-200">Login</Link>
                 <Link to="/register" className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100">Sign Up</Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto w-full p-6">
        {element}
      </main>
    </div>
  );
}

export default App;