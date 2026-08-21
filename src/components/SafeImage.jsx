import React, { useState } from 'react';

const SafeImage = ({ src, alt, className = "" }) => {
  const [loaded, setLoaded] = useState(false);
  
  if (!src) {
    return <div className={`shimmer-loader ${className}`} style={{ background: '#f5f5f5' }}></div>;
  }

  return (
    <div className={`shimmer-loader ${className}`}>
      <img 
        src={src} 
        alt={alt} 
        loading="lazy"
        className={`image-loading ${loaded ? 'image-loaded' : ''}`}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
};

export default SafeImage;
