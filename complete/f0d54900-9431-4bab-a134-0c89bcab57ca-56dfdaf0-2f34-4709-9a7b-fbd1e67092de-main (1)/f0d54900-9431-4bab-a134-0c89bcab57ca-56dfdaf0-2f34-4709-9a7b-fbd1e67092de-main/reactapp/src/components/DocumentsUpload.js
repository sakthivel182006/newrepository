import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BASE_URL = 'https://8080-cbaacefbecfdaacedbdfdaffabfbdede.premiumproject.examly.io/api';

const DocumentsUpload = () => {
const [claims, setClaims] = useState([]);
const [selectedClaim, setSelectedClaim] = useState(null);
const [documentName, setDocumentName] = useState('');
const [documentUrl, setDocumentUrl] = useState('');
const [message, setMessage] = useState('');

const userId =localStorage.getItem('userId');

useEffect(() => {
axios.get(`${BASE_URL}/claims-extended/user/${userId}`)
.then(res => setClaims(res.data))
.catch(err => console.error(err));
}, [userId]);

const handleUpload = async () => {
    if (!documentName) {
        setMessage('Please enter document name');
        return;
        }
        if (!documentUrl) {
            setMessage('Please enter document URL');
            return;
            }
            if (!selectedClaim) {
            setMessage('No claim selected');
            return;
            }

            try {
                const documentData = {
                documentName: documentName,
                fileUrl: documentUrl
                };

                await axios.post(`${BASE_URL}/claims/${selectedClaim.id}/${userId}/documents`, documentData);

                setMessage('Document info saved successfully');
                setDocumentName('');
                setDocumentUrl('');
                setSelectedClaim(null);
                } catch (error) {


                const backendMessage = error.response && error.response.data 
                ? error.response.data 
                : error.message;

                setMessage(`Error: ${backendMessage}`);
                console.error(error);

                }
                };

                return (
                <div style={{ padding: 20 }}>
                <h2>Your Claims</h2>
                <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%', marginBottom: 20 }}>
                <thead>
                <tr>
                <th>ID</th>
                <th>Claim Amount</th>
                <th>Description</th>
                <th>Status</th>
                <th>Incident Date</th>
                <th>Claim Type</th>
                <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {claims.map(claim => (
                <tr key={claim.id}>
                <td>{claim.id}</td>
                <td>{claim.claimAmount}</td>
                <td>{claim.description}</td>
                <td>{claim.status}</td>
                <td>{claim.incidentDate}</td>
                <td>{claim.claimType?.name}</td>
                <td>
                <button onClick={() => setSelectedClaim(claim)}>Add Documents</button>
                </td>
                </tr>
                ))}
                </tbody>
                </table>

                {selectedClaim && (
                <div style={{ border: '1px solid #ccc', padding: 20, maxWidth: 400 }}>
                <h3>Upload Document for Claim ID: {selectedClaim.id}</h3>
                <div>
                <label>Document Name:</label><br />
                <input
                type="text"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                placeholder="Enter document name"
                style={{ width: '100%', marginBottom: 10 }}/>
                </div>
                <div>
                <label>Document URL:</label><br />
                <input
                type="url"
                value={documentUrl}
                onChange={(e) => setDocumentUrl(e.target.value)}
                placeholder="Enter document URL"
                style={{ width: '100%' }}/>
                </div>
                <br />
                <button onClick={handleUpload}>Save Document</button>{' '}
                <button onClick={() => setSelectedClaim(null)}>Cancel</button>
                {message && <p>{message}</p>}
                </div>
                )}
                </div>
                );
                };

                export default DocumentsUpload;
                