'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Pencil, Trash2, X, Loader2, CheckCircle2, MessageSquare, ExternalLink } from 'lucide-react';
import PainelHeader from './PainelHeader';
import { useTheme } from '../lib/useTheme';

const serif = 'Playfair Display, Georgia, serif';
const sans  = 'Inter, system-ui, sans-serif';

interface Reward { id:string; seasonName:string; recipeTitle:string; recipeDescription:string; imageUrl?:string; isActive:boolean; createdAt:string; }
interface Notification { phone:string; name:string; trigger:string; message:string; ts:string; sent:boolean; }

const TRIGGER_LABELS: Record<string, string> = {
  welcome:'Boas-vindas', halfway:'5/10 selos', one_away:'9/10 selos', reward_unlocked:'Recompensa!'
};

// ─── Reward Modal ────────────────────────────────────────────────────────────
function RewardModal({ reward, onSave, onClose }: { reward:Partial<Reward>|null; onSave:(r:Partial<Reward>)=>void; onClose:()=>void }) {
  const { dark, T } = useTheme();
  const G = {
    gold:'#C8941A', green:'#6B8C3E', terra:'#8B4030',
    dark:'#14100C', card: T.card, card2: dark ? '#211808' : '#F5E6C8',
    text: T.text, muted: T.muted, border: T.border, bg: T.bg,
  };
  const [form, setForm] = useState({ seasonName:reward?.seasonName??'', recipeTitle:reward?.recipeTitle??'', recipeDescription:reward?.recipeDescription??'', imageUrl:reward?.imageUrl??'', isActive:reward?.isActive??false });
  const inp: React.CSSProperties = { width:'100%', padding:'0.7rem 0.9rem', borderRadius:'0.65rem', boxSizing:'border-box', background:'rgba(255,255,255,0.05)', border:`1px solid ${G.border}`, color:G.text, fontSize:'0.88rem', fontFamily:sans, outline:'none' };
  const lbl: React.CSSProperties = { display:'block', color:G.muted, fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:'0.35rem' };

  return (
    <>
      <div onClick={onClose} style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.65)',zIndex:80 }} />
      <div style={{ position:'fixed',top:'50%',left:'50%',transform:'translate(-50%,-50%)', width:'min(540px,calc(100vw - 2rem))',maxHeight:'92dvh',overflowY:'auto', background:G.card,borderRadius:'1.5rem',zIndex:81,border:`1px solid ${G.border}`,boxShadow:'0 32px 80px rgba(0,0,0,0.5)' }}>
        <div style={{ padding:'1.25rem 1.5rem',borderBottom:`1px solid ${G.border}`,display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,background:G.card }}>
          <p style={{ fontFamily:serif,fontSize:'1rem',fontWeight:700,color:G.text }}>{reward?.id ? 'Editar receita' : 'Nova receita sazonal'}</p>
          <button onClick={onClose} style={{ background:'none',border:'none',cursor:'pointer' }}><X size={17} color={G.muted}/></button>
        </div>
        <div style={{ padding:'1.5rem',display:'flex',flexDirection:'column',gap:'1rem' }}>
          <div><label style={lbl}>Temporada</label><input value={form.seasonName} onChange={e=>setForm(p=>({...p,seasonName:e.target.value}))} placeholder="Ex: Outono 2026" style={inp}/></div>
          <div><label style={lbl}>Nome da receita</label><input value={form.recipeTitle} onChange={e=>setForm(p=>({...p,recipeTitle:e.target.value}))} placeholder="Ex: Wrap Flamboyant" style={inp}/></div>
          <div><label style={lbl}>Descrição / Ingredientes surpresa</label><textarea rows={4} value={form.recipeDescription} onChange={e=>setForm(p=>({...p,recipeDescription:e.target.value}))} placeholder="Descreva a receita, ingredientes especiais, modo de preparo..." style={{ ...inp, resize:'vertical' }}/></div>
          <div><label style={lbl}>Imagem (URL opcional)</label><input value={form.imageUrl} onChange={e=>setForm(p=>({...p,imageUrl:e.target.value}))} placeholder="https://..." style={inp}/></div>
          <label style={{ display:'flex',alignItems:'center',gap:'0.75rem',cursor:'pointer' }}>
            <input type="checkbox" checked={form.isActive} onChange={e=>setForm(p=>({...p,isActive:e.target.checked}))} style={{ width:'16px',height:'16px',accentColor:G.gold }}/>
            <span style={{ color:G.text,fontSize:'0.88rem' }}>Ativar como recompensa atual</span>
          </label>
          {form.isActive && <p style={{ color:'#facc15',fontSize:'0.75rem',background:'rgba(250,204,21,0.08)',padding:'0.5rem 0.75rem',borderRadius:'0.5rem' }}>Ativar substituirá a recompensa anterior.</p>}
          <button onClick={() => { if(form.recipeTitle.trim()) onSave({ ...reward, ...form }); }} style={{
            padding:'0.85rem',background:G.gold,color:G.dark,border:'none',borderRadius:'99px',fontWeight:700,fontSize:'0.9rem',cursor:'pointer',fontFamily:sans,
          }}>Salvar receita</button>
        </div>
      </div>
    </>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────
export default function PainelFidelidade() {
  const { dark, T } = useTheme();
  const G = {
    gold:'#C8941A', green:'#6B8C3E', terra:'#8B4030',
    dark:'#14100C', card: T.card, card2: dark ? '#211808' : '#F5E6C8',
    text: T.text, muted: T.muted, border: T.border, bg: T.bg,
  };
  const [rewards,  setRewards]  = useState<Reward[]>([]);
  const [notifs,   setNotifs]   = useState<Notification[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [editR,    setEditR]    = useState<Partial<Reward>|null|undefined>(undefined);
  const [authOk,   setAuthOk]   = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('painel:token');
    if (!token) { window.location.href = '/painel'; return; }
    fetch(`/api/painel/auth?token=${token}`).then(r=>r.json()).then((d:{valid:boolean})=>{ if(d.valid) setAuthOk(true); else window.location.href='/painel'; }).catch(()=>{ window.location.href='/painel'; });
  }, []);

  const load = useCallback(async () => {
    const [rRes, nRes] = await Promise.all([fetch('/api/rewards'), fetch('/api/notifications')]);
    const rewards = await rRes.json() as Reward[];
    const nQueue  = nRes.ok ? await nRes.json() as Notification[] : [];
    setRewards(rewards);
    setNotifs(nQueue.filter(n => !n.sent));
    setLoading(false);
  }, []);

  useEffect(() => { if (authOk) load(); }, [authOk, load]);

  async function saveReward(data: Partial<Reward>) {
    await fetch('/api/rewards', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) });
    await load();
    setEditR(undefined);
  }

  async function deleteReward(id: string) {
    if (!confirm('Remover esta receita?')) return;
    await fetch(`/api/rewards?id=${id}`, { method:'DELETE' });
    await load();
  }

  async function markSent(idx: number) {
    const updated = notifs.map((n,i) => i===idx ? { ...n, sent:true } : n);
    setNotifs(updated.filter(n=>!n.sent));
    // persist back (merge with unsent in queue)
    await fetch('/api/notifications', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ action:'mark_sent', index:idx }) });
  }

  if (!authOk || loading) return (
    <div style={{ minHeight:'100dvh',background:G.bg,display:'flex',alignItems:'center',justifyContent:'center' }}>
      <Loader2 size={28} color={G.gold} style={{ animation:'spin 1s linear infinite' }}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ minHeight:'100dvh',background:G.bg,fontFamily:sans,color:G.text }}>
      <PainelHeader
        current="fidelidade"
        title="Fidelidade"
        onRefresh={load}
        rightExtra={
          <button onClick={() => setEditR({})} style={{ display:'flex',alignItems:'center',gap:'0.4rem',padding:'0.45rem 0.85rem',borderRadius:'99px',background:G.gold,color:G.dark,border:'none',cursor:'pointer',fontFamily:sans,fontWeight:700,fontSize:'0.78rem' }}>
            <Plus size={14}/> Nova receita
          </button>
        }
      />

      <div style={{ maxWidth:'800px',margin:'0 auto',padding:'1.5rem 1.25rem', display:'flex', flexDirection:'column', gap:'2rem' }}>

        {/* ── Seasonal rewards ── */}
        <section>
          <h2 style={{ fontFamily:serif,fontSize:'1.1rem',fontWeight:700,color:G.text,marginBottom:'1rem' }}>Receitas Sazonais</h2>
          {rewards.length === 0 ? (
            <div style={{ borderRadius:'1rem',border:`1px dashed ${G.border}`,padding:'2.5rem',textAlign:'center',color:G.muted }}>
              <Gift size={28} style={{ margin:'0 auto 0.75rem',display:'block',color:G.muted }}/>
              <p style={{ fontSize:'0.88rem' }}>Nenhuma receita cadastrada ainda.</p>
              <button onClick={()=>setEditR({})} style={{ marginTop:'1rem',padding:'0.6rem 1.25rem',borderRadius:'99px',background:G.gold,color:G.dark,border:'none',cursor:'pointer',fontFamily:sans,fontWeight:600 }}>Criar primeira receita</button>
            </div>
          ) : (
            <div style={{ display:'flex',flexDirection:'column',gap:'0.75rem' }}>
              {rewards.map(r => (
                <div key={r.id} style={{ background:G.card2,borderRadius:'1rem',border:`1px solid ${r.isActive ? G.gold : G.border}`,padding:'1.25rem',display:'flex',alignItems:'center',gap:'1rem' }}>
                  {r.isActive && <span style={{ flexShrink:0,background:G.gold,color:G.dark,borderRadius:'99px',padding:'0.2rem 0.65rem',fontSize:'0.65rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase' }}>Ativa</span>}
                  <div style={{ flex:1 }}>
                    <p style={{ fontWeight:600,fontSize:'0.9rem',color:G.text }}>{r.recipeTitle}</p>
                    <p style={{ color:G.muted,fontSize:'0.75rem',marginTop:'0.1rem' }}>{r.seasonName}</p>
                  </div>
                  <div style={{ display:'flex',gap:'0.3rem' }}>
                    <button onClick={()=>setEditR(r)} style={{ background:'none',border:'none',cursor:'pointer',padding:'5px',color:G.muted }}><Pencil size={14}/></button>
                    <button onClick={()=>deleteReward(r.id)} style={{ background:'none',border:'none',cursor:'pointer',padding:'5px',color:'#f87171' }}><Trash2 size={14}/></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Notification queue ── */}
        <section>
          <div style={{ display:'flex',alignItems:'center',gap:'0.75rem',marginBottom:'1rem' }}>
            <h2 style={{ fontFamily:serif,fontSize:'1.1rem',fontWeight:700,color:G.text }}>Notificações WhatsApp</h2>
            {notifs.length > 0 && <span style={{ background:G.gold,color:G.dark,borderRadius:'99px',padding:'0.1rem 0.55rem',fontSize:'0.7rem',fontWeight:700 }}>{notifs.length}</span>}
          </div>

          {notifs.length === 0 ? (
            <div style={{ borderRadius:'1rem',border:`1px solid ${G.border}`,padding:'1.5rem',textAlign:'center',color:G.muted,fontSize:'0.85rem' }}>
              <CheckCircle2 size={22} style={{ margin:'0 auto 0.5rem',display:'block',color:G.green }}/>
              Nenhuma notificação pendente.
            </div>
          ) : notifs.map((n, idx) => (
            <div key={idx} style={{ background:G.card2,borderRadius:'1rem',border:`1px solid ${G.border}`,padding:'1.25rem',marginBottom:'0.75rem' }}>
              <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'0.6rem' }}>
                <div>
                  <span style={{ background:'rgba(200,148,26,0.15)',color:G.gold,borderRadius:'99px',padding:'0.15rem 0.6rem',fontSize:'0.65rem',fontWeight:700,marginRight:'0.5rem' }}>
                    {TRIGGER_LABELS[n.trigger] ?? n.trigger}
                  </span>
                  <span style={{ color:G.text,fontWeight:600,fontSize:'0.88rem' }}>{n.name}</span>
                  <span style={{ color:G.muted,fontSize:'0.75rem' }}> · {n.phone}</span>
                </div>
                <span style={{ color:G.muted,fontSize:'0.7rem' }}>{new Date(n.ts).toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})}</span>
              </div>
              <p style={{ color:G.muted,fontSize:'0.82rem',lineHeight:1.6,marginBottom:'0.75rem',background:'rgba(255,255,255,0.03)',borderRadius:'0.5rem',padding:'0.6rem 0.75rem' }}>
                {n.message}
              </p>
              <div style={{ display:'flex',gap:'0.5rem' }}>
                <a href={`https://wa.me/55${n.phone.replace(/\D/g,'')}?text=${encodeURIComponent(n.message)}`}
                   target="_blank" rel="noopener noreferrer"
                   style={{ flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:'0.4rem',padding:'0.65rem',background:'#25D366',color:'#fff',borderRadius:'99px',fontWeight:600,fontSize:'0.82rem',textDecoration:'none',fontFamily:sans }}>
                  <ExternalLink size={13}/> Enviar no WhatsApp
                </a>
                <button onClick={()=>markSent(idx)} style={{ padding:'0.65rem 1rem',background:'none',border:`1px solid ${G.border}`,borderRadius:'99px',color:G.muted,cursor:'pointer',fontFamily:sans,fontSize:'0.82rem',display:'flex',alignItems:'center',gap:'0.3rem' }}>
                  <CheckCircle2 size={13}/> Marcar enviado
                </button>
              </div>
            </div>
          ))}
        </section>
      </div>

      {editR !== undefined && <RewardModal reward={editR} onSave={saveReward} onClose={()=>setEditR(undefined)}/>}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

function Gift({ size, style }: { size:number; style?:React.CSSProperties }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={style}><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>;
}
