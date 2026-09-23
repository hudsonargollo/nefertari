'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { LogOut, RefreshCw, Clock, MapPin, Package, CheckCircle2, Loader2, ChevronRight, Settings, X, Users, MessageCircle, Send, Sparkles, AlertCircle } from 'lucide-react';
import { useTheme } from '../lib/useTheme';
import ThemeToggle from './ThemeToggle';
import PainelHeader from './PainelHeader';

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const G = {
  gold: '#C8941A', goldSoft: '#E6B84A',
  green: '#6B8C3E', terra: '#8B4030',
  dark: '#14100C', dark2: '#1E1509',
  parch: '#FAF5E8', sand: '#F5E6C8',
  muted: '#A89070', border: '#E8D9BA',
  text: '#E8D9BA',
  bg: '#F2F0EC',
};
const serif = 'Playfair Display, Georgia, serif';
const fmt   = (n: number) => `R$ ${n.toFixed(2).replace('.', ',')}`;

// ─── Types ────────────────────────────────────────────────────────────────────
type OrderStatus = 'received' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
interface OrderItem { id: string; name: string; price: number; qty: number; }
interface Order {
  id: string;
  customer: { name: string; phone: string };
  type: 'pickup' | 'delivery'; address?: string;
  items: OrderItem[]; total: number; notes?: string;
  status: OrderStatus; pin?: string; created_at: string; updated_at: string;
}

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS = {
  received:  { label: 'Recebido',    color: G.gold,  bg: '#FFF8E6', next: 'preparing' as OrderStatus, action: 'Iniciar preparo' },
  preparing: { label: 'Em preparo',  color: G.terra, bg: '#FBF0EE', next: 'ready'     as OrderStatus, action: 'Marcar como pronto' },
  ready:     { label: 'Pronto',      color: G.green, bg: '#EEF4E9', next: 'delivered' as OrderStatus, action: 'Confirmar entrega' },
  delivered: { label: 'Entregue',    color: '#6B6560', bg: '#F5F5F4', next: null,                       action: '' },
  cancelled: { label: 'Cancelado',   color: '#b91c1c', bg: '#FEF2F2', next: null,                       action: '' },
};

function timeAgo(dateStr: string): string {
  const mins = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
  if (mins < 1)  return 'agora';
  if (mins < 60) return `${mins}min`;
  const h = Math.floor(mins / 60);
  return `${h}h${mins % 60 > 0 ? `${mins % 60}min` : ''}`;
}

// ─── PIN Gate ─────────────────────────────────────────────────────────────────
function PinGate({ onAuth }: { onAuth: (token: string) => void }) {
  const [pin,     setPin]     = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res  = await fetch('/api/painel/auth', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });
      const data = await res.json() as { ok: boolean; token?: string; error?: string };
      if (data.ok && data.token) {
        sessionStorage.setItem('painel:token', data.token);
        onAuth(data.token);
      } else {
        setError(data.error ?? 'PIN incorreto');
        setPin('');
        inputRef.current?.focus();
      }
    } catch {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100dvh', background: G.dark, display: 'flex',
                  alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div style={{ width: '100%', maxWidth: '360px' }}>
        {/* logo */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/nefertari-logo-golden.png"
            alt="Nefertari Cozinha Viva"
            style={{ height: '96px', maxWidth: '200px', objectFit: 'contain', margin: '0 auto 1rem', display: 'block' }}
          />
          <p style={{ color: G.muted, fontSize: '0.75rem', letterSpacing: '0.25em', textTransform: 'uppercase', textAlign: 'center' }}>
            Painel da Cozinha
          </p>
        </div>

        <form onSubmit={submit} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '1.5rem',
                                          border: '1px solid rgba(255,255,255,0.08)', padding: '2rem' }}>
          <p style={{ color: G.parch, fontFamily: serif, fontSize: '1.2rem', fontWeight: 600,
                      textAlign: 'center', marginBottom: '1.5rem' }}>
            Acesso restrito
          </p>

          {/* PIN dots */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
            {[0,1,2,3].map(i => (
              <div key={i} style={{
                width: '0.85rem', height: '0.85rem', borderRadius: '50%', transition: 'all 0.15s',
                background: pin.length > i ? G.gold : 'rgba(255,255,255,0.15)',
              }} />
            ))}
          </div>

          <input
            ref={inputRef}
            type="password" inputMode="numeric" maxLength={6}
            value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, ''))}
            placeholder="Digite o PIN"
            style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '0.75rem', boxSizing: 'border-box',
                     background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
                     color: G.parch, fontSize: '1rem', outline: 'none', textAlign: 'center',
                     letterSpacing: '0.3em', fontFamily: 'Inter, system-ui, sans-serif', marginBottom: '1rem' }}
          />

          {error && (
            <p style={{ color: '#f87171', fontSize: '0.8rem', textAlign: 'center', marginBottom: '1rem' }}>
              {error}
            </p>
          )}

          <button type="submit" disabled={loading || pin.length < 4} style={{
            width: '100%', padding: '0.9rem', borderRadius: '99px', border: 'none', cursor: 'pointer',
            background: loading || pin.length < 4 ? 'rgba(200,148,26,0.4)' : G.gold,
            color: G.dark, fontWeight: 700, fontSize: '0.95rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
          }}>
            {loading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : 'Entrar'}
          </button>
        </form>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── Order Card ───────────────────────────────────────────────────────────────
function OrderCard({ order, onStatusChange, onSendMessage, updating, cardBg, cardBorder, itemBg, dark }: {
  order: Order;
  onStatusChange: (id: string, status: OrderStatus) => void;
  onSendMessage: (order: Order) => void;
  updating: boolean;
  cardBg: string; cardBorder: string; itemBg: string;
  dark: boolean;
}) {
  const cfg = STATUS[order.status];
  const textClr = dark ? '#E8D9BA' : '#14100C';
  const mutedClr = dark ? '#A89070' : '#6B5040';
  const statusBg = dark ? (
    order.status === 'received' ? 'rgba(200,148,26,0.2)' :
    order.status === 'preparing' ? 'rgba(139,64,48,0.25)' :
    order.status === 'ready' ? 'rgba(107,140,62,0.25)' :
    order.status === 'delivered' ? 'rgba(255,255,255,0.06)' :
    'rgba(239,68,68,0.2)'
  ) : cfg.bg;

  return (
    <div style={{
      background: cardBg, borderRadius: '1.25rem', border: `1px solid ${cardBorder}`,
      overflow: 'hidden', transition: 'box-shadow 0.2s',
      boxShadow: order.status === 'received' ? '0 0 0 2px rgba(200,148,26,0.4)' : 'none',
    }}>
      {/* status strip */}
      <div style={{ background: statusBg, padding: '0.6rem 1rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em',
                       textTransform: 'uppercase', color: cfg.color }}>
          {cfg.label}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: mutedClr, fontSize: '0.72rem' }}>
          <Clock size={11} />{timeAgo(order.created_at)}
        </div>
      </div>

      <div style={{ padding: '1rem' }}>
        {/* ID + customer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <p style={{ fontFamily: serif, fontWeight: 700, fontSize: '1rem', color: textClr }}>{order.id}</p>
              {order.pin && (
                <span style={{ fontSize: '0.62rem', fontWeight: 700, background: dark ? 'rgba(200,148,26,0.2)' : G.sand, color: dark ? G.gold : G.dark, padding: '0.1rem 0.4rem', borderRadius: '0.35rem', border: `1px solid ${cardBorder}` }}>
                  PIN: {order.pin}
                </span>
              )}
            </div>
            <p style={{ color: mutedClr, fontSize: '0.82rem', marginTop: '0.1rem' }}>{order.customer.name}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontWeight: 700, color: G.gold, fontSize: '1rem' }}>{fmt(order.total)}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: mutedClr,
                          fontSize: '0.72rem', justifyContent: 'flex-end', marginTop: '0.1rem' }}>
              {order.type === 'pickup'
                ? <><Package size={10} /> Retirada</>
                : <><MapPin size={10} /> Entrega</>}
            </div>
          </div>
        </div>

        {/* items */}
        <div style={{ background: dark ? 'rgba(255,255,255,0.04)' : itemBg, borderRadius: '0.75rem', padding: '0.75rem',
                      marginBottom: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {order.items.map(i => (
            <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between',
                                     fontSize: '0.83rem', color: textClr }}>
              <span>{i.qty}× {i.name}</span>
              <span style={{ color: mutedClr }}>{fmt(i.price * i.qty)}</span>
            </div>
          ))}
        </div>

        {/* address + notes */}
        {order.type === 'delivery' && order.address && (
          <p style={{ fontSize: '0.78rem', color: mutedClr, marginBottom: '0.5rem',
                      display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <MapPin size={11} />{order.address}
          </p>
        )}
        {order.notes && (
          <p style={{ fontSize: '0.78rem', color: mutedClr, marginBottom: '0.5rem',
                      background: dark ? 'rgba(255,255,255,0.06)' : G.sand, padding: '0.4rem 0.6rem', borderRadius: '0.4rem' }}>
            Obs: {order.notes}
          </p>
        )}

        {/* actions */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', alignItems: 'center' }}>
          {cfg.next ? (
            <>
              <button
                onClick={() => cfg.next && onStatusChange(order.id, cfg.next)}
                disabled={updating}
                style={{
                  flex: 1, padding: '0.7rem', borderRadius: '0.75rem', border: 'none', cursor: 'pointer',
                  background: cfg.color, color: '#fff', fontWeight: 700, fontSize: '0.82rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem',
                  opacity: updating ? 0.7 : 1,
                }}>
                {updating
                  ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} />
                  : <><ChevronRight size={14} />{cfg.action}</>}
              </button>
              <button
                type="button"
                onClick={() => onSendMessage(order)}
                title="Enviar mensagem WhatsApp"
                style={{
                  padding: '0.7rem', borderRadius: '0.75rem', border: '1px solid rgba(37,211,102,0.35)',
                  background: 'rgba(37,211,102,0.1)', cursor: 'pointer', color: '#25D366', display: 'flex', alignItems: 'center',
                }}>
                <MessageCircle size={15} />
              </button>
              <button
                onClick={() => onStatusChange(order.id, 'cancelled')}
                disabled={updating}
                title="Cancelar pedido"
                style={{
                  padding: '0.7rem 0.85rem', borderRadius: '0.75rem', border: `1px solid ${G.border}`,
                  background: '#fff', cursor: 'pointer', color: '#b91c1c', display: 'flex', alignItems: 'center',
                }}>
                <X size={15} />
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <button
                type="button"
                onClick={() => onSendMessage(order)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.35rem',
                  padding: '0.5rem 0.85rem', borderRadius: '0.65rem',
                  background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.3)',
                  color: '#25D366', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600,
                }}>
                <MessageCircle size={14} /> Mensagem WhatsApp
              </button>

              {order.status === 'delivered' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: G.green, fontSize: '0.8rem' }}>
                  <CheckCircle2 size={14} /> Entregue
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Send Message Modal ───────────────────────────────────────────────────────
function SendMessageModal({ order, onClose }: { order: Order; onClose: () => void }) {
  const firstName = order.customer?.name ? order.customer.name.trim().split(' ')[0] : 'Cliente';
  const [msg, setMsg] = useState(
    `Olá, ${firstName}! 🌿 Aqui é a Jéssica da Nefertari Cozinha Viva. Passando para falar sobre o seu pedido #${order.id}.`
  );
  const [sending, setSending] = useState(false);
  const [result,  setResult]  = useState<{ ok?: boolean; error?: string } | null>(null);

  const templates = [
    {
      label: '🌿 Saudação & Status',
      text: `Olá, ${firstName}! 🌿 Aqui é a Jéssica da Nefertari. Seu pedido #${order.id} está sendo preparado com muito carinho e ingredientes frescos da nossa cozinha viva!`,
    },
    {
      label: '🛵 Saiu para Entrega',
      text: `Olá, ${firstName}! ✨ Boas notícias: seu pedido #${order.id} já foi finalizado e o entregador está a caminho do seu endereço. Bom apetite!`,
    },
    {
      label: '🏡 Dúvida de Endereço',
      text: `Olá, ${firstName}! 🌿 Da Nefertari. Nosso entregador está a caminho com seu pedido #${order.id}. Poderia nos confirmar algum ponto de referência próximo da sua casa?`,
    },
    {
      label: '⏳ Tempo de Espera',
      text: `Olá, ${firstName}! ✨ Como nossa cozinha faz cada receita artesanalmente do zero, seu pedido #${order.id} vai levar cerca de 10 minutinhos adicionais para ficar no ponto perfeito. Agradecemos a compreensão e o carinho!`,
    },
    {
      label: '🔑 Enviar PIN de Acesso',
      text: `Olá, ${firstName}! 🌿 Seu PIN exclusivo de acesso da Nefertari é *${order.pin || '1234'}*.\nAcompanhe seu pedido em: https://nefertari.clubemkt.digital/pedido?id=${order.id}`,
    },
  ];

  async function handleSend() {
    if (!msg.trim()) return;
    setSending(true);
    setResult(null);
    try {
      const res = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: order.customer.phone,
          text: msg,
          orderId: order.id,
          customerName: order.customer.name,
        }),
      });
      const data = await res.json() as { ok: boolean; error?: string };
      setResult(data);
      if (data.ok) {
        setTimeout(onClose, 1600);
      }
    } catch {
      setResult({ ok: false, error: 'Erro de conexão.' });
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 85, backdropFilter: 'blur(4px)' }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        width: 'min(460px, calc(100vw - 2rem))', background: G.dark, borderRadius: '1.5rem',
        border: `1px solid ${G.border}`, zIndex: 86, padding: '1.75rem',
        boxShadow: '0 24px 80px rgba(0,0,0,0.6)', color: G.text,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div>
            <p style={{ fontFamily: serif, fontSize: '1.15rem', fontWeight: 700, color: G.text, margin: 0 }}>
              Mensagem WhatsApp
            </p>
            <p style={{ color: G.muted, fontSize: '0.8rem', marginTop: '0.2rem' }}>
              Para: <strong>{order.customer.name}</strong> ({order.customer.phone})
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
            <X size={18} color={G.muted} />
          </button>
        </div>

        {/* Quick templates */}
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ color: G.muted, fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>
            Modelos no Tom da Marca
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {templates.map(t => (
              <button
                key={t.label}
                type="button"
                onClick={() => setMsg(t.text)}
                style={{
                  background: 'rgba(255,255,255,0.05)', border: `1px solid ${G.border}`,
                  padding: '0.3rem 0.65rem', borderRadius: '99px', color: G.text,
                  fontSize: '0.72rem', cursor: 'pointer', fontFamily: 'Inter, system-ui, sans-serif',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <textarea
            rows={4}
            value={msg}
            onChange={e => setMsg(e.target.value)}
            placeholder="Escreva a mensagem personalizada..."
            style={{
              width: '100%', padding: '0.85rem 1rem', borderRadius: '0.75rem', boxSizing: 'border-box',
              background: 'rgba(255,255,255,0.06)', border: `1px solid ${G.border}`,
              color: G.text, fontSize: '0.88rem', fontFamily: 'Inter, system-ui, sans-serif', outline: 'none', resize: 'vertical',
            }}
          />
        </div>

        {result && (
          <div style={{
            fontSize: '0.82rem', marginBottom: '1rem',
            color: result.ok ? '#25D366' : '#f87171',
            display: 'flex', alignItems: 'center', gap: '0.35rem',
          }}>
            {result.ok ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            {result.ok ? 'Mensagem enviada com sucesso!' : `Erro ao enviar: ${result.error || 'Verifique a conexão do WhatsApp'}`}
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '0.75rem 1.25rem', borderRadius: '99px',
              background: 'none', border: `1px solid ${G.border}`,
              color: G.muted, fontSize: '0.85rem', cursor: 'pointer',
            }}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSend}
            disabled={sending || !msg.trim()}
            style={{
              padding: '0.75rem 1.5rem', borderRadius: '99px',
              background: '#25D366', color: '#fff', border: 'none',
              fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '0.4rem',
            }}
          >
            {sending ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={15} />}
            Enviar Mensagem
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Change PIN modal ─────────────────────────────────────────────────────────
function ChangePinModal({ token, onClose }: { token: string; onClose: () => void }) {
  const [form, setForm]   = useState({ current: '', next: '', confirm: '' });
  const [msg,  setMsg]    = useState('');
  const [ok,   setOk]     = useState(false);
  const [busy, setBusy]   = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (form.next !== form.confirm) { setMsg('Os PINs não coincidem.'); return; }
    setBusy(true); setMsg('');
    try {
      const res  = await fetch('/api/painel/auth', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPin: form.current, newPin: form.next, token }),
      });
      const data = await res.json() as { ok: boolean; error?: string };
      if (data.ok) { setOk(true); }
      else         { setMsg(data.error ?? 'Erro ao alterar PIN.'); }
    } catch {
      setMsg('Erro de conexão.');
    } finally {
      setBusy(false);
    }
  }

  const inp: React.CSSProperties = {
    width: '100%', padding: '0.75rem 1rem', borderRadius: '0.75rem', boxSizing: 'border-box',
    border: `1px solid ${G.border}`, background: G.parch, fontSize: '0.9rem',
    fontFamily: 'Inter, system-ui, sans-serif', outline: 'none', color: G.dark,
  };

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(20,16,12,0.6)', zIndex: 80 }} />
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
                    width: 'min(380px, calc(100vw - 2rem))', background: G.parch,
                    borderRadius: '1.5rem', zIndex: 81, padding: '1.75rem',
                    boxShadow: '0 24px 80px rgba(0,0,0,0.25)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <p style={{ fontFamily: serif, fontSize: '1.1rem', fontWeight: 700, color: G.dark }}>Alterar PIN</p>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={18} color={G.dark} />
          </button>
        </div>
        {ok ? (
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <CheckCircle2 size={40} color={G.green} style={{ marginBottom: '0.75rem' }} />
            <p style={{ color: G.dark, fontWeight: 600 }}>PIN alterado com sucesso!</p>
            <button onClick={onClose} style={{ marginTop: '1rem', padding: '0.6rem 1.5rem',
                                               background: G.dark, color: G.parch, border: 'none',
                                               borderRadius: '99px', cursor: 'pointer', fontWeight: 600 }}>
              Fechar
            </button>
          </div>
        ) : (
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[['current','PIN atual'],['next','Novo PIN'],['confirm','Confirmar novo PIN']].map(([key, label]) => (
              <div key={key}>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: G.dark,
                                letterSpacing: '0.05em', marginBottom: '0.3rem' }}>{label}</label>
                <input type="password" inputMode="numeric" maxLength={6} style={inp}
                       value={form[key as keyof typeof form]}
                       onChange={e => setForm(p => ({ ...p, [key]: e.target.value.replace(/\D/g,'') }))} />
              </div>
            ))}
            {msg && <p style={{ color: '#b91c1c', fontSize: '0.8rem' }}>{msg}</p>}
            <button type="submit" disabled={busy} style={{
              padding: '0.8rem', borderRadius: '99px', background: G.dark, color: G.parch,
              border: 'none', fontWeight: 700, cursor: 'pointer', marginTop: '0.25rem',
            }}>
              {busy ? 'Salvando...' : 'Salvar PIN'}
            </button>
          </form>
        )}
      </div>
    </>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({ token, onLogout }: { token: string; onLogout: () => void }) {
  const { dark, T, toggle } = useTheme();
  const [orders,       setOrders]       = useState<Order[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [updating,     setUpdating]     = useState<string | null>(null);
  const [tab,          setTab]          = useState<'active' | 'history'>('active');
  const [pinModal,     setPinModal]     = useState(false);
  const [messageOrder, setMessageOrder] = useState<Order | null>(null);
  const [newOrders,    setNewOrders]    = useState(0);
  const prevIds = useRef<Set<string>>(new Set());

  const fetchOrders = useCallback(async () => {
    try {
      const [activeRes, allRes] = await Promise.all([
        fetch('/api/orders?active=true'),
        fetch('/api/orders'),
      ]);
      const active = await activeRes.json() as Order[];
      const all    = await allRes.json()    as Order[];

      // detect genuinely new orders since last poll
      const currentIds = new Set(active.map(o => o.id));
      const fresh = [...currentIds].filter(id => !prevIds.current.has(id) && prevIds.current.size > 0);
      if (fresh.length > 0) setNewOrders(n => n + fresh.length);
      prevIds.current = currentIds;

      // merge: active orders first, then rest for history
      const historyIds = new Set(active.map(o => o.id));
      const history    = all.filter(o => !historyIds.has(o.id));
      setOrders([...active, ...history]);
    } catch { /* keep showing last data */ }
    finally  { setLoading(false); }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);
  useEffect(() => {
    const t = setInterval(fetchOrders, 10_000);
    return () => clearInterval(t);
  }, [fetchOrders]);

  async function updateStatus(id: string, status: OrderStatus) {
    setUpdating(id);
    try {
      await fetch(`/api/orders/${id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      await fetchOrders();
    } catch { /* silent */ }
    finally  { setUpdating(null); }
  }

  const active  = orders.filter(o => ['received','preparing','ready'].includes(o.status));
  const history = orders.filter(o => ['delivered','cancelled'].includes(o.status));

  // kanban columns
  const cols = [
    { key: 'received'  as OrderStatus, label: 'Recebidos',   color: G.gold  },
    { key: 'preparing' as OrderStatus, label: 'Em preparo',  color: G.terra },
    { key: 'ready'     as OrderStatus, label: 'Prontos',     color: G.green },
  ];

  const todayRevenue = history
    .filter(o => o.status === 'delivered' && new Date(o.created_at).toDateString() === new Date().toDateString())
    .reduce((s, o) => s + o.total, 0);

  return (
    <div style={{ minHeight: '100dvh', background: T.bg, fontFamily: 'Inter, system-ui, sans-serif', transition: 'background 0.3s' }}>

      {/* ── Top bar ─── */}
      <PainelHeader
        current="pedidos"
        onRefresh={fetchOrders}
        onLogout={onLogout}
        rightExtra={
          <>
            {newOrders > 0 && (
              <span onClick={() => { setNewOrders(0); setTab('active'); }} style={{
                background: G.gold, color: G.dark, borderRadius: '99px',
                padding: '0.25rem 0.6rem', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer',
                animation: 'pulse 1.5s ease-in-out infinite',
              }}>
                +{newOrders} novo{newOrders > 1 ? 's' : ''}
              </span>
            )}
            <ThemeToggle dark={dark} onToggle={toggle} position="static" />
          </>
        }
      />

      {/* ── Stats bar ─── */}
      <div style={{ background: T.card, borderBottom: `1px solid ${T.border}`,
                    padding: '0.75rem 1.25rem', display: 'flex', gap: '1.5rem', overflowX: 'auto' }}>
        {[
          { label: 'Ativos agora',    value: String(active.length)       },
          { label: 'Prontos',         value: String(active.filter(o => o.status === 'ready').length) },
          { label: 'Faturado hoje',   value: fmt(todayRevenue)           },
          { label: 'Entregas hoje',   value: String(history.filter(o => o.status === 'delivered' &&
              new Date(o.created_at).toDateString() === new Date().toDateString()).length) },
        ].map(s => (
          <div key={s.label} style={{ flexShrink: 0 }}>
            <p style={{ color: T.muted, fontSize: '0.65rem', textTransform: 'uppercase',
                        letterSpacing: '0.1em', marginBottom: '0.1rem' }}>{s.label}</p>
            <p style={{ fontWeight: 700, fontSize: '1.1rem', color: T.text }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Tabs ─── */}
      <div style={{ background: T.card, borderBottom: `1px solid ${T.border}`,
                    display: 'flex', padding: '0 1.25rem' }}>
        {([['active','Ativos'] ,['history','Histórico']] as const).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '0.85rem 1rem', fontWeight: 600, fontSize: '0.85rem',
            color: tab === key ? T.text : T.muted,
            borderBottom: tab === key ? `2px solid ${G.gold}` : '2px solid transparent',
          }}>{label}{key === 'active' && active.length > 0 &&
            <span style={{ marginLeft: '0.4rem', background: G.gold, color: G.dark,
                           borderRadius: '99px', padding: '0.1rem 0.45rem',
                           fontSize: '0.65rem', fontWeight: 700 }}>{active.length}</span>}
          </button>
        ))}
      </div>

      {/* ── Content ─── */}
      <div style={{ padding: '1.25rem', maxWidth: '1100px', margin: '0 auto' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
            <Loader2 size={32} color={G.gold} style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        ) : tab === 'active' ? (
          active.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', color: G.muted }}>
              <p style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>◈</p>
              <p style={{ fontFamily: serif, fontSize: '1.1rem' }}>Nenhum pedido ativo no momento.</p>
              <p style={{ fontSize: '0.85rem', marginTop: '0.4rem' }}>Atualização automática a cada 10 segundos.</p>
            </div>
          ) : (
            /* Kanban columns */
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {cols.map(col => {
                const colOrders = active.filter(o => o.status === col.key);
                return (
                  <div key={col.key}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: col.color }} />
                      <p style={{ fontWeight: 700, fontSize: '0.82rem', color: G.dark,
                                  textTransform: 'uppercase', letterSpacing: '0.1em' }}>{col.label}</p>
                      <span style={{ background: col.color, color: '#fff', borderRadius: '99px',
                                     padding: '0.05rem 0.5rem', fontSize: '0.7rem', fontWeight: 700 }}>
                        {colOrders.length}
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {colOrders.length === 0 ? (
                        <div style={{ borderRadius: '1rem', border: `2px dashed ${G.border}`,
                                      padding: '2rem', textAlign: 'center', color: G.muted, fontSize: '0.82rem' }}>
                          Vazio
                        </div>
                      ) : colOrders.map(order => (
                        <OrderCard key={order.id} order={order}
                                   onStatusChange={updateStatus}
                                   onSendMessage={setMessageOrder}
                                   updating={updating === order.id}
                                   cardBg={T.card} cardBorder={T.border} itemBg={T.bg}
                                   dark={dark} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          /* History */
          history.length === 0 ? (
            <p style={{ textAlign: 'center', color: G.muted, padding: '3rem', fontSize: '0.9rem' }}>
              Nenhum pedido no histórico ainda.
            </p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
              {history.map(order => (
                <OrderCard key={order.id} order={order}
                           onStatusChange={updateStatus}
                           onSendMessage={setMessageOrder}
                           updating={updating === order.id}
                           cardBg={T.card} cardBorder={T.border} itemBg={T.bg}
                           dark={dark} />
              ))}
            </div>
          )
        )}
      </div>

      {pinModal && <ChangePinModal token={token} onClose={() => setPinModal(false)} />}
      {messageOrder && <SendMessageModal order={messageOrder} onClose={() => setMessageOrder(null)} />}

      <style>{`
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:.6; } }
      `}</style>
    </div>
  );
}

// ─── Root — handles auth state ────────────────────────────────────────────────
export default function Painel() {
  const [token,    setToken]    = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem('painel:token');
    if (!stored) { setChecking(false); return; }
    // validate stored token
    fetch(`/api/painel/auth?token=${stored}`)
      .then(r => r.json())
      .then((d: { valid: boolean }) => {
        if (d.valid) setToken(stored);
        else         sessionStorage.removeItem('painel:token');
      })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, []);

  function handleAuth(t: string) { setToken(t); }

  function handleLogout() {
    sessionStorage.removeItem('painel:token');
    setToken(null);
  }

  if (checking) return (
    <div style={{ minHeight: '100dvh', background: G.dark, display: 'flex',
                  alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 size={32} color={G.gold} style={{ animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!token) return <PinGate onAuth={handleAuth} />;
  return <Dashboard token={token} onLogout={handleLogout} />;
}
