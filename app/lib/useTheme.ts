'use client';
import { useState, useEffect } from 'react';

export interface ThemeTokens {
  bg:       string; bg2:     string; card:   string;
  text:     string; muted:   string; dim:    string;
  gold:     string; goldSoft:string;
  green:    string; terra:   string;
  border:   string; borderStrong: string;
  logo:     string;
  inputBg:  string;
}

export const DARK: ThemeTokens = {
  bg:          '#14100C',
  bg2:         '#1E1509',
  card:        '#1A1208',
  text:        '#E8D9BA',
  muted:       '#7A6A54',
  dim:         '#4A3E32',
  gold:        '#C8941A',
  goldSoft:    '#E6B84A',
  green:       '#6B8C3E',
  terra:       '#8B4030',
  border:      'rgba(200,148,26,0.18)',
  borderStrong:'rgba(200,148,26,0.35)',
  logo:        '/nefertari-logo-golden.png',
  inputBg:     'rgba(255,255,255,0.05)',
};

export const LIGHT: ThemeTokens = {
  bg:          '#FAF5E8',
  bg2:         '#F5E6C8',
  card:        '#FFFFFF',
  text:        '#14100C',
  muted:       '#6B5040',
  dim:         '#C4B09A',
  gold:        '#C8941A',
  goldSoft:    '#E6B84A',
  green:       '#6B8C3E',
  terra:       '#8B4030',
  border:      '#E8D9BA',
  borderStrong:'#D4B896',
  logo:        '/nefertari-logo-golden.png',
  inputBg:     '#FFFFFF',
};

export function useTheme() {
  const [dark, setDark] = useState(false); // light by default

  useEffect(() => {
    try {
      const stored = localStorage.getItem('nef-theme');
      if (stored === 'dark') setDark(true);
    } catch { /* SSR / no localStorage */ }
  }, []);

  function toggle() {
    setDark(prev => {
      const next = !prev;
      try { localStorage.setItem('nef-theme', next ? 'dark' : 'light'); } catch {}
      return next;
    });
  }

  return { dark, T: dark ? DARK : LIGHT, toggle };
}
