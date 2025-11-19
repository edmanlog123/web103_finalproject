import React, { useState, useEffect } from 'react';
import { getAllWorkouts } from '../services/api';
import WorkoutCard from '../components/WorkoutCard';
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
                console.error("Error:", error);
                // If error is 401/403, redirect to login
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    navigate('/login');
                }
            }
        }
        fetchData();
    }, [navigate]);

    return (
        <div className="gallery">
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
                <h2>No Workouts logged yet. Get moving! 💪</h2>
            )}
        </div>
    )
}

export default Dashboard;