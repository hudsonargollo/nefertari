'use client';
import React, { useState, useEffect } from 'react';
import { X, ArrowRight, Loader2, CheckCircle2, Gift, Star } from 'lucide-react';
import { type ThemeTokens } from '../lib/useTheme';

const sans  = 'Inter, system-ui, sans-serif';
const serif = 'Playfair Display, Georgia, serif';
const GOLD  = '#C8941A';
const TOTAL = 10;

interface Customer {
  phone: string; name: string;
  loyaltyPoints: number; totalCycles: number; pendingReward: boolean;
  orderCount: number; totalSpent: number;
  reward?: { recipeTitle: string; recipeDescription: string; seasonName: string; imageUrl?: string } | null;
}

interface Props {
  dark: boolean; T: ThemeTokens;
  authToken: string | null;
  onClose: () => void;
  onAuth: (token: string) => void;
  onLogout: () => void;
}

const phoneFormat = (v: string) => {
  const d = v.replace(/\D/g,'').slice(0,11);
  if (d.length<=2)  return `(${d}`;
  if (d.length<=7)  return `(${d.slice(0,2)}) ${d.slice(2)}`;
  return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
};

type Tab = 'login' | 'register' | 'profile';

export default function CustomerAuth({ dark, T, authToken, onClose, onAuth, onLogout }: Props) {
  const [tab,      setTab]      = useState<Tab>(authToken ? 'profile' : 'login');
  const [phone,    setPhone]    = useState('');
  const [name,     setName]     = useState('');
  const [pin,      setPin]      = useState('');
  const [newPin,   setNewPin]   = useState('');
  const [busy,     setBusy]     = useState(false);
  const [err,      setErr]      = useState('');
  const [ok,       setOk]       = useState('');
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [changingPin, setChangingPin] = useState(false);

  useEffect(() => {
    if (authToken && tab === 'profile') {
      fetch('/api/customer/me', { headers: { 'X-Auth-Token': authToken } })
        .then(r => r.ok ? r.json() : null)
        .then((d: Customer | null) => setCustomer(d))
        .catch(() => {});
    }
  }, [authToken, tab]);

  const inp: React.CSSProperties = {
    width:'100%', padding:'0.75rem 1rem', borderRadius:'0.75rem', boxSizing:'border-box',
    background: dark ? 'rgba(255,255,255,0.06)' : '#fff',
    border:`1px solid ${T.border}`, color:T.text, fontSize:'0.9rem', fontFamily:sans, outline:'none',
  };
  const lbl: React.CSSProperties = { display:'block', color:T.muted, fontSize:'0.7rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:'0.35rem' };

  async function handleLogin() {
    if (!phone.trim() || !pin.trim()) { setErr('Preencha WhatsApp e PIN.'); return; }
    setBusy(true); setErr('');
    try {
      const res  = await fetch('/api/auth?action=login', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ phone, pin }) });
      const data = await res.json() as { ok:boolean; token?:string; error?:string };
      if (data.ok && data.token) { onAuth(data.token); setTab('profile'); setOk(''); }
      else setErr(data.error === 'invalid_pin' ? 'PIN incorreto.' : data.error === 'not_found' ? 'WhatsApp não cadastrado.' : 'Erro ao entrar.');
    } catch { setErr('Erro de conexão.'); }
    finally { setBusy(false); }
  }

  async function handleRegister() {
    if (!phone.trim() || !name.trim()) { setErr('Preencha nome e WhatsApp.'); return; }
    setBusy(true); setErr('');
    try {
      const res  = await fetch('/api/auth?action=register', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ phone, name }) });
      const data = await res.json() as { ok:boolean; token?:string; error?:string };
      if (data.ok && data.token) { onAuth(data.token); setTab('profile'); setOk('Conta criada! PIN padrão: 1234'); }
      else if (data.error === 'already_registered') { setErr('Já tem conta com esse número. Faça login.'); setTab('login'); }
      else setErr('Erro ao criar conta.');
    } catch { setErr('Erro de conexão.'); }
    finally { setBusy(false); }
  }

  async function handleChangePin() {
    if (!newPin || newPin.length < 4) { setErr('Novo PIN precisa ter ao menos 4 dígitos.'); return; }
    setBusy(true); setErr('');
    try {
      const res  = await fetch('/api/auth?action=change-pin', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ token: authToken, newPin }) });
      const data = await res.json() as { ok:boolean };
      if (data.ok) { setOk('PIN alterado!'); setChangingPin(false); setNewPin(''); }
      else setErr('Erro ao alterar PIN.');
    } catch { setErr('Erro de conexão.'); }
    finally { setBusy(false); }
  }

  async function claimReward() {
    if (!authToken) return;
    setBusy(true);
    try {
      await fetch('/api/customer/me', { method:'POST', headers:{'Content-Type':'application/json','X-Auth-Token':authToken}, body:JSON.stringify({ action:'claim_reward' }) });
      setOk('Recompensa resgatada! Use no próximo pedido.');
      setCustomer(prev => prev ? { ...prev, pendingReward: false } : prev);
    } finally { setBusy(false); }
  }

  const pts = customer?.loyaltyPoints ?? 0;

  return (
    <>
      <div onClick={onClose} style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.65)',zIndex:200,backdropFilter:'blur(6px)' }} />
      <div style={{
        position:'fixed', top:'50%', left:'50%', transform:'translate(-50%,-50%)',
        width:'min(420px,calc(100vw - 2rem))', maxHeight:'92dvh', overflowY:'auto',
        background:T.card, borderRadius:'1.5rem', zIndex:201,
        border:`1px solid ${T.border}`, boxShadow:`0 32px 80px rgba(0,0,0,0.5)`,
      }}>
        {/* Header */}
        <div style={{ padding:'1.25rem 1.5rem', borderBottom:`1px solid ${T.border}`,
                      display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/nefertari-logo-golden.png" alt="Nefertari" style={{ height: '28px', objectFit: 'contain' }} />
            <p style={{ fontFamily:serif, fontSize:'1rem', fontWeight:700, color:T.text, margin: 0 }}>
              {tab==='profile' ? 'Meu perfil' : tab==='login' ? 'Entrar' : 'Começar'}
            </p>
          </div>
          <button onClick={onClose} style={{ background:'none',border:'none',cursor:'pointer' }}><X size={17} color={T.muted}/></button>
        </div>

        {/* Tabs — only show when not logged in */}
        {!authToken && (
          <div style={{ display:'flex', borderBottom:`1px solid ${T.border}` }}>
            {(['login','register'] as Tab[]).map(t => (
              <button key={t} onClick={() => { setTab(t); setErr(''); }}
                      style={{ flex:1, padding:'0.75rem', background:'none', border:'none', cursor:'pointer',
                               fontFamily:sans, fontSize:'0.82rem', fontWeight:600, color: tab===t ? GOLD : T.muted,
                               borderBottom:`2px solid ${tab===t ? GOLD : 'transparent'}` }}>
                {t==='login' ? 'Já tenho conta' : 'Quero participar'}
              </button>
            ))}
          </div>
        )}

        <div style={{ padding:'1.5rem', display:'flex', flexDirection:'column', gap:'1rem' }}>

          {/* ── LOGIN ──────────────────────────────────────────────── */}
          {tab === 'login' && !authToken && (
            <>
              <div>
                <label style={lbl}>WhatsApp</label>
                <input value={phone} onChange={e => setPhone(phoneFormat(e.target.value))}
                       placeholder="(73) 99999-9999" inputMode="tel" style={inp} />
              </div>
              <div>
                <label style={lbl}>PIN</label>
                <input value={pin} onChange={e => setPin(e.target.value.replace(/\D/g,'').slice(0,6))}
                       type="password" inputMode="numeric" placeholder="••••" style={inp} />
              </div>
              {err && <p style={{ color:'#f87171', fontSize:'0.82rem' }}>{err}</p>}
              <button onClick={handleLogin} disabled={busy} style={{
                padding:'0.85rem', background:GOLD, color:'#14100C', border:'none',
                borderRadius:'99px', fontWeight:700, fontSize:'0.9rem', cursor:'pointer', fontFamily:sans,
                display:'flex', alignItems:'center', justifyContent:'center', gap:'0.4rem',
              }}>
                {busy ? <Loader2 size={15} style={{ animation:'spin 1s linear infinite' }}/> : <><ArrowRight size={15}/> Entrar</>}
              </button>
            </>
          )}

          {/* ── REGISTER ───────────────────────────────────────────── */}
          {tab === 'register' && !authToken && (
            <>
              <div style={{ textAlign:'center', padding:'0.5rem 0' }}>
                <p style={{ fontFamily:serif, fontSize:'1rem', color:T.text, marginBottom:'0.35rem' }}>
                  Alimente o corpo e a alma.
                </p>
                <p style={{ color:T.muted, fontSize:'0.82rem' }}>
                  A cada 10 pedidos, a Jess prepara uma receita sazonal surpresa só pra você.
                </p>
              </div>
              <div>
                <label style={lbl}>Seu nome</label>
                <input value={name} onChange={e => setName(e.target.value)}
                       placeholder="Como a Jess pode te chamar?" style={inp} />
              </div>
              <div>
                <label style={lbl}>WhatsApp</label>
                <input value={phone} onChange={e => setPhone(phoneFormat(e.target.value))}
                       placeholder="(73) 99999-9999" inputMode="tel" style={inp} />
              </div>
              {err && <p style={{ color:'#f87171', fontSize:'0.82rem' }}>{err}</p>}
              <button onClick={handleRegister} disabled={busy} style={{
                padding:'0.85rem', background:GOLD, color:'#14100C', border:'none',
                borderRadius:'99px', fontWeight:700, fontSize:'0.9rem', cursor:'pointer', fontFamily:sans,
                display:'flex', alignItems:'center', justifyContent:'center', gap:'0.4rem',
              }}>
                {busy ? <Loader2 size={15} style={{ animation:'spin 1s linear infinite' }}/> : <><Star size={15}/> Começar o ritual</>}
              </button>
              <p style={{ color:T.muted, fontSize:'0.72rem', textAlign:'center' }}>
                Receberá seu PIN no WhatsApp. Grátis, sem taxas.
              </p>
            </>
          )}

          {/* ── PROFILE ────────────────────────────────────────────── */}
          {tab === 'profile' && authToken && customer && (
            <>
              {/* Greeting */}
              <div style={{ textAlign:'center', marginBottom:'0.25rem' }}>
                <p style={{ fontFamily:serif, fontSize:'1.1rem', color:T.text }}>Olá, {customer.name} 🌿</p>
              </div>

              {/* Reward pending */}
              {customer.pendingReward && customer.reward && (
                <div style={{ background: dark ? 'rgba(212,175,55,0.1)' : 'rgba(212,175,55,0.08)',
                              border:'1px solid #D4AF37', borderRadius:'1rem', padding:'1.25rem',
                              animation:'loyaltyGlow 2s ease-in-out infinite' }}>
                  <p style={{ color:'#D4AF37', fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.2em',
                              textTransform:'uppercase', marginBottom:'0.5rem' }}>🎁 Sua recompensa está pronta</p>
                  <p style={{ fontFamily:serif, fontSize:'1rem', fontWeight:700, color:T.text, marginBottom:'0.35rem' }}>
                    {customer.reward.recipeTitle}
                  </p>
                  <p style={{ color:T.muted, fontSize:'0.82rem', lineHeight:1.6, marginBottom:'1rem' }}>
                    {customer.reward.recipeDescription}
                  </p>
                  <button onClick={claimReward} disabled={busy} style={{
                    width:'100%', padding:'0.75rem', background:'#D4AF37', color:'#14100C',
                    border:'none', borderRadius:'99px', fontWeight:700, fontSize:'0.88rem',
                    cursor:'pointer', fontFamily:sans,
                  }}>
                    {busy ? 'Resgatando...' : '✓ Resgatar agora'}
                  </button>
                </div>
              )}

              {/* Loyalty progress */}
              {!customer.pendingReward && (
                <div style={{ background: dark ? 'rgba(255,255,255,0.04)' : T.bg2,
                              borderRadius:'1rem', border:`1px solid ${T.border}`, padding:'1.25rem' }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'0.75rem' }}>
                    <p style={{ color:T.muted, fontSize:'0.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.15em' }}>
                      Selos Sagrados
                    </p>
                    <p style={{ color:GOLD, fontWeight:700, fontSize:'0.9rem' }}>{pts}/{TOTAL}</p>
                  </div>
                  {/* Progress bar */}
                  <div style={{ height:'6px', borderRadius:'99px', background: dark ? 'rgba(255,255,255,0.08)' : T.border, overflow:'hidden' }}>
                    <div style={{ height:'100%', borderRadius:'99px', background:GOLD,
                                  width:`${(pts/TOTAL)*100}%`, transition:'width 0.5s' }} />
                  </div>
                  {/* Seal dots */}
                  <div style={{ display:'flex', gap:'0.35rem', marginTop:'0.75rem', justifyContent:'center', flexWrap:'wrap' }}>
                    {Array.from({length:TOTAL}).map((_,i) => (
                      <div key={i} style={{
                        width:'10px', height:'10px', borderRadius:'50%',
                        background: i<pts ? GOLD : dark ? 'rgba(255,255,255,0.1)' : T.border,
                        transition:'background 0.3s',
                      }} />
                    ))}
                  </div>
                  <p style={{ color:T.muted, fontSize:'0.75rem', textAlign:'center', marginTop:'0.6rem' }}>
                    {TOTAL-pts} pedido{TOTAL-pts!==1?'s':''} para sua próxima recompensa
                  </p>
                </div>
              )}

              {/* Stats */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.6rem' }}>
                {[
                  { label:'Pedidos', value:String(customer.orderCount) },
                  { label:'Ciclos completos', value:String(customer.totalCycles) },
                ].map(s => (
                  <div key={s.label} style={{ background: dark ? 'rgba(255,255,255,0.04)' : '#fff',
                                              borderRadius:'0.75rem', border:`1px solid ${T.border}`,
                                              padding:'0.85rem', textAlign:'center' }}>
                    <p style={{ color:GOLD, fontWeight:700, fontSize:'1.1rem' }}>{s.value}</p>
                    <p style={{ color:T.muted, fontSize:'0.68rem', marginTop:'0.15rem' }}>{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Change PIN */}
              {changingPin ? (
                <div style={{ display:'flex', flexDirection:'column', gap:'0.65rem' }}>
                  <label style={lbl}>Novo PIN</label>
                  <input value={newPin} onChange={e => setNewPin(e.target.value.replace(/\D/g,'').slice(0,6))}
                         type="password" inputMode="numeric" placeholder="••••" style={inp} />
                  {err && <p style={{ color:'#f87171', fontSize:'0.8rem' }}>{err}</p>}
                  {ok  && <p style={{ color:'#4ade80', fontSize:'0.8rem' }}>{ok}</p>}
                  <div style={{ display:'flex', gap:'0.5rem' }}>
                    <button onClick={() => setChangingPin(false)} style={{
                      flex:1, padding:'0.7rem', background:'none', border:`1px solid ${T.border}`,
                      borderRadius:'99px', color:T.muted, cursor:'pointer', fontFamily:sans, fontSize:'0.85rem',
                    }}>Cancelar</button>
                    <button onClick={handleChangePin} disabled={busy} style={{
                      flex:1, padding:'0.7rem', background:GOLD, color:'#14100C',
                      border:'none', borderRadius:'99px', fontWeight:700, cursor:'pointer', fontFamily:sans, fontSize:'0.85rem',
                    }}>Salvar</button>
                  </div>
                </div>
              ) : (
                <div style={{ display:'flex', gap:'0.5rem' }}>
                  <button onClick={() => setChangingPin(true)} style={{
                    flex:1, padding:'0.7rem', background:'none', border:`1px solid ${T.border}`,
                    borderRadius:'99px', color:T.muted, cursor:'pointer', fontFamily:sans, fontSize:'0.82rem',
                  }}>Alterar PIN</button>
                  <button onClick={() => { onLogout(); onClose(); }} style={{
                    flex:1, padding:'0.7rem', background:'none', border:'1px solid rgba(239,68,68,0.3)',
                    borderRadius:'99px', color:'#f87171', cursor:'pointer', fontFamily:sans, fontSize:'0.82rem',
                  }}>Sair</button>
                </div>
              )}
              {ok && !changingPin && <p style={{ color:'#4ade80', fontSize:'0.8rem', textAlign:'center' }}>{ok}</p>}
            </>
          )}

          {/* Profile but customer not loaded yet */}
          {tab === 'profile' && authToken && !customer && (
            <div style={{ display:'flex', justifyContent:'center', padding:'2rem' }}>
              <Loader2 size={24} color={GOLD} style={{ animation:'spin 1s linear infinite' }} />
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform:rotate(360deg); } }
        @keyframes loyaltyGlow {
          0%,100% { box-shadow: 0 0 0 rgba(212,175,55,0); }
          50%      { box-shadow: 0 0 16px rgba(212,175,55,0.3); }
        }
      `}</style>
    </>
  );
}
