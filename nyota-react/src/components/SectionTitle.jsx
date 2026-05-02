export default function SectionTitle({ eyebrow, title, copy, align = "between" }) {
  return (
    <div className={`mb-6 flex flex-col gap-4 ${align === "between" ? "lg:flex-row lg:items-end lg:justify-between" : ""}`}>
      <div>
        <p className="brand-kicker">{eyebrow}</p>
        <h2 className="mt-2 text-4xl font-semibold text-nyota-forest dark:text-nyota-sand sm:text-5xl">
          {title}
        </h2>
      </div>
      {copy ? (
        <p className="max-w-2xl font-sans-body text-sm leading-8 text-stone-600 dark:text-stone-300 sm:text-base">
          {copy}
        </p>
      ) : null}
    </div>
  )
}
