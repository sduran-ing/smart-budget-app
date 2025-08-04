import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

/**
 * EditCategory modal allows user to rename an existing category.
 * Props:
 * - show: boolean → controls visibility of modal
 * - onHide: function → closes the modal
 * - category: object → the selected category to edit
 * - onUpdateSuccess: function → callback to refresh the category list
 */
const EditCategory = ({ show, onHide, category, onUpdateSuccess }) => {
  // Local state to hold the new name value
  const [newName, setNewName] = useState('');

  // Update the input field whenever a new category is passed
  useEffect(() => {
    if (category) {
      setNewName(category.name);
    }
  }, [category]);

  // Submit the update request
  const handleUpdate = async () => {
    if (!newName.trim()) return;

    try {
      // PUT request to update category name
      await axios.put(
        `${process.env.REACT_APP_API_URL}/categories/${category._id}`,
        { name: newName },
        { withCredentials: true }
      );

      // Refresh data and close modal
      onUpdateSuccess();
      onHide();
    } catch (err) {
      console.error('Update Category Error:', err.message);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Edit Category</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form.Group controlId="formCategoryName">
          <Form.Label>New Category Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter category name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </Form.Group>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleUpdate}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditCategory;
