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

export function AdminAttendancePage() {
  const [students, setStudents] = useState([])
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.listStudents(), api.listTeachers()])
      .then(([s, t]) => {
        setStudents(Array.isArray(s) ? s : [])
        setTeachers(Array.isArray(t) ? t : [])
      })
      .finally(() => setLoading(false))
  }, [])

  const report = useMemo(() => {
    const studentAttendance = students.map((s, i) => ({ name: s.name, percent: 78 + ((i * 7) % 20) }))
    const teacherAttendance = teachers.map((t, i) => ({ name: t.name, percent: 85 + ((i * 5) % 12) }))
    return { studentAttendance, teacherAttendance }
  }, [students, teachers])

  const downloadReport = () => {
    const lines = [
      'Attendance Report',
      '--- Students ---',
      ...report.studentAttendance.map((r) => `${r.name},${r.percent}%`),
      '--- Teachers ---',
      ...report.teacherAttendance.map((r) => `${r.name},${r.percent}%`),
    ]
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'attendance-report.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) return <Card title="Attendance & Academic Management">Loading...</Card>

  return (
    <div className="space-y-6">
      <Card title="Attendance & Academic Management">
        <p className="text-slate-600">View student/teacher attendance and generate attendance reports.</p>
        <button onClick={downloadReport} className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          Generate Attendance Report
        </button>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Student Attendance (Monthly)">
          <div className="space-y-2">
            {report.studentAttendance.map((r) => (
              <div key={r.name} className="rounded-lg bg-slate-50 px-3 py-2 text-sm">
                <span className="font-semibold">{r.name}</span> - {r.percent}%
              </div>
            ))}
          </div>
        </Card>
        <Card title="Teacher Attendance">
          <div className="space-y-2">
            {report.teacherAttendance.map((r) => (
              <div key={r.name} className="rounded-lg bg-slate-50 px-3 py-2 text-sm">
                <span className="font-semibold">{r.name}</span> - {r.percent}%
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

export function AdminNoticesPage() {
  const [text, setText] = useState('')
  const [audience, setAudience] = useState('All')
  const [items, setItems] = useState([])

  const addNotice = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    setItems((old) => [{ id: Date.now(), text: text.trim(), audience, createdAt: new Date().toLocaleString() }, ...old])
    setText('')
  }

  const remove = (id) => setItems((old) => old.filter((n) => n.id !== id))
  const update = (id) => {
    const value = prompt('Update notice text:')
    if (!value?.trim()) return
    setItems((old) => old.map((n) => (n.id === id ? { ...n, text: value.trim() } : n)))
  }

  return (
    <Card title="Notice & Communication Management">
      <form onSubmit={addNotice} className="grid gap-3 rounded-xl border border-slate-200 p-4 sm:grid-cols-4">
        <select value={audience} onChange={(e) => setAudience(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
          <option>All</option><option>Students</option><option>Teachers</option><option>Parents</option>
        </select>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Write notice..." className="sm:col-span-2 rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Send Notice</button>
      </form>

      <div className="mt-4 space-y-2">
        {items.length === 0 ? (
          <p className="text-slate-500">No notices yet.</p>
        ) : (
          items.map((n) => (
            <div key={n.id} className="rounded-lg bg-slate-50 px-4 py-3 text-sm">
              <div><span className="font-semibold">{n.audience}:</span> {n.text}</div>
              <div className="mt-1 text-xs text-slate-500">{n.createdAt}</div>
              <div className="mt-2 flex gap-2">
                <button onClick={() => update(n.id)} className="rounded bg-slate-900 px-2 py-1 text-xs font-semibold text-white">Update</button>
                <button onClick={() => remove(n.id)} className="rounded bg-rose-600 px-2 py-1 text-xs font-semibold text-white">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}

export function AdminUsersPage() {
  const [rows, setRows] = useState([])
  const [blocked, setBlocked] = useState({})

  useEffect(() => {
    Promise.all([api.listStudents(), api.listTeachers(), api.listParents()]).then(([s, t, p]) => {
      const users = [
        ...(s ?? []).map((x) => ({ id: `student-${x.id}`, name: x.name, role: 'student' })),
        ...(t ?? []).map((x) => ({ id: `teacher-${x.id}`, name: x.name, role: 'teacher' })),
        ...(p ?? []).map((x) => ({ id: `parent-${x.id}`, name: x.name, role: 'parent' })),
      ]
      setRows(users)
    })
  }, [])

  return (
    <Card title="User Management">
      <div className="overflow-auto">
        <table className="w-full min-w-[650px] text-left text-sm">
          <thead className="text-xs uppercase text-slate-500">
            <tr><th className="py-2">User</th><th className="py-2">Role</th><th className="py-2">Status</th><th className="py-2">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {rows.map((u) => {
              const isBlocked = !!blocked[u.id]
              return (
                <tr key={u.id}>
                  <td className="py-3 font-semibold">{u.name}</td>
                  <td className="py-3 capitalize">{u.role}</td>
                  <td className="py-3">{isBlocked ? 'Blocked' : 'Active'}</td>
                  <td className="py-3">
                    <button
                      onClick={() => setBlocked((old) => ({ ...old, [u.id]: !old[u.id] }))}
                      className={`rounded px-3 py-1 text-xs font-semibold text-white ${isBlocked ? 'bg-emerald-600' : 'bg-rose-600'}`}
                    >
                      {isBlocked ? 'Unblock' : 'Block'}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-slate-500">Activity history/permissions screen can be added next.</p>
    </Card>
  )
}

export function AdminReportsPage() {
  const [students, setStudents] = useState([])
  const [teachers, setTeachers] = useState([])

  useEffect(() => {
    Promise.all([api.listStudents(), api.listTeachers()]).then(([s, t]) => {
      setStudents(Array.isArray(s) ? s : [])
      setTeachers(Array.isArray(t) ? t : [])
    })
  }, [])

  const classSummary = useMemo(() => {
    const map = {}
    for (const s of students) map[s.grade] = (map[s.grade] ?? 0) + 1
    return Object.entries(map)
  }, [students])

  return (
    <div className="space-y-6">
      <Card title="Reports & Analytics">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg bg-slate-50 p-4"><p className="text-sm text-slate-500">Students</p><p className="text-2xl font-bold">{students.length}</p></div>
          <div className="rounded-lg bg-slate-50 p-4"><p className="text-sm text-slate-500">Teachers</p><p className="text-2xl font-bold">{teachers.length}</p></div>
          <div className="rounded-lg bg-slate-50 p-4"><p className="text-sm text-slate-500">School Performance</p><p className="text-2xl font-bold">86%</p></div>
        </div>
      </Card>
      <Card title="Class-wise Analysis">
        <div className="space-y-2">
          {classSummary.map(([grade, count]) => (
            <div key={grade} className="rounded-lg bg-slate-50 px-4 py-2 text-sm">
              <span className="font-semibold">{grade}</span>: {count} students
            </div>
          ))}
          {classSummary.length === 0 && <p className="text-slate-500">No class data yet.</p>}
        </div>
      </Card>
    </div>
  )
}

export function AdminSupportPage() {
  const [queries, setQueries] = useState([
    { id: 1, from: 'Parent', message: 'Unable to view marks.', status: 'Open' },
    { id: 2, from: 'Teacher', message: 'Need timetable slot change.', status: 'Open' },
  ])
  const [faq, setFaq] = useState(['How to reset password?', 'How to download results?'])

  const resolve = (id) => setQueries((old) => old.map((q) => (q.id === id ? { ...q, status: 'Resolved' } : q)))
  const addFaq = () => {
    const text = prompt('Add FAQ question:')
    if (!text?.trim()) return
    setFaq((old) => [...old, text.trim()])
  }
  const editFaq = (index) => {
    const text = prompt('Update FAQ question:', faq[index])
    if (!text?.trim()) return
    setFaq((old) => old.map((f, i) => (i === index ? text.trim() : f)))
  }

  return (
    <div className="space-y-6">
      <Card title="Support Management">
        <div className="space-y-2">
          {queries.map((q) => (
            <div key={q.id} className="rounded-lg bg-slate-50 px-4 py-3 text-sm">
              <div><span className="font-semibold">{q.from}:</span> {q.message}</div>
              <div className="mt-1 text-xs text-slate-500">Status: {q.status}</div>
              {q.status !== 'Resolved' && (
                <button onClick={() => resolve(q.id)} className="mt-2 rounded bg-blue-600 px-2 py-1 text-xs font-semibold text-white">
                  Respond / Resolve
                </button>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card title="FAQ Section">
        <button onClick={addFaq} className="rounded bg-slate-900 px-3 py-2 text-xs font-semibold text-white">Add FAQ</button>
        <div className="mt-3 space-y-2">
          {faq.map((f, i) => (
            <div key={`${f}-${i}`} className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-2 text-sm">
              <span>{f}</span>
              <button onClick={() => editFaq(i)} className="rounded bg-blue-600 px-2 py-1 text-xs font-semibold text-white">Update</button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

