'use client';

import React, { useState } from 'react';
import { Sun, Moon, ArrowRight, Check, Copy, ChevronDown, ChevronUp } from 'lucide-react';

// ─── Theme tokens ─────────────────────────────────────────────────────────────
const dark = {
  bg: '#12100E', bgSection: 'rgba(255,255,255,0.02)', bgCard: 'rgba(255,255,255,0.03)',
  bgFooter: '#0A0908',
  border: 'rgba(255,255,255,0.06)', borderGold: 'rgba(212,175,55,0.22)',
  text: '#E8E5DF', textHead: '#FDFBF7', textMuted: '#A39D93', textDim: '#6B6560',
  textGold: '#D4AF37', textGreen: '#8BAA6D', textBrown: '#C49A6C',
  toggleBg: 'rgba(255,255,255,0.06)', toggleBorder: 'rgba(255,255,255,0.1)', toggleIcon: '#D4AF37',
  ambientA: 'bg-[#5C7148]/10', ambientB: 'bg-[#D4AF37]/10',
  sectionLabel: 'rgba(212,175,55,0.12)',
};
const light = {
  bg: '#F5F0E8', bgSection: 'rgba(0,0,0,0.03)', bgCard: '#FFFFFF',
  bgFooter: '#EDE8DF',
  border: 'rgba(0,0,0,0.08)', borderGold: 'rgba(139,90,43,0.28)',
  text: '#2C2520', textHead: '#1A1208', textMuted: '#6B5E50', textDim: '#9C8E80',
  textGold: '#8B5A2B', textGreen: '#4A7A3A', textBrown: '#8B5A2B',
  toggleBg: 'rgba(0,0,0,0.06)', toggleBorder: 'rgba(0,0,0,0.12)', toggleIcon: '#8B5A2B',
  ambientA: 'bg-[#5C7148]/5', ambientB: 'bg-[#D4AF37]/5',
  sectionLabel: 'rgba(139,90,43,0.1)',
};

// ─── Brand palette ─────────────────────────────────────────────────────────────
const palette = [
  {
    group: 'Cor Primária',
    colors: [
      { name: 'Ouro Real',   hex: '#D4AF37', rgb: '212, 175, 55',  usage: 'Logo, CTAs, títulos de destaque, elementos âncora da marca.' },
      { name: 'Ouro Suave',  hex: '#E6C27A', rgb: '230, 194, 122', usage: 'Gradientes, hover states, versão clara do ouro em fundos escuros.' },
    ],
  },
  {
    group: 'Cor Secundária',
    colors: [
      { name: 'Verde Vivo',  hex: '#8BAA6D', rgb: '139, 170, 109', usage: 'Tags, ícones de check, selos de saudável, conteúdo sobre ingredientes.' },
      { name: 'Verde Raiz',  hex: '#5C7148', rgb: '92, 113, 72',   usage: 'Versão escura do verde. Títulos de seção, bordas em fundo claro.' },
    ],
  },
  {
    group: 'Cor de Apoio',
    colors: [
      { name: 'Café Quente', hex: '#8B5A2B', rgb: '139, 90, 43',   usage: 'Prefixos "R$", subtítulos, elementos terrosos que remetem à raiz.' },
      { name: 'Caqui',       hex: '#C49A6C', rgb: '196, 154, 108', usage: 'Destaques leves, ícones secundários, versão clara do café.' },
    ],
  },
  {
    group: 'Neutros',
    colors: [
      { name: 'Noite',      hex: '#12100E', rgb: '18, 16, 14',    usage: 'Fundo principal no tema escuro. Nunca usar como texto sobre fundos escuros.' },
      { name: 'Obsidiana',  hex: '#0A0908', rgb: '10, 9, 8',      usage: 'Footer, camadas mais profundas. Variação de fundo escuro.' },
      { name: 'Areia',      hex: '#E8E5DF', rgb: '232, 229, 223', usage: 'Texto principal em tema escuro. Legibilidade máxima.' },
      { name: 'Creme',      hex: '#F5F0E8', rgb: '245, 240, 232', usage: 'Fundo principal no tema claro. Tom quente, nunca branco puro.' },
    ],
  },
];

// ─── Typography scale ─────────────────────────────────────────────────────────
const typographyScale = [
  { label: 'Display',    font: 'Playfair Display', weight: '700', size: '3.5rem',  sample: 'Cozinha Viva',           use: 'Hero headlines, nomes de seção principais.' },
  { label: 'H1',         font: 'Playfair Display', weight: '600', size: '2.25rem', sample: 'Cada detalhe importa.',   use: 'Títulos de seção, headlines de posts.' },
  { label: 'H2',         font: 'Playfair Display', weight: '400', size: '1.5rem',  sample: 'Feito com intenção.',     use: 'Subtítulos, pull quotes.' },
  { label: 'Body',       font: 'Inter',            weight: '300', size: '0.938rem',sample: 'Ingredientes escolhidos com propósito, preparados com técnica e servidos com cuidado.', use: 'Textos corridos, descrições.' },
  { label: 'Caption',    font: 'Inter',            weight: '700', size: '0.688rem',sample: 'NUTRIÇÃO ANCESTRAL',      use: 'Tags, labels, badges — sempre em maiúsculas.' },
];

// ─── Voice personality ────────────────────────────────────────────────────────
const personality = [
  { word: 'Ancestral',    desc: 'Conectada às raízes. Cada produto carrega história, memória e sabedoria passada de geração em geração.' },
  { word: 'Intencional',  desc: 'Nada é por acaso. Cada escolha de ingrediente, de embalagem, de palavra, tem um propósito claro.' },
  { word: 'Viva',         desc: 'Presente, vibrante, energizada. A marca não é estática — ela pulsa como a cozinha que a originou.' },
  { word: 'Acolhedora',   desc: 'Todo cliente é recebido como alguém que merece cuidado. Tom caloroso, nunca frio ou corporativo.' },
  { word: 'Autêntica',    desc: 'Sem artifícios. A Nefertari não vende promessas vazias — entrega o que é, como é, sem exagero.' },
  { word: 'Premium',      desc: 'Qualidade sem concessões. A linguagem reflete isso: precisa, elegante, sem ruído desnecessário.' },
];

const voiceExamples = [
  {
    context: 'Descrição de produto',
    do:   '"Wrap de frango grelhado com mix de folhas, húmus artesanal e azeite de ervas — feito com intenção, para você se sentir bem por dentro."',
    dont: '"Super Wrap Saudável com muita proteína! Perfeito pra quem quer emagrecer!"',
  },
  {
    context: 'Legenda de Instagram',
    do:   '"Alimentar é sagrado. Cada prato que sai da nossa cozinha carrega cuidado — do ingrediente à embalagem."',
    dont: '"Aproveite nossa promoção de hoje! Peça agora e ganhe desconto! 🎉🎉🎉"',
  },
  {
    context: 'CTA (Call to action)',
    do:   '"Monte o seu pedido →"  /  "Conheça o cardápio"  /  "Fale com a Nefertari"',
    dont: '"CLIQUE AQUI!" / "Compre já!" / "Não perca!"',
  },
  {
    context: 'Resposta a cliente',
    do:   '"Olá, Beatriz! Fico feliz que você gostou — cada detalhe desse prato foi pensado com carinho. Até logo! 🌿"',
    dont: '"Obrigado pelo feedback! Continuem nos seguindo para mais conteúdo!"',
  },
];

const manifesto = `A Nefertari nasceu de uma crença simples:
comer bem é um ato de respeito por si mesmo.

Cada ingrediente foi escolhido com intenção.
Cada receita foi construída com tempo.
Cada prato carrega um pouco de quem somos —
e tudo que acreditamos sobre alimentação.

Aqui, a cozinha é viva.
E o que é vivo, cuida.`;

export default function BrandGuide() {
  const [isDark, setIsDark] = useState(true);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [openVoice, setOpenVoice] = useState<number | null>(0);
  const t = isDark ? dark : light;

  function copyHex(hex: string) {
    navigator.clipboard.writeText(hex).catch(() => {});
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1800);
  }

  function isDarkColor(hex: string) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 < 128;
  }

  return (
    <div className="min-h-screen font-sans transition-colors duration-300" style={{ backgroundColor: t.bg, color: t.text }}>

      {/* Ambient blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[150px] ${t.ambientA}`} />
        <div className={`absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[150px] ${t.ambientB}`} />
      </div>

      {/* Theme toggle */}
      <button
        onClick={() => setIsDark(!isDark)}
        className="fixed top-5 right-5 z-50 w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
        style={{ backgroundColor: t.toggleBg, border: `1px solid ${t.toggleBorder}`, backdropFilter: 'blur(12px)' }}
        aria-label="Alternar tema"
      >
        {isDark ? <Sun className="w-5 h-5" style={{ color: t.toggleIcon }} /> : <Moon className="w-5 h-5" style={{ color: t.toggleIcon }} />}
      </button>

      {/* ── HERO ── */}
      <section className="relative z-10 px-6" style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center' }}>
        <div className="max-w-4xl mx-auto w-full py-8 text-center">

          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-3xl scale-150" style={{ backgroundColor: isDark ? 'rgba(212,175,55,0.1)' : 'rgba(139,90,43,0.07)' }} />
              <img
                src="/nefertari-logo-golden.png"
                onError={(e) => { const el = e.target as HTMLImageElement; el.onerror = null; el.src = 'https://placehold.co/220x220/12100E/D4AF37?text=N'; }}
                alt="Nefertari Logo"
                className="relative object-contain"
                style={{ height: 'clamp(160px, 22dvh, 260px)', width: 'clamp(160px, 22dvh, 260px)', filter: isDark ? 'none' : 'brightness(0.85)' }}
              />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-5" style={{ backgroundColor: t.sectionLabel, border: `1px solid ${t.borderGold}` }}>
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: t.textGold }}>Guia de Identidade de Marca</span>
          </div>

          <h1 className="mb-4 leading-[1.08]" style={{ fontFamily: 'var(--font-playfair)', color: t.textHead, fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            Jéssica, sua marca{' '}
            <br className="hidden sm:block" />
            <span style={{ background: 'linear-gradient(90deg, #D4AF37 0%, #E6C27A 60%, #8BAA6D 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              agora tem forma.
            </span>
          </h1>

          <p className="max-w-xl mx-auto text-sm leading-relaxed font-light mb-8" style={{ color: t.textMuted }}>
            Este guia é o DNA visual e verbal da Nefertari. Use-o como referência para cada peça — seja um post, uma embalagem ou uma resposta para cliente. A consistência é o que transforma uma marca boa numa marca inesquecível.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {['#logo', '#paleta', '#tipografia', '#voz', '#manifesto'].map((anchor, i) => {
              const labels = ['Logotipo', 'Paleta', 'Tipografia', 'Tom de Voz', 'Manifesto'];
              return (
                <a
                  key={anchor}
                  href={anchor}
                  className="px-5 py-2 rounded-full text-sm font-medium transition-all hover:opacity-80"
                  style={i === 0
                    ? { backgroundColor: '#D4AF37', color: '#12100E' }
                    : { border: `1px solid ${t.border}`, color: t.text }
                  }
                >
                  {labels[i]}
                </a>
              );
            })}
          </div>

        </div>
      </section>

      {/* ── LOGO ── */}
      <section id="logo" className="relative z-10 py-24 transition-colors" style={{ backgroundColor: t.bgSection, borderTop: `1px solid ${t.border}` }}>
        <div className="max-w-4xl mx-auto px-6">
          <SectionLabel label="01 — Logotipo" t={t} />
          <h2 className="text-4xl md:text-5xl mb-4" style={{ fontFamily: 'var(--font-playfair)', color: t.textHead }}>O Símbolo da Marca</h2>
          <p className="text-base font-light leading-relaxed max-w-2xl mb-14" style={{ color: t.textMuted }}>
            O logotipo é o elemento mais importante da identidade. Respeite sempre as regras de uso para garantir que a marca seja percebida com a mesma força em qualquer contexto.
          </p>

          <div className="grid md:grid-cols-3 gap-5 mb-10">
            {/* Primary logo — dark bg */}
            <div className="rounded-2xl p-8 flex flex-col items-center gap-4" style={{ backgroundColor: '#12100E', border: '1px solid rgba(212,175,55,0.15)' }}>
              <img src="/nefertari-logo-golden.png" alt="Logo versão principal" className="object-contain" style={{ height: 120, width: 120 }} />
              <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#D4AF37' }}>Versão Principal</p>
                <p className="text-xs font-light" style={{ color: '#A39D93' }}>Sobre fundo escuro</p>
              </div>
            </div>
            {/* Light bg version */}
            <div className="rounded-2xl p-8 flex flex-col items-center gap-4" style={{ backgroundColor: '#F5F0E8', border: '1px solid rgba(139,90,43,0.2)' }}>
              <img src="/nefertari-logo-golden.png" alt="Logo versão clara" className="object-contain" style={{ height: 120, width: 120, filter: 'brightness(0.75)' }} />
              <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#8B5A2B' }}>Versão Clara</p>
                <p className="text-xs font-light" style={{ color: '#6B5E50' }}>Sobre fundo creme</p>
              </div>
            </div>
            {/* Transparent bg version */}
            <div className="rounded-2xl p-8 flex flex-col items-center gap-4" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'20\' height=\'20\'%3E%3Crect width=\'10\' height=\'10\' fill=\'%23ccc\' opacity=\'0.3\'/%3E%3Crect x=\'10\' y=\'10\' width=\'10\' height=\'10\' fill=\'%23ccc\' opacity=\'0.3\'/%3E%3C/svg%3E")', border: `1px solid ${t.border}`, borderRadius: '1rem' }}>
              <img src="/logo-transparent.webp" alt="Logo fundo transparente" className="object-contain" style={{ height: 120, width: 120 }} />
              <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: t.textGold }}>Fundo Transparente</p>
                <p className="text-xs font-light" style={{ color: t.textMuted }}>Arquivo .webp para uso digital</p>
              </div>
            </div>
          </div>

          {/* Do / Don't */}
          <div className="grid md:grid-cols-2 gap-5">
            <div className="rounded-2xl p-6" style={{ backgroundColor: isDark ? 'rgba(92,113,72,0.07)' : 'rgba(74,122,58,0.06)', border: '1px solid rgba(92,113,72,0.22)' }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#8BAA6D' }}>✓ Uso Correto</p>
              <ul className="space-y-2">
                {['Sempre sobre fundos sólidos (escuro ou creme).', 'Manter proporção original — nunca distorcer.', 'Espaço mínimo ao redor equivalente à altura da letra "N" do logotipo.', 'Usar apenas nas variações entregues (ouro, marrom, monocromático).'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm font-light" style={{ color: t.textMuted }}>
                    <span style={{ color: '#8BAA6D', flexShrink: 0 }}>•</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl p-6" style={{ backgroundColor: isDark ? 'rgba(180,60,60,0.05)' : 'rgba(180,60,60,0.04)', border: '1px solid rgba(180,60,60,0.18)' }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#B44C4C' }}>✗ Uso Incorreto</p>
              <ul className="space-y-2">
                {['Não alterar as cores do logotipo.', 'Não aplicar sombras, contornos ou efeitos externos.', 'Não posicionar sobre fotos ou fundos texturizados sem sobreposição sólida.', 'Não redimensionar abaixo de 40px de altura em telas.'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm font-light" style={{ color: t.textMuted }}>
                    <span style={{ color: '#B44C4C', flexShrink: 0 }}>•</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── PALETTE ── */}
      <section id="paleta" className="relative z-10 py-24" style={{ borderTop: `1px solid ${t.border}` }}>
        <div className="max-w-4xl mx-auto px-6">
          <SectionLabel label="02 — Paleta de Cores" t={t} />
          <h2 className="text-4xl md:text-5xl mb-4" style={{ fontFamily: 'var(--font-playfair)', color: t.textHead }}>As Cores da Nefertari</h2>
          <p className="text-base font-light leading-relaxed max-w-2xl mb-14" style={{ color: t.textMuted }}>
            Cada cor foi escolhida com intenção. Clique em qualquer swatch para copiar o código hexadecimal.
          </p>

          <div className="space-y-10">
            {palette.map((group, gi) => (
              <div key={gi}>
                <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: t.textGold }}>{group.group}</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {group.colors.map((color) => (
                    <button
                      key={color.hex}
                      onClick={() => copyHex(color.hex)}
                      className="rounded-2xl overflow-hidden transition-transform hover:-translate-y-0.5 cursor-pointer text-left group"
                      style={{ border: `1px solid ${t.border}` }}
                    >
                      {/* Swatch */}
                      <div className="h-20 w-full flex items-end justify-between px-4 pb-3" style={{ backgroundColor: color.hex }}>
                        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: isDarkColor(color.hex) ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)' }}>
                          {color.hex}
                        </span>
                        <div className="w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: isDarkColor(color.hex) ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)' }}>
                          {copiedHex === color.hex
                            ? <Check className="w-3.5 h-3.5" style={{ color: isDarkColor(color.hex) ? '#fff' : '#000' }} />
                            : <Copy className="w-3.5 h-3.5" style={{ color: isDarkColor(color.hex) ? '#fff' : '#000' }} />
                          }
                        </div>
                      </div>
                      {/* Info */}
                      <div className="px-4 py-4" style={{ backgroundColor: t.bgCard }}>
                        <p className="text-sm font-semibold mb-0.5" style={{ fontFamily: 'var(--font-playfair)', color: t.textHead }}>{color.name}</p>
                        <p className="text-[11px] mb-2" style={{ color: t.textDim }}>rgb({color.rgb})</p>
                        <p className="text-xs font-light leading-relaxed" style={{ color: t.textMuted }}>{color.usage}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TYPOGRAPHY ── */}
      <section id="tipografia" className="relative z-10 py-24 transition-colors" style={{ backgroundColor: t.bgSection, borderTop: `1px solid ${t.border}`, borderBottom: `1px solid ${t.border}` }}>
        <div className="max-w-4xl mx-auto px-6">
          <SectionLabel label="03 — Tipografia" t={t} />
          <h2 className="text-4xl md:text-5xl mb-4" style={{ fontFamily: 'var(--font-playfair)', color: t.textHead }}>As Fontes da Marca</h2>
          <p className="text-base font-light leading-relaxed max-w-2xl mb-14" style={{ color: t.textMuted }}>
            A Nefertari usa duas famílias tipográficas complementares: <strong style={{ color: t.textHead }}>Playfair Display</strong> para emoção e identidade, e <strong style={{ color: t.textHead }}>Inter</strong> para clareza e leiturabilidade.
          </p>

          {/* Font family cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {[
              { name: 'Playfair Display', role: 'Fonte Editorial', use: 'Títulos, headings, hero text, quotes, nomes de produtos.', sample: 'Aa Bb Cc Dd Ee\nFf Gg Hh Ii Jj', note: 'Serif clássico com serifa elegante. Evoca tradição, sofisticação e permanência.' },
              { name: 'Inter',            role: 'Fonte de Interface', use: 'Corpo de texto, legendas, botões, navegação, descrições.', sample: 'Aa Bb Cc Dd Ee\nFf Gg Hh Ii Jj', note: 'Sans-serif moderno e neutro. Excelente legibilidade em telas de qualquer tamanho.' },
            ].map((font) => (
              <div key={font.name} className="rounded-2xl p-7" style={{ backgroundColor: t.bgCard, border: `1px solid ${t.border}` }}>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: t.textGold }}>{font.role}</p>
                <h3 className="text-2xl mb-1 font-bold" style={{ fontFamily: font.name === 'Playfair Display' ? 'var(--font-playfair)' : 'var(--font-inter)', color: t.textHead }}>{font.name}</h3>
                <pre className="text-lg mt-4 mb-4 leading-snug whitespace-pre-line" style={{ fontFamily: font.name === 'Playfair Display' ? 'var(--font-playfair)' : 'var(--font-inter)', color: t.textMuted }}>{font.sample}</pre>
                <p className="text-xs font-light leading-relaxed mb-2" style={{ color: t.textMuted }}>{font.note}</p>
                <p className="text-[11px] font-medium" style={{ color: t.textDim }}>Uso: {font.use}</p>
              </div>
            ))}
          </div>

          {/* Scale */}
          <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${t.border}` }}>
            <div className="px-6 py-4" style={{ backgroundColor: t.bgCard, borderBottom: `1px solid ${t.border}` }}>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: t.textGold }}>Escala Tipográfica</p>
            </div>
            <div className="divide-y" style={{ borderColor: t.border }}>
              {typographyScale.map((item, i) => (
                <div key={i} className="px-6 py-5 flex flex-col md:flex-row md:items-center gap-3 md:gap-8" style={{ backgroundColor: t.bgCard }}>
                  <div className="md:w-20 shrink-0">
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded" style={{ backgroundColor: t.sectionLabel, color: t.textGold }}>{item.label}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="leading-snug truncate"
                      style={{
                        fontFamily: item.font === 'Playfair Display' ? 'var(--font-playfair)' : 'var(--font-inter)',
                        fontWeight: item.weight,
                        fontSize: item.size,
                        color: t.textHead,
                      }}
                    >
                      {item.sample}
                    </p>
                  </div>
                  <div className="md:w-56 shrink-0">
                    <p className="text-[11px]" style={{ color: t.textDim }}>{item.font} · {item.weight} · {item.size}</p>
                    <p className="text-[11px] font-light mt-0.5" style={{ color: t.textDim }}>{item.use}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── VOICE & TONE ── */}
      <section id="voz" className="relative z-10 py-24" style={{ borderTop: `1px solid ${t.border}` }}>
        <div className="max-w-4xl mx-auto px-6">
          <SectionLabel label="04 — Tom de Voz" t={t} />
          <h2 className="text-4xl md:text-5xl mb-4" style={{ fontFamily: 'var(--font-playfair)', color: t.textHead }}>Como a Nefertari Fala</h2>
          <p className="text-base font-light leading-relaxed max-w-2xl mb-14" style={{ color: t.textMuted }}>
            A voz da marca é tão importante quanto o logo. Ela aparece em cada post, cada resposta, cada embalagem. Defina-a uma vez — mantenha sempre.
          </p>

          {/* Personality traits */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-14">
            {personality.map((trait, i) => (
              <div key={i} className="rounded-2xl p-5 transition-all hover:-translate-y-0.5" style={{ backgroundColor: t.bgCard, border: `1px solid ${t.border}` }}>
                <span
                  className="block text-lg font-bold mb-2"
                  style={{
                    fontFamily: 'var(--font-playfair)',
                    background: 'linear-gradient(90deg, #D4AF37 0%, #8BAA6D 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {trait.word}
                </span>
                <p className="text-xs font-light leading-relaxed" style={{ color: t.textMuted }}>{trait.desc}</p>
              </div>
            ))}
          </div>

          {/* Voice examples accordion */}
          <p className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: t.textGold }}>Exemplos Práticos — Faça & Não Faça</p>
          <div className="space-y-3">
            {voiceExamples.map((ex, i) => (
              <div key={i} className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${openVoice === i ? t.borderGold : t.border}`, transition: 'border-color 0.2s' }}>
                <button
                  onClick={() => setOpenVoice(openVoice === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 cursor-pointer transition-colors"
                  style={{ backgroundColor: t.bgCard }}
                >
                  <span className="text-sm font-semibold text-left" style={{ color: t.textHead }}>{ex.context}</span>
                  {openVoice === i
                    ? <ChevronUp className="w-4 h-4 shrink-0" style={{ color: t.textGold }} />
                    : <ChevronDown className="w-4 h-4 shrink-0" style={{ color: t.textDim }} />
                  }
                </button>
                {openVoice === i && (
                  <div className="px-6 pb-6 pt-0 grid md:grid-cols-2 gap-4" style={{ backgroundColor: t.bgCard, borderTop: `1px solid ${t.border}` }}>
                    <div className="rounded-xl p-4 mt-4" style={{ backgroundColor: isDark ? 'rgba(92,113,72,0.08)' : 'rgba(74,122,58,0.06)', border: '1px solid rgba(92,113,72,0.22)' }}>
                      <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#8BAA6D' }}>✓ Assim</p>
                      <p className="text-sm font-light leading-relaxed italic" style={{ color: t.text }}>{ex.do}</p>
                    </div>
                    <div className="rounded-xl p-4 mt-4" style={{ backgroundColor: isDark ? 'rgba(180,60,60,0.06)' : 'rgba(180,60,60,0.04)', border: '1px solid rgba(180,60,60,0.2)' }}>
                      <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#B44C4C' }}>✗ Não Assim</p>
                      <p className="text-sm font-light leading-relaxed italic" style={{ color: t.textMuted }}>{ex.dont}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MANIFESTO ── */}
      <section id="manifesto" className="relative z-10 py-24 transition-colors" style={{ backgroundColor: t.bgSection, borderTop: `1px solid ${t.border}` }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <SectionLabel label="05 — Manifesto" t={t} centered />
          <h2 className="text-4xl md:text-5xl mb-12" style={{ fontFamily: 'var(--font-playfair)', color: t.textHead }}>A Crença da Marca</h2>

          <div className="relative">
            <div className="absolute -left-2 top-0 bottom-0 w-0.5 rounded-full hidden md:block" style={{ background: 'linear-gradient(180deg, #D4AF37 0%, #8BAA6D 100%)' }} />
            <div className="md:pl-8 text-left">
              {manifesto.split('\n').map((line, i) => (
                line === ''
                  ? <div key={i} className="h-5" />
                  : <p
                      key={i}
                      className="leading-relaxed"
                      style={{
                        fontFamily: 'var(--font-playfair)',
                        fontSize: i === 0 || i === 7 || i === 9 ? '1.25rem' : '1rem',
                        fontWeight: i === 0 || i === 7 || i === 9 ? '600' : '300',
                        color: i === 0 || i === 7 ? t.textHead : t.textMuted,
                      }}
                    >
                      {line}
                    </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 py-20 text-center transition-colors" style={{ backgroundColor: t.bgFooter, borderTop: `1px solid ${t.border}` }}>
        <div className="max-w-3xl mx-auto px-6">
          <img
            src="/nefertari-logo-golden.png"
            alt="Nefertari"
            className="mx-auto object-contain mb-6"
            style={{ height: 64, width: 64, filter: isDark ? 'none' : 'brightness(0.8)' }}
          />
          <h2 className="text-2xl md:text-3xl mb-4" style={{ fontFamily: 'var(--font-playfair)', color: t.textHead }}>
            A marca está viva. Agora vamos construir o site.
          </h2>
          <p className="text-sm font-light mb-8 max-w-md mx-auto leading-relaxed" style={{ color: t.textMuted }}>
            Com a identidade definida, o próximo passo é o site profissional e o sistema de pedidos. Cada pixel vai carregar o DNA que criamos juntos aqui.
          </p>
          <a
            href={`https://wa.me/5573988083318?text=${encodeURIComponent('Olá! Já revisei o guia de identidade da Nefertari. Podemos avançar para o site e o sistema de pedidos?')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-medium transition-all hover:opacity-90"
            style={{ backgroundColor: '#D4AF37', color: '#12100E' }}
          >
            Avançar para o site <ArrowRight className="w-5 h-5" />
          </a>
          <div className="mt-16 pt-6 text-xs tracking-widest uppercase" style={{ color: t.textDim, borderTop: `1px solid ${t.border}` }}>
            &copy; {new Date().getFullYear()} Guia de Identidade Nefertari Cozinha Viva — Confidencial
          </div>
        </div>
      </footer>

    </div>
  );
}

// ─── Helper component ─────────────────────────────────────────────────────────
function SectionLabel({ label, t, centered }: { label: string; t: typeof dark; centered?: boolean }) {
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 ${centered ? 'mx-auto' : ''}`} style={{ backgroundColor: t.sectionLabel, border: `1px solid ${t.borderGold}`, display: centered ? 'flex' : 'inline-flex', justifyContent: centered ? 'center' : undefined, width: centered ? 'fit-content' : undefined, marginLeft: centered ? 'auto' : undefined, marginRight: centered ? 'auto' : undefined }}>
      <span className="text-xs font-bold uppercase tracking-widest" style={{ color: t.textGold }}>{label}</span>
    </div>
  );
}
