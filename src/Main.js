import React, { useState, useEffect } from 'react';
import Appuser from './Appuser';
import App3 from './App3';
import App2 from './App2';
import Agent from './Agent';

const Main = () => {
const [loggedIn, setLoggedIn] = useState(false);
const [role, setRole] = useState(null);

useEffect(() => {
const storedEmail = localStorage.getItem('loggedInEmail');
const storedRole = localStorage.getItem('role');
if (storedEmail) {
setLoggedIn(true);
setRole(storedRole);
}
}, []);

const handleLoginSuccess = (email, userRole) => {
setLoggedIn(true);
setRole(userRole);
};

if (!loggedIn) {
return <App2 onLoginSuccess={handleLoginSuccess} />;
}

if (role === 'ADMIN') {
return <App3 />;
}

if (role === 'AGENT') {
return <Agent />;
}


return <Appuser />;
};

export default Main;
