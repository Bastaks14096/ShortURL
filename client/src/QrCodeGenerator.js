import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';

const QrCodeGenerator = ({ url }) => {
  const [qrCodeData, setQrCodeData] = useState('');

  useEffect(() => {
    // Update the QR code data whenever the URL changes
    setQrCodeData(url);
  }, [url]);

  return (
    <div>
      <QRCode value={qrCodeData} />
    </div>
  );
};

export default QrCodeGenerator;
