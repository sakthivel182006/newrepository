import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from '../config/Backendapi';

const ApplyClaim = () => {
    const [claimTypes, setClaimTypes] = useState([]);
    const [selectedClaimTypeId, setSelectedClaimTypeId] = useState('');
    const [claimAmount, setClaimAmount] = useState('');
    const [incidentDate, setIncidentDate] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
    axios.get(`${BASE_URL}/api/claim-types`)
    .then(response => {
    setClaimTypes(response.data);
    if (response.data.length > 0) {
    setSelectedClaimTypeId(response.data[0].claimtypeId);
    }
    })
    .catch(error => {
    console.error('Error fetching claim types:', error);
    });
    }, []);

    const handleSubmit = async (e) => {
    e.preventDefault();

    const customerId = localStorage.getItem('userId');
    if (!customerId) {
    setMessage('User not logged in');
    return;
    }

    if (!claimAmount || !incidentDate || !description) {
    setMessage('Please fill all fields');
    return;
    }

    const payload = {
    customerId: Number(customerId),
    claimtypeId: Number(selectedClaimTypeId),
    claimAmount: Number(claimAmount),
    incidentDate: incidentDate,
    description: description
    };

    try {
    await axios.post(`${BASE_URL}/api/claims-extended`, payload);
    setMessage('Claim submitted successfully!');
    setClaimAmount('');
    setIncidentDate('');
    setDescription('');
    setSelectedClaimTypeId(claimTypes.length > 0 ? claimTypes[0].claimtypeId : '');
    } catch (error) {
    console.error('Error submitting claim:', error);
    setMessage('Error submitting claim');
    }
    };

    return (
    <div style={{ padding: '20px' }}>
    <h2>Apply for a Claim</h2>
    {message && <p>{message}</p>}
    <form onSubmit={handleSubmit}>
    <label>
    Claim Type:
    <select
    value={selectedClaimTypeId}
    onChange={(e) => setSelectedClaimTypeId(e.target.value)}
    required
    >
    {claimTypes.map(type => (
    <option key={type.claimtypeId} value={type.claimtypeId}>
    {type.name}
    </option>
    ))}
    </select>
    </label>
    <br /><br />
    <label>
    Claim Amount:
    <input
    type="number"
    step="0.01"
    value={claimAmount}
    onChange={(e) => setClaimAmount(e.target.value)}
    required
    min="0.01"/>
    </label>
    <br /><br />
    <label>
    Incident Date:
    <input
    type="date"
    value={incidentDate}
    onChange={(e) => setIncidentDate(e.target.value)}
    required/>
    </label>
    <br /><br />
    <label>
    Description:
    <textarea
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    required
    rows="4"
    cols="50"/>
    </label>
    <br /><br />
    <button type="submit">Submit Claim</button>
    </form>
    </div>
    );
    };

    export default ApplyClaim;

