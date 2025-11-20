import { useRoutes, Link, useNavigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AddWorkout from './pages/AddWorkout';
import EditWorkout from './pages/EditWorkout';
import LoginPage from './pages/LoginPage'; // FIXED: changed from Login to LoginPage
import RegisterPage from './pages/RegisterPage'; // ADDED: You need this to sign up!
import './index.css'

const App = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  let element = useRoutes([
    { path: "/", element: <Dashboard /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/register", element: <RegisterPage /> }, // ADDED Route
    { path: "/new", element: <AddWorkout /> },
    { path: "/edit/:id", element: <EditWorkout /> },
  ]);

  // Hide sidebar/header on login and register pages
  if (['/login', '/register'].includes(window.location.pathname)) {
    return <div className="App">{element}</div>;
  }

  return (
    <div className="App">
      <div className="header">
        <h1>🏋️ Workout Tracker</h1>
        <nav>
            <Link to="/"><button>Dashboard</button></Link>
            <Link to="/new"><button>Log Workout</button></Link>
            <button onClick={handleLogout} style={{backgroundColor: '#ff4d4d'}}>Logout</button>
        </nav>
      </div>
      <div className="content">
        {element}
      </div>
    </div>
  );
}

export default App;