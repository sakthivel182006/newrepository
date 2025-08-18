import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiCheckCircle, FiDollarSign, FiCalendar, FiInfo, FiDownload, FiAlertCircle,FiFileText } from 'react-icons/fi';
import BASE_URL from '../config/Backendapi';
import './ApprovedClaims.css'; 

const ApprovedClaims = () => {
    const [approvedClaims, setApprovedClaims] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            setMessage({ text: 'Please login to view approved claims', type: 'error' });
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        axios.get(`${BASE_URL}/api/claims-extended/user/${userId}`)
        .then((res) => {
            const approved = res.data.filter(
                claim => claim.status && claim.status.toUpperCase() === 'APPROVED'
            );
            setApprovedClaims(approved);
            setIsLoading(false);
        })
        .catch((err) => {
            console.error(err);
            setMessage({ 
                text: err.response?.data?.message || 'Failed to load claims', 
                type: 'error' 
            });
            setIsLoading(false);
        });
    }, []);

    const handleClaimPayment = (claim) => {

        setMessage({ 
            text: `Payment initiated for Claim #${claim.id} (₹${claim.claimAmount.toFixed(2)})`, 
            type: 'success' 
        });
    }
    

    const handleDownloadDocuments = (claimId) => {

        setMessage({ 
            text: `Documents downloaded for Claim #${claimId}`, 
            type: 'success' 
        });
    };

    return (
        <div className="approved-claims-container">
            <div className="claims-header">
                <h2 className="claims-title">
                    <FiCheckCircle className="title-icon" />
                    Approved Claims
                    </h2>
                    <p className="claims-subtitle">Your successfully approved insurance claims</p>
                    </div>
                    {message.text && (
                        <div className={`alert-message ${message.type}`}>
                    {message.type === 'error' ? <FiAlertCircle /> : <FiCheckCircle />}
                    <span>{message.text}</span>
                    </div>
                    )}

{isLoading ? (
<div className="loading-spinner">
<div className="spinner"></div>
<p>Loading your approved claims...</p>
</div>
) : approvedClaims.length === 0 ? (
<div className="empty-state">
<FiCheckCircle className="empty-icon" />
<h3>No Approved Claims</h3>
<p>You don't have any approved claims at this time.</p>
</div>
) : (
    <div className="claims-grid">
        {approvedClaims.map((claim, index) => (
            <div 
            key={claim.id} 
            className="claim-card"
            style={{ animationDelay: `${index * 0.1}s `}}
            >
            <div className="card-header">
            <h3 className="claim-id">Claim #{claim.id}</h3>
            <span className="approved-badge">
            <FiCheckCircle className="badge-icon" />
            Approved
            </span>
            </div>

            <div className="card-body">
            <div className="claim-detail">
            <FiFileText className="detail-icon" />
            <span className="detail-label">Type:</span>
            <span>{claim.claimType?.name || 'N/A'}</span>
            </div>

            <div className="claim-detail">
            <FiDollarSign className="detail-icon" />
            <span className="detail-label">Amount:</span>
            <span className="amount">₹{claim.claimAmount?.toFixed(2) || '0.00'}</span>
            </div>

            <div className="claim-detail">
            <FiCalendar className="detail-icon" />
            <span className="detail-label">Incident Date:</span>
            <span>{new Date(claim.incidentDate).toLocaleDateString()}</span>
            </div>

            <div className="claim-detail description">
            <FiInfo className="detail-icon" />
            <span className="detail-label">Description:</span>
            <p>{claim.description || 'No description provided'}</p>
            </div>
            </div>

            <div className="card-footer">
            <button 
            className="payment-btn"
            onClick={() => handleClaimPayment(claim)}
            >
            <FiDollarSign className="btn-icon" />
            Claim Payment
            </button>
            <button 
            className="download-btn"
            onClick={() => handleDownloadDocuments(claim.id)}
            >
            <FiDownload className="btn-icon" />
            Documents
            </button>
            </div>
            </div>
            ))}
            </div>
            )}
            </div>
            );
            };

            export default ApprovedClaims;