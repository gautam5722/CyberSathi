import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  FaWhatsapp,
  FaInstagram,
  FaTelegram,
  FaFacebook,
  FaYoutube,
} from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { SiGooglemaps } from 'react-icons/si'

type ContactLink = {
  heading: string
  url: string
}

type ContactSettings = {
  address: string | null
  googleMapsUrl: string | null
  phone: string | null
  whatsapp: string | null
  telegram: string | null
  socialLinks: ContactLink[] | null
  customLinks: ContactLink[] | null
}

const CONTACT_API_URL = 'http://localhost:3000/contact-settings'

function getSocialIcon(heading: string, url: string) {
  const value = `${heading} ${url}`.toLowerCase()

  if (value.includes('whatsapp') || value.includes('wa.me')) {
    return <FaWhatsapp className="h-5 w-5 text-[#25D366]" />
  }
  if (value.includes('instagram') || value.includes('instagr.am')) {
    return <FaInstagram className="h-5 w-5 text-[#E4405F]" />
  }
  if (value.includes('telegram') || value.includes('t.me')) {
    return <FaTelegram className="h-5 w-5 text-[#229ED9]" />
  }
  if (value.includes('facebook') || value.includes('fb.com') || value.includes('fb.me')) {
    return <FaFacebook className="h-5 w-5 text-[#1877F2]" />
  }
  if (value.includes('youtube') || value.includes('youtu.be')) {
    return <FaYoutube className="h-5 w-5 text-[#FF0000]" />
  }
  if (value.includes('twitter.com') || value.includes('x.com')) {
    return <FaXTwitter className="h-5 w-5 text-black" />
  }
  return null
}

function ContactUs() {
  const [contact, setContact] = useState<ContactSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadContactSettings() {
      try {
        const response = await fetch(CONTACT_API_URL)
        if (!response.ok) throw new Error('Contact details load nahi ho paayi.')
        const data: ContactSettings = await response.json()
        if (!cancelled) setContact(data)
      } catch {
        if (!cancelled) {
          setError('Contact details load nahi ho paayi. Please baad mein try karein.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void loadContactSettings()
    return () => {
      cancelled = true
    }
  }, [])

  const socialLinks = contact?.socialLinks ?? []
  const customLinks = contact?.customLinks ?? []
  const whatsappNumber = contact?.whatsapp?.replace(/\D/g, '') ?? ''
  const phoneNumber = contact?.phone?.trim() ?? ''
  const telegramValue = contact?.telegram?.trim() ?? ''

  const telegramUrl = telegramValue
    ? /^https?:\/\//i.test(telegramValue)
      ? telegramValue
      : `https://t.me/${telegramValue.replace(/^@/, '')}`
    : ''

  const hasLocation = Boolean(contact?.address || contact?.googleMapsUrl)
  const hasPhone = Boolean(phoneNumber)
  const hasWhatsapp = Boolean(whatsappNumber)
  const hasTelegram = Boolean(telegramUrl)

  const validSocialLinks = socialLinks.filter(
    (item) => item.heading?.trim() && item.url?.trim(),
  )
  const validCustomLinks = customLinks.filter(
    (item) => item.heading?.trim() && item.url?.trim(),
  )
  const hasOtherLinks = validSocialLinks.length > 0 || validCustomLinks.length > 0

  function renderLinkCard(
    icon: ReactNode,
    eyebrow: string,
    title: string,
    description: string,
    url: string,
    buttonText: string,
    accent: string,
  ) {
    return (
      <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/80 bg-white p-6 shadow-lg shadow-slate-900/[0.04] transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-900/[0.08] sm:p-7">
        <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accent}`} />
        <div className="flex items-start justify-between gap-4">
          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 ring-1 ring-slate-100 transition duration-300 group-hover:scale-105 group-hover:bg-indigo-50`}>
            {icon}
          </div>
          <span className="rounded-full border border-slate-100 bg-slate-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-500">
            {eyebrow}
          </span>
        </div>
        <h2 className="mt-6 text-xl font-extrabold tracking-tight text-slate-900">{title}</h2>
        <p className="mt-3 min-h-14 break-words text-sm leading-7 text-slate-600 sm:text-base">
          {description}
        </p>
        <a
          href={url}
          target={url.startsWith('tel:') ? undefined : '_blank'}
          rel={url.startsWith('tel:') ? undefined : 'noopener noreferrer'}
          className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r ${accent} px-4 py-3.5 text-sm font-extrabold text-white shadow-md transition hover:brightness-105 focus:outline-none focus:ring-4 focus:ring-indigo-100`}
        >
          {buttonText} <span aria-hidden="true" className="transition group-hover:translate-x-0.5">→</span>
        </a>
      </article>
    )
  }

  function renderSocialLink(item: ContactLink, index: number, type: string) {
    return (
      <a
        key={`${type}-${index}`}
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50/60 hover:text-indigo-700 hover:shadow-md"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 transition group-hover:bg-white">
          {getSocialIcon(item.heading, item.url) ?? <span className="text-lg text-indigo-600">↗</span>}
        </span>
        <span className="break-words">{item.heading}</span>
        <span className="ml-1 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-indigo-500">↗</span>
      </a>
    )
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f8fc] text-slate-800">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-24 h-96 w-96 rounded-full bg-blue-200/35 blur-3xl" />
        <div className="absolute -right-40 top-64 h-[30rem] w-[30rem] rounded-full bg-violet-200/35 blur-3xl" />
        <div className="absolute left-1/3 top-[42rem] h-72 w-72 rounded-full bg-fuchsia-100/50 blur-3xl" />
      </div>

      <header className="relative z-10 border-b border-white/80 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="group inline-flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-700 via-indigo-600 to-violet-600 text-lg font-black text-white shadow-lg shadow-indigo-600/20 transition group-hover:rotate-3">
              C<span className="text-orange-300">S</span>
            </span>
            <span>
              <span className="block text-xl font-black tracking-tight text-slate-900">
                Cyber<span className="text-orange-500">Sathi</span>
              </span>
              <span className="mt-0.5 block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                Your career companion
              </span>
            </span>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-extrabold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
          >
            <span aria-hidden="true">⌂</span> Home
          </Link>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-7xl px-4 pb-8 pt-8 sm:px-6 sm:pb-12 sm:pt-12 lg:px-8">
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 px-6 py-10 text-white shadow-2xl shadow-indigo-950/15 sm:px-10 sm:py-14 lg:px-14">
          <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-24 h-80 w-80 rounded-full border-[45px] border-white/[0.06]" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 right-1/3 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute right-12 top-10 hidden h-24 w-24 rounded-3xl border border-white/10 bg-white/[0.04] rotate-12 lg:block" />
          <div className="relative max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-blue-100 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
              We are here to help
            </span>
            <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Let’s get in <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-violet-300 bg-clip-text text-transparent">touch.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-blue-100/85 sm:text-lg sm:leading-8">
              Have a question about a job, examination, admission or any service? Reach out to CyberSathi — we’re here to help you move forward.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3 text-xs font-bold text-blue-100/80 sm:text-sm">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-2"><span className="text-emerald-300">✓</span> Helpful support</span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-2"><span className="text-cyan-300">✓</span> Official information</span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-2"><span className="text-violet-300">✓</span> Easy to connect</span>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-indigo-600">Contact options</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">How can we help you?</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">Choose the easiest way to reach us or find our location.</p>
          </div>
          {!loading && !error && (
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-extrabold text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Contact information
            </span>
          )}
        </div>

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="animate-pulse rounded-3xl border border-white bg-white p-7 shadow-sm">
                <div className="h-14 w-14 rounded-2xl bg-slate-100" />
                <div className="mt-6 h-5 w-2/3 rounded bg-slate-100" />
                <div className="mt-4 h-4 w-full rounded bg-slate-100" />
                <div className="mt-2 h-4 w-4/5 rounded bg-slate-100" />
                <div className="mt-7 h-12 rounded-xl bg-slate-100" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div role="alert" className="rounded-3xl border border-red-200 bg-white p-8 text-center shadow-lg">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-2xl">!</div>
            <h2 className="mt-4 text-xl font-extrabold text-red-800">Unable to load contact details</h2>
            <p className="mt-2 text-sm text-red-700">{error}</p>
          </div>
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {hasLocation && renderLinkCard(
                <SiGooglemaps className="h-8 w-8 text-[#4285F4]" />,
                'Find us',
                'Our Location',
                contact?.address || 'View our location on the map.',
                contact?.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact?.address || '')}`,
                'View Location',
                'from-blue-600 to-cyan-500',
              )}
              {hasPhone && renderLinkCard(
                <span className="text-2xl">📞</span>,
                'Give us a call',
                'Call Us',
                phoneNumber,
                `tel:${phoneNumber.replace(/[^\d+]/g, '')}`,
                'Call Now',
                'from-emerald-600 to-teal-500',
              )}
              {hasWhatsapp && renderLinkCard(
                <FaWhatsapp className="h-8 w-8 text-[#25D366]" />,
                'Quick message',
                'WhatsApp',
                `WhatsApp Number: ${contact?.whatsapp}`,
                `https://wa.me/${whatsappNumber}`,
                'Chat on WhatsApp',
                'from-green-600 to-emerald-500',
              )}
              {hasTelegram && renderLinkCard(
                <FaTelegram className="h-8 w-8 text-[#229ED9]" />,
                'Join the conversation',
                'Telegram',
                telegramValue,
                telegramUrl,
                'Open Telegram',
                'from-sky-600 to-blue-600',
              )}
            </div>

            {hasOtherLinks && (
              <div className="mt-10 grid gap-5 lg:grid-cols-2">
                {validSocialLinks.length > 0 && (
                  <section className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-white/90 p-6 shadow-lg shadow-indigo-900/[0.04] sm:p-8">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-500" />
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-2xl">✦</div>
                      <div>
                        <h2 className="text-xl font-black text-slate-900">Connect with us</h2>
                        <p className="mt-1 text-sm leading-6 text-slate-500">Follow CyberSathi for updates and announcements.</p>
                      </div>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3">
                      {validSocialLinks.map((item, index) => renderSocialLink(item, index, 'social'))}
                    </div>
                  </section>
                )}

                {validCustomLinks.length > 0 && (
                  <section className="relative overflow-hidden rounded-3xl border border-violet-100 bg-white/90 p-6 shadow-lg shadow-violet-900/[0.04] sm:p-8">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500" />
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-2xl">↗</div>
                      <div>
                        <h2 className="text-xl font-black text-slate-900">Useful links</h2>
                        <p className="mt-1 text-sm leading-6 text-slate-500">Quick access to helpful portals and services.</p>
                      </div>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3">
                      {validCustomLinks.map((item, index) => renderSocialLink(item, index, 'custom'))}
                    </div>
                  </section>
                )}
              </div>
            )}

            {!hasLocation && !hasPhone && !hasWhatsapp && !hasTelegram && !hasOtherLinks && (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">✉</div>
                <h2 className="mt-4 text-xl font-extrabold text-slate-900">Contact details coming soon</h2>
                <p className="mt-2 text-sm text-slate-500">Contact details abhi add nahi ki gayi hain. Please check back later.</p>
              </div>
            )}
          </>
        )}

        <div className="mt-12 rounded-3xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-blue-50 p-6 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-8">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-indigo-600">CyberSathi</p>
            <h2 className="mt-2 text-xl font-black text-slate-900 sm:text-2xl">Your next opportunity starts with the right information.</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Explore the latest jobs, results, admit cards and admissions.</p>
          </div>
          <Link to="/" className="mt-5 inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-700 via-indigo-600 to-violet-600 px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:shadow-xl sm:mt-0">
            Explore CyberSathi <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <footer className="relative z-10 border-t border-slate-200/80 bg-white/80 px-4 py-7 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
          <Link to="/" className="text-lg font-black tracking-tight text-slate-900">
            Cyber<span className="text-orange-500">Sathi</span>
          </Link>
          <p className="text-xs font-medium text-slate-500">© {new Date().getFullYear()} CyberSathi. All rights reserved.</p>
          <span className="text-xs font-semibold text-slate-500">Stay informed. Stay prepared.</span>
        </div>
      </footer>
    </main>
  )
}

export default ContactUs
