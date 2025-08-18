import React, { useEffect, useState } from 'react';

const Profile = () => {
    const [userDetails, setUserDetails] = useState({
    userId: '',
    email: '',
    password: '',
    verified: '',
    role:''
    });

    useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUserDetails');
    if (storedUser) {
    const parsedUser = JSON.parse(storedUser);
    setUserDetails(parsedUser);
    }
    }, []);

    const handleLogout = () => {
    localStorage.removeItem('loggedInUserDetails');
    localStorage.removeItem('loggedInEmail');
    localStorage.removeItem('userId');
    window.location.href = '/'; 
    };

    return (
    <div style={{ padding: '20px' }}>
    <h2>Welcome to Your Profile Page</h2>
    <p><strong>ID:</strong> {userDetails.userId || '-'}</p>
    <p><strong>Email:</strong> {userDetails.email || '-'}</p>
    <p><strong>Password:</strong> {userDetails.password || '-'}</p>
    <p><strong>Verified:</strong> {userDetails.verified ? 'Yes' : 'No'}</p>
    <p><strong>Role:</strong> {userDetails.role}</p>
    <button onClick={handleLogout}>Logout</button>
    </div>
    );
    };

    export default Profile;
