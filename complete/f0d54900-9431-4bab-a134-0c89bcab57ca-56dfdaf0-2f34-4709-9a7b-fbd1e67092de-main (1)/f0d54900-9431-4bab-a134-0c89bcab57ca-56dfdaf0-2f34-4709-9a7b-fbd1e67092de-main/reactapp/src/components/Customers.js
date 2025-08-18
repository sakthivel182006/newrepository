import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from '../config/Backendapi';
import './Customer.css';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
    const fetchCustomers = async () => {
    try {
    const response = await axios.get(`${BASE_URL}/api/customers`);
    setCustomers(response.data);
    setLoading(false);
    } catch (err) {
    console.error('Error fetching customers:', err);
    setError('Failed to fetch customers. Please try again later.');
    setLoading(false);
    }
    };

    fetchCustomers();
    }, []);

    const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phoneNumber.includes(searchTerm) ||
    customer.policyNumber.includes(searchTerm)
    );

    return (
    <div className="customers-container">
    <h1 className="title">Customer Management</h1>

    <div className="search-container">
    <input
    type="text"
    className="search-input"
    placeholder="Search customers..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}/>
    </div>

    {loading ? (
        <div className="loading-spinner">
            <div className="spinner"></div>
            </div>
            ) : error ? (
                <div className="error-message">{error}</div>
                ) : filteredCustomers.length === 0 ? (
                <div className="no-data">
                {searchTerm ? 'No matching customers found' : 'No customers available'}
                </div>
                ) : (
                <table className="customers-table">
                <thead>
                <tr>
                <th>Customer ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Policy Number</th>
                </tr>
                </thead>
                <tbody>
                {filteredCustomers.map((customer) => (
                <tr key={customer.customerId}>
                    <td>{customer.customerId}</td>
                    <td>{customer.name}</td>
                    <td>{customer.email}</td>
                    <td>{customer.phoneNumber}</td>
                    <td>{customer.policyNumber}</td>
                    </tr>
                    ))}
                    </tbody>
                    </table>
                    )}
                    </div>
                    );
                    };

                    export default Customers;