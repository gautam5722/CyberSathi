import { useNavigate } from 'react-router-dom'

export interface NotificationItem {
  id: number
  title: string
  message: string
  category: string
  publishedAt?: string | null
  createdAt?: string
}

interface NotificationCardProps {
  notification: NotificationItem
}

const categoryStyles: Record<string, { badge: string; accent: string; glow: string }> = {
  JOB: {
    badge: 'bg-blue-100 text-blue-800 ring-blue-200',
    accent: 'from-blue-600 via-indigo-600 to-violet-600',
    glow: 'hover:shadow-blue-500/15',
  },
  RESULT: {
    badge: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
    accent: 'from-emerald-500 via-teal-600 to-cyan-600',
    glow: 'hover:shadow-emerald-500/15',
  },
  ADMIT_CARD: {
    badge: 'bg-violet-100 text-violet-800 ring-violet-200',
    accent: 'from-violet-600 via-purple-600 to-fuchsia-600',
    glow: 'hover:shadow-violet-500/15',
  },
  ADMISSION: {
    badge: 'bg-orange-100 text-orange-800 ring-orange-200',
    accent: 'from-orange-500 via-amber-500 to-yellow-500',
    glow: 'hover:shadow-orange-500/15',
  },
}

const defaultStyle = {
  badge: 'bg-sky-100 text-sky-800 ring-sky-200',
  accent: 'from-sky-500 via-blue-600 to-indigo-600',
  glow: 'hover:shadow-indigo-500/15',
}

function normalizeCategory(category: string) {
  return category.toUpperCase().replace(/[\s-]+/g, '_')
}

export default function NotificationCard({
  notification,
}: NotificationCardProps) {
  const navigate = useNavigate()

  const date = notification.publishedAt || notification.createdAt

  const formattedDate = date
    ? new Date(date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : ''

  const category = normalizeCategory(notification.category)

  const style =
    categoryStyles[category] ??
    (category === 'JOBS' || category === 'LATEST_JOB' || category === 'LATEST_JOBS'
      ? categoryStyles.JOB
      : category === 'RESULTS'
        ? categoryStyles.RESULT
        : category === 'ADMIT_CARDS' || category === 'ADMITCARD'
          ? categoryStyles.ADMIT_CARD
          : category === 'ADMISSIONS'
            ? categoryStyles.ADMISSION
            : defaultStyle)

  return (
    <button
      type="button"
      onClick={() => navigate(`/notification/${notification.id}`)}
      className={`group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 ${style.glow}`}
    >
      <div className={`h-1.5 w-full bg-gradient-to-r ${style.accent}`} />

      <div className="flex flex-1 flex-col bg-gradient-to-br from-white via-slate-50/60 to-blue-50/50 p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-extrabold uppercase tracking-wide ring-1 ${style.badge}`}
          >
            {notification.category.replace(/_/g, ' ')}
          </span>

          {formattedDate && (
            <time className="shrink-0 rounded-lg border border-slate-200 bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm">
              {formattedDate}
            </time>
          )}
        </div>

        <h2 className="mb-3 text-lg font-extrabold leading-snug text-slate-900 transition-colors group-hover:text-blue-700 sm:text-xl">
          {notification.title}
        </h2>

        <p className="whitespace-pre-line break-words text-sm font-medium leading-7 text-slate-600 sm:text-base">
          {notification.message}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <span className="text-sm font-extrabold text-blue-700">
            View Full Details
          </span>

          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r ${style.accent} text-lg font-bold text-white shadow-md transition-transform duration-300 group-hover:translate-x-1`}>
            →
          </span>
        </div>
      </div>
    </button>
  )
}