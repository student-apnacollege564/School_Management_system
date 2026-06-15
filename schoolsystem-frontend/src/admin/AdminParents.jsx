import { useEffect, useMemo, useState } from 'react'
import { api } from '../api.js'

const empty = { name: '', contact: '', address: '', studentId: '', active: true }

function normalizeParent(form) {
  const studentIdNum = form.studentId === '' ? null : Number(form.studentId)
  return {
    name: form.name.trim(),
    contact: form.contact.trim(),
    address: form.address.trim(),
    active: !!form.active,
    studentId: Number.isFinite(studentIdNum) ? studentIdNum : null,
  }
}

export function AdminParents() {
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
    return rows.filter((p) => `${p.name} ${p.contact} ${p.address} ${p.studentId ?? ''}`.toLowerCase().includes(q))
  }, [rows, query])

  const refresh = () => {
    setLoading(true)
    setError('')
    api
      .listParents()
      .then((data) => setRows(Array.isArray(data) ? data : []))
      .catch((e) => setError(e?.message ?? 'Failed to load parents'))
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
      contact: row.contact ?? '',
      address: row.address ?? '',
      studentId: row.studentId ?? '',
      active: row.active ?? true,
    })
  }

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    const payload = normalizeParent(form)
    try {
      if (editing?.id) await api.updateParent(editing.id, payload)
      else await api.createParent(payload)
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
    if (!confirm(`Delete parent "${row.name}"?`)) return
    setError('')
    try {
      await api.deleteParent(row.id)
      refresh()
    } catch (err) {
      setError(err?.message ?? 'Delete failed')
    }
  }

  const toggleActive = async (row) => {
    if (!row?.id) return
    setError('')
    try {
      await api.updateParent(row.id, { ...row, active: !row.active })
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
            <h2 className="text-2xl font-bold text-slate-900">Parent Management</h2>
            <p className="mt-1 text-slate-600">Add / Edit / Delete parents, link to student IDs, and activate/deactivate access.</p>
          </div>
          <button onClick={startAdd} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
            New Parent
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search parents..."
            className="w-full max-w-md rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          {error && <span className="text-sm font-medium text-red-600">{error}</span>}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <form onSubmit={submit} className="rounded-2xl bg-white p-6 shadow lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-900">{editing ? 'Edit Parent' : 'Add Parent'}</h3>
          <div className="mt-4 space-y-3">
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Parent name"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              required
            />
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
            <input
              value={form.studentId}
              onChange={(e) => setForm((f) => ({ ...f, studentId: e.target.value }))}
              placeholder="Linked student ID (optional)"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />

            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <input type="checkbox" checked={!!form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} />
              Active
            </label>

            <button
              disabled={saving}
              className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-60"
            >
              {saving ? 'Saving...' : editing ? 'Update Parent' : 'Create Parent'}
            </button>
          </div>
        </form>

        <div className="rounded-2xl bg-white p-6 shadow lg:col-span-3">
          <h3 className="text-lg font-bold text-slate-900">Parents</h3>
          {loading ? (
            <p className="mt-4 text-sm text-slate-600">Loading...</p>
          ) : (
            <div className="mt-4 overflow-auto">
              <table className="w-full min-w-[860px] text-left text-sm">
                <thead className="text-xs uppercase text-slate-500">
                  <tr>
                    <th className="py-2">Name</th>
                    <th className="py-2">Contact</th>
                    <th className="py-2">Student ID</th>
                    <th className="py-2">Status</th>
                    <th className="py-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filtered.map((row) => (
                    <tr key={row.id} className="align-top">
                      <td className="py-3 font-semibold text-slate-900">{row.name}</td>
                      <td className="py-3 text-slate-700">{row.contact ?? ''}</td>
                      <td className="py-3 text-slate-700">{row.studentId ?? ''}</td>
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
                            className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
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
                      <td colSpan={5} className="py-6 text-center text-slate-500">
                        No parents found.
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

