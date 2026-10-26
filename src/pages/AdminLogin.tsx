
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaShieldAlt, FaArrowLeft, FaArrowRight, FaLock, FaEnvelope } from 'react-icons/fa'

const API_URL = 'http://localhost:3000/auth/login'

export default function AdminLogin() {
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError('')
        setLoading(true)

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Invalid email or password.')
            }

            const token =
                data.accessToken ??
                data.access_token ??
                data.token

            if (!token) {
                throw new Error(
                    'Login response mein token nahi mila. Backend response check karein.',
                )
            }

            sessionStorage.setItem('adminToken', token)
            navigate('/admin/dashboard')
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Login nahi ho paya. Backend connection check karein.',
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#eef3ff] via-[#f8f7ff] to-[#f3eaff] px-4 py-10 sm:px-6">
            {/* Soft background glow */}
            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-400/20 blur-[100px]" />
                <div className="absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-fuchsia-400/20 blur-[110px]" />
                <div className="absolute right-[20%] top-[15%] h-48 w-48 rounded-full bg-violet-400/10 blur-[80px]" />
                <div className="absolute inset-0 bg-[radial-gradient(rgba(99,102,241,0.08)_1px,transparent_1px)] [background-size:24px_24px]" />
            </div>

            <div className="w-full max-w-md">
                {/* Brand */}
                <div className="mb-7 flex flex-col items-center text-center">
                    <Link to="/" className="group inline-flex items-center gap-3">
                        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-2xl text-white shadow-xl shadow-violet-500/25 transition duration-300 group-hover:-translate-y-1">
                            <FaShieldAlt />
                        </span>

                        <span className="text-left">
                            <span className="block text-3xl font-black tracking-tight text-slate-900">
                                Cyber<span className="text-orange-500">Sathi</span>
                            </span>
                            <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                                Your career companion
                            </span>
                        </span>
                    </Link>
                </div>

                {/* Login card with gradient outline */}
                <div className="rounded-[2rem] bg-gradient-to-br from-blue-500 via-violet-500 to-fuchsia-400 p-px shadow-[0_24px_70px_rgba(79,70,229,0.16)]">
                    <div className="rounded-[calc(2rem-1px)] bg-white/95 p-6 backdrop-blur-xl sm:p-9">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-700"
                        >
                            <FaArrowLeft className="text-xs" />
                            Back to CyberSathi
                        </Link>

                        <div className="mt-8">
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-700">
                                <FaLock />
                                SECURE ADMIN ACCESS
                            </div>

                            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                                Welcome back
                            </h1>

                            <p className="mt-3 text-sm leading-6 text-slate-500">
                                Sign in to manage CyberSathi updates and announcements.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-bold text-slate-700"
                                >
                                    Email address
                                </label>

                                <div className="relative">
                                    <FaEnvelope className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        autoComplete="username"
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                        placeholder="admin@example.com"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="mb-2 block text-sm font-bold text-slate-700"
                                >
                                    Password
                                </label>

                                <div className="relative">
                                    <FaLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                                    <input
                                        id="password"
                                        type="password"
                                        required
                                        autoComplete="current-password"
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                        placeholder="Enter your password"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
                                    />
                                </div>
                            </div>

                            {error && (
                                <p
                                    role="alert"
                                    className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm leading-6 text-red-700"
                                >
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="group flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-4 py-4 font-bold text-white shadow-lg shadow-indigo-600/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-600/25 focus:outline-none focus:ring-4 focus:ring-violet-500/20 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                            >
                                {loading ? 'Signing in...' : 'Sign In to Dashboard'}
                                {!loading && (
                                    <FaArrowRight className="text-sm transition group-hover:translate-x-1" />
                                )}
                            </button>
                        </form>

                        <div className="mt-7 flex items-center gap-3">
                            <span className="h-px flex-1 bg-slate-100" />
                            <span className="text-xs font-medium text-slate-400">
                                Protected access
                            </span>
                            <span className="h-px flex-1 bg-slate-100" />
                        </div>

                        <p className="mt-5 text-center text-xs leading-5 text-slate-500">
                            <FaShieldAlt className="mr-1 inline text-emerald-600" />
                            Authorized administrators only.
                        </p>
                    </div>
                </div>

                <p className="mt-6 text-center text-xs text-slate-400">
                    © {new Date().getFullYear()} CyberSathi. Stay informed, stay prepared.
                </p>
            </div>
        </main>
    )
}
