import { useEffect, useState } from 'react'
import Reveal from '../components/Reveal'
import GreenLayer from '../components/GreenLayer'
import { SolidBox, SolidDot, SolidLine, SolidRing, SolidTri } from '../components/Solids'
import { getPageContent } from '../services/content'

export default function Hero() {
  const [c, setC] = useState<Record<string, string> | null>(null)

  useEffect(() => {
    getPageContent('hero').then(setC)
  }, [])

  const title1 = c?.title1 ?? 'Vett'
  const title2 = c?.title2 ?? 'onia'
  const dates = c?.dates ?? '8 · 9 · 10'
  const month = c?.month ?? 'octubre'
  const location = c?.location ?? 'extremadura'

  return (
    <section id="inicio" className="h-svh relative flex flex-col justify-between overflow-hidden">
      <img
        src="/hero.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-t from-arena/80 via-arena/50 to-arena/30 backdrop-blur-[2px]" />

      <div className="absolute inset-0 bg-coral/15"
        style={{ clipPath: 'polygon(70% 0, 95% 0, 85% 100%, 60% 100%)' }} />
      <div className="absolute inset-0 bg-violeta/15"
        style={{ clipPath: 'polygon(0 60%, 20% 40%, 35% 80%, 0 95%)' }} />
      <div className="absolute inset-0 bg-violeta-claro/10"
        style={{ clipPath: 'polygon(35% 0, 50% 0, 45% 100%, 30% 100%)' }} />

      <div className="absolute inset-0 opacity-[0.1]"
        style={{
          backgroundImage: 'radial-gradient(circle, #3a1a4a 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />

      <span           className="absolute font-heading text-[clamp(12rem,40vw,35rem)] font-extrabold text-coral/8 leading-none tracking-[-0.08em] select-none pointer-events-none bottom-[-8%] right-[-8%] -rotate-12">
        2027
      </span>
      <span         className="absolute font-heading text-[clamp(8rem,25vw,22rem)] font-extrabold text-violeta/6 leading-none tracking-[-0.08em] select-none pointer-events-none top-[-2%] left-[-3%]">
        VETTONIA
      </span>

      <GreenLayer />

      <SolidBox className="w-16 h-16 bg-coral/55 left-[5%] top-[8%] z-30 rotate-12" />
      <SolidRing className="w-40 h-40 border-white/35 right-[-8%] top-[-6%] z-30" />
      <SolidDot className="w-8 h-8 bg-coral/70 right-[14%] top-[38%] z-30" />
      <SolidLine className="w-44 h-0.75 bg-violeta-claro/40 left-[12%] top-[42%] z-30 rotate-3" />
      <SolidBox className="w-10 h-10 bg-coral/55 left-[2%] top-[50%] z-30 rotate-40" />
      <SolidTri className="w-14 h-14 bg-violeta/45 right-[8%] bottom-[35%] z-30 rotate-50" />
      <SolidDot className="w-4 h-4 bg-white/65 right-[6%] bottom-[28%] z-30" />
      <SolidRing className="w-24 h-24 border-coral/55 left-[35%] top-[55%] z-30" />
      <SolidBox className="w-8 h-8 bg-violeta-claro/45 left-[55%] bottom-[15%] z-30 rotate-25" />
      <SolidDot className="w-5 h-5 bg-coral/75 left-[20%] bottom-[8%] z-30" />

      <div />

      <Reveal as="pop" className="relative z-10 lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:top-1/2 lg:-translate-y-1/2">
        <img src="/vettonia-logo.png" alt="Vettonia" className="w-[clamp(16rem,50vw,40rem)] h-auto lg:w-[clamp(16rem,22vw,28rem)]" />
      </Reveal>

      <Reveal as="pop" delay={200}>
      <div className="relative z-10 px-5 pb-8 text-right lg:max-w-lg lg:ml-auto">
        <h1 className="font-heading text-[clamp(6rem,30vw,22rem)] lg:text-[clamp(6rem,15vw,12rem)] font-bold leading-[0.6] tracking-[-0.15em] text-violeta select-none [text-shadow:6px_6px_0_#e85d6f]">
          {title1}
        </h1>
        <h1 className="font-heading text-[clamp(4.5rem,24vw,18rem)] lg:text-[clamp(4.5rem,12vw,9rem)] font-bold leading-[0.6] tracking-[-0.15em] text-violeta select-none mt-[-0.12em] [text-shadow:5px_5px_0_#e85d6f]">
          {title2.split('').map((ch, i) =>
            ch === 'i' ? <span key={i} className="text-coral/70">{ch}</span> : ch
          )}
        </h1>
        <div className="leading-none mt-4">
          <span className="font-heading text-[clamp(3rem,10vw,8rem)] lg:text-[clamp(3rem,7vw,4.5rem)] font-bold tracking-[-0.08em] text-coral block">
            {dates}
          </span>
          <span className="font-heading text-[clamp(1.5rem,5vw,4rem)] lg:text-[clamp(1.5rem,3.5vw,2.5rem)] font-light tracking-[0.15em] text-coral block -mt-2">
            {month}
          </span>
          <span className="font-mono text-[clamp(0.75rem,2vw,1.5rem)] lg:text-[clamp(0.75rem,1.5vw,1rem)] tracking-[0.5em] text-grey block mt-2 uppercase">
            {location}
          </span>
        </div>
      </div>
      </Reveal>
    </section>
  )
}
