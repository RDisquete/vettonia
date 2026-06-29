import Hero from '../sections/Hero'
import LiveTicker from '../sections/LiveTicker'
import Manifiesto from '../sections/Manifiesto'
import LineupPreview from '../sections/LineupPreview'
import Mapa from '../sections/Mapa'
import Galeria from '../sections/Galeria'
import SubeTuFoto from '../sections/SubeTuFoto'
import Acceso from '../sections/Acceso'
import Footer from '../sections/Footer'
import HamburgerNav from '../components/HamburgerNav'
import AlertBanner from '../components/AlertBanner'
import SEO from '../components/SEO'
import JsonLd from '../components/JsonLd'

const eventSchema = {
  '@context': 'https://schema.org',
  '@type': 'MusicFestival',
  name: 'Vettonia 2026',
  description: 'Vettonia 2026 — Música, arte y naturaleza. 48 artistas, 3 escenarios. 14 · 15 · 16 de agosto.',
  startDate: '2026-08-14',
  endDate: '2026-08-16',
  location: { '@type': 'Place', name: 'Extremadura' },
  organizer: { '@type': 'Organization', name: 'Vettonia' },
  image: 'https://vettoniafestival.com/hero.jpg',
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-svh bg-arena">
      <SEO
        title="Vettonia 2026"
        description="Vettonia 2026 — Música, arte y naturaleza. Festival único en Extremadura. 48 artistas, 3 escenarios. 14 · 15 · 16 de agosto."
        path="/"
      />
      <JsonLd data={eventSchema} />
      <HamburgerNav />
      <AlertBanner />
      <div className="flex-1">
        <Hero />
        <LiveTicker />
        <Manifiesto />
        <LineupPreview />
        <Mapa />
        <Galeria />
        <SubeTuFoto />
        <Acceso />
      </div>
      <Footer />
    </div>
  )
}
