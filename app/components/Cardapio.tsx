'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Minus, ShoppingBag, X, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const G = {
  gold:  '#C8941A', goldSoft: '#E6B84A',
  green: '#6B8C3E', terra: '#8B4030',
  dark:  '#14100C', dark2: '#1E1509',
  parch: '#FAF5E8', sand: '#F5E6C8',
  muted: '#A89070', border: '#E8D9BA',
};
const serif = 'Playfair Display, Georgia, serif';

// ─── Types ────────────────────────────────────────────────────────────────────
interface MenuItem {
  id: string; category: 'burger' | 'wrap' | 'side' | 'drink';
  name: string; description: string; price: number; available: boolean; tags: string[];
}
interface CartItem  { id: string; name: string; price: number; qty: number; }
interface CheckoutForm {
  name: string; phone: string;
  type: 'pickup' | 'delivery'; address: string; notes: string;
}

// ─── Categories ───────────────────────────────────────────────────────────────
const CATS = [
  { id: 'burger', label: 'Hambúrgueres', glyph: '◈' },
  { id: 'wrap',   label: 'Wraps',         glyph: '❧' },
  { id: 'side',   label: 'Acompanhamentos', glyph: '△' },
  { id: 'drink',  label: 'Bebidas',        glyph: '◉' },
] as const;

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  received:  { label: 'Pedido recebido',    color: G.gold },
  preparing: { label: 'Em preparo',          color: G.terra },
  ready:     { label: 'Pronto para retirada', color: G.green },
  delivered: { label: 'Entregue',            color: '#555' },
  cancelled: { label: 'Cancelado',           color: '#c00' },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n: number) => `R$ ${n.toFixed(2).replace('.', ',')}`;

function phoneFormat(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2)  return `(${d}`;
  if (d.length <= 7)  return `(${d.slice(0,2)}) ${d.slice(2)}`;
  if (d.length <= 11) return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
  return v;
}

// ─── Item Card ────────────────────────────────────────────────────────────────
function ItemCard({ item, qtyInCart, onAdd, onRemove }: {
  item: MenuItem; qtyInCart: number;
  onAdd: () => void; onRemove: () => void;
}) {
  return (
    <div style={{
      background: '#fff', borderRadius: '1rem', border: `1px solid ${G.border}`,
      padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start',
      opacity: item.available ? 1 : 0.5,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.3rem' }}>
          <p style={{ fontFamily: serif, fontWeight: 700, fontSize: '1rem', color: G.dark, margin: 0 }}>
            {item.name}
          </p>
          {item.tags.map(t => (
            <span key={t} style={{
              fontSize: '0.6rem', fontWeight: 700, padding: '0.15rem 0.5rem',
              borderRadius: '99px', border: `1px solid ${G.green}40`,
              color: G.green, textTransform: 'uppercase', letterSpacing: '0.1em',
            }}>{t}</span>
          ))}
        </div>
        <p style={{ color: G.muted, fontSize: '0.82rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>
          {item.description}
        </p>
        <p style={{ color: G.gold, fontWeight: 700, fontSize: '1rem' }}>{fmt(item.price)}</p>
      </div>

      {/* qty control */}
      {!item.available ? (
        <span style={{ fontSize: '0.7rem', color: G.muted, marginTop: '0.25rem', whiteSpace: 'nowrap' }}>Indisponível</span>
      ) : qtyInCart === 0 ? (
        <button onClick={onAdd} style={{
          width: '2.2rem', height: '2.2rem', borderRadius: '50%',
          background: G.dark, border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, marginTop: '0.1rem',
        }}>
          <Plus size={16} color={G.parch} />
        </button>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0, marginTop: '0.1rem' }}>
          <button onClick={onRemove} style={{
            width: '2rem', height: '2rem', borderRadius: '50%',
            background: G.sand, border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><Minus size={14} color={G.dark} /></button>
          <span style={{ fontWeight: 700, fontSize: '1rem', minWidth: '1.2rem', textAlign: 'center' }}>
            {qtyInCart}
          </span>
          <button onClick={onAdd} style={{
            width: '2rem', height: '2rem', borderRadius: '50%',
            background: G.dark, border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><Plus size={14} color={G.parch} /></button>
        </div>
      )}
    </div>
  );
}

// ─── Cart Panel ───────────────────────────────────────────────────────────────
function CartPanel({ cart, onClose, onUpdateQty, onCheckout, total }: {
  cart: CartItem[]; total: number;
  onClose: () => void;
  onUpdateQty: (id: string, delta: number) => void;
  onCheckout: () => void;
}) {
  return (
    <>
      {/* overlay */}
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(20,16,12,0.6)',
        zIndex: 90, backdropFilter: 'blur(4px)',
      }} />
      {/* panel */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 'min(420px, 100vw)',
        background: G.parch, zIndex: 91, display: 'flex', flexDirection: 'column',
        boxShadow: '-4px 0 32px rgba(0,0,0,0.2)',
      }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: `1px solid ${G.border}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontFamily: serif, fontSize: '1.2rem', fontWeight: 700, color: G.dark, margin: 0 }}>
            Seu pedido
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
            <X size={20} color={G.dark} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: G.muted }}>
              <p style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>◈</p>
              <p style={{ fontSize: '0.9rem' }}>Seu carrinho está vazio.<br />Adicione algo do cardápio.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {cart.map(item => (
                <div key={item.id} style={{
                  background: '#fff', borderRadius: '0.75rem', border: `1px solid ${G.border}`,
                  padding: '0.9rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem',
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem', color: G.dark, marginBottom: '0.2rem' }}>
                      {item.name}
                    </p>
                    <p style={{ color: G.gold, fontSize: '0.85rem', fontWeight: 700 }}>
                      {fmt(item.price * item.qty)}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <button onClick={() => onUpdateQty(item.id, -1)} style={{
                      width: '1.8rem', height: '1.8rem', borderRadius: '50%',
                      background: G.sand, border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}><Minus size={12} color={G.dark} /></button>
                    <span style={{ fontWeight: 700, minWidth: '1.2rem', textAlign: 'center', fontSize: '0.9rem' }}>
                      {item.qty}
                    </span>
                    <button onClick={() => onUpdateQty(item.id, 1)} style={{
                      width: '1.8rem', height: '1.8rem', borderRadius: '50%',
                      background: G.dark, border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}><Plus size={12} color={G.parch} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div style={{ padding: '1.25rem 1.5rem', borderTop: `1px solid ${G.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ color: G.muted, fontSize: '0.85rem' }}>Total</span>
              <span style={{ fontWeight: 700, color: G.dark, fontSize: '1.1rem' }}>{fmt(total)}</span>
            </div>
            <button onClick={onCheckout} style={{
              width: '100%', background: G.gold, color: G.dark,
              border: 'none', borderRadius: '99px', padding: '0.9rem',
              fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            }}>
              Finalizar pedido <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// ─── Checkout Modal ───────────────────────────────────────────────────────────
function CheckoutModal({ cart, total, onClose, onSuccess }: {
  cart: CartItem[]; total: number;
  onClose: () => void;
  onSuccess: (orderId: string) => void;
}) {
  const [form, setForm] = useState<CheckoutForm>({ name: '', phone: '', type: 'pickup', address: '', notes: '' });
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const set = (k: keyof CheckoutForm, v: string) => setForm(p => ({ ...p, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) { setError('Preencha nome e WhatsApp.'); return; }
    if (form.type === 'delivery' && !form.address.trim()) { setError('Informe o endereço de entrega.'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: { name: form.name, phone: form.phone },
          type: form.type, address: form.address, notes: form.notes,
          items: cart, total,
        }),
      });
      const data = await res.json() as { ok: boolean; id: string };
      if (!data.ok) throw new Error();
      // notify Jéssica via WhatsApp deep link
      const itemsSummary = cart.map(i => `${i.qty}× ${i.name}`).join(', ');
      const waText = encodeURIComponent(
        `🌿 *Novo pedido Nefertari*\n\n` +
        `*#${data.id}*\n` +
        `Cliente: ${form.name}\n` +
        `WhatsApp: ${form.phone}\n` +
        `Tipo: ${form.type === 'pickup' ? 'Retirada' : `Entrega — ${form.address}`}\n\n` +
        `${itemsSummary}\n\n` +
        `*Total: ${fmt(total)}*` +
        (form.notes ? `\n\nObs: ${form.notes}` : '')
      );
      window.open(`https://wa.me/5573988083318?text=${waText}`, '_blank');
      onSuccess(data.id);
    } catch {
      setError('Erro ao enviar pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.75rem 1rem', borderRadius: '0.75rem',
    border: `1px solid ${G.border}`, background: '#fff',
    fontSize: '0.9rem', color: G.dark, outline: 'none',
    fontFamily: 'Inter, system-ui, sans-serif', boxSizing: 'border-box',
  };

  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(20,16,12,0.7)',
        zIndex: 95, backdropFilter: 'blur(6px)',
      }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        width: 'min(520px, calc(100vw - 2rem))', maxHeight: '90dvh', overflowY: 'auto',
        background: G.parch, borderRadius: '1.5rem', zIndex: 96,
        boxShadow: '0 24px 80px rgba(0,0,0,0.3)',
      }}>
        <div style={{ padding: '1.5rem', borderBottom: `1px solid ${G.border}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontFamily: serif, fontSize: '1.2rem', fontWeight: 700, color: G.dark, margin: 0 }}>
            Finalizar pedido
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={20} color={G.dark} />
          </button>
        </div>

        <form onSubmit={submit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* order summary */}
          <div style={{ background: '#fff', borderRadius: '0.75rem', border: `1px solid ${G.border}`, padding: '1rem' }}>
            <p style={{ color: G.muted, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em',
                        textTransform: 'uppercase', marginBottom: '0.5rem' }}>Resumo</p>
            {cart.map(i => (
              <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between',
                                       fontSize: '0.85rem', color: G.dark, padding: '0.2rem 0' }}>
                <span>{i.qty}× {i.name}</span>
                <span style={{ fontWeight: 600 }}>{fmt(i.price * i.qty)}</span>
              </div>
            ))}
            <div style={{ borderTop: `1px solid ${G.border}`, marginTop: '0.5rem', paddingTop: '0.5rem',
                          display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
              <span>Total</span><span style={{ color: G.gold }}>{fmt(total)}</span>
            </div>
          </div>

          {/* customer fields */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: G.dark,
                            letterSpacing: '0.05em', marginBottom: '0.4rem' }}>Seu nome</label>
            <input value={form.name} onChange={e => set('name', e.target.value)}
                   placeholder="Como podemos te chamar?" style={inputStyle} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: G.dark,
                            letterSpacing: '0.05em', marginBottom: '0.4rem' }}>WhatsApp</label>
            <input value={form.phone}
                   onChange={e => set('phone', phoneFormat(e.target.value))}
                   placeholder="(73) 99999-9999" style={inputStyle} inputMode="tel" />
          </div>

          {/* type selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: G.dark,
                            letterSpacing: '0.05em', marginBottom: '0.4rem' }}>Como prefere receber?</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              {(['pickup', 'delivery'] as const).map(t => (
                <button key={t} type="button" onClick={() => set('type', t)} style={{
                  padding: '0.65rem', borderRadius: '0.75rem', cursor: 'pointer', fontWeight: 600,
                  fontSize: '0.85rem', transition: 'all 0.15s',
                  background: form.type === t ? G.dark : '#fff',
                  color: form.type === t ? G.parch : G.muted,
                  border: `1px solid ${form.type === t ? G.dark : G.border}`,
                }}>
                  {t === 'pickup' ? '🏪 Retirada' : '🛵 Entrega'}
                </button>
              ))}
            </div>
          </div>

          {form.type === 'delivery' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: G.dark,
                              letterSpacing: '0.05em', marginBottom: '0.4rem' }}>Endereço de entrega</label>
              <input value={form.address} onChange={e => set('address', e.target.value)}
                     placeholder="Rua, número, bairro" style={inputStyle} />
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: G.dark,
                            letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
              Observações <span style={{ fontWeight: 400, color: G.muted }}>(opcional)</span>
            </label>
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)}
                      placeholder="Sem cebola, molho à parte..." rows={2}
                      style={{ ...inputStyle, resize: 'none' }} />
          </div>

          {error && (
            <p style={{ color: '#c0392b', fontSize: '0.82rem', background: '#fdf2f2',
                        padding: '0.65rem 0.9rem', borderRadius: '0.5rem', margin: 0 }}>
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} style={{
            background: loading ? G.muted : G.gold, color: G.dark,
            border: 'none', borderRadius: '99px', padding: '1rem',
            fontWeight: 700, fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
          }}>
            {loading
              ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Enviando...</>
              : <>Confirmar pedido <ArrowRight size={16} /></>}
          </button>

          <p style={{ fontSize: '0.75rem', color: G.muted, textAlign: 'center', margin: 0 }}>
            Ao confirmar, você será redirecionado ao WhatsApp para nos avisar sobre o pedido.
          </p>
        </form>
      </div>
    </>
  );
}

// ─── Success Screen ───────────────────────────────────────────────────────────
function OrderSuccess({ orderId, onNewOrder }: { orderId: string; onNewOrder: () => void }) {
  return (
    <div style={{ minHeight: '60dvh', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                  padding: '3rem 1.5rem' }}>
      <CheckCircle2 size={56} color={G.green} style={{ marginBottom: '1.5rem' }} />
      <h2 style={{ fontFamily: serif, fontSize: '1.8rem', fontWeight: 700, color: G.dark, marginBottom: '0.5rem' }}>
        Pedido enviado!
      </h2>
      <p style={{ color: G.muted, marginBottom: '0.5rem', fontSize: '0.9rem' }}>
        Seu número de pedido é:
      </p>
      <p style={{ fontFamily: serif, fontSize: '1.4rem', fontWeight: 700, color: G.gold, marginBottom: '1.5rem',
                  background: '#fff', padding: '0.5rem 1.5rem', borderRadius: '0.75rem',
                  border: `1px solid ${G.border}` }}>
        {orderId}
      </p>
      <p style={{ color: G.muted, fontSize: '0.85rem', maxWidth: '320px', lineHeight: 1.6, marginBottom: '2rem' }}>
        O WhatsApp foi aberto para confirmar seu pedido com a gente. Manteremos você atualizado por lá.
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <a href={`/pedido?id=${orderId}`}
           style={{ background: G.dark, color: G.parch, padding: '0.75rem 1.5rem',
                    borderRadius: '99px', fontWeight: 600, fontSize: '0.9rem',
                    textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          Acompanhar pedido <ArrowRight size={14} />
        </a>
        <button onClick={onNewOrder} style={{
          background: 'none', border: `1px solid ${G.border}`, color: G.muted,
          padding: '0.75rem 1.5rem', borderRadius: '99px',
          fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
        }}>
          Novo pedido
        </button>
      </div>
    </div>
  );
}

// ─── Main Cardapio component ──────────────────────────────────────────────────
export default function Cardapio() {
  const [menu,     setMenu]     = useState<MenuItem[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [activeCat, setActiveCat] = useState<string>('burger');
  const [cart,     setCart]     = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderId,  setOrderId]  = useState('');

  useEffect(() => {
    fetch('/api/menu')
      .then(r => r.json())
      .then((data: MenuItem[]) => setMenu(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const addToCart = useCallback((item: MenuItem) => {
    setCart(prev => {
      const ex = prev.find(c => c.id === item.id);
      if (ex) return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { id: item.id, name: item.name, price: item.price, qty: 1 }];
    });
  }, []);

  const updateQty = useCallback((id: string, delta: number) => {
    setCart(prev => prev.map(c => c.id === id ? { ...c, qty: Math.max(0, c.qty + delta) } : c).filter(c => c.qty > 0));
  }, []);

  const total     = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const itemCount = cart.reduce((s, c) => s + c.qty, 0);

  const catItems  = menu.filter(i => i.category === activeCat);

  function handleSuccess(id: string) {
    setOrderId(id);
    setCheckoutOpen(false);
    setCartOpen(false);
    setCart([]);
  }

  if (orderId) return (
    <div style={{ background: G.parch, minHeight: '100dvh' }}>
      <div style={{ padding: '1.25rem 1.5rem', borderBottom: `1px solid ${G.border}`, background: '#fff' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                                color: G.dark, textDecoration: 'none', fontSize: '0.85rem' }}>
          <ArrowLeft size={16} /> Nefertari
        </Link>
      </div>
      <OrderSuccess orderId={orderId} onNewOrder={() => setOrderId('')} />
    </div>
  );

  return (
    <div style={{ background: G.parch, minHeight: '100dvh', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ── Header ─── */}
      <header style={{ position: 'sticky', top: 0, zIndex: 40, background: '#fff',
                       borderBottom: `1px solid ${G.border}`, boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 1.25rem',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '56px' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                                  textDecoration: 'none' }}>
            <ArrowLeft size={18} color={G.dark} />
            <span style={{ fontFamily: serif, fontSize: '1.05rem', fontWeight: 700, color: G.dark }}>Cardápio</span>
          </Link>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/nefertari-logo-v2.png" alt="Nefertari" style={{ height: '36px', objectFit: 'contain' }} />
        </div>
      </header>

      {/* ── Category tabs ─── */}
      <div style={{ position: 'sticky', top: '56px', zIndex: 39, background: G.parch,
                    borderBottom: `1px solid ${G.border}` }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', overflowX: 'auto',
                      display: 'flex', padding: '0 1.25rem', gap: '0' }}>
          {CATS.map(cat => (
            <button key={cat.id} onClick={() => setActiveCat(cat.id)} style={{
              flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer',
              padding: '0.9rem 1rem', fontSize: '0.82rem', fontWeight: 600,
              color: activeCat === cat.id ? G.dark : G.muted,
              borderBottom: activeCat === cat.id ? `2px solid ${G.gold}` : '2px solid transparent',
              transition: 'all 0.15s', whiteSpace: 'nowrap',
            }}>
              <span style={{ marginRight: '0.35rem' }}>{cat.glyph}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Items ─── */}
      <main style={{ maxWidth: '720px', margin: '0 auto', padding: '1.25rem' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
            <Loader2 size={28} color={G.gold} style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        ) : catItems.length === 0 ? (
          <p style={{ textAlign: 'center', color: G.muted, padding: '3rem', fontSize: '0.9rem' }}>
            Nenhum item disponível nesta categoria.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {catItems.map(item => (
              <ItemCard
                key={item.id} item={item}
                qtyInCart={cart.find(c => c.id === item.id)?.qty ?? 0}
                onAdd={() => addToCart(item)}
                onRemove={() => updateQty(item.id, -1)}
              />
            ))}
          </div>
        )}
        {/* bottom spacer for cart button */}
        <div style={{ height: '5rem' }} />
      </main>

      {/* ── Floating cart button ─── */}
      {itemCount > 0 && (
        <button onClick={() => setCartOpen(true)} style={{
          position: 'fixed', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)',
          background: G.dark, color: G.parch, border: 'none', borderRadius: '99px',
          padding: '0.9rem 1.5rem', cursor: 'pointer', zIndex: 50,
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          boxShadow: '0 8px 32px rgba(20,16,12,0.35)', fontFamily: 'Inter, system-ui, sans-serif',
          minWidth: '220px', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ background: G.gold, color: G.dark, borderRadius: '50%',
                           width: '1.5rem', height: '1.5rem', display: 'flex',
                           alignItems: 'center', justifyContent: 'center',
                           fontSize: '0.75rem', fontWeight: 700 }}>
              {itemCount}
            </span>
            <ShoppingBag size={16} />
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Ver pedido</span>
          </div>
          <span style={{ fontWeight: 700, color: G.gold }}>{fmt(total)}</span>
        </button>
      )}

      {/* ── Panels ─── */}
      {cartOpen && (
        <CartPanel
          cart={cart} total={total}
          onClose={() => setCartOpen(false)}
          onUpdateQty={updateQty}
          onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }}
        />
      )}

      {checkoutOpen && (
        <CheckoutModal
          cart={cart} total={total}
          onClose={() => setCheckoutOpen(false)}
          onSuccess={handleSuccess}
        />
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
