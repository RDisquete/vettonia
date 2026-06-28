import { useMemo } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { encodePassQR } from '../../../services/qr'

interface PassQRProps {
  passName: string
  passNumber: string
}

export default function PassQR({ passName, passNumber }: PassQRProps) {
  const qrData = useMemo(
    () => encodePassQR(passName || 'Sin nombre', passNumber || '---'),
    [passName, passNumber]
  )

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="bg-white p-2 rounded-sm shadow-lg">
        <QRCodeSVG value={qrData} size={80} level="M" />
      </div>
      <span className="font-mono text-white/50 text-[6px] tracking-[0.4em] uppercase">QR Pass</span>
    </div>
  )
}
