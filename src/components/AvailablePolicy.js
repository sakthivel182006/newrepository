import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaFileAlt, FaCalendarAlt, FaMoneyBillWave, FaInfoCircle, FaCheckCircle } from 'react-icons/fa';
import BASE_URL from '../config/Backendapi';
import './ApplyClaim.css'; 

const ApplyClaim = () => {
    const [claimTypes, setClaimTypes] = useState([]);
    const [selectedClaimTypeId, setSelectedClaimTypeId] = useState('');
    const [claimAmount, setClaimAmount] = useState('');
    const [incidentDate, setIncidentDate] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

    useEffect(() => {
        setIsLoading(true);
        axios.get(`${BASE_URL}/api/claim-types`)
        .then(response => {
            setClaimTypes(response.data);
            if (response.data.length > 0) {
                setSelectedClaimTypeId(response.data[0].claimtypeId);
            }
            setIsLoading(false);
        })
        .catch(error => {
            console.error('Error fetching claim types:', error);
            setIsLoading(false);
        });
        }, []);

        const handleSubmit = async (e) => {
            e.preventDefault();
            setIsLoading(true);

            const customerId = localStorage.getItem('userId');
            if (!customerId) {
                setMessage({ text: 'Please login to submit a claim', type: 'error' });
                setIsLoading(false);
                return;
            }

            if (!claimAmount || !incidentDate || !description) {
                setMessage({ text: 'Please fill all required fields', type: 'error' });
                setIsLoading(false);
                return;
            }

            const payload = {
                customerId: Number(customerId),
                claimtypeId: Number(selectedClaimTypeId),
                claimAmount: Number(claimAmount),
                incidentDate,
                description
            };

            try {
                await axios.post(`${BASE_URL}/api/claims-extended`, payload);
                setMessage({ text: 'Claim submitted successfully!', type: 'success' });
                setClaimAmount('');
                setIncidentDate('');
                setDescription('');
                setCurrentStep(1);
            } catch (error) {
                console.error('Error submitting claim:', error);
                setMessage({ text: error.response?.data?.message || 'Error submitting claim', type: 'error' });
                } finally {
                setIsLoading(false);
                }
                };

                return (
                    <div className="apply-claim-container">
                        <div className="claim-header">
                            <h2 className="claim-title">File a New Claim</h2>
                            <p className="claim-subtitle">Complete the form below to submit your insurance claim</p>
                            </div>

                            <div className="progress-steps">
                                <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
                                    <span className="step-number">1</span>
                                    <span className="step-label">Select Claim Type</span>
                                    </div>
                                    <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
                                        <span className="step-number">2</span>
                                        <span className="step-label">Enter Details</span>
                                        </div>
                                        <div className={`step ${currentStep === 3 ? 'active' : ''}`}>
                                            <span className="step-number">3</span>
                                            <span className="step-label">Confirmation</span>
                                            </div>
                                            </div>

                                            {message && (
                                                <div className={`alert-message${message.type}`}>
                                            {message.type === 'success' ? <FaCheckCircle /> : <FaInfoCircle />}

                                            <span>{message.text}</span>
                                            </div>
                                            )}
                                                <div className="claim-form-container">

                                                    {currentStep === 1 && (
                                                        <div className="claim-step active">
                                                            <h3 className="step-title">
                                                                <FaFileAlt className="step-icon" />
                                                                Select Claim Type
                                                                </h3>

                                                                {isLoading ? (
                                                                <div className="loading-spinner">Loading claim types...</div>
                                                                ) : (
                                                                <div className="claim-types-grid">
                                                                {claimTypes.map(type => (
                                                                <div 
                                                                key={type.claimtypeId}
                                                                className={`claim-type-card ${selectedClaimTypeId === type.claimtypeId ? 'selected' : ''}`}
                                                                onClick={() => {
                                                                setSelectedClaimTypeId(type.claimtypeId);
                                                                setCurrentStep(2);
                                                                }}
                                                                >
                                                                <div className="claim-type-icon">
                                                                <FaFileAlt />
                                                                </div>
                                                                <h4 className="claim-type-name">{type.name}</h4>
                                                                <p className="claim-type-id">ID: {type.claimtypeId}</p>
                                                                </div>
                                                                ))}
                                                                </div>
                                                                )}

                                                                <div className="step-actions">
                                                                <button 
                                                                className="next-btn"
                                                                onClick={() => selectedClaimTypeId && setCurrentStep(2)}
                                                                disabled={!selectedClaimTypeId}
                                                                >
                                                                Next: Enter Details
                                                                </button>
                                                                </div>
                                                                </div>
                                                                )}

                                                                {currentStep === 2 && (
                                                                <div className="claim-step active">
                                                                <h3 className="step-title">
                                                                <FaInfoCircle className="step-icon" />
                                                                Claim Details
                                                                </h3>

                                                                <form className="claim-details-form">
                                                                <div className="form-group">
                                                                <label>
                                                                <FaMoneyBillWave className="input-icon" />
                                                                Claim Amount ($)
                                                                </label>
                                                                <input
                                                                type="number"
                                                                step="0.01"
                                                                min="0.01"
                                                                value={claimAmount}
                                                                onChange={(e) => setClaimAmount(e.target.value)}
                                                                placeholder="Enter claim amount"
                                                                required/>
                                                                </div>

                                                                <div className="form-group">
                                                                    <label>
                                                                    <FaCalendarAlt className="input-icon" />
                                                                    Incident Date
                                                                    </label>
                                                                    <input
                                                                    type="date"
                                                                    value={incidentDate}
                                                                    onChange={(e) => setIncidentDate(e.target.value)}
                                                                    required
                                                                    max={new Date().toISOString().split('T')[0]}/>
                                                                    </div>

                                                                    <div className="form-group">
                                                                        <label>
                                                                        <FaInfoCircle className="input-icon" />
                                                                        Description
                                                                        </label>
                                                                        <textarea
                                                                        value={description}
                                                                        onChange={(e) => setDescription(e.target.value)}
                                                                        placeholder="Describe the incident in detail"
                                                                        required
                                                                        rows="5"/>
                                                                        </div>

                                                                        <div className="step-actions">
                                                                            <button 
                                                                            type="button" 
                                                                            className="back-btn"
                                                                            onClick={() => setCurrentStep(1)}
                                                                            >
                                                                            Back
                                                                            </button>
                                                                            <button 
                                                                            type="button" 
                                                                            className="submit-btn"
                                                                            onClick={handleSubmit}
                                                                            disabled={isLoading}
                                                                            >
                                                                            {isLoading ? 'Submitting...' : 'Submit Claim'}
                                                                            </button>
                                                                            </div>
                                                                            </form>
                                                                            </div>
                                                                            )}

                                                                            {currentStep === 3 && message?.type === 'success' && (
                                                                            <div className="claim-step active confirmation-step">
                                                                            <div className="success-animation">
                                                                            <FaCheckCircle />
                                                                            </div>
                                                                            <h3 className="confirmation-title">Claim Submitted Successfully!</h3>
                                                                            <p className="confirmation-message">
                                                                                Your claim has been received. We'll review it and get back to you shortly.
                                                                                </p>
                                                                                <button 
                                                                                className="new-claim-btn"
                                                                                onClick={() => {
                                                                                setCurrentStep(1);
                                                                                setMessage('');
                                                                                }}
                                                                                >
                                                                                File Another Claim
                                                                                </button>
                                                                                </div>
                                                                                )}
                                                                                </div>
                                                                                </div>
                                                                                );
                                                                                };

                                                                                export default ApplyClaim;