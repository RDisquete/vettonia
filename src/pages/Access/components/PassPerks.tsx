import { Link } from 'react-router-dom'

const perks = [
  { icon: '▤', title: 'Álbum privado', desc: 'Fotos que solo los que estuvieron pueden ver', color: 'border-l-coral', to: '/gallery' },
  { icon: '♫', title: 'Contenido exclusivo', desc: 'Playlists, fondos, carteles descargables', color: 'border-l-violeta', to: '#' },
  { icon: '◈', title: 'Muro de la fama', desc: 'Deja tu huella para que otros la vean', color: 'border-l-coral', to: '#' },
  { icon: '◉', title: 'Estadísticas', desc: 'Tus números, tus momentos, tu historia', color: 'border-l-violeta', to: '#' },
]

export default function PassPerks() {
  return (
    <div className="space-y-6">
      <div className="border-l-4 border-coral/50 pl-5">
        <span className="font-heading text-violeta text-xl sm:text-2xl font-extrabold tracking-[-0.04em]">
          Esto es lo que tienes
        </span>
        <p className="font-ui text-texto text-sm leading-relaxed mt-2">
          No es solo un código. Es tu entrada a todo lo que pasa aquí dentro.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {perks.map((item, i) => (
          <Link key={i} to={item.to}
            className={`border-l-4 ${item.color} bg-white/60 border-2 border-violeta/5 p-4 hover:bg-white hover:border-violeta/20 transition-all no-underline`}
            style={{ clipPath: 'polygon(0 0, 100% 0, 98% 100%, 2% 100%)' }}>
            <span className="text-coral text-lg">{item.icon}</span>
            <p className="font-heading text-violeta text-sm font-bold tracking-[-0.02em] mt-1">{item.title}</p>
            <p className="font-ui text-texto text-[11px] leading-tight mt-0.5">{item.desc}</p>
          </Link>
        ))}
      </div>

      <div className="border-2 border-violeta/10 p-5 bg-white/60"
           style={{ clipPath: 'polygon(0 0, 100% 0, 99% 100%, 1% 100%)' }}>
        <div className="flex items-center gap-3">
          <span className="font-heading text-coral text-3xl font-extrabold tracking-[-0.08em]">!</span>
          <p className="font-ui text-texto text-xs leading-relaxed">
            Cuando cierres el navegador, el pase caduca. Pero vuelves, metes tu código y todo sigue aquí.
          </p>
        </div>
      </div>
    </div>
  )
}
