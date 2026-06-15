import { useEffect, useMemo, useState } from 'react'
import { api } from '../api.js'

const empty = { name: '', subject: '', assignedClass: '', contact: '', address: '', active: true }

function normalizeTeacher(form) {
  return {
    name: form.name.trim(),
    subject: form.subject.trim(),
    assignedClass: form.assignedClass.trim(),
    contact: form.contact.trim(),
    address: form.address.trim(),
    active: !!form.active,
  }
}

export function AdminTeachers() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((t) => `${t.name} ${t.subject} ${t.assignedClass} ${t.contact} ${t.address}`.toLowerCase().includes(q))
  }, [rows, query])

  const refresh = () => {
    setLoading(true)
    setError('')
    api
      .listTeachers()
      .then((data) => setRows(Array.isArray(data) ? data : []))
      .catch((e) => setError(e?.message ?? 'Failed to load teachers'))
      .finally(() => setLoading(false))
  }

  useEffect(() => refresh(), [])

  const startAdd = () => {
    setEditing(null)
    setForm(empty)
  }

  const startEdit = (row) => {
    setEditing(row)
    setForm({
      name: row.name ?? '',
      subject: row.subject ?? '',
      assignedClass: row.assignedClass ?? '',
      contact: row.contact ?? '',
      address: row.address ?? '',
      active: row.active ?? true,
    })
  }

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    const payload = normalizeTeacher(form)
    try {
      if (editing?.id) await api.updateTeacher(editing.id, payload)
      else await api.createTeacher(payload)
      startAdd()
      refresh()
    } catch (err) {
      setError(err?.message ?? 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (row) => {
    if (!row?.id) return
    if (!confirm(`Delete teacher "${row.name}"?`)) return
    setError('')
    try {
      await api.deleteTeacher(row.id)
      refresh()
    } catch (err) {
      setError(err?.message ?? 'Delete failed')
    }
  }

  const toggleActive = async (row) => {
    if (!row?.id) return
    setError('')
    try {
      await api.updateTeacher(row.id, { ...row, active: !row.active })
      refresh()
    } catch (err) {
      setError(err?.message ?? 'Update failed')
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Teacher Management</h2>
            <p className="mt-1 text-slate-600">Add / Edit / Delete teachers, assign subjects/classes, and set status.</p>
          </div>
          <button onClick={startAdd} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700">
            New Teacher
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search teachers..."
            className="w-full max-w-md rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          {error && <span className="text-sm font-medium text-red-600">{error}</span>}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <form onSubmit={submit} className="rounded-2xl bg-white p-6 shadow lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-900">{editing ? 'Edit Teacher' : 'Add Teacher'}</h3>
          <div className="mt-4 space-y-3">
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Teacher name"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              required
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                value={form.subject}
                onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                placeholder="Subject"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                required
              />
              <input
                value={form.assignedClass}
                onChange={(e) => setForm((f) => ({ ...f, assignedClass: e.target.value }))}
                placeholder="Assigned class (e.g., 10th-A)"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <input
              value={form.contact}
              onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))}
              placeholder="Contact"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            <textarea
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              placeholder="Address"
              className="h-24 w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />

            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <input type="checkbox" checked={!!form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} />
              Active
            </label>

            <button
              disabled={saving}
              className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {saving ? 'Saving...' : editing ? 'Update Teacher' : 'Create Teacher'}
            </button>
          </div>
        </form>

        <div className="rounded-2xl bg-white p-6 shadow lg:col-span-3">
          <h3 className="text-lg font-bold text-slate-900">Teachers</h3>
          {loading ? (
            <p className="mt-4 text-sm text-slate-600">Loading...</p>
          ) : (
            <div className="mt-4 overflow-auto">
              <table className="w-full min-w-[860px] text-left text-sm">
                <thead className="text-xs uppercase text-slate-500">
                  <tr>
                    <th className="py-2">Name</th>
                    <th className="py-2">Subject</th>
                    <th className="py-2">Class</th>
                    <th className="py-2">Contact</th>
                    <th className="py-2">Status</th>
                    <th className="py-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filtered.map((row) => (
                    <tr key={row.id} className="align-top">
                      <td className="py-3 font-semibold text-slate-900">{row.name}</td>
                      <td className="py-3 text-slate-700">{row.subject}</td>
                      <td className="py-3 text-slate-700">{row.assignedClass ?? ''}</td>
                      <td className="py-3 text-slate-700">{row.contact ?? ''}</td>
                      <td className="py-3">
                        <button
                          onClick={() => toggleActive(row)}
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            row.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {row.active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
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
                      <td colSpan={6} className="py-6 text-center text-slate-500">
                        No teachers found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

