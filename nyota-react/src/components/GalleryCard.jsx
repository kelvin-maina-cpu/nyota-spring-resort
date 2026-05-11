export default function GalleryCard({ item }) {
  return (
    <article className="glass-surface overflow-hidden">
      <img src={item.image} alt={item.title} className="h-64 w-full image-primary" />
      <div className="space-y-2 p-5">
        <h3 className="text-2xl font-semibold text-nyota-forest dark:text-nyota-sand">{item.title}</h3>
        <p className="font-sans-body text-sm leading-7 text-high-contrast-secondary">{item.description}</p>
      </div>
    </article>
  )
}
