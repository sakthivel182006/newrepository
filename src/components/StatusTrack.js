import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiSearch, FiFilter, FiClock, FiCheckCircle, FiXCircle, FiFileText, FiDollarSign, FiCalendar, FiInfo } from 'react-icons/fi';
import BASE_URL from '../config/Backendapi';
import './StatusTrack.css';

const StatusTrack = () => {
    const [claims, setClaims] = useState([]);
    const [filteredClaims, setFilteredClaims] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState({ text: '', type: '' });

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

                            setFilteredClaims(result);
                            }, [statusFilter, searchQuery, claims]);

                            const getStatusBadge = (status) => {
                            const statusMap = {
                            'APPROVED': { 
                            color: 'bg-green-100 text-green-800',
                            icon: <FiCheckCircle className="mr-1" />
                            },
                            'REJECTED': { 
                            color: 'bg-red-100 text-red-800',
                            icon: <FiXCircle className="mr-1" />
                            },
                            'IN_REVIEW': { 
                            color: 'bg-yellow-100 text-yellow-800',
                            icon: <FiClock className="mr-1" />
                            },
                            'SUBMITTED': { 
                            color: 'bg-blue-100 text-blue-800',
                            icon: <FiFileText className="mr-1" />
                            },
                            'default': { 
                            color: 'bg-gray-100 text-gray-800',
                            icon: <FiFileText className="mr-1" />
                            }
                            };

                            const statusKey = status?.toUpperCase() || 'default';
                            const { color, icon } = statusMap[statusKey] || statusMap['default'];

                            return (
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${color}`}>
                            {icon}
                            {status ? status.replace('_', ' ') : 'Unknown'}
                            </span>
                            );
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
                            
                            <div className="filters-container">
                            <div className="search-filter">
                            <FiSearch className="search-icon" />
                            <input
                            type="text"
                            placeholder="Search claims..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"/>
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
                                        <div className="claims-table-container">
                                        <div className="claims-table-scroll">
                                        <table className="claims-table">
                                        <thead>
                                        <tr>
                                        <th>Claim ID</th>
                                        <th>Type</th>
                                        <th>Amount</th>
                                        <th>Incident Date</th>
                                        <th>Description</th>
                                        <th>Status</th>
                                        <th>Submitted On</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {filteredClaims.map((claim, index) => (
                                        <tr 
                                        key={claim.id} 
                                        className="claim-row"
                                        style={{ animationDelay: `${index * 0.05}s `}}
                                        >
                                        <td>#{claim.id}</td>
                                        <td>{claim.claimType?.name || 'N/A'}</td>
                                        <td>
                                        <div className="amount-cell">
                                        <FiDollarSign className="cell-icon" />
                                        <span>₹{claim.claimAmount?.toFixed(2) || '0.00'}</span>
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
                                        <span>{claim.description || 'No description'}</span>
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
                                        )}
                                        </div>
                                        );
                                        };

                                        export default StatusTrack;
                            