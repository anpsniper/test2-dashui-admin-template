// app/manage-users/page.js
'use client'; // This directive marks the component as a Client Component

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/AuthOy'; // Adjust path based on your actual structure
import { useRouter } from 'next/navigation'; // For Next.js App Router navigation
import axios from 'axios'; // Assuming axios is installed, otherwise use fetch

// --- Modals for CRUD operations ---
// These are defined within this file for simplicity as requested,
// but in a larger application, they could be moved to a 'components' folder.

const AddUserModal = ({ show, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer'); // Default role
  const [avatar, setAvatar] = useState('https://i.pravatar.cc/150?img=3'); // Default avatar

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, email, password, role, avatar });
    // Clear form after submission
    setName('');
    setEmail('');
    setPassword('');
    setRole('customer');
    setAvatar('https://i.pravatar.cc/150?img=3');
  };

  if (!show) return null;

  return (
    // Bootstrap Modal structure
    <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} aria-modal="true" role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-3 shadow-lg">
          <div className="modal-header">
            <h5 className="modal-title h2 text-dark">Add New User</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label fw-bold" htmlFor="add-name">
                  Name
                </label>
                <input
                  type="text"
                  id="add-name"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold" htmlFor="add-email">
                  Email
                </label>
                <input
                  type="email"
                  id="add-email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold" htmlFor="add-password">
                  Password
                </label>
                <input
                  type="password"
                  id="add-password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold" htmlFor="add-role">
                  Role
                </label>
                <select
                  id="add-role"
                  className="form-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold" htmlFor="add-avatar">
                  Avatar URL
                </label>
                <input
                  type="url"
                  id="add-avatar"
                  className="form-control"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
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
                Add User
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const EditUserModal = ({ show, onClose, onSave, userToEdit }) => {
  const [name, setName] = useState(userToEdit?.name || '');
  const [email, setEmail] = useState(userToEdit?.email || '');
  const [role, setRole] = useState(userToEdit?.role || 'customer');
  const [avatar, setAvatar] = useState(userToEdit?.avatar || '');

  useEffect(() => {
    // Update state when userToEdit changes
    if (userToEdit) {
      setName(userToEdit.name || '');
      setEmail(userToEdit.email || '');
      setRole(userToEdit.role || 'customer');
      setAvatar(userToEdit.avatar || '');
    }
  }, [userToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, email, role, avatar });
  };

  if (!show || !userToEdit) return null;

  return (
    // Bootstrap Modal structure
    <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} aria-modal="true" role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-3 shadow-lg">
          <div className="modal-header">
            <h5 className="modal-title h2 text-dark">Edit User: {userToEdit.name}</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label fw-bold" htmlFor="edit-name">
                  Name
                </label>
                <input
                  type="text"
                  id="edit-name"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold" htmlFor="edit-email">
                  Email
                </label>
                <input
                  type="email"
                  id="edit-email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold" htmlFor="edit-role">
                  Role
                </label>
                <select
                  id="edit-role"
                  className="form-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold" htmlFor="edit-avatar">
                  Avatar URL
                </label>
                <input
                  type="url"
                  id="edit-avatar"
                  className="form-control"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
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

const DeleteConfirmModal = ({ show, onClose, onConfirm, userToDelete }) => {
  if (!show || !userToDelete) return null;

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
              Are you sure you want to delete user <span className="fw-semibold">{userToDelete.name}</span> (ID: {userToDelete.id})? This action cannot be undone.
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

// --- Main ManageUsersPage Component ---
export default function ManageUsersPage() {
  // Consume authentication state from the global AuthContext
  const { user, isAuthenticated, loading, logout } = useAuth();
  const router = useRouter(); // Next.js router for navigation

  // Component-specific states for user data, loading, errors, and modals
  const [users, setUsers] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // States for CRUD modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // User currently being edited/deleted

  // States for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default items per page

  // States for search filters
  const [searchName, setSearchName] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [searchRole, setSearchRole] = useState(''); // Can be 'customer', 'admin', or '' for all

  // API Endpoint for CRUD operations
  const API_BASE_URL = 'https://api.escuelajs.co/api/v1/users';

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
        // If authenticated as an admin, fetch the user data
        fetchUsers();
      }
    }
  }, [loading, isAuthenticated, user, router]); // Dependencies: auth states and router

  // Function to fetch user data from the API
  const fetchUsers = async () => {
    setPageLoading(true); // Set page loading to true before fetching
    setError(''); // Clear any previous errors
    setSuccessMessage(''); // Clear any previous success messages
    try {
      const response = await axios.get(API_BASE_URL);
      setUsers(response.data); // Update users state with fetched data
      console.log('Users fetched successfully:', response.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('Failed to load users. Please try again later.'); // Set error message
    } finally {
      setPageLoading(false); // Set page loading to false after fetch attempt
    }
  };

  // --- CRUD Operation Handlers ---

  // Handle adding a new user
  const handleAddUser = async (userData) => {
    setError('');
    setSuccessMessage('');
    try {
      const response = await axios.post(API_BASE_URL, {
        ...userData,
        // Ensure password and role are sent as required by the API
        password: userData.password || 'default_password',
        role: userData.role || 'customer',
      });
      setShowAddModal(false); // Close the add user modal
      setSuccessMessage('User added successfully!'); // Show success message
      fetchUsers(); // Re-fetch users to update the table
    } catch (err) {
      console.error('Failed to add user:', err);
      setError(`Failed to add user: ${err.response?.data?.message || err.message || 'Please check the data and try again.'}`);
    }
  };

  // Handle editing an existing user
  const handleEditUser = async (userData) => {
    setError('');
    setSuccessMessage('');
    if (!currentUser) return; // Ensure a user is selected for editing

    try {
      const response = await axios.put(`${API_BASE_URL}/${currentUser.id}`, userData);
      setShowEditModal(false); // Close the edit user modal
      setSuccessMessage('User updated successfully!'); // Show success message
      fetchUsers(); // Re-fetch users to update the table
    } catch (err) {
      console.error('Failed to update user:', err);
      setError(`Failed to update user: ${err.response?.data?.message || err.message || 'Please try again.'}`);
    }
  };

  // Handle deleting a user
  const handleDeleteUser = async () => {
    setError('');
    setSuccessMessage('');
    if (!currentUser) return; // Ensure a user is selected for deletion

    try {
      await axios.delete(`${API_BASE_URL}/${currentUser.id}`);
      setShowDeleteConfirm(false); // Close the delete confirmation modal
      setSuccessMessage('User deleted successfully!'); // Show success message
      fetchUsers(); // Re-fetch users to update the table
    } catch (err) {
      console.error('Failed to delete user:', err);
      setError(`Failed to delete user: ${err.response?.data?.message || err.message || 'Please try again.'}`);
    }
  };

  // --- Pagination and Search Filtering Logic ---
  const filteredUsers = users.filter((u) => {
    const nameMatch = u.name.toLowerCase().includes(searchName.toLowerCase());
    const emailMatch = u.email.toLowerCase().includes(searchEmail.toLowerCase());
    const roleMatch = searchRole === '' || u.role.toLowerCase() === searchRole.toLowerCase();
    return nameMatch && emailMatch && roleMatch;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem); // Get users for the current page
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage); // Calculate total pages based on filtered users

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

  // --- Main Render for Admin User Management Page ---
  return (
    <div className="container-fluid py-4"> {/* Using container-fluid for wider layout */}
      <div className="card shadow-lg rounded-3">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h3 text-dark mb-0">Manage Users</h1>
            <div className="d-flex align-items-center gap-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="btn btn-primary shadow-sm d-flex align-items-center"
              >
                <svg className="me-2" width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                Add User
              </button>
            </div>
          </div>

          {/* Search Filters Section */}
          <div className="mb-4 p-3 bg-light rounded-3 shadow-sm">
            <h5 className="h5 text-dark mb-3">Filter Users</h5>
            <div className="row g-3">
              <div className="col-md-4">
                <label htmlFor="search-name" className="form-label small fw-bold">Name</label>
                <input
                  type="text"
                  id="search-name"
                  className="form-control"
                  placeholder="Search by name..."
                  value={searchName}
                  onChange={(e) => {
                    setSearchName(e.target.value);
                    setCurrentPage(1); // Reset pagination on search
                  }}
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="search-email" className="form-label small fw-bold">Email</label>
                <input
                  type="email"
                  id="search-email"
                  className="form-control"
                  placeholder="Search by email..."
                  value={searchEmail}
                  onChange={(e) => {
                    setSearchEmail(e.target.value);
                    setCurrentPage(1); // Reset pagination on search
                  }}
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="search-role" className="form-label small fw-bold">Role</label>
                <select
                  id="search-role"
                  className="form-select"
                  value={searchRole}
                  onChange={(e) => {
                    setSearchRole(e.target.value);
                    setCurrentPage(1); // Reset pagination on search
                  }}
                >
                  <option value="">All Roles</option>
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
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

          {/* Conditional rendering for user table or loading spinner */}
          {pageLoading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading users...</span>
              </div>
              <span className="ms-3 text-secondary">Loading users...</span>
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
                      Email
                    </th>
                    <th scope="col" className="text-start text-muted text-uppercase small fw-medium">
                      Role
                    </th>
                    <th scope="col" className="text-start text-muted text-uppercase small fw-medium">
                      Avatar
                    </th>
                    <th scope="col" className="text-start text-muted text-uppercase small fw-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((u) => (
                    <tr key={u.id}>
                      <td className="text-nowrap small text-dark">{u.id}</td>
                      <td className="text-nowrap small text-dark">{u.name}</td>
                      <td className="text-nowrap small text-dark">{u.email}</td>
                      <td className="text-nowrap small text-dark">{u.role}</td>
                      <td className="text-nowrap small text-dark">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="rounded-circle border border-light shadow-sm"
                          style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                          // Fallback for broken images
                          onError={(e) => {
                            e.target.onerror = null; // Prevents infinite loop if fallback also fails
                            e.target.src = `https://placehold.co/40x40/cccccc/333333?text=N/A`; // Placeholder image
                          }}
                        />
                      </td>
                      <td className="text-end text-nowrap small fw-medium">
                        <button
                          onClick={() => {
                            setCurrentUser(u);
                            setShowEditModal(true);
                          }}
                          className="btn btn-link text-info me-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setCurrentUser(u);
                            setShowDeleteConfirm(true);
                          }}
                          className="btn btn-link text-danger"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {currentUsers.length === 0 && !pageLoading && (
                    <tr>
                      <td colSpan="6" className="text-center text-muted py-4">No users found matching your criteria.</td>
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
              Total Users: <span className="fw-semibold">{filteredUsers.length}</span> {/* Now shows count of filtered users */}
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
      <AddUserModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddUser}
      />
      <EditUserModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleEditUser}
        userToEdit={currentUser}
      />
      <DeleteConfirmModal
        show={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteUser}
        userToDelete={currentUser}
      />
    </div>
  );
}
