import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getWorkoutById, updateWorkout, deleteWorkout } from '../services/api';

const EditWorkout = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [date, setDate] = useState('');
    const [notes, setNotes] = useState('');
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        const fetchWorkout = async () => {
            try {
                // Note: We are fetching ALL and finding by ID because 
                // the backend endpoint GET /:workoutId wasn't explicitly clear 
                // in the provided snippets, but PATCH /:workoutId exists.
                const data = await getWorkoutById(id);
                if (data) {
                    // Format date for input field (yyyy-MM-dd)
                    const d = new Date(data.date);
                    setDate(d.toISOString().split('T')[0]);
                    setNotes(data.notes);
                    setIsCompleted(data.is_completed);
                }
            } catch (error) {
                console.error(error);
            }
        }
        fetchWorkout();
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await updateWorkout(id, { date, notes, is_completed: isCompleted });
            alert("Workout Updated!");
            navigate('/');
        } catch (error) {
            console.error(error);
            alert("Update failed");
        }
    }

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this workout?")) {
            try {
                await deleteWorkout(id);
                navigate('/');
            } catch (error) {
                console.error(error);
            }
        }
    }

    return (
        <div className="form-container">
            <h2>Edit Workout</h2>
            <form onSubmit={handleUpdate}>
                <label>Date</label>
                <input 
                    type="date" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)} 
                />
                
                <label>Notes</label>
                <textarea 
                    rows="5"
                    value={notes} 
                    onChange={(e) => setNotes(e.target.value)} 
                />

                <div className="checkbox-container">
                    <input 
                        type="checkbox" 
                        checked={isCompleted} 
                        onChange={(e) => setIsCompleted(e.target.checked)}
                    />
                    <label>Workout Completed?</label>
                </div>

                <div className="button-group">
                    <button type="submit">Save Changes</button>
                    <button type="button" onClick={handleDelete} className="delete-btn" style={{backgroundColor: 'red', marginLeft: '10px'}}>Delete</button>
                </div>
            </form>
        </div>
    )
}

export default EditWorkout;