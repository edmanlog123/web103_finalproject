import React, { useState } from 'react';
import { createWorkout } from '../services/workouts';
import { useNavigate } from 'react-router-dom';

const AddWorkout = () => {
    const [date, setDate] = useState('');
    const [notes, setNotes] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createWorkout({ date, notes, is_completed: false });
            alert("Workout Logged!");
            navigate('/');
        } catch (error) {
            console.error(error);
            alert("Error creating workout");
        }
    }

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Log a New Workout</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Date</label>
                    <input 
                        type="date" 
                        className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        value={date} 
                        onChange={(e) => setDate(e.target.value)} 
                        required 
                    />
                </div>
                
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Notes</label>
                    <textarea 
                        rows="5"
                        className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="How did it go? What did you focus on?"
                        value={notes} 
                        onChange={(e) => setNotes(e.target.value)} 
                    />
                </div>

                <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                    Create Workout
                </button>
            </form>
        </div>
    )
}

export default AddWorkout;