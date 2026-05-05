import menuData from '@/data/menu.json';

export type Message = { role: 'user' | 'assistant' | 'system'; content: string };
type Lang = 'fr' | 'en' | 'ar';

const OPENROUTER_BASE = 'https://openrouter.ai/api/v1';
export const API_KEY: string = (import.meta as any).env?.VITE_OPENROUTER_API_KEY || '';

// openrouter/free automatically picks whichever free model is available.
const RETIRED_MODELS = ['mistral-7b', 'llama-3.1-8b'];
const ENV_MODEL: string | undefined = (import.meta as any).env?.VITE_OPENROUTER_MODEL;
const isRetired = (model: string) => RETIRED_MODELS.some((retired) => model.includes(retired));
export const MODEL = ENV_MODEL && !isRetired(ENV_MODEL) ? ENV_MODEL : 'openrouter/free';

const LANGUAGE_RULES: Record<Lang, string> = {
  fr: 'Répondez uniquement en français. N’utilisez ni anglais ni arabe.',
  en: 'Answer only in English. Do not use French or Arabic.',
  ar: 'أجب باللغة العربية فقط. لا تستخدم الفرنسية أو الإنجليزية.',
};

const BREVITY_RULES: Record<Lang, string> = {
  fr: 'Répondez en 1 à 2 phrases courtes, 30 mots maximum, sauf demande explicite de détail.',
  en: 'Reply in 1-2 short sentences, maximum 30 words, unless the user explicitly asks for details.',
  ar: 'أجب بجملة إلى جملتين قصيرتين، بحد أقصى 30 كلمة، إلا إذا طلب المستخدم التفاصيل صراحةً.',
};

export function buildMenuContext(): string {
  const sections = (menuData.menu as any[]).map((section: any) => {
    const items = (section.items as any[])
      .map((item: any) => {
        const nameFr = item.name_fr || '';
        const nameEn = item.name_en || '';
        const descFr = item.description_fr || item.details_fr || '';
        const price = item.price ? ` [${item.price}]` : '';
        const type = item.type_fr ? ` (${item.type_fr})` : '';
        return `  • ${nameFr} / ${nameEn}${type}${price}${descFr ? `: ${descFr}` : ''}`;
      })
      .join('\n');

    return `## ${section.name_fr} / ${section.name_en}\n${items}`;
  });

  return sections.join('\n\n');
}

function buildSystemPrompt(lang: Lang): string {
  const menuText = buildMenuContext();
  const restaurantInfo = `
Restaurant: The Wise Restaurant
Horaires / Hours / المواقيت: Tous les jours / Every day / كل يوم - 12h00 à 23h00

Emplacements / Locations / المواقع:
  1. Bardo Tunis
     Adresse: AV HABIB BOURGUIBA (RUE DES ORANGES) 2000, BARDO TUNIS
     Téléphone / Phone: 52 555 414
     Facebook: https://www.facebook.com/profile.php?id=100083865516162

  2. Teboulba
     Adresse: RUE HABIB BOURGUIBA - TEBOULBA
     Téléphone / Phone: 93 560 560
     Instagram: https://www.instagram.com/the.wise_teboulba/

  3. Ksar Hellal Monastir
     Adresse: AV HAJ ALI SOUA KSAR HELLAL - MONASTIR
     Téléphone / Phone: 52 555 400
     Facebook: https://www.facebook.com/profile.php?id=100058908593379
`.trim();

  return `You are Wiser AI, the restaurant assistant for The Wise.
${LANGUAGE_RULES[lang]}
${BREVITY_RULES[lang]}

${restaurantInfo}

Full menu:
${menuText}

Rules:
- Respect dietary constraints strictly (no cheese/dairy/egg/pork/seafood/gluten). Suggest only compliant menu items.
- If no item matches, clearly say so and offer the closest safe alternative.
- When a budget is given, keep the total at or under that budget.
- Never invent dishes, ingredients, prices, opening times, or addresses.
- For reservations or special requests, tell the customer to call the restaurant.`;
}

function normalizeReply(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function shortenReply(text: string, maxWords = 32, maxChars = 220): string {
  if (!text) return '';

  let result = text;
  const sentences = result
    .match(/[^.!?؟]+[.!?؟]?/g)
    ?.map((sentence) => sentence.trim())
    .filter(Boolean) ?? [];

  if (sentences.length > 2) {
    result = sentences.slice(0, 2).join(' ');
  }

  const words = result.split(/\s+/).filter(Boolean);
  if (words.length > maxWords) {
    result = `${words.slice(0, maxWords).join(' ')}…`;
  }

  if (result.length > maxChars) {
    result = `${result.slice(0, maxChars).trimEnd()}…`;
  }

  return result;
}

const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 12 * 60 * 60 * 1000;

interface RateState {
  count: number;
  windowStart: number;
}

function getRateState(): RateState {
  try {
    const raw = localStorage.getItem('wr_rate');
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore storage errors
  }

  return { count: 0, windowStart: Date.now() };
}

function saveRateState(state: RateState) {
  localStorage.setItem('wr_rate', JSON.stringify(state));
}

export function getRateInfo() {
  let state = getRateState();
  const now = Date.now();

  if (now - state.windowStart > RATE_WINDOW_MS) {
    state = { count: 0, windowStart: now };
    saveRateState(state);
  }

  const remaining = Math.max(0, RATE_LIMIT - state.count);
  const resetAt = state.windowStart + RATE_WINDOW_MS;

  return { remaining, resetAt, limit: RATE_LIMIT };
}

export async function askWiserAI(messages: Message[], lang: Lang = 'fr'): Promise<string> {
  if (!API_KEY) {
    throw Object.assign(new Error('no_key'), { code: 'no_key' });
  }

  let state = getRateState();
  const now = Date.now();

  if (now - state.windowStart > RATE_WINDOW_MS) {
    state = { count: 0, windowStart: now };
  }

  if (state.count >= RATE_LIMIT) {
    throw Object.assign(new Error('limit_reached'), {
      code: 'limit_reached',
      resetAt: state.windowStart + RATE_WINDOW_MS,
    });
  }

  const systemMessage: Message = {
    role: 'system',
    content: buildSystemPrompt(lang),
  };

  const res = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'The Wise Restaurant - Wiser AI',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [systemMessage, ...messages],
      max_tokens: 110,
      temperature: 0.45,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenRouter error ${res.status}: ${text}`);
  }

  const data = await res.json();
  const rawReply = String(data.choices?.[0]?.message?.content || '');
  const reply = shortenReply(normalizeReply(rawReply));

  state.count += 1;
  saveRateState(state);

  return reply;
}
