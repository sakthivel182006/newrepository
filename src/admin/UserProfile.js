import React, { useState, useEffect } from "react";
import BASE_URL from "../config/Backendapi";
import "./UserProfile.css";

const ROLES = ["CUSTOMER", "ADMIN", "AGENT"];

const UserProfile = () => {
const [users, setUsers] = useState([]);
const [editData, setEditData] = useState({});
const [newUser, setNewUser] = useState({
email: "",
});

const fetchUsers = async () => {
try {
const res = await fetch(`${BASE_URL}/api/users`);
if (!res.ok) throw new Error("Failed to fetch users");
const data = await res.json();
setUsers(data);
} catch (err) {
console.error("Error fetching users:", err);
}
};

useEffect(() => {
fetchUsers();
}, []);

const startEditing = (user) => {
setEditData({
[user.id]: {
email: user.email,
password: user.password,
verified: user.verified,
role: user.role,
},
});
};

const handleEditChange = (userId, field, value) => {
setEditData((prev) => ({
...prev,
[userId]: {
...prev[userId],
[field]: field === "verified" ? value === "true" : value,
},
}));
};

const handleNewUserChange = (field, value) => {
setNewUser((prev) => ({
...prev,
[field]: field === "verified" ? value === "true" : value,
}));
};

const handleCreateUser = async () => {
try {
const res = await fetch(`${BASE_URL}/api/register`, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify(newUser),
});
if (res.ok) {
setNewUser({
email: "",
password: "",
verified: false,
role: "CUSTOMER",
});
fetchUsers();
alert("User added successfully");
} else {
alert("Failed to add user");
}
} catch (err) {
console.error("Error creating user:", err);
}
};

const handleUpdate = async (userId) => {
const updatedUser = editData[userId];
try {
const res = await fetch(`${BASE_URL}/api/users/${userId}`, {
method: "PUT",
headers: { "Content-Type": "application/json" },
body: JSON.stringify(updatedUser),
});
if (res.ok) {
setEditData({});
fetchUsers();
} else {
alert("Failed to update user");
}
} catch (err) {
console.error("Error updating user:", err);
}
};

const handleDelete = async (userId) => {
if (!window.confirm(`Are you sure you want to delete User ID ${userId}?`)) return;
try {
const res = await fetch(`${BASE_URL}/api/users/${userId}`, {
method: "DELETE",
});
if (res.ok) {
fetchUsers();
} else {
alert("Failed to delete user");
}
} catch (err) {
console.error("Error deleting user:", err);
}
};

return (
<div className="user-management-container">
<div className="user-management-header">
<h1 className="user-management-title">User Management</h1>
</div>

<div className="add-user-section">
<h3 className="section-title">Add New User</h3>
<div className="user-form">
<div className="form-group">
<label className="form-label">Email</label>
<input
className="form-input"
type="text"
placeholder="Email"
value={newUser.email}
onChange={(e) => handleNewUserChange("email", e.target.value)}/>
</div>

<div className="form-group">
<label className="form-label">Password</label>
<input
className="form-input"
type="password"
placeholder="Password"
value={newUser.password}
onChange={(e) => handleNewUserChange("password", e.target.value)}/>
</div>

<div className="form-group">
<label className="form-label">Verified</label>
<select
className="form-select"

onChange={(e) => handleNewUserChange("verified", e.target.value)}
>
<option value="false">Not Verified</option>
<option value="true">Verified</option>
</select>
</div>

<div className="form-group">
<label className="form-label">Role</label>
<select
className="form-select"
value={newUser.role}
onChange={(e) => handleNewUserChange("role", e.target.value)}
>
{ROLES.map((role) => (
<option key={role} value={role}>
{role}
</option>
))}
</select>
</div>

<button
className="action-button primary-button"
onClick={handleCreateUser}
>
Add User
</button>
</div>
</div>

<table className="users-table">
<thead>
<tr>
<th>ID</th>
<th>Email</th>
<th>Password</th>
<th>Verified</th>
<th>Role</th>
<th>Actions</th>
</tr>
</thead>
<tbody>
{users.map((u) => (
<tr key={u.id}>
<td>{u.id}</td>
<td>
{editData[u.id] ? (
<input
className="edit-input"
type="text"
value={editData[u.id].email}
onChange={(e) => handleEditChange(u.id, "email", e.target.value)}/>
) : (
u.email
)}
</td>
<td>
{editData[u.id] ? (
<input
className="edit-input"
type="text"
value={editData[u.id].password}
onChange={(e) => handleEditChange(u.id, "password", e.target.value)}/>
) : (
"        "
)}
</td>
<td>
{editData[u.id] ? (
<select
className="edit-select"
value={editData[u.id].verified.toString()}
onChange={(e) => handleEditChange(u.id, "verified", e.target.value)}
>
<option value="true">True</option>
<option value="false">False</option>
</select>
) : (
<span className={`status-${u.verified.toString().toLowerCase()}`}>
{u.verified.toString()}
</span>
)}
</td>
<td>
{editData[u.id] ? (
<select
className="edit-select"
value={editData[u.id].role}
onChange={(e) => handleEditChange(u.id, "role", e.target.value)}
>
{ROLES.map((role) => (
<option key={role} value={role}>
{role}
</option>
))}
</select>
) : (
u.role
)}
</td>
<td>
<div className="button-group">
{editData[u.id] ? (
<>
<button
className="action-button primary-button"
onClick={() => handleUpdate(u.id)}
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
onClick={() => startEditing(u)}
>
Edit
</button>
<button
className="action-button danger-button"
onClick={() => handleDelete(u.id)}
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

export default UserProfile;