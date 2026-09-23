'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  BookOpen,
  Gift,
  Users,
  Settings,
  LogOut,
  X,
  CheckCircle2,
  RefreshCw,
  MessageCircle,
} from 'lucide-react';

const G = {
  gold:     '#C8941A',
  goldDim:  'rgba(200,148,26,0.15)',
  green:    '#6B8C3E',
  dark:     '#14100C',
  card:     '#1A1208',
  text:     '#E8D9BA',
  muted:    '#7A6A54',
  border:   'rgba(200,148,26,0.18)',
  parch:    '#FAF5E8',
};
const serif = 'Playfair Display, Georgia, serif';
const sans  = 'Inter, system-ui, sans-serif';

// ─── Change PIN Modal ─────────────────────────────────────────────────────────
function ChangePinModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ current: '', next: '', confirm: '' });
  const [msg,  setMsg]  = useState('');
  const [ok,   setOk]   = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (form.next !== form.confirm) { setMsg('Os PINs não coincidem.'); return; }
    if (form.next.length < 4) { setMsg('O novo PIN deve ter pelo menos 4 dígitos.'); return; }
    setBusy(true); setMsg('');
    try {
      const res  = await fetch('/api/painel/auth', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPin: form.current, newPin: form.next }),
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
    fontFamily: sans, outline: 'none', color: G.dark,
  };

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 90, backdropFilter: 'blur(4px)' }} />
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
                    width: 'min(380px, calc(100vw - 2rem))', background: G.parch,
                    borderRadius: '1.5rem', zIndex: 91, padding: '1.75rem',
                    boxShadow: '0 24px 80px rgba(0,0,0,0.45)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <p style={{ fontFamily: serif, fontSize: '1.15rem', fontWeight: 700, color: G.dark }}>Alterar PIN do Painel</p>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
            <X size={18} color={G.dark} />
          </button>
        </div>
        {ok ? (
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <CheckCircle2 size={40} color={G.green} style={{ margin: '0 auto 0.75rem', display: 'block' }} />
            <p style={{ color: G.dark, fontWeight: 700 }}>PIN alterado com sucesso!</p>
            <button onClick={onClose} style={{ marginTop: '1.25rem', padding: '0.65rem 1.75rem',
                                               background: G.dark, color: G.parch, border: 'none',
                                               borderRadius: '99px', cursor: 'pointer', fontWeight: 600 }}>
              Fechar
            </button>
          </div>
        ) : (
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {[['current','PIN atual'],['next','Novo PIN (mínimo 4 dígitos)'],['confirm','Confirmar novo PIN']].map(([key, label]) => (
              <div key={key}>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: G.dark,
                                letterSpacing: '0.05em', marginBottom: '0.3rem' }}>{label}</label>
                <input type="password" inputMode="numeric" maxLength={6} style={inp}
                       value={form[key as keyof typeof form]}
                       onChange={e => setForm(p => ({ ...p, [key]: e.target.value.replace(/\D/g,'') }))} />
              </div>
            ))}
            {msg && <p style={{ color: '#b91c1c', fontSize: '0.8rem', margin: 0 }}>{msg}</p>}
            <button type="submit" disabled={busy} style={{
              padding: '0.8rem', borderRadius: '99px', background: G.dark, color: G.parch,
              border: 'none', fontWeight: 700, cursor: 'pointer', marginTop: '0.5rem', fontFamily: sans,
            }}>
              {busy ? 'Salvando...' : 'Salvar PIN'}
            </button>
          </form>
        )}
      </div>
    </>
  );
}

// ─── Header Component ────────────────────────────────────────────────────────
export interface PainelHeaderProps {
  current: 'pedidos' | 'cardapio' | 'fidelidade' | 'clientes' | 'whatsapp';
  title?: string;
  badge?: React.ReactNode;
  rightExtra?: React.ReactNode;
  onRefresh?: () => void;
  onLogout?: () => void;
}

export default function PainelHeader({
  current,
  title,
  badge,
  rightExtra,
  onRefresh,
  onLogout,
}: PainelHeaderProps) {
  const [pinModal, setPinModal] = useState(false);

  function handleLogout() {
    if (onLogout) {
      onLogout();
    } else {
      sessionStorage.removeItem('painel:token');
      window.location.href = '/painel';
    }
  }

  const navItems = [
    { id: 'pedidos',    href: '/painel',            label: 'Pedidos',    icon: ShoppingBag },
    { id: 'cardapio',   href: '/painel/cardapio',   label: 'Cardápio',   icon: BookOpen    },
    { id: 'fidelidade', href: '/painel/fidelidade', label: 'Fidelidade', icon: Gift        },
    { id: 'clientes',   href: '/painel/clientes',   label: 'Clientes',   icon: Users       },
    { id: 'whatsapp',   href: '/painel/whatsapp',   label: 'WhatsApp',   icon: MessageCircle },
  ] as const;

  return (
    <>
      <header style={{
        background: G.dark,
        borderBottom: `1px solid ${G.border}`,
        padding: '0 1rem',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}>
        {/* Left: Brand + Active page tag */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <Link href="/painel" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/nefertari-logo-golden.png" alt="Nefertari" style={{ height: '32px', width: '32px', objectFit: 'contain' }} />
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
              <span style={{ fontFamily: serif, fontWeight: 700, fontSize: '1.05rem', color: G.text, letterSpacing: '0.01em' }}>
                Nefertari
              </span>
              <span style={{ color: G.gold, fontSize: '0.55rem', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
                Painel da Cozinha
              </span>
            </div>
          </Link>

          {title && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderLeft: `1px solid ${G.border}`, paddingLeft: '0.85rem' }}>
              <span style={{ fontFamily: serif, fontSize: '0.92rem', fontWeight: 600, color: G.gold }}>
                {title}
              </span>
              {badge}
            </div>
          )}
        </div>

        {/* Right: Actions & Unified Navigation Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          {rightExtra}

          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              title="Atualizar dados"
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: G.muted, padding: '7px', display: 'flex', alignItems: 'center',
                borderRadius: '0.5rem', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = G.text; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = G.muted; e.currentTarget.style.background = 'transparent'; }}
            >
              <RefreshCw size={16} />
            </button>
          )}

          {/* Navigation links with icons */}
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = current === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                title={item.label}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '6px 9px',
                  borderRadius: '0.55rem',
                  textDecoration: 'none',
                  fontSize: '0.78rem',
                  fontWeight: isActive ? 700 : 500,
                  fontFamily: sans,
                  color: isActive ? G.gold : G.muted,
                  background: isActive ? G.goldDim : 'transparent',
                  border: `1px solid ${isActive ? `${G.gold}40` : 'transparent'}`,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.color = G.text;
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.color = G.muted;
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <Icon size={16} />
                <span className="hidden md:inline">{item.label}</span>
              </Link>
            );
          })}

          {/* Settings / Change PIN */}
          <button
            type="button"
            onClick={() => setPinModal(true)}
            title="Alterar PIN"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: G.muted, padding: '7px', display: 'flex', alignItems: 'center',
              borderRadius: '0.5rem', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = G.text; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = G.muted; e.currentTarget.style.background = 'transparent'; }}
          >
            <Settings size={16} />
          </button>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            title="Sair do painel"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: G.muted, padding: '7px', display: 'flex', alignItems: 'center',
              borderRadius: '0.5rem', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(248,113,113,0.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = G.muted; e.currentTarget.style.background = 'transparent'; }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {pinModal && <ChangePinModal onClose={() => setPinModal(false)} />}
    </>
  );
}
