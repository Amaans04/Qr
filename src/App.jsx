
import { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import QRCode from 'qrcode';
import './App.css';

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [scannedData, setScannedData] = useState('');
  const [modifiedQR, setModifiedQR] = useState('');
  const [decodedData, setDecodedData] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'MeraPapaAmaan') {
      setAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  if (!authenticated) {
    return (
      <div className="login-container">
        <h1>Enter Password</h1>
        <form onSubmit={handleLogin}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: { width: 250, height: 250 },
      fps: 5,
    });

    scanner.render(onScanSuccess, onScanError);

    return () => {
      scanner.clear();
    };
  }, []);

  const onScanSuccess = (data) => {
    setScannedData(data);
    processQRData(data);
  };

  const onScanError = (err) => {
    console.error(err);
  };

  const processQRData = (data) => {
    try {
      // Decode base64
      const decodedString = atob(data);
      const jsonData = JSON.parse(decodedString);
      
      // Modify QrEtime
      const modifiedData = {
        ...jsonData,
        QrEtime: jsonData.QrEtime + 1800000
      };
      
      setDecodedData(modifiedData);
      
      // Encode back to base64
      const modifiedString = JSON.stringify(modifiedData);
      const modifiedBase64 = btoa(modifiedString);
      
      // Generate new QR code
      generateQRCode(modifiedBase64);
    } catch (error) {
      console.error('Error processing data:', error);
    }
  };

  const generateQRCode = async (data) => {
    try {
      const url = await QRCode.toDataURL(data);
      setModifiedQR(url);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  return (
    <main className="container">
      <h1>QR Code Scanner & Modifier</h1>
      
      <div className="scanner-section">
        <div id="reader"></div>
      </div>

      {decodedData && (
        <div className="data-section">
          <h2>Decoded Data:</h2>
          <pre>{JSON.stringify(decodedData, null, 2)}</pre>
        </div>
      )}

      {modifiedQR && (
        <div className="qr-section">
          <h2>Modified QR Code:</h2>
          <img src={modifiedQR} alt="Modified QR Code" className="qr-code" />
        </div>
      )}
    </main>
  );
}
