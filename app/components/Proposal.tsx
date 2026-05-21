'use client';

import React, { useState } from 'react';
import {
  Leaf, Search, Smartphone, Share2, BarChart3,
  ShoppingCart, Users, Target, CheckCircle2, ArrowRight,
  TrendingUp, Sun, Moon,
} from 'lucide-react';

// ─── Theme tokens ────────────────────────────────────────────────────────────
const dark = {
  bg:          '#12100E',
  bgSection:   'rgba(255,255,255,0.02)',
  bgCard:      'rgba(255,255,255,0.02)',
  bgPricing:   'rgba(0,0,0,0.3)',
  bgFooter:    '#0A0908',
  bgImageCard: '#0e0c0a',
  border:      'rgba(255,255,255,0.05)',
  borderGold:  'rgba(212,175,55,0.2)',
  text:        '#E8E5DF',
  textHead:    '#FDFBF7',
  textMuted:   '#A39D93',
  textDim:     '#6B6560',
  textGold:    '#D4AF37',
  textGreen:   '#8BAA6D',
  textBrown:   '#8B5A2B',
  navBg:       'rgba(18,16,14,0.8)',
  planBg:      'linear-gradient(145deg,#1A1612 0%,#12100E 100%)',
  toggleBg:    'rgba(255,255,255,0.06)',
  toggleBorder:'rgba(255,255,255,0.1)',
  toggleIcon:  '#D4AF37',
  ambientA:    'bg-[#5C7148]/10',
  ambientB:    'bg-[#D4AF37]/10',
};

const light = {
  bg:          '#F5F0E8',
  bgSection:   'rgba(0,0,0,0.03)',
  bgCard:      '#FFFFFF',
  bgPricing:   'rgba(0,0,0,0.04)',
  bgFooter:    '#EDE8DF',
  bgImageCard: '#F0EBE0',
  border:      'rgba(0,0,0,0.08)',
  borderGold:  'rgba(139,90,43,0.3)',
  text:        '#2C2520',
  textHead:    '#1A1208',
  textMuted:   '#6B5E50',
  textDim:     '#9C8E80',
  textGold:    '#8B5A2B',
  textGreen:   '#4A7A3A',
  textBrown:   '#8B5A2B',
  navBg:       'rgba(245,240,232,0.9)',
  planBg:      'linear-gradient(145deg,#FDF8F0 0%,#F5F0E8 100%)',
  toggleBg:    'rgba(0,0,0,0.06)',
  toggleBorder:'rgba(0,0,0,0.12)',
  toggleIcon:  '#8B5A2B',
  ambientA:    'bg-[#5C7148]/5',
  ambientB:    'bg-[#D4AF37]/5',
};

// ─── Services data ────────────────────────────────────────────────────────────
const services = [
  { icon: Target,      title: 'Branding & Posicionamento Estratégico', tag: 'Identidade de Marca',     desc: 'Criamos a alma visual e verbal da Nefertari — logotipo, paleta, tipografia e tom de voz — para que cada ponto de contato transmita a mesma mensagem: cuidado, ancestralidade e qualidade. Uma marca forte faz o cliente escolher você antes mesmo de provar o produto.' },
  { icon: Search,      title: 'Site Profissional & SEO Local',          tag: 'Presença Digital',        desc: 'Desenvolvemos um site otimizado para aparecer no Google quando alguém na sua cidade busca por "comida saudável" ou "delivery natural". SEO é o trabalho técnico que faz sua marca ser encontrada organicamente — sem pagar por cada clique.' },
  { icon: Smartphone,  title: 'Gestão de Redes Sociais',                tag: 'Conteúdo & Engajamento',  desc: 'Produzimos e publicamos conteúdo estratégico no Instagram com calendário editorial, copywriting e design. Cada post tem um objetivo: gerar desejo, construir autoridade ou converter seguidores em clientes. Você foca na cozinha; nós cuidamos da vitrine digital.' },
  { icon: Share2,      title: 'Campanhas Integradas (Omnichannel)',      tag: 'Marketing 360º',          desc: 'Criamos campanhas que funcionam em todos os canais ao mesmo tempo — Instagram, WhatsApp, site e materiais físicos — com a mesma mensagem e visual. O cliente vê sua marca em vários lugares e a percepção de valor aumenta naturalmente.' },
  { icon: Users,       title: 'CRM & Automação de Relacionamento',       tag: 'Fidelização de Clientes', desc: 'CRM é um sistema que registra cada cliente, o que comprou e quando. Com isso, enviamos mensagens automáticas no momento certo — aniversário, recompra, promoção exclusiva. Clientes que se sentem lembrados voltam mais e gastam mais.' },
  { icon: ShoppingCart,title: 'Sistema de Pedidos & Gestão de OS',       tag: 'Operação Inteligente',    desc: 'Implantamos um sistema digital de Ordens de Serviço que organiza cada pedido do recebimento à entrega. Chega de anotações em papel ou mensagens perdidas no WhatsApp. A cozinha recebe o pedido em tempo real e você tem controle total do fluxo.' },
  { icon: BarChart3,   title: 'Tráfego Pago (Meta & Google Ads)',        tag: 'Aquisição de Clientes',   desc: 'Gerenciamos anúncios pagos no Instagram, Facebook e Google para levar sua marca a pessoas que ainda não te conhecem, mas têm exatamente o perfil do seu cliente ideal. Cada real investido é monitorado para garantir o melhor retorno possível.' },
  { icon: TrendingUp,  title: 'Dashboard de Métricas & KPIs',            tag: 'Inteligência de Negócio', desc: 'Você terá acesso a um painel em tempo real com os números que realmente importam: CAC (custo por cliente), ROI (retorno sobre anúncios) e LTV (valor do cliente ao longo do tempo). Decisões baseadas em dados, não em achismo.' },
];

const timeline = [
  { phase: 'Fase 1', title: 'Setup & Fundação',          time: 'Semanas 1-2',    desc: 'Aprovamos juntos o branding completo — logo, cores, tipografia e tom de voz. Configuramos o sistema de pedidos e estruturamos o ecossistema digital: site, redes sociais e CRM. É a base que sustenta tudo que vem depois.' },
  { phase: 'Fase 2', title: 'Aquecimento de Marca',       time: 'Semanas 3-4',    desc: 'Publicamos os 9 posts estruturais que definem o posicionamento da Nefertari no Instagram. Iniciamos campanhas de Brand Awareness — anúncios focados em fazer as pessoas conhecerem e lembrarem da sua marca antes mesmo de precisar comprar.' },
  { phase: 'Fase 3', title: 'Lançamento & Conversão',     time: 'Mês 2',          desc: 'Abertura oficial com campanhas de conversão ativas: anúncios direcionados para gerar pedidos reais, não apenas curtidas. O site entra no ar com SEO configurado e o sistema de pedidos operando em plena capacidade.' },
  { phase: 'Fase 4', title: 'Growth & Retenção Contínua', time: 'Mês 3 em diante', desc: 'Otimizamos os anúncios com base nos dados reais de CAC e ROI. Ativamos o funil de retenção no CRM — clientes que compraram recebem comunicações automáticas para voltar. Reuniões quinzenais de estratégia para ajustar o rumo conforme o negócio cresce.' },
];

export default function Proposal() {
  const [selectedPlan, setSelectedPlan] = useState<'none' | 'essencial' | 'anual'>('none');
  const [isDark, setIsDark] = useState(true);
  const t = isDark ? dark : light;

  const waNumber = '5573988083318';
  const waMessages: Record<string, string> = {
    none:     'Olá! Gostaria de saber mais sobre os planos da Nefertari.',
    essencial:'Olá! Tenho interesse no *Plano Essencial — Presença & Autoridade* (R$ 2.500 setup + R$ 500/mês). Podemos conversar?',
    anual:    'Olá! Tenho interesse no *Plano Ecossistema Anual — Tudo. Por Menos.* (R$ 5.500/ano). Podemos conversar?',
  };
  const waLabels: Record<string, string> = {
    none:     'Escolha um plano e fale comigo',
    essencial:'Quero o Plano Essencial — Falar no WhatsApp',
    anual:    'Quero o Plano Anual — Falar no WhatsApp',
  };
  const waHref = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessages[selectedPlan])}`;

  return (
    <div className="min-h-screen font-sans transition-colors duration-300" style={{ backgroundColor: t.bg, color: t.text }}>

      {/* Ambient blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[150px] ${t.ambientA}`} />
        <div className={`absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[150px] ${t.ambientB}`} />
      </div>

      {/* ── Theme toggle (floating) ── */}
      <button
        onClick={() => setIsDark(!isDark)}
        className="fixed top-5 right-5 z-50 w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
        style={{ backgroundColor: t.toggleBg, border: `1px solid ${t.toggleBorder}`, backdropFilter: 'blur(12px)' }}
        aria-label="Alternar tema"
      >
        {isDark
          ? <Sun  className="w-5 h-5" style={{ color: t.toggleIcon }} />
          : <Moon className="w-5 h-5" style={{ color: t.toggleIcon }} />}
      </button>

      {/* ── HERO ── */}
      <section id="proposta" className="relative z-10 px-6" style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center' }}>
        <div className="max-w-5xl mx-auto w-full py-6">

          <div className="flex justify-center mb-0">
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-3xl scale-125" style={{ backgroundColor: isDark ? 'rgba(212,175,55,0.12)' : 'rgba(139,90,43,0.08)' }} />
              <img
                src="/nefertari-logo-golden.png"
                onError={(e) => { const t2 = e.target as HTMLImageElement; t2.onerror = null; t2.src = 'https://placehold.co/200x200/12100E/D4AF37?text=N'; }}
                alt="Nefertari Logo"
                className="relative object-contain"
                style={{ height: 'clamp(180px, 22vw, 300px)', width: 'clamp(180px, 22vw, 300px)', filter: isDark ? 'none' : 'brightness(0.85)' }}
              />
            </div>
          </div>

          <div className="text-center mb-5">
            <h1 className="mb-4 leading-[1.1]" style={{ fontFamily: 'var(--font-playfair)', color: t.textHead, fontSize: 'clamp(1.6rem, 2.8vw, 2.6rem)' }}>
              A Nefertari já tem alma.{' '}
              <br className="hidden sm:block" />
              <span style={{ background: 'linear-gradient(90deg, #D4AF37 0%, #E6C27A 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Agora ela precisa ser encontrada.
              </span>
            </h1>

            <div className="grid md:grid-cols-2 gap-4 text-left max-w-3xl mx-auto mb-6">
              <p className="text-sm leading-relaxed font-light" style={{ color: t.textMuted }}>
                Jéssica, você construiu algo raro — uma cozinha com propósito, produtos com identidade e uma filosofia que ressoa fundo em quem prova. Isso não é comum. Isso é valioso.
              </p>
              <p className="text-sm leading-relaxed font-light" style={{ color: t.textMuted }}>
                É uma honra poder contribuir com esse projeto. Esta proposta foi pensada especialmente para a Nefertari — para que o mundo digital reflita, com a mesma intensidade, tudo o que você já criou dentro da cozinha.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <a href="#investimento" className="px-7 py-3 font-semibold rounded-full flex items-center justify-center gap-2 group text-sm transition-opacity hover:opacity-90" style={{ backgroundColor: '#D4AF37', color: '#12100E' }}>
                Ver os Planos <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#escopo" className="px-7 py-3 font-medium rounded-full flex items-center justify-center text-sm transition-all hover:opacity-80" style={{ border: `1px solid ${t.border}`, color: t.text }}>
                O que está incluído
              </a>
            </div>
          </div>

          {/* Product showcase */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { src: '/burguer1.png',  alt: 'Burger 1',    tag: 'Cozinha Viva',       label: 'Feito com intenção',  tagColor: t.textGold,  span: 'col-span-1 md:col-span-2', h: 'clamp(140px,18vw,260px)', border: t.borderGold },
              { src: '/burguer2.png',  alt: 'Burger 2',    tag: 'Sabor & Propósito',  label: 'Cada detalhe importa',tagColor: t.textGold,  span: 'col-span-1 md:col-span-2', h: 'clamp(140px,18vw,260px)', border: t.borderGold },
              { src: '/nefertari1.png',alt: 'Bebida Viva', tag: 'Nutrição Ancestral', label: 'Alimentar é sagrado', tagColor: t.textGreen, span: 'col-span-1 md:col-span-2', h: 'clamp(110px,12vw,170px)', border: isDark ? 'rgba(92,113,72,0.25)' : 'rgba(74,122,58,0.3)' },
              { src: '/nefertari2.png',alt: 'Prato',       tag: 'Cozinha Viva',       label: 'Vida em cada prato',  tagColor: t.textGold,  span: 'col-span-1 md:col-span-2', h: 'clamp(110px,12vw,170px)', border: t.borderGold },
            ].map((img, i) => (
              <div key={i} className={`relative rounded-2xl overflow-hidden group ${img.span}`} style={{ border: `1px solid ${img.border}`, backgroundColor: t.bgImageCard }}>
                <img src={img.src} alt={`Nefertari — ${img.alt}`} className="w-full object-contain transform group-hover:scale-105 transition-transform duration-700" style={{ height: img.h }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4">
                  <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: img.tagColor }}>{img.tag}</span>
                  <p className="text-sm mt-0.5 leading-tight" style={{ fontFamily: 'var(--font-playfair)', color: '#FDFBF7' }}>{img.label}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="escopo" className="relative z-10 py-24 transition-colors duration-300" style={{ backgroundColor: t.bgSection, borderTop: `1px solid ${t.border}`, borderBottom: `1px solid ${t.border}` }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl mb-4" style={{ fontFamily: 'var(--font-playfair)', color: t.textHead }}>O Que Está Incluído</h2>
            <p className="text-base font-light leading-relaxed" style={{ color: t.textMuted }}>
              Cada entrega resolve um problema real do negócio. Você não está comprando serviços avulsos — está contratando um ecossistema completo que trabalha junto, 24 horas por dia.
            </p>
          </div>

          {/* Services: 2-col layout — icon+tag left, text right */}
          <div className="grid md:grid-cols-2 gap-4">
            {services.map((service, idx) => {
              const Icon = service.icon;
              return (
                <div
                  key={idx}
                  className="flex gap-5 p-6 rounded-2xl transition-all duration-300 group hover:-translate-y-1"
                  style={{ backgroundColor: t.bgCard, border: `1px solid ${t.border}`, boxShadow: isDark ? 'none' : '0 2px 12px rgba(0,0,0,0.06)' }}
                >
                  {/* Left: icon */}
                  <div className="shrink-0">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{ backgroundColor: isDark ? 'rgba(212,175,55,0.1)' : 'rgba(139,90,43,0.08)', border: `1px solid ${t.borderGold}` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: t.textGold }} />
                    </div>
                  </div>
                  {/* Right: tag + title + desc */}
                  <div className="flex-1 min-w-0">
                    <span
                      className="text-[10px] font-bold uppercase tracking-widest inline-block px-2 py-0.5 rounded mb-2"
                      style={{ backgroundColor: isDark ? 'rgba(92,113,72,0.12)' : 'rgba(74,122,58,0.1)', color: t.textGreen }}
                    >
                      {service.tag}
                    </span>
                    <h3 className="text-base font-semibold mb-2 leading-snug" style={{ fontFamily: 'var(--font-playfair)', color: t.textHead }}>
                      {service.title}
                    </h3>
                    <p className="text-sm font-light leading-relaxed" style={{ color: t.textMuted }}>
                      {service.desc}
                    </p>
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
            <h2 className="text-4xl md:text-5xl mb-4" style={{ fontFamily: 'var(--font-playfair)', color: t.textHead }}>Plano de Ação</h2>
            <p className="text-base font-light leading-relaxed max-w-xl mx-auto" style={{ color: t.textMuted }}>
              Um cronograma claro e sem surpresas. Cada fase tem entregas definidas para que você saiba exatamente o que esperar — e quando.
            </p>
          </div>
          <div>
            {timeline.map((step, idx) => (
              <div key={idx} className="flex gap-6 group">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full shrink-0 mt-1.5 transition-transform group-hover:scale-125" style={{ backgroundColor: '#D4AF37', boxShadow: '0 0 16px rgba(212,175,55,0.4)' }} />
                  {idx !== timeline.length - 1 && <div className="w-px flex-1 mt-2" style={{ backgroundColor: t.borderGold, minHeight: '48px' }} />}
                </div>
                <div className="pb-10 flex-1 rounded-2xl px-6 py-5 mb-3" style={{ backgroundColor: t.bgCard, border: `1px solid ${t.border}`, boxShadow: isDark ? 'none' : '0 2px 12px rgba(0,0,0,0.05)' }}>
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
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl mb-4" style={{ fontFamily: 'var(--font-playfair)', color: t.textHead }}>Investimento</h2>
            <p className="text-base font-light leading-relaxed" style={{ color: t.textMuted }}>
              Dois caminhos, um destino: uma Nefertari reconhecida, desejada e lucrativa. O plano anual entrega mais serviços, mais resultado — e ainda custa menos.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Essencial */}
            <div className="rounded-[2rem] p-10 flex flex-col relative transition-transform hover:-translate-y-1" style={{ backgroundColor: t.bgCard, border: `1px solid ${t.border}`, boxShadow: isDark ? 'none' : '0 4px 24px rgba(0,0,0,0.08)' }}>
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', color: t.textMuted }}>Plano Essencial</span>
              <h3 className="text-3xl mb-3" style={{ fontFamily: 'var(--font-playfair)', color: t.textHead }}>Presença & Autoridade</h3>
              <p className="text-sm font-light mb-8" style={{ color: t.textMuted }}>Um pacote robusto para quem quer marca profissional, presença digital ativa e clientes chegando por anúncios — com gestão contínua mês a mês.</p>
              <div className="mb-8 p-5 rounded-2xl" style={{ backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.04)' }}>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-lg font-medium" style={{ color: t.textBrown }}>R$</span>
                  <span className="text-4xl font-bold" style={{ color: t.textHead }}>2.500</span>
                  <span className="text-sm pb-1" style={{ color: t.textMuted }}>/setup único</span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-bold" style={{ color: t.textGold }}>+</span>
                  <span className="text-lg font-medium" style={{ color: t.textBrown }}>R$</span>
                  <span className="text-2xl font-bold" style={{ color: t.textHead }}>500</span>
                  <span className="text-sm" style={{ color: t.textMuted }}>/mês (gestão)</span>
                </div>
                <p className="text-xs" style={{ color: t.textDim }}>No primeiro ano: R$ 8.500 no total. O Plano Anual entrega mais por R$ 3.000 a menos.</p>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {[
                  { item: 'Branding & Identidade Visual Completa',       sub: 'Logo, paleta, tipografia e manual de marca' },
                  { item: 'Configuração Profissional das Redes Sociais', sub: 'Bio, destaques, links e primeiros posts' },
                  { item: 'Design de Cardápio Digital',                  sub: 'Apresentação visual dos produtos para venda online' },
                  { item: 'Gestão de Tráfego Pago (Meta Ads)',           sub: 'Anúncios no Instagram e Facebook para atrair clientes' },
                  { item: 'Relatório Mensal de Resultados',              sub: 'Números claros sobre o que está funcionando' },
                ].map(({ item, sub }, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: t.textGreen }} />
                    <div>
                      <span className="text-sm font-medium block" style={{ color: t.text }}>{item}</span>
                      <span className="text-xs font-light" style={{ color: t.textDim }}>{sub}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <button
                className="w-full py-4 rounded-xl font-semibold transition-all cursor-pointer"
                style={{ border: selectedPlan === 'essencial' ? '1px solid #D4AF37' : `1px solid ${t.border}`, color: selectedPlan === 'essencial' ? '#D4AF37' : t.text, backgroundColor: selectedPlan === 'essencial' ? 'rgba(212,175,55,0.08)' : 'transparent' }}
                onClick={() => setSelectedPlan('essencial')}
              >
                {selectedPlan === 'essencial' ? '✓ Plano Essencial Selecionado' : 'Selecionar Plano Essencial'}
              </button>
            </div>

            {/* Anual */}
            <div className="rounded-[2rem] p-10 flex flex-col relative overflow-hidden md:scale-105" style={{ background: t.planBg, border: '1px solid rgba(212,175,55,0.3)', boxShadow: isDark ? '0 20px 40px rgba(212,175,55,0.05)' : '0 20px 40px rgba(139,90,43,0.1)' }}>
              <div className="absolute top-0 right-0 px-5 py-2 text-xs font-bold uppercase tracking-widest rounded-bl-2xl" style={{ backgroundColor: '#D4AF37', color: '#12100E' }}>Melhor Custo-Benefício</div>
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 mt-2" style={{ backgroundColor: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)' }}>Plano Ecossistema Anual</span>
              <h3 className="text-4xl mb-3" style={{ fontFamily: 'var(--font-playfair)', color: t.textHead }}>Tudo. Por Menos.</h3>
              <p className="text-sm font-light mb-8" style={{ color: t.textMuted }}>O pacote mais completo — site, CRM, tráfego, automação e estratégia — por um valor anual fixo que sai mais barato que o plano mensal e entrega o dobro.</p>
              <div className="mb-8 p-5 rounded-2xl" style={{ backgroundColor: 'rgba(212,175,55,0.03)', border: '1px solid rgba(212,175,55,0.1)' }}>
                <div className="flex items-end gap-2 mb-1">
                  <span className="text-2xl font-medium" style={{ color: '#D4AF37' }}>R$</span>
                  <span className="text-6xl font-bold" style={{ color: t.textHead }}>5.500</span>
                  <span className="text-sm pb-2" style={{ color: t.textMuted }}>/ano</span>
                </div>
                <p className="text-xs mb-3" style={{ color: t.textDim }}>Equivale a R$ 458/mês — setup e gestão inclusos</p>
                <div className="text-sm font-semibold px-3 py-2 rounded-lg inline-flex items-center gap-2" style={{ backgroundColor: 'rgba(92,113,72,0.15)', color: t.textGreen, border: '1px solid rgba(92,113,72,0.2)' }}>
                  <span>💰</span><span>R$ 3.000 mais barato que o plano mensal no mesmo período</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {[
                  { item: 'Tudo do Plano Essencial',                    sub: 'Branding, redes, cardápio, tráfego e relatórios',          hi: true },
                  { item: 'Site Institucional com SEO Avançado',        sub: 'Apareça no Google quando seu cliente procurar por você',    hi: false },
                  { item: 'Sistema CRM + Gestão de Pedidos (OS)',       sub: 'Controle total do relacionamento e do fluxo de cozinha',    hi: false },
                  { item: 'Tráfego Pago Completo (Meta + Google Ads)',  sub: 'Anúncios nos dois maiores canais de aquisição do mundo',    hi: false },
                  { item: 'Automação de Retenção de Clientes',          sub: 'Mensagens automáticas que trazem o cliente de volta',       hi: false },
                  { item: 'Dashboard de Métricas em Tempo Real',        sub: 'CAC, ROI e LTV sempre visíveis, sem precisar pedir relatório', hi: false },
                  { item: 'Reuniões Quinzenais de Estratégia',          sub: 'Alinhamento constante para ajustar e acelerar os resultados', hi: false },
                ].map(({ item, sub, hi }, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#D4AF37' }} />
                    <div>
                      <span className="text-sm font-medium block" style={{ color: hi ? '#D4AF37' : t.textHead }}>{item}</span>
                      <span className="text-xs font-light" style={{ color: t.textDim }}>{sub}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <button
                className="w-full py-5 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-transform hover:scale-[1.02] cursor-pointer"
                style={{ backgroundColor: '#D4AF37', color: '#12100E', boxShadow: '0 10px 25px rgba(212,175,55,0.2)' }}
                onClick={() => setSelectedPlan('anual')}
              >
                {selectedPlan === 'anual' ? '✓ Plano Anual Selecionado' : <><span>Quero o Plano Anual</span><ArrowRight className="w-5 h-5" /></>}
              </button>
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
            Jéssica, é uma honra poder fazer parte disso.
          </h2>
          <p className="text-base font-light mb-10 max-w-xl mx-auto leading-relaxed" style={{ color: t.textMuted }}>
            A Nefertari tem tudo para se tornar uma referência — e esta proposta é o mapa para chegar lá. Escolha o plano que faz sentido pra você agora e me chama, Jess. Vamos construir isso juntos, com cuidado e intenção.
          </p>
          <a
            href={selectedPlan === 'none' ? '#investimento' : waHref}
            target={selectedPlan === 'none' ? '_self' : '_blank'}
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-medium transition-all hover:opacity-90"
            style={{ border: `1px solid ${isDark ? 'rgba(212,175,55,0.4)' : 'rgba(139,90,43,0.4)'}`, color: t.textGold, backgroundColor: selectedPlan !== 'none' ? (isDark ? 'rgba(212,175,55,0.08)' : 'rgba(139,90,43,0.06)') : 'transparent' }}
          >
            {waLabels[selectedPlan]} <ArrowRight className="w-5 h-5" />
          </a>
          <div className="mt-16 pt-6 text-xs tracking-widest uppercase" style={{ color: t.textDim, borderTop: `1px solid ${t.border}` }}>
            &copy; {new Date().getFullYear()} Proposta confidencial para Nefertari Cozinha Viva.
          </div>
        </div>
      </footer>

    </div>
  );
}
