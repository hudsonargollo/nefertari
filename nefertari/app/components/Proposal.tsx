'use client';

import React, { useState } from 'react';
import {
  Leaf,
  Search,
  Smartphone,
  Share2,
  BarChart3,
  ShoppingCart,
  Users,
  Target,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

const services = [
  {
    icon: <Target className="w-6 h-6 text-[#D4AF37]" />,
    title: 'Branding & Posicionamento Estratégico',
    tag: 'Identidade de Marca',
    desc: 'Criamos a alma visual e verbal da Nefertari — logotipo, paleta, tipografia e tom de voz — para que cada ponto de contato com o cliente transmita a mesma mensagem: cuidado, ancestralidade e qualidade. Uma marca forte faz o cliente escolher você antes mesmo de provar o produto.',
  },
  {
    icon: <Search className="w-6 h-6 text-[#D4AF37]" />,
    title: 'Site Profissional & SEO Local',
    tag: 'Presença Digital',
    desc: 'Desenvolvemos um site otimizado para aparecer no Google quando alguém na sua cidade busca por "comida saudável" ou "delivery natural". SEO (Search Engine Optimization) é o trabalho técnico que faz sua marca ser encontrada organicamente — sem pagar por cada clique.',
  },
  {
    icon: <Smartphone className="w-6 h-6 text-[#D4AF37]" />,
    title: 'Gestão de Redes Sociais',
    tag: 'Conteúdo & Engajamento',
    desc: 'Produzimos e publicamos conteúdo estratégico no Instagram com calendário editorial, copywriting e design. Cada post tem um objetivo: gerar desejo, construir autoridade ou converter seguidores em clientes. Você foca na cozinha; nós cuidamos da vitrine digital.',
  },
  {
    icon: <Share2 className="w-6 h-6 text-[#D4AF37]" />,
    title: 'Campanhas Integradas (Omnichannel)',
    tag: 'Marketing 360º',
    desc: 'Criamos campanhas que funcionam em todos os canais ao mesmo tempo — Instagram, WhatsApp, site e até materiais físicos — com a mesma mensagem e visual. Isso multiplica o impacto: o cliente vê sua marca em vários lugares e a percepção de valor aumenta naturalmente.',
  },
  {
    icon: <Users className="w-6 h-6 text-[#D4AF37]" />,
    title: 'CRM & Automação de Relacionamento',
    tag: 'Fidelização de Clientes',
    desc: 'CRM (Customer Relationship Management) é um sistema que registra cada cliente, o que ele comprou e quando. Com isso, enviamos mensagens automáticas no momento certo — aniversário, recompra, promoção exclusiva. Clientes que se sentem lembrados voltam mais e gastam mais.',
  },
  {
    icon: <ShoppingCart className="w-6 h-6 text-[#D4AF37]" />,
    title: 'Sistema de Pedidos & Gestão de OS',
    tag: 'Operação Inteligente',
    desc: 'Implantamos um sistema digital de Ordens de Serviço que organiza cada pedido do recebimento à entrega. Chega de anotações em papel ou mensagens perdidas no WhatsApp. A cozinha recebe o pedido em tempo real, o cliente acompanha o status e você tem controle total do fluxo.',
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-[#D4AF37]" />,
    title: 'Tráfego Pago (Meta & Google Ads)',
    tag: 'Aquisição de Clientes',
    desc: 'Gerenciamos anúncios pagos no Instagram, Facebook e Google para levar sua marca a pessoas que ainda não te conhecem, mas têm exatamente o perfil do seu cliente ideal. Cada real investido é monitorado para garantir o melhor retorno possível — sem desperdício de verba.',
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-[#D4AF37]" />,
    title: 'Dashboard de Métricas & KPIs',
    tag: 'Inteligência de Negócio',
    desc: 'Você terá acesso a um painel em tempo real com os números que realmente importam: CAC (quanto custa adquirir um cliente), ROI (retorno sobre o investimento em anúncios) e LTV (quanto cada cliente gera ao longo do tempo). Decisões baseadas em dados, não em achismo.',
  },
];

const timeline = [
  {
    phase: 'Fase 1',
    title: 'Setup & Fundação',
    time: 'Semanas 1-2',
    desc: 'Aprovamos juntos o branding completo — logo, cores, tipografia e tom de voz. Configuramos o sistema de pedidos e estruturamos o ecossistema digital: site, redes sociais e CRM. É a base que sustenta tudo que vem depois.',
  },
  {
    phase: 'Fase 2',
    title: 'Aquecimento de Marca',
    time: 'Semanas 3-4',
    desc: 'Publicamos os 9 posts estruturais que definem o posicionamento da Nefertari no Instagram. Iniciamos campanhas de Brand Awareness — anúncios focados em fazer as pessoas conhecerem e lembrarem da sua marca antes mesmo de precisar comprar.',
  },
  {
    phase: 'Fase 3',
    title: 'Lançamento & Conversão',
    time: 'Mês 2',
    desc: 'Abertura oficial com campanhas de conversão ativas: anúncios direcionados para gerar pedidos reais, não apenas curtidas. O site entra no ar com SEO configurado e o sistema de pedidos operando em plena capacidade.',
  },
  {
    phase: 'Fase 4',
    title: 'Growth & Retenção Contínua',
    time: 'Mês 3 em diante',
    desc: 'Otimizamos os anúncios com base nos dados reais de CAC e ROI. Ativamos o funil de retenção no CRM — clientes que compraram recebem comunicações automáticas para voltar. Reuniões quinzenais de estratégia para ajustar o rumo conforme o negócio cresce.',
  },
];

export default function Proposal() {
  const [, setActiveTab] = useState('mensal');

  return (
    <div
      className="min-h-screen font-sans selection:bg-[#D4AF37] selection:text-[#12100E]"
      style={{ backgroundColor: '#12100E', color: '#E8E5DF' }}
    >
      {/* Ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#5C7148]/10 blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#D4AF37]/10 blur-[150px]" />
      </div>

      {/* Navbar */}
      <nav
        className="fixed w-full z-50 backdrop-blur-xl border-b border-white/5"
        style={{ backgroundColor: 'rgba(18, 16, 14, 0.8)' }}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: '#D4AF37' }}>
            Nefertari
          </span>
          <div className="hidden md:flex gap-8 text-sm font-medium" style={{ color: '#A39D93' }}>
            <a href="#proposta" className="hover:text-[#D4AF37] transition-colors">A Proposta</a>
            <a href="#escopo" className="hover:text-[#D4AF37] transition-colors">Escopo 360</a>
            <a href="#timeline" className="hover:text-[#D4AF37] transition-colors">Cronograma</a>
            <a href="#investimento" className="hover:text-[#D4AF37] transition-colors">Investimento</a>
          </div>
          <a
            href="#investimento"
            className="px-7 py-2.5 text-sm font-medium rounded-full transition-all flex items-center gap-2"
            style={{ backgroundColor: '#8B5A2B', color: '#FFF', boxShadow: '0 4px 20px rgba(139, 90, 43, 0.3)' }}
          >
            Aprovar Proposta
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section id="proposta" className="relative z-10 pt-24 pb-20 lg:pt-36 lg:pb-32 px-6">
        <div className="max-w-7xl mx-auto">

          {/* Logo centered at top of hero */}
          <div className="flex justify-center mb-14">
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-2xl scale-110" style={{ backgroundColor: 'rgba(212,175,55,0.12)' }} />
              <img
                src="/nefertari-logo.jpeg"
                onError={(e) => {
                  const t = e.target as HTMLImageElement;
                  t.onerror = null;
                  t.src = 'https://placehold.co/160x160/12100E/D4AF37?text=N';
                }}
                alt="Nefertari Logo"
                className="relative h-28 w-28 object-contain rounded-full mix-blend-screen"
                style={{ border: '1px solid rgba(212,175,55,0.25)' }}
              />
            </div>
          </div>

          {/* Headline centered */}
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 backdrop-blur-md"
              style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212, 175, 55, 0.2)' }}
            >
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#D4AF37' }} />
              <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#D4AF37' }}>
                Proposta Executiva Digital
              </span>
            </div>
            <h1 className="text-5xl lg:text-7xl mb-6 leading-tight" style={{ fontFamily: 'var(--font-playfair)', color: '#FDFBF7' }}>
              Ecossistema{' '}
              <span
                style={{
                  background: 'linear-gradient(90deg, #D4AF37 0%, #E6C27A 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Digital 360º
              </span>
            </h1>
            <p className="text-xl mb-10 max-w-2xl mx-auto leading-relaxed font-light" style={{ color: '#A39D93' }}>
              Transformando a essência da &ldquo;Nutrição com afeto e ancestralidade&rdquo; em uma presença digital que atrai, converte e fideliza clientes — todos os dias, no piloto automático.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#investimento"
                className="px-8 py-4 font-semibold rounded-full transition-colors flex items-center justify-center gap-2 group"
                style={{ backgroundColor: '#D4AF37', color: '#12100E' }}
              >
                Ver Planos <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#escopo"
                className="px-8 py-4 font-medium rounded-full transition-colors backdrop-blur-md flex items-center justify-center hover:bg-white/5"
                style={{ border: '1px solid rgba(255,255,255,0.1)', color: '#E8E5DF' }}
              >
                Explorar Escopo
              </a>
            </div>
          </div>

          {/* Product images side by side below headline */}
          <div className="grid md:grid-cols-2 gap-6 mt-4">
            {/* Image 1 */}
            <div className="relative rounded-3xl overflow-hidden group" style={{ border: '1px solid rgba(212,175,55,0.15)' }}>
              <img
                src="/nefertari1.png"
                onError={(e) => {
                  const t = e.target as HTMLImageElement;
                  t.onerror = null;
                  t.src = 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1000&auto=format&fit=crop';
                }}
                alt="Nefertari — Produto"
                className="w-full h-72 md:h-96 object-cover mix-blend-lighten transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12100E]/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6">
                <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: '#D4AF37' }}>Cozinha Viva</span>
                <p className="text-lg mt-1" style={{ fontFamily: 'var(--font-playfair)', color: '#FDFBF7' }}>Sabor com propósito</p>
              </div>
            </div>
            {/* Image 2 */}
            <div className="relative rounded-3xl overflow-hidden group" style={{ border: '1px solid rgba(212,175,55,0.15)' }}>
              <img
                src="/nefertari2.png"
                onError={(e) => {
                  const t = e.target as HTMLImageElement;
                  t.onerror = null;
                  t.src = 'https://images.unsplash.com/photo-1542691457-cbe4df041eb2?q=80&w=1000&auto=format&fit=crop';
                }}
                alt="Nefertari — Bebida Viva"
                className="w-full h-72 md:h-96 object-cover mix-blend-lighten transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12100E]/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6">
                <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: '#D4AF37' }}>Nutrição Ancestral</span>
                <p className="text-lg mt-1" style={{ fontFamily: 'var(--font-playfair)', color: '#FDFBF7' }}>Alimentar é um ato sagrado</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Scope */}
      <section
        id="escopo"
        className="relative z-10 py-32"
        style={{
          backgroundColor: 'rgba(255,255,255,0.02)',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl mb-6" style={{ fontFamily: 'var(--font-playfair)', color: '#FDFBF7' }}>
              O Que Está Incluído
            </h2>
            <p className="text-lg font-light leading-relaxed" style={{ color: '#A39D93' }}>
              Cada entrega foi pensada para resolver um problema real do negócio. Você não está comprando serviços avulsos — está contratando um ecossistema completo que trabalha junto, 24 horas por dia.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, idx) => (
              <div
                key={idx}
                className="p-8 rounded-2xl backdrop-blur-md transition-all duration-300 group hover:-translate-y-2 flex flex-col"
                style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
              >
                <div className="flex items-start justify-between mb-6">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shrink-0"
                    style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.2)' }}
                  >
                    {service.icon}
                  </div>
                  <span
                    className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md ml-3 mt-1 text-right leading-tight"
                    style={{ backgroundColor: 'rgba(92,113,72,0.12)', color: '#8BAA6D' }}
                  >
                    {service.tag}
                  </span>
                </div>
                <h3 className="text-lg mb-3 leading-snug" style={{ fontFamily: 'var(--font-playfair)', color: '#FDFBF7' }}>
                  {service.title}
                </h3>
                <p className="text-sm font-light leading-relaxed flex-1" style={{ color: '#A39D93' }}>
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section id="timeline" className="relative z-10 py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl mb-6" style={{ fontFamily: 'var(--font-playfair)', color: '#FDFBF7' }}>
              Plano de Ação
            </h2>
            <p className="text-lg font-light leading-relaxed max-w-2xl mx-auto" style={{ color: '#A39D93' }}>
              Um cronograma claro e sem surpresas. Cada fase tem entregas definidas para que você saiba exatamente o que esperar — e quando.
            </p>
          </div>
          <div className="space-y-0">
            {timeline.map((step, idx) => (
              <div key={idx} className="flex gap-8 group">
                <div className="flex flex-col items-center">
                  <div
                    className="w-5 h-5 rounded-full z-10 transition-transform group-hover:scale-125 shrink-0 mt-1"
                    style={{ backgroundColor: '#D4AF37', boxShadow: '0 0 20px rgba(212, 175, 55, 0.4)' }}
                  />
                  {idx !== timeline.length - 1 && (
                    <div className="w-[1px] flex-1 mt-3 mb-0" style={{ backgroundColor: 'rgba(212, 175, 55, 0.2)', minHeight: '60px' }} />
                  )}
                </div>
                <div
                  className="pb-12 flex-1 rounded-2xl px-8 py-6 mb-4 transition-all group-hover:border-[rgba(212,175,55,0.2)]"
                  style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
                >
                  <span className="text-xs font-bold tracking-widest uppercase mb-2 block" style={{ color: '#5C7148' }}>
                    {step.time}
                  </span>
                  <h4 className="text-2xl mt-1 mb-3" style={{ fontFamily: 'var(--font-playfair)', color: '#FDFBF7' }}>
                    {step.phase}: {step.title}
                  </h4>
                  <p className="font-light text-base leading-relaxed" style={{ color: '#A39D93' }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section
        id="investimento"
        className="relative z-10 py-32"
        style={{ backgroundColor: 'rgba(0,0,0,0.3)', borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl mb-6" style={{ fontFamily: 'var(--font-playfair)', color: '#FDFBF7' }}>
              Investimento
            </h2>
            <p className="text-lg font-light leading-relaxed" style={{ color: '#A39D93' }}>
              Dois caminhos, um destino: uma Nefertari reconhecida, desejada e lucrativa. Escolha o ritmo que faz sentido para o seu momento.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-center">
            {/* Start Plan */}
            <div
              className="rounded-[2rem] p-10 backdrop-blur-xl flex flex-col relative transition-transform hover:-translate-y-2"
              style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div className="mb-8">
                <span
                  className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
                  style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: '#A39D93' }}
                >
                  Plano Start
                </span>
                <h3 className="text-3xl mb-4" style={{ fontFamily: 'var(--font-playfair)', color: '#FDFBF7' }}>
                  Fundação & Tração
                </h3>
                <p className="text-sm font-light" style={{ color: '#A39D93' }}>
                  Para quem está começando e quer construir uma base sólida com suporte profissional de marketing desde o primeiro dia.
                </p>
              </div>
              <div className="mb-10 p-6 rounded-2xl" style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
                <div className="flex items-end gap-2 mb-3">
                  <span className="text-xl font-medium" style={{ color: '#8B5A2B' }}>R$</span>
                  <span className="text-4xl font-bold tracking-tight" style={{ color: '#FDFBF7' }}>1.500</span>
                  <span className="text-sm pb-1" style={{ color: '#A39D93' }}>/setup único</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold" style={{ color: '#D4AF37' }}>+</span>
                  <div className="flex items-end gap-1">
                    <span className="text-lg font-medium" style={{ color: '#8B5A2B' }}>R$</span>
                    <span className="text-2xl font-bold" style={{ color: '#FDFBF7' }}>500</span>
                    <span className="text-sm pb-0.5" style={{ color: '#A39D93' }}>/mês (gestão)</span>
                  </div>
                </div>
              </div>
              <ul className="space-y-5 mb-10 flex-1">
                {[
                  { item: 'Branding & Identidade Visual Completa', sub: 'Logo, paleta, tipografia e manual de marca' },
                  { item: 'Configuração Profissional das Redes Sociais', sub: 'Bio, destaques, links e primeiros posts' },
                  { item: 'Design de Cardápio Digital', sub: 'Apresentação visual dos produtos para venda online' },
                  { item: 'Gestão de Tráfego Pago (Meta Ads)', sub: 'Anúncios no Instagram e Facebook para atrair clientes' },
                  { item: 'Relatório Mensal de Resultados', sub: 'Números claros sobre o que está funcionando' },
                ].map(({ item, sub }, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#5C7148' }} />
                    <div>
                      <span className="text-sm font-medium block" style={{ color: '#E8E5DF' }}>{item}</span>
                      <span className="text-xs font-light" style={{ color: '#6B6560' }}>{sub}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <button
                className="w-full py-4 rounded-xl font-semibold transition-all hover:bg-white/5 cursor-pointer"
                style={{ border: '1px solid rgba(255,255,255,0.1)', color: '#FDFBF7' }}
                onClick={() => setActiveTab('start')}
              >
                Selecionar Plano Start
              </button>
            </div>

            {/* Full Plan */}
            <div
              className="rounded-[2rem] p-10 flex flex-col relative overflow-hidden shadow-2xl md:scale-105"
              style={{
                background: 'linear-gradient(145deg, #1A1612 0%, #12100E 100%)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                boxShadow: '0 20px 40px rgba(212, 175, 55, 0.05)',
              }}
            >
              <div
                className="absolute top-0 right-0 px-6 py-2 text-xs font-bold uppercase tracking-widest rounded-bl-2xl"
                style={{ backgroundColor: '#D4AF37', color: '#12100E' }}
              >
                Recomendado
              </div>
              <div className="mb-8 mt-2">
                <span
                  className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
                  style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)', color: '#D4AF37', border: '1px solid rgba(212, 175, 55, 0.2)' }}
                >
                  Plano Sagrado 360º
                </span>
                <h3 className="text-4xl mb-4" style={{ fontFamily: 'var(--font-playfair)', color: '#FDFBF7' }}>
                  Escala Anual
                </h3>
                <p className="text-sm font-light" style={{ color: '#A39D93' }}>
                  O ecossistema completo por um ano inteiro. Uma única decisão que cobre tudo — da marca ao delivery, do primeiro clique à recompra.
                </p>
              </div>
              <div
                className="mb-10 p-6 rounded-2xl"
                style={{ backgroundColor: 'rgba(212, 175, 55, 0.03)', border: '1px solid rgba(212, 175, 55, 0.1)' }}
              >
                <div className="flex items-end gap-2 mb-3">
                  <span className="text-2xl font-medium" style={{ color: '#D4AF37' }}>R$</span>
                  <span className="text-6xl font-bold tracking-tight" style={{ color: '#FDFBF7' }}>5.500</span>
                  <span className="text-sm pb-2" style={{ color: '#A39D93' }}>/ano</span>
                </div>
                <div
                  className="text-sm font-medium px-3 py-1.5 rounded-md inline-block mt-2"
                  style={{ backgroundColor: 'rgba(92, 113, 72, 0.1)', color: '#8BAA6D' }}
                >
                  Equivale a R$ 458/mês — setup e gestão inclusos
                </div>
              </div>
              <ul className="space-y-5 mb-10 flex-1">
                {[
                  { item: 'Tudo do Plano Start', sub: 'Branding, redes, cardápio, tráfego e relatórios', highlight: true },
                  { item: 'Site Institucional com SEO Avançado', sub: 'Apareça no Google quando seu cliente procurar por você' },
                  { item: 'Sistema CRM + Gestão de Pedidos (OS)', sub: 'Controle total do relacionamento e do fluxo de cozinha' },
                  { item: 'Tráfego Pago Completo (Meta + Google Ads)', sub: 'Anúncios nos dois maiores canais de aquisição do mundo' },
                  { item: 'Automação de Retenção de Clientes', sub: 'Mensagens automáticas que trazem o cliente de volta' },
                  { item: 'Dashboard de Métricas em Tempo Real', sub: 'CAC, ROI e LTV sempre visíveis, sem precisar pedir relatório' },
                  { item: 'Reuniões Quinzenais de Estratégia', sub: 'Alinhamento constante para ajustar e acelerar os resultados' },
                ].map(({ item, sub, highlight }, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#D4AF37' }} />
                    <div>
                      <span className={`text-sm font-medium block ${highlight ? 'text-[#D4AF37]' : ''}`} style={highlight ? {} : { color: '#FDFBF7' }}>{item}</span>
                      <span className="text-xs font-light" style={{ color: '#6B6560' }}>{sub}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <button
                className="w-full py-5 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-transform hover:scale-[1.02] cursor-pointer"
                style={{ backgroundColor: '#D4AF37', color: '#12100E', boxShadow: '0 10px 25px rgba(212, 175, 55, 0.2)' }}
                onClick={() => setActiveTab('sagrado')}
              >
                Quero o Plano Completo <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="relative z-10 py-20 text-center"
        style={{ backgroundColor: '#0A0908', borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="max-w-3xl mx-auto px-6">
          <div
            className="w-16 h-16 mx-auto mb-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'rgba(212, 175, 55, 0.05)', border: '1px solid rgba(212, 175, 55, 0.2)' }}
          >
            <Leaf className="w-8 h-8" style={{ color: '#5C7148' }} />
          </div>
          <h2 className="text-3xl md:text-4xl mb-6" style={{ fontFamily: 'var(--font-playfair)', color: '#FDFBF7' }}>
            Pronto para dar vida à Nefertari?
          </h2>
          <p className="text-lg font-light mb-10" style={{ color: '#A39D93' }}>
            Vamos transformar sua arte culinária em uma marca digital forte e lucrativa.
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-medium transition-all hover:bg-white/5"
            style={{ border: '1px solid rgba(212, 175, 55, 0.4)', color: '#D4AF37' }}
          >
            Falar com o Especialista no WhatsApp <ArrowRight className="w-5 h-5" />
          </a>
          <div
            className="mt-20 pt-8 text-xs tracking-widest uppercase"
            style={{ color: '#4A453E', borderTop: '1px solid rgba(255,255,255,0.02)' }}
          >
            &copy; {new Date().getFullYear()} Proposta confidencial para Nefertari Cozinha Viva.
          </div>
        </div>
      </footer>
    </div>
  );
}
