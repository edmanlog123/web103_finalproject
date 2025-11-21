import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [workouts, setWorkouts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Fetch workouts
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/workouts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setWorkouts(data);
      }
    } catch (error) {
      console.error('Error fetching workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const completedWorkouts = workouts.filter(w => w.iscompleted).length;
  const totalWorkouts = workouts.length;
  const completionRate = totalWorkouts > 0 ? Math.round((completedWorkouts / totalWorkouts) * 100) : 0;

  return (
    <div className="dashboard">
      {/* Navigation Bar */}
      <nav className="dashboard-nav">
        <div className="nav-content">
          <div className="nav-logo" onClick={() => navigate('/')}>
            <span className="logo-icon">🏋️</span>
            <span className="logo-text">Rella</span>
          </div>
          
          <div className="nav-actions">
            <button className="btn-new-workout" onClick={() => navigate('/new')}>
              <span className="btn-icon">➕</span>
              Log Workout
            </button>
            <button className="btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="dashboard-container">
        {/* Welcome Section */}
        <div className="welcome-section">
          <h1>Welcome back, {user?.name || 'Athlete'}! 💪</h1>
          <p>Ready to crush your fitness goals today?</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>{totalWorkouts}</h3>
              <p>Total Workouts</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>{completedWorkouts}</h3>
              <p>Completed</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <h3>{completionRate}%</h3>
              <p>Completion Rate</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-content">
              <h3>{Math.min(completedWorkouts, 7)}</h3>
              <p>Day Streak</p>
            </div>
          </div>
        </div>

        {/* Recent Workouts Section */}
        <div className="recent-workouts">
          <div className="section-header">
            <h2>Recent Workouts</h2>
            <button className="btn-view-all" onClick={() => navigate('/workouts')}>
              View All →
            </button>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner-large"></div>
              <p>Loading your workouts...</p>
            </div>
          ) : workouts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏃</div>
              <h3>No workouts yet!</h3>
              <p>Start your fitness journey by logging your first workout.</p>
              <button className="btn-start" onClick={() => navigate('/new')}>
                Log Your First Workout
              </button>
            </div>
          ) : (
            <div className="workout-list">
              {workouts.slice(0, 5).map((workout) => (
                <div 
                  key={workout.workoutid} 
                  className={`workout-card ${workout.iscompleted ? 'completed' : 'pending'}`}
                  onClick={() => navigate(`/workout/${workout.workoutid}`)}
                >
                  <div className="workout-status">
                    {workout.iscompleted ? '✓' : '○'}
                  </div>
                  <div className="workout-info">
                    <h4>{new Date(workout.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'short', 
                      day: 'numeric' 
                    })}</h4>
                    <p>{workout.notes || 'No notes'}</p>
                  </div>
                  <div className="workout-arrow">→</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <div className="action-card" onClick={() => navigate('/new')}>
              <span className="action-icon">📝</span>
              <h3>Log Workout</h3>
              <p>Record today's training</p>
            </div>
            
            <div className="action-card" onClick={() => navigate('/progress')}>
              <span className="action-icon">📈</span>
              <h3>View Progress</h3>
              <p>Track your journey</p>
            </div>
            
            <div className="action-card" onClick={() => navigate('/calendar')}>
              <span className="action-icon">📅</span>
              <h3>Calendar</h3>
              <p>See your schedule</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
