import { useRef, useEffect, useCallback } from 'react'
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

  const handlePhotoClick = useCallback(() => {
    photoInputRef.current?.click()
  }, [])

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
        <SEO title="Acceso" description="Accede al área privada de Vettonia 2026 con tu pase." noindex />
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
      <SEO title="Mi pase" description="Tu pase personal de Vettonia 2026." noindex />
      <HamburgerNav />
      <div className="flex-1">
        <PassHeader tab={tab} onTabChange={setTab} onLogout={handleLogout} />

        <ErrorBoundary>
        {tab === 'pase' && (
          <section role="tabpanel" id="tabpanel-pase" aria-labelledby="tab-pase" className="px-5 pb-20">
            <div className="max-w-5xl mx-auto">
              <Reveal as="pop">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8 lg:gap-12 items-start">
                  <div className="space-y-5">
                    <PassCard
                      passPhoto={pass.passPhoto}
                      passNumber={pass.passInfo.number}
                      passName={pass.passInfo.name}
                      loading={pass.passLoading}
                    />
                    <div className="flex flex-wrap gap-3">
                      <input ref={photoInputRef} type="file" accept="image/*" onChange={pass.handlePhoto} className="hidden" />
                      <button onClick={handlePhotoClick}
                        className="border-l-4 border-t-2 border-r-2 border-b-2 border-violeta/30 pl-6 pr-4 pt-2.5 pb-2.5 cursor-pointer hover:bg-violeta hover:text-white transition-all group">
                        <span className="font-mono text-violeta text-[8px] tracking-[0.3em] uppercase group-hover:text-white">
                          {pass.passPhoto ? 'Cambiar foto' : 'Añadir foto'}
                        </span>
                      </button>
                      <button onClick={() => { pass.setNameInput(pass.passInfo.name); pass.setEditingName(true) }}
                        className="border-l-4 border-t-2 border-r-2 border-b-2 border-violeta/30 pl-6 pr-4 pt-2.5 pb-2.5 cursor-pointer hover:bg-violeta hover:text-white transition-all group">
                        <span className="font-mono text-violeta text-[8px] tracking-[0.3em] uppercase group-hover:text-white">
                          Editar nombre
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
                  </div>
                  <PassPerks />
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
