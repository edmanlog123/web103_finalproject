import React from 'react';
import { Link } from 'react-router-dom';

const WorkoutCard = ({ id, date, notes, isCompleted }) => {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'short', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  });

  return (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200">
      <div className={`h-1.5 w-full transition-all duration-300 ${isCompleted ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gradient-to-r from-yellow-400 to-orange-500'}`}></div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{formattedDate}</h3>
            <p className="text-xs text-gray-500 mt-1">{new Date(date).toLocaleDateString('en-US', { weekday: 'long' })}</p>
          </div>
          <span className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm
            ${isCompleted ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-yellow-100 text-yellow-700 border border-yellow-200'}`}>
            {isCompleted ? "✓ Done" : "📋 Plan"}
          </span>
        </div>
        
        <p className="text-gray-600 mb-6 text-sm line-clamp-3 min-h-[60px] leading-relaxed">
          {notes || "No additional notes for this workout session."}
        </p>
        
        <Link to={`/edit/${id}`}>
          <button className="w-full py-3 px-4 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-500 hover:to-blue-600 text-blue-600 hover:text-white font-semibold rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
            View Details & Edit →
          </button>
        </Link>
      </div>
    </div>
  );
};

export default WorkoutCard;