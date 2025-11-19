import React from 'react'
import { Link } from 'react-router-dom'

const WorkoutCard = ({ id, date, notes, isCompleted }) => {
  // Format date to look nice
  const formattedDate = new Date(date).toLocaleDateString();

  return (
      <div className="card" style={{ 
          border: '1px solid #ccc', 
          padding: '20px', 
          borderRadius: '10px', 
          margin: '10px',
          backgroundColor: isCompleted ? '#e6fffa' : '#fff5f5'
      }}>
          <div className="top-container">
             {/* Can add a link to view specific exercises if we build that page */}
              <h3>{formattedDate}</h3>
              <span className="status-badge">
                {isCompleted ? "✅ Completed" : "🚧 In Progress"}
              </span>
          </div>
          <div className="bottom-container">
              <p>{notes || "No notes for this workout."}</p>
              <Link to={`/edit/${id}`}>
                <button className="outline">Edit / Details</button>
              </Link>
          </div>
      </div>
  );
}

export default WorkoutCard;