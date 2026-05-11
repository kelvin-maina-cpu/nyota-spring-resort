import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import CartPanel from "../components/dining/CartPanel"
import MealCard from "../components/dining/MealCard"
import MealModal from "../components/dining/MealModal"
import SectionTitle from "../components/SectionTitle"
import { API_URL } from "../config"
import { diningCategories, meals } from "../data/siteData"

function formatMoney(value) {
  return `KSh ${value.toFixed(2)}`
}

function Toast({ message }) {
  return (
    <AnimatePresence>
      {message ? (
        <motion.div
          initial={{ opacity: 0, y: -12, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          className="fixed right-4 top-4 z-[70] rounded-full border border-white/50 bg-white/90 px-5 py-3 font-sans-body text-sm font-semibold text-nyota-forest shadow-nyota-soft backdrop-blur-lg dark:border-white/10 dark:bg-[#163228]/90 dark:text-nyota-sand"
        >
          {message}
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

function SkeletonCard() {
  return (
    <div className="glass-surface overflow-hidden">
      <div className="h-60 animate-pulse bg-stone-200 dark:bg-white/10" />
      <div className="space-y-4 p-5">
        <div className="h-4 w-24 rounded-full bg-stone-200 dark:bg-white/10" />
        <div className="h-6 w-3/4 rounded-full bg-stone-200 dark:bg-white/10" />
        <div className="h-4 rounded-full bg-stone-200 dark:bg-white/10" />
        <div className="h-4 w-5/6 rounded-full bg-stone-200 dark:bg-white/10" />
      </div>
    </div>
  )
}

export default function DiningPage() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [search, setSearch] = useState("")
  const [cart, setCart] = useState([])
  const [selectedMeal, setSelectedMeal] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [note, setNote] = useState("")
  const [toast, setToast] = useState("")
  const [loading, setLoading] = useState(true)
  const [orderConfirmation, setOrderConfirmation] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [tableNumber, setTableNumber] = useState("")
  const [tableError, setTableError] = useState("")

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 800)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!toast) return undefined
    const timer = window.setTimeout(() => setToast(""), 2200)
    return () => window.clearTimeout(timer)
  }, [toast])

  const counts = useMemo(
    () =>
      diningCategories.reduce((acc, category) => {
        acc[category] =
          category === "All"
            ? meals.length
            : meals.filter((meal) => meal.category === category).length
        return acc
      }, {}),
    [],
  )

  const chefSpecial = meals.find((meal) => meal.chefSpecial)

  const filteredMeals = useMemo(() => {
    const term = search.trim().toLowerCase()
    return meals.filter((meal) => {
      const matchesCategory = activeCategory === "All" || meal.category === activeCategory
      const haystack = [meal.name, meal.description, meal.category, meal.tags.join(" ")].join(" ").toLowerCase()
      const matchesSearch = term ? haystack.includes(term) : true
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, search])

  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart],
  )

  function openMeal(meal) {
    setSelectedMeal(meal)
    setQuantity(1)
    setNote("")
  }

  function addToCart() {
    if (!selectedMeal) return
    const key = `${selectedMeal.id}-${note.trim() || "plain"}`
    setCart((current) => {
      const existing = current.find((item) => item.key === key)
      if (existing) {
        return current.map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + quantity } : item,
        )
      }

      return [
        ...current,
        {
          key,
          id: selectedMeal.id,
          name: selectedMeal.name,
          price: selectedMeal.price,
          quantity,
          note: note.trim(),
          waitTime: selectedMeal.waitTime,
        },
      ]
    })
    setSelectedMeal(null)
    setToast(`${selectedMeal.name} added to your order`)
  }

  async function handleCheckout() {
    if (cart.length === 0) {
      setToast("Add at least one meal before placing an order")
      return
    }

    if (!tableNumber.trim()) {
      setTableError("Please enter your table number before checkout.")
      return
    }

    setTableError("")
    setSubmitting(true)
    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          guestName: `Table ${tableNumber.trim()}`,
          userId: `table_${tableNumber.trim()}`,
          tableNumber: tableNumber.trim(),
          items: cart.map((item) => ({ id: item.id, quantity: item.quantity, note: item.note })),
        }),
      })

      if (!response.ok) {
        throw new Error("Unable to place order. Please try again.")
      }

      const { order } = await response.json()
      setOrderConfirmation(order)
      setCart([])
      setToast(`Order #${order.orderNumber} placed successfully`)
    } catch (error) {
      setToast(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  function handleUnavailable(meal) {
    setToast(`${meal.name} is currently unavailable`)
  }

  return (
    <main className="pb-20">
      <Toast message={toast} />


      {orderConfirmation ? (
        <section className="section-wrap mt-6">
          <div className="glass-surface overflow-hidden p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="brand-kicker">Order placed</p>
                <h2 className="mt-2 text-3xl font-semibold text-nyota-forest dark:text-nyota-sand">
                  Order #{orderConfirmation.orderNumber} confirmed
                </h2>
                <p className="mt-3 max-w-3xl font-sans-body text-sm leading-7 text-stone-600 dark:text-stone-300">
                  Your dining request is in the queue. The kitchen will update the order status in real time.
                </p>
              </div>
              <div className="rounded-[28px] bg-nyota-forest px-5 py-4 text-white dark:bg-emerald-900">
                <p className="text-sm uppercase tracking-[0.2em] text-white/90">Estimated ready time</p>
                <p className="mt-2 text-3xl font-semibold">{orderConfirmation.etaMinutes} min</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-[24px] border border-stone-200 bg-stone-50/90 p-5 dark:border-white/10 dark:bg-white/5">
                <p className="font-semibold text-nyota-forest dark:text-nyota-sand">Table</p>
                <p className="mt-2 text-sm text-stone-600 dark:text-stone-300">{orderConfirmation.tableNumber || orderConfirmation.guestName}</p>
              </div>
              <div className="rounded-[24px] border border-stone-200 bg-stone-50/90 p-5 dark:border-white/10 dark:bg-white/5">
                <p className="font-semibold text-nyota-forest dark:text-nyota-sand">Order Total</p>
                <p className="mt-2 text-3xl font-semibold text-nyota-forest dark:text-nyota-sand">{formatMoney(orderConfirmation.totalPrice)}</p>
                <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">Status: {orderConfirmation.status}</p>
              </div>
            </div>

            <div className="mt-6">
              <div className="font-semibold text-nyota-forest dark:text-nyota-sand">Ordered items</div>
              <div className="mt-3 space-y-3">
                {orderConfirmation.items.map((item) => (
                  <div key={`${orderConfirmation.id}-${item.id}`} className="rounded-[24px] border border-stone-200 bg-white/90 p-4 dark:border-white/10 dark:bg-white/5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-nyota-forest dark:text-nyota-sand">{item.name}</p>
                        <p className="text-sm text-stone-500">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-semibold text-nyota-forest dark:text-nyota-sand">KSh {item.price * item.quantity}</span>
                    </div>
                    {item.note ? <p className="mt-2 text-sm text-stone-500">Note: {item.note}</p> : null}
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOrderConfirmation(null)}
              className="pill-button-secondary mt-6"
            >
              Place another order
            </button>
          </div>
        </section>
      ) : null}

      <MealModal
        meal={selectedMeal}
        quantity={quantity}
        setQuantity={setQuantity}
        note={note}
        setNote={setNote}
        onClose={() => setSelectedMeal(null)}
        onConfirm={addToCart}
      />

      <section className="section-wrap grid gap-6 pt-6 lg:grid-cols-[1.1fr,0.9fr]">
        <motion.article
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative min-h-[580px] overflow-hidden rounded-[36px] bg-[linear-gradient(135deg,rgba(13,32,28,0.86),rgba(95,66,30,0.58)),url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1400&q=80')] bg-cover bg-center px-8 py-10 text-white shadow-nyota sm:px-10"
        >
          <div className="absolute inset-5 rounded-[28px] border border-white/15" />
          <div className="absolute right-6 top-6 rounded-[22px] border border-white/15 bg-white/10 px-4 py-4 backdrop-blur-md">
            <strong className="block text-lg">Chef Curated</strong>
            <span className="mt-1 block font-sans-body text-sm text-white/80">
              Refined breakfast, lunch, dinner, desserts, and signature drinks.
            </span>
          </div>
          <div className="relative z-10 flex h-full max-w-3xl flex-col justify-end">
            <p className="brand-kicker text-white/75">Five-star dining collection</p>
            <h1 className="mt-4 max-w-[11ch] text-5xl font-semibold leading-[0.92] sm:text-7xl">
              Order premium resort dining with calm, polished ease.
            </h1>
            <p className="mt-5 max-w-2xl font-sans-body text-sm leading-8 text-white/82 sm:text-base">
              Explore signature breakfast plates, elegant dinners, indulgent desserts, and refreshing drinks
              in a luxury ordering experience created for Nyota Springs Resort guests.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#menu" className="pill-button-primary">Browse Menu</a>
              <button type="button" onClick={() => openMeal(chefSpecial)} className="pill-button-secondary">
                Chef&apos;s Special
              </button>
            </div>
          </div>
        </motion.article>

        <div className="grid gap-4">
          <div className="glass-surface overflow-hidden bg-[linear-gradient(140deg,rgba(20,57,47,0.88),rgba(33,73,61,0.76)),url('https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center p-6 text-white">
            <p className="brand-kicker text-white/75">Chef&apos;s Special</p>
            <h2 className="mt-3 text-4xl font-semibold">{chefSpecial.name}</h2>
            <p className="mt-4 max-w-xl font-sans-body text-sm leading-8 text-white/80">{chefSpecial.description}</p>
            <div className="mt-6 flex items-center justify-between gap-4">
              <div>
                <p className="font-sans-body text-xs uppercase tracking-[0.22em] text-white/70">{chefSpecial.waitTime}</p>
                <strong className="mt-2 block text-3xl">{formatMoney(chefSpecial.price)}</strong>
              </div>
              <button type="button" onClick={() => openMeal(chefSpecial)} className="pill-button-primary">
                Order Now
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["Live Availability", "See instantly whether a dish is available, limited, or unavailable."],
              ["Fast Selection", "Open any meal to review details, quantity, and order total."],
              ["Order Handoff", "Carry your dining order directly into the contact page for confirmation."],
            ].map(([title, copy], index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + index * 0.06 }}
                className="info-card"
              >
                <h3 className="text-xl font-semibold text-nyota-forest dark:text-nyota-sand">{title}</h3>
                <p className="mt-2 font-sans-body text-sm leading-7 text-stone-600 dark:text-stone-300">{copy}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="menu" className="section-wrap mt-12 grid gap-8 xl:grid-cols-[1fr,360px]">
        <div>
          <div className="glass-surface p-5">
            <SectionTitle
              eyebrow="Dining Menu"
              title="Choose your dining moment"
              copy="Search by meal name, switch categories, and open any dish to review wait time, quantity, and order total before placing your request."
              align="between"
            />

            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-3">
                {diningCategories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`inline-flex items-center gap-3 rounded-full px-4 py-3 font-sans-body text-sm font-semibold transition hover:-translate-y-0.5 ${
                      activeCategory === category
                        ? "bg-nyota-forest text-white shadow-nyota-soft dark:bg-nyota-gold dark:text-stone-950"
                        : "border border-stone-200 bg-white text-stone-700 dark:border-white/10 dark:bg-white/5 dark:text-stone-100"
                    }`}
                  >
                    <span>{category}</span>
                    <span className={`rounded-full px-2.5 py-1 text-xs ${activeCategory === category ? "bg-white/15 dark:bg-black/10" : "bg-stone-100 dark:bg-white/10"}`}>
                      {counts[category]}
                    </span>
                  </button>
                ))}
              </div>

              <label className="relative block min-w-[280px] flex-1 lg:max-w-sm">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">⌕</span>
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search meals, tags, or categories"
                  className="w-full rounded-full border border-stone-200 bg-white px-5 py-3 pl-10 font-sans-body text-sm text-stone-700 outline-none transition focus:border-nyota-bronze focus:ring-4 focus:ring-amber-200 dark:border-white/10 dark:bg-white/5 dark:text-stone-100 dark:focus:ring-amber-500/20"
                />
              </label>
            </div>
          </div>

          {loading ? (
            <div className="mt-6 grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
              {Array.from({ length: 6 }, (_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          ) : filteredMeals.length === 0 ? (
            <div className="glass-surface mt-6 p-10 text-center">
              <p className="brand-kicker">No Selection</p>
              <h3 className="mt-3 text-4xl font-semibold text-nyota-forest dark:text-nyota-sand">
                Nothing matches your search yet
              </h3>
              <p className="mx-auto mt-4 max-w-2xl font-sans-body text-sm leading-8 text-stone-600 dark:text-stone-300">
                {search
                  ? `No meals matched "${search}". Try another search or switch dining categories.`
                  : `There are no meals available in ${activeCategory} right now.`}
              </p>
            </div>
          ) : (
            <motion.div layout className="mt-6 grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
              {filteredMeals.map((meal) => (
                <MealCard
                  key={meal.id}
                  meal={meal}
                  onSelect={openMeal}
                  onUnavailable={handleUnavailable}
                />
              ))}
            </motion.div>
          )}
        </div>

        <CartPanel
          cart={cart}
          total={cartTotal}
          tableNumber={tableNumber}
          tableError={tableError}
          onTableNumberChange={(value) => setTableNumber(value)}
          onCheckout={handleCheckout}
          onRemove={(key) => {
            setCart((current) => current.filter((item) => item.key !== key))
            setToast("Meal removed from your order")
          }}
        />
      </section>
    </main>
  )
}
