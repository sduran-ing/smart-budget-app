import React, { useState } from 'react';
import axios from 'axios';
import '../../css/dashboard.css';

const AddCategory = ({ onCategoryAdded }) => {
  // Local state to hold the category input value
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload

    if (!name.trim()) {
      setMessage('Category name is required.');
      return;
    }

    try {
      // Send POST request to server to create a category
      await axios.post(
        `${process.env.REACT_APP_API_URL}/categories`,
        { name },
        { withCredentials: true } // Include auth cookies
      );

      setMessage('Category added successfully ✅');
      setName(''); // Reset form

      // Callback to parent component to refresh category list
      if (onCategoryAdded) {
        onCategoryAdded();
      }
    } catch (err) {
      const error = err.response?.data?.message || 'Something went wrong';
      setMessage(error);
    }
  };

  return (
    <div className="card-box">
      <h3>Add a New Category</h3>

      {/*  Input form for category */}
      <form onSubmit={handleSubmit} className="form-group">
        <input
          type="text"
          placeholder="e.g. Groceries"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-field"
        />
        <button type="submit" className="btn-primary">
          Add Category
        </button>
      </form>

      {/*  Message box for feedback */}
      {message && <div className="form-message">{message}</div>}
    </div>
  );
};

export default AddCategory;
