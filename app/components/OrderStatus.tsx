'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, RefreshCw } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

const G = { gold: '#C8941A', green: '#6B8C3E', terra: '#8B4030',
            dark: '#14100C', parch: '#FAF5E8', sand: '#F5E6C8',
            muted: '#A89070', border: '#E8D9BA' };
const serif = 'Playfair Display, Georgia, serif';
const fmt = (n: number) => `R$ ${n.toFixed(2).replace('.', ',')}`;

interface Order {
  id: string;
  customer: { name: string; phone: string };
  type: 'pickup' | 'delivery';
  address?: string;
  items: { id: string; name: string; price: number; qty: number }[];
  total: number;
  notes?: string;
  status: 'received' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  created_at: string;
  updated_at: string;
}

const STEPS: { key: Order['status']; label: string; desc: string }[] = [
  { key: 'received',  label: 'Recebido',    desc: 'Seu pedido foi confirmado.' },
  { key: 'preparing', label: 'Em preparo',  desc: 'A cozinha está trabalhando no seu pedido.' },
  { key: 'ready',     label: 'Pronto',      desc: 'Seu pedido está pronto!' },
  { key: 'delivered', label: 'Entregue',    desc: 'Bom apetite! 🌿' },
];

const STEP_INDEX: Record<string, number> = {
  received: 0, preparing: 1, ready: 2, delivered: 3, cancelled: -1,
};

export default function OrderStatus() {
  const params  = useSearchParams();
  const id      = params.get('id') ?? '';
  const [order, setOrder]   = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');
  const [lastPoll, setLastPoll] = useState<Date | null>(null);

  const fetch_ = useCallback(async () => {
    if (!id) { setError('ID de pedido não encontrado.'); setLoading(false); return; }
    try {
      const res = await fetch(`/api/orders/${id}`);
      if (res.status === 404) { setError('Pedido não encontrado.'); setLoading(false); return; }
      const data = await res.json() as Order;
      setOrder(data);
      setLastPoll(new Date());
    } catch {
      setError('Não foi possível carregar o pedido.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  // initial load
  useEffect(() => { fetch_(); }, [fetch_]);

  // poll every 10s while order is active
  useEffect(() => {
    if (!order || order.status === 'delivered' || order.status === 'cancelled') return;
    const t = setInterval(fetch_, 10_000);
    return () => clearInterval(t);
  }, [order, fetch_]);

  const stepIdx = order ? (STEP_INDEX[order.status] ?? 0) : 0;

  return (
    <div style={{ background: G.parch, minHeight: '100dvh', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* header */}
      <header style={{ background: '#fff', borderBottom: `1px solid ${G.border}`,
                       padding: '0 1.25rem', height: '56px',
                       display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/cardapio" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                                        textDecoration: 'none', color: G.dark, fontSize: '0.85rem' }}>
          <ArrowLeft size={16} /> Cardápio
        </Link>
        <span style={{ fontFamily: serif, fontSize: '0.95rem', fontWeight: 700, color: G.dark }}>
          Acompanhar pedido
        </span>
        <button onClick={fetch_} style={{ background: 'none', border: 'none', cursor: 'pointer',
                                          padding: '4px', color: G.muted }}>
          <RefreshCw size={16} />
        </button>
      </header>

      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '2rem 1.25rem' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
            <Loader2 size={32} color={G.gold} style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: G.muted }}>
            <p style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>◈</p>
            <p>{error}</p>
            <Link href="/cardapio" style={{ color: G.gold, display: 'block', marginTop: '1rem', fontSize: '0.9rem' }}>
              Voltar ao cardápio
            </Link>
          </div>
        ) : order ? (
          <>
            {/* order id + customer */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <p style={{ color: G.muted, fontSize: '0.75rem', letterSpacing: '0.15em',
                          textTransform: 'uppercase', marginBottom: '0.4rem' }}>Pedido</p>
              <p style={{ fontFamily: serif, fontSize: '1.6rem', fontWeight: 700,
                          color: G.gold, marginBottom: '0.3rem' }}>{order.id}</p>
              <p style={{ color: G.dark, fontSize: '0.9rem' }}>Olá, {order.customer.name} 👋</p>
            </div>

            {/* status badge */}
            {order.status === 'cancelled' ? (
              <div style={{ background: '#fdf2f2', border: '1px solid #f5c6c6', borderRadius: '1rem',
                            padding: '1.25rem', textAlign: 'center', marginBottom: '1.5rem' }}>
                <p style={{ color: '#c0392b', fontWeight: 700 }}>Pedido cancelado</p>
                <p style={{ color: '#c0392b', fontSize: '0.82rem', marginTop: '0.3rem' }}>
                  Entre em contato pelo WhatsApp para mais informações.
                </p>
              </div>
            ) : (
              /* progress stepper */
              <div style={{ background: '#fff', borderRadius: '1.25rem', border: `1px solid ${G.border}`,
                            padding: '1.5rem', marginBottom: '1.5rem' }}>
                {STEPS.map((step, i) => {
                  const done    = i < stepIdx;
                  const current = i === stepIdx;
                  const future  = i > stepIdx;
                  return (
                    <div key={step.key} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start',
                                                  paddingBottom: i < STEPS.length - 1 ? '1.25rem' : 0,
                                                  position: 'relative' }}>
                      {/* connector line */}
                      {i < STEPS.length - 1 && (
                        <div style={{
                          position: 'absolute', left: '0.7rem', top: '1.4rem',
                          width: '2px', height: '100%',
                          background: done ? G.gold : G.border,
                        }} />
                      )}
                      {/* dot */}
                      <div style={{
                        width: '1.4rem', height: '1.4rem', borderRadius: '50%', flexShrink: 0,
                        background: done ? G.gold : current ? G.dark : G.border,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: current ? `2px solid ${G.gold}` : 'none',
                        transition: 'all 0.3s',
                      }}>
                        {done && <span style={{ color: '#fff', fontSize: '0.65rem', fontWeight: 700 }}>✓</span>}
                      </div>
                      <div style={{ paddingTop: '0.05rem' }}>
                        <p style={{ fontWeight: current ? 700 : 500, fontSize: '0.9rem',
                                    color: future ? G.muted : G.dark }}>
                          {step.label}
                        </p>
                        {current && (
                          <p style={{ color: G.muted, fontSize: '0.8rem', marginTop: '0.15rem' }}>
                            {step.desc}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* order details */}
            <div style={{ background: '#fff', borderRadius: '1.25rem', border: `1px solid ${G.border}`,
                          padding: '1.25rem', marginBottom: '1rem' }}>
              <p style={{ color: G.muted, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em',
                          textTransform: 'uppercase', marginBottom: '0.75rem' }}>Itens</p>
              {order.items.map(i => (
                <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between',
                                          fontSize: '0.88rem', padding: '0.25rem 0', color: G.dark }}>
                  <span>{i.qty}× {i.name}</span>
                  <span style={{ color: G.muted }}>{fmt(i.price * i.qty)}</span>
                </div>
              ))}
              <div style={{ borderTop: `1px solid ${G.border}`, marginTop: '0.5rem', paddingTop: '0.5rem',
                            display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                <span>Total</span><span style={{ color: G.gold }}>{fmt(order.total)}</span>
              </div>
              {order.notes && (
                <p style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: G.muted,
                            background: G.sand, padding: '0.5rem 0.75rem', borderRadius: '0.5rem' }}>
                  Obs: {order.notes}
                </p>
              )}
            </div>

            {/* pickup/delivery info */}
            <div style={{ background: '#fff', borderRadius: '1rem', border: `1px solid ${G.border}`,
                          padding: '1rem', marginBottom: '1.5rem', fontSize: '0.85rem', color: G.muted }}>
              {order.type === 'pickup'
                ? '🏪 Retirada no local'
                : `🛵 Entrega em: ${order.address}`}
            </div>

            {/* last updated */}
            {lastPoll && (
              <p style={{ textAlign: 'center', color: G.muted, fontSize: '0.72rem' }}>
                Atualizado às {lastPoll.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                {' · '}atualização automática a cada 10s
              </p>
            )}
          </>
        ) : null}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
