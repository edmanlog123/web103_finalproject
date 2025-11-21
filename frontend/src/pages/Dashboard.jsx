import React, { useState, useEffect } from 'react';
import { getAllWorkouts } from '../services/workouts';
import WorkoutCard from '../components/WorkoutCard';
import { useNavigate, Link } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Default styles

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
                // Sort by newest first
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

    // Handle filtering when date changes
    useEffect(() => {
        if (selectedDate) {
            const selectionStr = selectedDate.toDateString();
            const filtered = workouts.filter(w => 
                new Date(w.date).toDateString() === selectionStr
            );
            setFilteredWorkouts(filtered);
        } else {
            setFilteredWorkouts(workouts);
        }
    }, [selectedDate, workouts]);

    // Helper to add dots to calendar dates that have workouts
    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const hasWorkout = workouts.some(w => 
                new Date(w.date).toDateString() === date.toDateString()
            );
            if (hasWorkout) {
                return <div className="h-2 w-2 bg-blue-500 rounded-full mx-auto mt-1"></div>;
            }
        }
    };

    if (loading) return <div className="text-center mt-20 text-gray-500">Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Top Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">Dashboard</h2>
                    <p className="text-gray-500">
                        {selectedDate 
                            ? `Showing workouts for ${selectedDate.toLocaleDateString()}` 
                            : "Welcome back! Here is your recent activity."}
                    </p>
                </div>
                
                <div className="flex gap-3">
                    {selectedDate && (
                        <button 
                            onClick={() => setSelectedDate(null)}
                            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                        >
                            Clear Filter
                        </button>
                    )}
                    <Link to="/new">
                        <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg transition transform hover:-translate-y-0.5">
                            + Log Workout
                        </button>
                    </Link>
                </div>
            </div>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Column: Workout List (Spans 8 columns) */}
                <div className="lg:col-span-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredWorkouts.length > 0 ? (
                            filteredWorkouts.map((workout) => (
                                <WorkoutCard 
                                    key={workout.workout_id} 
                                    id={workout.workout_id} 
                                    date={workout.date} 
                                    notes={workout.notes}
                                    isCompleted={workout.is_completed}
                                />
                            ))
                        ) : (
                            <div className="col-span-full bg-white p-10 rounded-xl shadow-sm text-center border border-dashed border-gray-300">
                                <p className="text-gray-500 text-lg">No workouts found for this period.</p>
                                {selectedDate && (
                                    <button 
                                        onClick={() => setSelectedDate(null)}
                                        className="mt-4 text-blue-600 hover:underline"
                                    >
                                        View all workouts
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Calendar & Stats (Spans 4 columns) */}
                <div className="lg:col-span-4">
                    <div className="sticky top-6 space-y-6">
                        {/* Interactive Calendar Card */}
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                            <h3 className="font-bold text-gray-700 mb-4 border-b pb-2">📅 Calendar</h3>
                            <div className="calendar-wrapper">
                                <Calendar 
                                    onChange={setSelectedDate} 
                                    value={selectedDate}
                                    tileContent={tileContent}
                                    className="w-full border-none"
                                />
                            </div>
                            <div className="mt-4 text-xs text-gray-400 text-center">
                                <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                                Indicates a workout day
                            </div>
                        </div>

                        {/* Quick Stats Card */}
                        <div className="bg-blue-600 text-white p-6 rounded-xl shadow-lg">
                            <h3 className="font-bold text-blue-100 mb-4">Your Progress</h3>
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="text-3xl font-bold">{workouts.length}</div>
                                    <div className="text-blue-200 text-sm">Total Workouts</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold">
                                        {workouts.filter(w => w.is_completed).length}
                                    </div>
                                    <div className="text-blue-200 text-sm">Completed</div>
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