import React, { useState, useEffect } from "react";
import BASE_URL from "../config/Backendapi";
import "./AddClaimType.css";

const AddClaimType = () => {
  const [claimTypes, setClaimTypes] = useState([]);
  const [filteredClaimTypes, setFilteredClaimTypes] = useState([]);
  const [newName, setNewName] = useState("");
  const [editData, setEditData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const fetchClaimTypes = async () => {
    try {
    const res = await fetch(`${BASE_URL}/api/claim-types`);
    if (!res.ok) throw new Error("Failed to fetch claim types");
    const data = await res.json();
    setClaimTypes(data);
    setFilteredClaimTypes(data);
    } catch (err) {
      console.error("Error fetching claim types:", err);
    }
    };

    useEffect(() => {
    fetchClaimTypes();
    }, []);

    useEffect(() => {
    const filtered = claimTypes.filter((type) =>
    type.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClaimTypes(filtered);
    }, [searchTerm, claimTypes]);

    const handleAdd = async () => {
      if (!newName.trim()) {
      alert("Name cannot be empty");
      return;
      }
      try {
      const res = await fetch(`${BASE_URL}/api/claim-types`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
      });
      if (res.ok) {
      setNewName("");
      fetchClaimTypes();
      } else {
      alert("Failed to add claim type");
      }
      } catch (err) {
      console.error("Error adding claim type:", err);
      }
      };

      const startEditing = (claimtypeId, currentName) => {
      setEditData({ [claimtypeId]: currentName });
      };

      const handleEditChange = (claimtypeId, value) => {
      setEditData((prev) => ({ ...prev, [claimtypeId]: value }));
      };

      const handleUpdate = async (claimtypeId) => {
      const updatedName = editData[claimtypeId];
      if (!updatedName.trim()) {
      alert("Name cannot be empty");
      return;
      }
      try {
      const res = await fetch(`${BASE_URL}/api/claim-types/${claimtypeId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: updatedName }),
      });
      if (res.ok) {
      setEditData({});
      fetchClaimTypes();
      } else {
      alert("Failed to update claim type");
      }
      } catch (err) {
      console.error("Error updating claim type:", err);
      }
      };

      const handleDelete = async (claimtypeId) => {
      if (!window.confirm(`Are you sure you want to delete Claim Type ID ${claimtypeId}?`)) {
        return;
        }
        try {
        const res = await fetch(`${BASE_URL}/api/claim-types/${claimtypeId}`, {
        method: "DELETE",
        });
        if (res.ok) {
        fetchClaimTypes();
        } else {
        alert("Failed to delete claim type");
        }
        } catch (err) {
        console.error("Error deleting claim type:", err);
        }
        };

        return (
        <div className="claim-types-container">
        <div className="claim-types-header">
        <h1 className="claim-types-title">Manage Claim Types</h1>
        </div>

        <div className="filter-section">
        <input
        type="text"
        placeholder="Search claim types..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}/>
        </div>

        <div className="add-claim-type">
          <input
          type="text"
          placeholder="Enter new claim type name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}/>
          <button className="action-button primary-button" onClick={handleAdd}>
          Add Claim Type
          </button>
          </div>

          <table className="claim-types-table">
            <thead>
            <tr>
            <th>ID</th>
            <th>Claim Type Name</th>
            <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {filteredClaimTypes.map((type) => (
            <tr key={type.claimtypeId}>
            <td>{type.claimtypeId}</td>
            <td>
            {editData[type.claimtypeId] !== undefined ? (
            <input
            className="edit-input"
            type="text"
            value={editData[type.claimtypeId]}
            onChange={(e) => handleEditChange(type.claimtypeId, e.target.value)}/>
            ) : (
            type.name
            )}
            </td>
            <td>
            <div className="button-group">
            {editData[type.claimtypeId] !== undefined ? (
            <>
            <button
            className="action-button primary-button"
            onClick={() => handleUpdate(type.claimtypeId)}
            >
            Save
            </button>
            <button
            className="action-button secondary-button"
            onClick={() => setEditData({})}
            >
            Cancel
            </button>
            </>
            ) : (
            <>
            <button
            className="action-button secondary-button"
            onClick={() => startEditing(type.claimtypeId, type.name)}
            >
            Edit
            </button>
            <button
            className="action-button danger-button"
            onClick={() => handleDelete(type.claimtypeId)}
            >
            Delete
            </button>
            </>
            )}
            </div>
            </td>
            </tr>
            ))}
            </tbody>
            </table>
            </div>
            );
            };

            export default AddClaimType;