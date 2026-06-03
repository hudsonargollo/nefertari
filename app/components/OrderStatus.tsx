'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, RefreshCw } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useTheme } from '../lib/useTheme';
import ThemeToggle from './ThemeToggle';

const serif = 'Playfair Display, Georgia, serif';
const sans  = 'Inter, system-ui, sans-serif';
const fmt   = (n: number) => `R$ ${n.toFixed(2).replace('.', ',')}`;

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
  { key: 'received',  label: 'Recebido',  desc: 'Seu pedido foi confirmado.'                    },
  { key: 'preparing', label: 'Em preparo', desc: 'A cozinha está trabalhando no seu pedido.'     },
  { key: 'ready',     label: 'Pronto',    desc: 'Seu pedido está pronto!'                        },
  { key: 'delivered', label: 'Entregue',  desc: 'Bom apetite! 🌿'                               },
];

const STEP_INDEX: Record<string, number> = {
  received: 0, preparing: 1, ready: 2, delivered: 3, cancelled: -1,
};

export default function OrderStatus() {
  const { dark, T, toggle } = useTheme();
  const params   = useSearchParams();
  const id       = params.get('id') ?? '';
  const [order,   setOrder]   = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [lastPoll, setLastPoll] = useState<Date | null>(null);

  const fetchOrder = useCallback(async () => {
    if (!id) { setError('ID de pedido não encontrado.'); setLoading(false); return; }
    try {
      const res = await fetch(`/api/orders/${id}`);
      if (res.status === 404) { setError('Pedido não encontrado.'); setLoading(false); return; }
      setOrder(await res.json() as Order);
      setLastPoll(new Date());
    } catch {
      setError('Não foi possível carregar o pedido.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchOrder(); }, [fetchOrder]);

  useEffect(() => {
    if (!order || order.status === 'delivered' || order.status === 'cancelled') return;
    const t = setInterval(fetchOrder, 10_000);
    return () => clearInterval(t);
  }, [order, fetchOrder]);

  const stepIdx = order ? (STEP_INDEX[order.status] ?? 0) : 0;

  return (
    <div style={{ background: T.bg, minHeight: '100dvh', fontFamily: sans, color: T.text, transition: 'background 0.3s, color 0.3s' }}>

      {/* Header */}
      <header style={{ background: dark ? 'rgba(14,12,8,0.96)' : T.card,
                       backdropFilter: 'blur(12px)',
                       borderBottom: `1px solid ${T.border}`,
                       padding: '0 1.25rem', height: '56px',
                       display: 'flex', alignItems: 'center',
                       justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 40 }}>
        <Link href="/cardapio" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                                        textDecoration: 'none', color: T.muted, fontSize: '0.85rem' }}>
          <ArrowLeft size={16} /> Cardápio
        </Link>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={dark ? '/nefertari-logo-golden.png' : '/nefertari-logo-v2.png'}
            alt="Nefertari"
            style={{ height: '28px', objectFit: 'contain' }}
          />
          <span style={{ fontFamily: serif, fontSize: '0.72rem', fontWeight: 600,
                         color: T.muted, letterSpacing: '0.05em' }}>
            Acompanhar pedido
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button onClick={fetchOrder} style={{ background: 'none', border: 'none', cursor: 'pointer',
                                                color: T.muted, padding: '4px', display: 'flex', alignItems: 'center' }}>
            <RefreshCw size={15} />
          </button>
          <ThemeToggle dark={dark} onToggle={toggle} position="static" />
        </div>
      </header>

      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '2rem 1.25rem' }}>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
            <Loader2 size={32} color={T.gold} style={{ animation: 'spin 1s linear infinite' }} />
          </div>

        ) : error ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: T.muted }}>
            <p style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>◈</p>
            <p>{error}</p>
            <Link href="/cardapio" style={{ color: T.gold, display: 'block', marginTop: '1rem', fontSize: '0.9rem' }}>
              Voltar ao cardápio
            </Link>
          </div>

        ) : order ? (
          <>
            {/* Order ID + customer */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <p style={{ color: T.muted, fontSize: '0.72rem', letterSpacing: '0.15em',
                          textTransform: 'uppercase', marginBottom: '0.4rem' }}>Pedido</p>
              <p style={{ fontFamily: serif, fontSize: '1.6rem', fontWeight: 700,
                          color: T.gold, marginBottom: '0.3rem' }}>{order.id}</p>
              <p style={{ color: T.text, fontSize: '0.9rem' }}>Olá, {order.customer.name} 👋</p>
            </div>

            {/* Cancelled */}
            {order.status === 'cancelled' ? (
              <div style={{ background: dark ? 'rgba(239,68,68,0.1)' : '#FEF2F2',
                            border: '1px solid rgba(239,68,68,0.3)',
                            borderRadius: '1rem', padding: '1.25rem', textAlign: 'center', marginBottom: '1.5rem' }}>
                <p style={{ color: '#ef4444', fontWeight: 700 }}>Pedido cancelado</p>
                <p style={{ color: '#ef4444', fontSize: '0.82rem', marginTop: '0.3rem' }}>
                  Entre em contato pelo WhatsApp para mais informações.
                </p>
              </div>
            ) : (
              /* Progress stepper */
              <div style={{ background: T.card, borderRadius: '1.25rem', border: `1px solid ${T.border}`,
                            padding: '1.5rem', marginBottom: '1.5rem',
                            boxShadow: dark ? 'none' : '0 2px 12px rgba(0,0,0,0.06)' }}>
                {STEPS.map((step, i) => {
                  const done    = i < stepIdx;
                  const current = i === stepIdx;
                  const future  = i > stepIdx;
                  return (
                    <div key={step.key} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start',
                                                  paddingBottom: i < STEPS.length - 1 ? '1.25rem' : 0,
                                                  position: 'relative' }}>
                      {i < STEPS.length - 1 && (
                        <div style={{ position: 'absolute', left: '0.68rem', top: '1.4rem',
                                      width: '2px', height: '100%',
                                      background: done ? T.gold : T.border }} />
                      )}
                      <div style={{
                        width: '1.4rem', height: '1.4rem', borderRadius: '50%', flexShrink: 0,
                        background: done ? T.gold : current ? T.text : T.border,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: current ? `2px solid ${T.gold}` : 'none',
                        transition: 'all 0.3s',
                      }}>
                        {done && <span style={{ color: dark ? '#14100C' : '#fff', fontSize: '0.65rem', fontWeight: 700 }}>✓</span>}
                      </div>
                      <div style={{ paddingTop: '0.05rem' }}>
                        <p style={{ fontWeight: current ? 700 : 500, fontSize: '0.9rem',
                                    color: future ? T.dim : T.text }}>
                          {step.label}
                        </p>
                        {current && (
                          <p style={{ color: T.muted, fontSize: '0.8rem', marginTop: '0.15rem' }}>
                            {step.desc}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Order items */}
            <div style={{ background: T.card, borderRadius: '1.25rem', border: `1px solid ${T.border}`,
                          padding: '1.25rem', marginBottom: '1rem',
                          boxShadow: dark ? 'none' : '0 2px 12px rgba(0,0,0,0.06)' }}>
              <p style={{ color: T.muted, fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.15em',
                          textTransform: 'uppercase', marginBottom: '0.75rem' }}>Itens</p>
              {order.items.map(i => (
                <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between',
                                          fontSize: '0.88rem', padding: '0.25rem 0', color: T.text }}>
                  <span>{i.qty}× {i.name}</span>
                  <span style={{ color: T.muted }}>{fmt(i.price * i.qty)}</span>
                </div>
              ))}
              <div style={{ borderTop: `1px solid ${T.border}`, marginTop: '0.5rem', paddingTop: '0.5rem',
                            display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                <span>Total</span><span style={{ color: T.gold }}>{fmt(order.total)}</span>
              </div>
              {order.notes && (
                <p style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: T.muted,
                            background: dark ? 'rgba(255,255,255,0.04)' : T.bg2,
                            padding: '0.5rem 0.75rem', borderRadius: '0.5rem' }}>
                  Obs: {order.notes}
                </p>
              )}
            </div>

            {/* Type */}
            <div style={{ background: T.card, borderRadius: '1rem', border: `1px solid ${T.border}`,
                          padding: '1rem', marginBottom: '1.5rem',
                          fontSize: '0.85rem', color: T.muted,
                          boxShadow: dark ? 'none' : '0 2px 12px rgba(0,0,0,0.06)' }}>
              {order.type === 'pickup'
                ? '🏪 Retirada no local'
                : `🛵 Entrega em: ${order.address}`}
            </div>

            {/* Last updated */}
            {lastPoll && (
              <p style={{ textAlign: 'center', color: T.dim, fontSize: '0.72rem' }}>
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
