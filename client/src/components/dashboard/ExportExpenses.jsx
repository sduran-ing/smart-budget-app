import React from 'react';
import { Button } from 'react-bootstrap';
import { utils, writeFile } from 'xlsx';

// This component accepts expenses and currency as props
const ExportExpenses = ({ expenses, currency, selectedMonth }) => {
  // Format the data for Excel/CSV export
  const handleDownload = () => {
    if (!expenses || expenses.length === 0) {
      alert('No expenses available to download.');
      return;
    }

    // Map each expense to a plain object with readable keys
    const dataToExport = expenses.map((expense) => ({
      Date: new Date(expense.date).toLocaleDateString(),
      Description: expense.description,
      Category: expense.category?.name || 'Unknown',
      [`Amount (${currency})`]: expense.amount.toFixed(2),
    }));

    // Convert to worksheet
    const worksheet = utils.json_to_sheet(dataToExport);

    // Create a workbook and append the worksheet
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Expenses');

    // Format filename using month and year
    const fileName = `${selectedMonth}_Expenses.xlsx`;

    // Download the file as an Excel-compatible .xlsx file
    writeFile(workbook, fileName);
  };

  return (
    <div className="csv-button-wrapper">
      <Button variant="success" onClick={handleDownload}>
        Export Expenses
      </Button>
    </div>
  );
};

export default ExportExpenses;
