import { Link } from 'react-router-dom'

type Props = {
  icon?: string
  title: string
  description?: string
  action?: { label: string; to?: string; onClick?: () => void }
}

export default function EmptyState({ icon, title, description, action }: Props) {
  return (
    <div className="border-2 border-dashed border-violeta/20 p-8 text-center bg-white/40">
      {icon && <span className="font-heading text-violeta/20 text-6xl block leading-none mb-2">{icon}</span>}
      <p className="font-heading text-violeta text-base font-bold tracking-[-0.04em]">{title}</p>
      {description && (
        <p className="font-ui text-texto-suave text-sm mt-1 max-w-sm mx-auto">{description}</p>
      )}
      {action && action.to && (
        <Link to={action.to}
          className="font-mono text-coral text-[9px] tracking-[0.3em] uppercase underline underline-offset-4 hover:text-violeta transition-colors mt-3 inline-block">
          {action.label}
        </Link>
      )}
      {action && action.onClick && !action.to && (
        <button onClick={action.onClick}
          className="font-mono text-coral text-[9px] tracking-[0.3em] uppercase underline underline-offset-4 hover:text-violeta transition-colors cursor-pointer mt-3">
          {action.label}
        </button>
      )}
    </div>
  )
}
