"use client";

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Spinner, Alert, Container, Row, Col, Card, Form, InputGroup } from 'react-bootstrap';
import { useAuth } from '../../hooks/AuthOy';
import { useRouter } from 'next/navigation';

const DashboardPage = () => {
  const [products, setProducts] = useState([]);
  const [totalProductsCount, setTotalProductsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    const offset = (currentPage - 1) * itemsPerPage;
    const apiUrl = `/api/pwo?limit=${itemsPerPage}&offset=${offset}&search=${encodeURIComponent(searchQuery)}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProducts(data.data);
      setTotalProductsCount(data.totalCount);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError(err.message || 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, searchQuery]);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else {
        fetchProducts();
      }
    }
  }, [authLoading, isAuthenticated, user, router, fetchProducts]);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchProducts();
    }
  }, [currentPage, itemsPerPage, searchQuery, authLoading, isAuthenticated, fetchProducts]);


  const totalPages = useMemo(() => {
    return Math.ceil(totalProductsCount / itemsPerPage);
  }, [totalProductsCount, itemsPerPage]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  if (authLoading) {
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
    <>
      <Container className="container-fluid py-4">
        <Row className="justify-content-center">
          <Col md={12}>
            <Card className="shadow-lg rounded-3">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h1 className="h3 text-dark mb-0">Product List</h1>
                  <div className="d-flex align-items-center gap-3">
                    <InputGroup className="w-auto">
                      <Form.Control
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="form-control"
                      />
                    </InputGroup>
                  </div>
                </div>

                {loading && (
                  <div className="d-flex justify-content-center align-items-center py-5">
                    <Spinner animation="border" role="status" className="me-2">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    <span>Loading products...</span>
                  </div>
                )}

                {error && (
                  <Alert variant="danger" className="text-center">
                    Error: {error}
                  </Alert>
                )}

                {!loading && !error && products.length === 0 && (
                  <Alert variant="info" className="text-center">
                    {searchQuery ? 'No products found matching your search.' : 'No products found.'}
                  </Alert>
                )}

                {!loading && !error && products.length > 0 && (
                  <div className="table-responsive rounded-3 border shadow-sm">
                    <table className="table table-striped table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th scope="col" className="text-start text-muted text-uppercase small fw-medium">ID</th>
                          <th scope="col" className="text-start text-muted text-uppercase small fw-medium">Product Name</th>
                          <th scope="col" className="text-start text-muted text-uppercase small fw-medium">Product Brand</th>
                          <th scope="col" className="text-start text-muted text-uppercase small fw-medium">Product Owner</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product) => (
                          <tr key={product.id}>
                            <td className="text-nowrap small text-dark">{product.id}</td>
                            <td className="text-nowrap small text-dark">{product.product_name}</td>
                            <td className="text-nowrap small text-dark">{product.product_brand}</td>
                            <td className="text-nowrap small text-dark">{product.product_owner}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card.Body>
              {!loading && !error && totalProductsCount > 0 && (
                <Card.Footer className="bg-light py-3 rounded-bottom-3">
                  <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center mt-0">
                    <div className="text-secondary mb-3 mb-sm-0">
                      Total Products: <span className="fw-semibold">{totalProductsCount}</span>
                    </div>

                    <nav className="d-flex align-items-center justify-content-center mb-3 mb-sm-0" aria-label="Pagination">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="btn btn-outline-secondary rounded-start"
                      >
                        Previous
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => handlePageChange(i + 1)}
                          className={`btn ${currentPage === i + 1 ? 'btn-primary' : 'btn-outline-secondary'}`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="btn btn-outline-secondary rounded-end"
                      >
                        Next
                      </button>
                    </nav>

                    <div className="d-flex align-items-center">
                      <label htmlFor="items-per-page" className="text-secondary me-2">
                        Show:
                      </label>
                      <select
                        id="items-per-page"
                        value={itemsPerPage}
                        onChange={handleItemsPerPageChange}
                        className="form-select w-auto"
                      >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                      </select>
                      <span className="ms-2 text-secondary">per page</span>
                    </div>
                  </div>
                </Card.Footer>
              )}
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default DashboardPage;
