'use client';

import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

// ─── Palette ─────────────────────────────────────────────────────────────────
const palette = [
  {
    group: 'Ouro',
    label: 'Primária',
    colors: [
      { name: 'Ouro Mustarda',  hex: '#C8941A', rgb: '200, 148, 26',  usage: 'Logo, CTAs, títulos principais, elementos âncora da marca.' },
      { name: 'Ouro Luminoso',  hex: '#E6B84A', rgb: '230, 184, 74',  usage: 'Hover states, gradientes, versão luminosa em fundos escuros.' },
    ],
  },
  {
    group: 'Verde Sálvia',
    label: 'Secundária',
    colors: [
      { name: 'Sálvia',         hex: '#6B8C3E', rgb: '107, 140, 62',  usage: 'Tags de saudável, elementos naturais, ícones de ingrediente.' },
      { name: 'Verde Floresta', hex: '#4A6228', rgb: '74, 98, 40',    usage: 'Variação escura. Bordas e textos de seção em fundo claro.' },
    ],
  },
  {
    group: 'Marrom Terra',
    label: 'Apoio',
    colors: [
      { name: 'Terracota',      hex: '#8B4030', rgb: '139, 64, 48',   usage: 'Elementos raiz, subtítulos, prefixos e detalhes terrosos.' },
      { name: 'Terracota Suave',hex: '#C47A60', rgb: '196, 122, 96',  usage: 'Destaques leves, ícones secundários, versão quente de apoio.' },
    ],
  },
  {
    group: 'Fundos Escuros',
    label: 'Modo Noturno',
    colors: [
      { name: 'Preto Quente',   hex: '#14100C', rgb: '20, 16, 12',    usage: 'Fundo premium noturno, texto principal em modo escuro.' },
      { name: 'Chumbo Marrom',  hex: '#3D2E22', rgb: '61, 46, 34',    usage: 'Cards escuros, bordas sutis sobre preto quente.' },
    ],
  },
  {
    group: 'Fundos Claros',
    label: 'Modo Dia',
    colors: [
      { name: 'Branco Natural', hex: '#FAF5E8', rgb: '250, 245, 232', usage: 'Fundo principal do site. Limpo, quente e acolhedor.' },
      { name: 'Areia',          hex: '#F5E6C8', rgb: '245, 230, 200', usage: 'Seções alternadas, cards em fundo claro, camadas sutis.' },
    ],
  },
];

// ─── Brand voice ──────────────────────────────────────────────────────────────
const voice = [
  {
    attr: 'Sofisticada',
    glyph: '◈',
    desc: 'Cada palavra é escolhida com intenção. A comunicação é refinada, sem ser distante — como uma mesa bem posta que convida a sentar.',
    quote: '"Ingredientes que contam história. Sabores que ficam na memória."',
  },
  {
    attr: 'Com Propósito',
    glyph: '◉',
    desc: 'A Nefertari não vende apenas comida: vende saúde com consciência, cuidado com a origem de cada ingrediente e compromisso com o bem-estar.',
    quote: '"Feito com o que a terra tem de melhor. Pensado para o que você merece."',
  },
  {
    attr: 'Real e Regal',
    glyph: '◇',
    desc: 'Inspirada na grandiosidade das pirâmides, a voz carrega autoridade natural — não arrogância, mas presença. Como uma rainha que não precisa gritar.',
    quote: '"Cozinha Viva. Porque alimentar é um ato sagrado."',
  },
];

// ─── Logo symbolism ──────────────────────────────────────────────────────────
const symbols = [
  {
    glyph: '△',
    title: 'Pirâmide',
    desc: 'Força, permanência e história. A base que sustenta tudo. Remete à grandeza ancestral das civilizações — solidez com elegância.',
  },
  {
    glyph: '☀',
    title: 'Sol & Luz',
    desc: 'Crescimento, energia e vitalidade. O alimento como fonte de vida, clareza e renovação diária. A luz que nutre.',
  },
  {
    glyph: '❧',
    title: 'Folhagem',
    desc: 'Frescor, natureza e terra. A conexão com ingredientes vivos e a origem saudável de cada prato que chega à sua mesa.',
  },
];

// ─── Key messages ─────────────────────────────────────────────────────────────
const messages = [
  {
    headline: 'Cozinha Viva',
    body: '"Viva" porque cada prato pulsa com ingredientes frescos, intencionais e vivos — não processados, não artificiais. Uma cozinha que respira.',
  },
  {
    headline: 'Cada detalhe importa',
    body: 'Desde a escolha do fornecedor até a apresentação do prato — nada é por acaso na Nefertari. O cuidado é visível em tudo.',
  },
  {
    headline: 'Realeza acessível',
    body: 'Premium não significa inalcançável. A Nefertari traz sofisticação para o cotidiano, tornando o comer bem uma experiência para todos.',
  },
];

// ─── Type scale ──────────────────────────────────────────────────────────────
const typeScale = [
  { label: 'Display',  size: '48px / 3rem',  weight: '700', font: 'Playfair Display', sample: 'Cozinha Viva' },
  { label: 'H1',       size: '36px / 2.25rem', weight: '700', font: 'Playfair Display', sample: 'Identidade da Marca' },
  { label: 'H2',       size: '28px / 1.75rem', weight: '600', font: 'Playfair Display', sample: 'Paleta de Cores' },
  { label: 'H3',       size: '20px / 1.25rem', weight: '600', font: 'Inter',            sample: 'Voz e Persona' },
  { label: 'Body',     size: '16px / 1rem',    weight: '400', font: 'Inter',            sample: 'Texto corrido, descrições, parágrafos.' },
  { label: 'Caption',  size: '12px / 0.75rem', weight: '400', font: 'Inter',            sample: 'Labels, metadados, badges.' },
];

// ─── Swatch component ─────────────────────────────────────────────────────────
function Swatch({ color }: { color: { name: string; hex: string; rgb: string; usage: string } }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(color.hex).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  const isDark = ['#14100C', '#3D2E22', '#8B4030', '#4A6228', '#C8941A', '#6B8C3E'].includes(color.hex);

  return (
    <button
      onClick={copy}
      className="group w-full text-left rounded-xl overflow-hidden border border-[#E8D9BA] hover:border-[#C8941A]/60 transition-all duration-200 hover:shadow-md"
    >
      <div
        className="h-20 flex items-end justify-end p-3"
        style={{ backgroundColor: color.hex }}
      >
        <span className={`text-xs font-mono px-2 py-1 rounded-md backdrop-blur-sm transition-opacity opacity-0 group-hover:opacity-100 ${isDark ? 'bg-white/15 text-white' : 'bg-black/10 text-black'}`}>
          {copied ? <Check size={12} /> : <Copy size={12} />}
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

// ─── Main component ───────────────────────────────────────────────────────────
export default function BrandGuideV2() {
  const [openVoice, setOpenVoice] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#FAF5E8', color: '#14100C', minHeight: '100vh' }}>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        style={{
          background: 'linear-gradient(160deg, #FAF5E8 0%, #F5E6C8 50%, #FAF5E8 100%)',
          borderBottom: '1px solid #E8D9BA',
        }}
        className="px-6 py-24 flex flex-col items-center text-center"
      >
        <div className="mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/nefertari-logo-v2.png"
            alt="Nefertari Cozinha Viva — Logo"
            width={280}
            height={240}
            className="object-contain"
          />
        </div>

        <p className="text-[#C8941A] tracking-[0.35em] text-xs font-medium uppercase mb-10">
          Guia de Identidade Visual
        </p>

        <div className="flex items-center gap-3 mb-8">
          <span className="h-px w-12 bg-[#C8941A]/40" />
          <p className="text-[#6B6050] text-sm tracking-wide">Cada detalhe importa</p>
          <span className="h-px w-12 bg-[#C8941A]/40" />
        </div>

        <p className="text-[#6B6050] max-w-md text-sm leading-relaxed">
          Este guia define a identidade visual e vocal da Nefertari Cozinha Viva — um sistema de marca construído sobre autenticidade, propósito e presença regal.
        </p>
      </section>

      {/* ── Símbolo da Marca ─────────────────────────────────────────────── */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[#C8941A] tracking-[0.3em] text-xs uppercase font-medium mb-3">01 — Símbolo</p>
          <h2
            style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
            className="text-3xl md:text-4xl font-bold text-[#14100C]"
          >
            O que o logo comunica
          </h2>
          <p className="text-[#6B6050] mt-4 max-w-lg mx-auto text-sm leading-relaxed">
            A pirâmide dourada com sol e folhagem não é apenas um símbolo — é um manifesto visual. Cada elemento carrega significado intencional.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {symbols.map((s) => (
            <div
              key={s.title}
              className="rounded-2xl p-8 text-center border border-[#E8D9BA] bg-white hover:border-[#C8941A]/40 hover:shadow-lg transition-all duration-300"
            >
              <span className="text-4xl text-[#C8941A] block mb-4">{s.glyph}</span>
              <h3
                style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                className="text-lg font-semibold text-[#14100C] mb-3"
              >
                {s.title}
              </h3>
              <p className="text-[#6B6050] text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* What it transmits */}
        <div className="mt-10 rounded-2xl border border-[#E8D9BA] bg-[#F5E6C8]/40 p-8">
          <p className="text-[#C8941A] text-xs uppercase tracking-widest font-medium mb-4">O logo transmite</p>
          <div className="flex flex-wrap gap-3">
            {['Realeza', 'Frescor', 'Sustentabilidade', 'Premium', 'Ancestralidade', 'Autenticidade'].map((tag) => (
              <span
                key={tag}
                className="px-4 py-1.5 rounded-full text-sm font-medium border border-[#C8941A]/30 text-[#8B4030] bg-white"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─ Divider ─ */}
      <div className="px-6 max-w-5xl mx-auto">
        <div className="h-px bg-gradient-to-r from-transparent via-[#C8941A]/30 to-transparent" />
      </div>

      {/* ── Voz & Persona ────────────────────────────────────────────────── */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[#C8941A] tracking-[0.3em] text-xs uppercase font-medium mb-3">02 — Voz & Persona</p>
          <h2
            style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
            className="text-3xl md:text-4xl font-bold text-[#14100C]"
          >
            Como a marca fala
          </h2>
        </div>

        <div className="space-y-4">
          {voice.map((v, i) => (
            <div
              key={v.attr}
              className="rounded-2xl border border-[#E8D9BA] bg-white overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between p-6 text-left hover:bg-[#FAF5E8] transition-colors"
                onClick={() => setOpenVoice(prev => prev === i ? null : i)}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl text-[#C8941A] w-8 text-center">{v.glyph}</span>
                  <span
                    style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                    className="text-xl font-semibold text-[#14100C]"
                  >
                    {v.attr}
                  </span>
                </div>
                <span className="text-[#C8941A] text-lg">{openVoice === i ? '−' : '+'}</span>
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

      {/* ─ Divider ─ */}
      <div className="px-6 max-w-5xl mx-auto">
        <div className="h-px bg-gradient-to-r from-transparent via-[#C8941A]/30 to-transparent" />
      </div>

      {/* ── Mensagens-Chave ───────────────────────────────────────────────── */}
      <section className="px-6 py-20" style={{ background: '#F5E6C8' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#C8941A] tracking-[0.3em] text-xs uppercase font-medium mb-3">03 — Mensagens-Chave</p>
            <h2
              style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
              className="text-3xl md:text-4xl font-bold text-[#14100C]"
            >
              Os pilares da comunicação
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {messages.map((m, i) => (
              <div
                key={m.headline}
                className="rounded-2xl p-7 border border-[#E8D9BA] bg-white hover:shadow-md transition-shadow"
              >
                <span className="text-[#C8941A]/40 font-mono text-xs font-bold block mb-3">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3
                  style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                  className="text-xl font-semibold text-[#14100C] mb-3"
                >
                  {m.headline}
                </h3>
                <p className="text-[#6B6050] text-sm leading-relaxed">{m.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Paleta de Cores ───────────────────────────────────────────────── */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[#C8941A] tracking-[0.3em] text-xs uppercase font-medium mb-3">04 — Paleta</p>
          <h2
            style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
            className="text-3xl md:text-4xl font-bold text-[#14100C]"
          >
            Cores da marca
          </h2>
          <p className="text-[#6B6050] mt-3 text-sm">Clique em qualquer cor para copiar o hex.</p>
        </div>

        <div className="space-y-10">
          {palette.map((group) => (
            <div key={group.group}>
              <div className="flex items-baseline gap-3 mb-4">
                <h3
                  style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                  className="text-lg font-semibold text-[#14100C]"
                >
                  {group.group}
                </h3>
                <span className="text-xs text-[#C8941A] font-medium tracking-wide uppercase">{group.label}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {group.colors.map((color) => (
                  <Swatch key={color.hex} color={color} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─ Divider ─ */}
      <div className="px-6 max-w-5xl mx-auto">
        <div className="h-px bg-gradient-to-r from-transparent via-[#C8941A]/30 to-transparent" />
      </div>

      {/* ── Tipografia ────────────────────────────────────────────────────── */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[#C8941A] tracking-[0.3em] text-xs uppercase font-medium mb-3">05 — Tipografia</p>
          <h2
            style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
            className="text-3xl md:text-4xl font-bold text-[#14100C]"
          >
            Sistema tipográfico
          </h2>
        </div>

        {/* Font families */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="rounded-2xl border border-[#E8D9BA] bg-white p-8">
            <p className="text-[#C8941A] text-xs uppercase tracking-widest font-medium mb-6">Família Primária — Títulos</p>
            <p
              style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '2.5rem', lineHeight: 1.2, color: '#14100C' }}
              className="font-bold mb-2"
            >
              Playfair Display
            </p>
            <p
              style={{ fontFamily: 'Playfair Display, Georgia, serif', color: '#6B6050', fontSize: '1.1rem' }}
              className="font-normal mb-4"
            >
              Aa Bb Cc Dd Ee Ff Gg
            </p>
            <p className="text-[#6B6050] text-xs">
              Uso: headlines, nome da marca, títulos de seção. Transmite elegância e autoridade editorial.
            </p>
          </div>

          <div className="rounded-2xl border border-[#E8D9BA] bg-white p-8">
            <p className="text-[#C8941A] text-xs uppercase tracking-widest font-medium mb-6">Família Secundária — Corpo</p>
            <p
              style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '2.5rem', lineHeight: 1.2, color: '#14100C', fontWeight: 700 }}
              className="mb-2"
            >
              Inter
            </p>
            <p
              style={{ fontFamily: 'Inter, system-ui, sans-serif', color: '#6B6050', fontSize: '1.1rem' }}
              className="mb-4"
            >
              Aa Bb Cc Dd Ee Ff Gg
            </p>
            <p className="text-[#6B6050] text-xs">
              Uso: parágrafos, labels, botões, legendas. Limpeza e legibilidade em qualquer tamanho.
            </p>
          </div>
        </div>

        {/* Type scale */}
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
                <p className="text-[#9C8E7C] text-xs shrink-0">{item.font}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Manifesto / CTA ───────────────────────────────────────────────── */}
      <section
        style={{ background: 'linear-gradient(135deg, #14100C 0%, #3D2E22 100%)' }}
        className="px-6 py-24 text-center"
      >
        <div className="max-w-2xl mx-auto">
          <span className="text-[#C8941A]/60 text-3xl block mb-6">◈</span>

          <h2
            style={{ fontFamily: 'Playfair Display, Georgia, serif', color: '#FAF5E8' }}
            className="text-3xl md:text-4xl font-bold mb-6 leading-snug"
          >
            Uma marca viva começa<br />com uma identidade intencional.
          </h2>

          <p className="text-[#C8941A]/80 max-w-md mx-auto text-sm leading-relaxed mb-10">
            A Nefertari Cozinha Viva não é apenas uma marca de comida — é um compromisso com o que é real, fresco e feito com propósito. Esta identidade é o espelho desse compromisso.
          </p>

          <div className="flex items-center justify-center gap-4 mb-12">
            <span className="h-px w-16 bg-[#C8941A]/30" />
            <span className="text-[#C8941A] text-sm font-medium tracking-widest uppercase">Nefertari Cozinha Viva</span>
            <span className="h-px w-16 bg-[#C8941A]/30" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            {['Autêntica', 'Intencional', 'Viva'].map((word) => (
              <div key={word} className="rounded-xl border border-[#C8941A]/20 px-4 py-3">
                <p className="text-[#E6B84A] text-sm font-medium tracking-wide">{word}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer
        style={{ background: '#14100C', borderTop: '1px solid rgba(200,148,26,0.12)' }}
        className="px-6 py-8 text-center"
      >
        <p className="text-[#6B5E50] text-xs">
          Guia de Identidade Visual — Nefertari Cozinha Viva &copy; {new Date().getFullYear()}
        </p>
        <p className="text-[#4A3E32] text-xs mt-1">
          Produzido por <span className="text-[#C8941A]/60">clubemkt.digital</span>
        </p>
      </footer>
    </div>
  );
}
