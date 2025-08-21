import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiSearch, FiFilter, FiClock, FiCheckCircle, FiXCircle, FiFileText, 
         FiDollarSign, FiCalendar, FiInfo, FiChevronUp, FiChevronDown, 
         FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import BASE_URL from '../config/Backendapi';
import './StatusTrack.css';

const StatusTrack = () => {
    const [claims, setClaims] = useState([]);
    const [filteredClaims, setFilteredClaims] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState({ text: '', type: '' });
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    
    // Sorting state
    const [sortField, setSortField] = useState('id');
    const [sortDirection, setSortDirection] = useState('desc');

    const claimStatusOptions = [
        { value: '', label: 'All Statuses', icon: <FiFileText /> },
        { value: 'SUBMITTED', label: 'Submitted', icon: <FiFileText /> },
        { value: 'IN_REVIEW', label: 'In Review', icon: <FiClock /> },
        { value: 'APPROVED', label: 'Approved', icon: <FiCheckCircle /> },
        { value: 'REJECTED', label: 'Rejected', icon: <FiXCircle /> },
    ];

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            setMessage({ text: 'Please login to view claims', type: 'error' });
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        axios.get(`${BASE_URL}/api/claims-extended/user/${userId}`)
            .then(response => {
                setClaims(response.data);
                setFilteredClaims(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching claims:', error);
                setMessage({ 
                    text: error.response?.data?.message || 'Failed to load claims', 
                    type: 'error' 
                });
                setIsLoading(false);
            });
    }, []);

    useEffect(() => {
        let result = [...claims];

        if (statusFilter) {
            result = result.filter(claim => 
                claim.status && claim.status.toUpperCase() === statusFilter.toUpperCase()
            );
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(claim => 
                (claim.id.toString().includes(query)) ||
                (claim.claimType?.name?.toLowerCase().includes(query)) ||
                (claim.description?.toLowerCase().includes(query))
            );
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
            } else if (sortField === 'incidentDate' || sortField === 'submissionDate') {
                aValue = new Date(a[sortField]);
                bValue = new Date(b[sortField]);
            } else {
                aValue = a[sortField] || '';
                bValue = b[sortField] || '';
            }
            
            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        setFilteredClaims(result);
        setCurrentPage(1); // Reset to first page when filters change
    }, [statusFilter, searchQuery, claims, sortField, sortDirection]);

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

    const getStatusBadge = (status) => {
        const statusMap = {
            'APPROVED': { 
                color: 'status-badge approved',
                icon: <FiCheckCircle className="mr-1" />
            },
            'REJECTED': { 
                color: 'status-badge rejected',
                icon: <FiXCircle className="mr-1" />
            },
            'IN_REVIEW': { 
                color: 'status-badge in-review',
                icon: <FiClock className="mr-1" />
            },
            'SUBMITTED': { 
                color: 'status-badge submitted',
                icon: <FiFileText className="mr-1" />
            },
            'default': { 
                color: 'status-badge default',
                icon: <FiFileText className="mr-1" />
            }
        };

        const statusKey = status?.toUpperCase() || 'default';
        const { color, icon } = statusMap[statusKey] || statusMap['default'];

        return (
            <span className={color}>
                {icon}
                {status ? status.replace('_', ' ') : 'Unknown'}
            </span>
        );
    };

    const SortIcon = ({ field }) => {
        if (sortField !== field) return <FiFilter className="sort-icon" />;
        return sortDirection === 'asc' 
            ? <FiChevronUp className="sort-icon active" /> 
            : <FiChevronDown className="sort-icon active" />;
    };

    return (
        <div className="status-track-container">
            <div className="status-track-header">
                <h2 className="status-track-title">Your Claim Status</h2>
                <p className="status-track-subtitle">Track and manage your insurance claims</p>
            </div>
            
            {message.text && (
                <div className={`alert-message ${message.type}`}>
                    {message.type === 'error' ? <FiXCircle /> : <FiCheckCircle />}
                    <span>{message.text}</span>
                </div>
            )}
            
            <div className="dashboard-cards">
                <div className="stat-card">
                    <div className="stat-icon total">
                        <FiFileText />
                    </div>
                    <div className="stat-content">
                        <h3>{claims.length}</h3>
                        <p>Total Claims</p>
                    </div>
                </div>
                
                <div className="stat-card">
                    <div className="stat-icon approved">
                        <FiCheckCircle />
                    </div>
                    <div className="stat-content">
                        <h3>{claims.filter(c => c.status === 'APPROVED').length}</h3>
                        <p>Approved</p>
                    </div>
                </div>
                
                <div className="stat-card">
                    <div className="stat-icon pending">
                        <FiClock />
                    </div>
                    <div className="stat-content">
                        <h3>{claims.filter(c => c.status === 'IN_REVIEW' || c.status === 'SUBMITTED').length}</h3>
                        <p>In Progress</p>
                    </div>
                </div>
                
                <div className="stat-card">
                    <div className="stat-icon rejected">
                        <FiXCircle />
                    </div>
                    <div className="stat-content">
                        <h3>{claims.filter(c => c.status === 'REJECTED').length}</h3>
                        <p>Rejected</p>
                    </div>
                </div>
            </div>

            <div className="filters-container">
                <div className="search-filter">
                    <FiSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search claims by ID, type, or description..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="status-filter">
                    <FiFilter className="filter-icon" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="filter-select"
                    >
                        {claimStatusOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {isLoading ? (
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading your claims...</p>
                </div>
            ) : filteredClaims.length === 0 ? (
                <div className="empty-state">
                    <FiFileText className="empty-icon" />
                    <h3>No Claims Found</h3>
                    <p>{searchQuery || statusFilter ? 
                        'Try adjusting your search or filter criteria' : 
                        'You have no claims to display yet'
                    }</p>
                </div>
            ) : (
                <>
                    <div className="claims-table-container">
                        <div className="table-responsive">
                            <table className="claims-table">
                                <thead>
                                    <tr>
                                        <th onClick={() => handleSort('id')}>
                                            <div className="table-header">
                                                Claim ID
                                                <SortIcon field="id" />
                                            </div>
                                        </th>
                                        <th onClick={() => handleSort('claimType')}>
                                            <div className="table-header">
                                                Type
                                                <SortIcon field="claimType" />
                                            </div>
                                        </th>
                                        <th onClick={() => handleSort('amount')}>
                                            <div className="table-header">
                                                Amount
                                                <SortIcon field="amount" />
                                            </div>
                                        </th>
                                        <th onClick={() => handleSort('incidentDate')}>
                                            <div className="table-header">
                                                Incident Date
                                                <SortIcon field="incidentDate" />
                                            </div>
                                        </th>
                                        <th>Description</th>
                                        <th onClick={() => handleSort('status')}>
                                            <div className="table-header">
                                                Status
                                                <SortIcon field="status" />
                                            </div>
                                        </th>
                                        <th onClick={() => handleSort('submissionDate')}>
                                            <div className="table-header">
                                                Submitted On
                                                <SortIcon field="submissionDate" />
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentClaims.map((claim, index) => (
                                        <tr 
                                            key={claim.id} 
                                            className="claim-row"
                                        >
                                            <td className="claim-id">#{claim.id}</td>
                                            <td>{claim.claimType?.name || 'N/A'}</td>
                                            <td>
                                                <div className="amount-cell">
                                                    <FiDollarSign className="cell-icon" />
                                                    <span>${claim.claimAmount?.toFixed(2) || '0.00'}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="date-cell">
                                                    <FiCalendar className="cell-icon" />
                                                    <span>{new Date(claim.incidentDate).toLocaleDateString()}</span>
                                                </div>
                                            </td>
                                            <td className="description-cell">
                                                <div className="description-content">
                                                    <FiInfo className="cell-icon" />
                                                    <span title={claim.description}>{claim.description || 'No description'}</span>
                                                </div>
                                            </td>
                                            <td>{getStatusBadge(claim.status)}</td>
                                            <td>
                                                <div className="date-cell">
                                                    <FiCalendar className="cell-icon" />
                                                    <span>{new Date(claim.submissionDate).toLocaleDateString()}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
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
                        Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredClaims.length)} of {filteredClaims.length} claims
                    </div>
                </>
            )}
        </div>
    );
};

export default StatusTrack;
