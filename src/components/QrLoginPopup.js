import React, { useState, useRef } from 'react';
import { Html5Qrcode, Html5QrcodeScanner } from 'html5-qrcode';
import axios from 'axios';
import BASE_URL from '../config/Backendapi';

const QrLoginPopup = ({ onClose, onLoginSuccess }) => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const readerRef = useRef(null); // ✅ FIXED missing ref

  const startCameraScan = () => {
    if (!readerRef.current) {
      setError("QR reader element not found");
      return;
    }

    const scanner = new Html5QrcodeScanner(
      readerRef.current.id,
      { fps: 10, qrbox: 250 },
      false
    );

    scanner.render(
      async (decodedText) => {
        await verifyQr(decodedText);
        scanner.clear();
      },
      () => {}
    );
  };

  const handleFile = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!readerRef.current) {
      setError("QR reader element not found");
      return;
    }

    const html5Qr = new Html5Qrcode(readerRef.current.id);

    try {
      const decoded = await html5Qr.scanFile(file, true);

      if (!decoded) {
        setError("No QR code detected in file");
        return;
      }

      await verifyQr(decoded);
      await html5Qr.clear();
    } catch (err) {
      console.error(err);
      setError("Failed to read QR code from file");
      try { await html5Qr.clear(); } catch {}
    }
  };

  const verifyQr = async (qrContent) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/users/qrcode/verify`, null, {
        params: { qrContent }
      });
      const user = response.data;

      localStorage.setItem('loggedInUserDetails', JSON.stringify(user));
      localStorage.setItem('loggedInEmail', user.email);
      localStorage.setItem('role', user.role);
      localStorage.setItem('userId', user.id);

      setProfile(user);
      setError('');
      alert(`QR Login successful: ${user.role}`);
      onLoginSuccess(user.email, user.role);
      onClose();
    } catch (err) {
      setError(err.response?.data || "Verification failed");
      setProfile(null);
    }
  };

  return (
    <div style={popupStyles.overlay}>
      <div style={popupStyles.container}>
        <h3>Login with QR Code</h3>

        <button onClick={startCameraScan} style={popupStyles.btn}>
          Scan with Camera
        </button>

        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          style={{ display: 'block', margin: '10px auto' }}
        />

        <div ref={readerRef} id="reader" style={{ width: "300px", margin: "auto" }}></div>

        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

        {profile && (
          <div style={popupStyles.profile}>
            <h4>Profile Details</h4>
            <p><strong>ID:</strong> {profile.id}</p>
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
          </div>
        )}

        <button onClick={onClose} style={popupStyles.cancelBtn}>Close</button>
      </div>
    </div>
  );
};

const popupStyles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0,
    width: '100%', height: '100%',
    backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(6px)',
  },
  container: {
    background: 'linear-gradient(145deg, #ffffff, #f0f4f8)',
    padding: '2rem',
    borderRadius: '15px',
    boxShadow: '0 15px 40px rgba(0,0,0,0.25)',
    width: '90%',
    maxWidth: '400px',
    textAlign: 'center',
    position: 'relative',
    border: '1px solid rgba(255,255,255,0.3)',
  },
  btn: {
    background: 'linear-gradient(135deg, #4361ee, #3a0ca3)',
    color: '#fff',
    border: 'none',
    padding: '12px 25px',
    margin: '10px 5px',
    borderRadius: '30px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 6px 20px rgba(67,97,238,0.3)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtn: {
    padding: '8px 15px',
    background: 'crimson',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '15px',
  },
  profile: {
    marginTop: '1.5rem',
    padding: '1rem',
    background: 'rgba(241,243,245,0.9)',
    borderRadius: '12px',
    borderLeft: '5px solid #4361ee',
  },
};

export default QrLoginPopup;
