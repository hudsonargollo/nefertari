'use client';

import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

// ─── Palette data ─────────────────────────────────────────────────────────────
const palette = [
  {
    group: 'Ouro', label: 'Primária',
    colors: [
      { name: 'Ouro Mustarda',   hex: '#C8941A', rgb: '200, 148, 26',  usage: 'Logo, CTAs, títulos principais, elementos âncora da marca.' },
      { name: 'Ouro Luminoso',   hex: '#E6B84A', rgb: '230, 184, 74',  usage: 'Hover states, gradientes, versão luminosa em fundos escuros.' },
    ],
  },
  {
    group: 'Verde Sálvia', label: 'Secundária',
    colors: [
      { name: 'Sálvia',          hex: '#6B8C3E', rgb: '107, 140, 62',  usage: 'Tags de saudável, elementos naturais, ícones de ingrediente.' },
      { name: 'Verde Floresta',  hex: '#4A6228', rgb: '74, 98, 40',    usage: 'Variação escura. Bordas e textos de seção em fundo claro.' },
    ],
  },
  {
    group: 'Marrom Terra', label: 'Apoio',
    colors: [
      { name: 'Terracota',       hex: '#8B4030', rgb: '139, 64, 48',   usage: 'Elementos raiz, subtítulos, prefixos e detalhes terrosos.' },
      { name: 'Terracota Suave', hex: '#C47A60', rgb: '196, 122, 96',  usage: 'Destaques leves, ícones secundários, versão quente de apoio.' },
    ],
  },
  {
    group: 'Fundos Escuros', label: 'Modo Noturno',
    colors: [
      { name: 'Preto Quente',    hex: '#14100C', rgb: '20, 16, 12',    usage: 'Fundo premium noturno, texto principal em modo escuro.' },
      { name: 'Chumbo Marrom',   hex: '#3D2E22', rgb: '61, 46, 34',    usage: 'Cards escuros, bordas sutis sobre preto quente.' },
    ],
  },
  {
    group: 'Fundos Claros', label: 'Modo Dia',
    colors: [
      { name: 'Branco Natural',  hex: '#FAF5E8', rgb: '250, 245, 232', usage: 'Fundo principal do site. Limpo, quente e acolhedor.' },
      { name: 'Areia',           hex: '#F5E6C8', rgb: '245, 230, 200', usage: 'Seções alternadas, cards em fundo claro, camadas sutis.' },
    ],
  },
];

// ─── Brand voice ──────────────────────────────────────────────────────────────
const voice = [
  {
    attr: 'Sofisticada', glyph: '◈',
    desc: 'Cada palavra é escolhida com intenção. A comunicação é refinada, sem ser distante — como uma mesa bem posta que convida a sentar.',
    quote: '"Ingredientes que contam história. Sabores que ficam na memória."',
  },
  {
    attr: 'Com Propósito', glyph: '◉',
    desc: 'A Nefertari não vende apenas comida: vende saúde com consciência, cuidado com a origem de cada ingrediente e compromisso com o bem-estar.',
    quote: '"Feito com o que a terra tem de melhor. Pensado para o que você merece."',
  },
  {
    attr: 'Real e Regal', glyph: '◇',
    desc: 'Inspirada na grandiosidade das pirâmides, a voz carrega autoridade natural — não arrogância, mas presença. Como uma rainha que não precisa gritar.',
    quote: '"Cozinha Viva. Porque alimentar é um ato sagrado."',
  },
];

// ─── Logo symbolism ───────────────────────────────────────────────────────────
const symbols = [
  { glyph: '△', title: 'Pirâmide',    desc: 'Força, permanência e história. A base que sustenta tudo. Remete à grandeza ancestral das civilizações — solidez com elegância.' },
  { glyph: '☀', title: 'Sol & Luz',   desc: 'Crescimento, energia e vitalidade. O alimento como fonte de vida, clareza e renovação diária. A luz que nutre.' },
  { glyph: '❧', title: 'Folhagem',    desc: 'Frescor, natureza e terra. A conexão com ingredientes vivos e a origem saudável de cada prato que chega à sua mesa.' },
];

// ─── Logo usage rules ─────────────────────────────────────────────────────────
const logoCorrect = [
  'Sempre sobre fundos sólidos (escuro ou creme).',
  'Manter proporção original — nunca distorcer.',
  'Espaço mínimo ao redor equivalente à altura da letra "N" do logotipo.',
  'Usar apenas nas variações entregues (ouro, marrom, monocromático).',
];
const logoIncorrect = [
  'Não alterar as cores do logotipo.',
  'Não aplicar sombras, contornos ou efeitos externos.',
  'Não posicionar sobre fotos ou fundos texturizados sem sobreposição sólida.',
  'Não redimensionar abaixo de 40px de altura em telas.',
];

// ─── Key messages ─────────────────────────────────────────────────────────────
const messages = [
  { headline: 'Cozinha Viva',        body: '"Viva" porque cada prato pulsa com ingredientes frescos, intencionais e vivos — não processados, não artificiais. Uma cozinha que respira.' },
  { headline: 'Cada detalhe importa',body: 'Desde a escolha do fornecedor até a apresentação do prato — nada é por acaso na Nefertari. O cuidado é visível em tudo.' },
  { headline: 'Realeza acessível',   body: 'Premium não significa inalcançável. A Nefertari traz sofisticação para o cotidiano, tornando o comer bem uma experiência para todos.' },
];

// ─── Exemplos práticos ────────────────────────────────────────────────────────
const exemplos = [
  {
    titulo: 'Descrição de produto',
    assim:    'Wrap de frango grelhado com mix de folhas, húmus artesanal e azeite de ervas — feito com intenção, para você se sentir bem por dentro.',
    naoAssim: 'Super Wrap Saudável com muita proteína! Perfeito pra quem quer emagrecer!',
  },
  {
    titulo: 'Legenda de Instagram',
    assim:    'Cada ingrediente tem uma razão de estar aqui. Bowl de quinoa com legumes assados e molho de tahine — porque comer bem é um ato de cuidado. 🌿 #NefertariCozinhaViva',
    naoAssim: 'BOWL FITNESS DELICIOSO!! 😍🔥 Amei demais essa receita!! Segue a gente!! #saudavel #fit #emagrecimento',
  },
  {
    titulo: 'CTA (Call to action)',
    assim:    'Escolha o que nutre. Peça agora →',
    naoAssim: 'COMPRE AGORA!! ÚLTIMA CHANCE! NÃO PERCA!! 🔥🔥',
  },
  {
    titulo: 'Resposta a cliente',
    assim:    'Olá! Nossos pratos são preparados no dia, com ingredientes frescos e sem conservantes. Fico feliz em te ajudar a escolher. O que você está com vontade hoje?',
    naoAssim: 'Oi!! É tudo fresco sim kkkk pode pedir à vontade 😊😊',
  },
];

// ─── Type scale ───────────────────────────────────────────────────────────────
const typeScale = [
  { label: 'Display', size: '48px / 3rem',     weight: '700', font: 'Playfair Display', sample: 'Cozinha Viva' },
  { label: 'H1',      size: '36px / 2.25rem',  weight: '700', font: 'Playfair Display', sample: 'Identidade da Marca' },
  { label: 'H2',      size: '28px / 1.75rem',  weight: '600', font: 'Playfair Display', sample: 'Paleta de Cores' },
  { label: 'H3',      size: '20px / 1.25rem',  weight: '600', font: 'Inter',            sample: 'Voz e Persona' },
  { label: 'Body',    size: '16px / 1rem',      weight: '400', font: 'Inter',            sample: 'Texto corrido, descrições, parágrafos.' },
  { label: 'Caption', size: '12px / 0.75rem',   weight: '400', font: 'Inter',            sample: 'Labels, metadados, badges.' },
];

// ─── Swatch ───────────────────────────────────────────────────────────────────
function Swatch({ color }: { color: { name: string; hex: string; rgb: string; usage: string } }) {
  const [copied, setCopied] = useState(false);
  const isDark = ['#14100C','#3D2E22','#8B4030','#4A6228','#C8941A','#6B8C3E'].includes(color.hex);

  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(color.hex).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        });
      }}
      className="group w-full text-left rounded-xl overflow-hidden border border-[#E8D9BA] hover:border-[#C8941A]/60 transition-all duration-200 hover:shadow-md"
    >
      <div className="h-20 flex items-end justify-end p-3" style={{ backgroundColor: color.hex }}>
        <span className={`text-xs font-mono px-2 py-1 rounded-md backdrop-blur-sm transition-opacity opacity-0 group-hover:opacity-100 flex items-center gap-1 ${isDark ? 'bg-white/15 text-white' : 'bg-black/10 text-black'}`}>
          {copied ? <><Check size={11} /> Copiado</> : <><Copy size={11} /> {color.hex}</>}
        </span>
      </div>
      <div className="p-3 bg-white">
        <p className="text-[#14100C] font-medium text-sm leading-tight">{color.name}</p>
        <p className="text-[#8B4030] font-mono text-xs mt-0.5">{color.hex}</p>
        <p className="text-[#6B6050] text-xs mt-1.5 leading-snug">{color.usage}</p>
      </div>
    </button>
  );
}

// ─── Section label ────────────────────────────────────────────────────────────
function SectionLabel({ num, label }: { num: string; label: string }) {
  return (
    <p className="text-[#C8941A] tracking-[0.3em] text-xs uppercase font-medium mb-3">
      {num} — {label}
    </p>
  );
}

function Divider() {
  return (
    <div className="px-6 max-w-5xl mx-auto">
      <div className="h-px bg-gradient-to-r from-transparent via-[#C8941A]/30 to-transparent" />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function BrandGuideV2() {
  const [openVoice,   setOpenVoice]   = useState<number | null>(null);
  const [openExemplo, setOpenExemplo] = useState<number | null>(0);

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#FAF5E8', color: '#14100C', minHeight: '100vh' }}>

      {/* ─────────────────────────────────────────────────────────────────────
          HERO
      ───────────────────────────────────────────────────────────────────── */}
      <section
        style={{ background: 'linear-gradient(160deg, #FAF5E8 0%, #F5E6C8 55%, #FAF5E8 100%)', borderBottom: '1px solid #E8D9BA' }}
        className="px-6 py-20 flex flex-col items-center text-center"
      >
        {/* badge */}
        <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-[#C8941A]/30 text-[#8B4030] text-xs font-medium tracking-widest uppercase mb-10">
          Guia de Identidade de Marca
        </span>

        {/* logo */}
        <div className="mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/nefertari-logo-v2.png" alt="Nefertari Cozinha Viva" width={300} height={260} className="object-contain" />
        </div>

        {/* headline */}
        <h1
          style={{ fontFamily: 'Playfair Display, Georgia, serif', letterSpacing: '-0.01em', lineHeight: 1.15 }}
          className="text-4xl md:text-6xl font-bold text-[#14100C] mb-2 max-w-xl"
        >
          Jéssica, sua marca
        </h1>
        <h1
          style={{ fontFamily: 'Playfair Display, Georgia, serif', letterSpacing: '-0.01em', lineHeight: 1.15, color: '#C8941A' }}
          className="text-4xl md:text-6xl font-bold mb-8 max-w-xl"
        >
          agora tem forma.
        </h1>

        {/* divider line */}
        <div className="flex items-center gap-3 mb-6">
          <span className="h-px w-12 bg-[#C8941A]/40" />
          <span className="text-[#C8941A] text-xs tracking-[0.3em] uppercase font-medium">Nefertari Cozinha Viva</span>
          <span className="h-px w-12 bg-[#C8941A]/40" />
        </div>

        <p className="text-[#6B6050] max-w-lg text-sm md:text-base leading-relaxed">
          Este guia é o DNA visual e verbal da Nefertari. Use-o como referência para cada peça —
          seja um post, uma embalagem ou uma resposta para cliente. A consistência é o que
          transforma uma marca boa numa marca inesquecível.
        </p>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────
          01 — SÍMBOLO DA MARCA
      ───────────────────────────────────────────────────────────────────── */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <SectionLabel num="01" label="Símbolo da Marca" />
          <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif' }} className="text-3xl md:text-4xl font-bold text-[#14100C]">
            O Símbolo da Marca
          </h2>
          <p className="text-[#6B6050] mt-4 max-w-lg mx-auto text-sm leading-relaxed">
            O logotipo é o elemento mais importante da identidade. Respeite sempre as regras de uso
            para garantir que a marca seja percebida com a mesma força em qualquer contexto.
          </p>
        </div>

        {/* Logo variants */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10 max-w-2xl mx-auto">
          {/* Versão Principal */}
          <div className="rounded-2xl overflow-hidden border-2 border-[#C8941A]/30 shadow-lg">
            <div className="h-52 flex items-center justify-center p-6" style={{ backgroundColor: '#FAF5E8' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/nefertari-logo-v2.png" alt="Versão Principal" className="max-h-full max-w-full object-contain" />
            </div>
            <div className="p-5 bg-white text-center">
              <p className="text-[#C8941A] text-xs font-bold tracking-widest uppercase mb-1">Versão Principal</p>
              <p className="text-[#6B6050] text-xs">Sobre fundo creme</p>
            </div>
          </div>

          {/* Fundo Transparente */}
          <div className="rounded-2xl overflow-hidden border border-[#E8D9BA]">
            <div
              className="h-52 flex items-center justify-center p-6"
              style={{
                backgroundImage: 'repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%)',
                backgroundSize: '20px 20px',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-transparent.webp" alt="Fundo Transparente" className="max-h-full max-w-full object-contain" />
            </div>
            <div className="p-5 bg-white text-center">
              <p className="text-[#C8941A] text-xs font-bold tracking-widest uppercase mb-1">Fundo Transparente</p>
              <p className="text-[#6B6050] text-xs">Arquivo .webp para uso digital</p>
            </div>
          </div>
        </div>

        {/* Uso Correto / Incorreto */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
          <div className="rounded-2xl border border-[#6B8C3E]/30 bg-[#6B8C3E]/5 p-7">
            <p className="text-[#4A6228] text-xs font-bold tracking-widest uppercase mb-5 flex items-center gap-2">
              <span className="text-[#6B8C3E]">✓</span> Uso Correto
            </p>
            <ul className="space-y-3">
              {logoCorrect.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-[#3D3228]">
                  <span className="text-[#6B8C3E] mt-0.5 shrink-0">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-[#8B4030]/20 bg-[#8B4030]/5 p-7">
            <p className="text-[#8B4030] text-xs font-bold tracking-widest uppercase mb-5 flex items-center gap-2">
              <span>✗</span> Uso Incorreto
            </p>
            <ul className="space-y-3">
              {logoIncorrect.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-[#3D3228]">
                  <span className="text-[#C47A60] mt-0.5 shrink-0">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* What it symbolises */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {symbols.map((s) => (
            <div key={s.title} className="rounded-2xl p-8 text-center border border-[#E8D9BA] bg-white hover:border-[#C8941A]/40 hover:shadow-md transition-all duration-300">
              <span className="text-4xl text-[#C8941A] block mb-4">{s.glyph}</span>
              <h3 style={{ fontFamily: 'Playfair Display, Georgia, serif' }} className="text-lg font-semibold text-[#14100C] mb-3">{s.title}</h3>
              <p className="text-[#6B6050] text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Transmit tags */}
        <div className="rounded-2xl border border-[#E8D9BA] bg-[#F5E6C8]/40 p-7">
          <p className="text-[#C8941A] text-xs uppercase tracking-widest font-medium mb-4">O logo transmite</p>
          <div className="flex flex-wrap gap-3">
            {['Realeza', 'Frescor', 'Sustentabilidade', 'Premium', 'Ancestralidade', 'Autenticidade'].map((tag) => (
              <span key={tag} className="px-4 py-1.5 rounded-full text-sm font-medium border border-[#C8941A]/30 text-[#8B4030] bg-white">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ─────────────────────────────────────────────────────────────────────
          02 — VOZ & PERSONA
      ───────────────────────────────────────────────────────────────────── */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <SectionLabel num="02" label="Voz & Persona" />
          <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif' }} className="text-3xl md:text-4xl font-bold text-[#14100C]">
            Como a marca fala
          </h2>
        </div>

        <div className="space-y-4">
          {voice.map((v, i) => (
            <div key={v.attr} className="rounded-2xl border border-[#E8D9BA] bg-white overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-6 text-left hover:bg-[#FAF5E8] transition-colors"
                onClick={() => setOpenVoice(prev => prev === i ? null : i)}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl text-[#C8941A] w-8 text-center">{v.glyph}</span>
                  <span style={{ fontFamily: 'Playfair Display, Georgia, serif' }} className="text-xl font-semibold text-[#14100C]">
                    {v.attr}
                  </span>
                </div>
                <span className="text-[#C8941A] text-xl font-light">{openVoice === i ? '−' : '+'}</span>
              </button>
              {openVoice === i && (
                <div className="px-6 pb-6 border-t border-[#E8D9BA]">
                  <p className="text-[#6B6050] text-sm leading-relaxed mt-4 mb-4">{v.desc}</p>
                  <blockquote className="border-l-2 border-[#C8941A] pl-4 text-[#14100C] text-sm italic">
                    {v.quote}
                  </blockquote>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* ─────────────────────────────────────────────────────────────────────
          03 — MENSAGENS-CHAVE
      ───────────────────────────────────────────────────────────────────── */}
      <section className="px-6 py-20" style={{ background: '#F5E6C8' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel num="03" label="Mensagens-Chave" />
            <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif' }} className="text-3xl md:text-4xl font-bold text-[#14100C]">
              Os pilares da comunicação
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {messages.map((m, i) => (
              <div key={m.headline} className="rounded-2xl p-7 border border-[#E8D9BA] bg-white hover:shadow-md transition-shadow">
                <span className="text-[#C8941A]/40 font-mono text-xs font-bold block mb-3">{String(i + 1).padStart(2, '0')}</span>
                <h3 style={{ fontFamily: 'Playfair Display, Georgia, serif' }} className="text-xl font-semibold text-[#14100C] mb-3">{m.headline}</h3>
                <p className="text-[#6B6050] text-sm leading-relaxed">{m.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────
          04 — PALETA DE CORES
      ───────────────────────────────────────────────────────────────────── */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <SectionLabel num="04" label="Paleta" />
          <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif' }} className="text-3xl md:text-4xl font-bold text-[#14100C]">
            Cores da marca
          </h2>
          <p className="text-[#6B6050] mt-3 text-sm">Clique em qualquer cor para copiar o hex.</p>
        </div>
        <div className="space-y-10">
          {palette.map((group) => (
            <div key={group.group}>
              <div className="flex items-baseline gap-3 mb-4">
                <h3 style={{ fontFamily: 'Playfair Display, Georgia, serif' }} className="text-lg font-semibold text-[#14100C]">{group.group}</h3>
                <span className="text-xs text-[#C8941A] font-medium tracking-wide uppercase">{group.label}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {group.colors.map((color) => <Swatch key={color.hex} color={color} />)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* ─────────────────────────────────────────────────────────────────────
          05 — TIPOGRAFIA
      ───────────────────────────────────────────────────────────────────── */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <SectionLabel num="05" label="Tipografia" />
          <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif' }} className="text-3xl md:text-4xl font-bold text-[#14100C]">
            Sistema tipográfico
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="rounded-2xl border border-[#E8D9BA] bg-white p-8">
            <p className="text-[#C8941A] text-xs uppercase tracking-widest font-medium mb-6">Família Primária — Títulos</p>
            <p style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '2.5rem', lineHeight: 1.2, color: '#14100C', fontWeight: 700 }} className="mb-2">
              Playfair Display
            </p>
            <p style={{ fontFamily: 'Playfair Display, Georgia, serif', color: '#6B6050', fontSize: '1.1rem' }} className="mb-4">
              Aa Bb Cc Dd Ee Ff Gg
            </p>
            <p className="text-[#6B6050] text-xs">Uso: headlines, nome da marca, títulos de seção. Transmite elegância e autoridade editorial.</p>
          </div>
          <div className="rounded-2xl border border-[#E8D9BA] bg-white p-8">
            <p className="text-[#C8941A] text-xs uppercase tracking-widest font-medium mb-6">Família Secundária — Corpo</p>
            <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '2.5rem', lineHeight: 1.2, color: '#14100C', fontWeight: 700 }} className="mb-2">
              Inter
            </p>
            <p style={{ fontFamily: 'Inter, system-ui, sans-serif', color: '#6B6050', fontSize: '1.1rem' }} className="mb-4">
              Aa Bb Cc Dd Ee Ff Gg
            </p>
            <p className="text-[#6B6050] text-xs">Uso: parágrafos, labels, botões, legendas. Limpeza e legibilidade em qualquer tamanho.</p>
          </div>
        </div>

        <div className="rounded-2xl border border-[#E8D9BA] bg-white overflow-hidden">
          <div className="p-6 border-b border-[#E8D9BA]">
            <p className="text-[#C8941A] text-xs uppercase tracking-widest font-medium">Escala tipográfica</p>
          </div>
          <div className="divide-y divide-[#F0E8D4]">
            {typeScale.map((item) => (
              <div key={item.label} className="flex items-center gap-6 px-6 py-4 hover:bg-[#FAF5E8] transition-colors">
                <div className="w-16 shrink-0">
                  <p className="text-[#C8941A] text-xs font-mono font-bold">{item.label}</p>
                  <p className="text-[#9C8E7C] text-[10px]">{item.size}</p>
                </div>
                <p
                  className="flex-1 text-[#14100C] truncate"
                  style={{
                    fontFamily: item.font === 'Playfair Display' ? 'Playfair Display, Georgia, serif' : 'Inter, system-ui, sans-serif',
                    fontSize: item.size.split('/')[0].trim(),
                    fontWeight: item.weight,
                  }}
                >
                  {item.sample}
                </p>
                <p className="text-[#9C8E7C] text-xs shrink-0 hidden sm:block">{item.font}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ─────────────────────────────────────────────────────────────────────
          06 — EXEMPLOS PRÁTICOS
      ───────────────────────────────────────────────────────────────────── */}
      <section className="px-6 py-20" style={{ background: '#F5E6C8' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel num="06" label="Exemplos Práticos" />
            <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif' }} className="text-3xl md:text-4xl font-bold text-[#14100C]">
              Faça &amp; Não Faça
            </h2>
            <p className="text-[#6B6050] mt-4 max-w-md mx-auto text-sm leading-relaxed">
              Exemplos reais de como aplicar (e como não aplicar) a voz da Nefertari em diferentes contextos.
            </p>
          </div>

          <div className="space-y-3">
            {exemplos.map((ex, i) => (
              <div key={ex.titulo} className="rounded-2xl border border-[#E8D9BA] bg-white overflow-hidden">
                <button
                  className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-[#FAF5E8] transition-colors"
                  onClick={() => setOpenExemplo(prev => prev === i ? null : i)}
                >
                  <span style={{ fontFamily: 'Playfair Display, Georgia, serif' }} className="text-lg font-semibold text-[#14100C]">
                    {ex.titulo}
                  </span>
                  <span className="text-[#C8941A] text-xl font-light shrink-0 ml-4">{openExemplo === i ? '−' : '+'}</span>
                </button>

                {openExemplo === i && (
                  <div className="border-t border-[#E8D9BA] p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* ASSIM */}
                      <div className="rounded-xl border border-[#6B8C3E]/25 bg-[#6B8C3E]/5 p-5">
                        <p className="text-[#4A6228] text-xs font-bold tracking-widest uppercase mb-3 flex items-center gap-1.5">
                          <span className="text-[#6B8C3E]">✓</span> Assim
                        </p>
                        <p className="text-[#2A2018] text-sm leading-relaxed italic">"{ex.assim}"</p>
                      </div>
                      {/* NÃO ASSIM */}
                      <div className="rounded-xl border border-[#8B4030]/20 bg-[#8B4030]/5 p-5">
                        <p className="text-[#8B4030] text-xs font-bold tracking-widest uppercase mb-3 flex items-center gap-1.5">
                          <span>✗</span> Não Assim
                        </p>
                        <p className="text-[#5A3A30] text-sm leading-relaxed italic">"{ex.naoAssim}"</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────
          07 — MANIFESTO
      ───────────────────────────────────────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(160deg, #14100C 0%, #2A1E14 50%, #14100C 100%)' }} className="px-6 py-28">
        <div className="max-w-3xl mx-auto">
          {/* label */}
          <div className="flex justify-center mb-10">
            <span className="inline-flex items-center px-5 py-2 rounded-full border border-[#C8941A]/30 text-[#C8941A] text-xs font-bold tracking-widest uppercase">
              07 — Manifesto
            </span>
          </div>

          <h2
            style={{ fontFamily: 'Playfair Display, Georgia, serif', color: '#FAF5E8' }}
            className="text-4xl md:text-5xl font-bold text-center mb-16 leading-tight"
          >
            A Crença da Marca
          </h2>

          {/* manifesto text */}
          <div className="border-l-2 border-[#C8941A]/50 pl-8 space-y-5">
            <p style={{ fontFamily: 'Playfair Display, Georgia, serif' }} className="text-[#FAF5E8] text-xl leading-relaxed">
              <strong className="text-white">A Nefertari nasceu de uma crença simples:</strong><br />
              <span className="text-[#D4C4A0] font-normal">comer bem é um ato de respeito por si mesmo.</span>
            </p>
            <p className="text-[#A89880] text-base leading-loose">
              Cada ingrediente foi escolhido com intenção.<br />
              Cada receita foi construída com tempo.<br />
              Cada prato carrega um pouco de quem somos —<br />
              e tudo que acreditamos sobre alimentação.
            </p>
            <p className="text-[#D4C4A0] text-base leading-loose">
              Aqui, a cozinha é viva.<br />
              <strong style={{ fontFamily: 'Playfair Display, Georgia, serif' }} className="text-white text-lg">E o que é vivo, cuida.</strong>
            </p>
          </div>

          {/* divider */}
          <div className="flex items-center gap-4 mt-16 mb-12">
            <span className="h-px flex-1 bg-[#C8941A]/20" />
            <span className="text-[#C8941A]/60 text-xs tracking-widest uppercase font-medium">Nefertari Cozinha Viva</span>
            <span className="h-px flex-1 bg-[#C8941A]/20" />
          </div>

          {/* pillars */}
          <div className="grid grid-cols-3 gap-4 text-center">
            {['Autêntica', 'Intencional', 'Viva'].map((word) => (
              <div key={word} className="rounded-xl border border-[#C8941A]/20 px-4 py-3">
                <p className="text-[#E6B84A] text-sm font-medium tracking-wide">{word}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────
          FOOTER
      ───────────────────────────────────────────────────────────────────── */}
      <footer style={{ background: '#14100C', borderTop: '1px solid rgba(200,148,26,0.10)' }} className="px-6 py-8 text-center">
        <p className="text-[#6B5E50] text-xs">Guia de Identidade Visual — Nefertari Cozinha Viva &copy; {new Date().getFullYear()}</p>
        <p className="text-[#4A3E32] text-xs mt-1">Produzido por <span className="text-[#C8941A]/50">clubemkt.digital</span></p>
      </footer>
    </div>
  );
}
