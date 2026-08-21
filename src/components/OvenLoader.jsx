import React from 'react';
import './OvenLoader.css';

const OvenLoader = () => {
  return (
    <div className="oven-loader-container">
      <div className="oven-pulse-wrapper">
        <svg className="oven-svg" viewBox="0 0 100 100" width="120" height="120">
          {/* Main oven body */}
          <rect x="20" y="30" width="60" height="50" rx="8" className="oven-body" fill="#fdfdfd" stroke="#800000" strokeWidth="6" strokeLinejoin="round" />
          
          {/* Control panel line */}
          <line x1="20" y1="46" x2="80" y2="46" stroke="#800000" strokeWidth="6" />
          
          {/* Knobs */}
          <rect x="36" y="20" width="6" height="10" rx="2" fill="#800000" />
          <rect x="58" y="20" width="6" height="10" rx="2" fill="#800000" />

          {/* Oven interior dark background */}
          <rect x="26" y="52" width="48" height="22" rx="4" fill="#f0e6e6" />

          {/* Tray & Cupcake - hidden initially behind the door */}
          <g className="oven-tray">
            <path d="M 40 68 Q 50 48 60 68 Z" fill="#800000" className="cupcake-body" />
            <line x1="36" y1="68" x2="64" y2="68" stroke="#800000" strokeWidth="4" strokeLinecap="round" />
          </g>

          {/* Oven Door (opens sideways) */}
          <rect x="26" y="52" width="48" height="22" rx="4" className="oven-door" fill="#fff" stroke="#800000" strokeWidth="4" strokeLinejoin="round" />
          {/* Door Handle */}
          <line x1="65" y1="56" x2="65" y2="68" stroke="#800000" strokeWidth="3" strokeLinecap="round" className="oven-door-handle" />
          
          {/* Glow effect when baking */}
          <rect x="26" y="52" width="48" height="22" rx="4" className="oven-glow" fill="rgba(255, 165, 0, 0.4)" pointerEvents="none" />
        </svg>
      </div>
      <div className="oven-text">Baking dashboard...</div>
    </div>
  );
};

export default OvenLoader;
