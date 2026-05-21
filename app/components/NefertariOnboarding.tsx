'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { toast, Toaster } from 'sonner';
import { Loader2, Save, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

import { onboardingSchema, type OnboardingValues } from '@/lib/schemas/onboarding';

// ─── Seed data ────────────────────────────────────────────────────────────────
const DEFAULTS: OnboardingValues = {
  essencia:
    'Fartura. Contato íntimo com o cozinhar e com a totalidade do alimento. Criativa, que pensa em texturas diferentes. Eleva o lanche a uma experiência gastronômica.',
  valores: '1. Nutrição com afeto\n2. Ancestralidade\n3. Consciência',
  transformacao: 'Alimentar o corpo como um ato sagrado.',
  publico:
    'Pessoas da academia, clientes com restrições alimentares (adventistas), e pessoas que gostam de comer bem sem ultraprocessados.',
  dores:
    'Falta de opções noturnas com lanches naturais e artesanais de verdade. Concorrentes usam carne do futuro industrializada.',
  concorrencia:
    'Sem concorrente direto noturno. Hamburguerias tradicionais (Smash) atuam como parceiros de indicação.',
  estetica: 'Conexão com a Terra, Egito/Kemet (Pirâmide, Olho Grego). Cores vivas. Orgânico, rústico e limpo.',
  detesta: 'Visual monocromático, imagens genéricas geradas por IA, estética fitness clichê.',
  cardapio: '4 hambúrgueres, 2 wraps, batata frita e bebidas.',
  estrategia:
    'iFood apenas como vitrine. Direcionar todo o tráfego e embalagens para o sistema de pedidos próprio para zerar taxas.',
  operacao:
    'Atendimento WhatsApp automatizado, ágil, mas humanizado. Uso de atalhos e mensagens prontas no tom de voz da marca.',
};

// ─── Animation variants ───────────────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.52, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

// ─── Field wrapper ────────────────────────────────────────────────────────────
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-neutral-400 select-none">{label}</label>
      {children}
      {error && (
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-400 flex items-center gap-1">
          <AlertCircle className="w-3 h-3 shrink-0" /> {error}
        </motion.p>
      )}
    </div>
  );
}

const inputCls =
  'w-full bg-neutral-900/60 border border-white/[0.07] rounded-xl px-3.5 py-2.5 text-sm ' +
  'text-neutral-200 placeholder:text-neutral-600 transition-all duration-200 ' +
  'focus:outline-none focus:ring-1 focus:ring-lime-500/40 focus:border-lime-500/30 ' +
  'aria-[invalid=true]:border-red-500/40 aria-[invalid=true]:ring-red-500/20';

function SectionHeader({ n, title }: { n: string; title: string }) {
  return (
    <h2 className="text-base font-semibold text-lime-400 flex items-center gap-2.5">
      <span className="w-2 h-2 rounded-full bg-lime-400 shadow-[0_0_10px_rgba(132,204,22,0.8)] shrink-0" />
      <span className="text-neutral-600 text-sm font-mono">{n}</span>
      {title}
    </h2>
  );
}

function Skeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="h-48 rounded-2xl bg-white/[0.02] border border-white/5" />
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function NefertariOnboarding() {
  const [isLoading, setIsLoading]   = useState(true);
  const [isSaving, setIsSaving]     = useState(false);
  const [lastSaved, setLastSaved]   = useState<Date | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<OnboardingValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: DEFAULTS,
  });

  // ── Load from KV on mount ──
  useEffect(() => {
    fetch('/api/onboarding')
      .then(r => r.json())
      .then((data: Record<string, string> | null) => {
        if (data) {
          const { updated_at, ...fields } = data;
          reset({ ...DEFAULTS, ...fields });
          if (updated_at) setLastSaved(new Date(updated_at));
        }
      })
      .catch(() => toast.error('Não foi possível carregar os dados salvos.'))
      .finally(() => setIsLoading(false));
  }, [reset]);

  // ── Save to KV ──
  async function onSubmit(values: OnboardingValues) {
    setIsSaving(true);
    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error('save failed');
      const now = new Date();
      setLastSaved(now);
      reset(values);
      toast.success('Definições salvas!', {
        description: `Salvo às ${now.toLocaleTimeString('pt-BR')}`,
        icon: <CheckCircle2 className="w-4 h-4 text-lime-400" />,
      });
    } catch {
      toast.error('Erro ao salvar. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <Toaster position="bottom-right" theme="dark" toastOptions={{
        style: {
          background: 'rgba(10,10,10,0.95)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: '#e5e5e5',
          backdropFilter: 'blur(12px)',
        },
      }} />

      <div className="min-h-screen bg-neutral-950 text-neutral-100 px-4 py-10 font-sans selection:bg-lime-500/20">
        {/* Ambient */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-lime-500/[0.03] blur-[120px]" />
          <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-emerald-500/[0.03] blur-[120px]" />
        </div>

        <div className="relative max-w-4xl mx-auto">

          {/* Header */}
          <motion.header variants={fadeUp} initial="hidden" animate="visible" className="mb-10">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-lime-400 to-emerald-500 bg-clip-text text-transparent">
                  Nefertari Onboarding
                </h1>
                <p className="text-neutral-500 text-sm mt-1">Gestão de Requisitos e Setup do Projeto</p>
              </div>
              {lastSaved && (
                <span className="text-xs text-neutral-600 mt-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  Último save: {lastSaved.toLocaleString('pt-BR')}
                </span>
              )}
            </div>
          </motion.header>

          {/* Form */}
          {isLoading ? <Skeleton /> : (
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-6">

                {/* 01 — Coração */}
                <motion.div variants={fadeUp}
                  className="backdrop-blur-xl bg-white/[0.025] border border-white/[0.08] rounded-3xl p-7 shadow-[0_0_40px_rgba(132,204,22,0.03)]">
                  <SectionHeader n="01" title="O Coração da Nefertari" />
                  <div className="mt-5 space-y-4">
                    <Field label="A Alma da Marca" error={errors.essencia?.message}>
                      <textarea {...register('essencia')} rows={3} aria-invalid={!!errors.essencia}
                        className={`${inputCls} resize-none`} placeholder="Descreva a essência da marca..." />
                    </Field>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field label="Valores Inegociáveis" error={errors.valores?.message}>
                        <textarea {...register('valores')} rows={3} aria-invalid={!!errors.valores}
                          className={`${inputCls} resize-none`} placeholder="Ex: 1. Nutrição com afeto..." />
                      </Field>
                      <Field label="Conceito Central" error={errors.transformacao?.message}>
                        <textarea {...register('transformacao')} rows={3} aria-invalid={!!errors.transformacao}
                          className={`${inputCls} resize-none`} placeholder="A grande ideia por trás da marca..." />
                      </Field>
                    </div>
                  </div>
                </motion.div>

                {/* 02 — Público */}
                <motion.div variants={fadeUp}
                  className="backdrop-blur-xl bg-white/[0.025] border border-white/[0.08] rounded-3xl p-7">
                  <SectionHeader n="02" title="Público e Mercado" />
                  <div className="mt-5 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field label="Cliente Ideal" error={errors.publico?.message}>
                        <textarea {...register('publico')} rows={4} aria-invalid={!!errors.publico}
                          className={`${inputCls} resize-none`} placeholder="Perfil do cliente..." />
                      </Field>
                      <div className="flex flex-col gap-4">
                        <Field label="Dores do Mercado" error={errors.dores?.message}>
                          <textarea {...register('dores')} rows={2} aria-invalid={!!errors.dores}
                            className={`${inputCls} resize-none`} placeholder="O que falta no mercado hoje..." />
                        </Field>
                        <Field label="Concorrência / Parcerias" error={errors.concorrencia?.message}>
                          <input {...register('concorrencia')} aria-invalid={!!errors.concorrencia}
                            className={inputCls} placeholder="Competidores diretos, parceiros..." />
                        </Field>
                      </div>
                    </div>
                    <Field label="Cardápio Atual">
                      <input {...register('cardapio')} className={inputCls}
                        placeholder="Produtos disponíveis no cardápio..." />
                    </Field>
                  </div>
                </motion.div>

                {/* 03 — Estética */}
                <motion.div variants={fadeUp}
                  className="backdrop-blur-xl bg-white/[0.025] border border-white/[0.08] rounded-3xl p-7">
                  <SectionHeader n="03" title="Estética e Identidade Visual" />
                  <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Referências Visuais (Likes)" error={errors.estetica?.message}>
                      <textarea {...register('estetica')} rows={3} aria-invalid={!!errors.estetica}
                        className={`${inputCls} resize-none`} placeholder="Estilos, cores, referências que inspiram..." />
                    </Field>
                    <Field label="O Que Detesta (Dislikes)" error={errors.detesta?.message}>
                      <textarea {...register('detesta')} rows={3} aria-invalid={!!errors.detesta}
                        className={`${inputCls} resize-none`} placeholder="Estilos, tendências a evitar..." />
                    </Field>
                  </div>
                </motion.div>

                {/* 04 — Operação */}
                <motion.div variants={fadeUp}
                  className="backdrop-blur-xl bg-white/[0.025] border border-white/[0.08] rounded-3xl p-7">
                  <SectionHeader n="04" title="Operação e Estratégia de Vendas" />
                  <div className="mt-5 space-y-4">
                    <Field label="Estratégia de Aquisição (iFood vs Sistema Próprio)">
                      <textarea {...register('estrategia')} rows={2}
                        className={`${inputCls} resize-none`} placeholder="Como capturar clientes fora das plataformas..." />
                    </Field>
                    <Field label="Operação de Atendimento">
                      <textarea {...register('operacao')} rows={3}
                        className={`${inputCls} resize-none`} placeholder="Fluxo de pedidos, WhatsApp, automações..." />
                    </Field>
                  </div>
                </motion.div>

                {/* Action bar */}
                <motion.div variants={fadeUp} className="flex items-center justify-between gap-4 pt-2">
                  <button type="button" onClick={() => { reset(); toast.info('Alterações descartadas.'); }}
                    disabled={!isDirty || isSaving}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-neutral-500
                      hover:text-neutral-300 transition-colors disabled:opacity-30 disabled:pointer-events-none">
                    <RefreshCw className="w-4 h-4" /> Descartar Alterações
                  </button>

                  <button type="submit" disabled={isSaving}
                    className="flex items-center gap-2.5 px-7 py-3 bg-lime-500 hover:bg-lime-400
                      text-neutral-950 font-bold text-sm rounded-xl transition-all
                      shadow-[0_0_20px_rgba(132,204,22,0.25)] hover:shadow-[0_0_30px_rgba(132,204,22,0.45)]
                      hover:-translate-y-0.5 active:translate-y-0
                      disabled:opacity-70 disabled:pointer-events-none">
                    {isSaving
                      ? <><Loader2 className="w-4 h-4 animate-spin" /> Salvando...</>
                      : <><Save className="w-4 h-4" /> Salvar Definições</>
                    }
                  </button>
                </motion.div>

              </motion.div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
