import React, { useState } from 'react';
import axios from 'axios';
import '../../css/dashboard.css';

const AddExpense = ({ categories, onExpenseAdded }) => {
  // Local form states for controlled inputs
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

  // Pre-fill date with today’s date
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [message, setMessage] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload

    // Basic client-side validation
    if (!amount || !description || !category) {
      setMessage('All fields are required except date.');
      return;
    }

    try {
      // Send POST request to create expense
      await axios.post(
        `${process.env.REACT_APP_API_URL}/expenses`,
        { amount, description, category, date },
        { withCredentials: true } // Attach session cookie for authentication
      );

      setMessage('Expense added successfully ✅');
      // Reset form after submission
      setAmount('');
      setDescription('');
      setCategory('');
      setDate('');

      // Callback to refresh expenses and summary on Dashboard
      if (onExpenseAdded) {
        onExpenseAdded();
      }
    } catch (err) {
      const error = err.response?.data?.message || 'Something went wrong';
      setMessage(error);
    }
  };

  return (
    <div className="card-box">
      <h3>Add a New Expense</h3>

      {/* Expense input form */}
      <form onSubmit={handleSubmit} className="form-group expense-form">
        {/* Amount */}
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="input-field"
          required
        />

        {/* Description */}
        <input
          type="text"
          placeholder="e.g. Grocery shopping"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input-field"
          required
        />

        {/* Category dropdown */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="input-field"
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Optional date */}
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="input-field"
        />

        {/* Submit */}
        <button type="submit" className="btn-primary">
          Add Expense
        </button>
      </form>

      {/* Show success/error message */}
      {message && <div className="form-message">{message}</div>}
    </div>
  );
};

export default AddExpense;
