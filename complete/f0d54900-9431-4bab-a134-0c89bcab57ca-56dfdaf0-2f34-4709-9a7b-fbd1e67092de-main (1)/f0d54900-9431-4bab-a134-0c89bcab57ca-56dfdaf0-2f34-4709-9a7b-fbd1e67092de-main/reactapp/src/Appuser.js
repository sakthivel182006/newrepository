import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home';
import AvailableClaims from './components/StatusTrack';
import Customers from './components/Customers';
import Claims from './components/Claims';
import SubmitClaim from './components/SubmitClaim';
import CustomerRegistration from './components/CustomerRegistration';
import Profile from './components/Profile';
import AvailablePolicy from './components/AvailablePolicy';
import './App.css';
import DocumentsUpload from './components/DocumentsUpload';
import StatusTrack from './components/StatusTrack';
import ApprovedClaims from './components/ApprovedClaims';
const Appuser = () => {
return (
<Router>
<div>
<nav className="main-nav">
<Link to="/">Home</Link>
<Link to="/insurancepolicy">Available Policy</Link>
<Link to="/documentsupload">DOCUMENTS UPLOAD</Link>
<Link to="/trackstatus">TRACK STATUS</Link>
<Link to="/approvedclaims">APPROVED Claim</Link>
<Link to="/user-profile">User Profile</Link>

</nav>
<main className="app-content">
<Routes>
<Route path="/" element={<Home />} />
<Route path="/insurancepolicy" element={<AvailablePolicy />} />
<Route path="/documentsupload" element={<DocumentsUpload />} />
<Route path="/trackstatus" element={<StatusTrack />} />
<Route path="/approvedclaims" element={<ApprovedClaims />} />
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

export default Appuser;