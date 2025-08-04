import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const EditExpense = ({ show, onHide, expense, onUpdate, categories }) => {
  // Local state to hold form fields
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [categoryId, setCategoryId] = useState(''); // stores selected category ID

  // When modal opens or selected expense changes, populate the form fields
  useEffect(() => {
    if (expense) {
      setDescription(expense.description || '');
      setAmount(expense.amount || '');
      setDate(expense.date?.slice(0, 10) || ''); // format for input type="date"
      setCategoryId(expense.category?._id || expense.category || ''); // handle both populated and raw _id
    }
  }, [expense]);

  // Handle form submission to update expense
  const handleUpdate = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/expenses/${expense._id}`,
        { description, amount, date, category: categoryId },
        { withCredentials: true }
      );

      onUpdate(); // Refresh data in parent
      onHide();   // Close modal
    } catch (err) {
      console.error('Error updating expense:', err.message);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Expense</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          {/* Description input */}
          <Form.Group controlId="editDescription" className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          {/* Amount input */}
          <Form.Group controlId="editAmount" className="mb-3">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </Form.Group>

          {/* Date input */}
          <Form.Group controlId="editDate" className="mb-3">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Form.Group>

          {/* Dropdown for category selection */}
          <Form.Group controlId="editCategory" className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">-- Select a Category --</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Form>
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

export default EditExpense;
