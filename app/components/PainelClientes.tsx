'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, X, Save, Loader2, Users, TrendingUp, Star, Clock } from 'lucide-react';
import PainelHeader from './PainelHeader';

// ─── Tokens ───────────────────────────────────────────────────────────────────
const G = {
  gold: '#C8941A', goldSoft: '#E6B84A',
  green: '#6B8C3E', terra: '#8B4030',
  dark: '#14100C', card: '#1A1208', card2: '#211808',
  parch: '#FAF5E8', muted: '#7A6A54',
  text: '#E8D9BA', border: 'rgba(200,148,26,0.18)',
  bg: '#0E0C08',
};
const serif = 'Playfair Display, Georgia, serif';
const sans  = 'Inter, system-ui, sans-serif';
const fmt   = (n: number) => `R$ ${n.toFixed(2).replace('.', ',')}`;

// ─── Types ────────────────────────────────────────────────────────────────────
interface Customer {
  phone:      string;
  name:       string;
  orderCount: number;
  totalSpent: number;
  firstOrder: string;
  lastOrder:  string;
  orders:     string[];
  notes:      string;
  tags:       string[];
}

// ─── Tag options ──────────────────────────────────────────────────────────────
const TAG_OPTIONS = [
  { value: 'fiel',              label: 'Cliente fiel',      color: G.gold   },
  { value: 'vegano',            label: 'Vegano',            color: G.green  },
  { value: 'vegetariano',       label: 'Vegetariano',       color: G.green  },
  { value: 'sem-gluten',        label: 'Sem glúten',        color: '#8B6A2E'},
  { value: 'restrição',         label: 'Restrição alim.',   color: G.terra  },
  { value: 'delivery',          label: 'Prefere entrega',   color: '#5B6A8B'},
  { value: 'retirada',          label: 'Prefere retirada',  color: '#6B5B8B'},
  { value: 'indicador',         label: 'Indicador',         color: G.goldSoft},
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function timeAgo(dateStr: string) {
  const mins = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
  if (mins < 60)   return `${mins}min atrás`;
  if (mins < 1440) return `${Math.floor(mins/60)}h atrás`;
  return `${Math.floor(mins/1440)}d atrás`;
}

function initials(name: string) {
  return name.split(' ').slice(0,2).map(w => w[0]).join('').toUpperCase();
}

function avatarColor(phone: string) {
  const colors = [G.gold, G.green, G.terra, '#5B6A8B', '#8B6A2E', '#6B5B8B'];
  const sum    = phone.split('').reduce((a,c) => a + c.charCodeAt(0), 0);
  return colors[sum % colors.length];
}

// ─── Customer Detail Panel ────────────────────────────────────────────────────
function CustomerDetail({ customer, onClose, onSave }: {
  customer: Customer;
  onClose: () => void;
  onSave:  (phone: string, notes: string, tags: string[]) => Promise<void>;
}) {
  const [notes, setNotes] = useState(customer.notes ?? '');
  const [tags,  setTags]  = useState<string[]>(customer.tags ?? []);
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);

  const toggleTag = (v: string) =>
    setTags(prev => prev.includes(v) ? prev.filter(t => t !== v) : [...prev, v]);

  async function save() {
    setSaving(true);
    await onSave(customer.phone, notes, tags);
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const color = avatarColor(customer.phone);

  return (
    <>
      <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:70, backdropFilter:'blur(4px)' }} />
      <div style={{
        position:'fixed', top:0, right:0, bottom:0, width:'min(460px,100vw)',
        background: G.card, zIndex:71, display:'flex', flexDirection:'column',
        borderLeft:`1px solid ${G.border}`, overflowY:'auto',
      }}>
        {/* header */}
        <div style={{ padding:'1.25rem 1.5rem', borderBottom:`1px solid ${G.border}`,
                      display:'flex', alignItems:'center', justifyContent:'space-between',
                      position:'sticky', top:0, background: G.card, zIndex:1 }}>
          <p style={{ fontFamily:serif, fontSize:'1rem', fontWeight:700, color:G.text }}>Perfil do cliente</p>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer' }}>
            <X size={17} color={G.muted} />
          </button>
        </div>

        <div style={{ padding:'1.5rem', display:'flex', flexDirection:'column', gap:'1.5rem' }}>
          {/* avatar + identity */}
          <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
            <div style={{ width:'3.5rem', height:'3.5rem', borderRadius:'50%', background: color,
                          display:'flex', alignItems:'center', justifyContent:'center',
                          fontWeight:700, fontSize:'1.1rem', color:'#fff', flexShrink:0 }}>
              {initials(customer.name)}
            </div>
            <div>
              <p style={{ fontFamily:serif, fontSize:'1.15rem', fontWeight:700, color:G.text }}>{customer.name}</p>
              <p style={{ color:G.muted, fontSize:'0.82rem', marginTop:'0.15rem' }}>
                {customer.phone.replace(/(\d{2})(\d{2})(\d{4,5})(\d{4})/, '($1) $2 $3-$4')}
              </p>
            </div>
          </div>

          {/* stats */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
            {[
              { label:'Pedidos',       value: String(customer.orderCount) },
              { label:'Total gasto',   value: fmt(customer.totalSpent)    },
              { label:'Ticket médio',  value: fmt(customer.totalSpent / Math.max(customer.orderCount, 1)) },
              { label:'Último pedido', value: timeAgo(customer.lastOrder) },
            ].map(s => (
              <div key={s.label} style={{ background:'rgba(255,255,255,0.04)', borderRadius:'0.75rem',
                                          border:`1px solid ${G.border}`, padding:'0.85rem 1rem' }}>
                <p style={{ color:G.muted, fontSize:'0.65rem', textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:'0.25rem' }}>{s.label}</p>
                <p style={{ color:G.gold, fontWeight:700, fontSize:'1rem' }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* order history */}
          <div>
            <p style={{ color:G.muted, fontSize:'0.65rem', fontWeight:700, textTransform:'uppercase',
                        letterSpacing:'0.15em', marginBottom:'0.75rem' }}>
              Histórico de pedidos
            </p>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.4rem' }}>
              {customer.orders.length === 0 ? (
                <p style={{ color:G.muted, fontSize:'0.82rem' }}>Nenhum pedido registrado.</p>
              ) : customer.orders.map(id => (
                <div key={id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
                                        padding:'0.6rem 0.75rem', borderRadius:'0.5rem',
                                        background:'rgba(255,255,255,0.03)', border:`1px solid ${G.border}` }}>
                  <span style={{ fontFamily:serif, fontSize:'0.82rem', color:G.text }}>{id}</span>
                </div>
              ))}
            </div>
          </div>

          {/* tags */}
          <div>
            <p style={{ color:G.muted, fontSize:'0.65rem', fontWeight:700, textTransform:'uppercase',
                        letterSpacing:'0.15em', marginBottom:'0.75rem' }}>
              Tags do cliente
            </p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem' }}>
              {TAG_OPTIONS.map(tag => {
                const active = tags.includes(tag.value);
                return (
                  <button key={tag.value} onClick={() => toggleTag(tag.value)} style={{
                    padding:'0.35rem 0.85rem', borderRadius:'99px', cursor:'pointer',
                    fontSize:'0.78rem', fontWeight:600, fontFamily:sans, transition:'all 0.15s',
                    background: active ? tag.color : 'transparent',
                    color:      active ? '#fff'    : G.muted,
                    border:     `1px solid ${active ? tag.color : G.border}`,
                  }}>
                    {tag.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* notes */}
          <div>
            <p style={{ color:G.muted, fontSize:'0.65rem', fontWeight:700, textTransform:'uppercase',
                        letterSpacing:'0.15em', marginBottom:'0.75rem' }}>
              Notas internas
            </p>
            <textarea
              value={notes} onChange={e => setNotes(e.target.value)} rows={4}
              placeholder="Preferências, observações, detalhes para personalizar o atendimento..."
              style={{ width:'100%', padding:'0.85rem 1rem', borderRadius:'0.75rem', boxSizing:'border-box',
                       background:'rgba(255,255,255,0.05)', border:`1px solid ${G.border}`,
                       color:G.text, fontSize:'0.88rem', fontFamily:sans, outline:'none', resize:'vertical' }}
            />
          </div>

          {/* save */}
          <button onClick={save} disabled={saving} style={{
            padding:'0.85rem', background: saved ? G.green : G.gold, color:G.dark, border:'none',
            borderRadius:'99px', fontWeight:700, fontSize:'0.9rem', cursor:'pointer', fontFamily:sans,
            display:'flex', alignItems:'center', justifyContent:'center', gap:'0.4rem', transition:'background 0.3s',
          }}>
            {saving ? <><Loader2 size={15} style={{ animation:'spin 1s linear infinite' }} /> Salvando...</>
                    : saved  ? '✓ Salvo!'
                    : <><Save size={15} /> Salvar alterações</>}
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Customer Card ────────────────────────────────────────────────────────────
function CustomerCard({ c, onClick }: { c: Customer; onClick: () => void }) {
  const color = avatarColor(c.phone);
  const isVip = c.orderCount >= 3;

  return (
    <button onClick={onClick} style={{
      width:'100%', textAlign:'left', background: G.card2, borderRadius:'1rem',
      border:`1px solid ${G.border}`, padding:'1.1rem 1.25rem', cursor:'pointer',
      display:'flex', alignItems:'center', gap:'1rem', transition:'border-color 0.15s',
      fontFamily:sans,
    }}
    onMouseEnter={e => (e.currentTarget.style.borderColor = G.gold)}
    onMouseLeave={e => (e.currentTarget.style.borderColor = G.border)}>

      {/* avatar */}
      <div style={{ width:'2.8rem', height:'2.8rem', borderRadius:'50%', background:color, flexShrink:0,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontWeight:700, fontSize:'0.9rem', color:'#fff', position:'relative' }}>
        {initials(c.name)}
        {isVip && (
          <span style={{ position:'absolute', bottom:'-2px', right:'-2px', background:G.gold,
                         borderRadius:'50%', width:'1rem', height:'1rem',
                         display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.55rem' }}>
            ★
          </span>
        )}
      </div>

      {/* info */}
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.2rem' }}>
          <p style={{ fontWeight:600, fontSize:'0.92rem', color:G.text, margin:0 }}>{c.name}</p>
          {c.tags.slice(0,2).map(t => {
            const cfg = TAG_OPTIONS.find(o => o.value === t);
            return cfg ? (
              <span key={t} style={{ fontSize:'0.58rem', padding:'0.1rem 0.45rem', borderRadius:'99px',
                                     background:`${cfg.color}25`, color:cfg.color, fontWeight:700,
                                     letterSpacing:'0.08em', textTransform:'uppercase' }}>
                {cfg.label}
              </span>
            ) : null;
          })}
        </div>
        <p style={{ color:G.muted, fontSize:'0.78rem' }}>
          {c.orderCount} pedido{c.orderCount !== 1 ? 's' : ''} · {fmt(c.totalSpent)}
        </p>
      </div>

      {/* last order */}
      <div style={{ textAlign:'right', flexShrink:0 }}>
        <p style={{ color:G.gold, fontSize:'0.75rem', fontWeight:600 }}>{fmt(c.totalSpent / Math.max(c.orderCount,1))}</p>
        <p style={{ color:G.muted, fontSize:'0.7rem', marginTop:'0.1rem', display:'flex', alignItems:'center', gap:'0.2rem', justifyContent:'flex-end' }}>
          <Clock size={10} />{timeAgo(c.lastOrder)}
        </p>
      </div>
    </button>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function PainelClientes() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [query,     setQuery]     = useState('');
  const [selected,  setSelected]  = useState<Customer | null>(null);
  const [authOk,    setAuthOk]    = useState(false);

  // auth check
  useEffect(() => {
    const token = sessionStorage.getItem('painel:token');
    if (!token) { window.location.href = '/painel'; return; }
    fetch(`/api/painel/auth?token=${token}`)
      .then(r => r.json())
      .then((d: { valid: boolean }) => {
        if (d.valid) setAuthOk(true);
        else         window.location.href = '/painel';
      })
      .catch(() => { window.location.href = '/painel'; });
  }, []);

  const load = useCallback(async () => {
    try {
      const res  = await fetch('/api/customers');
      const data = await res.json() as Customer[];
      setCustomers(data);
    } catch { /* keep last */ }
    finally  { setLoading(false); }
  }, []);

  useEffect(() => { if (authOk) load(); }, [authOk, load]);

  async function saveCustomer(phone: string, notes: string, tags: string[]) {
    await fetch(`/api/customers/${phone}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes, tags }),
    });
    setCustomers(prev => prev.map(c => c.phone === phone ? { ...c, notes, tags } : c));
    if (selected?.phone === phone) setSelected(s => s ? { ...s, notes, tags } : s);
  }

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.phone.includes(query.replace(/\D/g,''))
  );

  // stats
  const totalRevenue = customers.reduce((s,c) => s+c.totalSpent, 0);
  const repeatCount  = customers.filter(c => c.orderCount >= 2).length;
  const thisWeek     = customers.filter(c =>
    Date.now() - new Date(c.lastOrder).getTime() < 7*24*60*60*1000
  ).length;

  if (!authOk) return (
    <div style={{ minHeight:'100dvh', background:G.bg, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <Loader2 size={28} color={G.gold} style={{ animation:'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ minHeight:'100dvh', background:G.bg, fontFamily:sans, color:G.text }}>

      {/* header */}
      <PainelHeader
        current="clientes"
        title="Clientes"
        badge={
          <span style={{ color:G.muted, fontSize:'0.75rem', background:'rgba(255,255,255,0.06)', padding:'0.15rem 0.5rem', borderRadius:'99px', border:`1px solid ${G.border}` }}>
            {customers.length}
          </span>
        }
        onRefresh={load}
      />

      <div style={{ maxWidth:'720px', margin:'0 auto', padding:'1.5rem 1.25rem' }}>

        {/* stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:'0.75rem', marginBottom:'1.5rem' }}>
          {[
            { icon: <Users size={15}/>,      label:'Total',          value: String(customers.length)         },
            { icon: <Star size={15}/>,        label:'Recorrentes',    value: String(repeatCount)              },
            { icon: <Clock size={15}/>,       label:'Ativos esta semana', value: String(thisWeek)             },
            { icon: <TrendingUp size={15}/>,  label:'Receita total',  value: fmt(totalRevenue)                },
          ].map(s => (
            <div key={s.label} style={{ background:G.card2, borderRadius:'0.85rem', border:`1px solid ${G.border}`,
                                         padding:'0.9rem 1rem' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.4rem', color:G.muted,
                            fontSize:'0.65rem', textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:'0.35rem' }}>
                {s.icon}{s.label}
              </div>
              <p style={{ color:G.gold, fontWeight:700, fontSize:'1.05rem' }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* search */}
        <div style={{ position:'relative', marginBottom:'1.25rem' }}>
          <Search size={15} color={G.muted} style={{ position:'absolute', left:'0.9rem', top:'50%', transform:'translateY(-50%)' }} />
          <input
            value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Buscar por nome ou WhatsApp..."
            style={{ width:'100%', padding:'0.75rem 1rem 0.75rem 2.4rem', borderRadius:'0.75rem', boxSizing:'border-box',
                     background:G.card2, border:`1px solid ${G.border}`, color:G.text,
                     fontSize:'0.88rem', fontFamily:sans, outline:'none' }}
          />
          {query && (
            <button onClick={() => setQuery('')} style={{ position:'absolute', right:'0.75rem', top:'50%',
                                                           transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer' }}>
              <X size={14} color={G.muted} />
            </button>
          )}
        </div>

        {/* list */}
        {loading ? (
          <div style={{ display:'flex', justifyContent:'center', padding:'4rem' }}>
            <Loader2 size={28} color={G.gold} style={{ animation:'spin 1s linear infinite' }} />
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'4rem 1rem', color:G.muted }}>
            <p style={{ fontSize:'2rem', marginBottom:'0.75rem' }}>◈</p>
            <p style={{ fontFamily:serif, fontSize:'1rem' }}>
              {query ? 'Nenhum cliente encontrado.' : 'Nenhum cliente ainda.\nOs perfis são criados automaticamente a cada pedido.'}
            </p>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem' }}>
            {filtered.map(c => (
              <CustomerCard key={c.phone} c={c} onClick={() => setSelected(c)} />
            ))}
          </div>
        )}
      </div>

      {selected && (
        <CustomerDetail
          customer={selected}
          onClose={() => setSelected(null)}
          onSave={saveCustomer}
        />
      )}

      <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
    </div>
  );
}
