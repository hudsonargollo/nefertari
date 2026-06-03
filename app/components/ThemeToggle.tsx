'use client';
import { Sun, Moon } from 'lucide-react';

interface Props {
  dark: boolean;
  onToggle: () => void;
  position?: 'fixed' | 'static';
}

export default function ThemeToggle({ dark, onToggle, position = 'fixed' }: Props) {
  return (
    <button
      onClick={onToggle}
      title={dark ? 'Modo claro' : 'Modo escuro'}
      style={{
        position: position === 'fixed' ? 'fixed' : 'static',
        top: position === 'fixed' ? '0.9rem' : undefined,
        right: position === 'fixed' ? '1rem' : undefined,
        zIndex: position === 'fixed' ? 100 : undefined,
        width: '2.1rem', height: '2.1rem', borderRadius: '50%',
        background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
        border: `1px solid ${dark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.1)'}`,
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(8px)',
        transition: 'all 0.2s',
        flexShrink: 0,
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLButtonElement).style.background =
          dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.background =
          dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
      }}
    >
      {dark
        ? <Sun  size={13} color="#E6B84A" />
        : <Moon size={13} color="#8B4030" />}
    </button>
  );
}
