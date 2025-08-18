import React, { useState, useEffect } from "react";
import BASE_URL from "../config/Backendapi";
import "./ClaimsController.css";

const ClaimsController = () => {
  const [claims, setClaims] = useState([]);
  const [formData, setFormData] = useState({
    customerId: "",
    claimtypeId: "",
    claimAmount: "",
    incidentDate: "",
    description: "",
    status: "IN_REVIEW",
    submissionDate: ""
  });
  const [selectedId, setSelectedId] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState("");
  const [filters, setFilters] = useState({
    claimId: "",
    customerId: "",
    claimtypeId: "",
    status: ""
  });

  const fetchClaims = async () => {
    const res = await fetch(`${BASE_URL}/api/claims-extended`);
    if (res.ok) {
      const data = await res.json();
      setClaims(data);
      }
    };

    const fetchClaimById = async (id) => {
      const res = await fetch(`${BASE_URL}/api/claims-extended/${id}`);
      if (res.ok) {
        const data = await res.json();
        setFormData({
        customerId: data.customer.id,
        claimtypeId: data.claimType.claimtypeId,
        claimAmount: data.claimAmount,
        incidentDate: data.incidentDate,
        description: data.description,
        status: data.status,
        submissionDate: data.submissionDate || ""
        });
        setSelectedId(id);
        }
        };

        const createClaim = async () => {
        const res = await fetch(`${BASE_URL}/api/claims-extended`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
        });
        if (res.ok) {
        fetchClaims();
        resetForm();
        }
        };

        const updateStatus = async (id) => {
        const res = await fetch(`${BASE_URL}/api/claims-extended/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: statusUpdate })
        });
        if (res.ok) {
        fetchClaims();
        setStatusUpdate("");
        }
        };

        const deleteClaim = async (id) => {
        if (!window.confirm("Are you sure you want to delete this claim?")) return;
        const res = await fetch(`${BASE_URL}/api/claims-extended/${id}`, {
        method: "DELETE"
        });
        if (res.ok) {
        fetchClaims();
        }
        };

        const resetForm = () => {
        setFormData({
        customerId: "",
        claimtypeId: "",
        claimAmount: "",
        incidentDate: "",
        description: "",
        status: "IN_REVIEW",
        submissionDate: ""
        });
        setSelectedId(null);
        };

        const applyFilters = () => {
        fetchClaims().then(() => {
        setClaims((prevClaims) =>
        prevClaims.filter((c) => {
        return (
        (!filters.claimId || c.id === Number(filters.claimId)) &&
        (!filters.customerId || c.customer.id === Number(filters.customerId)) &&
        (!filters.claimtypeId || c.claimType.claimtypeId === Number(filters.claimtypeId)) &&
        (!filters.status || c.status === filters.status)
        );
        })
        );
        });
        };

        const clearFilters = () => {
        setFilters({
        claimId: "",
        customerId: "",
        claimtypeId: "",
        status: ""
        });
        fetchClaims();
        };

        useEffect(() => {
        fetchClaims();
        }, []);

        return (
        <div className="claims-container">
        <h1 className="claims-header">Claims Management</h1>

        <div className="filter-section">
        <h3 className="filter-title">Filter Claims</h3>
        <div className="filter-grid">
        <div className="filter-group">
        <label className="filter-label">Claim ID</label>
        <input
        className="filter-input"
        type="number"
        placeholder="Claim ID"
        value={filters.claimId}
        onChange={(e) => setFilters({ ...filters, claimId: e.target.value })}/>
        </div>

        <div className="filter-group">
          <label className="filter-label">Customer ID</label>
          <input
          className="filter-input"
          type="number"
          placeholder="Customer ID"
          value={filters.customerId}
          onChange={(e) => setFilters({ ...filters, customerId: e.target.value })}/>
          </div>

          <div className="filter-group">
          <label className="filter-label">Customer ID</label>
          <input
          className="filter-input"
          type="number"
          placeholder="Customer ID"
          value={filters.customerId}
          onChange={(e) => setFilters({ ...filters, customerId: e.target.value })}/>
          </div>

          <div className="filter-group">
            <label className="filter-label">Claim Type ID</label>
            <input
            className="filter-input"
            type="number"
            placeholder="Claim Type ID"
            value={filters.claimtypeId}
            onChange={(e) => setFilters({ ...filters, claimtypeId: e.target.value })}/>
            </div>

            <div className="filter-group">
              <label className="filter-label">Status</label>
              <select
              className="filter-select"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="">All Statuses</option>
                <option value="IN_REVIEW">IN_REVIEW</option>
                <option value="APPROVED">APPROVED</option>
                <option value="REJECTED">REJECTED</option>
                </select>
                </div>
                </div>

                <div className="filter-actions">
                  <button className="action-button primary-button" onClick={applyFilters}>
                  Apply Filters
                  </button>
                  <button className="action-button secondary-button" onClick={clearFilters}>
                    Clear Filters
                    </button>
                    </div>
                    </div>

                    <table className="claims-table">
                    <thead>
                    <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Incident Date</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Submission Date</th>
                    <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {claims.map((c) => (
                    <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.customer.email}</td>
                    <td>{c.claimType.name}</td>
                    <td>${parseFloat(c.claimAmount).toFixed(2)}</td>
                    <td>{new Date(c.incidentDate).toLocaleDateString()}</td>
                    <td>{c.description}</td>
                    <td className={`status-cell status-${c.status}`}>{c.status}</td>
                    <td>{c.submissionDate ? new Date(c.submissionDate).toLocaleDateString() : '-'}</td>
                    <td>
                    <div className="table-actions">
                    <button 
                    className="action-button secondary-button" 
                    onClick={() => fetchClaimById(c.id)}
                    >
                    Edit
                    </button>
                    <div className="edit-status">
                    <select
                    className="status-input"
                    value={statusUpdate}
                    onChange={(e) => setStatusUpdate(e.target.value)}
                    >
                    <option value="">Select Status</option>
                    <option value="IN_REVIEW">IN_REVIEW</option>
                    <option value="APPROVED">APPROVED</option>
                    <option value="REJECTED">REJECTED</option>
                    </select>
                    <button 
                    className="action-button success-button" 
                    onClick={() => updateStatus(c.id)}
                    disabled={!statusUpdate}
                    >
                    Update
                    </button>
                    </div>
                    <button 
                    className="action-button danger-button" 
                    onClick={() => deleteClaim(c.id)}
                    >
                    Delete
                    </button>
                    </div>
                    </td>
                    </tr>
                    ))}
                    </tbody>
                    </table>

                    <div className="form-section">
                    <h3 className="form-title">{selectedId ? "Edit Claim" : "Add New Claim"}</h3>
                    <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Customer ID</label>
                      <input
                      className="form-input"
                      placeholder="Customer ID"
                      value={formData.customerId}
                      onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}/>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Claim Type ID</label>
                        <input
                        className="form-input"
                        placeholder="Claim Type ID"
                        value={formData.claimtypeId}
                        onChange={(e) => setFormData({ ...formData, claimtypeId: e.target.value })}/>
                        </div>

                        <div className="form-group">
                          <label className="form-label">Amount</label>
                          <input
                          className="form-input"
                          placeholder="Amount"
                          type="number"
                          value={formData.claimAmount}
                          onChange={(e) => setFormData({ ...formData, claimAmount: e.target.value })}/>
                          </div>

                          <div className="form-group">
                            <label className="form-label">Incident Date</label>
                            <input
                            className="form-input"
                            type="date"
                            value={formData.incidentDate}
                            onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}/>
                            </div>

                            <div className="form-group">
                            <label className="form-label">Description</label>
                            <input
                            className="form-input"
                            placeholder="Description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}/>
                            </div>

                            <div className="form-group">
                            <label className="form-label">Status</label>
                            <select
                            className="form-select"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            >
                            <option value="IN_REVIEW">IN_REVIEW</option>
                            <option value="APPROVED">APPROVED</option>
                            <option value="REJECTED">REJECTED</option>
                            </select>
                            </div>

                            <div className="form-group">
                            <label className="form-label">Submission Date</label>
                            <input
                            className="form-input"
                            type="date"
                            value={formData.submissionDate}
                            onChange={(e) => setFormData({ ...formData, submissionDate: e.target.value })}/>
                            </div>
                            </div>

                            <div className="form-actions">
                            <button className="action-button primary-button" onClick={createClaim}>
                            {selectedId ? "Update Claim" : "Create Claim"}
                            </button>
                            <button className="action-button secondary-button" onClick={resetForm}>
                            Clear Form
                            </button>
                            </div>
                            </div>
                            </div>
                            );
                            };

                            export default ClaimsController;