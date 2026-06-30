import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import HamburgerNav from '../components/HamburgerNav'
import { SolidBox, SolidDot, SolidLine, SolidRing, SolidTri } from '../components/Solids'
import Footer from '../sections/Footer'
import SEO from '../components/SEO'
import { stageColors, stages } from '../constants/lineup'

type Destino = {
  id: string
  label: string
  icon: string
  tipo: 'escenario' | 'servicio'
  coords: [number, number]
  desc?: string
}

const destinos: Destino[] = [
  { id: 'escenario-a', label: 'Escenario A', icon: '🎵', tipo: 'escenario', coords: [39.456, -6.376], desc: 'Electrónica, Indie Pop, Hip Hop' },
  { id: 'escenario-b', label: 'Escenario B', icon: '🎶', tipo: 'escenario', coords: [39.454, -6.371], desc: 'Flamenco, Fusión, Rumba' },
  { id: 'escenario-c', label: 'Escenario C', icon: '🎸', tipo: 'escenario', coords: [39.458, -6.369], desc: 'Rock, Metal, Alternativo' },
  { id: 'camping', label: 'Acampada', icon: '🏕️', tipo: 'servicio', coords: [39.460, -6.370] },
  { id: 'comida', label: 'Zona de comida', icon: '🍔', tipo: 'servicio', coords: [39.453, -6.373] },
  { id: 'agua', label: 'Puntos de agua', icon: '🚰', tipo: 'servicio', coords: [39.452, -6.377] },
  { id: 'baños', label: 'Baños', icon: '🚻', tipo: 'servicio', coords: [39.455, -6.378] },
  { id: 'medico', label: 'Punto médico', icon: '🆘', tipo: 'servicio', coords: [39.459, -6.374] },
  { id: 'carga', label: 'Punto de carga', icon: '📱', tipo: 'servicio', coords: [39.451, -6.370] },
]

const CENTER: [number, number] = [39.456, -6.373]

function haversine(a: [number, number], b: [number, number]): number {
  const R = 6371000
  const dLat = (b[0] - a[0]) * Math.PI / 180
  const dLng = (b[1] - a[1]) * Math.PI / 180
  const lat1 = a[0] * Math.PI / 180
  const lat2 = b[0] * Math.PI / 180
  const s = Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2)
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s))
}

function distanciaTexto(m: number): string {
  if (m < 1000) return `${Math.round(m)} m`
  return `${(m / 1000).toFixed(1)} km`
}

function tiempoTexto(m: number): string {
  const min = Math.round(m / 80)
  if (min < 60) return `${min} min andando`
  const h = Math.floor(min / 60)
  const r = min % 60
  return `${h}h ${r}min andando`
}

function createIcon(color: string, isStage: boolean) {
  return L.divIcon({
    className: '',
    html: `<div style="
      width: ${isStage ? 32 : 24}px; height: ${isStage ? 32 : 24}px;
      background: ${color}; border: 2px solid white;
      border-radius: 50%; display: flex; align-items: center; justify-content: center;
      font-size: ${isStage ? 14 : 10}px; box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      cursor: pointer;
    ">${isStage ? '' : '📍'}</div>`,
    iconSize: [isStage ? 32 : 24, isStage ? 32 : 24],
    iconAnchor: [isStage ? 16 : 12, isStage ? 16 : 12],
  })
}

function MapController({ onMove, selected }: {
  onMove: (coords: [number, number]) => void
  selected: string | null
}) {
  const map = useMap()
  useEffect(() => {
    if (selected) {
      const d = destinos.find(x => x.id === selected)
      if (d) map.flyTo(d.coords, 17, { duration: 1 })
    }
  }, [selected, map])

  useMapEvents({
    moveend: () => {
      const c = map.getCenter()
      onMove([c.lat, c.lng])
    },
  })

  return null
}

export default function MapPage() {
  const [locating, setLocating] = useState(false)
  const [located, setLocated] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const [coords, setCoords] = useState('')
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null)
  const [, setMapCenter] = useState<[number, number]>(CENTER)

  const destinoSel = destinos.find((d) => d.id === selected)
  const stageData = selected?.startsWith('escenario')
    ? stages.find((s) =>
        s.name === `Escenario ${selected.replace('escenario-', '').toUpperCase()}`
      )
    : null

  const dist = selected && located && userCoords
    ? haversine(userCoords, destinos.find(d => d.id === selected)!.coords)
    : null

  const handleLocate = () => {
    setLocating(true)
    if (!navigator.geolocation) {
      // fallback: simulate like before
      setTimeout(() => {
        const lat = CENTER[0] + (Math.random() - 0.5) * 0.008
        const lng = CENTER[1] + (Math.random() - 0.5) * 0.008
        setUserCoords([lat, lng])
        setCoords(`${lat.toFixed(4)}° N, ${lng.toFixed(4)}° O`)
        setLocated(true)
        setLocating(false)
      }, 2000)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords([pos.coords.latitude, pos.coords.longitude])
        setCoords(`${pos.coords.latitude.toFixed(4)}° N, ${pos.coords.longitude.toFixed(4)}° O`)
        setLocated(true)
        setLocating(false)
      },
      () => {
        // fallback on error
        const lat = CENTER[0] + (Math.random() - 0.5) * 0.008
        const lng = CENTER[1] + (Math.random() - 0.5) * 0.008
        setUserCoords([lat, lng])
        setCoords(`${lat.toFixed(4)}° N, ${lng.toFixed(4)}° O`)
        setLocated(true)
        setLocating(false)
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  const handleReset = () => {
    setLocated(false)
    setLocating(false)
    setCoords('')
    setUserCoords(null)
    setSelected(null)
  }

  return (
    <div className="flex flex-col min-h-svh bg-arena">
      <SEO
        title="Mapa"
        description="Encuentra tu escenario en el mapa interactivo de Vettonia 2027. Escenario A, Escenario B, Escenario C y zona de servicios."
        path="/map"
      />
      <HamburgerNav />
      <div className="flex-1">
        <section className="px-5 py-20 relative overflow-hidden min-h-screen">
          <div className="absolute inset-0 bg-violeta/12"
            style={{ clipPath: 'polygon(20% 0, 50% 0, 40% 100%, 15% 100%)' }} />
          <div className="absolute inset-0 bg-coral/12"
            style={{ clipPath: 'polygon(70% 0, 100% 0, 90% 100%, 55% 100%)' }} />
          <div className="absolute inset-0 bg-violeta-claro/10"
            style={{ clipPath: 'polygon(0 45%, 12% 30%, 25% 65%, 5% 80%)' }} />

          <div className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: 'radial-gradient(circle, #3a1a4a 1px, transparent 1px)',
              backgroundSize: '35px 35px',
            }} />

          <span className="absolute font-heading text-[clamp(12rem,38vw,32rem)] font-extrabold text-violeta/6 leading-none tracking-[-0.08em] select-none pointer-events-none bottom-[-6%] right-[-6%] rotate-12">
            MAPA
          </span>
          <span className="absolute font-heading text-[clamp(4rem,15vw,12rem)] font-extrabold text-coral/5 leading-none tracking-[-0.08em] select-none pointer-events-none top-[2%] left-[-4%] -rotate-6">
            VALLE
          </span>

          <SolidBox className="w-16 h-16 bg-coral/60 left-[3%] top-[5%] z-30 rotate-20" />
          <SolidRing className="w-36 h-36 border-violeta/40 right-[-4%] top-[3%] z-30" />
          <SolidDot className="w-10 h-10 bg-violeta/70 left-[10%] top-[45%] z-30" />
          <SolidLine className="w-52 h-0.75 bg-coral/50 right-[6%] top-[50%] z-30 rotate-1" />
          <SolidTri className="w-20 h-20 bg-coral/50 left-[52%] top-[6%] z-30 rotate-35" />
          <SolidRing className="w-28 h-28 border-coral/50 right-[1%] top-[58%] z-30" />
          <SolidDot className="w-8 h-8 bg-coral/70 left-[35%] bottom-[22%] z-30" />
          <SolidBox className="w-12 h-12 bg-violeta/60 left-[4%] bottom-[12%] z-30 rotate-[-20deg]" />
          <SolidLine className="w-36 h-0.75 bg-violeta/40 left-[25%] bottom-[5%] z-30 rotate-2" />
          <SolidRing className="w-16 h-16 border-violeta/50 right-[5%] bottom-[10%] z-30" />
          <SolidTri className="w-12 h-12 bg-coral-oscuro/50 left-[68%] bottom-[8%] z-30 rotate-60" />
          <SolidDot className="w-5 h-5 bg-violeta/75 right-[25%] top-[32%] z-30" />

          <div className="max-w-6xl mx-auto relative z-10">
            <h1 className="font-heading text-violeta text-[clamp(3rem,8vw,6rem)] font-extrabold leading-none tracking-[-0.08em] [text-shadow:5px_5px_0_#e85d6f]">
              MAPA
            </h1>
            <span className="font-mono text-texto-suave text-[9px] tracking-[0.5em] uppercase block mt-1">Encuentra tu escenario</span>

            <div className="mt-8 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8 lg:gap-12 items-start">
                {/* Leaflet map */}
                <div className="aspect-4/3 border-2 border-black/10 relative overflow-hidden rounded-none z-20">
                  <MapContainer center={CENTER} zoom={15} scrollWheelZoom={true}
                    className="w-full h-full" zoomControl={false}>
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapController onMove={(c) => setMapCenter(c)} selected={selected} />

                    {destinos.map((d) => {
                      const isStage = d.tipo === 'escenario'
                      const isSelected = selected === d.id
                      const color = isStage
                        ? (stageColors[d.label] || '#3a1a4a')
                        : (isSelected ? '#e85d6f' : '#8a8580')
                      return (
                        <Marker key={d.id} position={d.coords}
                          icon={createIcon(color, isStage)}
                          eventHandlers={{ click: () => setSelected(selected === d.id ? null : d.id) }}>
                          <Popup>
                            <div className="font-mono text-[10px]">
                              <strong>{d.icon} {d.label}</strong>
                              {d.desc && <p className="text-[9px] text-gray-500 mt-1">{d.desc}</p>}
                            </div>
                          </Popup>
                        </Marker>
                      )
                    })}

                    {located && userCoords && (
                      <Marker position={userCoords}
                        icon={L.divIcon({
                          className: '',
                          html: `<div style="
                            width: 20px; height: 20px; background: #e85d6f;
                            border: 3px solid white; border-radius: 50%;
                            box-shadow: 0 0 0 4px rgba(232,93,111,0.3), 0 2px 8px rgba(0,0,0,0.3);
                          "></div>`,
                          iconSize: [20, 20],
                          iconAnchor: [10, 10],
                        })}>
                        <Popup>
                          <div className="font-mono text-[10px]">
                            <strong>📍 Estás aquí</strong>
                            <p className="text-[9px] text-gray-500 mt-1">{coords}</p>
                          </div>
                        </Popup>
                      </Marker>
                    )}
                  </MapContainer>
                </div>

                {/* Sidebar */}
                <div className="space-y-5">
                  <div className="border-2 border-violeta/10 p-5 bg-white/40"
                       style={{ clipPath: 'polygon(0 0, 100% 0, 97% 100%, 3% 100%)' }}>
                    <span className="font-mono text-violeta text-[9px] tracking-[0.4em] uppercase block">📍 Localización</span>
                    <span className="font-ui text-texto-suave text-xs mt-1 block leading-relaxed">
                      Activa la geolocalización para saber dónde estás.
                    </span>
                    {!located ? (
                      <button onClick={handleLocate} disabled={locating}
                        className="border-l-4 border-t-2 border-r-2 border-b-2 border-coral pl-8 pr-5 pt-3 pb-3 w-full mt-3 cursor-pointer hover:bg-coral hover:text-white transition-all group disabled:opacity-50 disabled:pointer-events-none"
                        style={{ clipPath: 'polygon(4% 0, 100% 0, 96% 100%, 0 100%)' }}>
                        <span className="font-mono text-coral text-[10px] tracking-[0.4em] uppercase group-hover:text-white group-hover:tracking-[0.5em] transition-all block text-center">
                          {locating ? 'Buscando señal GPS...' : 'Encuéntrame'}
                        </span>
                      </button>
                    ) : (
                      <div className="mt-3 space-y-2">
                        <div className="bg-coral/10 border-l-4 border-l-coral border-t-2 border-r-2 border-b-2 border-coral/20 p-3"
                             style={{ clipPath: 'polygon(0 0, 100% 0, 97% 100%, 3% 100%)' }}>
                          <span className="font-mono text-coral text-[8px] tracking-[0.2em] uppercase block">Ubicación encontrada</span>
                          <span className="font-mono text-texto text-[9px] tracking-widest block mt-1">{coords}</span>
                        </div>
                        <button onClick={handleReset}
                          className="font-mono text-black/40 text-[8px] tracking-[0.3em] uppercase underline underline-offset-4 hover:text-coral transition-colors cursor-pointer w-full text-center block">
                          Buscar de nuevo
                        </button>
                      </div>
                    )}
                  </div>

                  {destinoSel && located && dist !== null && (
                    <div className="border-2 border-coral/30 p-5 bg-coral/5"
                         style={{ clipPath: 'polygon(0 0, 100% 0, 97% 100%, 3% 100%)' }}>
                      <span className="font-mono text-coral text-[8px] tracking-[0.4em] uppercase block">Destino</span>
                      <span className="font-heading text-violeta text-xl font-extrabold tracking-[-0.04em] block mt-1">{destinoSel.icon} {destinoSel.label}</span>
                      <div className="mt-2 space-y-1">
                        <span className="font-mono text-black/70 text-[9px] tracking-[0.2em] uppercase block">📍 {distanciaTexto(dist)}</span>
                        <span className="font-mono text-coral text-[9px] tracking-[0.2em] uppercase block">⏱ {tiempoTexto(dist)}</span>
                      </div>
                    </div>
                  )}

                  {destinoSel && !located && (
                    <div className="border-2 border-violeta/10 p-5 bg-white/40"
                         style={{ clipPath: 'polygon(0 0, 100% 0, 97% 100%, 3% 100%)' }}>
                      <span className="font-mono text-violeta text-[8px] tracking-[0.4em] uppercase block">📍 {destinoSel.icon} {destinoSel.label}</span>
                      <span className="font-ui text-texto-suave text-xs mt-1 block">Activa la localización para ver distancia y tiempo.</span>
                    </div>
                  )}

                  {stageData && (
                    <div className="border-2 border-violeta/10 p-4 bg-white/40"
                         style={{ clipPath: 'polygon(0 0, 100% 0, 97% 100%, 3% 100%)' }}>
                      <span className="font-mono text-violeta text-[8px] tracking-[0.4em] uppercase block">Próximos conciertos</span>
                      <div className="mt-2 space-y-1.5 max-h-40 overflow-y-auto">
                        {stageData.artists.slice(0, 8).map((a) => (
                          <div key={a.slug} className="flex justify-between items-center border-b border-violeta/5 pb-1">
                            <span className="font-mono text-black/70 text-[8px] tracking-wider truncate mr-2">{a.name}</span>
                            <span className="font-mono text-coral text-[7px] tracking-[0.2em] uppercase shrink-0">{a.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Destinos grid */}
              <div>
                <span className="font-mono text-texto-suave text-[9px] tracking-[0.4em] uppercase block mb-4">
                  {located ? 'Elige un destino' : 'Explora el recinto'}
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {destinos.map((d) => {
                    const isSelected = selected === d.id
                    return (
                      <button
                        key={d.id}
                        onClick={() => setSelected(selected === d.id ? null : d.id)}
                        className={`text-left border-2 p-3 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-coral bg-coral/10'
                            : 'border-violeta/10 bg-white/50 hover:border-violeta/30 hover:bg-white/70'
                        }`}
                        style={{ clipPath: 'polygon(0 0, 100% 0, 97% 100%, 3% 100%)' }}
                      >
                        <span className="text-lg block">{d.icon}</span>
                        <span className={`font-mono text-[8px] tracking-[0.2em] uppercase block mt-1 ${isSelected ? 'text-coral' : 'text-black/70'}`}>
                          {d.label}
                        </span>
                        {d.desc && (
                          <span className="font-ui text-black/40 text-[10px] block mt-0.5">{d.desc}</span>
                        )}
                        {isSelected && located && dist !== null && (
                          <span className="font-mono text-coral text-[7px] tracking-[0.15em] uppercase block mt-1">
                            {distanciaTexto(dist)}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  )
}
