import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiUpload, FiX, FiFileText, FiDollarSign, FiCalendar, FiInfo, FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';
import './DocumentUpload.css';

const BASE_URL = 'https://8080-cbaacefbecfdaacedbdfdaffabfbdede.premiumproject.examly.io/api';

const DocumentsUpload = () => {
    const [claims, setClaims] = useState([]);
    const [selectedClaim, setSelectedClaim] = useState(null);
    const [documentName, setDocumentName] = useState('');
    const [documentUrl, setDocumentUrl] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });
    const [isLoading, setIsLoading] = useState(false);

    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchClaims = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${BASE_URL}/claims-extended/user/${userId}`);
                setClaims(response.data);
            } catch (err) {
                setMessage(`{ text: Error fetching claims: ${err.message}, type: 'error' }`);
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchClaims();
    }, [userId]);

    const handleUpload = async () => {
        if (!documentName) {
            setMessage({ text: 'Please enter document name', type: 'error' });
            return;
        }
        if (!documentUrl) {
            setMessage({ text: 'Please enter document URL', type: 'error' });
            return;
        }

        setIsLoading(true);
        try {
            const documentData = {
                documentName,
                fileUrl: documentUrl
                };

                await axios.post(`${BASE_URL}/claims/${selectedClaim.id}/${userId}/documents`, documentData);

                setMessage({ 
                    text: 'Document uploaded successfully!', 
                    type: 'success' 
                });
                setDocumentName('');
                setDocumentUrl('');
                setSelectedClaim(null);
            } catch (error) {
                const backendMessage = error.response?.data || error.message;
                setMessage(`{ 
                    text: Upload failed: ${backendMessage}, 
                    type: 'error' 
                    }`);
                    console.error(error);
                    } finally {
                    setIsLoading(false);
                    }
                    };

                    const getStatusBadge = (status) => {
                        const statusMap = {
                            'approved': { 
                                color: 'bg-green-100 text-green-800',
                                icon: <FiCheckCircle className="mr-1" />
                            },
                            'pending': { 
                                color: 'bg-yellow-100 text-yellow-800',
                                icon: <FiClock className="mr-1" />
                            },
                            'rejected': { 
                                color: 'bg-red-100 text-red-800',
                                icon: <FiXCircle className="mr-1" />
                                },
                                'default': { 
                                    color: 'bg-gray-100 text-gray-800',
                                    icon: <FiFileText className="mr-1" />
                                }
                                };

                                const statusKey = status?.toLowerCase() || 'default';
                                const { color, icon } = statusMap[statusKey] || statusMap['default'];

                                return (
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${color}`}>
                                        {icon}
                                        {status || 'Unknown'}
                                        </span>
                                );
                    };

                    return (
                        <div className="documents-container">
                            <div className="documents-header">
                                <h2 className="documents-title">Your Insurance Claims</h2>
                                <p className="documents-subtitle">Manage and upload documents for your claims</p>
                                </div>


                                {message.text&&(
                                    <div className={`alert-message ${message.type}`}>
                                {message.type === 'success' ? <FiCheckCircle /> : <FiXCircle />}
                                <span>{message.text}</span>
                                </div>
                                )}


                                {isLoading && !claims.length ? (
                                <div className="loading-spinner">
                                    <div className="spinner"></div>
                                    <p>Loading your claims...</p>
                                    </div>
                                    ) : claims.length === 0 ? (
                                    <div className="empty-state">
                                        <FiFileText className="empty-icon" />
                                        <h3>No Claims Found</h3>
                                        <p>You don't have any claims to display yet.</p>
                                        </div>
                                        ) : (
                                            <div className="claims-grid">
                                                {claims.map(claim => (
                                                <div key={claim.id} className="claim-card">
                                                <div className="claim-card-header">
                                                <h3 className="claim-id">Claim #{claim.id}</h3>
                                                {getStatusBadge(claim.status)}
                                                </div>

                                                <div className="claim-details">
                                                <div className="detail-item">
                                                <FiFileText className="detail-icon" />
                                                <span>Type: {claim.claimType?.name || 'N/A'}</span>
                                                </div>
                                                <div className="detail-item">
                                                <FiDollarSign className="detail-icon" />
                                                <span>Amount: ${claim.claimAmount?.toFixed(2) || '0.00'}</span>
                                                </div>
                                                <div className="detail-item">
                                                <FiCalendar className="detail-icon" />
                                                <span>Date: {new Date(claim.incidentDate).toLocaleDateString()}</span>
                                                </div>
                                                <div className="detail-item">
                                                <FiInfo className="detail-icon" />
                                                <span className="detail-description">
                                                Description: {claim.description || 'No description provided'}
                                                </span>
                                                </div>
                                                </div>

                                                <button
                                                onClick={() => setSelectedClaim(claim)}
                                                className="upload-btn"
                                                >
                                                <FiUpload className="btn-icon" />
                                                Upload Documents
                                                </button>
                                                </div>
                                                ))}
                                                </div>
                                                )}

                                                {selectedClaim && (
                                                <div className="upload-modal">
                                                <div className="modal-overlay" onClick={() => !isLoading && setSelectedClaim(null)}></div>

                                                <div className="modal-content">
                                                <div className="modal-header">
                                                <h3>
                                                <FiUpload className="header-icon" />
                                                Upload Document for Claim #{selectedClaim.id}
                                                </h3>
                                                <button 
                                                className="close-btn"
                                                onClick={() => !isLoading && setSelectedClaim(null)}
                                                disabled={isLoading}
                                                >
                                                <FiX />
                                                </button>
                                                </div>

                                                <div className="modal-body">
                                                <div className="form-group">
                                                <label htmlFor="documentName">
                                                Document Name
                                                </label>
                                                <input
                                                id="documentName"
                                                type="text"
                                                value={documentName}
                                                onChange={(e) => setDocumentName(e.target.value)}
                                                placeholder="e.g. Medical Report, Police Report"
                                                disabled={isLoading}/>
                                                </div>

                                                <div className="form-group">
                                                <label htmlFor="documentUrl">
                                                Document URL
                                                </label>
                                                <input
                                                id="documentUrl"
                                                type="url"
                                                value={documentUrl}
                                                onChange={(e) => setDocumentUrl(e.target.value)}
                                                placeholder="https://example.com/document.pdf"
                                                disabled={isLoading}/>
                                                <small className="input-hint">
                                                    Upload your file to a cloud service and paste the link here
                                                    </small>
                                                    </div>
                                                    </div>

                                                    <div className="modal-footer">
                                                    <button 
                                                    className="cancel-btn"
                                                    onClick={() => !isLoading && setSelectedClaim(null)}
                                                    disabled={isLoading}
                                                    >
                                                    Cancel
                                                    </button>
                                                    <button 
                                                    className="submit-btn"
                                                    onClick={handleUpload}
                                                    disabled={isLoading}
                                                    >
                                                    {isLoading ? (
                                                    <span className="btn-loading">
                                                    <span className="spinner"></span>
                                                    Uploading...
                                                    </span>
                                                    ) : (
                                                    'Upload Document'
                                                    )}
                                                    </button>
                                                    </div>
                                                    </div>
                                                    </div>
                                                    )}
                                                    </div>
                                                    );
                                                    };

                                                    export default DocumentsUpload;
                                        