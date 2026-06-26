export default function GreenLayer() {
  return (
    <>
      {/* main diagonals */}
      <div className="absolute inset-0 bg-violeta/20"
        style={{ clipPath: 'polygon(0 0, 40% 0, 55% 40%, 30% 100%, 0 100%)' }} />
      <div className="absolute inset-0 bg-violeta/10"
        style={{ clipPath: 'polygon(55% 40%, 40% 0, 60% 0, 75% 45%, 45% 100%, 30% 100%)' }} />

      {/* extra capa */}
      <div className="absolute inset-0 bg-violeta/5"
        style={{ clipPath: 'polygon(75% 45%, 60% 0, 80% 0, 90% 35%, 85% 70%, 45% 100%)' }} />

      {/* solids */}
      <div className="absolute top-[30%] left-[42%] w-4 h-4 bg-violeta/40 rotate-45" />
      <div className="absolute top-[55%] left-[22%] w-3 h-3 bg-violeta/25 rotate-12" />
      <div className="absolute top-[38%] left-[35%] w-2 h-2 rounded-full bg-violeta/60" />
      <div className="absolute top-[60%] left-[15%] w-1.5 h-1.5 rounded-full bg-violeta/50" />
      <div className="absolute bottom-[25%] left-[10%] w-24 h-0.5 bg-violeta/25" />
      <div className="absolute top-[45%] left-[25%] w-16 h-px bg-violeta/20" />
      <div className="absolute top-[15%] left-[10%] w-px h-16 bg-violeta/15" />
      <div className="absolute bottom-[40%] left-[30%] w-px h-10 bg-violeta/10" />
      <div className="absolute top-[10%] left-[5%] w-20 h-20 rounded-full border-2 border-violeta/15" />
      <div className="absolute bottom-[15%] left-[45%] w-12 h-12 rounded-full border border-violeta/10" />
    </>
  )
}
