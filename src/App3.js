import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import { FiHome, FiShield, FiUpload, FiSearch, FiCheckCircle, FiUser, FiMenu, FiX, FiChevronDown } from 'react-icons/fi';
import Home from './components/Home';
import Customers from './components/Customers';
import Claims from './components/Claims';
import SubmitClaim from './components/SubmitClaim';
import CustomerRegistration from './components/CustomerRegistration';
import Profile from './components/Profile';
import AvailablePolicy from './components/AvailablePolicy';
import DocumentsUpload from './components/DocumentsUpload';
import StatusTrack from './components/StatusTrack';
import ApprovedClaims from './components/ApprovedClaims';
import './Appuser.css';
import AddClaimType from './admin/AddClaimType';
import UserProfile from './admin/UserProfile';
import ClaimsController from './admin/ClaimsController';
import AuditLogs from './admin/AuditLogs';
import Settings from './Settings';

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
const [userDropdownOpen, setUserDropdownOpen] = useState(false);
const location = useLocation();
const userMenuRef = useRef(null);

const navLinks = [
{ path: "/", name: "Home", icon: <FiHome /> },
{ path: "/addclaimtype", name: "Claim Type", icon: <FiShield /> },

{ path: "/allcustomers", name: "ALL Customers", icon: <FiShield /> },
{ path: "/claimscontroller", name: "Claims Controller", icon: <FiShield /> },
{ path: "/auditlogs", name: "Audit Logs", icon: <FiShield /> },



];

useEffect(() => {
const handleClickOutside = (event) => {
if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
setUserDropdownOpen(false);
}
};

document.addEventListener('mousedown', handleClickOutside);
return () => {
document.removeEventListener('mousedown', handleClickOutside);
};
}, []);

return (
<nav className="glass-navbar">
<div className="navbar-container">
<div className="navbar-brand">

<button
className="sidebar-toggle-btn"
onClick={() => setSidebarOpen(prev => !prev)}

>
{sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
</button>


<Link to="/" className="logo-link">
<span className="logo-icon">🛡️</span>
<span className="logo-text">InsureX</span>
</Link>

<button
className="mobile-menu-button"
onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
>
{mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
</button>
</div>

<div className={`
nav-links ${mobileMenuOpen ? "open" : ""}`}>
{navLinks.map((link) => (
<Link
key={link.path}
to={link.path}
className={`
nav-link ${location.pathname === link.path ? "active" : ""}`}
onClick={() => setMobileMenuOpen(false)}
>
<span className="nav-icon">{link.icon}</span>
<span>{link.name}</span>
</Link>
))}
</div>

<div className="user-menu" ref={userMenuRef}>
<button
className="user-button"
onClick={() => setUserDropdownOpen(!userDropdownOpen)}
>
<img
src=""
alt="User"
className="user-avatar"/>
<span className="user-name">John Doe</span>
<FiChevronDown className={`dropdown-icon ${userDropdownOpen ? "open" : ""}`} />
</button>

<div className={`user-dropdown ${userDropdownOpen ? "open" : ""}`}>
<div className="user-info">
<img
src=""
alt="User"
className="dropdown-avatar"/>
<div>
<p className="user-fullname">John Doe</p>
<p className="user-email">john@example.com</p>
</div>
</div>
<div className="dropdown-links">

<Link 
to="/profilepage" 
className="dropdown-link"
onClick={() => setUserDropdownOpen(false)}
>
<FiUser className="link-icon" />
My Profile
</Link>

<Link 
to="/settings" 
className="dropdown-link"
onClick={() => setUserDropdownOpen(false)}
>
<FiShield className="link-icon" />
Account Settings
</Link>
<button className="dropdown-link logout">
<FiX className="link-icon" />
Sign Out
</button>
</div>
</div>
</div>
</div>
</nav>
);
};
const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
const location = useLocation();
const [activeSubmenu, setActiveSubmenu] = useState(null);

const menuItems = [
{
title: "Dashboard",
icon: <FiHome />,
path: "/",
submenu: []
},
{
title: "Insurance",
icon: <FiShield />,
path: "/insurancepolicy",
submenu: [
{ title: "Available Policies", path: "/insurancepolicy" },
{ title: "My Policies", path: "/mypolicies" },
{ title: "Policy Claims", path: "/policyclaims" }
]
},
{
title: "Documents",
icon: <FiUpload />,
path: "/documentsupload",
submenu: [
{ title: "Upload Documents", path: "/documentsupload" },
{ title: "Document Status", path: "/documentstatus" }
]
},
{
title: "Claims",
icon: <FiCheckCircle />,
path: "/approvedclaims",
submenu: [
{ title: "Submit Claim", path: "/submit-claim" },
{ title: "Approved Claims", path: "/approvedclaims" },
{ title: "Claim Status", path: "/claimstatus" }
]
},
{
title: "Profile",
icon: <FiUser />,
path: "/user-profile",
submenu: []
}
];

const toggleSubmenu = (index) => {
if (activeSubmenu === index) {
setActiveSubmenu(null);
} else {
setActiveSubmenu(index);
}
};

return (
<aside className={`glass-sidebar ${sidebarOpen ? 'open' : ''}`}>
<nav className="sidebar-nav">
<ul>
{menuItems.map((item, index) => (
<li key={index} className={`
nav-item ${location.pathname === item.path ? 'active' : ''}`}>
<div 
className="nav-item-header"
onClick={() => {

if (item.submenu.length > 0) {
toggleSubmenu(index);
} else {
window.location.href = item.path;
}
}}
>
<span className="nav-icon">{item.icon}</span>
<span className="nav-title">{item.title}</span>
{item.submenu.length > 0 && (
<FiChevronDown className={`submenu-arrow ${activeSubmenu === index ? 'open' : ''}`} />
)}
</div>
{item.submenu.length > 0 && activeSubmenu === index && (
<ul className="submenu">
{item.submenu.map((subItem, subIndex) => (
<li key={subIndex}>
<Link 
to={subItem.path} 
className={`submenu-link ${location.pathname === subItem.path ? 'active' : ''}`}
onClick={() => setSidebarOpen(false)}
>
{subItem.title}
</Link>
</li>
))}
</ul>
)}
</li>
))}
</ul>
</nav>

<div className="sidebar-footer">
<div className="user-profile">
<img 
src="" 
alt="User" 
className="sidebar-avatar"/>
<div>
<p className="username">John Doe</p>
<p className="user-role">Premium Member</p>
</div>
</div>
</div>
</aside>
);
};

const Appuser = () => {
const [sidebarOpen, setSidebarOpen] = useState(false);

return (
<Router>
<div className="app-container">
<Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
<div className="app-content-wrapper">
<Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
<main className={`app-content ${sidebarOpen ? 'with-sidebar' : 'full-width'}`}>

<Routes>
<Route path="/" element={<Home />} />
<Route path="/addclaimtype" element={<AddClaimType />} />
<Route path="/insurancepolicy" element={<AvailablePolicy />} />
<Route path="/allcustomers" element={<UserProfile />} />
<Route path="/claimscontroller" element={<ClaimsController />} />
<Route path="/auditlogs" element={<AuditLogs />} />
<Route path="/profilepage" element={<Profile />} />
<Route path="/settings" element={<Settings />} />

</Routes>
</main>
</div>

<footer className="app-footer">
<p>© {new Date().getFullYear()} InsureX Portal. All rights reserved.</p>
<nav className="footer-shortcuts">
<Link to="/" accessKey="h">Home (Alt+H)</Link> |{" "}
<Link to="/insurancepolicy" accessKey="p">Policies (Alt+P)</Link> |{" "}
<Link to="/documentsupload" accessKey="u">Upload Docs (Alt+U)</Link> |{" "}
<Link to="/trackstatus" accessKey="t">Track Status (Alt+T)</Link> |{" "}
<Link to="/approvedclaims" accessKey="a">Approved Claims (Alt+A)</Link> |{" "}
<Link to="/user-profile" accessKey="r">Profile (Alt+R)</Link>
</nav>
</footer>
</div>
</Router>
);
};

export default Appuser;