import React, { useState, useEffect } from "react";
import BASE_URL from "../config/Backendapi";
import "./AuditLogs.css";

const AuditLogs = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [filters, setFilters] = useState({
    auditLogId: "",
    claimId: "",
    userId: ""
  });

  const fetchAllLogs = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/audit-logs`);
      if (!res.ok) throw new Error("Failed to fetch audit logs");
      const data = await res.json();
      setAuditLogs(data);
    } catch (err) {
      console.error(err);
      }
      };

      const fetchByAuditLogId = async (id) => {
      try {
      const res = await fetch(`${BASE_URL}/api/audit-logs/${id}`);
      if (!res.ok) throw new Error("Not found");
      const data = await res.json();
      setAuditLogs(data ? [data] : []);
      } catch (err) {
      console.error(err);
      setAuditLogs([]);
      }
      };

      const fetchByClaimId = async (id) => {
      try {
      const res = await fetch(`${BASE_URL}/api/claims/${id}/audit-logs`);
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setAuditLogs(data);
      } catch (err) {
      console.error(err);
      setAuditLogs([]);
      }
      };

      const fetchByUserId = async (id) => {
      try {
      const res = await fetch(`${BASE_URL}/api/users/${id}/audit-logs`);
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setAuditLogs(data);
      } catch (err) {
      console.error(err);
      setAuditLogs([]);
      }
      };

      const handleFilter = () => {
      if (filters.auditLogId) {
      fetchByAuditLogId(filters.auditLogId);
      } else if (filters.claimId) {
      fetchByClaimId(filters.claimId);
      } else if (filters.userId) {
      fetchByUserId(filters.userId);
      } else {
      fetchAllLogs();
      }
      };

      const clearFilters = () => {
      setFilters({ auditLogId: "", claimId: "", userId: "" });
      fetchAllLogs();
      };

      useEffect(() => {
      fetchAllLogs();
      }, []);

      return (
      <div className="audit-logs-container">
      <h1 className="audit-logs-header">Audit Logs</h1>

      <div className="filter-section">
      <div className="filter-grid">
      <div className="filter-group">
      <label className="filter-label">Audit Log ID</label>
      <input
      className="filter-input"
      type="number"
      placeholder="Audit Log ID"
      value={filters.auditLogId}
      onChange={(e) => setFilters({ ...filters, auditLogId: e.target.value })}/>
      </div>

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
          <label className="filter-label">User ID</label>
          <input
          className="filter-input"
          type="number"
          placeholder="User ID"
          value={filters.userId}
          onChange={(e) => setFilters({ ...filters, userId: e.target.value })}/>
          </div>
          </div>

          <div className="filter-actions">
            <button className="action-button primary-button" onClick={handleFilter}>
              Apply Filter
              </button>
              <button className="action-button secondary-button" onClick={clearFilters}>
              Clear Filters
              </button>
              </div>
              </div>

              <table className="audit-logs-table">
              <thead>
              <tr>
              <th>ID</th>
              <th>Claim ID</th>
              <th>User ID</th>
              <th>Action</th>
              <th>Timestamp</th>
              </tr>
              </thead>
              <tbody>
              {auditLogs.length > 0 ? (
              auditLogs.map((log) => (
              <tr key={log.id}>
              <td>{log.id}</td>
              <td>{log.claims?.id || '-'}</td>
              <td>{log.user?.id || '-'}</td>
              <td className="action-cell">{log.action}</td>
              <td className="timestamp-cell">
              {log.timestamp ? new Date(log.timestamp).toLocaleString() : '-'}
              </td>
              </tr>
              ))
              ) : (
              <tr>
              <td colSpan="5" className="no-logs">
              No audit logs found
              </td>
              </tr>
              )}
              </tbody>
              </table>
              </div>
              );
              };

              export default AuditLogs;