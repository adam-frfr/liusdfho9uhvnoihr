import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Minus, Plus, Image as ImageIcon, Upload, ShoppingBag, CheckCircle2, AlertCircle, Info, X, CakeSlice } from 'lucide-react';
import SafeImage from './components/SafeImage';
import ErrorBoundary from './ErrorBoundary';
import './ProductDetailsPage.css';
import CakeCareGuide from './components/CakeCareGuide';
const Cake3D = React.lazy(() => import('./Cake3D'));

import style1 from './assets/style1.webp';
import style2 from './assets/style2.webp';
import style3 from './assets/stlye3.webp'; // Note: spelling matches assets folder exactly!
import style4 from './assets/style4.webp';
import style5 from './assets/style5.webp';
import style6 from './assets/style6.webp';
import style7 from './assets/style7.webp';
import style8 from './assets/style8.webp';

const detailsBackgroundPatterns = [
  // Top Area
  { img: style1, top: '5%', left: '6%', rot: 15, size: 30 },
  { img: style2, top: '8%', right: '8%', rot: -25, size: 32 },
  { img: style3, top: '4%', left: '32%', rot: 10, size: 28 },
  { img: style4, top: '6%', right: '35%', rot: -15, size: 34 },
  
  // Upper-Middle Area
  { img: style5, top: '24%', left: '12%', rot: 45, size: 28 },
  { img: style6, top: '22%', right: '15%', rot: -30, size: 32 },
  { img: style7, top: '20%', left: '50%', rot: 15, size: 30 },
  
  // Middle Area
  { img: style8, top: '45%', left: '4%', rot: -20, size: 34 },
  { img: style1, top: '48%', right: '6%', rot: 25, size: 28 },
  { img: style2, top: '42%', left: '42%', rot: -10, size: 32 },
  { img: style3, top: '52%', right: '40%', rot: 35, size: 30 },
  
  // Lower-Middle Area
  { img: style4, bottom: '28%', left: '15%', rot: -15, size: 35 },
  { img: style5, bottom: '24%', right: '18%', rot: 20, size: 28 },
  { img: style6, bottom: '22%', left: '48%', rot: -40, size: 32 },
  
  // Bottom Area
  { img: style7, bottom: '6%', left: '8%', rot: 10, size: 30 },
  { img: style8, bottom: '8%', right: '10%', rot: -25, size: 34 },
  { img: style1, bottom: '5%', left: '35%', rot: 15, size: 28 },
  { img: style2, bottom: '4%', right: '32%', rot: -10, size: 32 }
];

export default function ProductDetailsPage({ product, onBack, onConfirm, cartCount, onOpenCart, onViewProduct }) {
  const [quantity, setQuantity] = useState(1);
  const [showNotification, setShowNotification] = useState(false);
  const [warningNotification, setWarningNotification] = useState('');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    if (product && product.id) {
      try {
        const stored = JSON.parse(localStorage.getItem('minibakes_recently_viewed')) || [];
        const history = stored.filter(item => item.id !== product.id);
        setRecentlyViewed(history.slice(0, 4));

        const newStored = [
          { id: product.id, name: product.name, img: product.img, price: product.price },
          ...history
        ].slice(0, 10);
        localStorage.setItem('minibakes_recently_viewed', JSON.stringify(newStored));
      } catch (err) {
        console.error('Error with recently viewed:', err);
      }
    }
  }, [product]);

  useEffect(() => {
    if (chatEndRef.current) {
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  }, [currentStepIndex, isTyping]);

  const goToNextStep = (targetIndex) => {
    setIsTyping(true);
    setCurrentStepIndex(targetIndex);
    setTimeout(() => setIsTyping(false), 1200);
  };

  const [showCareModal, setShowCareModal] = useState(false);
  const [isMobileOverlayOpen, setIsMobileOverlayOpen] = useState(false);
  const displayImg = product?.img;
  const [options, setOptions] = useState({
    flavor: '',
    spreads: [], // Changed to array for multi-select support
    message: '',
    innerMessage: '',
    notes: '',
    bows: false,
    individualPackaging: false,
    boxSize: '',
    ediblePrinting: false,
    color: '',
    customOptions: {}
  });

  const BOW_ADDON_PRICE = 5;

  const minQty = product?.min_qty !== undefined && product?.min_qty !== null ? product.min_qty : (product?.id?.startsWith('mc') ? 4 : 1);

  useEffect(() => {
    if (product) {
      setQuantity(minQty);
    }
  }, [product, minQty]);

  useEffect(() => {
    if (product?.options && Array.isArray(product.options)) {
      const initialCustom = {};
      product.options.forEach(opt => {
        if (opt.name && opt.name !== '__gallery_images' && Array.isArray(opt.values) && opt.values.length > 0) {
          initialCustom[opt.name] = opt.values[0];
        }
      });
      setOptions(prev => ({ ...prev, customOptions: initialCustom }));
    }
  }, [product]);

  if (!product) return null;

  const productId = product?.id || '';
  const isCake = productId.startsWith('c') && !productId.startsWith('cu') && !productId.startsWith('cp');
  const isCupcake = productId.startsWith('cu');
  const isCakePop = productId.startsWith('cp');
  const isMiniCake = productId.startsWith('mc');
  const isBrownie = productId.startsWith('t1') || productId === 'brownies-box' || productId === 't-featured';
  const isBreakableHeart = productId.startsWith('t2');
  const isCakesicleBulk = productId === 'cakesicles-bulk';
  const isCakesicle = productId.startsWith('t3') || productId.startsWith('t4') || isCakesicleBulk;

  const hasSpreads = product?.spreads && product.spreads.length > 0 
    ? true 
    : (isCake || isMiniCake || isBrownie || isCupcake);

  const handleDecrement = () => {
    if (quantity <= minQty) {
      if (isMiniCake || minQty > 1) {
        setWarningNotification(`Minimum order is ${minQty} pieces.`);
      } else {
        setWarningNotification(`Minimum order for this item is ${minQty} piece.`);
      }
      setTimeout(() => setWarningNotification(''), 3000);
    } else {
      setQuantity(quantity - 1);
    }
  };

  const flavors = product?.flavours && product.flavours.length > 0
                  ? product.flavours
                  : (isCake || isCupcake || productId.startsWith('cp') || productId.startsWith('t3') || productId.startsWith('t4') || isBreakableHeart || isCakesicleBulk
                     ? ['Vanilla', 'Chocolate', 'Red Velvet'] : 
                     ['Classic Chocolate']);

  const isRedVelvetMiniCake = isMiniCake && (options.flavor === 'Red Velvet' || (product?.name?.toLowerCase()?.includes('red velvet') || false));

  let spreads = product?.spreads && product.spreads.length > 0
                  ? [...product.spreads]
                  : (isCake 
                    ? ['Nutella', 'Biscoff', 'Pistachio', 'Kinder', 'White Chocolate', 'Ferrero Rocher']
                    : ['Nutella', 'Biscoff', 'Pistachio', 'Kinder']);

  if (isRedVelvetMiniCake) {
    if (!spreads.includes('Regular Buttercream')) {
      spreads.push('Regular Buttercream');
    }
  }

  const isFeatured = product?.id?.toString().startsWith('featured') || product?.id?.toString().includes('-featured');
  const priceMatches = (product?.price || '').match(/\d+(\.\d+)?/g);
  const basePrice = priceMatches ? parseFloat(priceMatches[priceMatches.length - 1]) : 0;
  
  let currentUnitPrice = basePrice;
  if (isCakesicleBulk) {
    currentUnitPrice = quantity >= 20 ? 2.40 : 2.60;
  }

  // Calculate cupcakes count per box to apply correct spread addon pricing
  let cupcakesPerBox = 1;
  if (productId === 'cu1' || productId === 'cu4') {
    cupcakesPerBox = 6;
  } else if (productId === 'cu2' || productId === 'cu5') {
    cupcakesPerBox = 12;
  }

  const isWhiteChocolateCupcake = ['cu4', 'cu5', 'cu6'].includes(productId) || (isCupcake && product?.individual_packaging) || (isCupcake && (product?.name?.toLowerCase()?.includes('white chocolate') || false));
  
  const showBows = product?.bows !== undefined && product?.bows !== null 
    ? product.bows 
    : (!isCupcake && !isCakePop && !isBrownie && !isBreakableHeart && !isMiniCake && !isCakesicle);

  const showIndividualPackaging = product?.individual_packaging !== undefined && product?.individual_packaging !== null
    ? product.individual_packaging
    : (isWhiteChocolateCupcake || isCakesicle);

  const showMessage = product?.has_message !== undefined && product?.has_message !== null
    ? product.has_message
    : (!isCupcake && !isCakePop && !isMiniCake);

  const showInnerMessage = product?.has_inner_message !== undefined && product?.has_inner_message !== null
    ? product.has_inner_message
    : isBreakableHeart;

  const showEdiblePrinting = product?.has_edible_printing !== undefined && product?.has_edible_printing !== null
    ? product.has_edible_printing
    : isCakesicle;

  const spreadsPrice = (isCupcake && options.spreads.length > 0) ? (0.45 * cupcakesPerBox) : 0;
  const packagingPrice = (showIndividualPackaging && options.individualPackaging)
    ? (isCakesicle ? 0.15 : 0.15 * cupcakesPerBox)
    : 0;

  const bowsTotal = options.bows ? BOW_ADDON_PRICE : 0;
  const unitTotal = currentUnitPrice + bowsTotal + spreadsPrice + packagingPrice;
  const ediblePrintingTotal = options.ediblePrinting ? 12 : 0;
  const grandTotal = (unitTotal * quantity) + ediblePrintingTotal;

  // Build the form steps dynamically
  const formSteps = [];
  
  if (product?.options && Array.isArray(product.options)) {
    product.options.forEach(opt => {
      if (!opt.name || opt.name === '__gallery_images' || !Array.isArray(opt.values) || opt.values.length === 0) return;
      
      formSteps.push({
        id: `custom_${opt.name}`,
        question: `What ${opt.name.toLowerCase()} would you like?`,
        render: () => (
          <div className="conv-input-wrapper" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', width: '100%', gap: '0.5rem', alignItems: 'center' }}>
              <select 
                className="conv-input conv-select"
                style={{ flex: 1 }}
                value={options.customOptions?.[opt.name] || ''}
                onChange={(e) => setOptions({
                  ...options, 
                  customOptions: { ...(options.customOptions || {}), [opt.name]: e.target.value }
                })}
              >
                <option value="" disabled>Select {opt.name.toLowerCase()}...</option>
                {opt.values.map(val => (
                  <option key={val} value={val}>{val}</option>
                ))}
              </select>
              <button 
                className="conv-next-btn" 
                onClick={() => goToNextStep(currentStepIndex + 1)}
                disabled={!options.customOptions?.[opt.name]}
                style={{ opacity: !options.customOptions?.[opt.name] ? 0.5 : 1 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
            
            {isBrownie && opt.name.toLowerCase().includes('size') && (
              <div className="brownie-notice-box" style={{ 
                background: 'rgba(128, 0, 0, 0.035)', 
                border: '1px solid rgba(128, 0, 0, 0.12)', 
                borderRadius: '12px', 
                padding: '12px 16px', 
                marginTop: '12px',
                display: 'flex',
                gap: '10px',
                alignItems: 'flex-start',
                width: '100%'
              }}>
                <AlertCircle size={16} style={{ color: '#6b1111', flexShrink: 0, marginTop: '2px' }} />
                <p className="brownie-batch-note" style={{ 
                  fontSize: '12px', 
                  color: '#6b1111', 
                  margin: 0, 
                  fontWeight: '500', 
                  lineHeight: '1.5',
                  textAlign: 'left'
                }}>
                  <strong>Important Note:</strong> Standard batch size is 22cm x 22cm. Depending on the quantity selected, each brownie piece will be adjusted in size accordingly.
                </p>
              </div>
            )}
          </div>
        )
      });
    });
  }

  if (flavors.length > 0) {
    formSteps.push({
      id: 'flavor',
      question: "What flavor would you like?",
      render: () => (
        <div className="conv-input-wrapper">
          <select 
            className="conv-input conv-select"
            value={options.flavor}
            onChange={(e) => setOptions({...options, flavor: e.target.value})}
          >
            <option value="" disabled>Select flavor...</option>
            {flavors.map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
          <button 
            className="conv-next-btn" 
            onClick={() => goToNextStep(currentStepIndex + 1)}
            disabled={!options.flavor}
            style={{ opacity: !options.flavor ? 0.5 : 1 }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      )
    });
  }

  const is3D = product?.name?.toLowerCase().includes('3d');
  const hasSelected3DSpread = is3D && product?.layers?.some(layer => layer.spread && layer.spread !== 'None');

  if (hasSpreads && !hasSelected3DSpread) {
    formSteps.push({
      id: 'spreads',
      question: isRedVelvetMiniCake ? 'Which buttercream flavour?' : (isCupcake ? 'Any inner spread?' : (isBrownie ? 'Select Spreads (Up to 3)' : 'Select your inner spread:')),
      render: () => (
        <div className="conv-input-wrapper" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', width: '100%', gap: '0.5rem', alignItems: 'flex-start' }}>
            {isBrownie ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, maxHeight: '200px', overflowY: 'auto', padding: '4px' }}>
                {spreads.map(s => (
                  <label key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={options.spreads.includes(s)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          if (options.spreads.length < 3) {
                            setOptions({...options, spreads: [...options.spreads, s]});
                          }
                        } else {
                          setOptions({...options, spreads: options.spreads.filter(spread => spread !== s)});
                        }
                      }}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '14px', userSelect: 'none' }}>{s}</span>
                  </label>
                ))}
              </div>
            ) : (
              <select 
                className="conv-input conv-select"
                style={{ flex: 1 }}
                value={options.spreads[0] || 'None'}
                onChange={(e) => {
                  setOptions({...options, spreads: e.target.value === 'None' ? [] : [e.target.value]});
                }}
              >
                <option value="None">None</option>
                {spreads.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            )}
            <button 
              className="conv-next-btn" 
              style={{ marginTop: isBrownie ? 'auto' : '0' }}
              onClick={() => goToNextStep(currentStepIndex + 1)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
          {isBrownie && (
            <span style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.5rem' }}>
              Hold Ctrl/Cmd to select up to 3 options, or select 'None'.
            </span>
          )}
        </div>
      )
    });
  }

  if ((isCake || isWhiteChocolateCupcake) && !is3D) {
    formSteps.push({
      id: 'color',
      question: isWhiteChocolateCupcake ? "Any specific color?" : "Any specific color for the cake or frosting?",
      render: () => (
        <div className="conv-input-wrapper">
          <input 
            type="text" 
            placeholder="e.g. Light Pink, Sage Green..." 
            className="conv-input"
            value={options.color}
            onChange={(e) => setOptions({...options, color: e.target.value})}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (!options.color.trim()) setOptions({...options, color: 'No specific color'});
                goToNextStep(currentStepIndex + 1);
              }
            }}
          />
          {!options.color.trim() ? (
            <button className="conv-skip-btn" onClick={() => {
              setOptions({...options, color: 'No specific color'});
              goToNextStep(currentStepIndex + 1);
            }}>Skip</button>
          ) : (
            <button className="conv-next-btn" onClick={() => goToNextStep(currentStepIndex + 1)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          )}
        </div>
      )
    });
  }

  if (showMessage) {
    formSteps.push({
      id: 'message',
      question: isBreakableHeart ? "What should we write on the heart?" : "What should we write on the product?",
      render: () => (
        <div className="conv-input-wrapper">
          <input 
            type="text" 
            placeholder={isBreakableHeart ? "e.g. HBD Sarah! (Optional)" : "e.g. Happy Birthday! (Optional)"} 
            className="conv-input"
            value={options.message}
            onChange={(e) => setOptions({...options, message: e.target.value})}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (!options.message.trim()) setOptions({...options, message: 'No Message'});
                goToNextStep(currentStepIndex + 1);
              }
            }}
          />
          {!options.message.trim() ? (
            <button className="conv-skip-btn" onClick={() => {
              setOptions({...options, message: 'No Message'});
              goToNextStep(currentStepIndex + 1);
            }}>Skip</button>
          ) : (
            <button className="conv-next-btn" onClick={() => goToNextStep(currentStepIndex + 1)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          )}
        </div>
      )
    });
  }

  if (showInnerMessage) {
    formSteps.push({
      id: 'innerMessage',
      question: "Write a secret note to be placed inside (included):",
      render: () => (
        <div className="conv-input-wrapper" style={{ alignItems: 'flex-end' }}>
          <textarea 
            placeholder="Your secret message..." 
            className="conv-input conv-textarea"
            value={options.innerMessage || ''}
            onChange={(e) => setOptions({...options, innerMessage: e.target.value})}
          />
          {!(options.innerMessage || '').trim() ? (
            <button className="conv-skip-btn" onClick={() => {
              setOptions({...options, innerMessage: 'None'});
              goToNextStep(currentStepIndex + 1);
            }}>Skip</button>
          ) : (
            <button className="conv-next-btn" onClick={() => goToNextStep(currentStepIndex + 1)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          )}
        </div>
      )
    });
  }

  if (!isWhiteChocolateCupcake) {
    formSteps.push({
      id: 'refImage',
      question: "Do you have an inspiration image?",
    render: () => (
      <div className="conv-input-wrapper" style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
        <div className="conv-upload-box">
          <input 
            type="file" 
            id="ref-image" 
            accept="image/*"
            onChange={(e) => {
               setOptions({...options, refImage: e.target.files[0]});
               goToNextStep(currentStepIndex + 1);
            }}
            style={{ display: 'none' }}
          />
          <label htmlFor="ref-image" style={{ cursor: 'pointer', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {options.refImage ? (
              <>
                <CheckCircle2 size={24} />
                <span>{options.refImage.name}</span>
              </>
            ) : (
              <>
                <Upload size={24} />
                <span>Tap to upload image (Optional)</span>
              </>
            )}
          </label>
        </div>
        {!options.refImage && (
          <button 
            style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', fontSize: '0.9rem', marginTop: '0.5rem', textDecoration: 'underline' }}
            onClick={() => goToNextStep(currentStepIndex + 1)}
          >
            Skip for now
          </button>
        )}
      </div>
    )
  });
  }

  if (showBows) {
    formSteps.push({
      id: 'bows',
      question: "Would you like to add a Fondant Bow?",
      render: () => (
        <div className="conv-input-wrapper">
          <select 
            className="conv-input conv-select"
            value={options.bows ? 'Yes' : 'No'}
            onChange={(e) => {
              setOptions({...options, bows: e.target.value === 'Yes'});
            }}
          >
            <option value="No">No Bow</option>
            <option value="Yes">Yes, add a Bow (+€{BOW_ADDON_PRICE})</option>
          </select>
          <button 
            className="conv-next-btn" 
            onClick={() => goToNextStep(currentStepIndex + 1)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      )
    });
  }

  if (showIndividualPackaging || showEdiblePrinting) {
    formSteps.push({
      id: 'addons',
      question: "Any final additions?",
      render: () => (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          {showIndividualPackaging && (
            <div className="conv-toggle-row">
              <div className="conv-toggle-label">
                <span className="conv-toggle-title">📦 Individual Packaging</span>
                <span className="conv-toggle-desc">+€{isCakesicle ? '0.15 per piece' : (0.15 * cupcakesPerBox).toFixed(2)}</span>
              </div>
              <label className="conv-switch">
                <input type="checkbox" checked={options.individualPackaging} onChange={() => setOptions({...options, individualPackaging: !options.individualPackaging})} />
                <span className="conv-slider"></span>
              </label>
            </div>
          )}
          {showEdiblePrinting && (
            <div className="conv-toggle-row">
              <div className="conv-toggle-label">
                <span className="conv-toggle-title">🖨️ Edible Printing</span>
                <span className="conv-toggle-desc">+€12.00</span>
              </div>
              <label className="conv-switch">
                <input type="checkbox" checked={options.ediblePrinting} onChange={() => setOptions({...options, ediblePrinting: !options.ediblePrinting})} />
                <span className="conv-slider"></span>
              </label>
            </div>
          )}
          <button className="conv-next-btn" style={{ marginTop: '1rem' }} onClick={() => goToNextStep(currentStepIndex + 1)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      )
    });
  }

  formSteps.push({
    id: 'notes',
    question: "Any allergies or special instructions?",
    render: () => (
      <div className="conv-input-wrapper" style={{ alignItems: 'flex-end' }}>
        <textarea 
          placeholder="e.g. No nuts, please!" 
          className="conv-input conv-textarea"
          value={options.notes}
          onChange={(e) => setOptions({...options, notes: e.target.value})}
        />
          {!options.notes.trim() ? (
            <button className="conv-skip-btn" onClick={() => {
              setOptions({...options, notes: 'None'});
              if (currentStepIndex < formSteps.length) goToNextStep(currentStepIndex + 1);
            }}>Skip</button>
          ) : (
            <button className="conv-next-btn" onClick={() => {
              if (currentStepIndex < formSteps.length) goToNextStep(currentStepIndex + 1);
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          )}
      </div>
    )
  });

  return (
    <div className="product-details-page">
      {showNotification && (
        <div className="added-notification">
          <CheckCircle2 size={18} className="notification-icon" />
          Successfully added to your order!
        </div>
      )}
      {warningNotification && (
        <div className="added-notification" style={{ background: '#d32f2f', boxShadow: '0 10px 30px rgba(211, 47, 47, 0.3)' }}>
          <AlertCircle size={18} className="notification-icon" />
          <span>{warningNotification}</span>
        </div>
      )}
      <div className="details-container">
        <div className="details-header-nav">
          <button className="back-btn-details" onClick={onBack}>
            <ArrowLeft size={24} /> <span>Back to browsing</span>
          </button>
          
          <button className="cart-btn-details" onClick={onOpenCart}>
            <div className="cart-icon-wrapper-details">
              <ShoppingBag size={24} />
              {cartCount > 0 && <span className="cart-badge-details">{cartCount}</span>}
            </div>
          </button>
        </div>

        <div className="details-layout">
          <div className="details-image-side">
            {/* Scattered premium brand icons in background */}
            {detailsBackgroundPatterns.map((item, idx) => (
              <img
                key={idx}
                src={item.img}
                className="details-decor-icon"
                style={{
                  position: 'absolute',
                  top: item.top || 'auto',
                  bottom: item.bottom || 'auto',
                  left: item.left || 'auto',
                  right: item.right || 'auto',
                  width: `${item.size || 30}px`,
                  height: 'auto',
                  opacity: 0.16, // Very subtle, elegant, premium dust texture
                  transform: `rotate(${item.rot}deg)`,
                  pointerEvents: 'none',
                  zIndex: 0
                }}
                alt=""
              />
            ))}

            {product.layers ? (
              <div className="details-3d-wrapper" style={{ position: 'relative', zIndex: 2 }}>
                <ErrorBoundary>
                  <React.Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '300px', background: '#fdf2f2', borderRadius: '20px' }}>Loading 3D model...</div>}>
                    <Cake3D layers={product.layers} />
                  </React.Suspense>
                </ErrorBoundary>
              </div>
            ) : (
              <SafeImage src={displayImg} alt={product.name} key={displayImg} className="main-details-img" />
            )}
          </div>

          <div className="details-info-side">

            {/* ── LEFT: Product Summary Panel ── */}
            <div className="details-summary-panel">
              <h1 className="details-title">{product.name}</h1>
              {product.portions && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', color: '#555', marginBottom: '16px', fontWeight: '500', background: '#fcfcfc', padding: '6px 12px', borderRadius: '8px', width: 'fit-content', border: '1px solid #eee' }}>
                  <CakeSlice size={16} color="#800000" />
                  <span>{product.portions}</span>
                </div>
              )}
              <p className="details-price">{product.price}</p>
              <p className="details-description">{product.description}</p>

              <div className="summary-divider" />

              {/* Live Price Breakdown */}
              <div className="price-breakdown">
                <h4 className="price-breakdown-title">Order Summary</h4>
                <div className="price-breakdown-rows">
                  <div className="price-row">
                    <span className="price-row-label">{product.name}</span>
                    <span className="price-row-value">
                      {(currentUnitPrice === 0 && product?.price === 'WA') ? (
                        <span className="price-wa-tag">Quote required</span>
                      ) : (
                        currentUnitPrice === 0 ? (product?.price || '€0.00') : `€${currentUnitPrice.toFixed(2)}`
                      )}
                    </span>
                  </div>

                  {options.spreads && options.spreads.length > 0 && (
                    <div className="price-row price-row-addon">
                      <span className="price-row-label">↳ Spreads: {options.spreads.join(', ')}</span>
                      <span className="price-row-value">
                        {isCupcake ? `+€${spreadsPrice.toFixed(2)}` : 'Included'}
                      </span>
                    </div>
                  )}

                  {isWhiteChocolateCupcake && options.individualPackaging && (
                    <div className="price-row price-row-addon">
                      <span className="price-row-label">↳ Individual Packaging 📦</span>
                      <span className="price-row-value">+€{packagingPrice.toFixed(2)}</span>
                    </div>
                  )}

                  {options.bows && (
                    <div className="price-row price-row-addon">
                      <span className="price-row-label">↳ Bows 🎀</span>
                      <span className="price-row-value">+€{BOW_ADDON_PRICE.toFixed(2)}</span>
                    </div>
                  )}

                  {quantity > 1 && (
                    <div className="price-row price-row-addon">
                      <span className="price-row-label">↳ Qty × {quantity}</span>
                      <span className="price-row-value">€{unitTotal.toFixed(2)} each</span>
                    </div>
                  )}

                  {options.ediblePrinting && (
                    <div className="price-row price-row-addon">
                      <span className="price-row-label">↳ Edible Printing 🖨️</span>
                      <span className="price-row-value">+€12.00</span>
                    </div>
                  )}

                  <div className="price-row price-row-total">
                    <span className="price-row-label">Total</span>
                    <span className="price-row-value">
                      {(grandTotal === 0 && product?.price === 'WA') ? (
                        <span className="price-wa-tag">Quote required</span>
                      ) : (
                        grandTotal === 0 ? (product?.price || '€0.00') : `€${grandTotal.toFixed(2)}`
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {isCake && (
                <button 
                  className="care-guide-btn" 
                  onClick={() => setShowCareModal(true)}
                >
                  <Info size={16} /> View Cake Care Instructions
                </button>
              )}
            </div>

            {/* ── MOBILE: Sticky Bottom Trigger ── */}
            <div className="mobile-customize-trigger">
              <button onClick={() => setIsMobileOverlayOpen(true)} className="mobile-customize-btn">
                Customize & Order
              </button>
            </div>

            {/* ── RIGHT: Chat / Customization Panel ── */}
            <div className={`details-chat-panel ${isMobileOverlayOpen ? 'mobile-overlay-open' : ''}`}>
              <div className="chat-panel-header">
                <span className="chat-panel-badge">🎂 Customize Your Order</span>
                {isMobileOverlayOpen && (
                  <button className="mobile-close-overlay-btn" onClick={() => setIsMobileOverlayOpen(false)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                )}
              </div>

              <div className="customization-section conversational-form">
                {formSteps.slice(0, currentStepIndex + 1).map((step, idx) => {
                  const isLastAndTyping = (idx === currentStepIndex) && isTyping;
                  return (
                    <div key={step.id} className="conv-step" style={{ animationDelay: isLastAndTyping ? '0s' : '0.1s' }}>
                      <div className="conv-bot-message-wrapper" style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', marginBottom: '8px' }}>
                        <div className="conv-bot-avatar" aria-hidden="true" style={{ width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0, boxShadow: '0 2px 5px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff5f7', color: '#800000' }}>
                          <CakeSlice size={16} />
                        </div>
                        <div className="conv-question-bubble" style={{ margin: 0 }}>
                          {isLastAndTyping ? (
                            <div className="typing-indicator"><span></span><span></span><span></span></div>
                          ) : (
                            step.question
                          )}
                        </div>
                      </div>
                      {!isLastAndTyping && (
                        <div className="conv-answer-area">
                          {step.render()}
                        </div>
                      )}
                    </div>
                  );
                })}
                {currentStepIndex >= formSteps.length && formSteps.length > 0 && (
                  <div className="conv-step" style={{ animationDelay: '0.1s' }}>
                    <div className="conv-bot-message-wrapper" style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', marginBottom: '8px' }}>
                      <div className="conv-bot-avatar" aria-hidden="true" style={{ width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0, boxShadow: '0 2px 5px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff5f7', color: '#800000' }}>
                        <CakeSlice size={16} />
                      </div>
                      <div className="conv-question-bubble" style={{ margin: 0, background: '#eaf4ea', color: '#1b5e20', border: '1px solid #c8e6c9', maxWidth: '100%' }}>
                        🎉 Awesome! You're all set. Here is your order summary:
                      
                      <div className="price-breakdown-rows" style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid rgba(27, 94, 32, 0.2)' }}>
                        <div className="price-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span className="price-row-label" style={{ fontWeight: '600' }}>{product.name}</span>
                          <span className="price-row-value" style={{ fontWeight: '600' }}>
                            {(currentUnitPrice === 0 && product?.price === 'WA') 
                              ? 'WA' 
                              : (currentUnitPrice === 0 ? (product?.price || '€0.00') : `€${currentUnitPrice.toFixed(2)}`)}
                          </span>
                        </div>
                        
                        {Object.entries(options.customOptions || {}).map(([key, val]) => (
                          <div className="price-row price-row-addon" key={key} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.9rem', color: '#2e7d32' }}>
                            <span className="price-row-label">↳ {key}: {val}</span>
                            <span className="price-row-value">Included</span>
                          </div>
                        ))}

                        {options.flavor && (
                          <div className="price-row price-row-addon" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.9rem', color: '#2e7d32' }}>
                            <span className="price-row-label">↳ Flavor: {options.flavor}</span>
                            <span className="price-row-value">Included</span>
                          </div>
                        )}
                        
                        {options.spreads && options.spreads.length > 0 && (
                          <div className="price-row price-row-addon" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.9rem', color: '#2e7d32' }}>
                            <span className="price-row-label">↳ Spreads: {options.spreads.join(', ')}</span>
                            <span className="price-row-value">{isCupcake ? `+€${spreadsPrice.toFixed(2)}` : 'Included'}</span>
                          </div>
                        )}
                        
                        {options.bows && (
                          <div className="price-row price-row-addon" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.9rem', color: '#2e7d32' }}>
                            <span className="price-row-label">↳ Bows 🎀</span>
                            <span className="price-row-value">+€{BOW_ADDON_PRICE.toFixed(2)}</span>
                          </div>
                        )}

                        {options.ediblePrinting && (
                          <div className="price-row price-row-addon" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.9rem', color: '#2e7d32' }}>
                            <span className="price-row-label">↳ Edible Printing 🖨️</span>
                            <span className="price-row-value">+€12.00</span>
                          </div>
                        )}
                        
                        <div className="price-row price-row-total" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(27, 94, 32, 0.2)', fontWeight: '700', fontSize: '1.1rem' }}>
                          <span className="price-row-label">Item Total</span>
                          <span className="price-row-value">
                            {grandTotal === 0 ? (product?.price || '€0.00') : `€${grandTotal.toFixed(2)}`}
                          </span>
                        </div>
                      </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} style={{ height: 1, width: '100%', flexShrink: 0 }} />
              </div>

              {/* Quantity + Confirm */}
              <div className="quantity-checkout-wrapper" style={{ width: '100%' }}>
                <div className="quantity-checkout-row">
                  <div className="quantity-selector">
                    <button onClick={handleDecrement}><Minus size={20} /></button>
                    <span>{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)}><Plus size={20} /></button>
                  </div>
                  <button 
                    className="add-to-order-final-btn"
                    disabled={currentStepIndex < formSteps.length}
                    style={{ opacity: currentStepIndex < formSteps.length ? 0.5 : 1, cursor: currentStepIndex < formSteps.length ? 'not-allowed' : 'pointer' }}
                    onClick={() => {
                      if (currentStepIndex < formSteps.length) return;
                      onConfirm({ ...product, quantity, options });
                      setShowNotification(true);
                      setTimeout(() => setShowNotification(false), 3000);
                      setIsMobileOverlayOpen(false);
                    }}
                  >
                    Add to Order • {(grandTotal === 0 && product?.price === 'WA') ? (
                      <span className="price-wa-tag" style={{ display: 'inline-flex', verticalAlign: 'middle', marginLeft: '5px' }}>Quote required</span>
                    ) : (
                      grandTotal === 0 ? (product?.price || '€0.00') : `€${grandTotal.toFixed(2)}`
                    )}
                  </button>
                </div>
                {isMiniCake && (
                  <div className="min-order-alert-note" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#b71c1c', fontSize: '0.85rem', fontWeight: '600', marginTop: '10px', justifyContent: 'center' }}>
                    <AlertCircle size={14} />
                    <span>Minimum order: 4 Mini Cakes required</span>
                  </div>
                )}

              </div>
            </div>



          </div>
        </div>

      </div>

      {showCareModal && (
        <div className="care-modal-overlay" onClick={() => setShowCareModal(false)}>
          <div className="care-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="care-modal-close" onClick={() => setShowCareModal(false)}>
              <X size={24} />
            </button>
            <CakeCareGuide />
          </div>
        </div>
      )}
    </div>
  );
}
