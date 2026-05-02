import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { galleryImages, hotelImages, rooms } from "../data/siteData"
import SectionTitle from "../components/SectionTitle"
import InfoStat from "../components/InfoStat"
import RoomCard from "../components/RoomCard"

export default function HomePage() {
  return (
    <main className="pb-20">
      <section className="section-wrap grid gap-6 pt-6 lg:grid-cols-[1.06fr,0.94fr]">
        <motion.article
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative min-h-[580px] overflow-hidden rounded-[36px] bg-[linear-gradient(135deg,rgba(13,32,28,0.86),rgba(95,66,30,0.58)),url('/images/sarova 10.jpeg')] bg-cover bg-center px-8 py-10 text-white shadow-nyota sm:px-10"
        >
          <div className="absolute inset-5 rounded-[28px] border border-white/15" />
          <div className="absolute right-6 top-6 rounded-[22px] border border-white/15 bg-white/10 px-4 py-4 backdrop-blur-md">
            <strong className="block text-lg">Private Stay</strong>
            <span className="mt-1 block font-sans-body text-sm text-white/80">
              Pool views, villas, dining, and garden calm.
            </span>
          </div>
          <div className="relative z-10 flex h-full max-w-3xl flex-col justify-end">
            <p className="brand-kicker text-white/75">Refined hospitality retreat</p>
            <h1 className="mt-4 max-w-[10ch] text-5xl font-semibold leading-[0.92] sm:text-7xl">
              Where quiet luxury meets water, light, and landscape.
            </h1>
            <p className="mt-5 max-w-2xl font-sans-body text-sm leading-8 text-white/82 sm:text-base">
              Nyota Springs Resort welcomes guests into a calm destination shaped by elegant villas,
              thoughtful service, memorable dining, and a slower rhythm of comfort.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/rooms" className="pill-button-primary">Explore Rooms</Link>
              <Link to="/dining#menu" className="pill-button-secondary">View Dining</Link>
            </div>
          </div>
        </motion.article>

        <div className="grid gap-4">
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-surface overflow-hidden p-4"
          >
            <div className="relative h-[400px] overflow-hidden rounded-[28px]">
              <img src={hotelImages.pool} alt="Resort pool" className="h-full w-full object-cover" />
              <div className="absolute inset-x-4 bottom-4 rounded-[20px] bg-black/35 p-4 text-white backdrop-blur-md">
                <strong className="block text-lg">Curated resort atmosphere</strong>
                <span className="mt-1 block font-sans-body text-sm text-white/80">
                  Warm villas, layered water features, and a relaxed luxury mood.
                </span>
              </div>
            </div>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[hotelImages.waterFeature, hotelImages.deck, hotelImages.aerial].map((image, index) => (
              <motion.div
                key={image}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + index * 0.06 }}
                className="glass-surface overflow-hidden"
              >
                <img src={image} alt="" className="h-44 w-full object-cover" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-wrap mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <InfoStat value="05" label="Distinct pages for stays, dining, gallery, and guest contact." />
        <InfoStat value="11" label="Current local image assets carried over into the React version." />
        <InfoStat value="100%" label="A richer app structure while preserving the live dining order flow." />
        <InfoStat value="24/7" label="A polished resort identity built for leisure, retreat, and celebration." />
      </section>

      <section className="section-wrap mt-16">
        <SectionTitle
          eyebrow="The Resort Experience"
          title="An arrival shaped by elegance, calm, and memorable surroundings."
          copy="From the first view of the grounds to the warmth of the interiors, every corner of Nyota Springs Resort is imagined as a place to slow down and settle in."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Signature Arrival", "A graceful welcome framed by architecture, atmosphere, and a strong sense of place."],
            ["Resort Comfort", "Inviting rooms and peaceful corners designed to make every stay feel restorative."],
            ["Timeless Atmosphere", "Water, greenery, and warm evening light combine to create a lasting impression."],
          ].map(([title, copy]) => (
            <div key={title} className="info-card">
              <h3 className="text-2xl font-semibold text-nyota-forest dark:text-nyota-sand">{title}</h3>
              <p className="mt-3 font-sans-body text-sm leading-8 text-stone-600 dark:text-stone-300">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-wrap mt-16 grid gap-6 lg:grid-cols-[0.95fr,1.05fr]">
        <div className="glass-surface overflow-hidden">
          <img src={hotelImages.exterior} alt="Nyota Springs Resort exterior" className="h-full min-h-[440px] w-full object-cover" />
        </div>
        <div className="info-card flex flex-col justify-center">
          <p className="brand-kicker">Resort Story</p>
          <h2 className="mt-3 text-4xl font-semibold text-nyota-forest dark:text-nyota-sand">A destination defined by warmth and character.</h2>
          <p className="mt-5 max-w-2xl font-sans-body text-sm leading-8 text-stone-600 dark:text-stone-300 sm:text-base">
            The resort experience moves naturally from elegant arrival moments to poolside ease, peaceful
            garden settings, and interiors created for rest, comfort, and private celebration.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/about" className="pill-button-primary">Read More</Link>
            <Link to="/contact" className="pill-button-secondary">Make Inquiry</Link>
          </div>
        </div>
      </section>

      <section className="section-wrap mt-16">
        <SectionTitle
          eyebrow="Featured Rooms"
          title="Accommodations designed for comfort, privacy, and ease."
          copy="Each stay category offers its own mood, from calm garden-facing rooms to more exclusive villa-style escapes."
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {rooms.map((room) => (
            <RoomCard key={room.title} room={room} />
          ))}
        </div>
      </section>

      <section className="section-wrap mt-16 grid gap-6 lg:grid-cols-[1fr,0.95fr]">
        <div className="info-card flex flex-col justify-center">
          <p className="brand-kicker">Resort Dining</p>
          <h2 className="mt-3 text-4xl font-semibold text-nyota-forest dark:text-nyota-sand">
            Enjoy guest favorites prepared for every appetite.
          </h2>
          <p className="mt-5 max-w-2xl font-sans-body text-sm leading-8 text-stone-600 dark:text-stone-300 sm:text-base">
            From elegant breakfasts to fresh lunch plates, indulgent desserts, and crafted drinks, the
            dining menu now includes a polished ordering experience built into the React app.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/dining#menu" className="pill-button-primary">Order a Meal</Link>
            <Link to="/dining" className="pill-button-secondary">See Full Menu</Link>
          </div>
        </div>
        <div className="glass-surface overflow-hidden">
          <img src={galleryImages[9].image} alt="Resort aerial" className="h-full min-h-[380px] w-full object-cover" />
        </div>
      </section>
    </main>
  )
}
