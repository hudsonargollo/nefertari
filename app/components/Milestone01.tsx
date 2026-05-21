'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// ─── Meeting insights data ────────────────────────────────────────────────────
const insights = [
  {
    num: '01',
    title: 'A Alma da Nefertari',
    icon: '◈',
    items: [
      { label: 'Essência', value: 'Fartura. Contato íntimo com o cozinhar e com a totalidade do alimento. Uma marca que eleva o lanche a uma experiência gastronômica — criativa, que pensa em texturas e sabores fora do comum.' },
      { label: 'Valores', value: 'Nutrição com afeto · Ancestralidade · Consciência' },
      { label: 'Conceito central', value: '"Alimentar o corpo como um ato sagrado."' },
    ],
  },
  {
    num: '02',
    title: 'Público & Mercado',
    icon: '◉',
    items: [
      { label: 'Quem é o cliente', value: 'Pessoas que gostam de comer bem, buscam alimentos menos pesados e ultraprocessados, sem abrir mão do sabor. Inclui academia, restrições alimentares e grupos específicos — mas a marca vai além do público vegano.' },
      { label: 'A dor real', value: 'Falta de opções noturnas em Jequié com lanches naturais e artesanais de verdade. A maioria do mercado apenas monta sanduíche com "carne do futuro" industrializada.' },
      { label: 'Concorrência', value: 'Não há concorrente direto noturno fazendo trabalho artesanal (grão de bico, soja, etc.). Hamburguerias tradicionais como o Smash acabam sendo parceiras — indicam a Nefertari para quem busca opção sem carne.' },
    ],
  },
  {
    num: '03',
    title: 'Direção Estética',
    icon: '◇',
    items: [
      { label: 'O que ama', value: 'Visual que conecte com a terra e a ancestralidade. Referências ao Egito/Kemet (Pirâmide, Olho, Escaravelho). Cores vivas que reflitam a coloração real dos alimentos. Orgânico, rústico, conectado à terra — com um toque limpo.' },
      { label: 'O que detesta', value: 'Visual monocromático, identidades com cara de IA (frias/artificiais) ou genéricas de "comida fitness".' },
    ],
  },
  {
    num: '04',
    title: 'Cardápio & Presença Digital',
    icon: '△',
    items: [
      { label: 'Cardápio inicial', value: '4 opções de hambúrgueres · 2 opções de wraps · Porção de batata frita · Bebidas (refrigerante, sucos, água).' },
      { label: 'Mídia', value: 'Mídias autorais focadas no artesanal e na natureza — ensaio na Pedra Santa, piquenique na Cachoeira, ida à feira livre.' },
      { label: 'Estratégia de venda', value: 'iFood como vitrine (taxa 26%). Toda a comunicação, embalagens e storytelling direcionam para o link próprio — convertendo no sistema sem taxas.' },
    ],
  },
  {
    num: '05',
    title: 'Sistema de Pedidos',
    icon: '❧',
    items: [
      { label: 'Atendimento', value: 'Fluxo via WhatsApp automatizado mas humanizado. Nada de robô engessado — atalhos e mensagens prontas que mantêm o tom de voz da marca e entregam o cardápio de forma ágil.' },
    ],
  },
];

// ─── Next deliverables ────────────────────────────────────────────────────────
const proximas = [
  {
    num: '02',
    title: 'Site Institucional',
    desc: 'Página principal da Nefertari com SEO, storytelling da marca, cardápio preview e chamada para pedido. A vitrine digital da marca.',
    tags: ['Next.js', 'SEO', 'Copywriting'],
    color: '#C8941A',
  },
  {
    num: '03',
    title: 'Cardápio Digital',
    desc: 'Cardápio online otimizado para mobile, com fotos autorais dos pratos, descrições no tom de voz da marca e botão direto para pedido via WhatsApp.',
    tags: ['Mobile-first', 'WhatsApp', 'Fotos autorais'],
    color: '#6B8C3E',
  },
  {
    num: '04',
    title: 'Sistema de Gerenciamento',
    desc: 'Painel interno para gestão de pedidos, controle do cardápio e métricas — tudo sem taxas de marketplace, direto no seu domínio.',
    tags: ['Pedidos', 'Métricas', 'Sem taxas'],
    color: '#8B4030',
  },
];

// ─── Main component ───────────────────────────────────────────────────────────
export default function Milestone01() {
  const [openInsight, setOpenInsight] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#FAF5E8', color: '#14100C', minHeight: '100vh' }}>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section
        style={{ background: 'linear-gradient(160deg, #14100C 0%, #2A1E14 60%, #14100C 100%)' }}
        className="px-6 py-24 text-center"
      >
        <div className="max-w-3xl mx-auto">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-[#C8941A]/30 text-[#C8941A] text-xs font-bold tracking-widest uppercase mb-8">
            Milestone 01 · Maio 2026
          </span>

          <h1
            style={{ fontFamily: 'Playfair Display, Georgia, serif', color: '#FAF5E8', lineHeight: 1.15 }}
            className="text-4xl md:text-6xl font-bold mb-4"
          >
            Branding &
          </h1>
          <h1
            style={{ fontFamily: 'Playfair Display, Georgia, serif', color: '#C8941A', lineHeight: 1.15 }}
            className="text-4xl md:text-6xl font-bold mb-8"
          >
            Identidade Visual
          </h1>

          <div className="flex items-center justify-center gap-3 mb-8">
            <span className="h-px w-12 bg-[#C8941A]/30" />
            <span className="text-[#A89880] text-xs tracking-widest uppercase font-medium">Nefertari Cozinha Viva</span>
            <span className="h-px w-12 bg-[#C8941A]/30" />
          </div>

          <p className="text-[#A89880] max-w-xl mx-auto text-base leading-relaxed">
            Que reunião fantástica. O áudio trouxe uma clareza imensa sobre o momento da Nefertari — a transição da Safrão da Terra, a abertura além do 100% vegano, a profundidade que você quer dar ao projeto. A base está extremamente sólida.
          </p>
        </div>
      </section>

      {/* ── O que entregamos ──────────────────────────────────────────────── */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[#C8941A] tracking-[0.3em] text-xs uppercase font-medium mb-3">Fase 1 — Concluída</p>
          <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif' }} className="text-3xl md:text-4xl font-bold text-[#14100C]">
            O que entregamos
          </h2>
          <p className="text-[#6B6050] mt-4 max-w-lg mx-auto text-sm leading-relaxed">
            Construímos dois guias de identidade completos — cada um explora uma direção visual diferente para você escolher com qual se identifica mais.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Guia v1 */}
          <Link href="/identidade" className="group block rounded-2xl overflow-hidden border border-[#E8D9BA] hover:border-[#C8941A]/50 hover:shadow-xl transition-all duration-300">
            <div
              className="h-40 flex flex-col items-center justify-center gap-2 px-8"
              style={{ background: 'linear-gradient(135deg, #12100E 0%, #2A1E10 100%)' }}
            >
              <span className="text-3xl text-[#C8941A]">◈</span>
              <p style={{ fontFamily: 'Playfair Display, Georgia, serif', color: '#FAF5E8' }} className="text-lg font-semibold">
                Identidade Clássica
              </p>
              <p className="text-[#A89880] text-xs tracking-wide">Fundo escuro · Ouro · Premium</p>
            </div>
            <div className="p-6 bg-white">
              <p className="text-[#14100C] font-semibold text-sm mb-2">Guia de Identidade — Versão 1</p>
              <p className="text-[#6B6050] text-xs leading-relaxed mb-4">
                Direção sofisticada com fundo escuro, tipografia dourada e tom editorial. Transmite autoridade e mistério ancestral.
              </p>
              <span className="inline-flex items-center gap-1.5 text-[#C8941A] text-xs font-medium group-hover:gap-2.5 transition-all">
                Ver guia completo →
              </span>
            </div>
          </Link>

          {/* Guia v2 */}
          <Link href="/identidade-v2" className="group block rounded-2xl overflow-hidden border-2 border-[#C8941A]/40 hover:border-[#C8941A]/70 hover:shadow-xl transition-all duration-300">
            <div
              className="h-40 flex flex-col items-center justify-center gap-2 px-8"
              style={{ background: 'linear-gradient(135deg, #FAF5E8 0%, #F5E6C8 100%)' }}
            >
              <span className="text-3xl text-[#C8941A]">❧</span>
              <p style={{ fontFamily: 'Playfair Display, Georgia, serif', color: '#14100C' }} className="text-lg font-semibold">
                Identidade Viva
              </p>
              <p className="text-[#8B4030] text-xs tracking-wide">Fundo claro · Terracota · Orgânico</p>
            </div>
            <div className="p-6 bg-white">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[#14100C] font-semibold text-sm">Guia de Identidade — Versão 2</p>
                <span className="px-2 py-0.5 rounded-full bg-[#C8941A]/10 text-[#C8941A] text-[10px] font-bold uppercase tracking-wide">Novo</span>
              </div>
              <p className="text-[#6B6050] text-xs leading-relaxed mb-4">
                Direção quente e orgânica com fundo parchment, paleta terracota e voz intencional. Transmite frescor, terra e cuidado.
              </p>
              <span className="inline-flex items-center gap-1.5 text-[#C8941A] text-xs font-medium group-hover:gap-2.5 transition-all">
                Ver guia completo →
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* ─ Divider ─ */}
      <div className="px-6 max-w-5xl mx-auto">
        <div className="h-px bg-gradient-to-r from-transparent via-[#C8941A]/30 to-transparent" />
      </div>

      {/* ── Insights da Reunião ───────────────────────────────────────────── */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[#C8941A] tracking-[0.3em] text-xs uppercase font-medium mb-3">Reunião · Maio 2026</p>
          <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif' }} className="text-3xl md:text-4xl font-bold text-[#14100C]">
            O que mapeamos juntos
          </h2>
          <p className="text-[#6B6050] mt-4 max-w-lg mx-auto text-sm leading-relaxed">
            Cruzamos a transcrição da conversa com o questionário de onboarding e preenchemos tudo o que já foi definido.
          </p>
        </div>

        <div className="space-y-3">
          {insights.map((insight, i) => (
            <div key={insight.num} className="rounded-2xl border border-[#E8D9BA] bg-white overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-[#FAF5E8] transition-colors"
                onClick={() => setOpenInsight(prev => prev === i ? null : i)}
              >
                <div className="flex items-center gap-4">
                  <span className="text-[#C8941A]/40 font-mono text-xs font-bold w-6">{insight.num}</span>
                  <span className="text-xl text-[#C8941A]">{insight.icon}</span>
                  <span style={{ fontFamily: 'Playfair Display, Georgia, serif' }} className="text-lg font-semibold text-[#14100C]">
                    {insight.title}
                  </span>
                </div>
                <span className="text-[#C8941A] text-xl font-light shrink-0 ml-4">{openInsight === i ? '−' : '+'}</span>
              </button>

              {openInsight === i && (
                <div className="border-t border-[#E8D9BA] px-6 py-6 space-y-4">
                  {insight.items.map((item) => (
                    <div key={item.label}>
                      <p className="text-[#C8941A] text-xs font-semibold uppercase tracking-widest mb-1">{item.label}</p>
                      <p className="text-[#3D2E1E] text-sm leading-relaxed">{item.value}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Pendência — Referências ───────────────────────────────────────── */}
      <section className="px-6 py-6 max-w-5xl mx-auto">
        <div className="rounded-2xl border-2 border-dashed border-[#C8941A]/40 bg-[#C8941A]/5 p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="text-4xl">📋</div>
          <div className="flex-1">
            <p className="text-[#C8941A] text-xs font-bold tracking-widest uppercase mb-1">Ação pendente — Jéssica</p>
            <h3 style={{ fontFamily: 'Playfair Display, Georgia, serif' }} className="text-xl font-semibold text-[#14100C] mb-2">
              Enviar as referências visuais
            </h3>
            <p className="text-[#6B6050] text-sm leading-relaxed">
              Para fechar a pesquisa visual e avançar para o site, precisamos das suas referências — links de marcas que você admira esteticamente (como a Bela Gil), concorrentes que te inspiram e o rascunho com os nomes dos lanches do cardápio.
            </p>
          </div>
          <div className="shrink-0">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-[#C8941A]/15 text-[#8B4030] text-xs font-bold uppercase tracking-wide">
              Aguardando
            </span>
          </div>
        </div>
      </section>

      {/* ─ Divider ─ */}
      <div className="px-6 max-w-5xl mx-auto mt-14">
        <div className="h-px bg-gradient-to-r from-transparent via-[#C8941A]/30 to-transparent" />
      </div>

      {/* ── Próximas Entregas ─────────────────────────────────────────────── */}
      <section className="px-6 py-20" style={{ background: '#F5E6C8' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#C8941A] tracking-[0.3em] text-xs uppercase font-medium mb-3">O que vem a seguir</p>
            <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif' }} className="text-3xl md:text-4xl font-bold text-[#14100C]">
              Próximas entregas
            </h2>
            <p className="text-[#6B6050] mt-4 max-w-lg mx-auto text-sm leading-relaxed">
              Com a identidade aprovada, partimos para construir a presença digital completa da Nefertari.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {proximas.map((item) => (
              <div key={item.num} className="rounded-2xl border border-[#E8D9BA] bg-white p-7 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-5">
                  <span
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.num}
                  </span>
                  <span className="text-[#E8D9BA] text-xs font-mono uppercase tracking-widest">Em breve</span>
                </div>
                <h3 style={{ fontFamily: 'Playfair Display, Georgia, serif' }} className="text-xl font-semibold text-[#14100C] mb-3">
                  {item.title}
                </h3>
                <p className="text-[#6B6050] text-sm leading-relaxed mb-5">{item.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs font-medium border"
                      style={{ borderColor: `${item.color}30`, color: item.color, backgroundColor: `${item.color}08` }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer
        style={{ background: '#14100C', borderTop: '1px solid rgba(200,148,26,0.10)' }}
        className="px-6 py-10 text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="h-px w-12 bg-[#C8941A]/20" />
          <span className="text-[#C8941A]/50 text-xs tracking-widest uppercase">Nefertari Cozinha Viva</span>
          <span className="h-px w-12 bg-[#C8941A]/20" />
        </div>
        <p className="text-[#4A3E32] text-xs">Produzido por <span className="text-[#C8941A]/50">clubemkt.digital</span></p>
      </footer>
    </div>
  );
}
