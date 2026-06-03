'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ExternalLink } from 'lucide-react';

// ─── Tokens ───────────────────────────────────────────────────────────────────
const G = {
  gold: '#C8941A', goldSoft: '#E6B84A',
  green: '#6B8C3E', terra: '#8B4030',
  dark: '#14100C', dark2: '#1E1509',
  parch: '#FAF5E8', sand: '#F5E6C8',
  muted: '#A89070', border: '#E8D9BA',
};
const serif = 'Playfair Display, Georgia, serif';
const sans  = 'Inter, system-ui, sans-serif';

// ─── Deliverables ─────────────────────────────────────────────────────────────
const deliverables = [
  {
    num: '01', color: G.gold,
    title: 'Site Institucional',
    desc: 'Vitrine da marca com storytelling completo — conceito de Cozinha Viva, ancestralidade, seção Nossa Chef, cardápio preview e CTA direto para pedido.',
    href: '/',
    linkLabel: 'Ver site',
    tags: ['Next.js', 'SEO', 'Mobile-first'],
  },
  {
    num: '02', color: G.green,
    title: 'Cardápio Digital + Pedidos',
    desc: 'Menu artesanal com fotos, preços e descrições no tom da marca. Checkout com CEP auto-preenchido, retirada ou entrega, e confirmação via WhatsApp.',
    href: '/cardapio',
    linkLabel: 'Ver cardápio',
    tags: ['Pedido direto', 'ViaCEP', 'WhatsApp'],
  },
  {
    num: '03', color: G.terra,
    title: 'Painel da Cozinha',
    desc: 'Dashboard em tempo real com kanban de pedidos (Recebido → Preparando → Pronto), estatísticas do dia, PIN de acesso e gerenciamento completo do cardápio.',
    href: '/painel',
    linkLabel: 'Acessar painel',
    tags: ['Tempo real', 'Kanban', 'CRUD cardápio'],
  },
  {
    num: '04', color: G.goldSoft,
    title: 'CRM de Clientes',
    desc: 'Perfis criados automaticamente a cada pedido — nome, WhatsApp, histórico, ticket médio e total gasto. Tags manuais e notas internas para atendimento personalizado.',
    href: '/painel/clientes',
    linkLabel: 'Ver clientes',
    tags: ['Auto-captura', 'Tags', 'Histórico'],
  },
];

// ─── Flow steps ───────────────────────────────────────────────────────────────
const customerFlow = [
  { step: '1', label: 'Descobre a Nefertari',      sub: 'Link na bio, iFood, indicação' },
  { step: '2', label: 'Visita o site',              sub: 'Lê a história, conhece a marca' },
  { step: '3', label: 'Abre o cardápio',            sub: 'Escolhe os itens, monta o pedido' },
  { step: '4', label: 'Finaliza o pedido',          sub: 'Nome, WhatsApp, retirada ou entrega' },
  { step: '5', label: 'Confirma pelo WhatsApp',     sub: 'Mensagem automática para a Jéssica' },
  { step: '6', label: 'Acompanha o status',         sub: 'Página de rastreio atualiza a cada 10s' },
];

const kitchenFlow = [
  { step: '1', label: 'Recebe alerta',              sub: 'Novo pedido aparece no painel' },
  { step: '2', label: 'Confirma e inicia preparo',  sub: 'Um clique avança o status' },
  { step: '3', label: 'Marca como pronto',          sub: 'Cliente recebe atualização em tempo real' },
  { step: '4', label: 'Confirma entrega',           sub: 'Pedido vai pro histórico e CRM' },
];

// ─── MC questions ─────────────────────────────────────────────────────────────
const mcQuestions = [
  {
    id: 'mc_site', question: 'O site institucional representa bem a Nefertari?',
    options: [
      { value: 'yes',    label: 'Sim, está exatamente como imaginarei',         followUp: null },
      { value: 'almost', label: 'Quase — mudaria algum detalhe',                followUp: 'O que você mudaria?' },
      { value: 'no',     label: 'Ainda não representa completamente',           followUp: 'O que está faltando?' },
    ],
  },
  {
    id: 'mc_cardapio', question: 'O cardápio digital está representando bem os produtos?',
    options: [
      { value: 'yes',    label: 'Sim, ficou muito bom',                         followUp: null },
      { value: 'almost', label: 'Faltam ajustes nas descrições ou preços',      followUp: 'O que precisa ser ajustado?' },
      { value: 'no',     label: 'Precisa de revisão mais ampla',                followUp: 'Como você gostaria que fosse?' },
    ],
  },
  {
    id: 'mc_painel', question: 'O painel da cozinha está intuitivo para usar?',
    options: [
      { value: 'yes',    label: 'Sim, fácil de usar',                           followUp: null },
      { value: 'almost', label: 'Quase — algumas coisas ainda confundem',       followUp: 'O que confunde?' },
      { value: 'no',     label: 'Ainda está difícil de operar',                 followUp: 'Onde trava?' },
    ],
  },
];

// ─── Next deliverables ────────────────────────────────────────────────────────
const proximas = [
  {
    num: '05', color: G.gold, title: 'WhatsApp Automation',
    desc: 'Mensagens automáticas de confirmação, status de preparo e entrega mantendo o tom de voz da marca. Sem robô engessado.',
    tags: ['Z-API', 'Humanizado', 'Notificações'],
  },
  {
    num: '06', color: G.green, title: 'Fotos Autorais',
    desc: 'Integração das mídias produzidas (Pedra Santa, feira livre, making-of da cozinha) no site e no cardápio.',
    tags: ['Conteúdo real', 'Artesanal', 'Storytelling visual'],
  },
  {
    num: '07', color: G.terra, title: 'SEO Local + Analytics',
    desc: 'Otimização para buscas em Jequié, Google Meu Negócio e painel de métricas para acompanhar pedidos, visitas e conversões.',
    tags: ['Jequié', 'Google', 'Métricas'],
  },
];

// ─── Feedback types ───────────────────────────────────────────────────────────
interface FeedbackState {
  mc_site: string; mc_site_note: string;
  mc_cardapio: string; mc_cardapio_note: string;
  mc_painel: string; mc_painel_note: string;
  q_faltando: string; q_melhorar: string;
}

const DEFAULTS: FeedbackState = {
  mc_site: '', mc_site_note: '',
  mc_cardapio: '', mc_cardapio_note: '',
  mc_painel: '', mc_painel_note: '',
  q_faltando: '', q_melhorar: '',
};

// ─── MC Option ────────────────────────────────────────────────────────────────
function MCOption({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', textAlign: 'left', padding: '0.85rem 1rem',
      borderRadius: '0.85rem', cursor: 'pointer', fontFamily: sans, fontSize: '0.88rem',
      transition: 'all 0.15s',
      background: selected ? `${G.gold}12` : '#fff',
      border: `1px solid ${selected ? G.gold : G.border}`,
      color: selected ? G.dark : '#5A4435',
      display: 'flex', alignItems: 'center', gap: '0.75rem',
    }}>
      <span style={{
        width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0,
        border: `2px solid ${selected ? G.gold : G.border}`,
        background: selected ? G.gold : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {selected && <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#fff' }} />}
      </span>
      {label}
    </button>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Milestone02() {
  const [feedback,    setFeedback]    = useState<FeedbackState>(DEFAULTS);
  const [openSection, setOpenSection] = useState<number | null>(null);
  const [isSaving,    setIsSaving]    = useState(false);
  const [lastSaved,   setLastSaved]   = useState<Date | null>(null);
  const [isLoading,   setIsLoading]   = useState(true);

  const set = (k: keyof FeedbackState, v: string) => setFeedback(p => ({ ...p, [k]: v }));

  useEffect(() => {
    fetch('/api/milestone02')
      .then(r => r.json())
      .then((data: FeedbackState & { updated_at?: string } | null) => {
        if (data) {
          const { updated_at, ...fields } = data as FeedbackState & { updated_at: string };
          setFeedback({ ...DEFAULTS, ...fields });
          if (updated_at) setLastSaved(new Date(updated_at));
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  async function save() {
    setIsSaving(true);
    try {
      await fetch('/api/milestone02', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedback),
      });
      setLastSaved(new Date());
    } catch { /* silent */ }
    finally  { setIsSaving(false); }
  }

  return (
    <div style={{ fontFamily: sans, backgroundColor: G.parch, color: G.dark, minHeight: '100vh' }}>

      {/* ── Hero ── */}
      <section style={{
        background: `linear-gradient(160deg, ${G.dark} 0%, #2A1A08 60%, ${G.dark} 100%)`,
        padding: '5rem 1.5rem 6rem', textAlign: 'center',
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', padding: '0.35rem 1rem',
            borderRadius: '99px', border: `1px solid rgba(200,148,26,0.3)`,
            color: G.gold, fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.3em',
            textTransform: 'uppercase', marginBottom: '2rem',
          }}>
            Milestone 2 de 3 · Junho 2026
          </span>

          <h1 style={{ fontFamily: serif, fontSize: 'clamp(2.2rem, 6vw, 3.8rem)',
                       fontWeight: 700, color: G.parch, lineHeight: 1.1,
                       letterSpacing: '-0.02em', marginBottom: '1rem' }}>
            Ecossistema Digital
          </h1>
          <h1 style={{ fontFamily: serif, fontSize: 'clamp(2.2rem, 6vw, 3.8rem)',
                       fontWeight: 700, color: G.gold, lineHeight: 1.1,
                       letterSpacing: '-0.02em', marginBottom: '1.5rem' }}>
            no ar e funcionando.
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <span style={{ height: '1px', width: '40px', background: `rgba(200,148,26,0.3)` }} />
            <span style={{ color: G.muted, fontSize: '0.72rem', letterSpacing: '0.25em', textTransform: 'uppercase' }}>Nefertari Cozinha Viva</span>
            <span style={{ height: '1px', width: '40px', background: `rgba(200,148,26,0.3)` }} />
          </div>

          <p style={{ color: G.muted, maxWidth: '480px', margin: '0 auto', fontSize: '0.95rem', lineHeight: 1.7 }}>
            Site, cardápio, sistema de pedidos, painel da cozinha e CRM de clientes —
            tudo integrado, tudo com a identidade da Nefertari. Agora é sua vez de avaliar.
          </p>
        </div>
      </section>

      {/* ── O que entregamos ── */}
      <section style={{ padding: '5rem 1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{ color: G.gold, fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            Fase 2 — Concluída
          </p>
          <h2 style={{ fontFamily: serif, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, color: G.dark }}>
            O que entregamos
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {deliverables.map(d => (
            <div key={d.num} style={{
              background: '#fff', borderRadius: '1.25rem', border: `1px solid ${G.border}`,
              overflow: 'hidden', display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ padding: '1.5rem 1.5rem 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span style={{
                    width: '2.2rem', height: '2.2rem', borderRadius: '50%',
                    background: d.color, color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: 700,
                  }}>{d.num}</span>
                  <span style={{ color: '#ccc', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    Entregue ✓
                  </span>
                </div>
                <h3 style={{ fontFamily: serif, fontSize: '1.1rem', fontWeight: 700, color: G.dark, marginBottom: '0.6rem' }}>
                  {d.title}
                </h3>
                <p style={{ color: '#6B5040', fontSize: '0.83rem', lineHeight: 1.65, marginBottom: '1rem' }}>
                  {d.desc}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
                  {d.tags.map(t => (
                    <span key={t} style={{
                      fontSize: '0.62rem', fontWeight: 600, padding: '0.2rem 0.6rem',
                      borderRadius: '99px', border: `1px solid ${d.color}30`,
                      color: d.color,
                    }}>{t}</span>
                  ))}
                </div>
              </div>
              <div style={{ marginTop: 'auto', padding: '0 1.5rem 1.25rem' }}>
                <Link href={d.href} target={d.href.startsWith('/painel') ? '_blank' : undefined}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                        color: d.color, fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none',
                      }}>
                  {d.linkLabel} <ExternalLink size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Como funciona ── */}
      <section style={{ background: G.sand, padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ color: G.gold, fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              Os dois fluxos
            </p>
            <h2 style={{ fontFamily: serif, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, color: G.dark }}>
              Como tudo se conecta
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {/* Customer flow */}
            <div style={{ background: '#fff', borderRadius: '1.25rem', border: `1px solid ${G.border}`, padding: '1.75rem' }}>
              <p style={{ color: G.gold, fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
                🛵 Fluxo do cliente
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {customerFlow.map((s, i) => (
                  <div key={s.step} style={{ display: 'flex', gap: '0.85rem', paddingBottom: i < customerFlow.length - 1 ? '1rem' : 0, position: 'relative' }}>
                    {i < customerFlow.length - 1 && (
                      <div style={{ position: 'absolute', left: '0.65rem', top: '1.4rem', width: '1px', height: '100%', background: `${G.gold}25` }} />
                    )}
                    <div style={{
                      width: '1.4rem', height: '1.4rem', borderRadius: '50%',
                      background: G.gold, color: '#fff', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.6rem', fontWeight: 700,
                    }}>{s.step}</div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '0.85rem', color: G.dark }}>{s.label}</p>
                      <p style={{ color: G.muted, fontSize: '0.75rem', marginTop: '0.1rem' }}>{s.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Kitchen flow */}
            <div style={{ background: '#fff', borderRadius: '1.25rem', border: `1px solid ${G.border}`, padding: '1.75rem' }}>
              <p style={{ color: G.terra, fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
                🍳 Fluxo da cozinha
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {kitchenFlow.map((s, i) => (
                  <div key={s.step} style={{ display: 'flex', gap: '0.85rem', paddingBottom: i < kitchenFlow.length - 1 ? '1rem' : 0, position: 'relative' }}>
                    {i < kitchenFlow.length - 1 && (
                      <div style={{ position: 'absolute', left: '0.65rem', top: '1.4rem', width: '1px', height: '100%', background: `${G.terra}20` }} />
                    )}
                    <div style={{
                      width: '1.4rem', height: '1.4rem', borderRadius: '50%',
                      background: G.terra, color: '#fff', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.6rem', fontWeight: 700,
                    }}>{s.step}</div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '0.85rem', color: G.dark }}>{s.label}</p>
                      <p style={{ color: G.muted, fontSize: '0.75rem', marginTop: '0.1rem' }}>{s.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Feedback ── */}
      <section style={{ padding: '5rem 1.5rem', maxWidth: '720px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{ color: G.gold, fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            Sua avaliação
          </p>
          <h2 style={{ fontFamily: serif, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, color: G.dark }}>
            O que você achou?
          </h2>
          <p style={{ color: '#6B5040', fontSize: '0.88rem', marginTop: '0.75rem', maxWidth: '400px', margin: '0.75rem auto 0' }}>
            Seu feedback define o que ajustamos antes do Milestone 3.
          </p>
        </div>

        {isLoading ? (
          <p style={{ textAlign: 'center', color: G.muted }}>Carregando...</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* MC questions */}
            {mcQuestions.map((q, i) => {
              const selectedOpt = q.options.find(o => o.value === feedback[q.id as keyof FeedbackState]);
              const noteKey = `${q.id}_note` as keyof FeedbackState;
              return (
                <div key={q.id} style={{ background: '#fff', borderRadius: '1.25rem', border: `1px solid ${G.border}`, overflow: 'hidden' }}>
                  <button
                    onClick={() => setOpenSection(prev => prev === i ? null : i)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '1.25rem 1.5rem', background: 'none', border: 'none', cursor: 'pointer',
                      textAlign: 'left', fontFamily: sans,
                    }}>
                    <span style={{ fontFamily: serif, fontSize: '1rem', fontWeight: 600, color: G.dark, paddingRight: '1rem' }}>
                      {q.question}
                    </span>
                    <span style={{ color: G.gold, fontSize: '1.2rem', flexShrink: 0 }}>{openSection === i ? '−' : '+'}</span>
                  </button>

                  {openSection === i && (
                    <div style={{ borderTop: `1px solid ${G.border}`, padding: '1.25rem 1.5rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: selectedOpt?.followUp ? '1rem' : 0 }}>
                        {q.options.map(opt => (
                          <MCOption
                            key={opt.value}
                            label={opt.label}
                            selected={feedback[q.id as keyof FeedbackState] === opt.value}
                            onClick={() => set(q.id as keyof FeedbackState, opt.value)}
                          />
                        ))}
                      </div>
                      {selectedOpt?.followUp && (
                        <div style={{ borderTop: `1px solid #F0E8D4`, paddingTop: '1rem' }}>
                          <label style={{ display: 'block', color: G.gold, fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                            {selectedOpt.followUp}
                          </label>
                          <textarea
                            rows={2}
                            value={feedback[noteKey]}
                            onChange={e => set(noteKey, e.target.value)}
                            placeholder="Escreva à vontade..."
                            style={{
                              width: '100%', padding: '0.75rem 1rem', borderRadius: '0.75rem',
                              border: `1px solid ${G.border}`, background: G.parch,
                              fontSize: '0.88rem', fontFamily: sans, outline: 'none',
                              resize: 'none', boxSizing: 'border-box', color: G.dark,
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Open questions */}
            {[
              { key: 'q_faltando', label: 'Algo que está faltando ou que você sentiu falta?',       ph: 'Uma funcionalidade, uma seção, um detalhe...' },
              { key: 'q_melhorar', label: 'O que você melhoraria no que foi entregue até agora?',   ph: 'Seja específica — cada detalhe ajuda.' },
            ].map(q => (
              <div key={q.key} style={{ background: '#fff', borderRadius: '1.25rem', border: `1px solid ${G.border}`, padding: '1.5rem' }}>
                <label style={{ display: 'block', fontFamily: serif, fontSize: '1rem', fontWeight: 600, color: G.dark, marginBottom: '0.85rem' }}>
                  {q.label}
                </label>
                <textarea
                  rows={3}
                  value={feedback[q.key as keyof FeedbackState]}
                  onChange={e => set(q.key as keyof FeedbackState, e.target.value)}
                  placeholder={q.ph}
                  style={{
                    width: '100%', padding: '0.85rem 1rem', borderRadius: '0.75rem',
                    border: `1px solid ${G.border}`, background: G.parch,
                    fontSize: '0.88rem', fontFamily: sans, outline: 'none',
                    resize: 'none', boxSizing: 'border-box', color: G.dark,
                  }}
                />
              </div>
            ))}

            {/* Save */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
              {lastSaved && (
                <p style={{ color: G.muted, fontSize: '0.75rem' }}>
                  Último envio: {lastSaved.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              )}
              <button onClick={save} disabled={isSaving} style={{
                marginLeft: 'auto', padding: '0.85rem 2rem', background: isSaving ? G.muted : G.gold,
                color: G.dark, border: 'none', borderRadius: '99px',
                fontWeight: 700, fontSize: '0.9rem', cursor: isSaving ? 'not-allowed' : 'pointer', fontFamily: sans,
              }}>
                {isSaving ? 'Salvando...' : 'Enviar feedback'}
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ── Próximas entregas ── */}
      <section style={{ background: G.sand, padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ color: G.gold, fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              Milestone 3 de 3
            </p>
            <h2 style={{ fontFamily: serif, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, color: G.dark }}>
              O que vem a seguir
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {proximas.map(item => (
              <div key={item.num} style={{
                background: '#fff', borderRadius: '1.25rem', border: `1px solid ${G.border}`, padding: '1.75rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span style={{
                    width: '2.2rem', height: '2.2rem', borderRadius: '50%',
                    background: item.color, color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: 700,
                  }}>{item.num}</span>
                  <span style={{ color: '#ccc', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Em breve</span>
                </div>
                <h3 style={{ fontFamily: serif, fontSize: '1.05rem', fontWeight: 700, color: G.dark, marginBottom: '0.6rem' }}>{item.title}</h3>
                <p style={{ color: '#6B5040', fontSize: '0.83rem', lineHeight: 1.65, marginBottom: '1rem' }}>{item.desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {item.tags.map(t => (
                    <span key={t} style={{
                      fontSize: '0.62rem', fontWeight: 600, padding: '0.2rem 0.6rem',
                      borderRadius: '99px', border: `1px solid ${item.color}30`, color: item.color,
                    }}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: G.dark, borderTop: `1px solid rgba(200,148,26,0.1)`, padding: '2rem 1.5rem', textAlign: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.7rem' }}>
          Nefertari Cozinha Viva · Milestone 2 de 3 · Junho 2026
        </p>
        <p style={{ color: 'rgba(255,255,255,0.12)', fontSize: '0.65rem', marginTop: '0.3rem' }}>
          Produzido por <span style={{ color: 'rgba(200,148,26,0.4)' }}>clubemkt.digital</span>
        </p>
      </footer>
    </div>
  );
}
