const contentItems = [
  {
    title: 'Playlist Oficial',
    desc: 'Lo que sonó en Vettonia 2027. Una colección curada de los artistas que pasaron por los 3 escenarios.',
    link: 'https://open.spotify.com/playlist/37i9dQZF1DX4JAvHpjipBk',
    icon: '♫',
    color: 'coral',
  },
  {
    title: 'Fondos de Pantalla',
    desc: 'Lleva el cartel de Vettonia a tu móvil y escritorio. Porque esto no se acaba cuando acaba.',
    link: '#',
    icon: '▣',
    color: 'violeta',
    downloads: [
      { label: 'Móvil (1080×1920)', url: 'https://images.unsplash.com/photo-1768054180300-ab772bd09d0e?w=1080&h=1920&fit=crop' },
      { label: 'Escritorio (1920×1080)', url: 'https://images.unsplash.com/photo-1768054180300-ab772bd09d0e?w=1920&h=1080&fit=crop' },
    ],
  },
  {
    title: 'Cartel Oficial',
    desc: 'El póster de Vettonia 2027 para que lo imprimas, lo enmarques y lo tengas donde merece.',
    link: '#',
    icon: '⊞',
    color: 'coral',
    downloads: [
      { label: 'Cartel (A3 PDF)', url: 'https://images.unsplash.com/photo-1768054180300-ab772bd09d0e?w=2480&h=3508&fit=crop' },
      { label: 'Cartel (A4 PDF)', url: 'https://images.unsplash.com/photo-1768054180300-ab772bd09d0e?w=2480&h=3508&fit=crop' },
    ],
  },
  {
    title: 'Mixtape de Artistas',
    desc: 'Una selección de temas de los artistas que hicieron temblar el valle. Para que el viaje de vuelta no sea tan triste.',
    link: 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M',
    icon: '◉',
    color: 'violeta',
  },
]

const colorStyles = {
  coral: {
    bg: 'bg-coral/15',
    text: 'text-coral',
    border: 'border-coral/50',
    hoverBg: 'hover:bg-coral',
    hoverBorder: 'hover:border-coral',
  },
  violeta: {
    bg: 'bg-violeta/15',
    text: 'text-violeta',
    border: 'border-violeta/50',
    hoverBg: 'hover:bg-violeta',
    hoverBorder: 'hover:border-violeta',
  },
} as const

export default function ContentGrid() {
  return (
    <section className="px-5 pb-20">
      <div className="max-w-5xl mx-auto">
        <div className="border-l-4 border-violeta/50 pl-5 mb-8">
          <span className="font-heading text-violeta text-2xl sm:text-3xl font-extrabold tracking-[-0.04em]">
            CONTENIDO EXCLUSIVO
          </span>
          <p className="font-ui text-texto text-sm leading-relaxed mt-1">
            Para los que tienen pase. Todo lo que necesitas para que Vettonia no se acabe nunca.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {contentItems.map((item, i) => {
            const s = colorStyles[item.color as keyof typeof colorStyles] || colorStyles.coral
            return (
              <div key={i}
                className="border-2 border-violeta/10 bg-white/70 p-6 relative overflow-hidden group hover:border-violeta/20 transition-all"
                style={{ clipPath: 'polygon(0 0, 100% 0, 98% 100%, 2% 100%)' }}>
                <div className={`absolute top-0 right-0 w-20 h-20 ${s.bg} -rotate-12 translate-x-6 -translate-y-6`} />
                <span className={`${s.text} text-2xl block`}>{item.icon}</span>
                <p className="font-heading text-violeta text-base font-bold tracking-[-0.02em] mt-2">{item.title}</p>
                <p className="font-ui text-texto text-xs leading-relaxed mt-1">{item.desc}</p>

                {'downloads' in item && item.downloads ? (
                  <div className="mt-4 space-y-2">
                    {item.downloads.map((dl: { label: string; url: string }, j: number) => (
                      <a key={j} href={dl.url} download
                        className={`block border-l-4 ${s.border} bg-white/80 px-4 py-2 font-mono ${s.text} text-[9px] tracking-[0.2em] uppercase ${s.hoverBg} hover:text-white transition-all no-underline`}
                        style={{ clipPath: 'polygon(0 0, 100% 0, 98% 100%, 2% 100%)' }}>
                        {dl.label}
                      </a>
                    ))}
                  </div>
                ) : (
                  <a href={item.link} target="_blank" rel="noopener noreferrer"
                    className={`inline-block mt-4 border-l-4 border-t-2 border-r-2 border-b-2 ${s.border} px-5 py-2 ${s.hoverBg} ${s.hoverBorder} transition-all group/btn`}
                    style={{ clipPath: 'polygon(4% 0, 100% 0, 96% 100%, 0 100%)' }}>
                    <span className={`font-mono ${s.text} text-[10px] tracking-[0.4em] uppercase group-hover/btn:text-white transition-all`}>
                      Ir →
                    </span>
                  </a>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
