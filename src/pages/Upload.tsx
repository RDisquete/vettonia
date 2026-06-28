import { useState, useRef, useCallback, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import HamburgerNav from '../components/HamburgerNav'
import Footer from '../sections/Footer'
import SEO from '../components/SEO'
import { uploadPhoto, isAlbumUnlocked, unlockAlbum } from '../lib/storage'
import { getCurrentUser } from '../services/auth'
import { toast } from 'sonner'
import { SolidBox, SolidDot, SolidLine, SolidRing, SolidTri } from '../components/Solids'
import Reveal from '../components/Reveal'
import ErrorBoundary from '../components/ErrorBoundary'

export default function Upload() {
  const navigate = useNavigate()
  const [, setUnlocked] = useState(isAlbumUnlocked)
  const [showCode, setShowCode] = useState(!isAlbumUnlocked)
  const [code, setCode] = useState('')
  const [codeError, setCodeError] = useState(false)

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) {
        setUnlocked(true)
        setShowCode(false)
      }
    })
  }, [])

  const handleUnlock = () => {
    if (unlockAlbum(code)) {
      setUnlocked(true)
      setShowCode(false)
      setCode('')
      setCodeError(false)
    } else {
      setCodeError(true)
    }
  }

  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [author, setAuthor] = useState('')
  const [caption, setCaption] = useState('')
  const [sending, setSending] = useState(false)
  const [uploadedCount, setUploadedCount] = useState(0)
  const [done, setDone] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || [])
    if (selected.length === 0) return
    setFiles(selected)
    Promise.all(selected.map(f => new Promise<string>((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.readAsDataURL(f)
    }))).then(setPreviews)
  }, [])

  const removeFile = useCallback((idx: number) => {
    setFiles(prev => prev.filter((_, i) => i !== idx))
    setPreviews(prev => prev.filter((_, i) => i !== idx))
  }, [])

  const handleSubmit = async () => {
    if (files.length === 0) return
    setSending(true)
    setUploadedCount(0)
    const authorName = author || 'Anónimo'
    for (let i = 0; i < files.length; i++) {
      try {
        await uploadPhoto(files[i], caption, authorName)
        setUploadedCount(i + 1)
      } catch (e) {
        console.error(e)
      }
    }
    setSending(false)
    setDone(true)
    toast.success(`${files.length} foto${files.length !== 1 ? 's' : ''} subida${files.length !== 1 ? 's' : ''} con éxito`)
    navigate('/gallery', { state: { tab: 'privado' }, replace: true })
  }

  const reset = () => {
    setDone(false)
    setFiles([])
    setPreviews([])
    setCaption('')
    setAuthor('')
    setUploadedCount(0)
  }

  if (done) {
    return (
      <div className="flex flex-col min-h-svh bg-arena">
        <HamburgerNav />
        <div className="flex-1 flex items-center justify-center px-5">
          <div className="text-center max-w-md">
            <span className="font-heading text-violeta text-7xl sm:text-9xl font-extrabold tracking-[-0.08em] block [text-shadow:4px_4px_0_#e85d6f]">&#10003;</span>
            <p className="font-heading text-violeta text-2xl sm:text-3xl font-extrabold tracking-[-0.04em] mt-2">
              {uploadedCount > 1 ? 'Ya están ahí' : 'Ya está ahí'}
            </p>
            <p className="font-ui text-texto text-sm leading-relaxed mt-2">
              {uploadedCount > 1
                ? `Tus ${uploadedCount} fotos ya forman parte de esta locura.`
                : 'Tu foto ya forma parte de esta locura.'}
              Cuando las veas en el álbum acuérdate de lo bien que lo pasaste.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
              <Link to="/gallery"
                className="border-l-4 border-t-2 border-r-2 border-b-2 border-coral/50 pl-8 pr-5 pt-3 pb-3 hover:bg-coral hover:border-coral transition-all group"
                style={{ clipPath: 'polygon(4% 0, 100% 0, 96% 100%, 0 100%)' }}
              >
                <span className="font-mono text-coral text-[10px] tracking-[0.4em] uppercase group-hover:text-white transition-all">Ver álbum</span>
              </Link>
              <button onClick={reset}
                className="font-mono text-violeta text-[10px] tracking-[0.3em] uppercase underline underline-offset-4 hover:text-coral transition-colors cursor-pointer">
                Subir más
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-svh bg-arena">
      <SEO title="Sube tus fotos" description="Sube tus fotos de Vettonia 2026 y comparte tus mejores momentos." path="/upload" noindex />
      <HamburgerNav />
      <div className="flex-1">
        <section className="relative overflow-hidden min-h-[80vh] flex items-center px-5 py-20">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1600&h=1000&fit=crop&auto=format"
              alt=""
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover opacity-[0.15]"
            />
            <div className="absolute inset-0 bg-linear-to-b from-arena/95 via-arena/85 to-arena/95" />
          </div>

          <div className="absolute inset-0 bg-coral/8"
            style={{ clipPath: 'polygon(55% 0, 100% 0, 80% 100%, 35% 100%)' }} />
          <div className="absolute inset-0 bg-violeta/6"
            style={{ clipPath: 'polygon(0 20%, 30% 0, 45% 60%, 0 80%)' }} />
          <div className="absolute inset-0 bg-violeta-claro/5"
            style={{ clipPath: 'polygon(80% 0, 100% 10%, 90% 100%, 60% 100%)' }} />

          <div className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'radial-gradient(circle, #3a1a4a 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }} />

          <span className="absolute font-heading text-[clamp(12rem,40vw,34rem)] font-extrabold text-violeta/4 leading-none tracking-[-0.08em] select-none pointer-events-none top-[-4%] right-[-6%]">
            SUBIR
          </span>
          <span className="absolute font-heading text-[clamp(6rem,18vw,16rem)] font-extrabold text-coral/3 leading-none tracking-[-0.08em] select-none pointer-events-none bottom-[3%] left-[-4%] rotate-8">
            +FOTOS
          </span>
          <span className="absolute font-heading text-[clamp(3rem,10vw,8rem)] font-extrabold text-white/3 leading-none tracking-[-0.08em] select-none pointer-events-none top-[35%] left-[25%] -rotate-12">
            MEMORIA
          </span>

          <SolidBox className="w-16 h-16 bg-coral/45 left-[3%] top-[8%] z-30 rotate-15" />
          <SolidRing className="w-32 h-32 border-violeta/25 right-[-4%] top-[6%] z-30" />
          <SolidTri className="w-20 h-20 bg-coral/25 left-[58%] top-[14%] z-30 rotate-35" />
          <SolidDot className="w-9 h-9 bg-violeta/50 left-[12%] top-[55%] z-30" />
          <SolidLine className="w-52 h-0.75 bg-coral/35 right-[5%] top-[52%] z-30 rotate-2" />
          <SolidDot className="w-7 h-7 bg-coral/60 right-[18%] bottom-[20%] z-30" />
          <SolidBox className="w-11 h-11 bg-violeta/40 left-[48%] bottom-[12%] z-30 rotate-[-25deg]" />
          <SolidRing className="w-20 h-20 border-coral/35 left-[6%] bottom-[6%] z-30" />
          <SolidLine className="w-40 h-0.75 bg-violeta/25 left-[25%] top-[75%] z-30 -rotate-3" />
          <SolidTri className="w-14 h-14 bg-coral-oscuro/25 right-[30%] bottom-[8%] z-30 rotate-60" />
          <SolidRing className="w-14 h-14 border-white/20 left-[38%] top-[40%] z-30" />
          <SolidDot className="w-5 h-5 bg-white/40 right-[8%] top-[38%] z-30" />

          <div className="relative z-10 w-full max-w-5xl mx-auto">
            {showCode ? (
              <div className="max-w-sm mx-auto text-center" data-a="code">
                <span className="font-heading text-violeta text-[clamp(3rem,7vw,5rem)] font-extrabold leading-none tracking-[-0.08em] block [text-shadow:5px_5px_0_#e85d6f]">
                  ACCESO
                </span>
                <span className="font-mono text-texto-suave text-[9px] tracking-[0.5em] uppercase block mt-3">Introduce el código del álbum privado</span>
                <div className="mt-8 border-2 border-violeta/20 p-8 bg-white/70 backdrop-blur-[2px]"
                     style={{ clipPath: 'polygon(0 0, 100% 0, 96% 100%, 4% 100%)' }}>
                  <input type="text" value={code}
                    onChange={(e) => { setCode(e.target.value); setCodeError(false) }}
                    onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                    className={`font-mono text-violeta text-base bg-transparent border-2 px-4 py-3 w-full outline-none text-center tracking-[0.3em] uppercase placeholder:text-black/30 transition-colors ${codeError ? 'border-coral' : 'border-violeta/20 focus:border-coral/50'}`}
                    placeholder="CÓDIGO" />
                  {codeError && (
                    <p className="font-mono text-coral text-[9px] tracking-[0.2em] uppercase mt-3 animate-pulse">Código incorrecto</p>
                  )}
                  <button onClick={handleUnlock}
                    className="border-l-4 border-t-2 border-r-2 border-b-2 border-coral/50 pl-10 pr-6 pt-3 pb-3 mt-6 w-full hover:bg-coral hover:border-coral transition-all group cursor-pointer"
                    style={{ clipPath: 'polygon(4% 0, 100% 0, 96% 100%, 0 100%)' }}>
                    <span className="font-mono text-coral text-[11px] tracking-[0.4em] uppercase group-hover:text-white group-hover:tracking-[0.6em] transition-all block">Entrar</span>
                  </button>
                  <Link to="/gallery" className="font-mono text-black/40 text-[8px] tracking-[0.3em] uppercase underline underline-offset-4 hover:text-violeta transition-colors mt-5 block">
                    Volver a la galería
                  </Link>
                  <SolidLine className="w-24 h-0.5 bg-coral/30 mx-auto mt-5" />
                  <p className="font-ui text-black/40 text-xs mt-4 leading-relaxed max-w-64 mx-auto">
                    El código lo tienes si has venido de verdad. Si no, busca bien.
                  </p>
                </div>
              </div>
            ) : (
              <ErrorBoundary>
              <Reveal as="pop">
              <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-14 items-start">
                <div>
                  <div className="inline-block border-l-4 border-coral/50 pl-5 mb-6">
                    <span className="font-mono text-texto-suave text-[9px] tracking-[0.5em] uppercase block">Comparte</span>
                  </div>
                  <h1 className="font-heading text-violeta text-[clamp(2.8rem,8vw,6rem)] font-extrabold leading-[0.85] tracking-[-0.08em] [text-shadow:5px_5px_0_#e85d6f]">
                    SUBE TUS
                  </h1>
                  <h1 className="font-heading text-coral text-[clamp(2.8rem,8vw,6rem)] font-extrabold leading-[0.85] tracking-[-0.08em] [text-shadow:5px_5px_0_#cc4a5c] mt-1">
                    FOTOS
                  </h1>

                  <div className="mt-8 border-l-4 border-violeta/30 pl-5 max-w-md">
                    <p className="font-ui text-black/70 text-sm sm:text-base leading-relaxed">
                      Esto no es un festival al uso. Esto es un plan de tres días sin cobertura,
                      con el polvo en la ropa y la música metida en los huesos.
                    </p>
                    <p className="font-ui text-black/70 text-sm sm:text-base leading-relaxed mt-4">
                      Cada foto que subes es un trozo de la historia que estamos escribiendo juntos.
                      El momento que solo tú viste. Esa mirada. Ese baile. Esa locura.
                    </p>
                    <p className="font-ui text-violeta text-sm sm:text-base font-bold leading-relaxed mt-4">
                      Queremos que este álbum sea tuyo. De todos. Un recuerdo conjunto
                      de tres días que no se olvidan.
                    </p>
                    <p className="font-ui text-black/70 text-sm sm:text-base leading-relaxed mt-4">
                      Así que suelta esas fotos. No las guardes en el carrete.
                      Aquí es donde tienen que estar.
                    </p>
                  </div>
                </div>

                <div className="bg-white/70 backdrop-blur-[2px] border-2 border-violeta/10 p-6 sm:p-8 space-y-6"
                     style={{ clipPath: 'polygon(0 0, 100% 0, 97% 100%, 3% 100%)' }}>
                  <div className="relative">
                    <label className="font-mono text-texto-suave text-[8px] tracking-[0.4em] uppercase block mb-2">Tus fotos</label>
                    <input ref={inputRef} type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
                    {previews.length > 0 ? (
                      <div>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
                          {previews.map((src, i) => (
                            <div key={i} className="relative group aspect-square overflow-hidden border border-violeta/10">
                              <img src={src} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                              <button onClick={() => removeFile(i)}
                                className="absolute top-1 right-1 bg-coral text-white text-[10px] px-2 py-0.5 cursor-pointer hover:bg-coral/80 transition-colors opacity-0 group-hover:opacity-100">
                                &#10005;
                              </button>
                            </div>
                          ))}
                        </div>
                        <button onClick={() => inputRef.current?.click()}
                          className="font-mono text-violeta text-[9px] tracking-[0.2em] uppercase underline underline-offset-4 hover:text-coral transition-colors cursor-pointer">
                          + Añadir más fotos
                        </button>
                      </div>
                    ) : (
                      <div onClick={() => inputRef.current?.click()}
                        className="border-2 border-dashed border-violeta/20 p-10 sm:p-14 text-center cursor-pointer hover:border-coral/50 hover:bg-coral/5 transition-all group">
                        <span className="font-heading text-violeta/30 text-5xl block leading-none mb-2 group-hover:scale-110 transition-transform">+</span>
                        <span className="font-mono text-black/40 text-[9px] tracking-[0.2em] uppercase">Selecciona una o varias fotos</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="font-mono text-texto-suave text-[8px] tracking-[0.4em] uppercase block mb-2">Tu nombre</label>
                    <input value={author} onChange={(e) => setAuthor(e.target.value)}
                      className="font-mono text-violeta text-sm bg-transparent border-2 border-violeta/10 px-3 py-3 w-full outline-none placeholder:text-black/40 tracking-[0.2em] focus:border-coral/50 transition-colors"
                      placeholder="Anónimo" />
                  </div>

                  <div>
                    <label className="font-mono text-texto-suave text-[8px] tracking-[0.4em] uppercase block mb-2">Pie de foto (para todas)</label>
                    <textarea value={caption} onChange={(e) => setCaption(e.target.value)}
                      className="font-mono text-violeta text-sm bg-transparent border-2 border-violeta/10 px-3 py-3 w-full outline-none placeholder:text-black/40 tracking-[0.2em] resize-none h-16 focus:border-coral/50 transition-colors"
                      placeholder="El momento, la sensación, lo que sea..." />
                  </div>

                  <button onClick={handleSubmit} disabled={files.length === 0 || sending}
                    className={`border-l-4 border-t-2 border-r-2 border-b-2 w-full text-center transition-all group cursor-pointer ${files.length === 0 || sending ? 'border-black/10 text-black/30 pointer-events-none' : 'border-violeta/30 hover:bg-violeta hover:border-violeta'}`}
                    style={{ clipPath: 'polygon(4% 0, 100% 0, 96% 100%, 0 100%)' }}
                  >
                    <span className={`font-mono text-[11px] tracking-[0.4em] uppercase py-3 block transition-all ${files.length === 0 || sending ? '' : 'text-violeta group-hover:text-white group-hover:tracking-[0.5em]'}`}>
                      {sending
                        ? `Subiendo... ${uploadedCount}/${files.length}`
                        : `Subir ${files.length > 1 ? `${files.length} fotos` : 'la foto'}`
                      }
                    </span>
                  </button>
                </div>
              </div>
              </Reveal>
              </ErrorBoundary>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  )
}
