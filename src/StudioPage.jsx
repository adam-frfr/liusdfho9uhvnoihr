import React, { useState, useEffect } from 'react';
import { Calendar, Users, Clock, ArrowRight, CheckCircle2, MapPin, Star } from 'lucide-react';
import './ClassesPage.css';
import SafeImage from './components/SafeImage';
import { supabase } from './supabase';

import classImg5 from './assets/class/5.webp';
import classImg6 from './assets/class/6.webp';

// Product-only class images; all photos containing people were removed.
const classImages = [classImg5, classImg6];

// Booked dates are now managed via Admin Panel and stored in Supabase
const DEFAULT_BOOKED_DATES = [
  '2026-05-15',
  '2026-05-22',
  '2026-05-28'
];

const StudioCalendar = ({ onDateSelect, selectedDate }) => {
  const [viewDate, setViewDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [bookedDates, setBookedDates] = useState(DEFAULT_BOOKED_DATES);

  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const { data, error } = await supabase
          .from('booked_dates')
          .select('date');
        
        if (error) throw error;
        if (data) {
          setBookedDates(data.map(d => d.date));
        }
      } catch (err) {
        console.error('Error fetching booked dates:', err);
        // Fallback to defaults if table missing
      }
    };

    fetchBookedDates();
  }, []);
  
  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
  
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthName = viewDate.toLocaleString('default', { month: 'long' });
  
  const days = [];
  // Fill empty spots for first week
  for (let i = 0; i < firstDayOfMonth(year, month); i++) {
    days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
  }
  
  // Fill actual days
  for (let d = 1; d <= daysInMonth(year, month); d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isBooked = bookedDates.includes(dateStr);
    const isSelected = selectedDate === dateStr;
    const todayObj = new Date();
    const todayStr = `${todayObj.getFullYear()}-${String(todayObj.getMonth() + 1).padStart(2, '0')}-${String(todayObj.getDate()).padStart(2, '0')}`;
    const isToday = todayStr === dateStr;
    
    days.push(
      <div 
        key={d} 
        className={`calendar-day ${isBooked ? 'booked' : 'available'} ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
        onClick={() => !isBooked && onDateSelect(dateStr)}
      >
        <span className="day-number">{d}</span>
        {isBooked && <span className="booked-label">BOOKED</span>}
        {!isBooked && <span className="available-dot"></span>}
      </div>
    );
  }

  const changeMonth = (offset) => {
    setViewDate(new Date(year, month + offset, 1));
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={() => changeMonth(-1)} className="month-nav-btn">&lt;</button>
        <h3>{monthName} {year}</h3>
        <button onClick={() => changeMonth(1)} className="month-nav-btn">&gt;</button>
      </div>
      
      <div className="calendar-main-content">
        <div className="calendar-legend">
          <div className="legend-item"><span className="legend-box available"></span> Available</div>
          <div className="legend-item"><span className="legend-box booked"></span> Fully Booked</div>
          <div className="legend-item"><span className="legend-box selected"></span> Your Selection</div>
          <p className="calendar-note">Maroon dates are already reserved for private events.</p>
        </div>
        
        <div className="calendar-body">
          <div className="calendar-weekdays">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
          </div>
          <div className="calendar-grid">
            {days}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ClassesPage() {
  const [bookingStatus, setBookingStatus] = useState(null);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [phoneCode, setPhoneCode] = useState('+356');
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('minibakes_studio_draft');
    if (saved) return JSON.parse(saved);

    const profileSaved = localStorage.getItem('minibakes_user_profile');
    const profile = profileSaved ? JSON.parse(profileSaved) : {};

    return {
      name: profile.name || '',
      email: profile.email || '',
      phone: profile.phone || '',
      date: '',
      guests: '1'
    };
  });

  useEffect(() => {
    localStorage.setItem('minibakes_studio_draft', JSON.stringify(formData));
  }, [formData]);
  const [showGuestLimit, setShowGuestLimit] = useState(false);

  const [activeGalleryIndex, setActiveGalleryIndex] = useState(null);

  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) return;

    const observerOptions = {
      threshold: 0.8,
      rootMargin: '-10% 0px -10% 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = parseInt(entry.target.getAttribute('data-index'));
          setActiveGalleryIndex(idx);
        }
      });
    }, observerOptions);

    const cards = document.querySelectorAll('.gallery-card');
    cards.forEach(card => observer.observe(card));

    return () => {
      cards.forEach(card => observer.unobserve(card));
    };
  }, []);

  const handleGuestChange = (e) => {
    const val = e.target.value;
    if (parseInt(val) > 15) {
      setFormData({...formData, guests: '15'});
      setShowGuestLimit(true);
      setTimeout(() => setShowGuestLimit(false), 4000);
    } else {
      setFormData({...formData, guests: val});
    }
  };


  const handleBooking = async (e) => {
    e.preventDefault();
    setBookingStatus('loading');
    
    try {
      const { error } = await supabase.from('class_bookings').insert([{
        name: formData.name,
        email: formData.email,
        phone: `${phoneCode} ${formData.phone}`,
        date: formData.date,
        guests: parseInt(formData.guests, 10),
        status: 'pending'
      }]);
      
      if (error) throw error;
      
      const existingProfile = JSON.parse(localStorage.getItem('minibakes_user_profile') || '{}');
      localStorage.setItem('minibakes_user_profile', JSON.stringify({
        ...existingProfile,
        name: formData.name,
        phone: formData.phone,
        email: formData.email
      }));
      setBookingStatus('success');
      setFormData({ name: '', email: '', phone: '', date: '', guests: '1' });
      localStorage.removeItem('minibakes_studio_draft');
    } catch (err) {
      console.error('Error booking class:', err);
      alert('There was an issue submitting your booking request. Please try again.');
      setBookingStatus(null);
    }
  };

  return (
    <div className="classes-page">
      {/* Hero Section */}
      <section className="classes-hero">
        <div className="studio-hero-content">
          <span className="classes-badge">Cupcake Decorating Experiences</span>
          <h1>A Sweet Experience, <br/><span>Brought to You</span></h1>
          <p>Mini Bakes comes to <em>you</em> — your home, venue, or event space — for a fun, hands-on cupcake decorating experience. Perfect for birthdays, hen parties, team events, and more.</p>
          <button 
            onClick={() => document.getElementById('schedule').scrollIntoView({ behavior: 'smooth' })} 
            className="cta-btn-primary"
          >
            Request a Booking <ArrowRight size={18} />
          </button>
        </div>
        <div className="classes-hero-image">
          {classImages.map((img, idx) => (
            <div 
              key={idx} 
              className={`hero-slide ${idx === currentImgIndex ? 'active' : ''}`}
            >
              <SafeImage src={img} alt={`Class Moment ${idx + 1}`} />
            </div>
          ))}
          <div className="classes-floating-card">
            <Star className="star-icon" fill="#800000" color="#800000" />
            <div>
              <strong>4.9/5 Rating</strong>
              <p>from 500+ students</p>
            </div>
          </div>
        </div>
      </section>



      {/* Why Join Us */}
      <section className="studio-perks">
        <div className="perk-card">
          <div className="perk-icon"><Users size={24} /></div>
          <h3>Small Groups</h3>
          <p>Maximum of 15 people for a fun, personalized experience.</p>
        </div>
        <div className="perk-card">
          <div className="perk-icon"><Clock size={24} /></div>
          <h3>Duration</h3>
          <p>Around 1.5 hours of hands-on decorating fun.</p>
        </div>
        <div className="perk-card">
          <div className="perk-icon"><CheckCircle2 size={24} /></div>
          <h3>All Inclusive</h3>
          <p>We provide all ingredients, aprons, and professional tools.</p>
        </div>
      </section>

      {/* Availability Calendar */}
      <section id="schedule" className="studio-schedule">
        <div className="section-header-alt">
          <span className="section-badge">Booking Availability</span>
          <h2 className="section-title-alt">SELECT YOUR DATE</h2>
        </div>
        
        <div className="calendar-wrapper">
          <StudioCalendar 
            selectedDate={formData.date}
            onDateSelect={(date) => {
              setFormData({...formData, date});
              document.getElementById('booking-form').scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </div>
      </section>

      {/* Gallery Section */}
      <section className="classes-gallery">
        <h2 className="section-title-alt">CLASS MOMENTS</h2>
        <div className="expanding-gallery">
          {classImages.map((img, idx) => (
            <div 
              key={idx}
              data-index={idx}
              className={`gallery-card ${activeGalleryIndex === idx ? 'expanded' : ''}`}
            >
              <SafeImage src={img} alt={`Class moment ${idx + 1}`} />
              <div className="gallery-card-overlay">
                <span>View Moment {idx + 1}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Booking Form */}
      <section id="booking-form" className="booking-section">
        <div className="booking-container">
          <div className="booking-info">
            <h2>Reserve Your Spot</h2>
            <p>Ready to book? Fill out the form and we will confirm your date and location within 24 hours.</p>
            <div className="contact-details">
              <div className="contact-item">
                <MapPin size={20} />
                <span>We come to you — home, venue, or event space</span>
              </div>
              <div className="contact-item">
                <Clock size={20} />
                <span>Flexible scheduling, weekdays & weekends</span>
              </div>
            </div>
          </div>
          <div className="booking-form-wrapper">
            {bookingStatus === 'success' ? (
              <div className="booking-success">
                <CheckCircle2 size={64} color="#800000" />
                <h3>Request Sent!</h3>
                <p>We've received your booking request for {formData.date}. We'll email you soon to confirm the details.</p>
                <button className="cta-btn-primary" onClick={() => setBookingStatus(null)}>Book Another</button>
              </div>
            ) : (
              <form onSubmit={handleBooking} className="studio-form">
                <div className="form-group">
                  <label>Your Name</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Jane Doe"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    required 
                    placeholder="jane@example.com"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <div className="phone-input-row">
                    <select 
                      value={phoneCode} 
                      onChange={(e) => setPhoneCode(e.target.value)}
                      className="studio-country-code"
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
                      placeholder="e.g. 7982 0529" 
                      required 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Selected Date</label>
                    <input 
                      type="text" 
                      readOnly 
                      placeholder="Select from calendar above"
                      value={formData.date}
                      required
                      className="readonly-input clickable-date-input"
                      onClick={() => {
                        const calendarEl = document.getElementById('schedule');
                        if (calendarEl) {
                          const headerOffset = 120;
                          const elementPosition = calendarEl.getBoundingClientRect().top;
                          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                          window.scrollTo({
                            top: offsetPosition,
                            behavior: "smooth"
                          });
                        }
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Guests (Max 15)</label>
                    <input 
                      type="number"
                      min="1"
                      max="15"
                      value={formData.guests}
                      required
                      onChange={handleGuestChange}
                    />
                    {showGuestLimit && (
                      <div className="guest-limit-note">
                        Maximum capacity is 15 guests.
                      </div>
                    )}
                  </div>
                </div>
                <button type="submit" className="submit-booking-btn" disabled={bookingStatus === 'loading'}>
                  {bookingStatus === 'loading' ? 'Processing...' : 'Confirm Booking Request'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
