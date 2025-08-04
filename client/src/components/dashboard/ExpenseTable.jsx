import React from 'react';
import '../../css/dashboard.css';

const ExpenseTable = ({ expenses, onEdit, onDelete }) => {
  // Calculate total amount for all expenses in current view
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="card-box">
      <h3>Expense Table</h3>

      {/* Show message if no records */}
      {expenses.length === 0 ? (
        <p>No expenses found for this filter.</p>
      ) : (
        <div className="table-container">
          <table className="expense-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Amount ($)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Loop through each expense to show it in a row */}
              {expenses.map((exp) => (
                <tr key={exp._id}>
                  <td>{new Date(exp.date).toLocaleDateString()}</td>
                  <td>{exp.description}</td>
                  <td>{exp.category?.name || 'Unknown'}</td>
                  <td>{exp.amount.toFixed(2)}</td>
                  <td>
                    <button
                      className="btn-small btn-edit"
                      onClick={() => onEdit(exp)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-small btn-delete"
                      onClick={() => onDelete(exp)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {/* Total row */}
              <tr className="total-row">
                <td colSpan="3"><strong>Total:</strong></td>
                <td colSpan="2"><strong>${total.toFixed(2)}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExpenseTable;
