import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddCategory from '../categories/AddCategory';
import EditCategory from '../categories/EditCategory';
import DeleteCategory from '../categories/DeleteCategory';
import '../../css/profile.css';

const CategoryManager = () => {
  // State to hold the list of categories
  const [categories, setCategories] = useState([]);

  // Modal states for Edit/Delete actions
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Load all categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch categories from the API
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/categories`, {
        withCredentials: true,
      });
      setCategories(res.data);
    } catch (err) {
      console.error('Error fetching categories:', err.message);
    }
  };

  // Trigger edit modal with the selected category
  const handleEdit = (category) => {
    setSelectedCategory(category);
    setShowEditModal(true);
  };

  // Trigger delete modal with the selected category
  const handleDelete = (category) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  return (
    <div className="card-box">
      <h3>Manage Your Categories</h3>

      {/* Add New Category Form */}
      <AddCategory onCategoryAdded={fetchCategories} />

      {/* List of existing categories */}
      <ul className="category-list">
        {categories.length === 0 ? (
          <p>You have not created any categories yet.</p>
        ) : (
          categories.map((cat) => (
            <li key={cat._id} className="category-item">
              {cat.name}
              <span>
                <button className="btn-small btn-edit" onClick={() => handleEdit(cat)}>Edit</button>
                <button className="btn-small btn-delete" onClick={() => handleDelete(cat)}>Delete</button>
              </span>
            </li>
          ))
        )}
      </ul>

      {/* Edit Category Modal */}
      <EditCategory
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        category={selectedCategory}
        onUpdate={fetchCategories}
      />

      {/* Delete Category Modal */}
      <DeleteCategory
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        category={selectedCategory}
        onDeleteSuccess={fetchCategories}
      />
    </div>
  );
};

export default CategoryManager;
