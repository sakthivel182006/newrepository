import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home';
import Customers from './components/Customers';
import Claims from './components/Claims';
import SubmitClaim from './components/SubmitClaim';
import CustomerRegistration from './components/CustomerRegistration';
import Profile from './components/Profile';

const App = () => {
return (
<Router>
<div>
<nav className="main-nav">
<Link to="/">Home</Link>
<Link to="/customers">Customers</Link>
<Link to="/register">New Customer</Link>
<Link to="/claims">Claims</Link>
<Link to="/submit-claim">Submit Claim</Link>
<Link to="/user-profile">User Profile</Link>
</nav>
<main className="app-content">
<Routes>
<Route path="/" element={<Home />} />
<Route path="/customers" element={<Customers />} />
<Route path="/register" element={<CustomerRegistration />} />
<Route path="/claims" element={<Claims />} />
<Route path="/submit-claim" element={<SubmitClaim />} />
<Route path="/user-profile" element={<Profile />} />
</Routes>
</main>
</div>
</Router>
);
};

export default App;
