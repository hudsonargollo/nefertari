'use client';
import React, { useEffect, useState } from 'react';

interface Props {
  dark: boolean;
  authToken: string | null;
  onOpenAuth: () => void;
}

interface CustomerData {
  loyaltyPoints: number;
  pendingReward: boolean;
  name: string;
}

const TOTAL = 10;
const GOLD  = '#C8941A';

export default function LoyaltyBadge({ dark, authToken, onOpenAuth }: Props) {
  const [customer, setCustomer] = useState<CustomerData | null>(null);

  useEffect(() => {
    if (!authToken) { setCustomer(null); return; }
    fetch('/api/customer/me', { headers: { 'X-Auth-Token': authToken } })
      .then(r => r.ok ? r.json() : null)
      .then((d: CustomerData | null) => setCustomer(d))
      .catch(() => setCustomer(null));
  }, [authToken]);

  const pts      = customer?.loyaltyPoints ?? 0;
  const pending  = customer?.pendingReward ?? false;
  const loggedIn = !!authToken && !!customer;

  // SVG circular progress
  const R = 16; const CIRC = 2 * Math.PI * R;
  const progress = loggedIn ? (pts / TOTAL) * CIRC : 0;

  return (
    <button
      onClick={onOpenAuth}
      title={loggedIn ? `${pts}/${TOTAL} selos` : 'Programa de fidelidade'}
      style={{
        position: 'fixed', bottom: '5.5rem', right: '1.25rem', zIndex: 45,
        width: '52px', height: '52px', borderRadius: '50%',
        background: dark
          ? pending ? 'rgba(212,175,55,0.15)' : 'rgba(20,16,12,0.9)'
          : pending ? 'rgba(212,175,55,0.12)' : 'rgba(250,245,232,0.92)',
        border: `2px solid ${pending ? '#D4AF37' : dark ? 'rgba(200,148,26,0.3)' : 'rgba(200,148,26,0.25)'}`,
        backdropFilter: 'blur(12px)',
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: pending
          ? '0 0 18px rgba(212,175,55,0.5), 0 4px 16px rgba(0,0,0,0.3)'
          : '0 4px 16px rgba(0,0,0,0.25)',
        animation: pending ? 'loyaltyPulse 2s ease-in-out infinite' : 'none',
        transition: 'all 0.3s',
        padding: 0,
      }}
    >
      {loggedIn ? (
        // Circular progress ring
        <svg width="44" height="44" viewBox="0 0 44 44" style={{ position:'absolute' }}>
          {/* track */}
          <circle cx="22" cy="22" r={R} fill="none"
                  stroke={dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'} strokeWidth="3" />
          {/* progress */}
          <circle cx="22" cy="22" r={R} fill="none"
                  stroke={pending ? '#D4AF37' : GOLD} strokeWidth="3"
                  strokeDasharray={`${progress} ${CIRC}`}
                  strokeLinecap="round"
                  transform="rotate(-90 22 22)" />
        </svg>
      ) : null}

      {/* Center icon */}
      <div style={{ position:'relative', zIndex:1, display:'flex', flexDirection:'column',
                    alignItems:'center', justifyContent:'center', gap:'1px' }}>
        {loggedIn ? (
          pending ? (
            <span style={{ fontSize:'1.2rem' }}>🎁</span>
          ) : (
            <>
              <span style={{ fontSize:'0.65rem', fontWeight:700, color: GOLD, lineHeight:1 }}>{pts}</span>
              <div style={{ width:'18px', height:'1px', background:`${GOLD}60` }} />
              <span style={{ fontSize:'0.5rem', color: dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.3)', lineHeight:1 }}>{TOTAL}</span>
            </>
          )
        ) : (
          <span style={{ fontSize:'1.1rem', filter:`drop-shadow(0 0 4px ${GOLD}80)` }}>⭐</span>
        )}
      </div>

      <style>{`
        @keyframes loyaltyPulse {
          0%,100% { box-shadow: 0 0 18px rgba(212,175,55,0.5), 0 4px 16px rgba(0,0,0,0.3); }
          50%      { box-shadow: 0 0 30px rgba(212,175,55,0.8), 0 4px 20px rgba(0,0,0,0.4); }
        }
      `}</style>
    </button>
  );
}
