import { useEffect, useState } from "react"
import { hotelCopy, hotelImages } from "../data/siteData"

export default function ContactPage() {
  const [message, setMessage] = useState("")

  useEffect(() => {
    const storedOrder = sessionStorage.getItem("nyotaFoodOrder")
    const storedRoomReservation = sessionStorage.getItem("nyotaRoomReservation")
    if (storedRoomReservation) {
      setMessage(storedRoomReservation)
    } else if (storedOrder) {
      setMessage(storedOrder)
    }
  }, [])

  return (
    <main className="pb-20">
      <section className="section-wrap pt-6">
        <div className="glass-surface overflow-hidden bg-[linear-gradient(135deg,rgba(13,32,28,0.86),rgba(113,70,28,0.52)),url('/images/sarova 9.jpeg')] bg-cover bg-center p-8 text-white sm:p-10">
          <p className="brand-kicker text-white/75">Bookings & Inquiries</p>
          <h1 className="mt-4 max-w-4xl text-5xl font-semibold leading-[0.95] sm:text-6xl">
            Give guests a clear place to reach out.
          </h1>
          <p className="mt-5 max-w-3xl font-sans-body text-sm leading-8 text-white/82 sm:text-base">
            Reach out for reservations, travel questions, dining requests, or special stay arrangements and begin planning your time at Nyota Springs Resort.
          </p>
        </div>
      </section>

      <section className="section-wrap mt-16 grid gap-6 lg:grid-cols-[1fr,0.95fr]">
        <div className="space-y-6">
          <div className="info-card">
            <p className="brand-kicker">Contact Details</p>
            <h2 className="mt-3 text-4xl font-semibold text-nyota-forest dark:text-nyota-sand">
              We are here to help with your stay plans.
            </h2>
            <p className="mt-5 font-sans-body text-sm leading-8 text-stone-600 dark:text-stone-300 sm:text-base">
              Connect with the resort team for bookings, guest support, and personalized assistance before your arrival.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                ["Phone", hotelCopy.phone],
                ["Email", hotelCopy.email],
                ["Location", hotelCopy.location],
              ].map(([title, value]) => (
                <div key={title} className="rounded-[24px] border border-stone-200 bg-stone-50/80 p-4 dark:border-white/10 dark:bg-white/5">
                  <h3 className="text-lg font-semibold text-nyota-forest dark:text-nyota-sand">{title}</h3>
                  <p className="mt-2 font-sans-body text-sm leading-7 text-stone-600 dark:text-stone-300">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="info-card">
            <p className="brand-kicker">Inquiry Form</p>
            <h2 className="mt-3 text-4xl font-semibold text-nyota-forest dark:text-nyota-sand">
              Send your stay inquiry.
            </h2>
            <p className="mt-5 font-sans-body text-sm leading-8 text-stone-600 dark:text-stone-300 sm:text-base">
              Share your preferred dates, guest count, or dining request so the resort team can help shape the right stay for you.
            </p>

            <form className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="font-sans-body text-sm text-stone-600 dark:text-stone-300">
                <span className="mb-2 block font-semibold">Full name</span>
                <input className="w-full rounded-[22px] border border-stone-200 bg-white px-4 py-3 outline-none focus:border-nyota-bronze focus:ring-4 focus:ring-amber-200 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:ring-amber-500/20" placeholder="Your name" />
              </label>
              <label className="font-sans-body text-sm text-stone-600 dark:text-stone-300">
                <span className="mb-2 block font-semibold">Email address</span>
                <input className="w-full rounded-[22px] border border-stone-200 bg-white px-4 py-3 outline-none focus:border-nyota-bronze focus:ring-4 focus:ring-amber-200 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:ring-amber-500/20" placeholder="you@example.com" />
              </label>
              <label className="font-sans-body text-sm text-stone-600 dark:text-stone-300">
                <span className="mb-2 block font-semibold">Check-in</span>
                <input className="w-full rounded-[22px] border border-stone-200 bg-white px-4 py-3 outline-none focus:border-nyota-bronze focus:ring-4 focus:ring-amber-200 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:ring-amber-500/20" placeholder="Preferred date" />
              </label>
              <label className="font-sans-body text-sm text-stone-600 dark:text-stone-300">
                <span className="mb-2 block font-semibold">Guests</span>
                <input className="w-full rounded-[22px] border border-stone-200 bg-white px-4 py-3 outline-none focus:border-nyota-bronze focus:ring-4 focus:ring-amber-200 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:ring-amber-500/20" placeholder="Number of guests" />
              </label>
              <label className="md:col-span-2 font-sans-body text-sm text-stone-600 dark:text-stone-300">
                <span className="mb-2 block font-semibold">Message</span>
                <textarea
                  rows="8"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  className="w-full rounded-[24px] border border-stone-200 bg-white px-4 py-4 outline-none focus:border-nyota-bronze focus:ring-4 focus:ring-amber-200 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:ring-amber-500/20"
                  placeholder="Tell us about your stay request"
                />
              </label>
              <div className="md:col-span-2">
                <button type="button" className="pill-button-primary">Send Inquiry</button>
              </div>
            </form>
          </div>
        </div>

        <div className="glass-surface overflow-hidden">
          <img src={hotelImages.villaNight} alt="Villa exterior at night" className="h-full min-h-[620px] w-full object-cover" />
        </div>
      </section>
    </main>
  )
}
