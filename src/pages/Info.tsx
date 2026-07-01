import HamburgerNav from '../components/HamburgerNav'
import { SolidBox, SolidDot, SolidLine, SolidRing, SolidTri } from '../components/Solids'
import Footer from '../sections/Footer'
import SEO from '../components/SEO'

const sections = [
  {
    label: 'General',
    items: [
      { q: '¿CUÁNDO ES?', a: '14 · 15 · 16 de agosto. Abrimos puertas a las 16:00 el primer día. No llegues tarde o te pierdes el primer directo.' },
      { q: '¿DÓNDE?', a: 'En el corazón de Extremadura, a medio camino entre Cáceres y Badajoz. La ubicación exacta la sabrás 72h antes del festival. Te enviaremos un email con las coordenadas y un mapa. No, no te vamos a hacer spoiler.' },
      { q: '¿HORARIOS?', a: 'Puertas abiertas de 16:00 a 08:00 todos los días. La música no para. Los escenarios principales se turnan para que siempre haya algo que ver (o bailar).' },
      { q: '¿CUÁNTO CUESTA?', a: 'Abonos desde 95€ (primer lote). Entradas de día a 45€. Los primeros 500 abonos llevan una camiseta serigrafiada de regalo.' },
    ],
  },
  {
    label: 'Cómo llegar',
    items: [
      { q: '¿CÓMO LLEGO?', a: 'Autobuses lanzadera desde Cáceres, Badajoz, Mérida y Plasencia. Parking gratuito si vienes en coche (2.000 plazas). Y si vienes andando desde el pueblo más cercano, igual te montas algo por el camino.' },
      { q: '¿HAY TREN?', a: 'La estación más cercana es Cáceres. Desde allí sale un bus lanzadera especial cada hora durante los días del festival. El trayecto son 35 minutos.' },
      { q: '¿Y AVIÓN?', a: 'Los aeropuertos más cercanos son Badajoz (45 min) y Madrid-Barajas (2h 30min). Desde ambos hay conexión de bus hasta las respectivas ciudades con lanzadera.' },
    ],
  },
  {
    label: 'Alojamiento',
    items: [
      { q: '¿HAY CAMPING?', a: 'Zona de acampada gratuita incluida en el abono. Capacidad para 3.000 tiendas. Hay zonas de sombra, duchas de agua fría (sí, fría, que esto es Extremadura) y baños químicos con limpieza cada 4 horas.' },
      { q: '¿PUEDO TRAER MI AUTOCARAVANA?', a: 'Zona reservada para autocaravanas y furgonetas camperizadas. Necesitas un ticket adicional (25€). No hay conexión eléctrica pero sí punto de vaciado de aguas grises.' },
      { q: '¿HAY ALOJAMIENTO CERCA?', a: 'Casas rurales en los pueblos de alrededor. Te recomendamos reservar con antelación porque vuelan. Si necesitas ayuda, escríbenos y te echamos un cable.' },
    ],
  },
  {
    label: 'Normas',
    items: [
      { q: '¿HAY EDAD MÍNIMA?', a: 'Mayores de 18. Los menores de 16 a 17 pueden entrar con autorización firmada y responsable legal presente en el recinto. Menores de 16 no, lo sentimos.' },
      { q: '¿QUÉ PUEDO TRAER?', a: 'Tienda de campaña, linterna, cantimplora vacía, comida para el día, protector solar, repelente de mosquitos y muchas ganas. La cobertura móvil no funciona en el valle — y eso es parte del plan.' },
      { q: '¿QUÉ NO PUEDO TRAER?', a: 'Vidrio, pirotecnia, armas, sustancias ilegales, drones, mascotas (excepto perro guía) y malas vibraciones. El criterio de la organización es soberano.' },
      { q: '¿SE PUEDE FUMAR?', a: 'Solo en zonas habilitadas. El recinto tiene espacios libres de humo cerca de los escenarios y zonas de descanso. Cuida el monte, que estamos en terreno sensible.' },
      { q: '¿HAY CONSIGNA?', a: 'Sí, taquillas de 20x30x40 por 5€ el día. No aceptamos objetos de valor en consigna. Hay un punto de objetos perdidos junto a información.' },
    ],
  },
  {
    label: 'Servicios',
    items: [
      { q: '¿Y LA COMIDA?', a: '14 puestos de comida con producto local y de temporada. Vegano, celíaco, omnívoro — todos tienen opción. No dejes que te cuenten lo de la torta de la serena, pruébala tú mismo.' },
      { q: '¿AGUA?', a: '3 fuentes de agua potable repartidas por el recinto. También hay 2 bares con bebidas frías y café de especialidad. El agua de las fuentes es gratis, obviamente.' },
      { q: '¿PRIMEROS AUXILIOS?', a: 'Punto médico abierto 24h junto al escenario principal. Enfermeras, médico y psicólogo de guardia. Si necesitas medicación específica, avísanos al comprar tu entrada.' },
      { q: '¿HAY CAJEROS?', a: 'Sí, 4 cajeros automáticos en la zona de servicios. Te recomendamos llevar efectivo porque el datáfono a veces pierde la señal (estamos en un valle, ¿recuerdas?).' },
      { q: '¿ACCESIBILIDAD?', a: 'Recinto adaptado con rampas, plataformas elevadas junto a los escenarios para silla de ruedas, baños accesibles y bucle magnético en información. Escríbenos si necesitas asistencia específica.' },
    ],
  },
  {
    label: 'Sostenibilidad',
    items: [
      { q: '¿VASOS REUTILIZABLES?', a: 'Sí, el sistema de vasos con fianza (2€). Guarda el ticket, lo devuelves, recuperas tu dinero. El año pasado recuperamos el 94% de los vasos. A ver si este año llegamos al 100.' },
      { q: '¿RECICLAJE?', a: 'Puntos de reciclaje en cada esquina del recinto. Orgánico, plástico, papel y vidrio separados. Si te ve un voluntario reciclando bien, igual te cae un pin de Vettonia.' },
      { q: '¿HUELLA DE CARBONO?', a: 'Compensamos las emisiones del festival con reforestación en la comarca. Cada entrada planta un árbol. El año pasado plantamos 12.000 encinas y alcornoques.' },
    ],
  },
]

export default function Info() {
  return (
    <div className="flex flex-col min-h-svh bg-arena">
      <SEO
        title="Info"
        description="Todo lo que necesitas saber sobre Vettonia 2027: fechas, horarios, ubicación, precios, normas y más."
        path="/info"
      />
      <HamburgerNav />
      <div className="flex-1">
        <section className="px-5 py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-violeta/12"
            style={{ clipPath: 'polygon(0 0, 35% 0, 20% 100%, 0 100%)' }} />
          <div className="absolute inset-0 bg-coral/12"
            style={{ clipPath: 'polygon(80% 0, 100% 0, 95% 100%, 65% 100%)' }} />

          <span className="absolute font-heading text-[clamp(10rem,35vw,30rem)] font-extrabold text-violeta/6 leading-none tracking-[-0.08em] select-none pointer-events-none top-[-5%] right-[-5%]">
            INFO
          </span>

          <SolidBox className="w-14 h-14 bg-coral/80 left-[4%] top-[5%] z-30 rotate-20" />
          <SolidRing className="w-28 h-28 border-violeta/40 right-[-2%] top-[4%] z-30" />
          <SolidDot className="w-8 h-8 bg-violeta/80 left-[12%] top-[38%] z-30" />
          <SolidLine className="w-36 h-0.75 bg-coral/60 right-[12%] top-[48%] z-30 rotate-1" />
          <SolidTri className="w-18 h-18 bg-coral/50 left-[55%] top-[8%] z-30 rotate-35" />
          <SolidRing className="w-20 h-20 border-coral/50 right-[5%] top-[58%] z-30" />
          <SolidBox className="w-10 h-10 bg-violeta/70 right-[30%] bottom-[18%] z-30 rotate-35" />
          <SolidLine className="w-28 h-0.75 bg-violeta/50 left-[5%] top-[70%] z-30 -rotate-3" />
          <SolidDot className="w-7 h-7 bg-coral/80 left-[35%] bottom-[8%] z-30" />
          <SolidRing className="w-12 h-12 border-violeta/60 left-[8%] bottom-[12%] z-30" />

            <h1 className="font-heading text-violeta text-[clamp(3rem,8vw,6rem)] font-extrabold leading-none tracking-[-0.08em] [text-shadow:5px_5px_0_#e85d6f]">
              INFO
            </h1>
            <span className="font-mono text-texto-suave text-[9px] tracking-[0.5em] uppercase block mt-1">Todo lo que necesitas saber</span>

            <div className="mt-10 space-y-16">
              {sections.map((section) => (
                <div key={section.label}>
                  <div className="flex items-center gap-4 mb-8">
                    <span className="font-mono text-texto-suave text-[8px] tracking-[0.4em] uppercase">{section.label}</span>
                    <span className="h-px flex-1 bg-violeta/10" />
                  </div>
                  <div className="space-y-8">
                    {section.items.map((item, i) => (
                      <div key={item.q} className="flex gap-5">
                        <span className="font-heading text-violeta/20 text-5xl sm:text-7xl font-extrabold leading-none tracking-[-0.08em] select-none shrink-0 -mt-1">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <div>
                          <p className="font-heading text-violeta text-lg sm:text-xl font-bold tracking-[-0.03em]">{item.q}</p>
                          <p className="font-ui text-texto text-sm sm:text-base leading-relaxed mt-2">{item.a}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-14 border-t-2 border-violeta/10 pt-8">
              <p className="font-mono text-texto-suave text-[8px] tracking-[0.3em] uppercase">
                ¿Algo más? Escríbenos a rafael.doradozamoro@gmail.com
              </p>
            </div>
        </section>
      </div>
      <Footer />
    </div>
  )
}
