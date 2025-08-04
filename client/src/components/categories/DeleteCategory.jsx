import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';

/**
 * DeleteCategory modal allows a user to confirm and delete a category.
 * Props:
 * - show: boolean → controls visibility of modal
 * - onHide: function → closes the modal
 * - category: object → the selected category to delete
 * - onDeleteSuccess: function → callback to refresh category list
 */
const DeleteCategory = ({ show, onHide, category, onDeleteSuccess }) => {

  const [message, setMessage] = useState('');

  // useEffect to listen for changes to the "show" prop
  // Reset the message whenever the modal is opened/closed
  useEffect(() => {
    if (!show) {
      setMessage('');
    }
  }, [show]);

  // Handle confirmation of deletion
  const handleDelete = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/categories/${category._id}`, {
        withCredentials: true,
      });

      // Refresh categories and close modal after successful deletion
      onDeleteSuccess();
      onHide();
    } catch (err) {
      // Show backend error message
      const errorMsg = err.response?.data?.message || 'Failed to delete category';
      setMessage(errorMsg);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Confirm Deletion</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>
          Are you sure you want to delete category:
          <strong> "{category?.name}"</strong>?
        </p>

        {/* Show error message if arises */}
        {message && <div className="form-message red">{message}</div>}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Confirm Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteCategory;
