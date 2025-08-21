import React, { useEffect, useState } from 'react'
import BASE_URL from '../config/Backendapi'
import './Transferamountdetails.css'

const Transferamountdetails = () => {
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        total: 0,
        successful: 0,
        pending: 0,
        failed: 0
    })

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setLoading(true)
                const userId = localStorage.getItem('userId')
                const response = await fetch(`${BASE_URL}/api/orders/user/${userId}`)
                if (response.ok) {
                    const data = await response.json()
                    setTransactions(data)
                    calculateStats(data)
                }
            } catch (error) {
                console.error('Error fetching transactions:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchTransactions()
    }, [])

    const calculateStats = (data) => {
        const stats = {
            total: data.length,
            successful: data.filter(tx => tx.status?.toLowerCase() === 'success' || tx.status?.toLowerCase() === 'completed').length,
            pending: data.filter(tx => tx.status?.toLowerCase() === 'pending').length,
            failed: data.filter(tx => tx.status?.toLowerCase() === 'failed' || tx.status?.toLowerCase() === 'rejected').length
        }
        setStats(stats)
    }

    const getStatusClass = (status) => {
        const statusLower = status?.toLowerCase()
        if (statusLower === 'created' || statusLower === 'completed') return 'status-success'
        if (statusLower === 'pending') return 'status-pending'
        if (statusLower === 'failed' || statusLower === 'rejected') return 'status-failed'
        return 'status-pending'
    }

    const formatAmount = (amount, currency) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency || 'USD'
        }).format(amount || 0)
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    return (
        <div>
           
            <div className="transaction-container">
                {/* Header Section */}
                <div className="transaction-header">
                    <h1 className="transaction-title">Transaction History</h1>
                    <p className="transaction-subtitle">
                        Track and manage all your payment transactions in one place
                    </p>
                </div>

                {/* Statistics Cards */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-number">{stats.total}</div>
                        <div className="stat-label">Total Transactions</div>
                    </div>
                    
                   
                </div>

                {/* Transaction Table */}
                <div className="table-container">
                    {loading ? (
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                            <p>Loading transactions...</p>
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">📋</div>
                            <h3>No transactions found</h3>
                            <p>Your transaction history will appear here once you make your first payment.</p>
                        </div>
                    ) : (
                        <table className="transaction-table">
                            <thead>
                                <tr>
                                    <th>Claim ID</th>
                                    <th>Order ID</th>
                                    <th>Amount</th>
                                    <th>Currency</th>
                                    <th>Receipt</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((tx, index) => (
                                    <tr key={tx.id || index}>
                                        <td>
                                            <strong>{tx.claimsId || 'N/A'}</strong>
                                        </td>
                                        <td>
                                            <span style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
                                                {tx.orderId || 'N/A'}
                                            </span>
                                        </td>
                                        <td className={`amount-cell ${tx.amount > 0 ? 'amount-positive' : 'amount-negative'}`}>
                                            {formatAmount(tx.amount, tx.currency)}
                                        </td>
                                        <td>
                                            <span style={{ textTransform: 'uppercase', fontWeight: '600' }}>
                                                {tx.currency || 'USD'}
                                            </span>
                                        </td>
                                        <td>
                                            {tx.receipt ? (
                                                <a 
                                                    href={tx.receipt} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    style={{ 
                                                        color: '#667eea', 
                                                        textDecoration: 'none',
                                                        fontWeight: '500'
                                                    }}
                                                >
                                                    View Receipt
                                                </a>
                                            ) : (
                                                'No receipt'
                                            )}
                                        </td>
                                        <td>
                                            <span className={`status-badge ${getStatusClass(tx.status)}`}>
                                                {tx.status || 'Unknown'}
                                            </span>
                                        </td>
                                        <td>
                                            {formatDate(tx.createdAt || tx.date)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Transferamountdetails
