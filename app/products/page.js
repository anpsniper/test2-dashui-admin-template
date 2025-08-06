// app/products/page.js
'use client'; // This directive marks the component as a Client Component

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/AuthOy'; // Adjust path based on your actual structure
import { useRouter } from 'next/navigation'; // For Next.js App Router navigation
import axios from 'axios'; // Assuming axios is installed

// --- Modals for CRUD operations (Product specific) ---

const AddProductModal = ({ show, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [images, setImages] = useState(''); // Comma-separated URLs
  const [categories, setCategories] = useState([]); // To populate category dropdown

  useEffect(() => {
    const fetchCategoriesForDropdown = async () => {
      try {
        const response = await axios.get('https://api.escuelajs.co/api/v1/categories');
        setCategories(response.data);
        if (response.data.length > 0) {
          setCategoryId(response.data[0].id); // Set default to first category
        }
      } catch (error) {
        console.error('Failed to fetch categories for dropdown:', error);
      }
    };
    fetchCategoriesForDropdown();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      title,
      price: parseFloat(price), // Ensure price is a number
      description,
      categoryId: parseInt(categoryId), // Ensure categoryId is an integer
      images: images.split(',').map(img => img.trim()).filter(img => img !== ''), // Convert comma-separated string to array
    });
    // Clear form after submission
    setTitle('');
    setPrice('');
    setDescription('');
    setCategoryId(categories.length > 0 ? categories[0].id : '');
    setImages('');
  };

  if (!show) return null;

  return (
    // Bootstrap Modal structure
    <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} aria-modal="true" role="dialog">
      <div className="modal-dialog modal-dialog-centered modal-lg"> {/* Larger modal for products */}
        <div className="modal-content rounded-3 shadow-lg">
          <div className="modal-header">
            <h5 className="modal-title h2 text-dark">Add New Product</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label fw-bold" htmlFor="add-product-title">
                  Product Title
                </label>
                <input
                  type="text"
                  id="add-product-title"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold" htmlFor="add-product-price">
                  Price
                </label>
                <input
                  type="number"
                  id="add-product-price"
                  className="form-control"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold" htmlFor="add-product-description">
                  Description
                </label>
                <textarea
                  id="add-product-description"
                  className="form-control"
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold" htmlFor="add-product-category">
                  Category
                </label>
                <select
                  id="add-product-category"
                  className="form-select"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold" htmlFor="add-product-images">
                  Image URLs (comma-separated)
                </label>
                <input
                  type="text"
                  id="add-product-images"
                  className="form-control"
                  placeholder="e.g., url1, url2, url3"
                  value={images}
                  onChange={(e) => setImages(e.target.value)}
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
                Add Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const EditProductModal = ({ show, onClose, onSave, productToEdit }) => {
  const [title, setTitle] = useState(productToEdit?.title || '');
  const [price, setPrice] = useState(productToEdit?.price || '');
  const [description, setDescription] = useState(productToEdit?.description || '');
  const [categoryId, setCategoryId] = useState(productToEdit?.category?.id || '');
  const [images, setImages] = useState(productToEdit?.images?.join(', ') || ''); // Convert array to comma-separated string
  const [categories, setCategories] = useState([]); // To populate category dropdown

  useEffect(() => {
    const fetchCategoriesForDropdown = async () => {
      try {
        const response = await axios.get('https://api.escuelajs.co/api/v1/categories');
        setCategories(response.data);
        // Ensure categoryId is set if productToEdit has one, or default to first
        if (productToEdit?.category?.id) {
          setCategoryId(productToEdit.category.id);
        } else if (response.data.length > 0) {
          setCategoryId(response.data[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch categories for dropdown:', error);
      }
    };
    fetchCategoriesForDropdown();
  }, [productToEdit]); // Re-fetch categories if productToEdit changes

  useEffect(() => {
    // Update state when productToEdit changes
    if (productToEdit) {
      setTitle(productToEdit.title || '');
      setPrice(productToEdit.price || '');
      setDescription(productToEdit.description || '');
      setCategoryId(productToEdit.category?.id || (categories.length > 0 ? categories[0].id : ''));
      setImages(productToEdit.images?.join(', ') || '');
    }
  }, [productToEdit, categories]); // Depend on categories to ensure categoryId is set correctly

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      title,
      price: parseFloat(price),
      description,
      categoryId: parseInt(categoryId),
      images: images.split(',').map(img => img.trim()).filter(img => img !== ''),
    });
  };

  if (!show || !productToEdit) return null;

  return (
    // Bootstrap Modal structure
    <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} aria-modal="true" role="dialog">
      <div className="modal-dialog modal-dialog-centered modal-lg"> {/* Larger modal for products */}
        <div className="modal-content rounded-3 shadow-lg">
          <div className="modal-header">
            <h5 className="modal-title h2 text-dark">Edit Product: {productToEdit.title}</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label fw-bold" htmlFor="edit-product-title">
                  Product Title
                </label>
                <input
                  type="text"
                  id="edit-product-title"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold" htmlFor="edit-product-price">
                  Price
                </label>
                <input
                  type="number"
                  id="edit-product-price"
                  className="form-control"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold" htmlFor="edit-product-description">
                  Description
                </label>
                <textarea
                  id="edit-product-description"
                  className="form-control"
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold" htmlFor="edit-product-category">
                  Category
                </label>
                <select
                  id="edit-product-category"
                  className="form-select"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold" htmlFor="edit-product-images">
                  Image URLs (comma-separated)
                </label>
                <input
                  type="text"
                  id="edit-product-images"
                  className="form-control"
                  placeholder="e.g., url1, url2, url3"
                  value={images}
                  onChange={(e) => setImages(e.target.value)}
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

const DeleteConfirmModal = ({ show, onClose, onConfirm, productToDelete }) => {
  if (!show || !productToDelete) return null;

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
              Are you sure you want to delete product <span className="fw-semibold">{productToDelete.title}</span> (ID: {productToDelete.id})? This action cannot be undone.
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

// --- Main ProductsPage Component ---
export default function ProductsPage() {
  // Consume authentication state from the global AuthContext
  const { user, isAuthenticated, loading, logout } = useAuth();
  const router = useRouter(); // Next.js router for navigation

  // Component-specific states for product data, loading, errors, and modals
  const [products, setProducts] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // States for CRUD modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null); // Product currently being edited/deleted

  // States for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default items per page

  // State for search filter (by product title)
  const [searchTitle, setSearchTitle] = useState('');

  // API Endpoint for CRUD operations
  const API_BASE_URL = 'https://api.escuelajs.co/api/v1/products'; // Platzi Fake Store API for products

  // Effect to handle authentication and data fetching
  useEffect(() => {
    // Only proceed if the authentication state from useAuth has finished loading
    if (!loading) {
      if (!isAuthenticated) {
        // If not authenticated, redirect to the login page
        router.push('/login');
      } else if (user?.role !== 'admin') {
        // If authenticated but not an admin, redirect to the profile page
        router.push('/dashboard');
      } else {
        // If authenticated as an admin, fetch the product data
        fetchProducts();
      }
    }
  }, [loading, isAuthenticated, user, router]); // Dependencies: auth states and router

  // Function to fetch product data from the API
  const fetchProducts = async () => {
    setPageLoading(true); // Set page loading to true before fetching
    setError(''); // Clear any previous errors
    setSuccessMessage(''); // Clear any previous success messages
    try {
      const response = await axios.get(API_BASE_URL);
      setProducts(response.data); // Update products state with fetched data
      console.log('Products fetched successfully:', response.data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Failed to load products. Please try again later.'); // Set error message
    } finally {
      setPageLoading(false); // Set page loading to false after fetch attempt
    }
  };

  // --- CRUD Operation Handlers ---

  // Handle adding a new product
  const handleAddProduct = async (productData) => {
    setError('');
    setSuccessMessage('');
    try {
      const response = await axios.post(API_BASE_URL, productData);
      setShowAddModal(false); // Close the add product modal
      setSuccessMessage('Product added successfully!'); // Show success message
      fetchProducts(); // Re-fetch products to update the table
    } catch (err) {
      console.error('Failed to add product:', err);
      setError(`Failed to add product: ${err.response?.data?.message || err.message || 'Please check the data and try again.'}`);
    }
  };

  // Handle editing an existing product
  const handleEditProduct = async (productData) => {
    setError('');
    setSuccessMessage('');
    if (!currentProduct) return; // Ensure a product is selected for editing

    try {
      // Platzi API uses PUT for update, sending only changed fields is fine
      const response = await axios.put(`${API_BASE_URL}/${currentProduct.id}`, productData);
      setShowEditModal(false); // Close the edit product modal
      setSuccessMessage('Product updated successfully!'); // Show success message
      fetchProducts(); // Re-fetch products to update the table
    } catch (err) {
      console.error('Failed to update product:', err);
      setError(`Failed to update product: ${err.response?.data?.message || err.message || 'Please try again.'}`);
    }
  };

  // Handle deleting a product
  const handleDeleteProduct = async () => {
    setError('');
    setSuccessMessage('');
    if (!currentProduct) return; // Ensure a product is selected for deletion

    try {
      await axios.delete(`${API_BASE_URL}/${currentProduct.id}`);
      setShowDeleteConfirm(false); // Close the delete confirmation modal
      setSuccessMessage('Product deleted successfully!'); // Show success message
      fetchProducts(); // Re-fetch products to update the table
    } catch (err) {
      console.error('Failed to delete product:', err);
      setError(`Failed to delete product: ${err.response?.data?.message || err.message || 'Please try again.'}`);
    }
  };

  // --- Pagination and Search Filtering Logic ---
  const filteredProducts = products.filter((product) => {
    const titleMatch = product.title.toLowerCase().includes(searchTitle.toLowerCase());
    return titleMatch;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem); // Get products for the current page
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage); // Calculate total pages based on filtered products

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

  // If not authenticated or not an admin, return null. The useEffect above will handle the redirection.
  // This prevents rendering the page content if the user is not authorized,
  // letting the router handle the actual navigation.
  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  // --- Main Render for Admin Product Management Page ---
  return (
    <div className="container-fluid py-4"> {/* Using container-fluid for wider layout */}
      <div className="card shadow-lg rounded-3">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h3 text-dark mb-0">Manage Products</h1>
            <div className="d-flex align-items-center gap-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="btn btn-primary shadow-sm d-flex align-items-center"
              >
                <svg className="me-2" width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                Add Product
              </button>
            </div>
          </div>

          {/* Search Filters Section */}
          <div className="mb-4 p-3 bg-light rounded-3 shadow-sm">
            <h5 className="h5 text-dark mb-3">Filter Products</h5>
            <div className="row g-3">
              <div className="col-md-6"> {/* Adjusted column width for single filter */}
                <label htmlFor="search-product-title" className="form-label small fw-bold">Product Title</label>
                <input
                  type="text"
                  id="search-product-title"
                  className="form-control"
                  placeholder="Search by product title..."
                  value={searchTitle}
                  onChange={(e) => {
                    setSearchTitle(e.target.value);
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

          {/* Conditional rendering for product table or loading spinner */}
          {pageLoading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading products...</span>
              </div>
              <span className="ms-3 text-secondary">Loading products...</span>
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
                      Title
                    </th>
                    <th scope="col" className="text-start text-muted text-uppercase small fw-medium">
                      Price
                    </th>
                    <th scope="col" className="text-start text-muted text-uppercase small fw-medium">
                      Category
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
                  {currentProducts.map((product) => (
                    <tr key={product.id}>
                      <td className="text-nowrap small text-dark">{product.id}</td>
                      <td className="text-nowrap small text-dark">{product.title}</td>
                      <td className="text-nowrap small text-dark">${product.price.toFixed(2)}</td>
                      <td className="text-nowrap small text-dark">{product.category?.name || 'N/A'}</td>
                      <td className="text-nowrap small text-dark">
                        <img
                          src={product.images && product.images.length > 0 ? product.images[0] : `https://placehold.co/60x60/cccccc/333333?text=N/A`}
                          alt={product.title}
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
                            setCurrentProduct(product);
                            setShowEditModal(true);
                          }}
                          className="btn btn-link text-info me-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setCurrentProduct(product);
                            setShowDeleteConfirm(true);
                          }}
                          className="btn btn-link text-danger"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {currentProducts.length === 0 && !pageLoading && (
                    <tr>
                      <td colSpan="6" className="text-center text-muted py-4">No products found matching your criteria.</td>
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
              Total Products: <span className="fw-semibold">{filteredProducts.length}</span>
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
      <AddProductModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddProduct}
      />
      <EditProductModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleEditProduct}
        productToEdit={currentProduct}
      />
      <DeleteConfirmModal
        show={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteProduct}
        productToDelete={currentProduct}
      />
    </div>
  );
}
