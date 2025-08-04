import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';

const DeleteExpense = ({ show, onHide, expense, onDeleteSuccess }) => {
  // Function to handle deletion request
  const handleDelete = async () => {
    try {
      // Send DELETE request to API using the expense ID
      await axios.delete(`${process.env.REACT_APP_API_URL}/expenses/${expense._id}`, {
        withCredentials: true,
      });
      onDeleteSuccess(); // Refresh data in Dashboard after deletion
      onHide();          // Close the modal
    } catch (err) {
      console.error('Error deleting expense:', err.message);
    }
  };

  return (
    <Modal show={show} onHide={onHide} backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Deletion</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Show a simple confirmation message */}
        <p>
          Are you sure you want to delete this expense:
          <strong> "{expense?.description}"</strong>?
        </p>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteExpense;
