import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import SectionTitle from "../components/SectionTitle"
import RoomCard from "../components/RoomCard"
import { rooms, hotelImages } from "../data/siteData"

export default function RoomsPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  function handleReserve(room) {
    if (!user) {
      navigate("/login")
      return
    }

    sessionStorage.setItem(
      "nyotaRoomReservation",
      `I would like to reserve the ${room.title}. Please contact me to confirm availability.`,
    )
    navigate("/contact")
  }

  return (
    <main className="pb-20">
      <section className="section-wrap pt-6">
        <div className="glass-surface overflow-hidden bg-[linear-gradient(135deg,rgba(13,32,28,0.85),rgba(113,70,28,0.55)),url('/images/sarova 5.jpeg')] bg-cover bg-center p-8 text-white sm:p-10">
          <p className="brand-kicker text-white/75">Rooms & Suites</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight sm:text-6xl">
            Stay choices with more room to breathe.
          </h1>
          <p className="mt-5 max-w-3xl font-sans-body text-sm leading-8 text-white/82 sm:text-base">
            Explore a collection of rooms and private stays designed for restful nights, elegant comfort,
            and a seamless resort experience.
          </p>
        </div>
      </section>

      <section className="section-wrap mt-16">
        <SectionTitle
          eyebrow="Accommodation Collection"
          title="Curated room types for different kinds of travel."
          copy="From intimate guest rooms to more private villa-style stays, each option is tailored for comfort, atmosphere, and ease."
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {rooms.map((room) => (
            <RoomCard key={room.title} room={room} onReserve={handleReserve} />
          ))}
          <RoomCard
            room={{
              title: "Poolside Residence",
              image: hotelImages.deck,
              guests: "20 to 30 Guests",
              price: "$285 / night",
              description: "A larger option for guests who want easy access to the outdoor deck and shared social spaces.",
            }}
            onReserve={handleReserve}
          />
          <RoomCard
            room={{
              title: "Private Evening Villa",
              image: hotelImages.villaNight,
              guests: "10 Guests",
              price: "$320 / night",
              description: "A more exclusive stay option imagined around privacy, lighting, and lawn-side arrival.",
            }}
          />
        </div>
      </section>
    </main>
  )
}
