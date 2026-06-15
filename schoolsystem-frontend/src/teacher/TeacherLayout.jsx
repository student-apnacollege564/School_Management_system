import { NavLink, Outlet, useNavigate } from 'react-router-dom'

const navItems = [
  { to: '/dashboard/teacher', label: 'Mark Attendance' },
  { to: '/dashboard/teacher/marks', label: 'Upload / Update Marks' },
  { to: '/dashboard/teacher/students', label: 'View Student List' },
  { to: '/dashboard/teacher/assignments', label: 'Upload Assignments' },
  { to: '/dashboard/teacher/timetable', label: 'View Timetable' },
  { to: '/dashboard/teacher/classes', label: 'View Assigned Classes' },
  { to: '/dashboard/teacher/notices', label: 'Send Notices' },
  { to: '/dashboard/teacher/attendance-percent', label: 'Attendance %' },
  { to: '/dashboard/teacher/exam-percent', label: 'Exam %' },
]

export function TeacherLayout({ activeRole, onLogout }) {
  const navigate = useNavigate()

  return (
    <div className="grid gap-6 lg:grid-cols-[270px_1fr]">
      <aside className="rounded-2xl bg-indigo-900 p-5 text-indigo-50 shadow-lg">
        <div>
          <div className="text-sm font-semibold text-indigo-100">Teacher Dashboard</div>
          <div className="mt-1 text-lg font-bold text-white">{activeRole?.fullName ?? 'Teacher'}</div>
        </div>
        <button
          className="mt-4 rounded-lg bg-indigo-800 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
          onClick={() => {
            onLogout?.()
            navigate('/login/teacher')
          }}
        >
          Logout
        </button>

        <nav className="mt-5 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dashboard/teacher'}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 text-sm font-medium ${
                  isActive ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:bg-indigo-800 hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <section>
        <Outlet />
      </section>
    </div>
  )
}

