import React, { useState, useEffect } from 'react';
import { Circle, Heart, Palette, Droplet, Flame, X, Star, AlignJustify, Sparkles, Sun, ChevronUp, ChevronDown, GripHorizontal, Flower, MessageSquare, ChevronLeft, ChevronRight, Image as ImageIcon, Gift, CakeSlice } from 'lucide-react';
import './MenuPage.css';
import ErrorBoundary from './ErrorBoundary';
const Cake3D = React.lazy(() => import('./Cake3D'));


import { supabase } from './supabase';
import SafeImage from './components/SafeImage';

const MAX_LAYERS = 3;

const MenuCard = ({ item, cakeLayers, setCakeLayers, selectedLayerIndex, setSelectedLayerIndex, addLayer, removeLayer, applyColor, toggleSpread, toggleDesign, toastMessage, onSelectProduct, isLastViewed }) => {
  const displayImg = item.img;

  return (
    <div className={`menu-card ${item.isFullWidth ? 'full-width-card' : ''}`}>
      <div className="menu-card-image" style={{ position: 'relative' }}>
        {item.portions && (
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(4px)',
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: '600',
            color: '#333',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            zIndex: 10
          }}>
            <CakeSlice size={12} color="#800000" />
            <span>{item.portions}</span>
          </div>
        )}
        {isLastViewed && (
          <div style={{
            position: 'absolute',
            top: item.portions ? '42px' : '12px',
            left: '12px',
            background: 'rgba(128, 0, 0, 0.9)',
            backdropFilter: 'blur(4px)',
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '0.70rem',
            fontWeight: '600',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            zIndex: 10,
            letterSpacing: '0.5px',
            textTransform: 'uppercase'
          }}>
            <Sparkles size={10} color="#fff" />
            <span>Last Viewed</span>
          </div>
        )}
        {item.isFullWidth ? (
          <ErrorBoundary>
            <React.Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '300px', background: '#fdf2f2', borderRadius: '20px' }}>Loading 3D model...</div>}>
              <Cake3D layers={cakeLayers} />
            </React.Suspense>
          </ErrorBoundary>
        ) : (
          <SafeImage src={displayImg} alt={item.name} key={displayImg} />
        )}
      </div>
      <div className="menu-card-content">
        {item.isFullWidth ? (
          <div className="designer-wrapper">
            {toastMessage && (
              <div className="toast-notification">
                {toastMessage}
              </div>
            )}
            <div className="designer-ui">
              <div className="designer-column">
                <h4>Layers</h4>
                <div className="designer-options">
                  <button className="designer-card" onClick={() => addLayer('6round')}>
                    <Circle size={16} />
                    <span className="designer-card-label">6" Round</span>
                  </button>
                  <button className="designer-card" onClick={() => addLayer('8round')}>
                    <Circle size={22} />
                    <span className="designer-card-label">8" Round</span>
                  </button>
                  <button className="designer-card" onClick={() => addLayer('6heart')}>
                    <Heart size={16} />
                    <span className="designer-card-label">6" Heart</span>
                  </button>
                  <button className="designer-card" onClick={() => addLayer('8heart')}>
                    <Heart size={22} />
                    <span className="designer-card-label">8" Heart</span>
                  </button>
                </div>
              </div>
              <div className="designer-column">
                <h4>Colors</h4>
                <div className="designer-options">
                  {['#A3B18A', '#F9C6C9', '#C9B1D9', '#B5EAD7', '#FFEAAA', '#AEC6F7', '#FFCBA4', '#E8A598', '#F5E6C8', '#8B4513', '#C4919E', '#9B2D30', '#FFF3B0', '#88A0C0', '#D4A373', '#B2C9AB', '#F28482', '#5E548E', '#CCD5AE', '#E3D5CA'].map(color => (
                    <button key={color} className="designer-card" onClick={() => applyColor(color)}>
                      <span className="color-swatch" style={{ background: color }}></span>
                      <span className="designer-card-label">{
                        color === '#F9C6C9' ? 'Blush Pink' :
                        color === '#C9B1D9' ? 'Lavender' :
                        color === '#B5EAD7' ? 'Mint' :
                        color === '#FFEAAA' ? 'Buttercream' :
                        color === '#AEC6F7' ? 'Sky Blue' :
                        color === '#FFCBA4' ? 'Peach' :
                        color === '#E8A598' ? 'Rose Gold' :
                        color === '#F5E6C8' ? 'Ivory' :
                        color === '#8B4513' ? 'Chocolate' :
                        color === '#C4919E' ? 'Dusty Mauve' :
                        color === '#9B2D30' ? 'Red Velvet' :
                        color === '#FFF3B0' ? 'Lemon' :
                        color === '#A3B18A' ? 'Matcha' :
                        color === '#88A0C0' ? 'Blueberry' :
                        color === '#D4A373' ? 'Caramel' :
                        color === '#B2C9AB' ? 'Pistachio' :
                        color === '#F28482' ? 'Coral Pink' :
                        color === '#5E548E' ? 'Deep Purple' :
                        color === '#CCD5AE' ? 'Sage' :
                        'Champagne'
                      }</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="designer-column">
                <h4>Spreads</h4>
                <div className="designer-options">
                  {item.spreads && item.spreads.length > 0 ? item.spreads.map(spread => (
                    <button 
                      key={spread}
                      className={`designer-card ${cakeLayers[selectedLayerIndex]?.spread === spread ? 'active-design' : ''}`}
                      onClick={() => toggleSpread(spread)}
                    >
                      <Droplet size={16} />
                      <span className="designer-card-label">{spread}</span>
                    </button>
                  )) : (
                    <span className="designer-card-label" style={{ padding: '8px', opacity: 0.7, fontSize: '0.8rem' }}>No spreads available</span>
                  )}
                </div>
              </div>

              <div className="designer-column">
                <h4>Designs</h4>
                <div className="designer-options">
                  <button 
                    className={`designer-card ${cakeLayers[selectedLayerIndex]?.topBorder ? 'active-design' : ''}`}
                    onClick={() => toggleDesign('topBorder')}
                  >
                    <ChevronUp size={20} />
                    <span className="designer-card-label">Top Shell</span>
                  </button>
                  <button 
                    className={`designer-card ${cakeLayers[selectedLayerIndex]?.bottomBorder ? 'active-design' : ''}`}
                    onClick={() => toggleDesign('bottomBorder')}
                  >
                    <ChevronDown size={20} />
                    <span className="designer-card-label">Bottom Shell</span>
                  </button>
                  <button 
                    className={`designer-card ${cakeLayers[selectedLayerIndex]?.sidePiping ? 'active-design' : ''}`}
                    onClick={() => toggleDesign('sidePiping')}
                  >
                    <AlignJustify size={20} />
                    <span className="designer-card-label">Side Piping</span>
                  </button>
                  <button 
                    className={`designer-card ${cakeLayers[selectedLayerIndex]?.bow ? 'active-design' : ''}`}
                    onClick={() => toggleDesign('bow')}
                  >
                    <Gift size={20} />
                    <span className="designer-card-label">Bow</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="designer-summary">
              <div className="summary-header-row">
                <p className="summary-title">Your Selection:</p>
                {selectedLayerIndex !== null && cakeLayers.length > 0 && (
                  <div className="designer-text-input-wrapper">
                    <textarea 
                      placeholder="Add text to cake (e.g. Love)" 
                      maxLength={30}
                      rows={2}
                      className="designer-text-input"
                      value={cakeLayers[selectedLayerIndex]?.customText || ''}
                      onChange={(e) => {
                        const text = e.target.value;
                        setCakeLayers(prev => prev.map((layer, i) => 
                          i === selectedLayerIndex ? { ...layer, customText: text } : layer
                        ));
                      }}
                      style={{ resize: 'none', height: 'auto', minHeight: '40px' }}
                    />
                    <span className="text-char-limit">
                      {(cakeLayers[selectedLayerIndex]?.customText || '').length}/30
                    </span>
                  </div>
                )}
              </div>
              <div className="summary-cards">
                {cakeLayers.length === 0 ? (
                  <p className="summary-empty">No layers added yet. Click a layer above to start!</p>
                ) : (
                  cakeLayers.map((layer, i) => (
                    <div 
                      key={i} 
                      className={`summary-item ${selectedLayerIndex === i ? 'selected' : ''}`}
                      onClick={() => setSelectedLayerIndex(i)}
                      style={{ cursor: 'pointer' }}
                    >
                      {layerIcon(layer.type)}
                      <span>{layerLabel[layer.type] || layer.type}</span>
                      <button className="summary-remove" onClick={(e) => removeLayer(e, i)}><X size={12} /></button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : (
          <>
            <h3>{item.name}</h3>
            <p className="menu-card-desc">{item.description}</p>
            
            <div className="menu-card-footer">
              <span className="menu-card-price">
                {item.price === 'WA' ? <span className="price-wa-tag">Quote required</span> : item.price}
              </span>
              <button 
                className="menu-add-btn" 
                onClick={() => onSelectProduct(item)}
                disabled={item.status === 'Out of Stock'}
              >
                {item.status === 'Out of Stock' ? 'Out of Stock' : <><span className="hide-on-mobile">Add to </span>Order</>}
              </button>
            </div>
          </>
        )}
      </div>
      {item.isFullWidth && (
        <div className="designer-order-wrapper">
          <button 
            className="designer-order-btn" 
            style={{ background: '#fff', color: 'var(--color-main, #800000)', border: '1px solid var(--color-main, #800000)' }}
            onClick={() => {
              localStorage.setItem('minibakes_saved_cake_design', JSON.stringify(cakeLayers));
              setToastMessage('Design Saved! 💖');
              setTimeout(() => setToastMessage(null), 3000);
            }}
            disabled={cakeLayers.length === 0}
          >
            <span>Save Design</span>
          </button>
          {localStorage.getItem('minibakes_saved_cake_design') && (
            <button 
              className="designer-order-btn" 
              style={{ background: '#f5e6e8', color: 'var(--color-main, #800000)', border: '1px solid transparent' }}
              onClick={() => {
                const saved = JSON.parse(localStorage.getItem('minibakes_saved_cake_design') || '[]');
                if (saved.length > 0) {
                  setCakeLayers(saved);
                  setToastMessage('Design Loaded! ✨');
                  setTimeout(() => setToastMessage(null), 3000);
                }
              }}
            >
              <span>Load Design</span>
            </button>
          )}
          <button 
            className="designer-order-btn" 
            onClick={() => onSelectProduct({ ...item, layers: cakeLayers })}
            disabled={cakeLayers.length === 0 || item.status === 'Out of Stock'}
          >
            <div className="designer-price-label">Quote required</div>
            <span>{item.status === 'Out of Stock' ? 'OUT OF STOCK' : 'ORDER'}</span>
          </button>
        </div>
      )}
    </div>
  );
};

const layerLabel = { '6round': '6" Round', '8round': '8" Round', '6heart': '6" Heart', '8heart': '8" Heart' };
const layerIcon = (type) => type.includes('heart') ? <Heart size={16} /> : <Circle size={16} />;

export default function MenuPage({ 
  onSelectProduct,
  activeCategory: externalActiveCategory,
  setActiveCategory: externalSetActiveCategory,
  activeSubcategory: externalActiveSubcategory,
  setActiveSubcategory: externalSetActiveSubcategory
}) {
  const [localActiveCategory, localSetActiveCategory] = useState(() => {
    return localStorage.getItem('minibakes_menu_category') || "Cakes";
  });
  const [localActiveSubcategory, localSetActiveSubcategory] = useState(() => {
    return localStorage.getItem('minibakes_menu_subcategory') || null;
  });

  useEffect(() => {
    localStorage.setItem('minibakes_menu_category', localActiveCategory);
  }, [localActiveCategory]);

  useEffect(() => {
    if (localActiveSubcategory) {
      localStorage.setItem('minibakes_menu_subcategory', localActiveSubcategory);
    } else {
      localStorage.removeItem('minibakes_menu_subcategory');
    }
  }, [localActiveSubcategory]);

  const activeCategory = externalActiveCategory !== undefined ? externalActiveCategory : localActiveCategory;
  const setActiveCategory = externalSetActiveCategory !== undefined ? externalSetActiveCategory : localSetActiveCategory;
  const activeSubcategory = externalActiveSubcategory !== undefined ? externalActiveSubcategory : localActiveSubcategory;
  const setActiveSubcategory = externalSetActiveSubcategory !== undefined ? externalSetActiveSubcategory : localSetActiveSubcategory;

  const [cakeLayers, setCakeLayers] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);
  const [selectedLayerIndex, setSelectedLayerIndex] = useState(null);
  const [liveProducts, setLiveProducts] = useState([]);
  const [recentlyViewedIds, setRecentlyViewedIds] = useState([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('minibakes_recently_viewed')) || [];
      setRecentlyViewedIds(stored.map(item => item.id));
    } catch (e) {
      console.error('Error parsing recently viewed:', e);
    }
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: true });
        if (error && !error.message?.includes('fetch')) throw error;
        if (data) setLiveProducts(data);
      } catch (err) {
        console.error('Error fetching live products:', err);
      }
    };
    fetchProducts();
  }, []);

  const mergedMenuData = React.useMemo(() => {
    if (liveProducts.length === 0) return [];

    const categoryOrder = { 'Cakes': 1, 'Cupcakes': 2, 'Treats': 3 };
    const categories = [...new Set(liveProducts.map(p => p.category))].sort((a, b) => {
      const catA = categoryOrder[a] || 99;
      const catB = categoryOrder[b] || 99;
      if (catA !== catB) return catA - catB;
      return a.localeCompare(b);
    });
    
    return categories.map(cat => {
      const catProducts = liveProducts.filter(p => p.category === cat);
      
      const parsedCatProducts = catProducts.map(p => {
        let options = p.options || [];
        let images = p.img ? [p.img] : [];
        const galleryOption = options.find(o => o.name === '__gallery_images');
        if (galleryOption) {
          images = galleryOption.values;
          options = options.filter(o => o.name !== '__gallery_images');
        }
        
        return {
          ...p,
          options,
          images,
          isFullWidth: p.name.toLowerCase().includes('3d')
        };
      });

      const sortProducts = (a, b) => {
        if (a.isFullWidth !== b.isFullWidth) return a.isFullWidth ? 1 : -1;
        
        const sizeA = parseInt(a.name?.match(/(\d+)\s*(inch|")/i)?.[1] || '0', 10);
        const sizeB = parseInt(b.name?.match(/(\d+)\s*(inch|")/i)?.[1] || '0', 10);
        
        if (sizeA !== sizeB) {
          if (sizeA !== 0 && sizeB !== 0) return sizeA - sizeB;
          if (sizeA !== 0 && sizeB === 0) return -1;
          if (sizeA === 0 && sizeB !== 0) return 1;
        }

        const layerA = parseInt(a.name?.match(/(\d+)\s*layer/i)?.[1] || '0', 10);
        const layerB = parseInt(b.name?.match(/(\d+)\s*layer/i)?.[1] || '0', 10);
        
        if (layerA !== layerB) {
          if (layerA !== 0 && layerB !== 0) return layerA - layerB;
          if (layerA !== 0 && layerB === 0) return -1;
          if (layerA === 0 && layerB !== 0) return 1;
        }
        
        const isSmallA = a.name?.toLowerCase().includes('small');
        const isLargeA = a.name?.toLowerCase().includes('large');
        const isSmallB = b.name?.toLowerCase().includes('small');
        const isLargeB = b.name?.toLowerCase().includes('large');

        if (isSmallA && isLargeB) return -1;
        if (isLargeA && isSmallB) return 1;
        
        return (a.name || '').localeCompare(b.name || '', undefined, { numeric: true, sensitivity: 'base' });
      };

      const subcategories = [...new Set(parsedCatProducts.map(p => p.subcategory).filter(Boolean))].sort((a, b) => {
        if (a === 'Buttercream' || a === 'Regular Buttercream') return -1;
        if (b === 'Buttercream' || b === 'Regular Buttercream') return 1;
        return a.localeCompare(b);
      });
      
      return {
        category: cat,
        items: parsedCatProducts.filter(p => !p.subcategory).sort(sortProducts),
        sections: subcategories.map(sub => ({
          title: sub,
          items: parsedCatProducts.filter(p => p.subcategory === sub).sort(sortProducts)
        }))
      };
    });
  }, [liveProducts]);

  useEffect(() => {
    const data = mergedMenuData.find(c => c.category === activeCategory);
    if (data?.sections?.length > 0) {
      const isAlreadyValid = data.sections.some(s => s.title === activeSubcategory);
      if (!isAlreadyValid) {
        setActiveSubcategory(data.sections[0].title);
      }
    } else {
      if (activeSubcategory !== null) {
        setActiveSubcategory(null);
      }
    }
  }, [activeCategory, mergedMenuData]);



  const addLayer = (type) => {
    if (cakeLayers.length >= MAX_LAYERS) {
      setToastMessage(`Maximum ${MAX_LAYERS} layers allowed!`);
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }
    setCakeLayers(prev => {
      const newLayers = [...prev, { type }];
      setSelectedLayerIndex(newLayers.length - 1);
      return newLayers;
    });
  };

  const removeLayer = (e, index) => {
    e.stopPropagation();
    setCakeLayers(prev => prev.filter((_, i) => i !== index));
    if (selectedLayerIndex === index) {
      setSelectedLayerIndex(null);
    } else if (selectedLayerIndex > index) {
      setSelectedLayerIndex(selectedLayerIndex - 1);
    }
  };

  const applyColor = (colorHex) => {
    if (selectedLayerIndex === null || cakeLayers.length === 0) {
      setToastMessage("Please select a layer below first!");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }
    setCakeLayers(prev => prev.map((layer, i) => 
      i === selectedLayerIndex ? { ...layer, color: colorHex } : layer
    ));
  };

  const toggleSpread = (spreadType) => {
    if (selectedLayerIndex === null || cakeLayers.length === 0) {
      setToastMessage("Please select a layer below first!");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }
    setCakeLayers(prev => prev.map((layer, i) => {
      if (i !== selectedLayerIndex) return layer;
      const newSpread = layer.spread === spreadType ? null : spreadType;
      return { ...layer, spread: newSpread };
    }));
  };

  const toggleDesign = (designProperty) => {
    if (selectedLayerIndex === null || cakeLayers.length === 0) {
      setToastMessage("Please select a layer below first!");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }
    setCakeLayers(prev => prev.map((layer, i) => {
      if (i !== selectedLayerIndex) return layer;
      
      const newValue = !layer[designProperty];
      const updatedLayer = { ...layer, [designProperty]: newValue };
      
      if (newValue) {
        if (designProperty === 'bottomBorder') updatedLayer.pearlBottom = false;
        if (designProperty === 'pearlBottom') updatedLayer.bottomBorder = false;
      }
      return updatedLayer;
    }));
  };

  const layerLabel = { '6round': '6" Round', '8round': '8" Round', '6heart': '6" Heart', '8heart': '8" Heart' };
  const layerIcon = (type) => type.includes('heart') ? <Heart size={16} /> : <Circle size={16} />;

  if (liveProducts.length === 0) {
    return (
      <div className="menu-page">
        <div style={{ padding: '6rem 2rem', textAlign: 'center', color: '#666' }}>
          Loading menu...
        </div>
      </div>
    );
  }

  const activeData = mergedMenuData.find(c => c.category === activeCategory) || mergedMenuData[0];

  return (
    <div className="menu-page">
      <div className="menu-header">
        <h1>Our Menu</h1>
        <p>Explore our wide variety of freshly baked treats and custom creations.</p>
      </div>

      <div className="menu-categories">
        {mergedMenuData.map(cat => (
          <button 
            key={cat.category}
            className={`category-btn ${activeCategory === cat.category ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.category)}
          >
            {cat.category}
          </button>
        ))}
      </div>

      {activeData.sections?.length > 0 && (
        <div className="menu-subcategory-selector">
          {activeData.sections.map(section => (
            <button 
              key={section.title}
              className={`subcategory-btn ${activeSubcategory === section.title ? 'active' : ''}`}
              onClick={() => setActiveSubcategory(section.title)}
            >
              {section.title}
              <div className="subcategory-indicator" />
            </button>
          ))}
        </div>
      )}

      <div className="menu-grid">
        {activeData.sections?.length > 0 ? (
          <>
            {activeData.sections
              .filter(section => section.title === activeSubcategory)
              .map(section => (
                <React.Fragment key={section.title}>
                  {section.items.map(item => (
                    <MenuCard 
                      key={item.id}
                      item={item}
                      cakeLayers={cakeLayers}
                      setCakeLayers={setCakeLayers}
                      selectedLayerIndex={selectedLayerIndex}
                      setSelectedLayerIndex={setSelectedLayerIndex}
                      addLayer={addLayer}
                      removeLayer={removeLayer}
                      applyColor={applyColor}
                      toggleSpread={toggleSpread}
                      toggleDesign={toggleDesign}
                      toastMessage={toastMessage}
                      onSelectProduct={onSelectProduct}
                      isLastViewed={recentlyViewedIds.includes(item.id)}
                    />
                  ))}
                </React.Fragment>
              ))}
            {activeData.items.map(item => (
              <MenuCard 
                key={item.id}
                item={item}
                cakeLayers={cakeLayers}
                setCakeLayers={setCakeLayers}
                selectedLayerIndex={selectedLayerIndex}
                setSelectedLayerIndex={setSelectedLayerIndex}
                addLayer={addLayer}
                removeLayer={removeLayer}
                applyColor={applyColor}
                toggleSpread={toggleSpread}
                toggleDesign={toggleDesign}
                toastMessage={toastMessage}
                onSelectProduct={onSelectProduct}
                isLastViewed={recentlyViewedIds.includes(item.id)}
              />
            ))}
          </>
        ) : (
          activeData.items.map(item => (
            <MenuCard 
              key={item.id}
              item={item}
              cakeLayers={cakeLayers}
              setCakeLayers={setCakeLayers}
              selectedLayerIndex={selectedLayerIndex}
              setSelectedLayerIndex={setSelectedLayerIndex}
              addLayer={addLayer}
              removeLayer={removeLayer}
              applyColor={applyColor}
              toggleSpread={toggleSpread}
              toggleDesign={toggleDesign}
              toastMessage={toastMessage}
              onSelectProduct={onSelectProduct}
              isLastViewed={recentlyViewedIds.includes(item.id)}
            />
          ))
        )}
      </div>

    </div>
  );
}
