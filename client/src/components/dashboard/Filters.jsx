import React from 'react';
import '../../css/dashboard.css';

const Filters = ({
  selectedMonth,
  onMonthChange,
  selectedCategory,
  onCategoryChange,
  categories,
}) => {

  return (
    <div className="card-box">
      <h3>Filters</h3>

      <div className="form-group">
        {/* Filter by Month */}
        <label>Filter by Month:</label>
        {/* The input type "month" shows a calendar for selecting year and month */}
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => onMonthChange(e.target.value)}
          className="input-field"
        />

        {/* Filter by Category */}
        <label>Filter by Category:</label>
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="input-field"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Filters;
