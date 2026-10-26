
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { apiFetch } from '../api/api'
import NotificationDetails, {
  type NotificationDetail,
} from '../components/NotificationDetails'

interface Notification {
  id: number
  title: string
  message: string
  category: string
  publishedAt?: string | null
  createdAt?: string
  details?: NotificationDetail[] | null
}

export default function NotificationDetailsPage() {
  const { id } = useParams<{ id: string }>()

  const [notification, setNotification] = useState<Notification | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadNotification() {
      try {
        setLoading(true)
        setError('')

        const response = await apiFetch(`/notifications/published/${id}`)

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? 'Notification not found.'
              : 'Unable to load notification details.',
          )
        }

        const data: Notification = await response.json()

        if (active) setNotification(data)
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error ? err.message : 'Something went wrong.',
          )
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    if (id) {
      void loadNotification()
    } else {
      setError('Invalid notification ID.')
      setLoading(false)
    }

    return () => {
      active = false
    }
  }, [id])

  const date = notification?.publishedAt || notification?.createdAt

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-100 text-slate-900">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-10 h-80 w-80 rounded-full bg-sky-300/30 blur-3xl" />
        <div className="absolute -right-32 top-40 h-96 w-96 rounded-full bg-violet-300/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-pink-200/30 blur-3xl" />
      </div>

      <header className="sticky top-0 z-20 border-b border-white/70 bg-white/85 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <Link to="/" className="text-2xl font-black tracking-tight">
            <span className="text-blue-700">Cyber</span>
            <span className="text-orange-500">Sathi</span>
            <p className="mt-1 text-xs font-medium tracking-wide text-slate-500">
              Your trusted updates companion
            </p>
          </Link>

          <Link
            to="/"
            className="rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-bold text-blue-700 shadow-sm transition hover:bg-blue-50"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        {loading ? (
          <div className="rounded-3xl border border-white bg-white/80 p-12 text-center shadow-xl">
            <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-violet-600" />
            <p className="font-semibold text-slate-600">
              Loading notification details...
            </p>
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-white p-10 text-center shadow-xl">
            <h1 className="text-xl font-extrabold text-red-700">{error}</h1>
            <Link
              to="/"
              className="mt-6 inline-flex rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3 font-bold text-white"
            >
              Back to Home
            </Link>
          </div>
        ) : notification ? (
          <article className="overflow-hidden rounded-3xl border border-white bg-white/95 shadow-2xl shadow-indigo-900/10">
            <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-700 px-5 py-9 text-white sm:px-9 sm:py-12">
              <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-cyan-300/20 blur-3xl" />

              <div className="relative">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                  <span className="rounded-full border border-white/30 bg-white/15 px-4 py-2 text-xs font-extrabold uppercase tracking-wider">
                    {notification.category.replace(/_/g, ' ')}
                  </span>

                  {date && (
                    <time className="rounded-full bg-white/15 px-3 py-2 text-sm text-blue-50">
                      {new Date(date).toLocaleDateString('en-IN')}
                    </time>
                  )}
                </div>

                <h1 className="max-w-4xl break-words text-2xl font-black leading-tight sm:text-3xl lg:text-4xl">
                  {notification.title}
                </h1>

                <div className="my-6 h-1.5 w-24 rounded-full bg-gradient-to-r from-cyan-300 to-pink-300" />

                <p className="max-w-4xl whitespace-pre-line break-words text-sm leading-7 text-blue-50 sm:text-base sm:leading-8">
                  {notification.message}
                </p>
              </div>
            </section>

            <section className="bg-gradient-to-br from-blue-50 via-white to-violet-50 px-4 py-7 sm:px-8 sm:py-9">
              <div className="mb-7 flex items-center gap-4 rounded-2xl border border-indigo-100 bg-white p-4 shadow-sm sm:p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-2xl text-white shadow-lg">
                  <span aria-hidden="true">▤</span>
                </div>

                <div>
                  <h2 className="text-xl font-black text-slate-900 sm:text-2xl">
                    Complete Information
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Important details and eligibility information
                  </p>
                </div>
              </div>

              <NotificationDetails details={notification.details} />
            </section>

            <div className="h-1.5 bg-gradient-to-r from-sky-400 via-blue-600 to-fuchsia-500" />
          </article>
        ) : null}

        <footer className="mt-8 pb-2 text-center text-xs font-medium text-slate-500">
          © {new Date().getFullYear()} CyberSathi · Stay informed, stay prepared.
        </footer>
      </main>
    </div>
  )
}
