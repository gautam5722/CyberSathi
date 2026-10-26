
export interface NotificationDetail {
  heading: string
  content: string
}

interface NotificationDetailsProps {
  details?: NotificationDetail[] | null
}

const headingStyles = [
  {
    header: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white',
    card: 'border-blue-200 hover:border-blue-400',
    glow: 'shadow-blue-500/10',
  },
  {
    header: 'bg-gradient-to-r from-violet-600 to-purple-600 text-white',
    card: 'border-violet-200 hover:border-violet-400',
    glow: 'shadow-violet-500/10',
  },
  {
    header: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white',
    card: 'border-emerald-200 hover:border-emerald-400',
    glow: 'shadow-emerald-500/10',
  },
  {
    header: 'bg-gradient-to-r from-orange-500 to-amber-500 text-white',
    card: 'border-orange-200 hover:border-orange-400',
    glow: 'shadow-orange-500/10',
  },
  {
    header: 'bg-gradient-to-r from-cyan-600 to-sky-600 text-white',
    card: 'border-cyan-200 hover:border-cyan-400',
    glow: 'shadow-cyan-500/10',
  },
  {
    header: 'bg-gradient-to-r from-pink-600 to-rose-600 text-white',
    card: 'border-pink-200 hover:border-pink-400',
    glow: 'shadow-pink-500/10',
  },
]

export default function NotificationDetails({
  details,
}: NotificationDetailsProps) {
  const visibleDetails = (details ?? []).filter(
    (item) => item.heading?.trim() && item.content?.trim(),
  )

  if (visibleDetails.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-indigo-200 bg-gradient-to-br from-blue-50 to-violet-50 p-8 text-center text-sm font-medium text-slate-600">
        Detailed information has not been added yet.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-2">
      {visibleDetails.map((item, index) => {
        const style = headingStyles[index % headingStyles.length]

        const lines = item.content
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter(Boolean)

        return (
          <section
            key={`${item.heading}-${index}`}
            className={`flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl ${style.card} ${style.glow}`}
          >
            <h2
              className={`flex items-center gap-3 px-5 py-4 text-base font-extrabold leading-6 sm:text-lg ${style.header}`}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/20 text-sm">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="break-words">{item.heading}</span>
            </h2>

            <div className="flex-1 bg-gradient-to-br from-white via-slate-50/70 to-blue-50/40 px-5 py-5 text-sm font-semibold leading-7 text-slate-700 sm:text-base sm:leading-8">
              <ul className="list-disc space-y-1 pl-5 marker:text-blue-600">
                {lines.map((line, lineIndex) => (
                  <li key={lineIndex} className="break-words">
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )
      })}
    </div>
  )
}
