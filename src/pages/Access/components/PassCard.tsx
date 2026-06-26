import { SolidBox, SolidDot, SolidLine, SolidTri } from '../../../components/Solids'

interface Props {
  passPhoto: string | null
  passNumber: string
  passName: string
  loading?: boolean
}

export default function PassCard({ passPhoto, passNumber, passName, loading }: Props) {
  if (loading) {
    return (
      <div className="relative overflow-hidden border-[3px] border-violeta/20"
           style={{ clipPath: 'polygon(0 0, 100% 0, 97% 100%, 3% 100%)' }}>
        <div className="aspect-9/16 relative bg-arena/50 flex items-center justify-center">
          <span className="font-mono text-violeta/30 text-[10px] tracking-[0.4em] uppercase animate-pulse">Cargando...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden border-[3px] border-violeta"
         style={{ clipPath: 'polygon(0 0, 100% 0, 97% 100%, 3% 100%)' }}>
      <div className="aspect-9/16 relative bg-violeta/95">

        <div className="absolute inset-0 z-10"
             style={{ clipPath: 'polygon(55% 0, 100% 0, 100% 100%, 35% 100%, 48% 72%, 42% 28%)', backgroundColor: '#e85d6f' }} />
        <div className="absolute inset-0 z-10"
             style={{ clipPath: 'polygon(0 55%, 28% 50%, 35% 82%, 0 90%)', backgroundColor: '#3a1a4a' }} />
        <div className="absolute inset-0 z-10"
             style={{ clipPath: 'polygon(58% 88%, 100% 78%, 100% 100%, 38% 100%)', backgroundColor: '#D4A373' }} />

        <SolidDot className="w-6 h-6 left-[48%] top-[3%] z-30" style={{ backgroundColor: '#D4A373' }} />
        <SolidBox className="w-8 h-8 right-[12%] top-[35%] z-30 rotate-25" style={{ backgroundColor: '#3a1a4a' }} />
        <div className="absolute w-14 h-14 rounded-full border-[3px] left-[55%] bottom-[38%] z-30" style={{ borderColor: '#D4A373' }} />
        <SolidLine className="w-24 h-0.75 left-[42%] top-[14%] z-30 -rotate-6" style={{ backgroundColor: '#e85d6f' }} />
        <SolidLine className="w-16 h-0.5 left-[8%] top-[22%] z-30 rotate-12" style={{ backgroundColor: '#D4A373' }} />
        <SolidLine className="w-20 h-0.5 right-[4%] top-[52%] z-30 -rotate-[20deg]" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }} />
        <SolidTri className="w-10 h-10 left-[10%] bottom-[30%] z-30 rotate-30" style={{ backgroundColor: '#e85d6f' }} />
        <SolidTri className="w-6 h-6 left-[5%] top-[6%] z-30 rotate-[60deg]" style={{ backgroundColor: 'rgba(212,163,115,0.4)' }} />
        <SolidDot className="w-5 h-5 left-[38%] bottom-[12%] z-30" style={{ backgroundColor: '#D4A373' }} />
        <SolidDot className="w-3 h-3 left-[15%] top-[45%] z-30" style={{ backgroundColor: 'rgba(232,93,111,0.3)' }} />
        <SolidBox className="w-7 h-7 right-[6%] bottom-[18%] z-30 rotate-[-15deg]" style={{ backgroundColor: '#e85d6f' }} />
        <SolidBox className="w-4 h-4 left-[28%] top-[30%] z-30 rotate-[40deg]" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
        <SolidLine className="w-32 h-0.75 left-[20%] top-[68%] z-30 rotate-2" style={{ backgroundColor: '#3a1a4a' }} />
        <div className="absolute left-[50%] top-[22%] z-30 w-1 h-1 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
        <div className="absolute left-[52%] top-[24%] z-30 w-0.5 h-0.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }} />
        <div className="absolute left-[14%] top-[52%] z-30 w-[30%] h-px opacity-20" style={{ background: 'linear-gradient(90deg, transparent, #e85d6f, transparent)' }} />

        <div className="absolute inset-0 z-15 flex items-center justify-center pointer-events-none select-none -rotate-12 scale-125">
          <div className="leading-[0.5] text-center">
            <span className="font-heading text-[clamp(7rem,24vw,16rem)] font-black tracking-[-0.15em] block text-white/70"
                  style={{ textShadow: '5px 5px 0 #e85d6f, 8px 8px 0 rgba(0,0,0,0.25)' }}>
              Vett
            </span>
            <span className="font-heading text-[clamp(5rem,18vw,12rem)] font-black tracking-[-0.15em] block -mt-1 text-white/70"
                  style={{ textShadow: '5px 5px 0 #e85d6f, 8px 8px 0 rgba(0,0,0,0.25)' }}>
              on<span className="text-[#e85d6f]">i</span>a
            </span>
          </div>
        </div>

        <div className="absolute z-20"
             style={{ top: '6%', right: '8%', width: '38%', aspectRatio: '3/4' }}>
          <div className="w-full h-full overflow-hidden border-2 border-white/30 shadow-lg"
               style={{ clipPath: 'polygon(5% 0, 100% 0, 95% 100%, 0 100%)' }}>
            <img
              src={passPhoto || 'https://images.unsplash.com/photo-1768054180300-ab772bd09d0e?w=400&h=600&fit=crop&auto=format'}
              alt=""
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-1 -left-1 w-5 h-5 bg-coral rotate-12"
               style={{ clipPath: 'polygon(50% 0, 100% 100%, 0 100%)' }} />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-violeta-claro rotate-45" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-[52%] z-15"
             style={{ background: 'linear-gradient(transparent, rgba(20,5,30,0.85) 40%, rgba(20,5,30,0.95) 100%)' }} />

        <div className="absolute bottom-0 left-0 right-0 z-20 p-5 pb-6">
          <div className="mb-2">
            <span className="font-heading text-[clamp(2rem,5vw,3.5rem)] font-extrabold tracking-[-0.08em] leading-none block text-white drop-shadow-lg"
                  style={{ textShadow: '4px 4px 0 #3a1a4a' }}>
              VETTONIA
            </span>
            <span className="font-mono text-[8px] tracking-[0.5em] uppercase text-white/80 block mt-1">2026</span>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border-l-4 border-coral pl-4 pr-4 pt-3 pb-3">
            <div className="flex items-end justify-between">
              <div>
                <span className="font-mono text-[8px] tracking-[0.3em] uppercase text-white/60">Titular</span>
                <p className="font-heading text-xl sm:text-2xl font-extrabold tracking-[-0.04em] leading-tight text-white">
                  {passName || 'Sin nombre'}
                </p>
              </div>
              <div className="text-right">
                <span className="font-mono text-[8px] tracking-[0.3em] uppercase text-white/60">Nº de pase</span>
                <p className="font-heading text-base sm:text-lg font-bold tracking-[-0.02em] text-white">{passNumber || '---'}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
