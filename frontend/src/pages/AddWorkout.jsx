import React, { useState } from 'react';
import { createWorkout } from '../services/workouts';
import { useNavigate } from 'react-router-dom';

const AddWorkout = () => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [notes, setNotes] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createWorkout({ date, notes, is_completed: false });
            navigate('/');
        } catch (error) {
            console.error(error);
            alert("Failed to log workout. Make sure you are logged in.");
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Log a New Workout</h2>
            <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Date</label>
                        <input 
                            type="date" 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={date} 
                            onChange={(e) => setDate(e.target.value)} 
                            required 
                        />
                    </div>
                    
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Notes</label>
                        <textarea 
                            rows="5"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="How did it go? What did you focus on?"
                            value={notes} 
                            onChange={(e) => setNotes(e.target.value)} 
                        />
                    </div>

                    <div className="flex gap-4 pt-2">
                        <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md">
                            Save Workout
                        </button>
                        <button 
                            type="button" 
                            onClick={() => navigate('/')}
                            className="px-6 py-3 bg-gray-100 text-gray-600 font-semibold rounded-lg hover:bg-gray-200 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddWorkout;