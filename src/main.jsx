import React, { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const AdminApp = lazy(() => import('./AdminApp.jsx'))

// Check if we are on the admin subdomain, admin path, or using admin hash (best for GitHub Pages)
const isAdminRoute = window.location.hostname.startsWith('admin') || 
                     window.location.pathname.endsWith('/admin') || 
                     window.location.pathname.includes('/admin/') ||
                     window.location.hash === '#admin' ||
                     window.location.hash.startsWith('#/admin');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isAdminRoute ? (
      <Suspense fallback={<div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', color: '#800000', fontWeight: 'bold' }}>Loading Admin Panel...</div>}>
        <AdminApp />
      </Suspense>
    ) : (
      <App />
    )}
  </StrictMode>,
)
