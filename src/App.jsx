import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { Search, Menu, X, ShoppingBag, Cake, CakeSlice } from 'lucide-react';

import './App.css';

import SafeImage from './components/SafeImage';
import { supabase } from './supabase';
import { subscribeToPush, updateCartReminder, trackVisit } from './pushService';
import logo from './assets/mini_logo.webp';
import bg1 from './assets/headerbg3.webp';
const brownieImg = "https://pratxgdpyhqvjmszemly.supabase.co/storage/v1/object/public/product-images/brownies/brownie.webp";
const cupcakeImg = "https://pratxgdpyhqvjmszemly.supabase.co/storage/v1/object/public/product-images/cupcake4.webp";
const cupcake1 = "https://pratxgdpyhqvjmszemly.supabase.co/storage/v1/object/public/product-images/cupcakes/butter1.webp";
const cupcake2 = "https://pratxgdpyhqvjmszemly.supabase.co/storage/v1/object/public/product-images/cupcakes/butter2.webp";
const cakeImg = "https://pratxgdpyhqvjmszemly.supabase.co/storage/v1/object/public/product-images/roundcake1.webp";
import style1 from './assets/style1.webp';
import style2 from './assets/style2.webp';
import style3 from './assets/stlye3.webp';
import style4 from './assets/style4.webp';
import style5 from './assets/style5.webp';
import style6 from './assets/style6.webp';
import style7 from './assets/style7.webp';
import style8 from './assets/style8.webp';
const orbitCupcake = "https://pratxgdpyhqvjmszemly.supabase.co/storage/v1/object/public/product-images/cupcakes/butter1.webp";
const orbitRoundCake = "https://pratxgdpyhqvjmszemly.supabase.co/storage/v1/object/public/product-images/cakes/round/round-(1).webp";
const orbitPop = "https://pratxgdpyhqvjmszemly.supabase.co/storage/v1/object/public/product-images/cake-pops/pops-(1).webp";
const orbitBrownie = "https://pratxgdpyhqvjmszemly.supabase.co/storage/v1/object/public/product-images/brownies/brownie.webp";
const orbitSicle = "https://pratxgdpyhqvjmszemly.supabase.co/storage/v1/object/public/product-images/cake-sicles/cakesicles-(1).webp";
const orbitBreakableHeart = "https://pratxgdpyhqvjmszemly.supabase.co/storage/v1/object/public/product-images/1.webp";
const orbitHeartCake = "https://pratxgdpyhqvjmszemly.supabase.co/storage/v1/object/public/product-images/cakes/heart/heart-(1).webp";
const orbitBento = "https://pratxgdpyhqvjmszemly.supabase.co/storage/v1/object/public/product-images/minicakes/1.webp";

import MenuPage from './MenuPage';
import OrderPage from './OrderPage';
import ProductDetailsPage from './ProductDetailsPage';
import StudioPage from './StudioPage';
import CakeCarePage from './CakeCarePage';
import StoreClosedPage from './StoreClosedPage';

const patternCoords = [
  // Row 1 (Top)
  { img: style1, top: '5%', left: '5%', rot: 15 },
  { img: style2, top: '8%', left: '20%', rot: -15, hideOnMobile: true },
  { img: style3, top: '4%', left: '35%', rot: 25 },
  { img: style4, top: '10%', left: '50%', rot: -5, hideOnMobile: true },
  { img: style5, top: '6%', left: '65%', rot: 45 },
  { img: style6, top: '12%', left: '80%', rot: -25, hideOnMobile: true },
  { img: style7, top: '5%', left: '95%', rot: 10 },

  // Row 2
  { img: style8, top: '25%', left: '10%', rot: -30, hideOnMobile: true },
  { img: style1, top: '20%', left: '28%', rot: 20 },
  { img: style2, top: '28%', left: '45%', rot: -10, hideOnMobile: true },
  { img: style3, top: '22%', left: '60%', rot: 35 },
  { img: style4, top: '30%', left: '78%', rot: -20, hideOnMobile: true },
  { img: style5, top: '25%', left: '92%', rot: 15 },

  // Row 3 (Middle-ish)
  { img: style6, top: '45%', left: '5%', rot: 5 },
  { img: style7, top: '50%', left: '22%', rot: -15, hideOnMobile: true },
  { img: style8, top: '42%', left: '38%', rot: 25 },
  { img: style1, top: '48%', left: '55%', rot: -5, hideOnMobile: true },
  { img: style2, top: '45%', left: '72%', rot: -25 },
  { img: style3, top: '52%', left: '88%', rot: 10, hideOnMobile: true },

  // Row 4
  { img: style4, top: '70%', left: '12%', rot: -30, hideOnMobile: true },
  { img: style5, top: '65%', left: '30%', rot: 20 },
  { img: style6, top: '75%', left: '48%', rot: -10, hideOnMobile: true },
  { img: style7, top: '68%', left: '65%', rot: 35 },
  { img: style8, top: '72%', left: '82%', rot: -20, hideOnMobile: true },
  { img: style1, top: '65%', left: '95%', rot: 15 },

  // Row 5 (Bottom)
  { img: style2, top: '90%', left: '8%', rot: 45 },
  { img: style3, top: '85%', left: '25%', rot: -10, hideOnMobile: true },
  { img: style4, top: '95%', left: '40%', rot: 25 },
  { img: style5, top: '88%', left: '58%', rot: -25, hideOnMobile: true },
  { img: style6, top: '92%', left: '75%', rot: 5 },
  { img: style7, top: '85%', left: '90%', rot: -15, hideOnMobile: true },
];

const FeaturedCard = ({ item, onClick, className = "" }) => {
  return (
    <div className={`featured-card ${className}`}>
      <div className="card-image-wrapper" style={{ position: 'relative' }}>
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
        <SafeImage src={item.img} alt={item.name} />
      </div>
      <div className="card-info">
        <h3>{item.name}</h3>
        <button className="view-details-btn" onClick={onClick}>View Details</button>
      </div>
    </div>
  );
};

/* ── Mobile-only Horizontal Scroll Carousel ── */
function FeaturedCarousel({ items, onViewDetails }) {
  const [active, setActive] = useState(0);
  const scrollRef = useRef(null);

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const width = scrollRef.current.offsetWidth;
      const index = Math.round(scrollLeft / width);
      setActive(index);
    }
  };

  return (
    <div className="mobile-featured-container mobile-only">
      <div
        className="mobile-featured-scroll"
        ref={scrollRef}
        onScroll={handleScroll}
      >
        {items.map((item, i) => (
          <FeaturedCard 
            key={i} 
            item={item} 
            className="mobile-scroll-card" 
            onClick={() => onViewDetails(i)} 
          />
        ))}
      </div>
      <div className="carousel-dots">
        {items.map((_, i) => (
          <div
            key={i}
            className={`carousel-dot ${active === i ? 'active' : ''}`}
            onClick={() => {
              if (scrollRef.current) {
                scrollRef.current.scrollTo({
                  left: i * scrollRef.current.offsetWidth,
                  behavior: 'smooth'
                });
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Premium Page Loader Component
const PageLoader = () => (
  <div className="page-transition-loader" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100vw', background: '#f8f9fa', position: 'fixed', top: 0, left: 0, zIndex: 9999 }}>
    <Cake size={48} color="#800000" style={{ animation: 'splashScaleIn 0.5s ease-out, bounce 2s infinite' }} />
    <p style={{ marginTop: '1.5rem', color: '#800000', fontWeight: 'bold', fontSize: '1.2rem', letterSpacing: '1px', animation: 'splashTextFadeIn 1.5s infinite alternate' }}>Loading Menu...</p>
  </div>
);

const BirthdayModal = ({ onClose }) => {
  const [birthday, setBirthday] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    onClose();
    await subscribeToPush(birthday || null);
  };

  const handleSkip = async () => {
    onClose();
    await subscribeToPush(null);
  };

  return (
    <div className="mobile-popup-overlay" style={{ zIndex: 10000 }}>
      <div className="mobile-popup-content" style={{ padding: '2rem', textAlign: 'center' }}>
        <h3 style={{ color: '#800000', marginBottom: '1rem', fontSize: '1.5rem' }}>When's your birthday? 🎂</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input 
            type="date" 
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', width: '100%' }}
          />
          <button type="submit" className="add-to-cart-btn" style={{ width: '100%' }}>Submit</button>
          <button type="button" onClick={handleSkip} style={{ background: 'none', border: 'none', color: '#666', textDecoration: 'underline', marginTop: '0.5rem', cursor: 'pointer' }}>Skip</button>
        </form>
      </div>
    </div>
  );
};

const InstallModal = ({ onClose, deferredPrompt }) => {
  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User ${outcome} the install prompt`);
    }
    sessionStorage.setItem('minibakes_install_prompted', 'true');
    onClose();
  };

  const handleSkip = () => {
    sessionStorage.setItem('minibakes_install_prompted', 'true');
    onClose();
  };

  return (
    <div className="mobile-popup-overlay" style={{ zIndex: 10000 }}>
      <div className="mobile-popup-content" style={{ padding: '2.5rem 2rem 2rem', textAlign: 'center', position: 'relative' }}>
        <button onClick={handleSkip} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}>
          <X size={24} />
        </button>
        <h3 style={{ color: '#800000', marginBottom: '1rem', fontSize: '1.4rem' }}>Get the Mini Bakes App! 🍰</h3>
        <p style={{ color: '#555', marginBottom: '1.5rem', lineHeight: '1.5', fontSize: '0.95rem' }}>
          For the best experience and to get live updates on your order, tap 'Add to Home Screen' to install our app!
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <button onClick={handleInstall} className="add-to-cart-btn" style={{ width: '100%', padding: '14px' }}>Add to Home Screen</button>
          <button onClick={handleSkip} style={{ background: 'none', border: 'none', color: '#888', textDecoration: 'underline', cursor: 'pointer', marginTop: '0.5rem' }}>Maybe Later</button>
        </div>
      </div>
    </div>
  );
};

const IosInstallPrompt = ({ onClose }) => {
  return (
    <div style={{
      position: 'fixed',
      bottom: '30px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '20px',
      boxShadow: '0 15px 35px rgba(0,0,0,0.15)',
      zIndex: 10000,
      width: '90%',
      maxWidth: '400px',
      textAlign: 'center',
      border: '1px solid rgba(0,0,0,0.05)',
      animation: 'slideUp 0.4s ease'
    }}>
      <button onClick={onClose} style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}>
        <X size={20} />
      </button>
      <div style={{ marginBottom: '12px', fontWeight: 'bold', color: '#800000', fontSize: '1.2rem', marginTop: '5px' }}>Install Mini Bakes! 🍰</div>
      <div style={{ fontSize: '0.95rem', color: '#555', lineHeight: '1.5' }}>
        Tap the <strong>Share</strong> button <span style={{display:'inline-block', transform:'translateY(3px)'}}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg></span> below, then select <strong>'Add to Home Screen'</strong> ➕ to get the app.
      </div>
      <div style={{
        position: 'absolute',
        bottom: '-12px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '0',
        height: '0',
        borderLeft: '12px solid transparent',
        borderRight: '12px solid transparent',
        borderTop: '12px solid #fff'
      }}></div>
    </div>
  );
};

const WebNotificationModal = ({ notification, onClose }) => {
  const isReady = notification.type === 'ready';
  
  return (
    <div className="mobile-popup-overlay" style={{ zIndex: 10000 }}>
      <div className="mobile-popup-content" style={{ padding: '2.5rem 2rem 2rem', textAlign: 'center', position: 'relative', maxWidth: '400px' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}>
          <X size={24} />
        </button>
        
        {isReady ? (
          <>
            <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>🎂</div>
            <h3 style={{ color: '#800000', marginBottom: '1rem', fontSize: '1.4rem' }}>Your order is ready!</h3>
            <p style={{ color: '#555', marginBottom: '1.5rem', lineHeight: '1.5', fontSize: '0.95rem' }}>
              Your Mini Bakes order (<strong>#{notification.orderId.substring(0, 8)}</strong>) is ready for pickup! We can't wait for you to taste it 🤍
            </p>
          </>
        ) : (
          <>
            <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>💕</div>
            <h3 style={{ color: '#800000', marginBottom: '1rem', fontSize: '1.4rem' }}>How was your order?</h3>
            <p style={{ color: '#555', marginBottom: '1.5rem', lineHeight: '1.5', fontSize: '0.95rem' }}>
              We hope you loved every bite of your Mini Bakes order (<strong>#{notification.orderId.substring(0, 8)}</strong>)! We're already ready for your next one 🎂
            </p>
          </>
        )}
        
        <button onClick={onClose} className="add-to-cart-btn" style={{ width: '100%', padding: '14px' }}>
          Close
        </button>
      </div>
    </div>
  );
};

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showBirthdayModal, setShowBirthdayModal] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showIosPrompt, setShowIosPrompt] = useState(false);
  const [webNotification, setWebNotification] = useState(null);

  useEffect(() => {
    const checkWebNotifications = async () => {
      const localOrders = JSON.parse(localStorage.getItem('minibakes_placed_orders') || '[]');
      if (!localOrders || localOrders.length === 0) return;
      
      const orderIds = localOrders.map(o => o.id).filter(Boolean);
      if (orderIds.length === 0) return;
      
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('id, ready_notification_sent, followup_sent')
          .in('id', orderIds);
          
        if (error || !data) return;
        
        for (const order of data) {
          if (order.ready_notification_sent && !localStorage.getItem(`minibakes_notified_ready_${order.id}`)) {
            setWebNotification({ type: 'ready', orderId: order.id });
            return;
          }
          if (order.followup_sent && !localStorage.getItem(`minibakes_notified_followup_${order.id}`)) {
            setWebNotification({ type: 'followup', orderId: order.id });
            return;
          }
        }
      } catch (err) {
        console.error('Failed to check notifications:', err);
      }
    };
    
    checkWebNotifications();
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkWebNotifications();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const handleWebNotificationClose = () => {
    if (webNotification) {
      localStorage.setItem(`minibakes_notified_${webNotification.type}_${webNotification.orderId}`, 'true');
      setWebNotification(null);
    }
  };

  useEffect(() => {
    const isIos = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test(userAgent);
    };
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    
    if (isIos() && !isStandalone && !sessionStorage.getItem('minibakes_ios_prompted')) {
      setTimeout(() => {
        setShowIosPrompt(true);
      }, 3500);
    }
  }, []);

  const handleCloseIosPrompt = () => {
    sessionStorage.setItem('minibakes_ios_prompted', 'true');
    setShowIosPrompt(false);
  };
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Since beforeinstallprompt only fires on the normal web (not inside PWA),
      // we can safely show the install prompt to all web users who haven't dismissed it this session.
      if (!sessionStorage.getItem('minibakes_install_prompted')) {
        setTimeout(() => {
          setShowInstallModal(true);
        }, 3500); // 3.5 seconds after load
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  useEffect(() => {
    const initPush = async () => {
      const subId = localStorage.getItem('minibakes_push_sub_id');
      if (!subId) {
        // Only show birthday modal if the user is ALREADY inside the PWA
        const isPWA = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
        if (isPWA) {
          setTimeout(() => setShowBirthdayModal(true), 3500);
        }
      } else {
        await trackVisit();
      }
    };
    initPush();
  }, []);

  const handleBirthdayClose = () => {
    setShowBirthdayModal(false);
    // Sequence: Show install prompt right after birthday if available
    if (deferredPrompt && !sessionStorage.getItem('minibakes_install_prompted')) {
      setTimeout(() => setShowInstallModal(true), 500);
    }
  };

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const { data, error } = await supabase.from('store_availability').select('*').limit(1).single();
        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching availability:', error);
          return;
        }
        if (data) {
          setStoreAvailability(data);
        }
      } catch (e) {
        console.error('Failed to fetch availability:', e);
      }
    };
    
    fetchAvailability();
  }, []);

  const [storeAvailability, setStoreAvailability] = useState(null);
  const [isStoreClosed, setIsStoreClosed] = useState(false);

  useEffect(() => {
    if (!storeAvailability) return;
    let closed = false;
    if (storeAvailability.is_taking_orders_today === false) {
      closed = true;
    } else if (storeAvailability.vacation_start_date && storeAvailability.vacation_end_date) {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const start = new Date(storeAvailability.vacation_start_date);
      const end = new Date(storeAvailability.vacation_end_date);
      if (now >= start && now <= end) {
        closed = true;
      }
    }
    setIsStoreClosed(closed);
  }, [storeAvailability]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const source = params.get('source') || params.get('utm_source') || params.get('ref');
    if (source) {
      localStorage.setItem('customer_source', source.toLowerCase());
    }

    const readyOrderId = params.get('ready');
    if (readyOrderId) {
      setWebNotification({ type: 'ready', orderId: readyOrderId });
      // Remove query param from URL without reloading
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  useEffect(() => {
    const fetchSearch = async () => {
      if (!searchQuery.trim() || !supabase) {
        setSearchResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .ilike('name', `%${searchQuery}%`)
          .not('name', 'ilike', '%3d custom cake%')
          .limit(10);
        
        if (error) throw error;
        setSearchResults(data || []);
      } catch (err) {
        console.error("Search error", err);
      } finally {
        setIsSearching(false);
      }
    };
    
    const timeoutId = setTimeout(fetchSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const [customizingProduct, setCustomizingProduct] = useState(null);
  const [showSplash, setShowSplash] = useState(true);
  const [isSplashFading, setIsSplashFading] = useState(false);

  useEffect(() => {
    // Start fading out after 2.6 seconds (leaving 0.4s for the fade transition)
    const fadeTimer = setTimeout(() => {
      setIsSplashFading(true);
    }, 2600);

    // Completely remove from DOM after 3.0 seconds
    const removeTimer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  // Preload critical Home Page assets with prioritization
  useEffect(() => {
    const priorityImages = [bg1, logo];
    const secondaryImages = [
      ...featuredItems.map(item => item.img)
    ];

    // Function to load a set of images
    const loadImages = (list) => {
      return Promise.all(list.map(src => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = resolve; // Continue even if one fails
        });
      }));
    };

    // Staggered loading: Priority first, then secondary
    loadImages(priorityImages).then(() => {
      loadImages(secondaryImages);
    });
  }, []);

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('minibakes_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('minibakes_cart', JSON.stringify(cart));
  }, [cart]);

  // Sync cart across multiple browser tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'minibakes_cart') {
        try {
          const newCart = e.newValue ? JSON.parse(e.newValue) : [];
          setCart(newCart);
        } catch (err) {
          console.error('Error parsing cart from storage:', err);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    const handleOrderCompleted = () => {
      setCart([]);
    };
    window.addEventListener('minibakes_order_completed', handleOrderCompleted);
    return () => window.removeEventListener('minibakes_order_completed', handleOrderCompleted);
  }, []);

  // "Come Back" Cart Reminder Sync
  useEffect(() => {
    // Sync cart state to Supabase for Edge Functions
    updateCartReminder(cart.length);
  }, [cart]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [expandedDesktopCard, setExpandedDesktopCard] = useState(null);
  const [expandedMobileCard, setExpandedMobileCard] = useState(null);

  const [currentView, setCurrentView] = useState('home');
  const [previousView, setPreviousView] = useState('home');
  const [menuActiveCategory, setMenuActiveCategory] = useState('Cakes');
  const [menuActiveSubcategory, setMenuActiveSubcategory] = useState(null);
  const [isOverDark, setIsOverDark] = useState(false);
  const [showCartNudge, setShowCartNudge] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('minibakes_cart');
      const cartData = saved ? JSON.parse(saved) : [];
      if (cartData.length > 0 && !sessionStorage.getItem('minibakes_cart_nudge_shown')) {
        setTimeout(() => {
          setShowCartNudge(true);
        }, 1500);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Scroll observer for floating cart color change
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsOverDark(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: '-130px 0px 0px 0px' // Offset to match the cart button's top position
      }
    );

    const darkSections = document.querySelectorAll('.footer, .booking-form-wrapper, .studio-schedule');
    darkSections.forEach(section => observer.observe(section));

    return () => darkSections.forEach(section => observer.unobserve(section));
  }, [currentView]); // Re-run when view changes to find new elements

  const navigateTo = (view) => {
    if (view === 'menu' && currentView !== 'menu') {
      setIsPageLoading(true);
      setTimeout(() => {
        setIsPageLoading(false);
      }, 2000);
    }
    
    if (currentView !== 'product-details') {
      setPreviousView(currentView);
    }
    setCurrentView(view);
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  // Scroll to top when switching views
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  const addToCart = (item) => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    setCart(prev => [...prev, { ...item, cartId: Date.now() }]);
  };

  const removeFromCart = (cartId) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  const updateQuantity = (cartId, newQty) => {
    setCart(prev => prev.map(item => {
      if (item.cartId === cartId) {
        const isMiniCake = item.id?.startsWith('mc');
        const minQty = isMiniCake ? 4 : 1;
        if (newQty < minQty) return item;
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const calculateTotal = () => {
    return cart.reduce((acc, item) => {
      const isFeatured = item.id?.toString().startsWith('featured') || item.id?.toString().includes('-featured');
      let priceNum = 0;
      if (isFeatured) {
        const priceMatches = (item.price || '').match(/\d+(\.\d+)?/g);
        priceNum = priceMatches ? parseFloat(priceMatches[priceMatches.length - 1]) : 0;
      } else {
        priceNum = parseFloat((item.price || '0').replace(/[^\d.]/g, '')) || 0;
      }
      return acc + (priceNum * item.quantity);
    }, 0);
  };

  const [featuredItems, setFeaturedItems] = useState([
    { id: 't-featured', img: brownieImg, name: 'Brownie Selection', price: '', description: 'Our most popular brownie assortment, baked fresh daily with premium chocolate.' },
    { id: 'cu-featured', img: cupcakeImg, name: 'Signature Cupcakes', price: '', description: 'A curated selection of our most loved cupcake flavors, perfect for any occasion.' },
    { id: 'c-featured', img: cakeImg, name: 'Best Seller cake', price: '', description: 'Our signature masterpiece cake, loved by everyone for its perfect balance of flavor.' },
  ]);

  useEffect(() => {
    const fetchFeatured = async () => {
      const isSupabaseLive = !!supabase;
      if (!isSupabaseLive) return;
      
      try {
        const { data, error } = await supabase
          .from('featured_items')
          .select('*')
          .order('slot');
        
        if (error) {
           if (error.message?.includes('fetch')) {
             console.log('Supabase connection skipped (Demo Mode)');
             return;
           }
           throw error;
        }
        if (data && data.length > 0) {
          // Merge with static images and filter empty
          const activeFeatured = data
            .filter(item => !item.isEmpty)
            .map((item, idx) => ({
              ...item,
              id: item.id || `featured-${item.slot}`,
              price: item.price ? item.price.replace(/Starting\s*From\s*/gi, '').replace(/Starting\s*/gi, '') : '',
              img: item.img || null
            }));
          
          if (activeFeatured.length > 0) {
            setFeaturedItems(activeFeatured);
          }
        }
      } catch (err) {
        if (!err.message?.includes('fetch')) {
          console.error('Error fetching featured items:', err);
        }
      }
    };

    fetchFeatured();
  }, []);

  const featuredRef = useRef(null);
  const [featuredInView, setFeaturedInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setFeaturedInView(true);
        }
      },
      { threshold: 0.05, rootMargin: '50px' } // Added rootMargin for earlier trigger
    );

    if (featuredRef.current) {
      observer.observe(featuredRef.current);
      // Immediate check in case it's already in view
      const rect = featuredRef.current.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        setFeaturedInView(true);
      }
    }

    return () => {
      if (featuredRef.current) {
        observer.unobserve(featuredRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const staticCategories = [
    { name: 'Custom Cakes', img: cakeImg },
    { name: 'Cupcakes', img: cupcakeImg },
    { name: 'Brownies & Blondies', img: brownieImg },
    { name: 'Cake Pops', img: orbitPop },
    { name: 'Breakable Hearts', img: orbitBreakableHeart }
  ];

  if (isStoreClosed) {
    return (
      <StoreClosedPage 
        storeAvailability={storeAvailability} 
        categories={staticCategories} 
        bg1={bg1}
      />
    );
  }

  return (
    <div className="main-layout">
      {showBirthdayModal && <BirthdayModal onClose={handleBirthdayClose} />}
      {showInstallModal && <InstallModal onClose={() => setShowInstallModal(false)} deferredPrompt={deferredPrompt} />}
      {showIosPrompt && <IosInstallPrompt onClose={handleCloseIosPrompt} />}
      {webNotification && <WebNotificationModal notification={webNotification} onClose={handleWebNotificationClose} />}
      {showCartNudge && currentView !== 'order' && (
        <div 
          className="cart-nudge"
          onClick={() => {
            setShowCartNudge(false);
            sessionStorage.setItem('minibakes_cart_nudge_shown', 'true');
            setCurrentView('order');
          }}
        >
          <div className="cart-nudge-content">
            <span>You left some delicious treats in your cart! 🧁 Click here to finish your order.</span>
            <button 
              className="cart-nudge-close"
              onClick={(e) => {
                e.stopPropagation();
                setShowCartNudge(false);
                sessionStorage.setItem('minibakes_cart_nudge_shown', 'true');
              }}
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}
      {isPageLoading && <PageLoader />}
      {/* Premium Elegant Splash Screen */}
      {showSplash && (
        <div className={`splash-screen-overlay ${isSplashFading ? 'fade-out' : ''}`}>
          <div className="splash-content">
            <img src={logo} alt="Mini Bakes Logo" className="splash-logo" />
            <div className="splash-loader-bar">
              <div className="splash-loader-progress"></div>
            </div>
            <p className="splash-tagline">Crafting Sweetness for Every Celebration</p>
          </div>
        </div>
      )}

      {/* Fixed Background Layer */}
      <div className={`global-fixed-bg ${currentView === 'home' ? 'visible' : ''}`}>
        <div 
          className="hero-bg-image active" 
          style={{ backgroundImage: `url("${bg1}")` }} 
        />
        <div className="hero-overlay"></div>
      </div>

      {currentView !== 'product-details' && (
        <header className={`header ${isScrolled || currentView !== 'home' ? 'scrolled' : ''} ${isSearchOpen ? 'search-open' : ''}`}>
          <div className="logo-container" onClick={() => navigateTo('home')} style={{ cursor: 'pointer' }}>
            <img src={logo} alt="Mini Bakes Logo" />
          </div>

          <div className="header-right">
            <div className={`search-wrapper ${isSearchOpen ? 'open' : ''}`}>
              <input
                type="text"
                className="search-input"
                placeholder="Search desserts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchOpen(true)}
              />
              {isSearchOpen ? (
                <X size={28} strokeWidth={1.5} className="search-icon" onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }} />
              ) : (
                <Search size={28} strokeWidth={1.5} className="search-icon" onClick={() => setIsSearchOpen(true)} />
              )}

              {/* Dropdown Search Results */}
              {isSearchOpen && searchQuery.trim() !== '' && (
                <div className="search-results-dropdown">
                  {(() => {
                    if (isSearching) {
                      return <div className="search-no-results">Searching...</div>;
                    }

                    if (searchResults.length === 0) {
                      return (
                        <div className="search-no-results">
                          No desserts found for "{searchQuery}"
                        </div>
                      );
                    }

                    return searchResults.map(item => (
                      <div
                        key={item.id}
                        className="search-result-item"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsSearchOpen(false);
                          setSearchQuery('');
                          setPreviousView(currentView);
                          setCustomizingProduct(item);
                          setCurrentView('product-details');
                        }}
                      >
                        <img src={item.img} alt={item.name} className="search-result-img" />
                        <div className="search-result-info">
                          <h4>{item.name}</h4>
                          <p>{item.price}</p>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              )}
            </div>
            <nav className="nav-links">
              <a href="#home" className="nav-link" onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>Home</a>
              <span className="nav-divider">|</span>
              <a href="#menu" className="nav-link" onClick={(e) => { e.preventDefault(); navigateTo('menu'); }}>Menu</a>
              <span className="nav-divider">|</span>
              <a href="#classes" className="nav-link" onClick={(e) => { e.preventDefault(); navigateTo('classes'); }}>Classes</a>
              <span className="nav-divider">|</span>
              <a href="#order" className="nav-link" onClick={(e) => {
                e.preventDefault();
                if (window.innerWidth > 768) setIsCartOpen(true);
                else navigateTo('order');
              }}>
                Order
              </a>
            </nav>

            <div className="menu-icon" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={28} strokeWidth={1.5} />
            </div>
          </div>
        </header>
      )}


      {/* Floating Cart Button (Visible when cart has items and NOT on order page) */}
      {cart.length > 0 && currentView !== 'order' && !isCartOpen && (
        <div
          className={`floating-cart-btn ${isOverDark ? 'white' : ''}`}
          onClick={() => {
            if (window.innerWidth > 768) setIsCartOpen(true);
            else setCurrentView('order');
          }}
        >
          <ShoppingBag size={28} />
          <span className="floating-cart-count">{cart.length}</span>
        </div>
      )}

      {/* Unique Full-screen Mobile Menu */}
      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`}>
        <button className="menu-close-btn" onClick={() => setIsMobileMenuOpen(false)}>
          <X size={36} strokeWidth={1.5} />
        </button>

        <div className="menu-content">
          <nav className="mobile-nav">
            <div className="nav-item-wrapper">
              <a href="#home" className="mobile-nav-link" onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>Home</a>
            </div>
            <div className="nav-item-wrapper">
              <a href="#menu" className="mobile-nav-link" onClick={(e) => { e.preventDefault(); navigateTo('menu'); }}>Menu</a>
            </div>
            <div className="nav-item-wrapper">
              <a href="#classes" className="mobile-nav-link" onClick={(e) => { e.preventDefault(); navigateTo('classes'); }}>Classes</a>
            </div>
            <div className="nav-item-wrapper">
              <a href="#care" className="mobile-nav-link" onClick={(e) => { e.preventDefault(); navigateTo('care'); }}>Cake Care</a>
            </div>
            <div className="nav-item-wrapper">
              <a href="#order" className="mobile-nav-link" onClick={() => { navigateTo('order'); }}>
                Order
              </a>
            </div>
          </nav>

          <div className="menu-footer">
            <p>Handcrafted with love by Mini Bakes</p>
          </div>
        </div>
      </div>

      {currentView === 'product-details' ? (
        <ProductDetailsPage
          product={customizingProduct}
          onBack={() => setCurrentView(previousView)}
          cartCount={cart.length}
          onViewProduct={(item) => setCustomizingProduct(item)}
          onOpenCart={() => {
            if (window.innerWidth > 768) {
              setIsCartOpen(true);
            } else {
              setCurrentView('order');
            }
          }}
          onConfirm={(orderData) => {
            addToCart(orderData);
            if (window.innerWidth > 768) {
              setIsCartOpen(true);
            }
          }}
        />
      ) : (
        <div key={currentView} className="page-transition-wrapper">
        {currentView === 'home' && (
        <>
          {/* Hero Section */}
          <section className="hero-section">
            <div className="hero-top-left-content">
              <h1 className="hero-celebration-text">
                <span className="hero-sans">Freshly baked for every</span><br />
                <span className="hero-serif-accent">celebration</span>
              </h1>

              <div className="hero-cta-buttons">
                <button className="hero-cta-btn primary" onClick={() => navigateTo('menu')}>
                  Browse Menu
                </button>
                <button className="hero-cta-btn secondary" onClick={() => navigateTo('classes')}>
                  Book a Class
                </button>
              </div>
            </div>

            {/* Scroll Indicator */}
            <div className="hero-scroll-indicator" onClick={() => featuredRef.current?.scrollIntoView({ behavior: 'smooth' })}>
              <span className="scroll-mouse">
                <span className="scroll-wheel"></span>
              </span>
              <span className="scroll-text">Explore Desserts</span>
            </div>
          </section>

          {/* Featured Dessert Section */}
          <section
            className={`featured-section ${featuredInView ? 'reveal' : ''}`}
            ref={featuredRef}
          >
            <h2 className="section-title">FEATURED DESSERT</h2>

            {/* Desktop Grid / Expanded Card */}
            <div className="desktop-only">
              {expandedDesktopCard !== null ? (
                <div className="expanded-card">
                  <button className="close-expanded-btn" onClick={() => setExpandedDesktopCard(null)}>
                    <X size={30} strokeWidth={1.5} />
                  </button>
                  <div className="expanded-card-content">
                    <div className="expanded-image-wrapper">
                      <SafeImage src={featuredItems[expandedDesktopCard].img} alt={featuredItems[expandedDesktopCard].name} />
                    </div>
                    <div className="expanded-info">
                      <h3>{featuredItems[expandedDesktopCard].name}</h3>
                      <p className="expanded-price">{featuredItems[expandedDesktopCard].price}</p>
                      <p className="expanded-description">
                        {featuredItems[expandedDesktopCard].description || "Delicious and freshly baked just for you. Customize your order with our various options, premium ingredients, and boundless love."}
                      </p>
                      
                      {featuredItems[expandedDesktopCard].highlights && featuredItems[expandedDesktopCard].highlights.length > 0 && (
                        <div className="featured-highlights-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
                          {featuredItems[expandedDesktopCard].highlights.map((h, i) => (
                            <div key={i} className="featured-highlight-item" style={{ background: '#f8f9fa', padding: '10px', borderRadius: '8px', border: '1px solid #eee' }}>
                              <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#800000', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{h.title}</div>
                              <div style={{ fontSize: '12px', color: '#444', lineHeight: '1.4' }}>{h.text}</div>
                            </div>
                          ))}
                        </div>
                      )}
                      <button className="add-to-cart-btn" onClick={() => {
                        setPreviousView(currentView);
                        setCustomizingProduct(featuredItems[expandedDesktopCard]);
                        setExpandedDesktopCard(null);
                        setCurrentView('product-details');
                      }}>Add to Order</button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="featured-grid">
                  {featuredItems.map((item, idx) => (
                    <FeaturedCard 
                      key={idx} 
                      item={item} 
                      onClick={() => {
                        const name = item.name.toLowerCase();
                        if (name.includes('brownie') || name.includes('blondie') || name.includes('treat')) {
                          setMenuActiveCategory('Treats');
                        } else if (name.includes('cupcake')) {
                          setMenuActiveCategory('Cupcakes');
                        } else {
                          setMenuActiveCategory('Cakes');
                        }
                        setCurrentView('menu');
                        window.scrollTo(0, 0);
                      }} 
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Carousel */}
            <FeaturedCarousel
              items={featuredItems}
              onViewDetails={(idx) => {
                 const item = featuredItems[idx];
                 const name = item.name.toLowerCase();
                 if (name.includes('brownie') || name.includes('blondie') || name.includes('treat')) {
                    setMenuActiveCategory('Treats');
                 } else if (name.includes('cupcake')) {
                    setMenuActiveCategory('Cupcakes');
                 } else {
                    setMenuActiveCategory('Cakes');
                 }
                 setCurrentView('menu');
                 window.scrollTo(0, 0);
              }}
            />
          </section>

          {/* Explore Menu Section */}
          <section className="explore-section">
            <div className="explore-pattern">
              {patternCoords.map((item, idx) => (
                <img
                  key={idx}
                  src={item.img}
                  className={`pattern-icon ${item.hideOnMobile ? 'hide-on-mobile' : ''}`}
                  style={{ top: item.top, left: item.left, transform: `rotate(${item.rot}deg)` }}
                  alt=""
                />
              ))}
            </div>
            <div className="explore-content">
              <h2 className="explore-title">EXPLORE OUR MENU</h2>
              <button className="explore-btn" onClick={() => setCurrentView('menu')}>View Full Menu</button>
            </div>
          </section>

          {/* Mobile Popup Modal */}
          {expandedMobileCard !== null && (
            <div className="mobile-popup-overlay">
              <div className="mobile-popup-content">
                <button className="close-popup-btn" onClick={() => setExpandedMobileCard(null)}>
                  <X size={28} strokeWidth={1.5} />
                </button>
                <div className="popup-image-wrapper">
                  <SafeImage src={featuredItems[expandedMobileCard].img} alt={featuredItems[expandedMobileCard].name} />
                </div>
                <div className="popup-info">
                  <h3>{featuredItems[expandedMobileCard].name}</h3>
                  <p className="popup-price">{featuredItems[expandedMobileCard].price}</p>
                  <p className="popup-description">
                    {featuredItems[expandedMobileCard].description || "Delicious and freshly baked just for you. Customize your order with our various options, premium ingredients, and boundless love."}
                  </p>

                  {featuredItems[expandedMobileCard].highlights && featuredItems[expandedMobileCard].highlights.length > 0 && (
                    <div className="featured-highlights-mobile" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                      {featuredItems[expandedMobileCard].highlights.map((h, i) => (
                        <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', background: '#fcfcfc', padding: '10px', borderRadius: '8px', border: '1px solid #eee' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#800000', textTransform: 'uppercase', marginBottom: '2px' }}>{h.title}</div>
                            <div style={{ fontSize: '12px', color: '#555', lineHeight: '1.4' }}>{h.text}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <button className="add-to-cart-btn" onClick={() => {
                    setPreviousView(currentView);
                    setCustomizingProduct(featuredItems[expandedMobileCard]);
                    setExpandedMobileCard(null);
                    setCurrentView('product-details');
                  }}>Add to Order</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {currentView === 'menu' && <MenuPage 
        activeCategory={menuActiveCategory}
        setActiveCategory={setMenuActiveCategory}
        activeSubcategory={menuActiveSubcategory}
        setActiveSubcategory={setMenuActiveSubcategory}
        onSelectProduct={(item) => {
          setPreviousView(currentView);
          setCustomizingProduct(item);
          setCurrentView('product-details');
        }} 
      />}
      {currentView === 'classes' && <StudioPage />}
      {currentView === 'order' && <OrderPage
        cart={cart}
        onBack={() => setCurrentView('home')}
        onRemoveItem={removeFromCart}
        onUpdateQuantity={updateQuantity}
      />}
          {currentView === 'care' && (
            <CakeCarePage onBack={() => setCurrentView('home')} />
          )}
        </div>
      )}

      {/* Desktop Cart Drawer */}
      <div className={`cart-drawer-overlay ${isCartOpen ? 'open' : ''}`} onClick={() => setIsCartOpen(false)}>
        <div className="cart-drawer" onClick={e => e.stopPropagation()}>
          <div className="cart-drawer-header">
            <h3>Your Order</h3>
            <button className="close-cart-btn" onClick={() => setIsCartOpen(false)}>
              <X size={28} />
            </button>
          </div>

          <div className="cart-drawer-content">
            {cart.length === 0 ? (
              <div className="empty-cart-state">
                <ShoppingBag size={48} opacity={0.2} />
                <p>Your order is empty</p>
                <button className="start-order-btn" onClick={() => { setIsCartOpen(false); setCurrentView('menu'); }}>Start Ordering</button>
              </div>
            ) : (
              <div className="cart-items-list">
                {cart.map((item, i) => (
                  <div key={item.cartId || i} className="cart-item-row">
                    {item.img ? (
                      <img src={item.img} alt={item.name} />
                    ) : (
                      <div className="cart-item-icon-fallback">
                        <Cake size={24} color="var(--secondary)" />
                      </div>
                    )}
                    <div className="cart-item-info">
                      <div className="cart-item-header">
                        <h4>{item.name}</h4>
                        <button className="remove-item-btn" onClick={() => removeFromCart(item.cartId)}><X size={14} /></button>
                      </div>
                      <p className="cart-item-meta">
                        {item.options.flavor && <span>{item.options.flavor}</span>}
                        {item.options.spread && <span> • {item.options.spread}</span>}
                      </p>
                      <div className="cart-item-price-qty">
                        <span>
                          {item.price === 'WA' ? 'Quote required' : item.price}
                        </span>
                        <span className="cart-qty">x{item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="cart-drawer-footer">
            <div className="cart-total-row">
              <span>Total</span>
              <span>€{calculateTotal().toFixed(2)}</span>
            </div>
            <button
              className="buy-now-btn"
              disabled={cart.length === 0}
              onClick={() => {
                setCurrentView('order');
                setIsCartOpen(false);
              }}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

export default App;
