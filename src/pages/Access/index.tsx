import { useRef, useEffect, useCallback, useState } from 'react'
import { toPng, toBlob } from 'html-to-image'
import { toast } from 'sonner'
import Reveal from '../../components/Reveal'
import HamburgerNav from '../../components/HamburgerNav'
import Footer from '../../sections/Footer'
import SEO from '../../components/SEO'
import ErrorBoundary from '../../components/ErrorBoundary'
import LockedView from './components/LockedView'
import PassHeader from './components/PassHeader'
import PassCard from './components/PassCard'
import PassPerks from './components/PassPerks'
import MessageWall from './components/MessageWall'
import ContentGrid from './components/ContentGrid'
import AchievementGrid from '../../components/AchievementGrid'
import PassStats from './components/PassStats'
import { useAccess, usePass, useMessages, useStats } from './hooks'

export default function Access() {
  const inputRef = useRef<HTMLInputElement>(null)
  const {
    unlocked, tab, setTab,
    code, setCode, codeError, setCodeError,
    handleSubmit, handleLogout,
  } = useAccess()
  const pass = usePass()
  const wall = useMessages()
  const stats = useStats()

  const photoInputRef = useRef<HTMLInputElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const [downloading, setDownloading] = useState(false)
  const [sharing, setSharing] = useState(false)
  const [showPhoto, setShowPhoto] = useState(true)

  const handlePhotoClick = useCallback(() => {
    photoInputRef.current?.click()
  }, [])

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return
    setDownloading(true)
    try {
      const dataUrl = await toPng(cardRef.current, { quality: 1, pixelRatio: 3, skipFonts: true })
      const link = document.createElement('a')
      link.download = `Vettonia2027-${pass.passInfo.number || 'pase'}.png`
      link.href = dataUrl
      link.click()
    } catch {
      // fallback silencioso
    } finally {
      setDownloading(false)
    }
  }, [pass.passInfo.number])

  const handleShare = useCallback(async () => {
    if (!cardRef.current) return
    setSharing(true)
    try {
      const blob = await toBlob(cardRef.current, { quality: 0.9, pixelRatio: 2, skipFonts: true })
      if (!blob) return
      const file = new File([blob], `Vettonia2027-${pass.passInfo.number || 'pase'}.png`, { type: 'image/png' })

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Mi pase Vettonia 2027', text: '¡Este es mi pase!' })
      } else if (navigator.clipboard?.write) {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
        toast.success('Pase copiado al portapapeles')
      } else {
        toast.error('Compartir no está disponible en este navegador')
      }
    } catch {
      toast.error('No se pudo compartir el pase')
    } finally {
      setSharing(false)
    }
  }, [pass.passInfo.number])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const onCodeChange = (v: string) => {
    setCode(v)
    setCodeError(false)
  }

  if (!unlocked) {
    return (
      <div className="flex flex-col min-h-svh bg-arena">
        <SEO title="Acceso" description="Accede al área privada de Vettonia 2027 con tu pase." noindex />
        <HamburgerNav />
        <LockedView
          code={code}
          error={codeError}
          inputRef={inputRef}
          onCodeChange={onCodeChange}
          onSubmit={handleSubmit}
        />
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-svh bg-arena">
      <SEO title="Mi pase" description="Tu pase personal de Vettonia 2027." noindex />
      <HamburgerNav />
      <div className="flex-1">
        <PassHeader tab={tab} onTabChange={setTab} onLogout={handleLogout} />

        <ErrorBoundary>
        {tab === 'pase' && (
          <section role="tabpanel" id="tabpanel-pase" aria-labelledby="tab-pase" className="px-5 pb-20">
            <div className="max-w-5xl mx-auto">
              <Reveal as="pop">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
                  <div className="w-full max-w-xs lg:w-80 shrink-0">
                    <PassCard ref={cardRef}
                      passPhoto={pass.passPhoto}
                      passNumber={pass.passInfo.number}
                      passName={pass.passInfo.name}
                      loading={pass.passLoading}
                      hidePhoto={!showPhoto}
                    />
                  </div>
                  <div className="space-y-5">
                    <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3">
                      <input ref={photoInputRef} type="file" accept="image/*" onChange={pass.handlePhoto} className="hidden" />
                      <button onClick={handlePhotoClick}
                        className="border-l-4 border-t-2 border-r-2 border-b-2 border-violeta/30 pl-4 pr-4 pt-2.5 pb-2.5 cursor-pointer hover:bg-violeta hover:text-white transition-all group text-center w-full sm:flex-1">
                        <span className="font-mono text-violeta text-[8px] tracking-[0.3em] uppercase group-hover:text-white">
                          {pass.passPhoto ? 'Cambiar foto' : 'Añadir foto'}
                        </span>
                      </button>
                      <button onClick={() => { pass.setNameInput(pass.passInfo.name); pass.setEditingName(true) }}
                        className="border-l-4 border-t-2 border-r-2 border-b-2 border-violeta/30 pl-4 pr-4 pt-2.5 pb-2.5 cursor-pointer hover:bg-violeta hover:text-white transition-all group text-center w-full sm:flex-1">
                        <span className="font-mono text-violeta text-[8px] tracking-[0.3em] uppercase group-hover:text-white">
                          Editar nombre
                        </span>
                      </button>
                      <button onClick={handleDownload} disabled={downloading}
                        className="border-l-4 border-t-2 border-r-2 border-b-2 border-violeta/30 pl-4 pr-4 pt-2.5 pb-2.5 cursor-pointer hover:bg-violeta hover:text-white transition-all group disabled:opacity-40 disabled:cursor-not-allowed text-center w-full sm:flex-1">
                        <span className="font-mono text-violeta text-[8px] tracking-[0.3em] uppercase group-hover:text-white">
                          {downloading ? 'Generando...' : 'Descargar pase'}
                        </span>
                      </button>
                      <button onClick={handleShare} disabled={sharing}
                        className="border-l-4 border-t-2 border-r-2 border-b-2 border-violeta/30 pl-4 pr-4 pt-2.5 pb-2.5 cursor-pointer hover:bg-violeta hover:text-white transition-all group disabled:opacity-40 disabled:cursor-not-allowed text-center w-full sm:flex-1">
                        <span className="font-mono text-violeta text-[8px] tracking-[0.3em] uppercase group-hover:text-white">
                          {sharing ? 'Compartiendo...' : 'Compartir pase'}
                        </span>
                      </button>
                      <button onClick={() => setShowPhoto(v => !v)}
                        className="border-l-4 border-t-2 border-r-2 border-b-2 border-violeta/30 pl-4 pr-4 pt-2.5 pb-2.5 cursor-pointer hover:bg-violeta hover:text-white transition-all group text-center w-full sm:flex-1">
                        <span className="font-mono text-violeta text-[8px] tracking-[0.3em] uppercase group-hover:text-white">
                          {showPhoto ? 'Ocultar foto' : 'Mostrar foto'}
                        </span>
                      </button>
                    </div>
                    {pass.editingName && (
                      <div className="flex gap-2 max-w-sm">
                        <input value={pass.nameInput} onChange={(e) => pass.setNameInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && pass.handleSaveName()}
                          className="font-mono text-sm bg-white border-2 border-coral px-4 py-3 w-full outline-none uppercase tracking-[0.15em] text-violeta"
                          placeholder="TU NOMBRE"
                          autoFocus />
                        <button onClick={pass.handleSaveName}
                          className="bg-coral text-white px-5 font-mono text-xs tracking-[0.3em] uppercase cursor-pointer hover:opacity-80">
                          OK
                        </button>
                      </div>
                    )}
                    <div className="border-2 border-violeta/10 p-5 bg-white/60 max-w-sm"
                         style={{ clipPath: 'polygon(0 0, 100% 0, 97% 100%, 3% 100%)' }}>
                      <span className="font-mono text-texto-suave text-[8px] tracking-[0.4em] uppercase block">
                        {pass.pin ? 'PIN configurado' : 'Configura tu PIN'}
                      </span>
                      <p className="font-ui text-texto text-xs leading-relaxed mt-2">
                        {pass.pin
                          ? 'Tu pase está protegido con PIN. Puedes cambiarlo cuando quieras.'
                          : 'Protege tu pase con un PIN para acceder desde cualquier dispositivo.'}
                      </p>
                      {pass.showPinInput ? (
                        <div className="flex gap-2 mt-3">
                          <input type="password" value={pass.pinInput}
                            onChange={(e) => pass.setPinInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && pass.handleSetPin()}
                            className="font-mono text-violeta text-sm bg-transparent border-2 border-violeta/20 px-4 py-2 w-full outline-none text-center tracking-[0.3em] placeholder:text-black/30 focus:border-coral/50 transition-colors"
                            placeholder="NUEVO PIN"
                            autoFocus
                            maxLength={10} />
                          <button onClick={pass.handleSetPin}
                            className="bg-coral text-white px-4 font-mono text-[10px] tracking-[0.3em] uppercase hover:bg-coral/80 transition-colors cursor-pointer">
                            OK
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => pass.setShowPinInput(true)}
                          className="font-mono text-coral text-[8px] tracking-[0.3em] uppercase underline underline-offset-4 hover:text-violeta transition-colors cursor-pointer mt-2">
                          {pass.pin ? 'Cambiar PIN' : 'Establecer PIN'}
                        </button>
                      )}
                    </div>
                    <PassPerks />
                  </div>
                </div>
              </Reveal>
            </div>
          </section>
        )}

        {tab === 'muro' && (
          <div role="tabpanel" id="tabpanel-muro" aria-labelledby="tab-muro">
          <MessageWall
            messages={wall.messages}
            msgText={wall.msgText}
            msgAuthor={wall.msgAuthor}
            loading={wall.msgLoading}
            onMsgTextChange={wall.setMsgText}
            onMsgAuthorChange={wall.setMsgAuthor}
            onAdd={wall.handleAddMessage}
            onDelete={wall.handleDeleteMessage}
          />
          </div>
        )}

        {tab === 'contenido' && <div role="tabpanel" id="tabpanel-contenido" aria-labelledby="tab-contenido"><ContentGrid /></div>}

        {tab === 'logros' && (
          <section role="tabpanel" id="tabpanel-logros" aria-labelledby="tab-logros" className="px-5 pb-20">
            <div className="max-w-3xl mx-auto pt-6">
              <AchievementGrid />
            </div>
          </section>
        )}

        {tab === 'stats' && (
          <div role="tabpanel" id="tabpanel-stats" aria-labelledby="tab-stats">
          <PassStats
            stats={stats.stats}
            messageCount={wall.messages.length}
            photos={stats.photos}
            loading={stats.statsLoading}
          />
          </div>
        )}
      </ErrorBoundary>
      </div>
      <Footer />
    </div>
  )
}
