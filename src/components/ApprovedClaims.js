import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiCheckCircle, FiDollarSign, FiCalendar, FiInfo, FiDownload, 
         FiAlertCircle, FiFileText, FiChevronUp, FiChevronDown, 
         FiChevronLeft, FiChevronRight, FiFilter } from 'react-icons/fi';
import BASE_URL from '../config/Backendapi';
import './ApprovedClaims.css';

const ApprovedClaims = () => {
    const [approvedClaims, setApprovedClaims] = useState([]);
    const [filteredClaims, setFilteredClaims] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [isPaymentLoading, setIsPaymentLoading] = useState(false);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    
    // Sorting state
    const [sortField, setSortField] = useState('id');
    const [sortDirection, setSortDirection] = useState('desc');
    
    // Filter state
    const [amountFilter, setAmountFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');

    useEffect(() => {
        const scriptId = "razorpay-checkout-js";
        if (!document.getElementById(scriptId)) {
            const script = document.createElement("script");
            script.id = scriptId;
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

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
                setFilteredClaims(approved);
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

    useEffect(() => {
        let result = [...approvedClaims];
        
        // Apply amount filter
        if (amountFilter === 'high') {
            result = result.sort((a, b) => b.claimAmount - a.claimAmount);
        } else if (amountFilter === 'low') {
            result = result.sort((a, b) => a.claimAmount - b.claimAmount);
        }
        
        // Apply date filter
        if (dateFilter === 'newest') {
            result = result.sort((a, b) => new Date(b.incidentDate) - new Date(a.incidentDate));
        } else if (dateFilter === 'oldest') {
            result = result.sort((a, b) => new Date(a.incidentDate) - new Date(b.incidentDate));
        }
        
        // Apply sorting
        result.sort((a, b) => {
            let aValue, bValue;
            
            if (sortField === 'claimType') {
                aValue = a.claimType?.name || '';
                bValue = b.claimType?.name || '';
            } else if (sortField === 'amount') {
                aValue = a.claimAmount || 0;
                bValue = b.claimAmount || 0;
            } else if (sortField === 'incidentDate') {
                aValue = new Date(a.incidentDate);
                bValue = new Date(b.incidentDate);
            } else {
                aValue = a[sortField] || '';
                bValue = b[sortField] || '';
            }
            
            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        setFilteredClaims(result);
        setCurrentPage(1);
    }, [approvedClaims, sortField, sortDirection, amountFilter, dateFilter]);

    // Get current claims for pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentClaims = filteredClaims.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredClaims.length / itemsPerPage);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Handle sorting
    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const showPopup = (message) => {
        let popup = document.createElement("div");
        popup.innerText = message;
        popup.style.position = "fixed";
        popup.style.top = "20px";
        popup.style.right = "20px";
        popup.style.background = "#4CAF50";
        popup.style.color = "#fff";
        popup.style.padding = "15px 25px";
        popup.style.borderRadius = "8px";
        popup.style.boxShadow = "0 4px 6px rgba(0,0,0,0.2)";
        popup.style.zIndex = "9999";
        document.body.appendChild(popup);
        setTimeout(() => popup.remove(), 3000);
    };

    const handleClaimPayment = async (claim) => {
        const userId = localStorage.getItem('userId');
        
        if (!userId) {
            setMessage({ text: 'User not logged in', type: 'error' });
            return;
        }

        if (!claim.id || !claim.claimAmount) {
            setMessage({ text: 'Invalid claim data', type: 'error' });
            return;
        }

        setIsPaymentLoading(true);
        setMessage({ text: '', type: '' });

        try {
            const res = await axios.post(`${BASE_URL}/api/orders/create`, {}, {
                params: {
                    userId: Number(userId),
                    claimsId: Number(claim.id),
                    amount: Number(claim.claimAmount),
                },
            });

            const order = res.data;

            if (!window.Razorpay) {
                setMessage({ text: 'Razorpay SDK failed to load. Refresh and try again.', type: 'error' });
                return;
            }

            const options = {
                key: process.env.REACT_APP_RAZORPAY_KEY_ID || "rzp_test_4LPGV7rP4wBreT",
                name: "Insurance Claims",
                description: `Claim Payment - #${claim.id}`,
                order_id: order.orderId,
                handler: function (response) {
                    showPopup(`₹${claim.claimAmount.toFixed(2)} credited to your wallet!`);
                    setMessage({ 
                        text: `Payment successful for Claim #${claim.id}`, 
                        type: 'success' 
                    });
                },
                prefill: {
                    name: "Your Customer",
                    email: "customer@example.com",
                    contact: "9999999999",
                },
                theme: {
                    color: "#3399cc"
                },
                modal: {
                    ondismiss: function () {
                        setMessage({ text: 'Payment cancelled', type: 'error' });
                    }
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            setMessage({
                text: err.response?.data?.message || 'You Are Already Claimed this Amount',
                type: 'error'
            });
        } finally {
            setIsPaymentLoading(false);
        }
    };

    const handleDownloadDocuments = (claimId) => {
        setMessage({
            text: `Documents downloaded for Claim #${claimId}`,
            type: 'success'
        });
    };

    const SortIcon = ({ field }) => {
        if (sortField !== field) return <FiFilter className="sort-icon" />;
        return sortDirection === 'asc' 
            ? <FiChevronUp className="sort-icon active" /> 
            : <FiChevronDown className="sort-icon active" />;
    };

    const totalApprovedAmount = approvedClaims.reduce((sum, claim) => sum + (claim.claimAmount || 0), 0);

    return (
        <div className="approved-claims-container">
            <div className="claims-header">
                <h2 className="claims-title">
                    <FiCheckCircle className="title-icon" />
                    Approved Claims
                </h2>
                <p className="claims-subtitle">Your successfully approved insurance claims</p>
            </div>

            {/* Stats Overview */}
            <div className="stats-overview">
                <div className="stat-card total-claims">
                    <div className="stat-icon">
                        <FiFileText />
                    </div>
                    <div className="stat-content">
                        <h3>{approvedClaims.length}</h3>
                        <p>Total Approved</p>
                    </div>
                </div>
                <div className="stat-card total-amount">
                    <div className="stat-icon">
                        <FiDollarSign />
                    </div>
                    <div className="stat-content">
                        <h3>₹{totalApprovedAmount.toFixed(2)}</h3>
                        <p>Total Amount</p>
                    </div>
                </div>
                <div className="stat-card average-amount">
                    <div className="stat-icon">
                        <FiDollarSign />
                    </div>
                    <div className="stat-content">
                        <h3>₹{approvedClaims.length ? (totalApprovedAmount / approvedClaims.length).toFixed(2) : '0.00'}</h3>
                        <p>Average Claim</p>
                    </div>
                </div>
            </div>

            {message.text && (
                <div className={`alert-message ${message.type}`}>
                    {message.type === 'error' ? <FiAlertCircle /> : <FiCheckCircle />}
                    <span>{message.text}</span>
                </div>
            )}

            {/* Filters and Sorting */}
            <div className="controls-container">
                <div className="filter-section">
                    <h4>Filter by:</h4>
                    <div className="filter-group">
                        <select
                            value={amountFilter}
                            onChange={(e) => setAmountFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="">Amount</option>
                            <option value="high">Highest Amount</option>
                            <option value="low">Lowest Amount</option>
                        </select>
                        
                        <select
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="">Date</option>
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                        </select>
                    </div>
                </div>

                <div className="sort-section">
                    <h4>Sort by:</h4>
                    <div className="sort-buttons">
                        <button 
                            onClick={() => handleSort('id')}
                            className={`sort-btn ${sortField === 'id' ? 'active' : ''}`}
                        >
                            Claim ID <SortIcon field="id" />
                        </button>
                        <button 
                            onClick={() => handleSort('amount')}
                            className={`sort-btn ${sortField === 'amount' ? 'active' : ''}`}
                        >
                            Amount <SortIcon field="amount" />
                        </button>
                        <button 
                            onClick={() => handleSort('incidentDate')}
                            className={`sort-btn ${sortField === 'incidentDate' ? 'active' : ''}`}
                        >
                            Date <SortIcon field="incidentDate" />
                        </button>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading your approved claims...</p>
                </div>
            ) : filteredClaims.length === 0 ? (
                <div className="empty-state">
                    <FiCheckCircle className="empty-icon" />
                    <h3>No Approved Claims</h3>
                    <p>You don't have any approved claims at this time.</p>
                </div>
            ) : (
                <>
                    <div className="claims-grid">
                        {currentClaims.map((claim, index) => (
                            <div
                                key={claim.id}
                                className="claim-card"
                                style={{ animationDelay: `${index * 0.1}s` }}
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
                                        disabled={isPaymentLoading}
                                    >
                                        <FiDollarSign className="btn-icon" />
                                        {isPaymentLoading ? 'Processing...' : 'Claim Payment'}
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

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="pagination-container">
                            <button 
                                onClick={() => paginate(currentPage - 1)} 
                                disabled={currentPage === 1}
                                className="pagination-btn"
                            >
                                <FiChevronLeft /> Previous
                            </button>
                            
                            <div className="pagination-numbers">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                                    <button
                                        key={number}
                                        onClick={() => paginate(number)}
                                        className={currentPage === number ? 'pagination-btn active' : 'pagination-btn'}
                                    >
                                        {number}
                                    </button>
                                ))}
                            </div>
                            
                            <button 
                                onClick={() => paginate(currentPage + 1)} 
                                disabled={currentPage === totalPages}
                                className="pagination-btn"
                            >
                                Next <FiChevronRight />
                            </button>
                        </div>
                    )}
                    
                    <div className="results-info">
                        Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredClaims.length)} of {filteredClaims.length} approved claims
                    </div>
                </>
            )}
        </div>
    );
};

export default ApprovedClaims;
