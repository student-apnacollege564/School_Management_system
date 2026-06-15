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

function useStudentRecord(activeRole) {
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = () => {
    setLoading(true)
    setError('')
    api
      .listStudents()
      .then((rows) => {
        const match = (rows ?? []).find((s) => s.name?.toLowerCase() === activeRole?.fullName?.toLowerCase())
        setStudent(match ?? null)
      })
      .catch((e) => setError(e?.message ?? 'Failed to load profile'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    refresh()
  }, [activeRole?.fullName])

  return { student, setStudent, loading, error, refresh }
}

export function StudentProfilePage({ activeRole }) {
  const { student, loading, error } = useStudentRecord(activeRole)

  return (
    <Card title="View Profile">
      {loading ? (
        <p className="text-slate-600">Loading profile...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : student ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <p><span className="font-semibold">Name:</span> {student.name}</p>
          <p><span className="font-semibold">Class:</span> {student.grade}</p>
          <p><span className="font-semibold">Section:</span> {student.section || '-'}</p>
          <p><span className="font-semibold">Age:</span> {student.age}</p>
          <p><span className="font-semibold">Contact:</span> {student.contact || '-'}</p>
          <p><span className="font-semibold">Address:</span> {student.address || '-'}</p>
          <p><span className="font-semibold">Status:</span> {student.active ? 'Active' : 'Inactive'}</p>
        </div>
      ) : (
        <p className="text-slate-600">No student profile found for this login name.</p>
      )}
    </Card>
  )
}

export function StudentTimetablePage() {
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

export function StudentAttendancePage() {
  const monthly = [
    { month: 'Jan', present: 22, total: 24 },
    { month: 'Feb', present: 20, total: 22 },
    { month: 'Mar', present: 23, total: 24 },
  ]
  return (
    <Card title="View Attendance">
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

export function StudentResultsPage({ activeRole }) {
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
        <table className="w-full min-w-[500px] text-left text-sm">
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
      <p className="mt-4 text-slate-700"><span className="font-semibold">Overall Performance:</span> {average}%</p>
      <p className="text-sm text-slate-500">Student: {activeRole?.fullName}</p>
    </Card>
  )
}

export function StudentAssignmentsPage() {
  const [subject, setSubject] = useState('Mathematics')
  const [title, setTitle] = useState('')
  const [submitted, setSubmitted] = useState([])

  return (
    <Card title="Submit Assignments">
      <form
        className="grid gap-3 rounded-xl border border-slate-200 p-4 sm:grid-cols-3"
        onSubmit={(e) => {
          e.preventDefault()
          if (!title.trim()) return
          setSubmitted((old) => [{ id: Date.now(), subject, title: title.trim(), date: new Date().toLocaleString() }, ...old])
          setTitle('')
        }}
      >
        <select value={subject} onChange={(e) => setSubject(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
          <option>Mathematics</option><option>Science</option><option>English</option><option>Computer</option>
        </select>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Assignment title" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Submit</button>
      </form>

      <div className="mt-4 space-y-2">
        {submitted.length === 0 ? (
          <p className="text-slate-500">No assignments submitted yet.</p>
        ) : (
          submitted.map((s) => (
            <div key={s.id} className="rounded-lg bg-slate-50 px-4 py-3 text-sm">
              <span className="font-semibold">{s.subject}</span> - {s.title}
              <div className="text-xs text-slate-500">Submitted at {s.date}</div>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}

export function StudentDownloadResultPage({ activeRole }) {
  const download = () => {
    const text = `Result Card\nStudent: ${activeRole?.fullName ?? 'Student'}\nClass: 10th\nOverall: 86%\nStatus: Pass`
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'result-card.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card title="Download Result">
      <p className="text-slate-600">Download your latest result card.</p>
      <button onClick={download} className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
        Download Result
      </button>
    </Card>
  )
}

export function StudentNoticesPage() {
  const notices = [
    'Unit test schedule starts next Monday.',
    'School annual day practice at 2 PM.',
    'Submit pending assignment by Friday.',
  ]
  return (
    <Card title="View Notices">
      <ul className="list-disc space-y-2 pl-5 text-slate-700">
        {notices.map((n) => <li key={n}>{n}</li>)}
      </ul>
    </Card>
  )
}

export function StudentUpdateProfilePage({ activeRole }) {
  const { student, loading, error, refresh } = useStudentRecord(activeRole)
  const [form, setForm] = useState({ contact: '', address: '' })
  const [status, setStatus] = useState('')

  useEffect(() => {
    if (student) setForm({ contact: student.contact ?? '', address: student.address ?? '' })
  }, [student])

  if (loading) return <Card title="Update Profile"><p>Loading profile...</p></Card>
  if (error) return <Card title="Update Profile"><p className="text-red-600">{error}</p></Card>
  if (!student) return <Card title="Update Profile"><p className="text-slate-600">No student profile found to update.</p></Card>

  return (
    <Card title="Update Profile">
      <form
        className="max-w-xl space-y-3"
        onSubmit={async (e) => {
          e.preventDefault()
          setStatus('')
          try {
            await api.updateStudent(student.id, { ...student, contact: form.contact, address: form.address })
            setStatus('Profile updated successfully.')
            refresh()
          } catch (err) {
            setStatus(err?.message ?? 'Update failed')
          }
        }}
      >
        <input value={form.contact} onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))} placeholder="Contact" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        <textarea value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} placeholder="Address" className="h-24 w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Save Changes</button>
      </form>
      {status && <p className="mt-3 text-sm font-medium text-slate-700">{status}</p>}
    </Card>
  )
}

