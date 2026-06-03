'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Minus, ShoppingBag, X, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../lib/useTheme';
import ThemeToggle from './ThemeToggle';
import LoyaltyBadge from './LoyaltyBadge';
import CustomerAuth from './CustomerAuth';

// ─── Static tokens (gold/green/terra never change between themes) ─────────────
const G = {
  gold: '#C8941A', goldSoft: '#E6B84A', goldDim: 'rgba(200,148,26,0.15)',
  green: '#6B8C3E', terra: '#8B4030',
  dark: '#14100C', dark2: '#0E0C08', card: '#1A1208',
  parch: '#FAF5E8', sand: '#F5E6C8',
  muted: '#7A6A54', border: 'rgba(200,148,26,0.18)',
  text: '#E8D9BA',
};
const serif = 'Playfair Display, Georgia, serif';
const sans  = 'Inter, system-ui, sans-serif';
const fmt   = (n: number) => `R$ ${n.toFixed(2).replace('.', ',')}`;

const phoneFormat = (v: string) => {
  const d = v.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2)  return `(${d}`;
  if (d.length <= 7)  return `(${d.slice(0,2)}) ${d.slice(2)}`;
  return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
};

// ─── Types ────────────────────────────────────────────────────────────────────
interface MenuItem {
  id: string; category: string;
  name: string; description: string; price: number; available: boolean; tags: string[];
  imageUrl?: string; images?: string[];
  calories?: number; ingredients?: string[];
}
interface MenuCategory { id: string; label: string; sub: string; roman: string; }
interface CartItem { id: string; name: string; price: number; qty: number; imageUrl?: string; }
interface CheckoutForm {
  name: string; phone: string; type: 'pickup' | 'delivery';
  cep: string; street: string; number: string; complement: string; neighborhood: string; city: string;
  notes: string;
}

const cepFormat = (v: string) => {
  const d = v.replace(/\D/g, '').slice(0, 8);
  return d.length > 5 ? `${d.slice(0,5)}-${d.slice(5)}` : d;
};

const FALLBACK_CATS: MenuCategory[] = [
  { id:'burger', label:'Pratos Principais', sub:'Hambúrgueres artesanais', roman:'I'   },
  { id:'wrap',   label:'Wraps',             sub:'Leves e intencionais',    roman:'II'  },
  { id:'side',   label:'Acompanhamentos',   sub:'Para completar',          roman:'III' },
  { id:'drink',  label:'Bebidas',           sub:'Frescas e simples',       roman:'IV'  },
];

// ─── Item Detail Modal ────────────────────────────────────────────────────────
function ItemDetailModal({ item, qty, dark, T, onAdd, onRemove, onClose }: {
  item: MenuItem; qty: number; dark: boolean; T: import('../lib/useTheme').ThemeTokens;
  onAdd: () => void; onRemove: () => void; onClose: () => void;
}) {
  const [imgIdx, setImgIdx] = useState(0);
  const allPhotos = item.images?.length ? item.images : item.imageUrl ? [item.imageUrl] : [];

  return (
    <>
      <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', zIndex:95, backdropFilter:'blur(8px)' }} />
      <div className="detail-modal" style={{
        position:'fixed', zIndex:96,
        background: T.card,
        overflowY:'auto',
        boxShadow:'0 -8px 48px rgba(0,0,0,0.4)',
      }}>
        {/* Photo gallery */}
        {allPhotos.length > 0 && (
          <div style={{ position:'relative', overflow:'hidden',
                        background: dark ? '#0a0806' : T.bg2 }} className="detail-modal-img">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={allPhotos[imgIdx]} alt={item.name}
                 style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            {/* photo dots */}
            {allPhotos.length > 1 && (
              <div style={{ position:'absolute', bottom:'0.75rem', left:'50%', transform:'translateX(-50%)',
                            display:'flex', gap:'0.4rem' }}>
                {allPhotos.map((_, i) => (
                  <button key={i} onClick={() => setImgIdx(i)} style={{
                    width: i===imgIdx ? '20px' : '6px', height:'6px', borderRadius:'99px',
                    background: i===imgIdx ? G.gold : 'rgba(255,255,255,0.5)',
                    border:'none', cursor:'pointer', padding:0,
                    transition:'all 0.2s',
                  }} />
                ))}
              </div>
            )}
            {/* close button */}
            <button onClick={onClose} style={{
              position:'absolute', top:'0.75rem', right:'0.75rem',
              width:'32px', height:'32px', borderRadius:'50%',
              background:'rgba(0,0,0,0.5)', border:'none', cursor:'pointer',
              display:'flex', alignItems:'center', justifyContent:'center',
              backdropFilter:'blur(4px)',
            }}>
              <X size={15} color="#fff" />
            </button>
          </div>
        )}

        <div style={{ padding:'1.5rem' }}>
          {/* Header */}
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'0.75rem' }}>
            <div style={{ flex:1 }}>
              <h2 style={{ fontFamily:serif, fontSize:'1.4rem', fontWeight:700, color:T.text, marginBottom:'0.3rem' }}>
                {item.name}
              </h2>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'0.4rem' }}>
                {item.tags.map(t => (
                  <span key={t} style={{ fontSize:'0.62rem', fontWeight:700, padding:'0.15rem 0.55rem',
                                         borderRadius:'99px', border:`1px solid ${G.green}50`, color:G.green,
                                         letterSpacing:'0.1em', textTransform:'uppercase' }}>{t}</span>
                ))}
              </div>
            </div>
            <p style={{ color:G.gold, fontWeight:700, fontSize:'1.2rem', marginLeft:'1rem', flexShrink:0 }}>
              {fmt(item.price)}
            </p>
          </div>

          {/* Description */}
          <p style={{ color:T.muted, fontSize:'0.9rem', lineHeight:1.7, marginBottom:'1rem' }}>
            {item.description}
          </p>

          {/* Calories */}
          {item.calories && (
            <div style={{ display:'inline-flex', alignItems:'center', gap:'0.4rem',
                          padding:'0.3rem 0.75rem', borderRadius:'99px',
                          background: dark ? 'rgba(200,148,26,0.1)' : `${G.gold}12`,
                          border:`1px solid ${G.gold}30`, marginBottom:'1rem' }}>
              <span style={{ fontSize:'0.85rem' }}>🔥</span>
              <span style={{ color:G.gold, fontSize:'0.8rem', fontWeight:600 }}>
                {item.calories} kcal por porção
              </span>
            </div>
          )}

          {/* Ingredients */}
          {item.ingredients && item.ingredients.length > 0 && (
            <div style={{ marginBottom:'1.25rem' }}>
              <p style={{ color:T.muted, fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.2em',
                          textTransform:'uppercase', marginBottom:'0.6rem' }}>
                Ingredientes
              </p>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'0.4rem' }}>
                {item.ingredients.map((ing, i) => (
                  <span key={i} style={{ fontSize:'0.78rem', padding:'0.25rem 0.65rem',
                                         borderRadius:'99px', color:T.muted,
                                         background: dark ? 'rgba(255,255,255,0.06)' : T.bg2,
                                         border:`1px solid ${T.border}` }}>
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Add to cart */}
          {item.available ? (
            qty === 0 ? (
              <button onClick={() => { onAdd(); onClose(); }} style={{
                width:'100%', padding:'0.95rem', background:G.gold, color:'#14100C',
                border:'none', borderRadius:'99px', fontWeight:700, fontSize:'0.95rem',
                cursor:'pointer', fontFamily:sans,
                display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem',
              }}>
                <Plus size={16} /> Adicionar ao pedido — {fmt(item.price)}
              </button>
            ) : (
              <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'0.75rem',
                              background: dark ? 'rgba(255,255,255,0.06)' : T.bg2,
                              borderRadius:'99px', padding:'0.5rem 1rem' }}>
                  <button onClick={onRemove} style={{ background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center' }}>
                    <Minus size={16} color={T.muted} />
                  </button>
                  <span style={{ fontWeight:700, fontSize:'1rem', color:T.text, minWidth:'1.5rem', textAlign:'center' }}>{qty}</span>
                  <button onClick={onAdd} style={{ background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center' }}>
                    <Plus size={16} color={G.gold} />
                  </button>
                </div>
                <button onClick={onClose} style={{
                  flex:1, padding:'0.85rem', background:G.gold, color:'#14100C',
                  border:'none', borderRadius:'99px', fontWeight:700, fontSize:'0.9rem',
                  cursor:'pointer', fontFamily:sans,
                }}>
                  Ver pedido ({fmt(item.price * qty)})
                </button>
              </div>
            )
          ) : (
            <p style={{ textAlign:'center', color:T.muted, fontSize:'0.88rem', padding:'0.75rem' }}>
              Item indisponível no momento
            </p>
          )}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}

// ─── Cart panel ───────────────────────────────────────────────────────────────
function CartPanel({ cart, onClose, onUpdateQty, onCheckout, total }: {
  cart: CartItem[]; total: number;
  onClose: () => void; onUpdateQty: (id: string, d: number) => void; onCheckout: () => void;
}) {
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
                                       zIndex: 90, backdropFilter: 'blur(6px)' }} />
      <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 'min(400px,100vw)',
                    background: G.card, zIndex: 91, display: 'flex', flexDirection: 'column',
                    borderLeft: `1px solid ${G.border}`, boxShadow: '-8px 0 40px rgba(0,0,0,0.4)',
                    overflowY: 'hidden' }}>

        <div style={{ padding: '1.25rem 1.5rem', borderBottom: `1px solid ${G.border}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontFamily: serif, fontSize: '1.1rem', fontWeight: 700, color: G.text }}>Seu pedido</p>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={18} color={G.muted} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: G.muted }}>
              <p style={{ fontSize: '1.8rem', marginBottom: '0.75rem', color: G.goldDim }}>◈</p>
              <p style={{ fontSize: '0.88rem' }}>Nenhum item ainda.<br />Explore o cardápio.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {cart.map(item => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem',
                                            padding: '0.85rem', borderRadius: '0.75rem',
                                            border: `1px solid ${G.border}`, background: 'rgba(255,255,255,0.03)' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: '0.88rem', color: G.text }}>{item.name}</p>
                    <p style={{ color: G.gold, fontSize: '0.82rem', marginTop: '0.15rem' }}>{fmt(item.price * item.qty)}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button onClick={() => onUpdateQty(item.id, -1)} style={{
                      width: '1.7rem', height: '1.7rem', borderRadius: '50%', border: `1px solid ${G.border}`,
                      background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}><Minus size={12} color={G.muted} /></button>
                    <span style={{ color: G.text, fontWeight: 700, minWidth: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>{item.qty}</span>
                    <button onClick={() => onUpdateQty(item.id, 1)} style={{
                      width: '1.7rem', height: '1.7rem', borderRadius: '50%',
                      background: G.gold, border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}><Plus size={12} color={G.dark} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div style={{
            padding: '1rem 1.5rem',
            paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
            borderTop: `1px solid ${G.border}`,
            flexShrink: 0,
            background: G.card,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ color: G.muted, fontSize: '0.85rem' }}>Total do pedido</span>
              <span style={{ color: G.gold, fontWeight: 700, fontSize: '1.1rem' }}>{fmt(total)}</span>
            </div>
            <button onClick={onCheckout} style={{
              width: '100%', background: G.gold, color: G.dark, border: 'none',
              borderRadius: '99px', padding: '0.9rem', fontWeight: 700, fontSize: '0.9rem',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
            }}>Finalizar pedido <ArrowRight size={15} /></button>
          </div>
        )}
      </div>
    </>
  );
}

// ─── Checkout modal ───────────────────────────────────────────────────────────
function CheckoutModal({ cart, total, authToken, onClose, onSuccess }: {
  cart: CartItem[]; total: number; authToken: string | null; onClose: () => void; onSuccess: (id: string) => void;
}) {
  const EMPTY: CheckoutForm = { name:'', phone:'', type:'pickup', cep:'', street:'', number:'', complement:'', neighborhood:'', city:'', notes:'' };
  const [form,      setForm]      = useState<CheckoutForm>(EMPTY);
  const [cepBusy,   setCepBusy]   = useState(false);
  const [cepErr,    setCepErr]    = useState('');
  const [busy,      setBusy]      = useState(false);
  const [err,       setErr]       = useState('');
  const set = (k: keyof CheckoutForm, v: string) => setForm(p => ({ ...p, [k]: v }));

  // Auto-fetch address when CEP is complete
  async function fetchCep(raw: string) {
    const digits = raw.replace(/\D/g,'');
    set('cep', cepFormat(raw));
    setCepErr('');
    if (digits.length < 8) return;
    setCepBusy(true);
    try {
      const res  = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data = await res.json() as { erro?: boolean; logradouro?: string; bairro?: string; localidade?: string; uf?: string };
      if (data.erro) { setCepErr('CEP não encontrado.'); return; }
      setForm(p => ({
        ...p,
        cep:          cepFormat(digits),
        street:       data.logradouro    ?? '',
        neighborhood: data.bairro        ?? '',
        city:         `${data.localidade ?? ''}, ${data.uf ?? ''}`,
      }));
    } catch {
      setCepErr('Não foi possível buscar o CEP.');
    } finally {
      setCepBusy(false);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) { setErr('Preencha nome e WhatsApp.'); return; }
    if (form.type === 'delivery') {
      if (!form.cep.trim() || !form.street.trim() || !form.number.trim()) {
        setErr('Preencha CEP, rua e número.'); return;
      }
    }
    setBusy(true); setErr('');
    try {
      const fullAddress = form.type === 'delivery'
        ? `${form.street}, ${form.number}${form.complement ? ` ${form.complement}` : ''} — ${form.neighborhood}, ${form.city} · CEP ${form.cep}`
        : '';
      const headers: Record<string,string> = { 'Content-Type': 'application/json' };
      if (authToken) headers['X-Auth-Token'] = authToken;
      const res  = await fetch('/api/orders', {
        method: 'POST', headers,
        body: JSON.stringify({ customer: { name: form.name, phone: form.phone },
                               type: form.type, address: fullAddress, notes: form.notes, items: cart, total }),
      });
      const data = await res.json() as { ok: boolean; id: string };
      if (!data.ok) throw new Error();
      const summary = cart.map(i => `${i.qty}× ${i.name}`).join(', ');
      const wa = encodeURIComponent(
        `🌿 *Novo pedido Nefertari*\n\n*#${data.id}*\nCliente: ${form.name}\nWhatsApp: ${form.phone}\n` +
        `Tipo: ${form.type === 'pickup' ? 'Retirada' : `Entrega — ${fullAddress}`}\n\n${summary}\n\n*Total: ${fmt(total)}*` +
        (form.notes ? `\n\nObs: ${form.notes}` : '')
      );
      window.open(`https://wa.me/5573988083318?text=${wa}`, '_blank');
      onSuccess(data.id);
    } catch { setErr('Erro ao enviar. Tente novamente.'); }
    finally  { setBusy(false); }
  }

  const inp: React.CSSProperties = {
    width:'100%', padding:'0.75rem 1rem', borderRadius:'0.75rem', boxSizing:'border-box',
    border:`1px solid ${G.border}`, background:'rgba(255,255,255,0.05)',
    color: G.text, fontSize:'0.9rem', fontFamily: sans, outline:'none',
  };
  const lbl: React.CSSProperties = {
    display:'block', color:G.muted, fontSize:'0.72rem', fontWeight:600,
    letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'0.4rem',
  };

  return (
    <>
      <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', zIndex:95, backdropFilter:'blur(8px)' }} />
      <div style={{ position:'fixed', top:'50%', left:'50%', transform:'translate(-50%,-50%)',
                    width:'min(500px,calc(100vw - 2rem))', maxHeight:'90dvh', overflowY:'auto',
                    background: G.card, borderRadius:'1.5rem', zIndex:96,
                    border:`1px solid ${G.border}`, boxShadow:'0 32px 80px rgba(0,0,0,0.5)' }}>

        <div style={{ padding:'1.5rem', borderBottom:`1px solid ${G.border}`,
                      display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <p style={{ fontFamily:serif, fontSize:'1.1rem', fontWeight:700, color:G.text }}>Finalizar pedido</p>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer' }}><X size={18} color={G.muted} /></button>
        </div>

        <form onSubmit={submit} style={{ padding:'1.5rem', display:'flex', flexDirection:'column', gap:'1rem' }}>
          {/* summary */}
          <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:'0.75rem', border:`1px solid ${G.border}`, padding:'1rem' }}>
            <p style={{ color:G.muted, fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:'0.5rem' }}>Resumo</p>
            {cart.map(i => (
              <div key={i.id} style={{ display:'flex', justifyContent:'space-between', fontSize:'0.85rem', color:G.text, padding:'0.2rem 0' }}>
                <span>{i.qty}× {i.name}</span><span style={{ color:G.gold }}>{fmt(i.price * i.qty)}</span>
              </div>
            ))}
            <div style={{ borderTop:`1px solid ${G.border}`, marginTop:'0.5rem', paddingTop:'0.5rem',
                          display:'flex', justifyContent:'space-between', fontWeight:700, color:G.gold }}>
              <span style={{ color:G.text }}>Total</span><span>{fmt(total)}</span>
            </div>
          </div>

          {/* name + phone */}
          <div>
            <label style={lbl}>Seu nome</label>
            <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Como podemos te chamar?" style={inp} />
          </div>
          <div>
            <label style={lbl}>WhatsApp</label>
            <input value={form.phone} onChange={e => set('phone', phoneFormat(e.target.value))} placeholder="(73) 99999-9999" style={inp} inputMode="tel" />
          </div>

          {/* type */}
          <div>
            <label style={lbl}>Como prefere?</label>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.5rem' }}>
              {(['pickup','delivery'] as const).map(t => (
                <button key={t} type="button" onClick={() => set('type',t)} style={{
                  padding:'0.65rem', borderRadius:'0.75rem', cursor:'pointer', fontWeight:600,
                  fontSize:'0.85rem', fontFamily:sans, transition:'all 0.15s',
                  background: form.type===t ? G.gold : 'transparent',
                  color:      form.type===t ? G.dark  : G.muted,
                  border:     `1px solid ${form.type===t ? G.gold : G.border}`,
                }}>
                  {t==='pickup' ? '🏪 Retirada' : '🛵 Entrega'}
                </button>
              ))}
            </div>
          </div>

          {/* delivery address with ViaCEP */}
          {form.type === 'delivery' && (
            <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem',
                          padding:'1rem', borderRadius:'0.75rem', border:`1px solid ${G.border}`,
                          background:'rgba(255,255,255,0.03)' }}>
              <p style={{ color:G.gold, fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.2em', textTransform:'uppercase' }}>
                Endereço de entrega
              </p>

              {/* CEP */}
              <div>
                <label style={lbl}>CEP</label>
                <div style={{ position:'relative' }}>
                  <input
                    value={form.cep}
                    onChange={e => fetchCep(e.target.value)}
                    placeholder="00000-000" inputMode="numeric" maxLength={9}
                    style={{ ...inp, paddingRight: cepBusy ? '2.5rem' : '1rem' }}
                  />
                  {cepBusy && (
                    <Loader2 size={14} color={G.gold} style={{
                      position:'absolute', right:'0.85rem', top:'50%', transform:'translateY(-50%)',
                      animation:'spin 1s linear infinite',
                    }} />
                  )}
                </div>
                {cepErr && <p style={{ color:'#f87171', fontSize:'0.75rem', marginTop:'0.3rem' }}>{cepErr}</p>}
              </div>

              {/* street + number */}
              <div style={{ display:'flex', gap:'0.5rem', alignItems:'flex-end' }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <label style={lbl}>Rua</label>
                  <input value={form.street} onChange={e => set('street',e.target.value)}
                         placeholder="Logradouro" style={inp} />
                </div>
                <div style={{ width:'80px', flexShrink:0 }}>
                  <label style={lbl}>Nº</label>
                  <input value={form.number} onChange={e => set('number',e.target.value)}
                         placeholder="Nº" inputMode="numeric" style={inp} />
                </div>
              </div>

              {/* neighborhood — full width */}
              <div>
                <label style={lbl}>Bairro</label>
                <input value={form.neighborhood} onChange={e => set('neighborhood',e.target.value)}
                       placeholder="Bairro" style={inp} />
              </div>

              {/* complement — full width, optional */}
              <div>
                <label style={lbl}>Complemento <span style={{ fontWeight:400, textTransform:'none', letterSpacing:0 }}>(opcional)</span></label>
                <input value={form.complement} onChange={e => set('complement',e.target.value)}
                       placeholder="Apto, bloco, referência..." style={inp} />
              </div>

              {/* city — auto-filled, read-only */}
              {form.city && (
                <p style={{ color:G.muted, fontSize:'0.8rem', display:'flex', alignItems:'center', gap:'0.4rem' }}>
                  <span style={{ color:G.green }}>✓</span> {form.city}
                </p>
              )}
            </div>
          )}

          {/* notes */}
          <div>
            <label style={{ ...lbl }}>
              Observações <span style={{ fontWeight:400 }}>(opcional)</span>
            </label>
            <textarea value={form.notes} onChange={e => set('notes',e.target.value)}
                      placeholder="Sem cebola, molho à parte..." rows={2} style={{ ...inp, resize:'none' }} />
          </div>

          {err && <p style={{ color:'#f87171', fontSize:'0.82rem', background:'rgba(248,113,113,0.08)', padding:'0.6rem 0.9rem', borderRadius:'0.5rem' }}>{err}</p>}

          <button type="submit" disabled={busy || cepBusy} style={{
            padding:'0.95rem', background: (busy||cepBusy) ? G.muted : G.gold, color:G.dark, border:'none',
            borderRadius:'99px', fontWeight:700, fontSize:'0.95rem', cursor:(busy||cepBusy)?'not-allowed':'pointer',
            display:'flex', alignItems:'center', justifyContent:'center', gap:'0.4rem', fontFamily:sans,
          }}>
            {busy ? <><Loader2 size={15} style={{ animation:'spin 1s linear infinite' }} /> Enviando...</> : <>Confirmar pedido <ArrowRight size={15} /></>}
          </button>
          <p style={{ fontSize:'0.72rem', color:G.muted, textAlign:'center' }}>
            O WhatsApp abrirá automaticamente para confirmar com a gente.
          </p>
        </form>
      </div>
    </>
  );
}

// ─── Success ──────────────────────────────────────────────────────────────────
function OrderSuccess({ orderId, onNewOrder }: { orderId: string; onNewOrder: () => void }) {
  return (
    <div style={{ minHeight: '60dvh', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '3rem 1.5rem' }}>
      <CheckCircle2 size={52} color={G.green} style={{ marginBottom: '1.5rem' }} />
      <p style={{ fontFamily: serif, fontSize: '1.6rem', fontWeight: 700, color: G.text, marginBottom: '0.5rem' }}>
        Pedido enviado!
      </p>
      <p style={{ color: G.muted, fontSize: '0.85rem', marginBottom: '0.5rem' }}>Número do pedido:</p>
      <p style={{ fontFamily: serif, fontSize: '1.3rem', fontWeight: 700, color: G.gold,
                  background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1.5rem',
                  borderRadius: '0.75rem', border: `1px solid ${G.border}`, marginBottom: '1.5rem' }}>
        {orderId}
      </p>
      <p style={{ color: G.muted, fontSize: '0.85rem', maxWidth: '300px', lineHeight: 1.6, marginBottom: '2rem' }}>
        O WhatsApp foi aberto para confirmar. Acompanhe o status do seu pedido pelo link abaixo.
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <a href={`/pedido?id=${orderId}`} style={{
          background: G.gold, color: G.dark, padding: '0.75rem 1.5rem', borderRadius: '99px',
          fontWeight: 700, fontSize: '0.88rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
        }}>Acompanhar pedido <ArrowRight size={14} /></a>
        <button onClick={onNewOrder} style={{
          background: 'none', border: `1px solid ${G.border}`, color: G.muted,
          padding: '0.75rem 1.5rem', borderRadius: '99px', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer', fontFamily: sans,
        }}>Novo pedido</button>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Cardapio() {
  const { dark, T, toggle } = useTheme();
  const [menu,         setMenu]         = useState<MenuItem[]>([]);
  const [cats,         setCats]         = useState<MenuCategory[]>(FALLBACK_CATS);
  const [loading,      setLoading]      = useState(true);
  const [activeCat,    setActiveCat]    = useState<string>('burger');
  const [cart,         setCart]         = useState<CartItem[]>([]);
  const [cartOpen,     setCartOpen]     = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderId,      setOrderId]      = useState('');
  const [detailItem,   setDetailItem]   = useState<MenuItem | null>(null);
  const [authToken,    setAuthToken]    = useState<string | null>(null);
  const [authOpen,     setAuthOpen]     = useState(false);

  // Load auth token from localStorage on mount
  useEffect(() => {
    try { setAuthToken(localStorage.getItem('nef-customer-token')); } catch {}
  }, []);

  function handleAuth(token: string) {
    setAuthToken(token);
    try { localStorage.setItem('nef-customer-token', token); } catch {}
    setAuthOpen(false);
  }

  function handleLogout() {
    setAuthToken(null);
    try { localStorage.removeItem('nef-customer-token'); } catch {}
  }

  useEffect(() => {
    fetch('/api/menu')
      .then(r => r.json())
      .then((d: { items: MenuItem[]; categories: MenuCategory[] }) => {
        setMenu(d.items ?? []);
        if (d.categories?.length) setCats(d.categories);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const addToCart = useCallback((item: MenuItem) => {
    setCart(prev => {
      const ex = prev.find(c => c.id === item.id);
      if (ex) return prev.map(c => c.id===item.id ? {...c, qty:c.qty+1} : c);
      return [...prev, { id:item.id, name:item.name, price:item.price, qty:1, imageUrl:item.imageUrl }];
    });
  }, []);

  const updateQty = useCallback((id: string, delta: number) => {
    setCart(prev => prev.map(c => c.id===id ? {...c, qty:Math.max(0,c.qty+delta)} : c).filter(c=>c.qty>0));
  }, []);

  const total       = cart.reduce((s,c) => s+c.price*c.qty, 0);
  const itemCount   = cart.reduce((s,c) => s+c.qty, 0);
  const activeCatCfg = cats.find(c => c.id === activeCat) ?? cats[0];

  function handleSuccess(id: string) { setOrderId(id); setCheckoutOpen(false); setCartOpen(false); setCart([]); }

  if (orderId) return (
    <div style={{ background: G.dark, minHeight: '100dvh', fontFamily: sans }}>
      <div style={{ padding:'1rem 1.5rem', borderBottom:`1px solid ${G.border}` }}>
        <Link href="/" style={{ color:G.muted, textDecoration:'none', display:'inline-flex', alignItems:'center', gap:'0.4rem', fontSize:'0.85rem' }}>
          <ArrowLeft size={15}/> Nefertari
        </Link>
      </div>
      <OrderSuccess orderId={orderId} onNewOrder={() => setOrderId('')} />
    </div>
  );

  const catItems = menu.filter(i => i.category === activeCat);

  return (
    <div style={{ background: T.bg, minHeight: '100dvh', fontFamily: sans, color: T.text, transition: 'background 0.3s, color 0.3s' }}>

      {/* ── Header ── */}
      <header style={{ position: 'sticky', top: 0, zIndex: 40,
                       background: dark ? 'rgba(14,12,8,0.96)' : 'rgba(250,245,232,0.96)',
                       backdropFilter: 'blur(16px)', borderBottom: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem',
                      display: 'grid', gridTemplateColumns: '48px 1fr 48px',
                      alignItems: 'center', height: '56px' }}>
          {/* back */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  width: '36px', height: '36px', borderRadius: '50%',
                                  border: `1px solid ${T.border}`, textDecoration: 'none',
                                  transition: 'border-color 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = G.gold)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = T.border)}>
            <ArrowLeft size={15} color={T.muted} />
          </Link>

          {/* brand — center — text logo in both modes */}
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: serif, fontSize: '1rem', fontWeight: 700,
                        color: T.text, letterSpacing: '0.02em', lineHeight: 1.1 }}>
              Nefertari
            </p>
            <p style={{ color: G.gold, fontSize: '0.55rem', letterSpacing: '0.35em',
                        textTransform: 'uppercase', lineHeight: 1 }}>
              Cozinha Viva
            </p>
          </div>

          {/* right: theme toggle + cart */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.5rem' }}>
            <ThemeToggle dark={dark} onToggle={toggle} position="static" />
            <div style={{ width: '36px', height: '36px', flexShrink: 0, position: 'relative' }}>
              {itemCount > 0 && (
                <>
                  <button onClick={() => setCartOpen(true)} style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: G.gold, border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: 0, flexShrink: 0,
                  }}>
                    <ShoppingBag size={15} color="#14100C" />
                  </button>
                  <span style={{
                    position: 'absolute', top: '-4px', right: '-4px',
                    background: T.bg, color: G.gold, borderRadius: '50%',
                    width: '16px', height: '16px', fontSize: '0.6rem',
                    fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: `1px solid ${G.gold}`, pointerEvents: 'none',
                  }}>
                    {itemCount}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── Category nav ── */}
      <div style={{ borderBottom: `1px solid ${T.border}`,
                    background: dark ? 'rgba(14,12,8,0.85)' : 'rgba(250,245,232,0.9)',
                    position: 'sticky', top: '56px', zIndex: 39, backdropFilter: 'blur(8px)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', overflowX: 'auto',
                      display: 'flex', padding: '0 1.25rem' }}>
          {cats.map(cat => (
            <button key={cat.id} onClick={() => setActiveCat(cat.id)} style={{
              flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer',
              padding: '0.85rem 1rem', fontSize: '0.8rem', fontWeight: 600, fontFamily: sans,
              color: activeCat === cat.id ? G.gold : T.muted,
              borderBottom: `2px solid ${activeCat===cat.id ? G.gold : 'transparent'}`,
              transition: 'all 0.15s', whiteSpace: 'nowrap',
            }}>
              <span style={{ marginRight: '0.3rem', opacity: 0.5, fontSize: '0.7rem' }}>{cat.roman}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1.25rem 6rem' }}>

        {/* Category header */}
        {!loading && activeCatCfg && (
          <div style={{ padding: '2.5rem 0 2rem', borderBottom: `1px solid ${G.border}`,
                        marginBottom: '0', textAlign: 'center' }}>
            <p style={{ color: G.muted, fontSize: '0.65rem', letterSpacing: '0.4em',
                        textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              {activeCatCfg.roman} · {activeCatCfg.sub}
            </p>
            <h2 style={{ fontFamily: serif, fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
                         fontWeight: 700, color: G.text, margin: 0 }}>
              {activeCatCfg.label}
            </h2>
            <div style={{ width: '40px', height: '1px', background: G.gold, margin: '1rem auto 0' }} />
          </div>
        )}

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
            <Loader2 size={28} color={G.gold} style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        ) : (
          <div>
            {catItems.map((item, idx) => {
              const qty = cart.find(c => c.id===item.id)?.qty ?? 0;
              return (
                <div key={item.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '1.5rem 0',
                  borderBottom: idx < catItems.length - 1 ? `1px solid ${dark ? 'rgba(200,148,26,0.1)' : T.border}` : 'none',
                  gap: '1.25rem',
                  opacity: item.available ? 1 : 0.4,
                }}>
                  {/* single product photo — always one, click opens detail */}
                  <button onClick={() => item.available && setDetailItem(item)} style={{
                    width:'72px', height:'72px', borderRadius:'0.75rem', flexShrink:0,
                    overflow:'hidden', border:`1px solid ${dark ? 'rgba(200,148,26,0.18)' : T.border}`,
                    background: dark ? 'rgba(255,255,255,0.06)' : T.bg2,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    padding:0, cursor: item.available ? 'pointer' : 'default',
                    position:'relative',
                  }}>
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.imageUrl} alt={item.name}
                           style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                    ) : (
                      <span style={{ fontFamily:serif, fontSize:'1.4rem', color:`${G.gold}40` }}>
                        {item.name[0]}
                      </span>
                    )}
                    {/* multi-photo indicator dot */}
                    {(item.images?.length ?? 0) > 1 && (
                      <span style={{ position:'absolute', bottom:'4px', right:'4px',
                                     width:'6px', height:'6px', borderRadius:'50%',
                                     background:G.gold, opacity:0.8 }} />
                    )}
                  </button>

                  <div style={{ flex: 1, minWidth: 0, cursor: item.available ? 'pointer' : 'default' }}
                       onClick={() => item.available && setDetailItem(item)}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem',
                                  flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                      <h3 style={{ fontFamily: serif, fontSize: '1.05rem', fontWeight: 700,
                                   color: T.text, margin: 0 }}>{item.name}</h3>
                      {item.tags.map(t => (
                        <span key={t} style={{ fontSize: '0.58rem', fontWeight: 700, padding: '0.12rem 0.5rem',
                                               borderRadius: '99px', border: `1px solid ${G.green}50`,
                                               color: G.green, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                          {t}
                        </span>
                      ))}
                    </div>
                    <p style={{ color: T.muted, fontSize: '0.82rem', lineHeight: 1.6, maxWidth: '380px' }}>
                      {item.description}
                    </p>
                    <p style={{ color: G.gold, fontWeight: 700, fontSize: '0.95rem', marginTop: '0.5rem' }}>
                      {fmt(item.price)}
                    </p>
                  </div>

                  {/* qty control */}
                  {!item.available ? (
                    <span style={{ color: G.muted, fontSize: '0.72rem', marginTop: '0.25rem', whiteSpace: 'nowrap' }}>
                      Indisponível
                    </span>
                  ) : qty === 0 ? (
                    <button onClick={() => addToCart(item)} style={{
                      width: '2.1rem', height: '2.1rem', borderRadius: '50%', flexShrink: 0,
                      background: 'none', border: `1px solid ${G.border}`, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginTop: '0.1rem', transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLButtonElement).style.background = G.gold;
                      (e.currentTarget as HTMLButtonElement).style.borderColor = G.gold;
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.background = 'none';
                      (e.currentTarget as HTMLButtonElement).style.borderColor = G.border;
                    }}>
                      <Plus size={14} color={G.gold} />
                    </button>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0, marginTop: '0.1rem' }}>
                      <button onClick={() => updateQty(item.id, -1)} style={{
                        width: '1.8rem', height: '1.8rem', borderRadius: '50%', border: `1px solid ${G.border}`,
                        background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}><Minus size={12} color={G.muted} /></button>
                      <span style={{ color: G.gold, fontWeight: 700, minWidth: '1rem', textAlign: 'center' }}>{qty}</span>
                      <button onClick={() => addToCart(item)} style={{
                        width: '1.8rem', height: '1.8rem', borderRadius: '50%',
                        background: G.gold, border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}><Plus size={12} color={G.dark} /></button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ── Floating cart ── */}
      {itemCount > 0 && (
        <button onClick={() => setCartOpen(true)} style={{
          position: 'fixed', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)',
          background: G.gold, color: G.dark, border: 'none', borderRadius: '99px',
          padding: '0.85rem 1.5rem', cursor: 'pointer', zIndex: 50,
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          boxShadow: '0 8px 32px rgba(200,148,26,0.35)', fontFamily: sans,
          minWidth: '210px', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ background: G.dark, color: G.gold, borderRadius: '50%', width: '1.4rem',
                           height: '1.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                           fontSize: '0.72rem', fontWeight: 700 }}>{itemCount}</span>
            <ShoppingBag size={15} />
            <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>Ver pedido</span>
          </div>
          <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{fmt(total)}</span>
        </button>
      )}

      {cartOpen     && <CartPanel cart={cart} total={total} onClose={()=>setCartOpen(false)}
                                  onUpdateQty={updateQty} onCheckout={()=>{setCartOpen(false);setCheckoutOpen(true);}} />}
      {checkoutOpen && <CheckoutModal cart={cart} total={total} authToken={authToken} onClose={()=>setCheckoutOpen(false)} onSuccess={handleSuccess} />}
      {/* Loyalty badge */}
      <LoyaltyBadge dark={dark} authToken={authToken} onOpenAuth={() => setAuthOpen(true)} />

      {/* Customer auth modal */}
      {authOpen && (
        <CustomerAuth
          dark={dark} T={T}
          authToken={authToken}
          onClose={() => setAuthOpen(false)}
          onAuth={handleAuth}
          onLogout={handleLogout}
        />
      )}

      {detailItem   && (
        <ItemDetailModal
          item={detailItem} dark={dark} T={T}
          qty={cart.find(c => c.id===detailItem.id)?.qty ?? 0}
          onAdd={() => addToCart(detailItem)}
          onRemove={() => updateQty(detailItem.id, -1)}
          onClose={() => setDetailItem(null)}
        />
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Detail modal — bottom sheet on mobile, centered dialog on desktop ── */
        .detail-modal {
          bottom: 0; left: 0; right: 0;
          border-radius: 1.5rem 1.5rem 0 0;
          max-height: 92dvh;
        }
        .detail-modal-img {
          height: 260px;
          border-radius: 1.5rem 1.5rem 0 0;
        }

        @media (min-width: 720px) {
          .detail-modal {
            bottom: auto;
            left: 50%;
            top: 50%;
            right: auto;
            transform: translate(-50%, -50%);
            width: 640px;
            max-width: calc(100vw - 3rem);
            border-radius: 1.5rem;
            max-height: 88dvh;
          }
          .detail-modal-img {
            height: 320px;
            border-radius: 1.5rem 1.5rem 0 0;
          }
        }
      `}</style>
    </div>
  );
}
