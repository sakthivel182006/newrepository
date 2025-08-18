import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from '../config/Backendapi';

const ApprovedClaims = () => {
const [approvedClaims, setApprovedClaims] = useState([]);
const [message, setMessage] = useState('');

useEffect(() => {
const userId = localStorage.getItem('userId');
if (!userId) {
setMessage('User not logged in');
return;
}

axios
.get(`${BASE_URL}/api/claims-extended/user/${userId}`)
.then((res) => {
const approved = res.data.filter(
(claim) => claim.status && claim.status.toUpperCase() === 'APPROVED'
);
setApprovedClaims(approved);
})
.catch((err) => {
console.error(err);
setMessage('Error fetching claims');
});
}, []);

const handleClaimPayment = (claim) => {
alert(`Initiate payment for claim ID: ${claim.id}, amount: ₹${claim.claimAmount}`);

};

return (
<div style={{ padding: 20 }}>
<h2>Approved Claims</h2>
{message && <p>{message}</p>}
{approvedClaims.length === 0 ? (
<p>No approved claims found.</p>
) : (
<table
border="1"
cellPadding="8"
cellSpacing="0"
style={{ width: '100%', marginTop: 10 }}
>
<thead>
<tr>
<th>Claim ID</th>
<th>Claim Type</th>
<th>Claim Amount (₹)</th>
<th>Incident Date</th>
<th>Description</th>
<th>Action</th>
</tr>
</thead>
<tbody>
{approvedClaims.map((claim) => (
<tr key={claim.id}>
<td>{claim.id}</td>
<td>{claim.claimType?.name}</td>
<td>{claim.claimAmount.toFixed(2)}</td>
<td>{claim.incidentDate}</td>
<td>{claim.description}</td>
<td>
<button onClick={() => handleClaimPayment(claim)}>
Claim Payment
</button>
</td>
</tr>
))}
</tbody>
</table>
)}
</div>
);
};

export default ApprovedClaims;
