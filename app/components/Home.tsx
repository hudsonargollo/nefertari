'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowRight, MapPin, Clock } from 'lucide-react';
import { useTheme } from '../lib/useTheme';
import ThemeToggle from './ThemeToggle';

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const G = {
  gold:    '#C8941A',
  goldSoft:'#E6B84A',
  green:   '#6B8C3E',
  terra:   '#8B4030',
  dark:    '#14100C',
  dark2:   '#1E1509',
  card:    '#1A1208',
  parch:   '#FAF5E8',
  sand:    '#F5E6C8',
  muted:   '#A89070',
  border:  'rgba(200,148,26,0.15)',
};

const serif = 'Playfair Display, Georgia, serif';
const sans  = 'Inter, system-ui, sans-serif';

// ─── Data ─────────────────────────────────────────────────────────────────────
const menuCategories = [
  {
    glyph: '◈',
    name: 'Hambúrgueres',
    highlight: 'Feito à mão',
    desc: 'Cada camada pensada, cada ingrediente com razão de estar ali. Uma experiência gastronômica no formato de lanche.',
    color: G.gold,
  },
  {
    glyph: '❧',
    name: 'Wraps',
    highlight: 'Leveza intencional',
    desc: 'Folhas frescas, proteínas de verdade, molhos artesanais. Leve no peso — intenso no sabor.',
    color: G.green,
  },
  {
    glyph: '△',
    name: 'Acompanhamentos',
    highlight: 'Para completar',
    desc: 'Batata frita com sal grosso e ervas. Simples, crocante, sem enrolação — do jeito que tem que ser.',
    color: G.terra,
  },
  {
    glyph: '◉',
    name: 'Bebidas',
    highlight: 'Frescas e reais',
    desc: 'Suco espremido na hora, refrigerante gelado e água. Nada artificial, tudo com intenção.',
    color: G.goldSoft,
  },
];

const pillars = [
  { icon: '✓', label: 'Ingredientes reconhecíveis',    desc: 'Se você não sabe o que é, a gente não usa.' },
  { icon: '✓', label: 'Feito na hora',                 desc: 'Não existe estoque pronto. Cada pedido começa do zero.' },
  { icon: '✓', label: 'Processo artesanal',             desc: 'Mãos, tempo e intenção — não máquinas ou linha de produção.' },
  { icon: '✓', label: 'Sabores que respeitam o paladar',desc: 'Refinado sem ser inalcançável. Saboroso sem ser pesado.' },
];

const nots = [
  'Ultraprocessados disfarçados de saudável',
  'Carne do futuro industrial montada em série',
  'Linguagem "fit" e hashtags genéricos',
  'Experiências descartáveis',
];

// ─── Nav ──────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);
  const { dark, toggle }        = useTheme();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <nav
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: scrolled ? 'rgba(20,16,12,0.96)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? `1px solid ${G.border}` : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', height: '64px' }}>

        {/* desktop links — centered */}
        <div className="hidden md:flex items-center gap-8">
          {[['#conceito','Conceito'],['#chef','Nossa chef'],['#jeito','Nosso jeito']].map(([href, label]) => (
            <a key={href} href={href}
               style={{ color: G.muted, fontSize: '0.8rem', textDecoration: 'none', letterSpacing: '0.05em', transition: 'color 0.2s' }}
               onMouseEnter={e => (e.currentTarget.style.color = G.parch)}
               onMouseLeave={e => (e.currentTarget.style.color = G.muted)}>
              {label}
            </a>
          ))}
          <Link href="/cardapio"
                style={{ background: G.gold, color: G.dark, padding: '0.45rem 1.1rem', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none', letterSpacing: '0.03em', transition: 'opacity 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
            Ver cardápio
          </Link>
          <ThemeToggle dark={dark} onToggle={toggle} position="static" />
        </div>

        {/* mobile toggle — absolutely positioned so it doesn't break centering */}
        <button className="md:hidden" onClick={() => setOpen(o => !o)}
                style={{ color: G.parch, background: 'none', border: 'none', cursor: 'pointer',
                         padding: '4px', position: 'absolute', right: '1.5rem' }}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* mobile drawer */}
      {open && (
        <div style={{ background: 'rgba(20,16,12,0.98)', borderTop: `1px solid ${G.border}`, padding: '1.5rem' }}>
          <div className="flex flex-col gap-5">
            {[['#conceito','Conceito'],['#chef','Nossa chef'],['#jeito','Nosso jeito']].map(([href, label]) => (
              <a key={href} href={href} onClick={() => setOpen(false)}
                 style={{ color: G.muted, fontSize: '1rem', textDecoration: 'none' }}>{label}</a>
            ))}
            <Link href="/cardapio" onClick={() => setOpen(false)}
                  style={{ background: G.gold, color: G.dark, padding: '0.7rem 1.2rem', borderRadius: '99px', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none', textAlign: 'center' }}>
              Ver cardápio
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

// ─── Section heading helper ───────────────────────────────────────────────────
function SectionTag({ label, light = false }: { label: string; light?: boolean }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
      padding: '0.3rem 0.9rem', borderRadius: '99px',
      border: `1px solid ${light ? 'rgba(200,148,26,0.35)' : 'rgba(200,148,26,0.25)'}`,
      color: G.gold, fontSize: '0.65rem', fontWeight: 700,
      letterSpacing: '0.3em', textTransform: 'uppercase',
    }}>
      {label}
    </span>
  );
}

// ─── Gold divider ─────────────────────────────────────────────────────────────
function GoldLine() {
  return <div style={{ height: '1px', background: `linear-gradient(to right, transparent, ${G.gold}40, transparent)`, margin: '0 auto', maxWidth: '640px' }} />;
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Home() {
  const { dark, T } = useTheme();

  // In light mode, flip hero to parchment and dark sections to light
  const heroBg    = dark
    ? `radial-gradient(ellipse 70% 50% at 50% 10%, rgba(200,148,26,0.12) 0%, transparent 65%), ${G.dark}`
    : `radial-gradient(ellipse 70% 50% at 50% 10%, rgba(200,148,26,0.08) 0%, transparent 65%), ${G.parch}`;
  const heroText  = dark ? G.parch : G.dark;
  const darkSec   = dark ? G.dark2 : G.sand;      // sections that were dark now become sand in light
  const lightSec  = dark ? G.parch : '#FFFFFF';    // sections that were parch become white in light

  return (
    <div id="topo" style={{ fontFamily: sans, backgroundColor: T.bg, color: T.text, overflowX: 'hidden', transition: 'background 0.3s, color 0.3s' }}>
      <Nav />

      {/* ═══════════════════════════════════════════════════════════════════
          HERO — fits 100dvh
      ═══════════════════════════════════════════════════════════════════ */}
      <section style={{
        height: '100dvh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        padding: '1.5rem 1.5rem 2rem', position: 'relative',
        background: heroBg, transition: 'background 0.3s',
      }}>
        {/* logo */}
        <div style={{ marginBottom: '1.25rem' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/nefertari-logo-golden.png" alt="Nefertari Cozinha Viva"
               style={{ width: 'clamp(140px, 22vw, 210px)', height: 'auto', objectFit: 'contain' }} />
        </div>

        {/* location tag */}
        <SectionTag label="Jequié · Bahia" light />
        <div style={{ height: '1.1rem' }} />

        {/* headline */}
        <h1 style={{ fontFamily: serif, fontSize: 'clamp(2rem, 5.5vw, 4rem)', fontWeight: 700,
                     lineHeight: 1.1, letterSpacing: '-0.02em', margin: '0 0 1rem', maxWidth: '640px', color: heroText }}>
          Alimentar o corpo<br />
          <span style={{ color: G.gold }}>como um ato sagrado.</span>
        </h1>

        {/* sub */}
        <p style={{ color: T.muted, fontSize: 'clamp(0.875rem, 1.8vw, 1rem)', lineHeight: 1.65,
                    maxWidth: '400px', margin: '0 auto 1.75rem' }}>
          Ingredientes reais. Receitas com intenção.<br />
          Feito à mão — para quem não abre mão de comer bem.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/cardapio"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                         background: G.gold, color: G.dark, padding: '0.8rem 1.6rem',
                         borderRadius: '99px', fontWeight: 700, fontSize: '0.9rem',
                         textDecoration: 'none', letterSpacing: '0.02em' }}>
            Fazer meu pedido <ArrowRight size={15} />
          </Link>
          <a href="#conceito"
             style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                      border: `1px solid ${G.border}`, color: G.muted,
                      padding: '0.8rem 1.6rem', borderRadius: '99px',
                      fontSize: '0.875rem', textDecoration: 'none' }}>
            Nossa história
          </a>
        </div>

        {/* scroll indicator */}
        <div style={{ position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)',
                      animation: 'pulse 2s ease-in-out infinite' }}>
          <div style={{ width: '1px', height: '36px', background: `linear-gradient(to bottom, transparent, ${G.gold}50)` }} />
        </div>
      </section>

      <GoldLine />

      {/* ═══════════════════════════════════════════════════════════════════
          CONCEITO — O QUE É COZINHA VIVA?
      ═══════════════════════════════════════════════════════════════════ */}
      <section id="conceito" style={{ background: lightSec, color: T.text, padding: '6rem 1.5rem', transition: 'background 0.3s' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <SectionTag label="O Conceito" />
            <h2 style={{ fontFamily: serif, fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 700,
                         margin: '1rem 0 0', color: G.dark, lineHeight: 1.2 }}>
              O que é Cozinha Viva?
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem', alignItems: 'start' }}>
            <div>
              <p style={{ fontSize: '1.05rem', lineHeight: 1.9, color: '#3D2E1E', marginBottom: '1.25rem' }}>
                "Viva" não é um adjetivo. É uma declaração.
              </p>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.85, color: '#5A4435' }}>
                Cada ingrediente que entra na cozinha da Nefertari passou por uma escolha consciente.
                Não usamos o que não reconhecemos. Não montamos o que não cozinhamos.
                Não vendemos o que não acreditamos.
              </p>
            </div>
            <div>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.85, color: '#5A4435', marginBottom: '1.25rem' }}>
                Inspirada nas civilizações que entendiam a alimentação como ritual — do Kemet às feiras
                livres do interior da Bahia — a Nefertari eleva o lanche a uma experiência gastronômica.
              </p>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.85, color: '#5A4435' }}>
                Texturas, camadas, sabores inesperados: um babaganoush aqui,
                um molho de castanhas ali. Feito com tempo. Feito com intenção.
              </p>
            </div>
          </div>

          {/* pull quote */}
          <div style={{ margin: '3.5rem 0 0', padding: '2rem 2.5rem',
                        borderLeft: `3px solid ${G.gold}`,
                        background: 'rgba(200,148,26,0.06)', borderRadius: '0 1rem 1rem 0' }}>
            <p style={{ fontFamily: serif, fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
                        color: G.dark, fontStyle: 'italic', lineHeight: 1.6, margin: 0 }}>
              "Cada detalhe importa. Cada ingrediente tem uma razão de estar aqui.
              Isso não é fast food — é uma cozinha que respira."
            </p>
            <p style={{ color: G.gold, fontSize: '0.75rem', fontWeight: 600,
                        letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: '1rem' }}>
              — Jéssica, fundadora
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          RAÍZES — ANCESTRALIDADE
      ═══════════════════════════════════════════════════════════════════ */}
      <section style={{
        padding: '6rem 1.5rem',
        background: dark ? `linear-gradient(160deg, ${G.dark2} 0%, #1A1008 50%, ${G.dark2} 100%)` : G.sand,
        position: 'relative', overflow: 'hidden',
      }}>
        {/* decorative glyph */}
        <div style={{ position: 'absolute', right: '-2rem', top: '50%', transform: 'translateY(-50%)',
                      fontSize: '18rem', lineHeight: 1, color: 'rgba(200,148,26,0.04)',
                      fontFamily: serif, userSelect: 'none', pointerEvents: 'none' }}>
          △
        </div>

        <div style={{ maxWidth: '700px', margin: '0 auto', position: 'relative' }}>
          <SectionTag label="Raízes" light />
          <h2 style={{ fontFamily: serif, fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700,
                       margin: '1rem 0 1.5rem', lineHeight: 1.2, color: G.parch }}>
            Ancorada em algo<br />
            <span style={{ color: G.gold }}>muito mais antigo.</span>
          </h2>
          <p style={{ color: G.muted, lineHeight: 1.85, fontSize: '0.95rem', marginBottom: '1.25rem' }}>
            O nome Nefertari não é acidente. Evoca civilizações que tratavam a alimentação como
            ato sagrado — civilizações que entendiam que o que entra no corpo molda o que sai da mente.
          </p>
          <p style={{ color: G.muted, lineHeight: 1.85, fontSize: '0.95rem', marginBottom: '2.5rem' }}>
            A pirâmide no logo é força e permanência. O sol é energia e vida. A folhagem é a terra
            e o frescor de cada ingrediente. Juntos, formam uma marca que não se disfarça — sabe
            o que é e para quem é.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {['Ancestralidade', 'Intenção', 'Frescor', 'Autenticidade', 'Consciência'].map(tag => (
              <span key={tag} style={{
                padding: '0.4rem 1rem', borderRadius: '99px',
                border: `1px solid rgba(200,148,26,0.25)`,
                color: G.gold, fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.05em',
              }}>{tag}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          NOSSA CHEF
      ═══════════════════════════════════════════════════════════════════ */}
      <section id="chef" style={{ background: lightSec, padding: '6rem 1.5rem', transition: 'background 0.3s' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '4rem', alignItems: 'center' }}>

            {/* photo placeholder */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{
                width: '220px', height: '220px', borderRadius: '50%', flexShrink: 0,
                border: `3px solid rgba(200,148,26,0.3)`,
                overflow: 'hidden', position: 'relative',
                boxShadow: '0 8px 40px rgba(200,148,26,0.15)',
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/jessica.jpg" alt="Jéssica Souza — Fundadora da Nefertari"
                     style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
              </div>

              <div style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: serif, fontSize: '1.15rem', fontWeight: 700, color: G.dark, marginBottom: '0.2rem' }}>
                  Jéssica Souza
                </p>
                <p style={{ color: G.gold, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                  Fundadora & Chef
                </p>
              </div>
            </div>

            {/* bio */}
            <div>
              <SectionTag label="Nossa Chef" />
              <h2 style={{ fontFamily: serif, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 700,
                           color: G.dark, margin: '1rem 0 1.25rem', lineHeight: 1.2 }}>
                Uma cozinheira que<br />
                <span style={{ color: G.terra }}>acredita no que faz.</span>
              </h2>

              <p style={{ color: '#5A4435', lineHeight: 1.85, fontSize: '0.95rem', marginBottom: '1rem' }}>
                Jéssica construiu a Nefertari a partir de uma convicção simples: comer bem não precisa ser
                complicado, mas precisa ser real. Cada receita saiu de uma pesquisa, de uma tentativa, de
                um acerto — e de muita vontade de oferecer algo diferente em Jequié.
              </p>

              <p style={{ color: '#5A4435', lineHeight: 1.85, fontSize: '0.95rem', marginBottom: '2rem' }}>
                Antes da Nefertari havia a Safrão da Terra — e antes disso, uma cozinheira que não
                se contentava com o genérico. A transição não foi só de nome. Foi de propósito.
                Uma cozinha que se abriu para mais pessoas, sem abrir mão de nenhum detalhe.
              </p>

              <blockquote style={{
                borderLeft: `3px solid ${G.terra}`,
                paddingLeft: '1.25rem', margin: 0,
                background: 'rgba(139,64,48,0.05)', borderRadius: '0 0.75rem 0.75rem 0',
                padding: '1rem 1.25rem',
              }}>
                <p style={{ fontFamily: serif, fontSize: '1rem', color: G.dark,
                            fontStyle: 'italic', lineHeight: 1.65, margin: 0 }}>
                  "Não faço comida para impressionar. Faço para nutrir — e isso muda tudo sobre
                  como eu escolho cada ingrediente."
                </p>
                <p style={{ color: G.terra, fontSize: '0.72rem', fontWeight: 600,
                            letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '0.75rem' }}>
                  — Jéssica Souza
                </p>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      <GoldLine />

      {/* ═══════════════════════════════════════════════════════════════════
          CARDÁPIO PREVIEW
      ═══════════════════════════════════════════════════════════════════ */}
      <section id="cardapio" style={{ background: dark ? G.sand : T.bg2, padding: '6rem 1.5rem', transition: 'background 0.3s' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <SectionTag label="Cardápio" />
            <h2 style={{ fontFamily: serif, fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700,
                         margin: '1rem 0 0.75rem', color: G.dark, lineHeight: 1.2 }}>
              Comer bem não deveria<br />ser difícil.
            </h2>
            <p style={{ color: '#6B5040', fontSize: '0.95rem', maxWidth: '420px', margin: '0 auto' }}>
              Na Nefertari, você encontra lanches feitos de verdade — para quem sabe o que quer e não aceita menos.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
            {menuCategories.map(cat => (
              <div key={cat.name} style={{
                background: '#FFFFFF', borderRadius: '1.25rem',
                border: '1px solid #E8D9BA', padding: '1.75rem',
                transition: 'box-shadow 0.2s, transform 0.2s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)';
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                (e.currentTarget as HTMLDivElement).style.transform = 'none';
              }}>
                <span style={{ fontSize: '1.8rem', color: cat.color, display: 'block', marginBottom: '1rem' }}>
                  {cat.glyph}
                </span>
                <p style={{ fontFamily: serif, fontSize: '1.05rem', fontWeight: 700,
                            color: G.dark, marginBottom: '0.3rem' }}>{cat.name}</p>
                <p style={{ color: cat.color, fontSize: '0.7rem', fontWeight: 600,
                            letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                  {cat.highlight}
                </p>
                <p style={{ color: '#6B5040', fontSize: '0.85rem', lineHeight: 1.7 }}>{cat.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link href="/cardapio"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                           background: G.dark, color: G.parch, padding: '0.9rem 2rem',
                           borderRadius: '99px', fontWeight: 600, fontSize: '0.95rem',
                           textDecoration: 'none', letterSpacing: '0.02em' }}>
              Ver cardápio completo <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          NOSSO JEITO
      ═══════════════════════════════════════════════════════════════════ */}
      <section id="jeito" style={{ background: lightSec, padding: '6rem 1.5rem', transition: 'background 0.3s' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <SectionTag label="Nosso Jeito" />
            <h2 style={{ fontFamily: serif, fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700,
                         margin: '1rem 0 0', color: G.dark, lineHeight: 1.2 }}>
              O que nos define.
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {/* somos */}
            <div style={{ background: '#fff', borderRadius: '1.25rem', border: '1px solid #E8D9BA', padding: '2rem' }}>
              <p style={{ color: G.green, fontSize: '0.65rem', fontWeight: 700,
                          letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                ✓ O que somos
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {pillars.map(p => (
                  <div key={p.label} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <span style={{ color: G.green, fontWeight: 700, marginTop: '2px', flexShrink: 0 }}>✓</span>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '0.9rem', color: G.dark, marginBottom: '0.2rem' }}>{p.label}</p>
                      <p style={{ color: '#6B5040', fontSize: '0.82rem', lineHeight: 1.6 }}>{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* não somos */}
            <div style={{ background: '#fff', borderRadius: '1.25rem',
                          border: `1px solid rgba(139,64,48,0.2)`, padding: '2rem' }}>
              <p style={{ color: G.terra, fontSize: '0.65rem', fontWeight: 700,
                          letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                ✗ O que não somos
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {nots.map(n => (
                  <div key={n} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <span style={{ color: '#C47A60', flexShrink: 0 }}>✗</span>
                    <p style={{ color: '#6B5040', fontSize: '0.88rem' }}>{n}</p>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '2rem', padding: '1.25rem',
                            background: 'rgba(200,148,26,0.06)', borderRadius: '0.75rem',
                            borderLeft: `2px solid ${G.gold}` }}>
                <p style={{ fontFamily: serif, fontSize: '0.9rem', color: G.dark,
                            fontStyle: 'italic', lineHeight: 1.6, margin: 0 }}>
                  "Cada detalhe importa. Não existe atalho em uma cozinha que cuida."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          ONDE & QUANDO
      ═══════════════════════════════════════════════════════════════════ */}
      <section style={{ background: dark ? G.dark2 : G.sand, padding: '5rem 1.5rem', transition: 'background 0.3s' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <SectionTag label="Onde & Quando" light />
          <h2 style={{ fontFamily: serif, fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700,
                       margin: '1rem 0 2.5rem', color: G.parch }}>
            Venha nos encontrar.
          </h2>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${G.border}`,
                          borderRadius: '1rem', padding: '1.5rem 2rem',
                          display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <MapPin size={18} color={G.gold} />
              <div style={{ textAlign: 'left' }}>
                <p style={{ color: G.muted, fontSize: '0.7rem', textTransform: 'uppercase',
                            letterSpacing: '0.15em', marginBottom: '0.2rem' }}>Localização</p>
                <p style={{ color: G.parch, fontSize: '0.9rem', fontWeight: 500 }}>Jequié, Bahia</p>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${G.border}`,
                          borderRadius: '1rem', padding: '1.5rem 2rem',
                          display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Clock size={18} color={G.gold} />
              <div style={{ textAlign: 'left' }}>
                <p style={{ color: G.muted, fontSize: '0.7rem', textTransform: 'uppercase',
                            letterSpacing: '0.15em', marginBottom: '0.2rem' }}>Horário</p>
                <p style={{ color: G.parch, fontSize: '0.9rem', fontWeight: 500 }}>Ter – Dom · 18h às 22h</p>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${G.border}`,
                          borderRadius: '1rem', padding: '1.5rem 2rem',
                          display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.1rem', color: G.gold }}>◈</span>
              <div style={{ textAlign: 'left' }}>
                <p style={{ color: G.muted, fontSize: '0.7rem', textTransform: 'uppercase',
                            letterSpacing: '0.15em', marginBottom: '0.2rem' }}>Instagram</p>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                   style={{ color: G.parch, fontSize: '0.9rem', fontWeight: 500, textDecoration: 'none' }}>
                  @nefertaricozinhaviva
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          FOOTER CTA
      ═══════════════════════════════════════════════════════════════════ */}
      <section style={{
        padding: '7rem 1.5rem',
        background: dark
          ? `radial-gradient(ellipse 70% 50% at 50% 50%, rgba(200,148,26,0.12) 0%, transparent 70%), ${G.dark}`
          : `radial-gradient(ellipse 70% 50% at 50% 50%, rgba(200,148,26,0.08) 0%, transparent 70%), ${G.parch}`,
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          <span style={{ fontSize: '2rem', color: `${G.gold}60`, display: 'block', marginBottom: '1.5rem' }}>◈</span>
          <h2 style={{ fontFamily: serif, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700,
                       color: G.parch, lineHeight: 1.2, marginBottom: '1rem' }}>
            Pronto para comer<br />
            <span style={{ color: G.gold }}>de verdade?</span>
          </h2>
          <p style={{ color: G.muted, fontSize: '0.95rem', lineHeight: 1.7,
                      marginBottom: '2.5rem', maxWidth: '380px', margin: '0 auto 2.5rem' }}>
            Veja o cardápio completo, escolha o que vai te nutrir hoje e faça seu pedido diretamente — sem aplicativo, sem taxa.
          </p>
          <Link href="/cardapio"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
                         background: G.gold, color: G.dark, padding: '1rem 2.25rem',
                         borderRadius: '99px', fontWeight: 700, fontSize: '1rem',
                         textDecoration: 'none', letterSpacing: '0.02em' }}>
            Fazer meu pedido <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════════════════════════ */}
      <footer style={{ background: dark ? '#0C0904' : G.sand, borderTop: `1px solid ${dark ? G.border : '#E8D9BA'}`,
                       padding: '2rem 1.5rem', textAlign: 'center' }}>
        <p style={{ fontFamily: serif, color: `${G.parch}30`, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
          Nefertari Cozinha Viva
        </p>
        <p style={{ color: `${G.muted}60`, fontSize: '0.7rem', marginBottom: '1.25rem' }}>
          Jequié, Bahia · {new Date().getFullYear()}
        </p>
        <Link href="/painel"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.4rem 0.9rem', borderRadius: '99px',
                border: '1px solid rgba(255,255,255,0.07)',
                color: 'rgba(255,255,255,0.2)', fontSize: '0.65rem',
                textDecoration: 'none', letterSpacing: '0.12em', textTransform: 'uppercase',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(200,148,26,0.4)';
                (e.currentTarget as HTMLAnchorElement).style.color = G.gold;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.07)';
                (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.2)';
              }}>
          ◈ Admin
        </Link>
      </footer>
    </div>
  );
}
