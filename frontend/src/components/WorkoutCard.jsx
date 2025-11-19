import React from 'react';
import { Link } from 'react-router-dom';

const WorkoutCard = ({ id, date, notes, isCompleted }) => {
  const formattedDate = new Date(date).toLocaleDateString(undefined, {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
  });

  return (
    <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition-shadow duration-300 border-l-4 border-blue-500">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-800">{formattedDate}</h3>
        <span className={`px-2 py-1 rounded text-xs font-semibold ${isCompleted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
          {isCompleted ? "Completed" : "In Progress"}
        </span>
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-3">
        {notes || "No notes for this workout."}
      </p>
      
      <Link to={`/edit/${id}`}>
        <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors">
          View Details
        </button>
      </Link>
    </div>
  );
};

export default WorkoutCard;