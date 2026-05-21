'use client';

import React, { useState } from 'react';
import {
  Target, Search, ShoppingCart, CheckCircle2, ArrowRight,
  Sparkles, Sun, Moon, Leaf, Zap, Clock,
} from 'lucide-react';

// ─── Theme tokens ─────────────────────────────────────────────────────────────
const dark = {
  bg: '#12100E', bgSection: 'rgba(255,255,255,0.02)', bgCard: 'rgba(255,255,255,0.02)',
  bgPricing: 'rgba(0,0,0,0.3)', bgFooter: '#0A0908', bgImageCard: '#0e0c0a',
  border: 'rgba(255,255,255,0.05)', borderGold: 'rgba(212,175,55,0.2)',
  text: '#E8E5DF', textHead: '#FDFBF7', textMuted: '#A39D93', textDim: '#6B6560',
  textGold: '#D4AF37', textGreen: '#8BAA6D', textBrown: '#8B5A2B',
  navBg: 'rgba(18,16,14,0.8)', planBg: 'linear-gradient(145deg,#1A1612 0%,#12100E 100%)',
  toggleBg: 'rgba(255,255,255,0.06)', toggleBorder: 'rgba(255,255,255,0.1)', toggleIcon: '#D4AF37',
  ambientA: 'bg-[#5C7148]/10', ambientB: 'bg-[#D4AF37]/10',
};
const light = {
  bg: '#F5F0E8', bgSection: 'rgba(0,0,0,0.03)', bgCard: '#FFFFFF',
  bgPricing: 'rgba(0,0,0,0.04)', bgFooter: '#EDE8DF', bgImageCard: '#F0EBE0',
  border: 'rgba(0,0,0,0.08)', borderGold: 'rgba(139,90,43,0.3)',
  text: '#2C2520', textHead: '#1A1208', textMuted: '#6B5E50', textDim: '#9C8E80',
  textGold: '#8B5A2B', textGreen: '#4A7A3A', textBrown: '#8B5A2B',
  navBg: 'rgba(245,240,232,0.9)', planBg: 'linear-gradient(145deg,#FDF8F0 0%,#F5F0E8 100%)',
  toggleBg: 'rgba(0,0,0,0.06)', toggleBorder: 'rgba(0,0,0,0.12)', toggleIcon: '#8B5A2B',
  ambientA: 'bg-[#5C7148]/5', ambientB: 'bg-[#D4AF37]/5',
};

// ─── Scope items ──────────────────────────────────────────────────────────────
const scope = [
  {
    icon: Target,
    tag: 'Identidade de Marca',
    title: 'Branding & Identidade Visual',
    desc: 'Criamos a alma visual da Nefertari do zero — logotipo, paleta de cores, tipografia, tom de voz e manual de marca. Tudo documentado para que cada peça futura, seja um cardápio ou uma embalagem, mantenha a mesma identidade. Uma marca coesa vale mais do que qualquer anúncio.',
    deliverables: ['Logotipo principal + variações', 'Paleta de cores e tipografia', 'Manual de identidade visual', 'Aplicações: cardápio digital, embalagens, perfil'],
  },
  {
    icon: Search,
    tag: 'Presença Digital',
    title: 'Site Profissional & SEO Local',
    desc: 'Desenvolvemos um site otimizado para aparecer no Google quando alguém na sua cidade busca por "comida saudável" ou "delivery natural". SEO (Search Engine Optimization) é o trabalho técnico que faz sua marca ser encontrada organicamente — sem pagar por cada clique.',
    deliverables: ['Site institucional responsivo', 'SEO técnico configurado', 'Cardápio digital integrado', 'Formulário de contato e localização'],
  },
  {
    icon: ShoppingCart,
    tag: 'Operação Inteligente',
    title: 'Sistema de Pedidos & Gestão de OS',
    desc: 'Implantamos um sistema digital de Ordens de Serviço que organiza cada pedido do recebimento à entrega. Chega de anotações em papel ou mensagens perdidas no WhatsApp. A cozinha recebe o pedido em tempo real, o cliente acompanha o status e você tem controle total do fluxo.',
    deliverables: ['Sistema de OS digital', 'Painel de controle de pedidos', 'Notificações em tempo real', 'Histórico e relatório de pedidos'],
  },
];

const timeline = [
  { phase: 'Fase 1', title: 'Branding & Identidade',    time: 'Dias 1–4',    desc: 'Briefing, pesquisa de referências e entrega do branding completo — logo, paleta, tipografia e manual. Aprovação conjunta antes de avançar.' },
  { phase: 'Fase 2', title: 'Site & SEO',                time: 'Dias 5–10',   desc: 'Desenvolvimento do site com o branding aprovado. SEO técnico configurado, cardápio digital integrado e testes de responsividade em mobile e desktop.' },
  { phase: 'Fase 3', title: 'Sistema de Pedidos',        time: 'Dias 10–13',  desc: 'Implantação do sistema de OS e painel de pedidos. Treinamento para uso e ajustes finais conforme o fluxo real da cozinha.' },
  { phase: 'Fase 4', title: 'Revisão & Entrega Final',   time: 'Dias 14–15',  desc: 'Revisão geral de todas as entregas, ajustes finais e handoff completo do projeto com documentação.' },
];

export default function ProposalV2() {
  const [isDark, setIsDark] = useState(true);
  const [payOption, setPayOption] = useState<'none' | 'full' | 'half'>('none');
  const t = isDark ? dark : light;

  const [addOnChecked, setAddOnChecked] = useState(false);

  const BASE = 1500;
  const ADDON = 300;
  const DISCOUNT = 0.10;

  const subtotal = BASE + (addOnChecked ? ADDON : 0);
  const totalFull = Math.round(subtotal * (1 - DISCOUNT));
  const totalHalf = subtotal / 2;

  const waNumber = '5573988083318';
  const waMessages: Record<string, string> = {
    none: 'Olá Jéssica! Vi a proposta da Nefertari e gostaria de conversar.',
    full: `Olá! Quero fechar o contrato da Nefertari com pagamento integral (R$ ${totalFull.toLocaleString('pt-BR')} com 10% de desconto${addOnChecked ? ', incluindo a Ferramenta de Posts com IA' : ''}). Podemos avançar?`,
    half: `Olá! Quero fechar o contrato da Nefertari com pagamento 50/50 (2× R$ ${totalHalf.toLocaleString('pt-BR')}${addOnChecked ? ', incluindo a Ferramenta de Posts com IA' : ''}). Podemos avançar?`,
  };
  const waLabels: Record<string, string> = {
    none: 'Escolha uma forma de pagamento e fale comigo',
    full: 'Fechar com Pagamento Integral — WhatsApp',
    half: 'Fechar com Pagamento 50/50 — WhatsApp',
  };
  const waHref = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessages[payOption])}`;

  return (
    <div className="min-h-screen font-sans transition-colors duration-300" style={{ backgroundColor: t.bg, color: t.text }}>

      {/* Ambient */}
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
      <section id="proposta" className="relative z-10 px-5" style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center' }}>
        <div className="max-w-5xl mx-auto w-full py-4">

          <div className="flex justify-center mb-1">
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-3xl scale-125" style={{ backgroundColor: isDark ? 'rgba(212,175,55,0.12)' : 'rgba(139,90,43,0.08)' }} />
              <img
                src="/nefertari-logo-golden.png"
                onError={(e) => { const el = e.target as HTMLImageElement; el.onerror = null; el.src = 'https://placehold.co/200x200/12100E/D4AF37?text=N'; }}
                alt="Nefertari Logo"
                className="relative object-contain"
                style={{
                  height: 'clamp(200px, 28dvh, 320px)',
                  width:  'clamp(200px, 28dvh, 320px)',
                  filter: isDark ? 'none' : 'brightness(0.85)',
                }}
              />
            </div>
          </div>

          <div className="text-center mb-3">
            {/* Version badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3" style={{ backgroundColor: isDark ? 'rgba(212,175,55,0.08)' : 'rgba(139,90,43,0.08)', border: `1px solid ${t.borderGold}` }}>
              <Zap className="w-3 h-3" style={{ color: t.textGold }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: t.textGold }}>Proposta Nefertari v2</span>
            </div>

            <h1 className="mb-3 leading-[1.1]" style={{ fontFamily: 'var(--font-playfair)', color: t.textHead, fontSize: 'clamp(1.5rem, 4.5vw, 2.6rem)' }}>
              Passo a passo,{' '}
              <br className="hidden sm:block" />
              <span style={{ background: 'linear-gradient(90deg,#D4AF37 0%,#E6C27A 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                com intenção.
              </span>
            </h1>

            <div className="grid md:grid-cols-2 gap-3 text-left max-w-3xl mx-auto mb-4">
              <p className="text-xs leading-relaxed font-light" style={{ color: t.textMuted }}>
                Jess, depois da nossa conversa ficou claro: o melhor caminho é construir com solidez, sem pressa. Esta proposta foca no que realmente importa agora — a base que vai sustentar tudo que vem depois.
              </p>
              <p className="text-xs leading-relaxed font-light" style={{ color: t.textMuted }}>
                Branding, site e sistema de pedidos. Três pilares. Um projeto com começo, meio e fim — entregue com prioridade e sem mensalidade.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="#escopo" className="px-6 py-2.5 font-semibold rounded-full flex items-center justify-center gap-2 group text-sm transition-opacity hover:opacity-90" style={{ backgroundColor: '#D4AF37', color: '#12100E' }}>
                Ver o Escopo <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#investimento" className="px-6 py-2.5 font-medium rounded-full flex items-center justify-center text-sm transition-all hover:opacity-80" style={{ border: `1px solid ${t.border}`, color: t.text }}>
                Ver Investimento
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* ── SCOPE ── */}
      <section id="escopo" className="relative z-10 py-24 transition-colors duration-300" style={{ backgroundColor: t.bgSection, borderTop: `1px solid ${t.border}`, borderBottom: `1px solid ${t.border}` }}>
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl mb-4" style={{ fontFamily: 'var(--font-playfair)', color: t.textHead }}>O Que Vamos Construir</h2>
            <p className="text-base font-light leading-relaxed" style={{ color: t.textMuted }}>
              Três entregas essenciais. Cada uma com escopo claro, prazo definido e resultado tangível. Sem surpresas, sem escopo aberto.
            </p>
          </div>

          <div className="space-y-5">
            {scope.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="rounded-2xl p-7 transition-all duration-300 group hover:-translate-y-0.5" style={{ backgroundColor: t.bgCard, border: `1px solid ${t.border}`, boxShadow: isDark ? 'none' : '0 2px 16px rgba(0,0,0,0.06)' }}>
                  <div className="flex flex-col md:flex-row md:gap-8">
                    {/* Left */}
                    <div className="flex items-start gap-4 mb-5 md:mb-0 md:w-64 shrink-0">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110" style={{ backgroundColor: isDark ? 'rgba(212,175,55,0.1)' : 'rgba(139,90,43,0.08)', border: `1px solid ${t.borderGold}` }}>
                        <Icon className="w-5 h-5" style={{ color: t.textGold }} />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest block mb-1 px-2 py-0.5 rounded inline-block" style={{ backgroundColor: isDark ? 'rgba(92,113,72,0.12)' : 'rgba(74,122,58,0.1)', color: t.textGreen }}>{item.tag}</span>
                        <h3 className="text-lg font-semibold leading-snug" style={{ fontFamily: 'var(--font-playfair)', color: t.textHead }}>{item.title}</h3>
                      </div>
                    </div>
                    {/* Right */}
                    <div className="flex-1">
                      <p className="text-sm font-light leading-relaxed mb-5" style={{ color: t.textMuted }}>{item.desc}</p>
                      <div className="grid grid-cols-2 gap-2">
                        {item.deliverables.map((d, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: t.textGold }} />
                            <span className="text-xs font-medium" style={{ color: t.text }}>{d}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section id="timeline" className="relative z-10 py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full" style={{ backgroundColor: isDark ? 'rgba(212,175,55,0.08)' : 'rgba(139,90,43,0.08)', border: `1px solid ${t.borderGold}` }}>
              <Clock className="w-3.5 h-3.5" style={{ color: t.textGold }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: t.textGold }}>Entrega em 15 dias</span>
            </div>
            <h2 className="text-4xl md:text-5xl mb-4" style={{ fontFamily: 'var(--font-playfair)', color: t.textHead }}>Cronograma</h2>
            <p className="text-base font-light leading-relaxed max-w-xl mx-auto" style={{ color: t.textMuted }}>
              Projeto com prazo de <strong style={{ color: t.textHead }}>15 dias corridos</strong> a partir da assinatura do contrato. Quanto mais rápido aprovamos cada fase, mais rápido você tem tudo funcionando.
            </p>
          </div>
          <div>
            {timeline.map((step, idx) => (
              <div key={idx} className="flex gap-6 group">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full shrink-0 mt-1.5 transition-transform group-hover:scale-125" style={{ backgroundColor: '#D4AF37', boxShadow: '0 0 16px rgba(212,175,55,0.4)' }} />
                  {idx !== timeline.length - 1 && <div className="w-px flex-1 mt-2" style={{ backgroundColor: t.borderGold, minHeight: '48px' }} />}
                </div>
                <div className="pb-8 flex-1 rounded-2xl px-6 py-5 mb-3" style={{ backgroundColor: t.bgCard, border: `1px solid ${t.border}`, boxShadow: isDark ? 'none' : '0 2px 12px rgba(0,0,0,0.05)' }}>
                  <span className="text-xs font-bold tracking-widest uppercase block mb-1" style={{ color: isDark ? '#5C7148' : '#4A7A3A' }}>{step.time}</span>
                  <h4 className="text-xl mb-2" style={{ fontFamily: 'var(--font-playfair)', color: t.textHead }}>{step.phase}: {step.title}</h4>
                  <p className="text-sm font-light leading-relaxed" style={{ color: t.textMuted }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="investimento" className="relative z-10 py-24 transition-colors duration-300" style={{ backgroundColor: t.bgPricing, borderTop: `1px solid ${t.border}` }}>
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl mb-4" style={{ fontFamily: 'var(--font-playfair)', color: t.textHead }}>Investimento</h2>
            <p className="text-base font-light leading-relaxed" style={{ color: t.textMuted }}>
              Sem mensalidade. Sem surpresa. Um projeto com valor fixo, escopo fechado e duas formas de pagamento — você escolhe o que faz mais sentido agora.
            </p>
          </div>

          {/* Price hero */}
          <div className="text-center mb-12">
            <div className="inline-block">
              <div className="flex items-end justify-center gap-2 mb-2">
                <span className="text-2xl font-medium" style={{ color: t.textGold }}>R$</span>
                <span className="font-bold leading-none" style={{ fontFamily: 'var(--font-playfair)', color: t.textHead, fontSize: 'clamp(4rem,10vw,7rem)' }}>1.500</span>
              </div>
              <p className="text-sm" style={{ color: t.textMuted }}>valor total do projeto · sem recorrência mensal</p>
            </div>
          </div>

          {/* Payment options */}
          <div className="grid md:grid-cols-2 gap-6 mb-10">

            {/* Full payment */}
            <button
              onClick={() => setPayOption('full')}
              className="rounded-2xl p-8 text-left transition-all cursor-pointer hover:-translate-y-1 relative overflow-hidden"
              style={{
                backgroundColor: payOption === 'full' ? (isDark ? 'rgba(212,175,55,0.08)' : 'rgba(139,90,43,0.06)') : t.bgCard,
                border: payOption === 'full' ? '1px solid #D4AF37' : `1px solid ${t.border}`,
                boxShadow: payOption === 'full' ? '0 0 0 1px rgba(212,175,55,0.2)' : (isDark ? 'none' : '0 2px 16px rgba(0,0,0,0.06)'),
              }}
            >
              {/* Discount badge */}
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: '#D4AF37', color: '#12100E' }}>
                10% OFF
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: isDark ? 'rgba(212,175,55,0.1)' : 'rgba(139,90,43,0.08)', border: `1px solid ${t.borderGold}` }}>
                  <Zap className="w-4 h-4" style={{ color: t.textGold }} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: t.textGold }}>Pagamento Integral</p>
                  <p className="text-xs" style={{ color: t.textMuted }}>à vista na assinatura do contrato</p>
                </div>
              </div>
              <div className="flex items-end gap-2 mb-3">
                <span className="text-lg font-medium" style={{ color: t.textBrown }}>R$</span>
                <span className="text-5xl font-bold transition-all duration-300" style={{ fontFamily: 'var(--font-playfair)', color: t.textHead }}>{totalFull.toLocaleString('pt-BR')}</span>
              </div>
              <p className="text-sm font-light mb-4" style={{ color: t.textMuted }}>
                Pague tudo na assinatura e garanta 10% de desconto — uma economia de R$ {(subtotal - totalFull).toLocaleString('pt-BR')}. Projeto entra em produção imediatamente.
              </p>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center" style={{ borderColor: payOption === 'full' ? '#D4AF37' : t.textDim }}>
                  {payOption === 'full' && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#D4AF37' }} />}
                </div>
                <span className="text-sm font-medium" style={{ color: payOption === 'full' ? t.textGold : t.textMuted }}>
                  {payOption === 'full' ? '✓ Selecionado' : 'Selecionar esta opção'}
                </span>
              </div>
            </button>

            {/* 50/50 payment */}
            <button
              onClick={() => setPayOption('half')}
              className="rounded-2xl p-8 text-left transition-all cursor-pointer hover:-translate-y-1"
              style={{
                backgroundColor: payOption === 'half' ? (isDark ? 'rgba(212,175,55,0.08)' : 'rgba(139,90,43,0.06)') : t.bgCard,
                border: payOption === 'half' ? '1px solid #D4AF37' : `1px solid ${t.border}`,
                boxShadow: payOption === 'half' ? '0 0 0 1px rgba(212,175,55,0.2)' : (isDark ? 'none' : '0 2px 16px rgba(0,0,0,0.06)'),
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: isDark ? 'rgba(212,175,55,0.1)' : 'rgba(139,90,43,0.08)', border: `1px solid ${t.borderGold}` }}>
                  <Clock className="w-4 h-4" style={{ color: t.textGold }} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: t.textGold }}>Pagamento 50/50</p>
                  <p className="text-xs" style={{ color: t.textMuted }}>duas parcelas vinculadas à entrega</p>
                </div>
              </div>
              <div className="flex items-end gap-2 mb-1">
                <span className="text-lg font-medium" style={{ color: t.textBrown }}>2×</span>
                <span className="text-5xl font-bold transition-all duration-300" style={{ fontFamily: 'var(--font-playfair)', color: t.textHead }}>{totalHalf.toLocaleString('pt-BR')}</span>
              </div>
              <p className="text-xs mb-3" style={{ color: t.textDim }}>R$ {totalHalf.toLocaleString('pt-BR')} na assinatura · R$ {totalHalf.toLocaleString('pt-BR')} na entrega final</p>
              <p className="text-sm font-light mb-4" style={{ color: t.textMuted }}>
                Primeira parcela na assinatura do contrato. Segunda parcela na entrega final aprovada — em até 15 dias. Quanto mais rápido aprovamos cada fase, mais curto o intervalo entre os pagamentos.
              </p>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center" style={{ borderColor: payOption === 'half' ? '#D4AF37' : t.textDim }}>
                  {payOption === 'half' && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#D4AF37' }} />}
                </div>
                <span className="text-sm font-medium" style={{ color: payOption === 'half' ? t.textGold : t.textMuted }}>
                  {payOption === 'half' ? '✓ Selecionado' : 'Selecionar esta opção'}
                </span>
              </div>
            </button>
          </div>

          {/* Add-on — checkable */}
          <div
            onClick={() => setAddOnChecked(!addOnChecked)}
            className="rounded-2xl p-6 mb-6 cursor-pointer transition-all duration-200 select-none"
            style={{
              background: addOnChecked
                ? (isDark ? 'linear-gradient(135deg,rgba(212,175,55,0.1) 0%,rgba(92,113,72,0.06) 100%)' : 'linear-gradient(135deg,rgba(139,90,43,0.1) 0%,rgba(74,122,58,0.06) 100%)')
                : (isDark ? 'linear-gradient(135deg,rgba(212,175,55,0.04) 0%,rgba(92,113,72,0.02) 100%)' : 'linear-gradient(135deg,rgba(139,90,43,0.04) 0%,rgba(74,122,58,0.02) 100%)'),
              border: addOnChecked ? '1px solid #D4AF37' : `1px solid ${t.borderGold}`,
              boxShadow: addOnChecked ? '0 0 0 1px rgba(212,175,55,0.15)' : 'none',
            }}
          >
            <div className="flex flex-col md:flex-row md:items-center gap-5">
              {/* Checkbox */}
              <div className="shrink-0 flex items-center gap-4">
                <div
                  className="w-6 h-6 rounded-md flex items-center justify-center transition-all duration-200"
                  style={{
                    backgroundColor: addOnChecked ? '#D4AF37' : 'transparent',
                    border: addOnChecked ? '2px solid #D4AF37' : `2px solid ${t.textDim}`,
                  }}
                >
                  {addOnChecked && (
                    <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7l4 4 6-6" stroke="#12100E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: isDark ? 'rgba(212,175,55,0.1)' : 'rgba(139,90,43,0.08)', border: `1px solid ${t.borderGold}` }}>
                  <Sparkles className="w-5 h-5" style={{ color: t.textGold }} />
                </div>
              </div>

              {/* Text */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded" style={{ backgroundColor: isDark ? 'rgba(212,175,55,0.12)' : 'rgba(139,90,43,0.1)', color: t.textGold }}>Add-on opcional</span>
                  {addOnChecked && <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded" style={{ backgroundColor: isDark ? 'rgba(92,113,72,0.2)' : 'rgba(74,122,58,0.15)', color: t.textGreen }}>✓ Adicionado</span>}
                </div>
                <h4 className="text-base font-semibold mb-1" style={{ fontFamily: 'var(--font-playfair)', color: t.textHead }}>Ferramenta de Criação de Posts com IA</h4>
                <p className="text-sm font-light leading-relaxed" style={{ color: t.textMuted }}>Templates personalizados com o branding da Nefertari — paleta, tipografia e tom de voz — para criar posts no Instagram com consistência e agilidade, sem depender de designer.</p>
              </div>

              {/* Price */}
              <div className="shrink-0 text-center md:text-right">
                <div className="flex items-end gap-1 justify-center md:justify-end">
                  <span className="text-sm font-medium" style={{ color: t.textBrown }}>R$</span>
                  <span className="text-3xl font-bold" style={{ fontFamily: 'var(--font-playfair)', color: addOnChecked ? t.textGold : t.textHead }}>300</span>
                </div>
                <p className="text-xs mt-0.5" style={{ color: t.textDim }}>pagamento único</p>
              </div>
            </div>
          </div>

          {/* Live total summary */}
          <div className="rounded-2xl p-6 mb-6 transition-all duration-300" style={{ backgroundColor: isDark ? 'rgba(212,175,55,0.03)' : 'rgba(139,90,43,0.03)', border: `1px solid ${t.borderGold}` }}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: t.textGold }}>Resumo do investimento</p>
              {addOnChecked && (
                <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ backgroundColor: isDark ? 'rgba(92,113,72,0.2)' : 'rgba(74,122,58,0.15)', color: t.textGreen }}>+ Add-on incluído</span>
              )}
            </div>

            <div className="space-y-2 mb-5">
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: t.textMuted }}>Contrato base</span>
                <span className="text-sm font-medium" style={{ color: t.text }}>R$ 1.500</span>
              </div>
              {addOnChecked && (
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: t.textMuted }}>Ferramenta de Posts com IA</span>
                  <span className="text-sm font-medium" style={{ color: t.textGold }}>+ R$ 300</span>
                </div>
              )}
              <div className="pt-2 border-t flex justify-between items-center" style={{ borderColor: t.border }}>
                <span className="text-sm font-semibold" style={{ color: t.text }}>Subtotal</span>
                <span className="text-sm font-bold" style={{ color: t.textHead }}>R$ {subtotal.toLocaleString('pt-BR')}</span>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div className="rounded-xl p-4 text-center" style={{ backgroundColor: isDark ? 'rgba(212,175,55,0.06)' : 'rgba(139,90,43,0.06)', border: `1px solid ${t.borderGold}` }}>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: t.textGold }}>Integral (10% off)</p>
                <div className="flex items-end justify-center gap-1">
                  <span className="text-sm font-medium" style={{ color: t.textBrown }}>R$</span>
                  <span className="text-3xl font-bold transition-all duration-300" style={{ fontFamily: 'var(--font-playfair)', color: t.textHead }}>{totalFull.toLocaleString('pt-BR')}</span>
                </div>
                <p className="text-xs mt-1" style={{ color: t.textGreen }}>economia de R$ {(subtotal - totalFull).toLocaleString('pt-BR')}</p>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.03)', border: `1px solid ${t.border}` }}>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: t.textMuted }}>50/50</p>
                <div className="flex items-end justify-center gap-1">
                  <span className="text-sm font-medium" style={{ color: t.textBrown }}>2×</span>
                  <span className="text-3xl font-bold transition-all duration-300" style={{ fontFamily: 'var(--font-playfair)', color: t.textHead }}>{totalHalf.toLocaleString('pt-BR')}</span>
                </div>
                <p className="text-xs mt-1" style={{ color: t.textDim }}>na assinatura + na entrega</p>
              </div>
            </div>
          </div>

          {/* What's included */}
          <div className="rounded-2xl p-6" style={{ backgroundColor: isDark ? 'rgba(212,175,55,0.02)' : 'rgba(139,90,43,0.02)', border: `1px solid ${t.border}` }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: t.textGold }}>Tudo incluído no valor</p>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {[
                'Branding & Identidade Visual completa',
                'Site profissional com SEO local',
                'Sistema de pedidos & gestão de OS',
                'Manual de marca documentado',
                ...(addOnChecked ? ['Ferramenta de Posts com IA ✓'] : []),
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: i === 4 ? t.textGold : t.textGreen }} />
                  <span className="text-xs font-medium" style={{ color: i === 4 ? t.textGold : t.text }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 py-20 text-center transition-colors duration-300" style={{ backgroundColor: t.bgFooter, borderTop: `1px solid ${t.border}` }}>
        <div className="max-w-3xl mx-auto px-6">
          <div className="w-14 h-14 mx-auto mb-8 rounded-full flex items-center justify-center" style={{ backgroundColor: isDark ? 'rgba(212,175,55,0.05)' : 'rgba(139,90,43,0.08)', border: `1px solid ${t.borderGold}` }}>
            <Leaf className="w-7 h-7" style={{ color: t.textGreen }} />
          </div>
          <h2 className="text-3xl md:text-4xl mb-5" style={{ fontFamily: 'var(--font-playfair)', color: t.textHead }}>
            Jéssica, a Nefertari começa aqui.
          </h2>
          <p className="text-base font-light mb-10 max-w-xl mx-auto leading-relaxed" style={{ color: t.textMuted }}>
            Escolha a forma de pagamento que faz sentido pra você agora e vamos nessa! Estou pronto para começar amanhã — com energia total, foco no prazo e cada entrega feita com o cuidado que a Nefertari merece.
          </p>
          <a
            href={payOption === 'none' ? '#investimento' : waHref}
            target={payOption === 'none' ? '_self' : '_blank'}
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-medium transition-all hover:opacity-90"
            style={{
              border: `1px solid ${isDark ? 'rgba(212,175,55,0.4)' : 'rgba(139,90,43,0.4)'}`,
              color: t.textGold,
              backgroundColor: payOption !== 'none' ? (isDark ? 'rgba(212,175,55,0.08)' : 'rgba(139,90,43,0.06)') : 'transparent',
            }}
          >
            {waLabels[payOption]} <ArrowRight className="w-5 h-5" />
          </a>
          <div className="mt-16 pt-6 text-xs tracking-widest uppercase" style={{ color: t.textDim, borderTop: `1px solid ${t.border}` }}>
            &copy; {new Date().getFullYear()} Proposta confidencial para Nefertari Cozinha Viva · v2
          </div>
        </div>
      </footer>

    </div>
  );
}
