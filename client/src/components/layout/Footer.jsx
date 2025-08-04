import React from 'react';
import '../../css/footer.css'; // Custom styling

const Footer = () => {
  return (
    <footer className="app-footer text-center">
      <p>&copy; {new Date().getFullYear()} Smart Budget App - V01. All rights reserved.
        <br />
        CPCM – 2025S T3 || CSD 3103 - Full Stack JavaScript
        <br />
        Santiago D. - C0928413 & Chisom I. - C0929772
      </p>
    </footer>
  );
};

export default Footer;
