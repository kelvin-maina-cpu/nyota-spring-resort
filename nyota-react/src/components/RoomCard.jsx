export default function RoomCard({ room, onReserve }) {
  return (
    <article className="glass-surface overflow-hidden">
      <img src={room.image} alt={room.title} className="h-64 w-full image-primary" />
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-semibold text-nyota-forest dark:text-nyota-sand">{room.title}</h3>
            <p className="mt-1 font-sans-body text-sm text-high-contrast-muted">{room.guests}</p>
          </div>
          <span className="font-sans-body text-sm font-semibold text-nyota-bronze">{room.price}</span>
        </div>
        <p className="font-sans-body text-sm leading-7 text-high-contrast-secondary">{room.description}</p>
        <button
          type="button"
          onClick={() => onReserve(room)}
          className="pill-button-primary w-full"
        >
          Reserve now
        </button>
      </div>
    </article>
  )
}
