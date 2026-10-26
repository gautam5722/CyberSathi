
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FaBriefcase,
  FaTrophy,
  FaTicketAlt,
  FaGraduationCap,
  FaArrowRight,
  FaArrowDown,
  FaShieldAlt,
  FaRegClock,
  FaBell,
  FaFileAlt,
} from 'react-icons/fa'

type Notification = {
  id: number
  title: string
  message: string
  category: string
  isPublished: boolean
  publishedAt: string | null
  createdAt: string
}

const API_URL = 'http://localhost:3000/notifications/published'

const categories = [
  {
    title: 'Latest Jobs',
    subtitle: 'Government job openings',
    icon: <FaBriefcase />,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-50',
  },
  {
    title: 'Results',
    subtitle: 'Exam results & merit lists',
    icon: <FaTrophy />,
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-50',
  },
  {
    title: 'Admit Cards',
    subtitle: 'Download hall tickets',
    icon: <FaTicketAlt />,
    iconColor: 'text-orange-600',
    iconBg: 'bg-orange-50',
  },
  {
    title: 'Admissions',
    subtitle: 'College & entrance updates',
    icon: <FaGraduationCap />,
    iconColor: 'text-violet-600',
    iconBg: 'bg-violet-50',
  },
]

const updateColumns = [
  {
    title: 'Results',
    icon: <FaTrophy />,
    aliases: ['RESULT', 'RESULTS'],
    borderColor: 'border-emerald-500',
    headingColor: 'from-emerald-600 to-green-700',
    iconBg: 'bg-emerald-50 text-emerald-700',
  },
  {
    title: 'Admit Cards',
    icon: <FaTicketAlt />,
    aliases: ['ADMIT_CARD', 'ADMIT_CARDS', 'ADMITCARD'],
    borderColor: 'border-orange-500',
    headingColor: 'from-orange-500 to-amber-600',
    iconBg: 'bg-orange-50 text-orange-700',
  },
  {
    title: 'Latest Jobs',
    icon: <FaBriefcase />,
    aliases: ['JOB', 'JOBS', 'LATEST_JOB', 'LATEST_JOBS'],
    borderColor: 'border-blue-500',
    headingColor: 'from-blue-600 to-indigo-700',
    iconBg: 'bg-blue-50 text-blue-700',
  },
]

function normalizeCategory(value: string) {
  return value.toUpperCase().replace(/[\s-]+/g, '_')
}

export default function HomePage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadNotifications() {
      try {
        const response = await fetch(API_URL)

        if (!response.ok) {
          throw new Error('Failed to load notifications')
        }

        const data: Notification[] = await response.json()

        if (active) setNotifications(data)
      } catch {
        if (active) {
          setError(
            'Updates load nahi ho paaye. Backend connection check karein.',
          )
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    void loadNotifications()

    return () => {
      active = false
    }
  }, [])

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="flex shrink-0 items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 to-violet-700 text-white shadow-lg shadow-blue-200/70">
              <FaShieldAlt className="text-xl" />
            </div>

            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                Cyber<span className="text-orange-500">Sathi</span>
              </h1>
              <p className="hidden text-[11px] font-medium tracking-wide text-slate-500 sm:block">
                YOUR CAREER COMPANION
              </p>
            </div>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-3">
            <a
              href="#categories"
              className="hidden rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-blue-50 hover:text-blue-700 md:inline-flex"
            >
              Categories
            </a>

            <a
              href="#updates"
              className="hidden rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-blue-50 hover:text-blue-700 sm:inline-flex"
            >
              Latest Updates
            </a>

            <Link
              to="/contact"
              className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700 sm:px-4"
            >
              Contact Us
            </Link>

            <Link
              to="/admin/login"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-3 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-800 sm:px-5"
            >
              Admin Login
              <FaArrowRight className="hidden text-xs sm:block" />
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative isolate overflow-hidden bg-[#0B1736]">
          <div className="pointer-events-none absolute -right-32 -top-40 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-48 left-1/4 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:py-24">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-blue-400/10 px-4 py-2 text-xs font-bold tracking-wide text-blue-200 sm:text-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
                YOUR DIGITAL CAREER COMPANION
              </div>

              <h2 className="max-w-3xl text-4xl font-extrabold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-6xl">
                Aapke sapno ki taiyari,
                <span className="mt-2 block bg-linear-to-r from-blue-300 via-sky-300 to-violet-300 bg-clip-text text-transparent">
                  ab ek hi jagah.
                </span>
              </h2>

              <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
                Latest government jobs, competitive exams, admit cards,
                results aur admissions ki updates — sab kuch aasani se
                ek hi jagah paayein.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#updates"
                  className="inline-flex items-center gap-3 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-3.5 font-bold text-white shadow-xl shadow-blue-950/40 transition hover:-translate-y-1 hover:from-blue-500 hover:to-violet-600"
                >
                  Explore Latest Updates
                  <FaArrowRight />
                </a>

                <a
                  href="#categories"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3.5 font-semibold text-white transition hover:bg-white/10"
                >
                  Explore Categories
                  <FaArrowDown className="text-sm" />
                </a>
              </div>

              <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-300">
                <span className="inline-flex items-center gap-2">
                  <FaShieldAlt className="text-emerald-400" />
                  Easy access to updates
                </span>
                <span className="inline-flex items-center gap-2">
                  <FaRegClock className="text-blue-300" />
                  Dates & details in one place
                </span>
              </div>
            </div>

            {/* Hero information panel */}
            <div className="relative mx-auto w-full max-w-md lg:ml-auto lg:mr-0">
              <div className="absolute -inset-3 rounded-4xl bg-linear-to-br from-blue-500/20 via-violet-500/20 to-orange-400/10 blur-2xl" />

              <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-linear-to-br from-white/12 to-white/6 p-5 shadow-2xl backdrop-blur-xl sm:p-7">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-blue-200">
                      Welcome to CyberSathi
                    </p>
                    <h3 className="mt-1 text-2xl font-bold text-white">
                      Stay informed.
                    </h3>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-400/15 text-orange-300">
                    <FaBell className="text-xl" />
                  </div>
                </div>

                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Explore opportunities and keep track of important
                  announcements.
                </p>

                <div className="mt-6 space-y-3">
                  <Link
                    to="/category/Latest%20Jobs"
                    className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/6 p-4 transition hover:border-blue-300/30 hover:bg-white/10"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-400/15 text-blue-300">
                      <FaBriefcase className="text-lg" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-white">Latest Jobs</p>
                      <p className="mt-1 text-xs text-slate-400">
                        Recruitment & vacancies
                      </p>
                    </div>
                    <FaArrowRight className="text-sm text-slate-400" />
                  </Link>

                  <Link
                    to="/category/Results"
                    className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-4 transition hover:border-emerald-300/30 hover:bg-white/10"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-300">
                      <FaTrophy className="text-lg" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-white">Results</p>
                      <p className="mt-1 text-xs text-slate-400">
                        Results & merit lists
                      </p>
                    </div>
                    <FaArrowRight className="text-sm text-slate-400" />
                  </Link>

                  <Link
                    to="/category/Admit%20Cards"
                    className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-4 transition hover:border-orange-300/30 hover:bg-white/10"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-400/15 text-orange-300">
                      <FaTicketAlt className="text-lg" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-white">Admit Cards</p>
                      <p className="mt-1 text-xs text-slate-400">
                        Exam hall tickets
                      </p>
                    </div>
                    <FaArrowRight className="text-sm text-slate-400" />
                  </Link>
                </div>

                <a
                  href="#updates"
                  className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-white to-blue-50 px-4 py-3 font-bold text-[#0B1736] transition hover:from-blue-50 hover:to-violet-50"
                >
                  View Published Updates
                  <FaArrowRight className="text-sm" />
                </a>
              </div>
            </div>
          </div>

          <div className="relative h-1 bg-linear-to-r from-blue-600 via-violet-500 to-orange-400" />
        </section>

        {/* Categories */}
        <section
          id="categories"
          className="mx-auto max-w-7xl scroll-mt-24 px-5 py-14 sm:px-8 sm:py-16 lg:px-8"
        >
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.2em] text-orange-600">
                Find your next opportunity
              </p>
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                Explore Categories
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
                Everything you need, organized in one place.
              </p>
            </div>

            <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-500 sm:flex">
              <FaFileAlt className="text-blue-600" />
              Explore available opportunities
            </div>
          </div>

          <div className="grid grid-cols-2 items-stretch gap-3 sm:gap-5 lg:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.title}
                to={`/category/${encodeURIComponent(category.title)}`}
                className="group relative min-w-0 rounded-2xl p-px transition duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(102,126,234,0.20)]"
                style={{
                  background:
                    'linear-gradient(135deg, #667eea 0%, #764ba2 48%, #e879f9 100%)',
                }}
              >
                <div className="flex h-full flex-col rounded-[15px] bg-white p-4 sm:p-6">
                  <div className="flex items-start justify-between gap-2">
                    <div
                      className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl text-xl transition duration-300 group-hover:scale-110 sm:h-14 sm:w-14 sm:text-2xl ${category.iconBg} ${category.iconColor}`}
                    >
                      {category.icon}
                    </div>

                    <FaArrowRight className="mt-2 text-sm text-slate-300 transition group-hover:translate-x-1 group-hover:text-violet-600" />
                  </div>

                  <h3 className="text-sm font-extrabold text-slate-900 sm:text-lg">
                    {category.title}
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-slate-500 sm:text-sm sm:leading-6">
                    {category.subtitle}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Latest Updates */}
        <section
          id="updates"
          className="scroll-mt-24 border-y border-slate-200/80 bg-white py-14 sm:py-16"
        >
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-8">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.2em] text-orange-600">
                  Stay up to date
                </p>
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                  Latest Updates
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
                  Results, admit cards and the latest government jobs.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Published updates
              </div>
            </div>

            {loading && (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {updateColumns.map((column) => (
                  <div
                    key={column.title}
                    className="animate-pulse rounded-2xl bg-gradient-to-br from-[#667eea] to-[#764ba2] p-px"
                  >
                    <div className="overflow-hidden rounded-[15px] bg-white">
                      <div className="h-14 bg-slate-200" />
                      <div className="space-y-4 p-5">
                        <div className="h-4 w-4/5 rounded bg-slate-200" />
                        <div className="h-4 w-3/5 rounded bg-slate-100" />
                        <div className="h-4 w-2/3 rounded bg-slate-100" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && error && (
              <p
                role="alert"
                className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700"
              >
                {error}
              </p>
            )}

            {!loading && !error && (
              <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {updateColumns.map((column) => {
                  const matchingNotifications = notifications.filter(
                    (notification) =>
                      column.aliases.includes(
                        normalizeCategory(notification.category),
                      ),
                  )

                  return (
                    <div
                      key={column.title}

                      className="group overflow-hidden rounded-2xl bg-gradient-to-b from-[#667eea] via-[#764ba2] to-[#e879f9] p-px shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(102,126,234,0.22)]"                    >

                      <section
                        className="flex h-full min-w-0 flex-col overflow-hidden rounded-[15px] bg-white"                      >

                        <div
                          className={`flex items-center justify-between gap-3 bg-gradient-to-r ${column.headingColor} px-4 py-4 text-white sm:px-5`}
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-lg">
                              {column.icon}
                            </div>
                            <h3 className="text-base font-extrabold sm:text-lg">
                              {column.title}
                            </h3>
                          </div>

                          <span className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-bold">
                            {matchingNotifications.length}
                          </span>
                        </div>

                        {matchingNotifications.length === 0 ? (
                          <div className="flex flex-1 flex-col items-center justify-center px-4 py-10 text-center">
                            <div
                              className={`mb-3 flex h-12 w-12 items-center justify-center rounded-2xl text-xl ${column.iconBg}`}
                            >
                              {column.icon}
                            </div>
                            <p className="text-sm font-semibold text-slate-600">
                              Abhi koi update available nahi hai.
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                              Please baad mein check karein.
                            </p>
                          </div>
                        ) : (
                          <ul className="flex-1 divide-y divide-slate-100">
                            {matchingNotifications.map((notification) => (
                              <li key={notification.id}>
                                <Link
                                  to={`/notification/${notification.id}`}
                                  className="group/item flex items-start gap-3 px-4 py-4 transition hover:bg-blue-50/70 sm:px-5"
                                >
                                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm text-slate-500 transition group-hover/item:bg-blue-100 group-hover/item:text-blue-700">
                                    <FaFileAlt />
                                  </span>

                                  <span className="min-w-0 flex-1">
                                    <span className="block break-words text-sm font-semibold leading-6 text-slate-700 transition group-hover/item:text-blue-700">
                                      {notification.title}
                                    </span>
                                    {notification.publishedAt && (
                                      <span className="mt-1 block text-xs text-slate-400">
                                        Published{' '}
                                        {new Date(
                                          notification.publishedAt,
                                        ).toLocaleDateString('en-IN', {
                                          day: 'numeric',
                                          month: 'short',
                                          year: 'numeric',
                                        })}
                                      </span>
                                    )}
                                  </span>

                                  <FaArrowRight className="mt-1 shrink-0 text-xs text-slate-300 transition group-hover/item:translate-x-1 group-hover/item:text-blue-600" />
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}

                        <div className="border-t border-slate-100 bg-slate-50/70 p-4">
                          <Link
                            to={`/category/${encodeURIComponent(column.title)}`}
                            className="inline-flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-50 hover:text-blue-900"
                          >
                            View All {column.title}
                            <FaArrowRight className="text-xs" />
                          </Link>
                        </div>
                      </section>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="bg-slate-50 px-5 py-14 sm:px-8 sm:py-16">
          <div className="mx-auto max-w-7xl rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-800 to-violet-900 p-px shadow-xl shadow-blue-200/40">
            <div className="relative overflow-hidden rounded-[23px] bg-gradient-to-r from-blue-700 via-indigo-800 to-violet-900 px-6 py-9 sm:px-10 sm:py-12 lg:px-14">
              <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full border-[35px] border-white/5" />
              <div className="pointer-events-none absolute -bottom-28 right-1/4 h-64 w-64 rounded-full bg-sky-400/10 blur-2xl" />

              <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                <div className="max-w-2xl">
                  <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-blue-200">
                    Need assistance?
                  </p>
                  <h2 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl">
                    CyberSathi is here to help.
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-blue-100 sm:text-base">
                    Have a question about an update or service? Visit our
                    Contact Us page for available contact details.
                  </p>
                </div>

                <Link
                  to="/contact"
                  className="inline-flex shrink-0 items-center gap-3 rounded-xl bg-white px-5 py-3.5 font-bold text-blue-800 shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50"
                >
                  Contact Us
                  <FaArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-7 text-center sm:flex-row sm:px-8 sm:text-left lg:px-8">
          <Link to="/" className="text-lg font-extrabold text-slate-900">
            Cyber<span className="text-orange-500">Sathi</span>
          </Link>

          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} CyberSathi. Stay informed, stay prepared.
          </p>

          <Link
            to="/contact"
            className="text-sm font-semibold text-blue-700 transition hover:text-blue-900"
          >
            Contact Us
          </Link>
        </div>
      </footer>
    </div>
  )
}
