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

function useStudents() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .listStudents()
      .then((rows) => setStudents(Array.isArray(rows) ? rows : []))
      .catch((e) => setError(e?.message ?? 'Failed to load students'))
      .finally(() => setLoading(false))
  }, [])

  return { students, loading, error }
}

export function TeacherAttendancePage() {
  const { students, loading, error } = useStudents()
  const [attendance, setAttendance] = useState({})

  const presentCount = useMemo(
    () => Object.values(attendance).filter((v) => v === 'present').length,
    [attendance],
  )

  return (
    <Card title="Mark Attendance">
      {loading ? (
        <p className="text-slate-600">Loading students...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <>
          <div className="overflow-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="text-xs uppercase text-slate-500">
                <tr><th>Name</th><th>Class</th><th>Section</th><th>Status</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {students.map((s) => (
                  <tr key={s.id}>
                    <td className="py-3 font-medium">{s.name}</td>
                    <td className="py-3">{s.grade}</td>
                    <td className="py-3">{s.section || '-'}</td>
                    <td className="py-3">
                      <select
                        className="rounded-md border border-slate-300 px-2 py-1"
                        value={attendance[s.id] ?? ''}
                        onChange={(e) => setAttendance((old) => ({ ...old, [s.id]: e.target.value }))}
                      >
                        <option value="">Select</option>
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-slate-700">Marked present: {presentCount} / {students.length}</p>
        </>
      )}
    </Card>
  )
}

export function TeacherMarksPage() {
  const { students, loading, error } = useStudents()
  const [marks, setMarks] = useState({})

  return (
    <Card title="Upload / Update Marks">
      {loading ? (
        <p className="text-slate-600">Loading students...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="space-y-3">
          {students.map((s) => (
            <div key={s.id} className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 p-3">
              <div className="min-w-56 font-medium text-slate-800">{s.name}</div>
              <input
                type="number"
                min={0}
                max={100}
                value={marks[s.id] ?? ''}
                onChange={(e) => setMarks((old) => ({ ...old, [s.id]: e.target.value }))}
                placeholder="Marks"
                className="w-32 rounded-md border border-slate-300 px-3 py-1.5"
              />
              <span className="text-xs text-slate-500">out of 100</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}

export function TeacherStudentListPage() {
  const { students, loading, error } = useStudents()
  return (
    <Card title="View Student List">
      {loading ? (
        <p className="text-slate-600">Loading students...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="overflow-auto">
          <table className="w-full min-w-[780px] text-left text-sm">
            <thead className="text-xs uppercase text-slate-500">
              <tr><th>Name</th><th>Class</th><th>Section</th><th>Contact</th><th>Status</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {students.map((s) => (
                <tr key={s.id}>
                  <td className="py-3 font-semibold text-slate-900">{s.name}</td>
                  <td className="py-3">{s.grade}</td>
                  <td className="py-3">{s.section || '-'}</td>
                  <td className="py-3">{s.contact || '-'}</td>
                  <td className="py-3">{s.active ? 'Active' : 'Inactive'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}

export function TeacherAssignmentsPage() {
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState('Mathematics')
  const [uploads, setUploads] = useState([])

  return (
    <Card title="Upload Assignments">
      <form
        className="grid gap-3 rounded-xl border border-slate-200 p-4 sm:grid-cols-3"
        onSubmit={(e) => {
          e.preventDefault()
          if (!title.trim()) return
          setUploads((old) => [{ id: Date.now(), subject, title: title.trim(), date: new Date().toLocaleString() }, ...old])
          setTitle('')
        }}
      >
        <select value={subject} onChange={(e) => setSubject(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
          <option>Mathematics</option><option>Science</option><option>English</option><option>Computer</option>
        </select>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Assignment title" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Upload</button>
      </form>

      <div className="mt-4 space-y-2">
        {uploads.length === 0 ? (
          <p className="text-slate-500">No assignments uploaded yet.</p>
        ) : (
          uploads.map((u) => (
            <div key={u.id} className="rounded-lg bg-slate-50 px-4 py-3 text-sm">
              <span className="font-semibold">{u.subject}</span> - {u.title}
              <div className="text-xs text-slate-500">Uploaded at {u.date}</div>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}

export function TeacherTimetablePage() {
  const rows = [
    ['Monday', '10th-A Math', '9th-A Science', '11th-B Math', 'Free'],
    ['Tuesday', '10th-A Math', '8th-C Math', '9th-A Science', 'PTM'],
    ['Wednesday', '11th-B Math', '10th-A Math', '8th-C Math', 'Remedial'],
    ['Thursday', '9th-A Science', '11th-B Math', '10th-A Math', 'Free'],
    ['Friday', '8th-C Math', '10th-A Math', '11th-B Math', 'Lab'],
  ]
  return (
    <Card title="View Timetable">
      <div className="overflow-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="text-xs uppercase text-slate-500">
            <tr><th>Day</th><th>P1</th><th>P2</th><th>P3</th><th>P4</th></tr>
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

export function TeacherAssignedClassesPage() {
  return (
    <Card title="View Assigned Classes">
      <div className="grid gap-3 sm:grid-cols-3">
        {['10th-A', '9th-A', '11th-B'].map((cls) => (
          <div key={cls} className="rounded-xl border border-slate-200 p-4">
            <p className="text-lg font-bold text-slate-900">{cls}</p>
            <p className="mt-1 text-sm text-slate-600">Subject: Mathematics / Science</p>
          </div>
        ))}
      </div>
    </Card>
  )
}

export function TeacherNoticesPage() {
  const [text, setText] = useState('')
  const [sent, setSent] = useState([])
  return (
    <Card title="Send Notices">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (!text.trim()) return
          setSent((old) => [{ id: Date.now(), text: text.trim(), date: new Date().toLocaleString() }, ...old])
          setText('')
        }}
      >
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write notice..."
          className="h-28 w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <button className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Send Notice</button>
      </form>

      <div className="mt-4 space-y-2">
        {sent.length === 0 ? (
          <p className="text-slate-500">No notices sent yet.</p>
        ) : (
          sent.map((n) => (
            <div key={n.id} className="rounded-lg bg-slate-50 px-4 py-3 text-sm">
              {n.text}
              <div className="text-xs text-slate-500">Sent at {n.date}</div>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}

export function TeacherAttendancePercentPage() {
  const [present, setPresent] = useState('')
  const [total, setTotal] = useState('')
  const percent = useMemo(() => {
    const p = Number(present)
    const t = Number(total)
    if (!Number.isFinite(p) || !Number.isFinite(t) || t <= 0) return null
    return ((p / t) * 100).toFixed(2)
  }, [present, total])

  return (
    <Card title="Calculate % Student Attendance">
      <div className="grid max-w-md gap-3 sm:grid-cols-2">
        <input type="number" min={0} placeholder="Present days" value={present} onChange={(e) => setPresent(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        <input type="number" min={1} placeholder="Total days" value={total} onChange={(e) => setTotal(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
      </div>
      <p className="mt-4 text-slate-700">{percent === null ? 'Enter valid values to calculate.' : `Attendance Percentage: ${percent}%`}</p>
    </Card>
  )
}

export function TeacherExamPercentPage() {
  const [marks, setMarks] = useState('')
  const [max, setMax] = useState('')
  const percent = useMemo(() => {
    const m = Number(marks)
    const x = Number(max)
    if (!Number.isFinite(m) || !Number.isFinite(x) || x <= 0) return null
    return ((m / x) * 100).toFixed(2)
  }, [marks, max])

  return (
    <Card title="Calculate % Student Exam">
      <div className="grid max-w-md gap-3 sm:grid-cols-2">
        <input type="number" min={0} placeholder="Obtained marks" value={marks} onChange={(e) => setMarks(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        <input type="number" min={1} placeholder="Maximum marks" value={max} onChange={(e) => setMax(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
      </div>
      <p className="mt-4 text-slate-700">{percent === null ? 'Enter valid values to calculate.' : `Exam Percentage: ${percent}%`}</p>
    </Card>
  )
}

