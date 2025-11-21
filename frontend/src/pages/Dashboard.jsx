import React, { useState, useEffect } from 'react';
import { getAllWorkouts } from '../services/workouts';
import WorkoutCard from '../components/WorkoutCard'; 
import { useNavigate, Link } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import default calendar styles

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

    if (loading) return <div className="text-center mt-20 text-gray-400">Loading your stats...</div>;

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-end mb-8">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Your Activity</h2>
                    <p className="text-gray-500 mt-1">
                        {selectedDate 
                            ? `Showing workouts for ${selectedDate.toLocaleDateString()}` 
                            : "Overview of your recent training sessions"}
                    </p>
                </div>
                {selectedDate && (
                    <button 
                        onClick={() => setSelectedDate(null)}
                        className="text-sm text-blue-600 hover:underline mb-1 md:mb-0"
                    >
                        Clear Date Filter
                    </button>
                )}
            </div>
            
            {/* THE GRID LAYOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                {/* LEFT COLUMN: Workout List (Takes up 2/3 width on large screens) */}
                <div className="lg:col-span-2 space-y-6">
                    {filteredWorkouts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {filteredWorkouts.map((workout) => (
                                <WorkoutCard 
                                    key={workout.workout_id} 
                                    id={workout.workout_id} 
                                    date={workout.date} 
                                    notes={workout.notes}
                                    isCompleted={workout.is_completed}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
                            <p className="text-gray-500 mb-4 text-lg">No workouts found for this period.</p>
                            <Link to="/new">
                                <button className="text-blue-600 font-semibold hover:underline">
                                    Log a new one now &rarr;
                                </button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* RIGHT COLUMN: Calendar (Takes up 1/3 width on large screens) */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                        <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                            <span>📅</span> Calendar
                        </h3>
                        <Calendar 
                            onChange={setSelectedDate} 
                            value={selectedDate}
                            tileContent={tileContent}
                            className="w-full border-none text-sm"
                        />
                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-500">Total Workouts</span>
                                <span className="font-bold text-gray-900">{workouts.length}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Completion Rate</span>
                                <span className="font-bold text-green-600">
                                    {workouts.length > 0 
                                        ? Math.round((workouts.filter(w => w.is_completed).length / workouts.length) * 100) 
                                        : 0}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;