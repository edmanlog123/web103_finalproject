import React, { useState } from 'react';
import { createWorkout } from '../services/api';
import { useNavigate } from 'react-router-dom';

const AddWorkout = () => {
    const [date, setDate] = useState('');
    const [notes, setNotes] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // The backend expects: { user_id, date, is_completed, notes }
        // user_id is extracted from the token on the backend, 
        // so we just send the data fields.
        const workoutData = {
            date: date,
            notes: notes,
            is_completed: false
        };

        try {
            await createWorkout(workoutData);
            alert("Workout Logged!");
            navigate('/');
        } catch (error) {
            console.error("Failed to create workout", error);
            alert("Error creating workout");
        }
    }

    return (
        <div className="form-container">
            <h2>Log a New Workout</h2>
            <form onSubmit={handleSubmit}>
                <label>Date</label>
                <input 
                    type="date" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)} 
                    required 
                />
                
                <label>Notes</label>
                <textarea 
                    rows="5"
                    placeholder="How did it go? What did you focus on?"
                    value={notes} 
                    onChange={(e) => setNotes(e.target.value)} 
                />

                <button type="submit">Create Workout</button>
            </form>
        </div>
    )
}

export default AddWorkout;