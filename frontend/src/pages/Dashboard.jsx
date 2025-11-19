import React, { useState, useEffect } from 'react';
import { getAllWorkouts } from '../services/workouts';
import WorkoutCard from '../components/WorkoutCard'; // Note the corrected path
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [workouts, setWorkouts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAllWorkouts();
                setWorkouts(data);
            } catch (error) {
                console.error("Error fetching workouts:", error);
                // Simple auth check: if error is 401, go to login
                if(error.response && error.response.status === 401) {
                    navigate('/login');
                }
            }
        }
        fetchData();
    }, [navigate]);

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Your Dashboard</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {workouts && workouts.length > 0 ? (
                    workouts.map((workout) => (
                        <WorkoutCard 
                            key={workout.workout_id} 
                            id={workout.workout_id} 
                            date={workout.date} 
                            notes={workout.notes}
                            isCompleted={workout.is_completed}
                        />
                    ))
                ) : (
                    <div className="col-span-full text-center py-10">
                        <h3 className="text-xl text-gray-500">No workouts found.</h3>
                        <p className="text-gray-400">Click "Log Workout" to get started!</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Dashboard;