import { useState } from 'react'
import { Link } from 'react-router-dom'
import GalleryModal from '../components/GalleryModal'
import Reveal from '../components/Reveal'
import { SolidBox, SolidDot, SolidLine, SolidRing, SolidTri } from '../components/Solids'
import { unsplashAutoFormat, unsplashSrcset } from '../lib/images'

const photos = [
  { src: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&q=80', rotate: '1deg', clip: '', obj: 'center' },
  { src: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80', rotate: '-2deg', clip: 'polygon(0 0, 100% 5%, 95% 95%, 0 100%)', obj: 'center 30%' },
  { src: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&q=80', rotate: '2deg', clip: 'polygon(5% 0, 100% 0, 95% 100%, 0 95%)', obj: 'center 20%' },
  { src: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400&q=80', rotate: '-1.5deg', clip: '', obj: 'center' },
  { src: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=600&q=80', rotate: '1deg', clip: 'polygon(0 2%, 100% 0, 100% 100%, 0 98%)', obj: 'center 60%' },
  { src: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=400&q=80', rotate: '-1deg', clip: '', obj: 'center 40%' },
  { src: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&q=80', rotate: '2.5deg', clip: 'polygon(0 0, 100% 3%, 100% 97%, 0 100%)', obj: 'center' },
  { src: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&q=80', rotate: '-2deg', clip: 'polygon(3% 0, 100% 0, 97% 100%, 0 100%)', obj: 'center 70%' },
]

function img(p: typeof photos[0]) {
  return {
    src: unsplashAutoFormat(p.src),
    srcset: unsplashSrcset(p.src, [400, 600, 800]),
    sizes: '(max-width: 768px) 100vw, 50vw',
  }
}

export default function Galeria() {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalIndex, setModalIndex] = useState(0)

  const openModal = (i: number) => {
    setModalIndex(i)
    setModalOpen(true)
  }

  return (
    <section id="galeria" className="bg-arena-oscuro pt-20 pb-8 relative overflow-hidden scroll-mt-24">
      <div className="absolute inset-0 bg-violeta/6"
        style={{ clipPath: 'polygon(0 0, 25% 0, 45% 100%, 20% 100%)' }} />
      <div className="absolute inset-0 bg-coral/6"
        style={{ clipPath: 'polygon(75% 0, 100% 0, 90% 100%, 60% 100%)' }} />
      <div className="absolute inset-0 bg-violeta-claro/5"
        style={{ clipPath: 'polygon(40% 0, 55% 0, 50% 100%, 35% 100%)' }} />
      <div className="absolute inset-0 bg-coral-oscuro/4"
        style={{ clipPath: 'polygon(0 45%, 10% 30%, 20% 65%, 0 80%)' }} />

      <div className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: 'radial-gradient(circle, #3a1a4a 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }} />

      <span className="absolute font-heading text-[clamp(8rem,25vw,22rem)] font-extrabold text-violeta/3 leading-none tracking-[-0.08em] select-none pointer-events-none bottom-[-5%] left-[-3%]">
        FOTOS
      </span>
      <span className="absolute font-heading text-[clamp(5rem,15vw,13rem)] font-extrabold text-coral/2 leading-none tracking-[-0.08em] select-none pointer-events-none top-[2%] right-[-3%] -rotate-6">
        MOMENTOS
      </span>

      <SolidBox className="w-16 h-16 bg-coral/50 left-[10%] top-[6%] z-30 rotate-12" />
      <SolidRing className="w-36 h-36 border-violeta/25 right-[-4%] top-[2%] z-30" />
      <SolidDot className="w-10 h-10 bg-violeta/50 left-[28%] top-[28%] z-30" />
      <SolidLine className="w-60 h-0.75 bg-coral/35 right-[4%] top-[40%] z-30 rotate-1" />
      <SolidTri className="w-16 h-16 bg-coral/30 left-[55%] top-[10%] z-30 rotate-30" />
      <SolidBox className="w-12 h-12 bg-violeta/40 right-[22%] bottom-[22%] z-30 rotate-60" />
      <SolidRing className="w-28 h-28 border-coral/35 left-[1%] bottom-[12%] z-30" />
      <SolidDot className="w-8 h-8 bg-coral/55 right-[10%] bottom-[6%] z-30" />
      <SolidLine className="w-36 h-0.75 bg-violeta-claro/20 left-[5%] top-[62%] z-30 -rotate-2" />
      <SolidRing className="w-14 h-14 border-violeta/30 right-[30%] top-[55%] z-30" />

        <Reveal as="pop">
        <div className="relative z-10 max-w-5xl mx-auto">
        <h2 className="font-heading text-violeta text-[clamp(2rem,6vw,4.5rem)] font-extrabold leading-none tracking-[-0.08em] [text-shadow:4px_4px_0_#e85d6f]">
          GALERÍA
        </h2>
        <span className="font-mono text-texto-suave text-[8px] tracking-[0.5em] uppercase block mb-4">Las pruebas del delito</span>

        <div className="flex gap-1 mb-1 px-1">
          <div className="w-[55%] overflow-hidden" style={{ aspectRatio: '4/3' }}>
            <img src={img(photos[0]).src} alt="" loading="lazy" decoding="async" srcSet={img(photos[0]).srcset} sizes={img(photos[0]).sizes}
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-700 cursor-pointer"
              style={{ transform: `rotate(${photos[0].rotate})`, objectPosition: photos[0].obj, clipPath: photos[0].clip || undefined }}
              onClick={() => openModal(0)} />
          </div>
          <div className="w-[45%] overflow-hidden -mt-2 sm:-mt-4" style={{ aspectRatio: '1/1' }}>
            <img src={img(photos[1]).src} alt="" loading="lazy" decoding="async" srcSet={img(photos[1]).srcset} sizes={img(photos[1]).sizes}
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-700 cursor-pointer"
              style={{ transform: `rotate(${photos[1].rotate})`, objectPosition: photos[1].obj, clipPath: photos[1].clip || undefined }}
              onClick={() => openModal(1)} />
          </div>
        </div>

        <div className="flex gap-0.5 sm:gap-1 mb-1 px-1">
          <div className="w-[30%] overflow-hidden relative" style={{ aspectRatio: '3/4' }}>
            <img src={img(photos[2]).src} alt="" loading="lazy" decoding="async" srcSet={img(photos[2]).srcset} sizes={img(photos[2]).sizes}
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-700 cursor-pointer"
              style={{ transform: `rotate(${photos[2].rotate})`, objectPosition: photos[2].obj, clipPath: photos[2].clip || undefined }}
              onClick={() => openModal(2)} />
          </div>
          <div className="w-[35%] overflow-hidden mt-3 sm:mt-6" style={{ aspectRatio: '1/1' }}>
            <img src={img(photos[3]).src} alt="" loading="lazy" decoding="async" srcSet={img(photos[3]).srcset} sizes={img(photos[3]).sizes}
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-700 cursor-pointer"
              style={{ transform: `rotate(${photos[3].rotate})`, objectPosition: photos[3].obj, clipPath: photos[3].clip || undefined }}
              onClick={() => openModal(3)} />
          </div>
          <div className="w-[35%] overflow-hidden" style={{ aspectRatio: '4/3' }}>
            <img src={img(photos[4]).src} alt="" loading="lazy" decoding="async" srcSet={img(photos[4]).srcset} sizes={img(photos[4]).sizes}
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-700 cursor-pointer"
              style={{ transform: `rotate(${photos[4].rotate})`, objectPosition: photos[4].obj, clipPath: photos[4].clip || undefined }}
              onClick={() => openModal(4)} />
          </div>
        </div>

        <div className="flex gap-1 px-1">
          <div className="w-[40%] overflow-hidden" style={{ aspectRatio: '1/1' }}>
            <img src={img(photos[5]).src} alt="" loading="lazy" decoding="async" srcSet={img(photos[5]).srcset} sizes={img(photos[5]).sizes}
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-700 cursor-pointer"
              style={{ transform: `rotate(${photos[5].rotate})`, objectPosition: photos[5].obj, clipPath: photos[5].clip || undefined }}
              onClick={() => openModal(5)} />
          </div>
          <div className="w-[35%] overflow-hidden -mb-4" style={{ aspectRatio: '16/9' }}>
            <img src={img(photos[6]).src} alt="" loading="lazy" decoding="async" srcSet={img(photos[6]).srcset} sizes={img(photos[6]).sizes}
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-700 cursor-pointer"
              style={{ transform: `rotate(${photos[6].rotate})`, objectPosition: photos[6].obj, clipPath: photos[6].clip || undefined }}
              onClick={() => openModal(6)} />
          </div>
          <div className="w-[25%] overflow-hidden mt-2" style={{ aspectRatio: '3/4' }}>
            <img src={img(photos[7]).src} alt="" loading="lazy" decoding="async" srcSet={img(photos[7]).srcset} sizes={img(photos[7]).sizes}
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-700 cursor-pointer"
              style={{ transform: `rotate(${photos[7].rotate})`, objectPosition: photos[7].obj, clipPath: photos[7].clip || undefined }}
              onClick={() => openModal(7)} />
          </div>
        </div>

        <Link to="/gallery"
              className="border-l-4 border-t-2 border-r-2 border-b-2 border-coral/60 pl-12 pr-8 pt-4 pb-4 block mx-auto w-fit hover:bg-coral hover:border-coral transition-all group"
              style={{ clipPath: 'polygon(4% 0, 100% 0, 96% 100%, 0 100%)' }}>
          <span className="font-mono text-coral text-xs tracking-[0.5em] uppercase group-hover:text-white group-hover:tracking-[0.7em] transition-all font-bold">Ver el álbum →</span>
        </Link>
        </div>
        </Reveal>

      <GalleryModal
        images={photos.map((p) => p.src)}
        initialIndex={modalIndex}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </section>
  )
}
