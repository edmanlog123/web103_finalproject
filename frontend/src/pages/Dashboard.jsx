import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Dashboard.css';

const Dashboard = () => {
  const [workouts, setWorkouts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
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

  // Calendar helpers
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = date.toISOString().split('T')[0];
      const workout = workouts.find(w => w.date === dateStr);
      
      if (workout) {
        return workout.iscompleted ? 'workout-completed' : 'workout-planned';
      }
    }
    return null;
  };

  const handleDateClick = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    const workout = workouts.find(w => w.date === dateStr);
    if (workout) {
      navigate(`/workout/${workout.workoutid}`);
    } else {
      navigate('/new', { state: { date: dateStr } });
    }
  };

  const completedWorkouts = workouts.filter(w => w.iscompleted).length;
  const totalWorkouts = workouts.length;
  const completionRate = totalWorkouts > 0 ? Math.round((completedWorkouts / totalWorkouts) * 100) : 0;
  
  // Calculate streak (simplified - days with completed workouts in last 7 days)
  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);
  const recentCompleted = workouts.filter(w => 
    w.iscompleted && new Date(w.date) >= last7Days
  ).length;

  return (
    <div className="dashboard">
      {/* Navigation Bar */}
      <nav className="dashboard-nav">
        <div className="nav-content">
          <div className="nav-logo" onClick={() => navigate('/dashboard')}>
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
              <h3>{recentCompleted}</h3>
              <p>7-Day Streak</p>
            </div>
          </div>
        </div>

        {/* Two Column Layout for Calendar and Workouts */}
        <div className="main-content-grid">
          {/* Calendar Section */}
          <div className="calendar-section">
            <h2>📅 Your Activity Calendar</h2>
            <div className="calendar-container">
              <Calendar
                value={selectedDate}
                onChange={setSelectedDate}
                tileClassName={tileClassName}
                onClickDay={handleDateClick}
              />
              <div className="calendar-legend">
                <div className="legend-item">
                  <span className="legend-dot completed"></span>
                  <span>Completed</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot planned"></span>
                  <span>Planned</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot today"></span>
                  <span>Today</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Workouts Section */}
          <div className="recent-workouts">
            <div className="section-header">
              <h2>Recent Workouts</h2>
              {workouts.length > 5 && (
                <button className="btn-view-all" onClick={() => navigate('/workouts')}>
                  View All →
                </button>
              )}
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
                {workouts
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .slice(0, 5)
                  .map((workout) => (
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
                          day: 'numeric',
                          year: 'numeric'
                        })}</h4>
                        <p className="workout-notes">{workout.notes || 'No notes'}</p>
                      </div>
                      <div className="workout-arrow">→</div>
                    </div>
                  ))}
              </div>
            )}
          </div>
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
            
            <div className="action-card" onClick={() => navigate('/workouts')}>
              <span className="action-icon">📋</span>
              <h3>All Workouts</h3>
              <p>View complete history</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
