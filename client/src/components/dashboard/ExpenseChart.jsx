import React from 'react';
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import '../../css/dashboard.css';

// Define a color palette for each category slice
const COLORS = ['#5c9ead', '#ffc107', '#fd7e14', '#6f42c1', '#20c997', '#ef476f'];

const ExpenseChart = ({ data }) => {
  // Ensure there's something to show
  if (!data || data.length === 0) {
    return <p>No expense data available for this month.</p>;
  }

  return (
    <div className="card-box">
      <h3>Spending by Category</h3>

      {/* Responsive pie chart using Recharts */}
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          {/* Pie section with props for layout and label */}
          <Pie
            data={data}
            dataKey="total"         // The value to chart (total spent)
            nameKey="category"  // The label to show
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {/* Dynamically assign a color to each slice */}
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          {/* Tooltip shows value on hover */}
          <Tooltip />

          {/* Legend for categories */}
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseChart;
