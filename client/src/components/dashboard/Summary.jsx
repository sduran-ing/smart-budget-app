import React from 'react';
import { ProgressBar } from 'react-bootstrap'; //  Import ProgressBar from react-bootstrap
import '../../css/dashboard.css';

const Summary = ({ summary }) => {
  // Extract values from summary object, set defaults in case values are missing
  const {
    totalSpent = 0,
    monthlyIncome = 0,
    savingGoal = 0,
    savings = 0,
    suggestInvestment = false,
  } = summary;

  // Calculate how much of the monthly income was spent (as a percentage)
  const progressPercent = monthlyIncome
    ? Math.min((totalSpent / monthlyIncome) * 100, 100) // Max 100%
    : 0;

  // Determine CSS class for savings (green if positive, red if negative)
  const savingsColor = savings >= 0 ? 'green-text' : 'red-text';
  const goalReached = savingGoal > 0 && savings >= savingGoal;

  return (
    <div className="card-box">
      <h3>Monthly Summary</h3>

      {/* Label for spending summary */}
      <div className="progress-label">
        Total Spent: ${totalSpent.toFixed(2)} / ${monthlyIncome.toFixed(2)}
      </div>

      {/* Bootstrap progress bar */}
      <ProgressBar
        now={progressPercent}
        label={`${progressPercent.toFixed(0)}%`}
        variant={progressPercent < 75 ? 'info' : progressPercent < 100 ? 'warning' : 'danger'}
        className="mb-3"
      />

      {/* Savings indicator */}
      <div className={`savings-text ${savingsColor}`}>
        Savings: {savings >= 0 ? '+' : '-'}${Math.abs(savings).toFixed(2)}
      </div>

      {/* Saving goal feedback */}
      {savingGoal > 0 && (
        <div className="goal-status">
          Your saving goal this month is: <strong>${savingGoal.toFixed(2)}</strong>
          <br />
          {goalReached ? (
            <span className="green-text">✅ Goal reached!</span>
          ) : (
            <span className="red-text">📉 Not yet reached.</span>
          )}
        </div>
      )}

      {/* Investment suggestion box (only if savings ≥ savingGoal) */}
      {suggestInvestment && (
        <div className="suggestion-box">
          🎯 Great job! You're saving more than your goal.
          <br />
          Consider investing your extra funds.
        </div>
      )}
    </div>
  );
};

export default Summary;
