'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Pencil, Trash2, X, Save, Loader2, ToggleLeft, ToggleRight, Image as ImageIcon } from 'lucide-react';

// ─── Tokens ───────────────────────────────────────────────────────────────────
const G = {
  gold:'#C8941A', green:'#6B8C3E', terra:'#8B4030',
  dark:'#14100C', card:'#1A1208', card2:'#211808',
  text:'#E8D9BA', muted:'#7A6A54', border:'rgba(200,148,26,0.18)',
  bg:'#0E0C08',
};
const serif = 'Playfair Display, Georgia, serif';
const sans  = 'Inter, system-ui, sans-serif';
const fmt   = (n: number) => `R$ ${n.toFixed(2).replace('.', ',')}`;

// ─── Types ────────────────────────────────────────────────────────────────────
interface MenuItem {
  id:string; category:string; name:string; description:string;
  price:number; available:boolean; tags:string[]; imageUrl?:string;
}
interface MenuCategory { id:string; label:string; sub:string; roman:string; }

const TAG_OPTIONS = ['vegano','vegetariano','sem glúten','sem lactose','picante'];

const ROMAN = ['I','II','III','IV','V','VI','VII','VIII'];

// ─── Image compression ────────────────────────────────────────────────────────
function compressImage(file: File): Promise<string> {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = ev => {
      const img = new Image();
      img.onload = () => {
        const MAX = 600;
        let { width: w, height: h } = img;
        if (w > MAX || h > MAX) {
          if (w > h) { h = Math.round((h/w)*MAX); w = MAX; }
          else       { w = Math.round((w/h)*MAX); h = MAX; }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.78));
      };
      img.src = ev.target!.result as string;
    };
    reader.readAsDataURL(file);
  });
}

// ─── Item Edit Modal ──────────────────────────────────────────────────────────
function ItemModal({ item, categories, onSave, onClose }: {
  item: Partial<MenuItem> | null;
  categories: MenuCategory[];
  onSave: (i: MenuItem) => void;
  onClose: () => void;
}) {
  const isNew = !item?.id;
  const [form, setForm] = useState<MenuItem>({
    id:          item?.id          ?? `item-${Date.now()}`,
    category:    item?.category    ?? categories[0]?.id ?? 'burger',
    name:        item?.name        ?? '',
    description: item?.description ?? '',
    price:       item?.price       ?? 0,
    available:   item?.available   ?? true,
    tags:        item?.tags        ?? [],
    imageUrl:    item?.imageUrl    ?? '',
  });
  const [imgBusy, setImgBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof MenuItem>(k: K, v: MenuItem[K]) => setForm(p => ({ ...p, [k]: v }));

  async function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    setImgBusy(true);
    try { set('imageUrl', await compressImage(f)); }
    finally { setImgBusy(false); }
  }

  const inp: React.CSSProperties = {
    width:'100%', padding:'0.7rem 0.9rem', borderRadius:'0.65rem', boxSizing:'border-box',
    background:'rgba(255,255,255,0.05)', border:`1px solid ${G.border}`,
    color:G.text, fontSize:'0.88rem', fontFamily:sans, outline:'none',
  };
  const lbl: React.CSSProperties = {
    display:'block', color:G.muted, fontSize:'0.65rem', fontWeight:700,
    letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:'0.35rem',
  };

  return (
    <>
      <div onClick={onClose} style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.65)',zIndex:80,backdropFilter:'blur(4px)' }} />
      <div style={{ position:'fixed',top:'50%',left:'50%',transform:'translate(-50%,-50%)',
                    width:'min(560px,calc(100vw - 2rem))',maxHeight:'92dvh',overflowY:'auto',
                    background:G.card,borderRadius:'1.5rem',zIndex:81,
                    border:`1px solid ${G.border}`,boxShadow:'0 32px 80px rgba(0,0,0,0.5)' }}>

        <div style={{ padding:'1.25rem 1.5rem',borderBottom:`1px solid ${G.border}`,
                      display:'flex',alignItems:'center',justifyContent:'space-between',
                      position:'sticky',top:0,background:G.card,zIndex:1 }}>
          <p style={{ fontFamily:serif,fontSize:'1rem',fontWeight:700,color:G.text }}>
            {isNew ? 'Novo produto' : 'Editar produto'}
          </p>
          <button onClick={onClose} style={{ background:'none',border:'none',cursor:'pointer' }}>
            <X size={17} color={G.muted}/>
          </button>
        </div>

        <div style={{ padding:'1.5rem',display:'flex',flexDirection:'column',gap:'1rem' }}>

          {/* Image upload */}
          <div>
            <label style={lbl}>Foto do produto</label>
            <div style={{ display:'flex',gap:'1rem',alignItems:'center' }}>
              <div style={{ width:'80px',height:'80px',borderRadius:'0.75rem',flexShrink:0,
                            border:`1px solid ${G.border}`,background:'rgba(255,255,255,0.04)',
                            display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden' }}>
                {imgBusy ? <Loader2 size={20} color={G.gold} style={{ animation:'spin 1s linear infinite' }} />
                         : form.imageUrl
                           ? <img src={form.imageUrl} alt="" style={{ width:'100%',height:'100%',objectFit:'cover' }} />
                           : <ImageIcon size={22} color={G.muted} />}
              </div>
              <div style={{ flex:1 }}>
                <button type="button" onClick={() => fileRef.current?.click()} style={{
                  padding:'0.6rem 1rem',borderRadius:'0.65rem',border:`1px solid ${G.border}`,
                  background:'transparent',color:G.muted,cursor:'pointer',fontSize:'0.82rem',
                  fontFamily:sans,display:'flex',alignItems:'center',gap:'0.4rem',marginBottom:'0.4rem',
                }}>
                  <ImageIcon size={13}/> {form.imageUrl ? 'Trocar foto' : 'Adicionar foto'}
                </button>
                {form.imageUrl && (
                  <button type="button" onClick={() => set('imageUrl','')} style={{
                    padding:'0.4rem 0.75rem',borderRadius:'0.65rem',border:`1px solid rgba(239,68,68,0.3)`,
                    background:'transparent',color:'#f87171',cursor:'pointer',fontSize:'0.75rem',fontFamily:sans,
                  }}>Remover foto</button>
                )}
                <input ref={fileRef} type="file" accept="image/*" onChange={handleImage}
                       style={{ display:'none' }} />
                <p style={{ color:G.muted,fontSize:'0.7rem',marginTop:'0.3rem' }}>
                  JPG/PNG · comprimida automaticamente
                </p>
              </div>
            </div>
          </div>

          {/* Name + Category */}
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem' }}>
            <div>
              <label style={lbl}>Nome</label>
              <input value={form.name} onChange={e => set('name',e.target.value)}
                     placeholder="Ex: Pirâmide" style={inp} />
            </div>
            <div>
              <label style={lbl}>Categoria</label>
              <select value={form.category} onChange={e => set('category',e.target.value)}
                      style={{ ...inp, appearance:'none' }}>
                {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={lbl}>Descrição</label>
            <textarea value={form.description} onChange={e => set('description',e.target.value)}
                      rows={2} placeholder="Ingredientes e modo de preparo..."
                      style={{ ...inp, resize:'vertical' }} />
          </div>

          {/* Price + Available */}
          <div style={{ display:'grid',gridTemplateColumns:'1fr auto',gap:'0.75rem',alignItems:'end' }}>
            <div>
              <label style={lbl}>Preço (R$)</label>
              <input type="number" step="0.5" min="0" value={form.price}
                     onChange={e => set('price', parseFloat(e.target.value)||0)}
                     style={inp} />
            </div>
            <button type="button" onClick={() => set('available',!form.available)} style={{
              padding:'0.7rem 1rem',borderRadius:'0.65rem',
              border:`1px solid ${form.available ? G.green : G.border}`,
              background: form.available ? `${G.green}18` : 'transparent',
              color: form.available ? G.green : G.muted,
              cursor:'pointer',fontFamily:sans,fontSize:'0.82rem',fontWeight:600,
              display:'flex',alignItems:'center',gap:'0.4rem',
            }}>
              {form.available ? <ToggleRight size={16}/> : <ToggleLeft size={16}/>}
              {form.available ? 'Disponível' : 'Indisponível'}
            </button>
          </div>

          {/* Tags */}
          <div>
            <label style={lbl}>Tags</label>
            <div style={{ display:'flex',flexWrap:'wrap',gap:'0.4rem' }}>
              {TAG_OPTIONS.map(t => {
                const active = form.tags.includes(t);
                return (
                  <button key={t} type="button"
                          onClick={() => set('tags', active ? form.tags.filter(x=>x!==t) : [...form.tags,t])}
                          style={{ padding:'0.3rem 0.75rem',borderRadius:'99px',cursor:'pointer',
                                   fontSize:'0.75rem',fontWeight:600,fontFamily:sans,
                                   background:active ? G.green : 'transparent',
                                   color:active ? '#fff' : G.muted,
                                   border:`1px solid ${active ? G.green : G.border}` }}>
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Save */}
          <button onClick={() => { if(form.name.trim()) onSave(form); }} style={{
            padding:'0.85rem',background:G.gold,color:G.dark,border:'none',
            borderRadius:'99px',fontWeight:700,fontSize:'0.92rem',cursor:'pointer',fontFamily:sans,
            display:'flex',alignItems:'center',justifyContent:'center',gap:'0.4rem',
          }}>
            <Save size={15}/> {isNew ? 'Adicionar produto' : 'Salvar alterações'}
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Category Modal ───────────────────────────────────────────────────────────
function CatModal({ cat, nextRoman, onSave, onClose }: {
  cat: Partial<MenuCategory>|null; nextRoman:string;
  onSave:(c:MenuCategory)=>void; onClose:()=>void;
}) {
  const isNew = !cat?.id;
  const [form, setForm] = useState<MenuCategory>({
    id:    cat?.id    ?? `cat-${Date.now()}`,
    label: cat?.label ?? '',
    sub:   cat?.sub   ?? '',
    roman: cat?.roman ?? nextRoman,
  });

  const inp: React.CSSProperties = {
    width:'100%',padding:'0.7rem 0.9rem',borderRadius:'0.65rem',boxSizing:'border-box',
    background:'rgba(255,255,255,0.05)',border:`1px solid ${G.border}`,
    color:G.text,fontSize:'0.88rem',fontFamily:sans,outline:'none',
  };

  return (
    <>
      <div onClick={onClose} style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.65)',zIndex:82,backdropFilter:'blur(4px)' }} />
      <div style={{ position:'fixed',top:'50%',left:'50%',transform:'translate(-50%,-50%)',
                    width:'min(420px,calc(100vw - 2rem))',background:G.card,borderRadius:'1.5rem',zIndex:83,
                    border:`1px solid ${G.border}`,boxShadow:'0 32px 80px rgba(0,0,0,0.5)',padding:'1.5rem' }}>
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.25rem' }}>
          <p style={{ fontFamily:serif,fontSize:'1rem',fontWeight:700,color:G.text }}>{isNew ? 'Nova categoria' : 'Editar categoria'}</p>
          <button onClick={onClose} style={{ background:'none',border:'none',cursor:'pointer' }}><X size={17} color={G.muted}/></button>
        </div>
        <div style={{ display:'flex',flexDirection:'column',gap:'0.75rem' }}>
          {[
            ['label','Nome da seção','Ex: Sobremesas'],
            ['sub','Subtítulo','Ex: Feitas na hora'],
          ].map(([k,label,ph]) => (
            <div key={k}>
              <label style={{ display:'block',color:G.muted,fontSize:'0.65rem',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:'0.35rem' }}>{label}</label>
              <input value={form[k as keyof MenuCategory]} placeholder={ph}
                     onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} style={inp} />
            </div>
          ))}
          <button onClick={() => { if(form.label.trim()) onSave(form); }} style={{
            marginTop:'0.25rem',padding:'0.8rem',background:G.gold,color:G.dark,border:'none',
            borderRadius:'99px',fontWeight:700,fontSize:'0.9rem',cursor:'pointer',fontFamily:sans,
          }}>
            {isNew ? 'Criar categoria' : 'Salvar'}
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function PainelCardapio() {
  const [items,    setItems]    = useState<MenuItem[]>([]);
  const [cats,     setCats]     = useState<MenuCategory[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [editItem, setEditItem] = useState<Partial<MenuItem>|null|undefined>(undefined); // undefined=closed
  const [editCat,  setEditCat]  = useState<Partial<MenuCategory>|null|undefined>(undefined);
  const [authOk,   setAuthOk]   = useState(false);

  // auth
  useEffect(() => {
    const token = sessionStorage.getItem('painel:token');
    if (!token) { window.location.href = '/painel'; return; }
    fetch(`/api/painel/auth?token=${token}`)
      .then(r => r.json())
      .then((d: { valid:boolean }) => { if (d.valid) setAuthOk(true); else window.location.href = '/painel'; })
      .catch(() => { window.location.href = '/painel'; });
  }, []);

  const load = useCallback(async () => {
    const res  = await fetch('/api/menu');
    const data = await res.json() as { items: MenuItem[]; categories: MenuCategory[] };
    setItems(data.items ?? []);
    setCats(data.categories ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { if (authOk) load(); }, [authOk, load]);

  async function persist(nextItems: MenuItem[], nextCats: MenuCategory[]) {
    setSaving(true);
    try {
      await fetch('/api/menu', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ items: nextItems, categories: nextCats }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally { setSaving(false); }
  }

  function saveItem(item: MenuItem) {
    const next = items.some(i => i.id===item.id)
      ? items.map(i => i.id===item.id ? item : i)
      : [...items, item];
    setItems(next);
    persist(next, cats);
    setEditItem(undefined);
  }

  function deleteItem(id: string) {
    if (!confirm('Remover este produto?')) return;
    const next = items.filter(i => i.id !== id);
    setItems(next);
    persist(next, cats);
  }

  function toggleAvailable(id: string) {
    const next = items.map(i => i.id===id ? { ...i, available: !i.available } : i);
    setItems(next);
    persist(next, cats);
  }

  function saveCat(cat: MenuCategory) {
    const next = cats.some(c => c.id===cat.id)
      ? cats.map(c => c.id===cat.id ? cat : c)
      : [...cats, cat];
    setCats(next);
    persist(items, next);
    setEditCat(undefined);
  }

  function deleteCat(id: string) {
    if (!confirm('Remover categoria? Os produtos desta categoria ficarão sem categoria.')) return;
    const nextCats = cats.filter(c => c.id !== id);
    setCats(nextCats);
    persist(items, nextCats);
  }

  if (!authOk || loading) return (
    <div style={{ minHeight:'100dvh',background:G.bg,display:'flex',alignItems:'center',justifyContent:'center' }}>
      <Loader2 size={28} color={G.gold} style={{ animation:'spin 1s linear infinite' }}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ minHeight:'100dvh',background:G.bg,fontFamily:sans,color:G.text }}>

      {/* header */}
      <header style={{ background:G.dark,borderBottom:`1px solid ${G.border}`,
                       padding:'0 1.25rem',height:'56px',display:'flex',
                       alignItems:'center',justifyContent:'space-between',
                       position:'sticky',top:0,zIndex:40 }}>
        <Link href="/painel" style={{ display:'inline-flex',alignItems:'center',gap:'0.5rem',
                                      textDecoration:'none',color:G.muted,fontSize:'0.85rem' }}>
          <ArrowLeft size={15}/> Painel
        </Link>
        <span style={{ fontFamily:serif,fontSize:'0.95rem',fontWeight:700,color:G.text }}>Cardápio</span>
        <div style={{ display:'flex',alignItems:'center',gap:'0.5rem' }}>
          {saved && <span style={{ color:G.green,fontSize:'0.78rem',fontWeight:600 }}>✓ Salvo</span>}
          {saving && <Loader2 size={14} color={G.gold} style={{ animation:'spin 1s linear infinite' }}/>}
        </div>
      </header>

      <div style={{ maxWidth:'800px',margin:'0 auto',padding:'1.5rem 1.25rem' }}>

        {/* ── Products by category ── */}
        {cats.map(cat => {
          const catItems = items.filter(i => i.category === cat.id);
          return (
            <div key={cat.id} style={{ marginBottom:'2.5rem' }}>
              <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'0.75rem' }}>
                <div style={{ display:'flex',alignItems:'center',gap:'0.6rem' }}>
                  <span style={{ color:G.muted,fontSize:'0.65rem',fontWeight:700,letterSpacing:'0.2em',textTransform:'uppercase' }}>
                    {cat.roman}
                  </span>
                  <h2 style={{ fontFamily:serif,fontSize:'1.1rem',fontWeight:700,color:G.text,margin:0 }}>{cat.label}</h2>
                  <span style={{ color:G.muted,fontSize:'0.72rem' }}>— {cat.sub}</span>
                </div>
                <div style={{ display:'flex',gap:'0.3rem' }}>
                  <button onClick={() => setEditCat(cat)} title="Editar categoria"
                          style={{ background:'none',border:'none',cursor:'pointer',padding:'4px',color:G.muted }}>
                    <Pencil size={13}/>
                  </button>
                  <button onClick={() => deleteCat(cat.id)} title="Remover categoria"
                          style={{ background:'none',border:'none',cursor:'pointer',padding:'4px',color:'#f87171' }}>
                    <Trash2 size={13}/>
                  </button>
                </div>
              </div>

              <div style={{ display:'flex',flexDirection:'column',gap:'0.5rem' }}>
                {catItems.length === 0 && (
                  <p style={{ color:G.muted,fontSize:'0.82rem',padding:'0.5rem 0' }}>Nenhum produto nesta categoria.</p>
                )}
                {catItems.map(item => (
                  <div key={item.id} style={{
                    display:'flex',alignItems:'center',gap:'0.85rem',
                    background:G.card2,borderRadius:'0.85rem',border:`1px solid ${G.border}`,
                    padding:'0.85rem 1rem',
                  }}>
                    {/* thumbnail */}
                    <div style={{ width:'44px',height:'44px',borderRadius:'0.5rem',flexShrink:0,
                                  border:`1px solid ${G.border}`,background:'rgba(255,255,255,0.05)',
                                  overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center' }}>
                      {item.imageUrl
                        ? <img src={item.imageUrl} alt="" style={{ width:'100%',height:'100%',objectFit:'cover' }}/>
                        : <span style={{ color:`${G.gold}50`,fontFamily:serif,fontSize:'1.1rem' }}>{item.name[0]}</span>}
                    </div>

                    <div style={{ flex:1,minWidth:0 }}>
                      <div style={{ display:'flex',alignItems:'center',gap:'0.5rem' }}>
                        <p style={{ fontWeight:600,fontSize:'0.9rem',color:G.text }}>{item.name}</p>
                        <span style={{ fontSize:'0.78rem',fontWeight:700,color:G.gold }}>{fmt(item.price)}</span>
                        {!item.available && (
                          <span style={{ fontSize:'0.6rem',color:G.muted,background:'rgba(255,255,255,0.05)',
                                         padding:'0.1rem 0.4rem',borderRadius:'99px',border:`1px solid ${G.border}` }}>
                            Indisponível
                          </span>
                        )}
                      </div>
                      <p style={{ color:G.muted,fontSize:'0.75rem',marginTop:'0.1rem',
                                  overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:'320px' }}>
                        {item.description}
                      </p>
                    </div>

                    {/* actions */}
                    <div style={{ display:'flex',alignItems:'center',gap:'0.25rem',flexShrink:0 }}>
                      <button onClick={() => toggleAvailable(item.id)} title="Disponibilidade"
                              style={{ background:'none',border:'none',cursor:'pointer',padding:'5px',
                                       color:item.available ? G.green : G.muted }}>
                        {item.available ? <ToggleRight size={18}/> : <ToggleLeft size={18}/>}
                      </button>
                      <button onClick={() => setEditItem(item)} title="Editar"
                              style={{ background:'none',border:'none',cursor:'pointer',padding:'5px',color:G.muted }}>
                        <Pencil size={14}/>
                      </button>
                      <button onClick={() => deleteItem(item.id)} title="Remover"
                              style={{ background:'none',border:'none',cursor:'pointer',padding:'5px',color:'#f87171' }}>
                        <Trash2 size={14}/>
                      </button>
                    </div>
                  </div>
                ))}

                {/* Add item to this category */}
                <button onClick={() => setEditItem({ category: cat.id })} style={{
                  display:'flex',alignItems:'center',gap:'0.5rem',justifyContent:'center',
                  padding:'0.6rem',borderRadius:'0.85rem',border:`1px dashed ${G.border}`,
                  background:'transparent',color:G.muted,cursor:'pointer',
                  fontSize:'0.8rem',fontFamily:sans,
                }}>
                  <Plus size={14}/> Adicionar produto em {cat.label}
                </button>
              </div>
            </div>
          );
        })}

        {/* Add category */}
        <div style={{ display:'flex',gap:'0.75rem',borderTop:`1px solid ${G.border}`,paddingTop:'1.5rem' }}>
          <button onClick={() => setEditCat({})} style={{
            flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:'0.5rem',
            padding:'0.75rem',borderRadius:'0.85rem',border:`1px dashed ${G.border}`,
            background:'transparent',color:G.muted,cursor:'pointer',fontSize:'0.85rem',fontFamily:sans,
          }}>
            <Plus size={14}/> Nova categoria
          </button>
          <button onClick={() => setEditItem({})} style={{
            flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:'0.5rem',
            padding:'0.75rem',borderRadius:'0.85rem',border:`1px solid ${G.gold}`,
            background:`${G.gold}10`,color:G.gold,cursor:'pointer',fontSize:'0.85rem',fontFamily:sans,fontWeight:600,
          }}>
            <Plus size={14}/> Novo produto
          </button>
        </div>
      </div>

      {/* Modals */}
      {editItem !== undefined && (
        <ItemModal item={editItem} categories={cats}
                   onSave={saveItem} onClose={() => setEditItem(undefined)} />
      )}
      {editCat !== undefined && (
        <CatModal cat={editCat} nextRoman={ROMAN[cats.length] ?? String(cats.length+1)}
                  onSave={saveCat} onClose={() => setEditCat(undefined)} />
      )}

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
