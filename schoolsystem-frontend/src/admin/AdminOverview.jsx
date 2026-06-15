import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { Link } from 'react-router-dom'

function StatCard({ label, value, to }) {
  const content = (
    <div className="rounded-2xl bg-white p-5 shadow hover:shadow-md">
      <div className="text-sm font-semibold text-slate-600">{label}</div>
      <div className="mt-2 text-3xl font-bold text-slate-900">{value}</div>
      <div className="mt-3 text-sm font-medium text-blue-700">Manage →</div>
    </div>
  )

  return to ? <Link to={to}>{content}</Link> : content
}

export function AdminOverview() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    api
      .getDashboardStats()
      .then((data) => {
        if (!cancelled) setStats(data)
      })
      .catch((e) => {
        if (!cancelled) setError(e?.message ?? 'Failed to load dashboard stats')
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow">
        <h2 className="text-2xl font-bold text-slate-900">Admin Dashboard</h2>
        <p className="mt-1 text-slate-600">Manage students, teachers, parents, notices, and more.</p>
        {error && <p className="mt-3 text-sm font-medium text-red-600">{error}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Students" value={stats?.students ?? '—'} to="/dashboard/admin/students" />
        <StatCard label="Teachers" value={stats?.teachers ?? '—'} to="/dashboard/admin/teachers" />
        <StatCard label="Parents" value={stats?.parents ?? '—'} to="/dashboard/admin/parents" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow">
          <h3 className="text-lg font-bold text-slate-900">Quick actions</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700" to="/dashboard/admin/students">
              Add/Manage Students
            </Link>
            <Link className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700" to="/dashboard/admin/teachers">
              Add/Manage Teachers
            </Link>
            <Link className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700" to="/dashboard/admin/parents">
              Add/Manage Parents
            </Link>
          </div>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow">
          <h3 className="text-lg font-bold text-slate-900">Modules</h3>
          <p className="mt-2 text-slate-600">
            Timetable, attendance, notices, user management, reports, support, and settings are available as pages now; we can
            expand each with full backend logic next.
          </p>
        </div>
      </div>
    </div>
  )
}

