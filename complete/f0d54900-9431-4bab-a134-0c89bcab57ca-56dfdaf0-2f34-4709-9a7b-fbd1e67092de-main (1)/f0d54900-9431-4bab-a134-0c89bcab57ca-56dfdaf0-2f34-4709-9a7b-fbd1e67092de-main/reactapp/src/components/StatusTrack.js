import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from '../config/Backendapi';

const ClaimStatusOptions = [
'SUBMITTED',
'IN_REVIEW',
'APPROVED',
'REJECTED',
];

const StatusTrack = () => {
const [claims, setClaims] = useState([]);
const [filteredClaims, setFilteredClaims] = useState([]);
const [statusFilter, setStatusFilter] = useState(''); // '' means no filter / all
const [message, setMessage] = useState('');

useEffect(() => {
const userId = localStorage.getItem('userId');
if (!userId) {
setMessage('User not logged in');
return;
}

axios
.get(`${BASE_URL}/api/claims-extended/user/${userId}`)
.then((response) => {
setClaims(response.data);
setFilteredClaims(response.data);
})
.catch((error) => {
console.error('Error fetching claims:', error);
setMessage('Error fetching claims');
});
}, []);
useEffect(() => {
if (!statusFilter) {
setFilteredClaims(claims);
} else {
setFilteredClaims(
claims.filter(
(claim) =>
claim.status &&
claim.status.toUpperCase() === statusFilter.toUpperCase()
)
);
}
}, [statusFilter, claims]);

return (
<div style={{ padding: 20 }}>
<h2>Track Your Claims</h2>
{message && <p>{message}</p>}

<label>
Filter by Status:{' '}
<select
value={statusFilter}
onChange={(e) => setStatusFilter(e.target.value)}
>
<option value="">-- All --</option>
{ClaimStatusOptions.map((status) => (
<option key={status} value={status}>
{status.replace('_', ' ')}
</option>
))}
</select>
</label>

<table
border="1"
cellPadding="8"
cellSpacing="0"
style={{ width: '100%', marginTop: 20 }}
>
<thead>
<tr>
<th>ID</th>
<th>Claim Type</th>
<th>Claim Amount</th>
<th>Incident Date</th>
<th>Description</th>
<th>Status</th>
<th>Submission Date</th>
</tr>
</thead>
<tbody>
{filteredClaims.length > 0 ? (
filteredClaims.map((claim) => (
<tr key={claim.id}>
<td>{claim.id}</td>
<td>{claim.claimType?.name}</td>
<td>{claim.claimAmount}</td>
<td>{claim.incidentDate}</td>
<td>{claim.description}</td>
<td>{claim.status}</td>
<td>{claim.submissionDate}</td>
</tr>
))
) : (
<tr>
<td colSpan="7" style={{ textAlign: 'center' }}>
No claims found.
</td>
</tr>
)}
</tbody>
</table>
</div>
);
};

export default StatusTrack;
