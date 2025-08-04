import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/profile.css';

const UpdateUserInfo = () => {
  // Local state for the form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [currency, setCurrency] = useState('CAD');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [savingGoal, setSavingGoal] = useState('');
  const [message, setMessage] = useState('');

  // Load current user info
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/profile`, {
          withCredentials: true,
        });

        const user = res.data.user;
        setFirstName(user.firstName || '');
        setLastName(user.lastName || '');
        setCurrency(user.currency || 'CAD');
        setMonthlyIncome(user.monthlyIncome || '');
        setSavingGoal(user.savingGoal || '');
      } catch (err) {
        setMessage('Failed to load user info.');
        console.error(err.message);
      }
    };

    fetchUserInfo();
  }, []);

  // Submit updated info to the server
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/profile`,
        {
          firstName,
          lastName,
          currency,
          monthlyIncome,
          savingGoal,
        },
        { withCredentials: true }
      );

      setMessage('Profile updated successfully ✅');
    } catch (err) {
      console.error(err.message);
      setMessage('Update failed. Please try again.');
    }
  };

  return (
    <div className="card-box">
      <h3>Update Your Information</h3>

      {/* Profile update form */}
      <form onSubmit={handleSubmit} className="form-group">

        {/* First Name */}
        <label>First Name:</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="input-field"
        />

        {/* Last Name */}
        <label>Last Name:</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="input-field"
        />

        {/* Currency – only one per account */}
        <label>Preferred Currency:</label>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="input-field"
        >
          <option value="CAD">CAD</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
        </select>

        {/* Monthly Income */}
        <label>Monthly Income ($):</label>
        <input
          type="number"
          value={monthlyIncome}
          onChange={(e) => setMonthlyIncome(Number(e.target.value))}
          className="input-field"
          min="0"
        />

        {/* Saving Goal */}
        <label>Saving Goal ($):</label>
        <input
          type="number"
          value={savingGoal}
          onChange={(e) => setSavingGoal(Number(e.target.value))}
          className="input-field"
          min="0"
        />

        {/* Submit Button */}
        <button type="submit" className="btn-primary">
          Update Info
        </button>
      </form>

      {/* Show message after submission */}
      {message && <div className="form-message">{message}</div>}
    </div>
  );
};

export default UpdateUserInfo;
