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
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

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
        setIsSaving(true);
        try {
            await updateWorkout(id, { date, notes, is_completed: isCompleted });
            navigate('/');
        } catch (error) {
            console.error(error);
            alert("Update failed");
        } finally {
            setIsSaving(false);
        }
    }

    const handleDelete = async () => {
        if (window.confirm("⚠️ Are you sure you want to delete this workout? This action cannot be undone.")) {
            setIsDeleting(true);
            try {
                await deleteWorkout(id);
                navigate('/');
            } catch (error) {
                console.error(error);
                alert("Delete failed");
                setIsDeleting(false);
            }
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-600 font-medium">Loading workout details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
            <div className="max-w-3xl mx-auto px-4">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                            ✏️ Edit Workout
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Update your workout details or mark as completed
                        </p>
                    </div>
                    <button 
                        onClick={() => navigate('/')}
                        className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200"
                        title="Back to Dashboard"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                {/* Form Card */}
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                    <form onSubmit={handleUpdate} className="space-y-6">
                        {/* Date Field */}
                        <div>
                            <label className="block text-gray-800 font-bold mb-3 text-sm uppercase tracking-wide">
                                📅 Workout Date
                            </label>
                            <input 
                                type="date" 
                                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-gray-700 font-medium"
                                value={date} 
                                onChange={(e) => setDate(e.target.value)} 
                            />
                        </div>
                        
                        {/* Notes Field */}
                        <div>
                            <label className="block text-gray-800 font-bold mb-3 text-sm uppercase tracking-wide">
                                💬 Workout Notes
                            </label>
                            <textarea 
                                rows="6"
                                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-gray-700 resize-none"
                                placeholder="Add details about your workout..."
                                value={notes} 
                                onChange={(e) => setNotes(e.target.value)} 
                            />
                        </div>

                        {/* Completion Status */}
                        <div className="bg-gradient-to-r from-blue-50 to-green-50 p-5 rounded-xl border-2 border-blue-100">
                            <div className="flex items-center gap-4">
                                <input 
                                    type="checkbox" 
                                    id="completed"
                                    className="w-6 h-6 text-green-600 rounded-lg focus:ring-2 focus:ring-green-500 cursor-pointer"
                                    checked={isCompleted} 
                                    onChange={(e) => setIsCompleted(e.target.checked)}
                                />
                                <label htmlFor="completed" className="text-gray-800 font-bold cursor-pointer flex-1">
                                    {isCompleted ? '✅ Workout Completed!' : '📋 Mark as Completed'}
                                </label>
                                {isCompleted && (
                                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-200">
                                        DONE
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-gray-600 mt-2 ml-10">
                                {isCompleted 
                                    ? 'Great job! Keep up the momentum.' 
                                    : 'Check this box once you\'ve completed this workout.'}
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t-2 border-gray-100">
                            <button 
                                type="submit" 
                                disabled={isSaving || isDeleting}
                                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {isSaving ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Saving...
                                    </span>
                                ) : (
                                    '✓ Save Changes'
                                )}
                            </button>
                            <button 
                                type="button" 
                                onClick={handleDelete}
                                disabled={isSaving || isDeleting}
                                className="flex-1 bg-white text-red-600 border-2 border-red-300 py-4 rounded-xl font-bold hover:bg-red-50 hover:border-red-400 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isDeleting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                                        Deleting...
                                    </span>
                                ) : (
                                    '🗑️ Delete Workout'
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Warning Card */}
                <div className="mt-6 bg-red-50 border-2 border-red-200 rounded-xl p-6">
                    <h3 className="font-bold text-red-900 mb-2 flex items-center gap-2">
                        ⚠️ Warning
                    </h3>
                    <p className="text-red-800 text-sm leading-relaxed">
                        Deleting a workout is permanent and cannot be undone. Make sure you want to remove this entry before confirming.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default EditWorkout;