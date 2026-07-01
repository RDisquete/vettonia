import type { WallMessage } from '../../../types'
import { SkeletonBox, SkeletonText } from '../../../components/Skeleton'

function hashRange(id: string, seed: number): number {
  let hash = seed
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0
  }
  return (Math.abs(hash) % 200) / 100
}

interface Props {
  messages: WallMessage[]
  msgText: string
  msgAuthor: string
  loading?: boolean
  onMsgTextChange: (v: string) => void
  onMsgAuthorChange: (v: string) => void
  onAdd: () => void
  onDelete: (id: string) => void
}

export default function MessageWall({ messages, msgText, msgAuthor, loading, onMsgTextChange, onMsgAuthorChange, onAdd, onDelete }: Props) {
  if (loading) {
    return (
      <section className="px-5 pb-20">
        <div className="max-w-3xl mx-auto">
          <SkeletonText className="w-40 h-5 mb-2" />
          <SkeletonText className="w-60 h-3 mb-6" />
          <SkeletonBox className="w-full h-24 mb-3" />
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <SkeletonBox key={i} className="w-full h-20" />
            ))}
          </div>
        </div>
      </section>
    )
  }
  return (
    <section className="px-5 pb-20">
      <div className="max-w-3xl mx-auto">
        <div className="border-l-4 border-coral/50 pl-5 mb-8">
          <span className="font-heading text-violeta text-2xl sm:text-3xl font-extrabold tracking-[-0.04em]">
            MURO DE LA FAMA
          </span>
          <p className="font-ui text-texto text-sm leading-relaxed mt-1">
            Los que estuvieron dejan huella. Escribe algo. Lo que sea.
            Un recuerdo, un momento, un mensaje para quien lo lea.
          </p>
        </div>

        <div className="border-2 border-violeta/10 p-5 bg-white/70 mb-8"
             style={{ clipPath: 'polygon(0 0, 100% 0, 99% 100%, 1% 100%)' }}>
          <textarea value={msgText} onChange={(e) => onMsgTextChange(e.target.value)}
            className="font-mono text-violeta text-sm bg-transparent border-2 border-violeta/10 px-4 py-3 w-full outline-none placeholder:text-texto-suave/60 resize-none h-20 focus:border-coral/50 transition-colors"
            placeholder="Escribe algo. Una sensación, un grito, una dedicatoria..." />
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            <input value={msgAuthor} onChange={(e) => onMsgAuthorChange(e.target.value)}
              className="font-mono text-violeta text-xs bg-transparent border-2 border-violeta/10 px-3 py-2 outline-none placeholder:text-texto-suave/60 tracking-[0.2em] uppercase focus:border-coral/50 transition-colors flex-1 min-w-30"
              placeholder="Tu nombre o apodo" />
            <button onClick={onAdd} disabled={!msgText.trim()}
              className={`border-l-4 border-t-2 border-r-2 border-b-2 px-6 py-2 cursor-pointer transition-all group ${
                !msgText.trim()
                  ? 'border-black/20 text-texto-suave/70 pointer-events-none'
                  : 'border-violeta/40 hover:bg-violeta hover:border-violeta'
              }`}
              style={{ clipPath: 'polygon(4% 0, 100% 0, 96% 100%, 0 100%)' }}>
              <span className={`font-mono text-[10px] tracking-[0.4em] uppercase transition-all block whitespace-nowrap ${
                msgText.trim() ? 'text-violeta group-hover:text-white' : ''
              }`}>
                Publicar
              </span>
            </button>
          </div>
        </div>

        {messages.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-violeta/20 bg-white/40"
               style={{ clipPath: 'polygon(1% 0, 100% 0, 99% 100%, 2% 100%)' }}>
            <span className="font-heading text-violeta/30 text-6xl font-extrabold tracking-[-0.08em] block leading-none">_</span>
            <p className="font-heading text-violeta text-lg font-extrabold tracking-[-0.04em] mt-3">
              Nadie ha soltado palabra todavía
            </p>
            <p className="font-ui text-texto text-sm mt-1 max-w-sm mx-auto">
              El muro está en blanco. Como la mente cuando termina el festival.
              Pero seguro que algo tienes que decir.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => (
              <div key={msg.id}
                className="border-2 border-violeta/10 bg-white/70 p-4 relative group"
                style={{ clipPath: `polygon(${hashRange(msg.id, 0)}% 0, ${100 - hashRange(msg.id, 1)}% 0, ${100 - hashRange(msg.id, 2)}% 100%, ${hashRange(msg.id, 3)}% 100%)` }}>
                <p className="font-ui text-violeta text-sm leading-relaxed pr-6">&ldquo;{msg.text}&rdquo;</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-coral text-[9px] tracking-[0.2em] uppercase">{msg.author}</span>
                    <span className="text-texto-suave/70 text-[5px]">·</span>
                    <span className="font-mono text-texto-suave text-[7px] tracking-widest">
                      {new Date(msg.createdAt).toLocaleDateString('es', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <button onClick={() => onDelete(msg.id)}
                    className="font-mono text-texto-suave/50 text-[7px] tracking-[0.2em] uppercase hover:text-coral transition-colors cursor-pointer opacity-0 group-hover:opacity-100">
                    Borrar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
