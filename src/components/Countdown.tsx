import { useState, useEffect } from 'react'

const FESTIVAL = new Date('2027-10-08T18:00:00+02:00')

function calc() {
  const diff = FESTIVAL.getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, over: true }
  const total = Math.floor(diff / 1000)
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
    over: false,
  }
}

export default function Countdown() {
  const [t, setT] = useState(calc)

  useEffect(() => {
    const id = setInterval(() => setT(calc), 1000)
    return () => clearInterval(id)
  }, [])

  if (t.over) return null

  const blocks = [
    { label: 'Días', value: t.days },
    { label: 'Horas', value: t.hours },
    { label: 'Min', value: t.minutes },
    { label: 'Seg', value: t.seconds },
  ]

  return (
    <div className="flex gap-3 sm:gap-4 lg:gap-6 justify-center lg:justify-start">
      {blocks.map((b) => (
        <div key={b.label} className="text-center">
          <span className="font-heading text-coral text-[clamp(2rem,6vw,4rem)] font-extrabold tracking-[-0.06em] leading-none block">
            {String(b.value).padStart(2, '0')}
          </span>
          <span className="font-mono text-texto-suave text-[7px] sm:text-[8px] tracking-[0.25em] uppercase block mt-1">
            {b.label}
          </span>
        </div>
      ))}
    </div>
  )
}
