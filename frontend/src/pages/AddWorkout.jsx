import React, { useState } from 'react';
import { createWorkout } from '../services/workouts';
import { useNavigate } from 'react-router-dom';

const AddWorkout = () => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createWorkout({ date, notes, is_completed: false });
            navigate('/');
        } catch (error) {
            console.error(error);
            alert("Failed to log workout. Make sure you are logged in.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
            <div className="max-w-3xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                        📝 Log New Workout
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Add a workout session to your training calendar
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                    <form onSubmit={handleSubmit} className="space-y-6">
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
                                required 
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
                                placeholder="Describe your workout session...\n\nExamples:\n- Back and tris\n- Leg day - squats and deadlifts\n- 5K run + core work\n- Upper body strength training"
                                value={notes} 
                                onChange={(e) => setNotes(e.target.value)} 
                            />
                            <p className="mt-2 text-sm text-gray-500">
                                Optional: Add details about exercises, sets, reps, or how you felt
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Saving...
                                    </span>
                                ) : (
                                    '✓ Save Workout'
                                )}
                            </button>
                            <button 
                                type="button" 
                                onClick={() => navigate('/')}
                                disabled={loading}
                                className="sm:w-auto px-8 py-4 bg-white text-gray-700 font-bold rounded-xl border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                ✕ Cancel
                            </button>
                        </div>
                    </form>
                </div>

                {/* Help Card */}
                <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                    <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                        💡 Quick Tip
                    </h3>
                    <p className="text-blue-800 text-sm leading-relaxed">
                        Keep your workout notes concise but informative. Include the main muscle groups, exercises, or any notable achievements. This helps you track progress over time!
                    </p>
                </div>
            </div>
        </div>
    )
}

export default AddWorkout;