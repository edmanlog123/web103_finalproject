import React, { useState, useEffect } from 'react';
import { getAllWorkouts } from '../services/workouts';
import WorkoutCard from '../components/WorkoutCard'; 
import { useNavigate, Link } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const Dashboard = () => {
    const [workouts, setWorkouts] = useState([]);
    const [filteredWorkouts, setFilteredWorkouts] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAllWorkouts();
                // Sort by date descending (newest first)
                const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
                setWorkouts(sorted);
                setFilteredWorkouts(sorted);
            } catch (error) {
                console.error("Error:", error);
                if (error.response?.status === 401) navigate('/login');
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [navigate]);

    // Filter workouts when a date is clicked on the calendar
    useEffect(() => {
        if (selectedDate) {
            // Normalize selected date to string for comparison
            const selDateStr = selectedDate.toDateString();
            const filtered = workouts.filter(w => 
                new Date(w.date).toDateString() === selDateStr
            );
            setFilteredWorkouts(filtered);
        } else {
            // Reset to show all if no date selected
            setFilteredWorkouts(workouts);
        }
    }, [selectedDate, workouts]);

    // Function to add content (dots) to calendar tiles
    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            // Check if any workout exists on this date
            const hasWorkout = workouts.some(w => 
                new Date(w.date).toDateString() === date.toDateString()
            );
            if (hasWorkout) {
                return <div className="h-1.5 w-1.5 bg-blue-500 rounded-full mx-auto mt-1"></div>;
            }
        }
    };

    // Calculate completion rate
    const completionRate = workouts.length > 0 
        ? Math.round((workouts.filter(w => w.is_completed).length / workouts.length) * 100)
        : 0;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-600 font-medium">Loading your workouts...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Enhanced Header Section */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
                                Your Activity
                            </h1>
                            <p className="text-gray-600 text-lg">
                                {selectedDate 
                                    ? `Showing workouts for ${selectedDate.toLocaleDateString('en-US', { 
                                        weekday: 'long', 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                    })}` 
                                    : "Overview of your recent training sessions"}
                            </p>
                        </div>
                        
                        <div className="flex gap-3">
                            {selectedDate && (
                                <button 
                                    onClick={() => setSelectedDate(null)}
                                    className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm"
                                >
                                    ✕ Clear Filter
                                </button>
                            )}
                            <Link to="/new">
                                <button className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5">
                                    + Log Workout
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Main Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column: Workout List (2 columns) */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Planned Section */}
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span className="w-1 h-6 bg-yellow-500 rounded-full"></span>
                                Planned
                            </h2>
                            <div className="grid grid-cols-1 gap-4">
                                {filteredWorkouts.filter(w => !w.is_completed).length > 0 ? (
                                    filteredWorkouts
                                        .filter(w => !w.is_completed)
                                        .map((workout) => (
                                            <WorkoutCard 
                                                key={workout.workout_id} 
                                                id={workout.workout_id} 
                                                date={workout.date} 
                                                notes={workout.notes}
                                                isCompleted={workout.is_completed}
                                            />
                                        ))
                                ) : (
                                    <div className="bg-white p-8 rounded-xl shadow-sm text-center border-2 border-dashed border-gray-200">
                                        <div className="text-gray-400 text-4xl mb-3">📋</div>
                                        <p className="text-gray-500 font-medium">No planned workouts</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Completed Section */}
                        {filteredWorkouts.filter(w => w.is_completed).length > 0 && (
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-green-500 rounded-full"></span>
                                    Completed
                                </h2>
                                <div className="grid grid-cols-1 gap-4">
                                    {filteredWorkouts
                                        .filter(w => w.is_completed)
                                        .map((workout) => (
                                            <WorkoutCard 
                                                key={workout.workout_id} 
                                                id={workout.workout_id} 
                                                date={workout.date} 
                                                notes={workout.notes}
                                                isCompleted={workout.is_completed}
                                            />
                                        ))}
                                </div>
                            </div>
                        )}

                        {filteredWorkouts.length === 0 && (
                            <div className="col-span-full bg-white p-12 rounded-xl shadow-sm text-center border-2 border-dashed border-gray-200">
                                <div className="text-gray-400 text-5xl mb-4">🏋️</div>
                                <p className="text-gray-600 text-xl font-semibold mb-2">No workouts found</p>
                                <p className="text-gray-500 mb-6">
                                    {selectedDate 
                                        ? "No workouts scheduled for this date" 
                                        : "Start logging your workouts to see them here!"}
                                </p>
                                {selectedDate ? (
                                    <button 
                                        onClick={() => setSelectedDate(null)}
                                        className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
                                    >
                                        View all workouts
                                    </button>
                                ) : (
                                    <Link to="/new">
                                        <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition">
                                            Create Your First Workout
                                        </button>
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Calendar & Stats (1 column) */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6 space-y-6">
                            {/* Interactive Calendar Card */}
                            <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                                <div className="flex items-center justify-between mb-5">
                                    <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                                        📅 Calendar
                                    </h3>
                                </div>
                                <div className="calendar-wrapper">
                                    <Calendar 
                                        onChange={setSelectedDate} 
                                        value={selectedDate}
                                        tileContent={tileContent}
                                        className="w-full border-none"
                                    />
                                </div>
                                <div className="mt-5 pt-4 border-t border-gray-100">
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <span className="inline-block w-2.5 h-2.5 bg-blue-500 rounded-full"></span>
                                        <span className="font-medium">Workout scheduled</span>
                                    </div>
                                </div>
                            </div>

                            {/* Enhanced Quick Stats Card */}
                            <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-2xl shadow-xl">
                                <h3 className="font-bold text-blue-100 mb-6 text-lg">📊 Your Progress</h3>
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center pb-4 border-b border-blue-500/30">
                                        <div>
                                            <div className="text-4xl font-extrabold">{workouts.length}</div>
                                            <div className="text-blue-200 text-sm font-medium mt-1">Total Workouts</div>
                                        </div>
                                        <div className="text-5xl">🏋️</div>
                                    </div>
                                    <div className="flex justify-between items-center pb-4 border-b border-blue-500/30">
                                        <div>
                                            <div className="text-4xl font-extrabold">
                                                {workouts.filter(w => w.is_completed).length}
                                            </div>
                                            <div className="text-blue-200 text-sm font-medium mt-1">Completed</div>
                                        </div>
                                        <div className="text-5xl">✅</div>
                                    </div>
                                    <div className="pt-2">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-blue-200 text-sm font-medium">Completion Rate</span>
                                            <span className="text-white text-lg font-bold">{completionRate}%</span>
                                        </div>
                                        <div className="w-full bg-blue-800/50 rounded-full h-3 overflow-hidden">
                                            <div 
                                                className="bg-gradient-to-r from-green-400 to-green-500 h-3 rounded-full transition-all duration-500"
                                                style={{ width: `${completionRate}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Dashboard;