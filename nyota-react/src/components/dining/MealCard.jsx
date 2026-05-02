import { motion } from "framer-motion"

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

export default function MealCard({ meal, onSelect, onUnavailable }) {
  const disabled = meal.availability === "Out of Stock"
  const availabilityCopy = disabled
    ? "Currently unavailable"
    : meal.availability === "Limited"
      ? "Only limited portions left"
      : "Available for order"

  return (
    <motion.article
      layout
      whileHover={disabled ? {} : { y: -8 }}
      className="glass-surface group overflow-hidden"
    >
      <div className="relative h-60 overflow-hidden">
        <img
          src={meal.image}
          alt={meal.name}
          className={`h-full w-full object-cover transition duration-500 ${disabled ? "grayscale opacity-75" : "group-hover:scale-105"}`}
        />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className={statusMap[meal.availability]}>{meal.availability}</span>
          {meal.chefSpecial ? (
            <span className="status-pill bg-amber-300 text-stone-950">Chef&apos;s Special</span>
          ) : null}
        </div>
        <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4 text-white">
          <div>
            <p className="font-sans-body text-[11px] uppercase tracking-[0.28em] text-white/75">{meal.category}</p>
            <h3 className="mt-2 text-2xl font-semibold">{meal.name}</h3>
          </div>
          <div className="rounded-full bg-white/15 px-3 py-2 font-sans-body text-xs font-semibold backdrop-blur-md">
            {meal.waitTime}
          </div>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <p className="min-h-[76px] font-sans-body text-sm leading-7 text-stone-600 dark:text-stone-300">
          {meal.description}
        </p>

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2 font-sans-body text-sm text-stone-500 dark:text-stone-300">
            <span className="text-amber-400">{renderStars(meal.rating)}</span>
            <span>{meal.rating.toFixed(1)}</span>
          </div>
          <div className="text-right">
            <p className="font-sans-body text-[11px] uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
              From
            </p>
            <strong className="mt-1 block text-xl font-semibold text-nyota-forest dark:text-nyota-sand">
              {formatMoney(meal.price)}
            </strong>
          </div>
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

        <div className="flex items-center justify-between gap-4 pt-1">
          <div>
            <p className={`font-sans-body text-sm font-medium ${
              disabled
                ? "text-rose-600 dark:text-rose-300"
                : meal.availability === "Limited"
                  ? "text-amber-700 dark:text-amber-200"
                  : "text-emerald-700 dark:text-emerald-300"
            }`}>
              {availabilityCopy}
            </p>
          </div>
          <button
            type="button"
            onClick={() => (disabled ? onUnavailable(meal) : onSelect(meal))}
            disabled={disabled}
            className={`pill-button ${disabled ? "cursor-not-allowed bg-stone-200 text-stone-500 shadow-none dark:bg-white/8 dark:text-stone-500" : "bg-nyota-forest text-white shadow-nyota-soft dark:bg-nyota-gold dark:text-stone-950"}`}
          >
            {disabled ? "Unavailable" : "Order Now"}
          </button>
        </div>
      </div>
    </motion.article>
  )
}
