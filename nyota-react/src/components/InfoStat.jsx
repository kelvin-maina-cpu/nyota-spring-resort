export default function InfoStat({ value, label }) {
  return (
    <div className="glass-surface p-5">
      <p className="text-3xl font-semibold text-nyota-forest dark:text-nyota-sand">{value}</p>
      <p className="mt-2 font-sans-body text-sm leading-7 text-stone-600 dark:text-stone-300">{label}</p>
    </div>
  )
}
