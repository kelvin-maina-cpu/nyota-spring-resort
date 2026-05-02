import { AnimatePresence, motion } from "framer-motion"

const statusMap = {
  Available: "status-pill status-available",
  Limited: "status-pill status-limited",
  "Out of Stock": "status-pill status-unavailable",
}

function formatMoney(value) {
  return `KSh ${value.toFixed(2)}`
}

function renderStars(rating) {
  return "★".repeat(Math.round(rating)) + "☆".repeat(5 - Math.round(rating))
}

export default function MealModal({
  meal,
  quantity,
  setQuantity,
  note,
  setNote,
  onClose,
  onConfirm,
}) {
  return (
    <AnimatePresence>
      {meal ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 p-4 backdrop-blur-sm md:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="grid max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[32px] bg-[#fffaf4] shadow-nyota dark:bg-[#13211c] md:grid-cols-[1.05fr,0.95fr]"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative min-h-[340px] overflow-hidden">
              <img src={meal.image} alt={meal.name} className="h-full w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/55 to-transparent" />
              <div className="absolute left-6 top-6 flex flex-wrap gap-2">
                <span className={statusMap[meal.availability]}>{meal.availability}</span>
                {meal.chefSpecial ? (
                  <span className="status-pill bg-amber-300 text-stone-950">Chef&apos;s Special</span>
                ) : null}
              </div>
              <div className="absolute inset-x-6 bottom-6 text-white">
                <p className="font-sans-body text-xs uppercase tracking-[0.28em] text-white/75">{meal.category}</p>
                <h2 className="mt-2 text-4xl font-semibold">{meal.name}</h2>
                <p className="mt-3 max-w-xl font-sans-body text-sm leading-7 text-white/80">{meal.description}</p>
              </div>
            </div>

            <div className="space-y-5 p-6 md:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="brand-kicker">Dining Selection</p>
                  <p className="mt-2 text-3xl font-semibold text-nyota-forest dark:text-nyota-sand">
                    {formatMoney(meal.price)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-stone-200 text-xl text-stone-600 transition hover:bg-stone-100 dark:border-white/10 dark:text-stone-300 dark:hover:bg-white/10"
                >
                  ×
                </button>
              </div>

              <div className="flex items-center gap-3 font-sans-body text-sm text-stone-500 dark:text-stone-300">
                <span className="text-amber-400">{renderStars(meal.rating)}</span>
                <span>{meal.rating.toFixed(1)}</span>
                <span>•</span>
                <span>{meal.waitTime}</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {meal.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-stone-100 px-3 py-1 font-sans-body text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-700 dark:bg-white/10 dark:text-stone-100"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="rounded-[24px] border border-stone-200 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
                <p className="brand-kicker">Quantity</p>
                <div className="mt-3 flex items-center justify-between gap-4">
                  <p className="font-sans-body text-sm leading-7 text-stone-600 dark:text-stone-300">
                    Adjust the quantity before adding this meal to your dining order.
                  </p>
                  <div className="inline-flex items-center overflow-hidden rounded-full border border-stone-200 bg-white dark:border-white/10 dark:bg-white/5">
                    <button
                      type="button"
                      onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                      className="h-11 w-11 text-lg text-stone-700 transition hover:bg-stone-100 dark:text-stone-100 dark:hover:bg-white/10"
                    >
                      −
                    </button>
                    <span className="inline-flex min-w-[48px] justify-center font-sans-body text-base font-semibold text-nyota-forest dark:text-nyota-sand">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((current) => Math.min(12, current + 1))}
                      className="h-11 w-11 text-lg text-stone-700 transition hover:bg-stone-100 dark:text-stone-100 dark:hover:bg-white/10"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="brand-kicker" htmlFor="meal-note">
                  Special Request
                </label>
                <textarea
                  id="meal-note"
                  rows="4"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="Add a note for preparation or serving preferences"
                  className="mt-3 w-full rounded-[24px] border border-stone-200 bg-white px-4 py-4 font-sans-body text-sm text-stone-700 outline-none transition focus:border-nyota-bronze focus:ring-4 focus:ring-amber-200 dark:border-white/10 dark:bg-white/5 dark:text-stone-100 dark:focus:ring-amber-500/20"
                />
              </div>

              <div className="rounded-[24px] bg-nyota-forest px-5 py-5 text-white dark:bg-gradient-to-r dark:from-nyota-gold dark:to-[#d7b279] dark:text-stone-950">
                <p className="font-sans-body text-xs uppercase tracking-[0.24em] text-white/75 dark:text-stone-900/75">
                  Current Total
                </p>
                <p className="mt-2 text-3xl font-semibold">{formatMoney(meal.price * quantity)}</p>
              </div>

              <button type="button" onClick={onConfirm} className="pill-button-primary w-full">
                Add To Order
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
