import React from 'react';
import { AlertCircle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          width: '100%',
          height: '100%',
          minHeight: '300px',
          background: '#fdf2f2',
          borderRadius: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          textAlign: 'center',
          color: '#6b1111'
        }}>
          <AlertCircle size={40} style={{ marginBottom: '10px' }} />
          <h3>3D Viewer Unavailable</h3>
          <p style={{ fontSize: '14px', maxWidth: '80%' }}>
            We're unable to load the 3D viewer on this device.
          </p>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
