import React, { useState, useEffect } from 'react';
import Appuser from './Appuser';        
   
import App3 from './App3';      
import App2 from './App2';      

const Main = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
    const storedEmail = localStorage.getItem('loggedInEmail');
    if (storedEmail) {
    setLoggedIn(true);
    if (storedEmail === 'sakthivelv202222@gmail.com') {
    setIsAdmin(true);
    }
    }
    }, []);

    const handleLoginSuccess = (email) => {
    setLoggedIn(true);
    if (email === 'sakthivelv202222@gmail.com') {
    setIsAdmin(true);
    }
    };

    return (
    <>
    {loggedIn ? (isAdmin ? <App3 /> : <Appuser />) : <App2 onLoginSuccess={handleLoginSuccess} />}
    </>
    );
    };

    export default Main;
