'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  BookOpen,
  MessageCircle,
  Users,
  Gift,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Smartphone,
  QrCode,
  Sparkles,
  RefreshCw,
  Clock,
  MapPin,
  Lock,
  Layers,
  Search,
  HelpCircle,
} from 'lucide-react';
import { useTheme } from '../lib/useTheme';
import ThemeToggle from './ThemeToggle';

const G = {
  gold:      '#C8941A',
  goldSoft:  '#E6B84A',
  goldDim:   'rgba(200,148,26,0.15)',
  green:     '#6B8C3E',
  greenWa:   '#25D366',
  greenBg:   'rgba(37,211,102,0.12)',
  terra:     '#8B4030',
  dark:      '#14100C',
  dark2:     '#1E1509',
  card:      '#1A1208',
  card2:     '#211808',
  text:      '#E8D9BA',
  muted:     '#7A6A54',
  border:    'rgba(200,148,26,0.18)',
  parch:     '#FAF5E8',
  sand:      '#F5E6C8',
  bg:        '#0E0C08',
};
const serif = 'Playfair Display, Georgia, serif';
const sans  = 'Inter, system-ui, sans-serif';

type TabKey = 'pedidos' | 'cardapio' | 'whatsapp' | 'clientes' | 'fidelidade' | 'seguranca' | 'faq';

export default function Documentation() {
  const { dark, T, toggle } = useTheme();
  const [activeTab, setActiveTab] = useState<TabKey>('pedidos');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  function copyText(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  }

  const tabs = [
    { id: 'pedidos',    label: 'Fluxo de Pedidos',     icon: ShoppingBag,   desc: 'Recebimento, esteira Kanban, PIN e entregas' },
    { id: 'cardapio',   label: 'Gestão do Cardápio',   icon: BookOpen,      desc: 'Itens, preços, fotos de capa e categorias' },
    { id: 'whatsapp',   label: 'WhatsApp & Automação', icon: MessageCircle, desc: 'QR Code, mensagens anti-spam e avisos' },
    { id: 'clientes',   label: 'CRM & Clientes',       icon: Users,        desc: 'Histórico, ticket médio e 1-click WhatsApp' },
    { id: 'fidelidade', label: 'Selos de Fidelidade',  icon: Gift,         desc: 'Sistema de 10 selos e receitas sazonais' },
    { id: 'seguranca',  label: 'Acesso & Segurança',   icon: ShieldCheck,  desc: 'PIN do painel, Cloudflare KV e sessões' },
    { id: 'faq',        label: 'Dúvidas & FAQ',        icon: HelpCircle,   desc: 'Perguntas frequentes e resolução de problemas' },
  ] as const;

  // Trigger deployment webhook commit
  return (
    <div style={{ minHeight: '100dvh', background: dark ? G.dark : T.bg, color: T.text, fontFamily: sans, transition: 'background 0.3s' }}>
      
      {/* ── Header ── */}
      <header style={{
        background: dark ? G.dark2 : T.card,
        borderBottom: `1px solid ${T.border}`,
        padding: '0 1.5rem',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <Link href="/painel" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/nefertari-logo-golden.png" alt="Nefertari" style={{ height: '34px', width: '34px', objectFit: 'contain' }} />
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
              <span style={{ fontFamily: serif, fontWeight: 700, fontSize: '1.05rem', color: T.text }}>
                Nefertari Cozinha Viva
              </span>
              <span style={{ color: G.gold, fontSize: '0.55rem', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
                Manual do Sistema & Documentação
              </span>
            </div>
          </Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link
            href="/painel"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.45rem 0.9rem', borderRadius: '99px',
              background: G.goldDim, color: G.gold, textDecoration: 'none',
              fontSize: '0.8rem', fontWeight: 600, border: `1px solid ${G.gold}40`,
            }}
          >
            Ir ao Painel <ArrowRight size={14} />
          </Link>
          <ThemeToggle dark={dark} onToggle={toggle} position="static" />
        </div>
      </header>

      {/* ── Hero / Title ── */}
      <div style={{
        background: dark
          ? `radial-gradient(ellipse 70% 40% at 50% 0%, rgba(200,148,26,0.12) 0%, transparent 70%), ${G.dark}`
          : `radial-gradient(ellipse 70% 40% at 50% 0%, rgba(200,148,26,0.08) 0%, transparent 70%), ${T.bg2}`,
        borderBottom: `1px solid ${T.border}`,
        padding: '3rem 1.5rem 2.5rem',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
          <span style={{
            fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
            color: G.gold, background: G.goldDim, padding: '0.25rem 0.75rem', borderRadius: '99px',
            display: 'inline-block', marginBottom: '1rem', border: `1px solid ${G.gold}30`,
          }}>
            Guia Completo da Plataforma
          </span>
          <h1 style={{ fontFamily: serif, fontSize: 'clamp(1.8rem, 4.5vw, 2.75rem)', fontWeight: 700, margin: '0 0 0.75rem', color: T.text, lineHeight: 1.2 }}>
            Como Operar a Cozinha Digital
          </h1>
          <p style={{ color: T.muted, fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '600px', margin: '0 auto' }}>
            Este manual detalha cada funcionalidade do sistema Nefertari: recebimento de pedidos, esteira da cozinha, PINs automáticos, disparo no WhatsApp e controle de clientes.
          </p>
        </div>
      </div>

      {/* ── Main Layout with Tabs ── */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>
        
        {/* Navigation Tabs Bar */}
        <div style={{
          display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.75rem',
          borderBottom: `1px solid ${T.border}`, marginBottom: '2.5rem',
        }}>
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabKey)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.75rem 1.25rem', borderRadius: '0.85rem',
                  background: isActive ? (dark ? G.card2 : '#FFFFFF') : 'transparent',
                  border: `1px solid ${isActive ? G.gold : 'transparent'}`,
                  color: isActive ? G.gold : T.muted,
                  cursor: 'pointer', fontFamily: sans, fontSize: '0.85rem', fontWeight: isActive ? 700 : 500,
                  whiteSpace: 'nowrap', transition: 'all 0.2s', flexShrink: 0,
                  boxShadow: isActive ? '0 4px 16px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ── Tab Contents ── */}

        {/* 1. PEDIDOS */}
        {activeTab === 'pedidos' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <h2 style={{ fontFamily: serif, fontSize: '1.6rem', fontWeight: 700, color: G.gold, marginBottom: '0.5rem' }}>
                1. Fluxo de Pedidos & Esteira da Cozinha
              </h2>
              <p style={{ color: T.muted, fontSize: '0.92rem', lineHeight: 1.7 }}>
                O sistema de pedidos opera em tempo real, sem necessidade de aplicativos de terceiros ou taxas de comissão. Cada pedido entra automaticamente no painel da cozinha (`/painel`).
              </p>
            </div>

            {/* Steps Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {[
                {
                  step: '01',
                  title: 'Entrada do Pedido',
                  desc: 'O cliente seleciona os itens no cardápio, informa WhatsApp, nome e tipo de entrega (Retirada ou Delivery). O pedido recebe um ID único (ex: #NEF-2409-A3F) e gera um PIN exclusivo de 4 dígitos.',
                  badge: 'Recebido',
                  color: G.gold,
                },
                {
                  step: '02',
                  title: 'Aviso Imediato no WhatsApp',
                  desc: 'Assim que o pedido é salvo, a automação WhatsApp envia uma confirmação personalizada ao cliente com o resumo dos itens, total (R$), PIN de acesso e link para acompanhar o status ao vivo.',
                  badge: 'WhatsApp Auto',
                  color: G.greenWa,
                },
                {
                  step: '03',
                  title: 'Início do Preparo',
                  desc: 'Na cozinha, Jéssica clica em "Iniciar preparo". O pedido avança para a coluna "Em preparo" e o cliente recebe um aviso de que os ingredientes frescos já estão sendo trabalhados à mão.',
                  badge: 'Em Preparo',
                  color: G.terra,
                },
                {
                  step: '04',
                  title: 'Pronto & Despacho',
                  desc: 'Quando finalizado, clicar em "Marcar como pronto". Se for entrega, notifica que o entregador saiu com o pedido quentinho; se for retirada, avisa que já está pronto no balcão.',
                  badge: 'Pronto',
                  color: G.green,
                },
                {
                  step: '05',
                  title: 'Entrega & Fidelidade',
                  desc: 'Ao confirmar entrega ("Confirmar entrega"), o pedido é movido para o histórico. O cliente recebe agradecimento, convite para feedback e computa +1 Selo Sagrado de Fidelidade.',
                  badge: 'Entregue',
                  color: '#6B6560',
                },
                {
                  step: '06',
                  title: 'Mensagens Personalizadas',
                  desc: 'Em qualquer momento, Jéssica pode clicar no botão verde de WhatsApp em qualquer card de pedido para enviar mensagens livres ou usar modelos no tom nobre da Nefertari.',
                  badge: 'Custom Msg',
                  color: G.goldSoft,
                },
              ].map(item => (
                <div key={item.step} style={{
                  background: dark ? G.card : '#FFFFFF', borderRadius: '1.25rem',
                  border: `1px solid ${T.border}`, padding: '1.5rem',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                    <span style={{ fontFamily: serif, fontSize: '1.2rem', fontWeight: 700, color: G.gold }}>{item.step}</span>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '99px', background: `${item.color}20`, color: item.color, border: `1px solid ${item.color}40` }}>
                      {item.badge}
                    </span>
                  </div>
                  <h3 style={{ fontFamily: serif, fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.5rem', color: T.text }}>
                    {item.title}
                  </h3>
                  <p style={{ color: T.muted, fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Tracking Link Info */}
            <div style={{
              background: dark ? G.card2 : G.sand, borderRadius: '1.25rem', border: `1px solid ${T.border}`,
              padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap',
            }}>
              <Smartphone size={28} color={G.gold} style={{ flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: '240px' }}>
                <p style={{ fontWeight: 700, fontSize: '0.95rem', margin: '0 0 0.2rem', color: T.text }}>
                  Rastreamento em Tempo Real pelo Cliente
                </p>
                <p style={{ color: T.muted, fontSize: '0.82rem', margin: 0, lineHeight: 1.5 }}>
                  O cliente acompanha o progresso acessando: <code>https://nefertari.clubemkt.digital/pedido?id=ID_DO_PEDIDO</code>. A tela se atualiza automaticamente sem recarregar a página.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 2. CARDAPIO */}
        {activeTab === 'cardapio' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <h2 style={{ fontFamily: serif, fontSize: '1.6rem', fontWeight: 700, color: G.gold, marginBottom: '0.5rem' }}>
                2. Gestão Completa do Cardápio Digital (`/painel/cardapio`)
              </h2>
              <p style={{ color: T.muted, fontSize: '0.92rem', lineHeight: 1.7 }}>
                Jéssica tem autonomia total para cadastrar, editar, precificar e gerenciar fotos de todos os produtos do cardápio em tempo real.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {/* Feature 1 */}
              <div style={{ background: dark ? G.card : '#FFFFFF', borderRadius: '1.25rem', border: `1px solid ${T.border}`, padding: '1.5rem' }}>
                <h3 style={{ fontFamily: serif, fontSize: '1.15rem', fontWeight: 700, color: G.gold, marginBottom: '0.75rem' }}>
                  📸 Upload & Gestão de Fotos
                </h3>
                <ul style={{ color: T.muted, fontSize: '0.85rem', lineHeight: 1.8, paddingLeft: '1.2rem', margin: 0 }}>
                  <li><strong>Upload Múltiplo:</strong> Permite carregar 1 ou várias fotos de alta resolução do celular ou computador.</li>
                  <li><strong>Compressão Automática:</strong> As fotos são comprimidas diretamente no navegador (Canvas 600px JPEG), garantindo carregamento instantâneo.</li>
                  <li><strong>Capa em 1 Clique:</strong> A 1ª foto é a capa (`CAPA`). Basta clicar em qualquer miniatura ou em <em>"Tornar capa"</em> para alterar a foto principal.</li>
                  <li><strong>Exclusão Segura:</strong> Botão vermelho `X` em cada miniatura para remover fotos individuais.</li>
                </ul>
              </div>

              {/* Feature 2 */}
              <div style={{ background: dark ? G.card : '#FFFFFF', borderRadius: '1.25rem', border: `1px solid ${T.border}`, padding: '1.5rem' }}>
                <h3 style={{ fontFamily: serif, fontSize: '1.15rem', fontWeight: 700, color: G.gold, marginBottom: '0.75rem' }}>
                  ✏️ Edição de Dados & Ingredientes
                </h3>
                <ul style={{ color: T.muted, fontSize: '0.85rem', lineHeight: 1.8, paddingLeft: '1.2rem', margin: 0 }}>
                  <li><strong>Título e Categoria:</strong> Modifique o nome do prato e a categoria a que pertence (Burgers, Wraps, Tortas, Acompanhamentos, Bebidas).</li>
                  <li><strong>Preço:</strong> Atualização em reais com suporte a casas decimais (ex: 26.00).</li>
                  <li><strong>Disponibilidade:</strong> Alternador de 1 clique (<em>Disponível / Indisponível</em>) para pausar vendas de itens esgotados sem apagá-los.</li>
                  <li><strong>Tags de Estilo:</strong> Seleção rápida de tags como <code>vegano</code>, <code>artesanal</code>, <code>vegetariano</code>, <code>sem glúten</code>.</li>
                  <li><strong>Lista de Ingredientes:</strong> Campo para listar ingredientes (1 por linha), exibidos no modal de detalhes do cliente.</li>
                </ul>
              </div>

              {/* Feature 3 */}
              <div style={{ background: dark ? G.card : '#FFFFFF', borderRadius: '1.25rem', border: `1px solid ${T.border}`, padding: '1.5rem' }}>
                <h3 style={{ fontFamily: serif, fontSize: '1.15rem', fontWeight: 700, color: G.gold, marginBottom: '0.75rem' }}>
                  🗂️ Categorias & Seções
                </h3>
                <ul style={{ color: T.muted, fontSize: '0.85rem', lineHeight: 1.8, paddingLeft: '1.2rem', margin: 0 }}>
                  <li><strong>Criar Nova Seção:</strong> Botão <em>"+ Nova categoria"</em> com título, subtítulo e numeração romana automática (I, II, III, IV, V).</li>
                  <li><strong>Reordenar & Editar:</strong> Ícones de lápis e lixeira no cabeçalho de cada seção.</li>
                  <li><strong>Sincronização Cloudflare KV:</strong> Qualquer edição é persistida instantaneamente na chave <code>menu:items:v2</code> e refletida no site público.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* 3. WHATSAPP */}
        {activeTab === 'whatsapp' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <h2 style={{ fontFamily: serif, fontSize: '1.6rem', fontWeight: 700, color: G.gold, marginBottom: '0.5rem' }}>
                3. Conexão WhatsApp & Inteligência Anti-Spam (`/painel/whatsapp`)
              </h2>
              <p style={{ color: T.muted, fontSize: '0.92rem', lineHeight: 1.7 }}>
                A Nefertari possui integração nativa com a API Baileys (Evolution/Uazapi), permitindo conectar o número oficial e enviar mensagens de alta conversão sem risco de bloqueio.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              <div style={{ background: dark ? G.card : '#FFFFFF', borderRadius: '1.25rem', border: `1px solid ${T.border}`, padding: '1.5rem' }}>
                <h3 style={{ fontFamily: serif, fontSize: '1.15rem', fontWeight: 700, color: G.greenWa, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <QrCode size={18} /> Como Conectar o Aparelho
                </h3>
                <ol style={{ color: T.muted, fontSize: '0.85rem', lineHeight: 1.8, paddingLeft: '1.2rem', margin: 0 }}>
                  <li>Acesse <strong>/painel/whatsapp</strong> no navegador do computador ou outro dispositivo.</li>
                  <li>Clique no botão dourado <strong>"Conectar WhatsApp"</strong> para gerar o QR Code.</li>
                  <li>No celular com o WhatsApp da Nefertari, vá em <em>Configurações $\rightarrow$ Aparelhos conectados $\rightarrow$ Conectar um aparelho</em>.</li>
                  <li>Aponte a câmera para o QR Code na tela. Em poucos segundos o status mudará para <strong>● Conectado</strong> com o número vinculado.</li>
                </ol>
              </div>

              <div style={{ background: dark ? G.card : '#FFFFFF', borderRadius: '1.25rem', border: `1px solid ${T.border}`, padding: '1.5rem' }}>
                <h3 style={{ fontFamily: serif, fontSize: '1.15rem', fontWeight: 700, color: G.gold, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={18} /> Proteção Anti-Spam da Meta
                </h3>
                <p style={{ color: T.muted, fontSize: '0.85rem', lineHeight: 1.7, marginBottom: '0.75rem' }}>
                  O algoritmo da Meta restringe números que disparam mensagens idênticas em massa. Para proteger o número da Nefertari, o sistema implementa:
                </p>
                <ul style={{ color: T.muted, fontSize: '0.85rem', lineHeight: 1.8, paddingLeft: '1.2rem', margin: 0 }}>
                  <li><strong>Redação Dinâmica:</strong> O texto de cada status é gerado no momento do disparo com variações de saudações e encerramentos.</li>
                  <li><strong>Tom de Voz Humanizado:</strong> Assinado pessoalmente por Jéssica Souza, reforçando o propósito de comida viva e respeito ao corpo.</li>
                </ul>
              </div>
            </div>

            {/* Message Model Examples */}
            <div style={{ background: dark ? G.card : '#FFFFFF', borderRadius: '1.25rem', border: `1px solid ${T.border}`, padding: '1.5rem' }}>
              <h3 style={{ fontFamily: serif, fontSize: '1.15rem', fontWeight: 700, color: T.text, marginBottom: '1rem' }}>
                Exemplos de Mensagens Automáticas
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                {[
                  {
                    title: '🌿 Pedido Recebido',
                    text: 'Olá, Carlos! 🌿 Aqui é a Jéssica da Nefertari. Recebemos seu pedido #NEF-2409-B8 com sucesso! Cada camada está sendo feita na hora com ingredientes frescos.\n\n🔑 Seu PIN exclusivo: 7492\n📱 Acompanhe em: https://nefertari.clubemkt.digital/pedido?id=...',
                  },
                  {
                    title: '🔥 Em Preparo',
                    text: 'Carlos, nosso ritual de alimentar o corpo com comida de verdade começou! ✨ Seu pedido #NEF-2409-B8 acabou de entrar em preparo artesanal. Em breve estará no ponto perfeito!\n\nJéssica Souza · Nefertari Cozinha Viva 🌿',
                  },
                  {
                    title: '🛵 Pronto / Despacho',
                    text: 'Boas notícias, Carlos! ✨ Seu pedido #NEF-2409-B8 acabou de ficar pronto e o entregador já está a caminho do seu endereço. Bom apetite!\n\nNutrição e sabor de verdade,\nNefertari Cozinha Viva ✨',
                  },
                ].map(ex => (
                  <div key={ex.title} style={{
                    background: dark ? 'rgba(255,255,255,0.03)' : G.sand, borderRadius: '0.85rem',
                    border: `1px solid ${T.border}`, padding: '1rem', fontSize: '0.8rem', lineHeight: 1.5,
                  }}>
                    <p style={{ fontWeight: 700, color: G.gold, margin: '0 0 0.5rem' }}>{ex.title}</p>
                    <p style={{ color: T.text, whiteSpace: 'pre-line', margin: 0 }}>{ex.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. CLIENTES */}
        {activeTab === 'clientes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <h2 style={{ fontFamily: serif, fontSize: '1.6rem', fontWeight: 700, color: G.gold, marginBottom: '0.5rem' }}>
                4. CRM & Gestão de Clientes (`/painel/clientes`)
              </h2>
              <p style={{ color: T.muted, fontSize: '0.92rem', lineHeight: 1.7 }}>
                O módulo de CRM captura automaticamente os dados de cada cliente que realiza pedidos ou se cadastra no site, construindo uma base de clientes com inteligência de recompra.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              <div style={{ background: dark ? G.card : '#FFFFFF', borderRadius: '1.25rem', border: `1px solid ${T.border}`, padding: '1.5rem' }}>
                <h3 style={{ fontFamily: serif, fontSize: '1.15rem', fontWeight: 700, color: G.gold, marginBottom: '0.75rem' }}>
                  📊 Métricas & Inteligência
                </h3>
                <ul style={{ color: T.muted, fontSize: '0.85rem', lineHeight: 1.8, paddingLeft: '1.2rem', margin: 0 }}>
                  <li><strong>Contador de Pedidos:</strong> Acompanhamento do número total de pedidos feitos por cada cliente.</li>
                  <li><strong>Total Gasto & Ticket Médio:</strong> Cálculo automático da receita acumulada e valor médio por pedido.</li>
                  <li><strong>Tempo de Recorrência:</strong> Identificação de clientes fiéis e clientes ativos nos últimos 7 dias.</li>
                  <li><strong>Classificação VIP:</strong> Badge especial de estrela dourada para clientes com 3 ou mais pedidos.</li>
                </ul>
              </div>

              <div style={{ background: dark ? G.card : '#FFFFFF', borderRadius: '1.25rem', border: `1px solid ${T.border}`, padding: '1.5rem' }}>
                <h3 style={{ fontFamily: serif, fontSize: '1.15rem', fontWeight: 700, color: G.greenWa, marginBottom: '0.75rem' }}>
                  💬 Contato em 1 Clique (WhatsApp)
                </h3>
                <ul style={{ color: T.muted, fontSize: '0.85rem', lineHeight: 1.8, paddingLeft: '1.2rem', margin: 0 }}>
                  <li><strong>Na Lista de Clientes:</strong> Cada linha possui um botão verde do WhatsApp para abrir a conversa instantaneamente.</li>
                  <li><strong>No Perfil Detalhado (Drawer):</strong> Botão de destaque com mensagem pré-formatada para atendimento exclusivo.</li>
                  <li><strong>Notas Internas:</strong> Campo para Jéssica registrar preferências (ex: <em>"Gosta de sem cebola", "Endereço no fundo da rua"</em>).</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* 5. FIDELIDADE */}
        {activeTab === 'fidelidade' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <h2 style={{ fontFamily: serif, fontSize: '1.6rem', fontWeight: 700, color: G.gold, marginBottom: '0.5rem' }}>
                5. Selos Sagrados & Programa de Fidelidade (`/painel/fidelidade`)
              </h2>
              <p style={{ color: T.muted, fontSize: '0.92rem', lineHeight: 1.7 }}>
                O programa Selos Sagrados recompensa a constância dos clientes com receitas sazonais exclusivas preparadas especialmente pela chef Jéssica a cada 10 pedidos.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              <div style={{ background: dark ? G.card : '#FFFFFF', borderRadius: '1.25rem', border: `1px solid ${T.border}`, padding: '1.5rem' }}>
                <h3 style={{ fontFamily: serif, fontSize: '1.15rem', fontWeight: 700, color: G.gold, marginBottom: '0.75rem' }}>
                  🎁 Como Funciona o Ciclo de Selos
                </h3>
                <ol style={{ color: T.muted, fontSize: '0.85rem', lineHeight: 1.8, paddingLeft: '1.2rem', margin: 0 }}>
                  <li>O cliente acumula 1 selo a cada pedido realizado com seu número cadastrado.</li>
                  <li><strong>No 5º selo:</strong> Recebe uma mensagem automática de incentivo (metade do caminho).</li>
                  <li><strong>No 9º selo:</strong> Notificação de que falta apenas 1 pedido para a recompensa.</li>
                  <li><strong>No 10º selo:</strong> A recompensa sazonal é liberada no cardápio como item de cortesia, e o ciclo se reinicia para o próximo presente.</li>
                </ol>
              </div>

              <div style={{ background: dark ? G.card : '#FFFFFF', borderRadius: '1.25rem', border: `1px solid ${T.border}`, padding: '1.5rem' }}>
                <h3 style={{ fontFamily: serif, fontSize: '1.15rem', fontWeight: 700, color: G.gold, marginBottom: '0.75rem' }}>
                  👩‍🍳 Cadastrando Receitas Sazonais
                </h3>
                <p style={{ color: T.muted, fontSize: '0.85rem', lineHeight: 1.7, marginBottom: '0.75rem' }}>
                  Na aba <strong>/painel/fidelidade</strong>, Jéssica pode:
                </p>
                <ul style={{ color: T.muted, fontSize: '0.85rem', lineHeight: 1.8, paddingLeft: '1.2rem', margin: 0 }}>
                  <li>Criar receitas surpresa com nome da estação (ex: <em>"Wrap Flamboyant — Outono 2026"</em>).</li>
                  <li>Descrever ingredientes nobres e modo de preparo.</li>
                  <li>Definir qual receita está <strong>Ativa</strong> no momento para ser resgatada pelos clientes fidelizados.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* 6. SEGURANCA */}
        {activeTab === 'seguranca' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <h2 style={{ fontFamily: serif, fontSize: '1.6rem', fontWeight: 700, color: G.gold, marginBottom: '0.5rem' }}>
                6. Acesso, Segurança & Infraestrutura
              </h2>
              <p style={{ color: T.muted, fontSize: '0.92rem', lineHeight: 1.7 }}>
                A plataforma é construída sobre uma arquitetura estática Next.js de alta performance na Cloudflare com banco de dados distribuído Cloudflare KV.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              <div style={{ background: dark ? G.card : '#FFFFFF', borderRadius: '1.25rem', border: `1px solid ${T.border}`, padding: '1.5rem' }}>
                <h3 style={{ fontFamily: serif, fontSize: '1.15rem', fontWeight: 700, color: G.gold, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Lock size={18} /> PIN de Acesso ao Painel
                </h3>
                <ul style={{ color: T.muted, fontSize: '0.85rem', lineHeight: 1.8, paddingLeft: '1.2rem', margin: 0 }}>
                  <li><strong>Login Rápido:</strong> Acesso restrito por PIN numérico na tela de login (`/painel` ou `/login`).</li>
                  <li><strong>Sessão de 8 Horas:</strong> Ao digitar o PIN correto, a sessão permanece ativa por 8 horas no navegador.</li>
                  <li><strong>Alteração de PIN:</strong> Ícone de engrenagem no cabeçalho em qualquer tela do painel permite à Jéssica trocar o PIN com confirmação do PIN anterior.</li>
                </ul>
              </div>

              <div style={{ background: dark ? G.card : '#FFFFFF', borderRadius: '1.25rem', border: `1px solid ${T.border}`, padding: '1.5rem' }}>
                <h3 style={{ fontFamily: serif, fontSize: '1.15rem', fontWeight: 700, color: G.gold, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Layers size={18} /> Chaves do Cloudflare KV
                </h3>
                <ul style={{ color: T.muted, fontSize: '0.85rem', lineHeight: 1.8, paddingLeft: '1.2rem', margin: 0 }}>
                  <li><code>menu:items:v2</code>: Catálogo de produtos ativos.</li>
                  <li><code>menu:categories:v2</code>: Estrutura de seções do cardápio.</li>
                  <li><code>orders:index</code> / <code>orders:active</code>: Fila de pedidos.</li>
                  <li><code>crm:index</code> / <code>crm:[phone]</code>: Dados e selos de clientes.</li>
                  <li><code>whatsapp:config</code>: Configurações da API WhatsApp.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* 7. FAQ */}
        {activeTab === 'faq' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <h2 style={{ fontFamily: serif, fontSize: '1.6rem', fontWeight: 700, color: G.gold, marginBottom: '0.5rem' }}>
                7. Dúvidas Frequentes & Resolução de Problemas
              </h2>
              <p style={{ color: T.muted, fontSize: '0.92rem', lineHeight: 1.7 }}>
                Respostas diretas para as situações mais comuns do dia a dia na operação da Nefertari.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                {
                  q: 'O que fazer se o WhatsApp for desconectado no celular?',
                  a: 'Basta acessar /painel/whatsapp, clicar em "Conectar WhatsApp" e ler o QR Code novamente com a câmera do celular. As mensagens agendadas voltarão a disparar normalmente.',
                },
                {
                  q: 'Como alterar o preço de um item ou pausar vendas temporariamente?',
                  a: 'Vá em /painel/cardapio, clique no ícone de lápis do item para alterar o valor, ou clique no botão de disponibilidade (Disponível/Indisponível) para pausar vendas no ato.',
                },
                {
                  q: 'Como enviar uma mensagem personalizada de atraso para o cliente?',
                  a: 'No card do pedido no /painel, clique no ícone verde de WhatsApp. Selecione o modelo "⏳ Tempo de Espera", ajuste o texto se desejar e clique em "Enviar Mensagem".',
                },
                {
                  q: 'Como o cliente faz login para ver seus selos de fidelidade?',
                  a: 'No cardápio (/cardapio), o cliente clica em "Meu perfil / Entrar", digita seu WhatsApp e o PIN de 4 dígitos recebido por mensagem na confirmação do pedido.',
                },
                {
                  q: 'Como trocar o PIN master de acesso ao painel da cozinha?',
                  a: 'Em qualquer página do painel, clique no ícone de engrenagem (⚙️) no cabeçalho. Digite o PIN atual, o novo PIN desejado (mínimo 4 dígitos) e confirme.',
                },
              ].map(faq => (
                <div key={faq.q} style={{
                  background: dark ? G.card : '#FFFFFF', borderRadius: '1rem',
                  border: `1px solid ${T.border}`, padding: '1.25rem 1.5rem',
                }}>
                  <p style={{ fontFamily: serif, fontSize: '1.05rem', fontWeight: 700, color: G.gold, margin: '0 0 0.4rem' }}>
                    {faq.q}
                  </p>
                  <p style={{ color: T.text, fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ── Footer ── */}
      <footer style={{
        background: dark ? '#0C0904' : G.sand, borderTop: `1px solid ${T.border}`,
        padding: '2.5rem 1.5rem', textAlign: 'center',
      }}>
        <p style={{ fontFamily: serif, fontSize: '1rem', fontWeight: 700, color: T.text, marginBottom: '0.3rem' }}>
          Nefertari Cozinha Viva
        </p>
        <p style={{ color: T.muted, fontSize: '0.78rem', marginBottom: '1rem' }}>
          Plataforma Desenvolvida por ClubeMkt Digital · Jequié, Bahia
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <Link href="/painel" style={{ color: G.gold, fontSize: '0.8rem', textDecoration: 'none', fontWeight: 600 }}>
            Painel da Cozinha
          </Link>
          <span style={{ color: T.muted }}>·</span>
          <Link href="/cardapio" style={{ color: G.gold, fontSize: '0.8rem', textDecoration: 'none', fontWeight: 600 }}>
            Cardápio Público
          </Link>
          <span style={{ color: T.muted }}>·</span>
          <Link href="/" style={{ color: G.gold, fontSize: '0.8rem', textDecoration: 'none', fontWeight: 600 }}>
            Início
          </Link>
        </div>
      </footer>
    </div>
  );
}
