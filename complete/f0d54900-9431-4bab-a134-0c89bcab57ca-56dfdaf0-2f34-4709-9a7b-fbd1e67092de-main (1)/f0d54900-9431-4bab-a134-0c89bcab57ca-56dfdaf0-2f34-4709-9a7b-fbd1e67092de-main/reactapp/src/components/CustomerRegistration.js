import React, { useState } from 'react';

const CustomerRegistration = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        policyNumber: '',
        });
        const [error, setError] = useState('');

        const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        };

        const handleSubmit = (e) => {
        e.preventDefault();
        const { name, email, phoneNumber, policyNumber } = formData;

        if (!name || !email || !phoneNumber || !policyNumber) {
        setError('All fields are required');
        return;
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
        setError('Invalid email format');
        return;
        }

        setError('');
        alert('Customer registered successfully!');
    };

    return (
    <div className="form-container">
        <h2>Register New Customer</h2>
        <form onSubmit={handleSubmit}>
        <label>
        Name
        <input name="name" value={formData.name} onChange={handleChange} />
        </label>
        <label>
        Email
        <input name="email" value={formData.email} onChange={handleChange} />
        </label>
        <label>
        Phone Number
        <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
        </label>
        <label>
        Policy Number
        <input name="policyNumber" value={formData.policyNumber} onChange={handleChange} />
        </label>
        <button className="btn-primary" type="submit">Register</button>
        </form>
        {error && <div data-testid="error-message" className="error">{error}</div>}
        </div>
        );
        };

        export default CustomerRegistration;
        