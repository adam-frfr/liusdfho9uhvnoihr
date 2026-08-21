import React, { useState, useRef, useEffect } from 'react';
import { X, ShoppingBag, ArrowLeft, Minus, Plus, CheckCircle2, Calendar, Phone, MessageSquare, User, Sparkles, Cake, AlertCircle } from 'lucide-react';
import './OrderPage.css';
import CakeCareGuide from './components/CakeCareGuide';
import { supabase } from './supabase';
import logo from './assets/mini_logo.webp';

export default function OrderPage({ cart = [], onBack, onRemoveItem, onUpdateQuantity }) {
  const [step, setStep] = useState('cart'); // 'cart' | 'checkout' | 'success' | 'processing'
  const [phoneCode, setPhoneCode] = useState('+356');
  const [whatsappCode, setWhatsappCode] = useState('+356');
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [step]);

  const [warningNotification, setWarningNotification] = useState('');
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('minibakes_order_draft');
    if (saved) return JSON.parse(saved);

    const profileSaved = localStorage.getItem('minibakes_user_profile');
    const profile = profileSaved ? JSON.parse(profileSaved) : {};

    return {
      name: profile.name || '',
      phone: profile.phone || '',
      whatsapp: profile.whatsapp || '',
      date: '',
      note: ''
    };
  });

  useEffect(() => {
    localStorage.setItem('minibakes_order_draft', JSON.stringify(formData));
  }, [formData]);

  const handleDecrementCart = (item) => {
    const isMiniCake = item.id?.startsWith('mc');
    const minQty = isMiniCake ? 4 : 1;
    if (item.quantity <= minQty) {
      if (isMiniCake) {
        setWarningNotification('Minimum order for Mini Cakes is 4 pieces.');
      } else {
        setWarningNotification(`Minimum order for this item is ${minQty} piece.`);
      }
      setTimeout(() => setWarningNotification(''), 3000);
    } else {
      onUpdateQuantity(item.cartId, item.quantity - 1);
    }
  };

  const [orderId, setOrderId] = useState('');
  const [finalOrderTotal, setFinalOrderTotal] = useState(0);

  const getItemTotal = (item) => {
    const isFeatured = item.id?.toString().startsWith('featured') || item.id?.toString().includes('-featured');
    let unitPrice = 0;
    
    if (isFeatured) {
      const priceMatches = (item.price || '').match(/\d+(\.\d+)?/g);
      unitPrice = priceMatches ? parseFloat(priceMatches[priceMatches.length - 1]) : 0;
    } else {
      unitPrice = parseFloat((item.price || '0').replace(/[^\d.]/g, '')) || 0;
    }

    // Tiered pricing for cakesicles-bulk
    if (item.id === 'cakesicles-bulk') {
      unitPrice = item.quantity >= 20 ? 2.40 : 2.60;
    }

    // Spreads fee for cupcakes (extra €0.45 per cupcake)
    const isCupcake = item.id && item.id.startsWith('cu');
    if (isCupcake && item.options?.spreads && item.options.spreads.length > 0) {
      let cupcakesPerBox = 1;
      if (item.id === 'cu1' || item.id === 'cu4') {
        cupcakesPerBox = 6;
      } else if (item.id === 'cu2' || item.id === 'cu5') {
        cupcakesPerBox = 12;
      }
      unitPrice += 0.45 * cupcakesPerBox;
    }

    // Packaging fee for White Chocolate cupcakes (extra €0.15 per cupcake)
    const isWhiteChocolateCupcake = ['cu4', 'cu5', 'cu6'].includes(item.id);
    if (isWhiteChocolateCupcake && item.options?.individualPackaging) {
      let cupcakesPerBox = 1;
      if (item.id === 'cu1' || item.id === 'cu4') {
        cupcakesPerBox = 6;
      } else if (item.id === 'cu2' || item.id === 'cu5') {
        cupcakesPerBox = 12;
      }
      unitPrice += 0.15 * cupcakesPerBox;
    }

    // Addons
    if (item.options?.bows) {
      unitPrice += 5;
    }

    return unitPrice * item.quantity;
  };

  const totalPrice = cart.reduce((acc, item) => acc + getItemTotal(item), 0);

  const hasCake = cart.some(item => item.id.startsWith('c') && !item.id.startsWith('cu'));

  const getTodayDate = () => {
    const date = new Date();
    return date.toISOString().split('T')[0];
  };

  const getTwoDaysDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 2);
    return date.toISOString().split('T')[0];
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setStep('processing'); // Show processing state
    
    setFinalOrderTotal(totalPrice);
    
    let orderNumber = 1;
    try {
      const { data: latestOrder } = await supabase
        .from('orders')
        .select('id')
        .order('created_at', { ascending: false })
        .limit(1);
        
      if (latestOrder && latestOrder.length > 0) {
        const lastId = latestOrder[0].id;
        const match = lastId.match(/ORD-(\d+)/);
        if (match) {
          orderNumber = parseInt(match[1], 10) + 1;
        } else {
          const { count } = await supabase.from('orders').select('*', { count: 'exact', head: true });
          orderNumber = (count || 0) + 1;
        }
      }
    } catch (err) {
      console.error('Error fetching latest order ID:', err);
      orderNumber = Math.floor(1000 + Math.random() * 9000);
    }
    
    const newId = `ORD-${String(orderNumber).padStart(4, '0')}`;
    setOrderId(newId);

    // 1. Generate or fetch unique persistent Client Device ID legally (strictly local and non-cookie)
    let clientId = localStorage.getItem('minibakes_client_id');
    if (!clientId) {
      clientId = `dev-${Math.random().toString(36).substring(2, 10)}-${Date.now().toString(36)}`;
      localStorage.setItem('minibakes_client_id', clientId);
    }

    // 2. Upload reference/inspiration images if any exist, and build item details
    try {
      const itemsWithUrls = [];
      for (let i = 0; i < cart.length; i++) {
        const item = cart[i];
        let refImageUrl = null;
        if (item.options?.refImage) {
          try {
            const file = item.options.refImage;
            const fileExt = file.name.split('.').pop();
            const fileName = `order-${newId}-${i}-${Date.now()}.${fileExt}`;
            
            const { data, error: uploadError } = await supabase.storage
              .from('inspiration-images')
              .upload(fileName, file);
              
            if (uploadError) throw uploadError;
            
            if (data) {
              const { data: { publicUrl } } = supabase.storage
                .from('inspiration-images')
                .getPublicUrl(fileName);
              refImageUrl = publicUrl;
            }
          } catch (err) {
            console.error('Error uploading inspiration image:', err);
          }
        }
        itemsWithUrls.push({
          ...item,
          refImageUrl
        });
      }

      // Clean up invalid or string literal push sub IDs
      let subId = localStorage.getItem('minibakes_push_sub_id');
      if (subId === 'undefined' || subId === 'null') {
        subId = null;
        localStorage.removeItem('minibakes_push_sub_id');
      }

      // Build the order payload
      const newOrder = {
        id: newId,
        customer: formData.name,
        phone: `${phoneCode} ${formData.phone}`,
        whatsapp: `${whatsappCode} ${formData.whatsapp}`,
        date: new Date().toISOString().split('T')[0],
        total: `€${totalPrice.toFixed(2)}`,
        status: 'pending',
        client_id: clientId, // Maps to snake_case table column
        subscription_id: subId,
        details: {
          whatsapp: `${whatsappCode} ${formData.whatsapp}`,
          pickupDate: formData.date,
          pickupPeriod: 'Morning',
          pickupNotes: formData.note,
          itemType: cart[0]?.name || 'Sweet Assortment',
          quantity: cart.reduce((acc, item) => acc + item.quantity, 0),
          flavor: cart[0]?.options?.flavor || 'Assorted',
          layers: cart.find(i => i.name?.toLowerCase().includes('3d') || i.is3D)?.layers || [],
          items: itemsWithUrls.map(item => {
            const isFeatured = item.id?.toString().startsWith('featured') || item.id?.toString().includes('-featured');
            const total = getItemTotal(item);
            const displayPrice = (total === 0 && isFeatured && item.price && item.price !== 'WA') 
              ? item.price 
              : `€${total.toFixed(2)}`;
            
            const is3D = item.name?.toLowerCase().includes('3d') || item.is3D;
            const productImageToSave = is3D ? null : item.img;
              
            return {
              itemType: item.name + (item.options?.individualPackaging ? ' (Individually Packaged)' : ''),
              quantity: item.quantity,
              color: item.options?.color || '',
              flavor: (item.options?.flavor || 'Assorted') 
                + (item.options?.spreads && item.options.spreads.length > 0 ? ` + ${item.options.spreads.join(', ')} Spread` : '')
                + (item.options?.message ? ` (Text: "${item.options.message}")` : '')
                + (item.options?.innerMessage ? ` (Inner Note: "${item.options.innerMessage}")` : ''),
              price: displayPrice,
              refImageUrl: item.refImageUrl,
              productImage: productImageToSave,
              is3D: is3D,
              layers: item.layers || []
            };
          })
        }
      };

      const customerSource = localStorage.getItem('customer_source') || 'Direct';
      newOrder.details.source = customerSource;

      // 3. Save order to Supabase
      let { error } = await supabase
        .from('orders')
        .insert([newOrder]);

      // If foreign key constraint fails because the subscription was deleted from DB
      if (error && (error.code === '23503' || error.message?.includes('foreign key constraint'))) {
        console.warn('Stale push subscription ID, retrying without it');
        localStorage.removeItem('minibakes_push_sub_id');
        newOrder.subscription_id = null;
        const retry = await supabase.from('orders').insert([newOrder]);
        error = retry.error;
      }

      if (error) throw error;

      // 4. Upsert client device into analytics table
      const { data: existingClient } = await supabase
        .from('clients')
        .select('order_count, total_spent')
        .eq('client_id', clientId)
        .single();

      if (existingClient) {
        await supabase.from('clients').update({
          last_seen: new Date().toISOString(),
          order_count: (existingClient.order_count || 0) + 1,
          total_spent: parseFloat(existingClient.total_spent || 0) + totalPrice,
          device_info: {
            userAgent: navigator.userAgent,
            language: navigator.language,
            screen: `${screen.width}x${screen.height}`,
            lastCustomer: formData.name
          }
        }).eq('client_id', clientId);
      } else {
        await supabase.from('clients').insert([{
          client_id: clientId,
          order_count: 1,
          total_spent: totalPrice,
          device_info: {
            userAgent: navigator.userAgent,
            language: navigator.language,
            screen: `${screen.width}x${screen.height}`,
            lastCustomer: formData.name
          }
        }]);
      }
      
      // Keep a local copy as backup for the customer browser
      const existingOrders = JSON.parse(localStorage.getItem('minibakes_placed_orders') || '[]');
      existingOrders.unshift(newOrder);
      localStorage.setItem('minibakes_placed_orders', JSON.stringify(existingOrders));

      // 5. Dispatch a global event to let App.jsx clear the cart state
      if (typeof window !== 'undefined' && window.dispatchEvent) {
        const event = new CustomEvent('minibakes_order_completed');
        window.dispatchEvent(event);
      }

      const existingProfile = JSON.parse(localStorage.getItem('minibakes_user_profile') || '{}');
      localStorage.setItem('minibakes_user_profile', JSON.stringify({
        ...existingProfile,
        name: formData.name,
        phone: formData.phone,
        whatsapp: formData.whatsapp
      }));
      localStorage.removeItem('minibakes_order_draft');
      setStep('success');
    } catch (error) {
      console.error('Error saving order:', error);
      alert('There was an issue processing your order. Please try again.');
      setStep('checkout');
    }
  };

  const handleConfirmClick = (e) => {
    const form = document.getElementById('checkout-form');
    if (form && !form.checkValidity()) {
      const firstInvalid = form.querySelector(':invalid');
      if (firstInvalid) {
        e.preventDefault();
        const headerOffset = 120;
        const elementPosition = firstInvalid.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
        
        setTimeout(() => {
          firstInvalid.focus();
          firstInvalid.reportValidity();
        }, 500);
      }
    }
  };

  if (step === 'processing') {
    return (
      <div className="order-page processing-view" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100vw', background: '#fff', position: 'fixed', top: 0, left: 0, zIndex: 99999 }}>
        <div style={{ position: 'relative', width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="loading-spinner-circle" style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', border: '3px solid #fdf2f4', borderTopColor: '#800000', animation: 'spin 1s linear infinite' }}></div>
          <img src={logo} alt="Mini Bakes" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', zIndex: 2 }} />
        </div>
        <h2 style={{ color: '#800000', marginTop: '2rem', fontSize: '1.6rem', fontWeight: '800' }}>Processing Order...</h2>
        <p style={{ color: '#666', marginTop: '0.5rem', fontWeight: '500' }}>Please wait while we confirm your details.</p>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="order-page success-view">
        <div className="success-content">
          <div className="success-icon-anim">
            <CheckCircle2 size={80} color="#800000" strokeWidth={1.5} />
          </div>
          <h1>Order Received!</h1>
          <p className="order-id-tag">Order ID: #{orderId}</p>
          <p className="success-msg">
            Thank you for choosing Mini Bakes, <span className="customer-name">{formData.name}</span>!
          </p>
          <div className="order-summary-box">
            <div className="summary-item">
              <span>Order Total</span>
              <strong>€{finalOrderTotal.toFixed(2)}</strong>
            </div>
            <div className="summary-item">
              <span>Pickup Date</span>
              <strong>{new Date(formData.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
            </div>
          </div>
          <p className="whatsapp-notice">Your request has been recorded. Order status updates will appear in the website.</p>

          {hasCake && (
            <div className="success-care-guide">
              <CakeCareGuide />
            </div>
          )}

          <button className="continue-btn" onClick={onBack}>Back to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`order-page ${step === 'checkout' ? 'checkout-view' : ''}`}>
      {warningNotification && (
        <div className="added-notification" style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', background: '#d32f2f', color: 'white', padding: '0.8rem 1.5rem', borderRadius: '50px', fontWeight: '600', fontPosition: 'relative', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem', zIndex: 9999, boxShadow: '0 10px 30px rgba(211, 47, 47, 0.3)', animation: 'slideDownFade 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
          <AlertCircle size={18} className="notification-icon" style={{ stroke: '#fff' }} />
          <span>{warningNotification}</span>
        </div>
      )}
      <div className="order-header">
        <button className="back-btn" onClick={step === 'checkout' ? () => setStep('cart') : onBack}>
          <ArrowLeft size={24} />
        </button>
        <h1>{step === 'cart' ? 'Your Order' : 'Checkout'}</h1>
        <div className="placeholder-icon">
          <ShoppingBag size={24} />
        </div>
      </div>

      <div className="order-content">
        {step === 'cart' ? (
          cart.length === 0 ? (
            <div className="empty-order">
              <div className="empty-icon-wrapper">
                <ShoppingBag size={64} strokeWidth={1} />
              </div>
              <h2>Your order is empty</h2>
              <p>Looks like you haven't added any desserts yet. Head over to our menu to start your sweet journey!</p>
              <button className="start-shopping-btn" onClick={onBack}>Browse Menu</button>
            </div>
          ) : (
            <div className="order-items-list">
              {cart.map((item, i) => (
                <div key={item.cartId || i} className="order-item-card">
                  {item.img ? (
                    <img src={item.img} alt={item.name} className="order-item-img" />
                  ) : (
                    <div className="order-item-icon-fallback">
                      <Cake size={32} color="var(--secondary)" />
                    </div>
                  )}
                  <div className="order-item-details">
                    <div className="order-item-header">
                      <h3>{item.name}</h3>
                      <button className="remove-item-btn" onClick={() => onRemoveItem(item.cartId)}><X size={16} /></button>
                    </div>
                    {item.id?.startsWith('mc') && (
                        <div className="cart-min-order-note" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#b71c1c', fontSize: '0.75rem', fontWeight: '500', marginTop: '4px', marginBottom: '4px' }}>
                          <AlertCircle size={12} />
                          <span>Minimum order of 4 Mini Cakes required</span>
                        </div>
                      )}
                    <div className="order-item-price-qty">
                      <span className="order-item-price">
                        {(() => {
                          const isFeatured = item.id?.toString().startsWith('featured') || item.id?.toString().includes('-featured');
                          const total = getItemTotal(item);
                          if (total === 0 && (!isFeatured || item.price === 'WA' || !item.price)) {
                            return (
                              <span className="price-wa-tag">Quote required</span>
                            );
                          }
                          return isFeatured && total === 0 ? item.price : `€${total.toFixed(2)}`;
                        })()}
                      </span>
                      <div className="order-qty-selector">
                        <button onClick={() => handleDecrementCart(item)}><Minus size={14} /></button>
                        <span>{item.quantity}</span>
                        <button onClick={() => onUpdateQuantity(item.cartId, item.quantity + 1)}><Plus size={14} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <form 
            className="checkout-form" 
            id="checkout-form" 
            onSubmit={handleCheckoutSubmit}
          >
            <div className="form-section">
              <h3>Personal Details</h3>
              <div className="form-group-icon">
                <User size={18} />
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="form-row-checkout">
                <div className="form-group-icon">
                  <Phone size={18} />
                  <select 
                    value={phoneCode} 
                    onChange={(e) => setPhoneCode(e.target.value)}
                    className="country-code-select"
                  >
                    <option value="+356">+356 (MT)</option>
                    <option value="+39">+39 (IT)</option>
                    <option value="+44">+44 (GB)</option>
                    <option value="+1">+1 (US/CA)</option>
                    <option value="+33">+33 (FR)</option>
                    <option value="+49">+49 (DE)</option>
                    <option value="+34">+34 (ES)</option>
                  </select>
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="form-group-icon">
                  <MessageSquare size={18} />
                  <select 
                    value={whatsappCode} 
                    onChange={(e) => setWhatsappCode(e.target.value)}
                    className="country-code-select"
                  >
                    <option value="+356">+356 (MT)</option>
                    <option value="+39">+39 (IT)</option>
                    <option value="+44">+44 (GB)</option>
                    <option value="+1">+1 (US/CA)</option>
                    <option value="+33">+33 (FR)</option>
                    <option value="+49">+49 (DE)</option>
                    <option value="+34">+34 (ES)</option>
                  </select>
                  <input
                    type="tel"
                    placeholder="WhatsApp Number"
                    required
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Pickup Timing</h3>
              <div className="form-group-icon">
                <Calendar size={18} />
                <input
                  type="date"
                  required
                  min={getTodayDate()}
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              {formData.date && formData.date < getTwoDaysDate() ? (
                <div style={{ marginTop: '12px', padding: '12px', background: '#fff3cd', color: '#856404', borderRadius: '8px', fontSize: '0.9rem', display: 'flex', gap: '8px', alignItems: 'flex-start', border: '1px solid #ffeeba' }}>
                  <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px', color: '#856404' }} />
                  <div style={{ lineHeight: '1.4' }}>
                    <strong>Minimum 2 days required.</strong> Please select a date at least 2 days from today.
                  </div>
                </div>
              ) : (
                <p className="form-hint" style={{ marginTop: '8px' }}>Note: Minimum 2 days lead time required for all orders.</p>
              )}
            </div>

            <div className="form-section">
              <h3>Additional Notes</h3>
              <textarea
                placeholder="Any special requests or details about your order?"
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              />
            </div>
          </form>
        )}
      </div>

      <div className="order-footer">
        <div className="total-row">
          <span>{step === 'cart' ? 'Subtotal' : 'Total Amount'}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            €{totalPrice.toFixed(2)}
            {cart.some(item => {
              const isFeatured = item.id?.toString().startsWith('featured') || item.id?.toString().includes('-featured');
              return getItemTotal(item) === 0 && (!isFeatured || item.price === 'WA' || !item.price);
            }) && (
              <span className="price-wa-tag" style={{ fontSize: '0.9rem' }}>+ quote required</span>
            )}
          </span>
        </div>
        {step === 'cart' ? (
          <button
            className="checkout-btn"
            disabled={cart.length === 0}
            onClick={() => setStep('checkout')}
          >
            Proceed to Checkout
          </button>
        ) : (
          <button
            type="submit"
            form="checkout-form"
            className="checkout-btn confirm-btn"
            onClick={handleConfirmClick}
            disabled={formData.date && formData.date < getTwoDaysDate()}
            style={{ 
              opacity: (formData.date && formData.date < getTwoDaysDate()) ? 0.5 : 1, 
              cursor: (formData.date && formData.date < getTwoDaysDate()) ? 'not-allowed' : 'pointer' 
            }}
          >
            Confirm & Order
          </button>
        )}
      </div>
    </div>
  );
}
