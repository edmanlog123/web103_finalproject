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
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      <div className={`h-2 w-full ${isCompleted ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold text-gray-800">{formattedDate}</h3>
          <span className={`px-2 py-1 text-xs font-bold uppercase tracking-wide rounded-full 
            ${isCompleted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {isCompleted ? "Completed" : "Planned"}
          </span>
        </div>
        
        <p className="text-gray-600 mb-6 text-sm line-clamp-3 min-h-[60px]">
          {notes || "No notes provided for this session."}
        </p>
        
        <Link to={`/edit/${id}`}>
          <button className="w-full py-2 px-4 bg-gray-50 hover:bg-blue-50 text-blue-600 font-semibold rounded-lg border border-gray-200 hover:border-blue-200 transition-colors">
            View Details & Edit
          </button>
        </Link>
      </div>
    </div>
  );
};

export default WorkoutCard;