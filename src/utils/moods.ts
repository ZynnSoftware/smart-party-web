import type { Mood } from '@/types/domain'

export const MOOD_LABELS: Record<Mood, string> = {
  'classic-barbecue': 'Churrasco Clássico',
  birthday: 'Festa de Aniversário',
  intimate: 'Reunião Íntima',
  'large-event': 'Grande Evento',
  'casual-burger': 'Noite do Hambúrguer / Pizza',
  'happy-hour': 'Happy Hour / Boteco',
  'kids-party': 'Festa Infantil',
  brunch: 'Brunch / Café da Manhã',
  'pool-party': 'Pool Party',
  'baby-shower': 'Chá de Bebê / Revelação',
}

export function moodLabel(mood: Mood): string {
  return MOOD_LABELS[mood] ?? mood
}

/** Resolves the public banner image for a mood, e.g. 'classic-barbecue' -> '/moods/mood_classic_barbecue.png'. */
export function moodImage(mood: Mood): string {
  return `/moods/mood_${mood.replaceAll('-', '_')}.png`
}
