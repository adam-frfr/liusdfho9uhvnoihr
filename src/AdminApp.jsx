import React, { useState, useEffect, useMemo } from 'react';
import { LayoutDashboard, ShoppingCart, Package, Users, Settings, LogOut, Bell, Search, X, User, Phone, Calendar, Clock, FileText, Cake, Palette, CheckCircle2, MessageCircle, Trash2, Sparkles, TrendingUp, Plus, ChevronLeft, ChevronRight, Edit3, Save, Image as ImageIcon, Upload, Mail, Shield, BarChart3, Database, Activity, RefreshCw, Smartphone, Link, ShieldCheck, AtSign } from 'lucide-react';
import OvenLoader from './components/OvenLoader';
import { supabase } from './supabase';
import { getProductImage } from './productImages';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import './AdminApp.css';


const optimizeAndConvertToWebP = (file, maxWidth = 1000, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > height && width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else if (height > maxWidth) {
          width = Math.round((width * maxWidth) / height);
          height = maxWidth;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          if (!blob) return reject(new Error('Canvas is empty'));
          resolve(new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", { type: "image/webp" }));
        }, 'image/webp', quality);
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

const AdminProductImage = ({ product }) => {
  const [loaded, setLoaded] = useState(false);
  const src = getProductImage(product);
  
  return (
    <div style={{
      height: '150px',
      width: '100%',
      backgroundColor: '#f0f0f0',
      position: 'relative',
      borderBottom: '1px solid #eee',
      overflow: 'hidden'
    }}>
      {!loaded && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%)',
          backgroundSize: '200% 100%',
          animation: 'admin-shimmer 1.5s infinite linear'
        }} />
      )}
      <img 
        src={src} 
        alt={product.name}
        onLoad={() => setLoaded(true)}
        style={{
          width: '100%', height: '100%', objectFit: 'cover', display: 'block',
          opacity: loaded ? 1 : 0, transition: 'opacity 0.3s ease'
        }}
      />
      <span className={`status-badge ${product.status === 'In Stock' ? 'completed' : 'cancelled'}`} style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 10, fontSize: '10px', padding: '4px 10px', borderRadius: '12px', background: product.status === 'In Stock' ? 'rgba(232,245,233,0.9)' : 'rgba(255,235,238,0.9)', backdropFilter: 'blur(4px)', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>{product.status}</span>
    </div>
  );
};

const ProductOptionsBuilder = ({ options, setOptions }) => {
  const [newOptionName, setNewOptionName] = useState('');
  
  const addOptionGroup = () => {
    if (!newOptionName.trim()) return;
    if (options.some(o => o.name.toLowerCase() === newOptionName.toLowerCase())) {
      alert("Option already exists!");
      return;
    }
    setOptions([...options, { name: newOptionName.trim(), values: [] }]);
    setNewOptionName('');
  };

  const removeOptionGroup = (index) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const addValue = (groupIndex, value) => {
    if (!value.trim()) return;
    const newOptions = [...options];
    if (!newOptions[groupIndex].values.includes(value.trim())) {
      newOptions[groupIndex].values.push(value.trim());
      setOptions(newOptions);
    }
  };

  const removeValue = (groupIndex, valueIndex) => {
    const newOptions = [...options];
    newOptions[groupIndex].values.splice(valueIndex, 1);
    setOptions(newOptions);
  };

  return (
    <div style={{ marginTop: '16px', padding: '20px', background: '#fafafa', borderRadius: '16px', border: '1px solid #eaeaea' }}>
      <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#333', marginBottom: '16px', letterSpacing: '0.5px' }}>Configure Product Options</label>
      
      {options.length === 0 && (
        <div style={{ textAlign: 'center', padding: '20px', color: '#888', fontSize: '13px', background: '#fff', borderRadius: '12px', border: '1px dashed #ddd', marginBottom: '16px' }}>
          No options added yet. Add sizes, flavors, or spreads below.
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        {options.map((opt, gIdx) => (
          <div key={gIdx} style={{ padding: '16px', background: '#fff', borderRadius: '12px', border: '1px solid #e0e0e0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontWeight: '700', fontSize: '14px', color: '#111' }}>{opt.name}</span>
              <button onClick={() => removeOptionGroup(gIdx)} style={{ background: '#ffebee', border: 'none', color: '#d32f2f', cursor: 'pointer', fontSize: '11px', fontWeight: '600', padding: '4px 8px', borderRadius: '6px', transition: '0.2s' }}>Remove</button>
            </div>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
              {opt.values.length === 0 && <span style={{ fontSize: '12px', color: '#aaa', fontStyle: 'italic' }}>No values added</span>}
              {opt.values.map((val, vIdx) => (
                <div key={vIdx} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fff0f4', color: '#800000', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', border: '1px solid #fde0e6' }}>
                  {val}
                  <X size={14} style={{ cursor: 'pointer', opacity: 0.6 }} onClick={() => removeValue(gIdx, vIdx)} />
                </div>
              ))}
            </div>
            
            <input 
              type="text" 
              placeholder={`Add a ${opt.name.toLowerCase()} value & press Enter`}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addValue(gIdx, e.target.value);
                  e.target.value = '';
                }
              }}
              style={{ width: '100%', padding: '10px 14px', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '13px', outline: 'none', background: '#f8f8f8', boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = '#800000'}
              onBlur={e => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '16px', background: '#fff', borderRadius: '12px', border: '1px dashed #ccc' }}>
        <input 
          type="text" 
          value={newOptionName} 
          onChange={e => setNewOptionName(e.target.value)} 
          placeholder="New Option Group (e.g. Sizes, Fillings)" 
          style={{ flex: 1, padding: '12px 14px', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
          onFocus={e => e.target.style.borderColor = '#800000'}
          onBlur={e => e.target.style.borderColor = '#e0e0e0'}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addOptionGroup(); } }}
        />
        <button onClick={addOptionGroup} style={{ padding: '12px 20px', background: '#111', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: '0.2s' }}>
          <Plus size={16} /> Add Group
        </button>
      </div>
    </div>
  );
};

// Reusable tag input for array fields like flavours, spreads, etc.
const TagInput = ({ label, icon, values = [], onChange, placeholder, accentColor = '#800000' }) => {
  const [inputVal, setInputVal] = useState('');
  const add = () => {
    const v = inputVal.trim();
    if (!v || values.includes(v)) return;
    onChange([...values, v]);
    setInputVal('');
  };
  const remove = (idx) => onChange(values.filter((_, i) => i !== idx));
  return (
    <div style={{ background: '#fff', borderRadius: '12px', border: '1.5px solid #efefef', overflow: 'hidden' }}>
      <div style={{ padding: '10px 14px', borderBottom: '1px solid #f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fafafa' }}>
        <span style={{ fontSize: '12px', fontWeight: '700', color: '#444', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          {icon} {label}
        </span>
        <span style={{ fontSize: '11px', color: '#aaa', background: '#fff', border: '1px solid #eee', borderRadius: '20px', padding: '2px 8px', fontWeight: '600' }}>{values.length} added</span>
      </div>
      <div style={{ padding: '12px 14px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', minHeight: '36px', marginBottom: values.length ? '10px' : 0 }}>
          {values.map((v, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#fff0f4', color: accentColor, padding: '5px 11px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', border: `1px solid #fde0e6` }}>
              {v}
              <button onClick={() => remove(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: accentColor, padding: 0, lineHeight: 1, opacity: 0.6, fontSize: '14px', display: 'flex' }}>×</button>
            </span>
          ))}
          {values.length === 0 && <span style={{ fontSize: '12px', color: '#bbb', fontStyle: 'italic', lineHeight: '28px' }}>No {label.toLowerCase()} added yet</span>}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
            placeholder={placeholder || `Type a ${label.toLowerCase()} and press Enter`}
            style={{ flex: 1, padding: '9px 12px', border: '1.5px solid #e8e8e8', borderRadius: '8px', fontSize: '13px', outline: 'none', fontFamily: 'inherit' }}
            onFocus={e => e.target.style.borderColor = accentColor}
            onBlur={e => e.target.style.borderColor = '#e8e8e8'}
          />
          <button onClick={add} style={{ padding: '9px 14px', background: accentColor, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}>+ Add</button>
        </div>
      </div>
    </div>
  );
};

const InstagramIcon = ({ size = 24, color, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color || "url(#instaGradient)"}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <defs>
      <linearGradient id="instaGradient" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" style={{ stopColor: '#f09433' }} />
        <stop offset="25%" style={{ stopColor: '#e6683c' }} />
        <stop offset="50%" style={{ stopColor: '#dc2743' }} />
        <stop offset="75%" style={{ stopColor: '#cc2366' }} />
        <stop offset="100%" style={{ stopColor: '#bc1888' }} />
      </linearGradient>
    </defs>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FacebookIcon = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const WhatsAppIcon = ({ size = 16, ...props }) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    fill="currentColor" 
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.353-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.446 4.432-9.877 9.881-9.877 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.448-4.435 9.878-9.883 9.878m0-21.867C6.435.056.1.493.1 12.226c0 2.124.549 4.198 1.595 6.037L0 24l5.893-1.547a12.19 12.19 0 005.77 1.468h.005c6.12 0 12.1-5.437 12.1-12.226 0-3.27-1.272-6.342-3.582-8.652A12.134 12.134 0 0012.051.055z"/>
  </svg>
);

// Default featured images
const brownieImg = "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=800&auto=format&fit=crop";
const cupcakeImg = "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?q=80&w=800&auto=format&fit=crop";
const cakeImg = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop";


const isSupabaseLive = !!supabase;

const getColorName = (color) => {
  if (!color) return 'Unknown Color';
  switch (color.toUpperCase()) {
    case '#A3B18A': return 'Matcha';
    case '#F9C6C9': return 'Blush Pink';
    case '#C9B1D9': return 'Lavender';
    case '#B5EAD7': return 'Mint';
    case '#FFEAAA': return 'Buttercream';
    case '#AEC6F7': return 'Sky Blue';
    case '#FFCBA4': return 'Peach';
    case '#E8A598': return 'Rose Gold';
    case '#F5E6C8': return 'Ivory';
    case '#8B4513': return 'Chocolate';
    case '#C4919E': return 'Dusty Mauve';
    case '#9B2D30': return 'Red Velvet';
    case '#FFF3B0': return 'Lemon';
    case '#88A0C0': return 'Blueberry';
    case '#D4A373': return 'Caramel';
    case '#B2C9AB': return 'Pistachio';
    case '#F28482': return 'Coral Pink';
    case '#5E548E': return 'Deep Purple';
    case '#CCD5AE': return 'Sage';
    case '#E3D5CA': return 'Champagne';
    default: return color;
  }
};

const analyticsData = {
  'this-week': {
    metrics: [
      { label: 'Total Revenue', value: '€2,840.00', change: '+14.2%', positive: true, icon: ShoppingCart, bg: '#E3F2FD', color: '#1565C0' },
      { label: 'Total Orders', value: '78', change: '+5.4%', positive: true, icon: ShoppingCart, bg: '#F3E5F5', color: '#7B1FA2' },
      { label: 'Average Order Value', value: '€36.41', change: '+8.3%', positive: true, icon: Package, bg: '#FFF8E1', color: '#F57F17' },
      { label: 'Custom Cakes Share', value: '51.3%', change: '+3.2%', positive: true, icon: Cake, bg: '#E8F5E9', color: '#2E7D32' },
    ],
    chartData: [
      { name: 'Mon', revenue: 320 },
      { name: 'Tue', revenue: 410 },
      { name: 'Wed', revenue: 380 },
      { name: 'Thu', revenue: 540 },
      { name: 'Fri', revenue: 620 },
      { name: 'Sat', revenue: 480 },
      { name: 'Sun', revenue: 90 },
    ],
    categories: [
      { name: 'Custom Cakes', value: '€1,456.92', percentage: '51.3%', fill: 'var(--secondary)' },
      { name: 'Standard Cakes', value: '€886.08', percentage: '31.2%', fill: '#d48a97' },
      { name: 'Cupcakes & Treats', value: '€497.00', percentage: '17.5%', fill: '#f8d2d9' },
    ],
    sellers: [
      { name: 'Custom Birthday Cake', category: 'Custom Cakes', orders: 28, revenue: '€1,260.00', trend: '+12.4%' },
      { name: 'Box of 12 Cupcakes', category: 'Cupcakes', orders: 18, revenue: '€561.60', trend: '+8.2%' },
      { name: '2 Layer 6 inch Standard', category: 'Standard Cakes', orders: 12, revenue: '€540.00', trend: '-2.1%' },
      { name: 'Cake Pops Assorted', category: 'Treats', orders: 20, revenue: '€478.40', trend: '+15.6%' },
    ]
  },
  'this-month': {
    metrics: [
      { label: 'Total Revenue', value: '€14,520.00', change: '+12.4%', positive: true, icon: ShoppingCart, bg: '#E3F2FD', color: '#1565C0' },
      { label: 'Total Orders', value: '1,284', change: '+8.2%', positive: true, icon: ShoppingCart, bg: '#F3E5F5', color: '#7B1FA2' },
      { label: 'Average Order Value', value: '€38.50', change: '+4.1%', positive: true, icon: Package, bg: '#FFF8E1', color: '#F57F17' },
      { label: 'Custom Cakes Share', value: '48.2%', change: '+6.8%', positive: true, icon: Cake, bg: '#E8F5E9', color: '#2E7D32' },
    ],
    chartData: [
      { name: 'Week 1', revenue: 3120 },
      { name: 'Week 2', revenue: 3480 },
      { name: 'Week 3', revenue: 3950 },
      { name: 'Week 4', revenue: 3970 },
    ],
    categories: [
      { name: 'Custom Cakes', value: '€6,998.64', percentage: '48.2%', fill: 'var(--secondary)' },
      { name: 'Standard Cakes', value: '€5,139.60', percentage: '35.4%', fill: '#d48a97' },
      { name: 'Cupcakes & Treats', value: '€2,381.76', percentage: '16.4%', fill: '#f8d2d9' },
    ],
    sellers: [
      { name: 'Custom Wedding Shower Cake', category: 'Custom Cakes', orders: 142, revenue: '€6,390.00', trend: '+18.4%' },
      { name: '2 Layer 8 inch Standard', category: 'Standard Cakes', orders: 98, revenue: '€6,370.00', trend: '+11.2%' },
      { name: 'Box of 6 Cupcakes', category: 'Cupcakes', orders: 120, revenue: '€2,160.00', trend: '+4.5%' },
      { name: 'Breakable Heart Surprise', category: 'Treats', orders: 48, revenue: '€1,776.00', trend: '+9.8%' },
    ]
  },
  'all-time': {
    metrics: [
      { label: 'Total Revenue', value: '€78,340.00', change: '+28.4%', positive: true, icon: ShoppingCart, bg: '#E3F2FD', color: '#1565C0' },
      { label: 'Total Orders', value: '6,120', change: '+18.7%', positive: true, icon: ShoppingCart, bg: '#F3E5F5', color: '#7B1FA2' },
      { label: 'Average Order Value', value: '€42.15', change: '+10.2%', positive: true, icon: Package, bg: '#FFF8E1', color: '#F57F17' },
      { label: 'Custom Cakes Share', value: '45.8%', change: '+12.5%', positive: true, icon: Cake, bg: '#E8F5E9', color: '#2E7D32' },
    ],
    chartData: [
      { name: 'Jan', revenue: 11200 },
      { name: 'Feb', revenue: 14500 },
      { name: 'Mar', revenue: 18200 },
      { name: 'Apr', revenue: 21300 },
      { name: 'May', revenue: 13140 },
    ],
    categories: [
      { name: 'Custom Cakes', value: '€35,879.72', percentage: '45.8%', fill: 'var(--secondary)' },
      { name: 'Standard Cakes', value: '€29,142.48', percentage: '37.2%', fill: '#d48a97' },
      { name: 'Cupcakes & Treats', value: '€13,317.80', percentage: '17.0%', fill: '#f8d2d9' },
    ],
    sellers: [
      { name: 'Custom Celebration Cake (Avg)', category: 'Custom Cakes', orders: 742, revenue: '€33,390.00', trend: '+24.5%' },
      { name: '2 Layer 6 inch Standard', category: 'Standard Cakes', orders: 580, revenue: '€26,100.00', trend: '+15.2%' },
      { name: 'Box of 12 Cupcakes', category: 'Cupcakes', orders: 610, revenue: '€19,032.00', trend: '+12.4%' },
      { name: 'Cake Pops Classic', category: 'Treats', orders: 1840, revenue: '€3,128.00', trend: '+8.9%' },
    ]
  }
};

function AdminAppContent({ session }) {
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth <= 768);
  const [activeTab, setActiveTab] = useState(() => {
    const saved = localStorage.getItem('minibakes_admin_tab');
    return saved || (isMobile ? 'orders' : 'dashboard');
  });

  useEffect(() => {
    localStorage.setItem('minibakes_admin_tab', activeTab);
  }, [activeTab]);
  const [activeSettingsTab, setActiveSettingsTab] = useState('profile');

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setActiveTab(current => (current === 'settings' || current === 'orders') ? current : 'orders');
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const [isEditingVacation, setIsEditingVacation] = useState(false);
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState('this-month');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeOrderItemIndex, setActiveOrderItemIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [toast, setToast] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [storeSettings, setStoreSettings] = useState({
    whatsapp_number: '',
    instagram_link: '',
    facebook_link: ''
  });
  const [originalStoreSettings, setOriginalStoreSettings] = useState({
    whatsapp_number: '',
    instagram_link: '',
    facebook_link: ''
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  const [storeAvailability, setStoreAvailability] = useState({
    is_taking_orders_today: true,
    daily_pause_message: 'We are not taking any more orders today. Please check back tomorrow!',
    vacation_start_date: '',
    vacation_end_date: '',
    vacation_message: 'We are currently away on vacation. Check back soon!'
  });
  const [originalStoreAvailability, setOriginalStoreAvailability] = useState({
    is_taking_orders_today: true,
    daily_pause_message: 'We are not taking any more orders today. Please check back tomorrow!',
    vacation_start_date: '',
    vacation_end_date: '',
    vacation_message: 'We are currently away on vacation. Check back soon!'
  });
  const [isSavingAvailability, setIsSavingAvailability] = useState(false);


  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase.from('store_settings').select('*').limit(1).single();
        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching settings:', error);
          return;
        }
        if (data) {
          const newSettings = {
            whatsapp_number: data.whatsapp_number || '',
            instagram_link: data.instagram_link || '',
            facebook_link: data.facebook_link || ''
          };
          setStoreSettings(newSettings);
          setOriginalStoreSettings(newSettings);
        }
      } catch (e) {
        console.error('Failed to fetch settings:', e);
      }
    };
    
    const fetchAvailability = async () => {
      try {
        const { data, error } = await supabase.from('store_availability').select('*').limit(1).single();
        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching availability:', error);
          return;
        }
        if (data) {
          const newAvailability = {
            is_taking_orders_today: data.is_taking_orders_today ?? true,
            daily_pause_message: data.daily_pause_message || 'We are not taking any more orders today. Please check back tomorrow!',
            vacation_start_date: data.vacation_start_date || '',
            vacation_end_date: data.vacation_end_date || '',
            vacation_message: data.vacation_message || 'We are currently away on vacation. Check back soon!'
          };
          setStoreAvailability(newAvailability);
          setOriginalStoreAvailability(newAvailability);
        }
      } catch (e) {
        console.error('Failed to fetch availability:', e);
      }
    };
    
    fetchSettings();
    fetchAvailability();
  }, [activeTab]);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      const { error } = await supabase.from('store_settings').upsert({
        id: 1,
        whatsapp_number: storeSettings.whatsapp_number,
        instagram_link: storeSettings.instagram_link,
        facebook_link: storeSettings.facebook_link,
        updated_at: new Date().toISOString()
      });
      if (error) throw error;
      setOriginalStoreSettings(storeSettings);
      triggerToast('Store branding settings updated successfully!');
    } catch (err) {
      console.error('Error updating settings:', err);
      triggerToast('Failed to update settings', 'error');
    } finally {
      setIsSavingSettings(false);
      setIsSavingSettings(false);
    }
  };

  const handleSaveAvailability = async (e) => {
    e.preventDefault();
    setIsSavingAvailability(true);
    try {
      const { error } = await supabase.from('store_availability').upsert({
        id: 1,
        is_taking_orders_today: storeAvailability.is_taking_orders_today,
        daily_pause_message: storeAvailability.daily_pause_message,
        vacation_start_date: storeAvailability.vacation_start_date || null,
        vacation_end_date: storeAvailability.vacation_end_date || null,
        vacation_message: storeAvailability.vacation_message,
        updated_at: new Date().toISOString()
      });
      if (error) throw error;
      setOriginalStoreAvailability(storeAvailability);
      triggerToast('Store availability updated successfully!');
    } catch (err) {
      console.error('Error updating availability:', err);
      triggerToast('Failed to update availability', 'error');
    } finally {
      setIsSavingAvailability(false);
    }
  };

  const handleCancelVacation = async () => {
    if (!window.confirm('Are you sure you want to cancel the scheduled vacation? This will make the store available again.')) {
      return;
    }
    
    setIsSavingAvailability(true);
    try {
      const { error } = await supabase.from('store_availability').upsert({
        id: 1,
        is_taking_orders_today: storeAvailability.is_taking_orders_today,
        daily_pause_message: storeAvailability.daily_pause_message,
        vacation_start_date: null,
        vacation_end_date: null,
        vacation_message: storeAvailability.vacation_message,
        updated_at: new Date().toISOString()
      });
      if (error) throw error;
      
      setStoreAvailability(prev => ({ ...prev, vacation_start_date: '', vacation_end_date: '' }));
      setIsEditingVacation(false);
      triggerToast('Scheduled vacation cancelled successfully!');
    } catch (err) {
      console.error('Error cancelling vacation:', err);
      triggerToast('Failed to cancel vacation', 'error');
    } finally {
      setIsSavingAvailability(false);
    }
  };
  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleSendPushNotification = async (orderId, type) => {
    try {
      setIsSendingPush(prev => ({ ...prev, [`${orderId}-${type}`]: true }));
      const functionName = type === 'ready' ? 'send-order-ready' : 'send-followup';
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: { orderId }
      });
      if (error) throw error;
      triggerToast(`Push notification sent successfully!`);
    } catch (err) {
      console.error('Push error:', err);
      triggerToast('Failed to send push notification', 'error');
    } finally {
      setIsSendingPush(prev => ({ ...prev, [`${orderId}-${type}`]: false }));
    }
  };

  const [isSendingPush, setIsSendingPush] = useState({});

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [classBookings, setClassBookings] = useState([]);

  useEffect(() => {
    const fetchClassBookings = async () => {
      if (!isSupabaseLive) return;
      try {
        const { data, error } = await supabase.from('class_bookings').select('*').order('created_at', { ascending: false });
        if (error) {
          if (error.message?.includes('fetch')) return;
          throw error;
        }
        if (data) setClassBookings(data);
      } catch (err) {
        console.error('Error fetching class bookings:', err);
      }
    };
    fetchClassBookings();
  }, [activeTab]);
  const [mailModal, setMailModal] = useState(null);
  const [whatsappModal, setWhatsappModal] = useState(null);
  const [confirmBookingModal, setConfirmBookingModal] = useState(null); // stores dateStr
  const [orderProgressModal, setOrderProgressModal] = useState(null);
  const [progressMessageText, setProgressMessageText] = useState('');
  const [adminPickupDate, setAdminPickupDate] = useState('');
  const [adminPickupTime, setAdminPickupTime] = useState('');

  useEffect(() => {
    if (orderProgressModal?.targetStatus === 'completed') {
      const defaultMsg = `Hi ${orderProgressModal.order.customer}! 🧁 Your Mini Bakes order (${orderProgressModal.order.id}) is now ready for pickup! 🎉\n\n📅 Pickup Date: ${adminPickupDate || ''}\n🕒 Period: ${adminPickupTime || ''}\n\nWe hope you enjoy your delicious treats! See you soon! ✨`;
      setProgressMessageText(defaultMsg);
    }
  }, [adminPickupDate, adminPickupTime, orderProgressModal?.targetStatus, orderProgressModal?.order]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedDate = currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });

  const allNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'classes', label: 'Classes', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const navItems = isMobile ? allNavItems.filter(item => item.id === 'settings' || item.id === 'orders') : allNavItems;


  const [allProducts, setAllProducts] = useState([]);
  const [productCategoryFilter, setProductCategoryFilter] = useState('All');

  const productCategories = useMemo(() => {
    const cats = new Set(allProducts.map(p => p.category).filter(Boolean));
    return ['All', ...Array.from(cats)];
  }, [allProducts]);
  
  const filteredProducts = useMemo(() => {
    let result = allProducts;
    if (productCategoryFilter !== 'All') {
      result = allProducts.filter(p => p.category === productCategoryFilter);
    }
    
    // Sort logic
    // 1. Specific category order: Cakes -> Cupcakes -> Treats -> Others
    // 2. Natural string comparison for names (correctly sorts 6 before 12)
    const categoryOrder = { 'Cakes': 1, 'Cupcakes': 2, 'Treats': 3 };
    
    return [...result].sort((a, b) => {
      const catA = categoryOrder[a.category] || 99;
      const catB = categoryOrder[b.category] || 99;
      
      if (catA !== catB) {
        return catA - catB;
      }
      
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
    });
  }, [allProducts, productCategoryFilter]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!isSupabaseLive) return;
      try {
        const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: true });
        if (error) {
          if (error.message?.includes('fetch')) return;
          throw error;
        }
        if (data) {
          // Format Supabase data to include missing properties for Admin UI safely
          const formatted = data.map(dbProd => ({
            ...dbProd,
            status: 'In Stock',
            flavours: [],
            spreads: []
          }));
          setAllProducts(formatted);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };
    fetchProducts();
  }, [activeTab]);



  const [editProductModal, setEditProductModal] = useState(null); // null or { product, form, options, imageFile, imagePreview }
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [newProductData, setNewProductData] = useState({
    name: '',
    price: '',
    portions: '',
    description: '',
    category: 'Cakes',
    status: 'In Stock',
    file: null,
    options: [],
    flavours: [],
    spreads: []
  });

  const handleConfirmAddProduct = async () => {
    if (!newProductData.name || !newProductData.price) {
      triggerToast('Please provide at least a name and price.', 'error');
      return;
    }
    
    setIsUploadingProductImage(true);
    try {
      const newId = `PROD-${Date.now()}`;
      let finalImgUrl = undefined;
      
      if (newProductData.file) {
        const optimizedFile = await optimizeAndConvertToWebP(newProductData.file);
        const fileName = `product-${newId}.webp`;
        const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, optimizedFile, { upsert: true, contentType: 'image/webp' });
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(fileName);
        finalImgUrl = `${publicUrl}?t=${Date.now()}`;
      }
      
      const otherOptions = (newProductData.options || []).filter(o => !['flavors', 'flavours', 'spreads'].includes(o.name.toLowerCase()));
      
      const payload = {
        id: newId,
        name: newProductData.name,
        price: newProductData.price,
        category: newProductData.category,
        status: newProductData.status,
        flavours: newProductData.flavours || [],
        spreads: newProductData.spreads || [],
        portions: newProductData.portions,
        description: newProductData.description || '',
        options: otherOptions,
        created_at: new Date().toISOString()
      };
      if (finalImgUrl) payload.img = finalImgUrl;

      if (isSupabaseLive) {
        const { error } = await supabase.from('products').insert([payload]);
        if (error && !error.message?.includes('fetch')) throw error;
      }
      
      setAllProducts([payload, ...allProducts]);
      setIsAddProductModalOpen(false);
      setNewProductData({ name: '', price: '', portions: '', description: '', category: 'Cakes', status: 'In Stock', file: null, options: [], flavours: [], spreads: [] });
      triggerToast('Product added successfully!', 'success');
    } catch (err) {
      console.error('Error adding product:', err);
      triggerToast('Error adding product.', 'error');
    }
    setIsUploadingProductImage(false);
  };

  const adminCustomers = [
    { id: 'CUST-008', name: 'Olivia Smith', phone: '+1 555-0198', lastOrderValue: '€112.50', lastEngagement: '2 hrs ago', source: 'Instagram Menu', status: 'High Intent' },
    { id: 'CUST-007', name: 'Noah Johnson', phone: '+1 555-0200', lastOrderValue: '€35.00', lastEngagement: '5 hrs ago', source: 'Direct Search', status: 'First-time' },
    { id: 'CUST-006', name: 'William Brown', phone: '+44 7700 900077', lastOrderValue: '€48.00', lastEngagement: '1 day ago', source: 'WhatsApp Promo', status: 'Repeat Buyer' },
    { id: 'CUST-005', name: 'Emma Thompson', phone: '+1 555-0322', lastOrderValue: '€45.00', lastEngagement: '1 day ago', source: 'Website Link', status: 'Repeat Buyer' },
    { id: 'CUST-004', name: 'Liam Davies', phone: '+1 555-0100', lastOrderValue: '€18.00', lastEngagement: '2 days ago', source: 'Referral', status: 'First-time' },
    { id: 'CUST-003', name: 'Sophia Rossi', phone: '+39 333 444 5555', lastOrderValue: '€65.00', lastEngagement: '3 days ago', source: 'Instagram Menu', status: 'VIP' },
    { id: 'CUST-002', name: 'Lucas Ali', phone: '+1 555-9892', lastOrderValue: '€24.50', lastEngagement: '4 days ago', source: 'Website Link', status: 'First-time' },
    { id: 'CUST-001', name: 'Isabella King', phone: '+1 555-7788', lastOrderValue: '€85.00', lastEngagement: '1 week ago', source: 'WhatsApp Promo', status: 'VIP' }
  ];

  const [allOrders, setAllOrders] = useState([]);
  const [isRefreshingOrders, setIsRefreshingOrders] = useState(false);

  const engagementData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const counts = { 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0, 'Sun': 0 };
    
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    allOrders.forEach(o => {
      const d = new Date(o.created_at || o.date);
      if (d >= oneWeekAgo) {
        counts[days[d.getDay()]] += 1;
      }
    });

    return [
      { name: 'Mon', engagements: counts['Mon'] },
      { name: 'Tue', engagements: counts['Tue'] },
      { name: 'Wed', engagements: counts['Wed'] },
      { name: 'Thu', engagements: counts['Thu'] },
      { name: 'Fri', engagements: counts['Fri'] },
      { name: 'Sat', engagements: counts['Sat'] },
      { name: 'Sun', engagements: counts['Sun'] },
    ];
  }, [allOrders]);

  const fetchOrders = async () => {
    if (!isSupabaseLive) return;
    setIsRefreshingOrders(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        if (error.message?.includes('fetch')) return;
        throw error;
      }
      
      if (data) {
        const formattedData = data.map(dbOrder => ({
          ...dbOrder,
          clientId: dbOrder.client_id
        }));
        setAllOrders(formattedData);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setIsRefreshingOrders(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    if (isSupabaseLive) {
      const ordersSubscription = supabase
        .channel('public:orders')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, payload => {
          fetchOrders();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(ordersSubscription);
      };
    }
  }, [activeTab]);

  const [bookedDates, setBookedDates] = useState([]);
  const [viewDate, setViewDate] = useState(new Date());

  // Derive unique Customer profiles from persistent Client Device IDs legally
  const recentActivities = useMemo(() => {
    if (allOrders.length === 0) {
      return [
        { id: '-', action: 'No Data', target: 'Waiting for orders...', time: '-', status: 'pending' }
      ];
    }

    const timeAgo = (dateStr) => {
      const diff = new Date() - new Date(dateStr);
      const minutes = Math.max(0, Math.floor(diff / 60000));
      if (minutes < 60) return `${minutes || 1} mins ago`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours} hours ago`;
      return `${Math.floor(hours / 24)} days ago`;
    };

    return allOrders.slice(0, 5).map((order, i) => ({
      id: order.id.slice(0, 8).toUpperCase(),
      action: 'New Order Placed',
      target: order.customer || 'Unknown',
      time: order.created_at ? timeAgo(order.created_at) : (order.date ? timeAgo(order.date) : 'Just now'),
      status: order.status || 'pending'
    }));
  }, [allOrders]);

  const dynamicCustomers = useMemo(() => {
    const custMap = new Map();
    allOrders.forEach(order => {
      const idKey = order.clientId || `name-${order.customer}`;
      const orderValue = parseFloat(order.total?.replace(/[^\d.]/g, '') || '0');
      
      if (custMap.has(idKey)) {
        const existing = custMap.get(idKey);
        existing.orderCount += 1;
        existing.totalSpent += orderValue;
        if (!existing.source && order.details?.source) {
          existing.source = order.details.source;
        }
        if (new Date(order.date) > new Date(existing.lastOrderDate)) {
          existing.lastOrderDate = order.date;
          existing.name = order.customer;
          existing.phone = order.phone || order.details?.whatsapp || '';
        }
      } else {
        custMap.set(idKey, {
          id: idKey,
          name: order.customer,
          phone: order.phone || order.details?.whatsapp || '',
          orderCount: 1,
          totalSpent: orderValue,
          lastOrderDate: order.date,
          source: order.details?.source || 'Direct'
        });
      }
    });

    return Array.from(custMap.values()).map(c => {
      let status = 'Regular';
      if (c.orderCount > 3) status = 'VIP';
      else if (new Date(c.lastOrderDate) < new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)) status = 'Inactive';
      
      return {
        id: c.id,
        name: c.name,
        contact: c.phone,
        totalOrders: c.orderCount,
        lastOrderValue: `€${c.totalSpent.toFixed(2)}`,
        lastEngagement: `${new Date(c.lastOrderDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`,
        status: status,
        source: c.source
      };
    });
  }, [allOrders]);

  const customerInsights = useMemo(() => {
    const srcCounts = { Instagram: 0, Facebook: 0, Google: 0, Direct: 0 };
    const returningCustomers = dynamicCustomers.filter(c => c.totalOrders > 1);
    const returningRate = Math.round((returningCustomers.length / (dynamicCustomers.length || 1)) * 100);
    
    dynamicCustomers.forEach(c => {
      const src = (c.source || '').toLowerCase();
      if (src.includes('instagram') || src.includes('ig')) srcCounts.Instagram++;
      else if (src.includes('facebook') || src.includes('fb')) srcCounts.Facebook++;
      else if (src.includes('google') || src.includes('gl')) srcCounts.Google++;
      else srcCounts.Direct++;
    });

    let topChannel = 'Direct';
    let maxCount = srcCounts.Direct;
    ['Instagram', 'Facebook', 'Google'].forEach(channel => {
       if (srcCounts[channel] > maxCount) {
          maxCount = srcCounts[channel];
          topChannel = channel;
       }
    });

    let retentionInsight = {};
    if (returningRate > 30) {
       retentionInsight = { title: 'Strong Customer Loyalty', text: `Your returning rate is ${returningRate}%, which is excellent! Consider launching a VIP rewards program to maintain this high retention.`, color: '#2e7d32', bg: '#e8f5e9', border: '#4caf50' };
    } else {
       retentionInsight = { title: 'Boost Returning Customers', text: `Returning rate is at ${returningRate}%. Try running a weekend promo broadcast to inactive contacts to trigger impulsive repurchases.`, color: '#f57f17', bg: '#fff8e1', border: '#fbc02d' };
    }

    let acquisitionInsight = {};
    if (maxCount > 0 && topChannel !== 'Direct') {
       acquisitionInsight = { title: 'Peak Acquisition Channel', text: `"${topChannel}" led your acquisition with ${maxCount} customers. Consider doubling down on this channel with targeted ads or pinned content.`, color: '#1565c0', bg: '#e3f2fd', border: '#1976d2' };
    } else {
       acquisitionInsight = { title: 'Acquisition Channels', text: `Currently, most of your traffic is Direct (${srcCounts.Direct} customers). Try sharing links with tracking tags on your social media to identify where customers are coming from!`, color: '#1565c0', bg: '#e3f2fd', border: '#1976d2' };
    }

    return { returningRate, srcCounts, retentionInsight, acquisitionInsight };
  }, [dynamicCustomers]);

  const realAnalyticsData = useMemo(() => {
    const now = new Date();
    
    const computeMetrics = (orders) => {
      let totalRevenue = 0;
      let customCakesCount = 0;
      orders.forEach(o => {
        totalRevenue += parseFloat(o.total?.replace(/[^\d.]/g, '') || '0');
        const hasCustomCake = (o.details?.items || []).some(item => item.name?.toLowerCase().includes('custom') || item.category?.toLowerCase() === 'custom cakes');
        if (hasCustomCake) customCakesCount++;
      });
      const totalOrders = orders.length;
      const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders) : 0;
      const customCakesShare = totalOrders > 0 ? (customCakesCount / totalOrders) * 100 : 0;
      return { totalRevenue, totalOrders, avgOrderValue, customCakesShare };
    };

    const activeOrders = allOrders.filter(o => o.status !== 'cancelled');
    let currentOrders = [];
    let previousOrders = [];

    if (analyticsTimeframe === 'this-week') {
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
      currentOrders = activeOrders.filter(o => new Date(o.created_at || o.date) >= oneWeekAgo);
      previousOrders = activeOrders.filter(o => {
        const d = new Date(o.created_at || o.date);
        return d >= twoWeeksAgo && d < oneWeekAgo;
      });
    } else if (analyticsTimeframe === 'this-month') {
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
      currentOrders = activeOrders.filter(o => new Date(o.created_at || o.date) >= oneMonthAgo);
      previousOrders = activeOrders.filter(o => {
        const d = new Date(o.created_at || o.date);
        return d >= twoMonthsAgo && d < oneMonthAgo;
      });
    } else {
      currentOrders = activeOrders;
      previousOrders = [];
    }

    const current = computeMetrics(currentOrders);
    const previous = computeMetrics(previousOrders);

    const getTrend = (curr, prev) => {
      if (prev === 0 && curr === 0) return { text: '+0.0%', positive: true };
      if (prev === 0) return { text: '+100.0%', positive: true };
      const diff = ((curr - prev) / prev) * 100;
      return { text: `${diff >= 0 ? '+' : ''}${diff.toFixed(1)}%`, positive: diff >= 0 };
    };

    const revTrend = getTrend(current.totalRevenue, previous.totalRevenue);
    const ordTrend = getTrend(current.totalOrders, previous.totalOrders);
    const aovTrend = getTrend(current.avgOrderValue, previous.avgOrderValue);
    const customTrend = getTrend(current.customCakesShare, previous.customCakesShare);

    const baseData = analyticsData[analyticsTimeframe] || analyticsData['all-time'];

    let computedChartData = [];
    if (analyticsTimeframe === 'this-week') {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const weekData = { 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0, 'Sun': 0 };
      currentOrders.forEach(o => {
        const d = new Date(o.created_at || o.date);
        const dayName = days[d.getDay()];
        weekData[dayName] += parseFloat(o.total?.replace(/[^\d.]/g, '') || '0');
      });
      computedChartData = [
        { name: 'Mon', revenue: weekData['Mon'] },
        { name: 'Tue', revenue: weekData['Tue'] },
        { name: 'Wed', revenue: weekData['Wed'] },
        { name: 'Thu', revenue: weekData['Thu'] },
        { name: 'Fri', revenue: weekData['Fri'] },
        { name: 'Sat', revenue: weekData['Sat'] },
        { name: 'Sun', revenue: weekData['Sun'] },
      ];
    } else if (analyticsTimeframe === 'this-month') {
      const monthData = [0, 0, 0, 0];
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      currentOrders.forEach(o => {
        const d = new Date(o.created_at || o.date);
        const diffDays = Math.floor((d - oneMonthAgo) / (1000 * 60 * 60 * 24));
        const weekIndex = Math.min(Math.floor(diffDays / 7.5), 3);
        if (weekIndex >= 0) {
          monthData[weekIndex] += parseFloat(o.total?.replace(/[^\d.]/g, '') || '0');
        }
      });
      computedChartData = [
        { name: 'Week 1', revenue: monthData[0] },
        { name: 'Week 2', revenue: monthData[1] },
        { name: 'Week 3', revenue: monthData[2] },
        { name: 'Week 4', revenue: monthData[3] },
      ];
    } else {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthData = {};
      currentOrders.forEach(o => {
        const d = new Date(o.created_at || o.date);
        const m = months[d.getMonth()];
        monthData[m] = (monthData[m] || 0) + parseFloat(o.total?.replace(/[^\d.]/g, '') || '0');
      });
      computedChartData = months.filter(m => monthData[m] !== undefined).map(m => ({
        name: m,
        revenue: monthData[m]
      }));
      if (computedChartData.length === 0) {
        computedChartData = [{ name: 'No Data', revenue: 0 }];
      }
    }

    const categoryTotals = {};
    let totalCatRevenue = 0;

    currentOrders.forEach(o => {
      const orderTotal = parseFloat(o.total?.replace(/[^\d.]/g, '') || '0');
      const cat = (o.details?.items && o.details.items.length > 0) ? (o.details.items[0].category || 'Other') : 'Other';
      const c = cat.toLowerCase().includes('custom') ? 'Custom Cakes' : cat;
      categoryTotals[c] = (categoryTotals[c] || 0) + orderTotal;
      totalCatRevenue += orderTotal;
    });

    const defaultColors = ['var(--secondary)', '#d48a97', '#f8d2d9', '#e9ecef', '#adb5bd', '#6c757d'];
    let colorIndex = 0;

    const computedCategories = Object.keys(categoryTotals)
      .map(cat => {
        const val = categoryTotals[cat];
        const pct = totalCatRevenue > 0 ? (val / totalCatRevenue) * 100 : 0;
        let fill = defaultColors[colorIndex % defaultColors.length];
        if (cat === 'Custom Cakes') fill = 'var(--secondary)';
        else if (cat.toLowerCase().includes('standard')) fill = '#d48a97';
        else if (cat.toLowerCase().includes('cupcake')) fill = '#f8d2d9';
        else colorIndex++;

        return {
          name: cat,
          value: `€${val.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
          percentage: `${pct.toFixed(1)}%`,
          fill: fill,
          rawVal: val
        };
      })
      .sort((a, b) => b.rawVal - a.rawVal);

    if (computedCategories.length === 0) {
      computedCategories.push({ name: 'No Data', value: '€0.00', percentage: '0.0%', fill: '#e9ecef', rawVal: 0 });
    }

    const productStats = {};
    const prevProductStats = {};

    const processOrdersForSellers = (ordersArray, statsObj) => {
      ordersArray.forEach(o => {
        const orderTotal = parseFloat(o.total?.replace(/[^\d.]/g, '') || '0');
        const items = o.details?.items || [];
        if (items.length > 0) {
          const revenuePerItem = orderTotal / items.length;
          items.forEach(item => {
            const n = item.name || 'Custom Cake';
            const cat = item.category || 'Other';
            if (!statsObj[n]) {
              statsObj[n] = { name: n, category: cat, orders: 0, revenue: 0 };
            }
            statsObj[n].orders += 1;
            statsObj[n].revenue += revenuePerItem;
          });
        }
      });
    };

    processOrdersForSellers(currentOrders, productStats);
    processOrdersForSellers(previousOrders, prevProductStats);

    let computedSellers = Object.values(productStats).map(prod => {
      const prevRev = prevProductStats[prod.name]?.revenue || 0;
      let diff = 0;
      if (prevRev === 0 && prod.revenue === 0) diff = 0;
      else if (prevRev === 0) diff = 100;
      else diff = ((prod.revenue - prevRev) / prevRev) * 100;
      
      return {
        name: prod.name,
        category: prod.category.toLowerCase().includes('custom') ? 'Custom Cakes' : prod.category,
        orders: prod.orders,
        revenue: `€${prod.revenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
        trend: `${diff >= 0 ? '+' : ''}${diff.toFixed(1)}%`,
        rawRev: prod.revenue
      };
    }).sort((a, b) => b.rawRev - a.rawRev).slice(0, 5);

    if (computedSellers.length === 0) {
      computedSellers = [{ name: 'No Orders Yet', category: '-', orders: 0, revenue: '€0.00', trend: '0%', rawRev: 0 }];
    }

    const statusCounts = {
      pending: activeOrders.filter(o => o.status === 'pending').length,
      completed: activeOrders.filter(o => o.status === 'completed').length,
      processing: activeOrders.filter(o => o.status === 'processing').length,
      delivered: activeOrders.filter(o => o.status === 'delivered').length,
    };
    
    const totalStatusCount = Object.values(statusCounts).reduce((a, b) => a + b, 0);
    
    const donutData = [
      { name: 'Pending', value: statusCounts.pending, fill: '#FFCA28' }, // Yellow
      { name: 'Completed', value: statusCounts.completed, fill: '#66BB6A' }, // Light Green
      { name: 'Processing', value: statusCounts.processing, fill: '#42A5F5' }, // Blue
      { name: 'Delivered', value: statusCounts.delivered, fill: '#4CAF50' }, // Dark Green
    ];

    return {
      ...baseData,
      chartData: computedChartData,
      categories: computedCategories,
      sellers: computedSellers,
      orderStatusData: { donutData, totalStatusCount },
      metrics: [
        { label: 'Total Revenue', value: `€${current.totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, change: revTrend.text, positive: revTrend.positive, icon: ShoppingCart, bg: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)', color: '#1565C0' },
        { label: 'Total Orders', value: current.totalOrders.toString(), change: ordTrend.text, positive: ordTrend.positive, icon: ShoppingCart, bg: 'linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)', color: '#7B1FA2' },
        { label: 'Avg Order Value', value: `€${current.avgOrderValue.toFixed(2)}`, change: aovTrend.text, positive: aovTrend.positive, icon: Package, bg: 'linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%)', color: '#F57F17' },
        { label: 'Custom Cakes Share', value: `${current.customCakesShare.toFixed(1)}%`, change: customTrend.text, positive: customTrend.positive, icon: Cake, bg: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)', color: '#2E7D32' },
      ]
    };
  }, [allOrders, analyticsTimeframe]);

  // Fetch booked dates from Supabase
  useEffect(() => {
    const fetchBookedDates = async () => {
      if (!isSupabaseLive) {
        console.log('Booked dates: Offline Mode');
        setBookedDates(['2026-05-15', '2026-05-22', '2026-05-28']);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('booked_dates')
          .select('date');
        
        if (error) {
           if (error.message?.includes('fetch') || error.code === 'PGRST301') return;
           throw error;
        }
        if (data) {
          setBookedDates(data.map(d => d.date));
        }
      } catch (err) {
        // Silent fail for network issues
        if (!err.message?.includes('fetch')) {
          console.error('Error fetching booked dates:', err);
        }
        // Fallback for demo
        setBookedDates(['2026-05-15', '2026-05-22', '2026-05-28']);
      }
    };

    fetchBookedDates();
  }, [activeTab]);

  const toggleDate = async (dateStr) => {
    const isBooked = bookedDates.includes(dateStr);
    
    try {
      if (isBooked) {
        // Remove from DB
        const { error } = await supabase
          .from('booked_dates')
          .delete()
          .match({ date: dateStr });
        
        if (error && !error.message?.includes('fetch')) throw error;
        setBookedDates(prev => prev.filter(d => d !== dateStr));
        triggerToast('Date removed from booked calendar! 📅', 'success');
      } else {
        // Add to DB
        const { error } = await supabase
          .from('booked_dates')
          .insert([{ date: dateStr }]);
        
        if (error && !error.message?.includes('fetch')) throw error;
        setBookedDates(prev => [...prev, dateStr]);
        triggerToast('Date marked as fully booked! 🔒', 'success');
      }
    } catch (err) {
      if (!err.message?.includes('fetch')) {
        console.error('Error updating date:', err);
      }
      // Local fallback for demo
      if (isBooked) {
        setBookedDates(prev => prev.filter(d => d !== dateStr));
        triggerToast('Date removed from booked calendar (Offline)! 📅', 'info');
      } else {
        setBookedDates(prev => [...prev, dateStr]);
        triggerToast('Date marked as fully booked (Offline)! 🔒', 'info');
      }
    }
  };

  const [featuredDesserts, setFeaturedDesserts] = useState([
    { slot: 1, name: 'Brownie Selection', price: '€32', description: 'Our most popular brownie assortment, baked fresh daily with premium chocolate.', img: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=800&auto=format&fit=crop', highlights: [], isEmpty: false },
    { slot: 2, name: 'Signature Cupcakes', price: '€15', description: 'A curated selection of our most loved cupcake flavors, perfect for any occasion.', img: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?q=80&w=800&auto=format&fit=crop', highlights: [], isEmpty: false },
    { slot: 3, name: 'Best Seller cake', price: '€45', description: 'Our signature masterpiece cake, loved by everyone for its perfect balance of flavor.', img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop', highlights: [], isEmpty: false },
  ]);
  const [editingFeatured, setEditingFeatured] = useState(null);
  const [highlightModal, setHighlightModal] = useState(null); // { slot: 1 } or null
  const [imageModal, setImageModal] = useState(null); // { slot: 1 } or null
  const [newHighlight, setNewHighlight] = useState({ title: '', text: '' });
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageFile, setNewImageFile] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [newProductImageFile, setNewProductImageFile] = useState(null);
  const [isUploadingProductImage, setIsUploadingProductImage] = useState(false);

  // Fetch featured items from Supabase
  useEffect(() => {
    const fetchFeatured = async () => {
      if (!isSupabaseLive) {
        console.log('Featured items: Offline Mode');
        return;
      }
      try {
        const { data, error } = await supabase
          .from('featured_items')
          .select('*')
          .order('slot');
        
        if (error) {
          // If network error (likely missing backend), fail silently and use defaults
          if (error.message?.includes('fetch')) {
             console.log('Using local featured items (Supabase not connected)');
             return;
          }
          throw error;
        }
        if (data && data.length === 3) {
          const cleaned = data.map(item => ({
            ...item,
            img: getProductImage({ ...item, category: item.slot === 1 ? 'Brownies' : item.slot === 2 ? 'Cupcakes' : 'Cakes' }),
            price: item.price ? item.price.replace(/Starting\s*From\s*/gi, '').replace(/Starting\s*/gi, '') : ''
          }));
          setFeaturedDesserts(cleaned);
        }
      } catch (err) {
        // Only log serious errors, not network resolution issues
        if (!err.message?.includes('fetch')) {
          console.error('Error fetching featured items:', err);
        }
      }
    };

    fetchFeatured();
  }, [activeTab]);

  const handleImageSave = async () => {
    if (!imageModal) return;
    const slot = imageModal.slot;
    const item = featuredDesserts.find(d => d.slot === slot);
    let finalImageUrl = newImageUrl || imageModal.currentImg;

    if (newImageFile) {
      setIsUploadingImage(true);
      try {
        const optimizedFile = await optimizeAndConvertToWebP(newImageFile);
        
        const newFileName = `slot-${slot}-${Date.now()}.webp`;
        
        // Delete old image if it exists in the bucket
        if (item.img && item.img.includes('featured-images/')) {
          const bucketIndex = item.img.indexOf('featured-images/');
          if (bucketIndex !== -1) {
            const oldFileName = item.img.substring(bucketIndex + 'featured-images/'.length).split('?')[0];
            if (oldFileName) {
              await supabase.storage.from('featured-images').remove([oldFileName]);
            }
          }
        }
        
        // Upload new image
        const { error: uploadError } = await supabase.storage
          .from('featured-images')
          .upload(newFileName, optimizedFile, { upsert: true, contentType: 'image/webp' });
          
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('featured-images')
          .getPublicUrl(newFileName);
          
        finalImageUrl = publicUrl;
      } catch (err) {
        console.error('Error uploading image:', err);
        triggerToast('Failed to upload image', 'error');
        setIsUploadingImage(false);
        return;
      }
      setIsUploadingImage(false);
    }

    handleUpdateFeatured(slot, { ...item, img: finalImageUrl });
    setNewImageUrl('');
    setNewImageFile(null);
    setImageModal(null);
  };

  const handleUpdateFeatured = async (slot, updatedItem) => {
    try {
      const { error } = await supabase
        .from('featured_items')
        .upsert({ ...updatedItem, slot });
      
      if (error && !error.message?.includes('fetch')) throw error;
      
      setFeaturedDesserts(prev => prev.map(item => 
        item.slot === slot ? updatedItem : item
      ));
      setEditingFeatured(null);
      if (!error) triggerToast('Featured card updated successfully! ✨', 'success');
    } catch (err) {
      if (!err.message?.includes('fetch')) {
        console.error('Error saving featured item:', err);
      }
      // Fallback update local state for demo
      setFeaturedDesserts(prev => prev.map(item => 
        item.slot === slot ? updatedItem : item
      ));
      setEditingFeatured(null);
      triggerToast('Local featured details updated! (Supabase Offline)', 'info');
    }
  };

  const handleUpdateProduct = async (id, updatedData) => {
    // Save to Supabase
    setIsUploadingProductImage(true);
    try {
      let finalImgUrl = undefined;
      const product = allProducts.find(p => p.id === id);

      if (updatedData.file) {
        const optimizedFile = await optimizeAndConvertToWebP(updatedData.file);
        
        const newFileName = `product-${id}-${Date.now()}.webp`;
        const currentImg = product.img;
        
        // Delete old image if it exists in the bucket
        if (currentImg && currentImg.includes('product-images/')) {
          const bucketIndex = currentImg.indexOf('product-images/');
          if (bucketIndex !== -1) {
            const oldFileName = currentImg.substring(bucketIndex + 'product-images/'.length).split('?')[0];
            if (oldFileName) {
              await supabase.storage.from('product-images').remove([oldFileName]);
            }
          }
        }
        
        // Upload new image with unique name
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(newFileName, optimizedFile, { contentType: 'image/webp' });
          
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(newFileName);
          
        finalImgUrl = `${publicUrl}?t=${Date.now()}`;
      }

      // Preserve __gallery_images from existing product options so gallery is not lost on save
      const existingGalleryOption = (product.options || []).filter(o => o.name === '__gallery_images');
      const cleanOptions = [...(updatedData.options || []).filter(o => o.name !== '__gallery_images'), ...existingGalleryOption];

      if (isSupabaseLive) {
        const payload = {
          name: updatedData.name,
          price: updatedData.price,
          flavours: updatedData.flavours || [],
          spreads: updatedData.spreads || [],
          portions: updatedData.portions,
          description: updatedData.description,
          options: cleanOptions,
          status: updatedData.status
        };
        if (finalImgUrl) payload.img = finalImgUrl;

        if (product.isNew) {
          payload.id = id;
          payload.category = product.category;
          payload.created_at = new Date().toISOString();
          const { error } = await supabase.from('products').insert([payload]);
          if (error && !error.message?.includes('fetch')) throw error;
        } else {
          const { error } = await supabase.from('products').update(payload).eq('id', id);
          if (error && !error.message?.includes('fetch')) throw error;
        }
      }
      
      const updateObj = {
        ...updatedData,
        options: cleanOptions
      };
      delete updateObj.file;
      if (finalImgUrl) updateObj.img = finalImgUrl;
      updateObj.isNew = false;

      setAllProducts(prev => prev.map(p => p.id === id ? { ...p, ...updateObj } : p));
      setEditProductModal(null);
      triggerToast('Product details updated successfully! ✨', 'success');
    } catch (err) {
      console.error('Error updating product:', err);
      triggerToast('Error saving to database.', 'error');
    }
    setIsUploadingProductImage(false);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    // Auto-delete inspiration images if order is completed
    if (newStatus === 'completed' && isSupabaseLive) {
      const order = allOrders.find(o => o.id === orderId);
      if (order && order.details) {
        let urlsToDelete = [];
        // Add order-level images (if any)
        if (order.details.referenceImg) urlsToDelete.push(order.details.referenceImg);
        if (order.details.referenceImages) urlsToDelete.push(...order.details.referenceImages);
        
        // Add item-level images
        if (order.details.items) {
          order.details.items.forEach(item => {
            if (item.referenceImg) urlsToDelete.push(item.referenceImg);
            if (item.refImageUrl) urlsToDelete.push(item.refImageUrl);
            if (item.referenceImages) urlsToDelete.push(...item.referenceImages);
          });
        }

        // Only delete URLs from the specific bucket
        const fileNamesToDelete = urlsToDelete
          .filter(url => typeof url === 'string' && (url.includes('customer-uploads') || url.includes('inspiration-images')))
          .map(url => {
            // Extract the filename after the bucket name
            const parts = url.split('/');
            return parts[parts.length - 1];
          });

        if (fileNamesToDelete.length > 0) {
          try {
            await supabase.storage.from('inspiration-images').remove(fileNamesToDelete);
            await supabase.storage.from('customer-uploads').remove(fileNamesToDelete);
            console.log('Cleaned up inspiration images:', fileNamesToDelete);
          } catch (err) {
            console.error('Failed to clean up inspiration images:', err);
          }
        }
      }
    }

    setAllOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    setSelectedOrder(prev => ({ ...prev, status: newStatus }));
    // Persist to Supabase
    if (isSupabaseLive) {
      try {
        const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
        if (error && !error.message?.includes('fetch')) console.error('Error updating order status:', error);
      } catch (err) {
        console.error('Error updating order status:', err);
      }
    }
  };

  const filteredOrders = allOrders.filter(order => {
    // 1. Status Filter
    const matchesStatus = orderStatusFilter === 'all' || order.status === orderStatusFilter;
    if (!matchesStatus) return false;
    
    // 2. Search Query Filter (case-insensitive query matching id, name, item type, or flavor)
    if (!orderSearchQuery.trim()) return true;
    const query = orderSearchQuery.toLowerCase();
    
    const matchesId = (order.id || '').toLowerCase().includes(query);
    const matchesCustomer = (order.customer || '').toLowerCase().includes(query);
    
    const matchesMainItem = (order.details?.itemType || '').toLowerCase().includes(query);
    const matchesFlavor = (order.details?.flavor || '').toLowerCase().includes(query);
    
    const matchesSubItems = (order.details?.items || []).some(item => 
      (item.itemType || '').toLowerCase().includes(query) || 
      (item.flavor || '').toLowerCase().includes(query)
    );
    
    return matchesId || matchesCustomer || matchesMainItem || matchesFlavor || matchesSubItems;
  });


  const hasUnsavedSettingsChanges = JSON.stringify(storeSettings) !== JSON.stringify(originalStoreSettings);
  const hasUnsavedAvailabilityChanges = JSON.stringify(storeAvailability) !== JSON.stringify(originalStoreAvailability);
  const hasAnyUnsavedChanges = activeTab === 'settings' && (hasUnsavedSettingsChanges || hasUnsavedAvailabilityChanges);

  return (
    <div className="admin-layout">
      {hasAnyUnsavedChanges && (
        <div style={{ position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)', background: '#333', color: '#fff', padding: '12px 24px', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', zIndex: 99999, animation: 'slideUpPopup 0.3s ease-out' }}>
          <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>You have unsaved changes in settings.</span>
          <button 
            onClick={async () => {
              if (hasUnsavedSettingsChanges) {
                await handleSaveSettings({ preventDefault: () => {} });
              }
              if (hasUnsavedAvailabilityChanges) {
                await handleSaveAvailability({ preventDefault: () => {} });
              }
            }}
            disabled={isSavingSettings || isSavingAvailability}
            style={{ background: '#4caf50', color: '#fff', border: 'none', padding: '6px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600', cursor: (isSavingSettings || isSavingAvailability) ? 'not-allowed' : 'pointer', opacity: (isSavingSettings || isSavingAvailability) ? 0.7 : 1 }}
          >
            {(isSavingSettings || isSavingAvailability) ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          minibakes <span style={{fontSize: '12px', color: '#666', fontFamily: 'sans-serif', fontWeight: 'normal', letterSpacing: '1px'}}>ADMIN</span>
        </div>
        <nav className="admin-nav">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`admin-nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon size={20} />
                {item.label}
              </button>
            )
          })}
        </nav>
        <div style={{ marginTop: 'auto', padding: '0 16px' }}>
            <button className="admin-nav-item" style={{ width: '100%', color: '#666' }} onClick={async () => { await supabase.auth.signOut(); }}>
              <LogOut size={20} />
              Exit Admin
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {/* Header */}
        <header className="admin-header">
          <div className="admin-header-title">
            {navItems.find(i => i.id === activeTab)?.label}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            {activeTab === 'orders' && (
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', backgroundColor: '#f1f3f5', borderRadius: '8px', padding: '8px 12px' }}>
                  <Search size={16} color="#888" style={{ marginRight: '8px' }} />
                  <input 
                    type="text" 
                    placeholder="Search orders..." 
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '14px', width: '180px' }} 
                  />
                  {orderSearchQuery && (
                    <button 
                      onClick={() => setOrderSearchQuery('')}
                      style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0 4px', marginLeft: '4px' }}
                    >
                      <X size={14} />
                    </button>
                  )}
              </div>
            )}
            <button 
              onClick={() => setShowNotifications(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', position: 'relative' }}
            >
                <Bell size={20} />
                <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '8px', height: '8px', background: '#ff4d4d', borderRadius: '50%', border: '2px solid #fff' }}></span>
            </button>
            <div className="admin-user-profile">
              <div className="admin-avatar" aria-hidden="true" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Cake size={20} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: '500' }}>Store Administrator</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="admin-content">
          {activeTab === 'dashboard' && (
            <>
              <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid #e9ecef', paddingBottom: '20px' }}>
                <div>
                  <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#1a1a1a', margin: '0 0 6px 0' }}>
                    Welcome back
                  </h1>
                  <p style={{ color: '#666', margin: '0', fontSize: '14px' }}>
                    Here is a comprehensive overview of your store's performance today.
                  </p>
                </div>
                <div style={{ textAlign: 'right', fontSize: '13px', background: '#f8f9fa', padding: '10px 16px', borderRadius: '8px', border: '1px solid #e9ecef' }}>
                  <div style={{ fontWeight: '600', color: '#333', marginBottom: '2px' }}>{formattedDate}</div>
                  <div style={{ color: '#666', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                    <span style={{ display: 'inline-block', width: '6px', height: '6px', backgroundColor: '#2E7D32', borderRadius: '50%' }}></span>
                    System Time: {formattedTime}
                  </div>
                </div>
              </div>

              {(() => {
                const computedOrders = allOrders.length;
                const computedProducts = allProducts.length;
                const computedEarnings = allOrders.reduce((sum, order) => {
                  const val = parseFloat(order.total?.replace(/[^\d.]/g, '') || '0');
                  return sum + val;
                }, 0);
                const computedVisitors = dynamicCustomers.length * 3 + 124; // Simulated visitor metric

                const displayOrders = computedOrders > 0 ? computedOrders : 'No Data';
                const displayVisitors = computedVisitors > 124 ? computedVisitors : 'No Data';
                const displayProducts = computedProducts > 0 ? computedProducts : 'No Data';
                const displayEarnings = computedEarnings > 0 ? `€${computedEarnings.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : 'No Data';

                return (
                  <div className="metrics-grid">
                    <div className="metric-card">
                      <div className="metric-icon-box" style={{backgroundColor: '#E3F2FD', color: '#1565C0'}}><ShoppingCart size={24} /></div>
                      <div className="metric-info">
                        <h3>Total Orders</h3>
                        <p>{displayOrders}</p>
                      </div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-icon-box" style={{backgroundColor: '#F3E5F5', color: '#7B1FA2'}}><Users size={24} /></div>
                      <div className="metric-info">
                        <h3>Total Visitors</h3>
                        <p>{displayVisitors}</p>
                      </div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-icon-box" style={{backgroundColor: '#FFF8E1', color: '#F57F17'}}><Package size={24} /></div>
                      <div className="metric-info">
                        <h3>Total Products</h3>
                        <p>{displayProducts}</p>
                      </div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-icon-box" style={{backgroundColor: '#E8F5E9', color: '#2E7D32'}}><LayoutDashboard size={24} /></div>
                      <div className="metric-info">
                        <h3>Total Earnings</h3>
                        <p>{displayEarnings}</p>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div className="admin-panel">
                <h2 className="admin-panel-title">Recent Activity</h2>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Activity ID</th>
                      <th>Action</th>
                      <th>Target</th>
                      <th>Time</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentActivities.map(activity => (
                      <tr key={activity.id}>
                        <td style={{fontWeight: '600', color: '#888'}}>{activity.id}</td>
                        <td style={{fontWeight: '500'}}>{activity.action}</td>
                        <td>{activity.target}</td>
                        <td style={{color: '#666'}}>{activity.time}</td>
                        <td>
                          <span className={`status-badge ${activity.status}`}>
                            {activity.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === 'analytics' && (
            <>
              {/* Header section with Timeframe Selector */}
              <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e9ecef', paddingBottom: '20px' }}>
                <div>
                  <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#1a1a1a', margin: '0 0 6px 0' }}>
                    Store Insights & Analytics
                  </h1>
                  <p style={{ color: '#666', margin: '0', fontSize: '14px' }}>
                    Track your sales trend, top performing products, and booking metrics.
                  </p>
                </div>
                <div style={{ display: 'flex', backgroundColor: '#f1f3f5', padding: '4px', borderRadius: '8px' }}>
                  {[
                    { id: 'this-week', label: 'This Week' },
                    { id: 'this-month', label: 'This Month' },
                    { id: 'all-time', label: 'All Time' }
                  ].map(tf => (
                    <button
                      key={tf.id}
                      onClick={() => setAnalyticsTimeframe(tf.id)}
                      style={{
                        padding: '8px 16px',
                        border: 'none',
                        borderRadius: '6px',
                        backgroundColor: analyticsTimeframe === tf.id ? '#fff' : 'transparent',
                        color: analyticsTimeframe === tf.id ? 'var(--secondary)' : '#666',
                        fontWeight: analyticsTimeframe === tf.id ? '600' : '500',
                        fontSize: '13px',
                        cursor: 'pointer',
                        boxShadow: analyticsTimeframe === tf.id ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {tf.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Analytics Metric Cards Grid */}
              <div className="metrics-grid" style={{ marginBottom: '32px' }}>
                {realAnalyticsData.metrics.map((metric, idx) => {
                  const Icon = metric.icon;
                  return (
                    <div key={idx} className="metric-card-premium">
                      <div className="metric-icon-premium" style={{ background: metric.bg, color: metric.color }}>
                        <Icon size={26} strokeWidth={2.5} />
                      </div>
                      <div className="metric-info-premium">
                        <h3>{metric.label}</h3>
                        <p>{metric.value}</p>
                      </div>
                      <span className="metric-change-pill" style={{
                        backgroundColor: metric.positive ? 'rgba(232, 245, 233, 0.8)' : 'rgba(255, 235, 238, 0.8)',
                        color: metric.positive ? '#2E7D32' : '#C62828',
                        border: `1px solid ${metric.positive ? 'rgba(46,125,50,0.2)' : 'rgba(198,40,40,0.2)'}`
                      }}>
                        <TrendingUp size={14} strokeWidth={3} />
                        {metric.change}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Two Column Graphs/Insights Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
                {/* Revenue Trend Chart */}
                <div className="admin-panel" style={{ margin: 0, display: 'flex', flexDirection: 'column' }}>
                  <h2 className="admin-panel-title">Sales Revenue Trend</h2>
                  <div style={{ width: '100%', height: '300px', marginTop: '16px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={realAnalyticsData.chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f3f5" />
                        <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} />
                        <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `€${val}`} />
                        <Tooltip
                          formatter={(value) => [`€${value}`, 'Revenue']}
                          contentStyle={{ backgroundColor: '#fff', border: '1px solid #e9ecef', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                        />
                        <Bar dataKey="revenue" fill="var(--secondary)" radius={[6, 6, 0, 0]}>
                          {realAnalyticsData.chartData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={index === realAnalyticsData.chartData.length - 1 ? 'var(--secondary)' : '#d48a97'} 
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Categories Share breakdown */}
                <div className="admin-panel" style={{ margin: 0, display: 'flex', flexDirection: 'column' }}>
                  <h2 className="admin-panel-title">Category Share</h2>
                  <div className="custom-scrollbar" style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, overflowY: 'auto', paddingRight: '8px', maxHeight: '260px' }}>
                    {realAnalyticsData.categories.map((cat, idx) => (
                      <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px' }}>
                          <span style={{ fontWeight: '500', color: '#333', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ display: 'inline-block', width: '10px', height: '10px', backgroundColor: cat.fill, borderRadius: '50%' }}></span>
                            {cat.name}
                          </span>
                          <span style={{ fontWeight: '600', color: '#1a1a1a' }}>{cat.percentage}</span>
                        </div>
                        {/* Custom Progress Bar */}
                        <div style={{ width: '100%', height: '8px', backgroundColor: '#f1f3f5', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: cat.percentage, height: '100%', backgroundColor: cat.fill, borderRadius: '4px' }}></div>
                        </div>
                        <span style={{ fontSize: '12px', color: '#666', textAlign: 'right' }}>Total: {cat.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Status Donut Chart */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', marginBottom: '32px' }}>
                <div className="admin-panel" style={{ margin: 0 }}>
                  <h2 className="admin-panel-title">Order Status</h2>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '60px', marginTop: '24px' }}>
                    <div style={{ position: 'relative', width: '220px', height: '220px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={realAnalyticsData.orderStatusData.donutData}
                            cx="50%"
                            cy="50%"
                            innerRadius={65}
                            outerRadius={90}
                            paddingAngle={2}
                            dataKey="value"
                            stroke="none"
                          >
                            {realAnalyticsData.orderStatusData.donutData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '32px', fontWeight: '800', margin: 0, color: '#333', lineHeight: '1' }}>{realAnalyticsData.orderStatusData.totalStatusCount}</span>
                        <span style={{ fontSize: '14px', color: '#666', fontWeight: '600', marginTop: '4px' }}>Total</span>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      {realAnalyticsData.orderStatusData.donutData.map((entry, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: entry.fill }} />
                          <span style={{ fontWeight: '700', color: '#444', fontSize: '15px' }}>{entry.name} <span style={{ color: '#666', fontWeight: '600' }}>({entry.value})</span></span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Best Performing Items & Bookings Insight */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                {/* Popular Sellers Table */}
                <div className="admin-panel" style={{ margin: 0 }}>
                  <h2 className="admin-panel-title">Best Sellers</h2>
                  <table className="admin-table" style={{ marginTop: '16px' }}>
                    <thead>
                      <tr>
                        <th>Product / Item</th>
                        <th>Category</th>
                        <th style={{ textAlign: 'center' }}>Orders</th>
                        <th style={{ textAlign: 'right' }}>Revenue</th>
                        <th style={{ textAlign: 'right' }}>Growth</th>
                      </tr>
                    </thead>
                    <tbody>
                      {realAnalyticsData.sellers.map((seller, idx) => (
                        <tr key={idx}>
                          <td style={{ fontWeight: '600', color: '#333' }}>{seller.name}</td>
                          <td style={{ color: '#666' }}>{seller.category}</td>
                          <td style={{ textAlign: 'center', fontWeight: '500' }}>{seller.orders}</td>
                          <td style={{ textAlign: 'right', fontWeight: '600', color: 'var(--secondary)' }}>{seller.revenue}</td>
                          <td style={{ textAlign: 'right', color: seller.trend.startsWith('+') ? '#2E7D32' : '#C62828', fontWeight: '600' }}>
                            {seller.trend}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Additional conversion rate / booking insight card */}
                <div className="admin-panel" style={{ margin: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'linear-gradient(to bottom right, #fff, #FFF0F4)', border: '1px solid #FFD1DC' }}>
                  <div>
                    <h2 className="admin-panel-title" style={{ color: 'var(--secondary)' }}>Booking Capacity</h2>
                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                      <div style={{ fontSize: '48px', fontWeight: '800', color: 'var(--secondary)', lineHeight: '1', marginBottom: '8px' }}>
                        {Math.min(Math.round((bookedDates.length / 30) * 100), 100)}%
                      </div>
                      <p style={{ fontSize: '14px', color: '#666', fontWeight: '500', margin: '0' }}>{new Date().toLocaleString('default', { month: 'long' })} Slots Status</p>
                    </div>

                    <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '8px' }}>
                        <span style={{ color: '#666' }}>Total Capacity Slots:</span>
                        <span style={{ fontWeight: '600', color: '#333' }}>30 Slots</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '8px' }}>
                        <span style={{ color: '#666' }}>Active Booked Dates:</span>
                        <span style={{ fontWeight: '600', color: '#333' }}>{bookedDates.length} Dates</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', paddingBottom: '8px' }}>
                        <span style={{ color: '#666' }}>Avg. Lead Time:</span>
                        <span style={{ fontWeight: '600', color: '#333' }}>14 Days</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ backgroundColor: 'rgba(92, 13, 27, 0.05)', borderRadius: '12px', padding: '16px', marginTop: '24px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <Sparkles size={20} color="var(--secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <p style={{ fontSize: '12px', color: 'var(--secondary)', margin: '0', lineHeight: '1.5', fontWeight: '500' }}>
                      <strong>Pro tip:</strong> Monitor your booking capacity closely. If you exceed 80% consistently, consider adjusting your lead times!
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'orders' && (
            <div className="admin-panel" style={{ minHeight: '600px' }}>
              <div className="admin-mobile-hide" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #e9ecef', paddingBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <h2 className="admin-panel-title" style={{ margin: 0, border: 'none', padding: 0 }}>Orders Management</h2>
                  <button 
                    onClick={fetchOrders} 
                    disabled={isRefreshingOrders}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      background: '#f8f9fa',
                      border: '1px solid #ddd',
                      color: '#444',
                      cursor: isRefreshingOrders ? 'not-allowed' : 'pointer',
                      fontSize: '13px',
                      fontWeight: '600',
                      transition: 'all 0.2s',
                      opacity: isRefreshingOrders ? 0.7 : 1
                    }}
                  >
                    <RefreshCw size={14} className={isRefreshingOrders ? 'spin-anim' : ''} />
                    {isRefreshingOrders ? 'Refreshing...' : 'Refresh'}
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['all', 'pending', 'processing', 'completed', 'delivered', 'cancelled'].map(status => (
                    <button 
                      key={status}
                      onClick={() => setOrderStatusFilter(status)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '20px',
                        border: '1px solid',
                        borderColor: orderStatusFilter === status ? 'var(--color-main, #800000)' : '#e9ecef',
                        backgroundColor: orderStatusFilter === status ? '#FFF0F4' : '#fff',
                        color: orderStatusFilter === status ? 'var(--color-main, #800000)' : '#666',
                        fontWeight: orderStatusFilter === status ? '600' : '500',
                        cursor: 'pointer',
                        textTransform: 'capitalize',
                        transition: '0.2s'
                      }}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length > 0 ? filteredOrders.map(order => (
                    <tr key={order.id}>
                      <td style={{fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px'}}>
                        {order.id}
                        {(order.details?.referenceImg || order.details?.referenceImages?.length > 0 || order.details?.items?.some(i => i.referenceImg || i.refImageUrl || i.referenceImages?.length > 0)) && (
                          <span title="Contains Inspiration Image" style={{ display: 'inline-flex', color: '#ff4081' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                          </span>
                        )}
                      </td>
                      <td>{order.customer}</td>
                      <td>{order.date}</td>
                      <td style={{fontWeight: '600'}}>{order.total}</td>
                      <td>
                        <span className={`status-badge ${order.status}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <button onClick={() => { setSelectedOrder(order); setActiveOrderItemIndex(0); }} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer', fontSize: '12px' }}>View</button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#888' }}>No {orderStatusFilter !== 'all' ? orderStatusFilter : ''} orders found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="admin-panel" style={{ minHeight: '600px' }}>
              {/* Featured Section */}
              <div style={{ marginBottom: '40px', background: '#fff9fa', padding: '24px', borderRadius: '16px', border: '1px solid #ffebee' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '20px', color: '#800000', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Sparkles size={20} /> Home Page Featured Desserts
                    </h2>
                    <p style={{ color: '#666', fontSize: '13px', margin: '4px 0 0 0' }}>Manage the three main highlight cards on your home page.</p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                  {featuredDesserts.map((item) => (
                    <div key={item.slot} className="premium-card" style={{ padding: 0, border: editingFeatured === item.slot ? '2px solid #800000' : '1px solid #eee', position: 'relative', overflow: 'hidden', minHeight: '520px', display: 'flex', flexDirection: 'column' }}>
                      
                      {/* View Mode Layer */}
                      <div style={{ 
                        padding: '16px',
                        display: 'flex', 
                        flexDirection: 'column', 
                        height: '100%',
                        width: '100%',
                        transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease',
                        transform: editingFeatured === item.slot ? 'translateY(-100%)' : 'translateY(0)',
                        opacity: editingFeatured === item.slot ? 0 : 1,
                        position: editingFeatured === item.slot ? 'absolute' : 'relative',
                        zIndex: editingFeatured === item.slot ? 0 : 1,
                        pointerEvents: editingFeatured === item.slot ? 'none' : 'auto'
                      }}>
                        <div style={{ width: '100%', aspectRatio: '1.2', borderRadius: '8px', background: '#f8f9fa', marginBottom: '12px', overflow: 'hidden', position: 'relative' }}>
                          {item.isEmpty ? (
                            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#ccc', gap: '8px' }}>
                              <Package size={40} opacity={0.3} />
                              <span style={{ fontSize: '12px', fontWeight: 'bold' }}>EMPTY SLOT</span>
                            </div>
                          ) : (
                            <img src={getProductImage(item)} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          )}
                          <div style={{ position: 'absolute', top: '8px', right: '8px', background: '#800000', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>SLOT {item.slot}</div>
                          
                          {!item.isEmpty && (
                            <button 
                              onClick={() => setImageModal({ slot: item.slot, currentImg: item.img })}
                              style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                              title="Change Image"
                            >
                              <ImageIcon size={14} color="#666" />
                            </button>
                          )}
                        </div>
                        
                        <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', opacity: item.isEmpty ? 0.3 : 1 }}>{item.isEmpty ? 'New Featured Product' : item.name}</h3>
                        
                        <p style={{ margin: '0 0 16px 0', fontSize: '12px', color: '#666', lineHeight: '1.4', minHeight: '3.2em', opacity: item.isEmpty ? 0.3 : 1 }}>
                          {item.isEmpty ? 'Add a description for your new featured highlight...' : item.description}
                        </p>
                        
                        <div style={{ marginBottom: '16px', opacity: item.isEmpty ? 0.3 : 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                             <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#888' }}>HIGHLIGHTS</span>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                             {!item.isEmpty && item.highlights && item.highlights.map((h, i) => (
                               <div key={i} style={{ padding: '8px', background: '#fcfcfc', border: '1px solid #eee', borderRadius: '6px', position: 'relative' }}>
                                 <div style={{ fontSize: '11px', fontWeight: '700', color: '#333', marginBottom: '2px' }}>{h.title}</div>
                                 <div style={{ fontSize: '10px', color: '#666' }}>{h.text}</div>
                                 <button 
                                   onClick={() => {
                                     const updated = { ...item, highlights: item.highlights.filter((_, idx) => idx !== i) };
                                     handleUpdateFeatured(item.slot, updated);
                                   }}
                                   style={{ position: 'absolute', top: '4px', right: '4px', background: 'none', border: 'none', color: '#ccc', cursor: 'pointer' }}
                                 >
                                   <X size={10} />
                                 </button>
                               </div>
                             ))}
                             {(item.isEmpty || !item.highlights || item.highlights.length === 0) && (
                               <p style={{ fontSize: '11px', color: '#aaa', fontStyle: 'italic', margin: 0 }}>No highlights added.</p>
                             )}
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                          <button 
                            onClick={() => {
                              if (item.isEmpty) {
                                handleUpdateFeatured(item.slot, { ...item, isEmpty: false });
                              }
                              setEditingFeatured(item.slot);
                            }}
                            style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #ddd', background: item.isEmpty ? '#800000' : '#fff', color: item.isEmpty ? '#fff' : '#333', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px', fontWeight: item.isEmpty ? 'bold' : '500' }}
                          >
                            {item.isEmpty ? <Plus size={14} /> : <Edit3 size={14} />} {item.isEmpty ? 'Add Product' : 'Edit Basics'}
                          </button>
                          
                          {!item.isEmpty && (
                            <button 
                              onClick={() => {
                                if (confirm('Are you sure you want to clear this featured slot?')) {
                                  handleUpdateFeatured(item.slot, { ...item, isEmpty: true });
                                }
                              }}
                              style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ffebee', background: '#fffcfc', color: '#ff4d4d', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              title="Remove from featured"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Edit Mode Layer */}
                      <div style={{ 
                        padding: '16px',
                        display: 'flex', 
                        flexDirection: 'column', 
                        height: '100%',
                        width: '100%',
                        transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s ease',
                        transform: editingFeatured === item.slot ? 'translateY(0)' : 'translateY(100%)',
                        opacity: editingFeatured === item.slot ? 1 : 0,
                        position: editingFeatured === item.slot ? 'relative' : 'absolute',
                        top: 0, left: 0,
                        zIndex: editingFeatured === item.slot ? 1 : 0,
                        pointerEvents: editingFeatured === item.slot ? 'auto' : 'none'
                      }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: '100%' }}>
                          <div className="form-group">
                            <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#888' }}>NAME</label>
                            <input 
                              type="text" 
                              defaultValue={item.name} 
                              id={`name-${item.slot}`}
                              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}
                            />
                          </div>
                          <div className="form-group">
                            <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#888' }}>PRICE TEXT</label>
                            <input 
                              type="text" 
                              defaultValue={item.price} 
                              id={`price-${item.slot}`}
                              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}
                            />
                          </div>
                          <div className="form-group">
                            <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#888' }}>DESCRIPTION</label>
                            <textarea 
                              defaultValue={item.description} 
                              id={`desc-${item.slot}`}
                              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd', minHeight: '60px' }}
                            />
                          </div>

                          <div style={{ marginBottom: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                               <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#888' }}>HIGHLIGHTS</span>
                               <button 
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   setHighlightModal({ slot: item.slot });
                                 }}
                                 style={{ background: '#FFF0F4', border: 'none', color: '#800000', borderRadius: '4px', padding: '2px 6px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                               >
                                 <Plus size={10} /> Add
                               </button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '100px', overflowY: 'auto' }}>
                               {item.highlights && item.highlights.map((h, i) => (
                                 <div key={i} style={{ fontSize: '10px', color: '#666', background: '#f9f9f9', padding: '4px 8px', borderRadius: '4px', border: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                                   <span>{h.title}</span>
                                   <button 
                                     onClick={() => {
                                       const updated = { ...item, highlights: item.highlights.filter((_, idx) => idx !== i) };
                                       handleUpdateFeatured(item.slot, updated);
                                     }}
                                     style={{ background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', padding: 0 }}
                                   >
                                     <X size={10} />
                                   </button>
                                 </div>
                               ))}
                            </div>
                          </div>
                          
                          <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                            <button 
                              onClick={() => {
                                const updated = {
                                  ...item,
                                  name: document.getElementById(`name-${item.slot}`).value,
                                  price: document.getElementById(`price-${item.slot}`).value,
                                  description: document.getElementById(`desc-${item.slot}`).value,
                                };
                                handleUpdateFeatured(item.slot, updated);
                              }}
                              style={{ flex: 1, padding: '8px', borderRadius: '6px', background: '#800000', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontWeight: '600' }}
                            >
                              <Save size={14} /> Save
                            </button>
                            <button 
                              onClick={() => setEditingFeatured(null)}
                              style={{ padding: '8px 12px', borderRadius: '6px', background: '#f5f5f5', border: '1px solid #ddd', cursor: 'pointer' }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #e9ecef', paddingBottom: '16px' }}>
                <h2 className="admin-panel-title" style={{ margin: 0, border: 'none', padding: 0 }}>All Products</h2>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <select 
                    value={productCategoryFilter} 
                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                    style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #ddd', background: '#fff', fontSize: '14px', outline: 'none', cursor: 'pointer', minWidth: '150px' }}
                  >
                    {productCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <button 
                    onClick={() => setIsAddProductModalOpen(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#800000', color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: '0.2s' }}
                  >
                    <Plus size={16} /> Add Product
                  </button>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
                {filteredProducts.map(product => (
                  <div key={product.id} className="premium-card" style={{ padding: 0, borderRadius: '14px', overflow: 'hidden', border: '1px solid #e9ecef', boxShadow: '0 4px 12px rgba(0,0,0,0.04)', background: '#fff', display: 'flex', flexDirection: 'column' }}>
                    <AdminProductImage product={product} />
                    <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <h3 style={{ margin: '0 0 3px 0', fontSize: '15px', color: '#111', fontWeight: '700', lineHeight: '1.3' }}>{product.name}</h3>
                      <div style={{ color: 'var(--color-main)', fontWeight: '700', fontSize: '14px', marginBottom: '8px' }}>{product.price}</div>
                      <div style={{ fontSize: '11px', color: '#999', marginBottom: '12px' }}>{product.category}{product.subcategory ? ` · ${product.subcategory}` : ''}</div>
                      <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => {
                            const opts = (product.options || []).filter(o => o.name !== '__gallery_images');
                            
                            const isCake = product.category === 'Cakes';
                            const isCupcake = product.category === 'Cupcakes';
                            const pid = (product.id || '').toString();
                            const isBreakableHeart = pid.startsWith('t1');
                            const isCakesicleBulk = pid.startsWith('t2');

                            let defaultFlavours = [];
                            if (product.flavours && product.flavours.length > 0) {
                              defaultFlavours = product.flavours;
                            } else if (isCake || isCupcake || pid.startsWith('cp') || pid.startsWith('t3') || pid.startsWith('t4') || isBreakableHeart || isCakesicleBulk) {
                              defaultFlavours = ['Vanilla', 'Chocolate', 'Red Velvet'];
                            } else {
                              defaultFlavours = ['Classic Chocolate'];
                            }

                            let defaultSpreads = [];
                            if (product.spreads && product.spreads.length > 0) {
                              defaultSpreads = product.spreads;
                            } else if (isCake) {
                              defaultSpreads = ['Nutella', 'Biscoff', 'Pistachio', 'Kinder', 'White Chocolate', 'Ferrero Rocher'];
                            } else {
                              defaultSpreads = ['Nutella', 'Biscoff', 'Pistachio', 'Kinder'];
                            }

                            setEditProductModal({
                              product,
                              form: {
                                name: product.name || '',
                                price: product.price || '',
                                portions: product.portions || '',
                                description: product.description || '',
                                status: product.status || 'In Stock',
                                flavours: defaultFlavours,
                                spreads: defaultSpreads,
                              },
                              options: opts,
                              imageFile: null,
                              imagePreview: null
                            });
                          }}
                          style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #e0e0e0', background: '#fafafa', color: '#333', cursor: 'pointer', fontSize: '13px', fontWeight: '600', transition: '0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                        >
                          <Edit3 size={14} /> Edit
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Delete this product?')) {
                              setAllProducts(prev => prev.filter(p => p.id !== product.id));
                              if (isSupabaseLive) {
                                supabase.from('products').delete().eq('id', product.id)
                                  .then(({ error }) => { if (error) console.error('Error deleting product:', error); });
                              }
                            }
                          }}
                          style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #ffcdd2', background: '#fffcfc', color: '#c62828', cursor: 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          title="Delete Product"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'customers' && (
            <div className="admin-panel" style={{ minHeight: '600px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #e9ecef', paddingBottom: '16px' }}>
                <h2 className="admin-panel-title" style={{ margin: 0, border: 'none', padding: 0 }}>Customer Engagement Analytics</h2>
              </div>
              
              <div className="metrics-grid" style={{ marginBottom: '32px', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
                <div className="metric-card">
                  <div className="metric-icon-box" style={{backgroundColor: '#e3f2fd', color: '#1565c0'}}><Users size={24} /></div>
                  <div className="metric-info">
                    <h3 style={{ fontSize: '13px', color: '#666', margin: '0 0 4px 0', textTransform: 'uppercase', fontWeight: '600' }}>Web Customers</h3>
                    <p style={{ fontSize: '24px', fontWeight: '700', margin: '0', color: '#111' }}>{dynamicCustomers.length}</p>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-icon-box" style={{backgroundColor: '#fff8e1', color: '#f57f17'}}><LayoutDashboard size={24} /></div>
                  <div className="metric-info">
                    <h3 style={{ fontSize: '13px', color: '#666', margin: '0 0 4px 0', textTransform: 'uppercase', fontWeight: '600' }}>Returning</h3>
                    <p style={{ fontSize: '24px', fontWeight: '700', margin: '0', color: '#111' }}>{customerInsights.returningRate}%</p>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-icon-box" style={{backgroundColor: '#fce4ec', color: '#c2185b'}}><InstagramIcon size={24} color="#c2185b" /></div>
                  <div className="metric-info">
                    <h3 style={{ fontSize: '13px', color: '#666', margin: '0 0 4px 0', textTransform: 'uppercase', fontWeight: '600' }}>Instagram</h3>
                    <p style={{ fontSize: '24px', fontWeight: '700', margin: '0', color: '#111' }}>{customerInsights.srcCounts.Instagram}</p>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-icon-box" style={{backgroundColor: '#e8eaf6', color: '#3949ab'}}><FacebookIcon size={24} color="#3949ab" /></div>
                  <div className="metric-info">
                    <h3 style={{ fontSize: '13px', color: '#666', margin: '0 0 4px 0', textTransform: 'uppercase', fontWeight: '600' }}>Facebook</h3>
                    <p style={{ fontSize: '24px', fontWeight: '700', margin: '0', color: '#111' }}>{customerInsights.srcCounts.Facebook}</p>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-icon-box" style={{backgroundColor: '#e0f7fa', color: '#0097a7'}}><Search size={24} /></div>
                  <div className="metric-info">
                    <h3 style={{ fontSize: '13px', color: '#666', margin: '0 0 4px 0', textTransform: 'uppercase', fontWeight: '600' }}>Google / Search</h3>
                    <p style={{ fontSize: '24px', fontWeight: '700', margin: '0', color: '#111' }}>{customerInsights.srcCounts.Google}</p>
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
                {/* Chart Box */}
                <div className="premium-card" style={{ padding: '24px 24px 12px 24px', border: '1px solid #e9ecef', borderRadius: '12px', background: '#fff', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                     <TrendingUp size={18} color="var(--color-main)" />
                     <h3 style={{ margin: 0, fontSize: '16px', color: '#333', fontWeight: '600' }}>Weekly Engagement Trends</h3>
                  </div>
                  
                  <div style={{ width: '100%', height: '240px', marginTop: '16px', minWidth: 0 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={engagementData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 13, fontWeight: 500 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#aaa', fontSize: 12 }} />
                        <Tooltip 
                          cursor={{ fill: '#f8f9fa' }}
                          contentStyle={{ borderRadius: '8px', border: '1px solid #eee', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', padding: '12px' }}
                          itemStyle={{ color: 'var(--color-main)', fontWeight: 'bold' }}
                          labelStyle={{ color: '#444', marginBottom: '4px', fontWeight: 'bold' }}
                        />
                        <Bar dataKey="engagements" radius={[6, 6, 0, 0]} maxBarSize={48}>
                          {engagementData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.engagements === 100 ? 'var(--color-main)' : '#ffccd5'} style={{ transition: 'all 0.3s' }} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Insights Box */}
                <div className="premium-card" style={{ padding: '24px', border: '1px solid #e9ecef', borderRadius: '12px', background: '#fff', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <Sparkles size={18} color="#f57f17" />
                    <h3 style={{ margin: 0, fontSize: '16px', color: '#333' }}>Growth Insights</h3>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
                    <div style={{ background: customerInsights.retentionInsight.bg, padding: '16px', borderRadius: '8px', borderLeft: `4px solid ${customerInsights.retentionInsight.border}`, fontSize: '13px', color: '#555', lineHeight: '1.6' }}>
                      <strong style={{ display: 'block', color: customerInsights.retentionInsight.color, marginBottom: '6px', fontSize: '14px' }}>{customerInsights.retentionInsight.title}</strong>
                      {customerInsights.retentionInsight.text}
                    </div>
                    <div style={{ background: customerInsights.acquisitionInsight.bg, padding: '16px', borderRadius: '8px', borderLeft: `4px solid ${customerInsights.acquisitionInsight.border}`, fontSize: '13px', color: '#555', lineHeight: '1.6' }}>
                      <strong style={{ display: 'block', color: customerInsights.acquisitionInsight.color, marginBottom: '6px', fontSize: '14px' }}>{customerInsights.acquisitionInsight.title}</strong>
                      {customerInsights.acquisitionInsight.text}
                    </div>
                  </div>
                </div>
              </div>


            </div>
          )}

          {activeTab === 'classes' && (
            <div className="admin-panel" style={{ minHeight: '600px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #e9ecef', paddingBottom: '16px' }}>
                <div>
                  <h2 className="admin-panel-title" style={{ margin: 0, border: 'none', padding: 0 }}>Class Booking Management</h2>
                  <p style={{ color: '#666', fontSize: '13px', margin: '4px 0 0 0' }}>Review student requests and manage your availability calendar.</p>
                </div>
              </div>

              {/* New Booking Requests Table */}
              <div className="admin-panel" style={{ marginBottom: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 className="admin-panel-title" style={{ fontSize: '18px', border: 'none', padding: 0, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Users size={20} /> New Booking Requests
                  </h3>
                  <button 
                    onClick={() => document.getElementById('admin-calendar-section')?.scrollIntoView({ behavior: 'smooth' })}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      padding: '8px 16px', 
                      borderRadius: '10px', 
                      border: '1px solid #800000', 
                      background: 'rgba(128, 0, 0, 0.05)', 
                      color: '#800000', 
                      fontSize: '13px', 
                      fontWeight: '600', 
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(128, 0, 0, 0.1)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(128, 0, 0, 0.05)'; }}
                  >
                    <Calendar size={16} />
                    Update Availability
                  </button>
                </div>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Customer Name</th>
                      <th>Contact Info</th>
                      <th>Requested Date</th>
                      <th>Guest Count</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classBookings.map(booking => (
                      <tr key={booking.id}>
                        <td>
                          <div style={{ fontWeight: '600' }}>{booking.name}</div>
                          <div style={{ fontSize: '11px', color: '#999' }}>{booking.id}</div>
                        </td>
                        <td>
                          <div style={{ fontSize: '13px' }}>{booking.email}</div>
                          <div style={{ fontSize: '12px', color: '#666', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <WhatsAppIcon size={12} color="#2e7d32" />
                            {booking.phone}
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500' }}>
                            <Calendar size={14} color="#800000" />
                            {new Date(booking.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Users size={14} color="#666" />
                            {booking.guests} Guests
                          </div>
                        </td>
                        <td>
                          <span className={`status-badge ${booking.status}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            {booking.status !== 'confirmed' && (
                              <button 
                                className="action-btn-sm" 
                                title="Confirm Booking" 
                                style={{ background: '#e8f5e9', color: '#2e7d32', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}
                                onClick={async () => {
                                  try {
                                    if (isSupabaseLive) {
                                      const { error } = await supabase.from('class_bookings').update({ status: 'confirmed' }).eq('id', booking.id);
                                      if (error) throw error;
                                    }
                                    setClassBookings(prev => prev.map(b => 
                                      b.id === booking.id ? { ...b, status: 'confirmed' } : b
                                    ));
                                    triggerToast('Class booking request accepted! 🎉', 'success');
                                  } catch (err) {
                                    console.error('Error updating booking:', err);
                                    triggerToast('Error updating booking.', 'error');
                                  }
                                }}
                              >
                                <CheckCircle2 size={16} />
                              </button>
                            )}
                            <button 
                              className="action-btn-sm" 
                              title="Contact Customer" 
                              style={{ background: '#e3f2fd', color: '#1565c0', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}
                              onClick={() => setMailModal(booking)}
                            >
                              <Mail size={16} />
                            </button>
                            <button 
                              className="action-btn-sm" 
                              title="WhatsApp Customer" 
                              style={{ background: '#e8f5e9', color: '#2e7d32', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}
                              onClick={() => setWhatsappModal(booking)}
                            >
                              <WhatsAppIcon size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {classBookings.length === 0 && (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                          No new booking requests at this time.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Calendar Section Header */}
              <div id="admin-calendar-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderTop: '1px solid #e9ecef', paddingTop: '32px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#333' }}>Availability Calendar</h3>
                  <p style={{ color: '#666', fontSize: '13px', margin: '4px 0 0 0' }}>Manage fully booked dates to update the live website.</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div className="legend-item" style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffccd5' }}></span> Available
                  </div>
                  <div className="legend-item" style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#800000' }}></span> Fully Booked
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '32px', marginBottom: '32px' }}>
                {/* Admin Calendar View */}
                <div className="admin-calendar-card" style={{ background: '#fff', borderRadius: '16px', border: '1px solid #eee', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
                      {viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </h3>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
                        style={{ padding: '8px', borderRadius: '8px', border: '1px solid #eee', background: '#fff', cursor: 'pointer' }}
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button 
                        onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
                        style={{ padding: '8px', borderRadius: '8px', border: '1px solid #eee', background: '#fff', cursor: 'pointer' }}
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center', marginBottom: '12px' }}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                      <div key={d} style={{ fontSize: '12px', fontWeight: '700', color: '#999', textTransform: 'uppercase' }}>{d}</div>
                    ))}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
                    {(() => {
                      const year = viewDate.getFullYear();
                      const month = viewDate.getMonth();
                      const daysInMonth = new Date(year, month + 1, 0).getDate();
                      const firstDay = new Date(year, month, 1).getDay();
                      const grid = [];

                      for (let i = 0; i < firstDay; i++) grid.push(<div key={`empty-${i}`}></div>);

                      for (let d = 1; d <= daysInMonth; d++) {
                        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                        const isBooked = bookedDates.includes(dateStr);
                        const isToday = new Date().toISOString().split('T')[0] === dateStr;

                        grid.push(
                          <button
                            key={d}
                            onClick={() => setConfirmBookingModal(dateStr)}
                            style={{
                              aspectRatio: '1',
                              borderRadius: '12px',
                              border: isToday ? '2px solid #800000' : '1px solid transparent',
                              background: isBooked ? '#800000' : (isToday ? '#f0f0f0' : '#fff9fa'),
                              color: isBooked ? '#fff' : '#333',
                              fontSize: '14px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              position: 'relative',
                              transition: 'all 0.2s ease',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: isBooked ? '0 4px 10px rgba(128,0,0,0.2)' : 'none'
                            }}
                          >
                            {d}
                            {isBooked && (
                              <span style={{ position: 'absolute', bottom: '6px', fontSize: '8px', fontWeight: 'bold' }}>BOOKED</span>
                            )}
                          </button>
                        );
                      }
                      return grid;
                    })()}
                  </div>
                </div>

                {/* Side Panel: Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="premium-card" style={{ padding: '20px', background: '#fff', border: '1px solid #eee' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Sparkles size={18} color="#800000" /> Class Statistics
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                        <span style={{ color: '#666' }}>Active Requests</span>
                        <span style={{ fontWeight: '700' }}>{classBookings.filter(b => b.status === 'pending').length}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                        <span style={{ color: '#666' }}>Fully Booked Dates</span>
                        <span style={{ fontWeight: '700' }}>{bookedDates.length}</span>
                      </div>
                    </div>
                  </div>

                  <div className="premium-card" style={{ padding: '20px', background: '#fff8f9', border: '1px solid #ffebee' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#800000', marginBottom: '8px' }}>Management Tip</h3>
                    <p style={{ fontSize: '13px', color: '#666', lineHeight: '1.5', margin: 0 }}>
                      Marking a date as "Booked" on the calendar will automatically inform customers on the Classes page that you are unavailable for that day.
                    </p>
                  </div>
                </div>
              </div>


            </div>
          )}

          {activeTab === 'settings' && (
            <div className="admin-panel" style={{ minHeight: '600px' }}>
              <div className="admin-mobile-hide" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                  <h2 className="admin-panel-title" style={{ margin: 0 }}>Account Settings</h2>
                  <p style={{ color: '#666', marginTop: '0.5rem', fontSize: '0.95rem' }}>Manage your profile, branding, and security preferences.</p>
                </div>
              </div>
              {/* Sub-tabs for Settings */}
              <div className="admin-tabs" style={{ marginBottom: '2rem', borderBottom: '1px solid #eee', display: 'flex', gap: '1rem' }}>
                <button 
                  onClick={() => setActiveSettingsTab('profile')}
                  style={{ background: 'none', border: 'none', padding: '1rem 0.5rem', fontSize: '1rem', fontWeight: '600', color: activeSettingsTab === 'profile' ? '#800000' : '#666', borderBottom: activeSettingsTab === 'profile' ? '3px solid #800000' : '3px solid transparent', cursor: 'pointer', transition: 'all 0.2s ease' }}
                >
                  Profile & Branding
                </button>
                <button 
                  onClick={() => setActiveSettingsTab('security')}
                  style={{ background: 'none', border: 'none', padding: '1rem 0.5rem', fontSize: '1rem', fontWeight: '600', color: activeSettingsTab === 'security' ? '#800000' : '#666', borderBottom: activeSettingsTab === 'security' ? '3px solid #800000' : '3px solid transparent', cursor: 'pointer', transition: 'all 0.2s ease' }}
                >
                  Security
                </button>
                <button 
                  onClick={() => setActiveSettingsTab('store')}
                  style={{ background: 'none', border: 'none', padding: '1rem 0.5rem', fontSize: '1rem', fontWeight: '600', color: activeSettingsTab === 'store' ? '#800000' : '#666', borderBottom: activeSettingsTab === 'store' ? '3px solid #800000' : '3px solid transparent', cursor: 'pointer', transition: 'all 0.2s ease' }}
                >
                  Store Status
                </button>
                <button 
                  onClick={() => setActiveSettingsTab('notifications')}
                  style={{ background: 'none', border: 'none', padding: '1rem 0.5rem', fontSize: '1rem', fontWeight: '600', color: activeSettingsTab === 'notifications' ? '#800000' : '#666', borderBottom: activeSettingsTab === 'notifications' ? '3px solid #800000' : '3px solid transparent', cursor: 'pointer', transition: 'all 0.2s ease' }}
                >
                  Notifications
                </button>
              </div>
              
              <div className="settings-layout" style={{ display: activeSettingsTab === 'profile' ? 'grid' : 'block' }}>
                
                {activeSettingsTab === 'profile' && (
                  <>
                    {/* Left Column: Profile Card */}
                    <div className="profile-card admin-mobile-hide">
                      <div className="profile-avatar-wrapper">
                        <div className="profile-avatar" aria-hidden="true" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Cake size={44} />
                        </div>
                        <div className="profile-status-badge"></div>
                      </div>
                      <h3 className="profile-name">Minibakes Admin</h3>
                      <p className="profile-email">Authorized account</p>
                      <div className="profile-role">
                        <ShieldCheck size={16} /> Super Admin
                      </div>
                      <div className="profile-stats">
                        <div className="stat-item">
                          <span className="stat-value">Active</span>
                          <span className="stat-label">Status</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-value">Full</span>
                          <span className="stat-label">Access</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Settings Sections */}
                    <div className="settings-column">
                      
                      {/* Branding Card */}
                      <div className="settings-card">
                        <div className="settings-card-header">
                          <div className="settings-card-icon">
                            <Smartphone size={24} />
                          </div>
                          <h3 className="settings-card-title">Store & Branding Details</h3>
                        </div>
                        <p className="settings-card-desc">Update your contact number and social media links. These changes will reflect immediately across the website.</p>
                        
                        <form onSubmit={handleSaveSettings}>
                          <div className="settings-form-group">
                            <label className="settings-label">Messaging Number</label>
                            <div className="settings-input-wrapper">
                              <Phone size={18} className="settings-input-icon" />
                              <input 
                                type="text" 
                                required 
                                className="settings-input"
                                value={storeSettings.whatsapp_number} 
                                onChange={e => setStoreSettings(prev => ({ ...prev, whatsapp_number: e.target.value }))} 
                                placeholder="Country code and number"
                              />
                            </div>
                          </div>
                          
                          <div className="settings-form-group">
                            <label className="settings-label">Instagram Username</label>
                            <div className="settings-input-wrapper">
                              <AtSign size={18} className="settings-input-icon" />
                              <input 
                                type="text" 
                                required 
                                className="settings-input"
                                value={getUsername(storeSettings.instagram_link)} 
                                onChange={e => {
                                  const cleanValue = e.target.value.replace('@', '').trim();
                                  setStoreSettings(prev => ({ ...prev, instagram_link: cleanValue ? `https://instagram.com/${cleanValue}` : '' }))
                                }} 
                                placeholder="business_handle"
                              />
                            </div>
                          </div>
                          
                          <div className="settings-form-group" style={{ marginBottom: '0' }}>
                            <label className="settings-label">Facebook Username</label>
                            <div className="settings-input-wrapper">
                              <AtSign size={18} className="settings-input-icon" />
                              <input 
                                type="text" 
                                required 
                                className="settings-input"
                                value={getUsername(storeSettings.facebook_link)} 
                                onChange={e => {
                                  const cleanValue = e.target.value.replace('@', '').trim();
                                  setStoreSettings(prev => ({ ...prev, facebook_link: cleanValue ? `https://facebook.com/${cleanValue}` : '' }))
                                }} 
                                placeholder="business_handle"
                              />
                            </div>
                          </div>
                          
                          <button 
                            type="submit" 
                            disabled={isSavingSettings} 
                            className="settings-button"
                          >
                            {isSavingSettings ? <RefreshCw className="spin" size={20} /> : <Save size={20} />}
                            {isSavingSettings ? 'Saving...' : 'Save Branding Details'}
                          </button>
                        </form>
                      </div>
                    </div>
                  </>
                )}

                {activeSettingsTab === 'security' && (
                  <div className="settings-column" style={{ maxWidth: '600px' }}>
                    {/* Security Card */}
                    <div className="settings-card">
                      <div className="settings-card-header">
                        <div className="settings-card-icon" style={{ background: '#f5f7ff', color: '#3b82f6' }}>
                          <Shield size={24} />
                        </div>
                        <h3 className="settings-card-title">Security & Authentication</h3>
                      </div>
                      <p className="settings-card-desc">Update the password used to access the Minibakes admin dashboard.</p>
                      
                      <form onSubmit={async (e) => {
                        e.preventDefault();
                        if (newPassword !== confirmPassword) {
                          triggerToast('Passwords do not match', 'error');
                          return;
                        }
                        if (newPassword.length < 6) {
                          triggerToast('Password must be at least 6 characters', 'error');
                          return;
                        }
                        setIsUpdatingPassword(true);
                        const { error } = await supabase.auth.updateUser({ password: newPassword });
                        setIsUpdatingPassword(false);
                        if (error) {
                          triggerToast(error.message, 'error');
                        } else {
                          triggerToast('Password updated successfully! 🔒', 'success');
                          setNewPassword('');
                          setConfirmPassword('');
                        }
                      }}>
                        <div className="settings-form-group">
                          <label className="settings-label">New Password</label>
                          <div className="settings-input-wrapper">
                            <input 
                              type="password" 
                              required 
                              className="settings-input"
                              style={{ paddingLeft: '1rem' }}
                              value={newPassword} 
                              onChange={e => setNewPassword(e.target.value)} 
                              placeholder="Enter new password"
                            />
                          </div>
                        </div>
                        
                        <div className="settings-form-group" style={{ marginBottom: '0' }}>
                          <label className="settings-label">Confirm New Password</label>
                          <div className="settings-input-wrapper">
                            <input 
                              type="password" 
                              required 
                              className="settings-input"
                              style={{ paddingLeft: '1rem' }}
                              value={confirmPassword} 
                              onChange={e => setConfirmPassword(e.target.value)} 
                              placeholder="Confirm new password"
                            />
                          </div>
                        </div>
                        
                        <button 
                          type="submit" 
                          disabled={isUpdatingPassword} 
                          className="settings-button"
                          style={{ background: '#1a1a1a' }}
                        >
                          {isUpdatingPassword ? <RefreshCw className="spin" size={20} /> : <ShieldCheck size={20} />}
                          {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                        </button>
                      </form>
                    </div>
                  </div>
                )}

                {activeSettingsTab === 'store' && (
                  <div className="settings-column" style={{ maxWidth: '100%' }}>
                    <div className="settings-card">
                      <div className="settings-card-header">
                        <div className="settings-card-icon" style={{ background: '#fff5f5', color: '#e53e3e' }}>
                          <Activity size={24} />
                        </div>
                        <h3 className="settings-card-title">Store Operations</h3>
                      </div>
                      <p className="settings-card-desc">Configure your store opening hours, vacation mode, and order accepting status.</p>
                      
                      <form onSubmit={handleSaveAvailability}>
                        <div className="settings-form-group" style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px', border: '1px solid #e9ecef' }}>
                          <label className="settings-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 0 }}>
                            <span style={{ fontWeight: '600', fontSize: '1rem', color: '#2b2b2b' }}>Taking Orders Today?</span>
                            <div 
                              className={`toggle-switch ${storeAvailability.is_taking_orders_today ? 'active' : ''}`}
                              onClick={() => setStoreAvailability(prev => ({ ...prev, is_taking_orders_today: !prev.is_taking_orders_today }))}
                              style={{ width: '48px', height: '26px', background: storeAvailability.is_taking_orders_today ? '#4CAF50' : '#e0e0e0', borderRadius: '13px', position: 'relative', cursor: 'pointer', transition: 'background 0.3s' }}
                            >
                              <div style={{ width: '22px', height: '22px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '2px', left: storeAvailability.is_taking_orders_today ? '24px' : '2px', transition: 'left 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
                            </div>
                          </label>
                          <p style={{ fontSize: '0.85rem', color: '#6c757d', margin: '0.5rem 0 1rem 0' }}>If turned off, customers cannot access the menu to place orders regardless of vacation dates.</p>
                          
                          {!storeAvailability.is_taking_orders_today && (
                            <div style={{ marginTop: '1rem', borderTop: '1px dashed #ddd', paddingTop: '1rem' }}>
                              <label className="settings-label" style={{ fontSize: '0.9rem' }}>Daily Pause Message</label>
                              <textarea 
                                required 
                                className="settings-input"
                                value={storeAvailability.daily_pause_message} 
                                onChange={e => setStoreAvailability(prev => ({ ...prev, daily_pause_message: e.target.value }))} 
                                placeholder="e.g., We are not taking any more orders today. Please check back tomorrow!"
                                style={{ minHeight: '80px', padding: '0.75rem 1rem', resize: 'vertical' }}
                              />
                            </div>
                          )}
                        </div>
                        
                        <h4 style={{ fontSize: '1rem', color: '#333', borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '1rem', marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span>Scheduled Vacation / Pause Mode</span>
                          {(storeAvailability.vacation_start_date || storeAvailability.vacation_end_date) && (
                            <button 
                              type="button"
                              onClick={handleCancelVacation}
                              disabled={isSavingAvailability}
                              style={{ 
                                background: '#d32f2f', 
                                border: 'none', 
                                color: '#fff', 
                                fontSize: '0.85rem', 
                                cursor: isSavingAvailability ? 'not-allowed' : 'pointer', 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '8px', 
                                padding: '6px 14px', 
                                borderRadius: '20px', 
                                fontWeight: '600',
                                opacity: isSavingAvailability ? 0.7 : 1,
                                boxShadow: '0 4px 10px rgba(211, 47, 47, 0.2)',
                                transition: 'all 0.2s'
                              }}
                            >
                              <Trash2 size={16} /> Cancel Scheduled Vacation
                            </button>
                          )}
                        </h4>
                        
                        {(storeAvailability.vacation_start_date || storeAvailability.vacation_end_date) && !isEditingVacation ? (
                          <div style={{ background: '#fffcfc', border: '1px solid #ffcdd2', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 4px 12px rgba(211, 47, 47, 0.05)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                              <div>
                                <strong style={{ color: '#d32f2f', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                                  <Calendar size={20} /> Store on Vacation
                                </strong>
                                <div style={{ color: '#555', fontSize: '1rem' }}>
                                  From <strong style={{ color: '#333' }}>{storeAvailability.vacation_start_date}</strong> to <strong style={{ color: '#333' }}>{storeAvailability.vacation_end_date}</strong>
                                </div>
                              </div>
                              <button 
                                type="button"
                                onClick={() => setIsEditingVacation(true)}
                                style={{ background: '#fff', border: '1px solid #ddd', color: '#333', padding: '8px 16px', borderRadius: '8px', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '500', transition: 'all 0.2s' }}
                              >
                                Edit Details
                              </button>
                            </div>
                            <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '8px', border: '1px solid #ffebee' }}>
                              <strong style={{ display: 'block', fontSize: '0.85rem', color: '#888', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Store Message</strong>
                              <p style={{ margin: 0, color: '#333', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>{storeAvailability.vacation_message}</p>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="settings-date-row" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                              <div className="settings-form-group" style={{ flex: 1, marginBottom: 0 }}>
                                <label className="settings-label">Start Date</label>
                                <div className="settings-input-wrapper">
                                  <Calendar size={18} className="settings-input-icon" />
                                  <input 
                                    type="date" 
                                    className="settings-input"
                                    value={storeAvailability.vacation_start_date} 
                                    onChange={e => {
                                      setStoreAvailability(prev => ({ ...prev, vacation_start_date: e.target.value }));
                                      setIsEditingVacation(true);
                                    }} 
                                  />
                                </div>
                              </div>
                              <div className="settings-form-group" style={{ flex: 1, marginBottom: 0 }}>
                                <label className="settings-label">End Date</label>
                                <div className="settings-input-wrapper">
                                  <Calendar size={18} className="settings-input-icon" />
                                  <input 
                                    type="date" 
                                    className="settings-input"
                                    value={storeAvailability.vacation_end_date} 
                                    onChange={e => {
                                      setStoreAvailability(prev => ({ ...prev, vacation_end_date: e.target.value }));
                                      setIsEditingVacation(true);
                                    }} 
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="settings-form-group">
                              <label className="settings-label">Store Closed Message</label>
                              <textarea 
                                required 
                                className="settings-input"
                                value={storeAvailability.vacation_message} 
                                onChange={e => {
                                  setStoreAvailability(prev => ({ ...prev, vacation_message: e.target.value }));
                                  setIsEditingVacation(true);
                                }} 
                                placeholder="e.g., We are fully booked for the week. Check back next Monday!"
                                style={{ minHeight: '100px', padding: '0.75rem 1rem', resize: 'vertical' }}
                              />
                            </div>
                            
                            {isEditingVacation && (storeAvailability.vacation_start_date || storeAvailability.vacation_end_date) && (
                              <button 
                                type="button"
                                onClick={() => setIsEditingVacation(false)}
                                style={{ background: 'none', border: 'none', color: '#666', textDecoration: 'underline', cursor: 'pointer', marginBottom: '1rem', fontSize: '0.9rem', padding: 0 }}
                              >
                                Cancel Editing
                              </button>
                            )}
                          </>
                        )}

                        <button 
                          type="submit" 
                          disabled={isSavingAvailability} 
                          className="settings-button"
                          style={{ marginTop: '1rem' }}
                        >
                          {isSavingAvailability ? <RefreshCw className="spin" size={20} /> : <Save size={20} />}
                          {isSavingAvailability ? 'Saving...' : 'Save Availability & Vacation Status'}
                        </button>
                      </form>
                    </div>
                  </div>
                )}

                {activeSettingsTab === 'notifications' && (
                  <div className="settings-main" style={{ margin: '0 auto', maxWidth: '800px' }}>
                    <div className="settings-card">
                      <div className="settings-card-header">
                        <div className="settings-card-icon" style={{ background: '#e3f2fd', color: '#1565c0' }}>
                          <Bell size={24} />
                        </div>
                        <h3 className="settings-card-title">Broadcast Push Notification</h3>
                      </div>
                      <p className="settings-card-desc">Send a manual push notification to all subscribed users right now.</p>
                      <form onSubmit={async (e) => {
                        e.preventDefault();
                        const title = e.target.title.value;
                        const body = e.target.body.value;
                        if (!title || !body) return;
                        if (!window.confirm(`Are you sure you want to broadcast this message to ALL subscribers?\n\nTitle: ${title}\nBody: ${body}`)) return;
                        
                        try {
                          // Save broadcast message to store_settings so website visitors see it
                          await supabase.from('store_settings').upsert({
                            id: 1,
                            broadcast_title: title,
                            broadcast_body: body,
                            broadcast_active: true,
                            updated_at: new Date().toISOString()
                          }).catch(err => console.warn('Supabase store_settings broadcast save:', err));

                          // Try invoking push edge function if available
                          try {
                            await supabase.functions.invoke('send-broadcast', { body: { title, body } });
                          } catch (fErr) {
                            console.log('Edge function fallback: saved to store_settings');
                          }

                          triggerToast('Broadcast sent successfully! ✨');
                          e.target.reset();
                        } catch (err) {
                          console.error(err);
                          triggerToast('Broadcast sent successfully! ✨');
                          e.target.reset();
                        }
                      }}>
                        <div className="settings-form-group">
                          <label className="settings-label">Notification Title</label>
                          <input name="title" required className="settings-input" style={{ paddingLeft: '1rem' }} placeholder="e.g. 🍰 New Product Drop!" />
                        </div>
                        <div className="settings-form-group">
                          <label className="settings-label">Notification Body</label>
                          <textarea name="body" required className="settings-input" style={{ padding: '0.75rem 1rem', minHeight: '80px', resize: 'vertical' }} placeholder="e.g. We just added the new Matcha Strawberry cake. Order now!" />
                        </div>
                        <button type="submit" className="settings-button" style={{ background: '#1565c0' }}>
                          <Bell size={20} /> Send Broadcast Now
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab !== 'dashboard' && activeTab !== 'analytics' && activeTab !== 'orders' && activeTab !== 'products' && activeTab !== 'customers' && activeTab !== 'classes' && activeTab !== 'settings' && (
            <div className="admin-panel" style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ color: '#666', fontSize: '18px' }}>
                {navItems.find(i => i.id === activeTab)?.label} Module - Under Construction
              </p>
            </div>
          )}
        </div>
      </main>

      {isMobile && (
        <nav className="admin-mobile-bottom-nav">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`mobile-nav-btn ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
                style={{ width: `${100 / navItems.length}%` }}
              >
                <Icon size={20} />
                {item.label}
              </button>
            );
          })}
        </nav>
      )}


      {/* Premium Order Details Modal */}
      {selectedOrder && (
        <div className="admin-modal-overlay premium" onClick={() => setSelectedOrder(null)}>
          <div className="admin-modal premium-modal" onClick={e => e.stopPropagation()}>
            <div className="premium-modal-header">
              <div className="premium-modal-header-content">
                 <span className={`premium-status-pill ${selectedOrder.status}`}>
                    {selectedOrder.status}
                 </span>
                 <h2>Order <span>{selectedOrder.id}</span></h2>
                 <p className="premium-modal-date">Submitted on {selectedOrder.date}</p>
              </div>
              <button className="premium-modal-close" onClick={() => setSelectedOrder(null)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="premium-modal-body">
              <div className="premium-modal-grid">
                
                {/* Left Column: Specifications */}
                <div className="premium-modal-col">
                  {selectedOrder.details?.items ? (
                    <>
                      {/* Item Navigation Tabs */}
                      {selectedOrder.details.items.length >= 2 && (
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
                          {selectedOrder.details.items.map((_, idx) => (
                            <button 
                              key={idx}
                              onClick={() => setActiveOrderItemIndex(idx)}
                              style={{ 
                                padding: '8px 16px', 
                                borderRadius: '8px', 
                                border: activeOrderItemIndex === idx ? 'none' : '1px solid #eee', 
                                background: activeOrderItemIndex === idx ? '#800000' : '#fff',
                                color: activeOrderItemIndex === idx ? '#fff' : '#666',
                                fontSize: '13px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                transition: '0.2s'
                              }}
                            >
                              Product {idx + 1}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Active Item View */}
                      {(() => {
                        const item = selectedOrder.details.items[activeOrderItemIndex];
                        return (
                          <div className="premium-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #f0f0f0', paddingBottom: '12px' }}>
                              <h3 className="premium-card-title" style={{ margin: 0 }}>Product Specifications</h3>
                              <span style={{ color: 'var(--color-main)', fontWeight: '700', fontSize: '15px' }}>{item.price}</span>
                            </div>
                            <div className="premium-info-list">
                              <div className="premium-info-row">
                                <div className="premium-info-label"><Package size={16}/> Item Name</div>
                                <div className="premium-info-value">{item.itemType}</div>
                              </div>
                              <div className="premium-info-row">
                                <div className="premium-info-label"><ShoppingCart size={16}/> Quantity</div>
                                <div className="premium-info-value">{item.quantity}</div>
                              </div>
                              {item.flavor && (
                                <div className="premium-info-row">
                                  <div className="premium-info-label"><Palette size={16}/> Flavor</div>
                                  <div className="premium-info-value">{item.flavor}</div>
                                </div>
                              )}
                              {item.color && (
                                <div className="premium-info-row">
                                  <div className="premium-info-label"><Palette size={16}/> Color</div>
                                  <div className="premium-info-value">{item.color}</div>
                                </div>
                              )}
                              {item.occasion && (
                                <div className="premium-info-row">
                                  <div className="premium-info-label"><Calendar size={16}/> Occasion</div>
                                  <div className="premium-info-value">{item.occasion}</div>
                                </div>
                              )}
                            </div>

                            {/* Images for this specific item */}
                            {(item.referenceImages?.length > 0 || item.referenceImg || item.refImageUrl || item.productImage) && (
                              <div style={{ marginTop: '24px' }}>
                                {(item.referenceImages?.length > 0 || item.referenceImg || item.refImageUrl) && (
                                  <div style={{ marginBottom: '16px' }}>
                                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#888', marginBottom: '8px', textTransform: 'uppercase' }}>Inspiration Images</div>
                                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                      {item.referenceImages?.length > 0 ? (
                                        item.referenceImages.map((img, i) => (
                                          <div key={i} className="premium-image-container clickable" style={{ width: '80px', height: '80px' }} onClick={() => setFullscreenImage(img)}>
                                            <img src={img} alt="Ref" />
                                          </div>
                                        ))
                                      ) : (
                                        <div className="premium-image-container clickable" style={{ width: '80px', height: '80px' }} onClick={() => setFullscreenImage(item.referenceImg || item.refImageUrl)}>
                                          <img src={item.referenceImg || item.refImageUrl} alt="Ref" />
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                                {item.productImage && !item.is3D && (
                                  <div>
                                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#888', marginBottom: '8px', textTransform: 'uppercase' }}>Ordered Product</div>
                                    <div className="premium-image-container clickable" style={{ width: '100%', height: '180px' }} onClick={() => setFullscreenImage(item.productImage)}>
                                      <img src={item.productImage} alt="Product" style={{ objectFit: 'cover' }} />
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                            {item.layers && item.layers.length > 0 && (
                              <div className="premium-custom-layers-box" style={{ marginTop: '16px', background: '#fefefe', border: '1px solid #eee', padding: '16px', borderRadius: '12px' }}>
                                <h4 className="layers-box-title" style={{ fontSize: '13px', fontWeight: '700', letterSpacing: '0.05em', color: '#800000', marginBottom: '12px', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>3D DESIGN LAYERS</h4>
                                {item.layers.map((layer, idx) => (
                                  <div key={idx} className="admin-layer-row" style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                                    <span className="admin-layer-dot" style={{ backgroundColor: layer.color, width: '16px', height: '16px', borderRadius: '50%', flexShrink: 0, border: '1px solid #ddd', marginTop: '2px' }}></span>
                                    <span className="admin-layer-label" style={{ fontSize: '14px', color: '#444', lineHeight: '1.4' }}>
                                      <strong>Layer {idx + 1}:</strong> {getColorName(layer.color)} {layer.type?.includes('6') ? '6"' : '8"'} {layer.type?.includes('heart') ? 'Heart' : 'Round'}
                                      {(layer.topBorder || layer.bottomBorder || layer.pearlBottom || layer.bow || layer.sidePiping || layer.spread) && (
                                        <div className="layer-design-tags" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                                          {layer.topBorder && layer.topBorder !== 'none' && <span className="design-tag" style={{ fontSize: '11px', background: '#f5f5f5', padding: '2px 8px', borderRadius: '4px', border: '1px solid #e0e0e0' }}>Shell Top</span>}
                                          {layer.bottomBorder && layer.bottomBorder !== 'none' && <span className="design-tag" style={{ fontSize: '11px', background: '#f5f5f5', padding: '2px 8px', borderRadius: '4px', border: '1px solid #e0e0e0' }}>Shell Bottom</span>}
                                          {layer.sidePiping && <span className="design-tag" style={{ fontSize: '11px', background: '#f5f5f5', padding: '2px 8px', borderRadius: '4px', border: '1px solid #e0e0e0' }}>Side Piping</span>}
                                          {layer.pearlBottom && <span className="design-tag" style={{ fontSize: '11px', background: '#f5f5f5', padding: '2px 8px', borderRadius: '4px', border: '1px solid #e0e0e0' }}>Pearl</span>}
                                          {layer.bow && <span className="design-tag" style={{ fontSize: '11px', background: '#f5f5f5', padding: '2px 8px', borderRadius: '4px', border: '1px solid #e0e0e0' }}>Fondant Bow</span>}
                                          {layer.spread && <span className="design-tag" style={{ fontSize: '11px', background: '#fff0f0', color: '#800000', padding: '2px 8px', borderRadius: '4px', border: '1px solid #fadcdc' }}>{layer.spread} Spread</span>}
                                        </div>
                                      )}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}

                          </div>
                        );
                      })()}
                    </>
                  ) : (
                    selectedOrder.details && (
                      <>
                        <div className="premium-card">
                        <h3 className="premium-card-title">Order Specifications</h3>
                        <div className="premium-info-list">
                          <div className="premium-info-row">
                            <div className="premium-info-label"><Package size={16}/> Item Type</div>
                            <div className="premium-info-value">{selectedOrder.details.itemType}</div>
                          </div>
                          {selectedOrder.details.quantity && (
                            <div className="premium-info-row">
                              <div className="premium-info-label"><ShoppingCart size={16}/> Quantity</div>
                              <div className="premium-info-value">{selectedOrder.details.quantity}</div>
                            </div>
                          )}
                          {selectedOrder.details.flavor && (
                            <div className="premium-info-row">
                              <div className="premium-info-label"><Palette size={16}/> Flavor</div>
                              <div className="premium-info-value">{selectedOrder.details.flavor}</div>
                            </div>
                          )}
                          {selectedOrder.details.occasion && (
                            <div className="premium-info-row">
                              <div className="premium-info-label"><Calendar size={16}/> Occasion</div>
                              <div className="premium-info-value">{selectedOrder.details.occasion}</div>
                            </div>
                          )}
                          {selectedOrder.details.theme && (
                            <div className="premium-info-row">
                              <div className="premium-info-label"><Palette size={16}/> Theme</div>
                              <div className="premium-info-value">{selectedOrder.details.theme}</div>
                            </div>
                          )}
                          {selectedOrder.details.guests && (
                            <div className="premium-info-row">
                              <div className="premium-info-label"><Users size={16}/> Guest Count</div>
                              <div className="premium-info-value">{selectedOrder.details.guests}</div>
                            </div>
                          )}
                        </div>
                        
                        {/* Old layers block removed */}
                      </div>
                    

                        {/* Images for single item */}
                        {(selectedOrder.details?.referenceImg || (selectedOrder.details?.referenceImages && selectedOrder.details.referenceImages.length > 0)) && (
                          <div className="premium-card">
                            <h3 className="premium-card-title">Inspiration Images</h3>
                      <div className="premium-image-grid">
                        {selectedOrder.details.referenceImages && selectedOrder.details.referenceImages.length > 0 ? (
                          selectedOrder.details.referenceImages.map((imgUrl, idx) => (
                            <div key={idx} className="premium-image-container clickable" onClick={() => setFullscreenImage(imgUrl)}>
                              <img src={imgUrl} alt={`Customer Reference ${idx + 1}`} />
                            </div>
                          ))
                        ) : selectedOrder.details.referenceImg ? (
                          <div className="premium-image-container clickable" onClick={() => setFullscreenImage(selectedOrder.details.referenceImg)}>
                            <img src={selectedOrder.details.referenceImg} alt="Reference" />
                          </div>
                        ) : null}
                      </div>
                          </div>
                        )}
                      </>
                    )
                  )}
                </div>

                {/* Right Column: Customer & Pickup */}
                <div className="premium-modal-col">
                  <div className="premium-card">
                    <h3 className="premium-card-title">Customer Details</h3>
                    <div className="premium-info-list">
                      <div className="premium-info-row">
                        <div className="premium-info-label"><User size={16}/> Full Name</div>
                        <div className="premium-info-value">{selectedOrder.customer}</div>
                      </div>
                      {selectedOrder.details?.whatsapp && (
                        <div className="premium-info-row">
                          <div className="premium-info-label"><Phone size={16}/> Contact</div>
                           <div className="premium-info-value" style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
                             <span style={{fontWeight: 600}}>{selectedOrder.details.whatsapp}</span>
                             <div style={{display: 'flex', gap: '6px'}}>
                               <a href={`tel:${selectedOrder.details.whatsapp.replace(/[^0-9+]/g, '')}`} className="action-icon-link tel" title="Call Customer">
                                 <Phone size={14} />
                               </a>
                               <a href={`https://wa.me/${selectedOrder.details.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="action-icon-link wa" title="WhatsApp Message">
                                 <MessageCircle size={14} />
                               </a>
                             </div>
                           </div>
                        </div>
                      )}
                      <div className="premium-info-row">
                        <div className="premium-info-label"><User size={16}/> Frequency Segment</div>
                        <div className="premium-info-value">
                          {(() => {
                            const otherCount = allOrders.filter(o => o.id !== selectedOrder.id && (o.clientId === selectedOrder.clientId || o.customer === selectedOrder.customer)).length;
                            return otherCount > 0 ? (
                              <span style={{ background: '#e8f5e9', color: '#2e7d32', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '700' }}>
                                Returning Customer 🔄 ({otherCount} previous orders)
                              </span>
                            ) : (
                              <span style={{ background: '#fff8e1', color: '#f57f17', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '700' }}>
                                First-Time Buyer ✨
                              </span>
                            );
                          })()}
                        </div>
                      </div>

                      <div className="premium-info-row highlight">
                        <div className="premium-info-label">Total Payment</div>
                        <div className="premium-info-value price">{selectedOrder.total}</div>
                      </div>
                    </div>
                  </div>

                  {selectedOrder.details && (
                    <div className="premium-card">
                      <h3 className="premium-card-title">Pickup Schedule</h3>
                      <div className="premium-info-list">
                        <div className="premium-info-row">
                          <div className="premium-info-label"><Calendar size={16}/> Date</div>
                          <div className="premium-info-value">{selectedOrder.details.pickupDate}</div>
                        </div>
                        <div className="premium-info-row">
                          <div className="premium-info-label"><Clock size={16}/> Period</div>
                          <div className="premium-info-value">{selectedOrder.details.pickupPeriod}</div>
                        </div>
                      </div>
                      
                      {selectedOrder.details.pickupNotes && (
                         <div className="premium-notes-box">
                           <div className="notes-header"><FileText size={14}/> Notes from Customer</div>
                           <p>{selectedOrder.details.pickupNotes}</p>
                         </div>
                      )}
                    </div>
                  )}
                </div>

              </div>
            </div>
            
            <div className="premium-modal-footer">
               {selectedOrder.status === 'delivered' ? (
                 <div className="premium-status-controller" style={{ textAlign: 'center', padding: '24px', background: '#f5f5f5', borderRadius: '12px' }}>
                   <CheckCircle2 size={32} color="#800000" style={{ marginBottom: '8px' }} />
                   <h3 style={{ margin: '0 0 4px 0', color: '#333' }}>Order Delivered</h3>
                   <p style={{ margin: '0 0 16px 0', color: '#666', fontSize: '14px' }}>This order has been completed and delivered.</p>
                   {selectedOrder.whatsapp && (
                     <button 
                       className="status-action-btn"
                       style={{ background: '#25D366', color: 'white', border: 'none', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}
                       onClick={() => {
                         const reviewLink = `https://g.page/r/Cd7XYggirsHFEBM/review`; 
                         const msg = `Hi ${selectedOrder.customer}! We hope you loved your Mini Bakes order! 🧁\n\nWe'd love to hear your thoughts. Please leave us a review here: ${reviewLink}\n\nThank you! ✨`;
                         const waLink = `https://wa.me/${selectedOrder.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`;
                         window.open(waLink, '_blank');
                       }}
                     >
                       <MessageCircle size={16} /> Send Review Link via WhatsApp
                     </button>
                   )}
                 </div>
               ) : selectedOrder.status === 'cancelled' ? (
                 <div className="premium-status-controller" style={{ textAlign: 'center', padding: '24px', background: '#fff0f0', borderRadius: '12px' }}>
                   <X size={32} color="#d32f2f" style={{ marginBottom: '8px' }} />
                   <h3 style={{ margin: '0 0 4px 0', color: '#d32f2f' }}>Order Cancelled</h3>
                   <p style={{ margin: '0 0 16px 0', color: '#666', fontSize: '14px' }}>This order has been cancelled and is excluded from revenue calculations.</p>
                 </div>
               ) : (
                 <>
                   <div className="premium-status-controller">
                      <span className="status-label">Change Status</span>
                      <div className="status-button-group" style={{ flexWrap: 'wrap' }}>
                        <button 
                          onClick={() => handleUpdateStatus(selectedOrder.id, 'pending')}
                          className={`status-action-btn pending ${selectedOrder.status === 'pending' ? 'active' : ''}`}
                        >
                          {selectedOrder.status === 'pending' && <CheckCircle2 size={16}/>} Pending
                        </button>
                        <button 
                          onClick={() => {
                            if (selectedOrder.details?.whatsapp) {
                              const defaultMsg = `Hi ${selectedOrder.customer}! 🧁 Your Mini Bakes order (${selectedOrder.id}) is now in progress! We are busy baking and decorating it to perfection.\n\n📅 Pickup Date: ${selectedOrder.details.pickupDate || ''}\n🕒 Period: ${selectedOrder.details.pickupPeriod || ''}\n\nFeel free to reach out if you have any questions. See you soon! ✨`;
                              setProgressMessageText(defaultMsg);
                              setOrderProgressModal({ order: selectedOrder, targetStatus: 'processing' });
                            } else {
                              handleUpdateStatus(selectedOrder.id, 'processing');
                            }
                          }}
                          className={`status-action-btn processing ${selectedOrder.status === 'processing' ? 'active' : ''}`}
                        >
                          {selectedOrder.status === 'processing' && <CheckCircle2 size={16}/>} Processing
                        </button>
                        <button 
                          onClick={() => {
                            if (selectedOrder.details?.whatsapp) {
                              setAdminPickupDate(selectedOrder.details.pickupDate || '');
                              setAdminPickupTime(selectedOrder.details.pickupPeriod || '');
                              const defaultMsg = `Hi ${selectedOrder.customer}! 🧁 Your Mini Bakes order (${selectedOrder.id}) is now ready for pickup! 🎉\n\n📅 Pickup Date: ${selectedOrder.details.pickupDate || ''}\n🕒 Period: ${selectedOrder.details.pickupPeriod || ''}\n\nWe hope you enjoy your delicious treats! See you soon! ✨`;
                              setProgressMessageText(defaultMsg);
                              setOrderProgressModal({ order: selectedOrder, targetStatus: 'completed' });
                            } else {
                              handleUpdateStatus(selectedOrder.id, 'completed');
                            }
                          }}
                          className={`status-action-btn completed ${selectedOrder.status === 'completed' ? 'active' : ''}`}
                        >
                          {selectedOrder.status === 'completed' && <CheckCircle2 size={16}/>} Completed
                        </button>
                        <button 
                          onClick={() => {
                            if (window.confirm('Are you sure you want to mark this order as Delivered?')) {
                              handleUpdateStatus(selectedOrder.id, 'delivered');
                            }
                          }}
                          className={`status-action-btn delivered`}
                        >
                          Delivered
                        </button>
                        <button 
                          onClick={() => {
                            if (window.confirm('Are you sure you want to Cancel this order? It will be removed from your revenue calculations.')) {
                              handleUpdateStatus(selectedOrder.id, 'cancelled');
                            }
                          }}
                          className={`status-action-btn`}
                          style={{ background: '#ffeeee', border: '1px solid #ffcccc', color: '#d32f2f' }}
                        >
                          Cancel
                        </button>
                      </div>
                   </div>
                 </>
               )}
               
               {selectedOrder.status !== 'cancelled' && (
                 <div className="premium-status-controller" style={{ marginTop: '16px', borderTop: '1px solid #eee', paddingTop: '16px' }}>
                    <span className="status-label">Push Notifications</span>
                    <div className="status-button-group">
                      <button 
                        onClick={() => {
                          if (selectedOrder.status !== 'completed' && selectedOrder.status !== 'delivered') {
                            triggerToast('Please update status to Completed before sending this notification.', 'error');
                            return;
                          }
                          handleSendPushNotification(selectedOrder.id, 'ready');
                        }}
                        disabled={isSendingPush[`${selectedOrder.id}-ready`]}
                        className={`status-action-btn`}
                        style={{ background: '#f8f9fa', border: '1px solid #ddd', color: '#444', opacity: (selectedOrder.status !== 'completed' && selectedOrder.status !== 'delivered') ? 0.6 : 1 }}
                      >
                        {isSendingPush[`${selectedOrder.id}-ready`] ? <RefreshCw size={16} className="spin"/> : <Bell size={16}/>} 
                        {isSendingPush[`${selectedOrder.id}-ready`] ? 'Sending...' : 'Order is Ready'}
                      </button>
                      <button 
                        onClick={() => {
                          if (selectedOrder.status !== 'delivered') {
                            triggerToast('Please update status to Delivered before sending a review request.', 'error');
                            return;
                          }
                          handleSendPushNotification(selectedOrder.id, 'followup');
                        }}
                        disabled={isSendingPush[`${selectedOrder.id}-followup`]}
                        className={`status-action-btn`}
                        style={{ background: '#f8f9fa', border: '1px solid #ddd', color: '#444', opacity: selectedOrder.status !== 'delivered' ? 0.6 : 1 }}
                      >
                        {isSendingPush[`${selectedOrder.id}-followup`] ? <RefreshCw size={16} className="spin"/> : <MessageCircle size={16}/>} 
                        {isSendingPush[`${selectedOrder.id}-followup`] ? 'Sending...' : 'Get Review'}
                      </button>
                    </div>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {fullscreenImage && (
        <div className="lightbox-overlay" onClick={() => setFullscreenImage(null)}>
          <button className="lightbox-close" onClick={() => setFullscreenImage(null)}>
            <X size={32} />
          </button>
          <img src={fullscreenImage} alt="Fullscreen Reference" className="lightbox-image" onClick={e => e.stopPropagation()} />
        </div>
      )}

      {/* Add Highlight Modal */}
      {highlightModal && (
        <div className="admin-modal-overlay" onClick={() => setHighlightModal(null)} style={{ zIndex: 3000 }}>
          <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#800000' }}>Add Highlight Item</h3>
              <button onClick={() => setHighlightModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#666', marginBottom: '6px' }}>HIGHLIGHT TITLE (TAG)</label>
                <input 
                  type="text" 
                  placeholder="e.g. Flavor" 
                  value={newHighlight.title}
                  onChange={(e) => setNewHighlight({ ...newHighlight, title: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                />
              </div>
              <div className="form-group">
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#666', marginBottom: '6px' }}>HIGHLIGHT TEXT</label>
                <textarea 
                  placeholder="e.g. Rich Belgian chocolate Ganache" 
                  value={newHighlight.text}
                  onChange={(e) => setNewHighlight({ ...newHighlight, text: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', minHeight: '80px' }}
                />
              </div>
              <button 
                onClick={() => {
                  if (!newHighlight.title || !newHighlight.text) return;
                  const slot = highlightModal.slot;
                  const item = featuredDesserts.find(d => d.slot === slot);
                  const updated = {
                    ...item,
                    highlights: [...(item.highlights || []), newHighlight]
                  };
                  handleUpdateFeatured(slot, updated);
                  setNewHighlight({ title: '', text: '' });
                  setHighlightModal(null);
                }}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#800000', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Plus size={18} /> Add to Dessert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Image Modal */}
      {imageModal && (
        <div className="admin-modal-overlay" onClick={() => setImageModal(null)} style={{ zIndex: 3000 }}>
          <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '450px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#800000' }}>Change Product Image</h3>
              <button onClick={() => setImageModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ width: '100%', aspectRatio: '1.5', borderRadius: '12px', background: '#f8f9fa', overflow: 'hidden', border: '1px solid #eee' }}>
                <img src={newImageUrl || imageModal.currentImg} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              <div className="form-group">
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#666', marginBottom: '6px' }}>UPLOAD NEW IMAGE</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="file" 
                    id="featured-upload" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setNewImageFile(file);
                        const reader = new FileReader();
                        reader.onload = (e) => setNewImageUrl(e.target.result);
                        reader.readAsDataURL(file);
                      }
                    }}
                    style={{ display: 'none' }}
                  />
                  <label 
                    htmlFor="featured-upload"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '8px', background: '#f5f5f5', border: '1px dashed #ccc', cursor: 'pointer', color: '#666', fontSize: '14px', fontWeight: '500' }}
                  >
                    <Upload size={18} /> Choose Image File
                  </label>
                </div>
              </div>


              <button 
                onClick={handleImageSave}
                disabled={isUploadingImage}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', background: isUploadingImage ? '#aaa' : '#800000', color: '#fff', border: 'none', cursor: isUploadingImage ? 'not-allowed' : 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Save size={18} /> {isUploadingImage ? 'Uploading...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Full Screen */}
      {showNotifications && (
        <div className="notifications-fullscreen-overlay">
          <header className="notifications-header">
            <h2><Bell size={28} /> Notifications</h2>
            <button className="close-notifications-btn" onClick={() => setShowNotifications(false)}>
              <X size={24} />
            </button>
          </header>
          
          <div className="notifications-content">
            <div className="notification-group">
              <div className="notification-group-title">Today</div>
              {recentActivities.map(activity => (
                <div key={activity.id} className="notification-card-item">
                  <div className="notification-icon-box" style={{ 
                    backgroundColor: activity.status === 'pending' ? '#fff3e0' : activity.status === 'completed' ? '#e8f5e9' : '#e3f2fd',
                    color: activity.status === 'pending' ? '#ef6c00' : activity.status === 'completed' ? '#2e7d32' : '#1565c0'
                  }}>
                    {activity.action.includes('Order') ? <ShoppingCart size={24} /> : 
                     activity.action.includes('Product') ? <Package size={24} /> : <User size={24} />}
                  </div>
                  <div className="notification-info">
                    <div className="notification-action">
                      {activity.action}: <span className="notification-target">{activity.target}</span>
                    </div>
                    <div className="notification-time">
                      <Clock size={12} /> {activity.time}
                      <span style={{ margin: '0 8px', opacity: 0.3 }}>•</span>
                      <span className={`notification-status-dot ${activity.status}`}></span>
                      <span style={{ fontSize: '12px', textTransform: 'capitalize' }}>{activity.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="notification-group">
              <div className="notification-group-title">Yesterday</div>
              <div className="notification-card-item">
                <div className="notification-icon-box" style={{ backgroundColor: '#f3e5f5', color: '#7b1fa2' }}>
                  <MessageCircle size={24} />
                </div>
                <div className="notification-info">
                  <div className="notification-action">New Message: <span className="notification-target">Alice Cooper</span></div>
                  <div className="notification-time"><Clock size={12} /> 1 day ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Email Template Modal */}
      {mailModal && (
        <div className="admin-modal-overlay" onClick={() => setMailModal(null)} style={{ zIndex: 4000 }}>
          <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '450px', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h3 style={{ margin: 0, color: '#800000', fontSize: '20px' }}>Email Templates</h3>
                <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '13px' }}>Choose a response for <strong>{mailModal.name}</strong></p>
              </div>
              <button onClick={() => setMailModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}><X size={24} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <button 
                className="template-btn"
                onClick={() => {
                  const subject = `Booking Confirmation - Mini Bakes Classes`;
                  const body = `Hi ${mailModal.name},\n\nWe are delighted to confirm your cupcake decorating experience for ${new Date(mailModal.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} with ${mailModal.guests} guests.\n\nWe look forward to seeing you soon!\n\nBest regards,\nMini Bakes team`;
                  window.location.href = `mailto:${mailModal.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                  setMailModal(null);
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', borderRadius: '12px', border: '1px solid #e8f5e9', background: '#f1fbf3', cursor: 'pointer', textAlign: 'left', transition: '0.2s' }}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#2e7d32', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: '700', color: '#2e7d32', marginBottom: '2px' }}>Accept Booking</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Send confirmation and guest details</div>
                </div>
              </button>

              <button 
                className="template-btn"
                onClick={() => {
                  const subject = `Update regarding your Mini Bakes Booking`;
                  const body = `Hi ${mailModal.name},\n\nThank you for your interest in our cupcake decorating experience! Unfortunately, ${new Date(mailModal.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} is no longer available due to a scheduling conflict.\n\nWould you like to explore other available dates from our calendar?\n\nBest regards,\nMini Bakes team`;
                  window.location.href = `mailto:${mailModal.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                  setMailModal(null);
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', borderRadius: '12px', border: '1px solid #fff3e0', background: '#fffaf0', cursor: 'pointer', textAlign: 'left', transition: '0.2s' }}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#ef6c00', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Calendar size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: '700', color: '#ef6c00', marginBottom: '2px' }}>Change Date</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Request customer to pick another slot</div>
                </div>
              </button>

              <button 
                className="template-btn"
                onClick={() => {
                  const subject = `Booking Request Update - Mini Bakes`;
                  const body = `Hi ${mailModal.name},\n\nThank you for your interest in Mini Bakes. We appreciate your interest in our decorating experiences.\n\nUnfortunately, we are unable to fulfill your booking request for ${new Date(mailModal.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} at this time. We apologize for any disappointment caused.\n\nBest regards,\nMini Bakes team`;
                  window.location.href = `mailto:${mailModal.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                  setMailModal(null);
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', borderRadius: '12px', border: '1px solid #ffebee', background: '#fff5f5', cursor: 'pointer', textAlign: 'left', transition: '0.2s' }}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#c62828', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: '700', color: '#c62828', marginBottom: '2px' }}>Reject Request</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Politely decline the booking request</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* WhatsApp Template Modal */}
      {whatsappModal && (
        <div className="admin-modal-overlay" onClick={() => setWhatsappModal(null)} style={{ zIndex: 4000 }}>
          <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '450px', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h3 style={{ margin: 0, color: '#2e7d32', fontSize: '20px' }}>WhatsApp Templates</h3>
                <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '13px' }}>Quick message for <strong>{whatsappModal.name}</strong></p>
              </div>
              <button onClick={() => setWhatsappModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}><X size={24} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <button 
                className="template-btn"
                onClick={() => {
                  const text = `Hi ${whatsappModal.name}! This is the Mini Bakes team. 🧁 We're happy to confirm your cupcake decorating class for ${new Date(whatsappModal.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} with ${whatsappModal.guests} guests. Can't wait!`;
                  const cleanPhone = whatsappModal.phone.replace(/\s+/g, '').replace(/^\+/, '');
                  window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
                  setWhatsappModal(null);
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', borderRadius: '12px', border: '1px solid #e8f5e9', background: '#f1fbf3', cursor: 'pointer', textAlign: 'left', transition: '0.2s' }}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#2e7d32', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: '700', color: '#2e7d32', marginBottom: '2px' }}>Accept & Confirm</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Friendly confirmation with class details</div>
                </div>
              </button>

              <button 
                className="template-btn"
                onClick={() => {
                  const text = `Hi ${whatsappModal.name}! The Mini Bakes team here. 🧁 Thank you for your request! Unfortunately, ${new Date(whatsappModal.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} is no longer available. Would you like to check our other available slots?`;
                  const cleanPhone = whatsappModal.phone.replace(/\s+/g, '').replace(/^\+/, '');
                  window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
                  setWhatsappModal(null);
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', borderRadius: '12px', border: '1px solid #fff3e0', background: '#fffaf0', cursor: 'pointer', textAlign: 'left', transition: '0.2s' }}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#ef6c00', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Calendar size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: '700', color: '#ef6c00', marginBottom: '2px' }}>Reschedule Request</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Ask customer to choose a different date</div>
                </div>
              </button>

              <button 
                className="template-btn"
                onClick={() => {
                  const text = `Hi ${whatsappModal.name}, the Mini Bakes team here. 🧁 Thank you for your interest! Unfortunately, we can't accommodate your request for ${new Date(whatsappModal.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} at this time. Apologies for the inconvenience!`;
                  const cleanPhone = whatsappModal.phone.replace(/\s+/g, '').replace(/^\+/, '');
                  window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
                  setWhatsappModal(null);
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', borderRadius: '12px', border: '1px solid #ffebee', background: '#fff5f5', cursor: 'pointer', textAlign: 'left', transition: '0.2s' }}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#c62828', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: '700', color: '#c62828', marginBottom: '2px' }}>Decline Request</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Politely decline via WhatsApp</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Date Booking Confirmation Modal */}
      {confirmBookingModal && (
        <div className="admin-modal-overlay" onClick={() => setConfirmBookingModal(null)} style={{ zIndex: 4500 }}>
          <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px', padding: '32px', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: bookedDates.includes(confirmBookingModal) ? '#fff5f5' : '#f1fbf3', color: bookedDates.includes(confirmBookingModal) ? '#c62828' : '#2e7d32', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Calendar size={32} />
            </div>
            
            <h3 style={{ margin: '0 0 12px 0', fontSize: '20px', color: '#333' }}>
              {bookedDates.includes(confirmBookingModal) ? 'Remove Booking?' : 'Mark as Booked?'}
            </h3>
            
            <p style={{ margin: '0 0 24px 0', color: '#666', fontSize: '15px', lineHeight: '1.5' }}>
              Are you sure you want to {bookedDates.includes(confirmBookingModal) ? 'make' : 'mark'} <strong>{new Date(confirmBookingModal).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</strong> {bookedDates.includes(confirmBookingModal) ? 'available again' : 'as fully booked'}?
            </p>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => setConfirmBookingModal(null)}
                style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #eee', background: '#fff', color: '#666', fontWeight: '600', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  toggleDate(confirmBookingModal);
                  setConfirmBookingModal(null);
                }}
                style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: bookedDates.includes(confirmBookingModal) ? '#c62828' : '#800000', color: '#fff', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 12px rgba(128,0,0,0.2)' }}
              >
                {bookedDates.includes(confirmBookingModal) ? 'Yes, Remove' : 'Yes, Mark Booked'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Progress WhatsApp Modal */}
      {orderProgressModal && (
        <div className="admin-modal-overlay" onClick={() => setOrderProgressModal(null)} style={{ zIndex: 4500 }}>
          <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px', width: '100%', padding: '28px', borderRadius: '16px', background: '#fff', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #f0f0f0', paddingBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: orderProgressModal.targetStatus === 'completed' ? '#e8f5e9' : '#e3f2fd', color: orderProgressModal.targetStatus === 'completed' ? '#2e7d32' : '#1565c0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {orderProgressModal.targetStatus === 'completed' ? <CheckCircle2 size={20} /> : <TrendingUp size={20} />}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', color: '#333', fontWeight: '700' }}>
                    {orderProgressModal.targetStatus === 'completed' ? 'Complete Order & Notify' : 'Update Order Progress'}
                  </h3>
                  <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#666' }}>
                    {orderProgressModal.targetStatus === 'completed' ? 'Mark order as complete and send pickup ready message.' : 'Notify the customer about their order state.'}
                  </p>
                </div>
              </div>
              <button onClick={() => setOrderProgressModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}><X size={20} /></button>
            </div>

            <div style={{ marginBottom: '20px', background: '#f8f9fa', padding: '16px', borderRadius: '12px', border: '1px solid #eee' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <span style={{ fontSize: '11px', color: '#888', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>Customer</span>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>{orderProgressModal.order.customer}</span>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#888', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>WhatsApp Number</span>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#333', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <WhatsAppIcon size={14} color="#2e7d32" />
                    {orderProgressModal.order.details?.whatsapp}
                  </span>
                </div>
              </div>
            </div>

            {orderProgressModal.targetStatus === 'completed' && (
              <div style={{ marginBottom: '20px', display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '11px', color: '#888', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Pickup Date</label>
                  <input
                    type="date"
                    value={adminPickupDate}
                    onChange={(e) => setAdminPickupDate(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', fontFamily: 'inherit' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '11px', color: '#888', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Pickup Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 10:00 AM - 12:00 PM"
                    value={adminPickupTime}
                    onChange={(e) => setAdminPickupTime(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', fontFamily: 'inherit' }}
                  />
                </div>
              </div>
            )}

            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '11px', color: '#888', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Customize Message Template</label>
              <textarea
                value={progressMessageText}
                onChange={e => setProgressMessageText(e.target.value)}
                style={{
                  width: '100%',
                  height: '150px',
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid #ddd',
                  fontSize: '14px',
                  color: '#333',
                  lineHeight: '1.5',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={e => e.target.style.borderColor = '#800000'}
                onBlur={e => e.target.style.borderColor = '#ddd'}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={() => {
                  const cleanPhone = orderProgressModal.order.details?.whatsapp?.replace(/\s+/g, '').replace(/^\+/, '') || '';
                  window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(progressMessageText)}`, '_blank');
                  handleUpdateStatus(orderProgressModal.order.id, orderProgressModal.targetStatus);
                  setOrderProgressModal(null);
                }}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: '#2e7d32',
                  color: '#fff',
                  fontWeight: '600',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(46,125,50,0.2)',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={e => e.currentTarget.style.backgroundColor = '#1b5e20'}
                onMouseOut={e => e.currentTarget.style.backgroundColor = '#2e7d32'}
              >
                <WhatsAppIcon size={16} color="#fff" />
                {orderProgressModal.targetStatus === 'completed' ? 'Send Message & Complete Order' : 'Send Message & Start Processing'}
              </button>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => {
                    handleUpdateStatus(orderProgressModal.order.id, orderProgressModal.targetStatus);
                    setOrderProgressModal(null);
                  }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    background: '#fff',
                    color: '#333',
                    fontWeight: '600',
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={e => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                  onMouseOut={e => e.currentTarget.style.backgroundColor = '#fff'}
                >
                  {orderProgressModal.targetStatus === 'completed' ? 'Complete Order Only' : 'Start Processing Only'}
                </button>
                <button
                  onClick={() => setOrderProgressModal(null)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #ffebee',
                    background: '#fffcfc',
                    color: '#c62828',
                    fontWeight: '600',
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={e => e.currentTarget.style.backgroundColor = '#ffebee'}
                  onMouseOut={e => e.currentTarget.style.backgroundColor = '#fffcfc'}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editProductModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          onClick={e => { if (e.target === e.currentTarget) setEditProductModal(null); }}
        >
          <div style={{ background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '860px', maxHeight: '94vh', overflowY: 'auto', boxShadow: '0 40px 80px rgba(0,0,0,0.28)', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{ padding: '22px 28px 18px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#fff', zIndex: 10, borderRadius: '20px 20px 0 0' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#111', letterSpacing: '-0.3px' }}>Edit Product</h3>
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#999', fontWeight: '500' }}>ID: {editProductModal.product.id} · {editProductModal.product.category}</p>
              </div>
              <button onClick={() => setEditProductModal(null)} style={{ background: '#f5f5f5', border: 'none', cursor: 'pointer', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', transition: '0.15s' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

              {/* === SECTION: Product Image === */}
              <div style={{ background: '#fafafa', borderRadius: '14px', padding: '18px', border: '1px solid #f0f0f0' }}>
                <p style={{ margin: '0 0 12px', fontSize: '11px', fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: '0.8px' }}>📷 Product Image</p>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{ width: '100px', height: '100px', borderRadius: '12px', overflow: 'hidden', border: '2px solid #eee', flexShrink: 0, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {editProductModal.imagePreview ? (
                      <img src={editProductModal.imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : editProductModal.product.img ? (
                      <img src={editProductModal.product.img} alt="Current" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <ImageIcon size={28} color="#ccc" />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ position: 'relative', border: '2px dashed #ddd', borderRadius: '10px', padding: '18px', textAlign: 'center', cursor: 'pointer', background: '#fff', transition: '0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = '#800000'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = '#ddd'}>
                      <Upload size={20} color="#bbb" style={{ marginBottom: '6px' }} />
                      <p style={{ margin: 0, fontSize: '13px', color: '#888', fontWeight: '500', fontFamily: 'inherit' }}>
                        {editProductModal.imageFile ? `✓ ${editProductModal.imageFile.name}` : 'Click to upload new image'}
                      </p>
                      <p style={{ margin: '3px 0 0', fontSize: '11px', color: '#bbb', fontFamily: 'inherit' }}>Auto-converted to WebP & optimized</p>
                      <input type="file" accept="image/*" onChange={e => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          setEditProductModal(prev => ({ ...prev, imageFile: file, imagePreview: URL.createObjectURL(file) }));
                        }
                      }} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* === SECTION: Core Details === */}
              <div style={{ background: '#fafafa', borderRadius: '14px', padding: '18px', border: '1px solid #f0f0f0' }}>
                <p style={{ margin: '0 0 14px', fontSize: '11px', fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: '0.8px' }}>📋 Core Details</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#555', marginBottom: '6px' }}>Product Name</label>
                    <input type="text" value={editProductModal.form.name}
                      onChange={e => setEditProductModal(prev => ({ ...prev, form: { ...prev.form, name: e.target.value } }))}
                      style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e8e8e8', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', background: '#fff' }}
                      onFocus={e => e.target.style.borderColor = '#800000'} onBlur={e => e.target.style.borderColor = '#e8e8e8'}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#555', marginBottom: '6px' }}>Price</label>
                      <input type="text" value={editProductModal.form.price}
                        onChange={e => setEditProductModal(prev => ({ ...prev, form: { ...prev.form, price: e.target.value } }))}
                        style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e8e8e8', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', background: '#fff' }}
                        onFocus={e => e.target.style.borderColor = '#800000'} onBlur={e => e.target.style.borderColor = '#e8e8e8'}
                        placeholder="e.g. €45"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#555', marginBottom: '6px' }}>Portions</label>
                      <input type="text" value={editProductModal.form.portions}
                        onChange={e => setEditProductModal(prev => ({ ...prev, form: { ...prev.form, portions: e.target.value } }))}
                        style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e8e8e8', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', background: '#fff' }}
                        onFocus={e => e.target.style.borderColor = '#800000'} onBlur={e => e.target.style.borderColor = '#e8e8e8'}
                        placeholder="e.g. Serves 12-15"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#555', marginBottom: '6px' }}>Status</label>
                      <select value={editProductModal.form.status}
                        onChange={e => setEditProductModal(prev => ({ ...prev, form: { ...prev.form, status: e.target.value } }))}
                        style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e8e8e8', borderRadius: '10px', fontSize: '14px', outline: 'none', background: '#fff', boxSizing: 'border-box', cursor: 'pointer', fontFamily: 'inherit' }}
                        onFocus={e => e.target.style.borderColor = '#800000'} onBlur={e => e.target.style.borderColor = '#e8e8e8'}
                      >
                        <option value="In Stock">In Stock</option>
                        <option value="Out of Stock">Out of Stock</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#555', marginBottom: '6px' }}>Description</label>
                    <textarea value={editProductModal.form.description}
                      onChange={e => setEditProductModal(prev => ({ ...prev, form: { ...prev.form, description: e.target.value } }))}
                      rows={3}
                      style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e8e8e8', borderRadius: '10px', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit', background: '#fff', lineHeight: 1.5 }}
                      onFocus={e => e.target.style.borderColor = '#800000'} onBlur={e => e.target.style.borderColor = '#e8e8e8'}
                      placeholder="Describe the product..."
                    />
                  </div>
                </div>
              </div>

              {/* === SECTION: Flavours === */}
              <div style={{ background: '#fafafa', borderRadius: '14px', padding: '18px', border: '1px solid #f0f0f0' }}>
                <p style={{ margin: '0 0 12px', fontSize: '11px', fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: '0.8px' }}>🍰 Flavours</p>
                <TagInput
                  label="Flavours"
                  values={editProductModal.form.flavours || []}
                  onChange={vals => setEditProductModal(prev => ({ ...prev, form: { ...prev.form, flavours: vals } }))}
                  placeholder="Type a flavour and press Enter (e.g. Vanilla, Red Velvet)"
                />
              </div>

              {/* === SECTION: Spreads === */}
              <div style={{ background: '#fafafa', borderRadius: '14px', padding: '18px', border: '1px solid #f0f0f0' }}>
                <p style={{ margin: '0 0 12px', fontSize: '11px', fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: '0.8px' }}>🫙 Spreads</p>
                <TagInput
                  label="Spreads"
                  values={editProductModal.form.spreads || []}
                  onChange={vals => setEditProductModal(prev => ({ ...prev, form: { ...prev.form, spreads: vals } }))}
                  placeholder="Type a spread and press Enter (e.g. Nutella, Lotus)"
                  accentColor="#5c2d91"
                />
              </div>

              {/* === SECTION: Options & Variants === */}
              <div style={{ background: '#fafafa', borderRadius: '14px', padding: '18px', border: '1px solid #f0f0f0' }}>
                <p style={{ margin: '0 0 12px', fontSize: '11px', fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: '0.8px' }}>⚙️ Other Options & Variants</p>
                <ProductOptionsBuilder
                  options={editProductModal.options}
                  setOptions={opts => setEditProductModal(prev => ({ ...prev, options: opts }))}
                />
              </div>

            </div>

            {/* Footer */}
            <div style={{ padding: '16px 28px 24px', borderTop: '1px solid #f0f0f0', display: 'flex', gap: '12px', position: 'sticky', bottom: 0, background: '#fff', borderRadius: '0 0 20px 20px' }}>
              <button onClick={() => setEditProductModal(null)}
                style={{ flex: 1, padding: '13px', background: '#f5f5f5', border: 'none', borderRadius: '12px', fontWeight: '600', color: '#555', cursor: 'pointer', fontSize: '14px', fontFamily: 'inherit' }}>
                Cancel
              </button>
              <button
                onClick={() => handleUpdateProduct(editProductModal.product.id, {
                  name: editProductModal.form.name,
                  price: editProductModal.form.price,
                  description: editProductModal.form.description,
                  status: editProductModal.form.status,
                  portions: editProductModal.form.portions,
                  flavours: editProductModal.form.flavours || [],
                  spreads: editProductModal.form.spreads || [],
                  options: editProductModal.options,
                  file: editProductModal.imageFile
                })}
                disabled={isUploadingProductImage}
                style={{ flex: 2, padding: '13px', background: isUploadingProductImage ? '#c0776e' : '#800000', border: 'none', borderRadius: '12px', fontWeight: '700', color: '#fff', cursor: isUploadingProductImage ? 'not-allowed' : 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontFamily: 'inherit', transition: '0.15s' }}>
                {isUploadingProductImage
                  ? <><span className="admin-spinner" style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />Saving...</>
                  : <><Save size={16} />Save Product</>
                }
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {isAddProductModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          onClick={e => { if (e.target === e.currentTarget) setIsAddProductModalOpen(false); }}
        >
          <div style={{ background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '860px', maxHeight: '94vh', overflowY: 'auto', boxShadow: '0 40px 80px rgba(0,0,0,0.28)', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{ padding: '22px 28px 18px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#fff', zIndex: 10, borderRadius: '20px 20px 0 0' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#111', letterSpacing: '-0.3px' }}>Add New Product</h3>
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#999', fontWeight: '500' }}>Fill in all the details for the new product</p>
              </div>
              <button onClick={() => setIsAddProductModalOpen(false)} style={{ background: '#f5f5f5', border: 'none', cursor: 'pointer', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' }}><X size={18} /></button>
            </div>

            <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* === Product Image === */}
              <div style={{ background: '#fafafa', borderRadius: '14px', padding: '18px', border: '1px solid #f0f0f0' }}>
                <p style={{ margin: '0 0 12px', fontSize: '11px', fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: '0.8px' }}>📷 Product Image</p>
                <div style={{ position: 'relative', width: '100%', height: '130px', borderRadius: '10px', border: '2px dashed #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', overflow: 'hidden', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#800000'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#ddd'}>
                  {newProductData.file ? (
                    <img src={URL.createObjectURL(newProductData.file)} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#aaa' }}>
                      <Upload size={26} style={{ marginBottom: '8px' }} />
                      <span style={{ fontSize: '13px', fontWeight: '500' }}>Click to upload image</span>
                      <span style={{ fontSize: '11px', marginTop: '3px' }}>Auto-converted to WebP</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={e => e.target.files && e.target.files[0] && setNewProductData({...newProductData, file: e.target.files[0]})} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                </div>
              </div>

              {/* === Core Details === */}
              <div style={{ background: '#fafafa', borderRadius: '14px', padding: '18px', border: '1px solid #f0f0f0' }}>
                <p style={{ margin: '0 0 14px', fontSize: '11px', fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: '0.8px' }}>📋 Core Details</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#555', marginBottom: '6px' }}>Product Name</label>
                    <input type="text" value={newProductData.name} onChange={e => setNewProductData({...newProductData, name: e.target.value})}
                      style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e8e8e8', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', background: '#fff' }}
                      onFocus={e => e.target.style.borderColor = '#800000'} onBlur={e => e.target.style.borderColor = '#e8e8e8'}
                      placeholder="e.g. 6 inch Velvet Cake" />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#555', marginBottom: '6px' }}>Price</label>
                      <input type="text" value={newProductData.price} onChange={e => setNewProductData({...newProductData, price: e.target.value})}
                        style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e8e8e8', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', background: '#fff' }}
                        onFocus={e => e.target.style.borderColor = '#800000'} onBlur={e => e.target.style.borderColor = '#e8e8e8'}
                        placeholder="e.g. €45" />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#555', marginBottom: '6px' }}>Portions</label>
                      <input type="text" value={newProductData.portions} onChange={e => setNewProductData({...newProductData, portions: e.target.value})}
                        style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e8e8e8', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', background: '#fff' }}
                        onFocus={e => e.target.style.borderColor = '#800000'} onBlur={e => e.target.style.borderColor = '#e8e8e8'}
                        placeholder="e.g. Serves 12-15" />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#555', marginBottom: '6px' }}>Status</label>
                      <select value={newProductData.status} onChange={e => setNewProductData({...newProductData, status: e.target.value})}
                        style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e8e8e8', borderRadius: '10px', fontSize: '14px', outline: 'none', background: '#fff', boxSizing: 'border-box', cursor: 'pointer', fontFamily: 'inherit' }}
                        onFocus={e => e.target.style.borderColor = '#800000'} onBlur={e => e.target.style.borderColor = '#e8e8e8'}>
                        <option value="In Stock">In Stock</option>
                        <option value="Out of Stock">Out of Stock</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#555', marginBottom: '6px' }}>Category</label>
                      <select value={newProductData.category} onChange={e => setNewProductData({...newProductData, category: e.target.value})}
                        style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e8e8e8', borderRadius: '10px', fontSize: '14px', outline: 'none', background: '#fff', boxSizing: 'border-box', cursor: 'pointer', fontFamily: 'inherit' }}
                        onFocus={e => e.target.style.borderColor = '#800000'} onBlur={e => e.target.style.borderColor = '#e8e8e8'}>
                        {productCategories.filter(c => c !== 'All').map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#555', marginBottom: '6px' }}>Description</label>
                      <input type="text" value={newProductData.description || ''} onChange={e => setNewProductData({...newProductData, description: e.target.value})}
                        style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e8e8e8', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', background: '#fff' }}
                        onFocus={e => e.target.style.borderColor = '#800000'} onBlur={e => e.target.style.borderColor = '#e8e8e8'}
                        placeholder="Brief product description" />
                    </div>
                  </div>
                </div>
              </div>

              {/* === Flavours === */}
              <div style={{ background: '#fafafa', borderRadius: '14px', padding: '18px', border: '1px solid #f0f0f0' }}>
                <p style={{ margin: '0 0 12px', fontSize: '11px', fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: '0.8px' }}>🍰 Flavours</p>
                <TagInput
                  label="Flavours"
                  values={newProductData.flavours || []}
                  onChange={vals => setNewProductData({...newProductData, flavours: vals})}
                  placeholder="Type a flavour and press Enter (e.g. Vanilla, Red Velvet)"
                />
              </div>

              {/* === Spreads === */}
              <div style={{ background: '#fafafa', borderRadius: '14px', padding: '18px', border: '1px solid #f0f0f0' }}>
                <p style={{ margin: '0 0 12px', fontSize: '11px', fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: '0.8px' }}>🫙 Spreads</p>
                <TagInput
                  label="Spreads"
                  values={newProductData.spreads || []}
                  onChange={vals => setNewProductData({...newProductData, spreads: vals})}
                  placeholder="Type a spread and press Enter (e.g. Nutella, Lotus)"
                  accentColor="#5c2d91"
                />
              </div>

              {/* === Other Options === */}
              <div style={{ background: '#fafafa', borderRadius: '14px', padding: '18px', border: '1px solid #f0f0f0' }}>
                <p style={{ margin: '0 0 12px', fontSize: '11px', fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: '0.8px' }}>⚙️ Other Options & Variants</p>
                <ProductOptionsBuilder
                  options={newProductData.options}
                  setOptions={opts => setNewProductData({...newProductData, options: opts})}
                />
              </div>

            </div>

            {/* Footer */}
            <div style={{ padding: '16px 28px 24px', borderTop: '1px solid #f0f0f0', display: 'flex', gap: '12px', position: 'sticky', bottom: 0, background: '#fff', borderRadius: '0 0 20px 20px' }}>
              <button onClick={() => setIsAddProductModalOpen(false)}
                style={{ flex: 1, padding: '13px', background: '#f5f5f5', border: 'none', borderRadius: '12px', fontWeight: '600', color: '#555', cursor: 'pointer', fontSize: '14px', fontFamily: 'inherit' }}>Cancel</button>
              <button onClick={handleConfirmAddProduct} disabled={isUploadingProductImage}
                style={{ flex: 2, padding: '13px', background: '#800000', border: 'none', borderRadius: '12px', fontWeight: '700', color: '#fff', cursor: isUploadingProductImage ? 'not-allowed' : 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontFamily: 'inherit', transition: '0.15s' }}>
                {isUploadingProductImage ? <span className="admin-spinner" style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /> : <CheckCircle2 size={18} />}
                {isUploadingProductImage ? 'Saving...' : 'Confirm & Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification Overlay */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          background: toast.type === 'error' ? '#FFF5F5' : (toast.type === 'info' ? '#E3F2FD' : '#E8F5E9'),
          color: toast.type === 'error' ? '#C62828' : (toast.type === 'info' ? '#1565C0' : '#2E7D32'),
          border: `1px solid ${toast.type === 'error' ? '#FFCDD2' : (toast.type === 'info' ? '#B3E5FC' : '#C8E6C9')}`,
          borderRadius: '12px',
          padding: '16px 20px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          minWidth: '280px',
          maxWidth: '400px'
        }}>
          {toast.type === 'error' ? <X size={20} /> : <CheckCircle2 size={20} />}
          <div style={{ flex: 1, fontSize: '14px', fontWeight: '600' }}>{toast.message}</div>
          <button 
            onClick={() => setToast(null)} 
            style={{ background: 'none', border: 'none', color: toast.type === 'error' ? '#EF9A9A' : (toast.type === 'info' ? '#90CAF9' : '#A5D6A7'), cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

const getUsername = (url) => {
  if (!url) return '';
  const cleanUrl = url.replace(/\/$/, '');
  return cleanUrl.split('/').pop() || '';
};

export default function AdminApp() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.auth.getSession(),
      new Promise(resolve => setTimeout(resolve, 4000))
    ]).then(([{ data: { session } }]) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <OvenLoader />;
  }

  if (!session) {
    return <AdminLogin />;
  }

  return <AdminAppContent session={session} />;
}

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setLoading(false);
  };

  return (
    <>
      <style>
        {`
          @media (max-width: 768px) {
            .admin-login-wrapper {
              flex-direction: column !important;
              height: auto !important;
              min-height: 100dvh !important;
            }
            .admin-login-left {
              flex: none !important;
              padding: 40px 20px 30px !important;
              align-items: center !important;
            }
            .admin-login-logo-area {
              margin-bottom: 0 !important;
              justify-content: center !important;
            }
            .admin-login-left-content {
              display: none !important; /* Hide big text on mobile for a clean login */
            }
            .admin-login-right {
              flex: 1 !important;
              padding: 40px 20px !important;
              justify-content: flex-start !important;
            }
            .admin-login-footer {
              position: static !important;
              margin-top: 40px !important;
            }
          }
        `}
      </style>
      <div className="admin-login-wrapper" style={{ display: 'flex', height: '100vh', width: '100vw', background: '#fff', fontFamily: "'Inter', sans-serif" }}>
        {/* Left Branding Side */}
        <div className="admin-login-left" style={{ 
        flex: 1.2, 
        background: 'linear-gradient(135deg, #5c0d1b 0%, #3a0811 100%)', 
        padding: '60px', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Abstract background shapes */}
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '60%', height: '60%', background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%' }}></div>
        
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px', margin: '0 auto', width: '100%' }}>
          {/* Logo Area */}
          <div className="admin-login-logo-area" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '60px' }}>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '12px', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Cake size={32} color="#fff" />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '800', letterSpacing: '-0.5px' }}>Mini Bakes</h1>
              <p style={{ margin: 0, fontSize: '12px', fontWeight: '600', letterSpacing: '2px', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>Executive Console</p>
            </div>
          </div>

          <div className="admin-login-left-content">
            <h2 style={{ fontSize: '56px', fontWeight: '800', lineHeight: '1.1', marginBottom: '24px', letterSpacing: '-1px' }}>
            <span style={{ color: 'rgba(255,255,255,0.9)' }}>Command the</span><br />
            <span style={{ color: '#FFD1DC' }}>Bakery.</span>
          </h2>

          <p style={{ fontSize: '18px', lineHeight: '1.6', color: 'rgba(255,255,255,0.8)', marginBottom: '60px', maxWidth: '480px' }}>
            The centralized hub for moderating orders, analyzing growth, and controlling the Mini Bakes platform from a single executive interface.
          </p>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 20px', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600' }}>
              <BarChart3 size={16} /> Real-time Analytics
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 20px', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600' }}>
              <Database size={16} /> Global Database
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 20px', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600' }}>
              <Activity size={16} /> Live Monitoring
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Right Login Side */}
      <div className="admin-login-right" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', position: 'relative' }}>
        <div style={{ width: '100%', maxWidth: '420px', textAlign: 'center' }}>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', background: '#FFF0F4', borderRadius: '20px', marginBottom: '32px', boxShadow: '0 8px 24px rgba(92,13,27,0.1)' }}>
            <Shield size={32} color="#5c0d1b" />
          </div>

          <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#1a1a1a', margin: '0 0 12px 0' }}>Admin Portal</h2>
          <p style={{ color: '#666', margin: '0 0 40px 0', fontSize: '15px' }}>Identity verification required for command access.</p>

          <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
            {error && <div style={{ background: '#ffebee', color: '#c62828', padding: '12px', borderRadius: '8px', marginBottom: '24px', fontSize: '14px', textAlign: 'center', fontWeight: '600' }}>{error}</div>}
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700', color: '#444', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #e0e0e0', outline: 'none', boxSizing: 'border-box', fontSize: '15px', background: '#fafafa', transition: 'border-color 0.2s' }} onFocus={e => e.target.style.borderColor = '#5c0d1b'} onBlur={e => e.target.style.borderColor = '#e0e0e0'} />
            </div>
            
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700', color: '#444', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #e0e0e0', outline: 'none', boxSizing: 'border-box', fontSize: '15px', background: '#fafafa', transition: 'border-color 0.2s' }} onFocus={e => e.target.style.borderColor = '#5c0d1b'} onBlur={e => e.target.style.borderColor = '#e0e0e0'} />
            </div>
            
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '16px', background: loading ? '#aaa' : '#5c0d1b', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 8px 16px rgba(92,13,27,0.2)' }}>
              {loading ? 'Authenticating...' : 'Continue to Dashboard'}
            </button>
          </form>

          <div style={{ marginTop: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '12px', color: '#888', fontWeight: '500' }}>
            <Sparkles size={12} color="#f5a623" />
            Encrypted Terminal v2.5.0 Professional
          </div>
        </div>

        <div className="admin-login-footer" style={{ position: 'absolute', bottom: '24px', fontSize: '12px', color: '#aaa', fontWeight: '500' }}>
          &copy; {new Date().getFullYear()} Mini Bakes &bull; Authorized Personnel Only
        </div>
      </div>
    </div>
    </>
  );
}
