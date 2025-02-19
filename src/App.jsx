
import { useState } from 'react';
import QrScanner from 'qr-scanner';
import QRCode from 'qrcode';
import './App.css';

export default function App() {
  const [scannedData, setScannedData] = useState('');
  const [modifiedQR, setModifiedQR] = useState('');
  const [decodedData, setDecodedData] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const result = await QrScanner.scanImage(file);
      setScannedData(result);
      processQRData(result);
    } catch (error) {
      console.error('Error scanning QR code:', error);
    }
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
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileUpload}
          className="file-input"
        />
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
