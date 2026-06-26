import { Component, type ReactNode } from 'react'

type Props = { children: ReactNode; fallback?: ReactNode }

type State = { hasError: boolean }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="border-2 border-dashed border-coral/30 p-8 text-center bg-white/40">
          <p className="font-heading text-coral text-lg font-bold tracking-[-0.04em]">Algo salió mal</p>
          <p className="font-ui text-texto-suave text-sm mt-2">No pudimos cargar esta sección.</p>
          <button onClick={() => this.setState({ hasError: false })}
            className="font-mono text-violeta text-[9px] tracking-[0.3em] uppercase underline underline-offset-4 hover:text-coral transition-colors cursor-pointer mt-3">
            Reintentar
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
