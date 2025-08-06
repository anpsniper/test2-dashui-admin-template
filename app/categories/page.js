// app/categories/page.js
'use client'; // This directive marks the component as a Client Component

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/AuthOy'; // Adjust path based on your actual structure
import { useRouter } from 'next/navigation'; // For Next.js App Router navigation
import axios from 'axios'; // Assuming axios is installed

// --- Modals for CRUD operations (Category specific) ---

const AddCategoryModal = ({ show, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [image, setImage] = useState('https://placehold.co/640x480/cccccc/333333?text=Category'); // Default image

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, image });
    // Clear form after submission
    setName('');
    setImage('https://placehold.co/640x480/cccccc/333333?text=Category');
  };

  if (!show) return null;

  return (
    // Bootstrap Modal structure
    <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} aria-modal="true" role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-3 shadow-lg">
          <div className="modal-header">
            <h5 className="modal-title h2 text-dark">Add New Category</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label fw-bold" htmlFor="add-category-name">
                  Category Name
                </label>
                <input
                  type="text"
                  id="add-category-name"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold" htmlFor="add-category-image">
                  Image URL
                </label>
                <input
                  type="url"
                  id="add-category-image"
                  className="form-control"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="modal-footer d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                Add Category
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const EditCategoryModal = ({ show, onClose, onSave, categoryToEdit }) => {
  const [name, setName] = useState(categoryToEdit?.name || '');
  const [image, setImage] = useState(categoryToEdit?.image || '');

  useEffect(() => {
    // Update state when categoryToEdit changes
    if (categoryToEdit) {
      setName(categoryToEdit.name || '');
      setImage(categoryToEdit.image || '');
    }
  }, [categoryToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, image });
  };

  if (!show || !categoryToEdit) return null;

  return (
    // Bootstrap Modal structure
    <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} aria-modal="true" role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-3 shadow-lg">
          <div className="modal-header">
            <h5 className="modal-title h2 text-dark">Edit Category: {categoryToEdit.name}</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label fw-bold" htmlFor="edit-category-name">
                  Category Name
                </label>
                <input
                  type="text"
                  id="edit-category-name"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold" htmlFor="edit-category-image">
                  Image URL
                </label>
                <input
                  type="url"
                  id="edit-category-image"
                  className="form-control"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="modal-footer d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-success"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const DeleteConfirmModal = ({ show, onClose, onConfirm, categoryToDelete }) => {
  if (!show || !categoryToDelete) return null;

  return (
    // Bootstrap Modal structure
    <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} aria-modal="true" role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-3 shadow-lg">
          <div className="modal-header">
            <h5 className="modal-title h2 text-dark">Confirm Deletion</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <p className="text-dark">
              Are you sure you want to delete category <span className="fw-semibold">{categoryToDelete.name}</span> (ID: {categoryToDelete.id})? This action cannot be undone.
            </p>
          </div>
          <div className="modal-footer d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={onConfirm}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main CategoriesPage Component ---
export default function CategoriesPage() {
  // Consume authentication state from the global AuthContext
  const { user, isAuthenticated, loading, logout } = useAuth();
  const router = useRouter(); // Next.js router for navigation

  // Component-specific states for category data, loading, errors, and modals
  const [categories, setCategories] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // States for CRUD modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null); // Category currently being edited/deleted

  // States for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default items per page

  // State for search filter (only by name for categories)
  const [searchName, setSearchName] = useState('');

  // API Endpoint for CRUD operations
  const API_BASE_URL = 'https://api.escuelajs.co/api/v1/categories'; // Using escuelajs for categories as it's consistent

  // Effect to handle authentication and data fetching
  useEffect(() => {
    // Only proceed if the authentication state from useAuth has finished loading
    if (!loading) {
      if (!isAuthenticated) {
        // If not authenticated, redirect to the login page
        router.push('/login');
      } else {
        fetchCategories();
      }
    }
  }, [loading, isAuthenticated, user, router]); // Dependencies: auth states and router

  // Function to fetch category data from the API
  const fetchCategories = async () => {
    setPageLoading(true); // Set page loading to true before fetching
    setError(''); // Clear any previous errors
    setSuccessMessage(''); // Clear any previous success messages
    try {
      const response = await axios.get(API_BASE_URL);
      setCategories(response.data); // Update categories state with fetched data
      console.log('Categories fetched successfully:', response.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setError('Failed to load categories. Please try again later.'); // Set error message
    } finally {
      setPageLoading(false); // Set page loading to false after fetch attempt
    }
  };

  // --- CRUD Operation Handlers ---

  // Handle adding a new category
  const handleAddCategory = async (categoryData) => {
    setError('');
    setSuccessMessage('');
    try {
      const response = await axios.post(API_BASE_URL, categoryData);
      setShowAddModal(false); // Close the add category modal
      setSuccessMessage('Category added successfully!'); // Show success message
      fetchCategories(); // Re-fetch categories to update the table
    } catch (err) {
      console.error('Failed to add category:', err);
      setError(`Failed to add category: ${err.response?.data?.message || err.message || 'Please check the data and try again.'}`);
    }
  };

  // Handle editing an existing category
  const handleEditCategory = async (categoryData) => {
    setError('');
    setSuccessMessage('');
    if (!currentCategory) return; // Ensure a category is selected for editing

    try {
      // Platzi API uses PUT for update, sending only changed fields is fine
      const response = await axios.put(`${API_BASE_URL}/${currentCategory.id}`, categoryData);
      setShowEditModal(false); // Close the edit category modal
      setSuccessMessage('Category updated successfully!'); // Show success message
      fetchCategories(); // Re-fetch categories to update the table
    } catch (err) {
      console.error('Failed to update category:', err);
      setError(`Failed to update category: ${err.response?.data?.message || err.message || 'Please try again.'}`);
    }
  };

  // Handle deleting a category
  const handleDeleteCategory = async () => {
    setError('');
    setSuccessMessage('');
    if (!currentCategory) return; // Ensure a category is selected for deletion

    try {
      await axios.delete(`${API_BASE_URL}/${currentCategory.id}`);
      setShowDeleteConfirm(false); // Close the delete confirmation modal
      setSuccessMessage('Category deleted successfully!'); // Show success message
      fetchCategories(); // Re-fetch categories to update the table
    } catch (err) {
      console.error('Failed to delete category:', err);
      setError(`Failed to delete category: ${err.response?.data?.message || err.message || 'Please try again.'}`);
    }
  };

  // --- Pagination and Search Filtering Logic ---
  const filteredCategories = categories.filter((cat) => {
    const nameMatch = cat.name.toLowerCase().includes(searchName.toLowerCase());
    return nameMatch;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirstItem, indexOfLastItem); // Get categories for the current page
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage); // Calculate total pages based on filtered categories

  // Function to change the current page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle change in items per page dropdown
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value)); // Update items per page
    setCurrentPage(1); // Reset to the first page when items per page changes
  };

  // --- Conditional Rendering based on Authentication State ---

  // Show loading spinner while authentication state is being determined
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="d-flex align-items-center text-secondary">
          <div className="spinner-border text-primary me-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          Checking permissions...
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4"> {/* Using container-fluid for wider layout */}
      <div className="card shadow-lg rounded-3">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h3 text-dark mb-0">Manage Categories</h1>
            <div className="d-flex align-items-center gap-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="btn btn-primary shadow-sm d-flex align-items-center"
              >
                <svg className="me-2" width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                Add Category
              </button>
            </div>
          </div>

          {/* Search Filters Section */}
          <div className="mb-4 p-3 bg-light rounded-3 shadow-sm">
            <h5 className="h5 text-dark mb-3">Filter Categories</h5>
            <div className="row g-3">
              <div className="col-md-6"> {/* Adjusted column width for single filter */}
                <label htmlFor="search-category-name" className="form-label small fw-bold">Category Name</label>
                <input
                  type="text"
                  id="search-category-name"
                  className="form-control"
                  placeholder="Search by category name..."
                  value={searchName}
                  onChange={(e) => {
                    setSearchName(e.target.value);
                    setCurrentPage(1); // Reset pagination on search
                  }}
                />
              </div>
            </div>
          </div>

          {/* Error and Success Message Display */}
          {error && (
            <div className="alert alert-danger" role="alert">
              <strong className="fw-bold">Error!</strong>
              <span className="d-block d-sm-inline"> {error}</span>
            </div>
          )}
          {successMessage && (
            <div className="alert alert-success" role="alert">
              <strong className="fw-bold">Success!</strong>
              <span className="d-block d-sm-inline"> {successMessage}</span>
            </div>
          )}

          {/* Conditional rendering for category table or loading spinner */}
          {pageLoading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading categories...</span>
              </div>
              <span className="ms-3 text-secondary">Loading categories...</span>
            </div>
          ) : (
            <div className="table-responsive rounded-3 border shadow-sm">
              <table className="table table-striped table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col" className="text-start text-muted text-uppercase small fw-medium">
                      ID
                    </th>
                    <th scope="col" className="text-start text-muted text-uppercase small fw-medium">
                      Name
                    </th>
                    <th scope="col" className="text-start text-muted text-uppercase small fw-medium">
                      Image
                    </th>
                    <th scope="col" className="text-start text-muted text-uppercase small fw-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentCategories.map((cat) => (
                    <tr key={cat.id}>
                      <td className="text-nowrap small text-dark">{cat.id}</td>
                      <td className="text-nowrap small text-dark">{cat.name}</td>
                      <td className="text-nowrap small text-dark">
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="rounded border border-light shadow-sm"
                          style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                          // Fallback for broken images
                          onError={(e) => {
                            e.target.onerror = null; // Prevents infinite loop if fallback also fails
                            e.target.src = `https://placehold.co/60x60/cccccc/333333?text=N/A`; // Placeholder image
                          }}
                        />
                      </td>
                      <td className="text-end text-nowrap small fw-medium">
                        <button
                          onClick={() => {
                            setCurrentCategory(cat);
                            setShowEditModal(true);
                          }}
                          className="btn btn-link text-info me-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setCurrentCategory(cat);
                            setShowDeleteConfirm(true);
                          }}
                          className="btn btn-link text-danger"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {currentCategories.length === 0 && !pageLoading && (
                    <tr>
                      <td colSpan="4" className="text-center text-muted py-4">No categories found matching your criteria.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination and Data Info Section */}
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center mt-4">
            {/* Total Data Count (aligned left) */}
            <div className="text-secondary mb-3 mb-sm-0">
              Total Categories: <span className="fw-semibold">{filteredCategories.length}</span>
            </div>

            {/* Pagination Controls (aligned center) */}
            <nav className="d-flex align-items-center justify-content-center mb-3 mb-sm-0" aria-label="Pagination">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn btn-outline-secondary rounded-start"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={`btn ${currentPage === i + 1 ? 'btn-primary' : 'btn-outline-secondary'}`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="btn btn-outline-secondary rounded-end"
              >
                Next
              </button>
            </nav>

            {/* Show Data Per Page (aligned right) */}
            <div className="d-flex align-items-center">
              <label htmlFor="items-per-page" className="text-secondary me-2">
                Show:
              </label>
              <select
                id="items-per-page"
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="form-select w-auto" // w-auto to prevent full width
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
              <span className="ms-2 text-secondary">per page</span>
            </div>
          </div>
        </div>
      </div>

      {/* Render Modals for CRUD operations */}
      <AddCategoryModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddCategory}
      />
      <EditCategoryModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleEditCategory}
        categoryToEdit={currentCategory}
      />
      <DeleteConfirmModal
        show={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteCategory}
        categoryToDelete={currentCategory}
      />
    </div>
  );
}
