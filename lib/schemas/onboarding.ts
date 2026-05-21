import { z } from 'zod';

const req = (label: string) => z.string().min(1, `${label} é obrigatório`);

export const onboardingSchema = z.object({
  essencia:     req('A alma da marca'),
  valores:      req('Valores inegociáveis'),
  transformacao: req('Conceito central'),
  publico:      req('Cliente ideal'),
  dores:        req('Dores do mercado'),
  concorrencia: req('Concorrência / parcerias'),
  estetica:     req('Estética (likes)'),
  detesta:      req('O que detesta (dislikes)'),
  cardapio:     z.string(),
  estrategia:   z.string(),
  operacao:     z.string(),
});

export type OnboardingValues = z.infer<typeof onboardingSchema>;

