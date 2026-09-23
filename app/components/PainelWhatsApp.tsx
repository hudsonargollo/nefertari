'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  MessageCircle,
  RefreshCw,
  Power,
  PowerOff,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  QrCode,
  Smartphone,
  ShieldCheck,
  Settings,
  Sparkles,
} from 'lucide-react';
import PainelHeader from './PainelHeader';

const G = {
  gold:     '#C8941A',
  goldDim:  'rgba(200,148,26,0.15)',
  green:    '#25D366',
  greenBg:  'rgba(37,211,102,0.12)',
  terra:    '#8B4030',
  dark:     '#14100C',
  card:     '#1A1208',
  card2:    '#211808',
  text:     '#E8D9BA',
  muted:    '#7A6A54',
  border:   'rgba(200,148,26,0.18)',
  bg:       '#0E0C08',
};
const serif = 'Playfair Display, Georgia, serif';
const sans  = 'Inter, system-ui, sans-serif';

interface WhatsAppStatus {
  ok:           boolean;
  state:        'connected' | 'connecting' | 'disconnected';
  qrcode?:      string | null;
  number?:      string | null;
  profilePic?:  string | null;
  instanceName: string;
  serverUrl:    string;
  autoNotify:   boolean;
  error?:       string;
}

export default function PainelWhatsApp() {
  const [status,      setStatus]      = useState<WhatsAppStatus | null>(null);
  const [loading,     setLoading]     = useState(true);
  const [actionBusy,  setActionBusy]  = useState(false);
  const [testPhone,   setTestPhone]   = useState('');
  const [testMsg,     setTestMsg]     = useState('Olá! Esta é uma mensagem de teste da Nefertari Cozinha Viva 🌿');
  const [testSending, setTestSending] = useState(false);
  const [testResult,  setTestResult]  = useState<{ ok?: boolean; error?: string } | null>(null);
  const [autoNotify,  setAutoNotify]  = useState(true);

  // Config modal
  const [configModal, setConfigModal] = useState(false);
  const [configForm,  setConfigForm]  = useState({ serverUrl: '', apiKey: '', instanceName: '' });

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/whatsapp/status');
      const data = await res.json() as WhatsAppStatus;
      setStatus(data);
      setAutoNotify(data.autoNotify ?? true);
      setConfigForm({
        serverUrl:    data.serverUrl || 'https://evo.clubemkt.digital',
        apiKey:       'caixapretastack2626',
        instanceName: data.instanceName || 'nefertari',
      });
    } catch {
      setStatus(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    const timer = setInterval(() => {
      // Auto-poll QR code if connecting
      fetchStatus();
    }, 8000);
    return () => clearInterval(timer);
  }, [fetchStatus]);

  async function handleConnect() {
    setActionBusy(true);
    try {
      await fetch('/api/whatsapp/connect', { method: 'POST' });
      await fetchStatus();
    } finally {
      setActionBusy(false);
    }
  }

  async function handleDisconnect() {
    if (!confirm('Deseja desconectar o WhatsApp da Nefertari?')) return;
    setActionBusy(true);
    try {
      await fetch('/api/whatsapp/disconnect', { method: 'POST' });
      await fetchStatus();
    } finally {
      setActionBusy(false);
    }
  }

  async function handleToggleAutoNotify() {
    const next = !autoNotify;
    setAutoNotify(next);
    await fetch('/api/whatsapp/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ autoNotify: next }),
    });
  }

  async function handleSendTest() {
    if (!testPhone.trim()) return;
    setTestSending(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: testPhone, text: testMsg }),
      });
      const data = await res.json() as { ok: boolean; error?: string };
      setTestResult(data);
    } catch (e) {
      setTestResult({ ok: false, error: 'Erro de conexão.' });
    } finally {
      setTestSending(false);
    }
  }

  async function handleSaveConfig() {
    setActionBusy(true);
    try {
      await fetch('/api/whatsapp/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(configForm),
      });
      setConfigModal(false);
      await fetchStatus();
    } finally {
      setActionBusy(false);
    }
  }

  const isConnected = status?.state === 'connected';
  const isConnecting = status?.state === 'connecting' || !!status?.qrcode;

  return (
    <div style={{ minHeight: '100dvh', background: G.bg, fontFamily: sans, color: G.text }}>
      <PainelHeader current="pedidos" title="WhatsApp & Automação" onRefresh={fetchStatus} />

      <div style={{ maxWidth: '820px', margin: '0 auto', padding: '2rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        
        {/* ── Status Card ── */}
        <div style={{
          background: G.card, borderRadius: '1.25rem', border: `1px solid ${G.border}`,
          padding: '1.75rem', position: 'relative', overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '50%',
                background: isConnected ? G.greenBg : 'rgba(255,255,255,0.05)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: `1px solid ${isConnected ? G.green : G.border}`,
              }}>
                <MessageCircle size={24} color={isConnected ? G.green : G.muted} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h2 style={{ fontFamily: serif, fontSize: '1.3rem', fontWeight: 700, margin: 0, color: G.text }}>
                    WhatsApp Nefertari
                  </h2>
                  <span style={{
                    fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.6rem', borderRadius: '99px',
                    textTransform: 'uppercase', letterSpacing: '0.1em',
                    background: isConnected ? G.greenBg : isConnecting ? 'rgba(200,148,26,0.15)' : 'rgba(248,113,113,0.15)',
                    color: isConnected ? G.green : isConnecting ? G.gold : '#f87171',
                    border: `1px solid ${isConnected ? G.green : isConnecting ? G.gold : '#f87171'}40`,
                  }}>
                    {isConnected ? '● Conectado' : isConnecting ? '● Aguardando QR Code' : '● Desconectado'}
                  </span>
                </div>
                <p style={{ color: G.muted, fontSize: '0.82rem', marginTop: '0.2rem' }}>
                  Instância: <strong>{status?.instanceName || 'nefertari'}</strong> {status?.number && `· ${status.number}`}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setConfigModal(true)}
                title="Configurações da API"
                style={{
                  background: 'rgba(255,255,255,0.05)', border: `1px solid ${G.border}`,
                  padding: '0.55rem 0.85rem', borderRadius: '0.65rem', color: G.text,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem',
                }}
              >
                <Settings size={14} /> Configuração
              </button>

              {isConnected ? (
                <button
                  type="button"
                  onClick={handleDisconnect}
                  disabled={actionBusy}
                  style={{
                    background: 'rgba(248,113,113,0.12)', border: '1px solid #f8717140',
                    color: '#f87171', padding: '0.55rem 1rem', borderRadius: '0.65rem',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 600,
                  }}
                >
                  <PowerOff size={14} /> Desconectar
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleConnect}
                  disabled={actionBusy}
                  style={{
                    background: G.gold, color: G.dark, border: 'none',
                    padding: '0.55rem 1.25rem', borderRadius: '0.65rem',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 700,
                  }}
                >
                  {actionBusy ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <QrCode size={14} />} Conectar WhatsApp
                </button>
              )}
            </div>
          </div>

          {/* ── QR Code View (if connecting / disconnected) ── */}
          {!isConnected && status?.qrcode && (
            <div style={{
              background: 'rgba(0,0,0,0.4)', borderRadius: '1rem', border: `1px solid ${G.border}`,
              padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
              textAlign: 'center', margin: '1rem 0',
            }}>
              <p style={{ fontFamily: serif, fontSize: '1.05rem', fontWeight: 600, color: G.gold }}>
                Escaneie o QR Code com seu WhatsApp
              </p>
              <div style={{
                background: '#FFFFFF', padding: '0.75rem', borderRadius: '0.75rem',
                display: 'inline-block', boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={status.qrcode.startsWith('data:') ? status.qrcode : `data:image/png;base64,${status.qrcode}`}
                  alt="QR Code WhatsApp"
                  style={{ width: '220px', height: '220px', display: 'block' }}
                />
              </div>
              <p style={{ color: G.muted, fontSize: '0.8rem', maxWidth: '380px' }}>
                Abra o WhatsApp no celular $\rightarrow$ Aparelhos conectados $\rightarrow$ Conectar um aparelho e aponte para a tela.
              </p>
            </div>
          )}

          {/* ── Anti-Spam & Brand Intelligence Badge ── */}
          <div style={{
            background: 'rgba(200,148,26,0.06)', borderRadius: '0.85rem', border: `1px solid ${G.border}`,
            padding: '1rem 1.25rem', display: 'flex', alignItems: 'flex-start', gap: '0.85rem',
          }}>
            <ShieldCheck size={20} color={G.gold} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.82rem', lineHeight: 1.6 }}>
              <p style={{ fontWeight: 700, color: G.gold, margin: '0 0 0.2rem' }}>
                Proteção Anti-Spam & Tom de Voz Nobre
              </p>
              <p style={{ color: G.muted, margin: 0 }}>
                Cada mensagem de notificação (recebido, preparo, pronto, entrega) é redigida dinamicamente no momento do envio, com saudações, termos e assinaturas variados. Isso evita padrões repetitivos da Meta e preserva a integridade do número.
              </p>
            </div>
          </div>
        </div>

        {/* ── Automation Trigger Controls ── */}
        <div style={{ background: G.card, borderRadius: '1.25rem', border: `1px solid ${G.border}`, padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontFamily: serif, fontSize: '1.1rem', fontWeight: 700, margin: 0, color: G.text }}>
                Automação de Pedidos
              </h3>
              <p style={{ color: G.muted, fontSize: '0.8rem', marginTop: '0.2rem' }}>
                Dispara mensagens automáticas no WhatsApp do cliente a cada atualização de status.
              </p>
            </div>
            <button
              type="button"
              onClick={handleToggleAutoNotify}
              style={{
                padding: '0.6rem 1.25rem', borderRadius: '99px', cursor: 'pointer',
                fontFamily: sans, fontSize: '0.82rem', fontWeight: 700,
                background: autoNotify ? G.greenBg : 'rgba(255,255,255,0.05)',
                color: autoNotify ? G.green : G.muted,
                border: `1px solid ${autoNotify ? G.green : G.border}`,
                transition: 'all 0.2s',
              }}
            >
              {autoNotify ? '✓ Automação Ativa' : '✕ Desativada'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginTop: '1rem' }}>
            {[
              { status: 'Recebido', desc: 'Confirmação + Itens + PIN de Acesso', icon: '🌿' },
              { status: 'Em preparo', desc: 'Aviso de início na cozinha viva', icon: '🔥' },
              { status: 'Pronto', desc: 'Saiu para entrega ou pronto para retirada', icon: '🛵' },
              { status: 'Entregue', desc: 'Agradecimento + Feedback + Selos', icon: '✨' },
            ].map(item => (
              <div key={item.status} style={{
                background: 'rgba(255,255,255,0.03)', borderRadius: '0.75rem', border: `1px solid ${G.border}`,
                padding: '0.85rem 1rem',
              }}>
                <p style={{ fontSize: '0.88rem', fontWeight: 700, color: G.text, margin: '0 0 0.2rem' }}>
                  {item.icon} {item.status}
                </p>
                <p style={{ fontSize: '0.72rem', color: G.muted, margin: 0, lineHeight: 1.4 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Direct Message Tester & Sender ── */}
        <div style={{ background: G.card, borderRadius: '1.25rem', border: `1px solid ${G.border}`, padding: '1.5rem' }}>
          <h3 style={{ fontFamily: serif, fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.3rem', color: G.text }}>
            Enviar Mensagem Direta
          </h3>
          <p style={{ color: G.muted, fontSize: '0.8rem', marginBottom: '1.25rem' }}>
            Envie mensagens personalizadas ou comunicados para qualquer cliente pelo número da Nefertari.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: G.muted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.35rem' }}>
                Número WhatsApp (com DDD)
              </label>
              <input
                type="text"
                placeholder="(73) 99999-9999"
                value={testPhone}
                onChange={e => setTestPhone(e.target.value)}
                style={{
                  width: '100%', padding: '0.75rem 1rem', borderRadius: '0.65rem', boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.05)', border: `1px solid ${G.border}`, color: G.text, outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: G.muted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.35rem' }}>
                Mensagem
              </label>
              <textarea
                rows={3}
                value={testMsg}
                onChange={e => setTestMsg(e.target.value)}
                style={{
                  width: '100%', padding: '0.75rem 1rem', borderRadius: '0.65rem', boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.05)', border: `1px solid ${G.border}`, color: G.text, outline: 'none', resize: 'vertical',
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
              {testResult && (
                <div style={{ fontSize: '0.8rem', color: testResult.ok ? G.green : '#f87171', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  {testResult.ok ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
                  {testResult.ok ? 'Mensagem enviada com sucesso!' : `Falha no envio: ${testResult.error || 'Verifique se o WhatsApp está conectado'}`}
                </div>
              )}

              <button
                type="button"
                onClick={handleSendTest}
                disabled={testSending || !testPhone.trim()}
                style={{
                  marginLeft: 'auto', padding: '0.75rem 1.75rem', borderRadius: '99px',
                  background: G.gold, color: G.dark, border: 'none', fontWeight: 700, fontSize: '0.88rem',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: sans,
                }}
              >
                {testSending ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={15} />}
                Enviar Agora
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* ── Config Modal ── */}
      {configModal && (
        <>
          <div onClick={() => setConfigModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 90 }} />
          <div style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            width: 'min(420px, calc(100vw - 2rem))', background: G.card, borderRadius: '1.5rem',
            border: `1px solid ${G.border}`, zIndex: 91, padding: '1.75rem',
            boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
          }}>
            <h3 style={{ fontFamily: serif, fontSize: '1.2rem', fontWeight: 700, margin: '0 0 1rem', color: G.text }}>
              Configuração WhatsApp API
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: G.muted, textTransform: 'uppercase', marginBottom: '0.3rem' }}>Servidor URL</label>
                <input
                  type="text"
                  value={configForm.serverUrl}
                  onChange={e => setConfigForm(p => ({ ...p, serverUrl: e.target.value }))}
                  style={{ width: '100%', padding: '0.7rem 0.9rem', borderRadius: '0.65rem', background: 'rgba(255,255,255,0.05)', border: `1px solid ${G.border}`, color: G.text }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: G.muted, textTransform: 'uppercase', marginBottom: '0.3rem' }}>API Key</label>
                <input
                  type="password"
                  value={configForm.apiKey}
                  onChange={e => setConfigForm(p => ({ ...p, apiKey: e.target.value }))}
                  style={{ width: '100%', padding: '0.7rem 0.9rem', borderRadius: '0.65rem', background: 'rgba(255,255,255,0.05)', border: `1px solid ${G.border}`, color: G.text }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: G.muted, textTransform: 'uppercase', marginBottom: '0.3rem' }}>Nome da Instância</label>
                <input
                  type="text"
                  value={configForm.instanceName}
                  onChange={e => setConfigForm(p => ({ ...p, instanceName: e.target.value }))}
                  style={{ width: '100%', padding: '0.7rem 0.9rem', borderRadius: '0.65rem', background: 'rgba(255,255,255,0.05)', border: `1px solid ${G.border}`, color: G.text }}
                />
              </div>

              <button
                type="button"
                onClick={handleSaveConfig}
                disabled={actionBusy}
                style={{
                  marginTop: '0.75rem', padding: '0.8rem', borderRadius: '99px',
                  background: G.gold, color: G.dark, border: 'none', fontWeight: 700, cursor: 'pointer',
                }}
              >
                Salvar Configurações
              </button>
            </div>
          </div>
        </>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
