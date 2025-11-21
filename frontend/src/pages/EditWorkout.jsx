import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getWorkoutById, updateWorkout, deleteWorkout } from '../services/workouts';

const EditWorkout = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [date, setDate] = useState('');
    const [notes, setNotes] = useState('');
    const [isCompleted, setIsCompleted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchWorkout = async () => {
            try {
                const data = await getWorkoutById(id);
                if (data) {
                    const d = new Date(data.date);
                    setDate(d.toISOString().split('T')[0]);
                    setNotes(data.notes || '');
                    setIsCompleted(data.is_completed);
                }
            } catch (error) {
                console.error(error);
                alert("Could not fetch workout");
                navigate('/');
            } finally {
                setIsLoading(false);
            }
        }
        fetchWorkout();
    }, [id, navigate]);

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
        if (window.confirm("Are you sure you want to delete this workout? This cannot be undone.")) {
            try {
                await deleteWorkout(id);
                navigate('/');
            } catch (error) {
                console.error(error);
                alert("Delete failed");
            }
        }
    }

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Edit Workout</h2>
                <button 
                    onClick={() => navigate('/')}
                    className="text-gray-500 hover:text-gray-700"
                >
                    ✕ Close
                </button>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
                <form onSubmit={handleUpdate} className="space-y-6">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Date</label>
                        <input 
                            type="date" 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={date} 
                            onChange={(e) => setDate(e.target.value)} 
                        />
                    </div>
                    
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Notes</label>
                        <textarea 
                            rows="5"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={notes} 
                            onChange={(e) => setNotes(e.target.value)} 
                        />
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <input 
                            type="checkbox" 
                            id="completed"
                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                            checked={isCompleted} 
                            onChange={(e) => setIsCompleted(e.target.checked)}
                        />
                        <label htmlFor="completed" className="text-gray-700 font-medium cursor-pointer">
                            Mark this workout as completed
                        </label>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-gray-100 mt-6">
                        <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md">
                            Save Changes
                        </button>
                        <button type="button" onClick={handleDelete} className="flex-1 bg-white text-red-500 border border-red-200 py-3 rounded-lg font-semibold hover:bg-red-50 transition">
                            Delete Workout
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditWorkout;