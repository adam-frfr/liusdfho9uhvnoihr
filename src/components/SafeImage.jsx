import React, { useState } from 'react';
import { defaultCategoryImages } from '../productImages';

const SafeImage = ({ src, alt, className = "", category = "Cakes" }) => {
  const fallbackImg = defaultCategoryImages[category] || defaultCategoryImages['Cakes'];
  const [imgSrc, setImgSrc] = useState(() => {
    if (!src || typeof src !== 'string' || src.trim().length === 0 || src.includes('/storage/v1/object/public/product-images/')) {
      return fallbackImg;
    }
    return src;
  });
  const [loaded, setLoaded] = useState(true);

  const handleError = () => {
    if (imgSrc !== fallbackImg) {
      setImgSrc(fallbackImg);
    }
    setLoaded(true);
  };

  return (
    <div className={`shimmer-loader ${className}`}>
      <img 
        src={imgSrc} 
        alt={alt || "Mini Bakes Dessert"} 
        loading="lazy"
        className={`image-loading ${loaded ? 'image-loaded' : ''}`}
        onLoad={() => setLoaded(true)}
        onError={handleError}
      />
    </div>
  );
};

export default SafeImage;
