import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiFetch, startTokenAutoRefresh } from '../api/api'

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

export default function ContactSettingsPage() {
    const navigate = useNavigate()

    const [contactAddress, setContactAddress] = useState('')
    const [contactMapUrl, setContactMapUrl] = useState('')
    const [contactPhone, setContactPhone] = useState('')
    const [contactWhatsapp, setContactWhatsapp] = useState('')
    const [contactTelegram, setContactTelegram] = useState('')
    const [socialLinks, setSocialLinks] = useState<ContactLink[]>([])
    const [customLinks, setCustomLinks] = useState<ContactLink[]>([])

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const logout = async () => {
        try {
            await fetch('http://localhost:3000/auth/logout', {
                method: 'POST',
                credentials: 'include',
            })
        } finally {
            sessionStorage.removeItem('adminToken')
            navigate('/admin/login', { replace: true })
        }
    }

    const apiRequest = useCallback(
        async (url: string, options: RequestInit = {}) => {
            const token = sessionStorage.getItem('adminToken')

            if (!token) {
                navigate('/admin/login', { replace: true })
                throw new Error('Session nahi mila. Dobara login karein.')
            }

            const path = url.replace('http://localhost:3000', '')
            const response = await apiFetch(path, options)
            const data = await response.json().catch(() => ({}))

            if (response.status === 401) {
                sessionStorage.removeItem('adminToken')
                navigate('/admin/login', { replace: true })
                throw new Error('Session expire ho gaya. Dobara login karein.')
            }

            if (!response.ok) {
                throw new Error(
                    Array.isArray(data.message)
                        ? data.message.join(', ')
                        : data.message || 'Request complete nahi ho paayi.',
                )
            }

            return data
        },
        [navigate],
    )

    const loadContactSettings = useCallback(async () => {
        setError('')

        try {
            const data: ContactSettings = await apiRequest(CONTACT_API_URL)
            setContactAddress(data.address ?? '')
            setContactMapUrl(data.googleMapsUrl ?? '')
            setContactPhone(data.phone ?? '')
            setContactWhatsapp(data.whatsapp ?? '')
            setContactTelegram(data.telegram ?? '')
            setSocialLinks(Array.isArray(data.socialLinks) ? data.socialLinks : [])
            setCustomLinks(Array.isArray(data.customLinks) ? data.customLinks : [])
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Contact settings load nahi hui.')
        } finally {
            setLoading(false)
        }
    }, [apiRequest])

    useEffect(() => {
        void loadContactSettings()
    }, [loadContactSettings])

    useEffect(() => {
        const stopAutoRefresh = startTokenAutoRefresh(() => {
            sessionStorage.removeItem('adminToken')
            navigate('/admin/login', { replace: true })
        })

        return stopAutoRefresh
    }, [navigate])

    async function handleSaveContactSettings(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError('')
        setSuccess('')
        setSaving(true)

        try {
            await apiRequest(CONTACT_API_URL, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    address: contactAddress.trim() || null,
                    googleMapsUrl: contactMapUrl.trim() || null,
                    phone: contactPhone.trim() || null,
                    whatsapp: contactWhatsapp.trim() || null,
                    telegram: contactTelegram.trim() || null,
                    socialLinks: socialLinks.filter((item) => item.heading.trim() && item.url.trim()),
                    customLinks: customLinks.filter((item) => item.heading.trim() && item.url.trim()),
                }),
            })

            setSuccess('Contact settings successfully save ho gayi.')
            await loadContactSettings()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Contact settings save nahi hui.')
        } finally {
            setSaving(false)
        }
    }

    const inputClass =
        'w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-medium text-slate-800 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'


    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/50 to-violet-50/60 text-slate-800">
            <header className="sticky top-0 z-30 border-b border-white/70 bg-white/90 shadow-sm backdrop-blur-xl">
                <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 md:px-8">
                    <div>
                        <Link to="/" className="text-2xl font-black tracking-tight text-blue-700">
                            Cyber<span className="text-orange-500">Sathi</span>
                        </Link>
                        <p className="mt-0.5 text-sm font-medium text-slate-500">Admin Dashboard · Control Center</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => void logout()}
                        className="rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-sm font-bold text-rose-600 shadow-sm transition hover:border-rose-300 hover:bg-rose-50"
                    >
                        Logout
                    </button>
                </div>
                <nav className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-5 pb-4 md:px-8">
                    <Link
                        to="/admin/dashboard"
                        className="shrink-0 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50"
                    >
                        Dashboard
                    </Link>
                    <Link
                        to="/admin/dashboard#notifications"
                        className="shrink-0 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50"
                    >
                        Notifications
                    </Link>
                    <Link
                        to="/admin/contact-settings"
                        className="shrink-0 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-2.5 text-sm font-extrabold text-white shadow-md shadow-indigo-200"
                    >
                        Contact Settings
                    </Link>
                </nav>
            </header>

            <main className="mx-auto max-w-7xl space-y-7 px-5 py-8 md:px-8 md:py-10">
                <section className="relative overflow-hidden rounded-3xl border border-violet-300 bg-gradient-to-br from-violet-100 via-fuchsia-50 to-blue-100 p-6 shadow-xl shadow-violet-200/80 md:p-8">
                    <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-blue-600 via-violet-600 to-fuchsia-500" />
                    <div className="group relative mb-6 flex flex-wrap items-center justify-between gap-5 overflow-hidden rounded-2xl border border-indigo-200 bg-white shadow-lg shadow-indigo-200/40 transition duration-300 hover:shadow-xl">
                        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-cyan-400 via-blue-600 to-violet-600" />
                        <div className="relative min-w-0 p-5 sm:p-6">
                            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-gradient-to-r from-blue-100 to-violet-100 px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider text-indigo-800">
                                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                Website Profile
                            </span>
                            <h1 className="mt-4 bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-700 bg-clip-text text-2xl font-black tracking-tight text-transparent sm:text-3xl">
                                Contact Settings
                            </h1>
                            <p className="mt-2 text-sm font-medium leading-6 text-slate-600 sm:text-base">
                                Your public-facing contact details and links
                            </p>
                            <div className="mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-cyan-400 via-blue-600 to-violet-600" />
                        </div>
                        <div className="relative mr-5 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 text-2xl text-white shadow-lg shadow-indigo-300/50 transition duration-300 group-hover:rotate-3 group-hover:scale-105 sm:mr-6">
                            <span aria-hidden="true">✦</span>
                        </div>
                    </div>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                        Manage your public contact information, social media and custom links.
                    </p>
                    <Link
                        to="/contact"
                        className="mt-4 inline-flex rounded-xl border border-indigo-200 bg-white px-4 py-2.5 text-sm font-extrabold text-indigo-700 shadow-sm transition hover:bg-indigo-50"
                    >
                        View Public Contact Page ↗
                    </Link>
                </section>

                {error && (
                    <div role="alert" className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700 shadow-sm">
                        <span className="text-lg">!</span>
                        <p>{error}</p>
                    </div>
                )}

                {success && (
                    <div role="status" className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700 shadow-sm">
                        <span className="text-lg">✓</span>
                        <p>{success}</p>
                    </div>
                )}

                {loading ? (
                    <div className="rounded-3xl border border-indigo-100 bg-white p-12 text-center shadow-lg shadow-indigo-900/5">
                        <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
                        <p className="mt-4 font-bold text-slate-600">Loading contact settings...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSaveContactSettings} className="space-y-7">
                        <section className="relative overflow-hidden rounded-3xl border border-blue-200 bg-gradient-to-br from-sky-50 via-indigo-50/80 to-violet-100 p-4 shadow-xl shadow-indigo-200/40 sm:p-6 md:p-8">
                            <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-cyan-400 via-blue-600 to-violet-600" />
                            <div className="relative mb-6 rounded-2xl border border-indigo-100 bg-white/90 p-4 shadow-md sm:p-5">
                                <h2 className="text-lg font-black text-slate-900 sm:text-xl">Contact Information</h2>
                                <p className="mt-1 text-sm font-medium text-slate-500">Phone, location and direct contact channels</p>
                            </div>
                            <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="contactAddress" className="mb-0 block rounded-t-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-extrabold text-white shadow-sm">Office Address</label>
                                    <textarea
                                        id="contactAddress"
                                        rows={3}
                                        value={contactAddress}
                                        onChange={(event) => setContactAddress(event.target.value)}
                                        placeholder="Enter complete address"
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="contactMapUrl" className="mb-0 block rounded-t-xl bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-3 text-sm font-extrabold text-white shadow-sm">Google Maps URL</label>
                                    <input
                                        id="contactMapUrl"
                                        type="url"
                                        value={contactMapUrl}
                                        onChange={(event) => setContactMapUrl(event.target.value)}
                                        placeholder="https://maps.google.com/..."
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="contactPhone" className="mb-0 block rounded-t-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3 text-sm font-extrabold text-white shadow-sm">Phone Number</label>
                                    <input
                                        id="contactPhone"
                                        type="tel"
                                        value={contactPhone}
                                        onChange={(event) => setContactPhone(event.target.value)}
                                        placeholder="Enter phone number"
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="contactWhatsapp" className="mb-0 block rounded-t-xl bg-gradient-to-r from-green-600 to-emerald-500 px-4 py-3 text-sm font-extrabold text-white shadow-sm">WhatsApp Number</label>
                                    <input
                                        id="contactWhatsapp"
                                        type="tel"
                                        value={contactWhatsapp}
                                        onChange={(event) => setContactWhatsapp(event.target.value)}
                                        placeholder="Country code ke saath number"
                                        className={inputClass}
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="contactTelegram" className="mb-0 block rounded-t-xl bg-gradient-to-r from-sky-600 to-cyan-500 px-4 py-3 text-sm font-extrabold text-white shadow-sm">Telegram Username or Link</label>
                                    <input
                                        id="contactTelegram"
                                        value={contactTelegram}
                                        onChange={(event) => setContactTelegram(event.target.value)}
                                        placeholder="@username or https://t.me/username"
                                        className={inputClass}
                                    />
                                </div>
                            </div>
                        </section>

                        <section className="space-y-4 overflow-hidden rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-4 shadow-md shadow-indigo-100/70 md:p-5">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <h2 className="inline-flex rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-extrabold text-white shadow-md">Social Media Links</h2>
                                    <p className="mt-1 text-sm leading-6 text-slate-500">Instagram, Facebook, YouTube or any other platform.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setSocialLinks((items) => [...items, { heading: '', url: '' }])}
                                    className="rounded-xl border border-indigo-200 bg-white px-4 py-2.5 text-sm font-extrabold text-indigo-700 shadow-sm transition hover:border-indigo-400 hover:bg-indigo-100"
                                >
                                    + Add Social Link
                                </button>
                            </div>

                            <div className="space-y-4">
                                {socialLinks.map((item, index) => (
                                    <div key={index} className="group relative grid gap-4 overflow-hidden rounded-2xl border border-indigo-100 bg-white p-4 shadow-md shadow-indigo-950/5 transition duration-300 hover:border-indigo-300 hover:shadow-lg sm:grid-cols-[1fr_2fr_auto] sm:items-center">
                                        <div className="min-w-0">
                                            <label htmlFor={`social-heading-${index}`} className="mb-2 block text-xs font-extrabold uppercase tracking-wide text-indigo-700">Social Media Name</label>
                                            <input
                                                id={`social-heading-${index}`}
                                                value={item.heading}
                                                onChange={(event) => setSocialLinks((items) => items.map((link, i) => i === index ? { ...link, heading: event.target.value } : link))}
                                                placeholder="e.g. Instagram"
                                                className={inputClass}
                                            />
                                        </div>
                                        <div className="min-w-0">
                                            <label htmlFor={`social-url-${index}`} className="mb-2 block text-xs font-extrabold uppercase tracking-wide text-blue-700">Profile URL</label>
                                            <input
                                                id={`social-url-${index}`}
                                                type="url"
                                                value={item.url}
                                                onChange={(event) => setSocialLinks((items) => items.map((link, i) => i === index ? { ...link, url: event.target.value } : link))}
                                                placeholder="https://..."
                                                className={inputClass}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setSocialLinks((items) => items.filter((_, i) => i !== index))}
                                            className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-extrabold text-rose-600 transition hover:border-rose-300 hover:bg-rose-100"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                {socialLinks.length === 0 && (
                                    <div className="rounded-2xl border-2 border-dashed border-indigo-200 bg-white/70 p-7 text-center">
                                        <p className="font-bold text-slate-600">No social links added yet</p>
                                        <p className="mt-1 text-sm text-slate-500">Use “Add Social Link” to add your social profiles.</p>
                                    </div>
                                )}
                            </div>
                        </section>

                        <section className="group relative space-y-4 overflow-hidden rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50/70 p-4 shadow-md shadow-violet-100/70 transition duration-300 hover:border-violet-300 md:p-5">
                            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500" />
                            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                                <div>
                                    <h2 className="inline-flex rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 px-4 py-2.5 text-sm font-extrabold text-white shadow-lg shadow-violet-500/20">Custom Links</h2>
                                    <p className="mt-2 text-sm leading-6 text-slate-600">Apni heading aur URL add karein.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setCustomLinks((items) => [...items, { heading: '', url: '' }])}
                                    className="rounded-xl border border-violet-200 bg-white px-4 py-2.5 text-sm font-extrabold text-violet-700 shadow-sm transition hover:border-violet-400 hover:bg-violet-100"
                                >
                                    + Add Custom Link
                                </button>
                            </div>

                            <div className="space-y-4">
                                {customLinks.map((item, index) => (
                                    <div key={index} className="group relative grid gap-4 overflow-hidden rounded-2xl border border-violet-100 bg-white p-4 shadow-md shadow-violet-950/5 transition duration-300 hover:border-violet-300 hover:shadow-lg sm:grid-cols-[1fr_2fr_auto] sm:items-center">
                                        <div className="min-w-0">
                                            <label htmlFor={`custom-heading-${index}`} className="mb-2 block text-xs font-extrabold uppercase tracking-wide text-violet-700">Link Heading</label>
                                            <input
                                                id={`custom-heading-${index}`}
                                                value={item.heading}
                                                onChange={(event) => setCustomLinks((items) => items.map((link, i) => i === index ? { ...link, heading: event.target.value } : link))}
                                                placeholder="e.g. Join Our Community"
                                                className={inputClass}
                                            />
                                        </div>
                                        <div className="min-w-0">
                                            <label htmlFor={`custom-url-${index}`} className="mb-2 block text-xs font-extrabold uppercase tracking-wide text-fuchsia-700">Destination URL</label>
                                            <input
                                                id={`custom-url-${index}`}
                                                type="url"
                                                value={item.url}
                                                onChange={(event) => setCustomLinks((items) => items.map((link, i) => i === index ? { ...link, url: event.target.value } : link))}
                                                placeholder="https://..."
                                                className={inputClass}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setCustomLinks((items) => items.filter((_, i) => i !== index))}
                                            className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-extrabold text-rose-600 transition hover:border-rose-300 hover:bg-rose-100"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                {customLinks.length === 0 && (
                                    <div className="rounded-2xl border-2 border-dashed border-violet-200 bg-white/70 p-7 text-center">
                                        <p className="font-bold text-slate-600">No custom links added yet</p>
                                        <p className="mt-1 text-sm text-slate-500">Use “Add Custom Link” to add another useful destination.</p>
                                    </div>
                                )}
                            </div>
                        </section>

                        <div className="flex justify-center pt-2">
                            <button
                                type="submit"
                                disabled={saving}
                                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-700 via-indigo-600 to-violet-600 px-6 py-3 text-sm font-extrabold text-white shadow-md shadow-indigo-300/30 transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {saving ? 'Saving Changes...' : 'Save Contact Settings'}
                            </button>
                        </div>
                    </form>
                )}
            </main>
        </div>
    )
}
