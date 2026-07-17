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
  'new-years': 'Ano Novo / Réveillon',
  wedding: 'Casamento / Noivado',
  graduation: 'Formatura',
  'family-lunch': 'Almoço em Família',
  'office-party': 'Confraternização de Trabalho',
  rooftop: 'Sunset / Terraço',
  'game-night': 'Noite de Jogos',
  picnic: 'Piquenique',
  halloween: 'Halloween',
  'secret-santa': 'Amigo Secreto',
}

export function moodLabel(mood: Mood): string {
  return MOOD_LABELS[mood] ?? mood
}

/** Resolves the public banner image for a mood, e.g. 'classic-barbecue' -> '/moods/mood_classic_barbecue.png'. */
export function moodImage(mood: Mood): string {
  return `/moods/mood_${mood.replaceAll('-', '_')}.png`
}

/** Quick-filter tags used to narrow the mood picker once the list grows long. */
export type MoodFilterTag =
  | 'carne-nobre'
  | 'bebidas'
  | 'infantil'
  | 'corporativo'
  | 'ao-ar-livre'
  | 'intimista'
  | 'doce'
  | 'formal'
  | 'sazonal'
  | 'economico'

export const MOOD_FILTER_LABELS: Record<MoodFilterTag, string> = {
  'carne-nobre': 'Carne nobre',
  bebidas: 'Bebidas',
  infantil: 'Infantil',
  corporativo: 'Corporativo',
  'ao-ar-livre': 'Ao ar livre',
  intimista: 'Intimista',
  doce: 'Doce',
  formal: 'Formal',
  sazonal: 'Sazonal',
  economico: 'Econômico',
}

export const MOOD_FILTER_TAGS: Record<Mood, MoodFilterTag[]> = {
  'classic-barbecue': ['carne-nobre', 'ao-ar-livre'],
  birthday: ['doce', 'infantil'],
  intimate: ['intimista', 'formal'],
  'large-event': ['carne-nobre'],
  'casual-burger': ['economico'],
  'happy-hour': ['bebidas'],
  'kids-party': ['infantil', 'doce'],
  brunch: ['intimista'],
  'pool-party': ['bebidas', 'ao-ar-livre'],
  'baby-shower': ['doce', 'intimista'],
  'new-years': ['bebidas', 'formal', 'sazonal'],
  wedding: ['formal', 'carne-nobre'],
  graduation: ['bebidas', 'formal'],
  'family-lunch': ['intimista'],
  'office-party': ['corporativo', 'bebidas'],
  rooftop: ['bebidas', 'ao-ar-livre', 'formal'],
  'game-night': ['economico', 'intimista'],
  picnic: ['ao-ar-livre', 'economico'],
  halloween: ['doce', 'infantil', 'sazonal'],
  'secret-santa': ['corporativo', 'sazonal'],
}
