import GalleryCard from "../components/GalleryCard"
import SectionTitle from "../components/SectionTitle"
import { galleryImages } from "../data/siteData"

export default function GalleryPage() {
  return (
    <main className="pb-20">
      <section className="section-wrap pt-6">
        <div className="glass-surface overflow-hidden bg-[linear-gradient(135deg,rgba(13,32,28,0.84),rgba(113,70,28,0.48)),url('/images/sarova 11.jpeg')] bg-cover bg-center p-8 text-white sm:p-10">
          <p className="brand-kicker text-white/75">Visual Tour</p>
          <h1 className="mt-4 max-w-4xl text-5xl font-semibold leading-[0.95] sm:text-6xl">
            A fuller gallery for the resort atmosphere.
          </h1>
          <p className="mt-5 max-w-3xl font-sans-body text-sm leading-8 text-white/82 sm:text-base">
            Explore exterior beauty, room interiors, and signature moments that shape the experience of Nyota Springs Resort.
          </p>
        </div>
      </section>

      <section className="section-wrap mt-16">
        <SectionTitle
          eyebrow="Image Collection"
          title="Property views, room interiors, and signature spaces."
          copy="Each image offers a closer look at the setting, comfort, and sense of escape that define the resort."
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {galleryImages.map((item) => (
            <GalleryCard key={item.title} item={item} />
          ))}
        </div>
      </section>
    </main>
  )
}
