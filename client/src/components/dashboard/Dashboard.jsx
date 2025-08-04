import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Import main components for the dashboard
import AddCategory from '../categories/AddCategory';
import Filters from './Filters';
import Summary from './Summary';
import ExpenseChart from './ExpenseChart';
import ExpenseTable from './ExpenseTable';

// Import expenses components
import AddExpense from '../expenses/AddExpense';
import EditExpense from '../expenses/EditExpense'; // Modal for editing expenses
import DeleteExpense from '../expenses/DeleteExpense'; // Modal for deleting expenses
import '../../css/dashboard.css';
import ExportExpenses from './ExportExpenses';

const Dashboard = () => {
  // State for profile and app data
  const [profile, setProfile] = useState({});
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({});

  // Filters
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [selectedCategory, setSelectedCategory] = useState('');

  // 🧠 Modal state management for Edit/Delete
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null); // Holds the currently selected expense for modals

  // Load profile info and summary when component mounts or month changes
  useEffect(() => {
    fetchProfile();       // Only needs to run once per session (but ok to reload monthly)
    fetchCategories();    // Categories don't change by month (but ok to reload monthly)
    fetchSummary();       // Should only run when month changes
  }, [selectedMonth]);

  useEffect(() => {
    fetchExpenses();      // Needs both filters to update the expense table
  }, [selectedMonth, selectedCategory]);

  // Fetch profile info (to check if user has set income/savingGoal)
  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/profile`, { withCredentials: true });
      setProfile(res.data.user);
    } catch (err) {
      console.error('Error fetching profile:', err.message);
    }
  };

  // Load all categories for the user
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/categories`, { withCredentials: true });
      setCategories(res.data);
    } catch (err) {
      console.error('Error fetching categories:', err.message);
    }
  };

  // Load all expenses for selected month and optional category filter
  const fetchExpenses = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/expenses`, { withCredentials: true });
      let filtered = res.data;

      // Apply filters
      if (selectedMonth) {
        filtered = filtered.filter(exp => exp.date.startsWith(selectedMonth));
      }
      if (selectedCategory) {
        // exp.category?._id allows to pinpoint the desired category by ID
        filtered = filtered.filter(exp => exp.category?._id === selectedCategory);
      }

      setExpenses(filtered);
    } catch (err) {
      console.error('Error fetching expenses:', err.message);
    }
  };

  // Get monthly summary: total spent, savings, suggestion, etc.
  const fetchSummary = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/expenses/summary`, {
        // This frontend request will pass "selectedMonth" (e.g. 2025-06) as a query param to the backend
        params: { month: selectedMonth },
        withCredentials: true,
      });
      setSummary(res.data);
    } catch (err) {
      console.error('Error fetching summary:', err.message);
    }
  };

    // Handle Edit button click → open Edit modal
  const handleEdit = (expense) => {
    setSelectedExpense(expense);
    setShowEditModal(true);
  };

  // Handle Delete button click → open Delete modal
  const handleDelete = (expense) => {
    setSelectedExpense(expense);
    setShowDeleteModal(true);
  };

  return (
    <div className="dashboard">
      <h1>Welcome, {profile.firstName || 'User'}!! </h1>

      {/* Suggest user to set up income/savingGoal if missing */}
      {!profile.monthlyIncome || !profile.savingGoal ? (
        <div className="alert-box">
          <strong>Heads up!</strong> Please update your profile with monthly income and saving goal.
        </div>
      ) : null}

      {/* Add Category Form */}
      <AddCategory onCategoryAdded={fetchCategories} />

      {/* Add Expense Form – only show if user has categories */}
      {categories.length === 0 ? (
        <div className="alert-box red">Create at least one category to start adding expenses.</div>
      ) : (
        <AddExpense categories={categories} onExpenseAdded={() => { fetchExpenses(); fetchSummary(); }} />
      )}

      {/* Filters for month and category */}
      <Filters
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories}
      />

      {/* Table of expenses + Edit/Delete handlers */}
      <ExpenseTable
        expenses={expenses}
        currency={profile.currency || 'CAD'}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Export button to download the expenses table */}
      <ExportExpenses
        expenses={expenses}
        currency={profile.currency || 'CAD'}
        selectedMonth={selectedMonth}
      />

      {/* Modal for editing an expense */}
      <EditExpense
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        expense={selectedExpense}
        onUpdate={() => { fetchExpenses(); fetchSummary(); }}
        categories={categories} // Pass the list of categories for the dropbox in EditExpense mondal
      />

      {/* Modal for confirming deletion */}
      <DeleteExpense
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        expense={selectedExpense}
        onDeleteSuccess={() => { fetchExpenses(); fetchSummary(); }}
      />

      {/* Summary Section: progress, savings, suggestion */}
      <Summary summary={summary} />

      {/* Pie or Bar Chart by category */}
      <ExpenseChart data={summary.spendingByCategory || []} />

    </div>
  );
};

export default Dashboard;
