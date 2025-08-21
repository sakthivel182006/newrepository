import React, { useState, useEffect } from 'react';
import BASE_URL from './config/Backendapi';
import './AuthForm.css';
import QrLoginPopup from './components/QrLoginPopup';

const App2 = ({ onLoginSuccess }) => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [showQrPopup, setShowQrPopup] = useState(false);
    const [registration, setRegistration] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        password: ''
    });
    const [login, setLogin] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [loginError, setLoginError] = useState('');
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');

    useEffect(() => {
        const createParticles = () => {
            const particlesContainer = document.getElementById('particles-js');
            if (!particlesContainer) return;
            particlesContainer.innerHTML = '';
            const particleCount = window.innerWidth < 768 ? 30 : 50;
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.classList.add('particle');
                const size = Math.random() * 3 + 2;
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                particle.style.left = `${Math.random() * 100}%`;
                particle.style.top = `${Math.random() * 100}%`;
                const duration = Math.random() * 10 + 10;
                particle.style.animationDuration = `${duration}s`;
                particle.style.animationDelay = `${Math.random() * 10}s`;
                particlesContainer.appendChild(particle);
            }
        };
        createParticles();
        const handleResize = () => createParticles();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const validateRegistration = () => {
        const errs = {};
        if (!registration.name.trim()) errs.name = 'Name is mandatory';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(registration.email)) errs.email = 'Email should be valid';
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(registration.phoneNumber)) errs.phoneNumber = 'Phone number must be 10 digits';
        if (!registration.password.trim()) errs.password = 'Password is required';
        return errs;
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateRegistration();
        if (Object.keys(validationErrors).length === 0) {
            try {
                const response = await fetch(`${BASE_URL}/api/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(registration),
                });
                if (response.ok) {
                    alert('Registration successful. Please check your email to verify.');
                    setRegistration({ name: '', email: '', phoneNumber: '', password: '' });
                    setErrors({});
                    setIsRegistering(false);
                } else {
                    const errorData = await response.json();
                    alert('Error:\n' + JSON.stringify(errorData));
                }
            } catch (error) {
                alert('' + error.message);
            }
        } else {
            setErrors(validationErrors);
        }
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoginError('');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(login.email)) {
            setLoginError('Email should be valid');
            return;
        }

        try {
            const response = await fetch(
                `${BASE_URL}/api/login?email=${encodeURIComponent(login.email)}&password=${encodeURIComponent(login.password)}`, 
                { method: 'POST' }
            );

            const user = await response.json();

            if (!response.ok) {
                setLoginError(user.message || 'Login failed. Please try again.');
                return;
            }

            saveUserToLocal(user);
            alert(`Login successful: ${user.role}`);
            onLoginSuccess(user.email, user.role);
        } catch (err) {
            setLoginError('' + err.message);
        }
    };

    const saveUserToLocal = (user) => {
        const normalized = {
            userId: user.userId ?? user.id,
            email: user.email,
            verified: user.verified,
            role: user.role,
        };

        localStorage.setItem('loggedInEmail', normalized.email);
        localStorage.setItem('role', normalized.role);
        localStorage.setItem('loggedInUserDetails', JSON.stringify(normalized));
        localStorage.setItem('userId', normalized.userId);
    };

    const handleForgotPassword = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(forgotPasswordEmail)) {
            setForgotPasswordMessage('Please enter a valid email address');
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/api/users/password/reset/${encodeURIComponent(forgotPasswordEmail)}`, {
                method: 'POST'
            });

            if (response.ok) {
                setForgotPasswordMessage('Password reset instructions have been sent to your email');
            } else {
                setForgotPasswordMessage('Error sending reset instructions. Please try again.');
            }
        } catch (error) {
            const   errmsg=await response.text();
            setForgotPasswordMessage('Network error: ' + errmsg);
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="particles" id="particles-js"></div>
            <div className={`container ${isRegistering ? 'sign-up-mode' : ''}`} id="container">
                <div className="forms-container">
                    <div className="signin-signup">
                        <form className="sign-in-form" onSubmit={handleLoginSubmit}>
                            <h2 className="title">Welcome Back</h2>
                            <div className="input-field">
                                <i className="fas fa-envelope"></i>
                                <input 
                                    type="email" 
                                    placeholder="Email" 
                                    value={login.email}
                                    onChange={(e) => setLogin({ ...login, email: e.target.value })}
                                    required 
                                />
                            </div>
                            <div className="input-field">
                                <i className="fas fa-lock"></i>
                                <input 
                                    type="password" 
                                    placeholder="Password" 
                                    value={login.password}
                                    onChange={(e) => setLogin({ ...login, password: e.target.value })}
                                    required 
                                />
                            </div>
                            
                            <div className="login-actions">
                                <input type="submit" value="Login" className="btn solid" />
                                
                                <button
                                    type="button"
                                    className="btn qr-btn"
                                    onClick={() => setShowQrPopup(true)}
                                >
                                    <i className="fas fa-qrcode"></i> Login with QR Code
                                </button>
                                
                                <a 
                                    href="#" 
                                    className="forgot-password"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setShowForgotPassword(true);
                                    }}
                                >
                                    Forgot Password?
                                </a>
                            </div>
                            
                            {loginError && <div className="message error">{loginError}</div>}
                            
                            <p className="social-text">Or Sign in with social platforms</p>
                            <div className="social-media">
                                <a href="#" className="social-icon"><i className="fab fa-google"></i></a>
                                <a href="#" className="social-icon"><i className="fab fa-facebook-f"></i></a>
                                <a href="#" className="social-icon"><i className="fab fa-twitter"></i></a>
                                <a href="#" className="social-icon"><i className="fab fa-linkedin-in"></i></a>
                            </div>
                        </form>

                        <form className="sign-up-form" onSubmit={handleRegisterSubmit}>
                            <h2 className="title">Create Account</h2>
                            <div className="input-field">
                                <i className="fas fa-user"></i>
                                <input 
                                    type="text" 
                                    placeholder="Full Name" 
                                    value={registration.name}
                                    onChange={(e) => setRegistration({ ...registration, name: e.target.value })}
                                    required 
                                />
                            </div>
                            {errors.name && <div className="message error">{errors.name}</div>}
                            <div className="input-field">
                                <i className="fas fa-envelope"></i>
                                <input 
                                    type="email" 
                                    placeholder="Email" 
                                    value={registration.email}
                                    onChange={(e) => setRegistration({ ...registration, email: e.target.value })}
                                    required 
                                />
                            </div>
                            {errors.email && <div className="message error">{errors.email}</div>}
                            <div className="input-field">
                                <i className="fas fa-phone"></i>
                                <input 
                                    type="text" 
                                    placeholder="Phone Number" 
                                    value={registration.phoneNumber}
                                    onChange={(e) => setRegistration({ ...registration, phoneNumber: e.target.value })}
                                    required 
                                />
                            </div>
                            {errors.phoneNumber && <div className="message error">{errors.phoneNumber}</div>}
                            <div className="input-field">
                                <i className="fas fa-lock"></i>
                                <input 
                                    type="password" 
                                    placeholder="Password" 
                                    value={registration.password}
                                    onChange={(e) => setRegistration({ ...registration, password: e.target.value })}
                                    required 
                                />
                            </div>
                            {errors.password && <div className="message error">{errors.password}</div>}
                            <input type="submit" value="Register" className="btn solid" />
                            <p className="social-text">Or Sign up with social platforms</p>
                            <div className="social-media">
                                <a href="#" className="social-icon"><i className="fab fa-google"></i></a>
                                <a href="#" className="social-icon"><i className="fab fa-facebook-f"></i></a>
                                <a href="#" className="social-icon"><i className="fab fa-twitter"></i></a>
                                <a href="#" className="social-icon"><i className="fab fa-linkedin-in"></i></a>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="panels-container">
                    <div className="panel left-panel">
                        <div className="content">
                            <h3>New to our platform?</h3>
                            <p>Join our community today and unlock exclusive features and benefits!</p>
                            <button className="btn transparent" onClick={() => setIsRegistering(true)} type="button">Sign Up</button>
                        </div>
                        <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" className="image" alt="Sign up graphic" />
                    </div>

                    <div className="panel right-panel">
                        <div className="content">
                            <h3>Already a member?</h3>
                            <p>Welcome back! We've missed you. Sign in to continue your journey.</p>
                            <button className="btn transparent" onClick={() => setIsRegistering(false)} type="button">Sign In</button>
                        </div>
                        <img src="https://cdn-icons-png.flaticon.com/512/3059/3059518.png" className="image" alt="Sign in graphic" />
                    </div>
                </div>
            </div>

            {showForgotPassword && (
                <div className="modal-overlay">
                    <div className="forgot-password-modal">
                        <div className="modal-header">
                            <h3>Reset Password</h3>
                            <button 
                                className="close-btn"
                                onClick={() => {
                                    setShowForgotPassword(false);
                                    setForgotPasswordMessage('');
                                    setForgotPasswordEmail('');
                                }}
                            >
                                &times;
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>Enter your registered email address</p>
                            <input
                                type="email"
                                placeholder="Your registered email"
                                value={forgotPasswordEmail}
                                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                                className="forgot-email-input"
                            />
                            <div className="forgot-password-actions">
                                <button 
                                    className="btn solid"
                                    onClick={handleForgotPassword}
                                >
                                    Send Reset Link
                                </button>
                                <button 
                                    className="btn transparent"
                                    onClick={() => {
                                        setShowForgotPassword(false);
                                        setForgotPasswordMessage('');
                                        setForgotPasswordEmail('');
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                            {forgotPasswordMessage && (
                                <div className={`message ${forgotPasswordMessage.includes('sent') ? 'info' : 'error'}`}>
                                    {forgotPasswordMessage}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {showQrPopup && (
                <div className="modal-overlay">
                    <QrLoginPopup
                        onClose={() => setShowQrPopup(false)}
                        onLoginSuccess={onLoginSuccess}
                    />
                </div>
            )}
        </div>
    );
};

export default App2;
