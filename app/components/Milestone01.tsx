'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { toast, Toaster } from 'sonner';

// ─── Data ─────────────────────────────────────────────────────────────────────

const insights = [
  {
    num: '01', title: 'A Alma da Nefertari', icon: '◈',
    items: [
      { label: 'Essência', value: 'Fartura. Contato íntimo com o cozinhar e com a totalidade do alimento. Uma marca que eleva o lanche a uma experiência gastronômica — criativa, que pensa em texturas e sabores fora do comum.' },
      { label: 'Valores', value: 'Nutrição com afeto · Ancestralidade · Consciência' },
      { label: 'Conceito central', value: '"Alimentar o corpo como um ato sagrado."' },
    ],
  },
  {
    num: '02', title: 'Público & Mercado', icon: '◉',
    items: [
      { label: 'Quem é o cliente', value: 'Pessoas que gostam de comer bem, buscam alimentos menos pesados e ultraprocessados, sem abrir mão do sabor. Inclui academia, restrições alimentares e grupos específicos — mas a marca vai além do público vegano.' },
      { label: 'A dor real', value: 'Falta de opções noturnas em Jequié com lanches naturais e artesanais de verdade. A maioria do mercado apenas monta sanduíche com "carne do futuro" industrializada.' },
      { label: 'Concorrência', value: 'Não há concorrente direto noturno fazendo trabalho artesanal. Hamburguerias tradicionais como o Smash acabam sendo parceiras — indicam a Nefertari para quem busca opção sem carne.' },
    ],
  },
  {
    num: '03', title: 'Direção Estética', icon: '◇',
    items: [
      { label: 'O que ama', value: 'Visual que conecte com a terra e a ancestralidade. Referências ao Egito/Kemet (Pirâmide, Olho, Escaravelho). Cores vivas que reflitam a coloração real dos alimentos. Orgânico, rústico, conectado à terra — com toque limpo.' },
      { label: 'O que detesta', value: 'Visual monocromático, identidades com cara de IA (frias/artificiais) ou genéricas de "comida fitness".' },
    ],
  },
  {
    num: '04', title: 'Cardápio & Presença Digital', icon: '△',
    items: [
      { label: 'Cardápio inicial', value: '4 hambúrgueres · 2 wraps · Porção de batata frita · Bebidas (refrigerante, sucos, água).' },
      { label: 'Mídia', value: 'Mídias autorais focadas no artesanal e na natureza — ensaio na Pedra Santa, piquenique na Cachoeira, ida à feira livre.' },
      { label: 'Estratégia de venda', value: 'iFood como vitrine (taxa 26%). Toda a comunicação e storytelling direcionam para o link próprio — convertendo no sistema sem taxas.' },
    ],
  },
  {
    num: '05', title: 'Sistema de Pedidos', icon: '❧',
    items: [
      { label: 'Atendimento', value: 'Fluxo via WhatsApp automatizado mas humanizado. Atalhos e mensagens prontas que mantêm o tom de voz da marca e entregam o cardápio de forma ágil.' },
    ],
  },
];

const mcQuestions = [
  {
    id: 'mc_identity',
    question: 'A identidade visual apresentada representa a Nefertari?',
    options: [
      { value: 'yes_fully',  label: 'Sim, totalmente — é exatamente o que eu imaginei' },
      { value: 'yes_mostly', label: 'Sim, mas mudaria alguns elementos' },
      { value: 'not_yet',    label: 'Ainda não representa completamente' },
    ],
  },
  {
    id: 'mc_palette',
    question: 'Como você se sente em relação à paleta de cores?',
    options: [
      { value: 'perfect',  label: 'Perfeita — ouro, terracota e verde são a cara da marca' },
      { value: 'almost',   label: 'Quase lá — alguma cor precisa de ajuste' },
      { value: 'rethink',  label: 'Gostaria de repensar as cores' },
    ],
  },
  {
    id: 'mc_voice',
    question: 'O tom de voz da marca (sofisticado, com propósito, real e regal) está:',
    options: [
      { value: 'perfect',   label: 'Certeiro — é exatamente como quero falar com meus clientes' },
      { value: 'almost',    label: 'Quase lá — falta algum elemento' },
      { value: 'revision',  label: 'Precisa de revisão' },
    ],
  },
];

const proximas = [
  {
    num: '02', title: 'Site Institucional', color: '#C8941A',
    desc: 'Página principal com SEO, storytelling da marca, cardápio preview e chamada para pedido.',
    tags: ['Next.js', 'SEO', 'Copywriting'],
  },
  {
    num: '03', title: 'Cardápio Digital', color: '#6B8C3E',
    desc: 'Cardápio mobile-first com fotos autorais, descrições no tom da marca e botão direto para WhatsApp.',
    tags: ['Mobile-first', 'WhatsApp', 'Fotos autorais'],
  },
  {
    num: '04', title: 'Sistema de Gerenciamento', color: '#8B4030',
    desc: 'Painel interno para gestão de pedidos, cardápio e métricas — sem taxas de marketplace.',
    tags: ['Pedidos', 'Métricas', 'Sem taxas'],
  },
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface FeedbackFields {
  mc_identity: string;
  mc_palette:  string;
  mc_voice:    string;
  q_tocou:     string;
  q_mudaria:   string;
}

interface SavedFile { name: string; type: string; size: number; }

const DEFAULTS: FeedbackFields = {
  mc_identity: '', mc_palette: '', mc_voice: '', q_tocou: '', q_mudaria: '',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function readAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function fmtSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

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

function MCOption({
  selected, label, onClick,
}: { selected: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-5 py-4 rounded-xl border text-sm transition-all duration-150 ${
        selected
          ? 'border-[#C8941A] bg-[#C8941A]/8 text-[#14100C] font-medium'
          : 'border-[#E8D9BA] bg-white text-[#6B6050] hover:border-[#C8941A]/40 hover:bg-[#FAF5E8]'
      }`}
    >
      <span className={`inline-block w-4 h-4 rounded-full border mr-3 align-middle transition-all ${
        selected ? 'border-[#C8941A] bg-[#C8941A]' : 'border-[#C8941A]/30'
      }`} />
      {label}
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Milestone01() {
  const [openInsight,  setOpenInsight]  = useState<number | null>(null);
  const [feedback,     setFeedback]     = useState<FeedbackFields>(DEFAULTS);
  const [links,        setLinks]        = useState<string[]>(['', '', '']);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [savedFiles,   setSavedFiles]   = useState<SavedFile[]>([]);
  const [isLoading,    setIsLoading]    = useState(true);
  const [isSaving,     setIsSaving]     = useState(false);
  const [lastSaved,    setLastSaved]    = useState<Date | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver,     setDragOver]     = useState(false);

  // ── Load saved data on mount
  useEffect(() => {
    fetch('/api/milestone01')
      .then(r => r.json())
      .then((data: (FeedbackFields & { links?: string[]; files?: SavedFile[]; updated_at?: string }) | null) => {
        if (data) {
          const { links: savedLinks, files, updated_at, ...fields } = data;
          setFeedback({ ...DEFAULTS, ...fields });
          if (savedLinks?.length) setLinks([...savedLinks, '']);
          if (files?.length)      setSavedFiles(files);
          if (updated_at)         setLastSaved(new Date(updated_at));
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  // ── File handling
  function addFiles(incoming: FileList | File[]) {
    const arr = Array.from(incoming).filter(f => f.size <= 8 * 1024 * 1024); // 8 MB limit
    if (arr.length < Array.from(incoming).length) {
      toast.warning('Alguns arquivos foram ignorados (máx. 8 MB por arquivo).');
    }
    setPendingFiles(prev => [...prev, ...arr].slice(0, 10)); // max 10 files
  }

  function removeFile(idx: number) {
    setPendingFiles(prev => prev.filter((_, i) => i !== idx));
  }

  // ── URL helpers
  function setLink(idx: number, val: string) {
    setLinks(prev => {
      const next = [...prev];
      next[idx] = val;
      return next;
    });
  }

  function addLinkField() {
    setLinks(prev => [...prev, '']);
  }

  function removeLinkField(idx: number) {
    setLinks(prev => prev.filter((_, i) => i !== idx));
  }

  // ── Submit
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    try {
      const filesData = await Promise.all(
        pendingFiles.map(async f => ({
          name: f.name, type: f.type, size: f.size,
          data: await readAsDataURL(f),
        }))
      );

      const payload = {
        ...feedback,
        links: links.filter(l => l.trim()),
        files: filesData,
      };

      const res = await fetch('/api/milestone01', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();
      setLastSaved(new Date());
      setSavedFiles(filesData.map(({ name, type, size }) => ({ name, type, size })));
      setPendingFiles([]);
      toast.success('Respostas salvas com sucesso!');
    } catch {
      toast.error('Erro ao salvar. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  }

  const allMCAnswered = mcQuestions.every(q => feedback[q.id as keyof FeedbackFields]);

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#FAF5E8', color: '#14100C', minHeight: '100vh' }}>
      <Toaster position="top-center" richColors />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section
        style={{ background: 'linear-gradient(160deg, #14100C 0%, #2A1E14 60%, #14100C 100%)' }}
        className="px-6 py-24 text-center"
      >
        <div className="max-w-3xl mx-auto">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-[#C8941A]/30 text-[#C8941A] text-xs font-bold tracking-widest uppercase mb-8">
            Milestone 01 · Maio 2026
          </span>
          <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', color: '#FAF5E8', lineHeight: 1.15 }} className="text-4xl md:text-6xl font-bold mb-4">
            Branding &
          </h1>
          <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', color: '#C8941A', lineHeight: 1.15 }} className="text-4xl md:text-6xl font-bold mb-8">
            Identidade Visual
          </h1>
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className="h-px w-12 bg-[#C8941A]/30" />
            <span className="text-[#A89880] text-xs tracking-widest uppercase font-medium">Nefertari Cozinha Viva</span>
            <span className="h-px w-12 bg-[#C8941A]/30" />
          </div>
          <p className="text-[#A89880] max-w-xl mx-auto text-base leading-relaxed">
            A transição da Safrão da Terra para a Nefertari marca uma virada estratégica inteligente — abrir o leque além do 100% vegano, sem perder a essência. A base conceitual está definida e o projeto tem profundidade para crescer com consistência.
          </p>
        </div>
      </section>

      {/* ── O que entregamos ──────────────────────────────────────────────── */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <SectionLabel num="Fase 1" label="Concluída" />
          <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif' }} className="text-3xl md:text-4xl font-bold text-[#14100C]">
            O que entregamos
          </h2>
          <p className="text-[#6B6050] mt-4 max-w-lg mx-auto text-sm leading-relaxed">
            O guia de identidade completo da Nefertari — paleta, tipografia, voz da marca, exemplos práticos e manifesto.
          </p>
        </div>

        <Link
          href="/identidade-v2"
          className="group flex flex-col md:flex-row rounded-2xl overflow-hidden border-2 border-[#C8941A]/40 hover:border-[#C8941A]/70 hover:shadow-xl transition-all duration-300 max-w-2xl mx-auto"
        >
          <div
            className="md:w-56 shrink-0 flex flex-col items-center justify-center gap-2 px-8 py-10 md:py-0"
            style={{ background: 'linear-gradient(135deg, #FAF5E8 0%, #F5E6C8 100%)' }}
          >
            <span className="text-4xl text-[#C8941A]">❧</span>
            <p style={{ fontFamily: 'Playfair Display, Georgia, serif', color: '#14100C' }} className="text-lg font-semibold text-center">
              Identidade Viva
            </p>
            <p className="text-[#8B4030] text-xs tracking-wide text-center">Fundo claro · Terracota · Orgânico</p>
          </div>
          <div className="flex-1 p-7 bg-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[#14100C] font-semibold">Guia de Identidade Visual</p>
              <span className="px-2 py-0.5 rounded-full bg-[#C8941A]/10 text-[#C8941A] text-[10px] font-bold uppercase tracking-wide">Versão 1</span>
            </div>
            <p className="text-[#6B6050] text-sm leading-relaxed mb-5">
              Paleta quente e orgânica, voz intencional, exemplos práticos de comunicação, regras de uso do logo e manifesto da marca.
            </p>
            <span className="inline-flex items-center gap-1.5 text-[#C8941A] text-sm font-medium group-hover:gap-3 transition-all">
              Ver guia completo →
            </span>
          </div>
        </Link>
      </section>

      <Divider />

      {/* ── O que mapeamos ────────────────────────────────────────────────── */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <SectionLabel num="Reunião" label="Maio 2026" />
          <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif' }} className="text-3xl md:text-4xl font-bold text-[#14100C]">
            O que mapeamos juntos
          </h2>
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
                  {insight.items.map(item => (
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

      <Divider />

      {/* ── Feedback da Jéssica ───────────────────────────────────────────── */}
      <section className="px-6 py-20" style={{ background: '#F5E6C8' }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel num="Sua vez" label="Feedback" />
            <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif' }} className="text-3xl md:text-4xl font-bold text-[#14100C]">
              O que você achou?
            </h2>
            <p className="text-[#6B6050] mt-4 max-w-md mx-auto text-sm leading-relaxed">
              Responda as perguntas abaixo e envie suas referências visuais — isso nos ajuda a refinar tudo antes de avançar para o site.
            </p>
            {lastSaved && !isLoading && (
              <p className="text-[#8B7A60] text-xs mt-3">
                Última resposta salva em {lastSaved.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-2 border-[#C8941A]/30 border-t-[#C8941A] rounded-full animate-spin" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">

              {/* ── Multiple choice ─── */}
              {mcQuestions.map((q) => (
                <div key={q.id} className="rounded-2xl border border-[#E8D9BA] bg-white p-7">
                  <p style={{ fontFamily: 'Playfair Display, Georgia, serif' }} className="text-lg font-semibold text-[#14100C] mb-5">
                    {q.question}
                  </p>
                  <div className="space-y-3">
                    {q.options.map(opt => (
                      <MCOption
                        key={opt.value}
                        label={opt.label}
                        selected={feedback[q.id as keyof FeedbackFields] === opt.value}
                        onClick={() => setFeedback(prev => ({ ...prev, [q.id]: opt.value }))}
                      />
                    ))}
                  </div>
                </div>
              ))}

              {/* ── Open questions ─── */}
              <div className="rounded-2xl border border-[#E8D9BA] bg-white p-7">
                <p style={{ fontFamily: 'Playfair Display, Georgia, serif' }} className="text-lg font-semibold text-[#14100C] mb-2">
                  O que mais te tocou na identidade apresentada?
                </p>
                <p className="text-[#9C8E7C] text-xs mb-4">Pode ser uma cor, uma frase, uma sensação — qualquer detalhe conta.</p>
                <textarea
                  rows={4}
                  value={feedback.q_tocou}
                  onChange={e => setFeedback(prev => ({ ...prev, q_tocou: e.target.value }))}
                  placeholder="Escreva à vontade..."
                  className="w-full rounded-xl border border-[#E8D9BA] bg-[#FAF5E8] px-4 py-3 text-sm text-[#14100C] placeholder:text-[#C4B8A0] focus:outline-none focus:border-[#C8941A] resize-none transition-colors"
                />
              </div>

              <div className="rounded-2xl border border-[#E8D9BA] bg-white p-7">
                <p style={{ fontFamily: 'Playfair Display, Georgia, serif' }} className="text-lg font-semibold text-[#14100C] mb-2">
                  O que você mudaria ou sentiria falta?
                </p>
                <p className="text-[#9C8E7C] text-xs mb-4">Não há resposta errada — honestidade aqui nos poupa tempo depois.</p>
                <textarea
                  rows={4}
                  value={feedback.q_mudaria}
                  onChange={e => setFeedback(prev => ({ ...prev, q_mudaria: e.target.value }))}
                  placeholder="Escreva à vontade..."
                  className="w-full rounded-xl border border-[#E8D9BA] bg-[#FAF5E8] px-4 py-3 text-sm text-[#14100C] placeholder:text-[#C4B8A0] focus:outline-none focus:border-[#C8941A] resize-none transition-colors"
                />
              </div>

              {/* ── Reference links ─── */}
              <div className="rounded-2xl border border-[#E8D9BA] bg-white p-7">
                <p style={{ fontFamily: 'Playfair Display, Georgia, serif' }} className="text-lg font-semibold text-[#14100C] mb-2">
                  Referências visuais — links
                </p>
                <p className="text-[#9C8E7C] text-xs mb-5">
                  Perfis de Instagram, sites, concorrentes que você admira esteticamente (ex: Bela Gil, Naturalie, etc.)
                </p>
                <div className="space-y-3">
                  {links.map((url, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="url"
                        value={url}
                        onChange={e => setLink(idx, e.target.value)}
                        placeholder="https://..."
                        className="flex-1 rounded-xl border border-[#E8D9BA] bg-[#FAF5E8] px-4 py-3 text-sm text-[#14100C] placeholder:text-[#C4B8A0] focus:outline-none focus:border-[#C8941A] transition-colors"
                      />
                      {links.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeLinkField(idx)}
                          className="w-9 h-9 rounded-full flex items-center justify-center border border-[#E8D9BA] text-[#C47A60] hover:border-[#8B4030]/30 hover:bg-[#8B4030]/5 transition-colors text-lg leading-none"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addLinkField}
                  className="mt-3 text-[#C8941A] text-xs font-medium hover:text-[#8B4030] transition-colors flex items-center gap-1"
                >
                  + Adicionar link
                </button>
              </div>

              {/* ── File upload ─── */}
              <div className="rounded-2xl border border-[#E8D9BA] bg-white p-7">
                <p style={{ fontFamily: 'Playfair Display, Georgia, serif' }} className="text-lg font-semibold text-[#14100C] mb-2">
                  Referências visuais — arquivos
                </p>
                <p className="text-[#9C8E7C] text-xs mb-5">
                  Imagens, screenshots, fotos de rótulos, embalagens ou qualquer visual que te inspire. Máx. 8 MB por arquivo.
                </p>

                {/* Drop zone */}
                <div
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl px-6 py-10 text-center cursor-pointer transition-all duration-200 ${
                    dragOver
                      ? 'border-[#C8941A] bg-[#C8941A]/5'
                      : 'border-[#E0D0B0] hover:border-[#C8941A]/50 hover:bg-[#FAF5E8]'
                  }`}
                >
                  <p className="text-3xl mb-2">📎</p>
                  <p className="text-[#14100C] text-sm font-medium">Clique ou arraste arquivos aqui</p>
                  <p className="text-[#9C8E7C] text-xs mt-1">PNG, JPG, PDF, WEBP — até 10 arquivos</p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={e => e.target.files && addFiles(e.target.files)}
                />

                {/* Pending files (new uploads) */}
                {pendingFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-[#C8941A] text-xs font-semibold uppercase tracking-widest mb-2">Prontos para enviar</p>
                    {pendingFiles.map((f, idx) => (
                      <div key={idx} className="flex items-center justify-between px-4 py-3 rounded-lg bg-[#C8941A]/6 border border-[#C8941A]/20">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-lg shrink-0">{f.type.startsWith('image/') ? '🖼️' : '📄'}</span>
                          <div className="min-w-0">
                            <p className="text-[#14100C] text-sm font-medium truncate">{f.name}</p>
                            <p className="text-[#9C8E7C] text-xs">{fmtSize(f.size)}</p>
                          </div>
                        </div>
                        <button type="button" onClick={() => removeFile(idx)} className="text-[#C47A60] hover:text-[#8B4030] text-lg ml-3 shrink-0">×</button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Already saved files */}
                {savedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-[#6B8C3E] text-xs font-semibold uppercase tracking-widest mb-2">✓ Já enviados</p>
                    {savedFiles.map((f, idx) => (
                      <div key={idx} className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#6B8C3E]/6 border border-[#6B8C3E]/20">
                        <span className="text-lg">{f.type.startsWith('image/') ? '🖼️' : '📄'}</span>
                        <div>
                          <p className="text-[#14100C] text-sm font-medium">{f.name}</p>
                          <p className="text-[#9C8E7C] text-xs">{fmtSize(f.size)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ── Submit ─── */}
              <div className="flex flex-col items-center gap-3 pt-2">
                {!allMCAnswered && (
                  <p className="text-[#C47A60] text-xs">Responda todas as perguntas de múltipla escolha para enviar.</p>
                )}
                <button
                  type="submit"
                  disabled={isSaving || !allMCAnswered}
                  className="px-10 py-4 rounded-2xl text-white font-semibold text-sm tracking-wide transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: allMCAnswered ? 'linear-gradient(135deg, #C8941A, #E6B84A)' : '#C8941A' }}
                >
                  {isSaving ? 'Salvando...' : 'Enviar respostas e referências'}
                </button>
              </div>

            </form>
          )}
        </div>
      </section>

      {/* ── Próximas Entregas ─────────────────────────────────────────────── */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <SectionLabel num="O que vem" label="A Seguir" />
          <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif' }} className="text-3xl md:text-4xl font-bold text-[#14100C]">
            Próximas entregas
          </h2>
          <p className="text-[#6B6050] mt-4 max-w-lg mx-auto text-sm leading-relaxed">
            Com a identidade aprovada, partimos para construir a presença digital completa da Nefertari.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {proximas.map(item => (
            <div key={item.num} className="rounded-2xl border border-[#E8D9BA] bg-white p-7 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-5">
                <span className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: item.color }}>
                  {item.num}
                </span>
                <span className="text-[#E8D9BA] text-xs font-mono uppercase tracking-widest">Em breve</span>
              </div>
              <h3 style={{ fontFamily: 'Playfair Display, Georgia, serif' }} className="text-xl font-semibold text-[#14100C] mb-3">{item.title}</h3>
              <p className="text-[#6B6050] text-sm leading-relaxed mb-5">{item.desc}</p>
              <div className="flex flex-wrap gap-2">
                {item.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium border" style={{ borderColor: `${item.color}30`, color: item.color, backgroundColor: `${item.color}08` }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer style={{ background: '#14100C', borderTop: '1px solid rgba(200,148,26,0.10)' }} className="px-6 py-10 text-center">
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
