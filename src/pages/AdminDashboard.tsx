
import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiFetch, startTokenAutoRefresh } from '../api/api'

type NotificationDetail = {
    heading: string
    content: string
}

type Notification = {
    id: number
    title: string
    message: string
    category: string
    details?: NotificationDetail[] | null
    isPublished: boolean
    publishedAt: string | null
    createdAt: string
}

// here change contact type 

// here contact api url change 

// const API_URL = 'http://localhost:3000/notifications'

const API_URL = 'https://cybersathi-backend-8umx.onrender.com/notifications'

const DEFAULT_DETAILS: NotificationDetail[] = [
    { heading: 'Important Dates', content: '' },
    { heading: 'Application Fee', content: '' },
    { heading: 'Age Limit', content: '' },
    { heading: 'Total Posts', content: '' },
    { heading: 'Eligibility', content: '' },
]

function getDefaultDetails(): NotificationDetail[] {
    return DEFAULT_DETAILS.map((item) => ({ ...item }))
}

export default function AdminDashboard() {
    const navigate = useNavigate()

    const [notifications, setNotifications] = useState<Notification[]>([])
    const [title, setTitle] = useState('')
    const [message, setMessage] = useState('')
    const [category, setCategory] = useState('JOB')
    const [details, setDetails] = useState<NotificationDetail[]>(getDefaultDetails)

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [publishingId, setPublishingId] = useState<number | null>(null)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [deletingId, setDeletingId] = useState<number | null>(null)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    // contact us  here change states 


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
                navigate('/admin/login')
                throw new Error('Session nahi mila. Dobara login karein.')
            }

            const path = url.replace('http://localhost:3000', '')
            const response = await apiFetch(path, options)
            const data = await response.json().catch(() => ({}))

            if (response.status === 401) {
                sessionStorage.removeItem('adminToken')
                navigate('/admin/login')
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



 // here remove loadcontactsettings and handlesavecontactsettings function 
    const loadNotifications = useCallback(async () => {
        setError('')

        try {
            const data = await apiRequest(API_URL)
            setNotifications(
                Array.isArray(data) ? data : data.notifications ?? [],
            )
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Updates load nahi hue.')
        } finally {
            setLoading(false)
        }
    }, [apiRequest])

    useEffect(() => {
        void loadNotifications()
    }, [loadNotifications])

// here use effect gor contact setting remove 

    useEffect(() => {
        const stopAutoRefresh = startTokenAutoRefresh(() => {
            sessionStorage.removeItem('adminToken')
            navigate('/admin/login', { replace: true })
        })

        return stopAutoRefresh
    }, [navigate])

    function resetForm() {
        setTitle('')
        setMessage('')
        setCategory('JOB')
        setDetails(getDefaultDetails())
        setEditingId(null)
    }

    async function handleCreate(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError('')
        setSuccess('')
        setSaving(true)

        const savedDetails = details
            .map((item) => ({
                heading: item.heading.trim(),
                content: item.content.trim(),
            }))
            .filter((item) => item.heading && item.content)

        try {
            const payload = { title, message, category, details: savedDetails }

            if (editingId !== null) {
                await apiRequest(`${API_URL}/${editingId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                })

                setSuccess('Notification successfully update ho gaya.')
            } else {
                await apiRequest(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                })

                setSuccess('Notification draft successfully create ho gaya.')
            }

            resetForm()
            await loadNotifications()
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Notification save nahi hua.',
            )
        } finally {
            setSaving(false)
        }
    }

    function handleEdit(item: Notification) {
        setEditingId(item.id)
        setTitle(item.title)
        setMessage(item.message)
        setCategory(item.category)

        setDetails(
            Array.isArray(item.details) && item.details.length > 0
                ? item.details.map((detail) => ({
                    heading: detail.heading ?? '',
                    content: detail.content ?? '',
                }))
                : getDefaultDetails(),
        )

        setError('')
        setSuccess('')
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    function handleCancelEdit() {
        resetForm()
        setError('')
        setSuccess('')
    }

    function updateDetail(
        index: number,
        field: keyof NotificationDetail,
        value: string,
    ) {
        setDetails((current) =>
            current.map((item, i) =>
                i === index ? { ...item, [field]: value } : item,
            ),
        )
    }

    function addCustomSection() {
        setDetails((current) => [
            ...current,
            { heading: '', content: '' },
        ])
    }

    function removeSection(index: number) {
        setDetails((current) => current.filter((_, i) => i !== index))
    }

    async function handleDelete(id: number) {
        const confirmed = window.confirm(
            'Kya aap is notification ko permanently delete karna chahte hain?',
        )

        if (!confirmed) return

        setError('')
        setSuccess('')
        setDeletingId(id)

        try {
            await apiRequest(`${API_URL}/${id}`, { method: 'DELETE' })

            if (editingId === id) {
                resetForm()
            }

            setSuccess('Notification successfully delete ho gaya.')
            await loadNotifications()
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Notification delete nahi hua.',
            )
        } finally {
            setDeletingId(null)
        }
    }

    async function handlePublish(id: number) {
        setError('')
        setSuccess('')
        setPublishingId(id)

        try {
            await apiRequest(`${API_URL}/${id}/publish`, {
                method: 'PATCH',
            })

            setSuccess('Notification successfully publish ho gaya.')
            await loadNotifications()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Publish nahi ho paaya.')
        } finally {
            setPublishingId(null)
        }
    }



    async function handleUnpublish(id: number) {
        const confirmed = window.confirm(
            'Kya aap is notification ko public website se unpublish karna chahte hain? Notification admin dashboard mein saved rahega.',
        )

        if (!confirmed) return

        setError('')
        setSuccess('')
        setPublishingId(id)

        try {
            await apiRequest(`${API_URL}/${id}/unpublish`, {
                method: 'PATCH',
            })

            setSuccess('Notification successfully unpublished ho gaya.')
            await loadNotifications()
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Unpublish nahi ho paaya.',
            )
        } finally {
            setPublishingId(null)
        }
    }

    const publishedCount = notifications.filter(
        (item) => item.isPublished,
    ).length

    const draftCount = notifications.length - publishedCount

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-violet-50/50 text-slate-800">
            <header className="sticky top-0 z-20 border-b border-white/70 bg-white/90 shadow-sm backdrop-blur-xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
                    <div>
                        <Link to="/" className="text-2xl font-black tracking-tight text-blue-700">
                            Cyber<span className="text-orange-500">Sathi</span>
                        </Link>
                        <p className="mt-0.5 text-sm font-medium text-slate-500">Admin Dashboard · Control Center</p>
                    </div>
                    <nav className="flex flex-wrap items-center gap-2">
                        <Link
                            to="/admin/dashboard"
                            className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-md"
                        >
                            Dashboard
                        </Link>

                        <a
                            href="#notifications"
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-indigo-50"
                        >
                            Notifications
                        </a>

                        <Link
                            to="/admin/contact-settings"
                            className="rounded-xl border border-violet-200 bg-violet-50 px-4 py-2.5 text-sm font-bold text-violet-700 transition hover:bg-violet-100"
                        >
                            Contact Settings
                        </Link>
                    </nav>
                    <button
                        onClick={logout}
                        className="rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-sm font-bold text-rose-600 shadow-sm transition hover:border-rose-300 hover:bg-rose-50"
                    >
                        Logout
                    </button>
                </div>
            </header>

            <main className="mx-auto max-w-7xl space-y-8 px-5 py-8 md:px-8 md:py-10">
                <section>
                    <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-indigo-700 shadow-sm"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Admin workspace</div>
                    <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">Dashboard <span className="bg-gradient-to-r from-blue-700 via-indigo-600 to-violet-600 bg-clip-text text-transparent">Overview</span></h1>
                    <p className="mt-2 max-w-2xl text-base leading-7 text-slate-500">
                        Manage government job, result, admit card and admission updates.
                    </p>
                </section>


                <section className="grid gap-5 sm:grid-cols-3">
                    {/* Total Notifications */}
                    <div className="group relative overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-lg shadow-blue-900/10 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-6 py-4">
                            <p className="text-sm font-extrabold tracking-wide text-white">
                                Total Notifications
                            </p>
                        </div>
                        <div className="flex items-center justify-between bg-gradient-to-br from-blue-50 to-indigo-50 px-6 py-5">
                            <p className="text-4xl font-black tracking-tight text-blue-700">
                                {notifications.length}
                            </p>
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-2xl text-white shadow-md">
                                <span aria-hidden="true">▤</span>
                            </div>
                        </div>
                        <div className="h-1 bg-gradient-to-r from-blue-600 to-violet-500" />
                    </div>

                    {/* Published */}
                    <div className="group relative overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-lg shadow-emerald-900/10 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                        <div className="bg-gradient-to-r from-emerald-600 to-teal-500 px-6 py-4">
                            <p className="text-sm font-extrabold tracking-wide text-white">
                                Published
                            </p>
                        </div>
                        <div className="flex items-center justify-between bg-gradient-to-br from-emerald-50 to-teal-50 px-6 py-5">
                            <p className="text-4xl font-black tracking-tight text-emerald-700">
                                {publishedCount}
                            </p>
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-2xl text-white shadow-md">
                                <span aria-hidden="true">✓</span>
                            </div>
                        </div>
                        <div className="h-1 bg-gradient-to-r from-emerald-600 to-teal-400" />
                    </div>

                    {/* Drafts */}
                    <div className="group relative overflow-hidden rounded-2xl border border-orange-200 bg-white shadow-lg shadow-orange-900/10 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                        <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-4">
                            <p className="text-sm font-extrabold tracking-wide text-white">
                                Drafts
                            </p>
                        </div>
                        <div className="flex items-center justify-between bg-gradient-to-br from-orange-50 to-amber-50 px-6 py-5">
                            <p className="text-4xl font-black tracking-tight text-orange-600">
                                {draftCount}
                            </p>
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500 text-2xl text-white shadow-md">
                                <span aria-hidden="true">✎</span>
                            </div>
                        </div>
                        <div className="h-1 bg-gradient-to-r from-orange-500 to-amber-400" />
                    </div>
                </section>


                {error && (
                    <p role="alert" className="rounded-2xl border border-rose-200 bg-rose-50/90 p-4 text-sm font-medium text-rose-700 shadow-sm">
                        {error}
                    </p>
                )}

                {success && (
                    <p role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50/90 p-4 text-sm font-medium text-emerald-700 shadow-sm">
                        {success}
                    </p>
                )}

{/* here secton change for contact setting and keep in backupfile */}

                <section className="relative overflow-hidden rounded-3xl border border-blue-200 bg-gradient-to-br from-sky-50 via-indigo-50/80 to-violet-100 p-4 shadow-xl shadow-indigo-200/40 sm:p-6 md:p-8">
                    {/* Top gradient accent */}
                    <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-cyan-400 via-blue-600 to-violet-600" />

                    {/* Section header */}
                    <div className="mb-7 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-indigo-100 bg-white/90 p-5 shadow-md shadow-indigo-900/5 sm:p-6">
                        <div className="flex min-w-0 items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-violet-600 text-2xl text-white shadow-lg shadow-indigo-300/40">
                                <span aria-hidden="true">✎</span>
                            </div>

                            <div className="min-w-0">
                                <span className="inline-flex rounded-full bg-gradient-to-r from-blue-100 to-violet-100 px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider text-indigo-800">
                                    Content Studio
                                </span>

                                <h2 className="mt-3 break-words bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-700 bg-clip-text text-2xl font-black tracking-tight text-transparent sm:text-3xl">
                                    {editingId !== null ? 'Edit Notification' : 'Create Notification'}
                                </h2>

                                <p className="mt-2 text-sm font-medium leading-6 text-slate-600">
                                    Add notification details. Save as draft before publishing.
                                </p>
                            </div>
                        </div>

                        <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-600 to-violet-600 text-2xl text-white shadow-lg shadow-blue-300/40 sm:flex">
                            ✦
                        </div>
                    </div>

                    <form
                        onSubmit={handleCreate}
                        className="space-y-6"
                    >
                        {/* Notification Title */}
                        <div className="overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-md shadow-blue-900/5 transition hover:shadow-lg">
                            <label
                                htmlFor="title"
                                className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 px-4 py-3 text-sm font-extrabold tracking-wide text-white"
                            >
                                Notification Title
                            </label>

                            <div className="bg-gradient-to-br from-blue-50/70 to-white p-4">
                                <input
                                    id="title"
                                    required
                                    maxLength={200}
                                    value={title}
                                    onChange={(event) => setTitle(event.target.value)}
                                    placeholder="e.g. BPSC Teacher Recruitment Update"
                                    className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3.5 text-sm font-semibold text-slate-800 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                />
                            </div>
                        </div>

                        {/* Category */}
                        <div className="overflow-hidden rounded-2xl border border-violet-200 bg-white shadow-md shadow-violet-900/5 transition hover:shadow-lg">
                            <label
                                htmlFor="category"
                                className="block bg-gradient-to-r from-violet-600 to-purple-700 px-4 py-3 text-sm font-extrabold tracking-wide text-white"
                            >
                                Category
                            </label>

                            <div className="bg-gradient-to-br from-violet-50/70 to-white p-4">
                                <select
                                    id="category"
                                    value={category}
                                    onChange={(event) => setCategory(event.target.value)}
                                    className="w-full rounded-xl border border-violet-200 bg-white px-4 py-3.5 text-sm font-semibold text-slate-800 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                                >
                                    <option value="JOB">Latest Jobs</option>
                                    <option value="RESULT">Results</option>
                                    <option value="ADMIT_CARD">Admit Cards</option>
                                    <option value="ADMISSION">Admissions</option>
                                    <option value="SCHOLARSHIP">Scholarships</option>
                                    <option value="GENERAL">General</option>
                                </select>
                            </div>
                        </div>

                        {/* Notification Summary */}
                        <div className="overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-md shadow-emerald-900/5 transition hover:shadow-lg">
                            <label
                                htmlFor="message"
                                className="block bg-gradient-to-r from-emerald-600 to-teal-700 px-4 py-3 text-sm font-extrabold tracking-wide text-white"
                            >
                                Notification Summary
                            </label>

                            <div className="bg-gradient-to-br from-emerald-50/70 to-white p-4">
                                <textarea
                                    id="message"
                                    required
                                    rows={4}
                                    value={message}
                                    onChange={(event) => setMessage(event.target.value)}
                                    placeholder="Write a short summary of this notification..."
                                    className="w-full resize-y rounded-xl border border-emerald-200 bg-white px-4 py-3.5 text-sm font-medium leading-7 text-slate-800 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                                />
                            </div>
                        </div>

                        {/* Notification Details Sections */}
                        <div className="space-y-5 overflow-hidden rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-4 shadow-lg shadow-indigo-100/70 sm:p-6">
                            <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-indigo-100 bg-white p-4 shadow-sm sm:p-5">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 text-xl text-white shadow-lg shadow-indigo-200">
                                    ▤
                                </div>

                                <div className="min-w-0">
                                    <h3 className="inline-flex rounded-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-4 py-2.5 text-base font-extrabold text-white shadow-md">
                                        Notification Details Sections
                                    </h3>
                                    <p className="mt-2 text-sm font-medium leading-6 text-slate-600">
                                        Fill the relevant sections. Empty sections are not saved.
                                    </p>
                                </div>
                            </div>

                            {details.map((detail, index) => (
                                <div
                                    key={index}
                                    className="overflow-hidden rounded-2xl border border-indigo-200 bg-white shadow-md shadow-indigo-900/5 transition duration-300 hover:border-indigo-300 hover:shadow-lg"
                                >
                                    <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-indigo-50 to-violet-50 p-4">
                                        <span className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-2.5 text-sm font-extrabold text-white shadow-md">
                                            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/20">
                                                {index + 1}
                                            </span>
                                            Section {index + 1}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() => removeSection(index)}
                                            className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-bold text-red-600 transition hover:border-red-400 hover:bg-red-600 hover:text-white"
                                        >
                                            <span aria-hidden="true">×</span>
                                            Remove Section
                                        </button>
                                    </div>

                                    <div className="space-y-5 p-4 sm:p-5">
                                        <div className="overflow-hidden rounded-xl border border-cyan-200">
                                            <label
                                                htmlFor={`detail-heading-${index}`}
                                                className="block bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-3 text-sm font-extrabold text-white"
                                            >
                                                Section Heading
                                            </label>

                                            <div className="bg-gradient-to-br from-cyan-50/70 to-white p-3">
                                                <input
                                                    id={`detail-heading-${index}`}
                                                    value={detail.heading}
                                                    onChange={(event) =>
                                                        updateDetail(index, 'heading', event.target.value)
                                                    }
                                                    maxLength={150}
                                                    placeholder="e.g. Important Dates"
                                                    className="w-full rounded-xl border border-cyan-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                                                />
                                            </div>
                                        </div>

                                        <div className="overflow-hidden rounded-xl border border-fuchsia-200">
                                            <label
                                                htmlFor={`detail-content-${index}`}
                                                className="block bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-3 text-sm font-extrabold text-white"
                                            >
                                                Section Content
                                            </label>

                                            <div className="bg-gradient-to-br from-violet-50/70 to-white p-3">
                                                <textarea
                                                    id={`detail-content-${index}`}
                                                    rows={3}
                                                    value={detail.content}
                                                    onChange={(event) =>
                                                        updateDetail(index, 'content', event.target.value)
                                                    }
                                                    placeholder="Write the details for this section..."
                                                    className="w-full resize-y rounded-xl border border-violet-200 bg-white px-4 py-3 text-sm font-medium leading-7 text-slate-800 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={addCustomSection}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-white px-5 py-3.5 text-sm font-extrabold text-indigo-700 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-indigo-400 hover:bg-gradient-to-r hover:from-blue-600 hover:to-violet-600 hover:text-white hover:shadow-lg sm:w-auto"
                            >
                                <span className="text-xl leading-none">+</span>
                                Add Custom Section
                            </button>
                        </div>

                        {/* Form Actions */}
                        <div className="flex flex-wrap gap-3 rounded-2xl border border-indigo-100 bg-white/80 p-4 shadow-sm sm:p-5">
                            <button
                                type="submit"
                                disabled={saving}
                                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-700 via-indigo-600 to-violet-600 px-6 py-3.5 font-extrabold text-white shadow-lg shadow-indigo-300/40 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {saving
                                    ? 'Saving...'
                                    : editingId !== null
                                        ? 'Update Notification'
                                        : 'Save as Draft'}
                            </button>

                            {editingId !== null && (
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    disabled={saving}
                                    className="rounded-xl border border-slate-300 bg-white px-6 py-3.5 font-bold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </section>



                <section
                    id="notifications"
                    className="relative overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-5 shadow-xl shadow-emerald-900/10 md:p-8"
                >                    
                <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />

                    {/* Header */}
                    <div className="mb-7 flex flex-col gap-4 rounded-2xl border border-emerald-100 bg-white/90 p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between md:p-6">
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-2xl text-white shadow-lg shadow-emerald-200">
                                ♧
                            </div>
                            <div>
                                <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800">
                                    Publishing Center
                                </span>
                                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 md:text-3xl">
                                    Manage Notifications
                                </h2>
                                <p className="mt-1 text-sm leading-6 text-slate-500">
                                    Manage, edit, publish, and remove website notifications.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => void loadNotifications()}
                            disabled={loading}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white px-5 py-3 text-sm font-bold text-emerald-700 shadow-sm transition hover:border-emerald-400 hover:bg-emerald-50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <span className={loading ? "animate-spin" : ""}>↻</span>
                            {loading ? "Refreshing..." : "Refresh"}
                        </button>
                    </div>

                    {/* Loading State */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-emerald-100 bg-white/80 px-4 py-12 text-center">
                            <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600" />
                            <p className="mt-4 font-semibold text-slate-600">
                                Loading notifications...
                            </p>
                        </div>
                    ) : notifications.length === 0 ? (
                        /* Empty State */
                        <div className="rounded-2xl border-2 border-dashed border-emerald-200 bg-white/70 px-4 py-12 text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-cyan-100 text-3xl">
                                ♧
                            </div>
                            <h3 className="mt-4 text-lg font-extrabold text-slate-800">
                                No Notifications Yet
                            </h3>
                            <p className="mt-2 text-sm text-slate-500">
                                Abhi koi notification nahi hai. Create Notification section se naya notification add karein.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* List Header */}
                            <div className="flex flex-wrap items-center justify-between gap-2 px-1">
                                <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-700">
                                    All Notifications
                                </h3>
                                <span className="rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs font-bold text-emerald-700">
                                    {notifications.length} Total
                                </span>
                            </div>

                            {notifications.map((item) => (
                                <article
                                    key={item.id}
                                    className={`group relative overflow-hidden rounded-2xl border bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg ${item.isPublished
                                        ? "border-emerald-200 hover:border-emerald-300"
                                        : "border-amber-200 hover:border-amber-300"
                                        }`}
                                >
                                    <div
                                        className={`absolute inset-y-0 left-0 w-1 ${item.isPublished
                                            ? "bg-gradient-to-b from-emerald-400 to-teal-600"
                                            : "bg-gradient-to-b from-amber-400 to-orange-500"
                                            }`}
                                    />

                                    <div className="flex flex-col gap-5 p-4 pl-5 sm:p-5 sm:pl-6 lg:flex-row lg:items-center lg:justify-between">
                                        {/* Notification Information */}
                                        <div className="min-w-0 flex-1">
                                            <div className="mb-3 flex flex-wrap items-center gap-2">
                                                <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-blue-700 ring-1 ring-inset ring-blue-100">
                                                    {item.category.replace("_", " ")}
                                                </span>

                                                <span
                                                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold ring-1 ring-inset ${item.isPublished
                                                        ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                                                        : "bg-amber-50 text-amber-700 ring-amber-200"
                                                        }`}
                                                >
                                                    <span
                                                        className={`h-1.5 w-1.5 rounded-full ${item.isPublished
                                                            ? "bg-emerald-500"
                                                            : "bg-amber-500"
                                                            }`}
                                                    />
                                                    {item.isPublished ? "Published" : "Draft"}
                                                </span>
                                            </div>

                                            <h3 className="break-words text-base font-extrabold leading-6 text-slate-900 transition group-hover:text-emerald-800 sm:text-lg">
                                                {item.title}
                                            </h3>

                                            <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">
                                                {item.message}
                                            </p>

                                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                                <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-500 ring-1 ring-inset ring-slate-200">
                                                    <span>▤</span>
                                                    {item.details?.length ?? 0} detail sections
                                                </span>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex shrink-0 flex-wrap gap-2 border-t border-slate-100 pt-4 lg:max-w-[340px] lg:justify-end lg:border-t-0 lg:pt-0">
                                            <button
                                                type="button"
                                                onClick={() => handleEdit(item)}
                                                disabled={saving || deletingId !== null}
                                                className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-bold text-indigo-700 transition hover:border-indigo-300 hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => void handleDelete(item.id)}
                                                disabled={deletingId !== null || saving}
                                                className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-bold text-rose-600 transition hover:border-rose-300 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {deletingId === item.id ? "Deleting..." : "Delete"}
                                            </button>

                                            {item.isPublished ? (
                                                <button
                                                    type="button"
                                                    onClick={() => void handleUnpublish(item.id)}
                                                    disabled={publishingId !== null || deletingId !== null || saving}
                                                    className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm shadow-orange-200 transition hover:brightness-105 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    {publishingId === item.id ? "Unpublishing..." : "Unpublish"}
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => void handlePublish(item.id)}
                                                    disabled={publishingId !== null || deletingId !== null || saving}
                                                    className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm shadow-emerald-200 transition hover:brightness-105 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    {publishingId === item.id ? "Publishing..." : "Publish"}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>


                <div className="pb-6 text-center">
                    <Link to="/" className="text-sm font-semibold text-blue-700 hover:underline">
                        View Public Website →
                    </Link>
                </div>
            </main>
        </div>
    )
}
