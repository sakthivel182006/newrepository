import React, { useEffect, useState } from 'react';
import { LogOut, User, Mail, Lock, Shield, CheckCircle, XCircle, QrCode, Download } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../config/Backendapi';

const Profile = () => {
const { id } = useParams();
const [userDetails, setUserDetails] = useState({
userId: '',
email: '',
password: '',
verified: '',
role: ''
});
const [qrCodeUrl, setQrCodeUrl] = useState('');

useEffect(() => {
if (id) {
axios.get(`${BASE_URL}/api/users/${id}`)
.then(res => {
setUserDetails(res.data);
localStorage.setItem('loggedInUserDetails', JSON.stringify(res.data));
localStorage.setItem('userId', res.data.userId);
localStorage.setItem('loggedInEmail', res.data.email);
})
.catch(err => console.error(err));
} else {
const storedUser = localStorage.getItem('loggedInUserDetails');
if (storedUser) {
const parsedUser = JSON.parse(storedUser);
setUserDetails(parsedUser);
}
}
}, [id]);

const handleLogout = () => {
localStorage.removeItem('loggedInUserDetails');
localStorage.removeItem('loggedInEmail');
localStorage.removeItem('userId');
window.location.href = '/';
};

const handleGenerateQr = () => {
const uid = localStorage.getItem('userId');
if (uid) {
setQrCodeUrl(`${BASE_URL}/api/users/qrcode/${uid}`);
}
};

const handleDownloadQr = () => {
if (qrCodeUrl) {
const link = document.createElement('a');
link.href = qrCodeUrl;
link.download = `user-${userDetails.userId}-qrcode.png`;
document.body.appendChild(link);
link.click();
document.body.removeChild(link);
}
};

return (
<div className="container py-5">
<div className="card shadow-lg rounded-4">
<div className="card-header bg-primary text-white d-flex justify-content-between align-items-center py-4 px-4 rounded-top">
<div className="d-flex align-items-center gap-3">
<div className="bg-white bg-opacity-25 p-2 rounded-circle">
<User size={32} />
</div>
<div>
<h4 className="mb-0 fw-bold">User Profile</h4>
<small>Manage your account details</small>
</div>
</div>
<button onClick={handleLogout} className="btn btn-light d-flex align-items-center gap-2">
<LogOut size={18} />
<span>Logout</span>
</button>
</div>

<div className="card-body px-4 py-5">
<div className="text-center mb-4">
<button
onClick={handleGenerateQr}
className="btn btn-outline-primary d-flex align-items-center justify-content-center gap-2 mx-auto"
>
<QrCode size={18} />
<span>Generate QR Code</span>
</button>
{qrCodeUrl && (
<div className="mt-3">
<img src={qrCodeUrl} alt="User QR Code" style={{ maxWidth: "200px" }} />
<div className="mt-3">
<button
onClick={handleDownloadQr}
className="btn btn-success d-flex align-items-center justify-content-center gap-2 mx-auto"
>
<Download size={18} />
<span>Download QR Code</span>
</button>
</div>
</div>
)}
</div>

<div className="row g-4">
{[
{ label: 'User ID', value: userDetails.userId, icon: <User size={18} className="text-primary" /> },
{ label: 'Email', value: userDetails.email, icon: <Mail size={18} className="text-primary" /> },
{ label: 'Password', value: userDetails.password ? '        ' : '-', icon: <Lock size={18} className="text-primary" /> },
{ label: 'Role', value: userDetails.role, icon: <Shield size={18} className="text-primary" /> }
].map((item, idx) => (
<div key={idx} className="col-md-6">
<div className="border rounded-3 p-3 bg-light">
<div className="d-flex align-items-center gap-2 mb-2">
{item.icon}
<span className="text-muted fw-semibold">{item.label}</span>
</div>
<h6 className="mb-0 text-dark text-capitalize">{item.value || '-'}</h6>
</div>
</div>
))}
</div>

<div className="mt-5 border rounded-3 p-3 bg-light">
<div className="d-flex align-items-center gap-2 mb-2">
{userDetails.verified ? (
<CheckCircle size={18} className="text-success" />
) : (
<XCircle size={18} className="text-danger" />
)}
<span className="text-muted fw-semibold">Account Status</span>
</div>
<div className="d-flex align-items-center gap-3">
<h6 className="mb-0 text-dark">
{userDetails.verified ? 'Verified' : 'Not Verified'}
</h6>
{!userDetails.verified && (
<button className="btn btn-sm btn-primary">Verify Now</button>
)}
</div>
</div>

<div className="mt-4 d-flex flex-column flex-md-row gap-3">
<button className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2">
<Mail size={18} />
<span>Change Email</span>
</button>
<button className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2">
<Lock size={18} />
<span>Change Password</span>
</button>
</div>
</div>

<div className="card-footer text-center text-muted small py-3">
Last updated: {new Date().toLocaleDateString()}
</div>
</div>
</div>
);
};

export default Profile;
