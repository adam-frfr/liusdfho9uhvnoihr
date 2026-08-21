import React from 'react';
import { Home } from 'lucide-react';
import CakeCareGuide from './components/CakeCareGuide';
import './CakeCarePage.css';

const CakeCarePage = ({ onBack }) => {
  return (
    <div className="cake-care-page">
      <div className="care-page-container">
        <div className="care-page-header">
          <button className="back-btn-care" onClick={onBack} aria-label="Back to Home">
            <Home size={22} strokeWidth={1.8} />
          </button>
          <h1>Cake Care & Handling</h1>
        </div>
        
        <div className="care-page-content">
          <div className="care-intro">
            <p>Ensuring your cake stays perfect from pickup to first bite. Follow our essential guide for handling, transporting, and storing your Mini Bakes treats.</p>
          </div>
          
          <CakeCareGuide />
          
          <div className="care-footer-note">
            <p>Keep this guide handy during your event for the best serving results.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CakeCarePage;
