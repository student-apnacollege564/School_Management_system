import { NavLink, Outlet, useNavigate } from 'react-router-dom'

const navItems = [
  { to: '/dashboard/student', label: 'View Profile' },
  { to: '/dashboard/student/timetable', label: 'View Timetable' },
  { to: '/dashboard/student/attendance', label: 'View Attendance' },
  { to: '/dashboard/student/results', label: 'View Marks & Results' },
  { to: '/dashboard/student/assignments', label: 'Submit Assignments' },
  { to: '/dashboard/student/download-result', label: 'Download Result' },
  { to: '/dashboard/student/notices', label: 'View Notices' },
  { to: '/dashboard/student/update-profile', label: 'Update Profile' },
]

export function StudentLayout({ activeRole, onLogout }) {
  const navigate = useNavigate()

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <aside className="rounded-2xl bg-blue-900 p-5 text-blue-50 shadow-lg">
        <div>
          <div className="text-sm font-semibold text-blue-100">Student Dashboard</div>
          <div className="mt-1 text-lg font-bold text-white">{activeRole?.fullName ?? 'Student'}</div>
        </div>
        <button
          className="mt-4 rounded-lg bg-blue-800 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
          onClick={() => {
            onLogout?.()
            navigate('/login/student')
          }}
        >
          Logout
        </button>

        <nav className="mt-5 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dashboard/student'}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 text-sm font-medium ${
                  isActive ? 'bg-blue-700 text-white' : 'text-blue-100 hover:bg-blue-800 hover:text-white'
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

