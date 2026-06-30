import { motion } from "framer-motion"

function formatMoney(value) {
  return `KSh ${value.toFixed(2)}`
}

export default function CartPanel({ cart, total, tableNumber, tableError, onTableNumberChange, onCheckout, onRemove }) {
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <aside className="glass-surface p-5 sm:p-6 xl:sticky xl:top-28">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="brand-kicker">Your Order</p>
          <h3 className="mt-2 text-2xl font-semibold text-nyota-forest dark:text-nyota-sand sm:text-3xl">
            Cart Summary
          </h3>
        </div>
        <motion.div
          key={itemCount}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex min-h-[48px] min-w-[48px] items-center justify-center rounded-full bg-nyota-forest px-4 font-sans-body text-lg font-semibold text-white shadow-nyota-soft dark:bg-nyota-gold dark:text-stone-950 sm:min-h-[54px] sm:min-w-[54px]"
        >
          {itemCount}
        </motion.div>
      </div>

      {cart.length === 0 ? (
        <div className="mt-6 rounded-[24px] border border-dashed border-stone-300 bg-stone-50/80 p-5 font-sans-body text-sm leading-7 text-stone-600 dark:border-white/10 dark:bg-white/5 dark:text-stone-300">
          Add meals from the menu to begin building a dining order for your stay.
        </div>
      ) : (
        <div className="mt-6 max-h-[420px] space-y-3 overflow-y-auto pr-2">
          {cart.map((item) => (
            <div key={item.key} className="rounded-[24px] border border-stone-200 bg-stone-50/90 p-4 dark:border-white/10 dark:bg-white/5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-nyota-forest dark:text-nyota-sand">
                    {item.name}
                  </h4>
                  <p className="mt-1 font-sans-body text-sm leading-6 text-stone-600 dark:text-stone-300">
                    {item.quantity} portion(s)
                    {item.note ? ` • ${item.note}` : ""}
                    {" • "}
                    {item.waitTime}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(item.key)}
                  className="rounded-full border border-stone-200 px-3 py-1.5 font-sans-body text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500 transition hover:bg-stone-100 dark:border-white/10 dark:text-stone-300 dark:hover:bg-white/10"
                >
                  Remove
                </button>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="font-sans-body text-stone-500 dark:text-stone-400">
                  {formatMoney(item.price)} each
                </span>
                <strong className="text-nyota-forest dark:text-nyota-sand">
                  {formatMoney(item.price * item.quantity)}
                </strong>
              </div>
            </div>
          ))}
        </div>
      )}

          <div className="mt-6 rounded-[26px] bg-nyota-forest px-5 py-5 text-white dark:bg-gradient-to-r dark:from-nyota-gold dark:to-[#d7b279] dark:text-stone-950">
        <div className="flex flex-wrap items-center justify-between gap-3 font-sans-body text-xs uppercase tracking-[0.18em] text-white/75 dark:text-stone-900/75 sm:tracking-[0.22em]">
          <span>Estimated Total</span>
          <span>{itemCount} item(s)</span>
        </div>
        <div className="mt-2 text-2xl font-semibold sm:text-3xl">{formatMoney(total)}</div>
      </div>

      <div className="mt-5 rounded-[26px] border border-white/10 bg-white/80 p-5 text-stone-700 dark:border-white/10 dark:bg-white/5 dark:text-stone-100">
        <label className="block text-sm font-semibold text-nyota-forest dark:text-nyota-sand">
          Table number
        </label>
        <input
          type="text"
          value={tableNumber}
          onChange={(event) => onTableNumberChange(event.target.value)}
          placeholder="Enter your table number"
          className="mt-3 w-full rounded-[22px] border border-stone-200 bg-white px-4 py-3 text-sm text-stone-700 outline-none transition focus:border-nyota-bronze focus:ring-4 focus:ring-amber-200 dark:border-white/10 dark:bg-white/5 dark:text-stone-100 dark:focus:ring-amber-500/20"
        />
        {tableError ? <p className="mt-2 text-sm text-rose-600">{tableError}</p> : null}
      </div>

      <button type="button" onClick={onCheckout} className="pill-button-primary mt-5 w-full">
        Place Order
      </button>

      <p className="mt-4 font-sans-body text-sm leading-7 text-stone-500 dark:text-stone-400">
        Your selected meals and estimated total will be carried into the contact page for final confirmation.
      </p>
    </aside>
  )
}
