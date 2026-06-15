import { useEffect, useMemo, useState } from 'react'
import { api } from '../api.js'

const emptyForm = {
  dayOfWeek: 'Monday',
  className: '',
  section: '',
  slot: 'P1',
  subject: '',
  teacherName: '',
}

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const slots = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6']

export function AdminTimetable() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [query, setQuery] = useState('')

  const refresh = () => {
    setLoading(true)
    setError('')
    api
      .listTimetable()
      .then((data) => setEntries(Array.isArray(data) ? data : []))
      .catch((e) => setError(e?.message ?? 'Failed to load timetable'))
      .finally(() => setLoading(false))
  }

  useEffect(() => refresh(), [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return entries
    return entries.filter((e) =>
      `${e.dayOfWeek} ${e.className} ${e.section ?? ''} ${e.slot} ${e.subject} ${e.teacherName}`.toLowerCase().includes(q),
    )
  }, [entries, query])

  const reset = () => {
    setForm(emptyForm)
    setEditingId(null)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    const payload = {
      dayOfWeek: form.dayOfWeek,
      className: form.className.trim(),
      section: form.section.trim(),
      slot: form.slot,
      subject: form.subject.trim(),
      teacherName: form.teacherName.trim(),
    }
    try {
      if (editingId) await api.updateTimetable(editingId, payload)
      else await api.createTimetable(payload)
      reset()
      refresh()
    } catch (err) {
      setError(err?.message ?? 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const startEdit = (row) => {
    setEditingId(row.id)
    setForm({
      dayOfWeek: row.dayOfWeek,
      className: row.className,
      section: row.section ?? '',
      slot: row.slot,
      subject: row.subject,
      teacherName: row.teacherName,
    })
  }

  const remove = async (row) => {
    if (!confirm('Delete this timetable entry?')) return
    setError('')
    try {
      await api.deleteTimetable(row.id)
      refresh()
    } catch (err) {
      setError(err?.message ?? 'Delete failed')
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-white p-6 shadow">
        <h2 className="text-2xl font-bold text-slate-900">Timetable Management</h2>
        <p className="mt-1 text-slate-600">
          Create / update timetable entries, assign subjects and teachers, and prevent class-slot conflicts.
        </p>
        {error && <p className="mt-3 text-sm font-semibold text-red-600">{error}</p>}
      </section>

      <div className="grid gap-6 lg:grid-cols-5">
        <form onSubmit={onSubmit} className="rounded-2xl bg-white p-6 shadow lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-900">{editingId ? 'Update Entry' : 'Add Entry'}</h3>
          <div className="mt-4 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <select
                value={form.dayOfWeek}
                onChange={(e) => setForm((f) => ({ ...f, dayOfWeek: e.target.value }))}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                {days.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
              <select
                value={form.slot}
                onChange={(e) => setForm((f) => ({ ...f, slot: e.target.value }))}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                {slots.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                value={form.className}
                onChange={(e) => setForm((f) => ({ ...f, className: e.target.value }))}
                placeholder="Class (e.g., 10th)"
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                required
              />
              <input
                value={form.section}
                onChange={(e) => setForm((f) => ({ ...f, section: e.target.value }))}
                placeholder="Section (e.g., A)"
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <input
              value={form.subject}
              onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
              placeholder="Subject"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              required
            />
            <input
              value={form.teacherName}
              onChange={(e) => setForm((f) => ({ ...f, teacherName: e.target.value }))}
              placeholder="Teacher name"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              required
            />

            <div className="flex gap-2">
              <button
                disabled={saving}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={reset}
                className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-300"
              >
                Clear
              </button>
            </div>
          </div>
        </form>

        <section className="rounded-2xl bg-white p-6 shadow lg:col-span-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-slate-900">Class Schedules</h3>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search timetable..."
              className="w-full max-w-sm rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          {loading ? (
            <p className="mt-4 text-sm text-slate-600">Loading...</p>
          ) : (
            <div className="mt-4 overflow-auto">
              <table className="w-full min-w-[860px] text-left text-sm">
                <thead className="text-xs uppercase text-slate-500">
                  <tr>
                    <th className="py-2">Day</th>
                    <th className="py-2">Class</th>
                    <th className="py-2">Section</th>
                    <th className="py-2">Slot</th>
                    <th className="py-2">Subject</th>
                    <th className="py-2">Teacher</th>
                    <th className="py-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filtered.map((row) => (
                    <tr key={row.id}>
                      <td className="py-3">{row.dayOfWeek}</td>
                      <td className="py-3">{row.className}</td>
                      <td className="py-3">{row.section || '-'}</td>
                      <td className="py-3">{row.slot}</td>
                      <td className="py-3">{row.subject}</td>
                      <td className="py-3">{row.teacherName}</td>
                      <td className="py-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => startEdit(row)}
                            className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => remove(row)}
                            className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-6 text-center text-slate-500">
                        No timetable entries found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

