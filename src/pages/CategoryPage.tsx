
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

type Notification = {
  id: number
  title: string
  message: string
  category: string
  publishedAt: string | null
  createdAt: string
}

// const API_URL = 'http://localhost:3000/notifications/published'

const API_URL = 'https://cybersathi-backend-8umx.onrender.com/notifications/published'

const PAGE_SIZE = 10

const categoryOptions = [
  { title: 'Latest Jobs', icon: '💼', aliases: ['JOB', 'JOBS', 'LATEST_JOB', 'LATEST_JOBS'], description: 'Explore the latest government job openings and recruitment updates.', accent: 'from-blue-600 to-indigo-600', soft: 'bg-blue-50 text-blue-700' },
  { title: 'Results', icon: '🏆', aliases: ['RESULT', 'RESULTS'], description: 'Find examination results, merit lists and score updates.', accent: 'from-emerald-500 to-green-600', soft: 'bg-emerald-50 text-emerald-700' },
  { title: 'Admit Cards', icon: '🎫', aliases: ['ADMIT_CARD', 'ADMIT_CARDS', 'ADMITCARD'], description: 'Get the latest admit card and examination hall ticket updates.', accent: 'from-orange-500 to-amber-500', soft: 'bg-orange-50 text-orange-700' },
  { title: 'Admissions', icon: '🎓', aliases: ['ADMISSION', 'ADMISSIONS'], description: 'Stay updated on admissions, entrance exams and application notices.', accent: 'from-violet-600 to-purple-600', soft: 'bg-violet-50 text-violet-700' },
]

function normalize(value: string) {
  return value.toUpperCase().replace(/[\s-]+/g, '_')
}

function matchesCategory(notificationCategory: string, selectedTitle: string) {
  const selected = categoryOptions.find((item) => item.title === selectedTitle)
  if (!selected) return false

  const value = normalize(notificationCategory)
  return selected.aliases.includes(value) || normalize(selected.title) === value
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>()
  const selectedTitle = decodeURIComponent(category ?? '')

  const selectedCategory = categoryOptions.find(
    (item) => item.title.toLowerCase() === selectedTitle.toLowerCase(),
  )

  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    let active = true

    async function loadNotifications() {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(API_URL)
        if (!response.ok) throw new Error('Failed to load notifications')

        const data: Notification[] = await response.json()

        if (active) {
          setNotifications(data)
          setPage(1)
        }
      } catch {
        if (active) {
          setError('Notifications load nahi ho paaye. Backend connection check karein.')
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    void loadNotifications()
    return () => {
      active = false
    }
  }, [category])

  if (!selectedCategory) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-12">
        <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-2xl">⚠️</div>
          <h1 className="text-2xl font-extrabold text-slate-900">Category not found</h1>
          <p className="mt-2 text-slate-500">The category you are looking for does not exist.</p>
          <Link to="/" className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700">
            ← Back to Home
          </Link>
        </div>
      </main>
    )
  }

  const filteredNotifications = notifications.filter((notification) =>
    matchesCategory(notification.category, selectedCategory.title),
  )

  const totalPages = Math.max(1, Math.ceil(filteredNotifications.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const visibleNotifications = filteredNotifications.slice(startIndex, startIndex + PAGE_SIZE)

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f7f8fc] text-slate-800">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-52 h-96 w-96 rounded-full bg-blue-200/25 blur-3xl" />
        <div className="absolute -right-40 top-80 h-[30rem] w-[30rem] rounded-full bg-violet-200/25 blur-3xl" />
      </div>
      <header className="sticky top-0 z-20 border-b border-white/80 bg-white/85 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
          <Link to="/" className="group inline-flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-700 via-indigo-600 to-violet-600 text-lg font-black text-white shadow-lg shadow-indigo-600/20 transition group-hover:rotate-3">
              C<span className="text-orange-300">S</span>
            </span>
            <span>
              <span className="block text-2xl font-black tracking-tight text-slate-900">Cyber<span className="text-orange-500">Sathi</span></span>
              <span className="mt-0.5 block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Your career companion</span>
            </span>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
          >
            <span>⌂</span> Home
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-5 py-8 sm:py-12">
        <nav aria-label="Breadcrumb" className="mb-7 flex items-center gap-2 text-sm font-medium text-slate-500">
          <Link to="/" className="transition hover:text-blue-700">Home</Link>
          <span>/</span>
          <span className="font-semibold text-slate-700">{selectedCategory.title}</span>
        </nav>

        <section className={`group relative isolate overflow-hidden rounded-[2rem] bg-gradient-to-br ${selectedCategory.accent} p-6 text-white shadow-2xl shadow-indigo-900/15 sm:p-10 lg:p-12`}>
          <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-20 -z-10 h-72 w-72 rounded-full border-[42px] border-white/[0.08] transition duration-700 group-hover:scale-110" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 right-1/4 -z-10 h-64 w-64 rounded-full bg-white/15 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute right-24 top-10 -z-10 h-24 w-24 rotate-12 rounded-3xl border border-white/10 bg-white/[0.05] hidden sm:block" />

          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-white/85 transition hover:text-white">
            <span>←</span> Back to all categories
          </Link>

          <div className="mt-7 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/25 bg-white/15 text-3xl shadow-lg shadow-slate-950/10 ring-1 ring-white/10 backdrop-blur-md transition duration-300 group-hover:-rotate-3 group-hover:scale-105 sm:h-20 sm:w-20 sm:text-4xl">
                {selectedCategory.icon}
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/75">Explore opportunities</p>
                <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                  {selectedCategory.title}
                </h1>
                <p className="mt-3 max-w-xl text-sm leading-6 text-white/85 sm:text-base">
                  {selectedCategory.description}
                </p>
              </div>
            </div>

            <div className="shrink-0 rounded-2xl border border-white/25 bg-white/15 px-6 py-5 shadow-lg shadow-slate-950/10 backdrop-blur-md">
              <p className="text-3xl font-extrabold">{filteredNotifications.length}</p>
              <p className="mt-1 text-xs font-semibold text-white/80">Published updates</p>
            </div>
          </div>
        </section>

        <section className="mt-11">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">Stay informed</p>
              <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                Latest {selectedCategory.title}
              </h2>
              <p className="mt-1 text-sm text-slate-500">Official updates, organised in one place.</p>
            </div>

            {!loading && !error && filteredNotifications.length > 0 && (
              <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${selectedCategory.soft}`}>
                {filteredNotifications.length} {filteredNotifications.length === 1 ? 'update' : 'updates'}
              </span>
            )}
          </div>

          {loading && (
            <div className="grid gap-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="h-4 w-2/3 rounded bg-slate-200" />
                  <div className="mt-4 h-3 w-1/3 rounded bg-slate-100" />
                </div>
              ))}
              <p className="text-center text-sm text-slate-500">Loading notifications...</p>
            </div>
          )}

          {!loading && error && (
            <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6 sm:p-8">
              <p className="font-bold text-red-800">Unable to load updates</p>
              <p className="mt-2 text-sm text-red-700">{error}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700"
              >
                Try again
              </button>
            </div>
          )}

          {!loading && !error && filteredNotifications.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-3xl">
                {selectedCategory.icon}
              </div>
              <h3 className="mt-5 text-xl font-extrabold text-slate-900">No updates yet</h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Is category mein abhi koi published notification nahi hai. Naye updates publish hone par yahan dikhai denge.
              </p>
              <Link to="/" className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700">
                Explore other categories
              </Link>
            </div>
          )}

          {!loading && !error && visibleNotifications.length > 0 && (
            <>
              <div className="grid gap-4">
                {visibleNotifications.map((notification) => (
                  <Link
                    key={notification.id}
                    to={`/notification/${notification.id}`}
                    className="group relative isolate overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-md shadow-slate-900/[0.04] transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-900/[0.08] sm:p-7"
                  >
                    <div className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${selectedCategory.accent} opacity-70 transition-all group-hover:w-1.5`} />

                    <div className="flex items-start gap-4 pl-1">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg shadow-sm ring-1 ring-black/[0.02] transition duration-300 group-hover:scale-105 ${selectedCategory.soft}`}>
                        <span aria-hidden="true">▤</span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`rounded-full border border-current/10 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider ${selectedCategory.soft}`}>
                            {selectedCategory.title}
                          </span>
                          {notification.publishedAt && (
                            <span className="text-xs text-slate-400">
                              Published {formatDate(notification.publishedAt)}
                            </span>
                          )}
                        </div>

                        <h3 className="mt-4 pr-2 text-lg font-extrabold leading-7 tracking-tight text-slate-900 transition group-hover:text-blue-700 sm:text-xl">
                          {notification.title}
                        </h3>

                        {notification.message && (
                          <p className="mt-2 line-clamp-2 text-sm leading-7 text-slate-500 sm:text-base">
                            {notification.message}
                          </p>
                        )}
                      </div>

                      <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-50 text-xl text-slate-300 transition group-hover:translate-x-1 group-hover:bg-blue-50 group-hover:text-blue-600" aria-hidden="true">
                        →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <nav
                  aria-label="Notification pagination"
                  className="mt-8 flex flex-wrap items-center justify-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setPage((value) => Math.max(1, value - 1))}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    ← Previous
                  </button>

                  <span className="text-sm font-semibold text-slate-600">
                    Page <span className="text-slate-900">{currentPage}</span> of {totalPages}
                  </span>

                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
                    className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next →
                  </button>
                </nav>
              )}
            </>
          )}
        </section>

        <section className="relative mt-14 overflow-hidden rounded-[2rem] border border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-blue-50 p-6 shadow-lg shadow-indigo-900/[0.03] sm:p-9">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">CyberSathi</p>
              <h2 className="mt-2 text-xl font-extrabold text-slate-900">Stay prepared for your next opportunity.</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">Explore more government jobs, results, admit cards and admissions.</p>
            </div>
            <Link to="/" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:shadow-xl">
              Explore CyberSathi <span>→</span>
            </Link>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-slate-200/80 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-7 text-center sm:flex-row sm:text-left">
          <Link to="/" className="font-extrabold text-blue-700">
            Cyber<span className="text-orange-500">Sathi</span>
          </Link>
          <p className="text-xs text-slate-500">© {new Date().getFullYear()} CyberSathi. Stay informed, stay prepared.</p>
          <Link to="/contact" className="text-sm font-semibold text-blue-700 transition hover:text-violet-700">
            Contact Us →
          </Link>
        </div>
      </footer> 
    </div>
  )
}
