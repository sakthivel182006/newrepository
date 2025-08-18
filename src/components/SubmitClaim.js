import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from '../config/Backendapi';

const Claims = () => {
const [claims, setClaims] = useState([]);
const [userDetails, setUserDetails] = useState({
userId: '',
email: '',
password: '',
verified: ''
});

useEffect(() => {
const storedUser = localStorage.getItem('loggedInUserDetails');
if (storedUser) {
const parsedUser = JSON.parse(storedUser);
setUserDetails(parsedUser);
fetchClaims(parsedUser.userId);
}
}, []);

const fetchClaims = async (userId) => {
try {
const response = await axios.get(`${BASE_URL}/api/customers/${userId}/claims`);
const approvedClaims = response.data.filter(claim => claim.status === 'APPROVED');
setClaims(approvedClaims);
} catch (error) {
console.error('Error fetching claims:', error);
}
};

return (
<div style={{ padding: '20px' }}>
<h2>My Insurance Claims (Approved Only)</h2>
{claims.length === 0 ? (
<p>No approved claims found.</p>
) : (
<table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
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
{claims.map((claim) => (
<tr key={claim.id}>
<td>{claim.id}</td>
<td>{claim.claimType}</td>
<td>{claim.claimAmount}</td>
<td>{claim.incidentDate}</td>
<td>{claim.description}</td>
<td>{claim.status}</td>
<td>{claim.submissionDate}</td>
</tr>
))}
</tbody>
</table>
)}
</div>
);
};

export default Claims;
