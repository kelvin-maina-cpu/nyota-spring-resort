import SectionTitle from "../components/SectionTitle"
import { hotelImages } from "../data/siteData"

export default function AboutPage() {
  return (
    <main className="pb-20">
      <section className="section-wrap pt-6">
        <div className="glass-surface overflow-hidden bg-[linear-gradient(135deg,rgba(13,32,28,0.86),rgba(113,70,28,0.52)),url('/images/Sarova 1.avif')] bg-cover bg-center p-8 text-white sm:p-10">
          <p className="brand-kicker text-white/75">About the resort</p>
          <h1 className="mt-4 max-w-4xl text-5xl font-semibold leading-[0.95] sm:text-6xl">
            Designed around calm luxury and memorable arrival moments.
          </h1>
          <p className="mt-5 max-w-3xl font-sans-body text-sm leading-8 text-white/80 sm:text-base">
            Discover a destination shaped by gardens, elegant architecture, tranquil pools, and a guest
            experience centered on comfort, beauty, and quiet luxury.
          </p>
        </div>
      </section>

      <section className="section-wrap mt-16 grid gap-6 lg:grid-cols-[1fr,1fr]">
        <div className="info-card">
          <p className="brand-kicker">Our Story</p>
          <h2 className="mt-3 text-4xl font-semibold text-nyota-forest dark:text-nyota-sand">
            Hospitality with warmth, space, and visual character.
          </h2>
          <p className="mt-5 font-sans-body text-sm leading-8 text-stone-600 dark:text-stone-300 sm:text-base">
            Nyota Springs Resort is imagined as a place where resort living feels both polished and relaxed.
            The outdoor areas suggest a destination setting, while the room interiors offer a quieter, more
            intimate rhythm for overnight stays.
          </p>
          <p className="mt-4 font-sans-body text-sm leading-8 text-stone-600 dark:text-stone-300 sm:text-base">
            Every part of the resort is designed to feel welcoming and unhurried, inviting guests to settle
            into a stay defined by privacy, comfort, and graceful hospitality.
          </p>
        </div>
        <div className="glass-surface overflow-hidden">
          <img src={hotelImages.waterFeature} alt="Resort landscape" className="h-full min-h-[420px] w-full object-cover" />
        </div>
      </section>

      <section className="section-wrap mt-16">
        <SectionTitle
          eyebrow="What Defines the Stay"
          title="Three pillars shaping the experience."
          copy="The character of the resort comes through in its balance of scenery, hospitality, and thoughtfully composed spaces."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Landscape Identity", "Water features, greenery, and curved pool forms create an immediately recognizable setting."],
            ["Comfortable Interiors", "Room imagery suggests warmth, layered materials, and a balance between rest and elegance."],
            ["Lasting Impression", "From first arrival to evening unwind, the resort is imagined to leave guests with a sense of calm."],
          ].map(([title, copy]) => (
            <div key={title} className="info-card">
              <h3 className="text-2xl font-semibold text-nyota-forest dark:text-nyota-sand">{title}</h3>
              <p className="mt-3 font-sans-body text-sm leading-8 text-stone-600 dark:text-stone-300">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-wrap mt-16 grid gap-6 lg:grid-cols-[1fr,1fr]">
        <div className="glass-surface overflow-hidden">
          <img src={hotelImages.villaNight} alt="Villa exterior at night" className="h-full min-h-[420px] w-full object-cover" />
        </div>
        <div className="info-card flex flex-col justify-center">
          <p className="brand-kicker">Evening Atmosphere</p>
          <h2 className="mt-3 text-4xl font-semibold text-nyota-forest dark:text-nyota-sand">
            A resort that still feels welcoming after sunset.
          </h2>
          <p className="mt-5 font-sans-body text-sm leading-8 text-stone-600 dark:text-stone-300 sm:text-base">
            The night-lit villa imagery gives the resort a stronger identity than a daylight-only setting.
            It adds a sense of arrival, exclusivity, and emotional warmth that defines the stay.
          </p>
        </div>
      </section>
    </main>
  )
}
