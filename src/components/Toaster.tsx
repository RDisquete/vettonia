import { Toaster as SonnerToaster } from 'sonner'

export default function Toaster() {
  return (
    <SonnerToaster
      position="top-center"
      toastOptions={{
        style: {
          background: '#1a0e1e',
          color: '#f5f0e8',
          border: '1px solid rgba(58, 26, 74, 0.3)',
          borderRadius: '0',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '10px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          padding: '12px 20px',
        },
      }}
    />
  )
}
