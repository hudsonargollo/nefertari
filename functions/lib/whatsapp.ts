// WhatsApp integration helper for Nefertari via Evolution API / Uazapi

export interface WhatsAppConfig {
  serverUrl:    string;
  apiKey:       string;
  instanceName: string;
  autoNotify:   boolean;
}

export const DEFAULT_CONFIG: WhatsAppConfig = {
  serverUrl:    'https://evo.clubemkt.digital',
  apiKey:       'caixapretastack2626',
  instanceName: 'nefertari',
  autoNotify:   true,
};

const CONFIG_KEY = 'whatsapp:config';

export async function getWhatsAppConfig(env: { NEFERTARI_KV: KVNamespace }): Promise<WhatsAppConfig> {
  const stored = await env.NEFERTARI_KV.get(CONFIG_KEY, { type: 'json' }) as WhatsAppConfig | null;
  return { ...DEFAULT_CONFIG, ...(stored ?? {}) };
}

export async function saveWhatsAppConfig(env: { NEFERTARI_KV: KVNamespace }, config: Partial<WhatsAppConfig>): Promise<void> {
  const current = await getWhatsAppConfig(env);
  const next = { ...current, ...config };
  await env.NEFERTARI_KV.put(CONFIG_KEY, JSON.stringify(next));
}

export function cleanPhoneNumber(phone: string): string {
  let cleaned = phone.replace(/\D/g, '');
  if (!cleaned.startsWith('55') && cleaned.length >= 10 && cleaned.length <= 11) {
    cleaned = '55' + cleaned;
  }
  return cleaned;
}

// ─── Dynamic Anti-Spam Brand Message Generator ───────────────────────────────
// Generates nuanced, varied copy on the spot to avoid Meta spam detection
export function generateBrandMessage(params: {
  status: 'received' | 'preparing' | 'ready' | 'delivered' | 'cancelled' | 'pin';
  customerName: string;
  orderId?: string;
  pin?: string;
  total?: number;
  type?: 'pickup' | 'delivery';
  items?: Array<{ name: string; qty: number }>;
}): string {
  const name = params.customerName.trim().split(' ')[0] || 'Cliente';
  const idStr = params.orderId ? `#${params.orderId.toUpperCase()}` : '';
  const isDelivery = params.type === 'delivery';

  const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

  const greetings = [
    `Olá, ${name}! 🌿 Aqui é a Jéssica da Nefertari.`,
    `${name}, que alegria ter seu pedido em nossa cozinha viva! ✨`,
    `Oi, ${name}! Passando para confirmar seu momento Nefertari ◈`,
    `Saudações, ${name}! Aqui é a Jéssica Souza da Nefertari Cozinha Viva 🌿`,
    `${name}, nosso ritual de alimentar o corpo com comida de verdade começou! ✨`,
  ];

  const signatures = [
    `Com muito carinho e intenção,\nJéssica Souza · Nefertari Cozinha Viva 🌿`,
    `Nutrição, ancestralidade e sabor real,\nEquipe Nefertari Cozinha Viva ✨`,
    `Feito à mão para você,\nNefertari · Jequié, BA ◈`,
    `Agradecemos pela confiança em nosso propósito,\nJéssica · Nefertari 🌿`,
  ];

  const trackLink = params.orderId
    ? `\n\n📱 Acompanhe seu pedido em tempo real:\nhttps://nefertari.clubemkt.digital/pedido?id=${params.orderId}`
    : '';

  const pinInfo = params.pin
    ? `\n🔑 Seu PIN de Acesso exclusivo: *${params.pin}* (use para acompanhar seus pedidos e acumular selos de fidelidade)`
    : '';

  let body = '';

  switch (params.status) {
    case 'received': {
      const itemsList = params.items?.length
        ? `\n\n*Itens do pedido:*\n` + params.items.map(i => `• ${i.qty}x ${i.name}`).join('\n')
        : '';
      const totalStr = params.total ? `\n*Total:* R$ ${params.total.toFixed(2).replace('.', ',')}` : '';

      const receivedBodies = [
        `Recebemos seu pedido ${idStr} com sucesso! Tudo está sendo preparado do zero, com ingredientes reconhecíveis e receitas pensadas para nutrir de verdade.`,
        `Seu pedido ${idStr} já foi registrado na nossa cozinha! Não usamos ultraprocessados nem estoque pré-pronto: cada camada do seu lanche é feita na hora.`,
        `Confirmamos a entrada do pedido ${idStr}! Estamos organizando os ingredientes frescos da nossa horta e parceiros locais para iniciar o preparo.`,
      ];
      body = `${pick(receivedBodies)}${itemsList}${totalStr}${pinInfo}${trackLink}`;
      break;
    }

    case 'preparing': {
      const prepBodies = [
        `Seu pedido ${idStr} acabou de entrar em preparo! Pães artesanais, blends frescos e molhos da casa estão sendo trabalhados agora.`,
        `Fogo aceso e mãos à obra! O pedido ${idStr} está sendo montado com todo o cuidado e equilíbrio de sabores.`,
        `A magia tá acontecendo na cozinha! Seu pedido ${idStr} está em processo de preparo artesanal. Em breve estará pronto!`,
      ];
      body = `${pick(prepBodies)}${trackLink}`;
      break;
    }

    case 'ready': {
      const dispatchNote = isDelivery
        ? 'Nosso entregador já está a postos e saindo para levar o alimento quentinho até o seu endereço.'
        : 'Seu pacote já está pronto para retirada em nosso balcão quando desejar!';

      const readyBodies = [
        `Boas notícias! Seu pedido ${idStr} acabou de ficar pronto com um aroma espetacular. ${dispatchNote}`,
        `Tudo pronto por aqui! O pedido ${idStr} foi finalizado e embalado com todo o respeito ao seu paladar. ${dispatchNote}`,
        `Prontinho! Seu momento gastronômico ${idStr} está pronto. ${dispatchNote}`,
      ];
      body = `${pick(readyBodies)}${trackLink}`;
      break;
    }

    case 'delivered': {
      const delivBodies = [
        `Esperamos que cada mordida do seu pedido ${idStr} seja uma experiência inesquecível! Bom apetite e obrigado por valorizar a comida de verdade.`,
        `Pedido ${idStr} entregue! Que sua refeição seja um momento de nutrição, prazer e desaceleração do dia.`,
        `Foi uma honra cozinhar para você hoje! Esperamos que sinta todo o carinho que colocamos em cada camada. Até o próximo ritual! 🌿`,
      ];
      body = `${pick(delivBodies)}\n\n⭐ Conte para a gente o que achou respondendo esta mensagem ou marcando @nefertaricozinhaviva no Instagram!`;
      break;
    }

    case 'cancelled': {
      body = `Informamos que o pedido ${idStr} foi cancelado. Se tiver qualquer dúvida ou desejar realizar um novo pedido, estamos à disposição aqui pelo WhatsApp.`;
      break;
    }

    case 'pin': {
      body = `Passando para te enviar seu PIN de acesso exclusivo da Nefertari: *${params.pin}*.\nCom ele você pode acompanhar seus pedidos em tempo real e consultar seus Selos Sagrados de Fidelidade no nosso site!${trackLink}`;
      break;
    }
  }

  return `${pick(greetings)}\n\n${body}\n\n${pick(signatures)}`;
}

// ─── Dispatch message via Evolution / Uazapi ─────────────────────────────────
export async function sendWhatsAppMessage(
  env: { NEFERTARI_KV: KVNamespace },
  phone: string,
  text: string
): Promise<{ ok: boolean; response?: unknown; error?: string }> {
  try {
    const config = await getWhatsAppConfig(env);
    if (!config.serverUrl || !config.apiKey || !config.instanceName) {
      return { ok: false, error: 'Configuração do WhatsApp incompleta.' };
    }

    const cleaned = cleanPhoneNumber(phone);
    const endpoint = `${config.serverUrl.replace(/\/$/, '')}/message/sendText/${config.instanceName}`;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': config.apiKey,
      },
      body: JSON.stringify({
        number: cleaned,
        text,
      }),
    });

    const data = await res.json();
    return { ok: res.ok, response: data };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, error: msg };
  }
}
