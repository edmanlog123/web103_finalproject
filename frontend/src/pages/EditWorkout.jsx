import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getWorkoutById, updateWorkout, deleteWorkout } from '../services/workouts';

const EditWorkout = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [date, setDate] = useState('');
    const [notes, setNotes] = useState('');
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        const fetchWorkout = async () => {
            try {
                const data = await getWorkoutById(id);
                if (data) {
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
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Workout</h2>
            <form onSubmit={handleUpdate} className="space-y-6">
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Date</label>
                    <input 
                        type="date" 
                        className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        value={date} 
                        onChange={(e) => setDate(e.target.value)} 
                    />
                </div>
                
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Notes</label>
                    <textarea 
                        rows="5"
                        className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        value={notes} 
                        onChange={(e) => setNotes(e.target.value)} 
                    />
                </div>

                <div className="flex items-center gap-3">
                    <input 
                        type="checkbox" 
                        id="completed"
                        className="w-5 h-5 text-blue-600"
                        checked={isCompleted} 
                        onChange={(e) => setIsCompleted(e.target.checked)}
                    />
                    <label htmlFor="completed" className="text-gray-700 font-medium">Workout Completed?</label>
                </div>

                <div className="flex gap-4 pt-4">
                    <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                        Save Changes
                    </button>
                    <button type="button" onClick={handleDelete} className="flex-1 bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition">
                        Delete Workout
                    </button>
                </div>
            </form>
        </div>
    )
}

export default EditWorkout;