'use client';
import { useState } from 'react';

export default function BookingCart({ services, accentColor, businessSlug, businessName }) {
  const [step, setStep] = useState(1);
  const [cart, setCart] = useState([]);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', date: '', time: 'afternoon' });

  const toggleService = (service) => {
    setCart(prev => 
      prev.find(s => s.name === service.name) 
        ? prev.filter(s => s.name !== service.name) 
        : [...prev, service]
    );
  };

  const total = cart.reduce((acc, curr) => acc + (curr.price || 0), 0);

  const containerStyle = { display: 'flex', flexDirection: 'column', gap: '16px' };

  const cardStyle = (selected) => ({
    padding: '24px',
    border: `1px solid ${selected ? accentColor : 'rgba(255,255,255,0.1)'}`,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: selected ? 'rgba(255,255,255,0.08)' : 'transparent',
    borderRadius: '2px',
  });

  const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    padding: '16px',
    outline: 'none',
    color: '#fff',
    fontSize: '14px',
    fontFamily: 'system-ui, sans-serif',
    borderRadius: '2px',
    boxSizing: 'border-box',
  };

  const btnStyle = {
    width: '100%',
    padding: '16px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '3px',
    fontSize: '11px',
    backgroundColor: accentColor,
    color: '#000',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '2px',
    marginTop: '16px',
    fontFamily: 'system-ui, sans-serif',
    transition: 'opacity 0.2s',
  };

  const badgeStyle = {
    fontSize: '9px',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    padding: '3px 10px',
    background: 'rgba(255,255,255,0.08)',
    display: 'inline-block',
    marginTop: '8px',
    color: accentColor,
    borderRadius: '2px',
  };

  return (
    <div style={containerStyle}>
      {step === 1 && (
        <div style={containerStyle}>
          {services.filter(s => s.name).map((service, idx) => {
            const selected = cart.find(s => s.name === service.name);
            return (
              <div key={idx} onClick={() => toggleService(service)} style={cardStyle(selected)}>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: 500, color: '#fff', margin: 0 }}>{service.name}</h4>
                  <p style={{ fontSize: '12px', opacity: 0.45, margin: '4px 0 0', fontFamily: 'system-ui' }}>
                    {service.duration ? `${service.duration} mins` : ''}
                  </p>
                  {service.badge && <span style={badgeStyle}>{service.badge}</span>}
                </div>
                <span style={{ fontSize: '20px', fontWeight: 300, color: '#fff' }}>
                  {service.price ? `$${service.price}` : 'Call'}
                </span>
              </div>
            );
          })}
          
          <button 
            disabled={cart.length === 0}
            onClick={() => setStep(2)}
            style={{ ...btnStyle, opacity: cart.length === 0 ? 0.3 : 1 }}
          >
            Continue — ${total}
          </button>
        </div>
      )}

      {step === 2 && (
        <div style={containerStyle}>
          <input 
            type="text" placeholder="Your Name" required
            style={inputStyle}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <input 
            type="tel" placeholder="Phone Number" inputMode="tel" required
            style={inputStyle}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
          <input 
            type="email" placeholder="Email Address" inputMode="email" required
            style={inputStyle}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <input 
              type="date" 
              style={inputStyle}
              onChange={(e) => setFormData({...formData, date: e.target.value})} 
            />
            <select 
              style={{ ...inputStyle, appearance: 'none' }}
              onChange={(e) => setFormData({...formData, time: e.target.value})}
            >
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
            </select>
          </div>
          <textarea
            placeholder="Notes (optional) — e.g. Bringing a Pinterest reference photo"
            style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
          />
          <button 
            onClick={() => setStep(3)}
            style={btnStyle}
          >
            Confirm Booking
          </button>
          <button 
            onClick={() => setStep(1)}
            style={{ ...btnStyle, background: 'transparent', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.15)' }}
          >
            Back
          </button>
        </div>
      )}

      {step === 3 && (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>✨</div>
          <h3 style={{ fontSize: '28px', marginBottom: '12px', fontStyle: 'italic', color: '#fff', fontWeight: 400 }}>
            Request Sent!
          </h3>
          <p style={{ opacity: 0.6, marginBottom: '8px', fontSize: '15px', lineHeight: 1.7, maxWidth: '360px', margin: '0 auto 24px' }}>
            We've notified the team at {businessName}. Expect a call or text within 2 hours to confirm your appointment.
          </p>
          <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', padding: '20px', borderRadius: '2px', marginBottom: '24px', textAlign: 'left' }}>
            <div style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: accentColor, marginBottom: '12px' }}>Your Request</div>
            {cart.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>
                <span>{item.name}</span>
                <span>{item.price ? `$${item.price}` : 'TBD'}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '12px', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#fff' }}>
              <span>Total</span>
              <span>${total}</span>
            </div>
          </div>
          <button 
            onClick={() => { setStep(1); setCart([]); }}
            style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Book another service
          </button>
        </div>
      )}
    </div>
  );
}
