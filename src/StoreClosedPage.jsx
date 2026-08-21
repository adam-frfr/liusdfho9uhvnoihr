import React, { useState, useEffect, useMemo } from 'react';
import { CalendarClock } from 'lucide-react';
import { supabase } from './supabase';
import logo from './assets/mini_logo.webp';
import './App.css'; // Reuse App styles
import './MenuPage.css'; // Reuse Menu styles for category chips

export default function StoreClosedPage({ storeAvailability, bg1 }) {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem('hasSeenClosedPopup');
    if (!hasSeenPopup) {
      setShowPopup(true);
      sessionStorage.setItem('hasSeenClosedPopup', 'true');
    }
  }, []);

  const isDailyPause = storeAvailability?.is_taking_orders_today === false;
  
  const message = isDailyPause 
    ? (storeAvailability?.daily_pause_message || "We are not taking any more orders today.")
    : (storeAvailability?.vacation_message || "We are currently closed.");

  const titleText = isDailyPause 
    ? "Paused for Today"
    : `Closed from ${storeAvailability?.vacation_start_date} to ${storeAvailability?.vacation_end_date}`;

  const [liveProducts, setLiveProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Cakes");
  const [activeSubcategory, setActiveSubcategory] = useState(null);

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

  const mergedMenuData = useMemo(() => {
    if (liveProducts.length === 0) return [];

    const categoryNames = [...new Set(liveProducts.map(p => p.category))];
    
    return categoryNames.map(cat => {
      const catProducts = liveProducts.filter(p => p.category === cat);
      const parsedCatProducts = catProducts.map(p => ({
        ...p,
        isFullWidth: p.name.toLowerCase().includes('3d')
      })).filter(p => !p.isFullWidth);
      
      const subcategories = [...new Set(parsedCatProducts.map(p => p.subcategory).filter(Boolean))];

      return {
        category: cat,
        items: parsedCatProducts.filter(p => !p.subcategory),
        sections: subcategories.map(sub => ({
          title: sub,
          items: parsedCatProducts.filter(p => p.subcategory === sub)
        }))
      };
    }).filter(cat => cat.sections.length > 0 || cat.items?.length > 0);
  }, [liveProducts]);

  useEffect(() => {
    if (mergedMenuData.length > 0 && !mergedMenuData.find(c => c.category === activeCategory)) {
      setActiveCategory(mergedMenuData[0].category);
    }
  }, [mergedMenuData, activeCategory]);

  useEffect(() => {
    const data = mergedMenuData.find(c => c.category === activeCategory);
    if (data?.sections?.length > 0) {
      setActiveSubcategory(data.sections[0].title);
    } else {
      setActiveSubcategory(null);
    }
  }, [activeCategory, mergedMenuData]);

  const activeData = mergedMenuData.find(c => c.category === activeCategory) || mergedMenuData[0] || {};

  return (
    <div className="main-layout" style={{ paddingTop: 0 }}>
      {/* Fixed Background Layer */}
      <div className="global-fixed-bg visible">
        <div 
          className="hero-bg-image active" 
          style={{ backgroundImage: `url("${bg1}")` }} 
        />
        <div className="hero-overlay"></div>
      </div>
      {/* Initial Popup */}
      {showPopup && (
        <div onClick={() => setShowPopup(false)} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeInPopup 0.3s ease-out' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '24px', maxWidth: '420px', width: '90%', textAlign: 'center', padding: '0', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', overflow: 'hidden', animation: 'slideUpPopup 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
            <div style={{ background: 'linear-gradient(135deg, #ffcdd2 0%, #ffebee 100%)', padding: '2rem 1rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ background: '#fff', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', boxShadow: '0 4px 10px rgba(211, 47, 47, 0.15)' }}>
                <CalendarClock size={32} color="#d32f2f" />
              </div>
              <h2 style={{ fontSize: '1.5rem', color: '#b71c1c', margin: 0, fontWeight: '700', letterSpacing: '0.5px' }}>{titleText}</h2>
            </div>
            
            <div style={{ padding: '2rem' }}>
              <p style={{ fontSize: '1.05rem', color: '#555', marginBottom: '2rem', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{message}</p>
              <button 
                onClick={() => setShowPopup(false)}
                style={{ background: '#d32f2f', color: '#fff', border: 'none', padding: '14px 32px', borderRadius: '30px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 14px rgba(211, 47, 47, 0.3)', transition: 'all 0.2s', width: '100%' }}
                onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(211, 47, 47, 0.4)'; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(211, 47, 47, 0.3)'; }}
              >
                Got it, thanks!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="main-content">
        
        <style>{`
          @keyframes fadeInPopup {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUpPopup {
            from { opacity: 0; transform: translateY(40px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes slideShine {
            0% { background-position: 200% center; }
            100% { background-position: -200% center; }
          }
          .shimmer-banner {
            background: linear-gradient(90deg, #ffcdd2 25%, #ffffff 50%, #ffcdd2 75%);
            background-size: 200% auto;
            color: #b71c1c;
            padding: 1rem;
            text-align: center;
            font-weight: bold;
            font-size: 1.1rem;
            font-size: 1.1rem;
            z-index: 100;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            animation: slideShine 3s linear infinite;
            border-bottom: 2px solid #ef9a9a;
            box-shadow: 0 4px 15px rgba(183, 28, 28, 0.15);
          }
        `}</style>
        {/* Hero Section */}
        <section className="hero-section">
          {/* Closed Banner */}
          <div className="shimmer-banner">
            {titleText}: {message}
          </div>
          {/* Center Content */}
          <div style={{ zIndex: 10, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <img 
              src={logo} 
              alt="Mini Bakes Logo" 
              style={{ 
                width: '350px', 
                maxWidth: '70vw', 
                opacity: 0.9, 
                filter: 'drop-shadow(0 4px 15px rgba(0,0,0,0.15))',
                transform: 'translateY(-1rem)',
                marginBottom: '0.5rem'
              }} 
            />
            <h1 style={{ fontSize: '1.2rem', color: '#fff', textAlign: 'center', fontWeight: '400', letterSpacing: '0.5px', opacity: 0.9 }}>
              <span>Freshly baked for every</span><br />
              <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '1.4rem' }}>celebration</span>
            </h1>
          </div>
        </section>

        {/* Categories / Menu Container */}
        <div style={{ background: '#fff', width: '100%' }}>
          <section className="menu-page" style={{ padding: '4rem 2rem', minHeight: '600px' }}>
            <h2 className="section-title">OUR CREATIONS</h2>
            
            <div className="menu-categories" style={{ marginTop: '2rem' }}>
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

            <div className="menu-grid" style={{ marginTop: '2rem' }}>
              {activeData.sections?.length > 0 ? (
                <>
                  {activeData.sections
                    .filter(section => section.title === activeSubcategory)
                    .map(section => (
                      <React.Fragment key={section.title}>
                        {section.items.map(item => (
                          <div key={item.id} className="menu-card" style={{ opacity: 0.9, position: 'relative' }}>
                            <div className="menu-card-image" style={{ aspectRatio: '1/1', overflow: 'hidden' }}>
                              <img src={item.img} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div className="menu-card-content" style={{ padding: '1rem', textAlign: 'left' }}>
                              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{item.name}</h3>
                              <p className="menu-card-desc" style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>{item.description}</p>
                              <div className="menu-card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span className="menu-card-price" style={{ fontWeight: 'bold' }}>{item.price}</span>
                                <span style={{ fontSize: '0.8rem', color: '#d32f2f', fontWeight: 'bold', background: '#ffebee', padding: '4px 8px', borderRadius: '4px' }}>Closed</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </React.Fragment>
                    ))
                  }
                  {activeData.items?.map(item => (
                    <div key={item.id} className="menu-card" style={{ opacity: 0.9, position: 'relative' }}>
                      <div className="menu-card-image" style={{ aspectRatio: '1/1', overflow: 'hidden' }}>
                        <img src={item.img} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div className="menu-card-content" style={{ padding: '1rem', textAlign: 'left' }}>
                        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{item.name}</h3>
                        <p className="menu-card-desc" style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>{item.description}</p>
                        <div className="menu-card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span className="menu-card-price" style={{ fontWeight: 'bold' }}>{item.price}</span>
                          <span style={{ fontSize: '0.8rem', color: '#d32f2f', fontWeight: 'bold', background: '#ffebee', padding: '4px 8px', borderRadius: '4px' }}>Closed</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                activeData.items?.map(item => (
                  <div key={item.id} className="menu-card" style={{ opacity: 0.9, position: 'relative' }}>
                    <div className="menu-card-image" style={{ aspectRatio: '1/1', overflow: 'hidden' }}>
                      <img src={item.img} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div className="menu-card-content" style={{ padding: '1rem', textAlign: 'left' }}>
                      <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{item.name}</h3>
                      <p className="menu-card-desc" style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>{item.description}</p>
                      <div className="menu-card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="menu-card-price" style={{ fontWeight: 'bold' }}>{item.price}</span>
                        <span style={{ fontSize: '0.8rem', color: '#d32f2f', fontWeight: 'bold', background: '#ffebee', padding: '4px 8px', borderRadius: '4px' }}>Closed</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

      </main>
    </div>
  );
}
