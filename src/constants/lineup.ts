import { stages, allArtists, type Artist } from '../data/lineup'

export type { Artist }

export const stageConfig = [
  {
    accent: 'from-coral/20 to-transparent',
    border: 'border-coral/30',
    tag: 'bg-coral text-white',
    watermark: 'A',
    color: 'text-coral',
    bgActive: 'bg-coral text-white border-coral',
    bgInactive: 'bg-transparent text-coral border-coral/40 hover:bg-coral/10',
  },
  {
    accent: 'from-violeta/20 to-transparent',
    border: 'border-violeta/30',
    tag: 'bg-violeta text-white',
    watermark: 'B',
    color: 'text-violeta',
    bgActive: 'bg-violeta text-white border-violeta',
    bgInactive: 'bg-transparent text-violeta border-violeta/40 hover:bg-violeta/10',
  },
  {
    accent: 'from-coral/15 to-transparent',
    border: 'border-coral/25',
    tag: 'bg-coral text-white',
    watermark: 'C',
    color: 'text-coral',
    bgActive: 'bg-coral text-white border-coral',
    bgInactive: 'bg-transparent text-coral border-coral/40 hover:bg-coral/10',
  },
]

export const previewArtists = [
  { time: '21:00', stage: stages[2].name, artist: stages[2].artists[0] },
  { time: '22:30', stage: stages[0].name, artist: stages[0].artists[1] },
  { time: '00:00', stage: stages[2].name, artist: stages[2].artists[2] },
  { time: '01:30', stage: stages[2].name, artist: stages[2].artists[3] },
  { time: '03:00', stage: stages[0].name, artist: stages[0].artists[4] },
]

export const genreColors: Record<string, string> = {
  'Electrónica': 'bg-violeta text-white border-violeta',
  'Indie Pop': 'bg-arena text-black border-piedra',
  'Flamenco & Fusión': 'bg-coral text-white border-coral',
  'Rock': 'bg-violeta text-white border-violeta',
  'Punk & Garage': 'bg-coral text-white border-coral',
  'Folk & Cantautor': 'bg-violeta/80 text-white border-violeta',
  'Shoegaze & Dream': 'bg-violeta text-white border-violeta',
  'World & Fusión': 'bg-coral/80 text-white border-coral',
  'Hip Hop & Rap': 'bg-violeta text-white border-carbón',
  'Metal & Stoner': 'bg-violeta text-white border-violeta',
}

export const stageColors: Record<string, string> = {
  'Escenario A': '#e85d6f',
  'Escenario B': '#3a1a4a',
  'Escenario C': '#7c3a9a',
}

export const rotateSet = ['1deg', '-2deg', '1.5deg', '-1deg', '2.5deg', '-1.5deg', '0.5deg', '-0.5deg', '2deg', '-2.5deg', '1deg', '-1.5deg', '2deg', '-1deg', '0.8deg', '-1.8deg', '3deg', '-0.8deg', '1.2deg', '-2.2deg', '0.3deg', '-1.2deg', '2.8deg', '-0.3deg']
export const offsetSet = ['mt-0', '-mt-4 sm:-mt-8', 'mt-2', '-mt-2 sm:-mt-4', 'mt-4 sm:mt-6', '-mt-1', 'mt-3 sm:mt-5', '-mt-3 sm:-mt-6', 'mt-1', 'mt-0', '-mt-2', 'mt-4 sm:mt-8', '-mt-1', 'mt-2 sm:mt-4', 'mt-5 sm:mt-7', '-mt-5 sm:-mt-7', 'mt-0', 'mt-3', '-mt-3', 'mt-4 sm:mt-5', '-mt-1 sm:-mt-2', 'mt-2', 'mt-6 sm:mt-9', '-mt-2 sm:-mt-5']
export const aspectSet = ['3/4', '2/3', '3/5', '4/5', '3/4', '2/3', '3/4', '4/5', '3/4', '2/3', '3/5', '3/4', '4/5', '2/3', '3/4', '3/5', '3/4', '2/3', '3/4', '4/5', '3/4', '3/5', '2/3', '3/4']

export function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length]
}

export { stages, allArtists }
export const allGenres = [...new Set(allArtists.map((a) => a.genre))].sort()
