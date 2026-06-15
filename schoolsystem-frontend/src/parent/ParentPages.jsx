import { useEffect, useMemo, useState } from 'react'
import { api } from '../api.js'

function Card({ title, children }) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow">
      <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  )
}

function useChildData(activeRole) {
  const [child, setChild] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const [parents, students] = await Promise.all([api.listParents(), api.listStudents()])
        const parent = (parents ?? []).find((p) => p.name?.toLowerCase() === activeRole?.fullName?.toLowerCase())
        let linked = null
        if (parent?.studentId) {
          linked = (students ?? []).find((s) => s.id === parent.studentId) ?? null
        }
        if (!linked) {
          // Fallback for demo when parent-student link is absent.
          linked = (students ?? [])[0] ?? null
        }
        if (!cancelled) setChild(linked)
      } catch (e) {
        if (!cancelled) setError(e?.message ?? 'Failed to load child profile')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [activeRole?.fullName])

  return { child, loading, error }
}

export function ParentChildProfilePage({ activeRole }) {
  const { child, loading, error } = useChildData(activeRole)
  return (
    <Card title="View Child Profile">
      {loading ? (
        <p className="text-slate-600">Loading child profile...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : child ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <p><span className="font-semibold">Name:</span> {child.name}</p>
          <p><span className="font-semibold">Class:</span> {child.grade}</p>
          <p><span className="font-semibold">Section:</span> {child.section || '-'}</p>
          <p><span className="font-semibold">Age:</span> {child.age}</p>
          <p><span className="font-semibold">Contact:</span> {child.contact || '-'}</p>
          <p><span className="font-semibold">Address:</span> {child.address || '-'}</p>
          <p><span className="font-semibold">Status:</span> {child.active ? 'Active' : 'Inactive'}</p>
        </div>
      ) : (
        <p className="text-slate-600">No child record found.</p>
      )}
    </Card>
  )
}

export function ParentChildAttendancePage() {
  const monthly = [
    { month: 'Jan', present: 22, total: 24 },
    { month: 'Feb', present: 20, total: 22 },
    { month: 'Mar', present: 23, total: 24 },
  ]
  return (
    <Card title="View Child Attendance">
      <div className="grid gap-3 sm:grid-cols-3">
        {monthly.map((m) => (
          <div key={m.month} className="rounded-xl border border-slate-200 p-4">
            <p className="font-semibold">{m.month}</p>
            <p className="text-slate-700">{m.present}/{m.total} days</p>
            <p className="text-sm text-slate-500">{Math.round((m.present / m.total) * 100)}% attendance</p>
          </div>
        ))}
      </div>
    </Card>
  )
}

export function ParentChildResultsPage() {
  const marks = [
    { subject: 'Mathematics', marks: 88 },
    { subject: 'Science', marks: 84 },
    { subject: 'English', marks: 90 },
    { subject: 'Computer', marks: 92 },
    { subject: 'History', marks: 76 },
  ]
  const average = useMemo(() => Math.round(marks.reduce((a, b) => a + b.marks, 0) / marks.length), [marks])

  return (
    <Card title="View Marks & Results">
      <div className="overflow-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="text-xs uppercase text-slate-500">
            <tr><th>Subject</th><th>Marks</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {marks.map((m) => (
              <tr key={m.subject}><td className="py-3">{m.subject}</td><td className="py-3 font-semibold">{m.marks}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-slate-700"><span className="font-semibold">Overall:</span> {average}%</p>
    </Card>
  )
}

export function ParentTimetablePage() {
  const rows = [
    ['Monday', 'Math', 'Science', 'English', 'Computer'],
    ['Tuesday', 'English', 'Math', 'History', 'Physics'],
    ['Wednesday', 'Science', 'Computer', 'Math', 'Sports'],
    ['Thursday', 'Biology', 'English', 'Chemistry', 'Math'],
    ['Friday', 'Physics', 'Math', 'Civics', 'Computer'],
  ]
  return (
    <Card title="View Timetable">
      <div className="overflow-auto">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="text-xs uppercase text-slate-500">
            <tr><th>Day</th><th>Period 1</th><th>Period 2</th><th>Period 3</th><th>Period 4</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {rows.map((r) => (
              <tr key={r[0]}>{r.map((c) => <td key={c} className="py-3">{c}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export function ParentNoticesPage() {
  const notices = [
    'Parent-Teacher Meeting this Saturday at 10 AM.',
    'Monthly attendance report is available.',
    'Fee reminder: Last date is 10th of this month.',
  ]
  return (
    <Card title="View Notice">
      <ul className="list-disc space-y-2 pl-5 text-slate-700">
        {notices.map((n) => <li key={n}>{n}</li>)}
      </ul>
    </Card>
  )
}

